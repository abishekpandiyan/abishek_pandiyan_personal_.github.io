// Run setup once the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	setupContactForm();
	setupRangeDisplay();
	setupMemoryGame();
});

/* =========================================================
   1. CONTACT FORM LOGIC
   ========================================================= */

function setupContactForm() {
	const form = document.getElementById('contactForm');
	if (!form) return; // if form not on this page, stop

	form.addEventListener('submit', (event) => {
		event.preventDefault(); // 4) prevent reload

		// Collect all form values
		const data = {
			name: document.getElementById('name').value.trim(),
			surname: document.getElementById('surname').value.trim(),
			email: document.getElementById('email').value.trim(),
			phone: document.getElementById('phone').value.trim(),
			address: document.getElementById('address').value.trim(),
			rating1: Number(document.getElementById('rating1').value),
			rating2: Number(document.getElementById('rating2').value),
			rating3: Number(document.getElementById('rating3').value)
		};

		// Helper tag: FE24-JS-CF-XXXXX
		data.helperTag = 'FE24-JS-CF-' + generateRandomCode(5);

		// 4) print whole object in console
		console.log('Contact form data:', data);

		// Display results under the form
		displayFormResults(data);

		// 7) show success message
		showSuccessPopup('Form submitted successfully!');

		// optionally reset form
		form.reset();
		// reset slider labels to default
		updateAllRangeLabels();
	});
}

// random 5-character code, A–Z and 0–9
function generateRandomCode(length) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let out = '';
	for (let i = 0; i < length; i++) {
		out += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return out;
}

