"use strict";

function getPlaylists() {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/playlist`,
		dataType: "JSON"
	});
}

function getPlaylistById(id) {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/playlist/${id}`,
		dataType: "JSON"
	});
}

function getFavoritePlaylists() {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/playlist/favorite`,
		dataType: "JSON"
	});
}

function getSearchResultsDefault(q) {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/playlist/name/${q}`,
		dataType: "JSON"
	});
}

function getSearchResultsFavorite(q) {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/playlist/favorite/name/${q}`,
		dataType: "JSON"
	});
}

function setFavoritePlaylist(id) {
	return $.ajax({
		type: "PUT",
		url: `${BASE_URL}/api/playlist/favorite/${id}`,
		dataType: "JSON"
	});
}

function getSongs() {
	return $.ajax({
		type: "GET",
		url: `${BASE_URL}/api/song`,
		dataType: "JSON"
	});
}

function deletePlaylist(id) {
	return $.ajax({
		type: "DELETE",
		url: `${BASE_URL}/api/playlist/${id}`,
		dataType: "JSON"
	});
}

function setPlaylist() {
	let fd = new FormData();

    let songs = $(".songs");
    for (let song of songs) {
        fd.append("songs", song.files[0]);
	}

	let album = $("#playlistAlbum").prop("files")[0];
	fd.append("album", album)

    let inputs = $("#playlistForm").serializeArray();
    for (let input of inputs) {
        fd.append(input.name, input.value);
    }

	return $.ajax({
		type: "POST",
		url: `${BASE_URL}/api/playlist`,
		dataType: "JSON",
		contentType: false,
        processData: false,
        data: fd,
		beforeSend: function () {
			$("#playlistForm").addClass("invisible");
			$("#mainLoader").show();
		},
		complete: function () {
			setTimeout(function () {
				$("#playlistForm").removeClass("invisible");
				$("#mainLoader").hide();
				clearTimeout();
			}, 1000);
		}
	});
}
