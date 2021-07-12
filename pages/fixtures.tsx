import fs from "fs";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import path from "path";
import { Team } from "~/features/AppData/fplTypes";
import Fixtures from "~/features/Fixtures/Fixtures";
import { makeTeamFixtures } from "~/features/Fixtures/fixturesData";
import AppLayout from "~/features/Layout/AppLayout";
import { FPLElement } from "~/features/PlayerData/playerDataTypes";

const getDataFromFiles = async (dirPath: string) => {
  return Promise.all(
    (await fs.promises.readdir(dirPath)).map((p) =>
      fs.promises
        .readFile(path.join(dirPath, p), { encoding: "utf-8" })
        .then(JSON.parse)
    )
  );
};

export const getStaticProps = async () => {
  const [fplElements, fplTeams] = await Promise.all([
    (await getDataFromFiles(path.resolve("./public/data/fpl"))) as FPLElement[],
    fs.promises
      .readFile(path.resolve("./public/data/fpl_teams/data.json"), {
        encoding: "utf-8",
      })
      .then(JSON.parse) as Promise<Team[]>,
  ]);

  const teamFixtures = makeTeamFixtures({ fplElements, fplTeams });

  return {
    props: { teamFixtures, fplTeams },
  };
};

function FixturesPage({
  teamFixtures,
  fplTeams,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Fixture Difficulty Rating – Open FPL"
        description="Explore Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating."
      />
      <AppLayout>
        <Fixtures teamFixtures={teamFixtures} fplTeams={fplTeams} />
      </AppLayout>
    </>
  );
}

export default FixturesPage;
