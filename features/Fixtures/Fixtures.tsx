import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Team } from "~/features/AppData/fplTypes";
import { makeFullFixtures } from "~/features/Fixtures/fixturesData";
import { TeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import FixturesTable from "~/features/Fixtures/FixturesTable";
import FixturesToolbar from "~/features/Fixtures/FixturesToolbar";
import { useSettings } from "~/features/Settings/SettingsContext";

const Fixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}) => {
  const { fixturesTeamsOrder, setFixturesTeamsOrder } = useSettings();

  const fullFixtures = useMemo(() => {
    const fullFixtures = makeFullFixtures({ teamFixtures, fplTeams });

    return fixturesTeamsOrder
      ? fixturesTeamsOrder.map((o) => {
          return fullFixtures.find((f) => f.short_name === o)!;
        })
      : fullFixtures;
  }, [teamFixtures, fplTeams, fixturesTeamsOrder]);

  const [mode, setMode] = useState("attack");

  return (
    <Box overflow="hidden" height="100%">
      <FixturesToolbar mode={mode} onModeChange={setMode} />
      <FixturesTable
        mode={mode}
        fullFixtures={fullFixtures}
        onFixturesOrderChange={setFixturesTeamsOrder}
      />
    </Box>
  );
};

export default Fixtures;
