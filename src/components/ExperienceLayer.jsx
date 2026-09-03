'use client';
import { useEffect, useState } from 'react';

export default function ExperienceLayer(){
 const[aisle,setAisle]=useState('A1');
 useEffect(()=>{
  const root=document.documentElement;root.classList.add('bodega-motion-ready');
  const targets=[...document.querySelectorAll('main section,.product-card,.brand-room,.department-card,.map-stop')];
  targets.forEach((el,i)=>{el.classList.add('bodega-reveal');el.style.setProperty('--bodega-delay',`${(i%7)*40}ms`)});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.09,rootMargin:'0px 0px -8% 0px'});targets.forEach(el=>io.observe(el));
  let prev=0;
  const onScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=Math.min(1,scrollY/max);root.style.setProperty('--bodega-scroll',String(p));root.dataset.storeDirection=scrollY>prev?'forward':'back';prev=scrollY;setAisle(`A${Math.max(1,Math.min(9,Math.ceil(p*9)))}`)};
  const onPointer=e=>{root.style.setProperty('--bodega-x',`${e.clientX}px`);root.style.setProperty('--bodega-y',`${e.clientY}px`)};
  const onClick=e=>{const a=e.target.closest?.('a');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.hash||u.pathname===location.pathname)return;e.preventDefault();root.classList.add('bodega-leaving');setTimeout(()=>location.href=u.href,280)};
  onScroll();addEventListener('scroll',onScroll,{passive:true});addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('click',onClick);
  return()=>{io.disconnect();removeEventListener('scroll',onScroll);removeEventListener('pointermove',onPointer);document.removeEventListener('click',onClick);root.classList.remove('bodega-motion-ready','bodega-leaving')}
 },[]);
 return <><div className="bodega-shutter" aria-hidden="true"><span>BO</span><span>DE</span><span>GA</span></div><div className="bodega-aisle" aria-hidden="true"><b>{aisle}</b><i/></div><div className="bodega-scan" aria-hidden="true"/></>
}
