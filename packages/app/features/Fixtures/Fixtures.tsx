import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { AnalyticsFixtureDifficultyRating } from "@open-fpl/app/features/Analytics/analyticsTypes";
import {
  adjustTeamsStrength,
  makeFullFixtures,
} from "@open-fpl/app/features/Fixtures/fixturesData";
import FixturesTable from "@open-fpl/app/features/Fixtures/FixturesTable";
import FixturesToolbar from "@open-fpl/app/features/Fixtures/FixturesToolbar";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { usePlausible } from "next-plausible";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const TeamsStrengthEditorModal = dynamic(
  () => import("@open-fpl/app/features/TeamData/TeamsStrengthEditorModal")
);

const Fixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}) => {
  const plausible = usePlausible<AnalyticsFixtureDifficultyRating>();
  const {
    fixturesTeamsOrder,
    setFixturesTeamsOrder,
    teamsStrength,
    setTeamsStrength,
  } = useSettings();

  const adjustedTeams = useMemo(
    () => adjustTeamsStrength(fplTeams, teamsStrength),
    [fplTeams, teamsStrength]
  );

  const fullFixtures = useMemo(() => {
    const fullFixtures = makeFullFixtures({
      teamFixtures,
      fplTeams: adjustedTeams,
    });

    return fixturesTeamsOrder
      ? fixturesTeamsOrder.map((o) => {
          return fullFixtures.find((f) => f.short_name === o)!;
        })
      : fullFixtures;
  }, [teamFixtures, fplTeams, teamsStrength, fixturesTeamsOrder]);

  const [mode, setMode] = useState("attack");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleStrengthChange = (
    profile: number,
    key: keyof TeamStrength,
    value: number
  ) => {
    if (teamsStrength) {
      const matched = teamsStrength.find((t) => t.id === profile);
      if (matched) {
        setTeamsStrength([
          ...teamsStrength.filter((t) => t.id !== profile),
          { ...matched, [key]: value },
        ]);
      } else {
        setTeamsStrength([...teamsStrength, { id: profile, [key]: value }]);
      }
      plausible("fixtures-adjust-team-strengths");
    }
  };

  const handleResetStrength = (profile: number) => {
    if (teamsStrength) {
      setTeamsStrength([...teamsStrength.filter((t) => t.id !== profile)]);
    }
  };

  const handleModeChange = (mode: string) => {
    setMode(mode);
    plausible("fixtures-mode-change", { props: { mode } });
  };

  return (
    <>
      {isOpen && (
        <TeamsStrengthEditorModal
          fplTeams={adjustedTeams}
          onStrengthChange={handleStrengthChange}
          onResetStrength={handleResetStrength}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      <Flex flexDirection="column" height="100%">
        <FixturesToolbar
          mode={mode}
          onModeChange={handleModeChange}
          onEditTeamsStrengthClick={onOpen}
        />
        <Box flexGrow={1}>
          <FixturesTable
            mode={mode}
            fullFixtures={fullFixtures}
            onFixturesOrderChange={setFixturesTeamsOrder}
          />
        </Box>
      </Flex>
    </>
  );
};

export default Fixtures;
