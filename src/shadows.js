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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * OrbitControls 轨道控制器
 */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(1, 1, 0);
directionalLight.target.position.x = -1;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512 * 2, 512 * 2);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.radius = 10;

scene.add(directionalLight, directionalLight.target);

const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
shadowCameraHelper.visible = false;
scene.add(shadowCameraHelper);

const helper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(helper);

const helper2 = new THREE.CameraHelper(camera);
scene.add(helper2);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const PlaneGeometry = new THREE.PlaneGeometry(3, 3);

const material = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(PlaneGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.y = -0.4;

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

sphere.castShadow = true;

plane.receiveShadow = true;

scene.add(sphere, plane);

camera.position.z = 2;

function animate() {
  camera.lookAt(plane.position);
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.querySelector("#app").appendChild(renderer.domElement);
