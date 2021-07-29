import {
  Box,
  Code,
  Container,
  Heading,
  Icon,
  Link as A,
  Text,
  VStack,
} from "@chakra-ui/react";
import findYourIDStep1 from "@open-fpl/app/public/find-your-id/find-your-id-1.png";
import findYourIDStep2 from "@open-fpl/app/public/find-your-id/find-your-id-2.png";
import Image from "next/image";
import { IoOpenOutline } from "react-icons/io5";

const FindYourIDHelp = () => {
  return (
    <Container maxW="container.lg" lineHeight="taller">
      <VStack spacing={6} alignItems="flex-start">
        <Heading as="h1" size="xl" fontWeight="black">
          Find Your ID
        </Heading>
        <Text as="p">
          To find your FPL ID, just logged in to your FPL account on their
          website, then open "My Team" or "Pick Team" tab just{" "}
          <A href="https://fantasy.premierleague.com/my-team" isExternal>
            click here to open My Team page <Icon as={IoOpenOutline} />
          </A>
          .
        </Text>
        <Box py={4}>
          <Image
            placeholder="blur"
            src={findYourIDStep1}
            alt="Find your FPL ID step 1"
          />
        </Box>
        <Text as="p">
          Then check your ID look at the URL at the top bar of your browser,
          your ID should be a number foundn in this format{" "}
          <Code wordBreak="break-all">
            https://fantasy.premierleague.com/entry/__YOUR_ID__/history
          </Code>
        </Text>
        <Box py={4}>
          <Image
            placeholder="blur"
            src={findYourIDStep2}
            alt="Find your FPL ID step 2"
          />
        </Box>
      </VStack>
    </Container>
  );
};

export default FindYourIDHelp;
