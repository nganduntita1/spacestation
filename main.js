import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
 
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 0.5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const color5 = new THREE.Color( 'rgb(120, 144, 156)' );



const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1, 20);
directionalLight1.position.set(1, 0.5, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1,0.5);
directionalLight2.position.set(-1, -0.5, -1); 
scene.add(directionalLight2);


const pointLight = new THREE.PointLight(0xffffff, 1, 10);
pointLight.position.set(0, 2, 0); 
scene.add(pointLight);


const spotlight = new THREE.SpotLight(0xffffff, 10, 50, 6.2, 20.5);
spotlight.position.set(0, 3, 0); 
spotlight.target.position.set(0, 0, 0); 
scene.add(spotlight);
scene.add(spotlight.target);


const ambientLight = new THREE.AmbientLight(0x002212, 3.5); 
scene.add(ambientLight);

const material = new THREE.Mesh(new THREE.CylinderGeometry(100,50,200,20,20,false), new THREE.MeshPhongMaterial({
   color: 0x814788,
   specular: 'red',
   shininess: '100',
    
  })) 
scene.add(material)

const sl2 = new THREE.SpotLight(0x3C4C78, 30, 50,0.2, 0.5);
sl2.position.set(5, 20, 0);
scene.add(sl2 );


const light = new THREE.AmbientLight( 0x404040 ); 
scene.add( light );
const light2 = new THREE.AmbientLight( 0x3C4C78 ); 
scene.add( light2 );

let mixer;

const loader = new GLTFLoader().setPath('public/spacestation/');
loader.load('scene.gltf', (gltf) => {
  const spaceStation = gltf.scene;
  mixer = new THREE.AnimationMixer(spaceStation)
  const clips = gltf.animations;
  clips.forEach(function(clip){
    const action = mixer.clipAction(clip);
    action.play();
  })

  spaceStation.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
    }
  });
   

  spaceStation.position.set(0, 1.05, 2);
  scene.add(spaceStation);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  document.getElementById('progress').innerHTML = `LOADING ${Math.max(xhr.loaded / xhr.total, 1) * 100}/100`;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  if(mixer)
      mixer.update(clock.getDelta());
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
