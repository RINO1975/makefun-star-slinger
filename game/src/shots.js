import {C} from './config.js';
import {searchLaunch} from './physics.js';
export function stageShot(name,w){
 if(name==='start'){for(let i=0;i<180;i++)w.step();return;}
 w.start();
 if(name==='end'){
 while(w.screen==='PLAY'){w.launch({vx:-300,vy:0});for(let i=0;i<200&&w.comet&&w.screen==='PLAY';i++)w.step();}return;
 }
 const plan=searchLaunch(w.level,name==='play'?r=>r.points[119]?.collected>0&&r.points[119]?.status==='flying':undefined);
 if(!plan)throw Error('Screenshot autopilot found no launch');
 w.launch(plan.v);
 const limit=name==='play'?120:1080;
 for(let i=0;i<limit&&w.screen==='PLAY';i++)w.step();
}
