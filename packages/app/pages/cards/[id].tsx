import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import useProfileRedirect from "@open-fpl/app/features/Common/useProfileRedirect";
import IdCard from "@open-fpl/app/features/IdCard/IdCard";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import {
  getEntry,
  getEntryHistory,
} from "@open-fpl/data/features/RemoteData/fpl";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";

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

  try {
    const [entryResponse, entryHistoryResponse] = await Promise.all([
      getEntry(+params!.id!),
      getEntryHistory(+params!.id!),
    ]);

    if (
      typeof entryResponse === "string" ||
      typeof entryHistoryResponse === "string"
    ) {
      const error = [entryResponse, entryHistoryResponse].find(
        (response) => typeof response === "string"
      );
      return {
        props: {
          error,
        },
        revalidate: 1,
      };
    }

    return {
      props: {
        name: [
          entryResponse.player_first_name,
          entryResponse.player_last_name,
        ].join(" "),
        current: entryHistoryResponse.current.map((c) => c.overall_rank),
        past: entryHistoryResponse.past.map((c) => c.rank),
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

const IdCardPage = ({
  name,
  current,
  past,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useProfileRedirect("/cards");

  const isLocalStorageSupported = useIsLocalStorageSupported();

  const isReady = [name, current, past].every((x) => x !== undefined);

  let mainContent = null;

  if (isLocalStorageSupported) {
    if (isReady) {
      mainContent = <IdCard name={name} current={current} past={past} />;
    } else {
      mainContent = (
        <FullScreenMessageWithAppDrawer
          as="main"
          symbol={<Spinner size="xl" />}
          heading="Almost there..."
          text="Please wait while we are preparing your Id Card page."
        />
      );
    }
  }

  return (
    <>
      <NextSeo
        title="ID Card – Open FPL"
        description="Create your unique ID card to show off your Fantasy Premier League rankings."
        canonical={`${origin}/cards`}
        openGraph={{
          url: `${origin}/cards`,
          title: "ID Card – Open FPL",
          description:
            "Create your unique ID card to show off your Fantasy Premier League rankings.",
          images: [
            {
              url: getOgImage("ID Card.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "ID Card – Open FPL",
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

export default IdCardPage;
