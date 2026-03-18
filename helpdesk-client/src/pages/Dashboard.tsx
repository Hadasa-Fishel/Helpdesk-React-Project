import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box, Divider } from '@mui/material';

const Dashboard = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const user = auth?.user;

    // פונקציה לקביעת כותרת כרטיס הפניות לפי תפקיד המשתמש
    const getTicketTitle = () => {
        if (user?.role === 'admin') return 'ניהול כל הפניות במערכת';
        if (user?.role === 'agent') return 'פניות בטיפולי';
        return 'הפניות שלי'; // ברירת מחדל ללקוח
    };

    // רכיב כרטיס מעוצב ומינימליסטי
    const DashboardCard = ({ title, subtitle, onClick, accentColor }: any) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
                elevation={0} 
                sx={{ 
                    borderRadius: 4, 
                    border: '1px solid #e0e4e8',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                        borderColor: accentColor
                    },
                    '&::before': { // פס צבע עדין למעלה
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        backgroundColor: accentColor
                    }
                }}
            >
                <CardActionArea onClick={onClick} sx={{ p: 3, pt: 4 }}>
                    <CardContent sx={{ p: 0 }}>
                        <Typography variant="h6" fontWeight="800" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            {/* אזור ברכה אישי */}
            <Box sx={{ mb: 6, textAlign: 'right' }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#1a2027', mb: 1 }}>
                    שלום, {user?.name}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    ברוך הבא למערכת ה-Helpdesk. התפקיד שלך: 
                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, mr: 1 }}>
                         {user?.role === 'admin' ? 'מנהל מערכת' : user?.role === 'agent' ? 'סוכן תמיכה' : 'לקוח'}
                    </Box>
                </Typography>
            </Box>

            <Divider sx={{ mb: 6, opacity: 0.6 }} />

            {/* פריסת הכרטיסים */}
            <Grid container spacing={4}>
                
                {/* כרטיס הפניות - כותרת משתנה לפי תפקיד */}
                <DashboardCard 
                    title={getTicketTitle()} 
                    subtitle="צפייה, מעקב וניהול סטטוס פניות"
                    onClick={() => navigate('/tickets')} 
                    accentColor="#1976d2"
                />
                
                {/* הצגת כרטיס פתיחת פנייה ללקוח בלבד */}
                {user?.role === 'customer' && (
                    <DashboardCard 
                        title="פתיחת פנייה חדשה" 
                        subtitle="יש לך שאלה או תקלה? אנחנו כאן לעזור"
                        onClick={() => navigate('/tickets/new')} 
                        accentColor="#2e7d32"
                    />
                )}

                {/* הצגת כרטיס ניהול משתמשים למנהל בלבד */}
                {user?.role === 'admin' && (
                    <DashboardCard 
                        title="ניהול משתמשים" 
                        subtitle="הוספה ועריכה של צוות התמיכה והלקוחות"
                        onClick={() => navigate('/users')} 
                        accentColor="#ed6c02"
                    />
                )}

            </Grid>
        </Container>
    );
};

export default Dashboard;