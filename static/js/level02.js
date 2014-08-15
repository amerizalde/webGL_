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

    var sunLight = new Sun();
    sunLight.init();
    this.addObject(sunLight);
};

// Earth object
var Earth = function () {
    Sim.Object.call(this);
};

Earth.ROTATION_Y = 0.0025;
Earth.TILT = 0.41;
Earth.prototype = new Sim.Object();
Earth.prototype.init = function () {
    // Create an Earth sphere with texture
    var earthMap = "assets/images/earth_surface_2048.jpg",
        geom = new THREE.SphereGeometry(1, 32, 32), // (radius, rows, columns)
        texture = THREE.ImageUtils.loadTexture(earthMap),
        material = new THREE.MeshPhongMaterial( {map: texture}),
        mesh = new THREE.Mesh( geom, material);
    
    mesh.rotation.z = Earth.TILT;
    
    // tell framework about the object
    this.setObject3D(mesh);
};

Earth.prototype.update = function () {
    this.object3D.rotation.y += Earth.ROTATION_Y;
}

// Sun object
var Sun = function () {
    Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();
Sun.prototype.init = function () {
    // create a point light
    var light = new THREE.PointLight( 0xffffff, 2, 100);
    light.position.set(-10, 0, 20);

    // tell the framework about our object
    this.setObject3D(light);
}

$(document).ready( function () {
    var app = new EarthApp();
    app.init({ container: document.getElementById('container')});
    app.run();
});
