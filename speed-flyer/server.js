require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();

// ── Stripe (opcional — só se STRIPE_SECRET_KEY estiver configurada) ──
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// ── Banco de dados ──
const db = new Database('./speedflyer.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    business        TEXT DEFAULT '',
    email           TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,
    plan            TEXT DEFAULT 'free',
    plan_expires    TEXT DEFAULT NULL,
    flyers_used     INTEGER DEFAULT 0,
    flyers_reset_at TEXT DEFAULT (date('now')),
    stripe_cus_id   TEXT DEFAULT NULL,
    created_at      TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS flyers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    name       TEXT,
    html       TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// ── Planos ──
const PLANS = {
  free:    { name: 'Gratuito', flyers_month: 0,  price_brl: 0   },
  starter: { name: 'Básico',   flyers_month: 30, price_brl: 29  },
  pro:     { name: 'Pro',      flyers_month: -1, price_brl: 90  }, // -1 = ilimitado
};

// ── System Prompt da IA ──
const SYSTEM_PROMPT = `Você é o melhor designer gráfico do Brasil, especialista em criar flyers de alto impacto visual para restaurantes, churrascarias, lanchonetes e estabelecimentos alimentícios. Seu trabalho é comparado ao de grandes agências como Crama Design e Base Design.

RESPONDA APENAS com JSON puro neste formato (sem markdown, sem texto fora do JSON):
{"mensagem":"Mensagem animada de 2 frases confirmando o flyer criado","html":"HTML COMPLETO aqui"}

ESPECIFICAÇÕES TÉCNICAS OBRIGATÓRIAS:
- O HTML deve ser 100% auto-contido, sem dependências externas exceto Google Fonts
- Dimensão: exatamente 1080x1080px (body: width:1080px; height:1080px; margin:0; padding:0; overflow:hidden)
- Carregue fontes assim: <style>@import url('https://fonts.googleapis.com/css2?family=NOME:wght@400;700;900&display=swap');</style>

DESIGN DE ALTO IMPACTO — SIGA ESTAS TÉCNICAS:

1. FUNDO RICO E PROFUNDO:
   - Para churrasco: background com múltiplas camadas CSS — ex: linear-gradient(135deg, #0d0000 0%, #1a0500 40%, #2d0a00 70%, #0d0000 100%) com um segundo layer: radial-gradient(ellipse at 30% 20%, rgba(180,60,0,0.4) 0%, transparent 60%)
   - Adicione textura sutil com repeating-linear-gradient em diagonal com opacidade 0.03-0.05
   - Para pizza: verde escuro profundo #0a1a0a com gradientes âmbar
   - Para hamburguer: preto total #000 com detalhes amarelo-dourado vibrante

2. ELEMENTO HERO CENTRAL — OBRIGATÓRIO:
   - Crie uma forma geométrica grande e decorativa usando CSS puro
   - Exemplo para churrasco: um círculo/elipse grande com border, gradiente interno e box-shadow avermelhado
   - Use ::before e ::after com position:absolute para criar camadas de profundidade
   - Bordas brilhantes: border: 1px solid rgba(255,140,0,0.4) com box-shadow: 0 0 40px rgba(255,100,0,0.2), inset 0 0 60px rgba(255,60,0,0.1)

3. TIPOGRAFIA PODEROSA:
   - Fonte principal para títulos: Bebas Neue, Anton, Oswald ou Black Han Sans (todas via Google Fonts)
   - Fonte secundária: Montserrat, DM Sans ou Inter
   - Título principal: font-size mínimo 110px, letter-spacing: -2px a -4px, text-transform: uppercase
   - Subtítulo: font-size 28-36px, letter-spacing: 6-10px, text-transform: uppercase, color com opacidade reduzida
   - Use text-shadow para profundidade: text-shadow: 0 0 60px rgba(255,120,0,0.5), 0 4px 20px rgba(0,0,0,0.8)

4. LINHA DECORATIVA / SEPARADOR:
   - Crie divisores elegantes com gradiente: background: linear-gradient(90deg, transparent, #FF6B00, transparent); height:1px
   - Adicione elementos decorativos: losangos (transform:rotate(45deg)), linhas duplas, pontos

5. LISTA DE ITENS COM ESTILO:
   - Cada item do cardápio deve ter um marcador customizado (círculo colorido, losango, ícone CSS)
   - Font-size 22-28px, espaçamento generoso
   - Itens em 2 colunas se forem muitos (CSS grid)
   - Adicione um container com fundo semi-transparente: background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); border-radius:16px; border: 1px solid rgba(255,255,255,0.08)

6. BADGE / DESTAQUE:
   - Crie um badge chamativo para informações especiais (horário, promoção)
   - Ex: border-radius:50px; background: linear-gradient(135deg, #FF4500, #FF8C00); padding:8px 24px; font-size:18px; text-transform:uppercase; letter-spacing:3px

7. RODAPÉ COM ENDEREÇO:
   - Fundo levemente diferente: background: rgba(0,0,0,0.4)
   - Ícone de localização CSS (círculo + triângulo) ou símbolo ◆
   - Font-size 18-22px, letter-spacing:2px

8. PALETAS POR CATEGORIA:
   - Churrasco/Assados: #0d0000 fundo, #FF4500 #FF8C00 #FFB347 acentos, texto #FFF5E6
   - Pizza/Italiana: #0a1200 fundo, #8B0000 #D4AF37 acentos, texto #FFF8E7
   - Japonês/Sushi: #000005 fundo, #CC0000 #C0A882 acentos, texto #FFFFFF
   - Hamburguer: #0a0a00 fundo, #FFD700 #FF6B00 acentos, texto #FFFFFF
   - Frango: #0d0800 fundo, #D4891A #F0C060 acentos, texto #FFF8E0
   - Padaria/Café: #1a0f00 fundo, #8B6914 #D4A853 acentos, texto #FFF8E7

EXEMPLO DE ESTRUTURA HTML para churrasco (adapte conforme o pedido):
<html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:linear-gradient(135deg,#0d0000 0%,#1a0500 50%,#0d0000 100%);font-family:'Montserrat',sans-serif;position:relative}
.bg-glow{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(200,60,0,0.15) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-60%)}
.container{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:50px 70px 0}
.badge{background:linear-gradient(135deg,#8B0000,#FF4500);color:#fff;padding:8px 28px;border-radius:50px;font-size:13px;letter-spacing:5px;text-transform:uppercase;margin-bottom:10px}
.title{font-family:'Bebas Neue',cursive;font-size:130px;color:#FFF5E6;letter-spacing:-3px;line-height:0.9;text-shadow:0 0 80px rgba(255,80,0,0.4),0 4px 20px rgba(0,0,0,0.9);text-align:center}
.subtitle{font-size:16px;letter-spacing:8px;color:rgba(255,200,150,0.6);text-transform:uppercase;margin:15px 0}
.divider{width:200px;height:1px;background:linear-gradient(90deg,transparent,#FF6B00,transparent);margin:5px auto}
.items-box{background:rgba(0,0,0,0.35);border:1px solid rgba(255,120,0,0.15);border-radius:20px;padding:25px 50px;margin:10px 0;width:100%;backdrop-filter:blur(10px)}
.item{display:flex;align-items:center;gap:15px;padding:7px 0;font-size:24px;color:#FFF5E6;font-weight:300}
.dot{width:8px;height:8px;border-radius:50%;background:#FF6B00;flex-shrink:0}
.footer{width:calc(100% + 140px);background:rgba(0,0,0,0.5);padding:18px;text-align:center;border-top:1px solid rgba(255,120,0,0.15)}
.addr{font-size:18px;letter-spacing:3px;color:rgba(255,200,150,0.7);text-transform:uppercase}
</style></head><body>...</body></html>

IMPORTANTE: Adapte completamente o design ao tipo de estabelecimento. Seja criativo com os elementos decorativos CSS. O resultado deve parecer feito por um designer profissional, não por IA.`;


// ── Middlewares ──
app.use(cors());
// Webhook do Stripe precisa do body raw
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth middleware ──
function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token necessário' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'sf_dev_secret_2024');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// ─────────────────────────────────────
//  ROTAS DE AUTH
// ─────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { name, business, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Senha deve ter mínimo 6 caracteres' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const info = db.prepare(
      'INSERT INTO users (name, business, email, password) VALUES (?, ?, ?, ?)'
    ).run(name, business || '', email, hash);

    const user = db.prepare(
      'SELECT id, name, business, email, plan, flyers_used FROM users WHERE id = ?'
    ).get(info.lastInsertRowid);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'sf_dev_secret_2024',
      { expiresIn: '30d' }
    );
    res.json({ user, token });
  } catch (e) {
    if (e.message.includes('UNIQUE'))
      return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
    console.error(e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Preencha e-mail e senha' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(400).json({ error: 'E-mail ou senha incorretos' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'E-mail ou senha incorretos' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'sf_dev_secret_2024',
    { expiresIn: '30d' }
  );
  const { password: _, ...safe } = user;
  res.json({ user: safe, token });
});

