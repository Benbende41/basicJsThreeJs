import "./style.css";

import * as THREE from "three";
import { gsap } from "gsap";

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   120,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );

const camera = new THREE.OrthographicCamera(-3,3,3,-3,1,100)

const renderer = new THREE.WebGLRenderer();

const axes = new THREE.AxesHelper(3);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

scene.add(axes);

camera.position.z = 2;
camera.position.x = 2;
camera.position.y = 2;

camera.lookAt(cube.position)

gsap.to(cube.rotation, {
  y: Math.PI,
  delay:1,
  duration: 2,
  yoyo:true
});

function animate() {
  renderer.render(scene, camera);
}
renderer.setSize(window.innerWidth, window.innerHeight, false);

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.querySelector("#app").appendChild(renderer.domElement);
