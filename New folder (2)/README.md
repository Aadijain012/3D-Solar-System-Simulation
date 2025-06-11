# Solar System Simulation

A 3D simulation of the solar system built with Three.js. This project creates an interactive visualization of our solar system, featuring the sun and all eight planets with their respective orbits.

## Features

- Realistic 3D visualization of the solar system
- Interactive camera controls (orbit, pan, zoom)
- Animated planet rotations and orbits
- Responsive design that adapts to window size
- Realistic lighting and materials

## How to Run

1. Clone this repository
2. Open `index.html` in a modern web browser
   - For the best experience, use Chrome, Firefox, or Edge
   - Make sure your browser supports WebGL

## Controls

- Left-click and drag to rotate the view
- Right-click and drag to pan
- Scroll to zoom in/out
- The simulation runs automatically, showing planet orbits and rotations

## Technical Details

- Built with Three.js for 3D rendering
- Uses ES6 modules for code organization
- Implements OrbitControls for camera manipulation
- Responsive design that adapts to window resizing

## Browser Compatibility

This simulation requires a modern web browser with WebGL support. The following browsers are recommended:
- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

## Adding Realistic Planet Textures

To use realistic textures for the planets and sun:
1. Create a folder named `textures` in the project root.
2. Save the following images in the `textures` folder with these names:
   - moon.jpg
   - pluto.jpg
   - neptune.jpg
   - mars.jpg
   - venus.jpg
   - saturn.jpg
   - sun.jpg
   - uranus.jpg
   - jupiter.jpg
   - mercury.jpg
   - earth.jpg
3. The code will automatically use these textures for the 3D spheres. 