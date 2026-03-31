import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto('http://localhost:4323');
await page.waitForTimeout(2000);

// Fire the konami custom event directly
await page.evaluate(() => window.dispatchEvent(new CustomEvent('konami')));
await page.waitForTimeout(1000);

await page.screenshot({ path: '/tmp/konami-active.png' });

const result = await page.evaluate(() => {
  const breakout = document.querySelector('.breakout-container');
  const screen = document.querySelector('.screen');
  return {
    breakoutExists: !!breakout,
    breakoutParent: breakout?.parentElement?.className,
    breakoutStyle: breakout ? window.getComputedStyle(breakout).position : null,
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
