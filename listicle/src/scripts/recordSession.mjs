import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const SELECTORS = {
  listLink: (slug) => `a[href="/items/${slug}"]`,
  backLink: 'a.back-link',
  detailArticle: 'article.detail',
  main: 'main',
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function humanDelay(minMs, maxMs) {
  await delay(randomBetween(minMs, maxMs));
}

async function scrollIntoViewSmooth(page, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, selector);
  await delay(randomBetween(900, 1400));
}

async function scrollListToShowAll(page) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await delay(600);
  await page.evaluate((sel) => {
    const main = document.querySelector(sel);
    if (main) main.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, SELECTORS.main);
  await delay(randomBetween(800, 1200));
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await delay(500);
}

async function scrollDetailPageToShowAll(page) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await delay(400);
  await page.evaluate((sel) => {
    const article = document.querySelector(sel);
    if (article) article.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, SELECTORS.detailArticle);
  await delay(randomBetween(1000, 1600));
}

async function scrollBackToTop(page) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await delay(randomBetween(800, 1200));
}

async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('pw-recorder-cursor')) return;
    const cur = document.createElement('div');
    cur.id = 'pw-recorder-cursor';
    cur.style.cssText = [
      'position:fixed;left:0;top:0;width:28px;height:28px;pointer-events:none;z-index:2147483647;',
      'background:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23000\' stroke=\'%23fff\' stroke-width=\'1.5\'%3E%3Cpath d=\'M5 3l14 9-6 2-4 4z\'/%3E%3C/svg%3E") 0 0/contain no-repeat;',
      'transform:translate(-2px,-2px);'
    ].join('');
    (document.body || document.documentElement).appendChild(cur);
    window.__recorderCursor = { x: 100, y: 100 };
    cur.style.left = '100px';
    cur.style.top = '100px';
    window.__setRecorderCursor = (x, y) => {
      window.__recorderCursor = { x, y };
      cur.style.left = x + 'px';
      cur.style.top = y + 'px';
    };
  });
}

async function moveCursorToAndClick(page, selector, cursorPos) {
  const box = await page.locator(selector).boundingBox();
  if (!box) {
    await page.click(selector, { delay: randomBetween(80, 180) });
    return;
  }
  const targetX = box.x + box.width / 2 + randomBetween(-8, 8);
  const targetY = box.y + box.height / 2 + randomBetween(-4, 4);
  const steps = randomBetween(18, 28);
  const stepMs = randomBetween(12, 22);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(cursorPos.x + (targetX - cursorPos.x) * t);
    const y = Math.round(cursorPos.y + (targetY - cursorPos.y) * t);
    await page.evaluate(({ x, y }) => window.__setRecorderCursor(x, y), { x, y });
    await delay(stepMs);
  }
  cursorPos.x = targetX;
  cursorPos.y = targetY;
  await delay(randomBetween(40, 120));
  await page.click(selector, { delay: randomBetween(80, 180) });
}

const outputDir = path.resolve(process.cwd(), 'recordings');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  headless: false,
  slowMo: 120
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: outputDir,
    size: { width: 1440, height: 900 }
  }
});

const page = await context.newPage();
const viewport = { width: 1440, height: 900 };
const cursorPos = { x: viewport.width / 2, y: viewport.height / 2 };
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await injectCursor(page);
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(600, 1100);

await scrollListToShowAll(page);

await scrollIntoViewSmooth(page, SELECTORS.listLink('event-1'));
await humanDelay(400, 800);
await moveCursorToAndClick(page, SELECTORS.listLink('event-1'), cursorPos);
await page.waitForLoadState('networkidle');
await injectCursor(page);
cursorPos.x = 100;
cursorPos.y = 100;
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(400, 700);
await scrollDetailPageToShowAll(page);
await humanDelay(1200, 2200);
await scrollBackToTop(page);
await moveCursorToAndClick(page, SELECTORS.backLink, cursorPos);
await page.waitForLoadState('networkidle');
await injectCursor(page);
cursorPos.x = 100;
cursorPos.y = 100;
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(500, 900);

await scrollIntoViewSmooth(page, SELECTORS.listLink('event-3'));
await humanDelay(400, 800);
await moveCursorToAndClick(page, SELECTORS.listLink('event-3'), cursorPos);
await page.waitForLoadState('networkidle');
await injectCursor(page);
cursorPos.x = 100;
cursorPos.y = 100;
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(400, 700);
await scrollDetailPageToShowAll(page);
await humanDelay(1200, 2000);
await scrollBackToTop(page);
await moveCursorToAndClick(page, SELECTORS.backLink, cursorPos);
await page.waitForLoadState('networkidle');
await injectCursor(page);
cursorPos.x = 100;
cursorPos.y = 100;
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(500, 900);

await scrollIntoViewSmooth(page, SELECTORS.listLink('event-5'));
await humanDelay(400, 800);
await moveCursorToAndClick(page, SELECTORS.listLink('event-5'), cursorPos);
await page.waitForLoadState('networkidle');
await injectCursor(page);
cursorPos.x = 100;
cursorPos.y = 100;
await page.evaluate((p) => window.__setRecorderCursor(p.x, p.y), cursorPos);
await humanDelay(400, 700);
await scrollDetailPageToShowAll(page);
await humanDelay(1200, 2200);
await scrollBackToTop(page);
await moveCursorToAndClick(page, SELECTORS.backLink, cursorPos);
await page.waitForLoadState('networkidle');
await humanDelay(800, 1400);

const video = page.video();
await context.close();
await browser.close();

if (!video) {
  throw new Error('No video handle returned by Playwright');
}

let videoPath = await video.path();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
const newName = `listicle-${timestamp}.webm`;
const newPath = path.join(outputDir, newName);
fs.renameSync(videoPath, newPath);
console.log(newPath);
