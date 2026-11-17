import {C} from './config.js';
import {getLevel,levels} from './levels.js';
import {body,stepBody} from './physics.js';
import {createRandom} from './random.js';
export function createWorld(seed=1){
 const rng=createRandom(seed);
 const w={screen:'TITLE',index:0,total:0,totalStars:0,best:0,records:[],clock:0,events:[],particles:[],trail:[],aim:null,shake:0};
 w.load=(index)=>{w.index=index;w.level=getLevel(index);w.shots=w.level.shots;w.seconds=0;w.intro=C.introSeconds;w.comet=null;w.collected=w.level.stars.map(()=>false);w.aim=null;w.trail=[];w.particles=[];w.levelScore=0;};
 w.start=()=>{w.total=0;w.totalStars=0;w.records=[];w.load(0);w.screen='PLAY';};
 w.restart=()=>{w.records=w.records.slice(0,w.index);w.total=w.records.reduce((s,r)=>s+r.score,0);w.totalStars=w.records.reduce((s,r)=>s+r.stars,0);w.load(w.index);w.screen='PLAY';};
 w.next=()=>{if(w.screen!=='COMPLETE')return;w.records[w.index]={score:w.levelScore,stars:w.earned};w.total=w.records.reduce((s,r)=>s+r.score,0);w.totalStars=w.records.reduce((s,r)=>s+r.stars,0);if(w.index===levels.length-1){w.screen='VICTORY';w.best=Math.max(w.best,w.total);w.events.push('victory');}else{w.load(w.index+1);w.screen='PLAY';}};
 w.replay=()=>{w.restart();};
 w.launch=(v)=>{if(w.screen!=='PLAY'||w.comet)return;w.comet=body(w.level,v);w.comet.collected=[...w.collected];w.aim=null;w.events.push('launch');};
 w.burst=(x,y,colour)=>{for(let i=0;i<C.particles;i++){const a=rng()*Math.PI*2,s=30+rng()*130;w.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.5+rng()*.6,colour});}};
 w.step=()=>{
 if(w.screen==='PAUSE')return;
 w.clock+=C.dt;w.shake=Math.max(0,w.shake-C.dt*C.shakeDecay);
 for(const p of w.particles){p.x+=p.vx*C.dt;p.y+=p.vy*C.dt;p.life-=C.dt;}w.particles=w.particles.filter(p=>p.life>0);
 for(const p of w.trail)p.life-=C.dt;w.trail=w.trail.filter(p=>p.life>0);
 if(w.screen!=='PLAY')return;
 w.seconds+=C.dt;w.intro=Math.max(0,w.intro-C.dt);
 if(!w.comet)return;
 const b=w.comet,old=[...b.collected],events=stepBody(b,w.level);
 w.trail.push({x:b.x,y:b.y,life:C.trailLife});
 b.collected.forEach((v,i)=>{if(v&&!old[i])w.burst(w.level.stars[i].x,w.level.stars[i].y,C.amber);});
 w.collected=[...b.collected];w.events.push(...events);
 if(b.status==='goal'){
 w.earned=w.shots;w.levelScore=C.score.base+C.score.star*w.collected.filter(Boolean).length+C.score.shot*w.shots+Math.max(0,C.score.time-C.score.decay*Math.floor(w.seconds));w.screen='COMPLETE';w.burst(b.x,b.y,C.mint);
 }else if(b.status!=='flying'){
 w.burst(b.x,b.y,C.coral);w.shake=C.shake;w.shots--;w.comet=null;if(w.shots===0)w.screen='FAILED';
 }
 };
 w.load(0);return w;
}
