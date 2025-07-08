const pitchTimeSelect = document.getElementById('pitch-time');
const numPresentersSelect = document.getElementById('num-presenters');
const presenterTitle = document.getElementById('presenter-title');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const resetButton = document.getElementById('reset-button');
const timerCanvas = document.getElementById('timer-canvas');
const ctx = timerCanvas.getContext('2d');
const currentPitchTimerContainer = document.querySelector('.current-pitch-timer');
const intervalDisplay = document.getElementById('interval-display');

let currentPitchTimer;
let intervalCountdownTimer;
let currentPitchTimeLeft;
let intervalTimeLeft = 10; // 10 seconds interval
let isPaused = true;
let currentPresenterIndex = 0;
let totalPresenters;
let selectedPitchTime;

// Audio for time up, start, 30-second and 10-second warnings
const timeUpAudio = new Audio('http://hiruno.shusei-kumamoto.com/wp-content/uploads/2025/07/end.mp3');
const startAudio = new Audio('http://hiruno.shusei-kumamoto.com/wp-content/uploads/2025/07/start.mp3');
const warning30Audio = new Audio('http://hiruno.shusei-kumamoto.com/wp-content/uploads/2025/07/30.mp3');
const warning10Audio = new Audio('http://hiruno.shusei-kumamoto.com/wp-content/uploads/2025/07/10.mp3');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updatePresenterTitle() {
    presenterTitle.textContent = `${currentPresenterIndex + 1}人目の発表者`;
}

