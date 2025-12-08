document.addEventListener('DOMContentLoaded', function () {
    // Find the contact form (template uses class "php-email-form")
    const form = document.getElementById('contactForm') || document.querySelector('.php-email-form');
    if (!form) return;

    // Ensure results containers exist (create if missing)
    let resultsDiv = document.getElementById('formResults');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'formResults';
        resultsDiv.style.display = 'none';
        resultsDiv.style.marginTop = '18px';
        form.parentNode.insertBefore(resultsDiv, form.nextSibling);
    }
    let resultsDisplay = document.getElementById('resultsDisplay');
    if (!resultsDisplay) {
        resultsDisplay = document.createElement('div');
        resultsDisplay.id = 'resultsDisplay';
        resultsDiv.appendChild(resultsDisplay);
    }

    // Helper that finds element by id or name
    function el(idOrName) {
        return document.getElementById(idOrName) || document.querySelector(`[name="${idOrName}"]`);
    }

    // Fields (works whether inputs use id or only name)
    const nameField = el('name');
    const surnameField = el('surname');
    const emailField = el('email');
    const phoneField = el('phone');
    const addressField = el('address');
    const rating1Field = el('rating1');
    const rating2Field = el('rating2');
    const rating3Field = el('rating3');

    // Generate helper tag
    function generateHelperTag() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let tag = 'FE24-JS-CF-';
        for (let i = 0; i < 5; i++) tag += chars.charAt(Math.floor(Math.random() * chars.length));
        return tag;
    }

    // Escape HTML for safe output
    function escapeHtml(s) {
        if (!s) return '';
        return String(s).replace(/[&<>"'`=\/]/g, function (c) {
            return {
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
            }[c];
        });
    }

    // Display collected data and the average
    function displayFormData(data) {
        // numeric average
        const a = Number(data.rating1) || 0;
        const b = Number(data.rating2) || 0;
        const c = Number(data.rating3) || 0;
        const avg = Number(((a + b + c) / 3).toFixed(1));

        // Color rules (non-overlapping):
        // 0.0 <= avg < 4.0 -> red
        // 4.0 <= avg < 7.0 -> orange
        // 7.0 <= avg <= 10.0 -> green
        let color = 'black';
        if (Number.isFinite(avg)) {
            if (avg < 4.0) color = 'red';
            else if (avg < 7.0) color = 'orange';
            else color = 'green';
        }

        resultsDisplay.innerHTML = `
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Surname:</strong> ${escapeHtml(data.surname)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone number:</strong> ${escapeHtml(data.phone)}</p>
            <p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
            <p><strong>Rating 1:</strong> ${data.rating1}</p>
            <p><strong>Rating 2:</strong> ${data.rating2}</p>
            <p><strong>Rating 3:</strong> ${data.rating3}</p>
            <p><strong>Average Rating:</strong> <span style="color:${color}; font-weight:700;">${isNaN(avg) ? '-' : avg.toFixed(1)}</span></p>
            <p><strong>Helper tag:</strong> ${escapeHtml(data.helperTag)}</p>
        `;

        resultsDiv.style.display = 'block';
    }

    // Simple popup
    function showSuccessPopup() {
        const popup = document.createElement('div');
        popup.id = 'successPopup';
        popup.innerHTML = `
            <div style="
                position: fixed; top:50%; left:50%; transform: translate(-50%,-50%);
                background: linear-gradient(135deg,#667eea 0,#764ba2 100%); color:#fff;
                padding:24px 32px; border-radius:12px; box-shadow:0 12px 36px rgba(0,0,0,.3);
                z-index:10000; text-align:center;">
                <strong style="display:block; font-size:1.1rem; margin-bottom:6px;">✓ Success!</strong>
                <span>Form submitted successfully!</span>
            </div>
            <div id="successOverlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:9999;"></div>
        `;
        document.body.appendChild(popup);
        const overlay = document.getElementById('successOverlay');
        if (overlay) overlay.addEventListener('click', () => popup.remove());
        setTimeout(() => popup.remove(), 3000);
    }

    // Submit handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect values (use fallback to empty string / zero)
        const data = {
            name: (nameField && nameField.value) ? nameField.value.trim() : '',
            surname: (surnameField && surnameField.value) ? surnameField.value.trim() : '',
            email: (emailField && emailField.value) ? emailField.value.trim() : '',
            phone: (phoneField && phoneField.value) ? phoneField.value.trim() : '',
            address: (addressField && addressField.value) ? addressField.value.trim() : '',
            rating1: (rating1Field && rating1Field.value) ? rating1Field.value : 0,
            rating2: (rating2Field && rating2Field.value) ? rating2Field.value : 0,
            rating3: (rating3Field && rating3Field.value) ? rating3Field.value : 0,
            helperTag: generateHelperTag()
        };

        console.log('Form Data:', data);

        displayFormData(data);
        showSuccessPopup();

        // scroll results into view
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    });

});

