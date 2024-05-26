import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const API_KEY = process.env.API_KEY;

export const handleChatRequest = async (req, res) => {
  const userMessage = req.body.message;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ]
    })
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching from OpenAI API:", error);
    res.status(500).json({ error: "Error fetching from OpenAI API" });
  }
};
