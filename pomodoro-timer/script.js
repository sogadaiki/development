const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isPaused = true;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function startTimer() {
    if (!isPaused) return;
    isPaused = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            isPaused = true;
            startButton.disabled = false;
            pauseButton.disabled = true;
            const audio = new Audio('https://www.soundjay.com/buttons/beep-07.wav'); // Placeholder sound
            audio.play();
            alert('時間です！');
            return;
        }
        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(timer);
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    isPaused = true;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateTimerDisplay();
pauseButton.disabled = true;
resetButton.disabled = true;