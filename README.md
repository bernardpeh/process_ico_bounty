Let's say you promise your advertisers some bounties for promoting your ico with some of your erc20 token. When they have completed their task, you have the choice of sending them the token manually or automating it using a script. 

Create a new HDwallet by generating a new seed. Then send some ERC20 and ETH to this wallet and you are ready to go.

## Installation

* install [truffle](https://github.com/trufflesuite/truffle)
*  `npm install`
* create truffle config
* Create the truffle.js and .env in the project root and configure them accordingly

```
cp truffle-config.js truffle.js
cp .env.sample .env
```

## Usage

* update .env
* create mysql tables using db_schema.sql
* update scripts/give_bounty.js params

```
truffle exec scripts/give_bounty.js network=xx
```

## Others

* adminer can help to manage the mysql database easily

```
php -S localhost:8080
```
