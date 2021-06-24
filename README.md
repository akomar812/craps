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

# Text Interface
* Start game or join current game by running: `!join`
* There must be at least one bet on the table before the shooter can roll
* If a player or shooter is inactive for 1 minute they will be booted

```
exit                     leave the table
help                     show this
dice                     show possible dice rolls with expected outputs
join                     join as a new player starting with $100
bet [name] [amount]      make a wager on the craps table
roll                     roll the dice
reset cash               for when the tables turn against you
```

# TODO
  - Some bets still need to be implemented:
    - come
    - dont come
    - place lose
    - buy
    - lay
    - free odds

  - automated strategy support
