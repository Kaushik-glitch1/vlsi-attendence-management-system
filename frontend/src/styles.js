export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{
  --ink:#0B1220; --ink-2:#0E1730; --ink-3:#16213f;
  --primary:#4263FF; --primary-2:#2E49D8; --primary-soft:#EEF1FF;
  --copper:#E0853D; --copper-soft:#FCEFE2;
  --bg:#F4F6F9; --card:#FFFFFF; --line:#E9ECF2; --line-2:#F0F2F6;
  --text:#0D1426; --muted:#727E92; --faint:#9AA3B2;
  --green:#15A05A; --green-soft:#E7F6EE; --amber:#D98A0B; --amber-soft:#FBF1DD; --red:#DC3A3A; --red-soft:#FBEAEA;
  --mono:'IBM Plex Mono', ui-monospace, monospace;
}
*{box-sizing:border-box}
.app, .login{font-family:'Inter', ui-sans-serif, system-ui, sans-serif; color:var(--text); -webkit-font-smoothing:antialiased;}
button{font-family:inherit; cursor:pointer; border:none; background:none}
input,select{font-family:inherit; border:none; outline:none; background:none; color:var(--text); width:100%}
@media (prefers-reduced-motion: reduce){*{animation:none!important; transition:none!important}}
@keyframes fadeUp{from{opacity:0; transform:translateY(8px)}to{opacity:1; transform:none}}
.fade-up{animation:fadeUp .5s cubic-bezier(.2,.7,.2,1) both}
.content{animation:fadeUp .4s ease both}

