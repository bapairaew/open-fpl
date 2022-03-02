import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import useProfileRedirect from "@open-fpl/app/features/Common/useProfileRedirect";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import TeamPlanner from "@open-fpl/app/features/TeamPlanner/TeamPlanner";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  getEntryHistory,
  getEntryPicks,
  getEntryTransfers,
} from "@open-fpl/data/features/RemoteData/fpl";
import { Event } from "@open-fpl/data/features/RemoteData/fplTypes";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import useSWR from "swr";

export const getStaticPaths = () => {
  return { paths: [], fallback: true };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.id) {
    // Next.js gets here when rendering the page initially on dev mode
    return {
      notFound: true,
    };
  }

  if (isNaN(+params!.id)) {
    return {
      props: {
        error:
          "Invalid FPL ID: Please check help page for the instruction to find a valid FPL ID.",
      },
    };
  }

  const [teamFixtures, teams, fplGameweeks] = await Promise.all([
    fetch(getDataUrl("/app-data/fixtures.json")).then((r) =>
      r.json()
    ) as Promise<TeamFixtures[]>,
    fetch(getDataUrl("/app-data/teams.json")).then((r) => r.json()) as Promise<
      Team[]
    >,
    fetch(getDataUrl("/remote-data/fpl_gameweeks/data.json")).then((r) =>
      r.json()
    ) as Promise<Event[]>,
  ]);

  const nextGameweekId: number = fplGameweeks.find((g) => g.is_next)?.id ?? 38; // Show gameweek 38 at the end of the season
  const picksGameweekId: number =
    nextGameweekId === 38 || nextGameweekId === 1 // Use gw 1 for preseasons and gw 38 for the end of the season
      ? nextGameweekId
      : nextGameweekId - 1;

  try {
    // TODO: optimise response size
    const [entryPicksResponse, entryTransfersResponse, entryHistoryResponse] =
      await Promise.all([
        getEntryPicks(+params!.id!, picksGameweekId),
        getEntryTransfers(+params!.id!),
        getEntryHistory(+params!.id!),
      ]);

    if (
      typeof entryPicksResponse === "string" ||
      typeof entryTransfersResponse === "string" ||
      typeof entryHistoryResponse === "string"
    ) {
      const error = [
        entryPicksResponse,
        entryTransfersResponse,
        entryHistoryResponse,
      ].find((response) => typeof response === "string");
      return {
        props: {
          error,
        },
        revalidate: 1,
      };
    }
    const { picks = null, entry_history = null } = entryPicksResponse;
    const transfers = entryTransfersResponse;
    const { chips = null } = entryHistoryResponse;

    return {
      props: {
        picks,
        entry_history,
        transfers,
        chips,
        teams,
        teamFixtures,
        nextGameweekId,
      },
      revalidate: 60,
    };
  } catch (e) {
    return {
      props: {
        error:
          "Unable to connect to official FPL server, please check if https://fantasy.premierleague.com/ is working.",
      },
      revalidate: 60,
    };
  }
};

const TransferPlannerPage = ({
  picks: initialPicks,
  entry_history,
  transfers,
  chips,
  teams,
  error,
  nextGameweekId,
  teamFixtures,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useProfileRedirect("/teams");

  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [
    initialPicks,
    entry_history,
    players,
    transfers,
    chips,
    teams,
    teamFixtures,
    nextGameweekId,
  ].every((x) => x !== undefined);

  const errors = [playersError ? "Players" : null].filter((x) => x) as string[];

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (error) {
      mainContent = (
        <UnhandledError
          Wrapper={FullScreenMessageWithAppDrawer}
          as="main"
          additionalInfo={error}
        />
      );
    } else if (isReady) {
      mainContent = (
        <TeamPlanner
          as="main"
          initialPicks={initialPicks ?? null}
          entryHistory={entry_history ?? null}
          players={players!}
          nextGameweekId={nextGameweekId!}
          transfers={transfers!}
          chips={chips!}
          teams={teams!}
          teamFixtures={teamFixtures!}
        />
      );
    } else if (errors.length > 0) {
      mainContent = (
        <UnhandledError
          Wrapper={FullScreenMessageWithAppDrawer}
          as="main"
          additionalInfo={`Failed to load ${errors.join(", ")}`}
        />
      );
    } else {
      mainContent = (
        <FullScreenMessageWithAppDrawer
          as="main"
          symbol={<Spinner size="xl" />}
          heading="Almost there..."
          text="Please wait while we are preparing your Team Planner page."
        />
      );
    }
  }

  return (
    <>
      <NextSeo
        title="Team Planner – Open FPL"
        description="Plan your team lineup, transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        noindex={true}
        canonical={`${origin}/teams`}
        openGraph={{
          url: `${origin}/teams`,
          title: "Team Planner – Open FPL",
          description:
            "Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks.",
          images: [
            {
              url: getOgImage("Team Planner.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "Team Planner – Open FPL",
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
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
};

export default TransferPlannerPage;
