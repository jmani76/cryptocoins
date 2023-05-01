const axios = require('axios');

/**
 * Defines what the endpoint configuration is expected at a minimum.
 * @type {
 *     {
 *         headers: {}, baseUrl: string,
 *         expectedStatusCode: int,
 *         params: {}, body: {}, uri: string
 *     }
 * }
 */
let Endpoint = {
    baseUrl: undefined,
    uri: undefined,
    params: undefined,
    headers: {},
    expectedStatusCode: undefined,
    body: {}
};

/**
 * This method, utilises the axios node.js package to send rest-api requests. Specifically this method is
 * designed to only make a 'GET' rest-api request. The default max response timeout is configured as 30s.
 * @param endpoint - The endpoint configuration required to make a 'GET' request. Check 'Endpoint'.
 * @returns {Promise<any>} - Returns valid rest-api response or error.
 */
async function Get(endpoint) {
    return new Promise(async (resolve, reject) => {
        let customHeaders = {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
        };

        if (endpoint.headers) {
            customHeaders = Object.assign(customHeaders, endpoint.headers);
        }

        let params;
        if (endpoint.params !== undefined) {
            params = endpoint.params || {};
        }

        if(endpoint.baseUrl === undefined || endpoint.uri === undefined) {
            reject("Endpoint's baseurl or uri is not defined!");
        }

        await axios
            .request({
                method: 'GET',
                baseURL: endpoint.baseUrl,
                url: endpoint.uri,
                params,
                headers: customHeaders,
                timeout: 30000,
            })
            .then( (response) => {
                if (response.status === endpoint.expectedStatusCode) {
                    resolve(response);
                }
                else {
                    resolve("Expected Status: " + response.status +
                        ", but Actual Status: " + endpoint.expectedStatusCode)
                }
            })
            .catch((error) => {
                if (
                    error.response !== undefined &&
                    error.response.status === endpoint.expectedStatusCode
                ) {
                    resolve(error.response);
                } else {
                    reject(error.response);
                }
            });
    });
}

module.exports = {
    Endpoint,
    Get
}