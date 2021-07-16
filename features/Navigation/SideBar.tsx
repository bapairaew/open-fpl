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
import { ReactNode } from "react";
import { IconType } from "react-icons";
import {
  IoCalendarClearOutline,
  IoLogoGithub,
  IoLogoTwitter,
  IoPeopleCircleOutline,
  IoSettingsOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";
import externalLinks from "~/features/Navigation/externalLinks";
import { useSettings } from "~/features/Settings/SettingsContext";
import p from "~/package.json";

const SideBarItem = ({
  href,
  icon,
  getIsActive,
  children,
}: {
  href: string;
  icon?: IconType;
  getIsActive?: (href: string) => boolean;
  children?: ReactNode;
}) => {
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
        role="listitem"
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
  const { onSettingsModalOpen, teamId, preference } = useSettings();
  return (
    <Flex
      h="100%"
      flexDirection="column"
      role="navigation"
      as="aside"
      borderRightWidth={1}
    >
      <Link href="/" passHref>
        <Box as="a" px={6} py={6} fontWeight="black" fontSize="2xl">
          Open FPL
        </Box>
      </Link>
      <List flexGrow={1} role="list">
        <SideBarItem href="/players" icon={IoPeopleCircleOutline}>
          Players Explorer
        </SideBarItem>
        <SideBarItem
          href={teamId ? `/teams/${teamId}` : "/teams"}
          icon={IoSwapHorizontalOutline}
          getIsActive={(href) => href?.startsWith("/teams")}
        >
          Team Planner
        </SideBarItem>
        <SideBarItem href="/fixtures" icon={IoCalendarClearOutline}>
          Fixtures
        </SideBarItem>
      </List>
      <VStack p={3} spacing={3} borderTopWidth={1}>
        <Button
          variant={teamId ? "ghost" : "solid"}
          size="sm"
          width="100%"
          onClick={onSettingsModalOpen}
          leftIcon={teamId ? <Icon as={IoSettingsOutline} /> : undefined}
        >
          {teamId ? `${preference?.name ?? teamId}` : "Set up your profile"}
        </Button>
        <HStack color="gray.600" fontSize="xs" spacing={1}>
          <A href={externalLinks.changelog} isExternal>
            {p.version}
          </A>
          <Text>·</Text>
          <Link href="/help" passHref>
            <A>Help</A>
          </Link>
          <Text>·</Text>
          <A href={externalLinks.github} isExternal>
            <Icon aria-label="Github" as={IoLogoGithub} />
          </A>
          <Text>·</Text>
          <A href={externalLinks.twitter} isExternal>
            <Icon aria-label="Twitter" as={IoLogoTwitter} />
          </A>
        </HStack>
      </VStack>
    </Flex>
  );
};

export default SideBar;
