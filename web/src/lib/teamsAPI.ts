import { fetchAPI } from "./apiClient";
import { Team } from "@/types/types";

export const teamsAPI = {
  getAll: async () => await fetchAPI("/teams"),
  getById: async (id: string) => await fetchAPI(`/teams/${id}`),
  create: async (data: Partial<Team>) =>
    await fetchAPI("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<Team>) =>
    await fetchAPI(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string) =>
    await fetchAPI(`/teams/${id}`, {
      method: "DELETE",
    }),
};
