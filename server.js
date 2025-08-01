require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Comprehensive inappropriate words filter
const inappropriateWords = [
  // Basic profanity
  'damn', 'hell', 'crap', 'shit', 'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker',
  'ass', 'asshole', 'bitch', 'bastard', 'piss', 'pissed', 'whore', 'slut', 'dick', 'cock',
  'pussy', 'cunt', 'tits', 'boobs', 'penis', 'vagina', 'sex', 'sexual', 'porn', 'porno',
  
  // Sexual content and variations
  'cum', 'cumming', 'jizz', 'sperm', 'semen', 'ejaculate', 'climax', 'orgasm', 'masturbate',
  'masturbation', 'handjob', 'blowjob', 'fellatio', 'cunnilingus', 'threesome', 'gangbang',
  'bukkake', 'creampie', 'facial', 'deepthroat', 'anal', 'rimjob', 'pegging', 'fisting',
  'dildo', 'vibrator', 'fleshlight', 'condom', 'lube', 'lubricant', 'erection', 'boner',
  'hardon', 'member', 'shaft', 'glans', 'foreskin', 'circumcised', 'uncircumcised',
  'testicles', 'balls', 'scrotum', 'labia', 'clitoris', 'vulva', 'cervix', 'uterus',
  
  // Stronger profanity and slurs
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'gay', 'homo', 'lesbian',
  'tranny', 'transgender', 'queer', 'dyke', 'spic', 'wetback', 'chink', 'gook', 'jap',
  'kike', 'towelhead', 'sandnigger', 'raghead', 'cracker', 'honky', 'whitey',
  
  // Racial slurs and offensive terms
  'coon', 'jiggaboo', 'porch', 'monkey', 'ape', 'gorilla', 'thug', 'ghetto', 'hood',
  'welfare', 'foodstamps', 'section8', 'criminal', 'felon', 'gangster', 'drugdealer',
  'crackhead', 'savage', 'primitive', 'uncivilized', 'cotton', 'plantation', 'slave',
  'slavery', 'master', 'overseer', 'lynching', 'noose', 'rope', 'hanging', 'whipping',
  
  // Antisemitic and conspiracy terms
  'jew', 'jewish', 'zionist', 'zion', 'israel', 'israeli', 'holocaust', 'holohoax',
  'goyim', 'goy', 'shekel', 'shekels', 'globalist', 'illuminati', 'cabal', 'deepstate',
  'rothschild', 'soros', 'banker', 'usury', 'media', 'control', 'puppet', 'masters',
  'protocol', 'elders', 'conspiracy', 'lizard', 'reptilian', 'shapeshifter',
  
  // Anti-Islamic and terrorism related
  'muslim', 'islam', 'islamic', 'allah', 'mohammed', 'quran', 'koran', 'jihad', 'jihadist',
  'terrorist', 'terrorism', 'bomb', 'bomber', 'explosion', 'attack', 'suicide', 'martyr',
  'infidel', 'kafir', 'dhimmi', 'sharia', 'burqa', 'hijab', 'mosque', 'minaret',
  'radical', 'extremist', 'fundamentalist', 'caliphate', 'isis', 'taliban', 'alqaeda',
  
  // Hate speech and discriminatory terms
  'nazi', 'hitler', 'fascist', 'white', 'power', 'supremacist', 'kkk', 'clan', 'cross',
  'burning', 'swastika', 'heil', 'sieg', 'race', 'war', 'ethnic', 'cleansing', 'genocide',
  'kill', 'murder', 'rape', 'assault', 'violence', 'hate', 'racist', 'discrimination',
  'bigot', 'prejudice', 'intolerance', 'xenophobia', 'islamophobia', 'antisemitism',
  
  // Drugs and illegal activities
  'drugs', 'cocaine', 'heroin', 'meth', 'marijuana', 'weed', 'pot', 'high', 'stoned',
  'drunk', 'alcohol', 'beer', 'vodka', 'whiskey', 'wine', 'party', 'rave', 'ecstasy',
  'molly', 'acid', 'lsd', 'shrooms', 'mushrooms', 'pcp', 'crack', 'crystal', 'speed',
  'amphetamine', 'opioid', 'fentanyl', 'oxy', 'percocet', 'vicodin', 'xanax', 'adderall',
  
  // Inappropriate content
  'nude', 'naked', 'strip', 'stripper', 'escort', 'prostitute', 'brothel', 'adult',
  'xxx', 'nsfw', 'fetish', 'kinky', 'bdsm', 'horny', 'aroused', 'turned', 'wet',
  'hard', 'stiff', 'throbbing', 'pulsating', 'swollen', 'engorged', 'dripping',
  
  // Spam and scam related
  'casino', 'gambling', 'lottery', 'winner', 'prize', 'money', 'cash', 'bitcoin',
  'crypto', 'investment', 'loan', 'credit', 'debt', 'scam', 'fraud', 'phishing',
  'mlm', 'pyramid', 'scheme', 'ponzi', 'nigerian', 'prince', 'inheritance',
  
  // Religious mockery or offensive content
  'satan', 'devil', 'demon', 'occult', 'cult', 'blasphemy', 'sacrilege', 'profane',
  'antichrist', 'lucifer', 'beelzebub', 'damned', 'hellbound', 'heretic', 'infidel',
  
  // Additional inappropriate terms
  'stupid', 'idiot', 'moron', 'dumb', 'loser', 'pathetic', 'ugly', 'fat', 'skinny',
  'retarded', 'autistic', 'downie', 'mongoloid', 'spastic', 'cripple', 'gimp'
];

// Content filtering function
const containsInappropriateContent = (text) => {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return inappropriateWords.some(word => {
    // Check for exact word matches (with word boundaries)
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
};

// Special Scott message function
const getContentFilterMessage = (name, message) => {
  const combinedText = `${name} ${message || ''}`.toLowerCase();
  
  // Check if the name contains "scott" (case insensitive)
  if (name.toLowerCase().includes('scott')) {
    return {
      isFiltered: true,
      message: "Scott, what would your mother think?",
      link: "https://www.churchofjesuschrist.org/media/music/songs/if-the-savior-stood-beside-me?lang=eng",
      isScott: true
    };
  }
  
  // Check for inappropriate content
  if (containsInappropriateContent(combinedText)) {
    return {
      isFiltered: true,
      message: "Your message contains inappropriate content and cannot be posted.",
      isScott: false
    };
  }
  
  return { isFiltered: false };
};

// Initialize database table
const initDB = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

// API Routes
app.get('/api/guestbook', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 50'
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching guestbook entries:', err);
    res.status(500).json({ error: 'Failed to fetch guestbook entries' });
  }
});

app.post('/api/guestbook', async (req, res) => {
  const { name, message } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }
  
  if (message && message.length > 500) {
    return res.status(400).json({ error: 'Message must be less than 500 characters' });
  }
  
  // Check for inappropriate content
  const filterResult = getContentFilterMessage(name.trim(), message ? message.trim() : '');
  
  if (filterResult.isFiltered) {
    if (filterResult.isScott) {
      return res.status(400).json({ 
        error: filterResult.message,
        link: filterResult.link,
        isScott: true
      });
    } else {
      return res.status(400).json({ 
        error: filterResult.message,
        isScott: false
      });
    }
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO guestbook (name, message) VALUES ($1, $2) RETURNING *',
      [name.trim(), message ? message.trim() : null]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding guestbook entry:', err);
    res.status(500).json({ error: 'Failed to add guestbook entry' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const start = async () => {
  await initDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();