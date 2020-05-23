
// this will affect the entire app!!
// var dbUrl = 'http://bkot:bk050488@10.0.0.129:5984/';
// var dbUrl = 'http://bkot:bk050488@localhost:5984/';

// remote bobby's db server
var dbUrl = 'http://bkot:app2018@101.176.9.187:5984/';

// load header
(function () {
  $("head").append('<title>Richard\'s App</title>');
  $("head").append('<meta charset="utf-8">');
  $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1">');
  // $("head").append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
}) ();

// load menu
(function () {
  $("#navMenu").addClass('navbar navbar-default');
  $("#navMenu").append('<div class="container-fluid">');
  $("#navMenu").append('<ul class="nav navbar-nav" id="menuItems">');
  $("#navMenu").append('</ul>');
  $("#navMenu").append('</div>');
  // menu items go here
  $("#menuItems").append('<li id="index"><a href="index.html">Home</a></li>');
  $("#menuItems").append('<li id="investors"><a href="investors.html">Investors</a></li>');
  $("#menuItems").append('<li id="managers"><a href="managers.html">Managers</a></li>');
  $("#menuItems").append('<li id="borrowers"><a href="borrowers.html">Borrowers</a></li>');
  $("#menuItems").append('<li id="deals"><a href="deals.html">Deals</a></li>');
  $("#menuItems").append('<li id="transactions"><a href="transactions.html">Transactions</a></li>');
  $("#menuItems").append('<li id="calculator"><a href="calculator.html">Calculator</a></li>');
  // find the active html page and set the corresponding menu item as active
  var activeItem = document.location.href.split('/').slice(-1)[0].replace('.html', '');
  // console.log(activeItem);
  $('#' + activeItem).addClass('active');
}) ();

// style all labels
(function () {
  $("label").addClass('control-label col-sm-2');
  $("input").addClass('form-control');
}) ();

function insertFormInput(label, inputId, placeHolder) {
	document.write("<div class=\"form-group\">");
	document.write("<label class=\"control-label col-sm-2\">"+label+":</label>");
	document.write("<div class=\"col-sm-10\">");
	document.write("<input class=\"form-control\" id=\""+inputId +"\" placeholder=\""+placeHolder+"\">");
	document.write("</div>");
	document.write("</div>");
}

function getElementVal(elementId) {
	return document.getElementById(elementId).value
}

function insertIntoDb(db, inputFields, keyField) {
  // db.post({"something":"happened"});
  // var investorName = document.getElementById("investorName").value;
  var doc = {
    "_id": getElementVal(keyField),
  }
  for (var i = inputFields.length - 1; i >= 0; i--) {
    doc[inputFields[i]] = getElementVal(inputFields[i]);
  }
  db.put(doc).then(function (response) {
    console.log(response);
    alert(JSON.stringify(response));
  }).catch(function (err) {
    console.log(err);
    alert(JSON.stringify(err));
  });
}

function insertSelectOptions(db, tagId) {
  console.log('insertSelectOptions()...');
  db.allDocs({
    include_docs: false,
    attachments: true
  }).then(function (result) {
    var rows = result.rows;
    // console.log(rows);
    $('#' + tagId).empty();
    $('#' + tagId).append('<option disabled selected value>Select an Option</option>')
    for (var i = 0; i < rows.length; i++) {
      // console.log(rows[i].id);
      $('#' + tagId).append('<option>' + rows[i].id + '</option>')
    }
    // $('#selectInvestors').append('<option>'+inv+'</option>');
  }).catch(function (err) {
    console.log(err);
  });
}

function daysBetweenDates(dateA, dateB) {
  var oneDay = 24*60*60*1000;
  return Math.round(Math.abs((dateA.getTime() - dateB.getTime())/(oneDay)));
}

var Table = function (headerId, bodyId) {
  this.headerId = headerId;
  this.bodyId = bodyId;
  $('#' + this.headerId).empty();
  $('#' + this.bodyId).empty();
}

Table.prototype.addHeader = function (array) {
  var content = '';
  content += '<tr>';
  for (var i = 0; i < array.length; i++) {
    content += '<th>' + array[i] + '</th>';
  }
  content += '</tr>';
  $('#'+this.headerId).append(content);
}

Table.prototype.addRow = function (array) {
  var content = '';
  content += '<tr>';
  for (var i = 0; i < array.length; i++) {
    var text = '';
    var id = '';
    var row = '';
    if (array[i] && array[i].text) text = array[i].text;
    else text = array[i];
    row = '<td>' + text + '</td>';
    if (array[i] && array[i].id) {
      id = array[i].id;
      row = '<td id="' + id + '">' + text + '</td>';
    }
    content += row;
  }
  content += '</tr>';
  $('#'+this.bodyId).append(content);
}

function startOfMonthRange(dateFrom, dateTo) {
  var result = [];
  var startYear = dateFrom.getFullYear();
  var endYear = dateTo.getFullYear();
  var month = dateFrom.getMonth();
  for (var year = startYear; year <= endYear; year++) {
    // console.log(year);
    month += 1;
    var curDate = new Date(year, month, 1);
    while (curDate < dateTo) {
      // console.log(curDate);
      result.push(curDate);
      month += 1;
      curDate = new Date(year, month, 1);
    }
  }
  return result;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
