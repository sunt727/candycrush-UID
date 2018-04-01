// Hand it in this way: for simpler testing, always use the same seed.
Math.seedrandom(0);

// constants
const DEFAULT_BOARD_SIZE = 8;
// set size from URL or to default
const size = Math.min(10, Math.max(3, Util.getURLParam("size") || DEFAULT_BOARD_SIZE));

var imagesizetext = ((((400-30)/size)-1)*0.9).toString() + "px";
// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

// data model at global scope for easier debugging
// initialize board model
var board = new Board(size);

// load a rule
var rules = new Rules(board);

var crushes = [];
var swap = [];

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
		board_generation();
		rules.prepareNewGame();
		focusToInput();
		
//		fillCandy();
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
//		if (evt.key==="ArrowUp"){move_fn("up")}
//		else if (evt.key==="ArrowDown"){
//			move_fn("down")
//									   }
//		else if (evt.key==="ArrowLeft"){move_fn("left")}
//		else if (evt.key==="ArrowRight"){move_fn("right")}
//		else if (evt.key==="Enter"){move_fn("right")}
//		
		if (evt.key==="ArrowUp"){move_fn("up")}
		else if (evt.key==="ArrowDown"){move_fn("down")}
		else if (evt.key==="ArrowLeft"){move_fn("left")}
		else if (evt.key==="ArrowRight"){move_fn("right")}
		else if (evt.key==="Enter"){CrushOnce_fn()}
		
	},

	// Click events arrive here
	"click": function(evt) {
		if (evt.target.id === "newgame_btn"){rules.prepareNewGame()}
		
		if (evt.target.id === "uparrow"){move_fn("up");}
		if (evt.target.id === "downarrow"){move_fn("down");}
		if (evt.target.id === "leftarrow"){move_fn("left");}
		if (evt.target.id === "rightarrow"){move_fn("right");}
		
		if (evt.target.id === "crushonce"){CrushOnce_fn()}
		
//		console.log(evt.target);
	}
 });

// document.getElementById("newgame_btn").addEventListener("click", plusnnn);

// Attaching events to the board
Util.events(board, {
	// add a candy to the board
	"add": function(e) {
		updatecell(e);
	},

	// move a candy from location 1 to location 2
	"move": function(e) {
//		console.log("move");
//		console.log(e);
		updatecell(e);
	},

	// remove a candy from the board
	"remove": function(e) {
		// Your code here
	},

	// update the score
	"scoreUpdate": function(e) {
		// Your code here. To be implemented in PS3.
	},
});
// generate a board in html
function board_generation(){
	var c = 0;
	var s = size+1;
	document.documentElement.style.setProperty("--rowNum", s);

	var cellsizetext = (((400-30)/size)-1).toString() + "px";
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
				}
				document.getElementById("container").appendChild(child);
			}
}

function updatecell(e){
	console.log(e.detail);
	var candy = e.detail.candy;
	var color = candy.color;
	var row = candy.row;
	var column = candy.col;
	console.log(""+row+column);
	var cell = document.getElementById(""+row+column);
	console.log(cell);

	var image = document.createElement("IMG");
	image.src = "graphics/" +color+ "-candy.png";
	image.style.width = imagesizetext;
	image.style.height = 'auto';

	if (cell.hasChildNodes()) 
	{
		cell.removeChild(cell.firstChild);
	}
	cell.appendChild(image);
}
//loads the candys
function fillCandy()
{
	
	for(var i = 0; i<board.square.length; i++){
		for (var j=0; j<board.square[i].length; j++) 
		{
			var candy = board.square[i][j];
			var color = candy.color;
			var row = candy.row.toString();
			var column = candy.col.toString();
			var cell = document.getElementById(row+column);

			var candyUrl = "graphics/" +color+ "-candy.png";
			var image = document.createElement("IMG");

			image.src = candyUrl;
			image.style.width = imagesizetext;
			image.style.height = 'auto';

			while (cell.firstChild) 
			{
    			cell.removeChild(cell.firstChild);
			}
			cell.appendChild(image);
		}
	}
}
//
//function newgame_fn(){
//	
//	rules.prepareNewGame();
//	
//	for(var i = 0; i<board.square.length; i++){
//		for (var j=0; j<board.square[i].length; j++) 
//		{
//			var candy = board.square[i][j];
//			var color = candy.color;
//			var row = candy.row.toString();
//			var column = candy.col.toString();
//			var cell = document.getElementById(row+column);
//			var candyUrl = "graphics/" +color+ "-candy.png";
//			var image = document.createElement("IMG");
//			image.tagName = "row+column" + "i";
//			image.src = candyUrl;
//			image.style.width = '24px';
//			image.style.height = 'auto';
//			while (cell.firstChild) 
//			{
//    			cell.removeChild(cell.firstChild);
//			}
//			cell.appendChild(image);
//		}
//	}
//}

