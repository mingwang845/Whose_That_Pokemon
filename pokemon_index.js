let pokeList = [];
let currentPokemon = null;
let score = 0;
let timeLeft = 60;
let timerInterval;
const usedPokemon = new Set();

// Event Listener for the Start btn
// if it's selected then display and generate the game
document.getElementById('start-btn').addEventListener('click', async() => {
    // checks to see the value that I've given th gen-slect option
    const genId = document.getElementById('gen-select').value;
    if (!genId) return alert("Please select a generation!");

    usedPokemon.clear();

    // Fetch Pokémon list from selected generation
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
    const data = await res.json();
    pokeList = data.pokemon_species.map(s => {
        const id = s.url.split('/')[s.url.split('/').length - 2];
        return { name: s.name.toLowerCase(), id };
    });

    // Start game
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('feedback').innerText = '';
    document.getElementById('score').innerText = '0';
    document.getElementById('timer').innerText = '60';
    score = 0;
    timeLeft = 60;
    startTimer();
    loadNextPokemon();
});

document.getElementById('guess-btn').addEventListener('click', checkGuess);

document.getElementById('guess-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkGuess();
});

document.getElementById('skip').addEventListener('click', loadNextPokemon);

function checkGuess() {
    const guess = document.getElementById('guess-input').value.trim().toLowerCase();
    const img = document.getElementById('pokemon-img');

    if (guess === currentPokemon.name) {
        score++;
        document.getElementById('score').innerText = score;
        document.getElementById('feedback').innerText = `Correct! It was ${currentPokemon.name}`;

        // Show the full-color Pokémon
        img.style.filter = 'brightness(100%)';

        // Wait a moment before showing the next one
        setTimeout(() => {
            loadNextPokemon();
            img.style.filter = 'brightness(0) contrast(100%)'; // back to silhouette
        }, 1000); // 1 second delay
    } else {
        document.getElementById('feedback').innerText = 'Incorrect, try again!';
    }

    document.getElementById('guess-input').value = '';
}


function loadNextPokemon() {
    if (usedPokemon.size === pokeList.length) {
        document.getElementById('feedback').innerText = "You've guessed all the Pokémon!";
        return;
    }

    let random;
    do {
        random = pokeList[Math.floor(Math.random() * pokeList.length)];
    } while (usedPokemon.has(random.name)); // or random.id

    usedPokemon.add(random.name); // or random.id

    currentPokemon = random;
    document.getElementById('pokemon-img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${random.id}.png`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    document.getElementById('feedback').innerText = `Game over! You scored ${score}.`;
    document.getElementById('pokemon-img').src = '';
}