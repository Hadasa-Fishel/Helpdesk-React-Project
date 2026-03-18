import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { 
    Container, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip, CircularProgress, Box, Alert, Button 
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiRequest('/users');
                setUsers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error'; // אדום למנהל
            case 'agent': return 'warning'; // כתום לסוכן
            default: return 'info'; // כחול ללקוח
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* שורת כותרת עם כפתור הוספה למנהל [cite: 40, 116] */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="800">ניהול משתמשים</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PersonAddIcon />}
                    onClick={() => navigate('/admin/create-user')}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                >
                    הוספת איש צוות
                </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>שם מלא</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>אימייל</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>תפקיד</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>סטטוס</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} hover>
                                <TableCell>#{u.id}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={u.role.toUpperCase()} 
                                        size="small" 
                                        color={getRoleColor(u.role) as any} 
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {u.is_active ? 
                                        <Chip label="פעיל" size="small" variant="outlined" color="success" /> : 
                                        <Chip label="מושעה" size="small" variant="outlined" color="error" />
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.length === 0 && (
                    <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        אין משתמשים להצגה במערכת.
                    </Typography>
                )}
            </TableContainer>
        </Container>
    );
};

export default Users;