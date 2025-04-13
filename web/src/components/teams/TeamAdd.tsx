import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormFieldError } from "../forms/FormFieldError";
import { FormSuccess } from "../forms/FormSuccess";
import { FormError } from "../forms/FormError";
import {
  useCreateTeam,
  useGetAllTeamsFlat,
  useUpdateTeam,
} from "@/hooks/useTeams";
import { Team } from "@/types/types";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  parentTeam: yup.string(),
});

interface TeamAddProps {
  onSuccess?: () => void;
  initialData?: Team;
  isEditMode?: boolean;
}

export const TeamAdd = ({
  onSuccess,
  initialData,
  isEditMode = false,
}: TeamAddProps) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: teams, isLoading: isTeamsLoading } = useGetAllTeamsFlat();
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      name: initialData?.name || "",
      parentTeam: initialData?.parent_team_id || "",
    },
  });

  const onSubmit = handleSubmit((formData) => {
    const teamData = {
      name: formData.name,
      parent_team_id: formData.parentTeam || null,
    };

    if (isEditMode && initialData) {
      updateTeamMutation.mutation.mutate(
        {
          id: initialData.id,
          data: teamData,
        },
        {
          onSuccess: () => {
            updateTeamMutation.queryClient.invalidateQueries({
              queryKey: ["teams"],
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
      createTeamMutation.mutation.mutate(teamData, {
        onSuccess: () => {
          createTeamMutation.queryClient.invalidateQueries({
            queryKey: ["teams"],
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

  const isPending = isEditMode
    ? updateTeamMutation.mutation.isPending
    : createTeamMutation.mutation.isPending;

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {isEditMode ? "Edit Team" : "Add Team"}
      </Typography>
      <form onSubmit={onSubmit}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField fullWidth {...field} label="Name" />
          )}
        />

        {errors.name && <FormFieldError text={errors.name.message} />}

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Parent team</InputLabel>
          <Controller
            name="parentTeam"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Parent team">
                <MenuItem value="">Žiadny</MenuItem>
                {isTeamsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  teams
                    ?.filter((t: Team) => t.id !== initialData?.id)
                    .map((team: Team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))
                )}
              </Select>
            )}
          />
        </FormControl>

        {errors.parentTeam && (
          <FormFieldError text={errors.parentTeam.message} />
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{ my: 3 }}
          disabled={isPending}
        >
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEditMode ? (
            "Update Team"
          ) : (
            "Add Team"
          )}
        </Button>
        {formError && (
          <FormError
            text={`Error ${isEditMode ? "updating" : "adding"} team`}
          />
        )}
        {success && (
          <FormSuccess text={`Team ${isEditMode ? "Updated" : "Added"}`} />
        )}
      </form>
    </Box>
  );
};
