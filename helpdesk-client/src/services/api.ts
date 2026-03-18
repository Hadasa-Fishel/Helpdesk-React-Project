// src/services/api.ts
const BASE_URL = 'http://localhost:4000';

export const apiRequest = async (endpoint: string, method: string = 'GET', body?: any) => {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        // ניסיון לחלץ הודעת שגיאה מהשרת
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'שגיאה בתקשורת עם השרת');
    }

    return response.json();
};