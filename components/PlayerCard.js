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

const CenterFlex = ({ mini, sx, ...props }) => {
  const py = mini ? 0.5 : 1;
  const px = mini ? 1 : 2;
  return (
    <Flex
      sx={{ justifyContent: "center", alignItems: "center", ...sx }}
      px={px}
      py={py}
      {...props}
    />
  );
};

const makeEmptyMatch = (length) => {
  return Array.from({ length }).fill({
    opponent_short_title: null,
    match_xga: null,
    match_xgi: null,
  });
};

const makeEmptyGameweek = (length) => {
  return Array.from({ length }).fill({
    opponent_team_short_name: "",
    was_home: true,
    total_points: 0,
  });
};

const NameSection = ({ mini, player }) => {
  const nameFontSize = mini ? 2 : 3;
  const defaultFontSize = mini ? 1 : 2;
  const showId = mini ? false : true;
  return (
    <Flex sx={{ fontSize: defaultFontSize }}>
      <Flex sx={{ flexDirection: "column" }}>
        <CenterFlex
          mini={mini}
          sx={{
            backgroundColor: player.linked_data.teamcolorcodes.text
              ? player.linked_data.teamcolorcodes.background
              : player.linked_data.teamcolorcodes.highlight,
            color: player.linked_data.teamcolorcodes.text
              ? player.linked_data.teamcolorcodes.text
              : player.linked_data.teamcolorcodes.background,
          }}
        >
          {player.team.short_name}
        </CenterFlex>
        <CenterFlex
          mini={mini}
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
      </Flex>
      {player.status !== "a" && (
        <CenterFlex
          mini={mini}
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
            fontSize: nameFontSize,
            fontWeight: "display",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {player.web_name}
        </Text>
        {showId && <Text variant="subtitle">ID: {player.id}</Text>}
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        <CenterFlex
          mini={mini}
          sx={{ fontWeight: "bold", backgroundColor: "muted", flexGrow: 1 }}
        >
          £{(player.now_cost / 10).toFixed(1)}
        </CenterFlex>
        <CenterFlex
          mini={mini}
          sx={{
            backgroundColor:
              player.linked_data.transfers_delta_event === 0
                ? deltaColorCodes.zero.background
                : player.linked_data.transfers_delta_event > 0
                ? deltaColorCodes.positive.background
                : deltaColorCodes.negative.background,
            color:
              player.linked_data.transfers_delta_event === 0
                ? deltaColorCodes.zero.text
                : player.linked_data.transfers_delta_event > 0
                ? deltaColorCodes.positive.text
                : deltaColorCodes.negative.text,
          }}
        >
          {nFormatter(player.linked_data.transfers_delta_event, 1)}
        </CenterFlex>
      </Flex>
    </Flex>
  );
};

const FixturesSection = ({ mini, player, gameweeks }) => {
  const height = mini ? 30 : 45;

  return (
    <Grid gap={0} columns={[5]} sx={{ height }}>
      {gameweeks.map((w) => {
        const games = player.linked_data.next_gameweeks.filter(
          (n) => n.event === w.id
        );
        const gameFontSize = mini ? 1 : games.length > 1 ? 1 : 2;
        return (
          <Flex key={w.id} sx={{ flexDirection: "column" }}>
            {games.length === 0 ? (
              <CenterFlex
                mini={mini}
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
                  mini={mini}
                  sx={{
                    height: height / games.length,
                    fontSize: gameFontSize,
                    backgroundColor:
                      difficultyColorCodes[g.difficulty].background,
                    color: difficultyColorCodes[g.difficulty].text,
                  }}
                >
                  {g.opponent_team_short_name[
                    g.is_home ? "toUpperCase" : "toLowerCase"
                  ]()}
                </CenterFlex>
              ))
            )}
          </Flex>
        );
      })}
    </Grid>
  );
};

const PointsSection = ({ mini, player }) => {
  const previousGameweeks =
    player.linked_data.previous_gameweeks?.length < 5
      ? [
          ...makeEmptyGameweek(
            5 - player.linked_data.previous_gameweeks.length
          ),
          ...player.linked_data.previous_gameweeks,
        ]
      : player.linked_data.previous_gameweeks;

  const showTeamsName = mini ? false : true;
  const pointsFontSize = mini ? 1 : 2;

  return (
    <>
      {showTeamsName && (
        <Grid gap={0} columns={[6]}>
          {previousGameweeks.map((h, i) => (
            <CenterFlex
              key={i}
              mini={mini}
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
            mini={mini}
            sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
          >
            Σ
          </CenterFlex>
        </Grid>
      )}
      <Grid gap={0} columns={[6]}>
        {previousGameweeks.map((h, i) => (
          <CenterFlex
            key={i}
            mini={mini}
            sx={{
              fontSize: pointsFontSize,
              backgroundColor: `rgba(0, 255, 0, ${h.bps * 2}%)`,
            }}
          >
            {h.total_points}
          </CenterFlex>
        ))}
        <CenterFlex
          mini={mini}
          sx={{
            fontSize: pointsFontSize,
            fontWeight: "bold",
            backgroundColor: "muted",
          }}
        >
          {player.total_points}
        </CenterFlex>
      </Grid>
    </>
  );
};

const PreviousStatsSection = ({ mini, player }) => {
  const pastMatches = player.linked_data.past_matches
    ? player.linked_data.past_matches.length < 5
      ? [
          ...makeEmptyMatch(5 - player.linked_data.past_matches.length),
          ...player.linked_data.past_matches,
        ]
      : player.linked_data.past_matches
    : [];

  const showTeamsName = mini ? false : true;
  const height = mini ? 58 : 80;
  const decimal = mini ? 1 : 2;

  return (
    <Box sx={{ height }}>
      {pastMatches?.length > 0 ? (
        <Grid gap={0} columns={[6]}>
          {showTeamsName && (
            <>
              {pastMatches.map((s, i) => (
                <CenterFlex
                  mini={mini}
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
                mini={mini}
                p={0.5}
                sx={{ fontSize: 1, color: "gray", backgroundColor: "muted" }}
              >
                x̅
              </CenterFlex>
            </>
          )}
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              mini={mini}
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
                ? (+s.match_xgi).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex
            p={1}
            mini={mini}
            sx={{
              fontSize: 1,
              fontWeight: "bold",
              backgroundColor: "muted",
            }}
          >
            {!isNullOrUndefined(player.linked_data.season_xgi)
              ? (+player.linked_data.season_xgi).toFixed?.(decimal)
              : "N/A"}
          </CenterFlex>
          {pastMatches.map((s, i) => (
            <CenterFlex
              key={i}
              mini={mini}
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
                ? (+s.match_xga).toFixed?.(decimal)
                : ""}
            </CenterFlex>
          ))}
          <CenterFlex
            p={1}
            mini={mini}
            sx={{
              fontSize: 1,
              fontWeight: "bold",
              backgroundColor: "muted",
            }}
          >
            {!isNullOrUndefined(player.linked_data.season_xga)
              ? +player.linked_data.season_xga.toFixed?.(decimal)
              : "N/A"}
          </CenterFlex>
        </Grid>
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
  );
};

const PlayerCard = ({ mini, player, gameweeks }) => {
  return (
    <Card
      variant="bare"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
      }}
    >
      <NameSection mini={mini} player={player} />
      <FixturesSection mini={mini} player={player} gameweeks={gameweeks} />
      <PointsSection mini={mini} player={player} />
      <PreviousStatsSection mini={mini} player={player} />
    </Card>
  );
};

export default PlayerCard;
