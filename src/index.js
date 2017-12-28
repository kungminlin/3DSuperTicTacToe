// Setup

var canvas = $('#canvas');
var width = canvas.width();
var height = canvas.height();

var roundReady = false;
var roundCounter = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
renderer.setClearColor( 0xffffff, 1 );
canvas.append( renderer.domElement );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
camera.position.set(70, 70, 70);
camera.lookAt(0, 0, 0);
scene.add(camera);

scene.fog = new THREE.Fog( 0xffffff, 50, 500 );

var player1 = new THREE.Group();
var player2 = new THREE.Group();

// var controls = new THREE.TrackballControls( camera, renderer.domElement );
// controls.noPan = true;
// controls.rotateSpeed = 1.5;
// controls.dynamicDampingFactor = 0.3;

var controls = new THREE.OrbitControls( camera );
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.2;

// 3D Grid

var grids = new THREE.Group();

for (var y=-45; y<=45; y+=30) {
	var material = new THREE.LineBasicMaterial({color: 0x000000, transparent: true, opacity: 0.1});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-15, y, -45));
	geometry.vertices.push(new THREE.Vector3(45, y, -45));
	geometry.vertices.push(new THREE.Vector3(45, y, 45));
	geometry.vertices.push(new THREE.Vector3(-45, y, 45));
	geometry.vertices.push(new THREE.Vector3(-45, y, -45));
	geometry.vertices.push(new THREE.Vector3(-15, y, -45));
	geometry.vertices.push(new THREE.Vector3(-15, y, 45));
	geometry.vertices.push(new THREE.Vector3(15, y, 45));
	geometry.vertices.push(new THREE.Vector3(15, y, -45));
	geometry.vertices.push(new THREE.Vector3(45, y, -45));
	geometry.vertices.push(new THREE.Vector3(45, y, -15));
	geometry.vertices.push(new THREE.Vector3(-45, y, -15));
	geometry.vertices.push(new THREE.Vector3(-45, y, 15));
	geometry.vertices.push(new THREE.Vector3(45, y, 15));
	var grid = new THREE.Line(geometry, material);
	grids.add(grid);
}

for (var x=-45; x<=45; x+=30) {
	var material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(x, -45, -45));
	geometry.vertices.push(new THREE.Vector3(x, 45, -45));
	geometry.vertices.push(new THREE.Vector3(x, 45, 45));
	geometry.vertices.push(new THREE.Vector3(x, -45, 45));
	geometry.vertices.push(new THREE.Vector3(x, -45, -45));
	geometry.vertices.push(new THREE.Vector3(x, -15, -45));
	geometry.vertices.push(new THREE.Vector3(x, -15, 45));
	geometry.vertices.push(new THREE.Vector3(x, 15, 45));
	geometry.vertices.push(new THREE.Vector3(x, 15, -45));
	geometry.vertices.push(new THREE.Vector3(x, 45, -45));
	geometry.vertices.push(new THREE.Vector3(x, 45, -15));
	geometry.vertices.push(new THREE.Vector3(x, -45, -15));
	geometry.vertices.push(new THREE.Vector3(x, -45, 15));
	geometry.vertices.push(new THREE.Vector3(x, 45, 15));
	var grid = new THREE.Line(geometry, material);
	grids.add(grid);
}

scene.add(grids);

// Indicator

var geometry = new THREE.BoxGeometry( 30, 30, 30 );
var material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 0.2} );
var focus_cube = new THREE.Mesh( geometry, material );

var focus = {x:30, y:30, z:30};

scene.add(focus_cube);

var material = new THREE.LineBasicMaterial({color: 0xbbbbbb});
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-15, 0, -15));
geometry.vertices.push(new THREE.Vector3(15, 0, -15));
geometry.vertices.push(new THREE.Vector3(15, 0, 15));
geometry.vertices.push(new THREE.Vector3(-15, 0, 15));
geometry.vertices.push(new THREE.Vector3(-15, 0, -15));
geometry.vertices.push(new THREE.Vector3(-5, 0, -15));
geometry.vertices.push(new THREE.Vector3(-5, 0, 15));
geometry.vertices.push(new THREE.Vector3(5, 0, 15));
geometry.vertices.push(new THREE.Vector3(5, 0, -15));
geometry.vertices.push(new THREE.Vector3(15, 0, -15));
geometry.vertices.push(new THREE.Vector3(15, 0, -5));
geometry.vertices.push(new THREE.Vector3(-15, 0, -5));
geometry.vertices.push(new THREE.Vector3(-15, 0, 5));
geometry.vertices.push(new THREE.Vector3(15, 0, 5));
var plane_grid = new THREE.Line(geometry, material);

var base = new THREE.Group();

for (var i=0; i<3; i++) {
	for (var j=0; j<3; j++) {
		var geometry = new THREE.PlaneGeometry( 10, 10 );
		var material = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = 1.5*Math.PI;
		plane.position.set((focus_cube.position.x+30)+i*10-10, focus_cube.position.y+15, (focus_cube.position.z+30)+j*10-10);
		base.add(plane);
	}
}

var fullview = true;

