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

Earth.prototype = new Sim.Object();
Earth.prototype.init = function () {
    // create a group
    var earthGroup = new THREE.Object3D();
    this.setObject3D(earthGroup);

    this.createGlobe();
    this.createClouds();
};

Earth.prototype.createGlobe = function () {
    // the maps
    var diffuseMap = THREE.ImageUtils.loadTexture('assets/images/earth_surface_2048.jpg'),
        normalMap = THREE.ImageUtils.loadTexture('assets/images/earth_normal_2048.jpg'),
        specularMap = THREE.ImageUtils.loadTexture('assets/images/earth_specular_2048.jpg'),
        shader = THREE.ShaderLib["normalmap"];

    shader.uniforms["tDiffuse"].value = diffuseMap;
    shader.uniforms["tNormal"].value = normalMap;
    shader.uniforms["tSpecular"].value = specularMap;
    shader.uniforms["enableDiffuse"].value = 1; // on
    shader.uniforms["enableSpecular"].value = 1; // on

    console.log(shader.uniforms);

    // Create an Earth sphere with texture
    var geom = new THREE.SphereGeometry(1, 32, 32);
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

}

Earth.prototype.update = function () {
    this.object3D.rotation.y += Earth.ROTATION_Y;
}

Earth.ROTATION_Y = 0.0025;
Earth.TILT = 0.41;

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

$(document).ready( function () {
    var app = new EarthApp();
    app.init({ container: document.getElementById('container')});
    app.run();
});
