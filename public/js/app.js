"use strict";

$(function () {
	$.fn.select2.defaults.set("theme", "bootstrap");
	
	drawPlaylists();
	changePlaylistInPlayer();
	addSongsToPlaylistForm();
	select2Genre();
	setPlaylistFinally();
	changeToDefaultlPlaying();
	searchPlaylistResults();
	editPlaylist();

	checkForDelete("#deletePlaylistFromPlayer", false);
	checkForDelete(".deletePlaylistFromPlaylists", true);

	$("#home").on("click", function () {
		drawPlaylists();
		cleanPlayer();
		changeToDefaultlPlaying();
	});

	$("#favorites").on("click", function () {
		drawFavoritePlaylists();
		cleanPlayer();
		changeToFavoritePlaying();
	});

	$("#openAddPlaylistModal").on("click", function () {
		resetPlaylistForm(true);
	});
});
