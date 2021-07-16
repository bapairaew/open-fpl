# [Open FPL](https://www.openfpl.com/)

Open FPL is a open-source web application that consists of various tools for
[Fantasy Premier League](https://fantasy.premierleague.com/). It aims to
complement the game experience and bring out the best from the team manager by
providing statistics, data visualisation and other utility tools.

## Overview

- `pages/*` - Application pages and
  [API routes](https://nextjs.org/docs/api-routes/introduction).
- `features/*` - Main application code segregated by each features.

## Running Locally

```bash
$ git clone https://github.com/bapairaew/open-fpl.git
$ cd open-fpl
$ yarn
$ yarn prebuild
$ yarn dev
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
