const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const AuthService = require('./services/AuthService').default;
const AdminService = require('./services/AdminService').default;
const NitroService = require('./services/NitroService').default;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Initialize services
const authService = new AuthService();
const adminService = new AdminService();
const nitroService = new NitroService();

// Initialize owner account
authService.initializeOwnerAccount();

// Main HTML template
app.get('/', (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reactrocord Dashboard</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #36393f;
                    color: #fff;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header {
                    background: #202225;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .card {
                    background: #2f3136;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .repo-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .repo-card {
                    background: #40444b;
                    padding: 15px;
                    border-radius: 5px;
                }
                .button {
                    background: #5865f2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .button:hover {
                    background: #4752c4;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reactrocord Dashboard</h1>
                    <div id="datetime"></div>
                </div>
                
                <div class="card">
                    <h2>User Information</h2>
                    <p>Current User: khfzl2</p>
                    <p>Role: Owner</p>
                    <p>Nitro Status: ReactroNitro Active</p>
                    <p>Reactro-Coins: <span id="coins">1000</span></p>
                </div>

                <div class="card">
                    <h2>Your Repositories</h2>
                    <div class="repo-list">
                        <div class="repo-card">
                            <h3>khfzl2/bot</h3>
                            <a href="https://github.com/khfzl2/bot" class="button">View Repository</a>
                        </div>
                        <div class="repo-card">
                            <h3>khfzl2/reactrocord</h3>
                            <a href="https://github.com/khfzl2/reactrocord" class="button">View Repository</a>
                        </div>
                        <div class="repo-card">
                            <h3>khfzl2/botagain</h3>
                            <a href="https://github.com/khfzl2/botagain" class="button">View Repository</a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2>Admin Controls</h2>
                    <button class="button" onclick="showServers()">View All Servers</button>
                    <button class="button" onclick="showUsers()">Manage Users</button>
                </div>
            </div>

            <script>
                // Update datetime
                function updateDateTime() {
                    const now = new Date();
                    const formatted = now.toISOString().replace('T', ' ').substr(0, 19);
                    document.getElementById('datetime').textContent = formatted;
                }
                
                setInterval(updateDateTime, 1000);
                updateDateTime();

                // Admin functions
                function showServers() {
                    alert('Feature coming soon: View all Reactrocord servers');
                }

                function showUsers() {
                    alert('Feature coming soon: Manage users globally');
                }
            </script>
        </body>
        </html>
    `;
    res.send(html);
});

// API Endpoints
app.post('/api/admin/ban', async (req, res) => {
    const { adminId, userId } = req.body;
    const result = await adminService.banUser(adminId, userId);
    res.json({ success: result });
});

app.post('/api/admin/warn', async (req, res) => {
    const { adminId, userId } = req.body;
    const result = await adminService.warnUser(adminId, userId);
    res.json({ success: result });
});

app.post('/api/admin/timeout', async (req, res) => {
    const { adminId, userId, duration } = req.body;
    const result = await adminService.timeoutUser(adminId, userId, duration);
    res.json({ success: result });
});

app.post('/api/nitro/redeem', async (req, res) => {
    const { userId, code } = req.body;
    const result = await nitroService.redeemGiftCode(userId, code);
    res.json({ success: result });
});

app.post('/api/nitro/purchase', async (req, res) => {
    const { userId, type } = req.body;
    const result = await nitroService.redeemNitro(userId, type);
    res.json({ success: result });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Reactrocord is running on port ${port}`);
});

module.exports = app;