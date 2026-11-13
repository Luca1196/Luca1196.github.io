/* SECCIÓN MÚSICA → OÍDO (pestaña 4). VIGENTE: el bloque «Tarjeta de oído FUNCIONAL» más abajo; lo que sigue describe la versión anterior (nota sin referencia), que se reemplazó. */
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
     más agudas del bajo y se baja a medida que mejora. Solo suenan notas de los trastes OF0-OF1 (5 a 9, pedido de Luca);
     OIR = niveles por cuerdas: 1) C, G, D (ya cubren las 12 notas); 2) + A; 3) + E; 4) + B.  (Texto viejo: niveles por semitono, 0 = B grave 31 Hz, 25 = C3 131 Hz,
     49 = C5 523 Hz). S3.oiL = nivel; S3.oiH = últimos resultados del nivel (1 = al primer intento). Sube de nivel con
     ≥ 80 % de aciertos al primer intento en las últimas 20 tarjetas. */
const NN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const MSTR=[["C",0,130.81],["G",7,98],["D",2,73.42],["A",9,55],["E",4,41.2],["B",11,30.87]],MF=25,OI_CADA=5;
let S3=(()=>{try{return JSON.parse(localStorage.getItem("mu1")||"{}")}catch(e){return{}}})();
const mSave=()=>{try{localStorage.setItem("mu1",JSON.stringify(S3))}catch(e){}};
let MT=[],MAU=null,OI=null,OIN=0;
const mPc=(s,f)=>(MSTR[s][1]+f)%12,mNm=(s,f)=>NN[mPc(s,f)],mSt=(s,f)=>Math.round(12*Math.log2(MSTR[s][2]*Math.pow(2,f/12)/30.87));
const OIR=[[[0,1,2],"cuerdas C, G y D (F2–A3)"],[[0,1,2,3],"+ cuerda A (D2–A3)"],[[0,1,2,3,4],"+ cuerda E (A1–A3)"],[[0,1,2,3,4,5],"todas las cuerdas (E1–A3)"]],OF0=5,OF1=9,oiLv=()=>Math.min(S3.oiL||0,OIR.length-1);
const IVN={1:"2m",2:"2M",3:"3m",4:"3M",5:"4J",6:"tritono"},ivT=d=>(d>0?"+":"−")+IVN[Math.abs(d)];
function muStop(){MT.forEach(clearTimeout);MT=[]}
function mTone(s,f){if(S3.snd===0)return;try{MAU=MAU||new(window.AudioContext||window.webkitAudioContext)();const a=MAU;if(a.state=="suspended")a.resume();const fr=MSTR[s][2]*Math.pow(2,f/12),t=a.currentTime,g=a.createGain(),lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=900;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+1.1);lp.connect(g);g.connect(a.destination);[[1,"sawtooth",.6],[2,"triangle",.5],[3,"sine",.25]].forEach(([m,ty,v])=>{const o=a.createOscillator(),h=a.createGain();o.type=ty;o.frequency.value=fr*m;h.gain.value=v;o.connect(h);h.connect(lp);o.start(t);o.stop(t+1.15)})}catch(e){}}

/* ===== Tarjeta de oído FUNCIONAL (nov 2026, tras investigar con Luca: el oído absoluto en adultos casi no se logra;
   para sacar canciones en vivo sirve el oído relativo a la tónica). Cada tarjeta: tonalidad + cadencia 1-4-5-1 en el
   bajo, luego la nota; se toca en el mástil (cualquier octava). La tónica se marca en el mástil (.ton, pedido de Luca)
   salvo en el último nivel, que simula escuchar en vivo (solo la cadencia).
   Niveles OFL (S3.ofL; sube con 16/20 al primer intento, S3.ofH): 1) grados 1,5,4 en A · 2) 7 grados en A ·
   3) 7 grados, tonalidad al azar · 4) cromático, tonalidad al azar · 5) cromático, sin decir ni marcar la tónica.
   Stats por grado en S3.od. Registro: logA("oi","mu","Grado X",ok,{a,p,f,iv,rd,k:tonalidad,dg:grado,dt:[grados tocados]}).
   Notas: tónica entre st 15 y 22 (A1–F#2 aprox.), objetivo = tónica + grado, en trastes 5-9 de A, D, G o C si se puede. ===== */
