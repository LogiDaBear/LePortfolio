import './style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Setups
const glowTextureSquare = new THREE.TextureLoader().load('glow_texture.png');  // Path to the square glow texture
const glowTextureCircle = new THREE.TextureLoader().load('circular_glow_texture.png');  // Path to the circular glow texture
const yellowSkinTexture = new THREE.TextureLoader().load('snek.jpg');
const blueSkinTexture = new THREE.TextureLoader().load('blew.jpg');
const sunTexture = new THREE.TextureLoader().load('sunmk2.jpg');




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render( scene, camera );

// Torus with improved material
const geometry = new THREE.TorusGeometry(10, 3, 100, 16); 

const material = new THREE.MeshPhysicalMaterial({ 
  map: yellowSkinTexture,  // Apply the snake skin texture
  roughness: 0.5, 
  metalness: 0.1, 
  clearcoat: 2.0,
  clearcoatRoughness: 0.7 
}); 

const torus = new THREE.Mesh(geometry, material); 
scene.add(torus);

yellowSkinTexture.wrapS = yellowSkinTexture.wrapT = THREE.RepeatWrapping;
yellowSkinTexture.repeat.set(5, 5);  // Adjust these values for desired repeat pattern


// Improved Lighting
const pointLight = new THREE.PointLight(0x00FF00);
pointLight.position.set(20,20,20);
pointLight.castShadow = true; // Enable shadow casting

const hemisphereLight = new THREE.HemisphereLight(0x606060, 0x404040); // soft white light from above
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, pointLight);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // softer shadows

// Make the torus receive and cast shadows
torus.castShadow = true;
torus.receiveShadow = true;


// Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);


// Animation Logic for the Sun Spritesheet
let currentFrame = 0;
const totalFrames = 150;  // assuming 10 frames in the spritesheet

function animateSunTexture() {
    const frameOffset = 1 / totalFrames * currentFrame;
    sun.material.map.offset.x = frameOffset;
    currentFrame = (currentFrame + 1) % totalFrames;  // cycle through frames
}


// Accretion Disk (Torus with emissive material)
const accretionDiskGeometry = new THREE.TorusGeometry(11, 3, 100, 16);  // Slightly larger than the black sphere
const accretionDiskMaterial = new THREE.MeshPhysicalMaterial({
  map: blueSkinTexture,  // Apply the snake skin texture
  color: 0x00bfff,
  emissive: 0x000777,  // This makes the torus glow a bit
  side: THREE.DoubleSide  // Render both sides of the torus
});

const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial);
scene.add(accretionDisk);
blueSkinTexture.wrapS = blueSkinTexture.wrapT = THREE.RepeatWrapping;
blueSkinTexture.repeat.set(5, 5);  // Adjust these values for desired repeat pattern



// Helpers to see grids/object rotations

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridLightHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);

  // Use MeshBasicMaterial for consistent color
  const material = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(105));
  star.position.set(x, y, z);
  scene.add(star);

  // Add core glow using circular glow texture
  const spriteMaterialCircle = new THREE.SpriteMaterial({
    map: glowTextureCircle,
    transparent: true,
    blending: THREE.AdditiveBlending,
    color: 0xffffff
  });
  const spriteCircle = new THREE.Sprite(spriteMaterialCircle);
  spriteCircle.scale.set(0.8, 0.8, 1);  // adjust scale for desired core glow size
  star.add(spriteCircle);

  // Add outer glow using square glow texture
  const spriteMaterialSquare = new THREE.SpriteMaterial({
    map: glowTextureSquare,
    transparent: true,
    blending: THREE.AdditiveBlending,
    color: 0xffffff
  });
  const spriteSquare = new THREE.Sprite(spriteMaterialSquare);
  spriteSquare.scale.set(0.2, 1.5, 2);  // adjust scale for desired outer glow size
  star.add(spriteSquare);
}

Array(350).fill().forEach(addStar);


// Space Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Profile Picture
const logiTexture = new THREE.TextureLoader().load('selfie.jpg')

const logi = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: logiTexture})
);
scene.add(logi);

// Eyeball
const eyeballTexture = new THREE.TextureLoader().load('galeye.jpg');
const eyeball = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: eyeballTexture
  })
);
scene.add(eyeball);

eyeball.position.z = 30;
eyeball.position.setX(-10);

logi.position.z = -5;
logi.position.x = 2;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  eyeball.rotation.x += 0.05;
  eyeball.rotation.y += 0.075;
  eyeball.rotation.z += 0.05;

  logi.rotation.y += 0.01;
  logi.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Main Animation Loop
function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  eyeball.rotation.x += 0.005;

  animateSunTexture();  // animate the sun's texture

  renderer.render( scene, camera );
}


animate()

