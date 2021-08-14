// https://github.com/jeppe-smith/fpl-api/blob/0c31431693264802c5cbbcfd8899118b3e258c20/browser/index.d.ts

export enum ElementStatus {
  AVAILABLE = "a",
  UNAVAILABLE = "u",
  INJURED = "i",
  SUSPENDED = "s",
  NOT_PLAYING = "n",
  DEPARTED = "d",
}

export type ChipName = "bboost" | "3xc" | "freehit" | "wildcard";

export type StatIdentifier =
  | "minutes"
  | "goals_scored"
  | "assists"
  | "clean_sheets"
  | "goals_conceded"
  | "own_goals"
  | "penalties_saved"
  | "penalties_missed"
  | "yellow_cards"
  | "red_cards"
  | "saves"
  | "bonus"
  | "bps";

export interface Player {
  date_of_birth: string;
  dirty: boolean;
  email: string;
  entry: number;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  region: number;
}

export interface Me {
  player: Player;
  watched: number[];
}

export interface ElementStats {
  label: string;
  name: string;
}

export interface ElementTypes {
  id: number;
  plural_name: string;
  plural_name_short: string;
  singular_name: string;
  singular_name_short: string;
  squad_max_play: number;
  squad_min_play: number;
  squad_select: number;
  sub_positions_locked: number[];
  ui_shirt_specific: boolean;
}

export interface Element {
  assists: number;
  bonus: number;
  bps: number;
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
  clean_sheets: number;
  code: number;
  cost_change_event: number;
  cost_change_event_fall: number;
  cost_change_start: number;
  cost_change_start_fall: number;
  creativity: string;
  dreamteam_count: number;
  element_type: number;
  ep_next: string;
  ep_this: string;
  event_points: number;
  first_name: string;
  form: string;
  goals_conceded: number;
  goals_scored: number;
  ict_index: string;
  id: number;
  in_dreamteam: boolean;
  influence: string;
  minutes: number;
  news: string;
  news_added: string | null;
  now_cost: number;
  own_goals: number;
  penalties_missed: number;
  penalties_saved: number;
  photo: string;
  points_per_game: string;
  red_cards: number;
  saves: number;
  second_name: string;
  selected_by_percent: string;
  special: boolean;
  squad_number: number | null;
  status: ElementStatus;
  team: number;
  team_code: number;
  threat: string;
  total_points: number;
  transfers_in: number;
  transfers_in_event: number;
  transfers_out: number;
  transfers_out_event: number;
  value_form: string;
  value_season: string;
  web_name: string;
  yellow_cards: number;
}

interface EntryLeagueInfo {
  id: 10;
  name: string;
  short_name: string;
  created: string;
  closed: boolean;
  rank: null | number;
  max_entries: null | number;
  league_type: LeagueType;
  admin_entry: null | number;
  start_event: number;
  entry_rank: number;
  entry_last_rank: number;
  entry_can_leave: boolean;
  entry_can_admin: boolean;
  entry_can_invite: boolean;
}

export interface EntryClassicLeague extends EntryLeagueInfo {
  scoring: "c";
}

export interface EntryH2HLeague extends EntryLeagueInfo {
  scoring: "h";
}

export interface CupMatch {
  id: number;
  entry_1_entry: number;
  entry_1_name: string;
  entry_1_player_name: string;
  entry_1_points: number;
  entry_1_win: number;
  entry_1_draw: number;
  entry_1_loss: number;
  entry_1_total: number;
  entry_2_entry: number;
  entry_2_name: string;
  entry_2_player_name: string;
  entry_2_points: number;
  entry_2_win: number;
  entry_2_draw: number;
  entry_2_loss: number;
  entry_2_total: number;
  is_knockout: boolean;
  winner: number;
  seed_value: null;
  event: number;
  tiebreak: null;
}

export interface EntryCupStatus {
  qualification_event: number;
  qualification_numbers: number;
  qualification_rank: number;
  qualification_state: "QUALIFIED" | "NOT_QUALIFIED_RANK";
}

export interface EntryCup {
  matches: CupMatch[];
  status: EntryCupStatus;
}

export interface EntryLeagues {
  classic: EntryClassicLeague[];
  h2h: EntryH2HLeague[];
  cup: EntryCup;
}

export interface Entry {
  id: number;
  joined_time: string;
  started_event: number;
  favourite_team: number;
  player_first_name: string;
  player_last_name: string;
  player_region_id: number;
  player_region_name: string;
  player_region_iso_code_short: string;
  player_region_iso_code_long: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  current_event: number;
  leagues: EntryLeagues;
  name: string;
  kit: null | string;
  last_deadline_bank: number;
  last_deadline_value: number;
  last_deadline_total_transfers: number;
}

