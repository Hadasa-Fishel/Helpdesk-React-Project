import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress 
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        auth?.login(data.user, data.token);
        navigate('/dashboard');
    } catch (err: any) {
        setError('אימייל או סיסמה לא נכונים');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    /* Box חיצוני שדואג למרכוז מלא (אנכי ואופקי) על כל המסך */
    <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f4f6f8' // רקע אפרפר עדין שגורם לכרטיס הלבן לבלוט
    }}>
      <Container maxWidth="xs">
        {/* ה-Paper יוצר את אפקט הכרטיס עם המסגרת והצל */}
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="800" color="primary" gutterBottom>
              Helpdesk PRO
            </Typography>
            <Typography variant="body1" color="text.secondary">
              התחברי למערכת הניהול
            </Typography>
          </Box>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="אימייל"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="סיסמה"
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <Alert severity="error" sx={{ mt: 2, textAlign: 'right' }}>{error}</Alert>}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{ mt: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              {isLoading ? 'מתחבר...' : 'התחברות'}
            </Button>
          </form>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
                עוד לא רשומה? 
                <Button color="primary" onClick={() => navigate('/register')} sx={{ fontWeight: 'bold' }}>
                    צרי חשבון חדש
                </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;