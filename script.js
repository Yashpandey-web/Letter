(() => {
  const $ = id => document.getElementById(id);
  const screens = ['builderScreen','welcomeScreen','questionScreen','celebrationScreen','letterScreen','giftScreen'];
  const defaults = {
    senderName:'', recipientName:'', question:'Do you love me?',
    letter:"I just wanted to remind you how special you are. You make ordinary moments feel magical, and I'm really glad you're in my world. 💗",
    finalMessage:"You just made someone's whole universe brighter. 💗", theme:'blush', musicUrl:'', videoUrl:''
  };
  let cfg={...defaults}, recipient='', sender='', attempts=0, audioCtx=null, soundOn=false, lastEscape=0, musicStarted=false;
  const noTexts=['No 🙈','Are you sure?','Think again!','Nice try 😂','Not so fast!','You cannot escape love!','Still trying? 💗'];
  function showScreen(id){screens.forEach(s=>$(s).classList.toggle('active',s===id));window.scrollTo({top:0,behavior:'smooth'});}
  function encodeConfig(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function decodeConfig(value){try{const b64=value.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(b64);const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes));}catch(e){return null;}}
  function applyTheme(theme){document.body.dataset.theme=['blush','lavender','midnight','sunset'].includes(theme)?theme:'blush';}
  function personalize(){
    $('welcomeName').textContent=recipient?` ${recipient}`:' you';$('welcomeFrom').textContent=sender?`A little surprise, made with love by ${sender}.`:'A little interactive surprise has been made especially for you.';
    $('questionKicker').textContent=sender?`${sender} has a little question...`:"I've been meaning to ask...";
    const question=(cfg.question||'Do you love me?').trim();$('questionTitle').innerHTML='';$('questionTitle').append(document.createTextNode(question.replace(/\?$/,'')));const mark=document.createElement('span');mark.className='question-mark';mark.textContent='?';$('questionTitle').append(mark);
    $('celebrationCopy').textContent=recipient?`${recipient}, you just made this moment extra magical.`:'Somebody is smiling very, very hard right now.';
    $('letterText').textContent=cfg.letter;$('letterSignoff').textContent=sender?`With love, ${sender} ♡`:'With love, always ♡';
    $('finalMessageText').textContent=cfg.finalMessage;$('finalSignature').textContent=sender?`A little surprise from ${sender} ♡`:'Made with a little extra affection ♡';
    const video=$('celebrationVideo');const source=video.querySelector('source');source.src=cfg.videoUrl||'cute love gif.mp4';video.load();
  }
  function loadExperience(data){cfg={...defaults,...data};recipient=cfg.recipientName||'';sender=cfg.senderName||'';applyTheme(cfg.theme);personalize();showScreen('welcomeScreen');}

  // Builder creates a share URL for this exact same website/experience.
  const incoming=new URLSearchParams(location.search).get('love');
  const shared=incoming?decodeConfig(incoming):null;
  if(shared){loadExperience(shared);}else{applyTheme('blush');showScreen('builderScreen');}
  $('builderForm').addEventListener('submit',e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget);const next={...defaults};for(const key of Object.keys(next)){if(fd.has(key))next[key]=String(fd.get(key)).trim();}
    if(!next.question)next.question='Do you love me?';if(!next.letter)next.letter=defaults.letter;if(!next.finalMessage)next.finalMessage=defaults.finalMessage;
    cfg=next;applyTheme(cfg.theme);const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('love',encodeConfig(cfg));$('shareLink').value=url.toString();$('shareResult').classList.remove('hidden');$('shareResult').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('copyLink').addEventListener('click',async()=>{const input=$('shareLink');try{await navigator.clipboard.writeText(input.value);$('copyLink').textContent='Copied! ✓';}catch(e){input.select();document.execCommand('copy');$('copyLink').textContent='Copied! ✓';}setTimeout(()=>$('copyLink').textContent='Copy link',1800);});
  $('previewLink').addEventListener('click',()=>{if($('shareLink').value)window.open($('shareLink').value,'_blank','noopener');});

  $('welcomeFrom').textContent=sender?`A little surprise, made with love by ${sender}.`:'A little interactive surprise has been made especially for you.';
  $('openSurpriseButton').addEventListener('click',()=>showScreen('questionScreen'));
  const arena=$('buttonArena'),no=$('noButton'),yes=$('yesButton');
  function overlaps(a,b,pad=18){return !(a.right+pad<=b.left||a.left-pad>=b.right||a.bottom+pad<=b.top||a.top-pad>=b.bottom);}
  function moveNo(pointerX=null,pointerY=null){
    const now=Date.now();if(now-lastEscape<90)return;lastEscape=now;
    const ar=arena.getBoundingClientRect(),yr=yes.getBoundingClientRect(),nr=no.getBoundingClientRect();
    const w=nr.width,h=nr.height,pad=9,maxX=Math.max(pad,ar.width-w-pad),maxY=Math.max(pad,ar.height-h-pad);
    const yesLocal={left:yr.left-ar.left,top:yr.top-ar.top,right:yr.right-ar.left,bottom:yr.bottom-ar.top};
    const oldX=nr.left-ar.left,oldY=nr.top-ar.top;
    const candidates=[];
    // Randomized search over the whole arena; reject every position that clips or touches YES.
    for(let i=0;i<700;i++){
      const x=pad+Math.random()*Math.max(0,maxX-pad),y=pad+Math.random()*Math.max(0,maxY-pad);
      const box={left:x,top:y,right:x+w,bottom:y+h};
      if(overlaps(box,yesLocal,24))continue;
      const fromOld=Math.hypot(x-oldX,y-oldY);
      const fromPointer=(pointerX==null)?0:Math.hypot(ar.left+x+w/2-pointerX,ar.top+y+h/2-pointerY);
      candidates.push({x,y,score:fromOld+fromPointer*1.7});
    }
    // Deterministic fallback grid handles narrow screens and unusual font/button sizes.
    if(!candidates.length){
      const cols=12,rows=12;
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        const x=pad+(maxX-pad)*(c/(cols-1)),y=pad+(maxY-pad)*(r/(rows-1));
        const box={left:x,top:y,right:x+w,bottom:y+h};
        if(!overlaps(box,yesLocal,24))candidates.push({x,y,score:Math.hypot(x-oldX,y-oldY)});
      }
    }
    if(!candidates.length){$('attemptMessage').textContent='The little button needs a bigger screen 😅';return;}
    candidates.sort((a,b)=>b.score-a.score);
    const shortlist=candidates.slice(0,Math.min(35,candidates.length));
    const chosen=shortlist[Math.floor(Math.random()*shortlist.length)];
    no.style.left=`${chosen.x}px`;no.style.top=`${chosen.y}px`;no.style.transform='none';
    attempts++;no.textContent=noTexts[Math.min(attempts,noTexts.length-1)];
    $('attemptMessage').textContent=attempts>3?'The little button is getting nervous now...':'Oops! It got away. Try again!';
    $('questionBear').classList.add('peek');setTimeout(()=>$('questionBear').classList.remove('peek'),350);
  }
  function nearNo(x,y){const r=no.getBoundingClientRect();return Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2))<Math.max(115,r.width+45);}
  arena.addEventListener('pointermove',e=>{if(nearNo(e.clientX,e.clientY))moveNo(e.clientX,e.clientY);});
  no.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')moveNo(e.clientX,e.clientY);});
  no.addEventListener('pointerdown',e=>{e.preventDefault();moveNo(e.clientX,e.clientY);});
  no.addEventListener('click',e=>{e.preventDefault();moveNo(e.clientX,e.clientY);});
  window.addEventListener('resize',()=>{if($('questionScreen').classList.contains('active')){no.style.left='';no.style.top='';no.style.transform='translate(-50%,-50%)';}});

  function tone(freq=660,duration=.12,type='sine',volume=.035){if(!soundOn)return;try{audioCtx ||= new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch(e){}}
  $('soundToggle').addEventListener('click',()=>{soundOn=!soundOn;$('soundToggle').setAttribute('aria-pressed',String(soundOn));$('soundLabel').textContent=soundOn?'Sound on':'Sound off';$('soundIcon').textContent=soundOn?'♫':'♪';if(soundOn){tone(523,.18);setTimeout(()=>tone(659,.2),130);if(cfg.musicUrl){const music=$('backgroundMusic');music.src=cfg.musicUrl;music.volume=.35;music.play().then(()=>musicStarted=true).catch(()=>{});}}else{$('backgroundMusic').pause();}});
  function hearts(count=32){const chars=['♥','♡','💗','✦'];for(let i=0;i<count;i++){const el=document.createElement('span');el.className='floating-heart';el.textContent=chars[Math.floor(Math.random()*chars.length)];el.style.left=Math.random()*100+'vw';el.style.fontSize=(12+Math.random()*24)+'px';el.style.setProperty('--duration',(3+Math.random()*4)+'s');el.style.setProperty('--drift',(-80+Math.random()*160)+'px');document.body.appendChild(el);setTimeout(()=>el.remove(),7500);}}
  function celebrate(){tone(784,.18);setTimeout(()=>tone(988,.25),150);setTimeout(()=>tone(1175,.35),330);hearts(55);showScreen('celebrationScreen');const v=$('celebrationVideo');v.play().then(()=>$('videoPlaceholder').classList.add('hidden')).catch(()=>$('videoPlaceholder').classList.remove('hidden'));if(cfg.musicUrl&&soundOn){const music=$('backgroundMusic');music.src=cfg.musicUrl;music.volume=.35;music.play().catch(()=>{});}}
  yes.addEventListener('click',celebrate);
  $('letterButton').addEventListener('click',()=>{showScreen('letterScreen');setTimeout(()=>$('envelopeWrap').classList.add('open'),250);hearts(12);});
  $('giftButton').addEventListener('click',()=>showScreen('giftScreen'));
  $('giftBox').addEventListener('click',()=>{if($('giftBox').classList.contains('open'))return;$('giftBox').classList.add('open');$('giftHint').classList.add('hidden');setTimeout(()=>{$('finalMessage').classList.remove('hidden');hearts(40);tone(880,.25);},650);});
  $('replayButton').addEventListener('click',()=>{attempts=0;lastEscape=0;no.textContent=noTexts[0];no.style.left='';no.style.top='';no.style.transform='';$('attemptMessage').textContent='Choose wisely. The teddy is watching.';$('giftBox').classList.remove('open');$('finalMessage').classList.add('hidden');$('giftHint').classList.remove('hidden');$('envelopeWrap').classList.remove('open');const v=$('celebrationVideo');v.pause();v.currentTime=0;personalize();showScreen('welcomeScreen');});
  for(let i=0;i<18;i++){const s=document.createElement('i');s.className='sparkle';s.textContent='✦';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.fontSize=(7+Math.random()*9)+'px';s.style.animationDelay=(Math.random()*3)+'s';$('sparkleLayer').appendChild(s);}
})();
