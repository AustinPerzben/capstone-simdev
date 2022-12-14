(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define('p5.Utils', ['p5'], function (p5) {
            (factory(p5));
        });
    else if (typeof exports === 'object')
        factory(require('p5'));
    else
        factory(root['p5']);
}(this, function (p5) {
    var _f;
    var _fLoaded = false;
    var _pt = 0;
    var pxRulerHCanvas;
    var pxRulerHCtx;
    var pxRulerVCanvas;
    var pxRulerVCtx;
    var rulerLineX;
    var rulerLineY;
    var rulerInfo;

    /**
     * 
     * 
     * @author Alp Tuğan
     * @see {@link https://www.alptugan.com|About the author}
     * @version 0.1.0
     * @description Base class for the library
     * @constructor p5.Utils
     * 
     * 
     */
    p5.Utils = function () {
        this.version = 0.1;
    };

    /**
     * 
     * @method debug 
     * @description Create Debug Div cause p5 font is expensive. 
     * @param {Object.<string, number> | Object.<string, string>} _itemName The argument must be in JSON data format. The function automatically parses "keys" to titles and their "values" next to them. You can add as many objects as you want. 
     * @example <caption>How to use debug() method.</caption> 
     * // Define global variable and initialize p5.Utils lib
     * var utils = new p5.Utils();
     * 
     * utils.debug(
     * {
     *    "FPS": frameRate().toFixed(0),
     *    "Frequency": frequency.toFixed(3)
     * });
     */
    p5.Utils.prototype.debug = function (_itemName) {
        if (!document.getElementsByClassName("debug")[0]) {
            debug = document.createElement('div');
            debug.className = 'debug';
            document.body.appendChild(debug);
            debug.style.left = 2 + 'px';
            debug.style.lineHeight = 1.3;
            debug.style.fontFamily = "Consolas, Menlo, Monaco, monospace";
            debug.style.fontSize = 11 + "px";
            debug.style.fontWeight = 100;
            debug.style.fontStyle = "normal";
            debug.style.fontVariant = "normal";
            debug.style.position = "absolute";
            debug.style.marginLeft = 15 + "px";
            debug.style.marginBottom = (innerHeight - height) + 15 + "px";
            debug.style.left = 0 + "px";
            debug.style.bottom = 0 + "px";
            debug.style.color = "black";
            debug.style.opacity = 0.5;
            debug.style.background = "lightgrey";
            debug.style.padding = "4px 6px";
            debug.style.borderRadius = "4px";
            debug.style.cursor = "default";
            debug.style.zindex = "99999";
        }

        debug.innerHTML = "";

        for (let i = 0; i < Object.keys(_itemName).length; i++) {
            debug.innerHTML += "<i>" + Object.keys(_itemName)[i] + ": </i>" + Object.values(_itemName)[i] + "</br>";
        }
    }


    /**
     * @method getTimeStamp
     * @description Timestamp function useful for file naming to avoid overwrite issues.
     * @param {boolean} [_date=true] If true -> Timestamp within Year-Month-Day
     * @returns {string} Current date + time depending on _date argument value. 
     * 
     * When _date = true;
     * 
     * The return format is Year-Month-Day_Hour-Minute-Second
     * 
     * When _date = false;
     * 
     * The return format is Hour-Minute-Second
     * 
     * @see {@link text}
     * @example
     * // Define global variable and initialize p5.Utils lib
     * var utils = new p5.Utils();
     * 
     * // Font source:
     * // https://www.dafont.com/lcd-at-t-phone-time-date.font
     * var cutomFontName = "LCDAT&TPhoneTimeDate.ttf";
     * 
     * function setup() {
     *   createCanvas(600, 600);
     *   //noLoop();
     * }
     * 
     * function draw() {
     *   background(200);
     * 
     *   // get current time stamp within date
     *   var currentTime = utils.getTimeStamp();
     *   //print(currentTime);
     * 
     *   // write it to canvas using utils's text function 
     *   fill(255, 100, 20);
     *   utils.text(
     *     currentTime,        // string to display
     *     width * 0.5 - 100,   // x position
     *     height * 0.5 - 60,  // y position
     *     16
     *   );
     * 
     *   // get current time stamp without date
     *   var currentTime2 = utils.getTimeStamp(false);
     *   fill(90, 90, 90);
     *   // write it to canvas using utils's text function 
     *   utils.text(
     *     currentTime2,   // string to display
     *     width * 0.5,   // x position
     *     height * 0.5,  // y position
     *     80,            // fontsize
     *     cutomFontName,  // custom font
     *     CENTER,        // text alignment horizontal
     *     CENTER);       // text alignment vertical
     * 
     * }
     */
    p5.Utils.prototype.getTimeStamp = function (_date = true) {

        var _tv;
        if (second() >= 10)
            _tv = (hour() + "-" + minute() + "-" + second());
        else
            _tv = (hour() + "-" + minute() + "-0" + second());
        var _dv = (year() + "-" + month() + "-" + day());
        var _t = "";
        if (_date) {
            _t = _dv + "_" + _tv;
        } else {
            _t = _tv;
        }

        return _t;
    }

    /**
     * 
     * @method getRandomInt
     * @description Generates and returns a random integer between min and max number
     * @param {number} _min Floor value of the random number
     * @param {number} _max Ceil value of the random number
     * @returns {number} Result will be integer
     */
    p5.Utils.prototype.getRandomInt = function (_min, _max) {
        _min = Math.ceil(_min);
        _max = Math.floor(_max);
        //The maximum is exclusive and the minimum is inclusive
        return Math.floor(Math.random() * (_max - _min) + _min);
    }



    /**
     * @method saveCanvas 
     * @description Utilizes p5JS saveCanvas function to make it easier file saving process by combining the function with getTimeStamp() method.
     * @param {string|number} [_prefix=""] Any relevant text in the begining of the file name. If it is leaved empty, the file name will be Year-Month-Day_Hour-Minute-Second.PNG
     * @param {string} [_suffix="png"] The file extension JPG, PNG, ... 
     * @example
     * var x, y, px, py;
     * var jump = 10;
     * var ptime = 2000;
     * 
     * // Init global utils var
     * var utils = new p5.Utils();
     * var counter = 0;
     * 
     * function setup() {
     *   createCanvas(600, 600);
     * 
     *   x = width * 0.5;
     *   y = height * 0.5;
     *   px = x;
     *   py = y;
     *   background(180);
     * }
     * 
     * function draw() {
     *   //background(180, 1);
     *   px = x;
     *   py = y;
     * 
     * 
     *   // Basic random walker algorithm
     *   var dice = random();
     * 
     *   if (dice < 0.25) {
     *     x += jump;
     *   } else if (dice < 0.5) {
     *     x -= jump;
     *   } else if (dice < 0.75) {
     *     y += jump;
     *   } else {
     *     y -= jump;
     *   }
     * 
     *   strokeWeight(5);
     *   stroke("#ffcc00");
     *   noFill();
     *   beginShape();
     *   vertex(x, y);
     *   vertex(px, py);
     *   endShape();
     * 
     *   // Automated saveCanvas for every 10th second
     *   if (utils.notify(10) == true && counter < 4) {
     *     ptime = millis();
     * 
     *     // save current canvas image with default attributes
     *     utils.saveCanvas();
     * 
     *     // or you can set prefix and file extension argument
     *     // utils.saveCanvas("randomWalker","jpg");
     * 
     *     // clear the canvas again
     *     background(180);
     * 
     * 
     *     // set starting position to middle of the canvas
     *     x = width * 0.5;
     *     y = height * 0.5;
     *     px = x;
     *     py = y;
     * 
     *     counter++;
     *   }
     * 
     * }
     */
    p5.Utils.prototype.saveCanvas = function (_prefix = "", _suffix = "png") {

        if (_prefix == "") {
            saveCanvas(this.getTimeStamp(), _suffix);
        } else {
            saveCanvas(_prefix + "_" + this.getTimeStamp(), _suffix);
        }
    };

    /**
     * @method arrayResize 
     * @description Resizes an array and returns it. Similar to vectors resize in C++.
     * @param {number[]|string[]|boolean[]} _arr The array to be resized
     * @param {number} _newSize The new size of the array
     * @param {number|string|boolean} [_defaultValue=-1] Default value for all members of the new array.
     * @returns {number[]|string[]|boolean[]} The new array 
     * @example
     * // Define global variable and initialize p5.Utils lib
     * var utils = new p5.Utils();
     * var arr = [];
     * arr = utils.arrayResize(arr,10);
     * print(arr);
     * 
     * // or assign default values
     * arr = utils.arrayResize(arr, 22, random(0,1));
     * print(arr);
     */
    p5.Utils.prototype.arrayResize = function (_arr, _newSize, _defaultValue = -1) {
        _arr.length = 0;
        for (let i = 0; i < floor(_newSize); i++) {
            if (_defaultValue != -1)
                _arr.push(_defaultValue);
        }
        _arr.length = floor(_newSize);

        return _arr;
    }


    /**
     * @description Set the style and display the text in a single method. See {@link getTimeStamp} example on how to use the function.
     * @method text
     * @param {string|number} _txt Text or number to be displayed
     * @param {number} _x X position of the text
     * @param {number} _y Y position of the text
     * @param {number} [_size=12] Font size
     * @param {string} [_font="sans-serif"] Custom Font face. See example {@link getTimeStamp}
     * @param {Constant} [_alignH=LEFT] Text horizontal align
     * @param {Constant} [_alighV=TOP] Text vertical align
     * 
     */
    p5.Utils.prototype.text = function (_txt, _x, _y, _size = 12, _font = "sans-serif", _alignH = LEFT, _alighV = TOP) {

        push();
        if (_font != "sans-serif" && !_fLoaded) {
            _f = loadFont(_font, function () {
                textFont(_f);
                _fLoaded = true;
            })
        }
        else if (_font == "sans-serif") {
            _f = "sans-serif";
            textFont(_f);
        }


        textSize(_size);
        textAlign(_alignH, _alighV);
        text(_txt, _x, _y);
        pop();
    }

    /**
     * @method notify
     * @description returns true every nth second in draw function
     * @param {number} _on_every_nth_second Set notifier frequency. The input value needs to be in seconds.
     * @returns {boolean}
     * @see {@link saveCanvas} method for the example.
     * @example
     * if (utils.notify(10) == true) {
     *      // do something here.
     * }
     */
    p5.Utils.prototype.notify = function (_on_every_nth_second) {
        //print(millis() - _pt);
        if (millis() - _pt > _on_every_nth_second * 1000) {
            _pt = millis();

            return true;
        } else {
            return false;
        }
    }

    /**
     * @description Removes the ruler graphics from the canvas.
     * @method disableRuler
     * @see For example usage {@link enableRuler} page.
     */
    p5.Utils.prototype.disableRuler = function () {
        window.removeEventListener("mousemove", updateRulers);
        pxRulerHCanvas.style.display = "none";
        pxRulerVCanvas.style.display = "none";

        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginTop = 0 + "px";
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        rulerInfo.style.display = "none";

        rulerLineX.style.display = "none";
        rulerLineY.style.display = "none";

    }

    /**
     * @method enableRuler 
     * @description Ruler for newcomers to show pixel meter.
     * @see {@link disableRuler}
     * @example
     * // Define global variable and initialize p5.Utils lib
     * var utils = new p5.Utils();
     * 
     * function setup() {
     *      createCanvas(400,400);
     *      
     *      // No need to run in draw function
     *      // The function creates its canvases in a different drawing context
     *      utils.enableRuler();
     * }
     * 
     * function draw() {
     *      background(220);
     *      rect(width*0.5, height*0.5,500, 500);
     * }
     * 
     * function keyPressed() {
     *      if(key == 'h') {
     *          utils.disableRuler();
     *      }
     * }
     */
    p5.Utils.prototype.enableRuler = function () {
        //this.setRulerStyle();
        // Set canvas postion when the ruler activated
        // Fix to avoid overlow when the user creates the canvas within 
        // innerWidth or innerHeight.
        var canvas = document.getElementsByClassName("p5Canvas")[0];
        var nw = width;
        var nh = height;
        if (width + p5rulersize > innerWidth) {
            //canvas.width = width - p5rulersize;
            //canvas.style.width = width - p5rulersize + "px";
            nw = width - p5rulersize;
            resizeCanvas(nw, height);
            //parent.width = width - p5rulersize;
        }

        if (height + p5rulersize > innerHeight) {
            //canvas.height = height - p5rulersize;
            //canvas.style.height = height - p5rulersize + "px";
            //parent.height = height - p5rulersize;
            nh = height - p5rulersize;
            resizeCanvas(nw, nh);
        }

        canvas.style.marginLeft = p5rulersize + "px";
        canvas.style.marginTop = p5rulersize + "px";

        // Create an additional div on top of everything to display pixel ruler
        if (!document.getElementsByClassName("pixelRulerH")[0]) {
            pxRulerHCanvas = document.createElement('canvas');
            pxRulerHCanvas.className = 'pixelRulerH';
            document.body.appendChild(pxRulerHCanvas);
        }

        pxRulerHCanvas.width = (width + p5rulersize > innerWidth) ? width : width + p5rulersize;
        pxRulerHCanvas.height = p5rulersize;
        pxRulerHCanvas.style.zindex = 10000;
        pxRulerHCanvas.style.position = "absolute";
        pxRulerHCanvas.style.left = 0 + "px";
        pxRulerHCanvas.style.top = 0 + "px";
        pxRulerHCanvas.style.width = (width + p5rulersize > innerWidth) ? width : width + p5rulersize; + "px";
        pxRulerHCanvas.style.height = p5rulersize + "px";
        pxRulerHCanvas.style.display = "block";

        pxRulerHCtx = pxRulerHCanvas.getContext('2d');

        drawHorizontalRuler();

        if (!document.getElementsByClassName("pixelRulerV")[0]) {
            pxRulerVCanvas = document.createElement('canvas');
            pxRulerVCanvas.className = 'pixelRulerV';
            document.body.appendChild(pxRulerVCanvas);

        }
        pxRulerVCanvas.width = p5rulersize;
        pxRulerVCanvas.height = (height + p5rulersize > innerHeight) ? height : height + p5rulersize;
        pxRulerVCanvas.style.zindex = 10000;
        pxRulerVCanvas.style.position = "absolute";
        pxRulerVCanvas.style.left = 0 + "px";
        pxRulerVCanvas.style.top = 0 + "px";
        pxRulerVCanvas.style.width = p5rulersize + "px";
        pxRulerVCanvas.style.height = (height + p5rulersize > innerHeight) ? height : height + p5rulersize; + "px";
        pxRulerVCanvas.style.display = "block";

        pxRulerVCtx = pxRulerVCanvas.getContext('2d');

        drawVerticalRuler();

        if (!document.getElementsByClassName("rulerLineX")[0]) {
            rulerLineX = document.createElement('div');
            rulerLineX.className = "rulerLineX";
            document.body.appendChild(rulerLineX);
        }

        rulerLineX.style.zindex = 100000;
        rulerLineX.style.position = "absolute";
        rulerLineX.style.height = 0 + "px";
        rulerLineX.style.display = "block";
        //rulerLineX.style.background = "rgba(255,0,0,1.0)";
        rulerLineX.style.border = "none";
        rulerLineX.style.borderTop = 1 + "px dashed " + p5rulerInfoColor;
        rulerLineX.style.opacity = 0.7;


        if (!document.getElementsByClassName("rulerLineY")[0]) {
            rulerLineY = document.createElement('div');
            rulerLineY.className = "rulerLineY";
            document.body.appendChild(rulerLineY);
        }
        rulerLineY.style.zindex = 100001;
        rulerLineY.style.position = "absolute";
        rulerLineY.style.height = 0 + "px";
        rulerLineY.style.width = 0 + "px";
        rulerLineY.style.display = "block";
        rulerLineY.style.background = "rgba(255,255,255,0.2)";
        rulerLineY.style.border = "none";
        rulerLineY.style.borderRight = 1 + "px dashed " + p5rulerInfoColor;
        rulerLineY.style.opacity = 0.6;

        // Ruler info text
        if (!document.getElementsByClassName("rulerInfo")[0]) {
            rulerInfo = document.createElement('div');
            rulerInfo.className = "rulerInfo";
            document.body.appendChild(rulerInfo);
        }
        rulerInfo.style.zindex = 100002;
        rulerInfo.style.position = "absolute";
        rulerInfo.style.display = "block";
        rulerInfo.style.top = 0 + "px";
        rulerInfo.style.left = 0 + "px";
        rulerInfo.style.fontSize = 11 + "px";
        rulerInfo.style.fontFamily = "monospace";
        rulerInfo.style.color = p5rulerInfoColor;
        //rulerInfo.style.textShadow = "1px 1px 1px white";
        rulerInfo.style.background = p5rulerInfoBgColor;
        rulerInfo.style.padding = "3px";
        rulerInfo.style.cursor = "none";

        window.addEventListener("mousemove", updateRulers);
    }

    drawHorizontalRuler = function () {

        var ctx = pxRulerHCtx;

        ctx.clearRect(0, 0, pxRulerHCanvas.width, p5rulersize);
        ctx.fillStyle = p5rulerBgColor;
        ctx.fillRect(0, 0, pxRulerHCanvas.width, p5rulersize);

        ctx.strokeStyle = p5rulerTxtColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, p5rulersize);
        ctx.lineTo(pxRulerHCanvas.width, p5rulersize);
        ctx.stroke();

        for (var x = p5rulersize; x < pxRulerHCanvas.width; x += 5) {
            ctx.beginPath();
            ctx.moveTo(x - 0.5, p5rulersize);
            ctx.lineTo(x - 0.5, p5rulersize - 4);
            ctx.stroke();
        }

        for (var x = p5rulersize; x < pxRulerHCanvas.width; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x - 0.5, p5rulersize);
            ctx.lineTo(x - 0.5, p5rulersize - 7);
            ctx.stroke();
        }

        ctx.fillStyle = p5rulerTxtColor;
        ctx.font = p5rulerFont;
        ctx.textBaseline = "top";

        for (var x = p5rulersize; x < pxRulerHCanvas.width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x - 0.5, p5rulersize);
            ctx.lineTo(x - 0.5, 0);
            ctx.stroke();

            if (x > 0) {
                ctx.fillText(x.toFixed(0) - p5rulersize, x + 3, 1);
            }
        }
    }

    drawVerticalRuler = function () {
        var ctx = pxRulerVCtx;

        ctx.clearRect(0, 0, p5rulersize, pxRulerVCanvas.height);

        ctx.fillStyle = p5rulerBgColor;
        ctx.fillRect(0, 0, pxRulerVCanvas.width, pxRulerVCanvas.height);

        ctx.strokeStyle = p5rulerTxtColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p5rulersize, 0);
        ctx.lineTo(p5rulersize, pxRulerVCanvas.height);
        ctx.stroke();

        for (var y = p5rulersize; y < pxRulerVCanvas.height; y += 5) {
            ctx.beginPath();
            ctx.moveTo(p5rulersize, y - 0.5);
            ctx.lineTo(p5rulersize - 4, y - 0.5);
            ctx.stroke();
        }

        for (var y = p5rulersize; y < pxRulerVCanvas.height; y += 10) {
            ctx.beginPath();
            ctx.moveTo(p5rulersize, y - 0.5);
            ctx.lineTo(p5rulersize - 7, y - 0.5);
            ctx.stroke();
        }

        ctx.fillStyle = p5rulerTxtColor;
        ctx.font = p5rulerFont;
        ctx.textBaseline = "top";

        for (var y = p5rulersize; y < pxRulerVCanvas.height; y += 100) {
            ctx.beginPath();
            ctx.moveTo(p5rulersize, y - 0.5);
            ctx.lineTo(0, y - 0.5);
            ctx.stroke();

            if (y > p5rulersize) {
                ctx.save();
                ctx.translate(1, y);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText((y - p5rulersize).toFixed(0), 3, 1);
                ctx.restore();
            }
        }
    }

    function showMousePosition(x, y) {

        // Show horizontal and vertical dotted lines
        rulerLineX.style.width = x + "px";
        rulerLineX.style.marginright = width - x + "px";
        rulerLineX.style.left = p5rulersize + "px";
        rulerLineX.style.top = y - 4 + p5rulersize + "px";
        rulerLineX.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.7)";

        rulerLineY.style.height = y - 4 + "px";
        rulerLineY.style.width = x - 1 + p5rulersize + "px";
        rulerLineY.style.marginleft = x - 1 + "px";
        rulerLineY.style.top = p5rulersize + "px";
        rulerLineY.style.boxShadow = "0px 0px 5px rgba(0,0,0,0.7)";

        // Show ruler info text
        if (x + 70 < width) {
            rulerInfo.style.left = x + p5rulersize + 10 + "px";
        }

        if (y + 70 < height) {
            rulerInfo.style.top = y + p5rulersize + 20 + "px";
        }

        rulerInfo.innerHTML = "x:" + x + "<br>" + "y:" + (y - 3);
    }

    function updateRulers(event) {
        this.drawHorizontalRuler();

        if (pxRulerHCanvas != null) {

            let hRulerCanvasRect = pxRulerHCanvas.getBoundingClientRect();

            pxRulerHCtx.strokeStyle = p5rulerTickColor;
            pxRulerHCtx.beginPath();
            pxRulerHCtx.moveTo(event.pageX - hRulerCanvasRect.left - 0.5, 0);
            pxRulerHCtx.lineTo(event.pageX - hRulerCanvasRect.left - 0.5, p5rulersize);
            pxRulerHCtx.stroke();

            this.drawVerticalRuler();

            pxRulerVCtx.strokeStyle = p5rulerTickColor;
            pxRulerVCtx.beginPath();
            pxRulerVCtx.moveTo(0, event.pageY - 0.5 - 3);
            pxRulerVCtx.lineTo(p5rulersize, event.pageY - 0.5 - 3);
            pxRulerVCtx.stroke();

            showMousePosition(event.pageX - p5rulersize, event.pageY - p5rulersize);
        }
    }



}));

// Generate MD documenatation on Terminal
// jsdoc2md p5.utils.js > test.md
// 
// Generate html documentation on Terminal
/*
Usage:

# generate markdown docs for index.js and files it references
documentation build index.js -f md

# generate html docs for all files in src, and include links to source files in github
documentation build p5.utils.js -f html --github -o docs
documentation build p5.utils.js -f html -o docs

# document index.js, ignoring any files it requires or imports
documentation build index.js -f md --shallow

# validate JSDoc syntax in util.js
documentation lint util.js

# update the API section of README.md with docs from index.js
documentation readme index.js --section=API

# build docs for all values exported by index.js
documentation build --document-exported index.js

# build html docs for a TypeScript project
documentation build index.ts --parse-extension ts -f html -o docs

Commands:
  build [input..]   build documentation
  lint [input..]    check for common style and uniformity mistakes
  readme [input..]  inject documentation into your README.md

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
*/