window.onkeyup = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 32) {
		if (fullview) {
			controls.target.set(focus_cube.position.x, focus_cube.position.y, focus_cube.position.z);
			controls.target0.set(focus_cube.position.x, focus_cube.position.y, focus_cube.position.z);
			scene.add(plane_grid);
			scene.add(base);
			scene.remove(grids);
			scene.remove(focus_cube);
			$('#gridOn').attr('disabled', true);
			$('#gridOn').attr('checked', false);
			fullview = false;
		}
		else {
			controls.target.set(0, 0, 0);
			controls.target0.set(0, 0, 0);
			scene.remove(plane_grid);
			scene.remove(base);
			scene.add(grids);
			scene.add(focus_cube);
			$('#gridOn').attr('disabled', false);
			$('#gridOn').attr('checked', true);
			fullview = true;
		}
	}
}

scene.add(player1);
scene.add(player2);

function addCube( new_cube, player ) {
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	var material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 0.8} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.set(new_cube.x, new_cube.y, new_cube.z);
	player.add(cube);
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.getElementById('canvas').addEventListener('mousemove', function(event) {
	mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects_base = raycaster.intersectObjects(base.children);
    var intersects = raycaster.intersectObjects(player1.children.concat(player2.children));
    if (intersects_base.length > 0) {
    	for (var i in base.children) {
            base.children[i].material.opacity = 0;
        }
        intersects_base[0].object.material.opacity = 0.1;
    }
    else {
    	for (var i in base.children) {
    		base.children[i].material.opacity = 0;
    	}
    }
    // if (intersects.length > 0) {
    // 	for (var i in cubes.children) {
    // 		cubes.children[i].material.opacity = 1;
    // 	}
    // 	intersects[0].object.material.opacity = 0.6;
    // }
    // else {
    // 	for (var i in cubes.children) {
    // 		cubes.children[i].material.opacity = 1;
    // 	}
    // }
	
}, false);

$('#canvas').click( function() {
	raycaster.setFromCamera(mouse, camera);
	var intersects_base = raycaster.intersectObjects(base.children);
    var intersects = raycaster.intersectObjects(player1.children.concat(player2.children));
    var player;
	if (roundCounter%2==1) player = player1;
	else player = player2;
	if (intersects.length > 0  && ( 
		intersects[0].object.position.x > focus_cube.position.x + 10 ||
		intersects[0].object.position.x < focus_cube.position.y - 10 ||
		intersects[0].object.position.y > focus_cube.position.y + 10 ||
		intersects[0].object.position.y < focus_cube.position.y - 10 ||
		intersects[0].object.position.z > focus_cube.position.z + 10 ||
		intersects[0].object.position.z < focus_cube.position.z - 10
	)) {
		return;
	}
    if ( intersects.length > 0 ) {
    	var face = intersects[0].face.normal;
    	addCube( {x:intersects[0].object.position.x+face.x*10, y:intersects[0].object.position.y+face.y*10, z:intersects[0].object.position.z+face.z*10}, player );
    	roundCounter++;
    }
	else if ( intersects_base.length > 0 ) {
		addCube( {x:intersects_base[0].object.matrixWorld.getPosition().x, y:intersects_base[0].object.matrixWorld.getPosition().y+5, z:intersects_base[0].object.matrixWorld.getPosition().z}, player );
		roundCounter++;
	}
});



function render() {
	requestAnimationFrame( render );
	controls.update();

	focus.x = -30*((roundCounter-1)%3-1);
	focus.y = -30*(Math.floor((roundCounter-1)/9)%3-1)
	focus.z = -30*(Math.floor((roundCounter-1)/3)%3-1);

	focus_cube.position.set(focus.x, focus.y, focus.z);
	plane_grid.position.set(focus_cube.position.x, focus_cube.position.y-15, focus_cube.position.z);
	base.position.set(focus_cube.position.x-30, focus_cube.position.y-30, focus_cube.position.z-30)

	for (var i=0; i<player1.children.length; i++) player1.children[i].material.color.set(0x0000ff);
	for (var i=0; i<player2.children.length; i++) player2.children[i].material.color.set(0xff0000);

	renderer.render( scene, camera );
}

window.onresize = function(e) {
	width = $('#canvas').width();
	height = $('#canvas').height();
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
}

// Remove later
// $('#canvas').click(function() {
// 	roundCounter++;
// });

var hide = false;

$('#hide-info').click(function(){
	if (!hide) {
		$('#info').animate({
			left: "+=30%",
			opacity: "0"
		}, 1000);
		hide = true;
		$('#hide-info').css('transform', 'rotate(90deg)');
	}
	else {
		$('#info').animate({
			left: "-=30%",
			opacity: "100"
		}, 1000)
		hide = false;
		$('#hide-info').css('transform', 'rotate(-90deg)');
	}

});

$('#gridOn').click(function() {
    if (document.getElementById('gridOn').checked) {
    	scene.add(grids);
    	scene.add(focus_cube);
    }
    else {
    	scene.remove(grids);
    	scene.remove(focus_cube);
    }	
});

$('#camera-reset').click(function(){controls.reset()});

render();