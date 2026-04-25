# ⚡ Speed Flyer — Deploy no Railway

Sistema completo de geração de flyers com IA. Backend Node.js + Frontend integrado.

---

## Estrutura do projeto

```
speed-flyer/
  server.js          ← Backend Express (API + serve o frontend)
  package.json
  .env.example       ← Copie para .env e preencha
  public/
    index.html       ← Frontend completo (HTML/CSS/JS)
```

---

## Deploy no Railway (passo a passo)

### 1. Crie o repositório no GitHub

```bash
git init
git add .
git commit -m "Speed Flyer v1.0"
git remote add origin https://github.com/SEU_USUARIO/speed-flyer.git
git push -u origin main
```

### 2. No Railway (railway.app)

1. Clique em **New Project**
2. Selecione **Deploy from GitHub repo**
3. Escolha o repositório `speed-flyer`
4. O Railway detecta automaticamente Node.js e faz o deploy

### 3. Configure as variáveis de ambiente

No painel do Railway → seu projeto → **Variables**, adicione:

| Variável              | Valor                                      |
|-----------------------|--------------------------------------------|
| `ANTHROPIC_API_KEY`   | `sk-ant-api03-...` (console.anthropic.com) |
| `JWT_SECRET`          | Uma string aleatória longa e segura        |
| `PORT`                | `3000` (Railway usa automaticamente)       |
| `APP_URL`             | `https://SEU-PROJETO.railway.app`          |

> **Stripe (opcional)** — sem essas variáveis o sistema funciona em modo demo:
> - `STRIPE_SECRET_KEY`
> - `STRIPE_PRICE_STARTER`
> - `STRIPE_PRICE_PRO`
> - `STRIPE_WEBHOOK_SECRET`

### 4. Domínio personalizado (opcional)

Railway → Settings → Domains → **Custom Domain**
Ex: `speedflyer.com.br`

---

## Planos e pagamentos com Stripe

### Configurar Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie dois **produtos**:
   - **Speed Flyer Básico** — R$29,00/mês recorrente
   - **Speed Flyer Pro** — R$90,00/mês recorrente
3. Copie o **Price ID** de cada um (`price_xxx...`)
4. Configure o webhook em: `https://SEU-PROJETO.railway.app/api/payment/webhook`
   - Eventos: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
5. Copie o **Webhook Signing Secret** (`whsec_xxx...`)

### Modo Demo (sem Stripe)

Sem as variáveis do Stripe configuradas, ao clicar em "Assinar" o sistema ativa o plano automaticamente por 30 dias em modo demonstração. Ideal para testar antes de integrar pagamento real.

---

## Rodar localmente

```bash
# 1. Instale as dependências
npm install

# 2. Copie e preencha o .env
cp .env.example .env
# Edite o .env com sua chave Anthropic e JWT_SECRET

# 3. Inicie o servidor
npm run dev   # com hot reload (nodemon)
# ou
npm start     # produção

# 4. Acesse no navegador
open http://localhost:3000
```

---

## API Endpoints

| Método | Rota                           | Auth | Descrição                        |
|--------|--------------------------------|------|----------------------------------|
| POST   | `/api/auth/register`           | —    | Cadastrar novo usuário           |
| POST   | `/api/auth/login`              | —    | Login → retorna JWT token        |
| GET    | `/api/user/me`                 | JWT  | Dados do usuário logado          |
| POST   | `/api/flyer/generate`          | JWT  | Gerar flyer com IA               |
| GET    | `/api/flyers`                  | JWT  | Listar flyers do usuário         |
| DELETE | `/api/flyers/:id`              | JWT  | Deletar flyer                    |
| POST   | `/api/payment/create-session`  | JWT  | Criar sessão Stripe Checkout     |
| POST   | `/api/payment/webhook`         | —    | Webhook Stripe (pagamentos)      |
| GET    | `/api/admin/users`             | Key  | Listar todos os usuários (admin) |

### Admin

Para ver todos os usuários cadastrados:
```
GET /api/admin/users
Header: x-admin-key: SUA_CHAVE_ADMIN
```

---

## Limites dos planos

| Plano     | Preço     | Flyers/mês |
|-----------|-----------|------------|
| Gratuito  | R$0       | 0 (só visualiza) |
| Básico    | R$29/mês  | 30         |
| Pro       | R$90/mês  | Ilimitado  |

---

## Para revender para outros clientes

Cada cliente acessa com login próprio. O sistema já suporta múltiplos usuários com planos individuais. Para criar uma instância white-label para um cliente específico, basta fazer um novo deploy no Railway com as credenciais deles.

---

## Tecnologias

- **Backend**: Node.js + Express
- **Banco de dados**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **IA**: Anthropic Claude (claude-opus-4-6)
- **Pagamentos**: Stripe
- **Deploy**: Railway
- **Frontend**: HTML/CSS/JS vanilla (sem frameworks)
