var ctx, CANVAS_SIZE,hCANVAS_SIZE,ratio, BOXES=400, BOXSIZE=CANVAS_SIZE/BOXES,
playing=3,score,delay=0,fsize,pressed=false,logo,x=0,y=1,dir;
var ship, asteroid,images_loaded=0,ctime,touches=0;
var px,py,vx,vyrotation,spawntick,tospawn,asteroids=[],collision_points=[[0,-20],[-10,10],[10,10]];
var stars=[[20,20],[350,350],[100,150],[300,100],[380,200],[250,380],[120,80],[80,350],[200,250]];
window.onload = function(){
	ctx = document.getElementById("game").getContext("2d");
	ratio=window.devicePixelRatio;
	CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
	BOXSIZE=CANVAS_SIZE/BOXES;
	ctx.canvas.width=CANVAS_SIZE;
	ctx.canvas.height=CANVAS_SIZE;
	ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
	ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
	fsize=CANVAS_SIZE/10;
	hCANVAS_SIZE=CANVAS_SIZE/2;
	logo = new Image();
	logo.onload=function(){
		draw();
		load_images();
		ctime=new Date().getTime();
	};
	logo.src="qornixlogo.jpg";
	function load_images(){
		ship=new Image();
		asteroid=new Image();
		ship.onload=image_loaded;
		asteroid.onload=image_loaded;
		ship.src="spaceship2.png";
		asteroid.src="asteroid.png";
	}

	function image_loaded(){
		images_loaded++;
		if(images_loaded>=2){
			var d = new Date();
			var ntime = 1500 -((d.getTime()) - ctime);
				setTimeout(function(){
					playing=0;draw();
					setTimeout(update,50);
				},ntime);
		}
	}
	function init(){
		playing=1;
		px=200;
		py=200;
		vx=0;
		vy=0;
		rotation=0;
		spawntick=10;
		tospawn=5;
		asteroids=[];
		score=0;
		draw();
	}

	function spawn_asteroid(){
		var x,y,vx,vy;
		var r = Math.floor(Math.random()*4);
		if(r==0){
			x=-15;
			y=Math.floor(Math.random()*200)+100;
			vx=2+Math.random()*2;
			vy=Math.random()*4-2;
		}else if(r==1){
			x=Math.floor(Math.random()*200)+100;
			y=-15;
			vx=Math.random()*4-2;
			vy=2+Math.random()*2;
		}else if(r==2){
			x=415;
			y=Math.floor(Math.random()*200)+100;
			vx=-(2+Math.random()*2);
			vy=Math.random()*4-2;
		}else{
			x=Math.floor(Math.random()*200)+100;
			y=415;
			vx=Math.random()*4-2;
			vy=-(2+Math.random()*2);
		}
		asteroids.push({x:x,y:y,vx:vx,vy:vy});
	}

	function draw(){
		ctx.fillStyle="black";
		ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
		ctx.strokeStyle="white";
		ctx.strokeRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
		if(playing!=3){
			ctx.fillStyle="white";
			for(var i=0;i<stars.length;i++){
				ctx.fillRect(stars[i][x]*BOXSIZE,stars[i][y]*BOXSIZE,CANVAS_SIZE/100,CANVAS_SIZE/100);
			}
		}
		if(playing==1){
			ctx.save();
			ctx.translate(px*BOXSIZE,py*BOXSIZE);
			ctx.rotate(Math.PI*rotation/12);
			ctx.drawImage(ship,-BOXSIZE*10,-BOXSIZE*20,BOXSIZE*20,BOXSIZE*30);
			ctx.restore();
			for(var i=0;i<asteroids.length;i++){
				ctx.drawImage(asteroid,(asteroids[i].x-15)*BOXSIZE,(asteroids[i].y-15)*BOXSIZE,BOXSIZE*30,BOXSIZE*30);
			}
			ctx.fillStyle="white";
			ctx.font=fsize/4+"px Pixel";
			ctx.textAlign="left";
			ctx.fillText("Score: "+score,10,CANVAS_SIZE-fsize/3);
		}else if(playing==2){
			ctx.fillStyle="white";
			ctx.font=fsize+"px Pixel";
			ctx.textAlign="center";
			ctx.fillText("Game Over",hCANVAS_SIZE,CANVAS_SIZE/4);
			ctx.font=fsize/2+"px Pixel";
			ctx.fillText("Score: "+score,hCANVAS_SIZE,hCANVAS_SIZE);
			ctx.font=fsize/4+"px Pixel";
			ctx.fillText("Press any key or tap to play again",hCANVAS_SIZE,CANVAS_SIZE*3/4);
		}else if(playing==0){
			ctx.fillStyle="white";
			ctx.font=fsize+"px Pixel";
			ctx.textAlign="center";
			ctx.fillText("Asteroids",hCANVAS_SIZE,hCANVAS_SIZE);
			ctx.font=fsize/4+"px Pixel";
			ctx.fillText("Press any key or tap to start",hCANVAS_SIZE,CANVAS_SIZE*5/8);
			ctx.fillText("Use the arrow keys or",hCANVAS_SIZE,CANVAS_SIZE*3/4);
			ctx.fillText("tap the screen to steer",hCANVAS_SIZE,CANVAS_SIZE*3/4+fsize/2);
		}else if(playing==3){
			ctx.drawImage(logo,CANVAS_SIZE/4,CANVAS_SIZE/4,hCANVAS_SIZE,hCANVAS_SIZE);
		}
	}

	function update(){
		if(playing!=3){
			for(var i=0;i<stars.length;i++){
				if(stars[i][x]<=0){
					stars[i][x]=400;
				}
				stars[i][x]--;
			}
		}
		if(playing==1){
			score++;
			if(dir=="left"){
				rotation--;
				if(rotation<0){
					rotation=23;
				}
			}else if(dir=="right"){
				rotation++;
				if(rotation>23){
					rotation=0;
				}
			}
			vx+=Math.sin(Math.PI*rotation/12)*.2;
			vy-=Math.cos(Math.PI*rotation/12)*.2;
			var speed=Math.sqrt(vx*vx+vy*vy);
			if(speed>5){
				vx*=5/speed;
				vy*=5/speed;
			}
			px+=vx;
			py+=vy;
			if(px>415){
				px=-15;
			}else if(px<-15){
				px=415;
			}
			if(py>415){
				py=-15;
			}else if(py<-15){
				py=415;
			}
			var cpoints=[];
			for(var i=0;i<3;i++){
				if(!cpoints[i]) cpoints[i]=[];
				var angle=rotation*Math.PI/12;
				cpoints[i][0]=Math.cos(angle)*collision_points[i][0]-Math.sin(angle)*collision_points[i][1]+px;
				cpoints[i][1]=Math.cos(angle)*collision_points[i][1]+Math.sin(angle)*collision_points[i][0]+py;
			}
			for(var i=0;i<asteroids.length;i++){
				asteroids[i].x+=asteroids[i].vx;
				asteroids[i].y+=asteroids[i].vy;
				if(asteroids[i].x>415||asteroids[i].x<-15||asteroids[i].y>415||asteroids[i].y<-15){
					asteroids.splice(i,1);
					spawn_asteroid();
				}
				for(var j=0;j<3;j++){
					if((Math.pow(cpoints[j][0]-asteroids[i].x,2)+Math.pow(cpoints[j][1]-asteroids[i].y,2))<225){
						delay=1;
						playing=2;
						setTimeout(function(){delay=0;},1000);
						break;
					}
				}
			}
			if(score%250==0){
				tospawn++;
			}
			spawntick--;
			if(asteroids.length<15&&spawntick<=0){
				spawntick=10;
				if(tospawn>0){
					spawn_asteroid();
					tospawn--;
				}
			}
		}
		draw();
		if(playing!=3)
			setTimeout(function(){update();},50);
	}

	window.onresize = function(){
		CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
		BOXSIZE=CANVAS_SIZE/BOXES;
		ctx.canvas.width=CANVAS_SIZE;
		ctx.canvas.height=CANVAS_SIZE;
		ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
		ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
		fsize=CANVAS_SIZE/10;
		hCANVAS_SIZE=CANVAS_SIZE/2;
		draw();
		window.scrollTo(0,0);
	}

	document.onkeydown = function(e){
		if((playing==0||playing==2)&&delay==0){
			init();
		}
		var key = e.which;
			if(key == "37"||key=="65"){ //left key
				dir="left";
			}
			else if(key == "39"||key=="68"){ //right key
				dir="right";
			}

		}
		document.onkeyup = function(e){
			var key = e.which;
			if((key == "37"||key=="65")&&dir=="left"){ //left key
				dir=0;
			}
			else if((key == "39"||key=="68")&&dir=="right"){ //right key
				dir=0;
			}
		}
		document.ontouchstart = function(e){
			e.preventDefault();
			touches++;
			if((playing==0||playing==2)&&delay==0){
				init();
			}
			if(e.changedTouches[0].pageX<document.documentElement.clientWidth/2){
				dir="left";
			}else{
				dir="right";
			}
		}
		document.ontouchmove = function(e){
			e.preventDefault();
			if(e.changedTouches[0].pageX<document.documentElement.clientWidth/2){
				dir="left";
			}else{
				dir="right";
			}
		}
		document.ontouchend = function(e){
			e.preventDefault();
			if(touches>0) touches--;

			if(touches==0){
				dir=0;
			}
		}
	}