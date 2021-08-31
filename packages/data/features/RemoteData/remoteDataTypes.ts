import { FPLElement } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  Bootstrap,
  ElementTypes,
  Event,
  Fixture,
  Team,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import {
  GetUnderstatPlayersResponse,
  LeagueStat,
  PlayerStat,
  TeamStat,
} from "@open-fpl/data/features/RemoteData/understatTypes";

export type FetchDataConfigOptions<T> = {
  fpl?: T;
  fpl_fixtures?: T;
  fpl_teams?: T;
  fpl_element_types?: T;
  fpl_gameweeks?: T;
  understat?: T;
  understat_teams?: T;
};

export type GetItemToUpdateFunction = (list: any) => any[];

export type OnSnapShotLoadedHandler = (
  fplData: Bootstrap,
  underStatData: LeagueStat,
  understatPlayersResponse: GetUnderstatPlayersResponse
) => Promise<any> | void;

export type SaveItemFunction = (data: any) => Promise<any> | void;

export type FetchDataConfig = {
  onSnapShotLoaded?: OnSnapShotLoadedHandler;
  saveFn: FetchDataConfigOptions<SaveItemFunction>;
  getItemsToUpdate?: FetchDataConfigOptions<GetItemToUpdateFunction>;
  retries?: FetchDataConfigOptions<number>;
  concurrent?: FetchDataConfigOptions<number>;
  delay?: FetchDataConfigOptions<number>;
};

export interface RemoteData {
  fpl: FPLElement[];
  fplFixtures: Fixture[];
  fplTeams: Team[];
  fplElementTypes: ElementTypes[];
  fplGameweeks: Event[];
  understat: PlayerStat[];
  understatTeams: TeamStat[];
}
