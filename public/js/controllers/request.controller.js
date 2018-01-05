"use strict";

function getPlaylists(cb) {
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/playlist",
		dataType: "JSON",
		success: function (data) {
			cb(data);
		}
	});
}

function getSongs(cb) {
	$.ajax({
		type: "GET",
		url: "http://localhost:3000/api/song",
		dataType: "JSON",
		success: function (data) {
			cb(data);
		}
	});
}

function deletePlaylist(_id, cb) {
	$.ajax({
		type: "DELETE",
		url: "http://localhost:3000/api/playlist/" + _id,
		dataType: "JSON",
		success: function (res) {
			cb(res);
		}
	});
}

function setPlaylist(cb) {
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

	$.ajax({
		type: "POST",
		url: "http://localhost:3000/api/playlist",
		dataType: "JSON",
		contentType: false,
        processData: false,
        data: fd,
		success: function (data) {
			cb(data);
		},
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
