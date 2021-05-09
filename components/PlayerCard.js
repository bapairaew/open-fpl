import { Box, Card, Flex, Grid } from "@theme-ui/components";
import React from "react";

const positionColorCodes = {
  FWD: {
    background: "rgb(233, 0, 82)",
    text: "white",
  },
  MID: {
    background: "rgb(5, 240, 255)",
    text: "rgb(55, 0, 60)",
  },
  DEF: {
    background: "rgb(0, 255, 135)",
    text: "rgb(55, 0, 60)",
  },
  GKP: {
    background: "rgb(235, 255, 0)",
    text: "rgb(55, 0, 60)",
  },
};

const difficultyColorCodes = {
  1: {
    background: "rgb(1, 252, 122)",
    text: "white",
  },
  2: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  3: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  4: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
  5: {
    background: "rgb(128, 7, 45)",
    text: "white",
  },
};

const CenterFlex = ({ sx, ...props }) => (
  <Flex
    sx={{ justifyContent: "center", alignItems: "center", ...sx }}
    p={2}
    {...props}
  />
);

const PlayerCard = ({ player, gameweeks }) => {
  return (
    <Card
      variant="bare"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Flex>
        <CenterFlex
          sx={{
            backgroundColor: player.team.color_codes.text
              ? player.team.color_codes.background
              : player.team.color_codes.highlight,
            color: player.team.color_codes.text
              ? player.team.color_codes.text
              : player.team.color_codes.background,
          }}
        >
          {player.team.short_name}
        </CenterFlex>
        <Box sx={{ flexGrow: 1, fontWeight: "bold", fontSize: 3 }} p={2}>
          {player.web_name}
        </Box>
        <CenterFlex
          sx={{
            backgroundColor:
              positionColorCodes[player.element_type.singular_name_short]
                .background,
            color:
              positionColorCodes[player.element_type.singular_name_short].text,
          }}
        >
          {player.element_type.singular_name_short}
        </CenterFlex>
        <CenterFlex sx={{ minWidth: 50, fontWeight: "bold" }}>
          £{(player.now_cost / 10).toFixed(1)}
        </CenterFlex>
      </Flex>
      <Grid gap={0} columns={[5]} sx={{ flexGrow: 1 }}>
        {gameweeks.map((w) => {
          const games = player.next_gameweeks.filter((n) => n.event === w.id);
          return (
            <Grid key={w.id} gap={0} rows={games.map(() => "1fr").join(" ")}>
              {games.length === 0 ? (
                <CenterFlex
                  sx={{
                    backgroundColor: "text",
                    color: "background",
                  }}
                >
                  -
                </CenterFlex>
              ) : (
                games.map((g, i) => (
                  <CenterFlex
                    key={i}
                    py={games.length > 1 ? 0 : 2}
                    sx={{
                      fontSize: games.length > 1 ? 1 : 2,
                      backgroundColor:
                        difficultyColorCodes[g.difficulty].background,
                      color: difficultyColorCodes[g.difficulty].text,
                    }}
                  >
                    {g.opponent[g.is_home ? "toUpperCase" : "toLowerCase"]()}
                  </CenterFlex>
                ))
              )}
            </Grid>
          );
        })}
      </Grid>
      <Grid gap={0} columns={[6]}>
        {player.previous_gameweeks.map((h, i) => (
          <CenterFlex
            key={i}
            p={0.5}
            sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
          >
            {h.opponent_team_short_name[
              h.was_home ? "toUpperCase" : "toLowerCase"
            ]()}
          </CenterFlex>
        ))}
        <CenterFlex
          p={0.5}
          sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
        >
          Σ
        </CenterFlex>
      </Grid>
      <Grid gap={0} columns={[6]}>
        {player.previous_gameweeks.map((h, i) => (
          <CenterFlex
            key={i}
            sx={{ backgroundColor: `rgba(0, 255, 0, ${h.bps * 2}%)` }}
          >
            {h.total_points}
          </CenterFlex>
        ))}
        <CenterFlex
          sx={{
            fontWeight: "bold",
            backgroundColor: "muted",
          }}
        >
          {player.total_points}
        </CenterFlex>
      </Grid>
      {player.stats ? (
        <>
          <Grid gap={0} columns={[6]}>
            {player.stats.matches.map((s, i) => (
              <CenterFlex
                key={i}
                p={0.5}
                sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
              >
                {(s.opponent_short_title || "N/A")[
                  s.is_home ? "toUpperCase" : "toLowerCase"
                ]()}
              </CenterFlex>
            ))}
            <CenterFlex
              p={0.5}
              sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
            >
              x̅
            </CenterFlex>
          </Grid>
          <Grid gap={0} columns={[6]}>
            {player.stats.matches.map((s, i) => (
              <CenterFlex
                key={i}
                p={1}
                sx={{
                  fontSize: 1,
                  backgroundColor: s.match_xgi_per_90
                    ? `rgba(0, 255, 0, ${Math.min(
                        100,
                        (+(s.match_xgi_per_90 || 0) * 100) / 2
                      )}%)`
                    : "",
                }}
              >
                {+(s.match_xgi_per_90 || 0).toFixed?.(2)}
              </CenterFlex>
            ))}
            <CenterFlex
              p={1}
              sx={{
                fontSize: 1,
                fontWeight: "bold",
                backgroundColor: "muted",
              }}
            >
              {+(player.stats?.season_xgi_per_90 || 0).toFixed?.(2)}
            </CenterFlex>
          </Grid>
          <Grid gap={0} columns={[6]}>
            {player.stats.matches.map((s, i) => (
              <CenterFlex
                key={i}
                p={1}
                sx={{
                  fontSize: 1,
                  backgroundColor: s.match_xga_per_90
                    ? `rgba(0, 255, 0, ${Math.min(
                        100,
                        (1 - +(s.match_xga_per_90 || 0)) * 100
                      )}%)`
                    : "",
                }}
              >
                {+(s.match_xga_per_90 || 0).toFixed?.(2)}
              </CenterFlex>
            ))}
            <CenterFlex
              p={1}
              sx={{
                fontSize: 1,
                fontWeight: "bold",
                backgroundColor: "muted",
              }}
            >
              {+(player.stats?.season_xga_per_90 || 0).toFixed?.(2)}
            </CenterFlex>
          </Grid>
        </>
      ) : (
        <Flex
          sx={{ height: 100, justifyContent: "center", alignItems: "center" }}
        >
          No stats available
        </Flex>
      )}
    </Card>
  );
};

export default PlayerCard;
