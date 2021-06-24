# Description
Craps game that can be installed directly and played as a command line game or imported
as a 3rd party module which can be played with multiple players such as in a discord server

# Usage
## CLI
Use this mode if you just want to play a quick, single-player game of craps from the command line.

First time install:

```
npm install -g .
````

To start game run:

```
craps
````

You should be met with the message:

```
player connected to craps table...
>
```

The text interface below describes how to control the game

## Import
Use this mode if you want to integrate the craps game into another application to play single/multi-player

```
  const craps = require('craps').asyncInterface;

  craps(<player>, <cmd>, <messageFn>);
```

Where:
- \<player\>       is the name of a player
- \<cmd\>          is a command from the text interface below
- \<messageFn\>    is the function you want the game to call to send output to the client

## Discord bot
Use this if you want to use this library as a pre-made, multi-player discord bot

https://github.com/akomar812/discord-craps

# Text Interface
* Start game or join current game by running: `join`
* There must be at least one bet on the table before the shooter can roll
* If a player or shooter is inactive for 1 minute they will be booted

## Commands

### exit
Leaves game if joined, and all wagers are wiped away. The player's pot will be preserved until the process
is restarted

### help
Show text interface documentation in interface display

### dice
Show possible dice rolls, chance of occurring and ways of occurring

### join
Joins an active craps game or starts one if none is available

### bet [name] [amount]
Submit a wager against a bet

### roll
Roll the dice if you are the shooter. At least one wager must be submitted before the shooter can roll

### reset cash
Adds $100 to the caller's pot if they've fallen below $100

# TODO
  - Some bets still need to be implemented:
    - come
    - dont come
    - place lose
    - buy
    - lay
    - free odds

  - automated strategy support
