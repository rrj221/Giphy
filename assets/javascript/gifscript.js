var apiKey = 'dc6zaTOxFJmzC';

var celebrities = ['Bill Murray', 'Jennifer Lawrence', 'Ricky Gervais', 'Adam Levine', 'Robert Downey Jr', 'Brad Pitt',
			'Bradley Cooper', 'Aziz Ansari', 'Conan OBrien', 'John Mayer', 'Chuck Norris', 'Charlie Scheen',
			'Will Ferrell', 'Leonardo DiCaprio', 'Amy Poehler', 'Paul Rudd', 'Johnny Depp', 'Kristen Wiig'];

function addCeleb(celebName) {
	var celebritiesNew = JSON.parse(localStorage.getItem("celebsLocal"));
	celebritiesNew.push(celebName);
	localStorage.setItem("celebsLocal", JSON.stringify(celebritiesNew));	
};

function checkForLocalArray(arrayName) {
	var celebs = JSON.parse(localStorage.getItem(arrayName));
	if (!celebs) {
		return false;
	} else {
		return true;
	}
};

//adds all buttons at once
function addButtons() {
	//checks if there is already an array of celebs saved locally
	if(!checkForLocalArray('celebsLocal')) {
		localStorage.setItem('celebsLocal', JSON.stringify(celebrities));
	}
	
	var buttonContainer = $('<div>', {class: 'buttonContainer'});
	var celebs = JSON.parse(localStorage.getItem("celebsLocal"));
	for (var i = 0; i < celebs.length; i++) {
		var fullButton = $('<div>',
			{class: 'fullButton',
			'data-celebindex': i, 
			'data-celebname': celebs[i]
		});

		var celebButton = $('<button>', {	
			type: 'button',
			text: celebs[i],
			class: 'btn btn-primary celebButton',
			data: {celeb: celebs[i]}
		});

		var celebX = $('<button>', {
			type: 'button',
			text: 'X',
			class: 'checkbox',
			'data-celebindex': i, 
			'data-celebname': celebs[i]			
		});

		celebButton.appendTo(fullButton);
		celebX.appendTo(fullButton);
		fullButton.appendTo(buttonContainer);
	}	
	($('#celebButtonsEl')).html(buttonContainer);
};	

function deleteButton (celebIndex) {
	var celebs = JSON.parse(localStorage.getItem('celebsLocal'));
	celebs.splice(celebIndex, 1);
	localStorage.setItem('celebsLocal',JSON.stringify(celebs));
	addButtons();
}; 

//initial display of buttons on screen
addButtons();

//ADD A NEW BUTTON
$('#celebForm').on('submit', function () {
	var celebToAdd = $('#celebInput').val();
	var celebs = JSON.parse(localStorage.getItem('celebsLocal'));

	//error checking - blank or already has a button
	if (!celebToAdd) {
		alert("Please type something!");
		return;
	} else if (celebs.indexOf(celebToAdd) !== -1) {
		alert("There's already a button for that!");
		return;
	} else {
		addCeleb(celebToAdd);
		addButtons();
	}
	$('#celebInput').val('');
});

//DELETE A BUTTON
$('#celebButtonsEl').on('click', '.checkbox', function() {
	deleteButton($(this).data('celebindex'));
});

//AJAX CALL
$('#celebButtonsEl').on('click', '.celebButton', function () {	
	var celebToSearch = $(this).data('celeb');
	var queryURL = "http://api.giphy.com/v1/gifs/search?q="+celebToSearch+"&api_key="+apiKey+"&limit=10&rating=pg";

	$.ajax({url: queryURL, method: 'GET'}).done(function (response) {
		$('.gifsBigDiv').remove();
		var gifsBigDiv = $('<div>').attr('class', 'gifsBigDiv');

		//loops through response and displays gifs
		for (i = 0; i < response.data.length; i++) {
			//display rating
			var rating = response.data[i].rating.toUpperCase(); 
			var ratingEl = $('<div>').attr('class', 'rating').text('Rating: '+rating);

			//display gif
			var alt = celebToSearch+" Image # "+(i + 1);
			var gif = response.data[i].images.fixed_height.url;

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
		//only paints to the DOM par say one time w00t
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





