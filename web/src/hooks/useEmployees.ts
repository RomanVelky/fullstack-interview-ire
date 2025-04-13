import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesAPI } from "@/lib/employeesAPI";
import { Employee } from "@/types/types";

export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => await employeesAPI.getAll(),
  });
};

export const useEmployeesByTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["employees", "team", teamId],
    queryFn: async () => await employeesAPI.getAllByTeamId(teamId),
    enabled: !!teamId,
  });
};

export const useGetEmployee = (id: string) => {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => await employeesAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async (data: Partial<Employee>) =>
        await employeesAPI.create(data),
    }),
    queryClient,
  };
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: Partial<Employee>;
      }) => await employeesAPI.update(id, data),
    }),
    queryClient,
  };
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async (id: string) => await employeesAPI.delete(id),
    }),
    queryClient,
  };
};

export const useDeleteSelectedEmployees = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: async (ids: string[]) =>
        await Promise.all(ids.map((id) => employeesAPI.delete(id))),
    }),
    queryClient,
  };
};
