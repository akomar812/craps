![Build](https://github.com/akomar812/craps/actions/workflows/npm-publish.yml/badge.svg)

# Contents

1. [Description](#Description)
1. [System Requirements](#System-Requirements)
1. [Installation](#Installation)
1. [Usage](#Usage)
1. [Game](#Game)

# Description
Craps game that can be installed directly and played as a command line game or imported
as a 3rd party module which can be played with multiple players such as in a discord server

# System Requirements
```
node.js (+12.0.0)
sqlite3
```

# Installation
There are several ways to install and use this module depending on how you plan to use it.
Pick one of the following methods based on your needs
---

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
  const game = await require('@akomar812/craps')(<opts>);
  let craps;

  craps = await game(<player>, <cmd>, <messageFn>);

  // e.g workflow: join, withdraw money, bet it on the pass line, and roll the dice
  craps = await game('player', 'join', console.log);
  craps = await game('player', 'bank withdraw 100', console.log);
  craps = await game('player', 'bet pass 100', console.log);
  craps = await game('player', 'roll', console.log);
```

Where:
- \<player\>       is the name of a player
- \<cmd\>          is a command from the api below
- \<messageFn\>    is the function you want the game to call to send output to the client
- \<opts\>         has the following configuration options:
```
  {
    dbTarget: <string (default: ":memory:")>
    // path for sqlite data file if storing data on disk
    // e.g. "var/data/db"

    dbLogStream: <object (default: process.stdout)>
    // object who's `write` method get's called when DB creates logs
    // e.g require("fs").createReadStream(`var/log/db.${someNameFunc()}.log`, { flags: 'a' });

    prefix: <string (default: "")>
    // prefix string in front of all cmds
    // e.g. "!" requires all cmds to be run with !, for example !roll
  }
```

## Discord bot
Use this if you want to use this library as a pre-made, multi-player discord bot

https://github.com/akomar812/discord-craps

# Game
* Start game or join current game by running: `join`
* There must be at least one bet on the table before the shooter can roll
* If a player or shooter is inactive for 5 minutes they will be booted
* New and returning players need to fetch their money from the bank in order for it to be available
  for wagering on the table. Players can take their winnings off of the table and store in the bank
  at any time. Any money on the table will automatically be banked when the player exits

## Commands

```
exit
# Leaves game if joined, and all wagers are wiped away. The
# player's pot is automatically deposited in the bank on exit
```

```
help
# Show text interface documentation in interface display
```

```
dice
# Show possible dice rolls, chance of occurring and ways of
# occurring
```

```
status
# Shows the current state of the game
```

```
join
# Joins an active craps game or starts one if none is available
```

```
bet [name] [amount]
# Submit a wager against a bet
```

```
roll
# Roll the dice if you are the shooter. At least one wager must be
# submitted before the shooter can roll
```

```
reset cash
# Adds $100 to the caller's pot if they've fallen below $100
```

```
bank
# Displays information about the money in the bank including user
# balances and high scores
```

```
bank [action] [amount]
# Actions are `withdraw`/`deposit`. The bank is used to add/remove
# money from the table to be stored in user's personal bot.
```

# TODO
  - Bets that still need to be implemented:
    - come
    - dont come
    - buy
    - lay
