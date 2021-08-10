# [Open FPL](https://www.openfpl.com/)

Open FPL is a open-source web application that consists of various tools for
[Fantasy Premier League](https://fantasy.premierleague.com/). It aims to
complement the game experience and bring out the best from the team manager by
providing statistics, data visualisation and other utility tools.

## Overview

- `app/*`: Application code
- `data/*`: Data files and its generation scripts for that application
- `common/*`: Shared code accross the applications
- `www/*`: Landing page code

## Running Locally

```bash
$ git clone https://github.com/bapairaew/open-fpl.git
$ cd open-fpl
$ npx lerna bootstrap

# Depending on what you have installed globally, you might have to install "yarn" and/or "ts-node" for the steps below
$ yarn data:init # This will take ~6+ min to download and setup remote test data
$ yarn data:dev # On one terminal
$ yarn app:dev # On another terminal
```

## Stack

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Chakra UI](https://chakra-ui.com/)

## Data

The project relies on static data from
[Fantasy Premier League](https://fantasy.premierleague.com/) and
[Understat](https://understat.com/). There is a script to pull the data from the
those sources in this project. By default, the script will get the data one page
at a time to avoid too much workload on those sources. So please be mindful with
the set up if you are going to use it.
