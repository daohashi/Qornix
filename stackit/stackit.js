var CANVAS_SIZE,hCANVAS_SIZE,ratio, BOXES=7, BOXSIZE=CANVAS_SIZE/BOXES,delay=0,score=0,playing=0,fsize,pressed=false;
var mblocks, sblocks, direction,moveblocks,offset,tickcounter,ticks,rskip;
window.onload = function(){
	var ctx = document.getElementById("game").getContext("2d");
	ratio=window.devicePixelRatio;
	CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
	BOXSIZE=Math.ceil(CANVAS_SIZE/BOXES);
	ctx.canvas.width=CANVAS_SIZE;
	ctx.canvas.height=CANVAS_SIZE;
	ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
	ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
	fsize=CANVAS_SIZE/10;
	hCANVAS_SIZE=CANVAS_SIZE/2;
	function init(){
		playing=1;
		mblocks=[0,1,2];
		sblocks=[[2,3,4],[2,3,4],[2,3,4]];
		direction=1;
		score=0;
		moveblocks=false;
		tickcounter=0;
		offset=0;
		ticks=5;
		rskip=Math.floor(Math.random()*7)+3;
		draw();
		setTimeout(function(){update();},50);
	}

	function draw(){
		ctx.fillStyle="blue";
		ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
		ctx.strokeStyle="rgb(255,255,255)";
		ctx.strokeRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

		if(playing==1){
			ctx.fillStyle="white";
			for(i=0;i<mblocks.length;i++){
				ctx.fillRect(BOXSIZE*mblocks[i]+BOXSIZE/20,offset+(6-sblocks.length)*BOXSIZE+BOXSIZE/20,BOXSIZE*.9,BOXSIZE*.9);
			}
			for(i=0;i<sblocks.length;i++){
				for(j=0;j<sblocks[i].length;j++){
					ctx.fillRect(BOXSIZE*sblocks[i][j]+BOXSIZE/20,offset+(7-sblocks.length+i)*BOXSIZE+BOXSIZE/20,BOXSIZE*.9,BOXSIZE*.9);
				}
			}
			ctx.font=fsize/4+"pt Arial";
			ctx.textAlign="left";
			ctx.fillText("Score: "+score,10,CANVAS_SIZE-10);
		}else if(playing==2){
			ctx.fillStyle="white";
			ctx.textAlign="center";
			ctx.font=fsize+"pt Arial";
			ctx.fillText("GAME OVER", hCANVAS_SIZE, CANVAS_SIZE/4);
			ctx.fillText("Score: "+score, hCANVAS_SIZE, hCANVAS_SIZE);
			ctx.font=fsize/2+"pt Arial";
			ctx.fillText("<Press any key/tap to play>",hCANVAS_SIZE,CANVAS_SIZE*3/4);
		}else if(playing==0){
			ctx.fillStyle="white";
			ctx.font=fsize+"pt Arial";
			ctx.textAlign="center";
			ctx.fillText("Stack It",hCANVAS_SIZE,hCANVAS_SIZE);
			ctx.font=fsize/2+"pt Arial";
			ctx.fillText("<Press any key/tap to play>",hCANVAS_SIZE,CANVAS_SIZE*3/4);
		}
	}

	function update(){
		tickcounter++;
		if(tickcounter>=Math.ceil(ticks)){
			tickcounter=0;
			if(moveblocks){
				moveblocks=false;
				var tarray= new Array;
				for(i=0;i<mblocks.length;i++){
					if(sblocks[0].indexOf(mblocks[i])>=0){
						tarray.push(mblocks[i]);
					}else{
						mblocks.splice(i,1);
						i--;
					}
				}
				if(tarray.length>0){
					sblocks.unshift(tarray);
					score++;
					if(ticks>3){
						ticks-=.1;
					}
				}else{
					playing=2;
					delay=1;
					setTimeout(function(){delay=0;},500);
					draw();
					return;
				}
			}
			if(ticks>3||(ticks<=3 && rskip>0)){
				if(ticks<=3){
					rskip--;
				}
				for(i=0;i<mblocks.length;i++){
					mblocks[i]+=direction;
				}
				if(mblocks[mblocks.length-1]==BOXES-1||mblocks[0]==0){
					direction*=-1;
				}
			}else{
				rskip=Math.floor(Math.random()*7)+3;
			}
		}
		if(sblocks.length>3){
			if(offset+Math.floor(BOXSIZE/(3*Math.ceil(ticks)))>=BOXSIZE){
				sblocks.pop();
				offset=0;
			}else{
				offset+=Math.floor(BOXSIZE/(3*Math.ceil(ticks)));
			}
		}
		draw();
		if(playing==1)
			setTimeout(function(){update();},50);
	}

	function press(){
		if(!pressed){
			pressed=true;
			if(playing==1){
				moveblocks=true;
			}else{
				if(delay==0){
					init();
				}
			}
		}

	}

	window.onresize = function(){
		CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
		BOXSIZE=Math.ceil(CANVAS_SIZE/BOXES);
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
		press();
	}
	document.onkeyup = function(e){
		pressed=false;
	}
	document.ontouchstart = function(e){
		e.preventDefault();
		press();
	}
	document.ontouchmove = function(e){
		e.preventDefault();
	}
	document.ontouchend = function(e){
		e.preventDefault();
		pressed=false;
	}
	draw();
}