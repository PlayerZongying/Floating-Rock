import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as dat from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { MeshBasicMaterial, MeshNormalMaterial } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const stats = Stats()
// document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const gltfLoader = new GLTFLoader()

const rock1 = new THREE.Object3D();
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('/model/Rock 17_basecolor 4096 grey.jpg')
colorTexture.flipY = false
// const normalTexture = textureLoader.load('/model/Rock 17_normal (4096).png')
// normalTexture.flipY = false
// const roughTexture = textureLoader.load('/model/Rock 17_roughness (4096).jpg')
// roughTexture.flipY = false
const material = new THREE.MeshBasicMaterial()
material.map = colorTexture
// material.normalTexture = normalTexture
// material.roughTexture = roughTexture

const rock = new THREE.Object3D();
const rockMat = new MeshBasicMaterial();
rockMat.transparent = true
rockMat.opacity = 0.5
rockMat.wireframe = true
gltfLoader.load(
    //'/models/Duck/glTF-Binary/Duck.glb',
    //  '/model/rock.gltf',
    '/model/rock17.gltf',
    // '/model/BlueRockWhole.gltf',
    (gltf) => {
        //  console.log('success')
        const children = [...gltf.scene.children]
        for (const child of children) {
            //  console.log(child)
            child.material = material
            rock.add(child)
        }
        //  console.log(gltf)
    },
    // (progress) => {
    //     console.log('progress')
    // console.log(progress)
    // },
    // (error) => {
    //     console.log('error')
    //     console.log(error)
    // }
)
rock.scale.multiplyScalar(2.5)
//  rock.position.z = 1

// const object1 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     // new THREE.MeshBasicMaterial({ color: '#ff0000' , wireframe: 'true' })
//     rockMat
// )
const object1 = new THREE.Object3D()
object1.position.x = 0
object1.add(rock)

// const object2 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(object2)

// const object3 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// object3.position.x = 2

// const wallMat = new MeshBasicMaterial();
// wallMat.transparent = true
// wallMat.opacity = 0.5
// const wall = new THREE.Mesh(
//     new THREE.PlaneGeometry(50, 50),
//     wallMat
// )
// wall.position.z = -5

scene.add(object1)

/**
 * Raycaster
 */
// const raycaster = new THREE.Raycaster()
let currentIntersect = null
// const rayOrigin = new THREE.Vector3(- 3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    // sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

// let intersects = raycaster.intersectObject(wall);
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // console.log(mouse.x)

    mouse.x = Math.max(Math.min(mouse.x, 1), -1)
    mouse.y = Math.max(Math.min(mouse.y, 0.5), -0.5)
    // mouse.x = (event.clientX / sizes.width) * 2 - 1;
    // mouse.y = - (event.clientY / sizes.height) * 2 + 1;

    // raycaster.setFromCamera(mouse, camera);

    // See if the ray from the camera into the world hits one of our meshes
    // intersects = raycaster.intersectObject(wall);

    // Toggle rotation bool for meshes that we clicked
    // if (intersects.length > 0) {

    //     console.log(intersects[0].point);
    //     object1.position.copy(intersects[0].point)

    // }
})

let isMouseIn = false

window.addEventListener('mouseout', (event) => {
    // console.log("outer")
    isMouseIn = false
})

window.addEventListener('mouseover', (event) => {
    // console.log("in")
    isMouseIn = true
})


// window.addEventListener('click', () => {
//     if (currentIntersect) {
//         switch (currentIntersect.object) {
//             case object1:
//                 console.log('click on object 1')
//                 break

//             case object2:
//                 console.log('click on object 2')
//                 break

//             case object3:
//                 console.log('click on object 3')
//                 break
//         }
//     }
// })


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 150)
camera.position.z = 5
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const speed = 0.5
const rotateSpeed = 0.3
let prevTime = 0
let currTime = 0
let deltaTime = 0

function RandomRange(min, max) {
    let x = Math.random() * (max - min) + min;
    return x
}
let initVX = RandomRange(-0.002, 0.002)
let initVY = RandomRange(-0.002, 0.002)

var vec = new THREE.Vector3(); // create once and reuse
var pos = new THREE.Vector3(); // create once and reuse
var dir = new THREE.Vector3();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    currTime = elapsedTime
    deltaTime = currTime - prevTime
    prevTime = currTime
    // console.log(deltaTime)

    // Animate objects
    rock.rotation.x = elapsedTime * 0.3 * rotateSpeed
    rock.rotation.y = elapsedTime * 0.5 * rotateSpeed
    rock.rotation.z = elapsedTime * 0.2 * rotateSpeed

    rock.position.x = Math.sin(elapsedTime * 0.25 + 2) * 0.3
    rock.position.y = Math.sin(elapsedTime * 0.3 + 3) * 0.3
    rock.position.z = Math.sin(elapsedTime * 0.35 + 4) * 0.3

    object1.rotation.x = elapsedTime * 0.3 * rotateSpeed
    object1.rotation.y = elapsedTime * 0.5 * rotateSpeed
    object1.rotation.z = elapsedTime * 0.1 * rotateSpeed
    // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    // object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // object follow
    // if(intersects){
    //     let dir = new THREE.Vector3()
    //     dir.subVectors(intersects[0].point, object1.position) 
    //     // console.log(dir)
    //     object1.position.add(dir.multiplyScalar(speed * 0.5 * deltaTime))
    //     object1.position.z = 0
    //     // rock.position.add(dir.multiplyScalar(speed * deltaTime))
    // }

    if (!isMouseIn) {
        mouse.x += initVX * (Math.sin(elapsedTime) + 1)
        mouse.y += initVY * (Math.sin(elapsedTime) + 1)

        if (mouse.x > 1) {
            initVX = - RandomRange(0.001, 0.002)
        }

        if (mouse.x < -1) {
            initVX = RandomRange(0.001, 0.002)
        }

        if (mouse.y > 0.65) {
            initVY = - RandomRange(0.001, 0.002)
        }

        if (mouse.y < -0.65) {
            initVY = RandomRange(0.001, 0.002)
        }

        // console.log(mouse.x)


    }

    // if(mouse.x < 0){
    //     mouse.x = 0
    // }
    vec.set(mouse.x, mouse.y, 0.5)
    // console.log(vec)
    vec.unproject(camera)
    vec.sub(camera.position).normalize();
    var distance = - camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    dir.subVectors(pos, object1.position)
    // console.log(dir.length())

    if (dir.length() > 1) {
        dir.normalize()
    }
    
    let vel = dir.multiplyScalar(speed * 0.5 * deltaTime)

    object1.position.add(vel)

    // Cast a ray from the mouse and handle events
    // raycaster.setFromCamera(mouse, camera)

    // const objectsToTest = [object1, object2, object3]
    // const objectsToTest = [wall]
    // const intersects = raycaster.intersectObjects(objectsToTest)

    // if (intersects.length) {
    //     // console.log(intersects[0].point);
    //     if (!currentIntersect) {
    //         console.log('mouse enter')
    //     }

    //     currentIntersect = intersects[0]
    // }
    // else {
    //     if (currentIntersect) {
    //         console.log('mouse leave')
    //     }

    //     currentIntersect = null
    // }

    // Update controls
    // controls.update()

    // Render
    // stats.update()
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()