import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from "lodash-es";

import { GUI } from "lil-gui";

const gui = new GUI();
/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Texture
 */

const LoadingManager = new THREE.LoadingManager();
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader(LoadingManager);
const colorTexture = textureLoader.load("/texture/door/baseColor.jpg");
const opacityTexture = textureLoader.load("/texture/door/opacity.jpg");
const heightTexture = textureLoader.load("/texture/door/height.png");
const normalTexture = textureLoader.load("/texture/door/normal.jpg");
const ambientTexture = textureLoader.load("/texture/door/ambientOcclusion.jpg");
const metallicTexture = textureLoader.load("/texture/door/metallic.jpg");
const roughnessTexture = textureLoader.load("/texture/door/roughness.jpg");
const matCapTexture = textureLoader.load("/texture/matcaps/1.png");
const gradientTexture = textureLoader.load("/texture/gradients/5.jpg");

const environmentMap = cubeTextureLoader.load([
  '/texture/environmentMap/envMap/px.png',
  '/texture/environmentMap/envMap/nx.png',
  '/texture/environmentMap/envMap/py.png',
  '/texture/environmentMap/envMap/ny.png',
  '/texture/environmentMap/envMap/pz.png',
  '/texture/environmentMap/envMap/nz.png',
])


gradientTexture.magFilter = THREE.NearestFilter;

/**
 * 事件处理
 */
window.addEventListener("mousemove", (e) => {
  cursor.x = _.divide(e.clientX, sizes.width) - 0.5;
  cursor.y = _.divide(e.clientY, sizes.height) - 0.5;
});
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const aspectRatio = _.divide(sizes.width, sizes.height);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(120, aspectRatio, 0.1, 100);

const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const planeGeometry = new THREE.PlaneGeometry(1, 1,100,100);
const torusGeometry = new THREE.TorusGeometry(1, 0.5, 16, 60);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// const material = new THREE.MeshBasicMaterial({
//   map: colorTexture,
// });
// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matCapTexture;

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

const material = new THREE.MeshLambertMaterial();
gui.add(material,'wireframe')
material.map = colorTexture;
material.aoMap = ambientTexture
material.aoMapIntensity =2
material.displacementMap = heightTexture
material.displacementScale = 0.05
material.metalnessMap = metallicTexture
material.roughnessMap = roughnessTexture
material.normalMap = normalTexture
material.alphaMap = opacityTexture
material.transparent = true

material.envMap = environmentMap
material.envMapIntensity = 0.5

// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "roughness").min(0).max(1).step(0.001);
// gui.add(material,'displacementScale').min(0.01).max(0.1).step(0.001)

// material.alphaMap = opacityTexture;
// material.transparent = true;

const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2)
);


scene.add(plane);

// plane.position.x = 2;
torus.position.x = -3;
camera.position.z = 1;

function animate() {
  camera.lookAt(sphere.position);
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.querySelector("#app").appendChild(renderer.domElement);
