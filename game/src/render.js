import {C} from './config.js';
import {createRandom} from './random.js';
import {predict,velocity} from './physics.js';
export function createRenderer(canvas,audio){
 const ctx=canvas.getContext('2d'),rng=createRandom(879);const sky=Array.from({length:210},()=>({x:rng()*1280,y:rng()*720,r:.4+rng()*1.5,layer:1+Math.floor(rng()*3),phase:rng()*7}));
 const api={buttons:[],draw};
 function text(s,x,y,size=20,colour=C.text,weight=400,align='left'){ctx.font=`${weight} ${size}px ${C.font}`;ctx.fillStyle=colour;ctx.textAlign=align;ctx.fillText(s,x,y);}
 function round(x,y,w,h,r=16){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
 function line(x,y,x2,y2,colour,width=1){ctx.strokeStyle=colour;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
 function circle(x,y,r,colour){ctx.fillStyle=colour;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 function glow(x,y,r,colour){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,colour);g.addColorStop(1,'transparent');circle(x,y,r,g);}
 function sparkle(x,y,r,colour,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle=colour;ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rad=i%2?r*.26:r;const px=Math.cos(a)*rad,py=Math.sin(a)*rad;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.restore();}
 function button(id,label,x,y,w=180,primary=false){api.buttons.push({id,x,y,w,h:48});round(x,y,w,48,12);ctx.fillStyle=primary?C.cyan:'#202b4c';ctx.fill();ctx.strokeStyle=primary?'#c5fbff':'#435276';ctx.lineWidth=1;ctx.stroke();text(label,x+w/2,y+30,16,primary?C.background:C.text,650,'center');}
 function background(t){const g=ctx.createLinearGradient(0,0,1280,720);g.addColorStop(0,C.background);g.addColorStop(1,C.background2);ctx.fillStyle=g;ctx.fillRect(0,0,1280,720);glow(950,410,450,'#41245c55');glow(300,650,330,'#133e6055');glow(680,140,260,'#37295633');for(const s of sky){const x=(s.x+t*s.layer*1.3)%1280;ctx.globalAlpha=.25+.4*(.5+.5*Math.sin(t*.6+s.phase));circle(x,s.y,s.r,s.layer===3?'#b3c6ff':'#ffffff');}ctx.globalAlpha=1;
 // Sparse navigational marks give the field a quiet observatory feel.
 ctx.strokeStyle='#7588b00e';ctx.lineWidth=1;for(let x=80;x<1280;x+=80){ctx.beginPath();ctx.moveTo(x,110);ctx.lineTo(x,680);ctx.stroke();}for(let y=120;y<720;y+=80){ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(1240,y);ctx.stroke();}
 }
 function field(w){const l=w.level,t=w.clock;
 for(let i=0;i<l.planets.length;i++){const p=l.planets[i];glow(p.x,p.y,p.radius*2.2,p.colour+'28');if(i===0){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.35);ctx.strokeStyle=p.colour+'50';ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(0,0,p.radius*1.65,p.radius*.45,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 const g=ctx.createRadialGradient(p.x-p.radius*.35,p.y-p.radius*.4,2,p.x,p.y,p.radius);g.addColorStop(0,'#fff1df');g.addColorStop(.15,p.colour);g.addColorStop(1,'#201c3d');circle(p.x,p.y,p.radius,g);ctx.strokeStyle=p.colour+'99';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.stroke();
 ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.clip();ctx.strokeStyle='#ffffff13';ctx.lineWidth=6;for(let j=-2;j<=2;j++){ctx.beginPath();ctx.ellipse(p.x,p.y+j*19,p.radius*1.1,12,-.3,0,Math.PI*2);ctx.stroke();}ctx.restore();}
 const unlocked=w.collected.every(Boolean),g=l.goal,r=g.radius||C.goalRadius;
 glow(g.x,g.y,r*2.3,unlocked?'#5dffa02a':'#5dffa012');ctx.save();ctx.translate(g.x,g.y);ctx.rotate(t*.3);ctx.setLineDash([9,6]);ctx.strokeStyle=unlocked?C.mint:'#5dffa075';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r+Math.sin(t*3)*2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#5dffa027';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r+9,0,Math.PI*2);ctx.stroke();ctx.restore();text(unlocked?'ENTER THE HALO':'COLLECT TO UNLOCK',g.x,g.y+r+29,10,C.mint,650,'center');
 l.stars.forEach((s,i)=>{if(w.collected[i]){ctx.strokeStyle='#ffc94d32';ctx.lineWidth=1;ctx.beginPath();ctx.arc(s.x,s.y,9,0,Math.PI*2);ctx.stroke();return;}glow(s.x,s.y,34,'#ffc94d30');sparkle(s.x,s.y,16+Math.sin(t*2+i)*2,C.amber,t*.25);circle(s.x,s.y,3,'#fff8d6');});
 const pad=l.pad;ctx.strokeStyle='#7ff3ff45';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pad.x,pad.y,27,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(pad.x,pad.y,34,-.5,1.2);ctx.stroke();text('LAUNCH',pad.x,pad.y+55,10,C.cyan,650,'center');
 if(w.aim){const v=velocity(pad,w.aim),p=predict(l,v,C.previewSteps,w.collected);for(let i=0;i<p.points.length;i+=4){const q=p.points[i];ctx.globalAlpha=(1-i/p.points.length)*.65;circle(q.x,q.y,i%12===0?3:1.7,C.cyan);}ctx.globalAlpha=1;line(pad.x,pad.y,w.aim.x,w.aim.y,'#7ff3ff65',2);circle(w.aim.x,w.aim.y,5,C.cyan);text(`${Math.round(Math.hypot(v.vx,v.vy)/6)}%`,pad.x,pad.y-42,13,C.cyan,600,'center');}
 for(const p of w.trail){ctx.globalAlpha=p.life/C.trailLife*.65;circle(p.x,p.y,2+4*p.life/C.trailLife,C.cyan);}ctx.globalAlpha=1;
 const b=w.comet||pad;glow(b.x,b.y,30,'#7ff3ff65');circle(b.x,b.y,9,C.cyan);circle(b.x-2,b.y-2,4,'#ffffff');
 for(const p of w.particles){ctx.globalAlpha=Math.min(1,p.life*2);sparkle(p.x,p.y,3,p.colour);}ctx.globalAlpha=1;
 }
 function hud(w){ctx.fillStyle='#0b1026dd';ctx.fillRect(0,0,1280,94);line(32,94,1248,94,'#8299cc30');text('STAR SLINGER',32,31,12,C.cyan,750);text(`${String(w.index+1).padStart(2,'0')} / 10   ${w.level.name}`,32,65,23,C.text,650);
 text('STARS',467,28,10,C.muted,650);for(let i=0;i<3;i++){const active=i<w.level.stars.length;sparkle(480+i*29,53,10,w.collected[i]?C.amber:active?'#69708a':'#29314b');}
 text('SHOTS',595,28,10,C.muted,650);for(let i=0;i<3;i++){circle(608+i*25,53,6,i<w.shots?C.cyan:'#29314b');line(597+i*25,58,604+i*25,54,i<w.shots?C.cyan:'#29314b',2);}
 text('SCORE',730,28,10,C.muted,650);text(String(w.total+(w.screen==='COMPLETE'?w.levelScore:0)).padStart(5,'0'),730,62,25,C.text,650);
 button('restart','↻  R',899,24,91);button('mute',audio.muted?'Sound off':'♫  M',1002,24,112);button('pause',w.screen==='PAUSE'?'▶  P':'Ⅱ  P',1126,24,120);
 text('PULL BACK. FIND YOUR ORBIT.',32,698,10,C.muted,650);text('R restart    •    P pause    •    M sound',1248,698,11,C.muted,400,'right');
 }
 function panel(x,y,width,height){round(x,y,width,height,24);ctx.fillStyle='#0c1429ed';ctx.fill();ctx.strokeStyle='#687fab50';ctx.lineWidth=1;ctx.stroke();}
 function overlay(w){
 if(w.screen==='TITLE'){
 ctx.fillStyle='#0b10266b';ctx.fillRect(0,0,1280,720);panel(64,105,610,525);
 text('A GRAVITY SLINGSHOT PUZZLE',102,155,12,C.cyan,700);text('STAR',98,248,83,C.text,800);text('SLINGER',98,330,83,C.text,800);
 text('A little pull. A cosmic journey.',103,374,23,C.muted,400);
 const lines=['01   Drag from the comet. Pull back to aim.','02   Release. Let the planets bend your flight.','03   Catch every star, then enter the green halo.'];lines.forEach((s,i)=>text(s,104,422+i*29,16,C.text));
 button('start','Launch journey  →',103,521,260,true);text('Click or press Enter to start',103,597,13,C.muted);text(`PERSONAL BEST   ${w.best.toLocaleString()}`,634,597,12,C.amber,650,'right');
 text('10 ORBITS',1000,590,31,C.text,700,'center');text('3 SHOTS. INFINITE POSSIBILITY.',1000,619,11,C.muted,600,'center');return;
 }
 if(w.screen==='PLAY'){
 if(w.intro>0){ctx.globalAlpha=Math.min(1,w.intro);panel(440,113,400,58);text(`Level ${w.index+1} — ${w.level.name}`,640,150,21,C.text,650,'center');ctx.globalAlpha=1;}
 if(w.index===0&&w.seconds<C.hintSeconds&&!w.comet)text('Drag from the comet to aim — release to launch',640,653,19,C.cyan,500,'center');return;
 }
 ctx.fillStyle='#080c2088';ctx.fillRect(0,95,1280,625);panel(365,176,550,414);
 if(w.screen==='COMPLETE'){
 text('ORBIT COMPLETE',640,225,12,C.mint,750,'center');text(w.level.name,640,273,36,C.text,750,'center');for(let i=0;i<3;i++)sparkle(586+i*54,318,21,i<w.earned?C.amber:'#34405b');
 text(`Stars collected     ${w.collected.filter(Boolean).length} × 250`,414,372,16,C.muted);text(`Shots remaining     ${w.shots} × 200`,414,402,16,C.muted);text(`Base 500  +  time bonus ${Math.max(0,300-5*Math.floor(w.seconds))}`,414,432,16,C.muted);text(`+${w.levelScore}`,864,414,36,C.mint,750,'right');button('replay','Replay  R',414,499,190);button('next',w.index===9?'Finish journey →':'Next orbit  N  →',624,499,240,true);
 }else if(w.screen==='PAUSE'){
 text('TAKE A BREATH',640,235,12,C.cyan,700,'center');text('Between the stars',640,292,36,C.text,700,'center');text('Your orbit will be right here.',640,345,19,C.muted,400,'center');button('pause','Resume  P',440,390,400,true);button('restart','Restart  R',440,454,190);button('title','Quit to title',650,454,190);
 }else if(w.screen==='FAILED'){
 text('OUT OF SHOTS',640,239,12,C.coral,750,'center');text('Space is a good teacher.',640,298,31,C.text,700,'center');text('Try a different angle. Trust the dotted path.',640,352,17,C.muted,400,'center');text(`${w.collected.filter(Boolean).length} / ${w.level.stars.length} stars found`,640,400,20,C.amber,600,'center');button('title','Title',414,490,190);button('retry','Try again  →',624,490,240,true);
 }else if(w.screen==='VICTORY'){
 text('ALL TEN ORBITS • ONE COSMIC JOURNEY',640,229,12,C.mint,750,'center');text('You brought the light home.',640,284,30,C.text,750,'center');text(w.total.toLocaleString(),640,355,55,C.amber,800,'center');text(`${w.totalStars} / 30 medals   •   Best ${w.best.toLocaleString()}`,640,400,18,C.muted,500,'center');button('start','Play again  →',465,474,350,true);
 }
 }
 function draw(w){const dpr=Math.min(window.devicePixelRatio||1,2);const width=canvas.clientWidth,height=canvas.clientHeight;if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=C.background;ctx.fillRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/1280,canvas.height/720);ctx.setTransform(scale,0,0,scale,(canvas.width-1280*scale)/2,(canvas.height-720*scale)/2);api.buttons=[];ctx.save();background(w.clock);if(w.shake)ctx.translate(Math.sin(w.clock*93)*w.shake,Math.cos(w.clock*77)*w.shake);field(w);ctx.restore();if(w.screen!=='TITLE')hud(w);overlay(w);}
 return api;
}
