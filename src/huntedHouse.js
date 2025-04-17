import GUI from "lil-gui";
import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const gui = new GUI();
/**
 * 容器
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
camera.position.set(0, 3, 6);
scene.add(camera);

//Fog
const fog = new THREE.Fog(0xb0d5df, 1, 13);
scene.fog = fog;

/**
 * 渲染器
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0xb0d5df);

/**
 * 控制器
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * 纹理
 */
const loadingManger = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);

const doorColorTexture = textureLoader.load("/texture/door/baseColor.jpg");
const doorAlphaTexture = textureLoader.load("/texture/door/opacity.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/texture/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/texture/door/height.png");
const doorNormalTexture = textureLoader.load("/texture/door/normal.jpg");
const doorMetallicTexture = textureLoader.load("/texture/door/metallic.jpg");
const doorRoughnessTexture = textureLoader.load("/texture/door/roughness.jpg");

const wallColorTexture = textureLoader.load("/texture/brick/color.jpg");

/**
 * 灯光
 */
const ambientLight = new THREE.AmbientLight(0xb0d5df, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xb0d5df, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

/**
 * House
 */
//group
const house = new THREE.Group();
scene.add(house);

//lights
const doorLight = new THREE.PointLight(0xfbda41, 0.7, 7, 2);
doorLight.position.set(0, 0.91, 1.426);
house.add(doorLight);

gui.add(doorLight, "intensity").min(0).max(10).step(0.001);
gui.add(doorLight.position, "y").min(0).max(3).step(0.001);
gui.add(doorLight.position, "z").min(0).max(3).step(0.001);

//walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.2, 2),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
  })
);

walls.material.side = THREE.DoubleSide;
walls.position.set(0, 0.6, 0);
house.add(walls);

//roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(2, 0.6, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  })
);
roof.position.set(0, 1.5, 0);
roof.rotation.y = Math.PI * 0.25;
console.log(roof);
house.add(roof);

//door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetallicTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(0, 0.5, 1.001);

house.add(door);

//bushes 灌木
const bushes = new THREE.Group();
scene.add(bushes);

const bushGeometry = new THREE.SphereGeometry(1, 10, 10);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "green",
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.3);
bush1.position.set(0.8, 0.2, 1.2);
bushes.add(bush1);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.13);
bush2.position.set(1.2, 0.15, 1.0);
bushes.add(bush2);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.2);
bush3.position.set(-1.2, 0.15, 1.0);
bushes.add(bush3);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.25);
bush4.position.set(-0.8, 0.15, 1.2);
bushes.add(bush4);

/**
 * graves
 */
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.65, 0.6, 0.12);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: "#B2B6B1",
});

for (let i = 0; i < 20; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 2 + Math.random() * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.set(x, 0.35, z);
  grave.rotation.y = Math.random() * 0.1;
  grave.rotation.z = Math.random() * 0.1;

  graves.add(grave);
}

/**
 *
 * floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    color: "#69a794",
  })
);
floor.position.set(0, 0, 0);
floor.rotation.x = -Math.PI / 2;

scene.add(floor);

/**
 * 监听视口大小变化
 */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

function animate() {
  controls.update();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);
