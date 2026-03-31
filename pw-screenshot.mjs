import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:4323');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/after-fix.png' });
await browser.close();
