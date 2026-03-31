import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
await page.goto('http://localhost:4322');
await page.waitForTimeout(3000);

const result = await page.evaluate(() => {
  const screen = document.querySelector('.screen');
  const inner = document.querySelector('.screen-inner');
  const breakout = document.querySelector('.breakout-container');
  
  const innerStyle = inner ? window.getComputedStyle(inner) : null;
  const screenStyle = screen ? window.getComputedStyle(screen) : null;
  
  return {
    screenChildCount: screen?.children.length,
    screenChildren: screen ? [...screen.children].map(c => c.tagName + '.' + c.className) : [],
    innerDisplay: innerStyle?.display,
    innerVisibility: innerStyle?.visibility,
    innerHeight: innerStyle?.height,
    innerOverflow: innerStyle?.overflow,
    screenPosition: screenStyle?.position,
    screenOverflow: screenStyle?.overflow,
    breakoutExists: !!breakout,
    screenInnerHTML: screen?.innerHTML.substring(0, 1500),
  };
});

console.log('ERRORS:', JSON.stringify(consoleErrors, null, 2));
console.log('RESULT:', JSON.stringify(result, null, 2));
await browser.close();
