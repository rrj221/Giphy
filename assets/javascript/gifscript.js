var apiKey = 'dc6zaTOxFJmzC'

var celebrities = ['Bill Murray', 'Jennifer Lawrence', 'Ricky Gervais', 'Adam Levine', 'Robert Downey Jr', 'Brad Pitt',
			'Bradley Cooper', 'Aziz Ansari', 'Conan OBrien', 'John Mayer', 'Chuck Norris', 'Charlie Scheen',
			'Will Ferrell', 'Leonardo DiCaprio', 'Amy Poehler', 'Paul Rudd', 'Johnny Depp', 'Kristen Wiig'];

//check to see if search query is already in array
//don't let them submit blank

function addButton(celebName) {
	$('<button>', {
		type: 'button',
		text: celebName,
		class: 'btn btn-primary celebButton',
		data: {celeb: celebName}
	}).appendTo($('#celebButtonsEl'));
};

for (i = 0; i < celebrities.length; i++) {
	addButton(celebrities[i]);
};

//ADD A NEW BUTTON
$('#celebForm').on('submit', function () {
	var celebToAdd = $('#celebInput').val();

	//error checking - blank or already has a button
	if (!celebToAdd) {
		alert("Please type something!");
		return;
	} else if (celebrities.indexOf(celebToAdd) !== -1) {
		alert("There's already a button for that!");
		return;
	} else {
		var celebToAdd = $('#celebInput').val();
		addButton(celebToAdd);
		celebrities.push(celebToAdd);
	}
});

//AJAX CALL
$('#celebButtonsEl').on('click', '.celebButton', function () {	
	var celebToSearch = $(this).data('celeb');
	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+celebToSearch+"&api_key="+apiKey+"&limit=10&rating=pg";

	$.ajax({url: queryURL, method: 'GET'}).done(function (response) {
		console.log(response);

		$('.gifsBigDiv').remove();
			
		var gifsBigDiv = $('<div>').attr('class', 'gifsBigDiv');

		for (i = 0; i < response.data.length; i++) {
			//display rating
			var rating = response.data[i].rating.toUpperCase(); 
			var ratingEl = $('<div>').attr('class', 'rating').text('Rating: '+rating);

			//display gif
			var alt = celebToSearch+" Image # "+(i + 1);
			var gif = response.data[i].images.fixed_height.url;
			console.log(gif);

			var still = response.data[i].images.fixed_height_still.url;
			var gifEl = $('<img>', {
							src: gif,
							alt: alt,
							class: 'gif', 
							data: {still: still, animation: gif, paused: false},
							// data: {animation: gif},
							// data: {paused: false}
						});

			var gifContainerEl = $('<div>').attr('class', 'gifContainer');

			ratingEl.appendTo(gifContainerEl);
			gifEl.appendTo(gifContainerEl);
			gifContainerEl.appendTo(gifsBigDiv);
		}

		//only paints to the DOM per say one time w00t
		$('#gifsForScreen').html(gifsBigDiv);
	});
});

$('.container-fluid').on('click', '.gif', function() {
	if (!$(this).data('paused')) {
		$(this).attr('src', $(this).data('still'));
		$(this).data('paused', true); 
	} else {
		$(this).attr('src', $(this).data('animation'));
		$(this).data('paused', false); 
	}	
});


// var gif = response.data[]


