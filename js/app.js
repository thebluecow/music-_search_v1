(function () {
	
	function searchSpotify() {
		let searchText = $('#search').val(); 
		
		// Request data from the Spotify API to display album information
		if (searchText !== '') {
			
			// format search string. replace space with +
			searchText.replace(' ', '+');
			
			// make Ajax call to spotify to return album info
			$.ajax({
			url: 'https://api.spotify.com/v1/search',
			data: {
				q: searchText,
				type: 'album'
			},
			success: function (response) {
				// build the album list with the response
				buildList(response.albums.items, searchText);
			}
		});
			
			
		}
	};
	
	// builds out the list of all albums
	function buildList(albums, searchText) {
		
		let albumHTML = '';
		let albumId = 'https://api.spotify.com/v1/albums/';
		
		// For each album returned, render an <li> displaying these items inside:
		// Album title
		// Album art image
		// Render an <img> that displays the 640px x 640px album art image via the src attribute
		if (albums.length > 0) {
			$.each(albums, function(i, album) {
				albumHTML += '<li><div class="album-wrap">';
				// Wrap the album art image -- or everything in the <li> -- in a <a> tag that links an album to its spotify.com listing
				albumHTML += '<a class="spotify" href="' + album.external_urls.spotify + '" target="_blank">';
				albumHTML += '<img class="album-art" src="' + album.images[0]['url'] + '"></a>';
				// add text to display over image as a clue as to what happens next
				albumHTML += '<span class="text-content">Listen on Spotify!</span></div>';
				albumHTML += '<span class="album-title">' + album.name + '</span>';
				albumHTML += '<span class="album-artist">' + album.artists[0].name + '</span>';
				// add record icon to display track info
				albumHTML += '<img src="images/record.svg" class="album-info">';
				albumHTML += '<span hidden>' + album.id + '</span>';
				albumHTML += '</li>';
			});
		} else {
			// If the search returns no album data, display the text "No albums found that match: 'title'."
			albumHTML += '<li class="no-albums desc">';
            albumHTML += '<i class="material-icons icon-help">help_outline</i>No albums found that match: ' + searchText + '.</li>';
		}
		
		albumHTML += '</ul>';
		
		$('#albums').html(albumHTML);
		
		// add action if record is clicked
		$('img.album-info').click(getAlbumInfo);
		
	};
	
	// returns information for a specific record
	function getAlbumInfo() {
		let albumId = $(this).next().text();
		
		// make Ajax call to spotify to return album info with specific id
		$.ajax({
			url: 'https://api.spotify.com/v1/albums/' + albumId,
			success: function (response) {
				buildAlbumDisplay(response);
			}
		});
	}
	
	// build the display to display an album and tracks
	function buildAlbumDisplay(album) {
		let albumHTML = '<div class="album-header">';
		// give clue if there are multiple discs for this album
		let discNumber = 1;
		// verify that the json object has items in it
		if (album.tracks.items.length > 0) {
			albumHTML += '<a class="search-result" id="search-result" href="#">< Search results</a>';
			albumHTML += '<img class="album-art track-art" src="' + album.images[0]['url'] + '"></a></div>';
			albumHTML += '<div class="album-track-content">';
			albumHTML += '<h2>' + album.name + ' (' + album.release_date + ')</h2>';
			albumHTML += '<p class="search-result">' + album.artists[0].name + '</p>';
			albumHTML += '<div class="tracks"><p class="track-list">track list:</p>';
			albumHTML += '<ul>';

			// build out each track info
			$.each(album.tracks.items, function(i, track) {
				// if there's a second disc, display the disc info
				if (track.disc_number > discNumber) {
					discNumber = track.disc_number;
					albumHTML += '<p class="tracks">Disc ' + discNumber + '</p>';
				}
				albumHTML += '<li>' + track.track_number + '. ' + track.name + '</li>';
			});
		
			albumHTML += '</ul></div></div>';
		} else {
			// if for some reason there is no data, display an error
			albumHTML += '<ul><li class="no-albums desc">There must be an issue. We can\'t find any tracks!</li></ul>';
		}
		
		albumHTML += '</div>';
		
		// need to add content and hide and show divs
		$('.album-content').html(albumHTML);
		$('.album-content').show();
		$('.main-content').hide();
		
		// if there are multiple discs, display Disc 1
		if (discNumber > 1) {
			$('.album-content ul').prepend('<p class="tracks">Disc 1</p>');
		}
		
		// show the track info and hide the main content
		$('a#search-result').click(function(){
			$('.album-content').hide();
			$('.main-content').show();
		});
		
	}
	
	$('.album-content').hide();
	// set search icon action
	$('i.icn-search').click(searchSpotify);
	// if return is 
	$('#search').keypress(function(e) {
		console.log(e.which);
    	if(e.which == 13) {
			// stops page reloading on return key
			e.preventDefault();
        	searchSpotify();
    	}
	});
	
}());