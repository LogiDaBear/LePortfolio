import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Setups
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


// Torus
const geometry = new THREE.TorusGeometry( 10, 3, 100, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0x8B10DD } ); 
const torus = new THREE.Mesh( geometry, material ); scene.add( torus );

scene.add(torus)

// Lighting
const pointLight = new THREE.PointLight(0x00FF00)
pointLight.position.set(20,20,20)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, pointLight)


// Helpers to see grids/object rotations

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridLightHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff})
  const star = new THREE.Mesh( geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(350).fill().forEach(addStar)

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
const eyeballTexture = new THREE.TextureLoader().load('eyeball.jpg');
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

// Animation
function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  eyeball.rotation.x += 0.005;
  // controls.update();

  renderer.render( scene, camera );
}

animate()