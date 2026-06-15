import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mount = document.getElementById("viewer");
const fallback = document.getElementById("viewerFallback");
if (mount) init();

function init(){
  const w = mount.clientWidth, h = mount.clientHeight;
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(w,h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, w/h, 0.1, 100);
  camera.position.set(0, 0.2, 6);

  // lighting — premium studio
  scene.add(new THREE.AmbientLight(0xffffff, .55));
  const key = new THREE.DirectionalLight(0xfff2d6, 2.2); key.position.set(3,5,4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9a227, 1.4); rim.position.set(-4,2,-3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x88aaff, .5); fill.position.set(-2,-1,4); scene.add(fill);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.enablePan = false; controls.minDistance = 4; controls.maxDistance = 9;
  controls.autoRotate = true; controls.autoRotateSpeed = 1.4;
  controls.minPolarAngle = Math.PI*0.18; controls.maxPolarAngle = Math.PI*0.82;

  const group = new THREE.Group(); scene.add(group);
  const BASE = {d:10, h:54}; // 10x54 default proportions

  const loader = new GLTFLoader();
  loader.load("assets/model/unidade.glb", (gltf)=>{
    const obj = gltf.scene;
    // center + normalize to height ~3 units
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center);
    const norm = 3.2 / (size.y || 1);
    obj.scale.setScalar(norm);
    group.add(obj);
    if (fallback) fallback.style.display = "none";
  }, undefined, (err)=>{
    console.warn("GLB load failed, keeping image fallback", err);
    // keep fallback image; stop renderer overhead
    renderer.setAnimationLoop(null);
  });

  // change proportions per model
  window.addEventListener("af:model", (e)=>{
    const {d,h} = e.detail;
    const sx = d/BASE.d, sy = h/BASE.h;
    group.scale.set(sx, sy, sx);
  });

  function resize(){
    const W = mount.clientWidth, H = mount.clientHeight;
    renderer.setSize(W,H); camera.aspect = W/H; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  renderer.setAnimationLoop(()=>{ controls.update(); renderer.render(scene,camera); });
}
