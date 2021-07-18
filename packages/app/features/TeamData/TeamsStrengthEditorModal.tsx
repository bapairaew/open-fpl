import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";
import TeamStrengthEditor from "@open-fpl/app/features/TeamData/TeamStrengthEditor";

const TeamsStrengthEditorModal = ({
  fplTeams,
  isOpen,
  onClose,
  onStrengthChange,
  onResetStrength,
}: {
  fplTeams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onStrengthChange?: (
    teamId: number,
    key: keyof TeamStrength,
    value: number
  ) => void;
  onResetStrength?: (teamId: number) => void;
}) => {
  return (
    <Drawer size="lg" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Teams Strength</DrawerHeader>
        <DrawerBody>
          <VStack>
            {fplTeams.map((team) => (
              <TeamStrengthEditor
                key={team.id}
                team={team}
                onStrengthChange={(name, value) =>
                  onStrengthChange?.(team.id, name, value)
                }
                onResetClick={() => onResetStrength?.(team.id)}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TeamsStrengthEditorModal;
