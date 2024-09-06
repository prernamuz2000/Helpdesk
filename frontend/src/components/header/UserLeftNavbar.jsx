import React from "react";
import { Drawer, List, ListItem, ListItemIcon, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import { HiArchive } from "react-icons/hi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MonitorIcon from "@mui/icons-material/Monitor";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
import AssignmentIcon from "@mui/icons-material/Assignment";
const UserLeftNavbar = ({ role }) => {
  console.log("inside user nav bar", role);

  // Define the common navigation items
  const navItems = [
    { text: "Home", icon: <HomeIcon />, to: "/dashboard" },
    { text: "All Tickets", icon: <ConfirmationNumberIcon />, to: "/tickets" },
    { text: "Create Ticket", icon: <AddCircleIcon />, to: "/createTicket" },
  ];
  // Conditionally add items based on the role
  if (role === "Employee") {
    console.log("inside employee check");

    navItems.push(
      { text: "Allowance Request", icon: <HiArchive />, to: "/allowance" },
      {
        text: "Allowance Tickets",
        icon: <MonitorIcon />,
        to: "/userallowance",
      }
    );
  } else if (role === "TPM") {
    navItems.push(
      {
        text: "Allowance Request",
        icon: <HiArchive />,
        to: "/allowance",
      },

      {
        text: "Allowance Tickets",
        icon: <MonitorIcon />,
        to: "/userallowance",
      },
      {
        text: "Allowance Approval",
        icon: <AccountBalanceWalletTwoToneIcon />,
        to: "/allAllowance",
      }
    );
  } else {
    console.log("inside IT,HR check");
    navItems.push(
      {
        text: "Assinged Tickets",
        icon: <AssignmentIcon />,
        to: "/assignedTickets",
      },
      { text: "Allowance Request", icon: <HiArchive />, to: "/allowance" },
      {
        text: "Allowance Tickets",
        icon: <MonitorIcon />,
        to: "/userallowance",
      }
    );
  }

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
                fontSize: "20px",
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
              <ListItemIcon sx={{ color: "#fff", fontSize: "24px" }}>
                {item.icon}
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default UserLeftNavbar;
