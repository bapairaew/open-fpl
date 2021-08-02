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
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";
import p from "@open-fpl/app/package.json";
import externalLinks from "@open-fpl/common/features/Navigation/externalLinks";
import theme from "@open-fpl/common/theme";
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
import { RoughNotation } from "react-rough-notation";

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
  const { colorMode } = useColorMode();

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
        fontSize={{ base: "md", sm: "sm" }}
        fontWeight="bold"
        bgColor={
          isActive
            ? colorMode === "dark"
              ? "whiteAlpha.100"
              : "gray.100"
            : "transparent"
        }
        _hover={{
          bgColor: colorMode === "dark" ? "whiteAlpha.50" : "gray.50",
        }}
        _active={{
          bgColor: colorMode === "dark" ? "whiteAlpha.50" : "gray.50",
        }}
      >
        {icon && <ListIcon fontSize="lg" as={icon} />}
        {children}
      </ListItem>
    </Link>
  );
};

const SideBar = ({ onSettingsClick }: { onSettingsClick?: () => void }) => {
  const { onSettingsModalOpen, teamId, preference } = useSettings();
  const { colorMode } = useColorMode();
  const annotationColor =
    colorMode === "dark" ? theme.colors.brand[200] : theme.colors.brand[500];

  const handleSettingsClick = () => {
    onSettingsModalOpen();
    onSettingsClick?.();
  };

  return (
    <Flex h="100%" flexDirection="column" role="navigation" as="aside">
      <Link href="/" passHref>
        <Box
          as="a"
          py={6}
          textAlign="center"
          fontWeight="black"
          fontSize={{ base: "4xl", sm: "3xl" }}
          color={colorMode === "dark" ? "gray.700" : "white"}
          textShadow={`
          -1px -1px 0 ${annotationColor},  
           1px -1px 0 ${annotationColor},
           -1px 1px 0 ${annotationColor},
            1px 1px 0 ${annotationColor}`}
        >
          <RoughNotation show type="highlight" color={annotationColor}>
            <Box as="span" px={2}>
              Open FPL
            </Box>
          </RoughNotation>
        </Box>
      </Link>
      <List flexGrow={1} role="list">
        <SideBarItem href="/" icon={IoPeopleCircleOutline}>
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
          width="100%"
          onClick={handleSettingsClick}
          leftIcon={teamId ? <Icon as={IoSettingsOutline} /> : undefined}
        >
          {teamId ? `${preference?.name ?? teamId}` : "Set up your profile"}
        </Button>
        <HStack
          color={colorMode === "dark" ? "whiteAlpha.600" : "gray.600"}
          fontSize="xs"
          spacing={1}
        >
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
