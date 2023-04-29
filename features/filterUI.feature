Feature: Filtering UI

  Description: This feature file mainly covers a user visiting the coin market cap website
  and apply relevant filters to narrow down the results and undertake comparison
  based on the page content.


  Scenario: Filtering UI and extracting data for comparison
    Given I am on "https://coinmarketcap.com/" website
    When I limit the max rows to show at 20
    Then Only 20 rows are loaded
    And I can capture the market cap performance parameters for the top 5 ranking cryptos
    When I select algorithm as "PoW"
    And Apply more filters as given below
    |cryptoType|toggleMineableState|minPrice|maxPrice|
    |coins     |On                 |100     |10000   |
    Then I can capture the top 5 ranking cryptos from the filtered results
    And Compare the same with unfiltered results captured earlier

