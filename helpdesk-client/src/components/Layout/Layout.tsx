import { useContext, type ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);

    if (!auth?.isAuthenticated) {
        return <Box component="main" sx={{ minHeight: '100vh' }}>{children}</Box>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <CssBaseline /> {/* מאפס הגדרות CSS של הדפדפן למראה אחיד */}
            <Header />
            <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 5 }}>
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;