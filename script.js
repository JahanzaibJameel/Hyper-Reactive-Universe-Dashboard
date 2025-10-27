// Initialize Three.js scene
let scene, camera, renderer, particles, particleSystem;
let core,
  waveEmitters = [];
let mouseX = 0,
  mouseY = 0;
let isNeuralMode = false;
let currentTheme = "quantum";
let particleSpeed = 0.5;
let coreRotationSpeed = 0.005;
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

// Audio
let ambientSound, neuralSound;

// Chart.js data
let energyChart;
let energyData = [];
let timeLabels = [];

// AI Terminal messages
const terminalMessages = [
  "Analyzing cosmic flux... done ✅",
  "Quantum entanglement stabilized 🌌",
  "Neural network synchronization at 99.7% 🧠",
  "Energy core temperature: 12.7MK ⚛️",
  "Dark matter density: 0.27 GeV/cm³ 🌑",
  "Gravitational waves detected 📡",
  "Multiverse connection established 🔗",
  "Temporal anomalies corrected ⏳",
  "Hyperspace navigation calibrated 🧭",
  "Reality matrix integrity: 100% ✅",
];

// Initialize the dashboard
function init() {
  initThreeJS();
  initAudio();
  initChart();
  createStars();
  setupEventListeners();
  startTerminal();
  animate();
}

// Initialize Three.js
function initThreeJS() {
  const canvas = document.getElementById("universeCanvas");

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000022, 50, 300);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Core sphere
  const coreGeometry = new THREE.SphereGeometry(15, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.8,
  });
  core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  // Particles
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Position particles in a sphere around the core
    const radius = 50 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);

    // Colors based on distance from core
    const distance = Math.sqrt(
      positions[i] * positions[i] +
        positions[i + 1] * positions[i + 1] +
        positions[i + 2] * positions[i + 2]
    );

    const colorIntensity = 1 - distance / 200;
    colors[i] = colorIntensity * 0.2;
    colors[i + 1] = colorIntensity * 0.8;
    colors[i + 2] = colorIntensity;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Add some wave emitters
  for (let i = 0; i < 5; i++) {
    const emitter = {
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      radius: 5,
      maxRadius: 50,
      speed: 0.5 + Math.random() * 0.5,
      active: false,
    };
    waveEmitters.push(emitter);
  }

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
}

// Initialize audio
function initAudio() {
  // Using Howler.js for better audio control
  ambientSound = new Howl({
    src: ["https://assets.codepen.io/1468070/ambient-space.mp3"],
    loop: true,
    volume: 0.3,
    autoplay: false,
  });

  neuralSound = new Howl({
    src: ["https://assets.codepen.io/1468070/deep-ambient.mp3"],
    loop: true,
    volume: 0.3,
    autoplay: false,
  });
}

// Initialize Chart.js
function initChart() {
  const ctx = document.getElementById("energyChart").getContext("2d");

  // Generate initial data
  for (let i = 0; i < 20; i++) {
    timeLabels.push(i);
    energyData.push(Math.random() * 100);
  }

  energyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: "Energy Flux",
          data: energyData,
          borderColor: "#00ffff",
          backgroundColor: "rgba(0, 255, 255, 0.1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
          min: 0,
          max: 100,
        },
      },
    },
  });

  // Update chart every 2 seconds
  setInterval(updateChart, 2000);
}

// Update the energy chart
function updateChart() {
  // Remove first data point and add new one
  energyData.shift();
  energyData.push(Math.random() * 100);

  // Update the chart
  energyChart.update();
}

// Create background stars
function createStars() {
  const starsContainer = document.createElement("div");
  starsContainer.id = "stars";
  starsContainer.style.position = "fixed";
  starsContainer.style.top = "0";
  starsContainer.style.left = "0";
  starsContainer.style.width = "100%";
  starsContainer.style.height = "100%";
  starsContainer.style.zIndex = "-2";
  document.body.appendChild(starsContainer);

  for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.width = Math.random() * 2 + "px";
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.opacity = Math.random() * 0.7 + 0.3;
    star.style.animation = `twinkle ${
      Math.random() * 5 + 3
    }s infinite alternate`;

    // Add animation keyframes
    const style = document.createElement("style");
    style.textContent = `
                    @keyframes twinkle {
                        0% { opacity: ${Math.random() * 0.5 + 0.3}; }
                        100% { opacity: ${Math.random() * 0.8 + 0.2}; }
                    }
                `;
    document.head.appendChild(style);

    starsContainer.appendChild(star);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Mouse movement for camera control
  document.addEventListener("mousemove", onMouseMove);

  // Click on core to emit waves
  document.addEventListener("click", onCanvasClick);

  // Control panel interactions
  document
    .getElementById("particleSpeed")
    .addEventListener("input", function (e) {
      particleSpeed = e.target.value / 100;
    });

  document
    .getElementById("coreRotation")
    .addEventListener("input", function (e) {
      coreRotationSpeed = e.target.value / 10000;
    });

  // Color theme buttons
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", function () {
      currentTheme = this.getAttribute("data-theme");
      applyTheme(currentTheme);
    });
  });

  // Sound toggle
  document
    .getElementById("soundToggle")
    .addEventListener("change", function (e) {
      if (e.target.checked) {
        if (isNeuralMode) {
          neuralSound.play();
        } else {
          ambientSound.play();
        }
      } else {
        ambientSound.pause();
        neuralSound.pause();
      }
    });

  // Neural mode button
  document
    .getElementById("neuralMode")
    .addEventListener("click", toggleNeuralMode);
}

