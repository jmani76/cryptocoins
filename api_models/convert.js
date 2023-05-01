const {Endpoint, Get} = require("../support/postman");

/**
 * Scenario data store to hold different currency symbols and amounts for conversion and for converted amounts.
 * @type {
 *     {
 *     convertedCurrencyAmount: string, convertToCurrencySymbol: string,
 *     convertFromCurrencySymbol: string, convertFromCurrencyAmount: string
 *     }
 * }
 */
let dataForConversion = {
    convertFromCurrencySymbol: "",
    convertFromCurrencyAmount: "",
    convertToCurrencySymbol: "",
    convertedCurrencyAmount: ""
};

/**
 * This method, accepts a requestUri and relies on the data store defined using: dataForConversion along with
 * environment variable for baseUrl before proceeding ahead to make the rest-api call to the given Uri.
 * Validates the response received and extracts and returns the converted amount/price.
 * @param requestUri - The Uri to call for getting converted price quotes for a given base currency and amount.
 * @returns {Promise<any>} - Returns the converted price for a given base currency amount or error if there is an error.
 */
async function ConvertCurrency(requestUri) {
    return new Promise(async (resolve, reject) => {
        try {
            let endpoint = Endpoint;
            endpoint.baseUrl = process.env.COINMARKETCAP_API_BASEURL;
            endpoint.headers = {
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            };
            endpoint.uri = requestUri;
            endpoint.expectedStatusCode = 200;
            endpoint.params = {
                amount: dataForConversion.convertFromCurrencyAmount,
                symbol: dataForConversion.convertFromCurrencySymbol,
                convert: dataForConversion.convertToCurrencySymbol
            };

            let apiResponse = await Get(endpoint);
            if (apiResponse !== undefined && apiResponse != null) {
                let currencyData = apiResponse.data;
                if (currencyData.status["error_code"] === 0) {
                    let quoteData;
                    if (Object.prototype.toString.call(currencyData.data) === '[object Array]') {
                        currencyData = currencyData.data[0];
                        quoteData = currencyData.quote;
                    }
                    else {
                        quoteData = currencyData.data[dataForConversion.convertFromCurrencySymbol].quote;
                    }
                    if (quoteData !== undefined) {
                        let amount = quoteData[dataForConversion.convertToCurrencySymbol]["price"];
                        resolve(amount);
                    }
                    else {
                        resolve("No quote retrieved!");
                    }
                }
                else {
                    resolve(currencyData.status["error_message"]);
                }
            }
            else {
                resolve(0);
            }
        }
        catch (error) {
            console.error(`Caught error in ConvertCurrency: ${error}`);
            reject(false);
        }
    });
}

module.exports = {
    dataForConversion,
    ConvertCurrency
}