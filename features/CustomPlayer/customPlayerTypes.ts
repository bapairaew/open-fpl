export interface CustomPlayer {
  id: number;
  web_name: string;
  now_cost: number;
  element_type: {
    singular_name_short: string;
  };
  team: {
    short_name: string;
  };
}
