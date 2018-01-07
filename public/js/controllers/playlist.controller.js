"use strict";

async function drawPlaylists() {
	let playlists = await getPlaylists();
	playlistTemplate(playlists, mainPlaylists);
}

async function drawFavoritePlaylists() {
	let playlists = await getFavoritePlaylists();

	if (playlists.length > 0) {
		playlistTemplate(playlists, mainPlaylists);
	} else {
		warningTemplate("There are no favorite playlists right now", mainPlaylists);
	}
	
}

async function getSongsToSelect2() {
	let songs = await getSongs();
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
}

async function setPlaylistAction() {
	let res = await setPlaylist();

	if (messageTemplate(res, $("#playlistMessage"))) {
		resetPlaylistForm(false);
		checkAndDrawPlaylists();

		if (res.data._id === mainPlayer.attr("data-id")) {
			playerTemplate(res.data, mainPlayer);
		}
	}
}

async function changePlaylistInPlayerAction(playlistId) {
	let playlist = await getPlaylistById(playlistId);
	playerTemplate(playlist, mainPlayer);
}

function changePlaylistInPlayer() {
	mainPlaylists.on("click", ".play-playlist", function () {
		$(".col-playlist").removeClass("playlist-playing");
		$(this).parent().addClass("playlist-playing");
		let playlistId = $(this).parent().attr("data-id");
		changePlaylistInPlayerAction(playlistId);
	});
}

async function setFavoritePlaylistAction(playlistId) {
	let res = await setFavoritePlaylist(playlistId);

	if (mainPlaylists.attr("playing") === "favorite") {
		drawFavoritePlaylists();
	}
}

async function deletePlaylistAction(element, isPlaying) {
	let playlistId = $(element).attr("data-id");
	let res = await deletePlaylist(playlistId);

	if (res) {
		drawPlaylists();
		if (isPlaying) {
			cleanPlayer();
		} else if (element.hasClass("playlist-playing")) {
			cleanPlayer();
		}
	}
}

async function searchPlaylistResultsAction(searchValue) {
	let playlists = "";

	if (mainPlaylists.attr("playing") === "favorite") {
		playlists = await getSearchResultsFavorite(searchValue);
	} else {
		playlists = await getSearchResultsDefault(searchValue);
	}

	if (playlists.length > 0) {
		playlistTemplate(playlists, mainPlaylists);
	} else {
		dangerTemplate("No Results", mainPlaylists);
	}
}

function searchPlaylistResults() {
	$("#searchPlaylistValue").on("keyup", function () {
		let searchValue = $(this).val();

		if (searchValue.length > 1) {
			searchPlaylistResultsAction(searchValue);
		} else {
			checkAndDrawPlaylists();
		}
	});
}

function editPlaylist() {
	$("body").on("click", ".editPlaylistFromPlaylists", function () {
		let playlistId = $(this).parent().attr("data-id");
		editPlaylistAction(playlistId);
	});

	$("body").on("click", "#editPlaylistFromPlayer", function () {
		let playlistId = mainPlayer.attr("data-id");
		editPlaylistAction(playlistId);
	});
}

async function editPlaylistAction(playlistId) {
	let playlist = await getPlaylistById(playlistId);

	editPlaylistFormTemplate(playlist);

	$("#openEditPlaylistModal").click();
}

function checkForDelete(input, isClass) {
	$("body").on("click", input, function (e) {
		let $this = $(this).parent();
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
					deletePlaylistAction($this, false);
				} else {
					deletePlaylistAction(input, true);
				}
			}
        })
    });
}

function showPlayer() {
	$("#mainPlayer").show();
}

function hidePlayer() {
	$("#mainPlayer").hide();
}

function cleanPlayer() {
	$("#playerHeader").empty();
	$("#mainPlayer").attr("data-id", "");
	$(".playlist-songs").empty();
	hidePlayer();
	stopPlayingMusic();
	document.title = "Playlist";
}

function changeToFavoritePlaying() {
	mainPlaylists.attr("playing", "favorite");
}

function changeToDefaultlPlaying() {
	mainPlaylists.attr("playing", "default");
}

function checkAndDrawPlaylists() {
	if (mainPlaylists.attr("playing") === "favorite") {
		drawFavoritePlaylists();
	} else {
		drawPlaylists();
	}
}
