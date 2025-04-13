import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsAPI } from "@/lib/teamsAPI";
import { Team } from "@/types/types";

export const useGetAllTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const teamsData = await teamsAPI.getAll();

      const teamMap = new Map<string, Team>();
      teamsData.forEach((team: Team) =>
        teamMap.set(team.id, { ...team, children: [], employees: [] })
      );

      const rootTeams: Team[] = [];
      teamsData.forEach((team: Team) => {
        const teamWithChildren = teamMap.get(team.id)!;

        if (team.parent_team_id && teamMap.has(team.parent_team_id)) {
          const parentTeam = teamMap.get(team.parent_team_id)!;
          if (!parentTeam.children) parentTeam.children = [];
          parentTeam.children.push(teamWithChildren);
        } else {
          rootTeams.push(teamWithChildren);
        }
      });

      return rootTeams;
    },
  });
};

export const useGetAllTeamsFlat = () => {
  return useQuery({
    queryKey: ["teams-flat"],
    queryFn: async () => {
      const teamsData = await teamsAPI.getAll();
      return teamsData;
    },
  });
};

export const useGetTeam = (id: string) => {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: async () => await teamsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async (data: Partial<Team>) => await teamsAPI.create(data),
    }),
    queryClient,
  };
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<Team> }) =>
        await teamsAPI.update(id, data),
    }),
    queryClient,
  };
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async (id: string) => await teamsAPI.delete(id),
    }),
    queryClient,
  };
};
