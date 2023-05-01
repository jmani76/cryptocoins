/**
 * This method, is a helper method to identify a locator on a given page's dom using playwright.
 * @param element_locator - A locator string used by playwright to find an element on a given page's dom.
 * @param index - To help narrow it down to a specific locator when multiple locators are identified.
 * @returns {Promise<any>} - Returns identified element's locator object.
 */
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

/**
 * This method, is a simple helper function that takes an input value and types them into the given element's locator.
 * @param element_locator - The input locator on the page
 * @param field_input - The input to type into the identified input locator element.
 * @param element_index - To help narrow it down to a specific locator when multiple locators are identified.
 * @returns {Promise<boolean>} - Returns true if value is typed into the input element.
 */
async function TypeIntoField(element_locator, field_input,  element_index= 0){
    return new Promise(async (resolve, reject) => {
        try {
            let elementLocator = await GetElement(element_locator, element_index);
            if (elementLocator !== undefined) {
                await elementLocator.fill(field_input);
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

/**
 *
 * @param element_locator - The clickable element locator such as button, link etc.,
 * @param index - To help narrow it down to a specific locator when multiple locators are identified.
 * @returns {Promise<boolean>} - Returns true if element is clicked as expected.
 */
async function ClickOnElement(element_locator, index=0) {
    return new Promise(async (resolve, reject) => {
        try {
            let element = await GetElement(element_locator, index);
            if (element !== undefined) {
                await page.waitForLoadState('networkidle')
                await element.click();
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

/**
 * This method, is a helper function that takes few clickable elements in an array and loops through them
 * and clicks one at a time in the sequence given in the array.
 * @param elementLocator - This replaceable locator string.
 * @param itemsToClick - An array of clickable elements to click one after another.
 * @returns {Promise<boolean>} - Returns true if all given elements are clicked through in a given order.
 */
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

/**
 *
 * @type {
 *  {
 *      GetElement: (function(*, number=): Promise<boolean>),
 *      ClickInSequence: (function(*, *): Promise<boolean>),
 *      ClickOnElement: (function(*, number=): Promise<boolean>),
 *      TypeIntoField: (function(*, *, number=): Promise<boolean>)}}
 */
module.exports = {
    GetElement,
    TypeIntoField,
    ClickOnElement,
    ClickInSequence
};