// Apply color theme
function applyTheme(theme) {
  const coreMaterial = core.material;

  switch (theme) {
    case "quantum":
      coreMaterial.color.set(0x00aaff);
      scene.fog.color.set(0x000022);
      break;
    case "neon":
      coreMaterial.color.set(0xff0066);
      scene.fog.color.set(0x220011);
      break;
    case "cyber":
      coreMaterial.color.set(0x00ff88);
      scene.fog.color.set(0x002211);
      break;
  }
}

// Toggle neural mode
function toggleNeuralMode() {
  isNeuralMode = !isNeuralMode;
  const button = document.getElementById("neuralMode");

  if (isNeuralMode) {
    // Switch to neural mode
    document.body.classList.add("neural-mode");
    button.textContent = "DEACTIVATE NEURAL MODE";
    button.classList.remove(
      "from-purple-600",
      "to-cyan-600",
      "hover:from-purple-700",
      "hover:to-cyan-700"
    );
    button.classList.add(
      "from-purple-800",
      "to-indigo-800",
      "hover:from-purple-900",
      "hover:to-indigo-900"
    );

    // Change scene colors
    scene.fog.color.set(0x110033);
    core.material.color.set(0x9933ff);

    // Switch audio if playing
    if (document.getElementById("soundToggle").checked) {
      ambientSound.pause();
      neuralSound.play();
    }
  } else {
    // Switch back to normal mode
    document.body.classList.remove("neural-mode");
    button.textContent = "ACTIVATE NEURAL MODE";
    button.classList.remove(
      "from-purple-800",
      "to-indigo-800",
      "hover:from-purple-900",
      "hover:to-indigo-900"
    );
    button.classList.add(
      "from-purple-600",
      "to-cyan-600",
      "hover:from-purple-700",
      "hover:to-cyan-700"
    );

    // Revert scene colors
    applyTheme(currentTheme);

    // Switch audio if playing
    if (document.getElementById("soundToggle").checked) {
      neuralSound.pause();
      ambientSound.play();
    }
  }
}

// Mouse move event
function onMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) / 100;
  mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

// Canvas click event
function onCanvasClick(event) {
  // Emit waves from random emitters
  waveEmitters.forEach((emitter) => {
    if (Math.random() > 0.7) {
      emitter.active = true;
      emitter.radius = 5;
    }
  });
}

// Window resize event
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start AI terminal
function startTerminal() {
  let messageIndex = 0;

  setInterval(() => {
    if (messageIndex < terminalMessages.length) {
      addTerminalMessage(terminalMessages[messageIndex]);
      messageIndex++;
    } else {
      // Loop through messages again
      messageIndex = 0;
      document.getElementById("terminal").innerHTML = "";
      addTerminalMessage(terminalMessages[messageIndex]);
      messageIndex++;
    }
  }, 3000);
}

// Add message to terminal with typewriter effect
function addTerminalMessage(message) {
  const terminal = document.getElementById("terminal");
  const messageElement = document.createElement("div");
  messageElement.className = "mb-1 typewriter";
  messageElement.textContent = "> " + message;
  terminal.appendChild(messageElement);

  // Auto scroll to bottom
  terminal.scrollTop = terminal.scrollHeight;

  // Remove typewriter class after animation completes
  setTimeout(() => {
    messageElement.classList.remove("typewriter");
    messageElement.style.borderRight = "none";
  }, 3500);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update FPS counter
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    document.getElementById("fpsCounter").textContent = `FPS: ${fps}`;
    frameCount = 0;
    lastTime = currentTime;
  }

  // Rotate core
  core.rotation.x += coreRotationSpeed;
  core.rotation.y += coreRotationSpeed;

  // Rotate particles
  particleSystem.rotation.y += 0.001 * particleSpeed;

  // Move particles based on speed
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    // Simple orbital motion
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const radius = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.atan2(y, x) + 0.001 * particleSpeed;
    const phi = Math.acos(z / radius) + 0.0005 * particleSpeed;

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;

  // Update camera position based on mouse
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Update wave emitters
  waveEmitters.forEach((emitter) => {
    if (emitter.active) {
      emitter.radius += emitter.speed;
      if (emitter.radius > emitter.maxRadius) {
        emitter.active = false;
      }
    }
  });

  renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener("load", init);