app.get('/api/user/me', auth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, business, email, plan, plan_expires, flyers_used FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// ─────────────────────────────────────
//  GERAÇÃO DE FLYER
// ─────────────────────────────────────

app.post('/api/flyer/generate', auth, async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const plan = PLANS[user.plan] || PLANS.free;

  // Verifica se tem plano ativo
  if (plan.flyers_month === 0)
    return res.status(403).json({ error: 'plano_necessario', message: 'Assine um plano para criar flyers.' });

  // Verifica validade do plano
  if (user.plan_expires && new Date(user.plan_expires) < new Date()) {
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run('free', user.id);
    return res.status(403).json({ error: 'plano_expirado', message: 'Seu plano expirou. Renove para continuar.' });
  }

  // Verifica limite mensal (plano starter)
  if (plan.flyers_month > 0) {
    const resetAt = new Date(user.flyers_reset_at || 0);
    const now = new Date();
    if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
      db.prepare('UPDATE users SET flyers_used = 0, flyers_reset_at = ? WHERE id = ?')
        .run(now.toISOString().split('T')[0], user.id);
      user.flyers_used = 0;
    }
    if (user.flyers_used >= plan.flyers_month)
      return res.status(403).json({
        error: 'limite_atingido',
        message: `Você atingiu o limite de ${plan.flyers_month} flyers do plano Básico. Faça upgrade para o plano Pro e crie flyers ilimitados!`
      });
  }

  const { description, imageBase64 } = req.body;
  if (!description) return res.status(400).json({ error: 'Descrição necessária' });

  // Monta mensagem para a IA
  const messages = [];
  if (imageBase64) {
    messages.push({
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: description + '\n\nUse a imagem acima como referência visual do produto/estilo.' }
      ]
    });
  } else {
    messages.push({ role: 'user', content: description });
  }

  try {
    // Monta mensagem para a Anthropic
    const msgs = [];
    if (imageBase64) {
      msgs.push({ role:'user', content:[
        { type:'image', source:{ type:'base64', media_type:'image/jpeg', data:imageBase64 } },
        { type:'text', text: description + '\n\nUse a imagem como referencia visual.' }
      ]});
    } else {
      msgs.push({ role:'user', content: description });
    }

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: msgs
      })
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) throw new Error(aiData.error?.message || 'Erro na IA');

    const raw = aiData.content?.[0]?.text;
    let result;
    try {
      result = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('Formato de resposta inválido');
      result = JSON.parse(m[0]);
    }

    // Salva o flyer e incrementa contador
    const name = description.substring(0, 50);
    const flyerInfo = db.prepare('INSERT INTO flyers (user_id, name, html) VALUES (?, ?, ?)')
      .run(user.id, name, result.html);
    db.prepare('UPDATE users SET flyers_used = flyers_used + 1 WHERE id = ?').run(user.id);

    res.json({ mensagem: result.mensagem, html: result.html, flyerId: flyerInfo.lastInsertRowid });
  } catch (e) {
    console.error('Erro ao gerar flyer:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/flyers', auth, (req, res) => {
  const flyers = db.prepare(
    'SELECT id, name, html, created_at FROM flyers WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(req.user.id);
  res.json(flyers);
});

app.delete('/api/flyers/:id', auth, (req, res) => {
  db.prepare('DELETE FROM flyers WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ ok: true });
});

// ─────────────────────────────────────
//  PAGAMENTOS (STRIPE)
// ─────────────────────────────────────

app.post('/api/payment/create-session', auth, async (req, res) => {
  const { plan } = req.body;
  if (!PLANS[plan] || plan === 'free')
    return res.status(400).json({ error: 'Plano inválido' });

  // Modo demo: sem Stripe configurado, ativa direto
  if (!stripe) {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    db.prepare('UPDATE users SET plan = ?, plan_expires = ?, flyers_used = 0 WHERE id = ?')
      .run(plan, expires.toISOString(), req.user.id);
    return res.json({ demo: true, message: `Plano ${PLANS[plan].name} ativado em modo demo por 30 dias!` });
  }

  // Stripe: cria sessão de checkout
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const priceId = plan === 'starter'
    ? process.env.STRIPE_PRICE_STARTER
    : process.env.STRIPE_PRICE_PRO;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      metadata: { userId: String(user.id), plan },
      success_url: (process.env.APP_URL || 'http://localhost:3000') + '/?payment=ok&plan=' + plan,
      cancel_url:  (process.env.APP_URL || 'http://localhost:3000') + '/?payment=cancel',
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Webhook Stripe
app.post('/api/payment/webhook', (req, res) => {
  if (!stripe) return res.json({ ok: true });
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send('Webhook error: ' + e.message);
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    db.prepare('UPDATE users SET plan = ?, plan_expires = ?, stripe_cus_id = ?, flyers_used = 0 WHERE id = ?')
      .run(s.metadata.plan, expires.toISOString(), s.customer, s.metadata.userId);
  }

  if (event.type === 'invoice.payment_succeeded') {
    const inv = event.data.object;
    const u = db.prepare('SELECT id FROM users WHERE stripe_cus_id = ?').get(inv.customer);
    if (u) {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      db.prepare('UPDATE users SET plan_expires = ?, flyers_used = 0 WHERE id = ?')
        .run(expires.toISOString(), u.id);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const u = db.prepare('SELECT id FROM users WHERE stripe_cus_id = ?').get(sub.customer);
    if (u) db.prepare('UPDATE users SET plan = ?, plan_expires = NULL WHERE id = ?').run('free', u.id);
  }

  res.json({ received: true });
});

// ─────────────────────────────────────
//  ADMIN (básico, protegido por env var)
// ─────────────────────────────────────

app.get('/api/admin/users', (req, res) => {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Não autorizado' });
  const users = db.prepare('SELECT id, name, email, plan, flyers_used, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// Fallback — serve o frontend para qualquer rota
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n⚡ Speed Flyer rodando em http://localhost:${PORT}`);
  console.log(`   Stripe: ${stripe ? 'configurado' : 'modo demo (sem pagamento real)'}`);
  console.log(`   IA: ${process.env.ANTHROPIC_API_KEY ? 'chave configurada' : 'ANTHROPIC_API_KEY não encontrada'}\n`);
});
