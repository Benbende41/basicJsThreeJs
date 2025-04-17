import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * 视口大小
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const loaderManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaderManager);
const starTexture = textureLoader.load("/texture/particles/11.png");
const circleTexture = textureLoader.load("/texture/particles/2.png");

/**
 * 场景
 */
const scene = new THREE.Scene();

/**
 * 相机
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 6);
scene.add(camera);

/**
 * 渲染器
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);

/**
 * 控制器
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * 监听窗口大小变化
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
})

/**
 * 点
 */
const count = 400
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for(let i = 0; i < count*3; i++){
  positions[i] = (Math.random() - 0.5)*5
  colors[i] = Math.random()
}
const randomGeometry = new THREE.BufferGeometry();
randomGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
randomGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.08,
  sizeAttenuation: true,
  alphaMap: circleTexture,
  transparent: true,
  alphaTest: 0.01,
  vertexColors:true
});

const points = new THREE.Points(randomGeometry, pointsMaterial);
scene.add(points);
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();
  
  randomGeometry.attributes.position.needsUpdate = true
  controls.update();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
