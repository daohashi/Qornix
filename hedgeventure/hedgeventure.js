var CANVAS_SIZE,hCANVAS_SIZE,ratio, BOXES=7,BOXSIZE, TENTH=CANVAS_SIZE/10,
offsetx,offsety,rows,cols,playing=3,fsize,logo,ctime;

var map=new Array(),px,py,won,dir,images=[],imagenames=[],step4,fdir;
var starttime,completetime;
imagenames[0]="shrub.png";
imagenames[1]="grass.png";
imagenames[2]="player1.png";
imagenames[3]="player2.png";
imagenames[4]="player3.png";
imagenames[5]="player4.png";
imagenames[6]="portal.png";
window.onload = function(){
	var ctx = document.getElementById("game").getContext("2d");
	ratio=window.devicePixelRatio;
	CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
	BOXSIZE=CANVAS_SIZE/BOXES;
	ctx.canvas.width=CANVAS_SIZE;
	ctx.canvas.height=CANVAS_SIZE;
	ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
	ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
	fsize=CANVAS_SIZE/10;
	hCANVAS_SIZE=CANVAS_SIZE/2;
	TENTH=CANVAS_SIZE/10;
	ctx.textAlign="center";
	logo=new Image();
	logo.onload=function(){
		draw();
		ctime= new Date().getTime();
		load_images();
	}
	logo.src="qornixlogo.png";

	function load_images(){
		var counter=0;
		for(var i=0;i<imagenames.length;i++){
			images[i]=new Image();
			images[i].onload = function(){
				counter++;
				if(counter==imagenames.length){
					var d = new Date();
					var ntime = 1500 - (d.getTime()-ctime);
					setTimeout(function(){
						playing=0;draw();
					},ntime);
				}
			}
			images[i].src=imagenames[i];
		}
	}

	function init(){
		px=0;
		py=0;
		dir=0;
		won=false;
		step4=0;
		generate_maze();
		starttime = new Date().getTime();
		playing=1;
		draw();
		setTimeout(update,50);
	}
	function generate_maze(){
		rows=17;
		cols=17;
		var walls=new Array();
		var cells= new Array(),len;
		for(var c=0;c<cols;c++){
			map[c]=new Array(); //initiate new map row
			if(c%2==0) //initaite every other cell row
				cells[c]=new Array();
			for(var r=0;r<rows;r++){
				map[c][r]=1;// initiate every map coordinate
				if(c%2==0&&r%2==0){ //if cell tile
					cells[c][r]=r*cols+c;
					map[c][r]=0;//all these cells will be blank by end of algorithm anyways
				}else if((c%2==1&&r%2==0)||(c%2==0&&r%2==1)){
					len=walls.length;
					walls[len]=[c,r];
				}
			}
		}
		while(walls.length>0){
			var ind=Math.floor(Math.random()*walls.length);
			var c=walls[ind][0],r=walls[ind][1];
			var c1=c,r1=r,c2=c,r2=r;
			if(r%2==0){ //horizontal wall
				c1-=1;
				c2+=1;
			}else{ //vertical wall
				r1-=1;
				r2+=1;
			}
			if(cells[c1][r1]!=cells[c2][r2]){
				map[c][r]=0;
				var swith=cells[c1][r1];
				for(var co=0;co<cols;co+=2){
					for(var ro=0;ro<rows;ro+=2){
						if(cells[co][ro]==swith)
							cells[co][ro]=cells[c2][r2];
					}
				}
			}
			walls.splice(ind,1);
		}
	}
	function draw(){
		if(playing==0||playing==2){
			for(var r=0;r<BOXES;r++){
				for(var c=0;c<BOXES;c++){
					ctx.drawImage(images[1],c*BOXSIZE,r*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
				}
			}
		}
		if(playing==1){
			var x,y;
			if(isequal(0,px%1)){
				x = Math.round(px);
			}else{
				x=Math.floor(px);
			}
			if(isequal(0,py%1)){
				y = Math.round(py);
			}else{
				y=Math.floor(py);
			}
			var offsetx = x-px;
			var offsety = y-py;
			var drawx,drawy;
			for(var r=0;r<=BOXES;r++){
				for(var c=0;c<=BOXES;c++){
					ctx.drawImage(images[1],(offsetx+c)*BOXSIZE,(offsety+r)*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
					drawx=x+(c-3);
					drawy=y+(r-3);
					if(drawx<=-1||drawx>=cols||drawy<=-1||drawy>=rows){
						ctx.drawImage(images[0],(offsetx+c)*BOXSIZE,(offsety+r)*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
						continue;
					} 
					if(map[drawx][drawy]==1){
						ctx.drawImage(images[0],(offsetx+c)*BOXSIZE,(offsety+r)*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
					}
					if(drawx==cols-1&&drawy==rows-1){
						ctx.drawImage(images[6],(offsetx+c)*BOXSIZE,(offsety+r)*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
					}
				}
			}
			ctx.drawImage(images[Math.floor(step4)+2],3*BOXSIZE,3*BOXSIZE,BOXSIZE+1,BOXSIZE+1);
		}else if(playing==2){
			ctx.fillStyle="white";
			ctx.font=fsize*1.5+"px Pixel";
			ctx.fillText("You finished!",hCANVAS_SIZE,hCANVAS_SIZE);
			ctx.font=fsize/1.5+"px Pixel";
			ctx.fillText("in "+completetime+" seconds",hCANVAS_SIZE,CANVAS_SIZE*5/8)
			ctx.fillText("Press any key/tap to replay",hCANVAS_SIZE,CANVAS_SIZE*3/4);
		}else if(playing==0){
			ctx.fillStyle="white";
			ctx.font=fsize*1.5+"px Pixel";
			ctx.fillText("Hedgeventure",hCANVAS_SIZE,CANVAS_SIZE/4);
			ctx.font=fsize/1.5+"px Pixel";
			ctx.fillText("Navigate to the opposite",hCANVAS_SIZE,CANVAS_SIZE*7/16);
			ctx.fillText("end of the maze with",hCANVAS_SIZE,hCANVAS_SIZE);
			ctx.fillText("the arrow keys/tapping",hCANVAS_SIZE,CANVAS_SIZE*9/16);
			ctx.fillText("Press any key/tap to play",hCANVAS_SIZE,CANVAS_SIZE*3/4);
			ctx.fillText("Art by @AaronArcand",hCANVAS_SIZE,CANVAS_SIZE*7/8);
		}else if(playing==3){
			ctx.drawImage(logo,0,0,CANVAS_SIZE,CANVAS_SIZE);
		}
	}

	function isequal(a,b){
		return Math.abs(a-b)<.1;
	}

	function update(){
		ctime = new Date().getTime();
		if(step4>=4){
			step4=0;
		}
		if(!won){
			if(isequal(Math.round(px),px)&&isequal(Math.round(py),py)){
				move(dir);
			}else{
				incmove();
			}
		}
		draw();
		step4+=.5;
		ctime=new Date().getTime()-ctime;
		if(playing==1)
			setTimeout(function(){update();},50-ctime);
	}

	function incmove(){
		if(fdir==1){
			px-=.2;
		}else if(fdir==2){
			py-=.2;
		}else if(fdir==3){
			px+=.2;
		}else if(fdir==4){
			py+=.2
		}
	}

	function move(dir){
		var ppx=Math.round(px),ppy=Math.round(py);
		if(ppx==cols-1&&ppy==rows-1){
			won=true;
			completetime=Math.round(((new Date().getTime())-starttime)/1000);
			setTimeout(function(){
				playing=2;
				draw();
			},250);
			return;
		}
		if(dir==1&&ppx>0&&map[ppx-1][ppy]==0){ //left
			px-=.2;
			fdir=1;
		}else if(dir==2&&ppy>0&&map[ppx][ppy-1]==0){ //up
			py-=.2;
			fdir=2;
		}else if(dir==3&&ppx<cols-1&&map[ppx+1][ppy]==0){ //right
			px+=.2;
			fdir=3;
		}else if(dir==4&&ppy<rows-1&&map[ppx][ppy+1]==0){ //down
			py+=.2;
			fdir=4;
		}		
	}

	window.onresize = function(){
		CANVAS_SIZE=ratio*Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight);
		ctx.canvas.width=CANVAS_SIZE;
		ctx.canvas.height=CANVAS_SIZE;
		ctx.canvas.style.height=CANVAS_SIZE/ratio+"px";
		ctx.canvas.style.width=CANVAS_SIZE/ratio+"px";
		BOXSIZE=CANVAS_SIZE/BOXES;
		fsize=CANVAS_SIZE/10;
		hCANVAS_SIZE=CANVAS_SIZE/2;
		TENTH=CANVAS_SIZE/10;
		ctx.textAlign="center";
		draw();
		window.scrollTo(0,0);
	}

	document.onkeydown = function(e){
		if(playing==1){
			var key=e.which;
			if(key==37){ //left
				dir=1;
			}else if(key==38){ //up
				dir=2;
			}else if(key==39){ //right
				dir=3;
			}else if(key==40){ //down
				dir=4;
			}
		}else if(playing==0||playing==2){
			init();
		}
	}
	document.ontouchstart = function(e){
		e.preventDefault();
		if(playing==1){
			var x = (e.changedTouches[0].pageX-ctx.canvas.offsetLeft)*ratio;
			var y = (e.changedTouches[0].pageY-ctx.canvas.offsetTop)*ratio;
			if(Math.abs(x-CANVAS_SIZE/2)>Math.abs(y-CANVAS_SIZE/2)){
				if(x<CANVAS_SIZE/2){ //left
					dir=1;
				}else{ //right
					dir=3;
				}
			}else{
				if(y<CANVAS_SIZE/2){
					dir=2;
				}else{//down
					dir=4;
				}
			}
		}else if(playing==0||playing==2){
			init();
		}
	}
	document.ontouchmove = function(e){
		e.preventDefault();
	}
	document.ontouchend = function(e){
		e.preventDefault();
	}
}