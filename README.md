![Build](https://github.com/akomar812/craps/actions/workflows/npm-publish.yml/badge.svg)

# Contents

1. [Description](#Description)
2. [Installation](#Installation)
3. [Usage](#Usage)
4. [API](#API)

# Description
Craps game that can be installed directly and played as a command line game or imported
as a 3rd party module which can be played with multiple players such as in a discord server

# Installation
From npm for use as import

```
npm install --save @akomar812/craps
```
---

From npm for playing on CLI

```
npm install -g @akomar812/craps
```
---

From git repo for playing on CLI

```
# clone repo and cd into it
npm install -g .
```

# Usage

## To play as CLI

Run:

```
craps
````

You should be met with the message:

```
player connected to craps table...
>
```

## To import as node_module

```
  const craps = await require('craps').textInterface(<opts>);

  craps(<player>, <cmd>, <messageFn>);
```

Where:
- \<player\>       is the name of a player
- \<cmd\>          is a command from the api below
- \<messageFn\>    is the function you want the game to call to send output to the client
- \<opts\>         has the following configuration options:
```
  {
    "prefix": <string> // default is "", the value that all commands need to be prefixed with to register
  }
```

## Discord bot
Use this if you want to use this library as a pre-made, multi-player discord bot

https://github.com/akomar812/discord-craps

# API
* Start game or join current game by running: `join`
* There must be at least one bet on the table before the shooter can roll
* If a player or shooter is inactive for 5 minutes they will be booted
* New and returning players need to fetch their money from the bank in order for it to be available
  for wagering on the table. Players can take their winnings off of the table and store in the bank
  at any time. Any money on the table will automatically be banked when the player exits

## Commands

`exit`
Leaves game if joined, and all wagers are wiped away. The player's pot will be preserved until the process
is restarted

`help`
Show text interface documentation in interface display

`dice`
Show possible dice rolls, chance of occurring and ways of occurring

`status`
Shows the current state of the game

`join`
Joins an active craps game or starts one if none is available

`bet [name] [amount]`
Submit a wager against a bet

`roll`
Roll the dice if you are the shooter. At least one wager must be submitted before the shooter can roll

`reset cash`
Adds $100 to the caller's pot if they've fallen below $100

`bank`
Displays information about the money in the bank including user balances and high scores

`bank (action) (amount)`
Actions are `withdraw`/`deposit`. The bank is used to add/remove
money from the table to be stored in user's personal bot.


# TODO
  - Bets that still need to be implemented:
    - come
    - dont come
    - place lose
    - buy
    - lay
