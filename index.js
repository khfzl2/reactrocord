const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'reactrocord-secret',
  resave: false,
  saveUninitialized: false
}));

// MongoDB connection
mongoose.connect('mongodb://localhost/reactrocord', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['owner', 'admin', 'user'], default: 'user' },
  nitroType: { type: String, enum: ['none', 'BasicoNitro', 'AdvancoNitro'], default: 'none' },
  reactroCoins: { type: Number, default: 0 },
  boosts: { type: Number, default: 0 },
  nitroExpiry: Date,
  servers: [String]
});

const User = mongoose.model('User', userSchema);

// Server Schema
const serverSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
  members: [String],
  boosts: { type: Number, default: 0 },
  bannedUsers: [String],
  warnedUsers: Map,
  timeoutUsers: Map
});

const Server = mongoose.model('Server', serverSchema);

// Initialize owner account
async function initializeOwner() {
  try {
    const ownerExists = await User.findOne({ username: 'Reactro_Editz' });
    if (!ownerExists) {
      const hashedPassword = await bcrypt.hash('gessey1125191514', 10);
      await User.create({
        username: 'Reactro_Editz',
        password: hashedPassword,
        role: 'owner',
        nitroType: 'AdvancoNitro',
        reactroCoins: 1000,
        boosts: 10
      });
      console.log('Owner account created successfully');
    }
  } catch (error) {
    console.error('Error creating owner account:', error);
  }
}

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    res.json({ success: true, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin routes
app.post('/admin/create', authMiddleware, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }

  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = await User.create({
      username,
      password: hashedPassword,
      role: 'admin',
      nitroType: 'BasicoNitro',
      reactroCoins: 500,
      boosts: 5
    });

    res.json({ success: true, admin: { username: newAdmin.username, role: newAdmin.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Moderation routes
app.post('/mod/ban/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const servers = await Server.find();
    await Promise.all(servers.map(server => {
      if (!server.bannedUsers.includes(req.params.userId)) {
        server.bannedUsers.push(req.params.userId);
        return server.save();
      }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Nitro routes
app.post('/nitro/redeem', authMiddleware, async (req, res) => {
  try {
    const { type } = req.body;
    const cost = type === 'BasicoNitro' ? 500 : 1000;
    
    if (req.user.reactroCoins < cost) {
      return res.status(400).json({ error: 'Insufficient Reactro-Coins' });
    }

    req.user.reactroCoins -= cost;
    req.user.nitroType = type;
    req.user.nitroExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    req.user.boosts += type === 'BasicoNitro' ? 1 : 2;
    
    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to redeem Nitro' });
  }
});

// Server listing route for owner
app.get('/servers', authMiddleware, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }

  try {
    const servers = await Server.find();
    res.json({ success: true, servers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Initialize and start server
async function startServer() {
  await initializeOwner();
  app.listen(port, () => {
    console.log(`Reactrocord server running on port ${port}`);
  });
}

startServer().catch(console.error);

module.exports = app;