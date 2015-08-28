var CANVAS_SIZE,hCANVAS_SIZE,ratio, BOXES=7, BOXSIZE=CANVAS_SIZE/BOXES,rect,
playing=3,delay=0,fsize,pressed=false,hexheight,hexwidth,hexsize,clickable=true;
var difficulty;
var coordinates=[
	{x:-2,y:2},
	{x:-2,y:1},
	{x:-2,y:0},
	{x:-1,y:2},
	{x:-1,y:1},
	{x:-1,y:0},
	{x:-1,y:-1},
	{x:0,y:2},
	{x:0,y:1},
	{x:0,y:0},
	{x:0,y:-1},
	{x:0,y:-2},
	{x:1,y:1},
	{x:1,y:0},
	{x:1,y:-1},
	{x:1,y:-2},
	{x:2,y:0},
	{x:2,y:-1},
	{x:2,y:-2}];
var cmap={};
var imagenames=[],images=[],ctime;
imagenames[0]="hexagon.png";
imagenames[1]="phexagon.png";
window.onload = function(){
	var ctx = document.getElementById("game").getContext("2d");
	ratio=window.devicePixelRatio;
	setSizes();

	logo = new Image();
	logo.onload=function(){
		draw();
		load_images();
		ctime=new Date().getTime();
	};

	logo.src="qornixlogo.jpg";

	function load_images() {
		var numloaded=0;
        for (var i = 0; i < imagenames.length; i++) {
            images[i] = new Image();
            images[i].onload = function () {
                numloaded++;
                if (numloaded == imagenames.length) {
                    var d = new Date();
                    var ntime = 1500 - (d.getTime() - ctime);
                    setTimeout(startup, ntime);
                }
            }
            images[i].src = imagenames[i];
        }
    }

    function startup(){
    	if(localStorage.getItem("dif")!=null){
    		difficulty=localStorage.getItem("dif");
    	}else{
    		difficulty=1;
    		try{
    			localStorage.setItem("dif",1);
    		}catch(err){}
    	}
    	for(var i=0;i<19;i++){
			cmap[coordinates[i].x+":"+coordinates[i].y]=0;
		}
    	playing=5;
    	clickable=true;
    	draw();
    }

	function init(){
		var rnum,x,y;
		ctime = new Date().getTime();
		for(var i=0;i<19;i++){
			cmap[coordinates[i].x+":"+coordinates[i].y]=0;
		}
		var max;
		if(difficulty==1){
			max=5;
		}else if(difficulty==2){
			max=7;
		}else if(difficulty==3){
			max=10;
		}else if(difficulty==4){
			max=15;
		}else if(difficulty==5){
			max=20;
		}
		for(var i=0;i<max;i++){
			rnum = Math.floor(Math.random()*19);
			x=coordinates[rnum].x;
			y=coordinates[rnum].y;
			cmap[x+":"+y]--;
			if(ingrid(x+1,y))
			cmap[(x+1)+":"+y]++;
			if(ingrid(x-1,y))
			cmap[(x-1)+":"+y]++;
			if(ingrid(x,y+1))
			cmap[x+":"+(y+1)]++;
			if(ingrid(x,y-1))
			cmap[x+":"+(y-1)]++;
			if(ingrid(x+1,y-1))
			cmap[(x+1)+":"+(y-1)]++;
			if(ingrid(x-1,y+1))
			cmap[(x-1)+":"+(y+1)]++;
		}
		playing=4;
		draw();
		setTimeout(function(){
			clickable=true;
			playing=0;
			draw();
		},250);
	}

	function draw(){
			ctx.fillStyle="rgb(99,99,99)";
			ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
		if(playing!=3){
			ctx.fillStyle="rgb(255,255,255)";
			ctx.font=fsize*1.5+"px archery";
			ctx.textAlign="left";
			ctx.fillText("Hexaplex",fsize*.25+2,fsize*1.5);
			ctx.fillStyle="rgb(0,0,0)";
			ctx.fillText("Hexaplex",fsize*.25,fsize*1.5);
			ctx.fillStyle="rgb(80,80,80)";
			ctx.fillRect(CANVAS_SIZE*9/16,fsize*.5,fsize*3,fsize);
			ctx.fillRect(CANVAS_SIZE*28/32,fsize*.5,fsize,fsize);
			ctx.font=fsize/2+"px archery";
			ctx.fillStyle="rgb(0,0,0)";
			ctx.fillText("New Game",CANVAS_SIZE*39/64,fsize*1.25);
			ctx.fillText("?",CANVAS_SIZE*58.5/64,fsize*1.25);
		}
		if(playing==0 || playing==5){
			drawMap();
		}else if(playing==4){
			ctx.save();
			ctx.translate(hCANVAS_SIZE-hexwidth/2,CANVAS_SIZE*9/16-hexheight/2);
			ctx.font=fsize/2+"px archery";
			ctx.fillStyle="rgb(0,0,0)";
			ctx.textAlign="center";
			for(var i=0;i<coordinates.length;i++){
				drawCell(coordinates[i].x,coordinates[i].y,true);
			}
			ctx.restore();
		}else if(playing==1){
			ctx.fillStyle="rgb(150,150,150)";
			ctx.fillRect(CANVAS_SIZE/8,CANVAS_SIZE/4,CANVAS_SIZE*3/4,hCANVAS_SIZE);
			ctx.strokeRect(CANVAS_SIZE/8,CANVAS_SIZE/4,CANVAS_SIZE*3/4,hCANVAS_SIZE);
			ctx.fillStyle="rgb(0,0,0)";
			ctx.font=fsize*1.5+"px archery";
			ctx.textAlign="center";
			ctx.fillText("You won!",hCANVAS_SIZE,CANVAS_SIZE*7/16);
			ctx.font=fsize+"px archery";
			ctx.fillText("in "+ctime.toFixed(1)+"s",hCANVAS_SIZE,CANVAS_SIZE*9/16);
			ctx.fillText("Difficulty: "+difficulty,hCANVAS_SIZE,CANVAS_SIZE*11/16);
		}else if(playing==2){
			ctx.fillStyle="rgb(150,150,150)";
			ctx.fillRect(CANVAS_SIZE/10,CANVAS_SIZE/4,CANVAS_SIZE*4/5,hCANVAS_SIZE);
			ctx.strokeRect(CANVAS_SIZE/10,CANVAS_SIZE/4,CANVAS_SIZE*4/5,hCANVAS_SIZE);
			ctx.fillStyle="rgb(0,0,0)";
			ctx.textAlign="center";
			ctx.font=fsize/2+"px archery";
			ctx.fillText("Try to get all hexagons to 0.",CANVAS_SIZE/2,CANVAS_SIZE*3/8);
			ctx.fillText("Click/tap a hexagon to add 1",CANVAS_SIZE/2,CANVAS_SIZE*7/16);
			ctx.fillText("to it and subtract 1 from",CANVAS_SIZE/2,CANVAS_SIZE*1/2);
			ctx.fillText("all hexagons next to it.",CANVAS_SIZE/2,CANVAS_SIZE*9/16);
			ctx.fillText("Click \"New Game\" to start",CANVAS_SIZE/2,CANVAS_SIZE*5/8);
			ctx.fillText("Good Luck!",CANVAS_SIZE/2,CANVAS_SIZE*11/16);
			ctx.fillStyle="rgb(80,80,80)";
			ctx.fillRect(CANVAS_SIZE/4,CANVAS_SIZE*13/16,hCANVAS_SIZE,fsize);
			ctx.fillStyle="rgb(0,0,0)";
			ctx.fillText("Difficulty: "+difficulty,hCANVAS_SIZE,CANVAS_SIZE*71/80);
		}else if(playing==3){
			ctx.drawImage(logo,CANVAS_SIZE/4,CANVAS_SIZE/4,hCANVAS_SIZE,hCANVAS_SIZE);
		}
	}

	function drawMap(){
			ctx.save();
			ctx.translate(hCANVAS_SIZE-hexwidth/2,CANVAS_SIZE*9/16-hexheight/2);
			ctx.font=fsize/2+"px archery";
			ctx.fillStyle="rgb(0,0,0)";
			ctx.textAlign="center";
			for(var i=0;i<coordinates.length;i++){
				drawCell(coordinates[i].x,coordinates[i].y,false);
			}
			ctx.restore();
	}

	function drawNeighbours(x,y,press){
		ctx.save();
		ctx.translate(hCANVAS_SIZE-hexwidth/2,CANVAS_SIZE*9/16-hexheight/2);
		ctx.textAlign="center";
		drawCell(x,y,press);
		drawCell(x+1,y,press);
		drawCell(x+1,y-1,press);
		drawCell(x,y-1,press);
		drawCell(x,y+1,press);
		drawCell(x-1,y+1,press);
		drawCell(x-1,y,press);
		ctx.restore();
	}

	function drawCell(x,y,press){
		if(ingrid(x,y)){
			var px=hexwidth*(x-y)/2;
			var py=hexheight*3/4*(-x-y);
			var num = cmap[x+":"+y];
			if(press){
				ctx.drawImage(images[1],px,py,hexwidth,hexheight);
			}else{
				ctx.drawImage(images[0],px,py,hexwidth,hexheight);
				if(num!=0)
					ctx.fillText(""+num,px+hexwidth/2,py+hexheight*5/8);
			}
		}
	}
	function checkwin(){
		for(var i=0;i<coordinates.length;i++){
			if(cmap[coordinates[i].x+":"+coordinates[i].y]!=0)
				return false;
		}
		return true;
	}

	function ingrid(x,y){
		var z=-x-y;
		return (Math.abs(x)+Math.abs(y)+Math.abs(z))<6;
	}

	function touchGrid(px,py){
		//newgame
		if(px>CANVAS_SIZE*9/16&&px<CANVAS_SIZE*69/80&&py>CANVAS_SIZE/20&&py<CANVAS_SIZE*3/20){
			init();
			return;
			ctx.fillRect(CANVAS_SIZE*28/32,fsize*.5,fsize,fsize);
		}else if(px>CANVAS_SIZE*28/32&&px<CANVAS_SIZE*312/320&&py>CANVAS_SIZE/20&&py<CANVAS_SIZE*3/20){
			playing=2;
			draw();
			clickable=true;
		}else if(playing==2){
			if(px>CANVAS_SIZE/4&&px<CANVAS_SIZE*3/4&&py>CANVAS_SIZE*13/16&&py<CANVAS_SIZE*146/160){
				difficulty++;
				if(difficulty>5){
					difficulty=1;
				}
				try{
    				localStorage.setItem("dif",difficulty);
    			}catch(err){}
				draw();
			}
			clickable=true;
		}else if(playing==0){
			px-=hCANVAS_SIZE;
			py-=CANVAS_SIZE*9/16;
			var x = -py/(3*hexheight/2)+px/hexwidth;
			var y = -py/(3*hexheight/2)-px/hexwidth;
			var z = -x-y;
			var rx=Math.round(x);
			var ry=Math.round(y);
			var rz=Math.round(z);
			var diffx=Math.abs(x-rx);
			var diffy=Math.abs(y-ry);
			var diffz=Math.abs(z-rz);
			if(diffx>diffy&&diffx>diffz){
				rx=-ry-rz;
			}else if(diffy>diffz){
				ry=-rx-rz;
			}
			if(ingrid(rx,ry)){

				cmap[rx+":"+ry]++;
				if(ingrid(rx+1,ry))
				cmap[(rx+1)+":"+ry]--;
				if(ingrid(rx-1,ry))
				cmap[(rx-1)+":"+ry]--;
				if(ingrid(rx,ry+1))
				cmap[rx+":"+(ry+1)]--;
				if(ingrid(rx,ry-1))
				cmap[rx+":"+(ry-1)]--;
				if(ingrid(rx+1,ry-1))
				cmap[(rx+1)+":"+(ry-1)]--;
				if(ingrid(rx-1,ry+1))
				cmap[(rx-1)+":"+(ry+1)]--;

				drawNeighbours(rx,ry,true);
				setTimeout(function(){
					drawNeighbours(rx,ry,false);
					if(checkwin()){
						ctime=((new Date().getTime())-ctime)/1000;
						playing=1;
						draw();
					}
					clickable=true;
				},100);
			}else{
				clickable=true;
			}
		}else{
			clickable=true;
		}
	}

	window.onresize = function(){
		setSizes();
		draw();
		window.scrollTo(0,0);
	}

	function setSizes(){
		CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
		BOXSIZE=Math.ceil(CANVAS_SIZE/BOXES);
		ctx.canvas.width=CANVAS_SIZE;
		ctx.canvas.height=CANVAS_SIZE;
		ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
		ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
		fsize=CANVAS_SIZE/10;
		hCANVAS_SIZE=CANVAS_SIZE/2;
		hexheight=CANVAS_SIZE/6;
		hexsize=hexheight/2;
		hexwidth=hexheight*Math.sqrt(3)/2;
		rect=ctx.canvas.containing
	}

	document.onmousedown = function(e){
		if(clickable){
			clickable=false;
        	touchGrid((e.pageX - ctx.canvas.offsetLeft) * ratio, (e.pageY - ctx.canvas.offsetTop) * ratio);
		}
	}
	document.ontouchstart = function(e){
		e.preventDefault();
		if(clickable){
			clickable=false;
        	touchGrid((e.changedTouches[0].pageX - ctx.canvas.offsetLeft) * ratio, (e.changedTouches[0].pageY - ctx.canvas.offsetTop) * ratio);
		}
	}

	document.ontouchmove = function(e){
		e.preventDefault();
	}
	document.ontouchend = function(e){
		e.preventDefault();
	}
}