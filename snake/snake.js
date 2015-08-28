var CANVAS_SIZE, BOXES=20, interval,ratio=1, box, snake, food,object, delay,delay2=0, mousex, mousey,swiping=-1,
randomness, direction, ldirection,score=0,x=0,y=1, playing=0, fsize;
window.onload = function(){
	var ctx=document.getElementById("game").getContext("2d");
	ratio=window.devicePixelRatio;
	CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
	box=CANVAS_SIZE/BOXES;
	ctx.canvas.width=CANVAS_SIZE;
	ctx.canvas.height=CANVAS_SIZE;
	ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
	ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
	fsize=CANVAS_SIZE/10;
	function init(){
		playing=1;
		snake = [[3,0],[2,0],[1,0],[0,0]];
		food=[];
		object=[];
		delay=0;
		randomness=11;
		direction=2;
		ldirection=2;
		score=0;
		draw();
		setTimeout(function(){update();},100);
	}

	function draw(){
		ctx.fillStyle="black";
		ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
		ctx.strokeStyle="rgb(0,255,0)";
		ctx.strokeRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

		if(playing==1){
			ctx.fillStyle="rgb(0,255,0)";
			for(i=0;i<snake.length;i++){
				ctx.fillRect(snake[i][x]*box+box/20,snake[i][y]*box+box/20,box-box/10,box-box/10);
			}
			ctx.fillStyle="rgb(0,255,0)";
			for(i=0;i<food.length;i++){
				ctx.fillRect(food[i][x]*box+box/20,food[i][y]*box+box/20,box-box/10,box-box/10);
			}
			ctx.fillStyle="rgb(255,0,0)";
			for(i=0;i<object.length;i++){
				ctx.fillRect(object[i][x]*box+box/20,object[i][y]*box+box/20,box-box/10,box-box/10);
			}
			ctx.fillStyle="rgb(255,255,255)";
			ctx.textAlign="left";
			ctx.fillText("Score: "+score,10,CANVAS_SIZE-10);
		}else if(playing==2){
			ctx.font=fsize+"pt Arial";
			ctx.strokeStyle="rgb(0,255,0)";
			ctx.textAlign="center";
			ctx.strokeText("GAME OVER!",CANVAS_SIZE/2,CANVAS_SIZE/4);
			ctx.strokeText("Score: "+score, CANVAS_SIZE/2,CANVAS_SIZE/2);
			ctx.font=fsize/4+"pt Arial";
			ctx.fillStyle="rgb(0,255,0)";
			ctx.fillText("< Press any key/tap to play again>", CANVAS_SIZE/2,CANVAS_SIZE*3/4);
		}else if(playing==0){
			ctx.font=fsize+"pt Arial";
			ctx.strokeStyle="rgb(0,255,0)";
			ctx.textAlign="center";
			ctx.strokeText("Snake",CANVAS_SIZE/2,CANVAS_SIZE/4);
			ctx.font=fsize/3+"pt Arial";
			ctx.fillStyle="rgb(0,255,0)";
			ctx.fillText("Swipe/use arrow keys", CANVAS_SIZE/2,CANVAS_SIZE/2);
			ctx.fillText("to change directions",CANVAS_SIZE/2,CANVAS_SIZE*9/16);
			ctx.fillText("< Press any key/tap to start >", CANVAS_SIZE/2,CANVAS_SIZE*3/4);
		}
	}

	function update(){
		if(delay==0){
			if(Math.floor(Math.random()*randomness)==(randomness-1)){
				delay=1;
				food.push([Math.floor(Math.random()*BOXES),Math.floor(Math.random()*BOXES)]);
			}else if(Math.floor(Math.random()*randomness)==(randomness-1)){
				object.push([Math.floor(Math.random()*BOXES),Math.floor(Math.random()*BOXES)]);
				if(direction==1||direction==3){
					if(object[object.length-1][x]==snake[0][x]){
						if(object[object.length-1][x]>0){
							object[object.length-1][x]--;
						}else{
							object[object.length-1][x]++;
						}
					}
				}else if(direction==2||direction==4){
					if(object[object.length-1][y]==snake[0][y]){
						if(object[object.length-1][y]>0){
							object[object.length-1][y]--;
						}else{
							object[object.length-1][y]++;
						}
					}
				}
			}
		}else{
			delay=0;
		}
		
		var sx=snake[0][x];
		var sy=snake[0][y];
		if(direction==1){
			sy--;
		}else if(direction==2){
			sx++;
		}else if(direction==3){
			sy++;
		}else if(direction==4){
			sx--;
		}
		if(collideWithFood(sx,sy)||collideWithFood(snake[0][x],snake[0][y])){
			score+=1
		}else{
			snake.pop();
		}
		if(sx<0||sx>19||sy<0||sy>19||collideWithSelf(sx,sy)||collideWithObject()){
			delay2=1;
			playing=2;
			swiping=-1;
			setTimeout(function(){delay2=0;},500);
			draw();
			return;
		}

		snake.unshift([sx,sy]);
		ldirection=direction;
		draw();
		if(playing==1)
			setTimeout(function(){update();},100);
	}
	function collideWithSelf(sx,sy){
		for(i=3;i<snake.length;i+=2){
			if(snake[i][x]==sx && snake[i][y]==sy) return 1;
		}
		return 0;
	}
	function collideWithFood(sx,sy){
		for(i=0;i<food.length;i++){
			if(food[i][x]==sx&&food[i][y]==sy){
				food.splice(i,1);
				return 1;
			}
		}
		return 0;
	}
	function collideWithObject(){
		for(i=0;i<snake.length;i++){
			for(j=0;j<object.length;j++){
				if(snake[i][x]==object[j][x]&&snake[i][y]==object[j][y]){
					return 1;
				}
			}
		}
		return 0;
	}
	window.onresize = function(){
		CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
		box=CANVAS_SIZE/BOXES;
		ctx.canvas.width=CANVAS_SIZE;
		ctx.canvas.height=CANVAS_SIZE;
		ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
		ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
		fsize=CANVAS_SIZE/10;
		draw();
		window.scrollTo(0,0);
	}
	document.onkeydown = function(e){
		if(playing==1){
			var key = e.which;
			if((key == "37"||key=="65") && ldirection != 2) direction = 4;
			else if((key == "38"||key=="87") && ldirection != 3) direction = 1;
			else if((key == "39"||key=="68") && ldirection != 4) direction = 2;
			else if((key == "40"||key=="83") && ldirection != 1) direction = 3;
		}else{
			if(delay2==0){
				init();
			}
		}
	}
	document.ontouchstart = function(e){
		e.preventDefault();
		if(playing==1){
			if (swiping==-1) {
				swiping = e.touches[0].identifier;
				mousex = e.touches[0].pageX;
				mousey = e.touches[0].pageY;
			}
		}else{
			if(delay2==0){
				init();
			}
		}
	}
	document.ontouchmove = function(e){
		e.preventDefault();
	}
	document.ontouchend = function(e){
		e.preventDefault();
		if(playing==1){
			if (e.changedTouches[0].identifier == swiping) {
				var xdif=Math.abs(e.changedTouches[0].pageX-mousex);
				var ydif=Math.abs(e.changedTouches[0].pageY-mousey);
				if(xdif>50 || ydif>50){
					if(xdif>ydif){
						if(e.changedTouches[0].pageX>mousex && ldirection != 4){
							direction=2;
						}else if(e.changedTouches[0].pageX<mousex && ldirection!=2){
							direction=4;
						}
					}else{
						if(e.changedTouches[0].pageY>mousey && ldirection != 1){
							direction=3;
						}else if(e.changedTouches[0].pageY<mousey && ldirection!=3){
							direction=1;
						}
					}
				}
				swiping=-1;
			}
		}
	}
	draw();
}