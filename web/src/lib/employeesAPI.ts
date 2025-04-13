import { fetchAPI } from "./apiClient";
import { Employee } from "@/types/types";

export const employeesAPI = {
  getAll: async () => await fetchAPI("/employees"),
  getAllByTeamId: async (teamId: string) => {
    const employees = await fetchAPI("/employees");
    return employees.filter((employee: any) => employee.team_id === teamId);
  },
  getById: async (id: string) => await fetchAPI(`/employees/${id}`),
  create: async (data: Partial<Employee>) =>
    await fetchAPI("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<Employee>) =>
    await fetchAPI(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string) =>
    await fetchAPI(`/employees/${id}`, {
      method: "DELETE",
    }),
};
