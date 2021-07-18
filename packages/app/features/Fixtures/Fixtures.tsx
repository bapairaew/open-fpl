import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { makeFullFixtures } from "@open-fpl/app/features/Fixtures/fixturesData";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import FixturesTable from "@open-fpl/app/features/Fixtures/FixturesTable";
import FixturesToolbar from "@open-fpl/app/features/Fixtures/FixturesToolbar";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { useSettings } from "@open-fpl/app/features/Settings/SettingsContext";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";
import TeamsStrengthEditorModal from "@open-fpl/app/features/TeamData/TeamsStrengthEditorModal";

const Fixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}) => {
  const {
    fixturesTeamsOrder,
    setFixturesTeamsOrder,
    teamsStrength,
    setTeamsStrength,
  } = useSettings();

  const adjustedTeams = useMemo(() => {
    if (teamsStrength && teamsStrength.length > 0) {
      return fplTeams.map((team) => {
        const matched = teamsStrength.find((t) => t.id === team.id);
        if (matched) {
          return {
            ...team,
            ...matched,
          };
        } else {
          return team;
        }
      });
    } else {
      return fplTeams;
    }
  }, [fplTeams, teamsStrength]);

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
  }, [teamFixtures, adjustedTeams, fixturesTeamsOrder]);

  const [mode, setMode] = useState("attack");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleStrengthChange = (
    teamId: number,
    key: keyof TeamStrength,
    value: number
  ) => {
    if (teamsStrength) {
      const matched = teamsStrength.find((t) => t.id === teamId);
      if (matched) {
        setTeamsStrength([
          ...teamsStrength.filter((t) => t.id !== teamId),
          { ...matched, [key]: value },
        ]);
      } else {
        setTeamsStrength([...teamsStrength, { id: teamId, [key]: value }]);
      }
    }
  };

  const handleResetStrength = (teamId: number) => {
    if (teamsStrength) {
      setTeamsStrength([...teamsStrength.filter((t) => t.id !== teamId)]);
    }
  };

  return (
    <>
      <TeamsStrengthEditorModal
        fplTeams={adjustedTeams}
        onStrengthChange={handleStrengthChange}
        onResetStrength={handleResetStrength}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex flexDirection="column" height="100%">
        <FixturesToolbar
          mode={mode}
          onModeChange={setMode}
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
