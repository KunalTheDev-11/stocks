document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('stock-container');
    const timestampEl = document.getElementById('timestamp');

    // Cache-busting: prevents GitHub Pages from serving a stale, saved version of the JSON
    const cacheBuster = new Date().getTime();
    
    fetch(`data/stocks.json?v=${cacheBuster}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = ''; // Clear loading state
            
            if (data.length > 0) {
                timestampEl.innerText = `Last Updated: ${data[0].last_updated}`;
            }

            data.forEach(stock => {
                const isPositive = stock.change_percent >= 0;
                const changeClass = isPositive ? 'up' : 'down';
                const sign = isPositive ? '+' : '';

                const card = document.createElement('div');
                card.className = 'stock-card';
                
                card.innerHTML = `
                    <div class="ticker">${stock.ticker}</div>
                    <div class="price">${stock.price}</div>
                    <div class="change ${changeClass}">${sign}${stock.change_percent}%</div>
                `;
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            timestampEl.innerText = "Data Load Failed";
            container.innerHTML = `
                <div style="grid-column: 1 / -1; background: #ff4444; color: white; padding: 1rem; border: 4px solid black;">
                    <strong>Error:</strong> Could not load stocks.json. <br><br>
                    If you are opening index.html directly from your computer, modern browsers block data fetching for security. <br>
                    <strong>To test locally:</strong> Open your terminal in this folder and run <code>python -m http.server</code>, then open http://localhost:8000 in your browser.
                </div>
            `;
        });
});
