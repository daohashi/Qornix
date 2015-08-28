var CANVAS_SIZE, hCANVAS_SIZE, ratio, BOXES = 13,
    BOXSIZE = CANVAS_SIZE / BOXES,
    playing = 3,
    fsize;
var logo, ctime, images = [],
    numloaded = 0,
    reveals;
var imagenames = [],
    firstreveal = -1,
    guesses = 0,
    delay = 0;
var vboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sboard = [1, 8, 8, 6, 3, 2, 5, 1, 4, 7, 4, 2, 6, 7, 3, 5]
imagenames[0] = "grcircle.png";
imagenames[1] = "rcircle.png";
imagenames[2] = "gcircle.png";
imagenames[3] = "bcircle.png";
imagenames[4] = "lbcircle.png";
imagenames[5] = "ycircle.png";
imagenames[6] = "ocircle.png";
imagenames[7] = "pcircle.png";
imagenames[8] = "lgrcircle.png";
window.onload = function () {
    var ctx = document.getElementById("game").getContext("2d");
    ratio = window.devicePixelRatio;
    CANVAS_SIZE = ratio * Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
    BOXSIZE = Math.ceil(CANVAS_SIZE / BOXES);
    ctx.canvas.width = CANVAS_SIZE;
    ctx.canvas.height = CANVAS_SIZE;
    ctx.canvas.style.height = CANVAS_SIZE / ratio + "px";
    ctx.canvas.style.width = CANVAS_SIZE / ratio + "px";
    fsize = CANVAS_SIZE / 5;
    hCANVAS_SIZE = CANVAS_SIZE / 2;
    logo = new Image();
    logo.onload = function () {
        draw();
        load_images();
        ctime = new Date().getTime();
    }
    logo.src = "images/qornixlogo.jpg";

    function load_images() {
        for (var i = 0; i < 9; i++) {
            images[i] = new Image();
            images[i].onload = function () {
                numloaded++;
                if (numloaded == 9) {
                    var d = new Date();
                    var ntime = 1500 - (d.getTime() - ctime);
                    setTimeout(startup, ntime);
                }
            }
            images[i].src = "images/" + imagenames[i];
        }
    }

    function startup() {
        playing = 0;
        draw();
    }

    function init() {
        playing = 1;
        reveals = 0;
        guesses = 0;
        delay = 0;
        vboard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        randomizeboard();
        draw();
    }

    function postoind(x, y) {
        x = x / BOXSIZE;
        y = y / BOXSIZE;
        return Math.floor((x - 1) / 3) + Math.floor((y - 1) / 3) * 4;
    }

    function randomizeboard() {
        var temp, rand;
        for (var i = 0; i < 16; i++) {
            rand = Math.floor(Math.random() * 16);
            temp = sboard[i];
            sboard[i] = sboard[rand];
            sboard[rand] = temp;
        }
    }

    function checkwin() {
        var flag = 0;
        for (var i = 0; i < 16; i++) {
            if (!vboard[i]) {
                flag = 1;
            }
        }
        if (!flag) {
            playing = 2;
            draw();
        }
    }

    function guess(x, y) {
        if (playing == 1 && delay == 0 && (x > BOXSIZE) && (x < CANVAS_SIZE - BOXSIZE) && y > BOXSIZE && y < CANVAS_SIZE - BOXSIZE) {
            var pos = postoind(x, y);
            if (vboard[pos] != 1) {
                if (firstreveal != -1) {
                    guesses++;
                    if (sboard[pos] == sboard[firstreveal]) {
                        vboard[pos] = 1;
                        firstreveal = -1;
                        setTimeout(checkwin, 500);
                    } else {
                        vboard[pos] = 1;
                        delay = 1;
                        setTimeout(function () {
                            vboard[firstreveal] = 0;
                            vboard[pos] = 0;
                            firstreveal = -1;
                            delay = 0;
                            draw();
                        }, 500);
                    }
                } else {
                    firstreveal = pos;
                    vboard[pos] = 1;
                }
            }
            draw();
        } else if (playing == 0 || playing == 2) {
            init();
        }
    }

    function draw() {
        ctx.fillStyle = "rgb(158,102,233)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (playing == 1) {
            for (var i = 0; i < 16; i++) {
                if (vboard[i]) {
                    ctx.drawImage(images[sboard[i]], ((i % 4) * 3 + 1) * BOXSIZE, (Math.floor(i / 4) * 3 + 1) * BOXSIZE,
                        BOXSIZE * 2, BOXSIZE * 2);
                } else {
                    ctx.drawImage(images[0], ((i % 4) * 3 + 1) * BOXSIZE, (Math.floor(i / 4) * 3 + 1) * BOXSIZE,
                        BOXSIZE * 2, BOXSIZE * 2);
                }
            }
        } else if (playing == 2) {
            ctx.fillStyle = "white";
            ctx.font = fsize / 2 + "px Pixel";
            ctx.textAlign = "center";
            ctx.fillText("YOU WON!", hCANVAS_SIZE, CANVAS_SIZE / 4);
            ctx.font = fsize / 3 + "px Pixel";
            ctx.fillText("Guesses: " + guesses, hCANVAS_SIZE, hCANVAS_SIZE);
            ctx.font = fsize / 5 + "px Pixel";
            ctx.fillText("<Click/tap to restart>", hCANVAS_SIZE, CANVAS_SIZE * 3 / 4);
        } else if (playing == 0) {
            ctx.fillStyle = "white";
            ctx.font = fsize / 2 + "px Pixel";
            ctx.textAlign = "center";
            ctx.fillText("Memory", hCANVAS_SIZE, CANVAS_SIZE / 4);
            ctx.font = fsize / 5 + "px Pixel";
            ctx.fillText("Click/tap on circles to", hCANVAS_SIZE, CANVAS_SIZE * 2 / 5);
            ctx.fillText("reveal color. Reveal", hCANVAS_SIZE, CANVAS_SIZE * 9 / 20);
            ctx.fillText("same colored circles", hCANVAS_SIZE, hCANVAS_SIZE);
            ctx.fillText("to advance. You can", hCANVAS_SIZE, CANVAS_SIZE * 11 / 20);
            ctx.fillText("only reveal two", hCANVAS_SIZE, CANVAS_SIZE * 3 / 5);
            ctx.fillText("circles at a time", hCANVAS_SIZE, CANVAS_SIZE * 13 / 20);
            ctx.fillText("<Click/tap to begin>", hCANVAS_SIZE, CANVAS_SIZE * 7 / 8);
        } else if (playing == 3) {
            ctx.drawImage(logo, CANVAS_SIZE / 4, CANVAS_SIZE / 4, hCANVAS_SIZE, hCANVAS_SIZE);
        }
    }
    window.onresize = function () {
        CANVAS_SIZE = ratio * Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
        BOXSIZE = Math.ceil(CANVAS_SIZE / BOXES);
        ctx.canvas.width = CANVAS_SIZE;
        ctx.canvas.height = CANVAS_SIZE;
        ctx.canvas.style.height = CANVAS_SIZE / ratio + "px";
        ctx.canvas.style.width = CANVAS_SIZE / ratio + "px";
        fsize = CANVAS_SIZE / 5;
        hCANVAS_SIZE = CANVAS_SIZE / 2;
        draw();
        window.scrollTo(0,0);
    }

    document.onmousedown = function (e) {
        guess((e.pageX - ctx.canvas.offsetLeft)*ratio, (e.pageY - ctx.canvas.offsetTop)*ratio);
    }
    document.ontouchstart = function (e) {
        e.preventDefault();
        guess((e.changedTouches[0].pageX - rect.left) * ratio, (e.changedTouches[0].pageY - rect.top) * ratio);
    }
    document.ontouchmove = function (e) {
        e.preventDefault();
    }
    document.ontouchend = function(e){
        e.preventDefault();
    }
}