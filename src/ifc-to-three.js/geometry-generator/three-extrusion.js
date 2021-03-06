function createExtrusionsByPoints(points, depth, dir = [0, 0, 1]) {
  //Profile
  const shapePoints = [];
  points.forEach((e) => shapePoints.push(new THREE.Vector3(e[1], -e[0])));
  const shape = new THREE.Shape(shapePoints);
  return createExtrusion(shape, depth, dir);
}

function createCircularExtrusion(radius, depth) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, 64);
  const mesh = new THREE.Mesh(geometry);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.z = depth / 2;
  mesh.updateMatrix();
  return mesh;
}

function createExtrusion(shape, depth, dir = [0, 0, 1]) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const extrudeSettings = getExtrudeSettings(depth);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  applyExtrusionDirection(dir, geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.updateMatrix();
  return mesh;
}

function getExtrudeSettings(depth) {
  const path = getVerticalDirection(depth);
  return {
    bevelEnabled: false,
    steps: 1,
    extrudePath: path
  };
}

function applyExtrusionDirection(dir, geometry){
  const matrix = getTransformMatrix(dir);
  geometry.applyMatrix4(matrix);
}

function getTransformMatrix(dir){
  const matrix = new THREE.Matrix4();
  const direction = new THREE.Vector3(dir[0], dir[1], dir[2]);
  const Syx = 0, Sxy = 0, Sxz = 0, Syz = 0; 
  const Szx = direction.y, Szy = direction.x;
  return matrix.set(  1,  Syx,  Szx,   0, 
                    Sxy,    1,  Szy,   0, 
                    Sxz,  Syz,    1,   0, 
                      0,    0,    0,   1);
}       

function getVerticalDirection(depth) {
  const v1 = new THREE.Vector3(0, 0, 0);
  const v2 = new THREE.Vector3(0, 0, depth);
  return new THREE.LineCurve3(v1, v2);
}

export { createExtrusionsByPoints, createCircularExtrusion };
