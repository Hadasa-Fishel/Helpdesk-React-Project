import { useState } from 'react';
import { apiRequest } from '../services/api';
import { 
    Box, TextField, Button, Typography, List, ListItem, 
    ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress, Paper 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const CommentsSection = ({ ticketId, comments, onCommentAdded }: any) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            await apiRequest(`/tickets/${ticketId}/comments`, 'POST', { content });
            setContent('');
            onCommentAdded(); // רענון הרשימה באמא
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                תגובות ועדכונים ({comments.length})
            </Typography>

            {/* רשימת תגובות [cite: 71] */}
            <List sx={{ mb: 4 }}>
                {comments.map((comment: any, index: number) => (
                    <Box key={comment.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>{comment.author_name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography fontWeight="bold">{comment.author_name}</Typography>}
                                secondary={
                                    <>
                                        <Typography variant="body2" color="text.primary" sx={{ my: 1 }}>
                                            {comment.content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.created_at).toLocaleString('he-IL')}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                ))}
                {comments.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        אין עדיין תגובות לפנייה זו.
                    </Typography>
                )}
            </List>

            {/* טופס הוספת תגובה [cite: 73] */}
            <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="כתבו תגובה או עדכון..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting || !content.trim()}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    >
                        שליחת תגובה
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CommentsSection;