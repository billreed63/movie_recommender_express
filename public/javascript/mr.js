/**
 * http://usejsdoc.org/
 */
function init() {

var element = document.getElementById("stars");
	element.innerHTML = "Enter title of movie you would like to rate: ";
	var input = document.createElement("input");
	input.type = "text";
	input.id = "moviesearch";
	input.onchange = movieSearch;
	element.appendChild(input);
	var movieSearchResults = document.createElement("div");
	movieSearchResults.id = "movieSearchResults"
	element.appendChild(movieSearchResults);

}


function restService (type, req, callback) {
    /* the AJAX request... */
    var oAjaxReq = new XMLHttpRequest();
    var url = "/"+req;
   // oAjaxReq.submittedData = oData;
    oAjaxReq.onload = function(e) {
    	var r = JSON.parse(e.target.response);
    	callback(r);
	};

      oAjaxReq.open(type, url);
      oAjaxReq.send(null);

	
     

  }

function movieSearch(e) {
	restService('get', "movieID?movie="+e.target.value, function(results){
		console.log(results);
		var movieSearchResults = document.getElementById("movieSearchResults");
		results.forEach(function(movie) {
			var div = document.createElement("div");
			div.id = movie.id;
			movieSearchResults.appendChild(div);
			var title = document.createElement("div");
			title.textContent = movie.title;
			div.appendChild(title);
			div.appendChild(createRatingWidget(movie));
		});
	});
}

function createRatingWidget(movie){
	var div = document.createElement("div");
	div.id = "ratingWidget" + movie.id;
	div.classList.add('acidjs-rating-stars');
	var form = document.createElement("form");
	form.id = "starForm" + movie.id;
	form.setAttribute("mr-id", movie.id);
	form.onchange = function(e) {
		var form = e.target.form;
		var movieID = form.getAttribute('mr-id');
		var value;
		for (var i = 0; i < form.elements.length; i++) {
			if (form.elements[i].type === 'radio' && form.elements[i].checked) {
				// get value, set checked flag or do whatever you need to
				value = form.elements[i].value;       
			}
		}
		restService("post", "rateMovie?id="+movieID+"&rating="+value, function(result){
			// FIXME refresh the top25 recomendations div
		});
	};
	div.appendChild(form);
	for (var i = 0; i < 10; i++) {
		var groupId = "group-"+movie.id;
		var input = document.createElement("input");
		input.id = groupId+"-"+i
		input.type = 'radio';
		input.name = 'groupId';
		input.value = 10 - i;
		form.appendChild(input);
		var label = document.createElement("label");
		label.setAttribute('for', groupId+"-"+i);
		form.appendChild(label);
	}
    return div;
 
}
