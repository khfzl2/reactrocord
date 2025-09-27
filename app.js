// Client-side JavaScript for enhanced interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://${window.location.host}`);
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Handle different types of updates
        switch(data.type) {
            case 'coins':
                updateCoins(data.amount);
                break;
            case 'nitro':
                updateNitroStatus(data.status);
                break;
            case 'servers':
                updateServerList(data.servers);
                break;
        }
    };
    
    // Update UI functions
    function updateCoins(amount) {
        document.getElementById('coins').textContent = amount;
    }
    
    function updateNitroStatus(status) {
        document.getElementById('nitroStatus').textContent = status;
    }
    
    function updateServerList(servers) {
        const serverList = document.getElementById('serverList');
        serverList.innerHTML = servers.map(server => `
            <div class="server-card">
                <h3>${server.name}</h3>
                <p>Members: ${server.memberCount}</p>
                <p>Boosts: ${server.boostCount}</p>
            </div>
        `).join('');
    }
});