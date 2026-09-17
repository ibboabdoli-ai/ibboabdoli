"""Browser regression tests. Contact API delivery is mocked; no email is sent."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.qa'; OUT.mkdir(exist_ok=True)
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4173')
paths=['/','/en/','/card/','/privacy/','/en/privacy/']
slugs=['abb-robot-troubleshooting','machine-vision-timeout','plc-fieldbus-troubleshooting']
paths += [prefix+slug+'/' for prefix in ['/cases/','/en/cases/'] for slug in slugs]
report={'layouts':0,'checks':[],'form_delivery':'mocked same-origin API, not an inbox delivery test','fonts':'external Google Fonts enabled'}
with sync_playwright() as pw:
    options={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('BROWSER_PATH'):options['executable_path']=os.environ['BROWSER_PATH']
    browser=pw.chromium.launch(**options)
    context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1)
    if os.environ.get('OFFLINE_FONTS')=='1':
        context.route('https://fonts.googleapis.com/**',lambda r:r.abort())
        context.route('https://fonts.gstatic.com/**',lambda r:r.abort())
        report['fonts']='system fallback (offline sandbox); CI must retest external fonts'
    context.add_init_script("window.cspProblems=[];document.addEventListener('securitypolicyviolation',e=>window.cspProblems.push({directive:e.violatedDirective,uri:e.blockedURI}))")
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    for width in [320,390,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for path in paths:
            response=page.goto(BASE+path,wait_until='networkidle')
            assert response.status==200,(path,response.status)
            assert page.locator('h1').count()==1,path
            metrics=page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
            assert metrics['scroll']<=metrics['width']+1,('horizontal overflow',path,width,metrics)
            failures=page.evaluate("""() => [...document.querySelectorAll('h1,h2,.btn,.contact-list strong')].filter(el=>{const r=el.getBoundingClientRect();return r.width&& (r.right>innerWidth+2||r.left < -2)}).map(el=>({tag:el.tagName,text:el.textContent}))""")
            assert not failures,('clipped important content',path,width,failures)
            assert not page.evaluate('window.cspProblems'),('CSP violation',path,page.evaluate('window.cspProblems'))
            report['layouts']+=1
        page.goto(BASE+'/',wait_until='networkidle')
        if width in [390,1440]:page.screenshot(path=str(OUT/f'home-{width}.png'),full_page=True)
    assert not errors,errors
    report['checks'].append('44 responsive layouts; one H1; no horizontal clipping or script/CSP errors')
    for lang,path in [('sv','/'),('en','/en/')]:
        page.set_viewport_size({'width':390,'height':844}); page.goto(BASE+path,wait_until='networkidle')
        nav=page.locator('.nav'); menu=page.locator('.menu')
        assert nav.is_hidden()
        menu.click(); assert nav.is_visible() and menu.get_attribute('aria-expanded')=='true'
        assert menu.get_attribute('aria-label')==('Stäng meny' if lang=='sv' else 'Close menu')
        assert page.locator('.nav a').first.evaluate('(el)=>el===document.activeElement')
        page.keyboard.press('Escape'); assert nav.is_hidden() and menu.evaluate('(el)=>el===document.activeElement')
        menu.click(); page.mouse.click(3,250); assert nav.is_hidden()
        menu.click(); nav.locator('a').filter(has_text='Case').first.click(); assert nav.is_hidden()
        page.set_viewport_size({'width':667,'height':375}); page.goto(BASE+path,wait_until='networkidle'); menu.click()
        box=nav.bounding_box(); assert box['y']+box['height']<=375,box
    report['checks'].append('SV/EN menu: keyboard, labels, Escape, focus restore, outside click and landscape scroll')
    page.set_viewport_size({'width':1440,'height':1000});page.goto(BASE+'/',wait_until='networkidle')
    toggle=page.locator('[data-motion-toggle]');toggle.click()
    assert page.locator('html').get_attribute('data-motion')=='paused'
    assert page.locator('.hero-arm').evaluate('(el)=>getComputedStyle(el).animationPlayState')=='paused'
    toggle.click();assert page.locator('html').get_attribute('data-motion')=='running'
    reduced=browser.new_context(reduced_motion='reduce')
    rp=reduced.new_page();rp.goto(BASE+'/',wait_until='networkidle')
    assert rp.locator('.hero-arm').evaluate('(el)=>getComputedStyle(el).animationName')=='none'
    assert rp.locator('[data-motion-toggle]').is_hidden();reduced.close()
    report['checks'].append('Animation pause/resume and operating-system reduced-motion preference')
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    np=nojs.new_page();np.goto(BASE+'/',wait_until='networkidle')
    assert np.locator('.nav').is_visible()
    for section in ['focus','cases','process','about','resume','contact']:
        assert np.locator('#'+section).is_visible()
        assert np.locator('#'+section).evaluate('(el)=>getComputedStyle(el).opacity')=='1'
    assert np.locator('form').get_attribute('method')=='POST'
    assert np.locator('form').get_attribute('action')=='/api/contact';nojs.close()
    report['checks'].append('No-JavaScript navigation, all six sections and native POST /api/contact fallback remain available')
    for path in ['/','/en/']:
        for mode in ['success','rejected','network']:
            page.goto(BASE+path,wait_until='networkidle')
            def handle(route):
                if mode=='network':route.abort()
                else:route.fulfill(status=200 if mode=='success' else 422,content_type='application/json',body=json.dumps({'ok':mode=='success','message':'Test rejection' if mode=='rejected' else 'ok'}))
            page.route('**/api/contact',handle)
            page.locator('input[name=name]').fill('Portfolio test')
            page.locator('input[name=email]').fill('test@example.com')
            page.locator('textarea[name=message]').fill('Automated browser test. No real submission.')
            page.locator('button[type=submit]').click()
            expected='success' if mode=='success' else 'error'
            page.wait_for_function('(state)=>document.querySelector("[data-form-status]").dataset.state===state',arg=expected)
            assert page.locator('button[type=submit]').is_enabled()
            assert bool(page.locator('textarea').input_value())==(mode!='success')
            assert page.url.startswith(BASE)
            page.unroute('**/api/contact',handle)
    report['checks'].append('Six mocked SV/EN contact API tests: success, rejection and network failure; errors preserve the message')
    report['status']='passed';browser.close()
(OUT/'browser-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