function displayFormResults(data) {
	const container = document.getElementById('formResults');
	if (!container) return;

	// 5) average rating of three answers
	const avg = (data.rating1 + data.rating2 + data.rating3) / 3;
	const avgColor = getAverageColor(avg);

	container.innerHTML = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Surname:</strong> ${data.surname}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone number:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <p><strong>Helper tag:</strong> ${data.helperTag}</p>
    <p><strong>${data.name} ${data.surname}:</strong>
      <span id="averageRating" style="font-weight:bold; color:${avgColor}">
        ${avg.toFixed(1)}
      </span>
    </p>
  `;

	container.style.display = 'block';
}

// 6) choose color according to the average value
function getAverageColor(avg) {
	if (avg < 4) return 'red';      // 0–4
	if (avg < 7) return 'orange';   // 4–7
	return 'green';                 // 7–10
}

/* ---- range slider live value display ---- */

function setupRangeDisplay() {
	const sliders = document.querySelectorAll('input[type="range"]');
	if (!sliders.length) return;

	sliders.forEach(slider => {
		const label = document.getElementById(slider.id + 'Value');
		if (!label) return;

		// initial value
		label.textContent = slider.value;

		// update on user move
		slider.addEventListener('input', () => {
			label.textContent = slider.value;
		});
	});
}

function updateAllRangeLabels() {
	const sliders = document.querySelectorAll('input[type="range"]');
	sliders.forEach(slider => {
		const label = document.getElementById(slider.id + 'Value');
		if (label) label.textContent = slider.value;
	});
}

/* ---- success popup (7) ---- */

function showSuccessPopup(message) {
	const popup = document.createElement('div');
	popup.className = 'success-popup';
	popup.textContent = message;

	document.body.appendChild(popup);

	// fade out after 3s
	setTimeout(() => {
		popup.classList.add('hide');
		setTimeout(() => popup.remove(), 500);
	}, 3000);
}

/* =========================================================
   2. MEMORY GAME LOGIC
   ========================================================= */

// 3) data source for cards – 6 unique items
const memoryItems = [
	{ id: 1, icon: '🎮' },
	{ id: 2, icon: '🎧' },
	{ id: 3, icon: '📚' },
	{ id: 4, icon: '💻' },
	{ id: 5, icon: '🎨' },
	{ id: 6, icon: '⚡' }
];

const gameState = {
	difficulty: 'easy',
	cards: [],
	flippedIndices: [],
	matchedIndices: new Set(),
	moves: 0,
	matches: 0,
	active: false
};

function setupMemoryGame() {
	const difficultySelect = document.getElementById('difficultyLevel');
	const startBtn = document.getElementById('startGameBtn');
	const restartBtn = document.getElementById('restartGameBtn');

	if (!difficultySelect || !startBtn || !restartBtn) return;

	difficultySelect.addEventListener('change', () => {
		gameState.difficulty = difficultySelect.value;
		initBoard();
	});

	startBtn.addEventListener('click', () => {
		gameState.active = true;
		startBtn.disabled = true;
	});

	restartBtn.addEventListener('click', () => {
		initBoard();
		gameState.active = true;
		startBtn.disabled = true;
	});

	initBoard(); // first setup
}

function initBoard() {
	gameState.cards = buildCardSet(gameState.difficulty);
	gameState.flippedIndices = [];
	gameState.matchedIndices.clear();
	gameState.moves = 0;
	gameState.matches = 0;
	gameState.active = false;

	renderBoard();
	updateStats();
	clearWinMessage();

	const startBtn = document.getElementById('startGameBtn');
	if (startBtn) {
		startBtn.disabled = false;
	}
}

// Build pairs according to difficulty and shuffle them
function buildCardSet(difficulty) {
	const totalCards = difficulty === 'easy' ? 12 : 24; // 4x3 or 6x4
	const pairs = totalCards / 2;
	const selected = memoryItems.slice(0, pairs);

	let cards = [];
	selected.forEach(item => {
		cards.push({ ...item });
		cards.push({ ...item });
	});

	// Fisher–Yates shuffle
	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cards[i], cards[j]] = [cards[j], cards[i]];
	}

	return cards;
}

function renderBoard() {
	const board = document.getElementById('gameBoard');
	if (!board) return;

	board.innerHTML = '';

	const cols = gameState.difficulty === 'easy' ? 4 : 6;
	board.style.display = 'grid';
	board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

	gameState.cards.forEach((card, index) => {
		const cell = document.createElement('button');
		cell.className = 'memory-card';
		cell.dataset.index = index;
		cell.innerHTML = `<span class="card-inner">${card.icon}</span>`;

		cell.addEventListener('click', () => handleCardClick(index, cell));
		board.appendChild(cell);
	});
}

function handleCardClick(index, cell) {
	if (!gameState.active) return;
	if (gameState.flippedIndices.length === 2) return;
	if (gameState.flippedIndices.includes(index)) return;
	if (gameState.matchedIndices.has(index)) return;

	cell.classList.add('flipped');
	gameState.flippedIndices.push(index);

	if (gameState.flippedIndices.length === 2) {
		checkForMatch();
	}
}

function checkForMatch() {
	gameState.moves++;

	const [i1, i2] = gameState.flippedIndices;
	const c1 = gameState.cards[i1];
	const c2 = gameState.cards[i2];

	if (c1.id === c2.id) {
		// match
		gameState.matchedIndices.add(i1);
		gameState.matchedIndices.add(i2);
		gameState.matches++;
		gameState.flippedIndices = [];
		updateStats();

		if (gameState.matches === gameState.cards.length / 2) {
			showWinMessage();
		}
	} else {
		// no match – flip back after 1s
		setTimeout(() => {
			document.querySelector(`[data-index="${i1}"]`)?.classList.remove('flipped');
			document.querySelector(`[data-index="${i2}"]`)?.classList.remove('flipped');
			gameState.flippedIndices = [];
			updateStats();
		}, 1000);
	}
}

function updateStats() {
	const moveEl = document.getElementById('moveCount');
	const matchEl = document.getElementById('matchCount');
	if (moveEl) moveEl.textContent = gameState.moves;
	if (matchEl) matchEl.textContent = gameState.matches;
}

function showWinMessage() {
	gameState.active = false;
	const win = document.getElementById('winMessage');
	if (!win) return;
	win.textContent = `You won! Total moves: ${gameState.moves}`;
	win.style.display = 'block';
}

function clearWinMessage() {
	const win = document.getElementById('winMessage');
	if (!win) return;
	win.textContent = '';
	win.style.display = 'none';
}
