import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Paper, TextField, Button, Typography, Box, Alert, 
    MenuItem, CircularProgress, Stack, Snackbar 
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminCreateUser = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agent' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // מצב עבור ההודעה הקופצת (Snackbar)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await apiRequest('/users', 'POST', formData);
            setOpenSnackbar(true); // פתיחת ההודעה היפה
            
            // נחכה שניה כדי שהמשתמש יראה את ההודעה לפני שנעבור דף
            setTimeout(() => {
                navigate('/users');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'שגיאה ביצירת המשתמש');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
                חזרה לניהול משתמשים
            </Button>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" fontWeight="800" color="primary" gutterBottom>
                        יצירת איש צוות חדש
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField fullWidth label="שם מלא" required value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField fullWidth label="כתובת אימייל" type="email" required value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField fullWidth label="סיסמה זמנית" type="password" required value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <TextField fullWidth select label="תפקיד" required value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <MenuItem value="agent">סוכן (Agent)</MenuItem>
                            <MenuItem value="admin">מנהל (Admin)</MenuItem>
                            <MenuItem value="customer">לקוח (Customer)</MenuItem>
                        </TextField>

                        {error && <Alert severity="error">{error}</Alert>}

                        <Button
                            fullWidth type="submit" variant="contained" size="large"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddAlt1Icon />}
                            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                        >
                            {isLoading ? 'יוצר משתמש...' : 'צור משתמש'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* רכיב ההודעה הקופצת (Snackbar) */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // מיקום בצד
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
                    המשתמש {formData.name} נוסף בהצלחה למערכת!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminCreateUser;