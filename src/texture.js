import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from "lodash-es";

/**
 * Texture
 */
const loadingManger = new THREE.LoadingManager();
loadingManger.onStart = () => {
  console.log("onStart");
};
loadingManger.onLoad = () => {
  console.log("loaded");
};
loadingManger.onProgress = (e) => {
  console.log(e);
};
const textureLoader = new THREE.TextureLoader(loadingManger);
const colorTexture = textureLoader.load("/texture/door/baseColor.jpg");
const opacityTexture = textureLoader.load("/texture/door/opacity.jpg");
const heightTexture = textureLoader.load("/texture/door/height.png");
const normalTexture = textureLoader.load("/texture/door/normal.jpg");
const ambientTexture = textureLoader.load("/texture/door/ambientOcclusion.jpg");
const metallicTexture = textureLoader.load("/texture/door/metallic.jpg");
const roughnessTexture = textureLoader.load("/texture/door/roughness.jpg");


colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.LinearFilter;

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
// const camera = new THREE.OrthographicCamera(-3*aspectRatio,3*aspectRatio,3,-3,1,100)
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(120, aspectRatio, 0.1, 100);

const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

const axes = new THREE.AxesHelper(3);

const geometry = new THREE.BoxGeometry(1, 1, 1);
console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
scene.add(axes);

camera.position.z = 1;

function animate() {
  camera.lookAt(cube.position);
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.querySelector("#app").appendChild(renderer.domElement);
