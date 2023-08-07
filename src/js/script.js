import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as dat from "dat.gui";
// live chat functionality // multiplayer app
//************************************* */
import io from "socket.io-client";
const socket = io.connect("https://socket-io-express-server.onrender.com");

document.getElementById("sendMessegeButton").addEventListener("click", () => {
  console.log("clickeddddddddd");
  let inputMessege = document.getElementById("inputMessege").value;
  console.log(inputMessege);
  socket.emit("send_message", { messege: inputMessege });

  const listItem = document.createElement("li");
  listItem.textContent = inputMessege;
  const listElement = document.getElementById("sendList");
  listElement.appendChild(listItem);
});

socket.on("receive_message", (data, i) => {
  data = data.messege;
  console.log("Data :", data, "I:", i);
  if (data !== "") {
    const listItem = document.createElement("li");
    listItem.textContent = data;
    const listElement = document.getElementById("dataList");
    listElement.appendChild(listItem);
  }
});

//************************************* */
const renderer = new THREE.WebGLRenderer();
//ADDING SHADOW
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById("threejs-canvas-container");
container.appendChild(renderer.domElement);

// create seen
const scene = new THREE.Scene();
//crete camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// add camera and renderer to the orbit control
const orbit = new OrbitControls(camera, renderer.domElement);

//HELP
const axesHelper = new THREE.AxesHelper(5);
//add the helper to the seen
scene.add(axesHelper);
camera.position.set(-10, 20, 30);

axesHelper.position.set(5, 5, 5);

// update the orbit after camera position change
orbit.update();

function makingAplane(height, width) {
  const planeGeometry = new THREE.PlaneGeometry(height, width);
  const planeMeterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(planeGeometry, planeMeterial);
}

const plane1 = makingAplane(30, 30);
//wall 1
const plane2 = makingAplane(12, 13);
const plane23 = makingAplane(12, 13);
const windwoUp = makingAplane(6, 4);
const windwoDown = makingAplane(6, 3.5);
scene.add(windwoDown);
scene.add(windwoUp);
windwoUp.position.set(0, 2, 14);
windwoDown.position.set(0, 11, 14);
plane2.position.set(8, 6.5, 14); //x,y ,z
plane23.position.set(-8, 6.5, 14); //x,y ,z

const plane3 = makingAplane(28, 13);
// const plane34 = makingAplane(28, 10);

const plane4 = makingAplane(28, 13);
const plane5 = makingAplane(12, 13);
const plane52 = makingAplane(12, 13);
plane52.rotation.y = Math.PI / 2;

scene.add(plane1);
plane1.rotation.x = Math.PI / 2;
plane1.receiveShadow = true;
scene.add(plane2);
scene.add(plane23);
scene.add(plane3);
// scene.add(plane34);
scene.add(plane5);
scene.add(plane52);
scene.add(plane4);

plane4.position.set(0, 6.5, -14);
plane3.position.set(14, 6.5, 0); //
plane5.position.set(-14, 6.5, 8);

plane52.position.set(-14, 6.5, -8);
plane3.rotation.y = Math.PI / 2;
plane5.rotation.y = Math.PI / 2;

//ADDING A GRID HELPER for the plane

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
//LIGHT FUNCTION

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// MAKING BAGROUND
renderer.setClearColor(0xffea00);

// ADDING GUI FOR CONTROLLING THE COLLER AND OTHER FEATURES
// ading the gui for giving dinamic input for
//  the colur , and other featurs
const gui = new dat.GUI();

// const option = {
//   //
//   cameraP_X: -10,
//   cameraP_Y: 30,
//   cameraP_Z: 30,
//   sphereColo: "#ffea00",
//   wireframe55: true,
//   speed: 0.01,
//   angle: 0.2,
//   penumbra: 1,
//   intensity: 20,
//   Yposition: 10,
// };
// gui.add(option, "cameraP_X").onChange((e) => {
//   camera.position.set(e, option.cameraP_Y, option.cameraP_Z);
// });
// gui.addColor(option, "sphereColo").onChange(function (e) {
//   //   spire.material.color.set(e);
// });

// gui.add(option, "wireframe55").onChange((e) => {
//   //   spire.material.wireframe = e;
// });
// gui.add(option, "cameraP_X", 0, 10);
// gui.add(option, "speed", 0, 0.1);
// gui.add(option, "angle", 0, 1);
// gui.add(option, "penumbra", 0, 10);
// gui.add(option, "intensity", 0, 300);
// gui.add(option, "Yposition", 0, 100);
// variable for bounce the spire

let step = 0;
// let speed = 0.01;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  // console.log("call mouse move function ", mousePosition.x);
});
const rayCaster = new THREE.Raycaster();

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
//MODELS
let car, table, candel, roomWindow, door;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

