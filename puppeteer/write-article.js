const puppeteer = require('puppeteer');
require('dotenv').config();
console.log(process.env.USER_NAME);
console.log(process.env.PASSWORD);

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://member.ithome.com.tw/login');
    await page.type('input[name="account"]', process.env.USER_NAME);
    await page.type('input[name="password"]', process.env.PASSWORD);
    await page.click('button[type="submit"]');

    await page.goto('https://ithelp.ithome.com.tw/');
    await page.click('ul.menu__right a.menu__item-link');
    await page.waitForTimeout(4000);
    await page.click('button[data-target="#ir-select-series__common"]');
    await page.waitForTimeout(4000);
    await page.click('.ir-modal__list-link');
    await page.waitForTimeout(4000);
    await page.type('input[name="subject"]', process.env.TITLE);
    await page.type('div.CodeMirror.cm-s-paper.CodeMirror-wrap textarea',process.env.CONTENT);
    await page.waitForTimeout(4000);
    await page.click('button.save-group__dropdown-toggle');
    await page.waitForTimeout(4000);
    await page.click('input.save-group__dropdown-btn--publish[type="submit"]');

    // await browser.close();
})();
