const {Given, When, Then} = require("@cucumber/cucumber");
const {expect} = require("@playwright/test");
const convertor = require("../../api_models/convert");

Given('I have {int} in {string} to convert it to {string}',
    (baseAmount, baseCurrency, fiatCurrency) => {
        convertor.dataForConversion.convertFromCurrencySymbol = baseCurrency;
        convertor.dataForConversion.convertFromCurrencyAmount = baseAmount;
        convertor.dataForConversion.convertToCurrencySymbol = fiatCurrency;
});

When('I make a {string} request to {string}',
    async (requestType, requestUri) => {

    requestType = requestType.toLowerCase();
    expect(requestType).toEqual("get");

    let convertedAmount = await convertor.ConvertCurrency(requestUri);
    await expect(convertedAmount).toBeGreaterThan(0);
    convertor.dataForConversion.convertedCurrencyAmount = convertedAmount;

});

Then('I would receive the relevant converted amount in fiat currency', async () => {
    await expect(convertor.dataForConversion.convertedCurrencyAmount).toBeGreaterThan(0);
});

When('Using the received fiat currency amount to convert it into {string}',
    async (cryptoCurrencySymbol) => {
        convertor.dataForConversion.convertFromCurrencySymbol = convertor.dataForConversion.convertToCurrencySymbol ;
        convertor.dataForConversion.convertFromCurrencyAmount = convertor.dataForConversion.convertedCurrencyAmount;
        convertor.dataForConversion.convertToCurrencySymbol = cryptoCurrencySymbol;
});

Then('I will get base currency equivalent in crypto currency', async () => {
    await expect(convertor.dataForConversion.convertedCurrencyAmount).toBeGreaterThan(0);
    console.log("Amount of Cryptocurrencies: " + convertor.dataForConversion.convertedCurrencyAmount);
});
