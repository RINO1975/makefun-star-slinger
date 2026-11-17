import {C} from './config.js';
import {distance,velocity} from './physics.js';
export function attachInput(canvas,w,renderer,audio){
 const action=(id)=>{audio.unlock();audio.play('ui');if(id==='mute'){audio.toggle();return;}if(id==='start'){w.start();return;}if(id==='title'){w.screen='TITLE';w.aim=null;return;}if(id==='restart'||id==='retry'||id==='replay'){w.restart();return;}if(id==='next'){w.next();return;}if(id==='pause'){if(w.screen==='PLAY'||w.screen==='PAUSE'){w.screen=w.screen==='PAUSE'?'PLAY':'PAUSE';w.aim=null;}return;}};
 const point=e=>{const r=canvas.getBoundingClientRect(),s=Math.min(r.width/C.width,r.height/C.height);return{x:(e.clientX-r.left-(r.width-C.width*s)/2)/s,y:(e.clientY-r.top-(r.height-C.height*s)/2)/s};};
 canvas.addEventListener('pointerdown',e=>{audio.unlock();const p=point(e);const hit=renderer.buttons.find(b=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h);if(hit){action(hit.id);return;}if(w.screen==='TITLE'){action('start');return;}if(w.screen==='PLAY'&&!w.comet&&distance(p,w.level.pad)<42){w.aim=p;canvas.setPointerCapture(e.pointerId);}});
 canvas.addEventListener('pointermove',e=>{if(w.aim)w.aim=point(e);});
 canvas.addEventListener('pointerup',e=>{if(!w.aim)return;const p=point(e),d=distance(p,w.level.pad);w.aim=null;if(d>=C.minPull)w.launch(velocity(w.level.pad,p));});
 canvas.addEventListener('pointercancel',()=>w.aim=null);
 window.addEventListener('blur',()=>{if(w.screen==='PLAY')action('pause');});
 window.addEventListener('keydown',e=>{if(e.repeat)return;const key=e.key.toLowerCase();if(['enter','r','n','m','p','escape'].includes(key))e.preventDefault();if(key==='m')action('mute');else if(key==='p'||key==='escape')action('pause');else if(key==='r'&&['PLAY','PAUSE','COMPLETE','FAILED'].includes(w.screen))action('restart');else if(key==='n'&&w.screen==='COMPLETE')action('next');else if(key==='enter'){if(w.screen==='TITLE'||w.screen==='VICTORY')action('start');else if(w.screen==='COMPLETE')action('next');else if(w.screen==='FAILED')action('retry');else if(w.screen==='PAUSE')action('pause');}});
}
