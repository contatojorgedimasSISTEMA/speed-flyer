require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

const db = new Database('./speedflyer.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    business TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    plan_expires TEXT DEFAULT NULL,
    flyers_used INTEGER DEFAULT 0,
    flyers_reset_at TEXT DEFAULT (date('now')),
    stripe_cus_id TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS flyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT,
    html TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const PLANS = {
  free: { name: 'Gratuito', flyers_month: 0, price_brl: 0 },
  starter: { name: 'Basico', flyers_month: 30, price_brl: 29 },
  pro: { name: 'Pro', flyers_month: -1, price_brl: 90 },
};

const SYSTEM_PROMPT = `Voce e o melhor designer grafico do Brasil especialista em flyers para restaurantes. RESPONDA APENAS com JSON puro: {"mensagem":"texto","html":"HTML completo"}. REGRAS: width:1080px;height:1080px;overflow:hidden no body. Google Fonts via @import. Zero imagens externas. Design profissional com gradientes ricos, tipografia impactante (Bebas Neue 110px+). Inclua todos os dados informados.`;

app.use(cors());
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token necessario' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'sf_dev_secret_2024');
    next();
  } catch { res.status(401).json({ error: 'Token invalido' }); }
}

app.post('/api/auth/register', async (req, res) => {
  const { name, business, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos' });
  if (password.length < 6) return res.status(400).json({ error: 'Senha minimo 6 caracteres' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const info = db.prepare('INSERT INTO users (name, business, email, password) VALUES (?, ?, ?, ?)').run(name, business || '', email, hash);
    const user = db.prepare('SELECT id, name, business, email, plan, flyers_used FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'sf_dev_secret_2024', { expiresIn: '30d' });
    res.json({ user, token });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email ja cadastrado' });
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Preencha email e senha' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(400).json({ error: 'Email ou senha incorretos' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Email ou senha incorretos' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'sf_dev_secret_2024', { expiresIn: '30d' });
  const { password: _, ...safe } = user;
  res.json({ user: safe, token });
});

app.get('/api/user/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, business, email, plan, plan_expires, flyers_used FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });
  res.json(user);
});

app.post('/api/flyer/generate', auth, async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const plan = PLANS[user.plan] || PLANS.free;
  if (plan.flyers_month === 0) return res.status(403).json({ error: 'plano_necessario', message: 'Assine um plano para criar flyers.' });
  if (user.plan_expires && new Date(user.plan_expires) < new Date()) {
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run('free', user.id);
    return res.status(403).json({ error: 'plano_expirado', message: 'Seu plano expirou.' });
  }
  if (plan.flyers_month > 0) {
    const resetAt = new Date(user.flyers_reset_at || 0);
    const now = new Date();
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      db.prepare('UPDATE users SET flyers_used = 0, flyers_reset_at = ? WHERE id = ?').run(now.toISOString().split('T')[0], user.id);
      user.flyers_used = 0;
    }
    if (user.flyers_used >= plan.flyers_month) return res.status(403).json({ error: 'limite_atingido', message: 'Limite mensal atingido!' });
  }
  const { description, imageBase64 } = req.body;
  if (!description) return res.status(400).json({ error: 'Descricao necessaria' });
  try {
    const msgs = imageBase64
      ? [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } }, { type: 'text', text: description }] }]
      : [{ role: 'user', content: description }];
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 6000, system: SYSTEM_PROMPT, messages: msgs })
    });
    const aiData = await aiRes.json();
    if (!aiRes.ok) throw new Error(aiData.error && aiData.error.message ? aiData.error.message : 'Erro na IA');
    const raw = aiData.content && aiData.content[0] ? aiData.content[0].text : '';
    let result;
    try { result = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()); }
    catch (e2) { const m = raw.match(/\{[\s\S]*\}/); if (!m) throw new Error('JSON invalido'); result = JSON.parse(m[0]); }
    const flyerInfo = db.prepare('INSERT INTO flyers (user_id, name, html) VALUES (?, ?, ?)').run(user.id, description.substring(0, 50), result.html);
    db.prepare('UPDATE users SET flyers_used = flyers_used + 1 WHERE id = ?').run(user.id);
    res.json({ mensagem: result.mensagem, html: result.html, flyerId: flyerInfo.lastInsertRowid });
  } catch (e) {
    console.error('Erro:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/flyers', auth, (req, res) => {
  res.json(db.prepare('SELECT id, name, html, created_at FROM flyers WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user.id));
});

app.delete('/api/flyers/:id', auth, (req, res) => {
  db.prepare('DELETE FROM flyers WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

app.post('/api/payment/create-session', auth, async (req, res) => {
  const { plan } = req.body;
  if (!PLANS[plan] || plan === 'free') return res.status(400).json({ error: 'Plano invalido' });
  if (!stripe) {
    const expires = new Date(); expires.setMonth(expires.getMonth() + 1);
    db.prepare('UPDATE users SET plan = ?, plan_expires = ?, flyers_used = 0 WHERE id = ?').run(plan, expires.toISOString(), req.user.id);
    return res.json({ demo: true, message: 'Plano ativado em modo demo por 30 dias!' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], mode: 'subscription',
      line_items: [{ price: plan === 'starter' ? process.env.STRIPE_PRICE_STARTER : process.env.STRIPE_PRICE_PRO, quantity: 1 }],
      customer_email: user.email, metadata: { userId: String(user.id), plan },
      success_url: (process.env.APP_URL || 'http://localhost:3000') + '/?payment=ok&plan=' + plan,
      cancel_url: (process.env.APP_URL || 'http://localhost:3000') + '/?payment=cancel',
    });
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/payment/webhook', (req, res) => { res.json({ ok: true }); });

app.get('/api/admin/users', (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Nao autorizado' });
  res.json(db.prepare('SELECT id, name, email, plan, flyers_used, created_at FROM users ORDER BY created_at DESC').all());
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log('Speed Flyer rodando na porta ' + PORT); });
