let canvas = document.getElementById("butterfly");
let ctx = canvas.getContext("2d");

let life = 3;
let level = 1;
let score = 0;

let widthOfPage = 1000;
let heightOfPage = 600;
let heightOfBasket = 100;
let widthOfBasket = 200;

let xCoorBasket = 0;					//for basket
let yCoorBasket = heightOfPage;

let counterForLevel = 0;
let NEXT_LEVEL = 3;

let objs = [new Candy(),new Candy(),new Candy(), new Bomb(), new Bomb(), new Bomb()];

let candyFallTimeListener = null;		

let isTimeForSec = false;	
let isTimeForThird = false;	


ctx.translate(widthOfPage/2,0);

function drawBasket(x,y){
	
	ctx.save();
	ctx.beginPath();
	ctx.lineTo(x-60,y);// stroke black line outside
	ctx.lineTo(x-100,y-heightOfBasket);
	ctx.lineTo(x+100,y-heightOfBasket);
	ctx.lineTo(x+60,y);
	ctx.lineTo(x-60,y);
	ctx.lineWidth=4;
	ctx.stroke();	
		
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(x,y-50, 50, 0 ,2 * Math.PI); // outer Circle
	ctx.fill();
	
	ctx.fillStyle = "blue";
	ctx.beginPath();
	ctx.arc(x,y-50, 30, 0 ,2 * Math.PI); // Inner circle
	ctx.fill();
	
	var star = (2 * Math.PI) / 5;  // star's angle
	var radius = 20; //radius
	
	ctx.beginPath(); //star

	for(var i = 11; i != 0; i--){
		var r = radius*(i % 2 + 1)/2;
		var a = star * i;
		ctx.lineTo((r * Math.sin(a)) + x , (r * Math.cos(a)) + y - 50); //formula from https://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
	}
	ctx.closePath();
	ctx.fillStyle = "gold";
	ctx.fill();
	ctx.restore();
}

function moveLeft(){
	ctx.clearRect(xCoorBasket-500,yCoorBasket-300,701,440);
	xCoorBasket-=30;
	if(xCoorBasket<-420){
		xCoorBasket+=30;
		drawBasket(xCoorBasket, yCoorBasket);
	}
	else
		drawBasket(xCoorBasket, yCoorBasket);
}

function moveRight(){
	ctx.clearRect(xCoorBasket-500,yCoorBasket-300,701,440);
	xCoorBasket+=30;
	if(xCoorBasket>420){
		xCoorBasket-=30;
		drawBasket(xCoorBasket, yCoorBasket);
	}
	else 
		drawBasket(xCoorBasket, yCoorBasket);
}

addEventListener("keydown", function(event){
	if(event.keyCode===37){
		moveLeft();
	}if(event.keyCode===39){
		moveRight();
	}
})

function drawCandy(xOfCandy, yOfCandy){ 
	ctx.save();
	ctx.beginPath();
	
	ctx.fillStyle="red";
	ctx.beginPath();
	ctx.arc(xOfCandy, yOfCandy, 20, 0, 2 * Math.PI); //circle 
	ctx.fill();
	
	ctx.strokeStyle = "black";
		
	ctx.beginPath();
	ctx.moveTo(xOfCandy-20, yOfCandy);
	ctx.lineTo(xOfCandy-40, yOfCandy-20);
	ctx.lineTo(xOfCandy-30, yOfCandy);
	ctx.lineTo(xOfCandy-40, yOfCandy+20);
	ctx.lineTo(xOfCandy-20, yOfCandy);      //left side
	ctx.closePath();
	ctx.fillStyle = "red";
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(xOfCandy+20,yOfCandy);
	ctx.lineTo(xOfCandy+40,yOfCandy-20);
	ctx.lineTo(xOfCandy+30,yOfCandy);
	ctx.lineTo(xOfCandy+40,yOfCandy+20);
	ctx.lineTo(xOfCandy+20,yOfCandy);
	ctx.closePath();
	ctx.fillStyle = "red";						//right side
	ctx.fill();
	
	ctx.restore();
}


function drawBomb(x,y){
	
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.fillRect(x-30, y, 60, 30); //red rect
	ctx.fill();
	
	
	ctx.strokeStyle="black";
	ctx.beginPath();
	ctx.lineWidth=8;
	ctx.moveTo(x+30, y + 15);
	ctx.lineTo(x+60, y + 15);				//black line
	ctx.stroke();

	var star = (3 * Math.PI) / 5; 
	var radius = 5; 

	ctx.beginPath();

	for(var i = 11; i != 0; i--){
		var r = radius*(i % 4 + 1)/2;
		var a = star * i;
		ctx.lineTo((r * Math.sin(a)) + x + 60 , (r * Math.cos(a)) + y + 15 );
	}
	
	ctx.closePath();
	ctx.fillStyle = "gold"; // Formula of Star
	ctx.fill();	
	ctx.beginPath();
 
	
	ctx.restore();
}


function Candy(){
	this.objX = Math.random()*1000-500;
	this.objY = 0;                     
	this.widthOfCandy = 100;
	this.heightOfCandy = 42;
	this.material = "g"; //g for good
	this.speed = 1.5;
	this.isPoint = false;
	
}
function Bomb(){
	this.objX = Math.random()*1000-500;
	this.objY = 0;                     
	this.widthOfBomb=200;
	this.heightOfBomb=30;
	this.material = "b"; //b for bad
	this.speed = 1.5;
	this.isPoint = false;
}
//Use isPoint for points and scores

function updateScore(theObj){
	if(!theObj.isPoint && theObj.objX < xCoorBasket + (widthOfBasket/2) && theObj.objX > xCoorBasket - (widthOfBasket/2)
		&& theObj.objY > yCoorBasket - heightOfBasket ){
		theObj.isPoint = true;
		if (theObj.material == 'g'){
			score++;
			counterForLevel++;
			document.getElementById("score").innerHTML="score is: " + score;
		}else{
			life--;
			document.getElementById("sockLife").innerHTML="life: " + life;
		}
	}
	if((theObj.isPoint== false && theObj.objY >= heightOfPage && theObj.material == 'g')){
		life--;
		document.getElementById("sockLife").innerHTML="life: " + life;
	}
	if(theObj.isPoint == true && theObj.objY != heightOfPage){	
		if(theObj.material === 'g'){
			ctx.clearRect(theObj.objX - theObj.widthOfCandy / 2 ,theObj.objY - theObj.heightOfCandy / 2 , theObj.widthOfCandy , theObj.heightOfCandy);
		}
		if(theObj.material === 'b'){
			ctx.clearRect(objs[2].objX - objs[2].widthOfBomb / 2 ,objs[2].objY - objs[2].heightOfBomb / 2 , objs[2].widthOfBomb * 2 , objs[2].heightOfBomb * 2);
		}
	}
}

function levelOne(){
	ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
	objs[0].objY = objs[0].objY + objs[0].speed;
	drawCandy(objs[0].objX, objs[0].objY);
	
	updateScore(objs[0]);
	
	
	if(objs[0].objY === heightOfPage){
		ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
		objs[0].objY = 0;
		objs[0].objX = Math.random()*1000-500;
		objs[0].isPoint = false;
	}
	
	drawBasket(xCoorBasket, yCoorBasket);
}

function levelTwo(){
	ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
	objs[0].objY = objs[0].objY + objs[0].speed;
	drawCandy(objs[0].objX, objs[0].objY);
	
	
	
	if(!isTimeForSec && objs[0].objY >= heightOfPage / 2){
		isTimeForSec = true;
	}
	
	if(isTimeForSec ){
		ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
		objs[1].objY = objs[1].objY + objs[1].speed;
		drawCandy(objs[1].objX, objs[1].objY);
	}
	updateScore(objs[0]);
	updateScore(objs[1]);
	
	if(objs[0].objY === heightOfPage){
		ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
		objs[0].objY = 0;
		objs[0].objX = Math.random()*1000-500;
		objs[0].isPoint = false;
	}
	
	if(objs[1].objY === heightOfPage){
		ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
		objs[1].objY = 0;
		objs[1].objX = Math.random()*1000-500;
		objs[1].isPoint = false;
	}
	
	drawBasket(xCoorBasket, yCoorBasket);
}

function levelThree(){
	ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
	objs[0].objY = objs[0].objY + objs[0].speed;
	drawCandy(objs[0].objX, objs[0].objY);
	
	if(!isTimeForSec && objs[0].objY >= heightOfPage / 3){
		isTimeForSec = true;
	}
	
	if(!isTimeForThird && objs[1].objY >= heightOfPage / 3){
		isTimeForThird = true;
	}
	
	if( isTimeForSec){
		ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
		objs[1].objY = objs[1].objY + objs[1].speed;
		drawCandy(objs[1].objX, objs[1].objY);
	}
	
	if(isTimeForThird ){
		ctx.clearRect(objs[2].objX - objs[2].widthOfCandy / 2 ,objs[2].objY - objs[2].heightOfCandy / 2 , objs[2].widthOfCandy , objs[2].heightOfCandy);
		objs[2].objY = objs[2].objY + objs[2].speed;
		drawCandy(objs[2].objX, objs[2].objY);
	}
	updateScore(objs[0]);
	updateScore(objs[1]);
	updateScore(objs[2]);
	 
	if(objs[0].objY === heightOfPage){
		ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
		objs[0].objY = 0;
		objs[0].objX = Math.random()*1000-500;
		objs[0].isPoint = false;
	}
	
	if(objs[1].objY === heightOfPage){
		ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
		objs[1].objY = 0;
		objs[1].objX = Math.random()*1000-500;
		objs[1].isPoint = false;
	}
	
	if(objs[2].objY === heightOfPage){
		ctx.clearRect(objs[2].objX - objs[2].widthOfCandy / 2 ,objs[2].objY - objs[2].heightOfCandy / 2 , objs[2].widthOfCandy , objs[2].heightOfCandy);
		objs[2].objY = 0;
		objs[2].objX = Math.random()*1000-500;
		objs[2].isPoint = false;
	}
	
	drawBasket(xCoorBasket, yCoorBasket);
}

function randomize(array, objNum){
	let randomInt = 0;
	let temp;
	randomInt = Math.floor(Math.random()*array.length);
	temp = array[objNum];
	array[objNum] = array[randomInt];
	array[randomInt] = temp;
}

