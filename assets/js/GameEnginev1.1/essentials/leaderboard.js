/**
 * Leaderboard - Dual-Mode Leaderboard Widget for GameEngine v1.1
 *
 * Unified variant that supports both backend targets:
 * - Java/Spring (`backend: 'java'`)
 * - Python/Flask (`backend: 'python'` or `backend: 'flask'`)
 */

import { pythonURI, javaURI, fetchOptions } from '../../api/config.js';

export default class Leaderboard {
	constructor(gameControl = null, options = {}) {
		this.gameControl = gameControl;
		this.gameName = options.gameName || 'Global';
		this.parentId = options.parentId || null;

		const visibilityOption = typeof options.initialVisibility === 'string'
			? options.initialVisibility.toLowerCase()
			: null;

		if (typeof options.initiallyHidden === 'boolean') {
			this.initiallyHidden = options.initiallyHidden;
		} else if (typeof options.initiallyVisible === 'boolean') {
			this.initiallyHidden = !options.initiallyVisible;
		} else if (visibilityOption === 'on' || visibilityOption === 'visible') {
			this.initiallyHidden = false;
		} else {
			this.initiallyHidden = true;
		}

		this.isOpen = false;
		this.mounted = false;
		this.mode = 'dynamic';
		this.showingTypeSelection = false;
		this.elementaryEntries = [];
		this.isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

		this.syncElementaryDeleteWithBackend = typeof options.syncElementaryDeleteWithBackend === 'boolean'
			? options.syncElementaryDeleteWithBackend
			: !this.isLocalhost;

		this.deletedElementaryIdsStorageKey = `elementary_deleted_ids_${this.gameName}`;
		this.deletedElementaryIds = new Set(
			JSON.parse(localStorage.getItem(this.deletedElementaryIdsStorageKey) || '[]')
				.map((v) => String(v))
		);

		const backendOption = typeof options.backend === 'string'
			? options.backend.toLowerCase()
			: 'java';
		this.backendType = backendOption === 'flask' ? 'python' : backendOption;

		const preferredURI = this.backendType === 'python' ? pythonURI : javaURI;
		const fallbackURI = this.backendType === 'python' ? javaURI : pythonURI;
		this.backendURI = preferredURI
			? String(preferredURI).trim()
			: (fallbackURI ? String(fallbackURI).trim() : '');
		this.hasBackend = Boolean(this.backendURI);

		this.init();
	}

	_getDynamicLeaderboardPath() {
		return this.backendType === 'python'
			? '/api/dynamic/leaderboard'
			: '/api/events/SCORE_COUNTER';
	}

	_getDynamicSubmitPath() {
		return this._getDynamicLeaderboardPath();
	}

