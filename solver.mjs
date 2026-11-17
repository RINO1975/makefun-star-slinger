import {levels} from './game/src/levels.js';
import {searchLaunch} from './game/src/physics.js';
let failed=false;
for(const [i,level] of levels.entries()){
 const solution=searchLaunch(level);
 console.log(`${String(i+1).padStart(2,'0')} ${level.name}: ${solution?'SOLVED':'UNSOLVABLE'}`+(solution?` | angle ${(Math.atan2(solution.v.vy,solution.v.vx)*180/Math.PI).toFixed(0)}° | power ${Math.hypot(solution.v.vx,solution.v.vy).toFixed(0)} | ${solution.body.age.toFixed(2)}s | ${solution.body.collected.filter(Boolean).length}/${level.stars.length} stars`:''));
 if(!solution)failed=true;
}
if(failed)process.exitCode=1;
