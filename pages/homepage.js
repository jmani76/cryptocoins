// locators
const locators = {
    "Modal_Dialog": "//*[name()='svg' and @class='sc-aef7b723-0 fKbUaI close-button']//*",
    "Page_Title": "Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap",
    "Select_Rows": "//*/div[contains(.,'100') and contains(@class,'dBikMg')]",
    "Choose_Rows_Value": "//*/button[contains(., 'REPLACE_ME')]",
    "Verify_Rows_On_Display": "//*/p[contains(.,'Showing 1 - REPLACE_ME out of ')]"
};

async function GetElement(element_locator, index=0){
    return new Promise(async (resolve, reject) => {
        try {
            if (element_locator === undefined) {
                reject("No locator string provided!");
            }

            await page.waitForSelector(element_locator);
            let elements = await page.locator(element_locator).nth(index);

            if (elements !== undefined) {
                resolve(elements);
            }
            else {
                reject("Failed to locate element with locator: " + element_locator);
            }
        }
        catch (error) {
            console.error("Caught error in GetElement: " + error);
            reject(error);
        }
    });
}

async function SetRows(number_of_rows) {
    return new Promise(async (resolve, reject) => {
        try {
            let element = await GetElement(locators.Select_Rows);
            if (element !== undefined) {
                element.click();
                let row_value_selector =
                    locators.Choose_Rows_Value.replace("REPLACE_ME", number_of_rows);
                element = await GetElement(row_value_selector);
                if (element !== undefined) {
                    element.click();
                    resolve(true);
                } else {
                    console.error("SetRows: Failed to locate element with locator: " + row_value);
                    resolve(false);
                }
            }
        } catch (error) {
            console.error("Caught error in SetRows: " + error);
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
            console.error("Caught error in VerifyNumberOfRowsOnDisplay: " + error);
            reject(false);
        }
    })
}

module.exports = { locators, SetRows, VerifyNumberOfRowsOnDisplay };

