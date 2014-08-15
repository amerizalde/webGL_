var stats,
    scene,
    camera,
    renderer,
    animating = false;

$(document).ready(function () {
    //stats
    stats = initStats();
    // create a new scene, camera, renderer, and visual aid
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000),
    renderer = new THREE.WebGLRenderer({ antialias: true});
    
    var axes = new THREE.AxisHelper(10);

    // set renderer properties
    renderer.setClearColor(0xeeeeee, 1.0);
    renderer.setSize(window.innerWidth , window.innerHeight);
    renderer.shadowMapEnabled = true;
    
    // add axis visual aid to scene container
    scene.add(axes);
    
    setupGeometry(scene);
    setupCamera(camera, scene);
    setupLighting(scene);
    
    // put the renderer into the DOM
    $("#container").append(renderer.domElement);
    
    mouseHandler();
    
    // render the scene
    (function renderScene () {
        // toggle animation
        if (animating) {
            var obj = scene.getObjectByName("cube");
            obj.rotation.x += 0.02;
            obj.rotation.y += 0.05;
            obj.rotation.z += 0.02;
        }
        
        requestAnimationFrame(renderScene); // give the browser control over timing
        renderer.render(scene, camera); // render the scene
    }) ();
});

function setupGeometry (scene) {
    // create ground plane and set properties
    // colors are in hex -- (r, g, b) === 0x 00 00 00
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1), // (w, h, ?, ?)
        planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true; // receive shadows on
    
    // add plane to scene container
    scene.add(plane);

    // load texture for cube
    var mapUrl = "assets/3682835759_f22510210c.jpg";
    var map = THREE.ImageUtils.loadTexture(mapUrl);
    
    // create a cube and set properties
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4),
        // create material with texture
        cubeMaterial = new THREE.MeshLambertMaterial({ map: map}),
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true; // shadows on
    cube.name = "cube";
    
    scene.add(cube);

    // create a sphere and set properties
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20),
        sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff}),
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true; // shadows on
    
    scene.add(sphere);
}

function setupCamera (camera, scene) {
    // set camera properties
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position); // track camera at center of the scene
}

function setupLighting (scene) {
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(-40, 60, -10);
    spotlight.castShadow = true; // shadows on
    scene.add(spotlight);
}

function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '10px';
    stats.domElement.style.top = '0px';
    $("#stats").append(stats.domElement);
    return stats;
}

function mouseHandler() {
    var dom = renderer.domElement;
    // add a callback to the renderer div's mouse up event
    dom.addEventListener('mouseup', onMouseUp, false);
}

function onMouseUp(event) {
    // block any default mouse bindings
    event.preventDefault();
    // bool switch
    animating = !animating;
}
