import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { 
    Container, Paper, Typography, Box, Divider, Chip, Button, 
    CircularProgress, Alert, Stack, Card, CardContent 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentsSection from '../../components/CommentsSection';

const TicketDetails = () => {
    const { id } = useParams<{ id: string }>();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // טעינת פרטי הטיקט והתגובות מהשרת [cite: 70, 71]
    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const [ticketData, commentsData] = await Promise.all([
                apiRequest(`/tickets/${id}`),
                apiRequest(`/tickets/${id}/comments`)
            ]);
            setTicket({ ...ticketData, comments: commentsData });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (newStatusId: number) => {
        try {
            await apiRequest(`/tickets/${id}`, 'PATCH', { status_id: newStatusId });
            loadData(); 
        } catch (err: any) {
            alert("שגיאה בעדכון הסטטוס: " + err.message);
        }
    };

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    if (!ticket) return <Typography sx={{ mt: 4 }} align="center">הפנייה לא נמצאה</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/tickets')} 
                sx={{ mb: 3 }}
            >
                חזרה לרשימת הפניות
            </Button>

            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="800" gutterBottom>
                            {ticket.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            מזהה פנייה: #{ticket.id} | עודכן לאחרונה: {new Date(ticket.updated_at).toLocaleString('he-IL')}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Chip label={ticket.priority_name} color="secondary" variant="outlined" />
                        <Chip label={ticket.status_name} color="primary" />
                    </Stack>
                </Box>

                {(auth?.user?.role === 'agent' || auth?.user?.role === 'admin') && (
                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f0f7ff', borderRadius: 2, border: '1px solid #cce3ff' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                            ניהול סטטוס פנייה:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" color="success" onClick={() => handleStatusChange(1)}>פתח מחדש</Button>
                            <Button size="small" variant="outlined" color="primary" onClick={() => handleStatusChange(2)}>העבר לטיפול</Button>
                            <Button size="small" variant="outlined" color="inherit" onClick={() => handleStatusChange(3)}>סגור פנייה</Button>
                        </Stack>
                    </Box>
                )}

                <Card variant="outlined" sx={{ mb: 4, bgcolor: '#fafafa' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>תיאור הבעיה:</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {ticket.description}
                        </Typography>
                    </CardContent>
                </Card>

                <Divider sx={{ my: 4 }} />

                <CommentsSection 
                    ticketId={id} 
                    comments={ticket.comments} 
                    onCommentAdded={loadData} 
                />
            </Paper>
        </Container>
    );
};

export default TicketDetails;