import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from "lodash-es";

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

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

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
document.querySelector("#app").appendChild(renderer.domElement);
