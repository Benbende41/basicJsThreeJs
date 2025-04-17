import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { GUI } from "lil-gui";

import { gsap } from "gsap";

const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

let scrollY = 0;

let currentSection = 0;

const sectionMeshes = []
/**
 * 浏览器事件
 */
//窗口重置
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

//滚动事件
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  let newSection = Math.round(scrollY / sizes.height);
  if(newSection !== currentSection){
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation,{
      duration:1.5,
      ease:"power2.inOut",
      x:"+=3",
      y:"+=6",
    })
  }
  
  
});

//鼠标移动事件
window.addEventListener("mousemove",(e)=>{
  cursor.x = e.clientX/sizes.width-0.5
  cursor.y = e.clientY/sizes.height-0.5
})

/**
 * texture
 */
const textLoadingManager = new THREE.LoadingManager()
const textureLoader=  new THREE.TextureLoader(textLoadingManager)
const gradientTexture = textureLoader.load('/texture/gradients/3.jpg')

gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);

const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

const renderer = new THREE.WebGLRenderer({
    alpha:true,
    canvas:document.querySelector('.webgl')
});


/**
 * light 
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)



const params = {
    color: '#12aa9c',
    objectDistance: 4,
}


const material = new THREE.MeshToonMaterial({
    color:params.color,
    gradientMap:gradientTexture
})

const generateGeometry = () => {
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 1)
    const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
    icosahedron.position.set(1.8, 0, 0)
    const torusKnotGeometry = new THREE.TorusKnotGeometry( 0.5, 0.25, 100, 16 );
    const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
    torusKnot.position.set(-1.8, -params.objectDistance, 0)
    const boxGeometry = new THREE.BoxGeometry(1,1,1)
    const box = new THREE.Mesh(boxGeometry,material)
    box.position.set(1.8,-params.objectDistance*2,0)
    scene.add(icosahedron,torusKnot,box)
    sectionMeshes.push(icosahedron,torusKnot,box)

}

generateGeometry()
gui.addColor(params, 'color').onChange(()=>{
  material.color = new THREE.Color(params.color)
  material.needsUpdate = true
})

camera.position.set(0, 0, 5);
const clock = new THREE.Clock()
let previousTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  camera.position.y = -scrollY / sizes.height*params.objectDistance;

  const parallaxX = -cursor.x
  const parallaxY = cursor.y

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime


  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio));

  renderer.render(scene, camera);
}

//setAnimationLoop 参数接收一个回调函数，这个方法是为了替代原来的requestAnimationFrame
renderer.setAnimationLoop(animate);