export interface EntryChipPlay {
  event: number;
  name: ChipName;
  time: string;
}

export interface EventChipPlay {
  chip_name: ChipName;
  num_played: number;
}

export interface TopElementInfo {
  id: number;
  points: number;
}

export interface Event {
  average_entry_score: number;
  chip_plays: EventChipPlay[];
  data_checked: boolean;
  deadline_time: string;
  deadline_time_epoch: number;
  deadline_time_game_offset: number;
  finished: boolean;
  highest_score: number | null;
  highest_scoring_entry: number | null;
  id: number;
  is_current: boolean;
  is_next: boolean;
  is_previous: boolean;
  most_captained: number | null;
  most_selected: number | null;
  most_transferred_in: number | null;
  most_vice_captained: number | null;
  name: string;
  top_element: number | null;
  top_element_info: TopElementInfo | null;
  transfers_made: number;
}

export interface GameSettings {
  cup_start_event_id: number;
  league_join_private_max: number;
  league_join_public_max: number;
  league_max_ko_rounds_private_h2h: number;
  league_max_size_private_h2h: number;
  league_max_size_public_classic: number;
  league_max_size_public_h2h: number;
  league_points_h2h_draw: number;
  league_points_h2h_lose: number;
  league_points_h2h_win: number;
  league_prefix_public: string;
  squad_squadplay: number;
  squad_squadsize: number;
  squad_team_limit: number;
  squad_total_spend: number;
  stats_form_days: number;
  sys_vice_captain_enabled: boolean;
  timezone: string;
  transfers_sell_on_fee: number;
  ui_currency_multiplier: number;
  ui_special_shirt_exclusions: any[];
  ui_use_special_shirts: boolean;
}

export interface Phase {
  id: number;
  name: string;
  start_event: number;
  stop_event: number;
}

export interface Team {
  code: number;
  draw: number;
  form: string | null;
  id: number;
  loss: number;
  name: string;
  played: number;
  points: number;
  position: number;
  short_name: string;
  strength: number;
  strength_attack_away: number;
  strength_attack_home: number;
  strength_defence_away: number;
  strength_defence_home: number;
  strength_overall_away: number;
  strength_overall_home: number;
  team_division: null;
  unavailable: boolean;
  win: number;
}

export interface Bootstrap {
  element_stats: ElementStats[];
  element_types: ElementTypes[];
  elements: Element[];
  events: Event[];
  game_settings: GameSettings;
  phases: Phase[];
  teams: Team[];
  total_players: number;
}

export interface LiveElementStats {
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  total_points: number;
  in_dreamteam: boolean;
}

export interface LiveElementExplainStat {
  [key: string]: any;
  identifier: StatIdentifier;
  points: number;
  value: number;
}

export interface LiveElementExplain {
  fixture: number;
  stats: LiveElementExplainStat[];
}

export interface LiveElement {
  id: number;
  stats: LiveElementStats;
  explain: LiveElementExplain[];
}

export interface Live {
  elements: LiveElement[];
}

export interface ElementSummaryUpcomingFixture {
  id: number;
  code: number;
  difficulty: number;
  event: number;
  event_name: string;
  finished: boolean;
  is_home: boolean;
  kickoff_time: string;
  minutes: number;
  provisional_start_time: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
}

export interface ElementSummaryFixture {
  assists: number;
  bonus: number;
  bps: number;
  clean_sheets: number;
  creativity: string;
  element: number;
  fixture: number;
  goals_conceded: number;
  goals_scored: number;
  ict_index: string;
  influence: string;
  kickoff_time: string;
  minutes: number;
  opponent_team: number;
  own_goals: number;
  penalties_missed: number;
  penalties_saved: number;
  red_cards: number;
  round: number;
  saves: number;
  selected: number;
  team_a_score: number;
  team_h_score: number;
  threat: string;
  total_points: number;
  transfers_balance: number;
  transfers_in: number;
  transfers_out: number;
  value: number;
  was_home: boolean;
  yellow_cards: number;
}

export interface ElementSummarySeason {
  assists: number;
  bonus: number;
  bps: number;
  clean_sheets: number;
  creativity: string;
  element_code: number;
  end_cost: number;
  goals_conceded: number;
  goals_scored: number;
  ict_index: string;
  influence: string;
  minutes: number;
  own_goals: number;
  penalties_missed: number;
  penalties_saved: number;
  red_cards: number;
  saves: number;
  season_name: string;
  start_cost: number;
  threat: string;
  total_points: number;
  yellow_cards: number;
}

export interface ElementSummary {
  id: number;
  fixtures: ElementSummaryUpcomingFixture[];
  history: ElementSummaryFixture[];
  history_past: ElementSummarySeason[];
}

export interface FixtureStatMap {
  value: number;
  element: number;
}

