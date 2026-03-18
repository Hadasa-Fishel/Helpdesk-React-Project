import { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Typography, Box, TextField, Card, CardContent, 
    Chip, Button, CircularProgress, MenuItem, Stack, Divider 
} from '@mui/material';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Tickets = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const user = auth?.user;

    const loadTickets = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await apiRequest('/tickets');
            setTickets(data);
        } catch (err: any) {
            Swal.fire({
                title: 'שגיאה',
                text: err.message || 'תקלה בטעינת הנתונים',
                icon: 'error',
                confirmButtonColor: '#1976d2'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadTickets(); }, [loadTickets]);

    // תיקון לוגיקת הסינון: איחוד "בטיפול" ו"בבדיקה"
    const filteredTickets = tickets.filter(t => {
        const subject = t.subject.toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = subject.includes(search);
        
        if (filterStatus === 'all') return matchesSearch;

        // אם המשתמש בחר "בטיפול", נציג גם את מה שמוגדר כ"בבדיקה" בשרת
        if (filterStatus === 'in_progress') {
            const status = t.status_name?.toLowerCase() || '';
            return matchesSearch && (status === 'in_progress' || status === 'בבדיקה' || status === 'בטיפול' || status === 'under review');
        }

        return matchesSearch && t.status_name === filterStatus;
    });

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={30} /></Box>;

    return (
        <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
            {/* כותרת הדף */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Typography variant="h4" fontWeight="900" sx={{ color: '#1a2027' }}>
                    {user?.role === 'admin' ? 'ניהול פניות' : 'הפניות שלי'}
                </Typography>
                
                {user?.role === 'customer' && (
                    <Button 
                        variant="contained" 
                        disableElevation
                        onClick={() => navigate('/tickets/new')}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                    >
                        פנייה חדשה
                    </Button>
                )}
            </Box>

            {/* חיפוש וסינון */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <TextField 
                    fullWidth 
                    size="small"
                    placeholder="חיפוש חופשי..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TextField
                    select
                    size="small"
                    label="סינון לפי סטטוס"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="all">הכל</MenuItem>
                    <MenuItem value="open">פתוח</MenuItem>
                    <MenuItem value="in_progress">בטיפול / בבדיקה</MenuItem>
                    <MenuItem value="closed">סגור</MenuItem>
                </TextField>
            </Stack>

            {/* רשימת כרטיסים - ללא צבעים מודגשים בצד */}
            <Stack spacing={3}>
                {filteredTickets.map(t => (
                    <Card 
                        key={t.id} 
                        elevation={0}
                        sx={{ 
                            borderRadius: 3, 
                            border: '1px solid #e0e4e8',
                            bgcolor: '#ffffff'
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Typography variant="h6" fontWeight="800" sx={{ color: '#2d3436' }}>
                                            {t.subject}
                                        </Typography>
                                        <Chip 
                                            label={t.status_name} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600, fontSize: '0.7rem' }} 
                                        />
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        מזהה: #{t.id} | תאריך: {new Date(t.created_at).toLocaleDateString('he-IL')}
                                    </Typography>

                                    <Stack direction="row" spacing={1}>
                                        <Chip label={`עדיפות: ${t.priority_name}`} size="small" sx={{ bgcolor: '#f5f5f5' }} />
                                        <Chip label={`מטפל: ${t.assigned_to_name || 'טרם הוקצה'}`} size="small" sx={{ bgcolor: '#f5f5f5' }} />
                                    </Stack>
                                </Box>

                                {/* כפתור צפייה ייעודי - הכרטיס עצמו לא לחיץ */}
                                <Box sx={{ ml: 2 }}>
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/tickets/${t.id}`)}
                                        sx={{ 
                                            borderRadius: 2, 
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            borderColor: '#dcdde1',
                                            color: '#2f3640',
                                            '&:hover': { borderColor: '#1976d2', bgcolor: '#f0f7ff' }
                                        }}
                                    >
                                        צפייה בפרטים
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {filteredTickets.length === 0 && (
                    <Typography align="center" color="text.secondary" sx={{ py: 10 }}>
                        לא נמצאו פניות העונות על נתוני הסינון
                    </Typography>
                )}
            </Stack>
        </Container>
    );
};

export default Tickets;