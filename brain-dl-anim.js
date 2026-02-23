// ── Helpers ───────────────────────────────────────────────────────────────────
var eo=function(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3);};
var cl=function(v,a,b){return Math.max(a,Math.min(b,v));};
var lr=function(a,b,t){return a+(b-a)*t;};

// ── Background Particles ──────────────────────────────────────────────────────
(function(){
  var c=document.getElementById('bgc'),ctx=c.getContext('2d');
  c.width=1280;c.height=720;
  var pts=[];
  for(var i=0;i<50;i++) pts.push({x:Math.random()*1280,y:Math.random()*720,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5});
  (function loop(){
    ctx.clearRect(0,0,1280,720);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>1280)p.vx*=-1;if(p.y<0||p.y>720)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(100,116,139,.55)';ctx.fill();
    }
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ctx.beginPath();ctx.strokeStyle='rgba(100,116,139,'+(1-d/120)*.35+')';ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// ── Main Neural Network (Left Panel) ─────────────────────────────────────────
(function(){
  var c=document.getElementById('nnc'),ctx=c.getContext('2d');
  var W=420,H=310;
  var LAYERS=[
    {count:3,color:'#60a5fa',glow:'rgba(96,165,250,.5)'},
    {count:5,color:'#a855f7',glow:'rgba(168,85,247,.5)'},
    {count:5,color:'#a855f7',glow:'rgba(168,85,247,.5)'},
    {count:3,color:'#2dd4bf',glow:'rgba(45,212,191,.5)'}
  ];
  var NODE_R=10,MX=55;
  var nodes=[];
  var xStep=(W-2*MX)/(LAYERS.length-1);
  for(var li=0;li<LAYERS.length;li++){
    var lx=MX+li*xStep;
    nodes.push([]);
    var yStep=H/(LAYERS[li].count+1);
    for(var ni=0;ni<LAYERS[li].count;ni++){
      nodes[li].push({x:lx,y:yStep*(ni+1),pulse:Math.random()*Math.PI*2});
    }
  }
  var signals=[];
  function spawnSig(){
    var path=[{l:0,n:Math.floor(Math.random()*nodes[0].length)}];
    for(var li=1;li<LAYERS.length;li++) path.push({l:li,n:Math.floor(Math.random()*nodes[li].length)});
    signals.push({path:path,seg:0,t:0});
  }
  for(var i=0;i<6;i++) setTimeout(spawnSig,i*400);
  setInterval(spawnSig,600);

  (function loop(){
    ctx.clearRect(0,0,W,H);
    // Connections
    for(var li=0;li<LAYERS.length-1;li++){
      for(var a=0;a<nodes[li].length;a++){
        for(var b=0;b<nodes[li+1].length;b++){
          ctx.beginPath();ctx.moveTo(nodes[li][a].x,nodes[li][a].y);ctx.lineTo(nodes[li+1][b].x,nodes[li+1][b].y);
          ctx.strokeStyle='rgba(71,85,105,.35)';ctx.lineWidth=.8;ctx.stroke();
        }
      }
    }
    // Signals
    for(var si=signals.length-1;si>=0;si--){
      var sig=signals[si];sig.t+=0.012;
      if(sig.t>=1){sig.t=0;sig.seg++;if(sig.seg>=sig.path.length-1){signals.splice(si,1);continue;}}
      var na=nodes[sig.path[sig.seg].l][sig.path[sig.seg].n];
      var nb=nodes[sig.path[sig.seg+1].l][sig.path[sig.seg+1].n];
      var px=na.x+(nb.x-na.x)*sig.t,py=na.y+(nb.y-na.y)*sig.t;
      var g=ctx.createRadialGradient(px,py,0,px,py,7);
      g.addColorStop(0,'rgba(96,165,250,.9)');g.addColorStop(1,'rgba(96,165,250,0)');
      ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#bfdbfe';ctx.fill();
    }
    // Nodes
    for(var li=0;li<LAYERS.length;li++){
      var layer=LAYERS[li];
      for(var ni=0;ni<nodes[li].length;ni++){
        var nd=nodes[li][ni];nd.pulse+=0.04;
        var r=NODE_R*(1+Math.sin(nd.pulse)*.12);
        var grd=ctx.createRadialGradient(nd.x,nd.y,0,nd.x,nd.y,r*2.5);
        grd.addColorStop(0,layer.glow);grd.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath();ctx.arc(nd.x,nd.y,r*2.5,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
        ctx.beginPath();ctx.arc(nd.x,nd.y,r,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();
        ctx.strokeStyle=layer.color;ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();ctx.arc(nd.x,nd.y,r*.45,0,Math.PI*2);
        ctx.fillStyle=layer.color;ctx.globalAlpha=.6+Math.sin(nd.pulse)*.3;ctx.fill();ctx.globalAlpha=1;
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// ── Card 1: Bio Neuron vs Artificial Neuron ───────────────────────────────────
function initCard1(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  var CYCLE=200;
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CYCLE)/CYCLE,cx=W/2,cy=H/2;
    var pulse=Math.sin(frame*.06)*.5+.5;

    // ── LEFT: Biological Neuron ──
    var bx=W*.25;
    // Dendrites (3 inputs)
    var dendrites=[{ax:bx-W*.18,ay:cy-H*.28},{ax:bx-W*.2,ay:cy},{ax:bx-W*.18,ay:cy+H*.28}];
    dendrites.forEach(function(d,i){
      var dp=cl((n-(i*.08))/.15,0,1);
      ctx.save();ctx.globalAlpha=.5+dp*.4;
      ctx.strokeStyle='#60a5fa';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(d.ax,d.ay);ctx.lineTo(bx-W*.06,cy);ctx.stroke();
      if(dp>.1){
        var px=lr(d.ax,bx-W*.06,dp),py=lr(d.ay,cy,dp);
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#93c5fd';ctx.fill();
      }
      ctx.restore();
    });
    // Cell body
    ctx.save();
    var bg=ctx.createRadialGradient(bx,cy,0,bx,cy,H*.18);
    bg.addColorStop(0,'rgba(96,165,250,.25)');bg.addColorStop(1,'rgba(96,165,250,.05)');
    ctx.beginPath();ctx.arc(bx,cy,H*.18,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle='#60a5fa';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='#93c5fd';ctx.font='bold '+Math.round(H*.18)+'px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('∑',bx,cy+1);
    ctx.restore();
    // Axon output
    var axP=cl((n-.45)/.2,0,1);
    ctx.save();ctx.globalAlpha=.5+axP*.4;
    ctx.strokeStyle='#60a5fa';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bx+H*.18,cy);ctx.lineTo(bx+W*.18,cy);ctx.stroke();
    if(axP>.1){
      var apx=lr(bx+H*.18,bx+W*.18,axP);
      ctx.beginPath();ctx.arc(apx,cy,3,0,Math.PI*2);ctx.fillStyle='#93c5fd';ctx.fill();
    }
    ctx.restore();
    // Label
    ctx.save();ctx.fillStyle='#475569';ctx.font=Math.round(H*.14)+'px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('Biological',bx,H*.92);ctx.restore();

    // ── DIVIDER ──
    ctx.save();ctx.globalAlpha=.2;ctx.strokeStyle='#334155';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(cx,H*.05);ctx.lineTo(cx,H*.95);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    ctx.save();ctx.fillStyle='#475569';ctx.font='bold '+Math.round(H*.18)+'px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('≈',cx,cy);ctx.restore();

    // ── RIGHT: Artificial Neuron ──
    var ax=W*.75;
    var inputs=[{ix:ax-W*.18,iy:cy-H*.28,w:'0.8'},{ix:ax-W*.2,iy:cy,w:'0.5'},{ix:ax-W*.18,iy:cy+H*.28,w:'0.3'}];
    inputs.forEach(function(inp,i){
      var ip=cl((n-(i*.08))/.15,0,1);
      ctx.save();ctx.globalAlpha=.5+ip*.4;
      ctx.strokeStyle='#a855f7';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(inp.ix,inp.iy);ctx.lineTo(ax-W*.06,cy);ctx.stroke();
      // Weight label
      ctx.globalAlpha=.7;ctx.fillStyle='#c084fc';ctx.font=Math.round(H*.13)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.fillText('w='+inp.w,lr(inp.ix,ax-W*.06,.5),lr(inp.iy,cy,.5)-6);
      if(ip>.1){
        var ppx=lr(inp.ix,ax-W*.06,ip),ppy=lr(inp.iy,cy,ip);
        ctx.globalAlpha=1;ctx.beginPath();ctx.arc(ppx,ppy,3,0,Math.PI*2);ctx.fillStyle='#d8b4fe';ctx.fill();
      }
      ctx.restore();
    });
    // Node body
    ctx.save();
    var ag=ctx.createRadialGradient(ax,cy,0,ax,cy,H*.18);
    ag.addColorStop(0,'rgba(168,85,247,.25)');ag.addColorStop(1,'rgba(168,85,247,.05)');
    ctx.beginPath();ctx.arc(ax,cy,H*.18,0,Math.PI*2);ctx.fillStyle=ag;ctx.fill();
    ctx.strokeStyle='#a855f7';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='#d8b4fe';ctx.font='bold '+Math.round(H*.18)+'px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('∑',ax,cy+1);ctx.restore();
    // Output
    var ouP=cl((n-.45)/.2,0,1);
    ctx.save();ctx.globalAlpha=.5+ouP*.4;
    ctx.strokeStyle='#a855f7';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ax+H*.18,cy);ctx.lineTo(ax+W*.16,cy);ctx.stroke();
    if(ouP>.1){
      var opx=lr(ax+H*.18,ax+W*.16,ouP);
      ctx.beginPath();ctx.arc(opx,cy,3,0,Math.PI*2);ctx.fillStyle='#d8b4fe';ctx.fill();
    }
    ctx.restore();
    ctx.save();ctx.fillStyle='#475569';ctx.font=Math.round(H*.14)+'px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('Artificial',ax,H*.92);ctx.restore();

    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.concept-card').addEventListener('click',function(){frame=0;});
}

// ── Card 2: Learning Curve ────────────────────────────────────────────────────
function initCard2(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  var CYCLE=280;
  var rng=42;function sr(){rng=(rng*9301+49297)%233280;return rng/233280;}
  var dpts=[];for(var i=0;i<18;i++) dpts.push({x:.05+sr()*.9,y:Math.max(.05,(.95-sr()*.5*(.05+i/18)))});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CYCLE)/CYCLE;
    var px=W*.08,py=H*.08,pw=W*.84,ph=H*.78;
    // Plot bg
    ctx.save();ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(px,py,pw,ph);ctx.restore();
    // Axes
    ctx.save();ctx.strokeStyle='#1e293b';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+ph);ctx.lineTo(px+pw,py+ph);ctx.stroke();
    ctx.fillStyle='#334155';ctx.font=Math.round(H*.1)+'px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('Training Data',px+pw/2,py+ph+H*.14);
    ctx.save();ctx.translate(px-H*.12,py+ph/2);ctx.rotate(-Math.PI/2);ctx.fillText('Accuracy',0,0);ctx.restore();
    ctx.restore();
    // Curve draws itself
    var curveP=cl(n/.7,0,1);
    if(curveP>0){
      ctx.save();ctx.strokeStyle='rgba(168,85,247,.8)';ctx.lineWidth=2.5;ctx.lineJoin='round';
      ctx.beginPath();
      var pts=20;
      for(var i=0;i<=Math.floor(pts*curveP);i++){
        var t=i/pts;
        var cx2=px+t*pw;
        var cy2=py+ph-(1-Math.exp(-t*4))*ph*.88;
        if(i===0)ctx.moveTo(cx2,cy2);else ctx.lineTo(cx2,cy2);
      }
      ctx.stroke();
      // Glow
      ctx.strokeStyle='rgba(168,85,247,.2)';ctx.lineWidth=8;ctx.stroke();
      ctx.restore();
    }
    // Data points scatter in
    var dpN=Math.floor(curveP*dpts.length);
    for(var i=0;i<dpN;i++){
      var d=dpts[i];
      ctx.save();ctx.globalAlpha=.75;ctx.beginPath();
      ctx.arc(px+d.x*pw,py+ph-d.y*ph,4,0,Math.PI*2);
      ctx.fillStyle='rgba(168,85,247,.7)';ctx.fill();
      ctx.strokeStyle='#a855f7';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    }
    // Accuracy counter
    if(n>.3){
      var acc=Math.round(cl((n-.3)/.6,0,1)*94);
      ctx.save();ctx.globalAlpha=cl((n-.3)/.1,0,1);
      ctx.fillStyle='#c084fc';ctx.font='bold '+Math.round(W*.055)+'px Montserrat,sans-serif';
      ctx.textAlign='right';ctx.textBaseline='top';ctx.fillText(acc+'%',px+pw-4,py+4);ctx.restore();
    }
    // "More data" arrow annotation
    if(n>.6){
      var aA=cl((n-.6)/.15,0,1);
      ctx.save();ctx.globalAlpha=aA*.7;ctx.strokeStyle='#6ee7b7';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(px+pw*.1,py+ph*.5);ctx.lineTo(px+pw*.85,py+ph*.12);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#6ee7b7';ctx.font=Math.round(H*.11)+'px Inter,sans-serif';ctx.textAlign='center';
      ctx.fillText('↑ more data = better',px+pw*.5,py+ph*.35);ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.concept-card').addEventListener('click',function(){frame=0;});
}

// ── Card 3: Layer Depth Visualization ────────────────────────────────────────
function initCard3(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  var CYCLE=260;
  var stages=['Pixels','Edges','Shapes','Objects','Cat!'];
  var cols=['#60a5fa','#818cf8','#a855f7','#6ee7b7','#2dd4bf'];
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CYCLE)/CYCLE;
    var bw=W*.14,bh=H*.72,gap=W*.04;
    var totalW=stages.length*bw+(stages.length-1)*gap;
    var startX=(W-totalW)/2;
    var cy=H/2;
    var activeStage=Math.floor(n*stages.length*1.2);

    for(var i=0;i<stages.length;i++){
      var bx=startX+i*(bw+gap);
      var isAct=i<=activeStage;
      var isCur=i===activeStage;
      var bA=isAct?1:.35;

      // Arrow between boxes
      if(i>0){
        var arx=bx-gap/2;
        ctx.save();ctx.globalAlpha=i<activeStage?.7:.2;
        ctx.strokeStyle=cols[i-1];ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(arx-gap*.3,cy);ctx.lineTo(arx+gap*.3,cy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(arx+gap*.3-5,cy-4);ctx.lineTo(arx+gap*.3,cy);ctx.lineTo(arx+gap*.3-5,cy+4);ctx.stroke();
        ctx.restore();
      }

      // Box glow
      if(isCur){
        ctx.save();ctx.globalAlpha=.15;
        var gg=ctx.createRadialGradient(bx+bw/2,cy,0,bx+bw/2,cy,bw);
        gg.addColorStop(0,cols[i]);gg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=gg;ctx.fillRect(bx-bw*.3,cy-bh*.6,bw*1.6,bh*1.2);ctx.restore();
      }

      // Box
      ctx.save();ctx.globalAlpha=bA;
      ctx.fillStyle=isAct?'rgba(30,41,59,.8)':'rgba(15,23,42,.6)';
      ctx.strokeStyle=isCur?cols[i]:isAct?cols[i]:'#1e293b';
      ctx.lineWidth=isCur?2:1;
      ctx.beginPath();ctx.roundRect?ctx.roundRect(bx,cy-bh/2,bw,bh,6):ctx.rect(bx,cy-bh/2,bw,bh);
      ctx.fill();ctx.stroke();

      // Mini visual inside box
      drawStageVisual(ctx,i,bx+bw/2,cy,bw*.7,bh*.55,cols[i],isAct,frame);

      // Label
      ctx.fillStyle=isCur?cols[i]:isAct?'#94a3b8':'#334155';
      ctx.font=(isCur?'bold ':'')+(Math.round(H*.11))+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='top';
      ctx.fillText(stages[i],bx+bw/2,cy+bh/2+4);
      ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.concept-card').addEventListener('click',function(){frame=0;});
}

function drawStageVisual(ctx,stage,cx,cy,w,h,col,active,frame){
  ctx.save();ctx.globalAlpha=active?.85:.3;
  if(stage===0){
    // Pixel grid
    var gs=Math.floor(w/5);
    for(var r=0;r<4;r++) for(var c2=0;c2<4;c2++){
      var v=Math.sin(frame*.03+r*1.3+c2*.7)*.5+.5;
      ctx.fillStyle='rgba('+Math.round(96+v*100)+','+Math.round(165+v*50)+',250,'+(.3+v*.5)+')';
      ctx.fillRect(cx-w/2+c2*gs+1,cy-h/2+r*gs+1,gs-2,gs-2);
    }
  } else if(stage===1){
    // Edge lines
    ctx.strokeStyle=col;ctx.lineWidth=1.5;
    [[cx-w*.3,cy-h*.3,cx+w*.3,cy-h*.3],[cx-w*.3,cy-h*.3,cx-w*.3,cy+h*.3],
     [cx-w*.3,cy+h*.3,cx+w*.3,cy+h*.3],[cx+w*.3,cy-h*.3,cx+w*.3,cy+h*.3]].forEach(function(l){
      ctx.beginPath();ctx.moveTo(l[0],l[1]);ctx.lineTo(l[2],l[3]);ctx.stroke();
    });
  } else if(stage===2){
    // Shape outline (circle)
    ctx.strokeStyle=col;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(cx,cy,h*.35,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy-h*.2,h*.15,0,Math.PI*2);ctx.stroke();
  } else if(stage===3){
    // Object silhouette (cat-like)
    ctx.strokeStyle=col;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(cx,cy,h*.3,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-h*.2,cy-h*.3);ctx.lineTo(cx-h*.3,cy-h*.5);ctx.lineTo(cx-h*.1,cy-h*.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+h*.2,cy-h*.3);ctx.lineTo(cx+h*.3,cy-h*.5);ctx.lineTo(cx+h*.1,cy-h*.3);ctx.stroke();
  } else if(stage===4){
    // "Cat!" label with glow
    var pulse=Math.sin(frame*.08)*.5+.5;
    ctx.globalAlpha=active?(.7+pulse*.3):.3;
    ctx.fillStyle=col;ctx.font='bold '+Math.round(h*.45)+'px Montserrat,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Cat!',cx,cy);
  }
  ctx.restore();
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('load',function(){
  setTimeout(function(){
    var c1=document.getElementById('cvc1');
    var c2=document.getElementById('cvc2');
    var c3=document.getElementById('cvc3');
    if(c1)initCard1(c1);
    if(c2)initCard2(c2);
    if(c3)initCard3(c3);
  },600);
});
