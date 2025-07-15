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
const customTimeInput = document.getElementById('custom-time-input');
const customMinutesInput = document.getElementById('custom-minutes');
const customSecondsInput = document.getElementById('custom-seconds');
const customPeopleInput = document.getElementById('custom-people-input');
const customPeopleNumber = document.getElementById('custom-people');
const soundToggleBtn = document.getElementById('sound-toggle');
const audioPermissionModal = document.getElementById('audio-permission-modal');
const allowAudioBtn = document.getElementById('allow-audio');
const denyAudioBtn = document.getElementById('deny-audio');
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const timerAppContainer = document.querySelector('.timer-app-container');
const fullscreenBtn = document.getElementById('fullscreen-btn');

let currentPitchTimer;
let intervalCountdownTimer;
let currentPitchTimeLeft;
let intervalTimeLeft = 10; // 10 seconds interval
let isPaused = true;
let currentPresenterIndex = 0;
let totalPresenters;
let selectedPitchTime;
let isSoundEnabled = true; // Sound is enabled by default
let hasAudioPermission = false; // Track if we have permission

// Audio for time up, start, 30-second and 10-second warnings
const timeUpAudio = new Audio('pitch-timer/voice/end.mp3'); // Timer end sound
const startAudio = new Audio('pitch-timer/voice/start.mp3');
const warning30Audio = new Audio('pitch-timer/voice/30.mp3'); // 30-second warning sound
const warning10Audio = new Audio('pitch-timer/voice/10.mp3'); // 10-second warning sound

// Preload audio files for mobile compatibility
timeUpAudio.preload = 'auto';
startAudio.preload = 'auto';
warning30Audio.preload = 'auto';
warning10Audio.preload = 'auto';

// Mobile audio initialization function
function initializeAudioForMobile() {
    // Create audio context for mobile support
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const audioContext = new AudioContext();
        
        // Resume audio context on user interaction
        if (audioContext.state === 'suspended') {
            document.addEventListener('click', () => {
                audioContext.resume();
            }, { once: true });
        }
    }
    
    // Preload and unlock audio on first user interaction
    const unlockAudio = () => {
        [timeUpAudio, startAudio, warning30Audio, warning10Audio].forEach(audio => {
            audio.load();
            // Play and immediately pause to unlock on mobile
            const promise = audio.play();
            if (promise !== undefined) {
                promise.then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {
                    // Ignore errors during unlock attempt
                });
            }
        });
    };
    
    // Add event listeners for first user interaction
    ['touchstart', 'touchend', 'mousedown', 'click'].forEach(event => {
        document.addEventListener(event, unlockAudio, { once: true });
    });
}

// Check if we should show audio permission modal
function checkAudioPermission() {
    // Check localStorage for previous permission
    const savedPermission = localStorage.getItem('audioPermission');
    if (savedPermission === 'granted') {
        hasAudioPermission = true;
        isSoundEnabled = true;
    } else if (savedPermission === 'denied') {
        hasAudioPermission = false;
        isSoundEnabled = false;
        updateSoundToggleUI();
    } else {
        // First time - show modal
        audioPermissionModal.style.display = 'flex';
    }
}

// Initialize audio for mobile on page load
initializeAudioForMobile();

// Safe audio play function that handles mobile restrictions
function playAudioSafely(audio) {
    if (audio && isSoundEnabled && hasAudioPermission) {
        const promise = audio.play();
        if (promise !== undefined) {
            promise.catch(error => {
                // Silently handle play errors on mobile
                console.log('Audio play failed:', error.message);
            });
        }
    }
}

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
    document.body.appendChild(overlay);
    
    // Disable all timer buttons
    isPaused = true;
    startButton.disabled = true;
    pauseButton.disabled = true;
    nextButton.disabled = true;
}

