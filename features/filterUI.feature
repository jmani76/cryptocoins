Feature: Filtering UI
  Description: This feature file mainly covers a user visiting the coin market cap website
  and apply relevant filters to narrow down the results and undertake comparison
  based on the page content.

  Background:
    Given I visit "https://coinmarketcap.com/" website


  Scenario:
    Given I'm on coin market cap website homepage
    When I limit the max rows to show at 20
    Then Only 20 rows are loaded