// locators
const locators = {
    "Modal_Dialog": "//*[name()='svg' and @class='sc-aef7b723-0 fKbUaI close-button']//*",
    "Page_Title": "Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap",
    "Select_Rows": "//*/div[contains(.,'100') and contains(@class,'dBikMg')]",
    "Choose_Rows_Value": "//*/button[contains(., 'REPLACE_ME')]",
    "Verify_Rows_On_Display": "//*/p[contains(.,'Showing 1 - REPLACE_ME out of ')]",
    "Filters_Button": "//span[contains(@class, 'icon-Slider')]",
    "Select_Algorithm": "//button[contains(@class, 'cmPAGl') and contains(., 'Algorithm')]",
    "Choose_Algorithm_Option": "//div[contains(@class, 'dURHKG')]//ul/li[text()='REPLACE_ME']",
    "Filter_Options":"//button[contains(., 'REPLACE_ME')]",
    "Filter_Mineable_Toggle":"//label[@id='mineable']/span",
    "Min_Price":"//input[@data-qa-id='range-filter-input-min']",
    "Max_Price":"//input[@data-qa-id='range-filter-input-max']"
};

async function GetElement(element_locator, index= 0){
    return new Promise(async (resolve, reject) => {
        try {
            if (element_locator === undefined) {
                reject("No locator string provided!");
            }

            let element = await page.locator(element_locator).nth(index);

            if (element !== undefined) {
                resolve(element);
            }
            else {
                reject("Failed to locate element with locator: " + element_locator);
            }
        }
        catch (error) {
            console.error(`Caught error in GetElement: ${error}`);
            reject(error);
        }
    });
}

async function TypeIntoField(element_locator, field_input,  element_index= 0){
    return new Promise(async (resolve, reject) => {
        try {
            let elementLocator = await GetElement(element_locator, element_index);
            if (elementLocator !== undefined) {
                elementLocator.fill(field_input);
                resolve(true);
            } else {
                resolve(false);
            }
        }
        catch (error) {
            console.error(`Caught error in TypeIntoField: ${error}`);
            reject(error);
        }
    });
}

async function ClickOnElement(element_locator, index=0) {
    return new Promise(async (resolve, reject) => {
        try {
            let element = await GetElement(element_locator, index);
            if (element !== undefined) {
                await element.click({force: true});
                resolve(true);
            }
            else {
                console.error("Failed to locate element, so click action cannot be performed!");
                resolve(false);
            }
        } catch (error) {
            console.error(`Caught error in ClickOnElement: ${error}`);
            reject(error);
        }
    });
}

async function SetRows(number_of_rows) {
    return new Promise(async (resolve, reject) => {
        try {
            let clickStatus = await ClickOnElement(locators.Select_Rows);
            if (clickStatus) {
                let row_value_selector=
                    locators.Choose_Rows_Value.replace("REPLACE_ME", number_of_rows);
                clickStatus = await ClickOnElement(row_value_selector);
            }
            resolve(clickStatus);
        } catch (error) {
            console.error(`Caught error in SetRows: ${error}`);
            reject(false);
        }
    });
}

async function VerifyNumberOfRowsOnDisplay(number_of_rows){
    return new Promise(async (resolve, reject) => {
        try {
            let displayed_rows = locators.Verify_Rows_On_Display.replace("REPLACE_ME", number_of_rows);
            let elementText = await page.locator(displayed_rows).innerText();
            if (elementText !== undefined) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        catch (error) {
            console.error(`Caught error in VerifyNumberOfRowsOnDisplay: ${error}`);
            reject(false);
        }
    })
}

async function CaptureMarketCapParameters(maxSlice) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.waitForSelector('table');
            const capturedRows = await page.$$eval('table tbody tr', (rows, maxSlice) => {
                return rows.slice(0, maxSlice).map(row => {
                    const columns = row.querySelectorAll('td');
                    return {
                        rank: columns[1]?.innerText.trim(),
                        name: columns[2]?.innerText.trim().replace(/\n+/g, ' '),
                        price: columns[3]?.innerText,
                        marketCap: columns[7]?.innerText.trim(),
                        volume: columns[8]?.innerText.trim().split('\n\n')[0],
                        volumePrice: columns[8]?.innerText.trim().split('\n\n')[1],
                        circulatingSupply: columns[9]?.innerText.trim()
                    };
                });
            }, maxSlice);
            if(capturedRows !== undefined) {
                resolve(capturedRows);
            }
            else {
                resolve([]);
            }
        }
        catch (error) {
            console.error(`Caught error in CaptureMarketCapParameters: ${error}`);
            reject([]);
        }
    });

}

