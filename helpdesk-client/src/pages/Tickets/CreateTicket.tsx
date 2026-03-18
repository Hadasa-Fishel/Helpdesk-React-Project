import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Paper, Typography, TextField, Button, Alert, 
    CircularProgress, MenuItem, Stack, Snackbar 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const CreateTicket = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    // עדיפות ברירת מחדל היא 1 (Low)
    const [priorityId, setPriorityId] = useState(1); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // ולידציה בסיסית
        if (!subject.trim() || !description.trim()) {
            setError("חובה למלא את כל השדות");
            return;
        }

        try {
            setIsLoading(true);
            // שליחת הבקשה כולל ה-priority_id שבחרנו
            await apiRequest('/tickets', 'POST', { 
                subject, 
                description, 
                priority_id: priorityId 
            });
            
            setOpenSnackbar(true); // הצגת הודעה יפה
            
            // מעבר דף לאחר השהיה קצרה כדי שיראו את ההודעה
            setTimeout(() => {
                navigate('/tickets');
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom align="center">פתיחת פנייה חדשה</Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    תארי את הבעיה בצורה ברורה כדי שנוכל לעזור מהר ככל האפשר
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth label="נושא הפנייה" variant="outlined" required
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value); setError(null); }}
                            error={!!error && !subject}
                        />

                        {/* שדה בחירת עדיפות - חדש! */}
                        <TextField
                            select
                            fullWidth
                            label="רמת דחיפות (Priority)"
                            value={priorityId}
                            onChange={(e) => setPriorityId(Number(e.target.value))}
                        >
                            <MenuItem value={1}>Low (נמוכה)</MenuItem>
                            <MenuItem value={2}>Medium (בינונית)</MenuItem>
                            <MenuItem value={3}>Large (גבוהה)</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth label="תיאור מפורט" variant="outlined" required
                            multiline rows={4}
                            value={description}
                            onChange={(e) => { setDescription(e.target.value); setError(null); }}
                            error={!!error && !description}
                        />

                        {error && <Alert severity="error">{error}</Alert>}

                        <Button
                            fullWidth type="submit" variant="contained" size="large"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                        >
                            {isLoading ? 'שולח...' : 'צור פנייה'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* הודעת הצלחה קופצת (Snackbar) */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    הפנייה נוצרה בהצלחה!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateTicket;