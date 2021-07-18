import {
  Box,
  Flex,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { IoShield } from "react-icons/io5";
import { RiSwordFill } from "react-icons/ri";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";
import { assumedMax, assumedMin } from "~/features/TeamData/teamData";
import { TeamStrength } from "~/features/TeamData/teamDataTypes";
import { MouseEvent, useEffect, useState } from "react";

const TeamStrengthEditor = ({
  team,
  onStrengthChange,
  onResetClick,
}: {
  team: Team;
  onStrengthChange?: (name: keyof TeamStrength, value: number) => void;
  onResetClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const [homeAttack, setHomeAttack] = useState(team.strength_attack_home);
  const [homeDefence, setHomeDefence] = useState(team.strength_defence_home);
  const [awayAttack, setAwayAttack] = useState(team.strength_attack_away);
  const [awayDefence, setAwayDefence] = useState(team.strength_defence_away);

  useEffect(
    () => setHomeAttack(team.strength_attack_home),
    [team.strength_attack_home]
  );
  useEffect(
    () => setHomeDefence(team.strength_defence_home),
    [team.strength_defence_home]
  );
  useEffect(
    () => setAwayAttack(team.strength_attack_away),
    [team.strength_attack_away]
  );
  useEffect(
    () => setAwayDefence(team.strength_defence_away),
    [team.strength_defence_away]
  );

  return (
    <Box width="100%" borderWidth={1} px={4} borderRadius="md">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading my={4} size="sm">
          {team.name}
        </Heading>
        <Button size="sm" variant="ghost" onClick={onResetClick}>
          Reset
        </Button>
      </Flex>
      <HStack spacing={6}>
        <VStack width="50%" spacing={4}>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <Text fontSize="sm">Home Attack Strength</Text>
              <Text fontSize="sm">{homeAttack.toLocaleString()}</Text>
            </Flex>
            <Slider
              focusThumbOnChange={false}
              step={10}
              min={assumedMin.teamStrength}
              max={assumedMax.teamStrength}
              aria-label="Home Attack Strength"
              value={homeAttack}
              onChange={setHomeAttack}
              onChangeEnd={(value) =>
                onStrengthChange?.("strength_attack_home", value)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="brand.500" as={RiSwordFill} />
              </SliderThumb>
            </Slider>
          </Box>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <Text fontSize="sm">Home Defence Strength</Text>
              <Text fontSize="sm">{homeDefence.toLocaleString()}</Text>
            </Flex>
            <Slider
              focusThumbOnChange={false}
              step={10}
              min={assumedMin.teamStrength}
              max={assumedMax.teamStrength}
              aria-label="Home Defence Strength"
              value={homeDefence}
              onChange={setHomeDefence}
              onChangeEnd={(value) =>
                onStrengthChange?.("strength_defence_home", value)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="brand.500" as={IoShield} />
              </SliderThumb>
            </Slider>
          </Box>
        </VStack>
        <VStack width="50%" spacing={4}>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <Text fontSize="sm">Away Attack Strength</Text>
              <Text fontSize="sm">{awayAttack.toLocaleString()}</Text>
            </Flex>
            <Slider
              focusThumbOnChange={false}
              step={10}
              min={assumedMin.teamStrength}
              max={assumedMax.teamStrength}
              aria-label="Away Attack Strength"
              value={awayAttack}
              onChange={setAwayAttack}
              onChangeEnd={(value) =>
                onStrengthChange?.("strength_attack_away", value)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="brand.500" as={RiSwordFill} />
              </SliderThumb>
            </Slider>
          </Box>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <Text fontSize="sm">Away Defence Strength</Text>
              <Text fontSize="sm">{awayDefence.toLocaleString()}</Text>
            </Flex>
            <Slider
              focusThumbOnChange={false}
              step={10}
              min={assumedMin.teamStrength}
              max={assumedMax.teamStrength}
              aria-label="Away Defence Strength"
              value={awayDefence}
              onChange={setAwayDefence}
              onChangeEnd={(value) =>
                onStrengthChange?.("strength_defence_away", value)
              }
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="brand.500" as={IoShield} />
              </SliderThumb>
            </Slider>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default TeamStrengthEditor;
