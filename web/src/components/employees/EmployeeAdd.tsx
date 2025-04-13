import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormFieldError } from "../forms/FormFieldError";
import { FormError } from "../forms/FormError";
import { FormSuccess } from "../forms/FormSuccess";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import { useGetAllTeamsFlat } from "@/hooks/useTeams";
import { Team, Employee } from "@/types/types";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  surname: yup.string().required("Surname is required"),
  team: yup.string(),
  position: yup.string(),
  startDate: yup.date(),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date can't be before start date"),
});

export const EmployeeAdd = ({
  onSuccess,
  initialData,
  isEditMode = false,
}: {
  onSuccess?: () => void;
  initialData?: Employee;
  isEditMode?: boolean;
}) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: teams, isLoading: isTeamsLoading } = useGetAllTeamsFlat();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      name: initialData?.name || "",
      surname: initialData?.surname || "",
      position: initialData?.position || "",
      team: initialData?.team_id || "",
      startDate: initialData?.start_date
        ? new Date(initialData.start_date)
        : undefined,
      endDate: initialData?.end_date
        ? new Date(initialData.end_date)
        : undefined,
    },
  });

  const onSubmit = handleSubmit((formData) => {
    const employeeData = {
      name: formData.name,
      surname: formData.surname,
      position: formData.position,
      team_id: formData.team || undefined,
      start_date: formData.startDate ? formData.startDate.toISOString() : null,
      end_date: formData.endDate ? formData.endDate.toISOString() : null,
    };

    if (isEditMode && initialData) {
      updateEmployeeMutation.mutation.mutate(
        {
          id: initialData.id,
          data: employeeData,
        },
        {
          onSuccess: () => {
            updateEmployeeMutation.queryClient.invalidateQueries({
              queryKey: ["employees"],
            });

            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              if (onSuccess) onSuccess();
            }, 2000);
          },
          onError: () => {
            setFormError(true);
            setTimeout(() => setFormError(false), 2000);
          },
        }
      );
    } else {
      createEmployeeMutation.mutation.mutate(employeeData, {
        onSuccess: () => {
          createEmployeeMutation.queryClient.invalidateQueries({
            queryKey: ["employees"],
          });

          setSuccess(true);
          reset();
          setTimeout(() => {
            setSuccess(false);
            if (onSuccess) onSuccess();
          }, 2000);
        },
        onError: () => {
          setFormError(true);
          setTimeout(() => setFormError(false), 2000);
        },
      });
    }
  });

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {isEditMode ? "Edit employee" : "Add employee"}
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack direction="row" gap={3}>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField fullWidth {...field} label="Name" />
              )}
            />

            {errors.name && <FormFieldError text={errors.name.message} />}
          </Box>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <FormControl fullWidth>
              <Controller
                name="surname"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <TextField fullWidth {...field} label="Last Name" />
                )}
              />
            </FormControl>

            {errors.surname && <FormFieldError text={errors.surname.message} />}
          </Box>
        </Stack>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Team</InputLabel>
          <Controller
            name="team"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select {...field} label="Team">
                <MenuItem value="">Žiadny</MenuItem>
                {isTeamsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  teams?.map((team: Team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
        </FormControl>

        {errors.team && <FormFieldError text={errors.team.message} />}

        <Stack
          direction="row"
          gap={3}
          mt={3}
          flexWrap={{ xs: "wrap", md: "nowrap" }}
        >
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>Start Date </InputLabel>
            <Controller
              defaultValue={undefined}
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField fullWidth type="date" {...field} />
              )}
            />

            {errors.startDate && (
              <FormFieldError text={errors.startDate.message} />
            )}
          </Box>
          <Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
            <InputLabel>End Date </InputLabel>
            <Controller
              defaultValue={undefined}
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField fullWidth type="date" {...field} />
              )}
            />
            {errors.endDate && <FormFieldError text={errors.endDate.message} />}
          </Box>
        </Stack>
        <Box mt={3}>
          <Controller
            defaultValue=""
            name="position"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField fullWidth {...field} label="Position" />
            )}
          />
          {errors.position && <FormFieldError text={errors.position.message} />}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={
            isEditMode
              ? updateEmployeeMutation.mutation.isPending
              : createEmployeeMutation.mutation.isPending
          }
        >
          {isEditMode ? (
            updateEmployeeMutation.mutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update employee"
            )
          ) : createEmployeeMutation.mutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add employee"
          )}
        </Button>
        {formError && (
          <FormError
            text={
              isEditMode ? "Error updating employee" : "Error adding employee"
            }
          />
        )}
        {success && (
          <FormSuccess
            text={isEditMode ? "Employee Updated" : "Employee Added"}
          />
        )}
      </form>
    </Box>
  );
};
