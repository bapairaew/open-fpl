import {
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { IoHelpCircleOutline } from "react-icons/io5";
import { difficultyColorCodes } from "~/features/AppData/fplColors";

const HelpButton = () => {
  return (
    <Popover strategy="fixed">
      <PopoverTrigger>
        <IconButton
          aria-label="help"
          variant="ghost"
          icon={<Icon aria-label="help" as={IoHelpCircleOutline} />}
        />
      </PopoverTrigger>
      <Portal>
        <Box zIndex="popover" position="fixed">
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="black">
              About Fixture Difficulty Rating
            </PopoverHeader>
            <PopoverBody>
              <Text mb={4}>
                Fixture Difficulty Rating is calculated by teams' home/away
                attack/defence strength provided by FPL.
              </Text>
              <Heading my={2} size="sm">
                Difficulty Color Codes
              </Heading>
              <HStack my={2} spacing={0} fontSize="sm">
                <Box
                  p={1}
                  bg={difficultyColorCodes[1].background}
                  color={difficultyColorCodes[1].text}
                >
                  Very Easy
                </Box>
                <Box
                  p={1}
                  bg={difficultyColorCodes[2].background}
                  color={difficultyColorCodes[2].text}
                >
                  Easy
                </Box>
                <Box
                  p={1}
                  bg={difficultyColorCodes[3].background}
                  color={difficultyColorCodes[3].text}
                >
                  Normal
                </Box>

                <Box
                  p={1}
                  bg={difficultyColorCodes[4].background}
                  color={difficultyColorCodes[4].text}
                >
                  Hard
                </Box>

                <Box
                  p={1}
                  bg={difficultyColorCodes[5].background}
                  color={difficultyColorCodes[5].text}
                >
                  Very Hard
                </Box>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  );
};

const FixturesToolbar = ({
  mode,
  onModeChange,
}: {
  mode: string;
  onModeChange: (mode: string) => void;
}) => {
  return (
    <HStack alignItems="center" height="50px" borderBottomWidth={1}>
      <HStack pl={4}>
        <Heading fontWeight="black" fontSize="lg">
          Fixtures Difficulty Rating
        </Heading>
        <HelpButton />
      </HStack>
      <Divider orientation="vertical" />
      <RadioGroup px={4} value={mode} onChange={onModeChange}>
        <HStack spacing={5}>
          <Radio value="attack">Attack</Radio>
          <Radio value="defence">Defence</Radio>
        </HStack>
      </RadioGroup>
      <Divider orientation="vertical" />
    </HStack>
  );
};

export default FixturesToolbar;
