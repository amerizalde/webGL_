$(function () {
    var scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000),
        renderer = new THREE.WebGLRenderer(),
        axes = new THREE.AxisHelper(20);

    // set renderer properties
    renderer.setClearColorHex(0xeeeeee);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // add axis visual aid to scene container
    scene.add(axes);
    
    // create ground plane and set properties
    // colors are in hex -- (r, g, b) === 0x 00 00 00
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1), // (w, h, ?, ?)
        planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    
    // add plane to scene container
    scene.add(plane);
    
    // create a cube and set properties
    var cubeGeometry = new THREE.CubeGeometry(4, 4, 4),
        cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true}),
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    
    scene.add(cube);
    
    // create a sphere and set properties
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20),
        sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true}),
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    
    scene.add(sphere);
    
    // set camera properties
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position); // track camera at center of the scene
    
    // put the renderer into the DOM
    $("#container").append(renderer.domElement);
    // render the scene
    renderer.render(scene, camera);
});