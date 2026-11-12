/* SECCIÓN MÚSICA → OÍDO (pestaña 4) */
/* DECISIONES DIDÁCTICAS (nov 2026): Luca dejó de practicar canciones (Simon de tónicas, quitado) y ahora entrena el oído.
   - Una "tarjeta" por nota (12 clases de altura). Suena una nota del bajo (posición al azar, trastes 0-12) y hay que
     tocarla en el mástil hasta encontrarla o rendirse. Vale cualquier octava/posición con la misma nota.
   - Volver a tocar una nota ya probada (misma nota, cualquier octava) solo la hace sonar: no cuenta como intento (pedido de Luca).
   - Cada toque equivocado suena (para comparar) y se anota el intervalo de error: distancia más corta desde la nota
     correcta a la tocada, con signo (+ = tocó más arriba), de 1 a 6 semitonos (2m, 2M, 3m, 3M, 4J, tritono).
   - Registro en Errores con logA("oi","mu","Nota X", ok, {a, f: fallos, iv: [semitonos], rd: se rindió}).
     ok = encontrada al primer toque. La exportación para Claude tiene una sección «Oído» (por nota y por intervalo).
   - Se intercalan en Principal (pestaña 3): 1 tarjeta de oído cada OI_CADA tarjetas (envuelve swNew de nucleo.js).
   - Elección de nota: pesa más la que más falla y la que nunca salió; no repite la anterior. Stats en S3.oi (mu1).
   - REGISTRO PROGRESIVO (pedido de Luca): el oído distingue mejor el registro medio, así que se empieza por las notas
     más agudas del bajo y se baja a medida que mejora. OIR = niveles por semitono (0 = B grave 31 Hz, 25 = C3 131 Hz,
     49 = C5 523 Hz). S3.oiL = nivel; S3.oiH = últimos resultados del nivel (1 = al primer intento). Sube de nivel con
     ≥ 80 % de aciertos al primer intento en las últimas 20 tarjetas. */
const NN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const MSTR=[["C",0,130.81],["G",7,98],["D",2,73.42],["A",9,55],["E",4,41.2],["B",11,30.87]],MF=25,OI_CADA=4;
let S3=(()=>{try{return JSON.parse(localStorage.getItem("mu1")||"{}")}catch(e){return{}}})();
const mSave=()=>{try{localStorage.setItem("mu1",JSON.stringify(S3))}catch(e){}};
let MT=[],MAU=null,OI=null,OIN=0;
const mPc=(s,f)=>(MSTR[s][1]+f)%12,mNm=(s,f)=>NN[mPc(s,f)],mSt=(s,f)=>Math.round(12*Math.log2(MSTR[s][2]*Math.pow(2,f/12)/30.87));
const OIR=[[25,49,"agudo (C3–C5)"],[18,49,"medio (F2–C5)"],[10,49,"medio-grave (A1–C5)"],[0,49,"todo el bajo (B0–C5)"]],oiLv=()=>Math.min(S3.oiL||0,OIR.length-1);
const IVN={1:"2m",2:"2M",3:"3m",4:"3M",5:"4J",6:"tritono"},ivT=d=>(d>0?"+":"−")+IVN[Math.abs(d)];
function muStop(){MT.forEach(clearTimeout);MT=[]}
function mTone(s,f){if(S3.snd===0)return;try{MAU=MAU||new(window.AudioContext||window.webkitAudioContext)();const a=MAU;if(a.state=="suspended")a.resume();const fr=MSTR[s][2]*Math.pow(2,f/12),t=a.currentTime,g=a.createGain(),lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=900;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+1.1);lp.connect(g);g.connect(a.destination);[[1,"sawtooth",.6],[2,"triangle",.5],[3,"sine",.25]].forEach(([m,ty,v])=>{const o=a.createOscillator(),h=a.createGain();o.type=ty;o.frequency.value=fr*m;h.gain.value=v;o.connect(h);h.connect(lp);o.start(t);o.stop(t+1.15)})}catch(e){}}

