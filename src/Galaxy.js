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

const camera = new THREE.PerspectiveCamera(
  120,
  sizes.width / sizes.height,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
const params = {};
params.count = 100000;
params.size = 0.01;
params.radius = 5;
params.branches = 3;
params.spin = 1;
params.randomness = 0.2;
params.randomnessPower = 3;
params.insideColor = "#c04851";
params.outsideColor = "#2775b6";
let points = null;
let geometry = null;
let material = null;

const generateGalaxy = () => {
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
    points = null;
  }
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);
  for (let i = 0; i < params.count; i++) {
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i * 3 + 1] = randomY;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside,radius/params.radius)
    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

gui.add(params, "count", 100, 10000, 100).onFinishChange(generateGalaxy);
gui.add(params, "size", 0.01, 0.1, 0.01).onFinishChange(generateGalaxy);
gui.add(params, "radius", 0.1, 20, 0.1).onFinishChange(generateGalaxy);
gui.add(params, "branches", 1, 20, 1).onFinishChange(generateGalaxy);
gui.add(params, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy);
gui.add(params, "randomness", 0, 2, 0.01).onFinishChange(generateGalaxy);
gui.add(params, "randomnessPower", 0, 10, 0.01).onFinishChange(generateGalaxy);
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy);
camera.position.z = 2;

function animate() {
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
