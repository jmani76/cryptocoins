const {Given, When, Then} = require('@cucumber/cucumber')
const { expect } = require("@playwright/test")

const homepage = require("../../pages/homepage");

// Background step implementation
Given('I visit {string} website', async (url) => {
    await page.goto(url);

    if (process.env.COINMARKETCAP_CLOSE_HOMEPAGE_MODAL === 'true') {
        await page.click(homepage.locators.Modal_Dialog);
    }
});

// Scenario steps
Given('I\'m on coin market cap website homepage', async () => {
    await expect(page).toHaveTitle(homepage.locators.Page_Title);
});

When('I limit the max rows to show at {int}', async (number_of_rows) => {
    let status = await homepage.SetRows(number_of_rows);
    await expect(status).toBeTruthy();
});

Then('Only {int} rows are loaded', async (number_of_rows) => {
    let status = await homepage.VerifyNumberOfRowsOnDisplay(number_of_rows);
    await expect(status).toBeTruthy();
});