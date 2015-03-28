/* jshint devel:true */
'use strict';
var container = document.getElementById('container');
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
var columns = 5;
var row = 0;
var totalArea = 0;
var docfrag = document.createDocumentFragment();
var remainder, filler = 0;
var grid = [];
//add inner content for height hack
for (var i = 0; i < tilesLength; i++) {
	// var regexp = tiles[i].match(/class=\"tile (.*?)\" <\/div>"/g);
	var size, area;
	typeof tiles[i].classList[1] === "string" ? size = tiles[i].classList[1] :
		size = "basic";
	//console.log(size);
	area = tileSizes[size][0] * tileSizes[size][1];
	//console.log(area);

	totalArea += area;
	tiles[i].innerHTML = '<div class=\'content\'></div>';
	tileCopy.push([tiles[i].outerHTML, size]);
}
console.log(totalArea);


remainder = totalArea % columns;
console.log("r: " + remainder)

if (remainder !== 0) {
	filler = columns * 2 - remainder;
}
totalTiles += filler;
// for (var i = 0; i < tilesLength; i++) {
// 	tileCopy.push(tiles[i].outerHTML);
// }
console.log(tileCopy);


for (var i = tilesLength; i < totalTiles; i++) {
	var size = tileSizes['filler'][0] * tileSizes['filler'][1];
	tileCopy.push(['<div class="tile filler"><div class="content"></div></div>',
		size
	]);
}

var rows = totalTiles / columns;
for (var i = 1; i <= rows; i++) {
	var gridRow = [];
	for (var j = 1; j <= columns; j++) {
		gridRow.push(0);
	}
	grid.push(gridRow);
}
while (container.hasChildNodes()) {
	container.removeChild(container.lastChild);
}

function Shuffle(o) {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i],
		o[i] = o[j], o[j] = x);
	return o;
};
Shuffle(tileCopy);
console.log(tileCopy);
for (var i = 0; i < tilesLength; i++) {
	var div = document.createElement('div');
	var size = tileCopy[i][1];
	div.innerHTML = tileCopy[i][0];
	var insert = div.firstChild;
	checkGrid(size);
	insert.style.top = Math.random() * document.body.clientHeight + 'px';
	insert.style.left = Math.random() * document.body.clientWidth + 'px';
	docfrag.appendChild(insert);
}

function checkGrid(size) {
	console.log('checking');
}



container.appendChild(docfrag);
