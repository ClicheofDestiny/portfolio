import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:4323');
await page.waitForTimeout(3000);

// Screenshot normal state
await page.screenshot({ path: '/tmp/controls-normal.png' });

// Test: simulate full Konami via cabinet-input events
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let fired = false;
await page.evaluate((keys) => {
  window.addEventListener('konami', () => { window._konamiFired = true; }, { once: true });
  keys.forEach(key => window.dispatchEvent(new CustomEvent('cabinet-input', { detail: { key } })));
}, konami);

fired = await page.evaluate(() => !!window._konamiFired);
console.log('Konami fired via cabinet-input:', fired);

await browser.close();
