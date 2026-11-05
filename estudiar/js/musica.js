/* SECCIÓN MÚSICA: Simon de tónicas en bajo de 6 cuerdas. */
/* ===== Música (pestaña 4): estilo Simon con un bajo de 6 cuerdas BEADGC; la secuencia son las tónicas de cada parte ===== */
const MSEC=[
["Mi país","Rubén Rada","Estrofa (0:10, se toca 2 veces)","G F# E F C B A D"],["Mi país","Rubén Rada","Transición (0:33)","D D# E E D C C B B E B A"],["Mi país","Rubén Rada","Segundo bloque (0:43)","G F# G D C D# E D G C B E A D# E E D C B C# C B A G B"],["Mi país","Rubén Rada","Estribillo (1:11)","C B A D G F G C B A D G F G C B E A D G"],
["Ciudad mágica","Tan Biónica","Estrofa (se toca 2 veces)","A C G F"],["Ciudad mágica","Tan Biónica","Pre-coro","F C F C F C E"],["Ciudad mágica","Tan Biónica","Coro","F E A C G A"],
["Cae el sol","Airbag","Intro","C# A E E"],["Cae el sol","Airbag","Estrofa","C# A E C# A E B C# B C# A B"],["Cae el sol","Airbag","Estribillo","C# A E B C# A E B C# A E B C# A E"],
["Ai se eu te pego","Michel Teló","Toda la canción","G D E C G D E C"],
["Hoy","Gloria Estefan","Estrofa (Tengo marcado en el pecho)","G# F# E F# B A# G# F# E D# G#"],["Hoy","Gloria Estefan","Pre-estribillo (Tengo una mañana constante)","E F# B A# G# E F# B D# G#"],["Hoy","Gloria Estefan","Estribillo (Hoy voy a verte de nuevo)","E F# B D# G# E F# B D# G#"],
["I Want to Break Free","Queen","Estrofa","E A E B A E"],["I Want to Break Free","Queen","Solo","E A E B A E B A E"],["I Want to Break Free","Queen","Puente","B A B A C# F# F# A B C# B A B C# B A B E"],
["Cielo de un solo color","No Te Va Gustar","Estrofa","A E F A E F"],["Cielo de un solo color","No Te Va Gustar","Segundo bloque","A E F A E F G F"],["Cielo de un solo color","No Te Va Gustar","Tercer bloque","G F A G F A G F A G F"],
["Like a Prayer","Madonna","Intro (Life is a mystery)","D C D C D E A# A A# C C D"],["Like a Prayer","Madonna","Estrofa (I hear your voice / Like a child)","F C D A# F C A# F C D A# F C"],["Like a Prayer","Madonna","Estribillo (When you call my name)","F C A# A D F C A# A D A#"],["Like a Prayer","Madonna","Estribillo 2 (Your voice can take me there)","D E A# A A# C C F"],["Like a Prayer","Madonna","Puente (se toca 4 veces)","F C A# A D"]];
const NPC={C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11},NN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const MSTR=[["C",0,130.81],["G",7,98],["D",2,73.42],["A",9,55],["E",4,41.2],["B",11,30.87]],MF=25;
let S3=(()=>{try{return JSON.parse(localStorage.getItem("mu1")||"{}")}catch(e){return{}}})();
const mSave=()=>{try{localStorage.setItem("mu1",JSON.stringify(S3))}catch(e){}};
let MU=null,MT=[],MAU=null;
const mPc=(s,f)=>(MSTR[s][1]+f)%12,mNm=(s,f)=>NN[mPc(s,f)];
function muStop(){MT.forEach(clearTimeout);MT=[]}
function mTone(s,f){if(S3.snd===0)return;try{MAU=MAU||new(window.AudioContext||window.webkitAudioContext)();const a=MAU,fr=MSTR[s][2]*Math.pow(2,f/12),t=a.currentTime,g=a.createGain(),lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=900;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+.7);lp.connect(g);g.connect(a.destination);[[1,"sawtooth",.6],[2,"triangle",.5],[3,"sine",.25]].forEach(([m,ty,v])=>{const o=a.createOscillator(),h=a.createGain();o.type=ty;o.frequency.value=fr*m;h.gain.value=v;o.connect(h);h.connect(lp);o.start(t);o.stop(t+.75)})}catch(e){}}
function muOpen(){muStop();if(!MU)MU={path:[],i:0,seq:[],lvl:0,inp:0,mode:"idle",err:0,msg:"Elegí una parte y tocá Empezar.",lit:null,rev:0};muDraw()}
const muPr=()=>S3.mo=="pr";
function muKey(){return MSEC[MU.i][0]+"|"+MSEC[MU.i][2]+(muPr()?"|pr":"")}
let MFR=null;const mLow=pc=>{let b=null,bd=0;for(let s=0;s<6;s++)for(let f=0;f<MF;f++)if(mPc(s,f)==pc){const q=MSTR[s][2]*Math.pow(2,f/12),d=MFR?Math.abs(Math.log2(q/MFR)):q;if(!b||d<bd){b=[s,f,q];bd=d}}return b};
function muStart(){muStop();const r=MSEC[MU.i][3].split(" ");
 MU.seq=r.map(n=>({n}));MU.err=0;MU.rev=0;
 if(muPr()){MU.lvl=MU.seq.length;MU.path=[];MU.inp=0;MU.lit=null;MU.mode="in";MU.msg="Práctica: tocá la parte entera, sin ayuda.";muDraw();return}
 MU.lvl=Math.min(2,MU.seq.length);muShow()}
