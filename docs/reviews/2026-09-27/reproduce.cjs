// Run with PLAYWRIGHT_MODULE=/path/to/playwright node reproduce.cjs desktop|mobile|pdf
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');const path=require('node:path');
const out=path.join(__dirname,'evidence'); const base='https://skyhong2002.github.io/2027-cfs/';
const mode=process.argv[2]||'desktop';const report={mode,url:base,time:new Date().toISOString(),observations:{},errors:[],postsBlocked:[]};
(async()=>{
 const browser=await chromium.connectOverCDP(process.env.CDP_URL||'http://127.0.0.1:9334');
 const context=await browser.newContext({viewport:mode==='mobile'?{width:390,height:844}:{width:1440,height:1000},hasTouch:mode==='mobile',isMobile:mode==='mobile',deviceScaleFactor:1});
 const p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 await p.route('**/*',r=>{if(r.request().method()==='POST'){report.postsBlocked.push(r.request().url());return r.abort();}if(/googletagmanager|google-analytics/.test(r.request().url()))return r.abort();return r.continue();});
 const wait=()=>p.waitForTimeout(550);
 const shot=async name=>{await wait();await p.screenshot({path:path.join(out,`${mode}-${name}.jpg`),type:'jpeg',quality:80});};
 const go=async selector=>{await p.locator(selector).first().evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await wait();};
 const popup=async id=>{await p.locator('#'+id).click();await wait();};
 const close=async()=>{await p.keyboard.press('Escape');await wait();};
 const active=()=>p.evaluate(()=>[...document.querySelectorAll('.popup-bg.show')].map(x=>({id:x.previousElementSibling.id,title:x.querySelector('h3')?.textContent,url:location.href,scroll:x.scrollTop,detailsScroll:x.querySelector('.item-details')?.scrollTop})));
 const swipe=async(x1,y1,x2,y2)=>{const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*i/12,y:y1+(y2-y1)*i/12}]});await p.waitForTimeout(30);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait();await cdp.detach();};
 await p.goto(base,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await wait();
 report.browser=browser.version();report.viewport=p.viewportSize();
 report.observations.sections=await p.locator('body > section,body > footer').evaluateAll(es=>es.map(e=>({id:e.id||e.className,y:Math.round(e.getBoundingClientRect().top+scrollY),height:Math.round(e.getBoundingClientRect().height)})));
 if(mode==='desktop'){
  report.observations.nav=await p.locator('nav .nav-link').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),href:e.getAttribute('href')})));await shot('nav');
  await go('#highlights');await shot('highlights');report.observations.ctas=await p.locator('#highlights .card').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),href:e.getAttribute('href')})));
  await p.locator('#highlights .card').first().click();await wait();report.observations.ctaAfter={url:p.url(),category:await p.locator('.tab.active').getAttribute('data-category')};await shot('cta-destination');
  await go('#news');report.observations.news=await p.locator('#news .news-content a').count();await shot('news');
  await p.locator('.contact-btn').click();await wait();report.observations.contact={url:p.url(),formVisible:await p.locator('#sponsor-form').isVisible()};await shot('contact');
  await go('#time');await shot('time');await go('footer');await shot('footer');
  await go('#place-staff-popup');await popup('place-staff-popup');await p.locator('#venue-details-section').evaluate(el=>el.scrollIntoView({behavior:'instant'}));await shot('venue');await close();
  await go('#items');await p.locator('.tab[data-category="talent_recruitment"]').click();await wait();
  report.observations.talentOrder=await p.locator('#items .cards-grid .card').evaluateAll(es=>es.filter(e=>getComputedStyle(e).display!=='none').map(e=>({id:e.getAttribute('data-card-id'),title:e.querySelector('h3')?.textContent})));
  await shot('talent-list');await p.locator('#items .cards-grid .card:visible').first().click();await wait();report.observations.beforeArrow=await active();await shot('popup-before');
  await p.keyboard.press('ArrowRight');await wait();report.observations.afterArrow=await active();await shot('popup-after');
  report.observations.popupButtons=await p.locator('.popup-bg.show button,.popup-bg.show .close-btn').evaluateAll(es=>es.map(e=>({text:e.textContent.trim(),aria:e.getAttribute('aria-label'),class:e.className})));
  const direct=p.url();await p.reload({waitUntil:'networkidle'});await wait();report.observations.afterReload=await active();await shot('popup-direct');await close();
  await p.goto(base+'item/1/',{waitUntil:'networkidle'});await wait();report.observations.sampleLongItem=await p.locator('#item-popup-1 + .popup-bg').innerText();await shot('sample-long-item');
 }
 if(mode==='mobile'){
  await p.locator('.hamburger').click();await shot('nav');await p.locator('.hamburger').click();
  await go('#news');await shot('news');
  await go('#about .rewind');await shot('review');report.observations.review=await p.locator('#about .rewind').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight,items:[...el.querySelectorAll('.review-item')].map(x=>({text:x.textContent.trim(),height:x.clientHeight}))}));
  await go('#stat-popup');await popup('stat-popup');await shot('stats');report.observations.stats=await p.locator('#stat-popup + .popup-bg').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight,scrollHeight:el.scrollHeight,charts:[...el.querySelectorAll('canvas')].map(x=>({width:x.clientWidth,height:x.clientHeight}))}));await swipe(200,700,200,250);await shot('stats-scrolled');await close();
  await go('#time');await shot('time');await go('#place-staff-popup');await popup('place-staff-popup');await p.locator('.timeline').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));await shot('schedule');report.observations.timeline=await p.locator('.timeline').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,whiteSpace:getComputedStyle(el).whiteSpace,text:el.textContent.trim()}));await close();
  await go('#plans');await shot('plans');report.observations.plans=await p.locator('#plans').evaluate(el=>({height:el.clientHeight,collapses:el.querySelectorAll('details').length,tableWidth:el.querySelector('.plans-table').clientWidth,scrollWidth:el.querySelector('.plans-table').scrollWidth,headerPosition:getComputedStyle(el.querySelector('.plans-header')).position,labelPosition:getComputedStyle(el.querySelector('.row-label')).position}));
  const tableBox=await p.locator('.plans-table').boundingBox();await swipe(335,Math.min(650,tableBox.y+280),80,Math.min(650,tableBox.y+280));await shot('plans-horizontal');await p.evaluate(()=>scrollBy({top:450,behavior:'instant'}));await shot('plans-vertical');
  await p.goto(base+'item/1/',{waitUntil:'networkidle'});await wait();await shot('long-popup-top');report.observations.longBefore=await active();
  await swipe(240,700,240,250);report.observations.straightVertical=await active();await shot('long-popup-vertical');
  await swipe(250,700,175,250);report.observations.diagonalVertical=await active();await shot('long-popup-diagonal');
  await close();await go('footer');await shot('footer');
 }
 if(mode==='extra'){
  await go('#intro');await shot('intro');await go('#cycle');await shot('cycle');
  await p.goto(base+'item/22/',{waitUntil:'networkidle'});await wait();
  report.observations.chair=await p.locator('#item-popup-22 + .popup-bg').innerText();await shot('chair');
  report.observations.venueLinks=await p.locator('#item-popup-22 + .popup-bg .venue-link').evaluateAll(es=>es.map(e=>({text:e.textContent,onclick:e.getAttribute('onclick')})));
  const link=p.locator('#item-popup-22 + .popup-bg .venue-link').first();if(await link.count()){await link.click();await wait();report.observations.afterVenue=await active();await shot('chair-venue');}
  await p.goto(base,{waitUntil:'networkidle'});await go('#items');
  report.observations.allOrder=await p.locator('#items .cards-grid .card').evaluateAll(es=>es.filter(e=>getComputedStyle(e).display!=='none').map(e=>e.querySelector('h3')?.textContent));
  await p.locator('#items .cards-grid .card:visible').first().click();await wait();report.observations.allBefore=await active();await p.keyboard.press('ArrowRight');await wait();report.observations.allAfter=await active();await shot('all-after-arrow');
 }
 if(mode==='pdf'){
  await p.evaluate(()=>{window.__printCalled=0;window.print=()=>window.__printCalled++;});await p.locator('.export-btn').click();report.observations.printButtonCalls=await p.evaluate(()=>window.__printCalled);
  await p.emulateMedia({media:'print'});await wait();
  report.observations.print=await p.evaluate(()=>({height:document.body.scrollHeight,popups:[...document.querySelectorAll('.popup-bg')].filter(x=>getComputedStyle(x).display!=='none').length,hiddenAnimated:[...document.querySelectorAll('.aos')].filter(x=>getComputedStyle(x).opacity==='0').length}));
  await p.pdf({path:path.join(out,'export-a4.pdf'),format:'A4',printBackground:true});
  await shot('print-preview');
 }
 fs.writeFileSync(path.join(out,`${mode}.json`),JSON.stringify(report,null,2));await context.close();await browser.close();
})().catch(e=>{report.failure=String(e);fs.writeFileSync(path.join(out,`${mode}.json`),JSON.stringify(report,null,2));console.error(e);process.exit(1)});
