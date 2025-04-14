import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import _ from "lodash-es";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

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
 * 字体
 */

const fontLoader = new FontLoader();
const font = fontLoader.load(
  "/fonts/optimer_bold.typeface.json",
  //onload回调
  (font) => {
    const textGeometry = new TextGeometry("Hello Herbert!", {
      font,
      size: 0.5,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
      curveSegments: 6,
    });
    //    textGeometry.computeBoundingBox()
    //    textGeometry.translate(-(textGeometry.boundingBox.max.x+textGeometry.boundingBox.min.x)*0.5,
    //     -(textGeometry.boundingBox.max.y+textGeometry.boundingBox.min.y)*0.5,
    //     -(textGeometry.boundingBox.max.z+textGeometry.boundingBox.min.z)*0.5
    //    )
    textGeometry.center();
    const textMaterial = new THREE.MeshNormalMaterial();
    const text = new THREE.Mesh(textGeometry, textMaterial);

    const donutGroup = new THREE.Group();
    const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 16, 60);
    const donutMaterial = new THREE.MeshNormalMaterial();
    console.time("donut");
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);

      donut.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      donut.rotation.x = Math.random() * 2 * Math.PI;
      donut.rotation.y = Math.random() * 2 * Math.PI;

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      donutGroup.add(donut);
    }
    console.timeEnd("donut");
    scene.add(donutGroup);
    scene.add(text);
  },
  //onProgress回调
  (xhr) => {
    console.log(xhr);
  },
  //onError回调
  (error) => {
    console.log(error);
  }
);

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

camera.position.z = 2;

function animate() {
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);
document.querySelector("#app").appendChild(renderer.domElement);
