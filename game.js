// Hand it in this way: for simpler testing, always use the same seed.
Math.seedrandom(0);

// constants
const DEFAULT_BOARD_SIZE = 8;
// set size from URL or to default
const size = Math.min(10, Math.max(3, Util.getURLParam("size") || DEFAULT_BOARD_SIZE));
// get board size
var board_size = document.documentElement.style.getPropertyValue('--boardsize');

// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// data model at global scope for easier debugging
// initialize board model
var board = new Board(size);

// load a rule
var rules = new Rules(board);

var crushes = [];
var swap = [];
var animating = [];
var fading = [];
var fadingOn = false;

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
		board_generation();
		rules.prepareNewGame();
		focusToInput();
		document.getElementById("display_txb").oninput = function() {testinput();};
		
		// Element refs
		dom.controlColumn = Util.one("#controls"); // example

		// Add events
//		Util.one("#newgame_btn").addEventListener("click", rules.prepareNewGame());
//		Util.one("#buttonIDhere").addEventListener("click", { /* Your code here */ }); // example
//		Util.one("").addEventListener("input /* Your code here */ }); // example
	},

	 // Keyboard events arrive here
	"keydown": function(evt) {
		console.log(evt.key);
		if (evt.key==="ArrowUp"){move_fn("up");stopAnimation();showHintLightOn("True");}
		else if (evt.key==="ArrowDown"){move_fn("down");stopAnimation();showHintLightOn("True");}
		else if (evt.key==="ArrowLeft"){move_fn("left");stopAnimation();showHintLightOn("True");}
		else if (evt.key==="ArrowRight"){move_fn("right");stopAnimation();showHintLightOn("True");}
		else if (evt.key==="Enter"){CrushOnce_fn();}
		
	},

	// Click events arrive here
	"click": function(evt) {
		if (evt.target.id === "newgame_btn"){
			rules.prepareNewGame();
			var pts = document.getElementById("points");
			var sb = document.getElementById("scoreboard");
			pts.textContent = 0;
			sb.style.background = "lightgrey";
			showHintLightOn("True");
			focusToInput();
			stopAnimation();
			showHintLightOn("True");
			fadingOn = false;
		}
		
		if (evt.target.id === "hint_btn"){stopAnimation();showhint();focusToInput();}
		
//		arrow buttons here
		if (evt.target.id === "uparrow"){move_fn("up");stopAnimation();showHintLightOn("True");}
		if (evt.target.id === "downarrow"){move_fn("down");stopAnimation();showHintLightOn("True");}
		if (evt.target.id === "leftarrow"){move_fn("left");stopAnimation();showHintLightOn("True");}
		if (evt.target.id === "rightarrow"){move_fn("right");stopAnimation();showHintLightOn("True");}
		
		if (evt.target.id === "crushonce"){CrushOnce_fn();}
	}
 });

// Attaching events to the board
Util.events(board, {
	// add a candy to the board
	"add": function(e) {
		updatecell(e);
	},

	// move a candy from location 1 to location 2
	"move": function(e) {
		flipcell(e);
	},

	// remove a candy from the board
	"remove": function(e) {
		var candy = e.detail.candy;
		var row = e.detail.fromRow;
		var column = e.detail.fromCol;

		var cell = document.getElementById("img"+row+column);

		cell.classList.add("fadeout");
		fading.push(cell);
		Util.afterAnimation(cell, "fadeout_animation").then(function(){cell.classList.remove("fadeout");fading.splice(fading.indexOf(cell), 1);});	
		crushes.splice(crushes.indexOf(candy), 1);
	},

	// update the score
	"scoreUpdate": function(e) {
		var pts = document.getElementById("points");
		var sb = document.getElementById("scoreboard");
		pts.textContent = e.detail.score;
		sb.style.background = e.detail.candy.color;
	},
});
// generate a board in html
function board_generation(){
	var c = 0;
	var s = size+1;
	document.documentElement.style.setProperty("--rowNum", s);
	

	var cellsizetext = (((board_size-30)/size)-1).toString() + "px";
	for (var i = 0; i < s**2; i++) {
				var child = document.createElement('div');
				child.className = "board-item";
				var childcell = document.createElement('div');
				childcell.className = "board-cell";
				var letters = "abcdefghijklmnopqrstuvwxyz";

				if(i===0){
					child.style.borderColor = "white";
				} else if (i<s) {
					child.style.borderColor = "white";
					childcell.textContent = letters[i-1];
					child.style.width=cellsizetext;
					child.appendChild(childcell);
				} else if (i%s === 0){
					childcell.textContent = i/(size + 1);
					child.style.borderColor = "white";
					child.style.height=cellsizetext;
					child.appendChild(childcell);
					c++;
				} else {
					// algorithm for x,y calcula
					var column = i%s-1;
					var row = Math.floor(i/s)-1;
					var xy = row.toString()+column.toString();

					childcell.setAttribute('id',xy);
					child.style.width=cellsizetext;
					child.style.height=cellsizetext;
					child.appendChild(childcell);
					
					var image = document.createElement('IMG');
					image.className = "candy-img";
					image.setAttribute('id',"img" + xy);
					image.style.width = "90%";
					image.style.height = 'auto';
					
					childcell.appendChild(image);
				}
				document.getElementById("container").appendChild(child);
			}
}
// add in function
function updatecell(e){
	var fromR = e.detail.fromRow;
	var fromC = e.detail.fromCol;
	var candy = e.detail.candy;
	var color = candy.color;
	var row = candy.row;
	var column = candy.col;
	var cell = document.getElementById("img"+row+column);
	//if fading out, waiting
	if (fadingOn===true && fading.length>0){Util.afterAnimation(fading[0], "fadeout_animation").then(function(){cell.src = "graphics/" +color+ "-candy.png";cell.classList.add("add_flip_down");});}
	//if not, go on
	else{cell.src = "graphics/" +color+ "-candy.png";cell.classList.add("add_flip_down");}
	
}
function flipcell(e){
	var fromR = e.detail.fromRow;
	var fromC = e.detail.fromCol;
	var candy = e.detail.candy;
	var color = candy.color;
	var row = candy.row;
	var column = candy.col;
	var cell = document.getElementById("img"+row+column);
	var del_r = fromR - row;
	var del_c = fromC - column;
	//if fading out, waiting
	if (fadingOn===true && fading.length>0){Util.afterAnimation(fading[0], "fadeout_animation").then(function(){cell.src = "graphics/" +color+ "-candy.png";if (fromR){
			
			if (del_r===-1){cell.classList.add("flip_down");} 
			else if (del_r===1){cell.classList.add("flip_up");} 
			else{
				if (del_c===-1){cell.classList.add("flip_right");} 
				else if (del_c===1){cell.classList.add("flip_left");} 
			}
		}
		else{cell.classList.add("add_flip_down");}});}
	//if not, go on
	else{cell.className="candy_img";console.log(fromR);cell.src = "graphics/" +color+ "-candy.png";if (fromR){
			if (del_r===-1){cell.classList.add("flip_down");} 
			else if (del_r===1){cell.classList.add("flip_up");} 
			else{
				if (del_c===-1){cell.classList.add("flip_right");} 
				else if (del_c===1){cell.classList.add("flip_left");} 
			}
		}
		else{cell.classList.add("add_flip_down");}}
			
}
// flip function
function move_fn(dr){
//	console.log(dr);
	var textboxoj = document.getElementById("display_txb");
	var textbox = textboxoj.value;
	var letters = "abcdefghijklmnopq";
	var i = letters.indexOf(textbox[0]);
	var j = textbox[1];
	var candy = board.square[j-1][i];

	if (rules.isMoveTypeValid(candy, dr))
	{
		var nextcandy = board.getCandyInDirection(candy, dr);
		crushes = rules.getCandiesToCrushGivenMove(candy, dr);
		swap = [candy, nextcandy];
		board.flipCandies(candy, nextcandy);
	}
	disableArrowBtn();
	updateCrushBtn();
	focusToInput();
}