// ===== MEMORY GAME (inserted) =====
/*
  The following code initializes the Flip Card Memory game using the IDs
  present in index.html. It is safe to include inside the existing
  DOMContentLoaded handler and will not interfere with other logic.
*/
(function initializeMemoryGameBlock() {
	// DOM elements (IDs used in index.html)
	const gameBoard = document.getElementById('game-board');
	const difficultySelect = document.getElementById('difficulty-select');
	const startBtn = document.getElementById('start-btn');
	const restartBtn = document.getElementById('restart-btn');
	const movesCount = document.getElementById('moves-count');
	const matchesCount = document.getElementById('matches-count');
	const timerDisplay = document.getElementById('timer-display');
	const winMessage = document.getElementById('win-message');
	const finalMoves = document.getElementById('final-moves');
	const finalTime = document.getElementById('final-time');
	const newRecordMessage = document.getElementById('new-record-message');
	const bestScoreEasy = document.getElementById('best-score-easy');
	const bestScoreHard = document.getElementById('best-score-hard');

	// If the page doesn't have the game section, do nothing
	if (!gameBoard) return;

	// Card icons (use emoji for predictable display)
	const cardIcons = ['🍎','🍌','🍇','🍒','🍑','🥝','🍉','🍍','🥥','🍓','🍈','🍋'];

	const difficulties = {
		easy: { cols: 4, rows: 3, pairs: 6 },
		hard: { cols: 6, rows: 4, pairs: 12 }
	};

	let state = {
		difficulty: (difficultySelect && difficultySelect.value) || 'easy',
		cards: [],
		flipped: [],
		matchedPairs: 0,
		moves: 0,
		timer: 0,
		timerInterval: null,
		gameStarted: false,
		bestScores: { easy: null, hard: null }
	};

	// Load best scores from localStorage
	function loadBestScores() {
		const e = localStorage.getItem('memory_best_easy');
		const h = localStorage.getItem('memory_best_hard');
		state.bestScores.easy = e ? parseInt(e, 10) : null;
		state.bestScores.hard = h ? parseInt(h, 10) : null;
		if (bestScoreEasy) bestScoreEasy.textContent = state.bestScores.easy || '-';
		if (bestScoreHard) bestScoreHard.textContent = state.bestScores.hard || '-';
	}

	function saveBestScore(diff, moves) {
		localStorage.setItem(`memory_best_${diff}`, String(moves));
		state.bestScores[diff] = moves;
		if (bestScoreEasy) bestScoreEasy.textContent = state.bestScores.easy || '-';
		if (bestScoreHard) bestScoreHard.textContent = state.bestScores.hard || '-';
	}

	function shuffleArray(arr) {
		const a = arr.slice();
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function createBoard() {
		const cfg = difficulties[state.difficulty];
		const pairs = cfg.pairs;
		const selected = cardIcons.slice(0, pairs);
		const cardData = shuffleArray([...selected, ...selected]).map((icon, idx) => ({ icon, id: idx }));

		state.cards = cardData;
		state.flipped = [];
		state.matchedPairs = 0;
		state.moves = 0;
		updateStats();
		stopTimer();
		state.timer = 0;
		updateTimer();

		// Clear board
		gameBoard.innerHTML = '';

		// Grid layout
		gameBoard.style.display = 'grid';
		gameBoard.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
		gameBoard.style.gap = '10px';

		// Fill board
		cardData.forEach((card, index) => {
			const div = document.createElement('button');
			div.type = 'button';
			div.className = 'memory-card';
			div.dataset.index = index;
			div.setAttribute('aria-label', 'Memory card');
			// Front/back structure (front shows "?" and back shows icon)
			div.innerHTML = `
				<div class="card-inner">
					<div class="card-front" aria-hidden="true">?</div>
					<div class="card-back" aria-hidden="true">${card.icon}</div>
				</div>
			`;
			// Ensure 3D flip behavior via inline styles
			const inner = div.querySelector('.card-inner');
			const front = inner.querySelector('.card-front');
			const back = inner.querySelector('.card-back');

			div.style.perspective = '900px';
			inner.style.transition = 'transform 0.5s ease';
			inner.style.transformStyle = 'preserve-3d';
			inner.style.width = '100%';
			// make cards taller so icons are readable
			div.style.minHeight = '110px';
			div.style.height = '100%';

			front.style.backfaceVisibility = 'hidden';
			front.style.position = 'absolute';
			front.style.inset = '0';
			front.style.display = 'flex';
			front.style.alignItems = 'center';
			front.style.justifyContent = 'center';
			front.style.fontSize = 'clamp(24px, 5vw, 44px)';

			back.style.backfaceVisibility = 'hidden';
			back.style.transform = 'rotateY(180deg)';
			back.style.position = 'absolute';
			back.style.inset = '0';
			back.style.display = 'flex';
			back.style.alignItems = 'center';
			back.style.justifyContent = 'center';
			back.style.fontSize = 'clamp(24px, 5vw, 44px)';

			// click handler uses inner rotation
			div.addEventListener('click', () => handleFlip(div, index));
			gameBoard.appendChild(div);
		});
	}

	function handleFlip(cardEl, index) {
		if (!state.gameStarted) return;
		if (cardEl.classList.contains('matched')) return;
		if (state.flipped.length >= 2) return;

		const inner = cardEl.querySelector('.card-inner');
		if (inner._flipped) return;
		// flip card to show back
		inner.style.transform = 'rotateY(180deg)';
		inner._flipped = true;
		state.flipped.push({ el: cardEl, index, icon: state.cards[index].icon });

		if (state.flipped.length === 2) {
			state.moves++;
			updateStats();
			checkMatch();
		}
	}

	function checkMatch() {
		const [a, b] = state.flipped;
		if (!a || !b) return;

		if (a.icon === b.icon) {
			// matched - mark and keep flipped
			a.el.classList.add('matched');
			b.el.classList.add('matched');
			state.matchedPairs++;
			state.flipped = [];
			updateStats();
			const cfg = difficulties[state.difficulty];
			if (state.matchedPairs === cfg.pairs) gameWon();
		} else {
			// flip back after short delay
			setTimeout(() => {
				const innerA = a.el.querySelector('.card-inner');
				const innerB = b.el.querySelector('.card-inner');
				innerA.style.transform = 'rotateY(0deg)';
				innerB.style.transform = 'rotateY(0deg)';
				innerA._flipped = false;
				innerB._flipped = false;
				state.flipped = [];
			}, 900);
		}
	}

	function updateStats() {
		if (movesCount) movesCount.textContent = state.moves;
		if (matchesCount) matchesCount.textContent = state.matchedPairs;
	}

	function startTimer() {
		stopTimer();
		state.timerInterval = setInterval(() => {
			state.timer++;
			updateTimer();
		}, 1000);
	}

	function updateTimer() {
		if (!timerDisplay) return;
		const mins = Math.floor(state.timer / 60).toString().padStart(2, '0');
		const secs = (state.timer % 60).toString().padStart(2, '0');
		timerDisplay.textContent = `${mins}:${secs}`;
	}

	function stopTimer() {
		if (state.timerInterval) {
			clearInterval(state.timerInterval);
			state.timerInterval = null;
		}
	}

	function startGame() {
		state.gameStarted = true;
		startBtn && (startBtn.disabled = true);
		restartBtn && (restartBtn.disabled = false);
		if (difficultySelect) difficultySelect.disabled = true;
		state.moves = 0;
		state.matchedPairs = 0;
		createBoard();
		startTimer();
	}

	function restartGame() {
		state.gameStarted = true;
		state.moves = 0;
		state.matchedPairs = 0;
		createBoard();
		startTimer();
	}

	function gameWon() {
		stopTimer();
		state.gameStarted = false;
		startBtn && (startBtn.disabled = false);
		restartBtn && (restartBtn.disabled = true);
		if (difficultySelect) difficultySelect.disabled = false;

		// show win message area if present
		if (winMessage) {
			const cfg = difficulties[state.difficulty];
			finalMoves && (finalMoves.textContent = state.moves);
			finalTime && (finalTime.textContent = (timerDisplay && timerDisplay.textContent) || '00:00');

			// best score logic (fewest moves)
			const currentBest = state.bestScores[state.difficulty];
			if (currentBest === null || state.moves < currentBest) {
				saveBestScore(state.difficulty, state.moves);
				if (newRecordMessage) newRecordMessage.style.display = 'block';
			} else if (newRecordMessage) {
				newRecordMessage.style.display = 'none';
			}
			winMessage.style.display = 'block';
		}
	}

	// Wire UI
	if (startBtn) startBtn.addEventListener('click', startGame);
	if (restartBtn) restartBtn.addEventListener('click', restartGame);
	if (difficultySelect) {
		difficultySelect.addEventListener('change', () => {
			state.difficulty = difficultySelect.value;
			// reinitialize board on change
			state.gameStarted = false;
			createBoard();
		});
	}

	// initialize on load
	loadBestScores();
	// create initial board so user can see layout before starting
	createBoard();

	// Hide win message when board mounts
	if (winMessage) winMessage.style.display = 'none';
})();
// ===== end memory game block =====