import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { Linear } from "gsap";

gsap.registerPlugin(Linear);
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const brickColorMap = textureLoader.load(
  "https://res.cloudinary.com/dl5mqatis/image/upload/v1649445481/pbr/albedo_omraud.jpg"
);
const brickDispMap = textureLoader.load(
  "https://res.cloudinary.com/dl5mqatis/image/upload/v1649445483/pbr/disp_zewwzw.png"
);
const brickNormalMap = textureLoader.load(
  "https://res.cloudinary.com/dl5mqatis/image/upload/v1649445907/pbr/normal_iekh9s.jpg"
);
const brickRoughMap = textureLoader.load(
  "https://res.cloudinary.com/dl5mqatis/image/upload/v1649445481/pbr/rough_nh4yb2.jpg"
);

const canvas = document.querySelector("#canvas");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  10
);
camera.position.z = 5;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// const geometry = new THREE.TorusKnotBufferGeometry(1, 0.3, 100, 16);
const geometry = new THREE.IcosahedronBufferGeometry(1, 30);
const material = new THREE.MeshStandardMaterial({ map: brickColorMap });
material.roughness = brickRoughMap;
material.displacementMap = brickDispMap;
material.normalMap = brickNormalMap;
material.displacementScale = 0.4;
material.roughness = 0.5;

const mesh = new THREE.Mesh(geometry, material);

mesh.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2)
);

scene.add(mesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const tl = gsap.timeline();
tl.to(mesh.rotation, {
  y: Math.PI * 2,
  ease: Linear.easeNone,
  duration: 30,
  repeat: Infinity,
});

const tick = () => {
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
