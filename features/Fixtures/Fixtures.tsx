import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Team } from "~/features/AppData/fplTypes";
import { makeFullFixtures } from "~/features/Fixtures/fixturesData";
import { TeamFixtures } from "~/features/Fixtures/fixturesDataTypes";
import FixturesTable from "~/features/Fixtures/FixturesTable";
import FixturesToolbar from "~/features/Fixtures/FixturesToolbar";

const Fixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}) => {
  const fullFixtures = useMemo(() => {
    return makeFullFixtures({ teamFixtures, fplTeams });
  }, [teamFixtures, fplTeams]);

  const [mode, setMode] = useState("attack");

  return (
    <Box overflow="hidden" height="100%">
      <FixturesToolbar mode={mode} onModeChange={setMode} />
      <FixturesTable mode={mode} fullFixtures={fullFixtures} />
    </Box>
  );
};

export default Fixtures;
