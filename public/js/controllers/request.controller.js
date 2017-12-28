"use strict";

function getPlaylists(callback) {
	$.ajax({
		type: "GET",
		global: false,
		dataType: 'JSON',
		url: "http://localhost:3000/api/playlists",
		success: function (data) {
			callback(data);
		}
	});
}

function getSongs(callback) {
	$.ajax({
		type: "GET",
		global: false,
		dataType: 'JSON',
		url: "http://localhost:3000/api/songs",
		success: function (data) {
			callback(data);
		}
	});
}
