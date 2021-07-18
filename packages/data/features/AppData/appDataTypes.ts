import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import {
  ElementSummaryFixture,
  ElementSummaryUpcomingFixture,
} from "@open-fpl/data/features/RemoteData/fplTypes";

export interface Gameweek {
  id: number;
  deadline_time: string;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
}

export interface TeamFixtures {
  id: number;
  history: ElementSummaryFixture[];
  fixtures: ElementSummaryUpcomingFixture[];
}

export interface AppData {
  players: Player[];
  gameweeks: Gameweek[];
  fixtures: TeamFixtures[];
}
