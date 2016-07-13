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
	movieSearchResults.id = "movieSearchResults";
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
    // As per DF reset results with each new search instead of appending
    resetSearchResults("stars", "movieSearchResults");
    document.getElementById("top25").innerHTML = "";
	restService('get', "movieID?movie="+e.target.value, function(results){
		console.log(results);
		var movieSearchResults = document.getElementById("movieSearchResults");
		results.forEach(function(movie) {
			var div = document.createElement("div");
			div.id = movie.id;
			movieSearchResults.appendChild(div);
			var title = document.createElement("div");
            // Seems our dataset has weird leading double quotes - as per DF cleanup before display
			title.textContent = movie.title.replace(/^\"/, "");
			div.appendChild(title);
			div.appendChild(createRatingWidget(movie));
		});
	});
}

function resetSearchResults(parentId, childId) {
    var parent = document.getElementById(parentId);
    var oldResults = document.getElementById(childId);
    var newResults = document.createElement("div");
    newResults.id = childId;
    parent.replaceChild(newResults, oldResults);
}

function createRatingWidget(movie){
	var div = document.createElement("div");
	div.id = "ratingWidget" + movie.id;
	div.classList.add('acidjs-rating-stars');
	var form = document.createElement("form");
	form.id = "starForm" + movie.id;
	form.setAttribute("mr-id", movie.id);
	form.onclick = function(e) {
		if (e.target.tagName == 'INPUT') {
			var form = e.target.form;
			form.parentNode.classList.remove('predicted');
			var movieID = form.getAttribute('mr-id');
			e.target.setAttribute('checked', true);
			restService("post", "rateMovie?id="+movieID+"&rating="+e.target.value, function(result){
            	createTop25Widget(result);
			});
		}
	};
	div.appendChild(form);
	for (var i = 0; i < 10; i++) {
		var groupId = "group-"+movie.id;
		var input = document.createElement("input");
		input.id = groupId+"-"+i
		input.type = 'radio';
		input.name = 'groupId';
		if (movie.rating && (parseInt(movie.rating) == (10 - i))) {
			input.setAttribute('checked', true);
			div.classList.add('predicted');
		}
		input.value = 10 - i;
		form.appendChild(input);
		var label = document.createElement("label");
		label.setAttribute('for', groupId+"-"+i);
		form.appendChild(label);
	}
    return div;
 
}

function createTop25Widget(top25) {
    top25 = top25 && top25.length ? top25 : [];
    var top25Div = document.getElementById("top25");
    // replace any previous results with new ones
    top25Div.innerHTML = "Based on your last rating may we also suggest these movies for you: ";
    var top25DivResults = document.createElement("div");
    top25DivResults.id = "top25Results";
    top25Div.appendChild(top25DivResults);
    top25.forEach(function(movie, i){
        if (i < 10) {
            var div = document.createElement("div");
            div.id = "mov_"+movie.id;
            // Seems our dataset has weird leading double quotes - as per DF cleanup before display 
            var text = document.createTextNode(movie.title.replace(/^\"/, ""));
            div.appendChild(text);
            top25DivResults.appendChild(div);
            var ratingWidget = createRatingWidget(movie);
            div.appendChild(ratingWidget);
        } else {
            return;
        }
    });
}
