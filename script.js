// ========================================
// ESCAPE — VISUAL RULE TESTS
// ========================================


// ========================================
// TEST 1 — SIGIL SEED
// Rule: Repeatable form
// ========================================

const canvas = document.getElementById("sigilCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let rotation = 0;
let pulse = 0;

function drawSigil() {

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Dark background
    ctx.fillStyle = "#050505";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    // Move to center
    ctx.translate(
        centerX,
        centerY
    );

    // Subtle breathing
    const size =
        1 + Math.sin(pulse) * 0.05;

    ctx.scale(
        size,
        size
    );

    const gold = "#ead8b6";

    ctx.strokeStyle = gold;
    ctx.fillStyle = gold;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(234, 216, 182, 0.65)";
    ctx.shadowBlur = 9;

    // Broken circular rings rotate slowly around the still cross.
    ctx.save();
    ctx.rotate(rotation);
    ctx.lineWidth = 2.5;

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

    ringSegments.forEach(function(segment) {
        ctx.beginPath();
        ctx.arc(0, 0, segment.radius, segment.start, segment.end);
        ctx.stroke();
    });

    // Small points emphasize the openings in the outer ring.
    [
        { x: 0, y: -103, radius: 3.5 },
        { x: 98, y: 0, radius: 3 },
        { x: 0, y: 104, radius: 1.7 },
        { x: -98, y: 0, radius: 3 },
        { x: 0, y: -83, radius: 2 }
    ].forEach(function(point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();

    // Central Christian cross.
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(0, 58);
    ctx.moveTo(-25, -12);
    ctx.lineTo(25, -12);
    ctx.stroke();

    ctx.restore();


    // Animation
    rotation += 0.002;
    pulse += 0.03;

    requestAnimationFrame(
        drawSigil
    );
}

drawSigil();



// ========================================
// TEST 2 — BEHAVIOR RULE
// Rule: Dissolve
// ========================================

const behaviorCanvas =
    document.getElementById(
        "behaviorCanvas"
    );

const behaviorCtx =
    behaviorCanvas.getContext(
        "2d"
    );


function resizeBehaviorCanvas() {

    behaviorCanvas.width =
        behaviorCanvas.clientWidth;

    behaviorCanvas.height =
        behaviorCanvas.clientHeight;
}

resizeBehaviorCanvas();

window.addEventListener(
    "resize",
    resizeBehaviorCanvas
);


// Forms
const forms = [

    {
        x: 0.25,
        y: 0.35,
        size: 18,
        opacity: 1,
        disappearing: false
    },

    {
        x: 0.50,
        y: 0.50,
        size: 24,
        opacity: 1,
        disappearing: false
    },

    {
        x: 0.72,
        y: 0.32,
        size: 16,
        opacity: 1,
        disappearing: false
    },

    {
        x: 0.68,
        y: 0.70,
        size: 20,
        opacity: 1,
        disappearing: false
    },

    {
        x: 0.30,
        y: 0.72,
        size: 14,
        opacity: 1,
        disappearing: false
    }

];


// Click interaction
behaviorCanvas.addEventListener(
    "click",
    function(event) {

        const rect =
            behaviorCanvas.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const mouseY =
            event.clientY - rect.top;


        forms.forEach(
            function(form) {

                const x =
                    form.x *
                    behaviorCanvas.width;

                const y =
                    form.y *
                    behaviorCanvas.height;


                const distance =
                    Math.sqrt(

                        (mouseX - x) ** 2 +

                        (mouseY - y) ** 2

                    );


                if (
                    distance <
                    form.size + 15
                ) {

                    form.disappearing =
                        true;

                }

            }
        );

    }
);


// Draw behavior
function drawBehavior() {

    behaviorCtx.fillStyle =
        "#050505";

    behaviorCtx.fillRect(
        0,
        0,
        behaviorCanvas.width,
        behaviorCanvas.height
    );


    forms.forEach(
        function(form) {

            // Dissolve
            if (
                form.disappearing
            ) {

                form.opacity -=
                    0.01;

                form.size +=
                    0.15;

            }


            if (
                form.opacity <= 0
            ) {

                form.opacity = 0;

            }


            const x =
                form.x *
                behaviorCanvas.width;

            const y =
                form.y *
                behaviorCanvas.height;


            behaviorCtx.save();


            behaviorCtx.globalAlpha =
                form.opacity;

            behaviorCtx.strokeStyle =
                "#eeeeee";

            behaviorCtx.lineWidth = 2;


            behaviorCtx.beginPath();

            behaviorCtx.arc(
                x,
                y,
                form.size,
                0,
                Math.PI * 2
            );

            behaviorCtx.stroke();


            behaviorCtx.restore();

        }
    );


    requestAnimationFrame(
        drawBehavior
    );
}

drawBehavior();



// ========================================
// TEST 3 — GESTURE LANGUAGE
// Rule: Proximity creates tension
// ========================================

const gestureCanvas =
    document.getElementById(
        "gestureCanvas"
    );

const gestureCtx =
    gestureCanvas.getContext(
        "2d"
    );


function resizeGestureCanvas() {

    gestureCanvas.width =
        gestureCanvas.clientWidth;

    gestureCanvas.height =
        gestureCanvas.clientHeight;
}

resizeGestureCanvas();

window.addEventListener(
    "resize",
    resizeGestureCanvas
);


// Mouse position
let mouseX = -1000;
let mouseY = -1000;


// Track mouse
gestureCanvas.addEventListener(
    "mousemove",
    function(event) {

        const rect =
            gestureCanvas.getBoundingClientRect();

        mouseX =
            event.clientX -
            rect.left;

        mouseY =
            event.clientY -
            rect.top;

    }
);


// Reset when mouse leaves
gestureCanvas.addEventListener(
    "mouseleave",
    function() {

        mouseX = -1000;
        mouseY = -1000;

    }
);


// Draw gesture
function drawGesture() {

    gestureCtx.fillStyle =
        "#050505";

    gestureCtx.fillRect(
        0,
        0,
        gestureCanvas.width,
        gestureCanvas.height
    );


    const centerX =
        gestureCanvas.width / 2;

    const centerY =
        gestureCanvas.height / 2;


    // Distance from mouse
    const distance =
        Math.sqrt(

            (mouseX - centerX) ** 2 +

            (mouseY - centerY) ** 2

        );


    const maxDistance = 300;


    let influence =
        1 -
        distance /
        maxDistance;


    influence =
        Math.max(
            0,
            Math.min(
                1,
                influence
            )
        );


    gestureCtx.save();


    gestureCtx.translate(
        centerX,
        centerY
    );


    const gestureGold = "#ead8b6";
    const separation = influence * 14;

    gestureCtx.strokeStyle = gestureGold;
    gestureCtx.fillStyle = gestureGold;
    gestureCtx.lineCap = "round";
    gestureCtx.shadowColor = "rgba(234, 216, 182, 0.55)";
    gestureCtx.shadowBlur = 8 + influence * 5;

    // The broken rings open outward as the pointer approaches.
    gestureCtx.save();
    gestureCtx.rotate(influence * 0.12);
    gestureCtx.lineWidth = 2.5;

    const gestureSegments = [
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

    gestureSegments.forEach(function(segment) {
        gestureCtx.beginPath();
        gestureCtx.arc(
            0,
            0,
            segment.radius + separation,
            segment.start,
            segment.end
        );
        gestureCtx.stroke();
    });

    [
        { x: 0, y: -103 - separation, radius: 3.5 },
        { x: 98 + separation, y: 0, radius: 3 },
        { x: 0, y: 104 + separation, radius: 1.7 },
        { x: -98 - separation, y: 0, radius: 3 },
        { x: 0, y: -83 - separation, radius: 2 }
    ].forEach(function(point) {
        gestureCtx.beginPath();
        gestureCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        gestureCtx.fill();
    });

    gestureCtx.restore();

    // The cross remains stable and recognizable.
    gestureCtx.lineWidth = 6;
    gestureCtx.beginPath();
    gestureCtx.moveTo(0, -42);
    gestureCtx.lineTo(0, 58);
    gestureCtx.moveTo(-25 - influence * 4, -12);
    gestureCtx.lineTo(25 + influence * 4, -12);
    gestureCtx.stroke();


    gestureCtx.restore();


    requestAnimationFrame(
        drawGesture
    );
}

drawGesture();



// ========================================
// TEST 4 — ATMOSPHERE CONSTRAINT
// Rule: Slow breathing atmosphere
// ========================================

const atmosphereCanvas =
    document.getElementById(
        "atmosphereCanvas"
    );

const atmosphereCtx =
    atmosphereCanvas.getContext(
        "2d"
    );


function resizeAtmosphereCanvas() {

    atmosphereCanvas.width =
        atmosphereCanvas.clientWidth;

    atmosphereCanvas.height =
        atmosphereCanvas.clientHeight;
}

resizeAtmosphereCanvas();

window.addEventListener(
    "resize",
    resizeAtmosphereCanvas
);


let atmosphereTime = 0;


// Draw atmosphere
function drawAtmosphere() {

    const centerX =
        atmosphereCanvas.width / 2;

    const centerY =
        atmosphereCanvas.height / 2;


    // Dark background
    atmosphereCtx.fillStyle =
        "#020202";

    atmosphereCtx.fillRect(
        0,
        0,
        atmosphereCanvas.width,
        atmosphereCanvas.height
    );


    // Slow breathing
    atmosphereTime +=
        0.008;


    const breathing =
        Math.sin(
            atmosphereTime
        );


    const glowRadius =
        220 +
        breathing * 35;


    // Central glow
    const glow =
        atmosphereCtx.createRadialGradient(

            centerX,
            centerY,
            20,

            centerX,
            centerY,
            glowRadius

        );


    glow.addColorStop(
        0,
        "rgba(234,216,182,0.13)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    atmosphereCtx.fillStyle =
        glow;


    atmosphereCtx.fillRect(
        0,
        0,
        atmosphereCanvas.width,
        atmosphereCanvas.height
    );


    // Sigil
    atmosphereCtx.save();


    atmosphereCtx.translate(
        centerX,
        centerY
    );


    const atmosphereGold = "rgba(234,216,182,0.9)";
    const glowStrength = 8 + (breathing + 1) * 4;

    atmosphereCtx.strokeStyle = atmosphereGold;
    atmosphereCtx.fillStyle = atmosphereGold;
    atmosphereCtx.lineCap = "round";
    atmosphereCtx.shadowColor = "rgba(234,216,182,0.7)";
    atmosphereCtx.shadowBlur = glowStrength;
    atmosphereCtx.lineWidth = 2.5;

    const atmosphereSegments = [
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

    atmosphereSegments.forEach(function(segment) {
        atmosphereCtx.beginPath();
        atmosphereCtx.arc(0, 0, segment.radius, segment.start, segment.end);
        atmosphereCtx.stroke();
    });

    [
        { x: 0, y: -103, radius: 3.5 },
        { x: 98, y: 0, radius: 3 },
        { x: 0, y: 104, radius: 1.7 },
        { x: -98, y: 0, radius: 3 },
        { x: 0, y: -83, radius: 2 }
    ].forEach(function(point) {
        atmosphereCtx.beginPath();
        atmosphereCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        atmosphereCtx.fill();
    });

    atmosphereCtx.lineWidth = 6;
    atmosphereCtx.beginPath();
    atmosphereCtx.moveTo(0, -42);
    atmosphereCtx.lineTo(0, 58);
    atmosphereCtx.moveTo(-25, -12);
    atmosphereCtx.lineTo(25, -12);
    atmosphereCtx.stroke();


    atmosphereCtx.restore();


    requestAnimationFrame(
        drawAtmosphere
    );
}

drawAtmosphere();