export interface FixtureStat {
  identifier: StatIdentifier;
  a: FixtureStatMap[];
  h: FixtureStatMap[];
}

export interface Fixture {
  code: number;
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: FixtureStat[];
  team_h_difficulty: number;
  team_a_difficulty: number;
}

export enum EventStatusDayPoints {
  LIVE = "l",
  PROVISIONAL = "p",
  CONFIRMED = "r",
}

export interface EventStatusDay {
  bonus_added: boolean;
  date: string;
  event: number;
  points: EventStatusDayPoints;
}

export interface EventStatus {
  status: EventStatusDay[];
  leagues: string;
}

export interface EntrySeasonHistory {
  rank: number;
  season_name: string;
  total_points: number;
}

export interface EntryHistory {
  chips: EntryChipPlay[];
  current: EntryEventHistory[];
  past: EntrySeasonHistory[];
}

export interface EntryEventHistory {
  bank: number;
  event: number;
  event_transfers: number;
  event_transfers_cost: number;
  overall_rank: number;
  points: number;
  points_on_bench: number;
  rank: number;
  rank_sort: number;
  total_points: number;
  value: number;
}

export interface EntryEventPick {
  element: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  multiplier: number;
  position: number;
}

export interface EntryEvent {
  active_chip: ChipName | null;
  automatic_subs: any[];
  entry_history: EntryEventHistory;
  picks: EntryEventPick[];
}

export type LeagueType = "x" | "s";

interface LeagueInfo {
  admin_entry: number | null;
  closed: boolean;
  code_privacy: "p";
  created: string;
  id: number;
  league_type: LeagueType;
  max_entries: number | null;
  name: string;
  rank: null;
  start_event: number;
}

export interface ClassicLeagueInfo extends LeagueInfo {
  scoring: "c";
}

export interface H2HLeagueInfo extends LeagueInfo {
  scoring: "h";
  ko_rounds: number | null;
}

export interface NewLeagueEntry {
  entry: number;
  entry_name: string;
  joined_time: string;
  player_first_name: string;
  player_last_name: string;
}

interface LeagueEntry {
  entry: number;
  entry_name: string;
  id: number;
  last_rank: number;
  player_name: string;
  rank: number;
  rank_sort: number;
  total: number;
}

export interface ClassicLeagueEntry extends LeagueEntry {
  event_total: number;
}

export interface H2HLeagueEntry extends LeagueEntry {
  division: 182514;
  matches_drawn: 0;
  matches_lost: 5;
  matches_played: 16;
  matches_won: 11;
  points_for: 872;
}

interface LeagueStandings {
  has_next: boolean;
  page: number;
}

export interface ClassicLeagueStandings extends LeagueStandings {
  results: ClassicLeagueEntry[];
}

export interface H2HLeagueStandings extends LeagueStandings {
  results: H2HLeagueEntry[];
}

export interface ClassicLeague {
  league: ClassicLeagueInfo;
  new_entries: NewLeagueEntry[];
  standings: ClassicLeagueStandings;
}

export interface H2HLeague {
  league: H2HLeagueInfo;
  new_entries: NewLeagueEntry[];
  standings: H2HLeagueStandings;
}

export interface H2HMatch {
  entry_1_draw: number;
  entry_1_entry: number;
  entry_1_loss: number;
  entry_1_name: string;
  entry_1_player_name: string;
  entry_1_points: number;
  entry_1_total: number;
  entry_1_win: number;
  entry_2_draw: number;
  entry_2_entry: number;
  entry_2_loss: number;
  entry_2_name: string;
  entry_2_player_name: string;
  entry_2_points: number;
  entry_2_total: number;
  entry_2_win: number;
  event: number;
  id: number;
  is_knockout: boolean;
  seed_value: null;
  tiebreak: null;
  winner: null;
}

export interface H2HLeagueMatches {
  has_next: boolean;
  page: number;
  results: H2HMatch[];
}

export interface MyTeamPick {
  element: number;
  position: number;
  selling_price: number;
  multiplier: number;
  purchase_price: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface MyTeamChip {
  status_for_entry: "played" | "available";
  played_by_entry: number[];
  name: ChipName;
  number: number;
  start_event: number;
  stop_event: number;
  chip_type: "transfer" | "team";
}

export interface MyTeamTransfers {
  cost: number;
  status: "cost";
  limit: number;
  made: number;
  bank: number;
  value: number;
}

export interface MyTeam {
  picks: MyTeamPick[];
  chips: MyTeamChip[];
  transfers: MyTeamTransfers;
}

export interface Transfer {
  element_in: number;
  element_in_cost: number;
  element_out: number;
  element_out_cost: number;
  entry: number;
  event: number;
  time: string;
}
