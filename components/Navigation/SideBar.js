import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link as A,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IoLogoGithub,
  IoLogoTwitter,
  IoPeopleCircleOutline,
  IoSettingsOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";
import { useSettings } from "~/components/Settings/SettingsContext";
import p from "~/package.json";

const SideBarItem = ({ href, icon, getIsActive, children }) => {
  const router = useRouter();
  const isActive = getIsActive
    ? getIsActive(router.route)
    : router.route === href;

  return (
    <Link href={href} passHref>
      <ListItem
        as="a"
        m={2}
        px={4}
        py={2}
        display="block"
        borderRadius="md"
        fontSize="sm"
        fontWeight="bold"
        bg={isActive ? "gray.100" : "transparent"}
        _hover={{
          bg: "brand.50",
        }}
      >
        {icon && <ListIcon fontSize="lg" as={icon} />}
        {children}
      </ListItem>
    </Link>
  );
};

const SideBar = () => {
  const { onSettingsModalOpen, teamId, settings } = useSettings();
  return (
    <Flex
      h="100%"
      flexDirection="column"
      role="navigation"
      aria-label="main"
      borderRightWidth={1}
    >
      <Box px={6} py={6} fontWeight="black" fontSize="2xl">
        Open FPL
      </Box>
      <List flexGrow={1} role="list">
        <SideBarItem href="/" icon={IoPeopleCircleOutline}>
          Players Explorer
        </SideBarItem>
        <SideBarItem
          href={teamId ? `/transfers/${teamId}` : "/transfers"}
          icon={IoSwapHorizontalOutline}
          getIsActive={(href) => href?.startsWith("/transfers")}
        >
          Transfer Planner
        </SideBarItem>
      </List>
      <VStack p={3} spacing={3} borderTopWidth={1}>
        <Button
          variant={teamId ? "ghost" : "solid"}
          size="sm"
          width="100%"
          onClick={onSettingsModalOpen}
          leftIcon={teamId ? <IoSettingsOutline /> : undefined}
        >
          {teamId ? `${settings?.name ?? teamId}` : "Set up your profile"}
        </Button>
        <HStack color="gray" fontSize="xs" spacing={1}>
          <Link
            href="https://github.com/bapairaew/open-fpl/blob/main/CHANGELOG.md"
            passHref
          >
            <A fontSize="xs" color="gray" isExternal>
              {p.version}
            </A>
          </Link>
          <Text>·</Text>
          <Link href="/help" passHref>
            <A>Help</A>
          </Link>
        </HStack>
        <HStack color="gray" fontSize="xs" spacing={1}>
          <Link href="https://github.com/bapairaew/open-fpl" passHref>
            <A isExternal>
              Github <Icon as={IoLogoGithub} />
            </A>
          </Link>
          <Text>·</Text>
          <Link href="https://twitter.com/openfpl" passHref>
            <A isExternal>
              Twitter <Icon as={IoLogoTwitter} />
            </A>
          </Link>
        </HStack>
      </VStack>
    </Flex>
  );
};

export default SideBar;