// adding the enveremnt for the models
rgbeLoader.load("./MR_INT-005_WhiteNeons_NAD.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  gltfLoader.load("./gaming_chair_free_download/scene.gltf", function (gltf) {
    // chair
    const model = gltf.scene;
    scene.add(model);
    model.position.set(7, -0.5, 2);
    model.scale.set(0.02, 0.02, 0.02);
  });

  //door
  gltfLoader.load("./roomDoor/scene.gltf", function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.05, 0.05, 0.05);
    scene.add(model);
    model.position.set(-14, 6, 0);
    door = model;
  });

  gltfLoader.load("./roomWindow/scene.gltf", function (gltf) {
    // window
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 7, 14);
    model.scale.set(0.05, 0.05, 0.05);
    roomWindow = model;
  });

  gltfLoader.load("./laptop_free/scene.gltf", function (gltf) {
    //laptop
    const model = gltf.scene;
    scene.add(model);
    model.position.set(9, 6.5, 10);
    model.scale.set(0.015, 0.015, 0.015);
    model.rotation.y = Math.PI;
  });

  gltfLoader.load("./end_table/scene.gltf", function (gltf) {
    // table
    const model = gltf.scene;
    scene.add(model);
    model.position.set(9, 0, 10);
    model.scale.set(2, 2, 2);
    table = model;
  });
  gltfLoader.load("./flower_vase/scene.gltf", function (gltf) {
    // flower
    const model = gltf.scene;
    scene.add(model);
    model.position.set(11.5, 7.5, 12);
    model.scale.set(0.8, 0.8, 0.8);
  });
  gltfLoader.load("./indian_flag/scene.gltf", function (gltf) {
    // indian flag
    const model = gltf.scene;
    scene.add(model);
    model.position.set(13.5, 7.5, 10);
    model.scale.set(0.025, 0.025, 0.025);
  });

  gltfLoader.load("./old_sofa_free/scene.gltf", function (gltf) {
    //sofa
    const model = gltf.scene;
    scene.add(model);
    model.position.set(8, 0, -11);
    model.scale.set(0.05, 0.05, 0.05);
    // roomWindow = model;
  });
  gltfLoader.load("./photo_collage_wall/scene.gltf", function (gltf) {
    // photo
    const model = gltf.scene;
    scene.add(model);
    model.position.set(13.5, 7.5, -10);
    model.scale.set(10, 10, 10);
    model.rotation.z = Math.PI / 2;
  });
});

/// ******************************CODE FOR AVTAR CREATION *********************
const subdomain = "app1-l6nouw";
const frame = document.getElementById("frame");
frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;

window.addEventListener("message", subscribe);
document.addEventListener("message", subscribe);

function subscribe(event) {
  const json = parse(event);

  if (json?.source !== "readyplayerme") {
    return;
  }

  // Susbribe to all events sent from Ready Player Me once frame is ready
  if (json.eventName === "v1.frame.ready") {
    frame.contentWindow.postMessage(
      JSON.stringify({
        target: "readyplayerme",
        type: "subscribe",
        eventName: "v1.**",
      }),
      "*"
    );
  }

  // Get avatar GLB URL
  if (json.eventName === "v1.avatar.exported") {
    console.log(`Avatar URL: ${json.data.url}`);
    document.getElementById(
      "avatarUrl"
    ).innerHTML = `Avatar URL: ${json.data.url}`;
    console.log("url: ", json.data.url);
    createdAvtarurl = json.data.url;
    // add ready pleat me model

    gltfLoader.load(
      json.data.url,
      (gltf) => {
        const mesh = gltf.scene;
        mesh.scale.set(5, 5, 5);
        scene.add(mesh);
      },
      undefined,
      (error) => {
        console.error("Error loading the 3D model:", error);
      }
    );

    document.getElementById("frame").hidden = true;
  }

  // Get user id
  if (json.eventName === "v1.user.set") {
    console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
  }
}

function parse(event) {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return null;
  }
}
//******************end***CODE FOR AVTAR****************** */
function animate(time) {
  rayCaster.setFromCamera(mousePosition, camera);
  renderer.render(scene, camera);
}

// add the function to the loop
renderer.setAnimationLoop(animate);
renderer.render(scene, camera);

/// resize the windp after change the browser window size
renderer.domElement.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Define a Raycaster to check for intersections
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  for (const intersect of intersects) {
    if (intersect.object === plane5) {
      console.log("Plane 5 clicked");
      break; // Break the loop, since we only want to handle the first intersection with the plane
    }
    if (intersect.object === plane1) {
      camera.position.set(-10, 10, 0); // x, yz
    }
    if (intersect.object === table) {
      console.log("table clicked");
      camera.position.set(-10, 10, 0); // x, yz
    }
  }
});

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
