const d=`
@media print {
  html, body { height: auto !important; overflow: visible !important; background: #fff !important; }
  body > *:not(.print-root) { display: none !important; }
}
@media screen { .print-root { position: fixed; left: -100000px; top: 0; width: 1px; overflow: hidden; } }
`;async function c(e){const t=document.createElement("style");t.textContent=e.css+d;const n=document.createElement("div");n.className="print-root",n.innerHTML=e.body,document.head.append(t),document.body.append(n);const a=n.textContent??"",i=['"Nanum Myeongjo"','"Pretendard Variable"'];return await Promise.all(i.flatMap(o=>["400","700"].map(r=>document.fonts.load(`${r} 16px ${o}`,a).catch(()=>[])))),await document.fonts.ready,await new Promise(o=>requestAnimationFrame(()=>o(null))),()=>{t.remove(),n.remove()}}async function m(e){const t=await c(e);try{window.print()}finally{t()}}export{c as mountPrint,m as printInPlace};
