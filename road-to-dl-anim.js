// ── Helpers ──────────────────────────────────────────────────────────────────
var eo=function(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3);};
var cl=function(v,a,b){return Math.max(a,Math.min(b,v));};
var lr=function(a,b,t){return a+(b-a)*t;};
function rr(c,x,y,w,h,r,f,s,sw){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
  if(f){c.fillStyle=f;c.fill();}
  if(s){c.strokeStyle=s;c.lineWidth=sw||1;c.stroke();}
}

// ── Background Particles ──────────────────────────────────────────────────────
(function(){
  var cv=document.getElementById('bgc'),ctx=cv.getContext('2d');
  cv.width=1280;cv.height=720;
  var pts=[];
  for(var i=0;i<40;i++) pts.push({x:Math.random()*1280,y:Math.random()*720,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.2+.4});
  (function loop(){
    ctx.clearRect(0,0,1280,720);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>1280)p.vx*=-1;if(p.y<0||p.y>720)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(71,85,105,.5)';ctx.fill();
    }
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.beginPath();ctx.strokeStyle='rgba(71,85,105,'+(1-d/110)*.25+')';ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// ── Arrow Particle Flows ──────────────────────────────────────────────────────
function initArrow(id,col){
  var cv=document.getElementById(id);if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  var pts=[];
  for(var i=0;i<5;i++) pts.push({t:i/5,s:.0045+Math.random()*.003});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];p.t+=p.s;if(p.t>1)p.t-=1;
      var y=20+p.t*130,a=p.t<.12?p.t/.12:p.t>.88?(1-p.t)/.12:1;
      ctx.beginPath();ctx.arc(W/2,y,2.5,0,Math.PI*2);
      ctx.fillStyle=col.replace('$',''+(a*.85));ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
}
setTimeout(function(){
  initArrow('ap1','rgba(245,158,11,$)');
  initArrow('ap2','rgba(168,85,247,$)');
},900);

// ── Phase 1: Rule-Based Systems ───────────────────────────────────────────────
function initP1(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var CY=300,RL=['"free money"?','links > 5?','unknown sender?'];
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  function drawMail(cx,cy,sz,a,col){
    ctx.save();ctx.globalAlpha=a;
    var w=sz*1.6,h=sz;
    rr(ctx,cx-w/2,cy-h/2,w,h,4,'rgba(30,41,59,.9)',col,1.5);
    ctx.beginPath();ctx.moveTo(cx-w/2,cy-h/2);ctx.lineTo(cx,cy+h*.28);ctx.lineTo(cx+w/2,cy-h/2);
    ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  }
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CY)/CY,cx=W/2,eY=H*.1,rY=[H*.3,H*.52,H*.74],rW=W*.72,rH=H*.13;
    var eA=n<.07?eo(n/.07):n>.87?cl(1-(n-.87)/.1,0,1):1;
    drawMail(cx,eY+(n<.07?lr(-25,0,eo(n/.07)):0),18,eA,'#f59e0b');
    if(n>.07&&n<.87){
      ctx.save();ctx.globalAlpha=.2;ctx.strokeStyle='#334155';ctx.lineWidth=1;
      ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,eY+11);ctx.lineTo(cx,rY[0]-rH/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    }
    for(var i=0;i<3;i++){
      var rs=.12+i*.18,isA=n>=rs&&n<rs+.18,isD=n>=rs+.18&&n<.87;
      var rA=n<rs?0:n<rs+.04?eo((n-rs)/.04):n>.87?cl(1-(n-.87)/.1,0,1):1;
      if(rA<=0)continue;
      if(i>0){
        ctx.save();ctx.globalAlpha=rA*.2;ctx.strokeStyle='#334155';ctx.lineWidth=1;
        ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,rY[i-1]+rH/2);ctx.lineTo(cx,rY[i]-rH/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      ctx.save();ctx.globalAlpha=rA;
      rr(ctx,cx-rW/2,rY[i]-rH/2,rW,rH,6,isA?'rgba(245,158,11,.12)':isD?'rgba(30,41,59,.6)':'rgba(15,23,42,.7)',isA?'#f59e0b':isD?'#334155':'#1e293b',isA?1.5:1);
      ctx.fillStyle=isA?'#fbbf24':'#64748b';
      ctx.font=(isA?'600 ':'400 ')+Math.round(W*.037)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(RL[i],cx,rY[i]);
      if(isD){
        var rx=cx+rW/2+16;
        ctx.beginPath();ctx.arc(rx,rY[i],10,0,Math.PI*2);ctx.fillStyle='rgba(34,197,94,.15)';ctx.fill();
        ctx.strokeStyle='#22c55e';ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#22c55e';ctx.font='bold '+Math.round(W*.042)+'px Inter';ctx.fillText('✓',rx,rY[i]+1);
      }
      ctx.restore();
    }
    if(n>.67&&n<.87){
      var bA=n<.71?eo((n-.67)/.04):n>.83?cl(1-(n-.83)/.04,0,1):1;
      ctx.save();ctx.globalAlpha=bA;
      var g=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,W*.4);
      g.addColorStop(0,'rgba(239,68,68,.12)');g.addColorStop(1,'rgba(239,68,68,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      rr(ctx,cx-W*.3,H*.42,W*.6,H*.16,8,'rgba(239,68,68,.15)','#ef4444',2);
      ctx.fillStyle='#fca5a5';ctx.font='bold '+Math.round(W*.054)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BLOCKED',cx,H*.5);
      ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// ── Phase 2: Machine Learning ─────────────────────────────────────────────────
function initP2(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var CY=340,sd=42;
  function sr(){sd=(sd*9301+49297)%233280;return sd/233280;}
  var dots=[];
  for(var i=0;i<11;i++) dots.push({x:.52+sr()*.38,y:.06+sr()*.38,t:1});
  for(var i=0;i<11;i++) dots.push({x:.06+sr()*.38,y:.48+sr()*.4,t:0});
  for(var i=0;i<5;i++)  dots.push({x:.28+sr()*.38,y:.22+sr()*.48,t:sr()>.5?1:0});
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CY)/CY,cx=W/2,px=W*.07,py=H*.07,pw=W*.86,ph=H*.68;
    ctx.save();ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(px,py,pw,ph);ctx.restore();
    ctx.save();ctx.fillStyle='#334155';ctx.font=Math.round(W*.028)+'px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('Word Frequency',px+pw/2,py+ph+14);
    ctx.save();ctx.translate(px-12,py+ph/2);ctx.rotate(-Math.PI/2);ctx.fillText('Link Count',0,0);ctx.restore();ctx.restore();
    var dn=n<.42?Math.floor(eo(n/.42)*dots.length):dots.length;
    for(var i=0;i<dn;i++){
      var d=dots[i],dx=px+d.x*pw,dy=py+d.y*ph;
      var da=i===dn-1&&n<.42?(n*dots.length/.42-i):1;
      ctx.save();ctx.globalAlpha=da*.8;ctx.beginPath();ctx.arc(dx,dy,5,0,Math.PI*2);
      ctx.fillStyle=d.t?'rgba(239,68,68,.75)':'rgba(59,130,246,.75)';ctx.fill();
      ctx.strokeStyle=d.t?'#ef4444':'#3b82f6';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    }
    if(n>.1){
      var lA=cl((n-.1)/.08,0,1);
      ctx.save();ctx.globalAlpha=lA;
      ctx.beginPath();ctx.arc(px+pw*.06,py+ph+28,5,0,Math.PI*2);ctx.fillStyle='rgba(239,68,68,.75)';ctx.fill();
      ctx.fillStyle='#64748b';ctx.font=Math.round(W*.027)+'px Inter,sans-serif';ctx.textAlign='left';
      ctx.fillText('Spam',px+pw*.06+10,py+ph+32);
      ctx.beginPath();ctx.arc(px+pw*.06+60,py+ph+28,5,0,Math.PI*2);ctx.fillStyle='rgba(59,130,246,.75)';ctx.fill();
      ctx.fillText('Ham',px+pw*.06+70,py+ph+32);ctx.restore();
    }
    if(n>.42){
      var bp=cl((n-.42)/.23,0,1);
      var x1=px,y1=py+ph*.15,x2=px+pw,y2=py+ph*.85;
      ctx.save();ctx.globalAlpha=.65;ctx.strokeStyle='rgba(168,85,247,.7)';ctx.lineWidth=2;ctx.setLineDash([6,4]);
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(lr(x1,x2,bp),lr(y1,y2,bp));ctx.stroke();ctx.setLineDash([]);
      if(bp>.5){
        var za=cl((bp-.5)/.5,0,1)*.06;
        ctx.globalAlpha=za;ctx.fillStyle='rgba(168,85,247,1)';
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,py);ctx.lineTo(x1,py);ctx.closePath();ctx.fill();
        ctx.fillStyle='rgba(59,130,246,1)';
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,py+ph);ctx.lineTo(x1,py+ph);ctx.closePath();ctx.fill();
      }
      ctx.restore();
    }
    if(n>.65){
      var ap=cl((n-.65)/.2,0,1),acc=Math.round(ap*94);
      ctx.save();ctx.globalAlpha=cl((n-.65)/.08,0,1);
      rr(ctx,px,py+ph+38,pw,H*.12,6,'rgba(30,41,59,.7)','#334155',1);
      rr(ctx,px+2,py+ph+40,(pw-4)*ap*.94,H*.12-4,5,'rgba(168,85,247,.35)',null,0);
      ctx.fillStyle='#c084fc';ctx.font='bold '+Math.round(W*.038)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Accuracy: '+acc+'%',cx,py+ph+38+H*.06);ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// ── Phase 3: Deep Learning Neural Network ─────────────────────────────────────
function initP3(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var PASS=110;
  var layers=[4,5,5,4,2];
  var lcols=['#60a5fa','#a78bfa','#818cf8','#6ee7b7','#2dd4bf'];
  var llbls=['Input','Hidden 1','Hidden 2','Hidden 3','Output'];
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  function getNodes(){
    var nd=[];
    for(var l=0;l<layers.length;l++){
      var lx=W*(.1+l*.2);
      for(var n=0;n<layers[l];n++){
        var ly=H*(.5-(layers[l]-1)*.5*.15)+n*H*.15;
        nd.push({l:l,n:n,x:lx,y:ly});
      }
    }
    return nd;
  }
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var t=(frame%PASS)/PASS;
    var nd=getNodes();
    var aL=Math.floor(t*(layers.length+1));
    // Connections
    for(var i=0;i<nd.length;i++){
      for(var j=0;j<nd.length;j++){
        if(nd[j].l!==nd[i].l+1)continue;
        var ca=nd[i].l<aL?.18:.05;
        ctx.save();ctx.globalAlpha=ca;ctx.strokeStyle=nd[i].l<aL?lcols[nd[i].l]:'#1e293b';ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(nd[i].x,nd[i].y);ctx.lineTo(nd[j].x,nd[j].y);ctx.stroke();ctx.restore();
      }
    }
    // Signal particles on active layer transition
    if(aL>0&&aL<layers.length){
      var sigT=(t*(layers.length+1))%1;
      var fL=nd.filter(function(n){return n.l===aL-1;});
      var tL=nd.filter(function(n){return n.l===aL;});
      fL.forEach(function(fn){
        tL.forEach(function(tn){
          ctx.save();ctx.globalAlpha=.7;ctx.beginPath();
          ctx.arc(lr(fn.x,tn.x,sigT),lr(fn.y,tn.y,sigT),2.5,0,Math.PI*2);
          ctx.fillStyle=lcols[fn.l];ctx.fill();ctx.restore();
        });
      });
    }
    // Nodes
    nd.forEach(function(n){
      var isA=n.l<aL,isC=n.l===aL;
      ctx.save();
      if(isA||isC){ctx.globalAlpha=isA?.15:.25;ctx.beginPath();ctx.arc(n.x,n.y,14,0,Math.PI*2);ctx.fillStyle=lcols[n.l];ctx.fill();}
      ctx.globalAlpha=isA?.9:isC?.7:.35;
      ctx.beginPath();ctx.arc(n.x,n.y,8,0,Math.PI*2);
      ctx.fillStyle=isA||isC?lcols[n.l]:'rgba(30,41,59,.8)';ctx.fill();
      ctx.strokeStyle=lcols[n.l];ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    });
    // Layer labels
    for(var l=0;l<layers.length;l++){
      var lx=W*(.1+l*.2),isA=l<aL;
      ctx.save();ctx.globalAlpha=isA?.8:.3;ctx.fillStyle=lcols[l];
      ctx.font=(isA?'600 ':'400 ')+Math.round(W*.026)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(llbls[l],lx,H*.88);ctx.restore();
    }
    // Output result
    if(aL>=layers.length){
      var oA=cl((t*(layers.length+1)-layers.length)/.5,0,1);
      ctx.save();ctx.globalAlpha=oA;
      rr(ctx,W*.76,H*.36,W*.2,H*.28,6,'rgba(20,184,166,.12)','#14b8a6',1.5);
      ctx.fillStyle='#2dd4bf';ctx.font='bold '+Math.round(W*.032)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Cat!',W*.86,H*.5);
      ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// ── Auto-Sequence Spotlight ───────────────────────────────────────────────────
(function(){
  var cards=[document.getElementById('c1'),document.getElementById('c2'),document.getElementById('c3')];
  var cur=0;
  function next(){
    cards.forEach(function(c){c.classList.remove('sp');});
    cards[cur].classList.add('sp');
    cur=(cur+1)%cards.length;
  }
  next();
  setInterval(next,4000);
})();

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('load',function(){
  setTimeout(function(){
    initP1(document.getElementById('cv1'));
    initP2(document.getElementById('cv2'));
    initP3(document.getElementById('cv3'));
  },500);
});
