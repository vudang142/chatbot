// server.js - Tạo file này để làm backend
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint để gọi ChatGPT
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // Gọi API của OpenAI
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // hoặc gpt-4 nếu bạn có quyền truy cập
                messages: [
                    { role: 'system', content: 'Bạn là Valen, một trợ lý AI hữu ích.' },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Trích xuất câu trả lời
        const reply = response.data.choices[0].message.content;
        
        // Gửi lại cho client
        res.json({ reply });
    } catch (error) {
        console.error('Error calling OpenAI:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Có lỗi khi gọi API.',
            details: error.message 
        });
    }
});

// Tuyến đường chính gửi file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});