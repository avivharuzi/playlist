"use strict";

function navButtonsActions() {
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
}
