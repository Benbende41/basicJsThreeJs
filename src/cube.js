import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { GUI } from "lil-gui";
const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * 窗口重置
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(120, sizes.width / sizes.height, 0.1, 100);

const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
const params = {}
params.count = 1000

const generateGalaxy = () => {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  for(let i=0;i<params.count;i++){
    positions[i*3] = Math.random()
    positions[i*3+1] = Math.random()
    positions[i*3+2] = Math.random()
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial()
  const points = new THREE.Points(geometry, material)
  scene.add(points)
}
generateGalaxy()

camera.position.z = 2;

function animate() {
  camera.lookAt(cube.position);
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
