/* PROGRESO GLOBAL (pedido de Luca, 20/11: «actualmente el único que accede al repo soy yo, ¿podemos hacer que el progreso sea global?»).
   El progreso de todos los dispositivos vive en el repo, rama «datos», archivo progreso.json (la rama no es la de GitHub Pages: no reconstruye el
   sitio ni ensucia el historial de main). Se carga PRIMERO (antes de base.js) porque las secciones leen localStorage al cargar.
   - Usa el mismo token de la pestaña Errores (localStorage "gh1"), que necesita además el permiso Contents: read and write. El token NUNCA se sube.
   - Claves sincronizadas (KEYS). No renombrarlas: ver reglas de ids fijos en base.js.
   - Al abrir: baja el archivo, lo FUSIONA con lo local y, si llegó algo de otro dispositivo, recarga la página una vez para que las secciones lo lean.
   - Al guardar cualquier clave (se intercepta localStorage.setItem): sube a los 30 s; también al salir de la página. Si otro dispositivo subió en el
     medio (409/422), baja, fusiona y reintenta.
   - FUSIÓN (estudiar en el celular y en la compu no pisa nada): sw1/sw1b por bloque (gana el lado que lo vio más recientemente; lo terminado o
     aprobado se une; contadores al máximo; días de la racha unidos), err1 por error (unión por fecha+bloque+pregunta, la nota más nueva; conteos
     al máximo), el resto entera según cuál se guardó último. */
