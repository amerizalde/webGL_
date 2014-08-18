var EarthApp = function () {
    Sim.App.call(this);
}

// subclass Sim.App
EarthApp.prototype = new Sim.App();

// init
EarthApp.prototype.init = function (param) {
    // super().__init__()
    Sim.App.prototype.init.call(this, param);

    var earth = new Earth();
    earth.init();
    this.addObject(earth);

    var sun = new Sun();
    sun.init();
    this.addObject(sun);
};

var Earth = function () {
    Sim.Object.call(this);
};

Earth.RADIUS = 1;
Earth.ROTATION_Y = 0.005;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.85;

Earth.prototype = new Sim.Object();
Earth.prototype.init = function () {
    // create a group
    var earthGroup = new THREE.Object3D();
    this.setObject3D(earthGroup);

    this.createGlobe();
    this.createClouds();
    this.createMoon();
};

Earth.prototype.createGlobe = function () {
    // the texture maps and shader template
    var diffuseMap = THREE.ImageUtils.loadTexture('assets/images/earth_surface_2048.jpg'),
        normalMap = THREE.ImageUtils.loadTexture('assets/images/earth_normal_2048.jpg'),
        specularMap = THREE.ImageUtils.loadTexture('assets/images/earth_specular_2048.jpg'),
        shader = THREE.ShaderLib["normalmap"];

    // add the textures to the shader
    shader.uniforms["tDiffuse"].value = diffuseMap;
    shader.uniforms["tNormal"].value = normalMap;
    shader.uniforms["tSpecular"].value = specularMap;
    shader.uniforms["enableDiffuse"].value = 1; // on
    shader.uniforms["enableSpecular"].value = 1; // on

    // Create an Earth sphere with texture
    var geom = new THREE.SphereGeometry(1, 32, 32);
    // explicitly computing tangents is necessary for normal mapping
    geom.computeTangents();

    var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        lights: true
    }),
        mesh = new THREE.Mesh( geom, material);

    mesh.rotation.z = Earth.TILT;

    // tell framework about the object
    this.object3D.add(mesh);
    this.globeMesh = mesh;
}

Earth.prototype.createClouds = function () {
    // load texture
    var diffuseMap = THREE.ImageUtils.loadTexture("assets/images/earth_clouds_1024.png");
    // add texture to a new material
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: diffuseMap,
        transparent: true
    });

    // create a globe from a sphere primitive and the material just created.
    var geom = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
    var mesh = new THREE.Mesh(geom, material);
    mesh.rotation.y = Earth.TILT;

    this.object3D.add(mesh);
    this.cloudsMesh = mesh;
}

// create the moon
Earth.prototype.createMoon = function () {
    var moon = new Moon();
    moon.init();
    this.addChild(moon);
}

Earth.prototype.update = function () {
    this.globeMesh.rotation.y += Earth.ROTATION_Y;
    this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;
}

// sun light
var Sun = function () {
    Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function () {
    var light = new THREE.PointLight( 0xffffff, 2, 100);
    light.position.set(-10, 0, 20);
    this.setObject3D(light);
}

// moon
var Moon = function () {
    Sim.Object.call(this);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.PERIOD = 28;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.INCLINATION = 0.089;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;

Moon.prototype = new Sim.Object();

Moon.prototype.init = function () {
    var diffuse = new THREE.ImageUtils.loadTexture("assets/images/moon_1024.jpg"),
        geom = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS, 32, 32),
        material = new THREE.MeshPhongMaterial({ map: diffuse, ambient: 0x888888}),
        mesh = new THREE.Mesh( geom, material),
        // convert number to ratio of Earth-sized units
        distance = Moon.DISTANCE_FROM_EARTH / Earth.RADIUS;

    mesh.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));

    // rotate the moon so it shows its moon-face toward earth
    mesh.rotation.y = Math.PI;

    // create a group to contain Earth and satellites
    var moonGroup = new THREE.Object3D();
    moonGroup.add(mesh);

    // tilt to the ecliptic
    moonGroup.rotation.x = Moon.INCLINATION;

    // tell the framework about the object
    this.setObject3D(moonGroup);
    this.moonMesh = mesh;
}

Moon.prototype.update = function () {
    // orbit
    this.object3D.rotation.y += (Earth.ROTATION_Y / Moon.PERIOD);
    Sim.Object.prototype.update.call(this);
}

$(document).ready( function () {
    var app = new EarthApp();
    app.init({ container: document.getElementById('container')});
    app.run();
});