function hideCompletionMessage() {
    const overlay = document.querySelector('.completion-overlay');
    if (overlay) {
        overlay.remove();
    }
    exitFullscreenMode(); // Exit fullscreen mode when closing completion message
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
    
    // Get the current theme from body data-attribute
    const currentTheme = document.body.getAttribute('data-theme') || 'red';
    
    // Define theme colors directly
    const themeColors = {
        red: { primary: '#e74c3c', secondary: '#c0392b' },
        blue: { primary: '#3498db', secondary: '#2980b9' },
        green: { primary: '#27ae60', secondary: '#229954' },
        purple: { primary: '#9b59b6', secondary: '#8e44ad' },
        orange: { primary: '#e67e22', secondary: '#d35400' },
        gray: { primary: '#34495e', secondary: '#2c3e50' }
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
    const timeSize = Math.min(timerCanvas.width, timerCanvas.height) * 0.18;
    ctx.font = `bold ${timeSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Use gradient for text color too
    const textGradient = ctx.createLinearGradient(centerX - 50, centerY - 25, centerX + 50, centerY + 25);
    textGradient.addColorStop(0, colors.primary);
    textGradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = textGradient;
    
    // Draw time text slightly above center
    const timeY = centerY - (timeSize * 0.15);
    ctx.fillText(formatTime(currentPitchTimeLeft), centerX, timeY);
    
    // Draw presenter info below the time (smaller size)
    const presenterSize = Math.min(timerCanvas.width, timerCanvas.height) * 0.027; // Reduced to 1/3 of previous size
    ctx.font = `600 ${presenterSize}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#666';
    const presenterY = centerY + (timeSize * 0.35); // Moved closer to time
    ctx.fillText(`${currentPresenterIndex + 1}人目の発表者`, centerX, presenterY);
}

function updateDisplay() {
    drawCircle();
    updatePresenterTitle();

    // Play warning sound at exactly 30 seconds (but not if it's the initial time)
    if (currentPitchTimeLeft === 30 && currentPitchTimeLeft < selectedPitchTime) {
        playAudioSafely(warning30Audio);
    }

    // Play warning sound at exactly 10 seconds
    if (currentPitchTimeLeft === 10) {
        playAudioSafely(warning10Audio);
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

    // Enter fullscreen mode when timer starts
    enterFullscreenMode();

    // Only play start sound for non-first presenters (handled in interval countdown)

    currentPitchTimer = setInterval(() => {
        if (currentPitchTimeLeft <= 0) {
            clearInterval(currentPitchTimer);
            playAudioSafely(timeUpAudio);
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
            playAudioSafely(startAudio);
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
    exitFullscreenMode(); // Exit fullscreen mode on reset
}

function getCustomTime() {
    const minutes = parseInt(customMinutesInput.value) || 0;
    const seconds = parseInt(customSecondsInput.value) || 0;
    console.log('Custom time:', minutes, 'minutes,', seconds, 'seconds'); // Debug log
    return minutes * 60 + seconds;
}

function getCustomPeople() {
    const people = parseInt(customPeopleNumber.value) || 0;
    console.log('Custom people:', people); // Debug log
    return people;
}

function initializeTimers() {
    if (pitchTimeSelect.value === 'custom') {
        selectedPitchTime = getCustomTime();
        // Minimum 1 second
        if (selectedPitchTime < 1) {
            selectedPitchTime = 1;
        }
        console.log('Using custom time:', selectedPitchTime, 'seconds'); // Debug log
    } else {
        selectedPitchTime = parseInt(pitchTimeSelect.value);
        console.log('Using preset time:', selectedPitchTime, 'seconds'); // Debug log
    }
    
    if (numPresentersSelect.value === 'custom') {
        totalPresenters = getCustomPeople();
        // Minimum 1 person
        if (totalPresenters < 1) {
            totalPresenters = 1;
        }
        console.log('Using custom people:', totalPresenters); // Debug log
    } else {
        totalPresenters = parseInt(numPresentersSelect.value);
        console.log('Using preset people:', totalPresenters); // Debug log
    }
    
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
pitchTimeSelect.addEventListener('change', function() {
    if (pitchTimeSelect.value === 'custom') {
        if (customTimeInput) {
            customTimeInput.style.display = 'flex';
            // Ensure custom inputs have valid values
            if (customMinutesInput && (!customMinutesInput.value || customMinutesInput.value === '')) {
                customMinutesInput.value = '0';
            }
            if (customSecondsInput && (!customSecondsInput.value || customSecondsInput.value === '')) {
                customSecondsInput.value = '0';
            }
        }
    } else {
        if (customTimeInput) {
            customTimeInput.style.display = 'none';
        }
    }
    initializeTimers();
});

numPresentersSelect.addEventListener('change', function() {
    if (numPresentersSelect.value === 'custom') {
        if (customPeopleInput) {
            customPeopleInput.style.display = 'flex';
            // Ensure custom input has valid value
            if (customPeopleNumber && (!customPeopleNumber.value || customPeopleNumber.value === '')) {
                customPeopleNumber.value = '0';
            }
        }
    } else {
        if (customPeopleInput) {
            customPeopleInput.style.display = 'none';
        }
    }
    initializeTimers();
});

if (customMinutesInput) {
    customMinutesInput.addEventListener('input', function() {
        // Validate minutes input
        const minutes = parseInt(this.value);
        if (isNaN(minutes) || minutes < 0) {
            this.value = 0;
        } else if (minutes > 59) {
            this.value = 59;
        }
        
        if (pitchTimeSelect.value === 'custom') {
            initializeTimers();
        }
    });
}

if (customSecondsInput) {
    customSecondsInput.addEventListener('input', function() {
        // Validate seconds input
        const seconds = parseInt(this.value);
        if (isNaN(seconds) || seconds < 0) {
            this.value = 0;
        } else if (seconds > 59) {
            this.value = 59;
        }
        
        if (pitchTimeSelect.value === 'custom') {
            initializeTimers();
        }
    });
}

if (customPeopleNumber) {
    customPeopleNumber.addEventListener('input', function() {
        // Validate people input
        const people = parseInt(this.value);
        if (isNaN(people) || people < 0) {
            this.value = 0;
        } else if (people > 99) {
            this.value = 99;
        }
        
        if (numPresentersSelect.value === 'custom') {
            initializeTimers();
        }
    });
}
startButton.addEventListener('click', startTimers);
pauseButton.addEventListener('click', pauseTimers);
nextButton.addEventListener('click', nextPresenter);
resetButton.addEventListener('click', resetTimers);

// Theme switching functionality
function initializeThemeSelector() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply theme to body
            const theme = button.dataset.theme;
            document.body.setAttribute('data-theme', theme);
            
            // Force redraw of canvas with new colors
            drawCircle();
        });
    });
}

// Initial setup
initializeTimers();
initializeThemeSelector();

// Sound toggle UI update
function updateSoundToggleUI() {
    const soundOnSpan = soundToggleBtn.querySelector('.sound-on');
    const soundOffSpan = soundToggleBtn.querySelector('.sound-off');
    
    if (isSoundEnabled) {
        soundToggleBtn.classList.add('active');
        soundOnSpan.style.display = 'inline';
        soundOffSpan.style.display = 'none';
    } else {
        soundToggleBtn.classList.remove('active');
        soundOnSpan.style.display = 'none';
        soundOffSpan.style.display = 'inline';
    }
}

// Audio permission handlers
if (allowAudioBtn) {
    allowAudioBtn.addEventListener('click', () => {
        hasAudioPermission = true;
        isSoundEnabled = true;
        localStorage.setItem('audioPermission', 'granted');
        audioPermissionModal.style.display = 'none';
        
        // Initialize audio after permission
        initializeAudioForMobile();
        
        // Play a test sound to unlock audio on iOS
        const testAudio = new Audio();
        testAudio.src = 'pitch-timer/voice/start.mp3';
        testAudio.volume = 0.1;
        testAudio.play().then(() => {
            testAudio.pause();
            testAudio.currentTime = 0;
        }).catch(() => {});
    });
}

if (denyAudioBtn) {
    denyAudioBtn.addEventListener('click', () => {
        hasAudioPermission = false;
        isSoundEnabled = false;
        localStorage.setItem('audioPermission', 'denied');
        audioPermissionModal.style.display = 'none';
        updateSoundToggleUI();
    });
}

// Sound toggle button handler
if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
        if (!hasAudioPermission) {
            // If no permission, show modal again
            audioPermissionModal.style.display = 'flex';
        } else {
            // Toggle sound on/off
            isSoundEnabled = !isSoundEnabled;
            updateSoundToggleUI();
        }
    });
}

// Set initial theme
document.body.setAttribute('data-theme', 'red');

// Add resize event listener to redraw canvas on window resize
window.addEventListener('resize', drawCircle);

// Fullscreen mode functions
function enterFullscreenMode() {
    timerAppContainer.classList.add('fullscreen-mode');
    settingsToggleBtn.style.display = 'flex';
}

function exitFullscreenMode() {
    timerAppContainer.classList.remove('fullscreen-mode');
    settingsToggleBtn.style.display = 'none';
}

// Settings toggle button handler
if (settingsToggleBtn) {
    settingsToggleBtn.addEventListener('click', () => {
        exitFullscreenMode();
    });
}

// Fullscreen button handler
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        enterFullscreenMode();
    });
}

// Check audio permission on load
checkAudioPermission();