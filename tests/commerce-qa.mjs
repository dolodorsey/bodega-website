import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=process.env.BODEGA_URL||'https://bodegabodegabodega.com';
const out=process.env.EVIDENCE_DIR||'artifacts/commerce-qa';
await fs.mkdir(out,{recursive:true});

const browser=await chromium.launch({headless:true});
const report={base,startedAt:new Date().toISOString(),tests:[],screenshots:[],paymentSubmitted:false};
let productPath='';

async function test(name,fn){
  try{const details=await fn();report.tests.push({name,passed:true,details});}
  catch(error){report.tests.push({name,passed:false,error:error.message});}
}
async function shot(page,name){
  await page.screenshot({path:`${out}/${name}.png`,fullPage:true,animations:'disabled'});
  report.screenshots.push(name+'.png');
}

try{
  const desktop=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await desktop.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/shop?brand=stush-usa',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('.dc',{timeout:30000});
  await test('desktop shop no horizontal overflow',async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)));
  await shot(page,'bodega-desktop-shop');

  await test('desktop product card alternate/color media',async()=>{
    const card=page.locator('.dc--multi').first();
    assert(await card.count()>0,'No multi-color STUSH card is available inside BODEGA for hover QA');
    const active=card.locator('.dc__img--active');
    const before=await active.getAttribute('src');
    await card.hover();await page.waitForTimeout(2200);
    const after=await card.locator('.dc__img--active').getAttribute('src');
    assert(before&&after&&before!==after,'Hover did not rotate to alternate product media');
    productPath=await card.locator('.dc__media-link').getAttribute('href');
    assert(productPath?.startsWith('/products/'),'Internal BODEGA PDP link is missing');
    return{before,after,productPath};
  });

  if(!productPath) productPath='/products/first-string-raglan-jacket';
  await page.goto(base+productPath,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('.pdp__title',{timeout:30000});
  await shot(page,'bodega-desktop-pdp-before');

  await test('desktop PDP gallery thumbnail changes main media',async()=>{
    const thumbs=page.locator('.pdp__thumb');
    if(await thumbs.count()<2)return{skipped:'single-image product'};
    const before=await page.locator('.pdp__image').getAttribute('src');
    await thumbs.nth(1).click();await page.waitForTimeout(120);
    const after=await page.locator('.pdp__image').getAttribute('src');
    assert(after&&after!==before,'PDP thumbnail did not change main product image');
    return{before,after};
  });

  await test('desktop color selection changes selected state and media',async()=>{
    const group=page.locator('.pdp__option').filter({hasText:/color/i}).first();
    assert(await group.count()>0,'Missing Color option group');
    const buttons=group.locator('.pdp__value:not(.pdp__value--out)');
    assert(await buttons.count()>1,'Need at least two available colors for color QA');
    const target=buttons.nth(1);
    const before=await page.locator('.pdp__image').getAttribute('src');
    await target.click();await page.waitForTimeout(180);
    assert.equal(await target.getAttribute('aria-pressed'),'true');
    const after=await page.locator('.pdp__image').getAttribute('src');
    assert(after&&after!==before,'Color selection did not change the product image');
    return{before,after,color:await target.innerText()};
  });

  await test('desktop size selection changes selected state',async()=>{
    const group=page.locator('.pdp__option').filter({hasText:/size/i}).first();
    if(!(await group.count()))return{skipped:'no size option'};
    const buttons=group.locator('.pdp__value:not(.pdp__value--out)');
    assert(await buttons.count()>0,'No available size option');
    const target=buttons.nth(Math.min(1,(await buttons.count())-1));
    await target.click();await page.waitForTimeout(80);
    assert.equal(await target.getAttribute('aria-pressed'),'true');
    return{size:await target.innerText()};
  });

  await shot(page,'bodega-desktop-pdp-after-variant');

  await test('desktop secure checkout handoff without payment',async()=>{
    const buy=page.getByRole('button',{name:/buy now|secure checkout/i}).first();
    assert(await buy.count()>0,'Buy/checkout button missing');
    assert(!(await buy.isDisabled()),'Selected BODEGA variant is not purchasable');
    await Promise.all([
      page.waitForURL(url=>/myshopify\.com|shopify\.com|checkout\.stripe\.com/.test(url.hostname),{timeout:30000}),
      buy.click(),
    ]);
    assert(/myshopify\.com|shopify\.com|checkout\.stripe\.com/.test(new URL(page.url()).hostname));
    return{checkoutHost:new URL(page.url()).hostname,paymentSubmitted:false};
  });

  report.tests.push({name:'desktop browser errors',passed:errors.length===0,errors});
  await desktop.close();

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const mp=await mobile.newPage();const mobileErrors=[];mp.on('pageerror',e=>mobileErrors.push(e.message));
  await mp.goto(base+productPath,{waitUntil:'domcontentloaded',timeout:30000});
  await mp.waitForSelector('.pdp__title',{timeout:30000});
  await test('mobile PDP no horizontal overflow',async()=>assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)));
  await test('mobile variant controls visible without hover',async()=>{
    const color=mp.locator('.pdp__option').filter({hasText:/color/i}).first();
    assert(await color.count()>0,'Mobile Color selector missing');
    const button=color.locator('.pdp__value').first();
    const box=await button.boundingBox();assert(box&&box.height>=40,'Mobile color target too small or hidden');
    return{height:box.height};
  });
  await shot(mp,'bodega-mobile-pdp');
  report.tests.push({name:'mobile browser errors',passed:mobileErrors.length===0,errors:mobileErrors});
  await mobile.close();
}finally{
  report.finishedAt=new Date().toISOString();
  await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
  await browser.close();
}

console.log(JSON.stringify(report,null,2));
if(report.tests.some(x=>!x.passed))process.exitCode=1;
