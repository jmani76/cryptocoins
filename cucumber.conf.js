// cucumber.conf.js file

const { Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

setDefaultTimeout(60000);
require('dotenv').config()

// launch the browser
BeforeAll(async function () {
    if (process.env.COINMARKETCAP_RUN_API_ONLY === 'true') return;
    const headlessMode = (process.env.COINMARKETCAP_HEADLESS === 'true');
    global.browser = await chromium.launch({
        headless: headlessMode,
        slowMo: 1000,
    });
});

// close the browser
AfterAll(async function () {
    if (process.env.COINMARKETCAP_RUN_API_ONLY === 'true') return;
    await global.browser.close();
});

// Create a new browser context and page per scenario
Before(async function () {
    if (process.env.COINMARKETCAP_RUN_API_ONLY === 'true') return;
    global.context = await global.browser.newContext();
    global.page = await global.context.newPage();
});

// Cleanup after each scenario
After(async function () {
    if (process.env.COINMARKETCAP_RUN_API_ONLY === 'true') return;
    await global.page.close();
    await global.context.close();
});