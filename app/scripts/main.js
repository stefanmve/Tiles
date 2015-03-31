/* jshint devel:true */
'use strict';

var container = document.getElementById('container');
var winWidth = window.innerWidth - getScrollerWidth();

// var winWidth = container.getBoundingClientRect();
//console.log(winWidth.width)
var tiles = document.getElementsByClassName('tile');
var tileCopy = [];
var tilesLength = tiles.length;
var totalTiles = tilesLength;
var tileSizes = {
	basic: [1, 1],
	filler: [1, 1],
	tall: [1, 2],
	wide: [2, 1]
};
var col = 5;
var unit = winWidth / col;
var totalArea = 0;
var docfrag = document.createDocumentFragment();
var remainder, filler = 0;

Array.prototype.shuffle = function() {
	var input = this;

	for (var i = input.length - 1; i >= 0; i--) {

		var randomIndex = Math.floor(Math.random() * (i + 1));
		var itemAtIndex = input[randomIndex];

		input[randomIndex] = input[i];
		input[i] = itemAtIndex;
	}
	return input;
};

//add inner content for height hack
for (var i = 0; i < tilesLength; i++) {
	// var regexp = tiles[i].match(/class=\'tile (.*?)\' <\/div>'/g);
	var size, area;
	if (typeof tiles[i].classList[1] === 'string') {
		size = tiles[i].classList[1];
	} else {
		size = 'basic';
	}

	//console.log(size);
	area = tileSizes[size][0] * tileSizes[size][1];
	//console.log(area);

	totalArea += area;
	tiles[i].innerHTML = '<div class=\'content\'>' + tiles[i].innerHTML + '</div>';
	tileCopy.push([tiles[i].outerHTML, size]);
}
//console.log('totalArea: ' + totalArea);
//console.log('tileCopy: ' + tileCopy);


remainder = totalArea % col;
//console.log('r: ' + remainder);

if (remainder !== 0) {
	filler = col * 2 - remainder;
}
totalTiles += filler;
//console.log('f: ' + filler);
//console.log('totalTiles: ' + totalTiles);

for (var i = tilesLength; i < totalTiles; i++) {
	var size = 'filler';
	var area = tileSizes[size][0] * tileSizes[size][1];
	tileCopy.push(['<div class=\'tile filler\'><div class=\'content\'></div></div>',size]);
	totalArea += area;
}
//console.log('totalArea ' + totalArea);
var rows = totalArea / col;

while (container.hasChildNodes()) {
	container.removeChild(container.lastChild);
}

// Shuffle(tileCopy);
//console.log(tileCopy);
tileCopy.shuffle();
var griddy = new Grid(col, rows);
griddy.init();
var last = 0;
var nextXCoord = 0;
var nextYCoord = 0;
for (var i = 0; i < tileCopy.length; i++) {
	//console.log(i + 1 + " of " + tileCopy.length);
	var div = document.createElement('div');
	var size = tileCopy[i][1];
	//console.log(size);
	var unitWidth = winWidth / col;
	div.innerHTML = tileCopy[i][0];
	var insert = div.firstChild;
	if (size !== 'filler') {
		var coords = griddy.find(insert, size);
		//console.log(coords);
		docfrag.appendChild(insert);
		//position(insert, coords[x], coords[y]);
		insert.setAttribute('style', 'left:' + coords['x'] * unitWidth + 'px; top:' + coords['y'] * unitWidth +
		'px;');
	}
	
	
	
	// if (nextXCoord >= winWidth) {
	// 	nextYCoord = winWidth / col;
	// 	nextXCoord = 0;
	// }
}




