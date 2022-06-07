let titleFont, describeFont, fillC = 255, layout, layoutArguments, overLayout, autoSwitch, theText, overText;
if (self == top) {
    theText = `Layout is a tool for p5js.
This is a demo.
filling a area with letter.
Spliting it by word / sentence / regexp.
Click it to switch different layout mode.`;
    overText = 'a project for creating  typo background';
    autoSwitch = setInterval(() => {
        mouseClicked();
    }, 4000)
} else {
    theText = `Things i made with p5js.I‘d like to make motion design interactive with users.Design and coding by leizingyiu`;
    overText = 'some creative coding projects';

    autoSwitch = setInterval(() => {
        mouseClicked();
    }, 3000)
}


function preload() {
    titleFont = loadFont('../font/Xhers Regular.otf');
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    layoutArguments = [str = theText, font = titleFont, margin = 12, padding = 2, spacing = 4, left = 0, top = 0, w = width, h = height, {
        fillCell: 'none'
    }];
    layout = new Layout(...layoutArguments);
    overLayout = new Layout(overText, titleFont,
        margin = 12, padding = 2, spacing = 4,
        left = 0, top = 0, width, height, { fillCell: 'none' })

    layout.splitSentenceGrid();
    overLayout.gridFill();
    // debugger;
    // layout.gridFillFloor();
    //thePoster()
}

function draw() {
    // background(220);
    // clear();
    background(48);
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    layout.show();
    pop();

    push();
    fill(0, 100);
    textAlign(CENTER, CENTER);
    overLayout.show();
    pop();

    noLoop();
}

let clickIdx = 0;
function mouseClicked() {
    let funcs = ['gridFillCeil', 'gridFillFloor', 'splitWordGrid', 'splitSentenceGrid'];
    layout[funcs[clickIdx]]();
    console.log(funcs[clickIdx]);
    clickIdx = (clickIdx + 1) % funcs.length;
    redraw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    layoutArguments = [str = theText, font = titleFont, margin = 0, padding = 0, spacing = 0, left = 0, top = 0, w = width, h = height, {
        fillCell: 'none'
    }];
    // thePoster();
    // layout.init(...layoutArguments);
    layout.init(...layoutArguments);

    overLayout.init(overText, titleFont,
        margin = 12, padding = 2, spacing = 4,
        left = 0, top = 0, width, height, { fillCell: 'none' })
    // layout.gridFill();
    // layout.splitWordGrid();
    overLayout[overLayout.layoutType]();
    overLayout.gridFill();
    layout[layout.layoutType]();
    layout.show();
    redraw();
    // mouseClicked();
}

function leftTopPositionArr(a, b) {
    let result = [];
    for (let i = 0; i < a * b; i++) {
        let A = (i % a - (a - 1) / 2);
        let B = Math.floor(i / a) - (b - 1) / 2;
        result[i] = [A, B];
    }
    return result;
}


/**
 
n=thisComp.numLayers-1;
i=index;
w=thisComp.width;
h=thisComp.height;
midPoint=[w/2,h/2];

a=Math.floor(Math.pow(w*n/h,0.5));
b=Math.ceil(n/a);
[a,b]

function posiArr(a,b){
    let result=[];
    for(let i=0;i<a*b;i++){
        let A=(i%a-(a-1)/2);
        let B=Math.floor(i/a)-(b-1)/2;
    result[i]=[A,B];
}
return result;}

result=posiArr(a,b)[i-1]*100+midPoint;

*/