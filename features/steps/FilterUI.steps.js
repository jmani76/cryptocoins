const {Given, When, Then} = require('@cucumber/cucumber')
// import expect for assertion
const { expect } = require("@playwright/test")

// Background step implementation
Given('I visit {string} website', async (url) => {
    console.log("Url=> " + url);
    await page.goto(url);

    let modal_close_button = '//*[name()="svg" and @class="sc-aef7b723-0 fKbUaI close-button"]//*';
    await page.click(modal_close_button);
});

// Scenario steps
Given('I\'m on coin market cap website homepage', async () => {
    await expect(page)
        .toHaveTitle("Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap");
});

When('I limit the rows to {int}', async (number_of_rows) => {
    console.log("Number of rows: " + number_of_rows);
    await expect(number_of_rows).toEqual(20);
});