function muShow(){muStop();MU.path=[];MU.mode="show";MU.inp=0;MU.lit=null;MU.msg="Mirá la secuencia…";muDraw();
 for(let k=0;k<MU.lvl;k++){const q=MU.seq[k];MT.push(setTimeout(()=>{MU.lit={pc:NPC[q.n]};const b=q.s!=null?[q.s,q.f]:mLow(NPC[q.n]);mTone(b[0],b[1]);muPaint()},500+k*750));MT.push(setTimeout(()=>{MU.lit=null;muPaint()},500+k*750+520))}
 MT.push(setTimeout(()=>{MU.mode="in";MU.msg="Tu turno: tónica 1 de "+MU.lvl;muDraw()},500+MU.lvl*750))}
function muTap(s,f){if(!MU||MU.mode!="in")return;MFR=MSTR[s][2]*Math.pow(2,f/12);mTone(s,f);const q=MU.seq[MU.inp];
 const mOk=mPc(s,f)==NPC[q.n];
 if(mOk){q.s=s;q.f=f;MU.path.push([s,f,"ok"]);MU.inp++;MU.lit={pc:NPC[q.n],c:"ok"};if(MU.inp==MU.lvl){const N=MU.seq.length,k=muKey();S3.best=S3.best||{};if(MU.lvl>(S3.best[k]||0)){S3.best[k]=MU.lvl;mSave()}
  if(MU.lvl==N){MU.mode="done";MU.msg=(muPr()?"¡Parte entera sin ayuda!":"¡Parte completa!")+(MU.err?" Errores: "+MU.err+".":" Sin errores.");MU.rev=1;muDraw();return}
  MU.mode="wait";MU.msg="¡Bien! Sube a "+(MU.lvl+1)+" tónicas.";muDraw();MT.push(setTimeout(()=>{MU.lvl++;muShow()},900));return}
  MU.msg=muPr()?"Nota "+(MU.inp+1)+" de "+MU.lvl:"Tónica "+(MU.inp+1)+" de "+MU.lvl;muDraw()}
 else if(muPr()){MU.path.push([s,f,"no"]);MU.err++;const k=muKey();S3.best=S3.best||{};if(MU.inp>(S3.best[k]||0)){S3.best[k]=MU.inp;mSave()}MU.mode="done";MU.lit={tap:[s,f],c:"no"};MU.msg="Llegaste a "+MU.inp+" de "+MU.lvl+". Era "+q.n+" (se ilumina dónde suena). Tocá Empezar para reintentar.";muDraw();MT.push(setTimeout(()=>{MU.lit={pc:NPC[q.n],c:"ok"};muPaint()},500))}
 else{MU.path.push([s,f,"no"]);MU.err++;MU.mode="wait";MU.lit={tap:[s,f],c:"no"};MU.msg="Era "+q.n+": se ilumina en todas las posiciones donde suena. Se repite la secuencia.";muDraw();MT.push(setTimeout(()=>{MU.lit={pc:NPC[q.n],c:"ok"};muPaint()},500));MT.push(setTimeout(muShow,2200))}}
let MSC=null;
function muScr(){const sc=$("fbs");if(!sc)return;if(MSC===null){const c=sc.querySelector('.fc[data-f="5"]');if(!c||!c.offsetLeft)return;MSC=Math.max(0,c.offsetLeft-34)}sc.scrollLeft=MSC;sc.onscroll=()=>{MSC=sc.scrollLeft}}
function muTrace(){const fb=$("fb");if(!fb||!MU||!MU.path||!MU.path.length)return;const P=MU.path.map(([s,f,c])=>{const b=fb.querySelector(`.fc[data-s="${s}"][data-f="${f}"]`);return b?[b.offsetLeft+b.offsetWidth/2,b.offsetTop+b.offsetHeight/2,c]:null}).filter(Boolean);if(!P.length)return;
 let g="";P.forEach((q,i)=>{if(i){const a=P[i-1];g+=`<line x1="${a[0]}" y1="${a[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${q[2]=="no"?"var(--bad)":"var(--ac)"}" stroke-width="3" stroke-linecap="round"${q[2]=="no"?' stroke-dasharray="5 4"':''} opacity=".85"/>`}});
 P.forEach((q,i)=>{g+=`<circle cx="${q[0]}" cy="${q[1]}" r="10" fill="${q[2]=="no"?"var(--bad)":"var(--ac)"}" stroke="var(--bg)" stroke-width="2"/><text x="${q[0]}" y="${q[1]+4}" text-anchor="middle" font-size="11" font-weight="700" fill="${q[2]=="no"?"#fff":"var(--onac)"}">${i+1}</text>`});
 fb.insertAdjacentHTML("beforeend",`<svg class="mtr" width="${fb.offsetWidth}" height="${fb.offsetHeight}" aria-hidden="true">${g}</svg>`)}
