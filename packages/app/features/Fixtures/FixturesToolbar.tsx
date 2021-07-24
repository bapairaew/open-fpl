import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { IoSettingsOutline } from "react-icons/io5";

const FixturesToolbar = ({
  mode,
  onModeChange,
  onEditTeamsStrengthClick,
}: {
  mode: string;
  onModeChange: (mode: string) => void;
  onEditTeamsStrengthClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <Flex justifyContent="space-between" borderBottomWidth={1}>
      <HStack alignItems="center" height="50px" spacing={0}>
        <Heading pl={6} pr={4} fontWeight="black" fontSize="lg">
          Fixture Difficulty Rating
        </Heading>
        <Divider orientation="vertical" />
        <RadioGroup px={4} value={mode} onChange={onModeChange}>
          <HStack spacing={5}>
            <Radio value="attack">Attack</Radio>
            <Radio value="defence">Defence</Radio>
          </HStack>
        </RadioGroup>
        <Divider orientation="vertical" />
      </HStack>
      <Flex>
        <Divider orientation="vertical" />
        <Box p="2px" mr="2px">
          <Button
            size="sm"
            height="100%"
            variant="ghost"
            borderRadius="none"
            leftIcon={<Icon as={IoSettingsOutline} />}
            onClick={onEditTeamsStrengthClick}
          >
            Edit Teams Strength
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default FixturesToolbar;
