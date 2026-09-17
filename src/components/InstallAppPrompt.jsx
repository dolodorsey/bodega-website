'use client';

import { useEffect, useState } from 'react';

const CAPTURE_URL='https://wfkohcwxxsrhcxhepfql.supabase.co/functions/v1/marketing-event-capture';
const DISMISS_MS=7*24*60*60*1000;

function standalone(){
  return window.matchMedia('(display-mode: standalone)').matches||Boolean(window.navigator.standalone);
}
function ios(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
}
function getStore(key){try{return localStorage.getItem(key)}catch{return null}}
function setStore(key,value){try{localStorage.setItem(key,value)}catch{}}
function visitor(){
  const existing=getStore('khg_vid'); if(existing)return existing;
  const id=crypto.randomUUID(); setStore('khg_vid',id); return id;
}
async function track(eventType,metadata={}){
  try{
    await fetch(CAPTURE_URL,{method:'POST',headers:{'content-type':'application/json'},keepalive:true,body:JSON.stringify({brand_key:'bodega',event_type:eventType,visitor_key:visitor(),metadata:{event_id:crypto.randomUUID(),path:`${location.pathname}${location.search}`.slice(0,500),app:'bodega',...metadata}})});
  }catch{}
}

export default function InstallAppPrompt(){
  const [prompt,setPrompt]=useState(null);
  const [visible,setVisible]=useState(false);
  const [instructions,setInstructions]=useState(false);
  const [installed,setInstalled]=useState(false);
  const [isIOS,setIsIOS]=useState(false);

  useEffect(()=>{
    if(standalone()){setInstalled(true);return}
    const apple=ios(); setIsIOS(apple);
    if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
    const dismissed=Number(getStore('bodega:pwa-dismissed')||0);
    const canShow=!dismissed||Date.now()-dismissed>DISMISS_MS;

    const before=(event)=>{event.preventDefault();setPrompt(event);if(canShow)setTimeout(()=>setVisible(true),1800)};
    const added=()=>{setInstalled(true);setVisible(false);track('app_install',{platform:apple?'ios':'web',variant:'bodega_pwa'});};
    window.addEventListener('beforeinstallprompt',before);
    window.addEventListener('appinstalled',added);
    let timer=0;
    if(canShow&&apple)timer=setTimeout(()=>setVisible(true),4800);
    return()=>{window.removeEventListener('beforeinstallprompt',before);window.removeEventListener('appinstalled',added);if(timer)clearTimeout(timer)};
  },[]);

  if(installed||!visible)return null;

  const close=()=>{setStore('bodega:pwa-dismissed',String(Date.now()));setVisible(false);track('cta_click',{cta:'pwa_prompt_dismiss',variant:isIOS?'ios':'web'});};
  const install=async()=>{
    track('app_install_click',{platform:isIOS?'ios':'web',variant:prompt?'native_prompt':'instructions'});
    if(prompt){const result=await prompt.prompt();setPrompt(null);if(result.outcome==='accepted')setVisible(false);return;}
    setInstructions(true);
  };

  return <div className="installBackdrop" role="dialog" aria-modal="true" aria-label="Install Bodega">
    <div className="installCard">
      <button className="installClose" onClick={close} aria-label="Close">×</button>
      <div className="phoneScene" aria-hidden="true">
        <div className="ring ringOne"/><div className="ring ringTwo"/>
        <div className="miniPhone"><div className="island"/><div className="apps"><i/><i/><i/><i/><b>B</b><i/><i/><i/><i/></div><div className="dock"><i/><i/><i/></div></div>
      </div>
      {!instructions?<div className="installCopy">
        <div className="eyebrow">BODEGA / ON DEMAND</div>
        <h2>PUT THE<br/><em>STORE</em><br/>ON YOUR PHONE.</h2>
        <p>New drops. Brand rooms. STUSH, FENYX, BARE and everything next. One tap from your Home Screen.</p>
        <div className="chips"><span>NO APP STORE</span><span>FULL SCREEN</span><span>ONE TAP</span></div>
        <button className="installCTA" onClick={install}><span>{prompt?'INSTALL BODEGA':'ADD BODEGA'}</span><strong>↗</strong></button>
        <button className="later" onClick={close}>Keep browsing</button>
      </div>:<div className="installCopy instructions">
        <div className="eyebrow">{isIOS?'IPHONE / 3 TAPS':'INSTALL / 3 TAPS'}</div>
        <h2>MAKE<br/>BODEGA<br/><em>LIVE HERE.</em></h2>
        <ol>
          <li><b>01</b><div><strong>{isIOS?'Tap Share':'Open browser menu'}</strong><small>{isIOS?'Use the Share icon in Safari.':'Use your browser install menu.'}</small></div></li>
          <li><b>02</b><div><strong>Add to Home Screen</strong><small>Select the Home Screen / Install option.</small></div></li>
          <li><b>03</b><div><strong>Tap Add</strong><small>The Bodega icon lands with your other apps.</small></div></li>
        </ol>
        <button className="installCTA" onClick={close}>GOT IT</button>
      </div>}
    </div>
    <style jsx>{`
      .installBackdrop{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:end center;padding:16px;background:linear-gradient(180deg,rgba(8,6,5,.18),rgba(8,6,5,.82));backdrop-filter:blur(10px);animation:fade .3s ease both}.installCard{position:relative;width:min(700px,100%);min-height:470px;overflow:hidden;border-radius:30px;padding:31px 23px 23px;color:#f8f1e7;background:radial-gradient(circle at 90% 0,#ff5a1f33,transparent 36%),linear-gradient(145deg,#17110d,#080706 72%);border:1px solid #ff642f66;box-shadow:0 30px 100px #000c;isolation:isolate}.installCard:after{content:'';position:absolute;inset:0;z-index:-1;opacity:.12;background:repeating-linear-gradient(117deg,transparent 0 16px,#fff2 17px,transparent 18px)}.installClose{position:absolute;right:14px;top:14px;z-index:5;width:39px;height:39px;border-radius:50%;border:1px solid #fff2;background:#fff1;color:#fff;font-size:25px}.phoneScene{position:absolute;right:-35px;top:3px;width:270px;height:280px;pointer-events:none}.ring{position:absolute;border:1px solid #ff642f;border-radius:50%;opacity:.45;animation:pulse 2.4s ease-out infinite}.ringOne{width:205px;height:205px;right:8px;top:15px}.ringTwo{width:250px;height:250px;right:-14px;top:-7px;animation-delay:.5s}.miniPhone{position:absolute;right:58px;top:28px;width:108px;height:214px;border:4px solid #f8f1e7;border-radius:29px;background:linear-gradient(160deg,#231813,#070605);transform:rotate(9deg);box-shadow:0 28px 50px #000a;padding:25px 9px 10px}.island{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:43px;height:10px;border-radius:20px;background:#000}.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.apps>*{aspect-ratio:1;border-radius:8px;background:#ffffff12}.apps b{display:grid;place-items:center;background:#ff642f;color:#110805;font:900 18px/1 Arial;box-shadow:0 0 0 3px #fff2,0 10px 24px #ff642f55}.dock{position:absolute;left:10px;right:10px;bottom:9px;height:29px;border-radius:10px;background:#fff2;display:flex;align-items:center;justify-content:space-around}.dock i{width:16px;height:16px;border-radius:5px;background:#fff4}.installCopy{position:relative;z-index:2;max-width:475px;padding-right:80px}.eyebrow{color:#ff6b35;font:900 10px/1 Arial;letter-spacing:.2em;margin-bottom:11px}.installCopy h2{margin:0;font:900 clamp(33px,9vw,55px)/.82 Arial,sans-serif;letter-spacing:-.06em;text-transform:uppercase}.installCopy h2 em{color:#ff642f;font-style:normal}.installCopy>p{margin:18px 0 15px;max-width:430px;color:#f8f1e7b8;font:500 14px/1.55 Arial,sans-serif}.chips{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 18px}.chips span{border:1px solid #fff2;border-radius:999px;padding:7px 9px;color:#f8f1e799;font:800 9px/1 Arial;letter-spacing:.08em}.installCTA{width:100%;min-height:55px;border:0;border-radius:14px;background:#ff642f;color:#100806;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font:900 13px/1 Arial;letter-spacing:.07em;box-shadow:0 14px 35px #ff642f44}.installCTA strong{font-size:22px}.later{width:100%;border:0;background:transparent;color:#f8f1e777;padding:13px 0 0;font:700 11px/1 Arial}.instructions ol{list-style:none;margin:20px 0;padding:0;display:grid;gap:9px}.instructions li{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #fff2;border-radius:13px;background:#fff1}.instructions li>b{color:#ff642f;font:900 11px/1 Arial}.instructions li strong,.instructions li small{display:block}.instructions li strong{font:800 13px/1.2 Arial}.instructions li small{margin-top:3px;color:#f8f1e788;font:500 11px/1.35 Arial}@keyframes fade{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:none}}@keyframes pulse{0%{transform:scale(.7);opacity:.55}100%{transform:scale(1.18);opacity:0}}@media(min-width:720px){.installBackdrop{place-items:center}.installCard{padding:43px 37px 34px}.installCopy{padding-right:145px}.phoneScene{right:7px;top:38px}}@media(max-width:430px){.installCard{min-height:455px;padding:28px 18px 20px;border-radius:25px}.installCopy{padding-right:42px}.installCopy h2{font-size:35px}.phoneScene{right:-75px;opacity:.65}.chips{max-width:275px}}@media(prefers-reduced-motion:reduce){.installBackdrop,.ring{animation:none}}
    `}</style>
  </div>;
}
