// JavaScript Document
function generate_table(n) {
  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];
 
  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
	var cellList = [];
 
  // creating all cells
  for (var i = 0; i < n; i++) {
    // creates a table row
    var row = document.createElement("tr");
 
    for (var j = 0; j < n; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createElement("cell");
	  cellList.push(cellText);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
 
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }
 
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  //tbl.setAttribute("border", "1 px solid silver");
  tbl.setAttribute("width", "400px");
  tbl.setAttribute("height", "400px");
  tbl.setAttribute("float", "left");
	return cellList;
}