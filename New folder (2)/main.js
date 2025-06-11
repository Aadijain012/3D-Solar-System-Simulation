import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 30, 40);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Texture mapping for planets and sun (using .png in root)
const textureMap = {
    'Mercury': 'textures/mercury.png',
    'Venus': 'textures/venus.png',
    'Earth': 'textures/earth.png',
    'Mars': 'textures/mars.png',
    'Jupiter': 'textures/jupiter.png',
    'Saturn': 'textures/saturn.png',
    'Uranus': 'textures/uranus.png',
    'Neptune': 'textures/neptune.png',
    'Pluto': 'textures/pluto.png',
    'Sun': 'textures/sun.png'
};

const textureLoader = new THREE.TextureLoader();

// Create stars
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    });
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}
createStars();

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 3, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(30, 30, 30);
scene.add(dirLight);

// Sun
const sunTexture = textureLoader.load(textureMap['Sun']);
const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissive: new THREE.Color(0xFFFF00),
    emissiveIntensity: 1.5
});
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
const sunGlowGeometry = new THREE.SphereGeometry(5.5, 64, 64);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFF99,
    transparent: true,
    opacity: 0.4
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// Planet data
const planets = [
    { name: 'Mercury', radius: 0.8, distance: 10, speed: 0.04},
    { name: 'Venus', radius: 1.2, distance: 15, speed: 0.03},
    { name: 'Earth', radius: 1.5, distance: 20, speed: 0.02},
    { name: 'Mars', radius: 1.2, distance: 25, speed: 0.018},
    { name: 'Jupiter', radius: 3, distance: 32, speed: 0.012},
    { name: 'Saturn', radius: 2.5, distance: 38, speed: 0.01},
    { name: 'Uranus', radius: 2, distance: 43, speed: 0.008},
    { name: 'Neptune', radius: 2, distance: 48, speed: 0.006},
    { name: 'Pluto', radius: 0.7, distance: 54, speed: 0.004}
];

// Create planets and their orbits
const planetMeshes = [];
planets.forEach(planet => {
    const tex = textureLoader.load(textureMap[planet.name]);
    const material = new THREE.MeshStandardMaterial({ map: tex });
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.userData = { name: planet.name };
    planetMesh.position.y = 0.5;
    scene.add(planetMesh);
    planetMeshes.push(planetMesh);

    // Create orbit
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
});

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;

// Animation state
const clock = new THREE.Clock();
let isPaused = false;

// Create control panel
function createControlPanel() {
    const controlPanel = document.getElementById('planet-controls');
    planets.forEach((planet, index) => {
        const div = document.createElement('div');
        div.className = 'planet-control';
        div.innerHTML = `
            <label for="speed-${index}">${planet.name} Speed</label>
            <input type="range" id="speed-${index}" min="0" max="0.1" step="0.001" value="${planet.speed}">
            <span class="speed-value">${planet.speed.toFixed(3)}</span>
        `;
        controlPanel.appendChild(div);

        const slider = div.querySelector('input');
        const speedValue = div.querySelector('.speed-value');
        
        slider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            planets[index].speed = newSpeed;
            speedValue.textContent = newSpeed.toFixed(3);
        });
    });

    // Pause/Resume button
    const pauseButton = document.getElementById('pause-resume');
    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    });

    // Theme toggle
    const themeButton = document.getElementById('theme-toggle');
    themeButton.addEventListener('click', () => {
        const isDark = scene.background.equals(new THREE.Color(0x000000));
        scene.background = new THREE.Color(isDark ? 0x87CEEB : 0x000000);
    });
}

createControlPanel();

// Tooltip handling
const tooltip = document.querySelector('.tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function updateTooltip() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.textContent = planet.userData.name;
    } else {
        tooltip.style.display = 'none';
    }
}

window.addEventListener('mousemove', onMouseMove);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 250);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (!isPaused) {
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Rotate sun
        sun.rotation.y += 0.002;

        // Update planet positions
        planetMeshes.forEach((planet, index) => {
            const planetData = planets[index];
            planet.position.x = Math.cos(elapsedTime * planetData.speed) * planetData.distance;
            planet.position.z = Math.sin(elapsedTime * planetData.speed) * planetData.distance;
            planet.rotation.y += 0.01;
        });
    }

    updateTooltip();
    controls.update();
    renderer.render(scene, camera);
}

// Start animation
animate(); 