import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import UserLeftNavbar from './UserLeftNavbar';
import AdminNavbar from '../admin/AdminNavbar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children, userName = "Deepshikha" }) => {
    const {user} = useAuth();
    console.log('user inside inside layout...........',user);
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const location = useLocation(); // Hook to get the current route

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Define paths where the UserLeftNavbar should not be visible
    const noSidebarPaths = ['/login', '/signup'];

    // Determine if the current path is one of the excluded paths
    const showSidebar = !noSidebarPaths.includes(location.pathname);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <TopNavbar
                userName={userName}
                onMenuOpen={handleMenuOpen}
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
            />
            <Box display="flex" flexGrow={1}>

                {user&&user?.role==='SystemAdmin'?<AdminNavbar/>:<UserLeftNavbar role={user.role}/>}
                
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        marginLeft: '60px', // Ensure this matches LeftNavbar width
                        marginTop: '64px', // Adjust if TopNavbar height changes
                        padding: '16px', // Add padding as needed
                        overflowY: 'auto' // Ensure content scrolls if too long
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
