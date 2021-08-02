import {
  Divider,
  Flex,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from "@chakra-ui/react";
import { AppDrawerOpenButton } from "@open-fpl/app/features/Layout/AppDrawer";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import {
  IoCalendarClearOutline,
  IoPeopleCircleOutline,
  IoSearchOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";

const tabs = [
  {
    label: "Player Explorer",
    icon: IoPeopleCircleOutline,
    slug: "players",
    component: dynamic(
      () => import("@open-fpl/app/features/Help/PlayersExplorerHelp")
    ),
  },
  {
    label: "Team Planner",
    icon: IoSwapHorizontalOutline,
    slug: "teams",
    component: dynamic(
      () => import("@open-fpl/app/features/Help/TeamPlannerHelp")
    ),
  },
  {
    label: "Fixtures",
    icon: IoCalendarClearOutline,
    slug: "fixtures",
    component: dynamic(
      () => import("@open-fpl/app/features/Help/FixturesHelp")
    ),
  },
  {
    label: "Find your ID",
    icon: IoSearchOutline,
    slug: "id",
    component: dynamic(
      () => import("@open-fpl/app/features/Help/FindYourIDHelp")
    ),
  },
];

export const getStaticPaths = () => {
  return {
    paths: tabs.map((t) => ({ params: { slug: t.slug } })),
    fallback: false,
  };
};

export const getStaticProps = ({ params }: GetStaticPropsContext) => {
  const index = tabs.findIndex((t) => t.slug === params?.slug) ?? 0;
  return {
    props: {
      index,
    },
  };
};

const HelpPage = ({
  index,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const handleClick = (href: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      <NextSeo
        title="How to use – Open FPL"
        description="How to use each open-source tool on Open FPL to help you enjoy Fantasy Premier League more."
        canonical={`${origin}/help`}
        openGraph={{
          url: `${origin}/help`,
          title: "How to use – Open FPL",
          description:
            "How to use each open-source tool on Open FPL to help you enjoy Fantasy Premier League more.",
          images: [
            {
              url: getOgImage("How to use.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "How to use – Open FPL",
            },
          ],
          site_name: "Open FPL",
        }}
        twitter={{
          handle: "@openfpl",
          site: "@openfpl",
          cardType: "summary_large_image",
        }}
      />
      <AppLayout>
        <Tabs as="main" height="100%" overflow="auto" index={index}>
          <HStack height="50px" spacing={0} alignItems="stretch">
            <Flex justifyContent="center" alignItems="center">
              <AppDrawerOpenButton />
            </Flex>
            <Divider orientation="vertical" />
            <TabList
              height="50px"
              position="sticky"
              top={0}
              bgColor={colorMode === "dark" ? "gray.800" : "white"}
              zIndex="sticky"
              overflow="auto"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.slug}
                  height="48px"
                  fontWeight="bold"
                  width="180px"
                  flexShrink={0}
                  flexGrow={0}
                  as="a"
                  href={`/help/${tab.slug}`}
                  onClick={handleClick(`/help/${tab.slug}`)}
                >
                  <Icon as={tab.icon} mr={2} /> {tab.label}
                </Tab>
              ))}
            </TabList>
          </HStack>
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.slug} px={0} py={8}>
                <tab.component />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </AppLayout>
    </>
  );
};

export default HelpPage;