// level four 44444444444444444444444444
function levelFour(){
	if(objs[0].material == "g"){
		ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
		objs[0].objY = objs[0].objY + objs[0].speed;
		drawCandy(objs[0].objX, objs[0].objY);
	}else{
		ctx.clearRect(objs[0].objX - objs[0].widthOfBomb / 2 ,objs[0].objY - objs[0].heightOfBomb / 2 , objs[0].widthOfBomb , objs[0].heightOfBomb);
		objs[0].objY = objs[0].objY + objs[0].speed;
		drawBomb(objs[0].objX, objs[0].objY);
	
	}
	
	if(!isTimeForSec && objs[0].objY >= heightOfPage / 3){
		isTimeForSec = true;
	}
	
	if(!isTimeForThird && objs[1].objY >= heightOfPage / 3){
		isTimeForThird = true;
	}
	
	if( isTimeForSec){
		if(objs[1].material == "g"){
			ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
			objs[1].objY = objs[1].objY + objs[1].speed;
			drawCandy(objs[1].objX, objs[1].objY);
		}else{
			ctx.clearRect(objs[1].objX - objs[1].widthOfBomb / 2 ,objs[1].objY - objs[1].heightOfBomb / 2 , objs[1].widthOfBomb , objs[1].heightOfBomb);
			objs[1].objY = objs[1].objY + objs[1].speed;
			drawBomb(objs[1].objX, objs[1].objY);
		}
	}
	
	if(isTimeForThird ){
		if(objs[2].material == "g"){
			ctx.clearRect(objs[2].objX - objs[2].widthOfCandy / 2 ,objs[2].objY - objs[2].heightOfCandy / 2 , objs[2].widthOfCandy , objs[2].heightOfCandy);
			objs[2].objY = objs[2].objY + objs[2].speed;
			drawCandy(objs[2].objX, objs[2].objY);
			
		}else{
			ctx.clearRect(objs[2].objX - objs[2].widthOfBomb / 2 ,objs[2].objY - objs[2].heightOfBomb / 2 , objs[2].widthOfBomb , objs[2].heightOfBomb);
			objs[2].objY = objs[2].objY + objs[2].speed;
			drawBomb(objs[2].objX, objs[2].objY);
		}
	}
	
	updateScore(objs[0]);
	updateScore(objs[1]);
	updateScore(objs[2]);
	
	if(objs[0].objY >= heightOfPage){
		if(objs[0].material == "g"){
			ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
			objs[0].objY = 0;
			objs[0].objX = Math.random()*1000-500;
			objs[0].isPoint = false;
			randomize(objs, 0);
			
		}else{
			ctx.clearRect(objs[0].objX - objs[0].widthOfBomb / 2 ,objs[0].objY - objs[0].heightOfBomb / 2 , objs[0].widthOfBomb , objs[0].heightOfBomb);
			objs[0].objY = 0;
			objs[0].objX = Math.random()*1000-500;
			objs[0].isPoint = false;
			randomize(objs, 0);
			
		}
	}
	
	if(objs[1].objY >= heightOfPage){
		if(objs[1].material == "g"){
			ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
			objs[1].objY = 0;
			objs[1].objX = Math.random()*1000-500;
			objs[1].isPoint = false;
			randomize(objs, 1);
		}else{
			ctx.clearRect(objs[1].objX - objs[1].widthOfBomb / 2 ,objs[1].objY - objs[1].heightOfBomb / 2 , objs[1].widthOfBomb , objs[1].heightOfBomb);
			objs[1].objY = 0;
			objs[1].objX = Math.random()*1000-500;
			objs[1].isPoint = false;
			randomize(objs, 1);
		}
	}
	
	if(objs[2].objY >= heightOfPage){
		if(objs[2].material == "g"){
			ctx.clearRect(objs[2].objX - objs[2].widthOfCandy / 2 ,objs[2].objY - objs[2].heightOfCandy / 2 , objs[2].widthOfCandy , objs[2].heightOfCandy);
			objs[2].objY = 0;
			objs[2].objX = Math.random()*1000-500;
			objs[2].isPoint = false;
			randomize(objs, 2);
		}else{
			ctx.clearRect(objs[2].objX - objs[2].widthOfBomb / 2 ,objs[2].objY - objs[2].heightOfBomb / 2 , objs[2].widthOfBomb , objs[2].heightOfBomb);
			objs[2].objY = 0;
			objs[2].objX = Math.random()*1000-500;
			objs[2].isPoint = false;
			randomize(objs, 2);
		}
	}
	
	drawBasket(xCoorBasket, yCoorBasket);
	
}

function levelMore(){
	
	levelFour();
	
}