/* ===== Tarjeta de oído ===== */
function oiPick(){const st=S3.oi||{},w=NN.map((n,i)=>{if(OI&&OI.pc==i)return 0;const x=st[n]||{n:0,f:0};return x.n?1+4*x.f/x.n:3});
 let r=Math.random()*w.reduce((a,b)=>a+b,0),pc=0;for(;pc<11;pc++){r-=w[pc];if(r<0)break}
 const[lo,hi]=OIR[oiLv()],P=[];for(let s=0;s<6;s++)for(let f=0;f<MF;f++){const m=mSt(s,f);if(mPc(s,f)==pc&&m>=lo&&m<=hi)P.push([s,f])}return P[Math.floor(Math.random()*P.length)]}
function oiNew(inP){muStop();const[s,f]=oiPick();OI={pc:mPc(s,f),s,f,st:mSt(s,f),taps:[],done:0,rd:0,inP:inP?1:0};oiDraw();MT.push(setTimeout(()=>mTone(s,f),250))}
function oiBoard(){const nm=S3.nm,o=OI;let h=`<div class="fbr fbh"><span></span>${Array.from({length:MF},(_,f)=>`<span>${f}</span>`).join("")}</div>`;
 const last=o.taps[o.taps.length-1];
 for(let s=0;s<6;s++){h+=`<div class="fbr"><b class="fbs">${MSTR[s][0]}</b>`;for(let f=0;f<MF;f++){
  const c=o.done?(mPc(s,f)==o.pc?(o.rd?"lit":"ok"):(o.taps.some(t=>t[0]==s&&t[1]==f)?"no":"")):(last&&last[0]==s&&last[1]==f?"no":"");
  h+=`<button class="fc${f==0?" nut":""}${c?" "+c:""}" data-o="t" data-s="${s}" data-f="${f}" aria-label="Cuerda ${MSTR[s][0]}, traste ${f}">${nm?mNm(s,f):(f==3||f==5||f==7||f==9||f==12||f==15||f==17||f==19||f==21||f==24)&&s==5?"·":""}</button>`}h+=`</div>`}return h}
function oiDraw(){const o=OI,x=(S3.oi||{})[NN[o.pc]],nf=o.taps.length;
 const msg=o.done?(o.rd?`Era <b>${NN[o.pc]}</b>. Te rendiste tras ${nf} ${nf==1?"intento":"intentos"}.`:`¡Era <b>${NN[o.pc]}</b>! ${nf?nf+(nf==1?" intento fallido":" intentos fallidos")+".":"Al primer intento."}`)
  :nf?`No: tocaste ${mNm(...o.taps[nf-1])} (${ivT(o.taps[nf-1][2])}). Seguí buscando.`:"¿Qué nota sonó? Tocala en el mástil (cualquier octava).";
 V.innerHTML=`<div class="s-mu"><div class="row between"><b class="sj">🎧 Oído</b><span class="mut">Registro ${oiLv()+1}/${OIR.length}: ${OIR[oiLv()][2]} · ${x&&x.n?"Esta nota: "+(x.n-x.f)+"/"+x.n+" al primer intento":""}</span></div>
 <div class="sn" style="margin-top:8px">${msg}</div>${o.up?`<div class="sn" style="margin-top:6px">⬇ ¡Subiste de nivel! Ahora aparecen notas más graves: ${OIR[oiLv()][2]}.</div>`:""}${o.done&&nf?`<div class="mut" style="margin-top:4px">Intervalos de error: ${o.taps.map(t=>mNm(t[0],t[1])+" "+ivT(t[2])).join(" · ")}</div>`:""}
 <div id="fbs" style="overflow-x:auto;padding-bottom:6px;margin-top:8px"><div id="fb" class="fbd">${oiBoard()}</div></div>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px">${o.done?`<button class="btn pri big" data-o="go">Continuar</button>`:`<button class="btn pri" data-o="rp">🔊 Otra vez</button><button class="btn ghost" data-o="rd">Me rindo</button>`}<button class="btn chip${S3.nm?" sel":""}" data-o="nm">Ver notas</button><button class="btn chip${S3.snd===0?"":" sel"}" data-o="snd">Sonido</button></div></div>`;
 muScr()}
