import { Box, Card, Flex, Grid, Text } from "@theme-ui/components";
import { IoIosWarning } from "react-icons/io";
import { nFormatter } from "~/libs/numbers";
import { isNullOrUndefined } from "~/libs/datatype";

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
    text: "black",
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

const statusColorCodes = {
  a: "background", // Available
  d: "warning", // Injured but have chance to play
  i: "danger", // Injured
  n: "danger", // Ineligible to play (e.g. with parent club)
  s: "danger", // Suspended
};

const deltaColorCodes = {
  positive: {
    background: "rgb(1, 252, 122)",
    text: "black",
  },
  zero: {
    background: "rgb(231, 231, 231)",
    text: "black",
  },
  negative: {
    background: "rgb(255, 23, 81)",
    text: "white",
  },
};

const CenterFlex = ({ sx, ...props }) => (
  <Flex
    sx={{ justifyContent: "center", alignItems: "center", ...sx }}
    py={1}
    px={2}
    {...props}
  />
);

const createEmptyMatch = (length) => {
  return Array.from({ length }).fill({
    opponent_short_title: null,
    match_xga: null,
    match_xgi: null,
  });
};

const createEmptyGameweek = (length) => {
  return Array.from({ length }).fill({
    opponent_team_short_name: "",
    was_home: true,
    total_points: 0,
  });
};

const PlayerCard = ({ player, nextGameweeks }) => {
  const matches = player.stats?.matches
    ? player.stats?.matches?.length < 5
      ? [
          ...createEmptyMatch(5 - player.stats.matches.length),
          ...player.stats.matches,
        ]
      : player.stats.matches
    : [];

  const previousGameweeks =
    player.previous_gameweeks?.length < 5
      ? [
          ...createEmptyGameweek(5 - player.previous_gameweeks.length),
          ...player.previous_gameweeks,
        ]
      : player.previous_gameweeks;

  console.log(player)

  return (
    <Card
      as="a"
      href={
        player.stats
          ? `https://understat.com/player/${player.stats.id}`
          : `https://understat.com/league/EPL`
      }
      target="_blank"
      rel="noreferrer noopener"
      variant="bare"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textDecoration: "inherit",
        color: "inherit",
        height: "auto",
      }}
    >
      <Flex>
        <Flex sx={{ flexDirection: "column" }}>
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
          <CenterFlex
            sx={{
              backgroundColor:
                positionColorCodes[player.element_type.singular_name_short]
                  .background,
              color:
                positionColorCodes[player.element_type.singular_name_short]
                  .text,
            }}
          >
            {player.element_type.singular_name_short}
          </CenterFlex>
        </Flex>
        {player.status !== "a" && (
          <CenterFlex
            sx={{
              backgroundColor: statusColorCodes[player.status],
            }}
            title={player.news}
          >
            <IoIosWarning />
          </CenterFlex>
        )}
        <Flex px={2} py={1} sx={{ flexDirection: "column", flexGrow: 1 }}>
          <Text
            sx={{
              fontWeight: "display",
              fontSize: 3,
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {player.web_name}
          </Text>
          <Text variant="subtitle">ID: {player.id}</Text>
        </Flex>
        <Flex sx={{ flexDirection: "column" }}>
          <CenterFlex
            sx={{ fontWeight: "bold", backgroundColor: "muted", flexGrow: 1 }}
          >
            £{(player.now_cost / 10).toFixed(1)}
          </CenterFlex>
          <CenterFlex
            sx={{
              backgroundColor:
                player.transfers_delta_event === 0
                  ? deltaColorCodes.zero.background
                  : player.transfers_delta_event > 0
                  ? deltaColorCodes.positive.background
                  : deltaColorCodes.negative.background,
              color:
                player.transfers_delta_event === 0
                  ? deltaColorCodes.zero.text
                  : player.transfers_delta_event > 0
                  ? deltaColorCodes.positive.text
                  : deltaColorCodes.negative.text,
            }}
          >
            <Text
              variant="subtitle"
              sx={{
                color: "inherit",
              }}
            >
              {nFormatter(player.transfers_delta_event, 1)}
            </Text>
          </CenterFlex>
        </Flex>
      </Flex>
      <Grid gap={0} columns={[5]} sx={{ height: 45 }}>
        {nextGameweeks.map((w) => {
          const games = player.next_gameweeks.filter((n) => n.event === w.id);
          return (
            <Flex key={w.id} sx={{ flexDirection: "column" }}>
              {games.length === 0 ? (
                <CenterFlex
                  sx={{
                    backgroundColor: "text",
                    color: "background",
                    height: "100%",
                  }}
                >
                  -
                </CenterFlex>
              ) : (
                games.map((g, i) => (
                  <CenterFlex
                    key={i}
                    sx={{
                      height: 45 / games.length,
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
            </Flex>
          );
        })}
      </Grid>
      <Grid gap={0} columns={[6]}>
        {previousGameweeks.map((h, i) => (
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
        {previousGameweeks.map((h, i) => (
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
      <Box sx={{ height: 80 }}>
        {player.stats ? (
          <>
            <Grid gap={0} columns={[6]}>
              {matches.map((s, i) => (
                <CenterFlex
                  key={i}
                  p={0.5}
                  sx={{
                    fontSize: 1,
                    color: "gray",
                    backgroundColor: "muted",
                  }}
                >
                  {(s.opponent_short_title || "")[
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
              {matches.map((s, i) => (
                <CenterFlex
                  key={i}
                  p={1}
                  sx={{
                    fontSize: 1,
                    backgroundColor: s.match_xgi
                      ? `rgba(0, 255, 0, ${Math.min(
                          100,
                          (+(s.match_xgi || 0) * 100) / 2
                        )}%)`
                      : "",
                  }}
                >
                  {!isNullOrUndefined(s.match_xgi)
                    ? (+s.match_xgi).toFixed?.(2)
                    : ""}
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
                {!isNullOrUndefined(player.stats?.season_xgi)
                  ? (+player.stats?.season_xgi).toFixed?.(2)
                  : "N/A"}
              </CenterFlex>
            </Grid>
            <Grid gap={0} columns={[6]}>
              {matches.map((s, i) => (
                <CenterFlex
                  key={i}
                  p={1}
                  sx={{
                    fontSize: 1,
                    backgroundColor: s.match_xga
                      ? `rgba(0, 255, 0, ${Math.min(
                          100,
                          (1 - +(s.match_xga || 0)) * 100
                        )}%)`
                      : "",
                  }}
                >
                  {!isNullOrUndefined(s.match_xga)
                    ? (+s.match_xga).toFixed?.(2)
                    : ""}
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
                {!isNullOrUndefined(player.stats?.season_xga)
                  ? +(player.stats?.season_xga).toFixed?.(2)
                  : "N/A"}
              </CenterFlex>
            </Grid>
          </>
        ) : (
          <Flex
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No stats available
          </Flex>
        )}
      </Box>
    </Card>
  );
};

export default PlayerCard;
