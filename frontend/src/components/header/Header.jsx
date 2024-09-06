import React, { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, Modal, Box, Avatar, IconButton } from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import Changepassword from '../ChangePassword/ChangePassword';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon here
import './Header.css';
import 'bootstrap/dist/css/bootstrap.css';

const Header = () => {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleShow = () => {
    setOpenChangePassword(true);
    handleMenuClose();
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  return (
    <>
      <header>
        <div className='d-flex p-3'>
          <img className='' src='https://www.antiersolutions.com/wp-content/uploads/2023/04/logo-header.png.webp' alt='Logo' height={38} />
          <h2 className='ms-5 ps-4 flex-grow-1'>HelpDesk Ticket</h2>
          <h5 className='p-2'>User name</h5>
          <div>
            
            <Avatar onClick={handleMenuOpen} sx={{ bgcolor: '#008BC9' }}>D</Avatar>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleShow}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className='hero-section text-center text-white p-4'>
          <h1>Welcome to Helpdesk</h1>
          <p className='mt-4'>Manage all your helpdesk tickets efficiently.</p>
        </div>
        <div className="name-section"></div>
      </header>

      <Modal
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
      >
        <Box className="modal-box">
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseChangePassword}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Changepassword />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
