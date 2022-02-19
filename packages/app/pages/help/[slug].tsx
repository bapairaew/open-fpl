import {
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import HelpToolbar from "@open-fpl/app/features/Help/HelpToolbar";
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
  IoRadioButtonOnOutline,
  IoSearchOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";

const tabs = [
  {
    label: "Dashboard",
    icon: IoRadioButtonOnOutline,
    slug: "dashboard",
    component: dynamic(
      () => import("@open-fpl/app/features/Help/DashboardHelp")
    ),
  },
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
        <Flex flexDirection="column" height="100%" as="main">
          <HelpToolbar display={{ base: "flex", sm: "none" }} />
          <Tabs
            isLazy
            variant="enclosed-colored"
            flexGrow={1}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            index={index}
          >
            <TabList flexShrink={0} overflowX="auto" overflowY="hidden">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.slug}
                  borderLeftWidth={{ base: index === 0 ? 0 : 1, sm: 1 }}
                  ml={{ base: 0, sm: index === 0 ? 2 : 0 }}
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
            <TabPanels flexGrow={1} overflow="auto" py={{ base: 0, sm: 8 }}>
              {tabs.map((tab) => (
                <TabPanel key={tab.slug} px={0} py={8}>
                  <tab.component />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Flex>
      </AppLayout>
    </>
  );
};

export default HelpPage;
