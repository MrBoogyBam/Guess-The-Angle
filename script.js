const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let mouseX = 0;
let mouseY = 0;
let frozenAngle = null;
let isFrozen = false;
let useRadians = false;
let targetAngle = 0;
let bestAccuracy = 0;

document.addEventListener("mousemove", (e) => {
  if (!isFrozen) {
    mouseX = e.clientX;
    mouseY = Math.min(e.clientY, canvas.height / 2);
  }
});

const tryAgainText = document.getElementById('try-again');
const degreesDisplay = document.getElementById("degrees-display");
const accuracyDisplay = document.getElementById('accuracy-display');
const accuracySubtext = document.getElementById("accuracy-subtext");

document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    if (!isFrozen) {
      isFrozen = true;
      frozenAngle = computeAngle();
      tryAgainText.hidden = false;

      // Calculate accuracy
      const guessAngle = Math.abs(((frozenAngle * 180 / Math.PI) - 180)).toFixed(1);
      const error = Math.abs(guessAngle - targetAngle).toFixed(1);
      const accuracy = Math.max(0, 100 - (error / 180) * 100);
      console.log(accuracy);

      accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(1)}%`;
      accuracyDisplay.hidden = false;
      accuracySubtext.hidden = false;

      // Remove any previous class
      accuracyDisplay.className = "";

      // Add new class based on accuracy
      if (accuracy < 70) {
        accuracyDisplay.classList.add("accuracy-red");
      } else if (accuracy < 90) {
        accuracyDisplay.classList.add("accuracy-yellow");
      } else if (accuracy < 95) {
        accuracyDisplay.classList.add("accuracy-green");
      } else {
        accuracyDisplay.classList.add("accuracy-glow");
      }

      if (accuracy <= bestAccuracy) {
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(1)}%`;
        accuracySubtext.textContent = `Best: ${bestAccuracy.toFixed(1)}%`
      } else {
        bestAccuracy = accuracy;
        accuracyDisplay.textContent = `Accuracy: ${accuracy.toFixed(1)}%`;
        accuracySubtext.textContent = "New best score!";
      }

      // Show degrees or radians
      if (useRadians) {
        // degreesDisplay.textContent = RadToFraction(frozenAngle);
      } else {
        const degrees = Math.abs(((frozenAngle * 180 / Math.PI) - 180)).toFixed(1);
        degreesDisplay.textContent = `${degrees}°`;
      }

      degreesDisplay.hidden = false;

      // Position degrees text relative to canvas
      const radius = 50;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      degreesDisplay.style.left = `${centerX + radius + 15}px`;
      degreesDisplay.style.top = `${centerY - 36}px`;
    } else {
      isFrozen = false;
      frozenAngle = null;
      tryAgainText.hidden = true;
      degreesDisplay.hidden = true;
      accuracyDisplay.hidden = true;
      accuracySubtext.hidden = true;
      setRandomAngle();
    }
  }
});

/* function RadToFraction(angleRad) {
  const fraction = (angleRad - Math.PI) / Math.PI;
  const denominator = 16; // Adjust precision
  const numerator = Math.round(fraction * denominator);

  if (numerator === 0) return "0";
  if (numerator === denominator) return "π";
  if (numerator === 2 * denominator) return "2π";

  const gcd = (a, b) => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(numerator, denominator);

  const simpleNumerator = numerator / divisor;
  const simpleDenominator = denominator / divisor;

  if (simpleNumerator === 1) return `π/${simpleDenominator}`;
  return `${simpleNumerator}π/${simpleDenominator}`;
} */

/* const toggleButton = document.getElementById("toggle-units");

toggleButton.addEventListener("click", () => {
  useRadians = !useRadians;
  toggleButton.textContent = useRadians ? "Switch to degrees" : "Switch to radians";

  // Update the display if frozen
  if (isFrozen && frozenAngle !== null) {
    if (useRadians) {
      degreesDisplay.textContent = `${frozenAngle.toFixed(2)} rad`;
    } else {
      const degrees = Math.abs(((frozenAngle * 180 / Math.PI) - 180)).toFixed(1);
      degreesDisplay.textContent = `${degrees}°`;
    }
  }
}); */

const randomAngleText = document.getElementById('angle');

function setRandomAngle() {
  // Random angle from 0 to 180 degrees (for upper half)
  targetAngle = (Math.random() * 180).toFixed(0);
  randomAngleText.textContent = `Target angle: ${targetAngle}°`;
}

// Function to compute the angle based on current mouse position
function computeAngle() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  let angle = Math.atan2(dx, dy);
  angle = Math.PI / 2 - angle;
  if (angle < 0) angle += Math.PI * 2;
  return angle;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Horizontal center line
  ctx.strokeStyle = "#7d7d7d";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  // Guess Line
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;

  const lineLength = Math.max(canvas.width, canvas.height) * 2;

  const x2 = centerX + ux * lineLength;
  const y2 = centerY + uy * lineLength;

  ctx.strokeStyle = "#7d7d7d";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Angle
  let angle;
  if (isFrozen && frozenAngle !== null) {
    angle = frozenAngle;
  } else {
    angle = computeAngle();
  }

  ctx.beginPath();
  ctx.strokeStyle = "#ffcc00";
  ctx.lineWidth = 5;

  const radius = 50;
  ctx.arc(centerX, centerY, radius, Math.PI, angle, false);
  ctx.stroke();

  requestAnimationFrame(draw);
}

setRandomAngle();
draw();