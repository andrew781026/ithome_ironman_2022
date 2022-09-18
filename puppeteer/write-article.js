const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: '.env'});

const articles = require('./articles.json');

// 2022-09-16
const startDay = dayjs('2022-09-16');

const today = dayjs();

// 第幾天
const whichDay = today.diff(startDay, 'day') + 1;

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

    // 點擊 "登入/註冊" 按鈕
    await page.click('ul.menu__right a.menu__item-link');
    await page.waitForTimeout(4000);

    // 點擊 "鐵人發文" 按鈕
    await page.click('button[data-target="#ir-select-series__common"]');
    await page.waitForTimeout(4000);

    // 點擊 "主題區域"
    await page.click('.ir-modal__list-link');
    await page.waitForTimeout(4000);

    // 取得 article & title 的資訊
    const todayArticle = articles[whichDay - 1];
    const contentPath = path.resolve(__dirname, todayArticle.folder, todayArticle.contentPath);
    const content = fs.readFileSync(contentPath, 'utf8').toString();

    // 填寫 "標題 & 內文"
    await page.type('input[name="subject"]', todayArticle.title);
    await page.type('div.CodeMirror.cm-s-paper.CodeMirror-wrap textarea', content);
    await page.waitForTimeout(4000);

    // 點擊 "發文按鈕"
    await page.click('button.save-group__dropdown-toggle');
    await page.waitForTimeout(4000);
    await page.click('input.save-group__dropdown-btn--publish[type="submit"]');

    await browser.close();
})();
