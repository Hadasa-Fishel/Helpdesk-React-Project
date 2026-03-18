import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', padding: '0 !important' }}>
                    
                    <Typography 
                        variant="h6" 
                        component={RouterLink} 
                        to="/dashboard" 
                        sx={{ textDecoration: 'none', fontWeight: 800, color: 'primary.main' }}
                    >
                        Helpdesk<Box component="span" sx={{ color: 'text.primary' }}>PRO</Box>
                    </Typography>

                    {/* ניווט מרכזי */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button component={RouterLink} to="/dashboard" color="inherit">דשבורד</Button>
                        <Button component={RouterLink} to="/tickets" color="inherit">פניות</Button>
                        {auth?.user?.role === 'admin' && (
                            <>
                                <Button component={RouterLink} to="/users" color="inherit">משתמשים</Button>
                            </>
                        )}
                    </Box>

                    {/* אזור משתמש */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            שלום, {auth?.user?.name}
                        </Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            color="error" 
                            startIcon={<LogoutIcon />} 
                            onClick={handleLogout}
                        >
                            התנתק
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;