import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Paper, TextField, Button, Typography, Box, Alert, Snackbar, Stack 
} from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // נתיב הרשמה ללקוח (ללא טוקן)
            await apiRequest('/auth/register', 'POST', formData);
            setOpenSnackbar(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'שגיאה בתהליך ההרשמה');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>הרשמה</Typography>
                <Typography variant="body2" align="center" sx={{ mb: 3 }}>צור חשבון לקוח חדש במערכת</Typography>
                
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField fullWidth label="שם מלא" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField fullWidth label="אימייל" type="email" required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField fullWidth label="סיסמה" type="password" required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading}>
                            {isLoading ? 'נרשם...' : 'הירשם עכשיו'}
                        </Button>
                    </Stack>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>כבר יש לך חשבון? התחבר כאן</Link>
                </Box>
            </Paper>

            <Snackbar open={openSnackbar} autoHideDuration={3000}>
                <Alert severity="success" variant="filled">נרשמת בהצלחה! מעביר אותך להתחברות...</Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;