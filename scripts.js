// Constants
const TOTAL_DEGREES = 360;
const SPIN_DURATION = 5000; // 5 seconds

// DOM Elements
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
const arrow = document.getElementById('arrow');
const wheelInstructions = document.querySelector('.instructions');
const resultsContent = document.getElementById('result');

const spinChats = [
    "Who's on music today?",
    "Who's the DJ gonna be?",
    "I wonder who's on music today?",
    "I wonder who's in charge today?",
    "Let's see who's on the tunes today!",
    "It's time to pick today's DJ",
]

const spinExclamations = [
    "Hot damn, it's ",
    "Golly gosh it is ",
    "It's gonna be ",
    "It's absolutely ",
    "Wowzas, it's ",
    "Get ready, because it's ",
    "I hope you are all ready for ",
]

const spinSupplemental = [
    " today!",
    " for today's session!",
    " on today's tunes.",
    " spinning the decks today!",
    ", let's jam!",
    "! We're gonna rock!",
    "! Let's get this party started!",
]

// Variables
let canSpin = true;
let spinTimeout;

// Functions
function getRandomDegree() {
    return Math.floor(Math.random() * TOTAL_DEGREES);
}

// New function to draw the wheel
function drawWheel() {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = wheelCanvas.width / 2;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    const sliceAngle = (2 * Math.PI) / users.length;

    users.forEach((user, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Alternate colors
        ctx.fillStyle = index % 2 === 0 ? '#142d59' : '#305395';
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(user, radius - 60, 10);
        ctx.restore();
    });
}

function say(text) {
    var speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'en-AU';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
}

function spinWheel() {
    if (!canSpin) return;
    
    canSpin = false;
    clearTimeout(spinTimeout);

    say(spinChats[Math.floor(Math.random() * spinChats.length)]);
    
    resultsContent.classList.add('opacity-0')
    resultsContent.classList.remove('opacity-100');
    
    const degrees = getRandomDegree();
    const rotation = degrees + (TOTAL_DEGREES * 5); // Add extra rotations
    
    // Animate the canvas rotation
    let currentRotation = 0;
    const startTime = Date.now();

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / SPIN_DURATION, 1);
        const easedProgress = easeOutCubic(progress);
        currentRotation = easedProgress * rotation;

        ctx.save();
        ctx.translate(wheelCanvas.width / 2, wheelCanvas.height / 2);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.translate(-wheelCanvas.width / 2, -wheelCanvas.height / 2);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            canSpin = true;
            // wheelInstructions.style.opacity = '1';
            showResult(degrees);
        }
    }

    animate();
    
    // wheelInstructions.style.opacity = '0';
}

function getUserFromDegrees(degrees) {
    // Normalize the degrees to be within 0-360 range
    const normalizedDegrees = degrees % TOTAL_DEGREES;
    // Reverse the direction as the wheel spins clockwise
    const reversedDegrees = TOTAL_DEGREES - normalizedDegrees;
    const sliceAngle = TOTAL_DEGREES / users.length;
    const index = Math.floor(reversedDegrees / sliceAngle);
    return users[index % users.length];
}

function showResult(degrees) {
    const selectedUser = getUserFromDegrees(degrees);
    console.log(`Wheel stopped on: ${selectedUser} - (${degrees} degrees)`);

    // add the result to the results content
    resultsContent.textContent = `It's ${selectedUser}!`;

    let includeSupplemental = Math.random() < 0.5;
    let phrase = `${spinExclamations[Math.floor(Math.random() * spinExclamations.length)]} ${selectedUser} ${includeSupplemental ? spinSupplemental[Math.floor(Math.random() * spinSupplemental.length)] : ''}`;
    say(phrase);
    
    // Example: Show reveal content
    resultsContent.classList.add('opacity-100')
    resultsContent.classList.remove('opacity-0');
}

// Event Listeners
arrow.addEventListener('click', spinWheel);

// Optional: Reset function
function resetWheel() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawWheel();

    // reset the results content
    resultsContent.textContent = '';
    resultsContent.classList.add('opacity-0')
    resultsContent.classList.remove('opacity-100');
    canSpin = true;
}

// Expose reset function globally if needed
window.resetWheel = resetWheel;

// Call drawWheel on page load
drawWheel();