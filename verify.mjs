import assert from 'node:assert/strict';
import {createWorld} from './game/src/world.js';
import {stageShot} from './game/src/shots.js';
import {searchLaunch} from './game/src/physics.js';
for(const [shot,screen] of [['start','TITLE'],['play','PLAY'],['complete','COMPLETE'],['end','FAILED']]){
 const w=createWorld(1);stageShot(shot,w);assert.equal(w.screen,screen);
 if(shot==='play'){assert(w.comet);assert(w.collected.some(Boolean));assert(Math.abs(w.comet.age-2)<.001);}
 if(shot==='complete')assert(w.collected.every(Boolean));
 if(shot==='end'){assert.equal(w.shots,0);w.restart();assert.equal(w.shots,3);assert.equal(w.screen,'PLAY');}
 console.log('Screenshot autopilot:',shot,'→',screen,'verified');
}
const w=createWorld(1);assert.equal(w.screen,'TITLE');w.start();
const seconds=w.seconds;w.screen='PAUSE';w.step();assert.equal(w.seconds,seconds);w.screen='PLAY';
for(let i=0;i<10;i++){
 assert.equal(w.index,i);assert.equal(w.screen,'PLAY');const plan=searchLaunch(w.level);assert(plan);w.launch(plan.v);
 for(let t=0;t<1100&&w.screen==='PLAY';t++)w.step();
 assert.equal(w.screen,'COMPLETE');assert.equal(w.earned,3);assert(w.levelScore>0);
 if(i===0){w.replay();assert.equal(w.total,0);w.launch(plan.v);for(let t=0;t<1100&&w.screen==='PLAY';t++)w.step();assert.equal(w.screen,'COMPLETE');}
 w.next();
}
assert.equal(w.screen,'VICTORY');assert.equal(w.totalStars,30);assert(w.total>0);assert.equal(w.total,w.best);console.log('Full ten-level state flow → VICTORY:',w.total,'points,',w.totalStars,'medals');w.start();assert.equal(w.index,0);assert.equal(w.total,0);assert.equal(w.screen,'PLAY');console.log('Victory → new journey verified; pause, replay and failure retry verified.');
