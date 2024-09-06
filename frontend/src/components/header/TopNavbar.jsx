import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Dialog,
  DialogContent,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../changePassword/ChangePassword";
import LogoutDialog from "../LogoutDialog";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";
import UserChangePassword from "../UserChangePassword/UserChangePassword";

const TopNavbar = ({ onMenuOpen, anchorEl, handleMenuClose }) => {
  const { user, logout } = useAuth();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const userName = user ? user.empname : "Guest";
  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const handleChangePassword = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setDialogOpen(false);
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#f5f5f5", zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img
            src="https://www.antiersolutions.com/wp-content/uploads/2023/04/logo-header.png.webp"
            alt="Logo"
            style={{ height: "40px", marginLeft: "10px" }}
          />
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                fontSize: "20px",
                color: "#0B2B47",
                fontWeight: "bold",
                marginRight: "5px",
                marginTop: "10px",
              }}
            >
              {userName}
            </Box>
            <IconButton onClick={onMenuOpen}>
              <Avatar
                sx={{
                  bgcolor: "#0B2B47",
                  color: "#fff",
                  width: 40,
                  height: 40,
                }}
              >
                {userInitials}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  width: 200,
                },
              }}
            >
              <MenuItem onClick={handleChangePassword}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseDialog}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <UserChangePassword />
        </DialogContent>
      </Dialog>

      <LogoutDialog
        isOpen={isDialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default TopNavbar;
