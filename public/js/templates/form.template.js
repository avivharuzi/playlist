"use strict";

$(function () {
    $("#addMoreSongsInputs").on("click", function () {
		$("#addSongsToPlaylistForm").append(`
		<div class="row add-new-song-col">
			<div class="col-lg-6 mb-3">
				<input type="text" class="form-control" name="songName" placeholder="Song Name">
			</div>
			<div class="col-lg-5 mb-3">
				<input type="file" class="custom-b4-file songs">
			</div>
			<div class="col-lg-1 text-center">
				<i class="fa fa-minus-circle remove-song"></i>
			</div>
		</div>
		`);
	});

	$("#addMoreSongsFromPlaylists").on("click", function () {
		$("#addSongsToPlaylistForm").append(`
			<div class="row add-new-song-col">
				<div class="col-lg-11 mb-3">
					<select class="js-example-basic-single form-control exist-songs" name="existSongs">
						<option></option>
					</select>
				</div>
				<div class="col-lg-1 text-center">
					<i class="fa fa-minus-circle remove-song"></i>
				</div>
			</div>
		`);

		getSongsToSelect2();
	});
});

function editPlaylistFormTemplate(playlist) {
	$("#playlistFormTitle").text("Edit Playlist");
	$("#playlistMessage").empty();
	$("#playlistAlbum").val("");
	$("#playlistName").val(playlist.name);

	$("#genre").val(null).trigger("change");

	if ($("#genre").find("option[value='" + playlist.genre + "']").length) {
		$("#genre").val(playlist.genre).trigger("change");
	} else {
		var newOption = new Option(playlist.genre, playlist.genre, true, true);
		$("#genre").append(newOption).trigger("change");
	} 

	let outputSongs = "";
	for (let song of playlist.songs) {
		outputSongs += `
		<div class="row add-new-song-col">
			<div class="col-lg-11 mb-3">
				<p class="lead p-no-margin form-control">${song.name}</p>
				<input type="hidden" class="d-none" value="${song._id}" name="existSongs">
			</div>
			<div class="col-lg-1 text-center">
				<i class="fa fa-minus-circle remove-song"></i>
			</div>
		</div>
		`;
	}
	$("#addSongsToPlaylistForm").html(outputSongs);

	$("#colSetPlaylist").html(`
		<button id="setPlaylistFinally" class="btn btn-success btn-block" type="button">Save Playlist</button>
		<input type="hidden" id="existPlaylistName" name="existPlaylistName" class="d-none" value="${playlist.name}">
		<input type="hidden" class="d-none" name="playlistId" value="${playlist._id}">
		<input type="hidden" id="existAlbum" name="existAlbum" class="d-none" value="${playlist.image}">
	`);
}

function resetPlaylistForm(isResetMessage) {
	if (isResetMessage) {
		$("#playlistMessage").empty();
	}
	$("#playlistFormTitle").text("Add New Playlist");
	$("#playlistName").val("");
	$("#playlistAlbum").val("");
	$("#playlistName").parent().html(`
		<input type="text" class="form-control" name="playlistName" id="playlistName" placeholder="Playlist Name" autofocus>
	`);
	$("#playlistAlbum").parent().html(`
		<input type="file" class="custom-b4-file" id="playlistAlbum">
	`);

	$("#genre").val(null).trigger("change");

	$("#addSongsToPlaylistForm").empty();
	$("#addMoreSongsInputs").click();

	$("#colSetPlaylist").html(`
		<button id="setPlaylistFinally" class="btn btn-success btn-block" type="button">Submit</button>
	`);
}
