var angle = 2;
let colorPicker;
let colorPickerS;
let colorPickerB;

function getSizeS() {
  const val = document.getElementById('sizeS').value;
  return val;
}

function getValss() {
  const val = document.getElementById('sizeSs').value;
  return val;
}

function getVelocity() {
  const val = document.getElementById('velocity').value;
  return val;
}

function getTransX() {
  const val = document.getElementById('transX').value;
  return val;
}

function getNumberS() {
  const val = document.getElementById('getNumberS').value;
  return val;
}


function getChecked() {
  const checkBox = document.getElementById('check1').checked;
  if (checkBox === true) {
    return 0;
    } else {
      return 1;
  }
}


function setup()
{
  canvas = createCanvas(windowWidth, 420, WEBGL);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  //canvas.style('opacity', '0.7');
  frameRate(12);
  colorPicker = createColorPicker('#ecf71b');
  colorPicker.position(100, height+15);

  colorPickerS = createColorPicker('#0cc402');
  colorPickerS.position(50, height+15);

  colorPickerB = createColorPicker('#000');
  colorPickerB.position(150, height+15);

  noCursor();
  angleMode(DEGREES);
}

function draw()
{
  if(getChecked() == 0){
    background(colorPickerB.color());
  }
  //background(0);
  //background(colorPicker.color());
  push();
  translate(100*getTransX(),0);
  rotateY(getVelocity());
  rotateX(getVelocity());
  rectMode(CENTER);
  stroke(colorPicker.color());
  strokeWeight(0.420);
  noFill();
  push();
  rotate(angle);
  sphere(getSizeS());
  pop();
  //fill(getColorS())
  //stroke(colorPicker.color());
  push();
  angle++;
  pop();


  for (var i = 0; i < getNumberS(); i++)
  {
    translate(i*7, i*-i)
    //stroke(i,i*27,i+12)
    rotate(angle);
    rectMode(CENTER);
    //stroke(colorPicker.color());
    //sphere(getValss());
    //sphere(12+random(5,i));
    for (var j = 0; j < 1; j++){
      stroke(colorPickerS.color());
      sphere(getValss()-j);
      rotateX(getTransX()*angle);
      rotateZ(cos(i*j)+3);

    }
  }

}

function windowResized() {
  resizeCanvas(windowWidth,  420, WEBGL);
}
