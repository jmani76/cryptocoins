const {ClickInSequence, ClickOnElement, TypeIntoField} = require('./common');

// locators
const locators = {
    "Modal_Dialog": "//*[name()='svg' and @class='sc-aef7b723-0 fKbUaI close-button']//*",
    "Page_Title": "Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap",
    "Select_Rows": "//p[text() = 'Show rows']/../div",
    "Choose_Rows_Value": "//button[contains(@class, 'sc-44910c32-0 kppgZc') and contains(., 'REPLACE_ME')]",
    "Verify_Rows_On_Display": "//*/p[contains(.,'Showing 1 - REPLACE_ME out of ')]",
    "Filters_Button": "//span[contains(@class, 'icon-Slider')]",
    "Select_Algorithm": "//button[contains(@class, 'cmPAGl') and contains(., 'Algorithm')]",
    "Choose_Algorithm_Option": "//div[contains(@class, 'dURHKG')]//ul/li[text()='REPLACE_ME']",
    "Filter_Options":"//button[contains(., 'REPLACE_ME')]",
    "Filter_Mineable_Toggle":"//label[@id='mineable']/span",
    "Min_Price":"//input[@data-qa-id='range-filter-input-min']",
    "Max_Price":"//input[@data-qa-id='range-filter-input-max']"
};

/**
 * This method takes number of rows to set on a specific drop down element
 * on coin market cap website. Though not validated, the current allowed
 * values on the website for this field are: 20, 50 and 100.
 * @param number_of_rows - Sets the table to refresh and show the required number of rows.
 * @returns {Promise<boolean>} - If the setting action is completed successfully.
 */
async function SetRows(number_of_rows) {
    return new Promise(async (resolve, reject) => {
        try {
            let clickStatus = await ClickOnElement(locators.Select_Rows, 1);
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

/**
 * This method validates that the rows set by the drop-down field in the method: SetRows
 * has actually resolved to those many expected rows only. By looking for a string in the page
 * that displays how many rows are being displayed currently.
 * @param number_of_rows - Validate that the string captured to validate the showing of rows, contains this value.
 * @returns {Promise<boolean>} - If the string is captured and validated successfully.
 */
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

/**
 * This method, clicks on the filters button above the table and sets the Algorithm to a value
 * provided by the user.
 * @param algorithmType - The type of algorithm specified by user.
 * @returns {Promise<boolean>} - If given algorithm is set successfully.
 */
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

/**
 * This method takes 4 parameters as given below and applies the same into More filters option above the given
 * table to narrow the results for user to focus on the cryptos that are of interest to them.
 * @param filterType - This can be All Cryptocurrencies, Coins and Tokens
 * @param toggleMineable - This either toggles the mineable currencies to true or false
 * @param minPrice - This sets the Price range to the min required
 * @param maxPrice - This sets the Price range to the max allowed.
 * @returns {Promise<boolean>} - If all the given filters are applied successfully
 */
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

/**
 * This method, possibly can be refactored and moved into common.js file considering it gets all the rows
 * of a table on display and then slices the columns for the expected page contents such as
 * rank, name, price, market cap, volume and supply in circulation.
 * Currently, the number of rows to work up on is given as the maxSlice parameter - basically this limits
 * the function to work on a smaller or larger set of rows based on one's requirements.
 * @param maxSlice - The maximum rows to work with
 * @returns {Promise<array>} - If the expected rows and column values are captured into an array successfully.
 */
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

/**
 * This method, takes an (expected) array of json objects captured before filters were applied (unfiltered) and
 * another array (received) of json objects captured after filters were applied.
 * Then compares each of those json object's properties to find if they are same, if not adds them into a mismatched
 * array. This mismatched array when it is empty means both expected and received are the same.
 * @param expected - This contains an array of unfiltered results captured before filters are applied
 * @param received - This contains an array of results captured after filters are applies
 * @returns {Promise<array>} - The contents of this array is contains objects of expected and received
 *                             if they vary in any of their properties
 */
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

/**
 * Module exports of various functions and json types.
 * @type {
 * {
 *    locators: {
 *        Filters_Button: string,
 *        Filter_Options: string,
 *        Max_Price: string,
 *        Page_Title: string,
 *        Choose_Rows_Value: string,
 *        Select_Algorithm: string,
 *        Verify_Rows_On_Display: string,
 *        Filter_Mineable_Toggle: string,
 *        Min_Price: string,
 *        Choose_Algorithm_Option: string,
 *        Select_Rows: string,
 *        Modal_Dialog: string
 *    },
 *    SetRows: (function(*): Promise<boolean>),
 *    VerifyNumberOfRowsOnDisplay: (function(*): Promise<boolean>),
 *    SetMoreFilters: (function(*, *, *, *): Promise<boolean>),
 *    ChooseAnAlgorithm: (function(*): Promise<boolean>),
 *    CaptureMarketCapParameters: (function(*): Promise<array>),
 *    CompareCapturedPageContents: (function(*, *): Promise<array>)}}
 */
module.exports = {
    locators,
    SetRows,
    VerifyNumberOfRowsOnDisplay,
    SetMoreFilters,
    ChooseAnAlgorithm,
    CaptureMarketCapParameters,
    CompareCapturedPageContents
};
