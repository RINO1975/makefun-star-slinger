import {C} from './config.js';
import {createWorld} from './world.js';
import {createRenderer} from './render.js';
import {createAudio} from './audio.js';
import {attachInput} from './input.js';
import {stageShot} from './shots.js';
const query=new URLSearchParams(location.search),canvas=document.getElementById('game');
const w=createWorld(Number(query.get('seed'))||1),audio=createAudio(),renderer=createRenderer(canvas,audio);
try{w.best=Number(localStorage.getItem(C.bestKey))||0;}catch{}
attachInput(canvas,w,renderer,audio);
if(query.has('shot')){stageShot(query.get('shot'),w);renderer.draw(w);window.__shotReady=true;}
else {let last=performance.now(),acc=0;function frame(now){acc+=Math.min(.1,(now-last)/1000);last=now;while(acc>=C.dt){w.step();acc-=C.dt;}for(const event of w.events.splice(0))audio.play(event);if(w.screen==='VICTORY'){try{localStorage.setItem(C.bestKey,String(w.best));}catch{}}renderer.draw(w);requestAnimationFrame(frame);}requestAnimationFrame(frame);}
