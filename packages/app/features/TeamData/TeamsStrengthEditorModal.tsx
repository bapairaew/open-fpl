import {
  Box,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { TeamStrength } from "@open-fpl/app/features/TeamData/teamDataTypes";
import TeamStrengthEditor from "@open-fpl/app/features/TeamData/TeamStrengthEditor";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";

const TeamsStrengthEditorModal = ({
  teams,
  useCustomFDR,
  isOpen,
  onClose,
  onUseCustomFDRChange,
  onStrengthChange,
  onResetStrength,
}: {
  teams: Team[];
  useCustomFDR: boolean;
  isOpen: boolean;
  onClose: () => void;
  onUseCustomFDRChange: (value: boolean) => void;
  onStrengthChange?: (
    teamId: number,
    key: keyof TeamStrength,
    value: number
  ) => void;
  onResetStrength?: (teamId: number) => void;
}) => {
  const teamStrengthEditorEnabled = !!useCustomFDR;
  return (
    <Drawer size="lg" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Teams Strength</DrawerHeader>
        <DrawerBody>
          <VStack>
            <Box borderWidth={1} p={4} borderRadius="md" width="100%">
              <Checkbox
                borderWidth={0}
                isChecked={!!useCustomFDR}
                onChange={(e) => onUseCustomFDRChange(e.target.checked)}
                data-testid="use-custom-fdr-checkbox"
              >
                Use Custom FDR
              </Checkbox>
            </Box>
            <VStack
              width="100%"
              opacity={teamStrengthEditorEnabled ? 1 : 0.5}
              pointerEvents={teamStrengthEditorEnabled ? "all" : "none"}
            >
              {teams.map((team) => (
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
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TeamsStrengthEditorModal;
