import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



// Load Textures
const glowTextureSquare = new THREE.TextureLoader().load('images/glow_texture.png');
const glowTextureCircle = new THREE.TextureLoader().load('images/circular_glow_texture.png');
const yellowSkinTexture = new THREE.TextureLoader().load('images/snek.jpg');
const blueSkinTexture = new THREE.TextureLoader().load('images/blew.jpg');
const sunTexture = new THREE.TextureLoader().load('images/earthlights1k.jpg');
// const cloudTexture = new THREE.TextureLoader().load('earthcloudmaptrans.jpg');


// Setup Renderer, Scene, and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);



// Torus with Snake Skin Texture
const geometry = new THREE.TorusGeometry(10, 3, 100, 16);
const material = new THREE.MeshPhysicalMaterial({
    map: yellowSkinTexture,
    roughness: 0.5,
    metalness: 0.1,
    clearcoat: 2.0,
    clearcoatRoughness: 0.7
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

yellowSkinTexture.wrapS = yellowSkinTexture.wrapT = THREE.RepeatWrapping;
yellowSkinTexture.repeat.set(5, 5);



// Lighting Setup
const pointLight = new THREE.PointLight(0x00FF00);
pointLight.position.set(10, 30, 50);
pointLight.castShadow = true;

const hemisphereLight = new THREE.HemisphereLight(0x606060, 0x404040);
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, pointLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

torus.castShadow = true;
torus.receiveShadow = true;

// Cloud sphere
// const cloudGeometry = new THREE.SphereGeometry(10.5, 30, 30);  // A bit larger than the sun
// const cloudMaterial = new THREE.MeshBasicMaterial({
//     map: cloudTexture,
//     transparent: true,  // This allows transparency
//     opacity: 0.6        // Adjust to your preference
// });
// const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// scene.add(clouds);

// Earth with Animated Texture
sunTexture.wrapS = THREE.RepeatWrapping;
const sunGeometry = new THREE.SphereGeometry(10, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

let currentFrame = 10;
const totalFrames = 1000;

function animateSunTexture() {
    const frameOffset = 1 / totalFrames * currentFrame;
    sun.material.map.offset.x = frameOffset;
    currentFrame = (currentFrame + 1) % totalFrames;
}

// Accretion Disk
const accretionDiskGeometry = new THREE.TorusGeometry(11, 3, 100, 16);
const accretionDiskMaterial = new THREE.MeshPhysicalMaterial({
    map: blueSkinTexture,
    color: 0x00bfff,
    emissive: 0x000777,
    side: THREE.DoubleSide
});

const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial);
scene.add(accretionDisk);
blueSkinTexture.wrapS = blueSkinTexture.wrapT = THREE.RepeatWrapping;
blueSkinTexture.repeat.set(5, 5);

// Star Creation with Glow
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(105));
    star.position.set(x, y, z);
    scene.add(star);

    const spriteMaterialCircle = new THREE.SpriteMaterial({
        map: glowTextureCircle,
        transparent: true,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
    });
    const spriteCircle = new THREE.Sprite(spriteMaterialCircle);
    spriteCircle.scale.set(0.8, 0.8, 1);
    star.add(spriteCircle);

    const spriteMaterialSquare = new THREE.SpriteMaterial({
        map: glowTextureSquare,
        transparent: true,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
    });
    const spriteSquare = new THREE.Sprite(spriteMaterialSquare);
    spriteSquare.scale.set(0.2, 1.5, 2);
    star.add(spriteSquare);
}

Array(350).fill().forEach(addStar);

// Background and Other Meshes
const spaceTexture = new THREE.TextureLoader().load('images/darkspace.jpg');
scene.background = spaceTexture;

const logiTexture = new THREE.TextureLoader().load('images/selfie.jpg');
const logi = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: logiTexture }));
scene.add(logi);

const eyeballTexture = new THREE.TextureLoader().load('images/galeye.jpg');
const eyeball = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: eyeballTexture }));
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

  // Rotation of the earth about the z-axis
  accretionDisk.rotation.z += 0.005; 

  // clouds.rotation.y -= 0.005;

  eyeball.rotation.x += 0.005;

  animateSunTexture();  // animate the sun's texture

  renderer.render( scene, camera );
}


animate()