for (var i = 0; i < tileCopy.length; i++) {
	//console.log(i + 1 + " of " + tileCopy.length);
	var div = document.createElement('div');
	var size = tileCopy[i][1];
	//console.log(size);
	var unitWidth = winWidth / col;
	div.innerHTML = tileCopy[i][0];
	var insert = div.firstChild;
	if (size === 'filler') {
		var coords = griddy.find(insert, size);
		//console.log(coords);
		docfrag.appendChild(insert);
		//position(insert, coords[x], coords[y]);
		insert.setAttribute('style', 'left:' + coords['x'] * unitWidth + 'px; top:' + coords['y'] * unitWidth +
		'px;');
	}



	// if (nextXCoord >= winWidth) {
	// 	nextYCoord = winWidth / col;
	// 	nextXCoord = 0;
	// }
}

container.appendChild(docfrag);
container.removeAttribute("class");

function position(obj, coordx, coordy) {
	obj.setAttribute('style', 'left:' + coordx * unitWidth + 'px; top:' + coordy * unitWidth +
	'px;');
}


function Grid(col, rows) {
		this.col = col;
		this.rows = rows;
		//this.cells = new Array(col * rows);
		this.grid = [];
		this.init = function() {
			//var gridRow = new Array(rows * col);
			for (var i = 1; i <= rows * col; i++) {
				//var gridRow = [];
				//for (var j = 1; j <= col; j++) {
					this.grid.push(0);
				//}
				//this.grid.push(0);
			
			}
		};
		
		this.find = function(obj, size) {
			//console.log('finding: ' + size);
			var dimensions = tileSizes[size];
			
			if (dimensions[0] === 1 && dimensions[1] === 1) {
				for (var i=0; i < col*rows; i++) {
					if (this.grid[i] === 0) {
						this.grid[i] = size;
						return this.place(i);
					}	
				}
			}
			if (dimensions[0] === 2 && dimensions[1] === 1) {
				for (var i=0; i < col*rows; i++) {
					if (this.grid[i] === 0 && this.grid[i+1] === 0 && (i + 1)%col !== 0) {
						this.grid[i] = size;
						this.grid[i+1] = size;
						return this.place(i);
					}	
				}
			}
			if (dimensions[0] === 1 && dimensions[1] === 2) {
				for (var i=0; i < (col*rows)+ col; i++) {
					//console.log('i: ' + i);
					if (this.grid[i] === 0 && this.grid[i+col] === 0) {
						this.grid[i] = size;
						this.grid[i+col] = size;
						return this.place(i);
					} 	
				}
			}
			

		};

		this.place = function(input) {
			if (input === 0) {
				var y = 0;
				var x = 0;
			} else if (input%col === 0) {
				var y = Math.ceil(input/col);
				var x = input%col;
			} else {
				var y = Math.ceil(input/col)-1;
				var x = input%col;
			}
			//console.log('x: ' + x + ', y: ' + y + ', index: ' + input);
			return {x: x, y:y, index:input};
		};
	}
	
	function getScrollerWidth() {
		var scr = null;
		var inn = null;
		var wNoScroll = 0;
		var wScroll = 0;
	
		// Outer scrolling div
		scr = document.createElement('div');
		scr.style.position = 'absolute';
		scr.style.top = '-1000px';
		scr.style.left = '-1000px';
		scr.style.width = '100px';
		scr.style.height = '50px';
		// Start with no scrollbar
		scr.style.overflow = 'hidden';
	
		// Inner content div
		inn = document.createElement('div');
		inn.style.width = '100%';
		inn.style.height = '200px';
	
		// Put the inner div in the scrolling div
		scr.appendChild(inn);
		// Append the scrolling div to the doc
		document.body.appendChild(scr);
	
		// Width of the inner div sans scrollbar
		wNoScroll = inn.offsetWidth;
		// Add the scrollbar
		scr.style.overflow = 'auto';
		// Width of the inner div width scrollbar
		wScroll = inn.offsetWidth;
	
		// Remove the scrolling div from the doc
		document.body.removeChild(
			document.body.lastChild);
	
		// Pixel width of the scroller
		return (wNoScroll - wScroll);
	}