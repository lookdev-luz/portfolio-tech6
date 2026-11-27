"""Functional browser checks for the portfolio 06 hero topology.
Run against a local PHP preview with BASE_URL set when its port differs.
"""
import asyncio
import hashlib
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.getenv('BASE_URL', 'http://127.0.0.1:8093/portfolio-tech6/')
EVIDENCE = Path(__file__).parent / 'evidence'
EVIDENCE.mkdir(exist_ok=True)

async def shot(page, name):
    data = await page.locator('#topology-stage').screenshot(path=str(EVIDENCE / f'{name}.png'))
    return hashlib.sha256(data).hexdigest()

async def main():
    results = {'responsive': [], 'resources': [], 'modes': {}, 'filters': {}}
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        for width, height in [(320,568),(390,844),(768,1024),(1024,768),(1366,768),(1440,900),(1920,1080)]:
            page = await browser.new_page(viewport={'width': width, 'height': height})
            errors, missing = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: missing.append(response.url) if response.status >= 400 else None)
            response = await page.goto(BASE, wait_until='networkidle')
            await page.locator('.topology-node').first.wait_for()
            state = {'width':width, 'height':height, 'status':response.status,
                     'nodes':await page.locator('.topology-node').count(),
                     'links':await page.locator('.topology-link').count(),
                     'overflow':await page.evaluate('document.documentElement.scrollWidth - innerWidth'),
                     'errors':errors, 'missing':missing}
            assert state['status']==200 and state['nodes']==13 and state['links']==16
            assert state['overflow']==0 and not errors and not missing
            assert await page.locator('.topology-node').evaluate_all('''nodes => {
              const frame=document.querySelector('#network-topology').getBoundingClientRect();
              return nodes.every(node => {const box=node.getBoundingClientRect();
                return box.left>=frame.left-1 && box.right<=frame.right+1 &&
                  box.top>=frame.top-1 && box.bottom<=frame.bottom+1;});
            }''')
            results['responsive'].append(state)
            if width in (320,390,1440): await shot(page,f'initial-{width}')
            await page.close()

        page = await browser.new_page(viewport={'width':1440,'height':900})
        errors=[];page.on('pageerror',lambda error: errors.append(str(error)))
        await page.goto(BASE,wait_until='networkidle')
        resources=await page.locator('script[src],link[rel="stylesheet"][href]').evaluate_all('''els =>
          els.map(el => el.getAttribute('src') || el.getAttribute('href'))''')
        assert any('topology.js?v=' in resource for resource in resources)
        assert any('topology.css?v=' in resource for resource in resources)
        assert not any('webgl/renderer.js' in resource for resource in resources)
        results['resources']=resources
        await page.locator('#topology-stage').scroll_into_view_if_needed()
        original=await shot(page,'rede-dark')
        for mode in ['flow','cluster','focus','network']:
            await page.locator(f'[data-core-mode="{mode}"]').click()
            if mode=='flow': await page.wait_for_timeout(150)
            signature=await shot(page,{'flow':'fluxo','cluster':'grupos','focus':'foco','network':'rede-return'}[mode])
            if mode=='flow':
                await page.wait_for_timeout(180)
                assert await shot(page,'fluxo-momento-2') != signature
            assert signature!=original if mode!='network' else True
            assert await page.locator(f'[data-core-mode="{mode}"]').get_attribute('aria-pressed')=='true'
            results['modes'][mode]={'signature':signature, 'selected':await page.locator('.topology-node.is-selected').count()}
        assert results['modes']['focus']['selected']==1
        for option in ['perimeter','infrastructure','applications','data','monitoring','devices','all']:
            await page.locator('#cluster-select').select_option(option)
            dim=await page.locator('.topology-node.is-dimmed').count()
            assert dim==(0 if option=='all' else 13-len(await page.locator(f'.topology-node[data-category="{option}"]').all()))
            results['filters'][option]={'dimmed':dim,'description':await page.locator('#core-description').inner_text()}
            if option=='data': await shot(page,'area-dados')
        await page.locator('[data-core-mode="focus"]').click()
        await page.locator('[data-node="database"]').click()
        assert await page.locator('[data-node="database"]').get_attribute('aria-pressed')=='true'
        assert 'Armazena informações' in await page.locator('#core-description').inner_text()
        first=await shot(page,'no-selecionado')
        await page.locator('[data-node="monitor"]').click()
        assert await page.locator('[data-node="monitor"]').get_attribute('aria-pressed')=='true'
        assert await page.locator('[data-node="database"]').get_attribute('aria-pressed')=='false'
        assert await shot(page,'outro-no-selecionado')!=first
        await page.locator('[data-core-mode="flow"]').click()
        await page.wait_for_timeout(120)
        packet=page.locator('.topology-packet').first
        before=await packet.get_attribute('cx')
        await page.wait_for_timeout(180)
        during=await packet.get_attribute('cx')
        assert before!=during
        await page.locator('#core-pause').click()
        stopped=await packet.get_attribute('cx')
        await page.wait_for_timeout(220)
        assert await packet.get_attribute('cx')==stopped
        await page.locator('[data-node="gateway"]').click()
        assert await page.locator('[data-node="gateway"]').get_attribute('aria-pressed')=='true'
        await page.locator('#core-pause').click()
        await page.wait_for_timeout(180)
        assert await page.locator('.topology-packet').first.get_attribute('cx')!=stopped
        results['pause']={'moving_before':before!=during,'stopped':True,'resumed':True}
        scene=page.locator('#network-topology > g')
        transform=await scene.get_attribute('transform')
        box=await page.locator('#network-topology').bounding_box()
        await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
        await page.mouse.move(box['x']+box['width']/2+35,box['y']+box['height']/2+20)
        assert await scene.get_attribute('transform')==transform
        await page.mouse.move(box['x']+8,box['y']+8)
        await page.mouse.down();await page.mouse.move(box['x']+55,box['y']+35,steps=6);await page.mouse.up()
        moved=await scene.get_attribute('transform')
        assert moved!=transform
        await page.locator('#core-reset').click()
        assert await scene.get_attribute('transform')=='translate(0 0)'
        results['movement']={'no_hover_motion':True,'dragged':moved,'reset':True}
        await page.locator('[data-theme-toggle]').click();await page.locator('[data-theme-option="light"]').click()
        await page.wait_for_timeout(250)
        assert await page.locator('html').get_attribute('data-resolved-theme')=='light'
        assert await page.locator('[data-node="gateway"]').get_attribute('aria-pressed')=='true'
        await page.locator('[data-core-mode="cluster"]').click()
        await page.locator('#cluster-select').select_option('applications')
        assert await page.locator('.topology-node.is-dimmed').count()==10
        await page.locator('[data-node="api"]').click()
        assert await page.locator('[data-node="api"]').get_attribute('aria-pressed')=='true'
        results['light_signature']=await shot(page,'tema-claro')
        await page.locator('[data-theme-toggle]').click();await page.locator('[data-theme-option="dark"]').click()
        await page.wait_for_timeout(250)
        await shot(page,'tema-escuro')
        assert not errors
        await page.close()

        reduced=await browser.new_page(viewport={'width':1024,'height':768},reduced_motion='reduce')
        await reduced.goto(BASE,wait_until='networkidle')
        assert await reduced.locator('#core-pause').get_attribute('aria-pressed')=='true'
        await reduced.locator('[data-core-mode="focus"]').click()
        await reduced.locator('[data-node="api"]').focus()
        await reduced.keyboard.press('Enter')
        assert await reduced.locator('[data-node="api"]').get_attribute('aria-pressed')=='true'
        results['accessibility']={'reduced_motion_paused':True,'keyboard_selection':True}
        await reduced.close()

        mobile=await browser.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
        await mobile.goto(BASE,wait_until='networkidle')
        for mode in ['network','flow','cluster','focus']:
            await mobile.locator(f'[data-core-mode="{mode}"]').tap()
            assert await mobile.locator(f'[data-core-mode="{mode}"]').get_attribute('aria-pressed')=='true'
        await mobile.locator('#cluster-select').select_option('data')
        await mobile.locator('[data-node="database"]').tap()
        assert await mobile.locator('[data-node="database"]').get_attribute('aria-pressed')=='true'
        assert await mobile.evaluate('document.documentElement.scrollWidth-innerWidth')==0
        results['mobile']={'modes':['network','flow','cluster','focus'],'filter':'data','selected':'database'}
        await shot(mobile,'mobile-390')
        await mobile.close();await browser.close()
    (EVIDENCE/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    print('PASS',json.dumps({key:value for key,value in results.items() if key not in ('responsive','modes','filters')},ensure_ascii=False))

if __name__=='__main__': asyncio.run(main())
