<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div style="width:500px; margin: 0 auto; text-align: center;">

# Crypto Coins

CryptoCoins is a simple demo repository that showcases how PlayWright can be used with Cucumber-JS 
to drive BDD Scenarios with **CoinMarketCap** website.

[Pre-requisites](#pre-requisites) •
[Getting started](#getting-started) •

</div>

## Pre-requisites

To run this solution, the following 2 should be installed on your system.
1. [node.js](https://nodejs.org/en) should be installed globally (system-wide).

2. [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) package manager should also be installed (locally to the projects folder or globally).

3. Latest Chrome browser to be installed and available for testing. The code is currently set to launch chromium instance for automation testing.

## Getting started

Once pre-requisites are satisfied on your system and assuming you have your project folder 
configured in your local machine as:

Windows&nbsp;&nbsp;&nbsp;: **c:\projects**<br>
Mac/Linux : **~/projects**

the below instructions should be common to all operating systems. 

```sh
git clone https://github.com/jmani76/cryptocoins.git   # clone the project into your projects folder          

touch .env                                             # this represents a file which holds various environment values
                                                       # On Windows OS, use "notepad .env" to create dot env file
```

Edit the .env file and add the following Key=Values
Also remove the comments given below in your actual .env file
In the below, I've used coinmarketcap's pro-api baseurl, you can also replace it with the sandbox api baseurl
which at the time of writing this document was: https://sandbox-api.coinmarketcap.com, this helps in not exhausting your free credits.

```sh
COINMARKETCAP_API_KEY=YOUR_OWN_API_KEYS  # This key is required for API test with coinmarketcap.
COINMARKETCAP_CLOSE_HOMEPAGE_MODAL=false # Occasionally the website shows modal dialogs on homepage
COINMARKETCAP_HEADLESS=false             # You would change this to 'true' when executing in CI/CD pipeline
COINMARKETCAP_API_BASEURL=https://pro-api.coinmarketcap.com
COINMARKETCAP_RUN_API_ONLY=false         # This works in conjunction with the test-api command in package.json
```

Once the .env file is set as described above, then execute the below commands to run the test

```sh
yarn install      # Installs the packages referenced in package.json file into your project

yarn test         # Executes all the tests, both UI and API tests. 

yarn run test-ui      # Executes only the UI tests

yarn run test-api     # Executes only the API tests, but COINMARKETCAP_RUN_API_ONLY in .env should be changed to 'true'

```
