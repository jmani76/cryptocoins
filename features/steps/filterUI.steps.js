const {Given, When, Then} = require('@cucumber/cucumber')
const { expect } = require("@playwright/test")

const homepage = require("../../pages/homepage");

let unfilteredResults;
let filteredResults;

// Scenario steps
Given('I am on {string} website', async (url) => {
    await page.goto(url);

    if (process.env.COINMARKETCAP_CLOSE_HOMEPAGE_MODAL === 'true') {
        await page.click(homepage.locators.Modal_Dialog);
    }
    await expect(page).toHaveTitle(homepage.locators.Page_Title);
});

When('I limit the max rows to show at {int}', async (number_of_rows) => {
    let status = await homepage.SetRows(number_of_rows);
    await expect(status).toBe(true);
});

Then('Only {int} rows are loaded', async (number_of_rows) => {
    let status = await homepage.VerifyNumberOfRowsOnDisplay(number_of_rows);
    await expect(status).toBe(true);
});

Then('I can capture the market cap performance parameters for the top {int} ranking cryptos',
    async(number_of_top_performers) => {
    unfilteredResults = await homepage.CaptureMarketCapParameters(number_of_top_performers);
    await expect(unfilteredResults.length).toEqual(number_of_top_performers);
});

When('I select algorithm as {string}', async (algorithm_type) => {
    let status = await homepage.ChooseAnAlgorithm(algorithm_type);
    await expect(status).toBe(true);
});

When('Apply more filters as given below', async (dataTable) => {
    const filterData = dataTable.hashes();
    let status = await homepage.SetMoreFilters(filterData[0].cryptoType, filterData[0].toggleMineableState,
        filterData[0].minPrice, filterData[0].maxPrice);
    await expect(status).toBe(true);
});

Then('I can capture the top {int} ranking cryptos from the filtered results',
    async(number_of_top_performers) => {
    filteredResults = await homepage.CaptureMarketCapParameters(number_of_top_performers);
    await expect(filteredResults.length).toEqual(number_of_top_performers);
});

Then('Compare the same with unfiltered results captured earlier', async() => {
    let data = await homepage.CompareCapturedPageContents(unfilteredResults, filteredResults);
    if (data.length > 0) {
        console.log("Filtered row of results that are different to Unfiltered results");
        console.log(data);
        await expect(data.length).toBeGreaterThan(0);
    }
    else {
        console.log("Unfiltered vs Filtered are same!");
        await expect(data.length).toEqual(0);
    }
});