	_disableBackendForOffline(reason = '') {
		if (!this.hasBackend) return;
		this.hasBackend = false;
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}
		if (reason) {
			console.warn(`Leaderboard switched to offline mode (${reason})`);
		}
	}

	_isNetworkError(error) {
		return error && (
			error.name === 'TypeError'
			|| /Failed to fetch/i.test(error.message || '')
			|| /NetworkError/i.test(error.message || '')
			|| /Load failed/i.test(error.message || '')
		);
	}

	_fetchFromBackends(path, init = {}) {
		if (!this.hasBackend) {
			return Promise.reject(new Error('No backend configured'));
		}

		const url = `${this.backendURI}${path}`;
		return fetch(url, init).then((res) => {
			if (res.redirected && res.url && res.url.includes('/login')) {
				const error = new Error('AUTH_REDIRECT');
				error.status = 401;
				throw error;
			}

			if (!res.ok) {
				const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
				error.status = res.status;
				throw error;
			}

			return res;
		});
	}

	_getLoggedInUser() {
		if (!this.hasBackend) return Promise.resolve(null);

		const candidates = ['/api/id', '/api/user'];
		const tryEndpoint = (idx) => {
			if (idx >= candidates.length) return Promise.resolve(null);

			const url = `${this.backendURI}${candidates[idx]}`;
			return fetch(url, fetchOptions)
				.then((resp) => {
					if (!resp.ok) return null;
					return resp.json();
				})
				.then((person) => {
					if (person) return person;
					return tryEndpoint(idx + 1);
				})
				.catch(() => tryEndpoint(idx + 1));
		};

		return tryEndpoint(0);
	}

	_rememberLocalDelete(id) {
		this.deletedElementaryIds.add(String(id));
		localStorage.setItem(
			this.deletedElementaryIdsStorageKey,
			JSON.stringify([...this.deletedElementaryIds])
		);
	}

	_applyDeletedElementaryFilter(entries = []) {
		if (!this.deletedElementaryIds.size) return entries;
		return entries.filter((entry) => !this.deletedElementaryIds.has(String(entry.id)));
	}

	init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.mount());
		} else {
			this.mount();
		}
	}

	mount() {
		if (this.mounted) return;

		const appendTarget = (this.parentId && document.getElementById(this.parentId)) || document.body;
		const canUseAbsoluteInParent = appendTarget !== document.body
			&& window.getComputedStyle(appendTarget).position !== 'static';

		const container = document.createElement('div');
		container.id = 'leaderboard-container';

		if (canUseAbsoluteInParent) {
			container.style.position = 'absolute';
			container.style.top = '12px';
			container.style.left = '12px';
			container.style.right = 'auto';
			container.style.zIndex = '30';
		} else {
			container.style.position = 'fixed';
			container.style.top = '80px';
			container.style.left = '20px';
			container.style.right = 'auto';
			container.style.zIndex = '1000';
		}

		container.className = `leaderboard-widget${this.initiallyHidden ? ' initially-hidden' : ''}`;

		container.innerHTML = `
			<div class="leaderboard-header" style="padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
				<div style="display:flex;flex-direction:column;gap:6px;">
					<div style="display:flex;align-items:center;gap:8px;">
						<button id="back-btn" class="back-btn" style="display:none;" aria-label="Go back" title="Go back">←</button>
						<span id="leaderboard-title" style="font-size:20px;font-weight:800;">Leaderboard</span>
					</div>
					<div style="display:flex;flex-direction:column;gap:4px;">
						<span id="leaderboard-current-score" style="font-size:14px;font-weight:700;color:#ffffff;">Score: 0</span>
						<span id="leaderboard-preview" style="font-size:13px;color:#cfcfcf;display:none;">
						  <span id="leaderboard-coins-preview">Coins Collected: 0</span> | <span id="leaderboard-highscore-preview">High Score: 0</span>
						</span>
					</div>
				</div>
				<div style="display:flex;align-items:center;gap:8px;">
					<button id="leaderboard-save-score" class="save-score-btn" aria-label="Save score" title="Save score">💾</button>
					<button id="toggle-leaderboard" class="toggle-btn" aria-label="Toggle leaderboard" title="Toggle leaderboard">+</button>
				</div>
			</div>
			<div class="leaderboard-content hidden" id="leaderboard-content" style="padding:12px 16px;">
				<div id="leaderboard-list"></div>
			</div>
		`;

		(canUseAbsoluteInParent ? appendTarget : document.body).appendChild(container);

		const contentEl = container.querySelector('#leaderboard-content');
		const toggleBtn = container.querySelector('#toggle-leaderboard');
		const previewEl = container.querySelector('#leaderboard-preview');
		const titleEl = container.querySelector('#leaderboard-title');

		if (contentEl && toggleBtn) {
			contentEl.classList.toggle('hidden', !this.isOpen);
			toggleBtn.textContent = this.isOpen ? '−' : '+';
			if (previewEl && titleEl) {
				if (this.isOpen) {
					titleEl.style.display = 'inline';
					previewEl.style.display = 'none';
				} else {
					titleEl.style.display = 'none';
					previewEl.style.display = 'inline';
				}
			}
		}

		this.mounted = true;

		document
			.getElementById('toggle-leaderboard')
			.addEventListener('click', () => this.toggle());

		document
			.getElementById('back-btn')
			.addEventListener('click', () => this.goBack());

		document
			.getElementById('leaderboard-save-score')
			.addEventListener('click', (e) => this.handleSaveScoreFromLeaderboard(e.currentTarget));

		this.setupDynamicMode();
	}

	_getActiveGameEnv() {
		const activeControl = this.gameControl?.game?.getActiveControl
			? this.gameControl.game.getActiveControl()
			: this.gameControl;

		return activeControl?.currentLevel?.gameEnv
			|| this.gameControl?.currentLevel?.gameEnv
			|| this.gameControl?.gameEnv
			|| null;
	}

	_normalizeEventRecord(event = {}) {
		const payload = event.payload || {};

		return {
			id: event.id,
			user: payload.user
				|| payload.username
				|| event.user?.name
				|| event.user?.uid
				|| 'Anonymous',
			username: payload.user
				|| payload.username
				|| event.user?.name
				|| event.user?.uid
				|| 'Anonymous',
			score: Number(payload.score ?? event.score ?? 0),
			gameName: payload.gameName
				|| payload.game
				|| event.gameName
				|| event.algoName
				|| event.eventName
				|| 'Unknown',
			game: payload.gameName
				|| payload.game
				|| event.gameName
				|| event.algoName
				|| event.eventName
				|| 'Unknown',
			timestamp: event.timestamp
		};
	}

	handleSaveScoreFromLeaderboard(buttonEl) {
		const gameEnv = this._getActiveGameEnv();

		if (!gameEnv) {
			alert('Score feature not available');
			return;
		}

		if (this.backendType === 'java' && gameEnv.scoreManager) {
			const saveButton = buttonEl || document.getElementById('leaderboard-save-score');
			gameEnv.scoreManager.saveScore(saveButton)
				.then(() => {
					if (this.mode === 'dynamic') {
						return this.fetchLeaderboard();
					}
					return null;
				})
				.catch((error) => {
					console.error('Failed to save score from leaderboard:', error);
					alert('Failed to save score. Please try again.');
				});
			return;
		}

		const saveButton = buttonEl || document.getElementById('leaderboard-save-score');
		if (saveButton) saveButton.disabled = true;

		const score = gameEnv.currentScore || gameEnv.score || 0;

		this._getLoggedInUser()
			.then((person) => {
				const playerName = (person && (person.name || person.uid || person.username))
					|| gameEnv.playerName
					|| gameEnv.player?.name
					|| gameEnv.user?.name
					|| window.currentUser?.name
					|| null;

				if (!playerName) {
					const authError = new Error('AUTH_REQUIRED');
					authError.status = 401;
					throw authError;
				}

				return this.submitScore(playerName, score, this.gameName);
			})
			.then(() => {
				if (this.mode === 'dynamic') {
					return this.fetchLeaderboard();
				}
				return null;
			})
			.catch((error) => {
				console.error('Failed to submit score:', error);
				if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message === 'AUTH_REDIRECT' || error.message === 'AUTH_REQUIRED')) {
					alert('Please login to access this feature.');
				} else if (this._isNetworkError(error)) {
					this._disableBackendForOffline('score submission failed');
					alert('Network error: Unable to connect to backend.');
				} else {
					alert('Failed to save score. Please try again.');
				}
			})
			.finally(() => {
				if (saveButton) saveButton.disabled = false;
			});
	}

	toggle() {
		const content = document.getElementById('leaderboard-content');
		const btn = document.getElementById('toggle-leaderboard');
		const preview = document.getElementById('leaderboard-preview');
		const title = document.getElementById('leaderboard-title');

		this.isOpen = !this.isOpen;
		content.classList.toggle('hidden', !this.isOpen);
		btn.textContent = this.isOpen ? '−' : '+';

		const backBtn = document.getElementById('back-btn');
		if (backBtn) backBtn.style.display = (this.isOpen && !this.showingTypeSelection) ? 'inline-block' : 'none';

		if (preview && title) {
			if (this.isOpen) {
				title.style.display = 'inline';
				preview.style.display = 'none';
			} else {
				title.style.display = 'none';
				preview.style.display = 'inline';
			}
		}
	}

	goBack() {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
			this.refreshInterval = null;
		}

		this.mode = null;
		this.showingTypeSelection = true;

		const backBtn = document.getElementById('back-btn');
		if (backBtn) backBtn.style.display = 'none';

		const preview = document.getElementById('leaderboard-preview');
		if (preview) preview.textContent = 'Collapse to choose a leaderboard';

		this.showTypeSelection();
	}

	showTypeSelection() {
		const list = document.getElementById('leaderboard-list');
		if (!list) return;

		list.innerHTML = `
			<div class="type-selection">
				<h3>Choose Leaderboard Type</h3>
				<div class="type-buttons">
					<button class="type-btn" id="dynamic-btn">Dynamic Leaderboard</button>
					<button class="type-btn" id="elementary-btn">Elementary Leaderboard</button>
				</div>
			</div>
		`;

		document.getElementById('dynamic-btn').addEventListener('click', () => {
			this.mode = 'dynamic';
			this.showingTypeSelection = false;
			this.setupDynamicMode();
			const backBtn = document.getElementById('back-btn');
			if (backBtn) backBtn.style.display = this.isOpen ? 'inline-block' : 'none';
		});

		document.getElementById('elementary-btn').addEventListener('click', () => {
			this.mode = 'elementary';
			this.showingTypeSelection = false;
			this.setupElementaryMode();
			const backBtn = document.getElementById('back-btn');
			if (backBtn) backBtn.style.display = this.isOpen ? 'inline-block' : 'none';
		});
	}

	setupDynamicMode() {
		const list = document.getElementById('leaderboard-list');
		if (!this.hasBackend) {
			list.innerHTML = '<p class="error">Dynamic leaderboard unavailable (no backend).</p>';
			const backBtn = document.getElementById('back-btn');
			if (backBtn) backBtn.style.display = 'inline-block';
			return;
		}

		list.innerHTML = '<p class="loading">Loading dynamic leaderboard...</p>';

		const backBtn = document.getElementById('back-btn');
		if (backBtn) backBtn.style.display = this.isOpen ? 'inline-block' : 'none';

		this.fetchLeaderboard();
		this.refreshInterval = setInterval(() => this.fetchLeaderboard(), 30000);
	}

	setupElementaryMode() {
		const backBtn = document.getElementById('back-btn');
		if (backBtn) backBtn.style.display = this.isOpen ? 'inline-block' : 'none';

		this.fetchElementaryLeaderboard().then(() => {
			this.showElementaryForm();
		});
	}

	showElementaryForm() {
		const list = document.getElementById('leaderboard-list');
		if (!list) return;

		if (this.elementaryEntries.length > 0) {
			this.displayElementaryLeaderboard();
		} else {
			list.innerHTML = `
				<div class="elementary-form">
					<div class="form-group">
						<label for="player-name">Player Name</label>
						<input type="text" id="player-name" placeholder="Enter name" />
					</div>
					<div class="form-group">
						<label for="player-score">Score</label>
						<input type="number" id="player-score" placeholder="Enter score" />
					</div>
					<button class="submit-btn" id="add-score-btn">Add Score</button>
				</div>
			`;

			const addScoreBtn = document.getElementById('add-score-btn');
			const scoreInput = document.getElementById('player-score');

			if (addScoreBtn) {
				addScoreBtn.addEventListener('click', () => {
					this.addElementaryScore();
				});
			}

			if (scoreInput) {
				scoreInput.addEventListener('keypress', (e) => {
					if (e.key === 'Enter') this.addElementaryScore();
				});
			}
		}
	}

	addElementaryScore() {
		const nameInput = document.getElementById('player-name');
		const scoreInput = document.getElementById('player-score');

		const name = nameInput.value.trim();
		const score = parseInt(scoreInput.value, 10);

		if (!name || isNaN(score)) {
			alert('Please enter both name and score');
			return;
		}

		if (!this.hasBackend) {
			const storageKey = `elementary_leaderboard_${this.gameName}`;
			const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
			const entry = {
				id: `local-${Date.now()}`,
				payload: { user: name, score: score, gameName: this.gameName },
				timestamp: new Date().toISOString()
			};
			stored.push(entry);
			localStorage.setItem(storageKey, JSON.stringify(stored));

			nameInput.value = '';
			scoreInput.value = '';
			this.fetchElementaryLeaderboard();
			return;
		}

		const requestBody = {
			payload: {
				user: name,
				score: score,
				gameName: this.gameName
			}
		};

		this._fetchFromBackends(
			'/api/events/ELEMENTARY_LEADERBOARD',
			{
				...fetchOptions,
				method: 'POST',
				body: JSON.stringify(requestBody)
			}
		)
			.then((res) => res.json())
			.then(() => {
				nameInput.value = '';
				scoreInput.value = '';
				return this.fetchElementaryLeaderboard();
			})
			.catch((error) => {
				console.error('Error adding score:', error);
				if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message === 'AUTH_REDIRECT')) {
					alert('Please login to access this feature.');
				} else if (this._isNetworkError(error)) {
					this._disableBackendForOffline('add score request failed');
					this.fetchElementaryLeaderboard();
					alert('Network error: Unable to connect to server. Please check if backend is running.');
				} else {
					alert(`Failed to save score: ${error.message}`);
				}
			});
	}

	deleteElementaryScore(id) {
		if (!confirm('Are you sure you want to delete this score?')) {
			return;
		}

		const deleteLocal = () => {
			const storageKey = `elementary_leaderboard_${this.gameName}`;
			const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
			const filtered = stored.filter((e) => String(e.id) !== String(id));
			localStorage.setItem(storageKey, JSON.stringify(filtered));
			this._rememberLocalDelete(id);
			this.elementaryEntries = this._applyDeletedElementaryFilter(this.elementaryEntries);
			this.displayElementaryLeaderboard();
		};

		if (!this.hasBackend) {
			deleteLocal();
			return;
		}

		if (String(id).startsWith('local-')) {
			deleteLocal();
			return;
		}

		if (!this.syncElementaryDeleteWithBackend) {
			deleteLocal();
			return;
		}

		this._fetchFromBackends(
			`/api/events/ELEMENTARY_LEADERBOARD/${id}`,
			{
				...fetchOptions,
				method: 'DELETE'
			}
		)
			.then(() => this.fetchElementaryLeaderboard())
			.catch((error) => {
				console.error('Error deleting score:', error);
				if (error.message === 'AUTH_REDIRECT' || this._isNetworkError(error)) {
					if (this._isNetworkError(error)) {
						this._disableBackendForOffline('delete request failed');
					}
					deleteLocal();
					return;
				}
				alert(`Failed to delete score: ${error.message}`);
			});
	}

	fetchElementaryLeaderboard() {
		if (!this.hasBackend) {
			const storageKey = `elementary_leaderboard_${this.gameName}`;
			const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
			this.elementaryEntries = this._applyDeletedElementaryFilter(stored
				.map((event) => ({
					id: event.id,
					user: event.payload?.user || event.payload?.username || 'Anonymous',
					score: Number(event.payload?.score || 0),
					gameName: event.payload?.gameName || this.gameName,
					timestamp: event.timestamp
				}))
				.sort((a, b) => b.score - a.score));

			this.displayElementaryLeaderboard();
			return Promise.resolve();
		}

		return this._fetchFromBackends('/api/events/ELEMENTARY_LEADERBOARD', fetchOptions)
			.then((res) => res.json())
			.then((data) => {
				this.elementaryEntries = this._applyDeletedElementaryFilter(
					(Array.isArray(data) ? data : [])
						.map((event) => this._normalizeEventRecord(event))
						.map((entry) => ({
							id: entry.id,
							user: entry.user,
							score: entry.score,
							gameName: entry.gameName,
							timestamp: entry.timestamp
						}))
						.sort((a, b) => b.score - a.score)
				);

				this.displayElementaryLeaderboard();
			})
			.catch((error) => {
				console.error('Error fetching elementary leaderboard:', error);

				if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message === 'AUTH_REDIRECT')) {
					const list = document.getElementById('leaderboard-list');
					if (list) {
						list.innerHTML = '<p class="error">Please login to access this feature.</p>';
					}
					return;
				}

				if (this._isNetworkError(error)) {
					this._disableBackendForOffline('elementary fetch failed');
				}

				const storageKey = `elementary_leaderboard_${this.gameName}`;
				const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
				this.elementaryEntries = this._applyDeletedElementaryFilter(stored
					.map((event) => ({
						id: event.id,
						user: event.payload?.user || event.payload?.username || 'Anonymous',
						score: Number(event.payload?.score || 0),
						gameName: event.payload?.gameName || this.gameName,
						timestamp: event.timestamp
					}))
					.sort((a, b) => b.score - a.score));
				this.displayElementaryLeaderboard();
			});
	}

	displayElementaryLeaderboard() {
		const list = document.getElementById('leaderboard-list');
		const preview = document.getElementById('leaderboard-preview');

		if (!list) return;

		let html = '';

		if (this.elementaryEntries.length > 0) {
			const top = this.elementaryEntries[0];
			if (preview) {
				preview.textContent = `High Score: ${top.user} - ${Number(top.score).toLocaleString()}`;
			}

			html = `
				<table class="leaderboard-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Player</th>
							<th>Score</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
			`;

			this.elementaryEntries.forEach((e, i) => {
				html += `
					<tr>
						<td class="rank">${i + 1}</td>
						<td class="username">${this.escape(e.user)}</td>
						<td class="score">${Number(e.score).toLocaleString()}</td>
						<td><button class="delete-btn" data-id="${e.id}">Delete</button></td>
					</tr>
				`;
			});

			html += '</tbody></table>';
		}

		html += `
			<div class="elementary-form" style="border-top: 2px solid #333; margin-top: 12px;">
				<div class="form-group">
					<label for="player-name">Player Name</label>
					<input type="text" id="player-name" placeholder="Enter name" />
				</div>
				<div class="form-group">
					<label for="player-score">Score</label>
					<input type="number" id="player-score" placeholder="Enter score" />
				</div>
				<button class="submit-btn" id="add-score-btn">Add Score</button>
			</div>
		`;

		list.innerHTML = html;

		const addScoreBtn = document.getElementById('add-score-btn');
		const scoreInput = document.getElementById('player-score');

		if (addScoreBtn) {
			addScoreBtn.addEventListener('click', () => {
				this.addElementaryScore();
			});
		}

		if (scoreInput) {
			scoreInput.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') this.addElementaryScore();
			});
		}

		const deleteButtons = list.querySelectorAll('.delete-btn');
		deleteButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				const id = e.target.getAttribute('data-id');
				this.deleteElementaryScore(id);
			});
		});
	}

	fetchLeaderboard() {
		if (this.mode !== 'dynamic') return Promise.resolve();

		const list = document.getElementById('leaderboard-list');
		if (!list) return Promise.resolve();

		if (!this.hasBackend) {
			const storageKey = `score_counter_${this.gameName}`;
			const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
			const transformed = stored.map((e) => ({
				id: e.id,
				payload: { user: e.payload.user, score: e.payload.score, gameName: e.payload.gameName },
				timestamp: e.timestamp
			}));
			this.displayLeaderboard(transformed);
			return Promise.resolve();
		}

		return this._fetchFromBackends(this._getDynamicLeaderboardPath(), fetchOptions)
			.then((res) => res.json())
			.then((data) => {
				this.displayLeaderboard(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				console.error('Error fetching dynamic leaderboard:', err);
				if (err.message && (err.message.includes('401') || err.message.includes('403') || err.message === 'AUTH_REDIRECT')) {
					list.innerHTML = '<p class="error">Please login to access this feature.</p>';
				} else {
					if (this._isNetworkError(err)) {
						this._disableBackendForOffline('dynamic fetch failed');
						const storageKey = `score_counter_${this.gameName}`;
						const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
						const transformed = stored.map((e) => ({
							id: e.id,
							payload: { user: e.payload.user, score: e.payload.score, gameName: e.payload.gameName },
							timestamp: e.timestamp
						}));
						this.displayLeaderboard(transformed);
					} else {
						list.innerHTML = '<p class="error">Failed to load leaderboard</p>';
					}
				}
			});
	}

	submitScore(username, score, gameName = null) {
		if (!username || isNaN(score)) {
			return Promise.reject(new Error('Invalid username or score'));
		}

		if (!this.hasBackend) {
			const storageKey = `score_counter_${gameName || this.gameName}`;
			const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
			const entry = {
				id: `local-${Date.now()}`,
				payload: { user: username, score: score, gameName: gameName || this.gameName },
				timestamp: new Date().toISOString()
			};
			stored.push(entry);
			localStorage.setItem(storageKey, JSON.stringify(stored));

			if (this.mode === 'dynamic') this.fetchLeaderboard();
			return Promise.resolve(entry);
		}

		const requestBody = {
			payload: {
				user: username,
				score: score,
				gameName: gameName || this.gameName
			}
		};

		return this._fetchFromBackends(
			this._getDynamicSubmitPath(),
			{
				...fetchOptions,
				method: 'POST',
				body: JSON.stringify(requestBody)
			}
		)
			.then((res) => res.json())
			.then((savedEntry) => {
				if (this.mode === 'dynamic') {
					return this.fetchLeaderboard().then(() => savedEntry);
				}
				return savedEntry;
			});
	}

	displayLeaderboard(data) {
		const list = document.getElementById('leaderboard-list');
		const preview = document.getElementById('leaderboard-preview');

		const transformedData = (Array.isArray(data) ? data : [])
			.map((event) => this._normalizeEventRecord(event))
			.sort((a, b) => b.score - a.score);

		let html = '';

		if (!transformedData.length) {
			html = '<p class="loading">No scores yet</p>';
		} else {
			const top = transformedData[0];
			if (preview) {
				preview.textContent = `High Score: ${top.user || top.username} - ${Number(top.score).toLocaleString()}`;
			}

			html = `
				<table class="leaderboard-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Player</th>
							<th>Game</th>
							<th>Score</th>
						</tr>
					</thead>
					<tbody>
			`;

			transformedData.forEach((e, i) => {
				html += `
					<tr>
						<td class="rank">${i + 1}</td>
						<td class="username">${this.escape(e.user || e.username)}</td>
						<td>${this.escape(e.gameName || e.game)}</td>
						<td class="score">${Number(e.score).toLocaleString()}</td>
					</tr>
				`;
			});

			html += '</tbody></table>';
		}

		list.innerHTML = html;
	}

	escape(str = '') {
		return String(str).replace(/[&<>"']/g, (m) => (
			{ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]
		));
	}

	destroy() {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
		}
		document.getElementById('leaderboard-container')?.remove();
	}

	toggleVisibility() {
		const container = document.getElementById('leaderboard-container');
		if (container) {
			if (container.style.display === 'none' || container.classList.contains('initially-hidden')) {
				container.style.display = 'block';
				container.classList.remove('initially-hidden');
			} else {
				container.style.display = 'none';
			}
		}
	}

	isVisible() {
		const container = document.getElementById('leaderboard-container');
		return container && container.style.display !== 'none' && !container.classList.contains('initially-hidden');
	}
}
