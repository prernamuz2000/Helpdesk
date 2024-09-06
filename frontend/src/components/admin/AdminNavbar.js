import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MonitorIcon from "@mui/icons-material/Monitor";
import { HiArchive } from "react-icons/hi";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";

const AdminNavbar = ({ role }) => {

  console.log('inside admin navvvvvvvvvvvbaaaaaarrrr');

  const navItems = [
    { text: "Home", icon: <HomeIcon />, to: "/adminDashboard" },
    { text: "All Ticket", icon: <ConfirmationNumberIcon />, to: "/tickets" },
    { text: "Create Ticket", icon: <AddCircleIcon />, to: "/createTicket" },
    { text: "Agents", icon: <PeopleIcon />, to: "/agents" },
    // { text: "Allowance Request", icon: <HiArchive />, to: "/allowance" },
    { text: "Allowance Request", icon: <HiArchive style={{ width: '24px', height: '24px' }} />, to: "/allowance" },

    { text: "Allowance Tickets", icon: <AccountBalanceWalletTwoToneIcon />, to: "/adminAllowance" }
  ];

  return (
    <Drawer

      variant="permanent"
      sx={{
        width: 60,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 60,
          boxSizing: "border-box",
          backgroundColor: "#0B2B47",
          color: "#fff",
          marginTop: "64px",
        },
      }}
    >
      <List>
        {navItems.map((item) => (
          <Tooltip
            title={item.text}
            placement="right"
            arrow
            sx={{
              "& .MuiTooltip-tooltip": {
                backgroundColor: "#333",
                color: "#fff",
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "4px",
                transition: "opacity 0.3s ease",
              },
              "& .MuiTooltip-arrow": {
                color: "#333",
              },
            }}
            key={item.text}
          >
            <ListItem button component={Link} to={item.to || "#"}>
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};
export default AdminNavbar;