function muPaint(){const el=$("fb");if(el){el.innerHTML=muBoard();muTrace()}}
function muBoard(){const nm=S3.nm,L=MU.lit;let h=`<div class="fbr fbh"><span></span>${Array.from({length:MF},(_,f)=>`<span>${f}</span>`).join("")}</div>`;
 for(let s=0;s<6;s++){h+=`<div class="fbr"><b class="fbs">${MSTR[s][0]}</b>`;for(let f=0;f<MF;f++){const c=!L?"":L.tap?(L.tap[0]==s&&L.tap[1]==f?L.c:""):(mPc(s,f)==L.pc?(L.c||"lit"):"");h+=`<button class="fc${f==0?" nut":""}${c?" "+c:""}" data-m="t" data-s="${s}" data-f="${f}" aria-label="Cuerda ${MSTR[s][0]}, traste ${f}">${nm?mNm(s,f):(f==3||f==5||f==7||f==9||f==12||f==15||f==17||f==19||f==21||f==24)&&s==5?"·":""}</button>`}h+=`</div>`}return h}
function muDraw(){const m=MU,s=MSEC[m.i],N=s[3].split(" ").length,best=(S3.best||{})[muKey()]||0;let opts="",g="";MSEC.forEach((x,i)=>{if(x[0]!=g){if(g)opts+="</optgroup>";opts+=`<optgroup label="${esc(x[0]+" · "+x[1])}">`;g=x[0]}opts+=`<option value="${i}"${i==m.i?" selected":""}>${esc(x[2])} (${x[3].split(" ").length})</option>`});opts+="</optgroup>";
 const shown=m.rev?s[3]:m.seq.slice(0,m.mode=="idle"?0:m.inp).map(x=>x.n).join(" ");
 V.innerHTML=`<div class="s-mu"><div class="row between"><b class="sj">Tónicas</b><span class="mut">Mejor ${best}/${N}${m.lvl&&!muPr()?" · Nivel "+m.lvl+"/"+N:""} · Errores ${m.err}</span></div>
 <select id="msel" style="margin:8px 0;width:100%;font:inherit;padding:8px;border-radius:10px;border:1px solid var(--bd);background:var(--card);color:var(--fg)">${opts}</select>
 <div class="row" style="gap:6px;margin-bottom:8px"><button class="btn chip${muPr()?"":" sel"}" data-m="mo" data-v="ap">Aprendizaje</button><button class="btn chip${muPr()?" sel":""}" data-m="mo" data-v="pr">Práctica</button></div>
 <div class="sn" id="mmsg">${esc(m.msg)}</div><div id="fbs" style="overflow-x:auto;padding-bottom:6px"><div id="fb" class="fbd">${muBoard()}</div></div>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn pri" data-m="go">${m.mode=="idle"||m.mode=="done"?"Empezar":"Reiniciar"}</button><button class="btn" data-m="rep"${m.mode=="in"&&!muPr()?"":" disabled"}>Repetir secuencia</button><button class="btn chip${S3.nm?" sel":""}" data-m="nm">Ver notas</button><button class="btn chip${S3.snd===0?"":" sel"}" data-m="snd">Sonido</button></div>
 ${shown?`<div class="mut" style="margin-top:8px">Tónicas hasta ahora: <b>${esc(shown)}</b></div>`:""}
 <p class="mut" style="margin-top:10px;font-size:13px">Se ilumina la nota en todas las octavas y posiciones (trastes 0 a 24): todas valen, tocá la que prefieras. Al repetir la secuencia suena la posición que tocaste la última vez. Las tónicas salen de cifrados de internet; verifícalas con el disco.</p></div>`;
 muTrace();muScr();const sel=$("msel");sel.onchange=()=>{muStop();MU.path=[];MU.i=+sel.value;MU.seq=[];MU.lvl=0;MU.inp=0;MU.mode="idle";MU.lit=null;MU.rev=0;MU.msg="Elegí una parte y tocá Empezar.";muDraw()}}
V.addEventListener("click",ev=>{if(TAB!=4||!MU)return;const b=ev.target.closest("[data-m]");if(!b)return;const a=b.dataset.m;
 if(a=="t")muTap(+b.dataset.s,+b.dataset.f);else if(a=="go")muStart();else if(a=="rep"&&MU.mode=="in"&&!muPr())muShow();else if(a=="mo"){muStop();S3.mo=b.dataset.v;mSave();MU.path=[];MU.seq=[];MU.lvl=0;MU.inp=0;MU.mode="idle";MU.lit=null;MU.rev=0;MU.msg=muPr()?"Práctica: tocá Empezar y poné la parte entera sin ayuda.":"Elegí una parte y tocá Empezar.";muDraw()}else if(a=="nm"){S3.nm=S3.nm?0:1;mSave();muDraw()}else if(a=="snd"){S3.snd=S3.snd===0?1:0;mSave();muDraw()}});
