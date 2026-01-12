import Npc from "../GameEngine/Npc.js";

class FinancialAdvisor extends Npc {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        
        this.apiKey = 'demo';
        this.apiEndpoints = {
            news: `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,MSFT,GOOGL,AMZN,TSLA&apikey=${this.apiKey}`,
            quotes: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${this.apiKey}&symbol=`
        };
        
        this.financialNews = [];
        this.stockData = {};
        
        this.financialTips = [
            "Start an emergency fund before focusing on investments - aim for 3-6 months of expenses.",
            "Pay off high-interest debt before investing aggressively.",
            "Take advantage of employer 401(k) matching - it's free money!",
            "Diversification is key - spread investments across different asset classes.",
            "Dollar-cost averaging helps reduce the impact of market volatility.",
            "Compound interest works best with time - start investing early!",
            "Low-cost index funds are often better for beginners than picking individual stocks.",
            "Rebalance your portfolio periodically to maintain your target asset allocation.",
            "Tax-advantaged accounts like IRAs and 401(k)s can significantly boost long-term returns.",
            "Consider inflation in your financial planning - your money loses purchasing power over time.",
            "Review your insurance coverage to protect your financial assets.",
            "Create a will and estate plan to protect your financial legacy.",
            "Regularly check your credit score and report for errors.",
            "Use budgeting tools to track spending and identify areas for improvement.",
            "Financial goals should be specific, measurable, achievable, relevant, and time-bound (SMART)."
        ];

        this.symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        this.isAdvicePanelOpen = false;
        
        if (!this.interact) {
            this.interact = this.provideFinancialAdvice.bind(this);
        }
        
        this.injectCustomStyles();
        this.fetchFinancialData();
        
        setInterval(() => this.fetchFinancialData(), 60000);
        
        console.log('[FinancialAdvisor] Initialized with API endpoints:', {
            news: this.apiEndpoints.news,
            quotes: `${this.apiEndpoints.quotes}[SYMBOL]`
        });
    }

    injectCustomStyles() {
        if (document.getElementById('financial-advisor-styles')) return;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'financial-advisor-styles';
        styleSheet.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -45%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%); }
                to { opacity: 0; transform: translate(-50%, -45%); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            
            .financial-panel-enter {
                animation: fadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
            }
            
            .financial-panel-exit {
                animation: fadeOut 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
            }
            
            .financial-panel-heading {
                animation: slideIn 0.5s ease forwards;
                animation-delay: 0.2s;
                opacity: 0;
            }
            
            .financial-panel-content {
                animation: slideIn 0.5s ease forwards;
                animation-delay: 0.3s;
                opacity: 0;
            }
            
            .financial-panel-market {
                animation: slideIn 0.5s ease forwards;
                animation-delay: 0.4s;
                opacity: 0;
            }
            
            .financial-panel-tip {
                animation: slideIn 0.5s ease forwards;
                animation-delay: 0.5s;
                opacity: 0;
            }
            
            .financial-highlight {
                animation: pulse 2s infinite ease-in-out;
            }
            
            .stock-up {
                color: #00E676;
                font-weight: bold;
            }
            
            .stock-down {
                color: #FF5252;
                font-weight: bold;
            }
            
            .shimmer-effect {
                background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
                background-size: 1000px 100%;
                animation: shimmer 2s infinite linear;
            }
        `;
        
        document.head.appendChild(styleSheet);
    }

    getFormattedDate(dayOffset = 0) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    async fetchFinancialData() {
        console.log('[FinancialAdvisor] Fetching financial data...');
        try {
            await this.fetchNewsData();
            for (const symbol of this.symbols) {
                await this.fetchStockQuote(symbol);
            }
            this.updatePanelIfOpen();
            console.log('[FinancialAdvisor] Financial data fetch complete');
        } catch (error) {
            console.error("[FinancialAdvisor] Error fetching financial data:", error);
            this.generateFallbackData();
        }
    }
    
