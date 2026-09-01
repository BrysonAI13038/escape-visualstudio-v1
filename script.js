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
const MOTION_DEAD_ZONE = 3;
const HIGH_MOTION_LEVEL = 11;
const PEAK_HOLD_DURATION = 400;

let previousFrame = null;
let lastMotionSample = 0;
let peakHoldUntil = 0;

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
            const detectedMotion = Math.max(
                0,
                Math.min(
                    1,
                    (averageDifference - MOTION_DEAD_ZONE) /
                        (HIGH_MOTION_LEVEL - MOTION_DEAD_ZONE)
                )
            );

            // Suppress small camera noise while keeping deliberate movement clear.
            const mappedMotion =
                detectedMotion * detectedMotion * (3 - 2 * detectedMotion);

            if (mappedMotion > systemState.targetTension) {
                // Fast attack: meaningful increases register almost immediately.
                systemState.targetTension +=
                    (mappedMotion - systemState.targetTension) * 0.72;
                peakHoldUntil = time + PEAK_HOLD_DURATION;
            } else if (
                mappedMotion > 0.08 &&
                mappedMotion >= systemState.targetTension * 0.85
            ) {
                // Comparable continued motion refreshes the brief peak hold.
                systemState.targetTension = Math.max(
                    systemState.targetTension,
                    mappedMotion
                );
                peakHoldUntil = time + PEAK_HOLD_DURATION;
            } else if (time >= peakHoldUntil) {
                // Release the motion envelope only after measured motion falls.
                systemState.targetTension +=
                    (mappedMotion - systemState.targetTension) * 0.16;
            }

            systemState.targetTension = Math.max(
                0,
                Math.min(1, systemState.targetTension)
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
    // Sustained motion builds tension progressively; stillness releases it
    // more slowly so the system settles with intention.
    const responseRate = isIncreasing ? 2.6 : 0.38;
    const smoothing = 1 - Math.exp(-responseRate * elapsed);

    systemState.tension +=
        (systemState.targetTension - systemState.tension) * smoothing;

    systemState.tension = Math.max(0, Math.min(1, systemState.tension));

    if (systemState.tension < 0.001 && systemState.targetTension === 0) {
        systemState.tension = 0;
    }

    previousDrawTime = time;
}

// ========================================
// 5. DRAWING
// ========================================

// Three ordered sections form one enclosure with an intentional exit at right.
const enclosureSegments = [
    { start: 0.46, end: 2.08, rotationDirection: 0.72, drift: 0.74 },
    { start: 2.20, end: 3.82, rotationDirection: -0.48, drift: 0.92 },
    { start: 3.94, end: 5.82, rotationDirection: 0.58, drift: 0.82 }
];

const ENCLOSURE_RADIUS = 88;

function drawAtmosphere(centerX, centerY, breathing, tension) {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Tension pulls the atmosphere inward and raises its intensity.
    const calmRadius = Math.max(260, Math.min(canvasWidth, canvasHeight) * 0.54);
    const glowRadius = calmRadius + breathing * 28 - tension * calmRadius * 0.2;
    const glowOpacity = 0.09 + breathing * 0.015 + tension * 0.2;
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

    // A restrained edge shadow belongs to the same light-and-dark atmosphere.
    const vignette = ctx.createRadialGradient(
        centerX,
        centerY,
        Math.min(canvasWidth, canvasHeight) * 0.22,
        centerX,
        centerY,
        Math.max(canvasWidth, canvasHeight) * 0.7
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.32)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawEnclosure(tension, breathing, maxExpansion) {
    // A continuous S-curve keeps low tension quiet, clarifies the middle range,
    // and lets sustained high tension reach the full existing response.
    const response = tension * tension * (3 - 2 * tension);
    const separation = response * maxExpansion;
    const rotation = response * 0.62;

    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 8 + breathing * 1.5 + tension * 24;

    enclosureSegments.forEach(function(segment) {
        const middleAngle = (segment.start + segment.end) / 2;
        const fragmentShift = separation * segment.drift;
        const shiftX = Math.cos(middleAngle) * fragmentShift;
        const shiftY = Math.sin(middleAngle) * fragmentShift;

        ctx.save();
        ctx.rotate(rotation * segment.rotationDirection);
        ctx.beginPath();
        ctx.arc(
            shiftX,
            shiftY,
            ENCLOSURE_RADIUS,
            segment.start,
            segment.end
        );
        ctx.stroke();
        ctx.restore();
    });
}

function drawCross(breathing, tension) {
    // The cross remains geometrically stable in every system state.
    ctx.shadowBlur = 8 + breathing * 1.5 + tension * 8;
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
    const visibleRadius = Math.min(canvasHeight * 0.44, canvasWidth * 0.38);
    const maxExpansion = Math.max(
        0,
        Math.min(130, visibleRadius / responsiveScale - 100)
    );

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(responsiveScale, responsiveScale);

    ctx.strokeStyle = GOLD;
    ctx.fillStyle = GOLD;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(234, 216, 182, 0.65)";

    drawEnclosure(tension, breathing, maxExpansion);
    drawCross(breathing, tension);

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
