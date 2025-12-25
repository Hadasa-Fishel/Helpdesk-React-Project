import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
    // שליפת המשתמש מהקונטקסט
    const user = auth?.user;

    // פונקציית התנתקות
    const handleLogout = () => {
        auth?.logout();
        navigate('/login'); // שליחה לדף ההתחברות אחרי הניתוק
    };

    if (!user) {
        return <div style={{ padding: '20px' }}>טוען נתוני משתמש...</div>;
    }

    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '40px auto', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>פרופיל אישי</h1>
            
            <div style={{ lineHeight: '2', fontSize: '1.1rem' }}>
                <p><strong>מזהה מערכת:</strong> {user.id}</p>
                <p><strong>שם מלא:</strong> {user.name}</p>
                <p><strong>אימייל:</strong> {user.email}</p>
                <p><strong>תפקיד:</strong> 
                    <span style={{ 
                        marginRight: '10px', 
                        padding: '4px 12px', 
                        backgroundColor: '#eef2ff', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem',
                        color: '#4f46e5' 
                    }}>
                        {user.role}
                    </span>
                </p>
                <p><strong>תאריך הצטרפות:</strong> {new Date(user.created_at).toLocaleDateString('he-IL')}</p>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                    חזרה לדשבורד
                </button>
                
                <button 
                    onClick={handleLogout}
                    style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
                >
                    התנתק מהמערכת
                </button>
            </div>
        </div>
    );
};

export default Profile;
