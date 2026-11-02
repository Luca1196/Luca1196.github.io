/* BASE (compartido): utilidades, st/sw y la lista SWC. Cada sección agrega sus cadenas con SWC.push(...). Tocar solo para cambios que afecten a todas las secciones. */
const $=i=>document.getElementById(i),V=$("v");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const hs=s=>{let x=7;for(const c of s)x=(x*31+c.charCodeAt(0))|0;return(x>>>0).toString(36)};
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const SUBJ={p4:{n:"Prog4",c:"s-p4"},lg:{n:"Lógica",c:"s-lg"}};
const mc=(s,g,q,a,d,w,h)=>({k:"mc",s,g,q,a,d,w,h}),fc=(s,g,q,b)=>({k:"fc",s,g,q,b});

/* ---- Deslizar: cadenas de decisiones binarias. st(pregunta, correcta, incorrecta, motivo, fragmento) ---- */
const st=(q,a,b,w,f)=>({q,a,b,w,f}),sw=(s,g,ctx,steps,out)=>({s,g,ctx,steps,out,id:hs("sw"+s+g+steps[0].q+(ctx||""))});
const SWC=[];
