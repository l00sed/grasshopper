init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x333333 );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.001 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 300, 0, 0 );

  // controls
  // ==========================================

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minDistance = 10;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI;

  // manager
  // ==========================================

  function loadModel() {
    object.position.y = 10;
    scene.add( object );
  }

  var manager = new THREE.LoadingManager( loadModel );

  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };

  // texture
  // ==========================================

  //var textureLoader = new THREE.TextureLoader( manager );
  //var texture = textureLoader.load( 'models/rocket.png' );

  // model loader
  // ==========================================

  function onProgress( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  }

  function onError() {}
  
  var loader = new THREE.ObjectLoader( manager );

  loader.load( '/example_scene.json', function(obj) {
    object = obj;
  }, onProgress, onError );

  /*var loader = new THREE.OBJLoader( manager );
  loader.load( 'models/thin-spiral.obj', function ( obj ) {
    object = obj;
  }, onProgress, onError );*/


  // lights
  // ==========================================

  var targetObj = new THREE.Object3D();
  targetObj.position.set(0, 0, 20);
  scene.add( targetObj );

  var light1 = new THREE.DirectionalLight( 0xffffff, 1 );
  for(var i=0;i<10;i++) {
    light1.position.set(15, 15, Math.PI*(i));
  }
  light1.target = targetObj;
  scene.add( light1 );

  var light2 = new THREE.DirectionalLight( 0xEEEEEE, 1 );
  light2.position.set(-15, -15, 0);
  light2.target = targetObj;
  scene.add( light2 );

  var light3 = new THREE.AmbientLight( 0xf85c37, 1 );
  scene.add( light3 );

  //
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  renderer.render( scene, camera );
}
