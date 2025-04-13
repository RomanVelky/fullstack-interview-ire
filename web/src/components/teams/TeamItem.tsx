import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  Divider,
  IconButton,
  Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Team, Employee } from "@/types/types";
import { EmployeeAdd } from "@/components/employees/EmployeeAdd";
import { useGetEmployee } from "@/hooks/useEmployees";
import { TeamAdd } from "@/components/teams/TeamAdd";

interface TeamItemProps {
  team: Team;
  selectedEmployees: string[];
  onEmployeeSelect: (id: string, checked: boolean) => void;
  isEditMode?: boolean;
  onDeleteTeam?: (id: string) => void;
}

export const TeamItem = ({
  team,
  selectedEmployees,
  onEmployeeSelect,
  isEditMode,
  onDeleteTeam,
}: TeamItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [employeesExpanded, setEmployeesExpanded] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);

  const employees = team.employees || [];
  const hasSubteams = team.children && team.children.length > 0;

  const { data: selectedEmployee } = useGetEmployee(editEmployeeId || "");

  useEffect(() => {
    setEmployeesExpanded(employees.length > 0 && employees.length < 4);
  }, [employees.length]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleEmployeesAccordionChange = () => {
    setEmployeesExpanded(!employeesExpanded);
  };

  const isFormerEmployee = (employee: Employee) => {
    if (!employee.end_date) return false;
    const endDate = new Date(employee.end_date);
    return endDate < new Date();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEditEmployee = (employeeId: string) => {
    setEditEmployeeId(employeeId);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditEmployeeId(null);
  };

  const handleEditTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditTeamDialogOpen(true);
  };

  const handleCloseTeamEditDialog = () => {
    setIsEditTeamDialogOpen(false);
  };

  return (
    <Paper elevation={2} sx={{ mb: 2 }}>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`team-${team.id}-content`}
          id={`team-${team.id}-header`}
          sx={{
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Typography variant="h6">{team.name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
              {employees.length > 0 && (
                <Chip
                  label={`${employees.length} ${
                    employees.length === 1 ? "zamestnanec" : "zamestnanci"
                  }`}
                  size="small"
                />
              )}
              {hasSubteams && (
                <Chip
                  label={`${team.children?.length} ${
                    team.children?.length === 1 ? "tím" : "tímy"
                  }`}
                  size="small"
                  color="primary"
                />
              )}
            </Box>

            {isEditMode && (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleEditTeam}
                  sx={{
                    position: "absolute",
                    right: "70px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTeam && onDeleteTeam(team.id);
                  }}
                  sx={{
                    position: "absolute",
                    right: "40px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* Employees Section */}
          {employees.length > 0 ? (
            <Accordion
              expanded={employeesExpanded}
              onChange={handleEmployeesAccordionChange}
              disableGutters
              sx={{ boxShadow: "none", "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`employees-${team.id}-content`}
                id={`employees-${team.id}-header`}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  borderRadius: 1,
                  minHeight: "48px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Zamestnanci ({employees.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, mt: 1 }}>
                <List dense>
                  {employees.map((employee) => (
                    <ListItem
                      key={employee.id}
                      secondaryAction={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditEmployee(employee.id)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <Checkbox
                            edge="end"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={(e) =>
                              onEmployeeSelect(employee.id, e.target.checked)
                            }
                          />
                        </Box>
                      }
                      sx={{
                        backgroundColor: isFormerEmployee(employee)
                          ? "#FFEBEE"
                          : "transparent",
                        color: isFormerEmployee(employee)
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      <ListItemText
                        primary={`${employee.name} ${employee.surname}`}
                        secondary={
                          <Box component="span">
                            <Typography variant="body2" component="span">
                              {employee.position}
                            </Typography>
                            <br />
                            <Typography variant="caption" component="span">
                              Created: {formatDate(employee.created_at)}
                              <br />
                              Start: {formatDate(employee.start_date)}
                              {employee.end_date && (
                                <> • End: {formatDate(employee.end_date)}</>
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Zamestnanci
              </Typography>
              <Typography variant="body2" color="text.secondary">
                V tomto tíme nie sú žiadni zamestnanci
              </Typography>
            </Box>
          )}
          {/* Subteams Section - Only displayed if there are subteams */}
          {hasSubteams && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Tým
              </Typography>
              <Box sx={{ pl: 2 }}>
                {team.children?.map((childTeam) => (
                  <TeamItem
                    key={childTeam.id}
                    team={childTeam}
                    selectedEmployees={selectedEmployees}
                    onEmployeeSelect={onEmployeeSelect}
                    isEditMode={isEditMode}
                    onDeleteTeam={onDeleteTeam}
                  />
                ))}
              </Box>
            </>
          )}
          {/* Edit Employee Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            fullWidth
            maxWidth="md"
          >
            <Box sx={{ p: 3 }}>
              {selectedEmployee && (
                <EmployeeEditForm
                  employee={selectedEmployee}
                  onClose={handleCloseEditDialog}
                />
              )}
            </Box>
          </Dialog>
          {/* Edit Team Dialog */}
          <Dialog
            open={isEditTeamDialogOpen}
            onClose={handleCloseTeamEditDialog}
            fullWidth
            maxWidth="md"
          >
            <Box sx={{ p: 3 }}>
              <TeamEditForm team={team} onClose={handleCloseTeamEditDialog} />
            </Box>
          </Dialog>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

interface EmployeeEditFormProps {
  employee: Employee;
  onClose: () => void;
}

const EmployeeEditForm = ({ employee, onClose }: EmployeeEditFormProps) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <EmployeeAdd
      initialData={employee}
      onSuccess={handleSuccess}
      isEditMode={true}
    />
  );
};

interface TeamEditFormProps {
  team: Team;
  onClose: () => void;
}

const TeamEditForm = ({ team, onClose }: TeamEditFormProps) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <TeamAdd initialData={team} onSuccess={handleSuccess} isEditMode={true} />
  );
};