    async fetchNewsData() {
        console.log('[FinancialAdvisor] Fetching news data from:', this.apiEndpoints.news);
        try {
            const response = await fetch(this.apiEndpoints.news);
            console.log('[FinancialAdvisor] News API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`News API returned status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('[FinancialAdvisor] News API data structure:', Object.keys(data));
            
            if (data && data.feed && data.feed.length > 0) {
                this.financialNews = data.feed.slice(0, 10).map(item => ({
                    headline: item.title,
                    details: item.summary || item.title,
                    source: item.source,
                    date: new Date(item.time_published).toLocaleString(),
                    symbols: item.ticker_sentiment.map(t => t.ticker)
                }));
                console.log(`[FinancialAdvisor] Successfully processed ${this.financialNews.length} news items`);
            } else {
                console.warn('[FinancialAdvisor] No news data found in API response, using fallback data');
                this.generateFallbackData();
            }
        } catch (error) {
            console.error("[FinancialAdvisor] Error fetching news data:", error);
            this.generateFallbackData();
        }
    }
    
    async fetchStockQuote(symbol) {
        const endpoint = `${this.apiEndpoints.quotes}${symbol}`;
        console.log(`[FinancialAdvisor] Fetching stock data for ${symbol} from:`, endpoint);
        
        try {
            const response = await fetch(endpoint);
            console.log(`[FinancialAdvisor] Stock API response for ${symbol} - status:`, response.status);
            
            if (!response.ok) {
                throw new Error(`Stock API for ${symbol} returned status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`[FinancialAdvisor] Stock data structure for ${symbol}:`, Object.keys(data));
            
            if (data && data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
                const quote = data['Global Quote'];
                const price = parseFloat(quote['05. price']).toFixed(2);
                const change = parseFloat(quote['09. change']).toFixed(2);
                const changePercent = quote['10. change percent'].replace('%', '');
                const isPositive = parseFloat(change) >= 0;
                const direction = isPositive ? '▲' : '▼';
                
                this.stockData[symbol] = {
                    symbol: symbol,
                    name: this.getCompanyName(symbol),
                    price: `$${price}`,
                    change: `${direction} ${Math.abs(change)}`,
                    changePercent: `${Math.abs(parseFloat(changePercent).toFixed(2))}%`,
                    isPositive: isPositive,
                    updated: new Date().toLocaleTimeString()
                };
                console.log(`[FinancialAdvisor] Successfully processed stock data for ${symbol}`);
            } else {
                console.warn(`[FinancialAdvisor] No quote data found for ${symbol}, using fallback`);
                this.generateFallbackStockData(symbol);
            }
        } catch (error) {
            console.error(`[FinancialAdvisor] Error fetching stock data for ${symbol}:`, error);
            this.generateFallbackStockData(symbol);
        }
    }
    
    getCompanyName(symbol) {
        const companies = {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corp.',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.'
        };
        return companies[symbol] || symbol;
    }
    
    generateFallbackData() {
        console.log('[FinancialAdvisor] Generating fallback data');
        if (this.financialNews.length === 0) {
            this.financialNews = [
                {
                    headline: "Markets Rally on Strong Economic Data",
                    details: "Stock markets reached new highs today as economic data showed stronger than expected growth.",
                    source: "Market Watch",
                    date: this.getFormattedDate(-1),
                    symbols: ['AAPL', 'MSFT']
                },
                {
                    headline: "Fed Signals Interest Rate Changes",
                    details: "The Federal Reserve indicated potential interest rate adjustments.",
                    source: "Financial Times",
                    date: this.getFormattedDate(0),
                    symbols: ['GOOGL', 'AMZN']
                },
                {
                    headline: "Tech Sector Leads Market Gains",
                    details: "Technology stocks outperformed broader markets.",
                    source: "Bloomberg",
                    date: this.getFormattedDate(-2),
                    symbols: ['MSFT', 'GOOGL']
                }
            ];
        }
        
        for (const symbol of this.symbols) {
            if (!this.stockData[symbol]) {
                this.generateFallbackStockData(symbol);
            }
        }
    }
    
    generateFallbackStockData(symbol) {
        console.log(`[FinancialAdvisor] Generating fallback stock data for ${symbol}`);
        const price = (Math.random() * 400 + 100).toFixed(2);
        const priceChange = (Math.random() * 6 - 3).toFixed(2);
        const direction = parseFloat(priceChange) >= 0 ? '▲' : '▼';
        
        this.stockData[symbol] = {
            symbol: symbol,
            name: this.getCompanyName(symbol),
            price: `$${price}`,
            change: `${direction} ${Math.abs(priceChange)}`,
            changePercent: `${Math.abs(parseFloat(priceChange)).toFixed(2)}%`,
            isPositive: parseFloat(priceChange) >= 0,
            updated: new Date().toLocaleTimeString()
        };
    }
    
    updatePanelIfOpen() {
        if (!this.isAdvicePanelOpen) return;
        
        const panel = document.getElementById("financial-advice-panel");
        if (!panel) return;
        
        const priceElement = panel.querySelector('.stock-price');
        const changeElement = panel.querySelector('.stock-change');
        const timeElement = panel.querySelector('.last-updated');
        
        if (priceElement && changeElement && timeElement) {
            const headlineText = panel.querySelector('.news-headline').textContent;
            const news = this.financialNews.find(n => n.headline === headlineText);
            
            if (news && news.symbols && news.symbols.length > 0) {
                const symbol = news.symbols[0];
                const stock = this.stockData[symbol] || this.stockData[this.symbols[0]];
                
                if (stock) {
                    priceElement.textContent = stock.price;
                    
                    changeElement.textContent = `${stock.change} (${stock.changePercent})`;
                    changeElement.className = stock.isPositive ? 'stock-change stock-up' : 'stock-change stock-down';
                    
                    changeElement.style.transition = 'none';
                    changeElement.style.opacity = '0.7';
                    setTimeout(() => {
                        changeElement.style.transition = 'all 0.5s ease';
                        changeElement.style.opacity = '1';
                        changeElement.classList.add('financial-highlight');
                        setTimeout(() => changeElement.classList.remove('financial-highlight'), 1000);
                    }, 50);
                    
                    timeElement.textContent = stock.updated;
                    
                    const marketDataSection = panel.querySelector('.market-data-section');
                    marketDataSection.classList.add('shimmer-effect');
                    setTimeout(() => marketDataSection.classList.remove('shimmer-effect'), 2000);
                }
            }
        }
    }

    createBackgroundDim() {
        const dimDiv = document.createElement("div");
        dimDiv.id = "financial-dim";
        dimDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            z-index: 9998;
            transition: background-color 0.5s ease;
            backdrop-filter: blur(0px);
        `;
        
        dimDiv.addEventListener("click", () => this.closeAdvicePanel());
        
        document.body.appendChild(dimDiv);
        
        setTimeout(() => {
            dimDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            dimDiv.style.backdropFilter = "blur(3px)";
        }, 10);
    }

    closeAdvicePanel() {
        const panel = document.getElementById("financial-advice-panel");
        const dim = document.getElementById("financial-dim");
        
        if (panel) {
            panel.classList.add('financial-panel-exit');
            panel.classList.remove('financial-panel-enter');
            
            if (dim) {
                dim.style.backgroundColor = "rgba(0, 0, 0, 0)";
                dim.style.backdropFilter = "blur(0px)";
            }
            
            setTimeout(() => {
                if (panel) panel.remove();
                if (dim) dim.remove();
            }, 500);
        } else {
            if (dim) dim.remove();
        }
        
        this.isAdvicePanelOpen = false;
    }

    provideFinancialAdvice() {
        if (this.isAdvicePanelOpen) return;
        
        this.isAdvicePanelOpen = true;
        
        if (this.financialNews.length === 0 || Object.keys(this.stockData).length === 0) {
            console.log('[FinancialAdvisor] No financial data available, generating fallback data');
            this.generateFallbackData();
        }
        
        const randomNewsIndex = Math.floor(Math.random() * this.financialNews.length);
        const randomNews = this.financialNews[randomNewsIndex];
        
        const randomTipIndex = Math.floor(Math.random() * this.financialTips.length);
        const randomTip = this.financialTips[randomTipIndex];
        
        let stockSymbol;
        if (randomNews.symbols && randomNews.symbols.length > 0) {
            stockSymbol = randomNews.symbols[0];
        } else {
            stockSymbol = this.symbols[0];
        }
        
        if (!this.stockData[stockSymbol]) {
            console.log(`[FinancialAdvisor] Stock data for ${stockSymbol} not found, generating fallback`);
            this.generateFallbackStockData(stockSymbol);
        }
        
        const selectedStock = this.stockData[stockSymbol];
        console.log(`[FinancialAdvisor] Selected stock: ${selectedStock.symbol} at ${selectedStock.price}`);
        
        this.createBackgroundDim();
        
        const panel = document.createElement("div");
        panel.id = "financial-advice-panel";
        panel.className = "financial-panel-enter";
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            color: white;
            border-radius: 8px;
            width: 65%;
            max-width: 850px;
            max-height: 85%;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            border: 4px solid #4a4a4a;
            padding: 0;
            font-family: 'Press Start 2P', monospace;
            opacity: 0;
            scrollbar-width: thin;
            scrollbar-color: #4a4a4a #1a1a1a;
        `;
        
        panel.innerHTML = `
            <style>
                #financial-advice-panel::-webkit-scrollbar {
                    width: 8px;
                }
                
                #financial-advice-panel::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-radius: 4px;
                }
                
                #financial-advice-panel::-webkit-scrollbar-thumb {
                    background: #4a4a4a;
                    border-radius: 4px;
                }
                
                #financial-advice-panel::-webkit-scrollbar-thumb:hover {
                    background: #666;
                }
            </style>
            
            <div class="panel-header" style="
                position: sticky;
                top: 0;
                background: #2a2a2a;
                padding: 20px 25px 5px;
                border-bottom: 2px solid #4a4a4a;
                z-index: 1;
            ">
                <h2 style="
                    margin: 0;
                    font-size: 18px;
                    color: #ff6b6b;
                    display: flex;
                    align-items: center;
                    text-shadow: 2px 2px 0 #000;
                ">
                    <span style="
                        background: #4a4a4a;
                        border: 2px solid #666;
                        border-radius: 4px;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;
                        font-size: 14px;
                    ">📊</span>
                    Financial Intelligence Center
                </h2>
                
                <button id="close-financial-panel" style="
                    background: #4a4a4a;
                    border: 2px solid #666;
                    color: #fff;
                    font-size: 12px;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-family: 'Press Start 2P', monospace;
                ">X</button>
            </div>
            
            <div class="panel-content" style="padding: 5px 25px 30px;">
                <div class="panel-section financial-panel-heading" style="
                    margin-bottom: 5px;
                    padding-top: 15px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                    ">
                        <div style="
                            background: #4a4a4a;
                            border: 2px solid #666;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 10px;
                            text-transform: uppercase;
                            color: #ff6b6b;
                            letter-spacing: 1px;
                            margin-right: 10px;
                            text-shadow: 1px 1px 0 #000;
                        ">Breaking News</div>
                        
                        <div style="
                            font-size: 10px;
                            color: #888;
                        ">
                            <span style="margin-right: 8px;">
                                <i style="margin-right: 4px;">📅</i>${randomNews.date}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="panel-section financial-panel-content" style="
                    background: #2a2a2a;
                    border: 2px solid #4a4a4a;
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 20px;
                ">
                    <h3 class="news-headline" style="
                        margin: 0 0 15px 0;
                        color: #ff6b6b;
                        font-size: 14px;
                        line-height: 1.4;
                        text-shadow: 1px 1px 0 #000;
                    ">${randomNews.headline}</h3>
                    
                    <p style="
                        margin: 0 0 15px 0;
                        line-height: 1.6;
                        color: #fff;
                        font-size: 12px;
                    ">${randomNews.details}</p>
                    
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 15px;
                        font-size: 10px;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            color: #888;
                        ">
                            <span style="
                                background: #4a4a4a;
                                border: 1px solid #666;
                                border-radius: 4px;
                                padding: 4px 10px;
                                display: flex;
                                align-items: center;
                            ">
                                <i style="margin-right: 5px;">📰</i>
                                Source: <strong style="margin-left: 4px;">${randomNews.source}</strong>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="panel-section market-data-section financial-panel-market" style="
                    background: #2a2a2a;
                    border: 2px solid #4a4a4a;
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 20px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    ">
                        <h3 style="
                            margin: 0;
                            color: #ff6b6b;
                            font-size: 14px;
                            display: flex;
                            align-items: center;
                            text-shadow: 1px 1px 0 #000;
                        ">
                            <span style="
                                background: #4a4a4a;
                                border: 2px solid #666;
                                border-radius: 4px;
                                width: 26px;
                                height: 26px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-right: 10px;
                                font-size: 12px;
                            ">📈</span>
                            Live Market Data
                        </h3>
                        
                        <div style="
                            background: #4a4a4a;
                            border: 1px solid #666;
                            border-radius: 4px;
                            padding: 4px 10px;
                            font-size: 10px;
                            color: #ff6b6b;
                            display: flex;
                            align-items: center;
                        ">
                            <span style="
                                width: 8px;
                                height: 8px;
                                background-color: #ff6b6b;
                                border-radius: 4px;
                                margin-right: 5px;
                                display: inline-block;
                                animation: pulse 2s infinite;
                            "></span>
                            Live Updates
                        </div>
                    </div>
                    
                    <div style="
                        background: #1a1a1a;
                        border: 2px solid #4a4a4a;
                        border-radius: 4px;
                        padding: 15px;
                        display: flex;
                        flex-direction: column;
                    ">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            align-items: center;
                        ">
                            <div style="font-size: 12px; color: #fff;">
                                <span style="
                                    background: #4a4a4a;
                                    border: 1px solid #666;
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    margin-right: 10px;
                                    font-family: 'Press Start 2P', monospace;
                                    letter-spacing: 1px;
                                ">${selectedStock.symbol}</span>
                                <strong>${selectedStock.name}</strong>
                            </div>
                            
                            <div style="
                                font-size: 14px;
                                display: flex;
                                align-items: center;
                            ">
                                <span class="stock-price" style="margin-right: 10px; color: #ff6b6b; text-shadow: 1px 1px 0 #000;">${selectedStock.price}</span>
                                <span class="stock-change ${selectedStock.isPositive ? 'stock-up' : 'stock-down'}" style="color: ${selectedStock.isPositive ? '#ff6b6b' : '#ff6b6b'}; text-shadow: 1px 1px 0 #000;">${selectedStock.change} (${selectedStock.changePercent})</span>
                            </div>
                        </div>
                        
                        <div style="
                            height: 30px;
                            background: #2a2a2a;
                            border: 2px solid #4a4a4a;
                            border-radius: 4px;
                            position: relative;
                            overflow: hidden;
                            margin: 10px 0;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: ${50 + Math.random() * 35}%;
                                background: ${selectedStock.isPositive ? '#ff6b6b' : '#ff6b6b'};
                                opacity: 0.3;
                            "></div>
                            
                            <svg width="100%" height="30" viewBox="0 0 400 30" preserveAspectRatio="none">
                                <path d="M0,15 ${this.generateRandomChartPath(400, 30, selectedStock.isPositive)}" 
                                      stroke="${selectedStock.isPositive ? '#ff6b6b' : '#ff6b6b'}" 
                                      stroke-width="2" 
                                      fill="none" />
                            </svg>
                        </div>
                        
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            font-size: 10px;
                            color: #888;
                        ">
                            <span>Trading Volume: ${Math.floor(Math.random() * 10000) + 1000}K</span>
                            <span class="last-updated">Last updated: ${selectedStock.updated}</span>
                        </div>
                    </div>
                </div>
                
                <div class="panel-section financial-panel-tip" style="
                    background: #2a2a2a;
                    border: 2px solid #4a4a4a;
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 10px;
                ">
                    <h3 style="
                        margin: 0 0 15px 0;
                        color: #ff6b6b;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        text-shadow: 1px 1px 0 #000;
                    ">
                        <span style="
                            background: #4a4a4a;
                            border: 2px solid #666;
                            border-radius: 4px;
                            width: 26px;
                            height: 26px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 10px;
                            font-size: 12px;
                        ">💡</span>
                        Financial Insight
                    </h3>
                    
                    <p style="
                        margin: 0;
                        line-height: 1.6;
                        color: #fff;
                        font-size: 12px;
                    ">${randomTip}</p>
                </div>
                
                <div style="
                    text-align: center;
                    margin-top: 20px;
                    font-size: 10px;
                    color: #888;
                ">
                    Press ESC key or click outside to close
                </div>
                
                <div id="api-debug" style="
                    margin-top: 20px;
                    font-size: 10px;
                    color: #888;
                    border-top: 1px solid #4a4a4a;
                    padding-top: 10px;
                ">
                    API Key: ${this.apiKey.substring(0, 2)}***${this.apiKey.substring(this.apiKey.length-2)}
                    <br>Using: ${this.financialNews.length === 0 ? 'Fallback Data' : 'Live Data'}
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById("close-financial-panel").addEventListener("click", (e) => {
            e.stopPropagation();
            this.closeAdvicePanel();
        });
        
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeAdvicePanel();
                document.removeEventListener('keydown', escKeyHandler);
            }
        };
        document.addEventListener('keydown', escKeyHandler);
        
        const closeButton = document.getElementById("close-financial-panel");
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#666';
            closeButton.style.transform = 'scale(1.1)';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#4a4a4a';
            closeButton.style.transform = 'scale(1)';
        });
    }

    generateRandomChartPath(width, height, isPositive) {
        let path = '';
        const points = 20;
        const center = height / 2;
        const step = width / points;
        
        const trend = isPositive ? 0.6 : -0.6;
        let lastY = center;
        
        for (let i = 1; i <= points; i++) {
            const x = i * step;
            
            const randomFactor = Math.random() * 8 - 4;
            const trendFactor = trend * i / 3;
            const continuityFactor = (center - lastY) * 0.3;
            
            let y = center - randomFactor - trendFactor + continuityFactor;
            
            y = Math.max(5, Math.min(height - 5, y));
            
            lastY = y;
            
            path += ` L${x},${y}`;
        }
        
        return path;
    }
}

export default FinancialAdvisor;
