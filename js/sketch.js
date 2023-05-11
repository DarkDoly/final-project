let agumonSheet;
let bitgumonSheet;
let agumonAnimation;
let greymonAnimation;
let bitgumonAnimations = [];
let initTone = true;

  const GameState = {
    Start: "Start",
    Stage1: "Stage1",
    Stage2: "Stage2",
    GameOver: "GameOver"
  };

  let game = { 
    score: 0, 
    maxTime: 60, 
    elapsedTime: 0,
    maxScore: 0,
    state: GameState.Start};

function preload() {
  //loads sprite sheets
  agumonSheet = loadImage("assets/agumon.png");
  bitgumonSheet = loadImage("assets/bitgumon.png");
  //loads font
  pixelFont = loadFont("assets/pixelfont.ttf");
  //loads music
  sounds = new Tone.Players({
    "gameover": "assets/gameover.mp3",
    "stage1": "assets/stage1.mp3",
    "stage2": "assets/stage2.mp3",
    "hit": "assets/hit.mp3",
  
  })

}

function setup() {
  createCanvas(700, 300);
  imageMode(CENTER);
  angleMode(DEGREES);
  textFont(pixelFont);
  sounds.toDestination();

  //creates an agumon animation
  agumonAnimation = new AnymonAnimation(agumonSheet, 45, 45, 100, 100, 4, 97, 0);
  //creates an greymon animation
  greymonAnimation = new AnymonAnimation(agumonSheet, 60, 60, 100, 100, 3, 15, 275);
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  bitgumonAnimations = [];
  for(let i=0; i < 100; i++) {
    bitgumonAnimations[i] = new AnymonAnimation(bitgumonSheet, 40, 30, random(700,2000), random(20,280), 4, 0, 70);
  }
  }

function draw() {
  switch(game.state){
    case GameState.Start:
    reset();
    background(0);
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Agu-Game",200,100);
    textSize(20);
    text("Press Space to Start",230,200);
    break;
  
    case GameState.Stage1:
  background(220);
  //text for score and time
  calculateTime();
    //draws agumon
    agumonAnimation.drawRookie();

    //draws bitgumon
    for(let i=0; i < 50; i++) {
      bitgumonAnimations[i].drawBitgumon()
    }
        //changes game score based on if agumon touches bitgumon
    for(i=0; i < bitgumonAnimations.length; i++){
      if(bitgumonAnimations[i].contains(agumonAnimation.dx,agumonAnimation.dy) && bitgumonAnimations[i].moving != 0){
        game.score += 1;
        bitgumonAnimations[i].stop();
      }
    }
    sounds.player("stage1").start();

    break;
    case GameState.Stage2:
      background(220);
      //text for score and time
      calculateTime();
    
        //draws agumon
        greymonAnimation.drawRookie();
        for(let i=50; i < 100; i++) {
          bitgumonAnimations[i].drawBitgumon()
        }

         //changes game score based on if greymon touches bitgumon
    for(i=0; i < bitgumonAnimations.length; i++){
      if(bitgumonAnimations[i].contains(greymonAnimation.dx,greymonAnimation.dy) && bitgumonAnimations[i].moving != 0){
        game.score += 2;
        bitgumonAnimations[i].stop();
      }
    }
    sounds.player("stage2").start();
    break;
    case GameState.GameOver:
      game.maxScore = max(game.score, game.maxScore);
    
    background(0);
    fill(255);
      textSize(30);
      textAlign(CENTER);
      text("Game Over!",330,100);
      textSize(20);
      text("Score: " + game.score,330,200);
      text("Max Score: " + game.maxScore,330,250);
      sounds.player("gameover").start();
    break;

  }
}

function keyPressed() {
  //initiallizes sound
  if (keyCode === 32 && initTone === true) {
    console.log('spacebar pressed');
    Tone.start();
    initTone = false;
  }
  //swaps game state to playing or reset
    switch(game.state) {
      case GameState.Start:
        game.state = GameState.Stage1;
        break;
      case GameState.Stage1:
          //sets keypressed for agumon
        agumonAnimation.keyPressed(UP_ARROW,DOWN_ARROW);
        if (keyCode === 32 && game.score >= 20) {
          game.state = GameState.Stage2;
        }
        break;
      case GameState.Stage2:
        //sets keypressed for greymon
        greymonAnimation.keyPressed(UP_ARROW, DOWN_ARROW);
        break;
      case GameState.GameOver:
        reset();
        game.state = GameState.Stage1;
        break;
    }
  
}

function keyReleased() {
  switch(game.state) {
  case GameState.Stage1:
    //sets keyreleased for agumon
  agumonAnimation.keyReleased(UP_ARROW,DOWN_ARROW);
  break;
  case GameState.Stage2:
  //sets keyreleased for greymon
  greymonAnimation.keyReleased(UP_ARROW, DOWN_ARROW);
  break;
  }
}

function calculateTime() {
  fill(0);
  textSize(15);
  textAlign(LEFT);
  let currentTime = game.maxTime - game.elapsedTime;
  text("SCORE: " + game.score, 10, 20);
  text("TIME: " + ceil(currentTime), 7, 290);
  game.elapsedTime += deltaTime / 1300;
  if(currentTime < 0) {
    game.state = GameState.GameOver;
    }
}

//walking animation for agumon and greymon
class AnymonAnimation{
  constructor(spritesheet, sw, sh, dx, dy, animationLength, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.yDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  drawRookie() {
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 1;
    push();
    translate(this.dx,this.dy);
    scale(this.yDirection,1);
  
    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }
  
    this.dy += this.moving;
  }

  drawBitgumon() {
      this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;
      push();
      translate(this.dx,this.dy);
      if (this.vertical)
        rotate(90);
      scale(this.xDirection,1);
  
      image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
      pop();
      let proportionalFramerate = round(frameRate() / this.framerate);
      if (frameCount % proportionalFramerate == 0) {
        this.currentFrame++;
      }
    
      if (this.vertical) {
        this.dy += this.moving;
        this.move(this.dy,this.sw / 4,height - this.sw / 4);
      }
      else {
        this.dx += this.moving;
        this.move(this.dx,this.sw / 4,width - this.sw / 4);
  }
}
  

  keyPressed(up, down) {
    if (keyCode === up) {
      this.moving = -2;
      this.currentFrame = 1;
    } else if (keyCode === down) {
      this.moving = 2;
      this.currentFrame = 1;
    }
  }

  keyReleased(up, down) {
    if (keyCode === up || keyCode === down) {
      this.moving = 0;
    }
  } 

  contains(x,y) {
    let insideX = x >= this.dx - 26 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  move(position,lowerBounds,upperBounds) {
    if (position > upperBounds) {
      this.moveLeft();
    } else if (position < lowerBounds) {
      this.moveLeft();
    }
  }

  moveRight() {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  stop() {
    this.moving = 0;
    this.u = 0;
    this.v = 0;
    this.offsetX = 1000;
    sounds.player("hit").start();
  }

}