function setup() {
  angleMode(DEGREES);
  createCanvas(600, 600);
  
  //Viewer
  viewer = createVector(300, 300, 0);
  vAngle = 45;  // Vertical wideness of view
  hAngle = 45; // Horizontal wideness of view
  viewStart = 200; // Front of frustum
  viewEnd = 600; // How far viewer sees or end of frustum
  endHeight = tan(vAngle/2)*viewEnd;
  endWidth =  tan(hAngle/2)*viewEnd;
  startHeight = tan(vAngle/2)*viewStart;
  startWidth = tan(hAngle/2)*viewStart;
  push(); //Save initial draw state
}

function createBoxGraph(cubeO, cubeL) {
  let boxGraph = {};
  boxGraph.origin = cubeO;
  boxGraph.sideLength = cubeL;
  //Create vertices xyz
  boxGraph.vertices = [
    createVector(cubeO.x-cubeL/2, cubeO.y-cubeL, cubeO.z-cubeL/2), //LUF
    createVector(cubeO.x-cubeL/2, cubeO.y-cubeL, cubeO.z+cubeL/2), //LUB
    createVector(cubeO.x-cubeL/2, cubeO.y, cubeO.z-cubeL/2), //LDF
    createVector(cubeO.x-cubeL/2, cubeO.y, cubeO.z+cubeL/2), //LDB
    createVector(cubeO.x+cubeL/2, cubeO.y-cubeL, cubeO.z-cubeL/2), //RUF
    createVector(cubeO.x+cubeL/2, cubeO.y-cubeL, cubeO.z+cubeL/2), //RUB
    createVector(cubeO.x+cubeL/2, cubeO.y, cubeO.z-cubeL/2), //RDF
    createVector(cubeO.x+cubeL/2, cubeO.y, cubeO.z+cubeL/2) //RDB
  ];
  
  //Map edges to vertices
  boxGraph.adjMatrix = [ //LUF LUB LDF LDB RUF RUB RDF RDB
    [0, 1, 1, 0, 1, 0, 0, 0], //LUF -> lub ldf ruf
    [1, 0, 0, 1, 0, 1, 0, 0], //LUB -> luf ldb, rub
    [1, 0, 0, 1, 0, 0, 1, 0], //LDF -> luf ldb rdf
    [0, 1, 1, 0, 0, 0, 0, 1], //LDB -> lub ldf rdb
    [1, 0, 0, 0, 0, 1, 1, 0], //RUF -> luf rub rdf 
    [0, 1, 0, 0, 1, 0, 0, 1], //RUB -> lub ruf rdb
    [0, 0, 1, 0, 1, 0, 0, 1], //RDF -> ldf ruf rdb 
    [0, 0, 0, 0, 1, 1, 1, 0] //RDB -> ldb rub rdf
  ];
  
  
  return boxGraph;
}

function castRay(v, viewer) {
  ratio = (viewStart)/(v.z-viewer.z);
  cast = createVector(ratio*(v.x-viewer.x), ratio*(v.y-viewer.y), ratio*(v.z-viewer.z));
  return createVector(viewer.x+cast.x, viewer.y+cast.y, viewer.z+cast.z);
}

