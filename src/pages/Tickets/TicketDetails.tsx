import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { apiRequest } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { 
    Container, Paper, Typography, Box, Divider, Chip, Button, 
    CircularProgress, Alert, Stack, Card, Snackbar,
    MenuItem, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommentsSection from '../../components/CommentsSection';

const TicketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<any>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const { register, handleSubmit, reset } = useForm();

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const [ticketData, commentsData, usersData] = await Promise.all([
                apiRequest(`/tickets/${id}`),
                apiRequest(`/tickets/${id}/comments`),
                auth?.user?.role === 'admin' ? apiRequest('/users') : Promise.resolve([])
            ]);

            setTicket({ ...ticketData, comments: commentsData });
            if (usersData) {
                setAgents(usersData.filter((u: any) => u.role === 'agent' || u.role === 'admin'));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id, auth?.user?.role]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleStatusChange = async (newStatusId: number) => {
        try {
            await apiRequest(`/tickets/${id}`, 'PATCH', { status_id: newStatusId }); //
            setSnackbar({ open: true, message: 'הסטטוס עודכן!', severity: 'success' });
            loadData();
        } catch (err: any) {
            setSnackbar({ open: true, message: 'שגיאה בעדכון', severity: 'error' });
        }
    };

    const onAssignAgent = async (data: any) => {
        try {
            await apiRequest(`/tickets/${id}`, 'PATCH', { assigned_to: data.agentId });
            setSnackbar({ open: true, message: 'הוקצה בהצלחה', severity: 'success' });
            loadData();
            reset();
        } catch (err: any) {
            setSnackbar({ open: true, message: 'שגיאה בהקצאה', severity: 'error' });
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={30} /></Box>;
    if (error) return <Container sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/tickets')} 
                sx={{ mb: 2, color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem' }}
            >
                חזרה לרשימה
            </Button>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eef0f2' }}>
                
                {/* כותרת הדף */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="900" gutterBottom>{ticket.subject}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={ticket.status_name} size="small" sx={{ bgcolor: '#f0f7ff', color: '#1976d2', fontWeight: 700 }} />
                        <Chip label={ticket.priority_name} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        #{ticket.id} | {new Date(ticket.created_at).toLocaleDateString('he-IL')}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* תיאור */}
                <Box sx={{ p: 2.5, bgcolor: '#f9fafb', borderRadius: 3, mb: 4 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#374151' }}>
                        {ticket.description}
                    </Typography>
                </Box>

                {/* --- אזור ניהול (מיושר וסימטרי) --- */}
                {(auth?.user?.role === 'agent' || auth?.user?.role === 'admin') && ( //
                    <Box sx={{ mt: 4, p: 3, border: '1px solid #f0f0f0', borderRadius: 3, bgcolor: '#ffffff' }}>
                        <Typography variant="caption" fontWeight="800" sx={{ display: 'block', mb: 2, color: 'text.secondary', textTransform: 'uppercase' }}>
                            ניהול סטטוס:
                        </Typography>
                        
                        {/* כאן התיקון לסימטריה: הכפתורים מחולקים שווה בשורה */}
                        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
                            <Button 
                                fullWidth variant="outlined" color="success" size="small" 
                                onClick={() => handleStatusChange(1)}
                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                            >
                                פתוח
                            </Button>
                            <Button 
                                fullWidth variant="outlined" color="primary" size="small" 
                                onClick={() => handleStatusChange(3)}
                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                            >
                                בטיפול
                            </Button>
                            <Button 
                                fullWidth variant="outlined" color="inherit" size="small" 
                                onClick={() => handleStatusChange(2)}
                                sx={{ borderRadius: 2, fontWeight: 'bold', color: 'text.secondary' }}
                            >
                                סגור
                            </Button>
                        </Stack>

                        {/* הקצאה לסוכן - רק למנהל */}
                        {auth?.user?.role === 'admin' && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="caption" fontWeight="800" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                                    הקצאה לצוות:
                                </Typography>
                                <Stack component="form" onSubmit={handleSubmit(onAssignAgent)} direction="row" spacing={1}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="סוכן מטפל"
                                        {...register('agentId', { required: true })}
                                    >
                                        {agents.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                                    </TextField>
                                    <Button type="submit" variant="contained" disableElevation size="small" sx={{ px: 3, borderRadius: 2 }}>
                                        <PersonAddIcon fontSize="small" />
                                    </Button>
                                </Stack>
                            </>
                        )}
                    </Box>
                )}

                <Box sx={{ mt: 5 }}>
                    <Typography variant="subtitle2" fontWeight="900" sx={{ mb: 2 }}>שיחת תמיכה</Typography>
                    <CommentsSection ticketId={id!} comments={ticket.comments || []} onCommentAdded={loadData} />
                </Box>
            </Paper>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TicketDetails;