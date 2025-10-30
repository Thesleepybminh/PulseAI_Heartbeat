var express = require('express');
var rootRouter = express.Router();
const path = require('path');
const axios = require('axios');

/* GET home page. */
rootRouter.get('/', function (req, res, next) {
  const indexPath = path.join(__dirname, '..', '..', 'client', 'dist', 'index.html');
  res.sendFile(indexPath, function (err) {
    if (err) {
      next(err);
    }
  });
});

/* POST analyze health data */
rootRouter.post('/api/analyze', async function (req, res, next) {
  try {
    const { heartRate, age, gender, systolicBP, diastolicBP, weight, height } = req.body;

    console.log('📥 Received request body:', req.body);

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Build the prompt for AI
    const userPrompt = `tôi có các chỉ số sau: - Nhịp tim nghỉ: ${heartRate} bpm - Huyết áp: ${systolicBP}/${diastolicBP} mmHg - BMI: ${bmi} - Tuổi: ${age} - Giới tính: ${gender}. Các chỉ số này đang thế nào?`;

    // Logging for debugging
    console.log('📝 AI Prompt:', userPrompt);
    console.log('🌐 Calling RAGFlow API:', process.env.RAGFLOW_API_URL);

    // Call RAGFlow API
    const response = await axios.post(
      process.env.RAGFLOW_API_URL,
      {
        model: 'deepseek-chat@DeepSeek',
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 256,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RAGFLOW_API_KEY}`
        },
        timeout: 120000, // 2 minutes timeout (120 seconds)
        timeoutErrorMessage: 'RAGFlow API request timed out after 2 minutes'
      }
    );

    console.log('✅ RAGFlow API Response:', response.data);

    // Return AI response
    res.json({
      success: true,
      data: {
        bmi,
        aiResponse: response.data.choices[0].message.content,
        userInput: { heartRate, age, gender, systolicBP, diastolicBP, weight, height }
      }
    });

  } catch (error) {
    console.error('❌ Error calling RAGFlow API:', error.message);
    if (error.response) {
      console.error('📛 Response status:', error.response.status);
      console.error('📛 Response data:', error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to analyze health data',
      details: error.response?.data || error.message
    });
  }
});

module.exports = rootRouter;