function testinput(){
	var textboxoj = document.getElementById("display_txb");
	var text = textboxoj.value;
	var drs = ["up", "down", "left", "right"];
	var letters = "abcdefghijkl";
	var i = letters.indexOf(text[0]);
	var j = text[1];
	var candy = board.square[j-1][i];
	console.log(candy.color);
	if (text.length === 2)
		{
		for (var k = 0; k<4;k++){
			var btn = document.getElementById(drs[k] +"arrow");
			if (rules.isMoveTypeValid(candy, drs[k])){
				
				btn.style.background = "hsl(85, 90%, 37%)";
				btn.disabled = false;
				}
			else {
					var btnG = document.getElementById(drs[k] +"arrow");
					btn.style.background = "hsl(220, 10%, 85%)";
					btn.disabled = true;
			}
			}
		}
	else {
		for (var m = 0; m<4;m++){
			var btnG = document.getElementById(drs[m] +"arrow");
			btnG.style.background = "hsl(220, 10%, 85%)";
			btnG.disabled = true;
			}
	}

}

function showhint(){
//	stopAnimation();
	var result = rules.getRandomValidMove();
	var candy = result.candy;
	var dr = result.direction;
	if (dr.length>0){
		var crushable = rules.getCandiesToCrushGivenMove(candy, dr);
		
		for (var i in crushable){
			var ca = crushable[i];

			var cell = document.getElementById(""+ca.row+ca.col);
			
			console.log(cell);
			cell.className = "pulse";
			animating.push(cell);
		}
		showHintLightOn("True");
	}
	else{
		showHintLightOn("False");
	}
}
// stop pulsing
function stopAnimation(){
	console.log(animating);
	for (var a in animating){
		var cell = animating[a];
		cell.className = "";
	}
	
}

function CrushOnce_fn()
{
	// console.log(swap);
	fadingOn = true;
	var crushes = rules.getCandyCrushes([swap]);
	rules.removeCrushes(crushes);
	rules.moveCandiesDown()
//	console.log("crushing");
	updateCrushBtn();
	focusToInput();
	
	
}
//turn show hint on
function showHintLightOn(show){
	var SHbtn = document.getElementById("hint_btn");
	if (show==="True"){
		SHbtn.style.background = "rebeccapurple";
		SHbtn.disabled = false;
	}
	else {
		SHbtn.style.background = "hsl(220, 10%, 85%)";
		SHbtn.disabled = true;
	}
	
}
function focusToInput(){
	var textboxoj = document.getElementById("display_txb");
	textboxoj.value = "";
	textboxoj.focus();
}
function updateCrushBtn(){
	
	var crushes = rules.getCandyCrushes([swap]);
	console.log(crushes);
	var crush_btn = document.getElementById("crushonce");
	if (crushes.length>0){
		crush_btn.disabled = false;
		crush_btn.style.background = "hsl(85, 90%, 37%)";

	}
	else {
		crush_btn.disabled = true;
		crush_btn.style.background = "hsl(220, 10%, 85%)";
	}
}
function disableArrowBtn(){
	var directions = ["up", "down", "left", "right"];
	for (var direction in directions){
		var btnG = document.getElementById(directions[direction] +"arrow");
		btnG.style.background = "hsl(220, 10%, 85%)";
		btnG.disabled = true;
	}
}
	
