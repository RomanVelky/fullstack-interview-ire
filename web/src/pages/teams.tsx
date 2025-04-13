import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { TeamItem } from "@/components/teams/TeamItem";
import { Team, Employee } from "@/types/types";
import { useGetAllTeams } from "@/hooks/useTeams";
import {
  useGetAllEmployees,
  useDeleteSelectedEmployees,
} from "@/hooks/useEmployees";
import { TeamAdd } from "@/components/teams/TeamAdd";
import { EmployeeAdd } from "@/components/employees/EmployeeAdd";
import { useDeleteTeam } from "@/hooks/useTeams";

export default function Teams() {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    error: teamsError,
  } = useGetAllTeams();

  const { data: employeesData, isLoading: isEmployeesLoading } =
    useGetAllEmployees();

  const deleteSelectedMutation = useDeleteSelectedEmployees();
  const deleteTeamMutation = useDeleteTeam();

  const teams = useMemo(() => {
    if (!teamsData || !employeesData) return [];

    const teamsWithEmployees = JSON.parse(JSON.stringify(teamsData)) as Team[];

    const addEmployeesToTeam = (team: Team) => {
      team.employees = employeesData.filter(
        (employee: Employee) => employee.team_id === team.id
      );

      if (team.children && team.children.length > 0) {
        team.children.forEach(addEmployeesToTeam);
      }

      return team;
    };

    return teamsWithEmployees.map(addEmployeesToTeam);
  }, [teamsData, employeesData]);

  const isLoading =
    isTeamsLoading ||
    isEmployeesLoading ||
    deleteSelectedMutation.mutation.isPending;
  const error = teamsError || deleteSelectedMutation.mutation.error;

  const handleEmployeeSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, id]);
    } else {
      setSelectedEmployees((prev) => prev.filter((empId) => empId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.length === 0) return;
    await deleteSelectedMutation.mutation.mutateAsync(selectedEmployees, {
      onSuccess: () => {
        deleteSelectedMutation.queryClient.invalidateQueries({
          queryKey: ["employees"],
        });
        setSelectedEmployees([]);
      },
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeamMutation.mutation.mutate(teamId, {
      onSuccess: () => {
        deleteTeamMutation.queryClient.invalidateQueries({
          queryKey: ["teams"],
        });
      },
      onError: (error) => {
        console.error("Error deleting team:", error);
      },
    });
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleAddTeamClick = () => {
    setShowAddTeam(true);
    setShowAddEmployee(false);
  };

  const handleAddEmployeeClick = () => {
    setShowAddEmployee(true);
    setShowAddTeam(false);
  };

  const handleBackToList = () => {
    setShowAddTeam(false);
    setShowAddEmployee(false);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", special: "row" }}
          justifyContent={{ xs: "center", special: "space-between" }}
          alignItems={{ xs: "center", special: "center" }}
          gap={1}
          mb={3}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: { xs: "center", special: "left" } }}
          >
            Tímy
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", special: "row" }}
            gap={1}
            alignItems="center"
          >
            {!showAddTeam && !showAddEmployee && (
              <>
                {selectedEmployees.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteSelected}
                  >
                    Vymazať zamestnancov ({selectedEmployees.length})
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddTeamClick}
                >
                  Tím
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmployeeClick}
                >
                  Zamestnanec
                </Button>
                {teams && teams.length > 0 && (
                  <Button
                    variant="outlined"
                    color={isEditMode ? "primary" : "inherit"}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? "Hotovo" : "Upraviť"}
                  </Button>
                )}
              </>
            )}
            {(showAddTeam || showAddEmployee) && (
              <Button variant="outlined" onClick={handleBackToList}>
                Späť na zoznam
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error instanceof Error ? error.message : "An error occurred"}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : showAddTeam ? (
          <TeamAdd onSuccess={handleBackToList} />
        ) : showAddEmployee ? (
          <EmployeeAdd onSuccess={handleBackToList} />
        ) : teams && teams.length > 0 ? (
          <Box>
            {teams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                selectedEmployees={selectedEmployees}
                onEmployeeSelect={handleEmployeeSelect}
                isEditMode={isEditMode}
                onDeleteTeam={(id) => handleDeleteTeam(id)}
              />
            ))}
          </Box>
        ) : (
          <Alert severity="info">No teams found. Create your first team!</Alert>
        )}
      </Box>
    </Container>
  );
}