function fromBeginning(){
	isFirstTimeL = true;
	if(objs[2].material === 'g'){
		ctx.clearRect(objs[2].objX - objs[2].widthOfCandy / 2 ,objs[2].objY - objs[2].heightOfCandy / 2 , objs[2].widthOfCandy , objs[2].heightOfCandy);
		objs[2].objY = 0;
		objs[2].objX = Math.random()*1000-500;
		objs[2].isPoint = false;
	}if(objs[2].material === 'b'){
		ctx.clearRect(objs[2].objX - objs[2].widthOfBomb / 2 ,objs[2].objY - objs[2].heightOfBomb / 2 , objs[2].widthOfBomb * 2 , objs[2].heightOfBomb * 2);
		objs[2].objY = 0;
		objs[2].objX = Math.random()*1000-500;
		objs[2].isPoint = false;
	}
	
	if(objs[1].material === 'g'){
		ctx.clearRect(objs[1].objX - objs[1].widthOfCandy / 2 ,objs[1].objY - objs[1].heightOfCandy / 2 , objs[1].widthOfCandy , objs[1].heightOfCandy);
		objs[1].objY = 0;
		objs[1].objX = Math.random()*1000-500;
		objs[1].isPoint = false;
	}if(objs[1].material === 'b'){
		ctx.clearRect(objs[1].objX - objs[1].widthOfBomb / 2 ,objs[1].objY - objs[1].heightOfBomb / 2 , objs[1].widthOfBomb * 2 , objs[1].heightOfBomb * 2);
		objs[1].objY = 0;
		objs[1].objX = Math.random()*1000-500;
		objs[1].isPoint = false;
	}
	
	if(objs[0].material === 'g'){
		ctx.clearRect(objs[0].objX - objs[0].widthOfCandy / 2 ,objs[0].objY - objs[0].heightOfCandy / 2 , objs[0].widthOfCandy , objs[0].heightOfCandy);
		objs[0].objY = 0;
		objs[0].objX = Math.random()*1000-500;
		objs[0].isPoint = false;
	}if(objs[0].material === 'b'){
		ctx.clearRect(objs[0].objX - objs[0].widthOfBomb / 2 ,objs[0].objY - objs[0].heightOfBomb / 2 , objs[0].widthOfBomb * 2 , objs[0].heightOfBomb * 2);
		objs[0].objY = 0;
		objs[0].objX = Math.random()*1000-500;
		objs[0].isPoint = false;
	}

	if(level == 4){
		randomize(objs, 0);
		randomize(objs, 1);
		randomize(objs, 2);
	}
	if(level >= 5){
		randomize(objs, 0);
		randomize(objs, 1);
		randomize(objs, 2);
		
		objs[0].speed += 0.2;
		objs[1].speed += 0.2;
		objs[2].speed += 0.2;
		objs[3].speed += 0.2;
		objs[4].speed += 0.2;
		objs[5].speed += 0.2;
	
	}
	
}

let isFirstTimeL = true;
function fallingObjects(){
	
	if(life <=0){
		gameOver();
	}else{
	
		if(NEXT_LEVEL == counterForLevel){
			level++;
			if(level >= 5){
				isFirstTimeL5 = true;
			}
			fromBeginning();
			document.getElementById("level").innerHTML="level: " + level;
			counterForLevel = 0;
		}
		
		if(level === 1){
			levelOne();
		}
		if(level === 2){
			if(isFirstTimeL){
				isTimeForSec = false;
				isFirstTimeL = false;
			}
			levelTwo();
		}
		
		if(level === 3){
			if(isFirstTimeL){
				isTimeForSec = false;
				isTimeForThird = false;
				isFirstTimeL = false;
			}
			levelThree();
		} 
		
		if(level === 4){
			if(isFirstTimeL){
				isTimeForSec = false;
				isTimeForThird = false;
				isFirstTimeL = false;
			}
			levelFour();
		}
		
		if(level >= 5){
			if(isFirstTimeL){
				isTimeForSec = false;
				isTimeForThird = false;
				isFirstTimeL = false;
			}
			levelMore();
		}
	}
}

function lifeOfSock(){
	document.getElementById("sockLife").innerHTML="life: " + life;
}

function gameOver(){
	fromBeginning();
	ctx.clearRect(widthOfPage/2, 0, widthOfPage, heightOfPage);
	ctx.font = "60px Arial";
	ctx.fillText("Game Over", -200, heightOfPage/2);
}

function restartTheGame(){
	level = 1;
	life = 3;
	objs = [new Candy(),new Candy(),new Candy(), new Bomb(), new Bomb(), new Bomb()];
	score = 0;
	ctx.clearRect(-1 * widthOfPage/2, 0, 1000, 1000);
	counterForLevel= 0;
	document.getElementById("sockLife").innerHTML="life: " + life;
	document.getElementById("score").innerHTML = "score: " + score;
	document.getElementById("level").innerHTML = "level: " + level;
}

candyFallTimeListener = setInterval(fallingObjects, 10);