(()=>{const KEYS=["sw1","sw1b","err1","est2","bq1","cd1","mu1"],REPO="Luca1196/Luca1196.github.io",BR="datos",FILE="progreso.json",API="https://api.github.com/repos/"+REPO;
 const LS=window.localStorage,raw=Storage.prototype.setItem,get=k=>{try{return LS.getItem(k)}catch(e){return null}},put=(k,v)=>{try{raw.call(LS,k,v)}catch(e){}};
 const meta=()=>{try{return JSON.parse(get("syn1")||"{}")}catch(e){return{}}},setMeta=m=>put("syn1",JSON.stringify(m));
 const tok=()=>get("gh1")||"",H=()=>({Authorization:"Bearer "+tok(),Accept:"application/vnd.github+json"});
 let T=null,busy=0,dirty=0;const S={st:"",at:0};window.SYNC=S;
 /* marca qué clave cambió y cuándo (para la fusión) y programa la subida */
 Storage.prototype.setItem=function(k,v){raw.call(this,k,v);if(this===LS&&KEYS.includes(k)){const m=meta();(m.mt=m.mt||{})[k]=Date.now();setMeta(m);dirty=1;clearTimeout(T);T=setTimeout(push,30000)}};
 const J=s=>{try{return JSON.parse(s)}catch(e){return null}};
 const mx=(a,b)=>Math.max(+a||0,+b||0),U=(a,b)=>Object.assign({},a||{},b||{});
 function mSW(a,b,ta,tb){const n=ta>=tb?a:b,r=Object.assign({},b,a,n),sa=a.seen||{},sb=b.seen||{},seen={};
  new Set([...Object.keys(sa),...Object.keys(sb)]).forEach(i=>seen[i]=mx(sa[i],sb[i]));r.seen=seen;
  const side=id=>(sa[id]||0)>=(sb[id]||0)?a:b;
  const box={};new Set([...Object.keys(a.box||{}),...Object.keys(b.box||{})]).forEach(k=>{const id=k.slice(0,k.lastIndexOf(":")),s=side(id);box[k]=(s.box||{})[k]!=null?s.box[k]:((a.box||{})[k]!=null?a.box[k]:b.box[k])});r.box=box;
  const bst={};new Set([...Object.keys(a.bst||{}),...Object.keys(b.bst||{})]).forEach(id=>{const s=side(id);bst[id]=(s.bst||{})[id]||(a.bst||{})[id]||(b.bst||{})[id]});r.bst=bst;
  r.kok=U(a.kok,b.kok);r.bqok=U(a.bqok,b.bqok);["xp","n","ok","best"].forEach(k=>r[k]=mx(a[k],b[k]));r.idv=mx(a.idv,b.idv)||undefined;
  if(a.mt||b.mt){const A=a.mt||{},B=b.mt||{},fd={};new Set([...Object.keys(A.fd||{}),...Object.keys(B.fd||{})]).forEach(i=>{const x=(A.fd||{})[i],y=(B.fd||{})[i];fd[i]=x&&y?(x<y?x:y):(x||y)});
   r.mt=Object.assign({},n.mt||{},{rd:U(A.rd,B.rd),fd,v:mx(A.v,B.v)})}
  return r}
 function mErr(a,b,ta,tb){const n=ta>=tb?a:b,r=Object.assign({},b,a,n),key=e=>e.t+"|"+e.w+"|"+e.g+"|"+(e.q||"").slice(0,80),M=new Map();
  const NK=new Map((n.log||[]).map(e=>[key(e),e]));
  (a.log||[]).concat(b.log||[]).forEach(e=>{const k=key(e),o=M.get(k);if(!o)M.set(k,e);else{const w=NK.get(k)||e;M.set(k,Object.assign({},o,e,w,{gi:o.gi||e.gi||w.gi,gn:w.gn||o.gn||e.gn}))}});
  r.log=[...M.values()].sort((x,y)=>x.t-y.t).slice(-4000);
  const st={};new Set([...Object.keys(a.st||{}),...Object.keys(b.st||{})]).forEach(k=>{const x=(a.st||{})[k]||[0,0],y=(b.st||{})[k]||[0,0];st[k]=[mx(x[0],y[0]),mx(x[1],y[1])]});r.st=st;
  const day={};new Set([...Object.keys(a.day||{}),...Object.keys(b.day||{})]).forEach(d=>{const x=(a.day||{})[d]||{},y=(b.day||{})[d]||{},o={};new Set([...Object.keys(x),...Object.keys(y)]).forEach(k=>{const p=x[k]||[0,0],q=y[k]||[0,0];o[k]=[mx(p[0],q[0]),mx(p[1],q[1])]});day[d]=o});r.day=day;
  r.exp=mx(a.exp,b.exp);return r}
 /* fusiona lo local con lo remoto: devuelve {k:{m,d}} */
 function merge(rem){const m=meta().mt||{},out={};
  KEYS.forEach(k=>{const L=get(k),R=rem[k],tl=m[k]||0,tr=R?R.m||0:0;
   if(L==null&&!R)return;if(!R){out[k]={m:tl,d:L};return}if(L==null||L==R.d){out[k]={m:Math.max(tl,tr),d:R.d};return}
   const a=J(L),b=J(R.d);let d;
   if(a&&b&&(k=="sw1"||k=="sw1b"))d=JSON.stringify(mSW(a,b,tl,tr));else if(a&&b&&k=="err1")d=JSON.stringify(mErr(a,b,tl,tr));else d=tl||tr?(tl>=tr?L:R.d):(L.length>=R.d.length?L:R.d);/* primera sincronización de un dispositivo (sin fechas): gana el que tiene más datos */
   out[k]={m:Math.max(tl,tr),d}});return out}
 const b64=s=>btoa(unescape(encodeURIComponent(s)));
 async function pull(){const r=await fetch(API+"/contents/"+FILE+"?ref="+BR+"&t="+Date.now(),{headers:H(),cache:"no-store"});
  if(r.status==404)return{sha:null,keys:{}};if(!r.ok)throw new Error("GitHub "+r.status);const j=await r.json();
  let txt=j.content&&j.encoding=="base64"?decodeURIComponent(escape(atob(j.content.replace(/\n/g,"")))):"";
  if(!txt&&j.download_url!==undefined){const q=await fetch(API+"/contents/"+FILE+"?ref="+BR+"&t="+Date.now(),{headers:Object.assign(H(),{Accept:"application/vnd.github.raw+json"}),cache:"no-store"});if(!q.ok)throw new Error("GitHub "+q.status);txt=await q.text()}
  const o=J(txt)||{};return{sha:j.sha,keys:o.keys||{}}}
 async function ensureBranch(){const r=await fetch(API+"/git/ref/heads/"+BR,{headers:H()});if(r.ok)return;
  const m=await fetch(API+"/git/ref/heads/main",{headers:H()});if(!m.ok)throw new Error("GitHub "+m.status);const sha=(await m.json()).object.sha;
  const c=await fetch(API+"/git/refs",{method:"POST",headers:H(),body:JSON.stringify({ref:"refs/heads/"+BR,sha})});if(!c.ok&&c.status!=422)throw new Error("GitHub "+c.status)}
 async function upload(keys,sha){const body={message:"progreso "+new Date().toLocaleString("es-UY"),branch:BR,content:b64(JSON.stringify({v:1,at:Date.now(),keys}))};if(sha)body.sha=sha;
  return fetch(API+"/contents/"+FILE,{method:"PUT",headers:H(),body:JSON.stringify(body)})}
 /* escribe en local lo fusionado; devuelve true si cambió algo */
 function apply(keys){let ch=0;const m=meta();m.mt=m.mt||{};Object.entries(keys).forEach(([k,v])=>{if(get(k)!==v.d){put(k,v.d);ch=1}m.mt[k]=v.m});setMeta(m);return ch}
 async function push(){if(!tok()||busy||!navigator.onLine)return;busy=1;clearTimeout(T);
  try{for(let i=0;i<3;i++){const R=await pull(),K=merge(R.keys);apply(K);if(!R.sha)await ensureBranch();const u=await upload(K,R.sha);
    if(u.ok){dirty=0;S.st="";S.at=Date.now();break}if(u.status!=409&&u.status!=422){S.st=u.status==401||u.status==403||u.status==404?"El token no tiene permiso de Contents (error "+u.status+").":"GitHub respondió "+u.status+".";break}}}
  catch(e){S.st="Sin conexión con GitHub; se reintenta solo."}busy=0}
 /* al abrir (y al volver a la pestaña): baja, fusiona y, si llegó algo nuevo, recarga una vez */
 async function start(){if(!tok()||!navigator.onLine)return;busy=1;
  try{const R=await pull(),K=merge(R.keys),ch=apply(K);S.at=Date.now();S.st="";
   const same=KEYS.every(k=>(K[k]&&K[k].d)==(R.keys[k]&&R.keys[k].d));busy=0;if(!same)push();
   if(ch){const last=+(sessionStorage.getItem("syr")||0);if(Date.now()-last>15000){sessionStorage.setItem("syr",Date.now());location.reload()}}}
  catch(e){S.st=/401|403|404/.test(e.message)?"El token no tiene permiso de Contents ("+e.message+").":"Sin conexión con GitHub; se reintenta solo.";busy=0}}
 S.push=push;S.start=start;
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState=="hidden"){if(dirty)push()}else if(Date.now()-S.at>60000&&!dirty)start()});
 start()})();
