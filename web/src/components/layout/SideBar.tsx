import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import { alpha } from "@mui/system/colorManipulator";

const NavItem = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: theme.typography.fontWeightRegular,
  justifyContent: "flex-start",
  textAlign: "left",
  padding: theme.spacing(1),
  textTransform: "none",
  borderRadius: "0px",
  width: "100%",
  textDecoration: "none",
  a: {
    display: "block",
    textDecoration: "none",
  },
  svg: {
    fill: theme.palette.common.white,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.7),
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  display: "block",
}));

interface SideBarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}: SideBarProps) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="navigation"
    >
      <Drawer
        variant={isMd ? "permanent" : "temporary"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: theme.palette.background.sidebar,
            color: theme.palette.common.white,
          },
        }}
      >
        <Box px={2} py={3} sx={{ textAlign: "center" }}>
          <Image src="logo.svg" alt="Alveno" width="150" height="37" />
        </Box>

        <Divider sx={{ backgroundColor: theme.palette.grey[100] }} />
        <List sx={{ a: { textDecoration: "none" } }}>
          <StyledListItem>
            <Link href="/" passHref>
              <NavItem>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Zadání" />
              </NavItem>
            </Link>
          </StyledListItem>
          <StyledListItem>
            <Link href="/teams" passHref>
              <NavItem>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Tímy" />
              </NavItem>
            </Link>
          </StyledListItem>
        </List>
      </Drawer>
    </Box>
  );
};
