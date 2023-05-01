@api
Feature: Convert Currencies

  Description: This feature file mainly focuses on scenarios where a user would be using the market cap APIs
  and convert from a base currency into a fiat currency such as GBP or USD and then use that to further buy
  Crypto currency required.

  Scenario Outline: Convert from Base to Crypto using Fiat
    Given I have <BaseAmount> in "<BaseCurrency>" to convert it to "<FiatCurrencySymbol>"
    When  I make a "Get" request to "/v2/tools/price-conversion"
    Then  I would receive the relevant converted amount in fiat currency
    When  Using the received fiat currency amount to convert it into "<CryptoCurrency>"
    And   I make a "Get" request to "/v2/tools/price-conversion"
    Then  I will get base currency equivalent in crypto currency
    Examples:
      | BaseCurrency  | BaseAmount | FiatCurrencySymbol | CryptoCurrency |
      | GTQ           | 10000000   | GBP                | DOGE           |
      | GTQ           | 10000000   | USD                | BTS            |
