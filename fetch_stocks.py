import yfinance as yf
import json
import os
from datetime import datetime

# Mix of Global and Indian (NSE) tickers
TICKERS = ["AAPL", "MSFT", "GOOGL", "RELIANCE.NS", "TCS.NS", "TATAMOTORS.NS"]

def fetch_stock_data():
    stock_data = []
    
    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            info = stock.fast_info
            
            # Get current price and previous close to calculate change
            current_price = info.last_price
            prev_close = info.previous_close
            change_percent = ((current_price - prev_close) / prev_close) * 100
            
            stock_data.append({
                "ticker": ticker.replace(".NS", ""), # Clean up NSE suffix for display
                "price": round(current_price, 2),
                "change_percent": round(change_percent, 2),
                "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
            })
            print(f"Successfully fetched {ticker}")
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")

    # Ensure the data directory exists
    os.makedirs("data", exist_ok=True)
    
    # Save to JSON
    with open("data/stocks.json", "w") as f:
        json.dump(stock_data, f, indent=4)

if __name__ == "__main__":
    fetch_stock_data()
