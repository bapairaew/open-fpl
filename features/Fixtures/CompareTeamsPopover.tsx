import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Progress,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { TeamInfo } from "~/features/Fixtures/fixturesDataTypes";

const getPercent = (strength: number): number => (100 * (strength - 900)) / 500;

const CompareTeamsPopover = ({
  mode,
  isHome,
  team,
  opponent,
  children,
}: {
  mode: string;
  isHome: boolean;
  team: TeamInfo;
  opponent: TeamInfo;
  children: ReactNode | string;
}) => {
  const teamStrength =
    mode === "attack"
      ? isHome
        ? team.strength_attack_home
        : team.strength_attack_away
      : isHome
      ? team.strength_defence_home
      : team.strength_defence_away;
  const opponentStrength =
    mode === "attack"
      ? isHome
        ? opponent.strength_defence_away
        : opponent.strength_defence_home
      : isHome
      ? opponent.strength_attack_away
      : opponent.strength_attack_home;
  return (
    <Popover strategy="fixed" isLazy placement="bottom">
      <PopoverTrigger>
        <Box
          p={2}
          role="button"
          // textDecorationLine="underline"
          // textDecorationStyle="dotted"
          // textUnderlineOffset="3px"
        >
          {children}
        </Box>
      </PopoverTrigger>
      <Portal>
        <Box zIndex="popover" position="fixed">
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="black">
              {isHome ? (
                <HStack spacing={1}>
                  <Text textDecoration="underline">{team.short_name}</Text>
                  <Text>vs</Text>
                  <Text>{opponent.short_name}</Text>
                </HStack>
              ) : (
                <HStack spacing={1}>
                  <Text>{opponent.short_name}</Text>
                  <Text>vs</Text>
                  <Text textDecoration="underline">{team.short_name}</Text>
                </HStack>
              )}
            </PopoverHeader>
            <PopoverBody>
              <Box>
                <Flex my={2} fontSize="small" color="gray.600">
                  <Text flexGrow={1}>
                    {team.short_name} {isHome ? "Home" : "Away"}{" "}
                    {mode === "attack" ? "Attack" : "Defence"} Strength:{" "}
                  </Text>
                  <Text>{teamStrength.toLocaleString()}</Text>
                </Flex>
                <Progress value={getPercent(teamStrength)} />
              </Box>
              <Box my={4}>
                <Flex my={2} fontSize="small" color="gray.600">
                  <Text flexGrow={1}>
                    {opponent.short_name} {isHome ? "Away" : "Home"}{" "}
                    {mode === "attack" ? "Defence" : "Attack"} Strength:{" "}
                  </Text>
                  <Text>{opponentStrength.toLocaleString()}</Text>
                </Flex>
                <Progress value={getPercent(opponentStrength)} />
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  );
};

export default CompareTeamsPopover;