function oiEnd(rd){const o=OI,n=NN[o.pc];o.done=1;o.rd=rd;S3.oi=S3.oi||{};const x=S3.oi[n]||(S3.oi[n]={n:0,f:0});x.n++;if(rd||o.taps.length)x.f++;
 const H=S3.oiH=(S3.oiH||[]).concat(rd||o.taps.length?0:1).slice(-20);if(H.length>=20&&H.reduce((a,b)=>a+b,0)>=16&&oiLv()<OIR.length-1){S3.oiL=oiLv()+1;S3.oiH=[];o.up=1}mSave();
 logA("oi","mu","Nota "+n,!rd&&!o.taps.length,{q:"🎧 ¿Qué nota sonó?",a:n,p:(rd?"Me rendí":"La encontré")+(o.taps.length?" tras "+o.taps.length+(o.taps.length==1?" fallo: ":" fallos: ")+o.taps.map(t=>mNm(t[0],t[1])+" ("+ivT(t[2])+")").join(", "):" sin tocar ninguna"),f:o.taps.length,iv:o.taps.map(t=>t[2]),rd:rd?1:0});
 oiDraw();if(rd)mTone(o.s,o.f)}
function oiTap(s,f){const o=OI;if(!o)return;mTone(s,f);if(o.done)return;
 if(mPc(s,f)==o.pc){oiEnd(0);return}
 if(o.taps.some(t=>mPc(t[0],t[1])==mPc(s,f)))return;/* nota ya probada: solo suena (para escucharla), no cuenta como intento */
 let d=((mSt(s,f)-o.st)%12+12)%12;if(d>6)d-=12;o.taps.push([s,f,d]);oiDraw()}
let MSC=null;
function muScr(){const sc=$("fbs");if(!sc)return;if(MSC===null){const c=sc.querySelector('.fc[data-f="5"]');if(!c||!c.offsetLeft)return;MSC=Math.max(0,c.offsetLeft-34)}sc.scrollLeft=MSC;sc.onscroll=()=>{MSC=sc.scrollLeft}}
function muOpen(){OI=null;oiNew(0)}
V.addEventListener("click",ev=>{if(!OI||(TAB!=4&&TAB!=3))return;const b=ev.target.closest("[data-o]");if(!b)return;const a=b.dataset.o;
 if(a=="t")oiTap(+b.dataset.s,+b.dataset.f);else if(a=="rp")mTone(OI.s,OI.f);else if(a=="rd")oiEnd(1);
 else if(a=="nm"){S3.nm=S3.nm?0:1;mSave();oiDraw()}else if(a=="snd"){S3.snd=S3.snd===0?1:0;mSave();oiDraw()}
 else if(a=="go"){if(OI.inP){OI=null;swNewBase()}else oiNew(0)}});
document.addEventListener("keydown",e=>{if(!OI||!OI.done||(TAB!=4&&TAB!=3)||e.target.tagName=="BUTTON")return;if(e.key=="Enter"||e.key==" "||e.key=="ArrowRight"){e.preventDefault();V.querySelector('[data-o="go"]').click()}});

/* ===== Intercalado en Principal: 1 de cada OI_CADA tarjetas es de oído (solo pestaña 3, no en Básico) ===== */
const swNewBase=swNew;
swNew=function(){OI=null;if(TAB==3&&SWM==3&&++OIN%OI_CADA==0){SW=null;oiNew(1);return}swNewBase()};