async function ChooseAnAlgorithm(algorithmType){
    return new Promise(async (resolve, reject) => {
        try {
            let clickStatus = await ClickOnElement(locators.Filters_Button, 1);
            if (clickStatus) {
                clickStatus = await ClickOnElement(locators.Select_Algorithm);
                if (clickStatus) {
                    let algorithmSelector =
                        locators.Choose_Algorithm_Option.replace('REPLACE_ME', algorithmType);
                    clickStatus = await ClickOnElement(algorithmSelector);
                    resolve(clickStatus);
                }
            }
        }
        catch (error) {
            console.error(`Caught error in ChooseAnAlgorithm: ${error}`);
            reject(false);
        }
    });
}

async function ClickInSequence(elementLocator, itemsToClick){
    return new Promise(async(resolve, reject) => {
        try {
            let clickedAll = true;
            for (const item of itemsToClick) {
                let filterLocator = elementLocator.replace('REPLACE_ME', item);
                if (clickedAll) {
                    clickedAll = await ClickOnElement(filterLocator);
                }
                else {
                    break;
                }
            }
            resolve(clickedAll);
        }
        catch (error) {
            console.error(`Caught error in ClickInSequence: ${error}`);
            reject(false);
        }
    });
}

async function SetMoreFilters(filterType, toggleMineable, minPrice, maxPrice) {
    return new Promise(async (resolve, reject) => {
        try {
            const itemsToClick = ['Add Filter', 'All Cryptocurrencies', 'Coins', 'Price'];
            let status = await ClickInSequence(locators.Filter_Options, itemsToClick);

            if (!status) {
                resolve(false);
            }

            status = await TypeIntoField(locators.Min_Price, minPrice);
            if(!status) {
                resolve(false);
            }

            status = await TypeIntoField(locators.Max_Price, maxPrice);
            if(!status) {
                resolve(false);
            }

            const filterLocator = locators.Filter_Options.replace('REPLACE_ME', 'Price');
            status = await ClickOnElement(filterLocator);

            if (!status) {
                resolve(false);
            }

            status = await ClickOnElement(locators.Filter_Mineable_Toggle);

            if (!status) {
                resolve(false);
            }

            const showResultsLocator = locators.Filter_Options.replace('REPLACE_ME', 'Show results');
            status = await ClickOnElement(showResultsLocator);

            if (!status) {
                resolve(false);
            }

            resolve(true);
        } catch (error) {
            console.error(`Caught error in setMoreFilters: ${error}`);
            reject(false);
        }
    });
}

async function CompareCapturedPageContents(expected, received) {
    return new Promise(async (resolve, reject) => {
        try {
            const mismatched = [];

            for (let i = 0; i < expected.length; i++) {
                const expectedItem = expected[i];
                const receivedItem = received[i];

                if (JSON.stringify(expectedItem) !== JSON.stringify(receivedItem)) {
                    mismatched.push({ expected: expectedItem, received: receivedItem });
                }
            }

            resolve(mismatched);
        }
        catch (error) {
            console.error(`Caught error in CompareCapturedPageContents: ${error}`);
            reject(false);
        }
    });
}

module.exports = {
    locators,
    SetRows,
    VerifyNumberOfRowsOnDisplay,
    CaptureMarketCapParameters,
    ChooseAnAlgorithm,
    SetMoreFilters,
    CompareCapturedPageContents
};
