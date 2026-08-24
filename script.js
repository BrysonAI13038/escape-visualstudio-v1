// ========================================
// ESCAPE — SELF AS SYSTEM
// Movement creates tension. Stillness creates calm.
// ========================================

// ========================================
// 1. CANVAS SETUP
// ========================================

const canvas = document.getElementById("systemCanvas");
const ctx = canvas.getContext("2d");
const GOLD = "#ead8b6";
const BACKGROUND = "#020202";

const systemState = {
    tension: 0,
    targetTension: 0
};

let canvasWidth = 0;
let canvasHeight = 0;

// Keep the drawing buffer sharp while using CSS pixels for all geometry.
function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    canvasWidth = bounds.width;
    canvasHeight = bounds.height;
    canvas.width = Math.round(canvasWidth * pixelRatio);
    canvas.height = Math.round(canvasHeight * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ========================================
// 2. CAMERA SETUP
// ========================================

const motionVideo = document.createElement("video");
motionVideo.muted = true;
motionVideo.playsInline = true;

const motionCanvas = document.createElement("canvas");
const motionCtx = motionCanvas.getContext("2d", { willReadFrequently: true });
const MOTION_WIDTH = 64;
const MOTION_HEIGHT = 48;

motionCanvas.width = MOTION_WIDTH;
motionCanvas.height = MOTION_HEIGHT;

async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.info("ESCAPE: Camera input is unavailable; running in calm mode.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        motionVideo.srcObject = stream;
        await motionVideo.play();
        requestAnimationFrame(analyzeMotion);
    } catch (error) {
        systemState.targetTension = 0;
        console.info("ESCAPE: Camera input is unavailable; running in calm mode.");
    }
}

// ========================================
// 3. MOTION DETECTION
// ========================================

const MOTION_INTERVAL = 100;
const MOTION_DEAD_ZONE = 2.5;
const HIGH_MOTION_LEVEL = 18;

let previousFrame = null;
let lastMotionSample = 0;

function analyzeMotion(time) {
    if (time - lastMotionSample >= MOTION_INTERVAL) {
        lastMotionSample = time;
        motionCtx.drawImage(motionVideo, 0, 0, MOTION_WIDTH, MOTION_HEIGHT);

        const pixels = motionCtx.getImageData(
            0,
            0,
            MOTION_WIDTH,
            MOTION_HEIGHT
        ).data;
        const currentFrame = new Uint8Array(MOTION_WIDTH * MOTION_HEIGHT);

        let totalDifference = 0;

        for (let pixel = 0; pixel < currentFrame.length; pixel += 1) {
            const channel = pixel * 4;
            const brightness =
                pixels[channel] * 0.299 +
                pixels[channel + 1] * 0.587 +
                pixels[channel + 2] * 0.114;

            currentFrame[pixel] = brightness;

            if (previousFrame) {
                totalDifference += Math.abs(brightness - previousFrame[pixel]);
            }
        }

        if (previousFrame) {
            const averageDifference = totalDifference / currentFrame.length;
            systemState.targetTension = Math.max(
                0,
                Math.min(
                    1,
                    (averageDifference - MOTION_DEAD_ZONE) /
                        (HIGH_MOTION_LEVEL - MOTION_DEAD_ZONE)
                )
            );
        }

        previousFrame = currentFrame;
    }

    requestAnimationFrame(analyzeMotion);
}

setupCamera();

// ========================================
// 4. TENSION SMOOTHING
// ========================================

let previousDrawTime = 0;

function updateTension(time) {
    const elapsed = previousDrawTime
        ? Math.min((time - previousDrawTime) / 1000, 0.1)
        : 0;
    const isIncreasing = systemState.targetTension > systemState.tension;
    const responseRate = isIncreasing ? 4 : 0.8;
    const smoothing = 1 - Math.exp(-responseRate * elapsed);

    systemState.tension +=
        (systemState.targetTension - systemState.tension) * smoothing;

    if (systemState.tension < 0.001 && systemState.targetTension === 0) {
        systemState.tension = 0;
    }

    previousDrawTime = time;
}

// ========================================
// 5. DRAWING
// ========================================

// The original two-ring segment pattern.
const ringSegments = [
    { radius: 88, start: -2.95, end: -1.70 },
    { radius: 88, start: -1.42, end: -0.55 },
    { radius: 88, start: -0.34, end: 0.33 },
    { radius: 88, start: 0.58, end: 1.48 },
    { radius: 88, start: 1.79, end: 2.62 },
    { radius: 88, start: 2.82, end: 3.38 },
    { radius: 72, start: -2.72, end: -1.78 },
    { radius: 72, start: -1.35, end: -0.63 },
    { radius: 72, start: -0.39, end: 0.18 },
    { radius: 72, start: 0.47, end: 1.31 },
    { radius: 72, start: 1.73, end: 2.46 },
    { radius: 72, start: 2.75, end: 3.28 }
];

const ringPoints = [
    { x: 0, y: -103, radius: 3.5 },
    { x: 98, y: 0, radius: 3 },
    { x: 0, y: 104, radius: 1.7 },
    { x: -98, y: 0, radius: 3 },
    { x: 0, y: -83, radius: 2 }
];

function drawAtmosphere(centerX, centerY, breathing, tension) {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const glowRadius = 220 + breathing * 25 + tension * 45;
    const glowOpacity = 0.10 + breathing * 0.015 + tension * 0.05;
    const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        glowRadius
    );

    glow.addColorStop(0, `rgba(234, 216, 182, ${glowOpacity})`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawRings(tension) {
    const separation = tension * 14;
    const rotation = tension * 0.12;

    ctx.save();
    ctx.rotate(rotation);
    ctx.lineWidth = 2.5;

    ringSegments.forEach(function(segment) {
        ctx.beginPath();
        ctx.arc(
            0,
            0,
            segment.radius + separation,
            segment.start,
            segment.end
        );
        ctx.stroke();
    });

    ringPoints.forEach(function(point) {
        const distance = Math.hypot(point.x, point.y);
        const offset = distance === 0 ? 0 : separation / distance;

        ctx.beginPath();
        ctx.arc(
            point.x + point.x * offset,
            point.y + point.y * offset,
            point.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.restore();
}

function drawCross() {
    // The cross remains geometrically stable in every system state.
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(0, 58);
    ctx.moveTo(-25, -12);
    ctx.lineTo(25, -12);
    ctx.stroke();
}

function drawSigil(centerX, centerY, breathing, tension) {
    const responsiveScale = Math.min(
        1.35,
        Math.max(0.85, Math.min(canvasWidth, canvasHeight) / 440)
    );

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(responsiveScale, responsiveScale);

    ctx.strokeStyle = GOLD;
    ctx.fillStyle = GOLD;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(234, 216, 182, 0.65)";
    ctx.shadowBlur = 8 + breathing * 1.5 + tension * 5;

    drawRings(tension);
    drawCross();

    ctx.restore();
}

function drawSystem(time) {
    updateTension(time);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const breathing = Math.sin(time * 0.0008);
    const tension = Math.max(0, Math.min(1, systemState.tension));

    drawAtmosphere(centerX, centerY, breathing, tension);
    drawSigil(centerX, centerY, breathing, tension);

    requestAnimationFrame(drawSystem);
}

requestAnimationFrame(drawSystem);
