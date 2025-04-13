export type Employee = {
  id: string;
  name: string;
  surname: string;
  position: string;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  team_id: string;
};

export type Team = {
  id: string;
  name: string;
  parent_team_id: string | null;
  employees: Employee[];
  children?: Team[];
};
