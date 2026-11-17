import {C} from './config.js';
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function velocity(pad,pointer){let x=pad.x-pointer.x,y=pad.y-pointer.y;const d=Math.hypot(x,y),s=Math.min(d,C.maxPull)*C.launchScale/(d||1);return {vx:x*s,vy:y*s};}
export function body(level,v){return {...level.pad,...v,age:0,collected:level.stars.map(()=>false),status:'flying'};}
export function stepBody(b,level){
 if(b.status!=='flying')return [];
 const events=[];let ax=0,ay=0;
 for(const p of level.planets){const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy);const a=C.G*p.mass/(d*d+C.soft*C.soft);ax+=a*dx/(d||1);ay+=a*dy/(d||1);}
 b.vx+=ax*C.dt;b.vy+=ay*C.dt;b.x+=b.vx*C.dt;b.y+=b.vy*C.dt;b.age+=C.dt;
 for(const p of level.planets)if(distance(b,p)<p.radius+C.comet)b.status='crash';
 if(b.x<0||b.x>C.width||b.y<100||b.y>C.height||b.age>C.maxFlight)b.status='lost';
 if(b.status!=='flying')return [b.status];
 level.stars.forEach((s,i)=>{if(!b.collected[i]&&distance(b,s)<C.starRadius+C.comet){b.collected[i]=true;events.push('star');}});
 if(b.collected.every(Boolean)&&distance(b,level.goal)<(level.goal.radius||C.goalRadius)){b.status='goal';events.push('goal');}
 return events;
}
export function predict(level,v,steps=C.previewSteps,collected=null){const b=body(level,v),points=[];if(collected)b.collected=[...collected];for(let i=0;i<steps&&b.status==='flying';i++){stepBody(b,level);points.push({x:b.x,y:b.y,collected:b.collected.filter(Boolean).length,status:b.status});}return {body:b,points};}
export function searchLaunch(level,accept=r=>r.body.status==='goal'){
 for(let power=C.search.minPower;power<=C.search.maxPower;power+=C.search.powerStep)for(let deg=C.search.minAngle;deg<=C.search.maxAngle;deg+=C.search.angleStep){const a=deg*Math.PI/180,v={vx:Math.cos(a)*power,vy:Math.sin(a)*power};const result=predict(level,v,C.search.steps);if(accept(result))return {v,...result};}return null;
}
