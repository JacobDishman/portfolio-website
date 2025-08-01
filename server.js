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

// Ultra-comprehensive inappropriate words filter - always lean on safe side
const inappropriateWords = [
  // Basic profanity
  'damn', 'hell', 'crap', 'shit', 'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker',
  'ass', 'asshole', 'bitch', 'bastard', 'piss', 'pissed', 'whore', 'slut', 'dick', 'cock',
  'pussy', 'cunt', 'tits', 'boobs', 'penis', 'vagina', 'sex', 'sexual', 'porn', 'porno',
  
  // Childish inappropriate terms
  'peepee', 'pee', 'peeing', 'poopoo', 'poop', 'pooping', 'doodoo', 'weiner', 'ween',
  'wiener', 'wienie', 'pp', 'balls', 'ballsack', 'nutsack', 'nuts', 'jewels', 'crown',
  'sack', 'hairy', 'finger', 'fingering', 'touch', 'touching', 'private', 'parts',
  'bottom', 'butt', 'butthole', 'bum', 'rear', 'behind', 'booty', 'bootie', 'tush',
  'fart', 'farting', 'gas', 'stinky', 'smelly', 'underwear', 'panties', 'bra', 'naked',
  
  // Sexual content and variations
  'cum', 'cumming', 'jizz', 'sperm', 'semen', 'ejaculate', 'climax', 'orgasm', 'masturbate',
  'masturbation', 'handjob', 'blowjob', 'fellatio', 'cunnilingus', 'threesome', 'gangbang',
  'bukkake', 'creampie', 'facial', 'deepthroat', 'anal', 'rimjob', 'pegging', 'fisting',
  'dildo', 'vibrator', 'fleshlight', 'condom', 'lube', 'lubricant', 'erection', 'boner',
  'hardon', 'member', 'shaft', 'glans', 'foreskin', 'circumcised', 'uncircumcised',
  'testicles', 'scrotum', 'labia', 'clitoris', 'vulva', 'cervix', 'uterus', 'rope',
  'ropes', 'white', 'sticky', 'fluid', 'load', 'shoot', 'shooting', 'squirt', 'spray',
  
  // Stronger profanity and slurs
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded', 'gay', 'homo', 'lesbian',
  'tranny', 'transgender', 'queer', 'dyke', 'spic', 'wetback', 'chink', 'gook', 'jap',
  'kike', 'towelhead', 'sandnigger', 'raghead', 'cracker', 'honky', 'whitey',
  
  // Racial slurs and offensive terms
  'coon', 'jiggaboo', 'porch', 'monkey', 'ape', 'gorilla', 'thug', 'ghetto', 'hood',
  'welfare', 'foodstamps', 'section8', 'criminal', 'felon', 'gangster', 'drugdealer',
  'crackhead', 'savage', 'primitive', 'uncivilized', 'cotton', 'plantation', 'slave',
  'slavery', 'master', 'overseer', 'lynching', 'noose', 'hanging', 'whipping',
  
  // Nazi and Holocaust terms - always filter
  'adolf', 'hitler', 'ah', 'nazi', 'nsdap', 'third', 'reich', 'fuhrer', 'fuehrer',
  'himmler', 'goebbels', 'mengele', 'eichmann', 'auschwitz', 'dachau', 'bergen',
  'treblinka', 'sobibor', 'final', 'solution', 'kristallnacht', 'anschluss', 'lebensraum',
  'aryan', 'master', 'race', 'untermensch', 'judenfrei', 'judenrein', 'einsatzgruppen',
  'wannsee', 'conference', 'zyklon', 'gas', 'chamber', 'crematorium', 'selection',
  'deportation', 'ghetto', 'star', 'david', 'badge', 'yellow', 'armband', 'kapo',
  'sonderkommando', 'appell', 'blockaltester', 'lageraltester', 'oberkapo', 'ss',
  'gestapo', 'sd', 'sa', 'brownshirts', 'blackshirts', 'sturmabteilung', 'schutzstaffel',
  'waffen', 'totenkopf', 'deaths', 'head', 'skull', 'bones', 'lightning', 'bolts',
  'runes', 'sig', 'sowilo', 'othala', 'algiz', 'tiwaz', 'thurisaz', 'ingwaz',
  '1488', '14', '88', 'hh', 'wpww', 'rahowa', 'zog', 'jog', 'mud', 'nog',
  
  // Antisemitic and conspiracy terms
  'jew', 'jewish', 'zionist', 'zion', 'israel', 'israeli', 'holocaust', 'holohoax',
  'goyim', 'goy', 'shekel', 'shekels', 'globalist', 'illuminati', 'cabal', 'deepstate',
  'rothschild', 'soros', 'banker', 'usury', 'media', 'control', 'puppet', 'masters',
  'protocol', 'elders', 'conspiracy', 'lizard', 'reptilian', 'shapeshifter', 'khazar',
  'talmud', 'synagogue', 'rabbi', 'kosher', 'gentile', 'shabbos', 'sabbath', 'passover',
  
  // Anti-Islamic and terrorism related
  'muslim', 'islam', 'islamic', 'allah', 'mohammed', 'quran', 'koran', 'jihad', 'jihadist',
  'terrorist', 'terrorism', 'bomb', 'bomber', 'explosion', 'attack', 'suicide', 'martyr',
  'infidel', 'kafir', 'dhimmi', 'sharia', 'burqa', 'hijab', 'mosque', 'minaret',
  'radical', 'extremist', 'fundamentalist', 'caliphate', 'isis', 'taliban', 'alqaeda',
  'osama', 'laden', 'zawahiri', 'baghdadi', 'mullah', 'imam', 'madrassah', 'madrassa',
  
  // Hate speech and discriminatory terms
  'fascist', 'power', 'supremacist', 'kkk', 'klan', 'clan', 'cross', 'burning',
  'swastika', 'heil', 'sieg', 'war', 'ethnic', 'cleansing', 'genocide', 'pogrom',
  'kill', 'murder', 'rape', 'assault', 'violence', 'hate', 'racist', 'discrimination',
  'bigot', 'prejudice', 'intolerance', 'xenophobia', 'islamophobia', 'antisemitism',
  'homophobia', 'transphobia', 'misogyny', 'sexism', 'ableism', 'classism',
  
  // Drugs and illegal activities
  'drugs', 'cocaine', 'heroin', 'meth', 'marijuana', 'weed', 'pot', 'high', 'stoned',
  'drunk', 'alcohol', 'beer', 'vodka', 'whiskey', 'wine', 'party', 'rave', 'ecstasy',
  'molly', 'acid', 'lsd', 'shrooms', 'mushrooms', 'pcp', 'crack', 'crystal', 'speed',
  'amphetamine', 'opioid', 'fentanyl', 'oxy', 'percocet', 'vicodin', 'xanax', 'adderall',
  'dope', 'smack', 'blow', 'snow', 'coke', 'hash', 'ganja', 'grass', 'mary', 'jane',
  
  // Inappropriate content
  'nude', 'naked', 'strip', 'stripper', 'escort', 'prostitute', 'brothel', 'adult',
  'xxx', 'nsfw', 'fetish', 'kinky', 'bdsm', 'horny', 'aroused', 'turned', 'wet',
  'hard', 'stiff', 'throbbing', 'pulsating', 'swollen', 'engorged', 'dripping',
  'penetrate', 'penetration', 'insertion', 'thrust', 'thrusting', 'grinding', 'humping',
  
  // Body parts that could be inappropriate
  'breast', 'breasts', 'nipple', 'nipples', 'areola', 'bosom', 'cleavage', 'chest',
  'thigh', 'thighs', 'crotch', 'groin', 'pubic', 'genital', 'genitals', 'intimate',
  
  // Spam and scam related
  'casino', 'gambling', 'lottery', 'winner', 'prize', 'money', 'cash', 'bitcoin',
  'crypto', 'investment', 'loan', 'credit', 'debt', 'scam', 'fraud', 'phishing',
  'mlm', 'pyramid', 'scheme', 'ponzi', 'nigerian', 'prince', 'inheritance', 'paypal',
  
  // Religious mockery or offensive content
  'satan', 'devil', 'demon', 'occult', 'cult', 'blasphemy', 'sacrilege', 'profane',
  'antichrist', 'lucifer', 'beelzebub', 'damned', 'hellbound', 'heretic',
  
  // Violence and weapons
  'gun', 'rifle', 'pistol', 'weapon', 'shoot', 'shooting', 'knife', 'stab', 'stabbing',
  'blade', 'cut', 'cutting', 'slice', 'choke', 'strangle', 'suffocate', 'drown',
  'poison', 'toxic', 'deadly', 'lethal', 'fatal', 'death', 'die', 'dying', 'dead',
  
  // Additional inappropriate terms - lean safe
  'stupid', 'idiot', 'moron', 'dumb', 'loser', 'pathetic', 'ugly', 'fat', 'skinny',
  'retarded', 'autistic', 'downie', 'mongoloid', 'spastic', 'cripple', 'gimp', 'lame',
  'freak', 'weirdo', 'creep', 'pervert', 'sicko', 'psycho', 'crazy', 'insane', 'mental',
  
  // Misconstruable terms
  'touch', 'feel', 'rub', 'stroke', 'caress', 'fondle', 'grope', 'squeeze', 'grab',
  'hold', 'grip', 'tight', 'loose', 'spread', 'open', 'close', 'insert', 'put', 'stick',
  'poke', 'prod', 'push', 'pull', 'slide', 'slip', 'enter', 'exit', 'in', 'out', 'deep',
  'shallow', 'up', 'down', 'back', 'forth', 'around', 'inside', 'outside', 'between'
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

// Special Scott message function - EVERYONE gets the Scott treatment for inappropriate content
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
  
  // Check for inappropriate content - EVERYONE gets the Scott message and hymn link
  if (containsInappropriateContent(combinedText)) {
    return {
      isFiltered: true,
      message: "Scott, what would your mother think?",
      link: "https://www.churchofjesuschrist.org/media/music/songs/if-the-savior-stood-beside-me?lang=eng",
      isScott: true  // Everyone is treated like Scott for inappropriate content
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