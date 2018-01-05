"use strict";

$(function () {
	playlistsActions();

	$.fn.select2.defaults.set("theme", "bootstrap");

	$("#addSongsToPlaylistForm").on("click", ".remove-song", function () {
		$(this).parents(".add-new-song-col").remove();
	});

	$("#genre").select2({
		placeholder: "Genre",
		data: genre,
		allowClear: true,
		language: "en",
		tags: true,
		width: "100%",
		dropdownParent: $("#playlistModal")
	});

	$("#setPlaylistFinally").on("click", function () {
		setPlaylist(function (res) {
			messageTemplate(res, $("#playlistMessage"));
		});
	});

	checkForDelete("#deletePlaylistFromPlayer", false);
	checkForDelete(".deletePlaylistFromPlaylists", true);
});

function playlistsActions() {
	getPlaylists(function (playlists) {
		playlistTemplate(playlists, mainPlaylists);

		mainPlaylists.on("click", ".play-playlist", function () {
			let order = $(this).attr("data-order");
			playerTemplate(playlists[order], mainPlayer);
		});
	});
}

function getSongsToSelect2() {
	getSongs(function (songs) {
		let arr = [];
		for (let song of songs) {
			arr.push({id: song._id, text: song.name});
		}
	
		$(".exist-songs").select2({
			placeholder: "Song From Playlists",
			data: arr,
			allowClear: true,
			language: "en",
			width: "100%",
			dropdownParent: $("#playlistModal")
		});
	});
}

function deletePlaylistAction(element) {
	let playlistId = $(element).attr("data-id");

	deletePlaylist(playlistId, function (res) {
		playlistsActions();
	});
}

function checkForDelete(input, isClass) {
	$("body").on("click", input, function (e) {
		let $this = $(this);
        e.preventDefault();
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
			cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes'
        }).then(function (result) {
			if (result.value) {
				if (isClass) {
					deletePlaylistAction($this);
				} else {
					deletePlaylistAction(input);
				}
			}
        })
    });
}

let genre = 
["Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge",
"Hip Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B",
"Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska",
"Death Metal","Pranks","Soundtrack","Euro Techno","Ambient",
"Trip Hop","Vocal","Jazz Funk","Fusion","Trance","Classical",
"Instrumental","Acid","House","Game","Sound Clip","Gospel",
"Noise","AlternRock","Bass","Soul","Punk","Space","Meditative",
"Instrumental Pop","Instrumental Rock","Ethnic","Gothic",
"Darkwave","Techno Industrial","Electronic","Pop-Folk",
"Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta",
"Christian Rap","Pop Funk","Jungle","Native American",
"Cabaret","New Wave","Psychadelic","Rave","Showtunes","Trailer",
"Lo Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro",
"Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock",
"National Folk","Swing","Fast Fusion","Bebob","Latin","Revival",
"Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock",
"Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band",
"Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson",
"Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
"Porn Groove","Satire","Slow Jam","Club","Tango","Samba",
"Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle",
"Duet","Punk Rock","Drum Solo","Acapella","Euro House","Dance Hall"].sort();
