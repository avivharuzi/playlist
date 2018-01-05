"use strict";

function playerTemplate(playlist, element) {
	let counter = 1;
	let image = ``;

	if (playlist.image === null) {
		image = `defaults/default-album.jpg`;
	} else {
		image = `albums/${playlist.image}`;
	}

	let outputPlayerHeader = `
	<img src="images/${image}" class="hero-background">
	<img src="images/${image}" class="album-image">
	<i class="fa fa-trash trash-player float-right" id="deletePlaylistFromPlayer" data-id="${playlist._id}"></i>
	<i class="fa fa-pencil pencil-player float-right"></i>
	<span id="playlistNamePlaying">${playlist.name}</span>
	<br>
	<span id="playlistGenre"># ${playlist.genre}</span>`;

	$("#playerHeader").html(outputPlayerHeader);

	let outputSongs = ``;

	for (let song of playlist.songs) {
		if (counter === 1) {
			changeSong(`songs/${song.audio}`);
			toggleToPause();
			changeTitleBySong(song.name);

			outputSongs += `
			<li class="song play-now" data-player="songs/${song.audio}" data-name="${song.name}">${counter}. ${song.name}<i class="fa fa-file-audio-o float-right player-icon show-icon" aria-hidden="true"></i></li>
			`;
		} else {
			outputSongs += `
			<li class="song" data-player="songs/${song.audio}" data-name="${song.name}">${counter}. ${song.name}<i class="fa fa-file-audio-o float-right player-icon" aria-hidden="true"></i></li>
			`;
		}
		counter++;
	}

	$(".playlist-songs").html(outputSongs);

	mainPlayer.removeClass("d-none");
	mainPlayer.addClass("d-block");
}