function move_fn(dr){
	console.log(dr);
	var textboxoj = document.getElementById("display_txb");
	var textbox = textboxoj.value;
	var letters = "abcdefghijklmnopq";
	var i = letters.indexOf(textbox[0]);
	var j = textbox[1];
	var candy = board.square[j-1][i];
//	console.log(candy.color);
//	console.log(rules.isMoveTypeValid(candy, dr));
	
//	function updateimg(candy){
//		var color = candy.color;
//		var row = candy.row.toString();
//		var column = candy.col.toString();
//		var cell = document.getElementById(row+column);
//		var candyUrl = "graphics/" +color+ "-candy.png";
//		var image = document.createElement("IMG");
//		image.tagName = "row+column" + "i";
//		image.src = candyUrl;
//		image.style.width = '24px'
//		image.style.height = 'auto'
//		while (cell.firstChild) 
//		{
//			cell.removeChild(cell.firstChild);
//		}
//		cell.appendChild(image);
//	}
	if (rules.isMoveTypeValid(candy, dr))
	{
		var nextcandy = board.getCandyInDirection(candy, dr);
		crushes = rules.getCandiesToCrushGivenMove(candy, dr);
		swap = [candy, nextcandy];
		board.flipCandies(candy, nextcandy);
	}
	focusToInput();
	updateCrushBtn();
	disableArrowBtn();
}
//
//function alert1(){
//	alert ("Invalid Input");
//}

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
				
				btn.className = "buttonControl";
				btn.disabled = false;
				}
			else {
					var btnG = document.getElementById(drs[k] +"arrow");
					btn.className = "buttonControlGray";
					btn.disabled = true;
			}
			}
		}
	else {
		for (var m = 0; m<4;m++){
			var btnG = document.getElementById(drs[m] +"arrow");
			btnG.className = "buttonControlGray";
			btnG.disabled = true;
			}
	}

}

function CrushOnce_fn()
{
	var crush_btn = document.getElementById("crushonce");
	if (crushes){
		crush_btn.disabled = false;
		crush_btn.className = "buttonControl";

	}
	else {
		crush_btn.disabled = true;
		crush_btn.className = "buttonControlGray";
	}
	// console.log(swap);
	var crushes = rules.getCandyCrushes([swap]);
	console.log(crushes);
	rules.removeCrushes(crushes);
	rules.moveCandiesDown();
	fillCandy();
	
	// crushes = [];
	var crush_btn = document.getElementById("crushonce");
	if (crushes){
		crush_btn.disabled = false;
		crush_btn.className = "buttonControl";

	}
	else {
		crush_btn.disabled = true;
		crush_btn.className = "buttonControlGray";
	}
	focusToInput();
	
	
}

function focusToInput(){
	var textboxoj = document.getElementById("display_txb");
	textboxoj.value = "";
	textboxoj.focus();
}
function updateCrushBtn(){
	console.log(crushes);
	var crush_btn = document.getElementById("crushonce");
	if (crushes){
		crush_btn.disabled = false;
		crush_btn.className = "buttonControl";

	}
	else {
		crush_btn.disabled = true;
		crush_btn.className = "buttonControlGray";
	}
}
function disableArrowBtn(){
	for (var dr in ["up", "down", "left", "right"]){
		var btnG = document.getElementById(dr +"arrow");
		btnG.className = "buttonControlGray";
		btnG.disabled = "True";
	}
}
	
