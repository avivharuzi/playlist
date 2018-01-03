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
