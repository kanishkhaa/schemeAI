const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const apiKey = process.env.GOOGLE_AI_API_KEY;
const dbName = 'datasets'; // Extracted from MONGODB_URI if needed

// Initialize Google AI
const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.json());

// Root route to handle GET /
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Scheme Suggestion API. Use /suggest/:userId to get scheme recommendations.' });
});

app.get('/suggest/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Fetch user data
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Preferred sector from profile
    let sector = user.profile?.preferredSector?.toLowerCase() || 'education';

    // Map to MongoDB collection
    const sectorCollections = {
      agriculture: 'agricultures',
      education: 'educations',
      healthcare: 'healthcares',
      'social-welfare': 'socialwelfares',
      transport: 'transports',
      women: 'womens'
    };
    const collectionName = sectorCollections[sector] || 'educations';

    // ✅ Fetch schemes only from that collection
    const schemes = await db.collection(collectionName).find({}).limit(50).toArray();

    if (!schemes.length) {
      return res.status(404).json({ error: `No schemes found for sector: ${sector}` });
    }

    // ✅ Use Gemini to refine/match schemes (optional)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      User data: ${JSON.stringify(user)},
      Sector: ${sector}.
      From the following list of schemes: ${JSON.stringify(schemes)},
      suggest the top 10 most relevant ones for this user.
      Output strictly as valid JSON (array of objects).
    `;

    const result = await model.generateContent(prompt);
    let responseText;
    if (typeof result.response.text === 'function') {
      responseText = result.response.text();
    } else {
      responseText = result.response.candidates[0].content.parts[0].text;
    }

    responseText = responseText.replace(/```json|```/g, '').trim();

    let suggestions;
    try {
      suggestions = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: 'Error parsing AI response', raw: responseText });
    }

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
