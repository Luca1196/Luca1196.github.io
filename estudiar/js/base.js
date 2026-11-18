/* BASE (compartido): utilidades, st/sw y la lista SWC. Cada sección agrega sus cadenas con SWC.push(...). Tocar solo para cambios que afecten a todas las secciones. */
const $=i=>document.getElementById(i),V=$("v");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const hs=s=>{let x=7;for(const c of s)x=(x*31+c.charCodeAt(0))|0;return(x>>>0).toString(36)};
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const SUBJ={p4:{n:"Prog4",c:"s-p4"},lg:{n:"Lógica",c:"s-lg"}};
const mc=(s,g,q,a,d,w,h)=>({k:"mc",s,g,q,a,d,w,h}),fc=(s,g,q,b)=>({k:"fc",s,g,q,b});

/* ---- Deslizar: cadenas de decisiones binarias. st(pregunta, correcta, incorrecta, motivo, fragmento) ---- */
/* IDS FIJOS (pedido de Luca, 18/11: «es importante que el progreso se conserve entre actualizaciones del código»).
   El id de cada bloque sale SOLO de su sección y su título (s+g), no del texto: corregir preguntas, opciones, contexto o teoría NO cambia el id
   y el progreso se conserva. Reglas para cualquier chat o IA que edite el sitio:
   1. No cambiar el título (g) de un bloque existente. Si hace falta renombrarlo, agregar en IDREN «título nuevo: título viejo».
   2. Cada título (s+g) tiene que ser único: dos bloques con el mismo título compartirían progreso (inicio.js avisa en la consola).
   3. No renombrar las claves de localStorage (sw1, sw1b, err1, est2) ni los campos guardados (box, seen, bst, kok, bqok, mt).
   c.oid = el id viejo (por contenido); inicio.js migra el progreso guardado con ese id al id fijo, una sola vez (S2.idv=2). */
const IDREN={};
const st=(q,a,b,w,f)=>({q,a,b,w,f}),sw=(s,g,ctx,steps,out)=>({s,g,ctx,steps,out,id:hs("sw"+s+(IDREN[g]||g)),oid:hs("sw"+s+g+steps[0].q+(ctx||""))});
const SWC=[];