.logo{display:flex; align-items:center; gap:9px; font-weight:700; font-size:17px; letter-spacing:-.01em; color:var(--ink)}
.logo-lg{color:#fff; font-size:20px}
.logo-mark{width:30px; height:30px; border-radius:8px; background:linear-gradient(140deg,#4263FF,#2E49D8); color:#fff; display:grid; place-items:center; box-shadow:0 4px 14px rgba(66,99,255,.4)}
.eyebrow{font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin:22px 0 10px}
.login-brand .eyebrow{color:rgba(255,255,255,.65)}

/* ---- LOGIN ---- */
.login{min-height:100vh; display:grid; grid-template-columns:1.05fr 1fr; background:var(--bg)}
.login-brand{position:relative; overflow:hidden}
.login-brand-tint{position:absolute; inset:0; background:linear-gradient(160deg, rgba(8,14,30,.82), rgba(13,25,60,.93))}
.login-brand-inner{position:relative; height:100%; padding:44px 52px; display:flex; flex-direction:column; color:#fff}
.login-h{font-size:34px; line-height:1.16; font-weight:700; letter-spacing:-.02em; margin:0; max-width:460px}
.login-p{color:rgba(255,255,255,.74); font-size:15px; line-height:1.6; margin:16px 0 0; max-width:440px}
.login-feats{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:30px; max-width:440px}
.login-feat{display:flex; align-items:center; gap:9px; font-size:13.5px; color:rgba(255,255,255,.9); background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); padding:11px 13px; border-radius:11px}
.login-feat svg{color:#9DB0FF}
.login-form-wrap{display:flex; align-items:center; justify-content:center; padding:40px}
.login-form{width:100%; max-width:404px}
.fld-l{display:block; font-size:12.5px; font-weight:600; color:var(--muted); margin-bottom:7px}
.fld{display:flex; align-items:center; gap:10px; height:46px; padding:0 13px; background:#fff; border:1px solid var(--line); border-radius:11px; transition:.15s}
.fld:focus-within{border-color:var(--primary); box-shadow:0 0 0 3px rgba(66,99,255,.12)}
.login-row{display:flex; align-items:center; justify-content:space-between; margin-top:16px}
.role-grid{display:grid; grid-template-columns:1fr 1fr; gap:9px}
.role-card{position:relative; display:flex; align-items:center; gap:10px; padding:10px; border:1px solid var(--line); border-radius:12px; background:#fff; text-align:left; transition:.15s}
.role-card:hover{border-color:#cdd6ff; background:#fcfdff}
.role-card.on{border-color:var(--primary); background:var(--primary-soft); box-shadow:0 0 0 1px var(--primary) inset}
.role-card img{width:34px; height:34px; border-radius:9px; object-fit:cover; background:#e7eaf0}
.role-card-n{font-size:13px; font-weight:600; color:var(--ink)}
.role-card-s{font-size:11px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px}
.role-card-tick{position:absolute; top:8px; right:8px; width:18px; height:18px; border-radius:6px; background:var(--primary); color:#fff; display:grid; place-items:center}
.sso-row{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px}
.sso{display:flex; align-items:center; justify-content:center; gap:8px; height:42px; border:1px solid var(--line); border-radius:11px; background:#fff; font-size:13px; font-weight:600; color:var(--text); transition:.15s}
.sso:hover{background:#f7f8fb}

/* ---- APP SHELL ---- */
.app{min-height:100vh; display:grid; grid-template-columns:258px 1fr; background:var(--bg)}
.side{background:var(--ink); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; border-right:1px solid rgba(255,255,255,.06)}
.side-brand{display:flex; align-items:center; gap:9px; padding:18px 18px 16px; color:#fff; font-weight:700; font-size:17px}
.side-brand-t{letter-spacing:-.01em}
.side-x{display:none; margin-left:auto; color:rgba(255,255,255,.6)}
.side-nav{flex:1; overflow-y:auto; padding:6px 12px 12px}
.side-nav::-webkit-scrollbar{width:6px} .side-nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12); border-radius:6px}
.nav-group{margin-top:14px}
.nav-label{font-size:10.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.34); padding:0 10px 7px}
.nav-item{display:flex; align-items:center; gap:11px; width:100%; padding:9px 10px; border-radius:9px; color:rgba(255,255,255,.72); font-size:13.5px; font-weight:500; transition:.13s; position:relative}
.nav-item svg{color:rgba(255,255,255,.55); transition:.13s}
.nav-item:hover{background:rgba(255,255,255,.06); color:#fff}
.nav-item:hover svg{color:#fff}
.nav-item.on{background:linear-gradient(100deg, rgba(66,99,255,.92), rgba(46,73,216,.92)); color:#fff; box-shadow:0 6px 18px rgba(66,99,255,.35)}
.nav-item.on svg{color:#fff}
.nav-badge{margin-left:auto; min-width:18px; height:18px; padding:0 5px; border-radius:9px; background:var(--copper); color:#fff; font-size:11px; font-weight:600; display:grid; place-items:center; font-family:var(--mono)}
.nav-item.on .nav-badge{background:rgba(255,255,255,.25)}
.side-foot{padding:12px; border-top:1px solid rgba(255,255,255,.07); position:relative}
.role-switch{display:flex; align-items:center; gap:10px; width:100%; padding:9px; border-radius:11px; background:rgba(255,255,255,.06); color:#fff; transition:.13s}
.role-switch:hover{background:rgba(255,255,255,.1)}
.role-switch img{width:34px; height:34px; border-radius:9px; object-fit:cover; background:#2a3550}
.rs-n{font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.rs-r{font-size:11px; color:rgba(255,255,255,.55)}

.main{min-width:0; display:flex; flex-direction:column}
.top{height:62px; background:rgba(255,255,255,.85); backdrop-filter:blur(10px); border-bottom:1px solid var(--line); display:flex; align-items:center; gap:14px; padding:0 22px; position:sticky; top:0; z-index:30}
.top-burger{display:none; color:var(--ink)}
.top-crumb{display:flex; align-items:center; gap:7px; font-size:13.5px}
.top-search{flex:1; max-width:440px; margin-left:8px; display:flex; align-items:center; gap:9px; height:38px; padding:0 12px; background:var(--bg); border:1px solid var(--line); border-radius:10px; transition:.15s}
.top-search:focus-within{background:#fff; border-color:var(--primary); box-shadow:0 0 0 3px rgba(66,99,255,.1)}
.top-search input{font-size:13.5px}
.kbd{font-family:var(--mono); font-size:11px; color:var(--faint); border:1px solid var(--line); border-radius:5px; padding:1px 6px; background:#fff}
.top-right{display:flex; align-items:center; gap:12px; margin-left:auto}
.top-date{display:flex; align-items:center; gap:7px; padding:7px 11px; border:1px solid var(--line); border-radius:9px; color:var(--muted)}
.icon-btn{position:relative; width:38px; height:38px; border-radius:9px; display:grid; place-items:center; color:var(--text); transition:.13s}
.icon-btn:hover{background:var(--bg)}
.dot-red{position:absolute; top:8px; right:9px; width:7px; height:7px; border-radius:50%; background:var(--red); box-shadow:0 0 0 2px #fff}
.top-user{display:flex; align-items:center; gap:9px; padding:5px 8px 5px 5px; border-radius:11px; transition:.13s}
.top-user:hover{background:var(--bg)}
.top-user img{width:34px; height:34px; border-radius:9px; object-fit:cover; background:#e7eaf0}
.tu-meta{text-align:left}
.tu-n{font-size:13px; font-weight:600; color:var(--ink); line-height:1.2}
.tu-r{font-size:11px; color:var(--muted)}
.pop{position:absolute; top:48px; right:0; width:340px; background:#fff; border:1px solid var(--line); border-radius:14px; box-shadow:0 20px 50px rgba(8,14,30,.18); z-index:50; overflow:hidden; animation:fadeUp .18s ease both}
.pop-sm{width:248px}
.pop-h{display:flex; align-items:center; justify-content:space-between; padding:13px 15px; font-weight:600; font-size:14px; border-bottom:1px solid var(--line-2)}
.pop-row{display:flex; gap:11px; padding:11px 15px; border-bottom:1px solid var(--line-2); transition:.12s}
.pop-row:hover{background:var(--bg)}
.pop-ico{width:30px; height:30px; border-radius:8px; display:grid; place-items:center; flex-shrink:0}
.pop-t{font-size:13px; font-weight:500; color:var(--text); line-height:1.3}
.pop-s{font-size:11.5px; color:var(--muted); margin-top:2px}
.pop-foot{padding:11px; text-align:center; font-size:13px; font-weight:600; color:var(--primary)}
.pm-head{display:flex; gap:10px; align-items:center; padding:13px 14px; border-bottom:1px solid var(--line-2)}
.pm-head img{width:38px; height:38px; border-radius:9px; object-fit:cover; background:#e7eaf0}
.pm-i{display:flex; align-items:center; gap:11px; width:100%; padding:9px 14px; font-size:13px; color:var(--text); transition:.12s}
.pm-i:hover{background:var(--bg)}
.pm-i svg{color:var(--muted)}
.pm-danger{color:var(--red); border-top:1px solid var(--line-2)} .pm-danger svg{color:var(--red)}

.scrim{display:none}

/* ---- CONTENT ---- */
.content{padding:24px 26px 44px; max-width:1320px; margin:0 auto; width:100%}
.page-head{display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap}
.page-title{font-size:23px; font-weight:700; letter-spacing:-.02em; color:var(--ink); margin:0}
.page-sub{color:var(--muted); font-size:13.5px; margin:5px 0 0}
.page-actions{display:flex; gap:9px}

.grid{display:grid; gap:16px}
.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.split{display:grid; grid-template-columns:1fr 360px; gap:16px}
@media(max-width:1080px){.g4{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:1fr}.split{grid-template-columns:1fr}}

.card{background:var(--card); border:1px solid var(--line); border-radius:15px; padding:18px 20px; box-shadow:0 1px 2px rgba(11,18,32,.03)}
.card-head{display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:4px}
.card-title{font-size:15px; font-weight:600; color:var(--ink); letter-spacing:-.01em}
.card-sub{font-size:12.5px; color:var(--muted); margin-top:3px}

.chip{display:inline-flex; align-items:center; gap:5px; height:23px; padding:0 9px; border-radius:7px; font-size:11.5px; font-weight:600; line-height:1; white-space:nowrap}
.chip-slate{background:#eef1f5; color:#5a6678} .chip-blue{background:var(--primary-soft); color:var(--primary-2)}
.chip-green{background:var(--green-soft); color:#0e7a44} .chip-amber{background:var(--amber-soft); color:#9a6406}
.chip-red{background:var(--red-soft); color:#b62c2c} .chip-copper{background:var(--copper-soft); color:#a85a26}

.btn{display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px; border-radius:10px; font-size:13.5px; font-weight:600; transition:.14s; white-space:nowrap}
.btn-sm{height:32px; padding:0 11px; font-size:12.5px; border-radius:8px}
.btn-primary{background:var(--primary); color:#fff; box-shadow:0 4px 12px rgba(66,99,255,.28)}
.btn-primary:hover{background:var(--primary-2)}
.btn-ghost{background:#fff; color:var(--text); border:1px solid var(--line)}
.btn-ghost:hover{background:var(--bg); border-color:#dde2ea}
.btn-danger{background:var(--red-soft); color:#c02e2e} .btn-danger:hover{background:#f7dada}
.btn-copper{background:var(--copper); color:#fff} .btn-copper:hover{filter:brightness(.96)}

.bar{flex:1; height:7px; border-radius:6px; background:#EEF1F6; overflow:hidden; min-width:60px}
.bar-fill{height:100%; border-radius:6px; transition:width .6s cubic-bezier(.2,.7,.2,1)}

.kpi{padding:16px 17px}
.kpi-top{display:flex; align-items:center; justify-content:space-between; margin-bottom:13px}
.kpi-ico{width:34px; height:34px; border-radius:9px; display:grid; place-items:center}
.kpi-delta{display:flex; align-items:center; gap:3px; font-size:11.5px; font-weight:600; padding:3px 7px; border-radius:7px}
.kpi-delta.up{color:#0e7a44; background:var(--green-soft)} .kpi-delta.down{color:#b62c2c; background:var(--red-soft)}
.kpi-val{font-size:27px; font-weight:600; color:var(--ink); letter-spacing:-.02em; line-height:1; display:flex; align-items:baseline; gap:3px}
.kpi-unit{font-size:15px; color:var(--muted); font-family:var(--mono)}
.kpi-label{font-size:12.5px; color:var(--muted); margin-top:7px}

.alert-bar{display:flex; align-items:center; gap:14px; padding:14px 16px; background:linear-gradient(100deg,#FFF6F6,#FFFBF2); border:1px solid #F4D6D0; border-radius:14px; font-size:13.5px; color:#7a3a30}
.alert-bar strong{color:#b62c2c}
.alert-ico{width:36px; height:36px; border-radius:10px; background:#FCE5E1; color:var(--red); display:grid; place-items:center; flex-shrink:0}

.standing-rows{margin-top:8px; border-top:1px solid var(--line-2)}
.standing-rows>div{display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line-2); font-size:13px; color:var(--muted)}
.standing-rows>div span{color:var(--text)}

.subj-list{margin-top:6px}
.subj{display:grid; grid-template-columns:78px 1fr 130px 46px; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--line-2)}
.subj:last-child{border-bottom:none}
.subj-code{font-size:12px; color:var(--muted)}
.subj-name{font-size:13.5px; font-weight:500; color:var(--text)}
.subj-pct{font-size:13px; font-weight:600; text-align:right}

.today-list{margin-top:6px}
.today-row{display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--line-2); position:relative}
.today-row:last-child{border-bottom:none}
.today-t{font-size:12.5px; color:var(--muted); width:42px}
.today-line{width:9px; height:9px; border-radius:50%; background:#cdd4e0; box-shadow:0 0 0 3px #eef1f6}
.today-line.done{background:var(--green); box-shadow:0 0 0 3px var(--green-soft)}
.today-name{font-size:13.5px; font-weight:500; color:var(--text)}
.today-meta{font-size:11.5px; color:var(--muted); margin-top:2px}

.heat{display:flex; gap:5px}
.heat-col{display:flex; flex-direction:column; gap:5px; flex:1}
.heat-cell{width:100%; aspect-ratio:1; border-radius:4px; border:1px solid rgba(11,18,32,.04); transition:transform .12s}
.heat-cell:hover{transform:scale(1.18)}

.proj-mini{overflow:hidden}
.proj-mini-t{font-size:13.5px; font-weight:600; color:var(--ink); margin-top:9px; line-height:1.3}

/* faculty mark grid */
.mark-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; max-height:420px; overflow-y:auto; padding-right:4px}
.mark-grid::-webkit-scrollbar{width:6px}.mark-grid::-webkit-scrollbar-thumb{background:#d4dae6;border-radius:6px}
.mark-card{display:flex; align-items:center; gap:11px; padding:10px 12px; border-radius:12px; border:1px solid var(--line); background:#fff; transition:.13s}
.mark-card.on{border-color:#bfe6d0; background:#F4FBF7}
.mark-card.off{border-color:#f3d3cf; background:#FEF6F5}
.mark-n{font-size:13px; font-weight:600; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.mark-id{font-size:11px; color:var(--muted)}
.mark-state{flex-shrink:0}
.mark-card.on .mark-state{color:var(--green)} .mark-card.off .mark-state{color:var(--red)}
.mark-foot{display:flex; align-items:center; gap:8px; margin-top:14px; padding-top:14px; border-top:1px solid var(--line-2)}
.method{display:flex; align-items:center; gap:5px; font-size:11.5px; font-weight:600; color:var(--muted); padding:5px 9px; border-radius:7px; background:var(--bg)}
.method.on{background:var(--primary-soft); color:var(--primary-2)}

.risk-list{margin-top:6px}
.risk-row{display:flex; align-items:center; gap:11px; padding:10px 0; border-bottom:1px solid var(--line-2)}
.risk-row:last-child{border-bottom:none}
.risk-n{font-size:13px; font-weight:600; color:var(--ink)} .risk-id{font-size:11px; color:var(--muted)}

.dist-list{margin-top:8px}
.dist-row{display:flex; align-items:center; gap:12px; padding:9px 0}
.dist-t{font-size:12.5px; color:var(--text); width:64px}
.dist-bar{flex:1; height:9px; background:#EEF1F6; border-radius:6px; overflow:hidden}
.dist-foot{display:flex; align-items:baseline; gap:9px; margin-top:8px; padding-top:14px; border-top:1px solid var(--line-2); color:var(--muted); font-size:12.5px}

/* table */
.tbl{width:100%; border-collapse:collapse; margin-top:8px}
.tbl thead th{text-align:left; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--faint); padding:11px 20px; border-bottom:1px solid var(--line); background:#FBFCFD}
.tbl tbody td{padding:13px 20px; border-bottom:1px solid var(--line-2); font-size:13px; color:var(--text)}
.tbl tbody tr{transition:.12s} .tbl tbody tr:hover{background:#FBFCFE}
.tbl tbody tr:last-child td{border-bottom:none}
.tcell-user{display:flex; align-items:center; gap:11px}
.tc-n{font-size:13px; font-weight:600; color:var(--ink)} .tc-s{font-size:11.5px; color:var(--muted)}

/* lab cards */
.lab-card{overflow:hidden; position:relative}
.lab-photo{height:120px; position:relative; display:block}
.lab-live{position:absolute; top:12px; left:12px; display:flex; align-items:center; gap:6px; padding:5px 10px; border-radius:8px; font-size:11px; font-weight:600; background:rgba(8,14,30,.6); backdrop-filter:blur(6px); color:#fff}
.lab-live .pulse{width:7px; height:7px; border-radius:50%; background:#39E07C; box-shadow:0 0 0 0 rgba(57,224,124,.6); animation:pl 1.6s infinite}
@keyframes pl{0%{box-shadow:0 0 0 0 rgba(57,224,124,.55)}70%{box-shadow:0 0 0 7px rgba(57,224,124,0)}100%{box-shadow:0 0 0 0 rgba(57,224,124,0)}}
.lab-body{padding:14px 16px}
.seat-grid{display:grid; grid-template-columns:repeat(10,1fr); gap:4px; margin-top:12px}
.seat{aspect-ratio:1; border-radius:3px}

/* internship pipeline */
.pipe{display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:16px}
.pipe-col{background:var(--bg); border:1px solid var(--line); border-radius:13px; padding:12px; min-height:200px}
.pipe-h{display:flex; align-items:center; justify-content:space-between; font-size:12.5px; font-weight:600; color:var(--ink); margin-bottom:11px}
.pipe-card{background:#fff; border:1px solid var(--line); border-radius:11px; padding:11px; margin-bottom:9px; box-shadow:0 1px 2px rgba(11,18,32,.03)}
.pipe-card:hover{border-color:#cdd6ff}

/* placement company tiles */
.co-tile{display:flex; align-items:center; gap:12px; padding:13px 15px; border:1px solid var(--line); border-radius:13px; background:#fff; transition:.13s}
.co-tile:hover{border-color:#cdd6ff; transform:translateY(-1px)}
.co-mark{width:42px; height:42px; border-radius:11px; display:grid; place-items:center; color:#fff; font-weight:700; font-size:16px; font-family:var(--mono)}

/* timetable */
.tt{width:100%; border-collapse:separate; border-spacing:6px; margin-top:8px}
.tt th{font-size:11.5px; font-weight:600; color:var(--muted); padding:6px; text-align:center}
.tt .tt-time{font-family:var(--mono); font-size:11.5px; color:var(--faint); white-space:nowrap}
.tt-cell{border-radius:10px; padding:9px 10px; min-height:54px; vertical-align:top}
.tt-empty{background:var(--bg); border:1px dashed var(--line)}
.tt-code{font-family:var(--mono); font-size:11px; font-weight:600}
.tt-name{font-size:12px; font-weight:600; margin-top:2px}

/* leave + settings */
.seg{display:inline-flex; background:var(--bg); border:1px solid var(--line); border-radius:10px; padding:3px}
.seg-i{padding:6px 13px; border-radius:8px; font-size:12.5px; font-weight:600; color:var(--muted); transition:.12s}
.seg-i.on{background:#fff; color:var(--ink); box-shadow:0 1px 3px rgba(11,18,32,.1)}
.set-row{display:flex; align-items:center; justify-content:space-between; gap:16px; padding:15px 0; border-bottom:1px solid var(--line-2)}
.set-row:last-child{border-bottom:none}
.set-t{font-size:13.5px; font-weight:600; color:var(--ink)} .set-s{font-size:12px; color:var(--muted); margin-top:2px}
.toggle{width:42px; height:24px; border-radius:13px; background:var(--primary); position:relative; flex-shrink:0}
.toggle.off{background:#d4d9e2}
.toggle span{position:absolute; top:3px; left:21px; width:18px; height:18px; border-radius:50%; background:#fff; transition:.18s; box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle.off span{left:3px}
.device-row{display:flex; align-items:center; gap:13px; padding:13px 0; border-bottom:1px solid var(--line-2)}
.device-row:last-child{border-bottom:none}
.device-ico{width:38px; height:38px; border-radius:10px; background:var(--bg); display:grid; place-items:center; color:var(--muted)}

@media(max-width:1080px){
  .app{grid-template-columns:1fr}
  .side{position:fixed; left:0; top:0; z-index:60; width:262px; transform:translateX(-100%); transition:transform .24s cubic-bezier(.2,.7,.2,1)}
  .side-open{transform:translateX(0); box-shadow:0 20px 60px rgba(8,14,30,.4)}
  .side-x{display:block}
  .top-burger{display:grid; place-items:center}
  .top-crumb{display:none}
  .scrim{display:block; position:fixed; inset:0; background:rgba(8,14,30,.45); z-index:55; backdrop-filter:blur(2px)}
  .login{grid-template-columns:1fr}
  .login-brand{display:none}
}
@media(max-width:560px){
  .g4,.g2{grid-template-columns:1fr}
  .pipe{grid-template-columns:1fr}
  .top-date,.tu-meta{display:none}
  .mark-grid{grid-template-columns:1fr}
  .content{padding:18px 16px 40px}
}
`;
