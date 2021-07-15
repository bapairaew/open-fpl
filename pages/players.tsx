import { Spinner } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import useSWR from "swr";
import { Gameweek } from "~/features/AppData/appDataTypes";
import UnhandledError from "~/features/Error/UnhandledError";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { baseUrl } from "~/features/Navigation/internalUrls";
import { Player } from "~/features/PlayerData/playerDataTypes";
import PlayersExplorer from "~/features/PlayersExplorer/PlayersExplorer";

function PlayersExplorerPage() {
  const { data: players, error: playersError } = useSWR<Player[]>(
    "/app-data/players.json"
  );
  const { data: gameweeks, error: gameweeksError } = useSWR<Gameweek[]>(
    "/app-data/gameweeks.json"
  );

  const isReady = [players, gameweeks].every((x) => x !== undefined);

  let mainContent = null;

  if (isReady) {
    mainContent = (
      <PlayersExplorer as="main" players={players!} gameweeks={gameweeks!} />
    );
  } else if (playersError || gameweeksError) {
    mainContent = (
      <UnhandledError
        as="main"
        additionalInfo={
          playersError
            ? "Players data failed to load"
            : "Gameweeks data failed to load"
        }
      />
    );
  } else {
    mainContent = (
      <FullScreenMessage
        as="main"
        symbol={<Spinner size="xl" />}
        heading="One moment..."
        text="Please wait while we are preparing players data."
      />
    );
  }

  return (
    <>
      <NextSeo
        title="Player Statistics Explorer – Open FPL"
        description="Explore Fantasy Premier League player statistics xG, xGA, and more to make a better decision on your team."
        canonical={`${baseUrl}/players`}
        openGraph={{
          url: `${baseUrl}/players`,
          title: "Player Statistics Explorer – Open FPL",
          description:
            "Explore Fantasy Premier League player statistics xG, xGA, and more to make a better decision on your team.",
          images: [
            {
              url: `${baseUrl}/api/ogimages/Player Statistics Explorer.png?width=800,height=600`,
              width: 800,
              height: 600,
              alt: "Player Statistics Explorer – Open FPL",
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
}

export default PlayersExplorerPage;
