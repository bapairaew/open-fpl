import { Spinner } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import useSWR from "swr";
import { useIsLocalStorageSupported } from "~/features/Common/useLocalStorage";
import getDataUrl from "~/features/Data/getDataUrl";
import UnhandledError from "~/features/Error/UnhandledError";
import AppLayout from "~/features/Layout/AppLayout";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import { baseUrl } from "~/features/Navigation/internalUrls";
import getOgImage from "~/features/OpenGraphImages/getOgImage";
import PlayersExplorer from "~/features/PlayersExplorer/PlayersExplorer";
import { Gameweek } from "@open-fpl/data/features/AppData/appDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

function PlayersExplorerPage() {
  const { data: players, error: playersError } = useSWR<Player[]>(
    getDataUrl("/app-data/players.json")
  );
  const { data: gameweeks, error: gameweeksError } = useSWR<Gameweek[]>(
    getDataUrl("/app-data/gameweeks.json")
  );

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [players, gameweeks].every((x) => x !== undefined);

  let mainContent = null;

  if (isLocalStorageSupported) {
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
              url: getOgImage(
                "Player Statistics Explorer.png?width=100,height=100,fontSize=154px"
              ),
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