function showCompletionMessage() {
    // Create completion overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-card">
            <div class="completion-icon">🎉</div>
            <h2 class="completion-title">発表完了！</h2>
            <p class="completion-text">全ての発表が終了しました！<br>お疲れ様でした。</p>
            <button class="completion-btn" onclick="hideCompletionMessage()">閉じる</button>
        </div>
    `;
    document.querySelector('.pitch-timer-app').appendChild(overlay);
    
    // Disable all timer buttons
    isPaused = true;
    startButton.disabled = true;
    pauseButton.disabled = true;
    nextButton.disabled = true;
}

function hideCompletionMessage() {
    const overlay = document.querySelector('.pitch-timer-app .completion-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function drawCircle() {
    // Update canvas dimensions to match its computed style
    timerCanvas.width = currentPitchTimerContainer.clientWidth;
    timerCanvas.height = currentPitchTimerContainer.clientHeight;

    const centerX = timerCanvas.width / 2;
    const centerY = timerCanvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8; // Adjust radius to fit within canvas and leave some margin

    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Progress arc
    const endAngle = (Math.PI / 2) - (2 * Math.PI * (currentPitchTimeLeft / selectedPitchTime));
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI / 2, endAngle, true);
    
    // Get the current theme from timer container data-attribute
    const currentTheme = document.querySelector('.pitch-timer-app').getAttribute('data-theme') || 'red';
    
    // Define theme colors directly
    const themeColors = {
        red: { primary: '#e74c3c', secondary: '#c0392b' },
        blue: { primary: '#3498db', secondary: '#2980b9' },
        green: { primary: '#27ae60', secondary: '#229954' }
    };
    
    const colors = themeColors[currentTheme] || themeColors.red;
    
    // Create gradient for the progress arc
    const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw time text in the center with theme color
    const fontSize = Math.min(timerCanvas.width, timerCanvas.height) * 0.18;
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Use gradient for text color too
    const textGradient = ctx.createLinearGradient(centerX - 50, centerY - 25, centerX + 50, centerY + 25);
    textGradient.addColorStop(0, colors.primary);
    textGradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = textGradient;
    
    ctx.fillText(formatTime(currentPitchTimeLeft), centerX, centerY);
}

function updateDisplay() {
    drawCircle();
    updatePresenterTitle();

    // Play warning sound at exactly 30 seconds (but not if it's the initial time)
    if (currentPitchTimeLeft === 30 && currentPitchTimeLeft < selectedPitchTime) {
        warning30Audio.play();
    }

    // Play warning sound at exactly 10 seconds
    if (currentPitchTimeLeft === 10) {
        warning10Audio.play();
    }

    if (currentPitchTimeLeft <= 10 && currentPitchTimeLeft > 0) {
        currentPitchTimerContainer.classList.add('time-up-animation');
    } else {
        currentPitchTimerContainer.classList.remove('time-up-animation');
    }
}

function startTimers() {
    if (!isPaused) return;
    isPaused = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    nextButton.disabled = false;
    resetButton.disabled = false;

    // Only play start sound for non-first presenters (handled in interval countdown)

    currentPitchTimer = setInterval(() => {
        if (currentPitchTimeLeft <= 0) {
            clearInterval(currentPitchTimer);
            timeUpAudio.play();
            currentPitchTimerContainer.classList.add('time-up-animation');
            
            // Check if this is the last presenter
            if (currentPresenterIndex + 1 >= totalPresenters) {
                // Last presenter - show completion message
                showCompletionMessage();
            } else {
                // Not the last presenter - start interval countdown
                startIntervalCountdown();
            }
        } else {
            currentPitchTimeLeft--;
        }
        updateDisplay();
    }, 1000);
}

function startIntervalCountdown() {
    intervalDisplay.style.display = 'block';
    intervalTimeLeft = 10; // Reset interval time
    
    // Update the time display
    const timeElement = intervalDisplay.querySelector('.interval-time');
    timeElement.textContent = intervalTimeLeft;

    intervalCountdownTimer = setInterval(() => {
        intervalTimeLeft--;
        timeElement.textContent = intervalTimeLeft;
        
        // Play start sound at 4 seconds remaining (only for 2nd presenter and beyond)
        // At this point, currentPresenterIndex is still the current presenter (0-based)
        // So if currentPresenterIndex >= 1, it means we're going to the 2nd presenter or later
        if (intervalTimeLeft === 4) {
            console.log('Current presenter index:', currentPresenterIndex); // Debug log
            startAudio.play();
        }
        
        if (intervalTimeLeft <= 0) {
            clearInterval(intervalCountdownTimer);
            intervalDisplay.style.display = 'none';
            nextPresenter();
        }
    }, 1000);
}

function pauseTimers() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(currentPitchTimer);
    clearInterval(intervalCountdownTimer); // Clear interval countdown
    intervalDisplay.style.display = 'none';
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function nextPresenter() {
    clearInterval(currentPitchTimer);
    clearInterval(intervalCountdownTimer); // Clear interval countdown
    intervalDisplay.style.display = 'none';
    currentPitchTimerContainer.classList.remove('time-up-animation'); // Remove animation
    currentPresenterIndex++;
    if (currentPresenterIndex < totalPresenters) {
        currentPitchTimeLeft = selectedPitchTime;
        // Reset pause state and start next presenter's timer
        isPaused = true; // Reset to paused state first
        startTimers(); // Restart for next presenter
    } else {
        // All presenters done
        showCompletionMessage();
    }
    updateDisplay();
}

function resetTimers() {
    clearInterval(currentPitchTimer);
    clearInterval(intervalCountdownTimer); // Clear interval countdown
    intervalDisplay.style.display = 'none';
    isPaused = true;
    currentPresenterIndex = 0; // Reset presenter index
    initializeTimers();
    resetButtonState();
}

function initializeTimers() {
    selectedPitchTime = parseInt(pitchTimeSelect.value);
    totalPresenters = parseInt(numPresentersSelect.value);
    currentPitchTimeLeft = selectedPitchTime;
    currentPresenterIndex = 0;
    updateDisplay();
    resetButtonState();
}

function resetButtonState() {
    startButton.disabled = false;
    pauseButton.disabled = true;
    nextButton.disabled = true;
    resetButton.disabled = true;
}

// Event Listeners
pitchTimeSelect.addEventListener('change', initializeTimers);
numPresentersSelect.addEventListener('change', initializeTimers);
startButton.addEventListener('click', startTimers);
pauseButton.addEventListener('click', pauseTimers);
nextButton.addEventListener('click', nextPresenter);
resetButton.addEventListener('click', resetTimers);

// Theme switching functionality
function initializeThemeSelector() {
    const themeButtons = document.querySelectorAll('.pitch-timer-app .theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply theme to timer container instead of body
            const theme = button.dataset.theme;
            document.querySelector('.pitch-timer-app').setAttribute('data-theme', theme);
            
            // Force redraw of canvas with new colors
            drawCircle();
        });
    });
}

// Initial setup
initializeTimers();
initializeThemeSelector();

// Set initial theme
document.querySelector('.pitch-timer-app').setAttribute('data-theme', 'red');

// Add resize event listener to redraw canvas on window resize
window.addEventListener('resize', drawCircle);