function draw() {
  background(220);
  
  //Create test object
  cubeO = createVector(mouseX, 350, mouseY); // Origin is bottom center
  cubeL = 100; // Length for sides of cube
  boxGraph = createBoxGraph(cubeO, cubeL);
  
  // Draw side perspective (x=z, y=y)
  scale(0.5);
  
  stroke(150, 150, 150);
  line(viewer.z, viewer.y, viewer.z+viewEnd, viewer.y); // End middle
  line(viewer.z, viewer.y, viewer.z+viewEnd, viewer.y-endHeight); // End top
  line(viewer.z, viewer.y, viewer.z+viewEnd, viewer.y+endHeight); // End bottom
  // Visualizing front and back of frustum
  line(viewer.z+viewEnd, viewer.y+endHeight, viewer.z+viewEnd, viewer.y-endHeight); // End
  line(viewer.z+viewStart, viewer.y+startHeight, viewer.z+viewStart, viewer.y-startHeight);   // Front

  
  // Visualize test object
  stroke(0, 0, 255)
  for (i = 0; i < boxGraph.adjMatrix.length; i++) {
    for (j = i+1; j < boxGraph.adjMatrix[i].length; j++) {
      if(boxGraph.adjMatrix[i][j] === 1) {
        start = boxGraph.vertices[i];
        end = boxGraph.vertices[j];
        line(start.z, start.y, end.z, end.y);
      }
    }
  }
  
  //Visualize ground
  line(viewer.z, 400, viewer.z+viewEnd, 400); // Ground level
  
  //Visualize where vectors from object to viewer fall in the front of frustum.
    //ratio = (viewStart)/(RUF.z-viewer.z);
    for (i = 0; i < boxGraph.adjMatrix.length; i++) {
    for (j = i+1; j < boxGraph.adjMatrix[i].length; j++) {
      if(boxGraph.adjMatrix[i][j] === 1) {
        stroke(100, 100, 100);
        start = viewer;
        end = boxGraph.vertices[j];
        line(start.z, start.y, end.z, end.y);
        //Draw to raycast point from viewer
        stroke(0, 0, 0);
        start = castRay(boxGraph.vertices[j], viewer);
        line(start.z, start.y, end.z, end.y);
      }
    }
  }
  
  // Draw top perspective (x=z, y=x)
  translate(600, 0);
  
  stroke(150, 150, 150);
  line(viewer.z, viewer.x, viewer.z+viewEnd, viewer.x); // End middle
  line(viewer.z, viewer.x, viewer.z+viewEnd, viewer.x-endWidth); // End top
  line(viewer.z, viewer.x, viewer.z+viewEnd, viewer.x+endWidth); // End bottom
  // Visualizing front and back of frustum
  line(viewer.z+viewEnd, viewer.x+endHeight, viewer.z+viewEnd, viewer.x-endHeight); // End
  line(viewer.z+viewStart, viewer.x+startWidth, viewer.z+viewStart, viewer.x-startWidth); // Front
  // Visualize test object
  stroke(0, 0, 255)
  for (i = 0; i < boxGraph.adjMatrix.length; i++) {
    for (j = i+1; j < boxGraph.adjMatrix[i].length; j++) {
      if(boxGraph.adjMatrix[i][j] === 1) {
        start = boxGraph.vertices[i];
        end = boxGraph.vertices[j];
        line(start.z, start.x, end.z, end.x);
      }
    }
  }
  
  //Visualize where vectors from object to viewer fall in the front of frustum.
    //ratio = (viewStart)/(RUF.z-viewer.z);
    for (i = 0; i < boxGraph.adjMatrix.length; i++) {
    for (j = i+1; j < boxGraph.adjMatrix[i].length; j++) {
      if(boxGraph.adjMatrix[i][j] === 1) {
        stroke(100, 100, 100);
        start = viewer;
        end = boxGraph.vertices[j];
        line(start.z, start.x, end.z, end.x);
        //Draw to raycast point from viewer
        stroke(0, 0, 0);
        start = castRay(boxGraph.vertices[j], viewer);
        line(start.z, start.x, end.z, end.x);
      }
    }
  }
  
  // Draw 3d perspective
  pop(); //Restore initial draw state
  
  //Draw 3d perspective's edges
  ld = createVector(width/2-startWidth, height/2+startHeight);
  lu = createVector(width/2-startWidth, height/2-startHeight);
  rd = createVector(width/2+startWidth, height/2+startHeight);
  ru = createVector(width/2+startWidth, height/2-startHeight);
  line(ld.x, ld.y, lu.x, lu.y);
  line(lu.x, lu.y, ru.x, ru.y);
  line(ru.x, ru.y, rd.x, rd.y);
  line(rd.x, rd.y, ld.x, ld.y);
  
  //Take each vertex and find their raycast point
  //Visualize where vectors from object to viewer fall in the front of frustum.
  for (i = 0; i < boxGraph.adjMatrix.length; i++) {
    for (j = i+1; j < boxGraph.adjMatrix[i].length; j++) {
      if(boxGraph.adjMatrix[i][j] === 1) {
        stroke(0, 0, 0);
        start = castRay(boxGraph.vertices[i], viewer);
        end = castRay(boxGraph.vertices[j], viewer);
        //Draw the line from viewer perspective
        line(start.x, start.y, end.x, end.y);
      }
    }
  }
    
  push();
}