const DGN=["1","b2","2","b3","3","4","#4","5","b6","6","b7","7"],DIA=[0,2,4,5,7,9,11];
const OFL=[[[0,7,5],0,"grados 1, 5 y 4 en A"],[DIA,0,"los 7 grados en A"],[DIA,1,"7 grados, tonalidad al azar"],[[0,1,2,3,4,5,6,7,8,9,10,11],1,"cromático, tonalidad al azar"],[[0,1,2,3,4,5,6,7,8,9,10,11],2,"cromático, sin mostrar la tónica (como en vivo)"]];
const ofLv=()=>Math.min(S3.ofL||0,OFL.length-1),oHide=()=>OI&&OFL[OI.lv][1]==2&&!OI.done;
function mToneSt(st){for(const s of [5,4,3,2,1,0]){const f=st-mSt(s,0);if(f>=0&&f<MF){mTone(s,f);return}}}
function oiPos(st){const P=[];[3,2,1,0].forEach(s=>{for(let f=OF0;f<=OF1;f++)if(mSt(s,f)==st)P.push([s,f])});if(!P.length)for(let s=0;s<6;s++)for(let f=0;f<=12;f++)if(mSt(s,f)==st)P.push([s,f]);return P[Math.floor(Math.random()*P.length)]}
function oiPick(){const L=OFL[ofLv()],st=S3.od||{},D=L[0].filter(d=>!(OI&&OI.dg==d&&L[0].length>2)),w=D.map(d=>{const x=st[d]||{n:0,f:0};return x.n?1+4*x.f/x.n:3});
 let r=Math.random()*w.reduce((a,b)=>a+b,0),k=0;for(;k<D.length-1;k++){r-=w[k];if(r<0)break}return D[k]}
function oiPlay(full){muStop();const o=OI,T=o.ts,seq=full?[T,T+5,T+7,T]:[];seq.forEach((x,i)=>MT.push(setTimeout(()=>mToneSt(x),200+i*430)));MT.push(setTimeout(()=>mTone(o.s,o.f),full?200+4*430+500:150))}
function oiNew(inP){muStop();const lv=ofLv(),L=OFL[lv],K=L[1]?Math.floor(Math.random()*12):9;/* st 0 = B, así que pc(st)=(st+11)%12 */
 let ts=15;for(let x=15;x<=26;x++)if((x+11)%12==K){ts=x;break}
 const dg=oiPick(),tg=ts+dg>34?ts+dg-12:ts+dg,[s,f]=oiPos(tg);/* objetivo dentro de los trastes 5-9 (st 15-34) */OI={lv,K,ts,dg,pc:mPc(s,f),s,f,st:mSt(s,f),taps:[],done:0,rd:0,inP:inP?1:0};oiDraw();oiPlay(1)}
const dOf=(s,f)=>((mPc(s,f)-OI.K)%12+12)%12;
function oiBoard(){const nm=S3.nm,o=OI,last=o.taps[o.taps.length-1],hid=oHide();let h=`<div class="fbr fbh"><span></span>${Array.from({length:MF},(_,f)=>`<span>${f}</span>`).join("")}</div>`;
 for(let s=0;s<6;s++){h+=`<div class="fbr"><b class="fbs">${MSTR[s][0]}</b>`;for(let f=0;f<MF;f++){
  const c=o.done?(mPc(s,f)==o.pc?(o.rd?"lit":"ok"):(o.taps.some(t=>t[0]==s&&t[1]==f)?"no":"")):(last&&last[0]==s&&last[1]==f?"no":""),tn=!hid&&mPc(s,f)==o.K?" ton":"";
  h+=`<button class="fc${f==0?" nut":""}${tn}${c?" "+c:""}" data-o="t" data-s="${s}" data-f="${f}" aria-label="Cuerda ${MSTR[s][0]}, traste ${f}">${nm?mNm(s,f):tn?"1":(f==3||f==5||f==7||f==9||f==12||f==15||f==17||f==19||f==21||f==24)&&s==5?"·":""}</button>`}h+=`</div>`}return h}
function oiDraw(){const o=OI,x=(S3.od||{})[o.dg],nf=o.taps.length,kn=NN[o.K],hid=oHide(),tp=t=>`${mNm(t[0],t[1])} = grado ${DGN[dOf(t[0],t[1])]} (${ivT(t[2])})`;
 const msg=o.done?(o.rd?`Era <b>${NN[o.pc]}</b> = grado <b>${DGN[o.dg]}</b> de ${kn}. Te rendiste tras ${nf} ${nf==1?"intento":"intentos"}.`:`¡Era <b>${NN[o.pc]}</b> = grado <b>${DGN[o.dg]}</b> de ${kn}! ${nf?nf+(nf==1?" intento fallido":" intentos fallidos")+".":"Al primer intento."}`)
  :nf?`No: ${hid?mNm(...o.taps[nf-1])+" ("+ivT(o.taps[nf-1][2])+")":tp(o.taps[nf-1])}. Seguí buscando.`:(hid?"Escuchá la cadencia, encontrá la tónica y después tocá la nota.":`Tonalidad <b>${kn}</b> mayor (marcada con 1). Escuchá la cadencia 1–4–5–1 y después tocá la nota.`);
 V.innerHTML=`<div class="s-mu"><div class="row between"><b class="sj">🎧 Oído</b><span class="mut">Nivel ${o.lv+1}/${OFL.length}: ${OFL[o.lv][2]}${x&&x.n&&!hid?" · grado "+DGN[o.dg]+": "+(x.n-x.f)+"/"+x.n:""}</span></div>
 <div class="sn" style="margin-top:8px">${msg}</div>${o.up?`<div class="sn" style="margin-top:6px">¡Subiste de nivel! Ahora: ${OFL[ofLv()][2]}.</div>`:""}${o.done&&nf?`<div class="mut" style="margin-top:4px">Tocaste: ${o.taps.map(tp).join(" · ")}</div>`:""}
 <div id="fbs" style="overflow-x:auto;padding-bottom:6px;margin-top:8px"><div id="fb" class="fbd">${oiBoard()}</div></div>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px">${o.done?`<button class="btn pri big" data-o="go">Continuar</button>`:`<button class="btn pri" data-o="rp">🔊 Cadencia y nota</button><button class="btn" data-o="rn">Solo la nota</button><button class="btn ghost" data-o="rd">Me rindo</button>`}<button class="btn chip${S3.nm?" sel":""}" data-o="nm">Ver notas</button><button class="btn chip${S3.snd===0?"":" sel"}" data-o="snd">Sonido</button></div></div>`;
 muScr()}
