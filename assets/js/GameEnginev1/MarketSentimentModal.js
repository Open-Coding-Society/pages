class MarketSentimentModal {
  constructor(javaURI, Game) {
    this.javaURI = javaURI;
    this.Game = Game;
    this.statsInterval = null;
  }

  create() {
    const sentimentModal = document.createElement('div');
    sentimentModal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      padding: 20px;
      border-radius: 10px;
      color: white;
      z-index: 1000;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    `;

    sentimentModal.innerHTML = `
      <div class="container py-3">
        <h2 class="text-center mb-4" style="color: #4CAF50;">Market Sentiment Tracker</h2>
        
        <!-- Submit Sentiment Form -->
        <div class="row justify-content-center mb-4">
          <div class="col-md-6">
            <div class="card" style="background: rgba(255,255,255,0.1); border: 1px solid #4CAF50;">
              <div class="card-body">
                <h5 class="card-title" style="color: #4CAF50;">Submit Your Market Sentiment</h5>
                <form id="sentimentForm">
                  <div class="mb-3">
                    <label class="form-label">Market Sentiment</label>
                    <div class="d-flex gap-3">
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="sentiment" id="bullish" value="bullish" required>
                        <label class="form-check-label" for="bullish">
                          Bullish 📈
                        </label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="sentiment" id="bearish" value="bearish" required>
                        <label class="form-check-label" for="bearish">
                          Bearish 📉
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="reasoning" class="form-label">Your Reasoning</label>
                    <textarea class="form-control" id="reasoning" rows="3" required style="background: rgba(255,255,255,0.1); border: 1px solid #4CAF50; color: white;"></textarea>
                  </div>
                  <button type="submit" class="btn btn-success">Submit Vote</button>
                </form>
              </div>
            </div>
          </div>
      </div>

        <!-- Statistics Display -->
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="stats-container" style="background: rgba(20, 23, 31, 0.95); border-radius: 10px; padding: 20px;">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="mb-0" style="color: #fff; font-size: 1.2rem;">Community sentiment</h3>
                <span class="text-muted" style="font-size: 0.9rem;"><span id="totalVotes">0</span> votes</span>
              </div>

              <!-- Progress Bar Container -->
              <div class="sentiment-progress-container mb-4" style="position: relative; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                <div id="bullishProgress" style="position: absolute; left: 0; top: 0; height: 100%; background: #00F7B1; transition: width 0.3s ease;"></div>
                <div id="bearishProgress" style="position: absolute; right: 0; top: 0; height: 100%; background: #FF4976; transition: width 0.3s ease;"></div>
              </div>

              <!-- Percentages Display -->
              <div class="d-flex justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <span class="sentiment-arrow" style="color: #00F7B1; margin-right: 8px;">↗</span>
                  <span id="bullishPercentage" style="color: #00F7B1; font-weight: bold;">0%</span>
                </div>
                <div class="d-flex align-items-center">
                  <span id="bearishPercentage" style="color: #FF4976; font-weight: bold;">0%</span>
                  <span class="sentiment-arrow" style="color: #FF4976; margin-left: 8px;">↘</span>
                </div>
              </div>

              <!-- Sentiment Buttons -->
              <div class="d-flex gap-3 mb-4">
                <button id="bullishBtn" class="btn w-50" style="
                  background: rgba(0, 247, 177, 0.1);
                  border: 1px solid #00F7B1;
                  color: #00F7B1;
                  border-radius: 8px;
                  padding: 10px;
                  transition: all 0.3s ease;
                ">
                  <span class="sentiment-arrow">↗</span> Bullish
                </button>
                <button id="bearishBtn" class="btn w-50" style="
                  background: rgba(255, 73, 118, 0.1);
                  border: 1px solid #FF4976;
                  color: #FF4976;
                  border-radius: 8px;
                  padding: 10px;
                  transition: all 0.3s ease;
                ">
                  <span class="sentiment-arrow">↘</span> Bearish
                </button>
              </div>

              <!-- Tab Navigation -->
              <div class="d-flex mb-3">
                <button class="btn btn-link px-3 active" style="
                  color: #fff;
                  text-decoration: none;
                  border-bottom: 2px solid #00F7B1;
                  border-radius: 0;
                  padding-bottom: 8px;
                ">Top</button>
                <button class="btn btn-link px-3" style="
                  color: #6c757d;
                  text-decoration: none;
                  border-bottom: 2px solid transparent;
                  border-radius: 0;
                  padding-bottom: 8px;
                ">Latest</button>
              </div>

              <!-- Recent Votes History -->
              <div class="vote-history" id="voteHistory" style="max-height: 300px; overflow-y: auto;">
                <!-- Vote history will be populated here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Create modal with improved close functionality
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close btn-close-white position-absolute';
    closeButton.style.cssText = `
      top: 1rem;
      right: 1rem;
      z-index: 1000;
    `;
    sentimentModal.appendChild(closeButton);

    // Function to close modal
    const closeModal = () => {
      clearInterval(this.statsInterval);
      document.body.removeChild(modalOverlay);
    };

    // Close on button click
    closeButton.onclick = closeModal;

    // Close on overlay click
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    };

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    modalOverlay.appendChild(sentimentModal);
    document.body.appendChild(modalOverlay);

    // Function to update the UI with current stats
    const updateStats = (stats) => {
      const bullishPercentage = stats.bullishPercentage;
      const bearishPercentage = stats.bearishPercentage;
      
      document.getElementById('bullishPercentage').textContent = `${bullishPercentage}%`;
      document.getElementById('bearishPercentage').textContent = `${bearishPercentage}%`;
      document.getElementById('totalVotes').textContent = stats.totalVotes;
      
      document.getElementById('bullishProgress').style.width = `${bullishPercentage}%`;
      document.getElementById('bearishProgress').style.width = `${bearishPercentage}%`;

      // Add hover effects to sentiment buttons
      ['bullishBtn', 'bearishBtn'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,247,177,0.2)';
          };
          btn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
          };
        }
      });

      // Update vote history with modern styling
      const voteHistory = document.getElementById('voteHistory');
      voteHistory.innerHTML = '';
      
      if (stats.recentVotes) {
        stats.recentVotes.slice().reverse().forEach(vote => {
          const isBullish = vote.sentiment.toLowerCase() === 'bullish';
          const voteElement = document.createElement('div');
          voteElement.className = 'vote-card mb-3';
          voteElement.style.background = 'rgba(255, 255, 255, 0.05)';
          voteElement.style.borderRadius = '8px';
          voteElement.style.padding = '12px';
          
          const date = new Date(vote.timestamp);
          const formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          voteElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
              <div class="vote-content" style="flex: 1; margin-right: 10px;">
                <p class="mb-2" style="color: #fff; font-size: 0.9em; word-break: break-word;">${vote.reasoning}</p>
                <small style="color: #6c757d;">${formattedDate}</small>
              </div>
              <div class="sentiment-badge">
                <span style="
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 0.8em;
                  background: ${isBullish ? 'rgba(0, 247, 177, 0.1)' : 'rgba(255, 73, 118, 0.1)'};
                  color: ${isBullish ? '#00F7B1' : '#FF4976'};
                  border: 1px solid ${isBullish ? '#00F7B1' : '#FF4976'};
                ">
                  ${isBullish ? '↗' : '↘'} ${vote.sentiment}
                </span>
              </div>
            </div>
          `;
          voteHistory.appendChild(voteElement);
        });
      }
    };

    // Function to fetch current stats
    const fetchStats = async () => {
      try {
        const response = await fetch(this.javaURI + `/rpg_answer/market-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error('Server response:', await response.text());
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stats = await response.json();
        updateStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        const errorMessage = error.message || 'Network error - server may be down';
        document.getElementById('bullishPercentage').textContent = 'N/A';
        document.getElementById('bearishPercentage').textContent = 'N/A';
        document.getElementById('totalVotes').textContent = '0';
        document.getElementById('voteHistory').innerHTML = `
          <div class="alert alert-danger">
            Unable to load market data: ${errorMessage}
            <br><small>Please check server connection and try again.</small>
          </div>
        `;
      }
    };

    // Handle form submission with real-time updates
    const sentimentForm = document.getElementById('sentimentForm');
    sentimentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = sentimentForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
      
      const formData = {
        personId: this.Game.id || 1,
        sentiment: document.querySelector('input[name="sentiment"]:checked').value,
        reasoning: document.getElementById('reasoning').value,
        timestamp: Date.now()
      };

      try {
        const response = await fetch(this.javaURI + `/rpg_answer/market-sentiment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const stats = await response.json();
        updateStats(stats);
        sentimentForm.reset();
        
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mt-3';
        successAlert.textContent = 'Your vote has been submitted successfully!';
        sentimentForm.appendChild(successAlert);
        setTimeout(() => successAlert.remove(), 3000);
        
        // Trigger an immediate stats refresh
        await fetchStats();
        
      } catch (error) {
        console.error('Error submitting vote:', error);
        
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger mt-3';
        errorAlert.textContent = `Failed to submit vote: ${error.message}`;
        sentimentForm.appendChild(errorAlert);
        setTimeout(() => errorAlert.remove(), 3000);
        
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Vote';
      }
    });

    // Initial stats fetch
    fetchStats();
    
    // Refresh stats more frequently (every 5 seconds)
    this.statsInterval = setInterval(fetchStats, 5000);
  }
}

export default MarketSentimentModal; 