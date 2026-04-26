<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#FF4500">
<title>Speed Flyer</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
:root{--bg:#080808;--sur:#111;--sur2:#181818;--sur3:#222;--b1:rgba(255,255,255,.06);--b2:rgba(255,255,255,.11);--acc:#FF4500;--acc2:#FF6B35;--tx:#EDE8E0;--tm:rgba(237,232,224,.52);--td:rgba(237,232,224,.28);--ok:#22C55E;--r:12px;--rs:8px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;overflow:hidden;-webkit-font-smoothing:antialiased}
body{font-family:'DM Sans',-apple-system,sans-serif;background:var(--bg);color:var(--tx);font-size:15px;line-height:1.5}
input,textarea,button{font-family:inherit}
.scr{position:absolute;inset:0;display:none;flex-direction:column}.scr.on{display:flex}
/* AUTH */
#sa{overflow-y:auto}
.auth-wrap{min-height:100%;display:flex}
@media(max-width:640px){.auth-wrap{flex-direction:column}}
.auth-l{width:42%;background:var(--sur);display:flex;flex-direction:column;justify-content:center;padding:56px 48px;position:relative;overflow:hidden;border-right:1px solid var(--b1)}
@media(max-width:640px){.auth-l{width:100%;padding:32px 24px;border-right:none;border-bottom:1px solid var(--b1)}}
.auth-l::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(255,69,0,.13) 0%,transparent 65%);top:-150px;right:-200px;pointer-events:none}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:46px;letter-spacing:-2.5px;line-height:1;position:relative;z-index:1}
.logo span{color:var(--acc)}
.tagline{margin-top:14px;font-size:14px;color:var(--tm);line-height:1.65;position:relative;z-index:1;max-width:260px}
.feats{margin-top:28px;display:flex;flex-direction:column;gap:11px;position:relative;z-index:1}
.feat{display:flex;align-items:center;gap:10px;color:var(--tm);font-size:13px}
.fdot{width:5px;height:5px;border-radius:50%;background:var(--acc);flex-shrink:0}
.auth-r{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px 36px}
@media(max-width:640px){.auth-r{padding:28px 24px}}
.auth-box{width:100%;max-width:360px}
.auth-h1{font-family:'Syne',sans-serif;font-weight:700;font-size:24px;letter-spacing:-.5px;margin-bottom:5px}
.auth-sub{color:var(--tm);font-size:13px;margin-bottom:24px}
.atabs{display:flex;background:var(--sur);border:1px solid var(--b1);border-radius:var(--rs);padding:3px;gap:3px;margin-bottom:20px}
.atab{flex:1;padding:8px;text-align:center;font-size:13px;border-radius:6px;cursor:pointer;color:var(--tm);font-weight:500;border:none;background:none;transition:.15s}
.atab.on{background:var(--sur2);color:var(--tx)}
.fg{margin-bottom:12px}
.fl{display:block;font-size:11px;color:var(--tm);margin-bottom:5px;font-weight:500;letter-spacing:.3px;text-transform:uppercase}
.fi{width:100%;background:var(--sur);border:1px solid var(--b1);border-radius:var(--rs);padding:11px 14px;color:var(--tx);font-size:15px;outline:none;transition:.2s border-color;-webkit-appearance:none}
.fi:focus{border-color:var(--acc)}.fi::placeholder{color:var(--td)}
.btn-p{width:100%;padding:13px;background:var(--acc);color:#fff;border:none;border-radius:var(--rs);font-size:15px;font-weight:600;cursor:pointer;transition:.15s;margin-top:4px}
.btn-p:hover,.btn-p:active{background:var(--acc2)}
.demo-lnk{margin-top:13px;text-align:center;font-size:12px;color:var(--td)}
.demo-lnk button{background:none;border:none;color:var(--acc);cursor:pointer;font-size:12px;text-decoration:underline}
/* PRICING */
#sp{overflow-y:auto}
.price-cont{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px}
.price-h{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;letter-spacing:-1px;text-align:center;margin-bottom:8px}
.price-h span{color:var(--acc)}
.price-sub{color:var(--tm);font-size:14px;text-align:center;margin-bottom:30px}
.price-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:600px}
@media(max-width:500px){.price-grid{grid-template-columns:1fr}}
.pcard{background:var(--sur);border:1px solid var(--b2);border-radius:16px;padding:24px;position:relative}
.pcard.pop{border:2px solid var(--acc);box-shadow:0 0 40px rgba(255,69,0,.1)}
.pbadge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--acc);color:#fff;font-size:10px;font-weight:700;padding:3px 12px;border-radius:20px;white-space:nowrap;letter-spacing:.5px;text-transform:uppercase}
.pname{font-size:11px;font-weight:600;color:var(--tm);letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px}
.pprice{font-family:'Syne',sans-serif;font-weight:800;font-size:38px;letter-spacing:-2px;line-height:1;margin-bottom:3px}
.pprice sup{font-size:17px;font-weight:600;vertical-align:top;margin-top:7px;display:inline-block}
.pper{font-size:12px;color:var(--tm);margin-bottom:18px}
.plist{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.plist li{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--tm)}
.pck{width:14px;height:14px;border-radius:50%;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:8px;color:#22C55E}
.btn-sub{width:100%;padding:12px;border:none;border-radius:var(--rs);font-size:14px;font-weight:700;cursor:pointer;transition:.15s}
.btn-sub.basic{background:var(--sur2);color:var(--tx);border:1px solid var(--b2)}
.btn-sub.pro{background:var(--acc);color:#fff}
.price-note{margin-top:14px;font-size:11px;color:var(--td);text-align:center}
/* TOPBAR */
.topbar{height:54px;background:var(--sur);border-bottom:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between;padding:0 18px;flex-shrink:0}
.tlogo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-1px}
.tlogo span{color:var(--acc)}
.tr{display:flex;align-items:center;gap:11px}
.btn-new{display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--acc);color:#fff;border:none;border-radius:var(--rs);font-size:13px;font-weight:600;cursor:pointer}
.plan-badge{font-size:11px;padding:3px 9px;border-radius:20px;font-weight:600;letter-spacing:.4px;text-transform:uppercase}
.plan-badge.starter{background:rgba(255,69,0,.15);color:var(--acc)}
.plan-badge.pro{background:rgba(34,197,94,.12);color:var(--ok)}
.ava{width:32px;height:32px;border-radius:50%;background:var(--sur2);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--acc);cursor:pointer}
/* DASHBOARD */
.dcont{flex:1;overflow-y:auto;padding:22px 18px}
.dtitle{font-family:'Syne',sans-serif;font-weight:700;font-size:20px;letter-spacing:-.5px}
.dsub{color:var(--tm);font-size:13px;margin-top:3px;margin-bottom:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px}
@media(max-width:380px){.grid{grid-template-columns:1fr 1fr}}
.fcard{background:var(--sur);border:1px solid var(--b1);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:.2s all}
.fcard:active{transform:scale(.97)}
.fthumb{width:100%;aspect-ratio:1;background:var(--sur2);overflow:hidden}
.fthumb iframe{width:1080px;height:1080px;transform:scale(.194);transform-origin:top left;border:none;pointer-events:none}
.finfo{padding:9px 11px;border-top:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between}
.fname{font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.fdel{background:none;border:none;color:var(--td);cursor:pointer;font-size:15px;padding:0 0 0 6px;line-height:1}
.fdel:hover{color:#ff4444}
.fdate{font-size:10px;color:var(--tm);margin-top:2px}
.fnew{background:var(--sur);border:1px dashed var(--b2);border-radius:var(--r);aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;cursor:pointer;transition:.2s;color:var(--tm)}
.fnew:active{border-color:var(--acc);color:var(--acc)}
/* CREATOR */
#sc .topbar{gap:10px}
.btn-back{display:flex;align-items:center;gap:4px;color:var(--tm);font-size:13px;cursor:pointer;border:none;background:none;padding:5px 8px;border-radius:var(--rs);transition:.15s}
.btn-back:hover{background:var(--sur2);color:var(--tx)}
.sep{color:rgba(255,255,255,.15);font-size:18px;user-select:none}
.ctitle{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;letter-spacing:-.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}
.cbody{flex:1;display:flex;overflow:hidden;position:relative}
.cpanel{width:360px;flex-shrink:0;border-right:1px solid var(--b1);display:flex;flex-direction:column;background:var(--sur)}
.ppanel{flex:1;display:flex;flex-direction:column;background:var(--bg)}
@media(max-width:700px){
  .cpanel{width:100%;position:absolute;inset:0;border-right:none;transition:.3s transform;z-index:2}
  .ppanel{position:absolute;inset:0;transition:.3s transform;transform:translateX(100%)}
  .ppanel.show{transform:translateX(0)}
  .cpanel.hide{transform:translateX(-100%)}
}
.mob-tabs{display:none;height:50px;background:var(--sur);border-top:1px solid var(--b1);flex-shrink:0}
@media(max-width:700px){.mob-tabs{display:flex}}
.mob-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;border:none;background:none;color:var(--tm);font-size:10px;font-weight:500;transition:.15s;padding:6px 0}
.mob-tab.on{color:var(--acc)}
/* CHAT */
.cheader{padding:12px 16px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:10px;flex-shrink:0}
.ai-ava{width:36px;height:36px;border-radius:9px;background:var(--acc);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.ai-name{font-size:13px;font-weight:600}
.ai-st{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--tm);margin-top:2px}
.sdot{width:5px;height:5px;border-radius:50%;background:var(--ok)}
.msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:11px;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}
.msgs::-webkit-scrollbar{width:3px}
.msgs::-webkit-scrollbar-thumb{background:var(--sur3);border-radius:2px}
.msg{display:flex;flex-direction:column;max-width:87%}
.msg.u{align-self:flex-end;align-items:flex-end}
.msg.a{align-self:flex-start;align-items:flex-start}
.bub{padding:9px 12px;border-radius:14px;font-size:13px;line-height:1.55}
.msg.u .bub{background:var(--acc);color:#fff;border-bottom-right-radius:3px}
.msg.a .bub{background:var(--sur2);color:var(--tx);border-bottom-left-radius:3px;border:1px solid var(--b1)}
.mt{font-size:10px;color:var(--td);margin-top:3px;padding:0 3px}
/* Flyer card no chat */
.flyer-card{background:var(--sur2);border:1px solid var(--b1);border-radius:12px;overflow:hidden;width:240px;align-self:flex-start}
.flyer-thumb{width:240px;height:240px;overflow:hidden;cursor:zoom-in}
.flyer-thumb iframe{width:1080px;height:1080px;transform:scale(.2222);transform-origin:top left;border:none;pointer-events:none}
.flyer-acts{padding:9px 10px;display:flex;gap:6px}
.fa-btn{flex:1;padding:7px 0;border:none;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:center;gap:4px}
.fa-btn.ver{background:var(--sur3);color:var(--tx)}
.fa-btn.dl{background:var(--acc);color:#fff}
.fa-edit{width:calc(100% - 20px);margin:0 10px 9px;padding:7px;border:none;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;background:var(--sur3);color:var(--tm);border:1px solid var(--b1)}
.fa-btn:hover,.fa-edit:hover{opacity:.8}
.abub{display:flex;align-items:center;gap:8px;padding:8px 11px;background:var(--acc);border-radius:14px;border-bottom-right-radius:3px;max-width:87%;align-self:flex-end}
.aic{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.awaves{display:flex;align-items:center;gap:2px;flex:1}
.abar{width:3px;border-radius:3px;background:rgba(255,255,255,.55)}
.typing{display:flex;align-items:center;gap:5px;padding:9px 12px;background:var(--sur2);border-radius:14px;border-bottom-left-radius:3px;border:1px solid var(--b1);width:fit-content}
.tdot{width:6px;height:6px;border-radius:50%;background:var(--tm);animation:tb 1.2s infinite}
.tdot:nth-child(2){animation-delay:.2s}.tdot:nth-child(3){animation-delay:.4s}
@keyframes tb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
.vbar{display:none;align-items:center;gap:9px;padding:8px 13px;background:rgba(255,69,0,.08);border-top:1px solid rgba(255,69,0,.18);flex-shrink:0}
.vbar.on{display:flex}
.rdot{width:7px;height:7px;border-radius:50%;background:var(--acc);animation:rb 1s infinite}
@keyframes rb{0%,100%{opacity:1}50%{opacity:.2}}
.rwaves{display:flex;align-items:center;gap:3px;flex:1}
.rwave{width:3px;background:var(--acc);border-radius:2px;opacity:.6;animation:rw .8s infinite ease-in-out}
@keyframes rw{0%,100%{height:5px}50%{height:16px}}
.rbtn{border:none;background:none;color:var(--acc);font-size:12px;font-weight:600;cursor:pointer;padding:4px 8px;border-radius:5px}
.cinput{padding:11px 12px;border-top:1px solid var(--b1);background:var(--sur);flex-shrink:0}
.uprev{display:flex;align-items:center;gap:7px;padding:6px 9px;background:var(--sur2);border:1px solid var(--b1);border-radius:var(--rs);margin-bottom:7px;font-size:12px;color:var(--tm)}
.uprev img{width:28px;height:28px;border-radius:4px;object-fit:cover;flex-shrink:0}
.irow{display:flex;align-items:flex-end;gap:6px;background:var(--sur2);border:1px solid var(--b1);border-radius:13px;padding:7px 9px;transition:.2s border-color}
.irow:focus-within{border-color:var(--b2)}
.irow textarea{flex:1;background:none;border:none;outline:none;color:var(--tx);font-size:14px;resize:none;line-height:1.5;max-height:90px;min-height:20px}
.irow textarea::placeholder{color:var(--td)}
.ibtns{display:flex;align-items:center;gap:5px;flex-shrink:0}
.ib{width:31px;height:31px;border-radius:7px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--tm);transition:.15s}
.ib:hover,.ib:active{background:var(--sur3);color:var(--tx)}
.ib.rec{background:rgba(255,69,0,.18);color:var(--acc);animation:mp 1s infinite}
@keyframes mp{0%,100%{box-shadow:0 0 0 0 rgba(255,69,0,.3)}50%{box-shadow:0 0 0 5px rgba(255,69,0,0)}}
.isend{width:31px;height:31px;border-radius:7px;background:var(--acc);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;transition:.15s}
.isend:hover,.isend:active{background:var(--acc2)}
.ihint{font-size:10px;color:var(--td);text-align:center;margin-top:6px}
@media(max-width:700px){.ihint{display:none}}
/* PREVIEW */
.ptbar{height:50px;border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 13px;gap:8px;background:var(--sur);flex-shrink:0}
.ptitle{font-size:12px;color:var(--tm);font-weight:500;flex:1}
.stabs{display:flex;background:var(--sur2);border:1px solid var(--b1);border-radius:var(--rs);padding:2px;gap:2px}
.stab{padding:4px 9px;font-size:11px;font-weight:500;color:var(--tm);border-radius:5px;cursor:pointer;border:none;background:none;transition:.15s}
.stab.on{background:var(--sur3);color:var(--tx)}
.btn-dl{display:flex;align-items:center;gap:5px;padding:7px 12px;background:var(--acc);color:#fff;border:none;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer}
.parea{flex:1;display:flex;align-items:center;justify-content:center;padding:18px;overflow:hidden}
.pph{display:flex;flex-direction:column;align-items:center;gap:11px;color:var(--td);text-align:center}
.pph-ico{width:60px;height:60px;border-radius:14px;background:var(--sur);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center}
.pfwrap{position:relative;box-shadow:0 0 0 1px var(--b2),0 18px 44px rgba(0,0,0,.5);border-radius:3px;overflow:hidden;display:none;cursor:zoom-in}
.pfwrap iframe{display:block;border:none}
/* LIGHTBOX */
.lightbox{position:fixed;inset:0;background:rgba(0,0,0,.93);display:none;align-items:center;justify-content:center;z-index:500;flex-direction:column;gap:14px;padding:14px}
.lightbox.on{display:flex}
.lb-frame{border-radius:4px;overflow:hidden;box-shadow:0 0 0 1px var(--b2),0 40px 80px rgba(0,0,0,.8);position:relative}
.lb-frame iframe{display:block;border:none;width:1080px;height:1080px;transform-origin:top left}
.lb-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid var(--b2);color:var(--tx);font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10}
.lb-btns{display:flex;gap:9px}
.lb-btn{padding:10px 20px;border:none;border-radius:var(--rs);font-size:14px;font-weight:600;cursor:pointer;transition:.15s;display:flex;align-items:center;gap:7px}
.lb-btn.png{background:var(--acc);color:#fff}
.lb-btn.jpg{background:var(--sur2);color:var(--tx);border:1px solid var(--b2)}
.lb-btn:hover{opacity:.85}
/* TOAST + LOADING */
.toast{position:fixed;bottom:60px;left:50%;transform:translateX(-50%) translateY(8px);background:var(--sur2);border:1px solid var(--b2);border-radius:var(--rs);padding:9px 15px;font-size:13px;color:var(--tx);z-index:999;opacity:0;transition:.3s all;pointer-events:none;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis}
@media(min-width:700px){.toast{bottom:20px;right:20px;left:auto;transform:translateY(8px)}}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
@media(min-width:700px){.toast.on{transform:translateY(0)}}
.loading{position:fixed;inset:0;background:rgba(8,8,8,.78);display:none;align-items:center;justify-content:center;z-index:800;flex-direction:column;gap:12px}
.loading.on{display:flex}
.spin{width:30px;height:30px;border:3px solid var(--b2);border-top-color:var(--acc);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.load-txt{font-size:13px;color:var(--tm)}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:var(--sur3);border-radius:2px}
</style>
</head>
<body>

<!-- AUTH -->
<div id="sa" class="scr on">
  <div class="auth-wrap">
    <div class="auth-l">
      <div class="logo">SPEED<br><span>FLYER</span></div>
      <p class="tagline">Crie flyers profissionais para WhatsApp e Instagram com IA.</p>
      <div class="feats">
        <div class="feat"><div class="fdot"></div>Escreva ou fale o que quer criar</div>
        <div class="feat"><div class="fdot"></div>IA gera o flyer em segundos</div>
        <div class="feat"><div class="fdot"></div>Upload de fotos dos seus produtos</div>
        <div class="feat"><div class="fdot"></div>Baixe PNG ou JPG pronto para postar</div>
      </div>
    </div>
    <div class="auth-r">
      <div class="auth-box">
        <h1 class="auth-h1" id="auth-title">Bem-vindo de volta</h1>
        <p class="auth-sub" id="auth-sub">Acesse sua conta para criar flyers</p>
        <div class="atabs">
          <button class="atab on" onclick="authTab('login',this)">Entrar</button>
          <button class="atab" onclick="authTab('reg',this)">Cadastrar</button>
        </div>
        <div id="f-login">
          <div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="le" placeholder="seu@email.com"></div>
          <div class="fg"><label class="fl">Senha</label><input class="fi" type="password" id="lp" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
          <button class="btn-p" onclick="doLogin()">Entrar na minha conta</button>
          <p class="demo-lnk">Sem conta? <button onclick="fillDemo()">Entrar em modo demo</button></p>
        </div>
        <div id="f-reg" style="display:none">
          <div class="fg"><label class="fl">Seu nome</label><input class="fi" type="text" id="rn" placeholder="João Silva"></div>
          <div class="fg"><label class="fl">Estabelecimento</label><input class="fi" type="text" id="rb" placeholder="Churrascaria do João"></div>
          <div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="re" placeholder="seu@email.com"></div>
          <div class="fg"><label class="fl">Senha</label><input class="fi" type="password" id="rp" placeholder="Mínimo 6 caracteres" onkeydown="if(event.key==='Enter')doReg()"></div>
          <button class="btn-p" onclick="doReg()">Criar minha conta</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- PRICING -->
<div id="sp" class="scr">
  <div class="topbar">
    <div class="tlogo">SPEED<span>FLYER</span></div>
    <button style="background:none;border:none;color:var(--tm);cursor:pointer;font-size:13px;text-decoration:underline" onclick="logout()">Sair</button>
  </div>
  <div class="price-cont">
    <h2 class="price-h">Escolha seu <span>plano</span></h2>
    <p class="price-sub">Acesso completo ao gerador de flyers com IA</p>
    <div class="price-grid">
      <div class="pcard">
        <div class="pname">Básico</div>
        <div class="pprice"><sup>R$</sup>29</div>
        <div class="pper">por mês</div>
        <ul class="plist">
          <li><span class="pck">✓</span>30 flyers por mês</li>
          <li><span class="pck">✓</span>Upload de fotos</li>
          <li><span class="pck">✓</span>Texto e voz</li>
          <li><span class="pck">✓</span>Download PNG e JPG</li>
          <li><span class="pck">✓</span>Histórico salvo</li>
        </ul>
        <button class="btn-sub basic" onclick="subscribe('starter')">Assinar — R$29/mês</button>
      </div>
      <div class="pcard pop">
        <div class="pbadge">Mais popular</div>
        <div class="pname">Pro</div>
        <div class="pprice"><sup>R$</sup>90</div>
        <div class="pper">por mês</div>
        <ul class="plist">
          <li><span class="pck">✓</span>Flyers ilimitados</li>
          <li><span class="pck">✓</span>Upload de fotos</li>
          <li><span class="pck">✓</span>Texto e voz</li>
          <li><span class="pck">✓</span>Download PNG e JPG</li>
          <li><span class="pck">✓</span>Histórico salvo</li>
        </ul>
        <button class="btn-sub pro" onclick="subscribe('pro')">Assinar — R$90/mês</button>
      </div>
    </div>
    <p class="price-note">Cancele quando quiser · Sem fidelidade</p>
  </div>
</div>

<!-- DASHBOARD -->
<div id="sd" class="scr">
  <div class="topbar">
    <div class="tlogo">SPEED<span>FLYER</span></div>
    <div class="tr">
      <span class="plan-badge" id="plan-badge"></span>
      <button class="btn-new" onclick="goCreator()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo Flyer
      </button>
      <div class="ava" id="ava" onclick="logout()" title="Sair">?</div>
    </div>
  </div>
  <div class="dcont">
    <div class="dtitle">Meus Flyers</div>
    <div class="dsub" id="dsub">Carregando...</div>
    <div class="grid" id="dgrid"></div>
  </div>
</div>

<!-- CREATOR -->
<div id="sc" class="scr">
  <div class="topbar">
    <button class="btn-back" onclick="goDash()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Dashboard
    </button>
    <span class="sep">|</span>
    <span class="ctitle" id="cname">Novo Flyer</span>
    <div style="flex:1"></div>
    <span style="font-size:11px;color:var(--td)" id="usage-info"></span>
  </div>
  <div class="cbody">
    <div class="cpanel" id="cpanel">
      <div class="cheader">
        <div class="ai-ava">⚡</div>
        <div>
          <div class="ai-name">Speed Flyer AI</div>
          <div class="ai-st"><div class="sdot"></div>Online — pronto para criar</div>
        </div>
      </div>
      <div class="msgs" id="msgs"></div>
      <div class="vbar" id="vbar">
        <div class="rdot"></div>
        <div class="rwaves">
          <div class="rwave" style="animation-delay:0s"></div>
          <div class="rwave" style="animation-delay:.1s"></div>
          <div class="rwave" style="animation-delay:.2s"></div>
          <div class="rwave" style="animation-delay:.3s"></div>
          <div class="rwave" style="animation-delay:.4s"></div>
        </div>
        <span id="rtimer" style="font-size:12px;color:var(--acc);font-weight:500">0:00</span>
        <button class="rbtn" onclick="stopRec()">Parar e enviar</button>
      </div>
      <div class="cinput">
        <div id="uparea"></div>
        <div class="irow">
          <textarea id="tinput" placeholder="Descreva o flyer..." rows="1" onkeydown="handleKey(event)" oninput="ar(this)"></textarea>
          <div class="ibtns">
            <label class="ib" title="Enviar foto" style="cursor:pointer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <input type="file" accept="image/*" style="display:none" onchange="handleUp(this)">
            </label>
            <button class="ib" id="micbtn" title="Gravar voz" onclick="togRec()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button class="isend" onclick="send()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
        <p class="ihint">Enter para enviar · Shift+Enter nova linha · 🎤 Microfone para falar</p>
      </div>
    </div>
    <div class="ppanel" id="ppanel">
      <div class="ptbar">
        <span class="ptitle">Pré-visualização</span>
        <div class="stabs">
          <button class="stab on" onclick="setS('sq',this)">1:1 Feed</button>
          <button class="stab" onclick="setS('st',this)">Stories</button>
        </div>
        <div id="bdl" style="display:none;gap:7px;align-items:center">
          <button class="btn-dl" onclick="openLightbox()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Ver e Baixar
          </button>
        </div>
      </div>
      <div class="parea" id="parea">
        <div class="pph" id="pph">
          <div class="pph-ico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--td)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <p style="font-size:13px;font-weight:500;color:var(--tm)">Seu flyer aparece aqui</p>
          <p style="font-size:12px;color:var(--td)">Descreva ou fale o que quer criar</p>
        </div>
        <div class="pfwrap" id="pfwrap" onclick="openLightbox()">
          <iframe id="pframe" scrolling="no"></iframe>
        </div>
      </div>
    </div>
  </div>
  <div class="mob-tabs">
    <button class="mob-tab on" id="mt-chat" onclick="mobTab('chat')">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      Chat
    </button>
    <button class="mob-tab" id="mt-prev" onclick="mobTab('preview')">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      Flyer
    </button>
  </div>
</div>

<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox" onclick="if(event.target===this)closeLightbox()">
  <div class="lb-frame" id="lb-frame">
    <button class="lb-close" onclick="closeLightbox()">×</button>
    <iframe id="lb-iframe" scrolling="no"></iframe>
  </div>
  <div class="lb-btns">
    <button class="lb-btn png" onclick="dlImage('png')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Baixar PNG
    </button>
    <button class="lb-btn jpg" onclick="dlImage('jpg')">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Baixar JPG
    </button>
  </div>
</div>

<div class="loading" id="loading"><div class="spin"></div><div class="load-txt" id="load-txt">Aguarde...</div></div>
<div class="toast" id="toast"></div>
<a id="dla" style="display:none"></a>

<script>
const API='';
let token=localStorage.getItem('sf_token')||'',user=null;
let recog=null,recOn=false,recSec=0,recInt=null;
let upB64=null,curHTML=null,curSz='sq';
let lbHTML=null;

(async function(){
  if(token){
    try{user=await api('GET','/api/user/me');afterLogin();}
    catch{token='';localStorage.removeItem('sf_token');}
  }
})();

async function api(m,p,b){
  const r=await fetch(API+p,{method:m,headers:{'Content-Type':'application/json',...(token?{'Authorization':'Bearer '+token}:{})},
  ...(b?{body:JSON.stringify(b)}:{})});
  const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Erro');
  return d;
}

function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));document.getElementById(id).classList.add('on');}

async function afterLogin(){
  if(!user)return;
  if(user.plan==='free'){showScr('sp');return;}
  goDash();
}

async function goDash(){
  showScr('sd');
  const b=document.getElementById('plan-badge');
  b.textContent=user.plan==='pro'?'Pro':'Básico';
  b.className='plan-badge '+user.plan;
  document.getElementById('ava').textContent=(user.name||'?').substring(0,2).toUpperCase();
  await loadFlyers();
}

async function loadFlyers(){
  try{
    const fl=await api('GET','/api/flyers');
    document.getElementById('dsub').textContent=fl.length===0?'Nenhum flyer ainda — crie o primeiro!':fl.length+' flyer'+(fl.length>1?'s':'')+' criado'+(fl.length>1?'s':'');
    const g=document.getElementById('dgrid');g.innerHTML='';
    const nc=document.createElement('div');nc.className='fnew';nc.onclick=goCreator;
    nc.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span style="font-size:12px;font-weight:500">Criar flyer</span>';
    g.appendChild(nc);
    fl.forEach(f=>{
      const c=document.createElement('div');c.className='fcard';
      c.innerHTML=`<div class="fthumb"><iframe srcdoc="${esc(f.html)}" scrolling="no"></iframe></div><div class="finfo"><div><div class="fname">${f.name||'Flyer'}</div><div class="fdate">${new Date(f.created_at).toLocaleDateString('pt-BR')}</div></div><button class="fdel" onclick="event.stopPropagation();delFlyer(${f.id},this)" title="Apagar">🗑</button></div>`;
      c.querySelector('.fthumb').onclick=()=>{lbHTML=f.html;openLightboxWith(f.html);};
      g.appendChild(c);
    });
  }catch(e){toast('Erro ao carregar flyers');}
}

async function delFlyer(id,btn){
  if(!confirm('Apagar este flyer?'))return;
  try{await api('DELETE','/api/flyers/'+id);btn.closest('.fcard').remove();toast('Flyer apagado.');}
  catch(e){toast('Erro ao apagar');}
}

function goCreator(){
  showScr('sc');
  const msgs=document.getElementById('msgs');
  if(!msgs.children.length)resetChat();
  document.getElementById('cname').textContent=user?(user.business||user.name):'Novo Flyer';
  if(user&&user.plan==='starter')document.getElementById('usage-info').textContent=`${user.flyers_used||0}/30 este mês`;
  setTimeout(()=>document.getElementById('tinput').focus(),100);
}

function authTab(t,el){
  document.querySelectorAll('.atab').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  document.getElementById('f-login').style.display=t==='login'?'block':'none';
  document.getElementById('f-reg').style.display=t==='reg'?'block':'none';
  document.getElementById('auth-title').textContent=t==='login'?'Bem-vindo de volta':'Criar sua conta';
  document.getElementById('auth-sub').textContent=t==='login'?'Acesse para criar flyers':'Comece agora gratuitamente';
}
async function doLogin(){
  const e=document.getElementById('le').value.trim(),p=document.getElementById('lp').value;
  if(!e||!p){toast('Preencha e-mail e senha');return;}
  loading(true,'Entrando...');
  try{const r=await api('POST','/api/auth/login',{email:e,password:p});token=r.token;localStorage.setItem('sf_token',token);user=r.user;await afterLogin();}
  catch(err){toast(err.message);}
  loading(false);
}
async function doReg(){
  const n=document.getElementById('rn').value.trim(),b=document.getElementById('rb').value.trim(),e=document.getElementById('re').value.trim(),p=document.getElementById('rp').value;
  if(!n||!e||!p){toast('Preencha os campos');return;}
  loading(true,'Criando conta...');
  try{const r=await api('POST','/api/auth/register',{name:n,business:b,email:e,password:p});token=r.token;localStorage.setItem('sf_token',token);user=r.user;await afterLogin();}
  catch(err){toast(err.message);}
  loading(false);
}
async function fillDemo(){
  loading(true,'Entrando...');
  try{
    try{const r=await api('POST','/api/auth/login',{email:'demo@speedflyer.com',password:'demo123'});token=r.token;localStorage.setItem('sf_token',token);user=r.user;}
    catch{const r=await api('POST','/api/auth/register',{name:'Demo',business:'Speed Flyer Demo',email:'demo@speedflyer.com',password:'demo123'});token=r.token;localStorage.setItem('sf_token',token);user=r.user;}
    await afterLogin();
  }catch(e){toast(e.message);}
  loading(false);
}
function logout(){token='';localStorage.removeItem('sf_token');user=null;document.getElementById('msgs').innerHTML='';showScr('sa');}

async function subscribe(plan){
  loading(true,'Ativando...');
  try{
    const r=await api('POST','/api/payment/create-session',{plan});
    if(r.demo){user.plan=plan;toast(r.message);await goDash();}
    else if(r.url){window.location.href=r.url;}
  }catch(e){toast(e.message);}
  loading(false);
}

function resetChat(){
  document.getElementById('msgs').innerHTML='';
  curHTML=null;
  document.getElementById('pph').style.display='flex';
  document.getElementById('pfwrap').style.display='none';
  document.getElementById('bdl').style.display='none';
  document.getElementById('uparea').innerHTML='';
  upB64=null;
  const nm=user?(', '+user.name.split(' ')[0]):'';
  addMsg('a',`Olá${nm}! Sou o Speed Flyer AI ⚡<br><br>Me diga o que quer criar. Pode <strong>escrever</strong>, usar o <strong>microfone</strong> ou enviar uma <strong>foto</strong> do produto.<br><br>Informe: nome do lugar, itens, endereço e estilo.`);
}

function addMsg(r,c,isAudio){
  const a=document.getElementById('msgs');
  const d=document.createElement('div');
  const t=new Date().getHours()+':'+String(new Date().getMinutes()).padStart(2,'0');
  if(isAudio&&r==='u'){
    d.className='abub';
    d.innerHTML=`<div class="aic"><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/></svg></div><div class="awaves">${Array(7).fill(0).map(()=>`<div class="abar" style="height:${4+Math.round(Math.random()*12)}px"></div>`).join('')}</div><span style="font-size:11px;color:rgba(255,255,255,.8)">${c}</span>`;
  } else {
    d.className='msg '+r;
    d.innerHTML=`<div class="bub">${c}</div><span class="mt">${t}</span>`;
  }
  a.appendChild(d);a.scrollTop=a.scrollHeight;
}

function addFlyerCard(html){
  const a=document.getElementById('msgs');
  const wrap=document.createElement('div');
  wrap.style.cssText='align-self:flex-start;display:flex;flex-direction:column;gap:0';
  const card=document.createElement('div');
  card.className='flyer-card';
  const b64=btoa(unescape(encodeURIComponent(html)));
  card.innerHTML=`
    <div class="flyer-thumb" onclick="openLightboxWith(decodeURIComponent(escape(atob('${b64}'))))">
      <iframe srcdoc="${esc(html)}" scrolling="no"></iframe>
    </div>
    <div class="flyer-acts">
      <button class="fa-btn ver" onclick="openLightboxWith(decodeURIComponent(escape(atob('${b64}'))))">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>Ver maior
      </button>
      <button class="fa-btn dl" onclick="lbHTML=decodeURIComponent(escape(atob('${b64}')));openLightboxWith(lbHTML);toast('Escolha PNG ou JPG')">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>Baixar
      </button>
    </div>
    <button class="fa-edit" onclick="editFlyer()">✏️ Alterar este flyer</button>`;
  wrap.appendChild(card);
  a.appendChild(wrap);a.scrollTop=a.scrollHeight;
}

function addTyping(){
  const a=document.getElementById('msgs');
  const d=document.createElement('div');d.className='msg a';d.id='typing';
  d.innerHTML='<div class="typing"><div class="tdot"></div><div class="tdot"></div><div class="tdot"></div></div>';
  a.appendChild(d);a.scrollTop=a.scrollHeight;
}
function rmTyping(){const t=document.getElementById('typing');if(t)t.remove();}

async function send(vText,isVoice){
  const inp=document.getElementById('tinput');
  const txt=vText||inp.value.trim();
  if(!txt&&!upB64)return;
  if(isVoice){addMsg('u',fmt(recSec)+'s',true);if(txt)addMsg('u',txt);}
  else addMsg('u',txt);
  inp.value='';ar(inp);
  const b64=upB64;
  document.getElementById('uparea').innerHTML='';upB64=null;
  addTyping();
  try{
    const r=await api('POST','/api/flyer/generate',{description:txt,imageBase64:b64||undefined});
    rmTyping();
    addMsg('a',r.mensagem||'Flyer criado! Clique em "Ver maior" para ampliar e baixar.');
    addFlyerCard(r.html);
    lbHTML=r.html;curHTML=r.html;
    renderFlyer(r.html);
    if(user&&user.plan==='starter'){user.flyers_used=(user.flyers_used||0)+1;document.getElementById('usage-info').textContent=`${user.flyers_used}/30 este mês`;}
    if(window.innerWidth<=700)mobTab('preview');
  }catch(e){
    rmTyping();
    addMsg('a','Erro: '+e.message);
  }
}

function editFlyer(){
  const inp=document.getElementById('tinput');
  inp.value='';
  inp.placeholder='Descreva o que quer mudar no flyer...';
  inp.focus();
  toast('Descreva o que quer alterar no flyer 👆');
  if(window.innerWidth<=700)mobTab('chat');
}

function renderFlyer(html){
  curHTML=html;
  document.getElementById('pph').style.display='none';
  document.getElementById('bdl').style.display='flex';
  document.getElementById('pfwrap').style.display='block';
  scalePreview();
}
function scalePreview(){
  if(!curHTML)return;
  const area=document.getElementById('parea'),wrap=document.getElementById('pfwrap'),frame=document.getElementById('pframe');
  const W=area.clientWidth-36,H=area.clientHeight-36;
  const fw=1080,fh=curSz==='st'?1920:1080;
  const sc=Math.min(W/fw,H/fh,1);
  frame.style.width=fw+'px';frame.style.height=fh+'px';
  frame.style.transform=`scale(${sc})`;frame.style.transformOrigin='top left';
  wrap.style.width=(fw*sc)+'px';wrap.style.height=(fh*sc)+'px';
  frame.srcdoc=curHTML;
}
function setS(s,el){document.querySelectorAll('.stab').forEach(x=>x.classList.remove('on'));el.classList.add('on');curSz=s;if(curHTML)scalePreview();}

function openLightbox(){if(curHTML)openLightboxWith(curHTML);}
function openLightboxWith(html){
  lbHTML=html;
  const lb=document.getElementById('lightbox');
  const frame=document.getElementById('lb-iframe');
  const frameWrap=document.getElementById('lb-frame');
  lb.classList.add('on');
  frame.srcdoc=html;
  const size=Math.min(window.innerWidth*0.92,window.innerHeight*0.78,720);
  const sc=size/1080;
  frame.style.transform=`scale(${sc})`;
  frame.style.width='1080px';frame.style.height='1080px';
  frameWrap.style.width=size+'px';frameWrap.style.height=size+'px';
}
function closeLightbox(){document.getElementById('lightbox').classList.remove('on');}

async function dlImage(fmt){
  const html=lbHTML||curHTML;if(!html)return;
  loading(true,'Gerando '+fmt.toUpperCase()+'...');
  const iframe=document.createElement('iframe');
  iframe.style.cssText='position:fixed;left:-9999px;top:0;width:1080px;height:1080px;border:none;opacity:0';
  document.body.appendChild(iframe);
  iframe.srcdoc=html;
  await new Promise(r=>iframe.onload=r);
  await new Promise(r=>setTimeout(r,2000));
  try{
    const canvas=await html2canvas(iframe.contentDocument.body,{width:1080,height:1080,scale:1,useCORS:true,allowTaint:true,backgroundColor:null,logging:false});
    const dataUrl=canvas.toDataURL(fmt==='jpg'?'image/jpeg':'image/png',0.95);
    const a=document.getElementById('dla');
    a.href=dataUrl;a.download='speedflyer_'+Date.now()+'.'+fmt;a.click();
    toast('Baixado em '+fmt.toUpperCase()+'! Pronto para WhatsApp e Instagram.');
  }catch(e){
    const blob=new Blob([html],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const a=document.getElementById('dla');
    a.href=url;a.download='speedflyer_'+Date.now()+'.html';a.click();
    URL.revokeObjectURL(url);
    toast('Baixado como HTML.');
  }
  document.body.removeChild(iframe);
  loading(false);
}

function togRec(){recOn?stopRec():startRec();}
function startRec(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Use o Google Chrome para o microfone.');return;}
  recog=new SR();recog.lang='pt-BR';recog.continuous=true;recog.interimResults=true;
  let final='';
  recog.onresult=function(ev){
    let interim='';
    for(let i=ev.resultIndex;i<ev.results.length;i++){
      if(ev.results[i].isFinal)final+=ev.results[i][0].transcript+' ';
      else interim+=ev.results[i][0].transcript;
    }
    const inp=document.getElementById('tinput');inp.value=(final+interim).trim();ar(inp);
  };
  recog.onerror=e=>{toast('Erro: '+e.error);stopRec();};
  recog.onend=()=>{if(recOn)recog.start();};
  recog.start();
  recOn=true;recSec=0;
  document.getElementById('micbtn').classList.add('rec');
  document.getElementById('vbar').classList.add('on');
  recInt=setInterval(()=>{recSec++;document.getElementById('rtimer').textContent=fmt(recSec);},1000);
  toast('Gravando... fale o que quer no flyer!');
}
function stopRec(){
  if(recog){recog.stop();recog=null;}
  recOn=false;clearInterval(recInt);
  document.getElementById('micbtn').classList.remove('rec');
  document.getElementById('vbar').classList.remove('on');
  const txt=document.getElementById('tinput').value.trim();
  if(txt)send(txt,true);
}
function fmt(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}

function handleUp(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=e=>{
    upB64=e.target.result.split(',')[1];
    document.getElementById('uparea').innerHTML=`<div class="uprev"><img src="${e.target.result}"><span style="flex:1;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.name}</span><button onclick="rmUp()" style="border:none;background:none;color:var(--td);font-size:17px;cursor:pointer">×</button></div>`;
  };
  r.readAsDataURL(f);inp.value='';
}
function rmUp(){upB64=null;document.getElementById('uparea').innerHTML='';}

function mobTab(tab){
  const cp=document.getElementById('cpanel'),pp=document.getElementById('ppanel');
  const mc=document.getElementById('mt-chat'),mp=document.getElementById('mt-prev');
  if(tab==='chat'){cp.classList.remove('hide');pp.classList.remove('show');mc.classList.add('on');mp.classList.remove('on');}
  else{cp.classList.add('hide');pp.classList.add('show');mc.classList.remove('on');mp.classList.add('on');scalePreview();}
}

function handleKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}
function ar(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,90)+'px';}
function esc(s){return(s||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function toast(msg,d){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),d||4000);}
function loading(on,txt){document.getElementById('loading').classList.toggle('on',on);if(txt)document.getElementById('load-txt').textContent=txt;}
window.addEventListener('resize',scalePreview);
</script>
</body>
</html>