function oiEnd(rd){const o=OI;o.done=1;o.rd=rd;S3.od=S3.od||{};const x=S3.od[o.dg]||(S3.od[o.dg]={n:0,f:0});x.n++;if(rd||o.taps.length)x.f++;
 const H=S3.ofH=(S3.ofH||[]).concat(rd||o.taps.length?0:1).slice(-20);if(H.length>=20&&H.reduce((a,b)=>a+b,0)>=16&&ofLv()<OFL.length-1){S3.ofL=ofLv()+1;S3.ofH=[];o.up=1}mSave();
 const dt=o.taps.map(t=>dOf(t[0],t[1]));
 logA("oi","mu","Grado "+DGN[o.dg],!rd&&!o.taps.length,{q:"🎧 Grado en "+NN[o.K]+" (nivel "+(o.lv+1)+")",a:"grado "+DGN[o.dg]+" ("+NN[o.pc]+")",p:(rd?"Me rendí":"La encontré")+(o.taps.length?" tras "+o.taps.length+(o.taps.length==1?" fallo: ":" fallos: ")+o.taps.map((t,i)=>"grado "+DGN[dt[i]]+" "+mNm(t[0],t[1])+" ("+ivT(t[2])+")").join(", "):" sin tocar ninguna"),f:o.taps.length,iv:o.taps.map(t=>t[2]),rd:rd?1:0,k:NN[o.K],dg:o.dg,dt,lv:o.lv+1});
 oiDraw();if(rd)mTone(o.s,o.f)}
function oiTap(s,f){const o=OI;if(!o)return;mTone(s,f);if(o.done)return;
 if(mPc(s,f)==o.pc){oiEnd(0);return}
 if(o.taps.some(t=>mPc(t[0],t[1])==mPc(s,f)))return;/* nota ya probada: solo suena (para escucharla), no cuenta como intento */
 let d=((mSt(s,f)-o.st)%12+12)%12;if(d>6)d-=12;o.taps.push([s,f,d]);oiDraw()}
let MSC=null;
function muScr(){const sc=$("fbs");if(!sc)return;if(MSC===null){const c=sc.querySelector('.fc[data-f="5"]');if(!c||!c.offsetLeft)return;MSC=Math.max(0,c.offsetLeft-34)}sc.scrollLeft=MSC;sc.onscroll=()=>{MSC=sc.scrollLeft}}
function muOpen(){OI=null;oiNew(0)}
V.addEventListener("click",ev=>{if(!OI||(TAB!=4&&TAB!=3))return;const b=ev.target.closest("[data-o]");if(!b)return;const a=b.dataset.o;
 if(a=="t")oiTap(+b.dataset.s,+b.dataset.f);else if(a=="rp")oiPlay(1);else if(a=="rn")oiPlay(0);else if(a=="rd")oiEnd(1);
 else if(a=="nm"){S3.nm=S3.nm?0:1;mSave();oiDraw()}else if(a=="snd"){S3.snd=S3.snd===0?1:0;mSave();oiDraw()}
 else if(a=="go"){if(OI.inP){OI=null;swNewBase()}else oiNew(0)}});
document.addEventListener("keydown",e=>{if(!OI||!OI.done||(TAB!=4&&TAB!=3)||e.target.tagName=="BUTTON")return;if(e.key=="Enter"||e.key==" "||e.key=="ArrowRight"){e.preventDefault();V.querySelector('[data-o="go"]').click()}});

/* ===== Intercalado en Principal (solo pestaña 3, no en Básico): cuenta los pasos respondidos (logA "sw" en la pestaña 3)
   y, al terminar la serie en curso, si ya van OI_CADA pasos desde la última, muestra una tarjeta de oído.
   La primera aparece después de la primera serie. ===== */
const swNewBase=swNew,logABase=logA;let OIK=OI_CADA;
logA=function(w){if(w=="sw"&&TAB==3)OIK++;return logABase.apply(this,arguments)};
swNew=function(){OI=null;if(TAB==3&&SWM==3&&SW&&OIK>=OI_CADA){OIK=0;SW=null;oiNew(1);return}swNewBase()};
