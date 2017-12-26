"use strict";

let playlists = "";

$(function () {
	playlists = function () {
		let tmp = null;
		$.ajax({
			async: false,
			type: "GET",
			global: false,
			dataType: 'JSON',
			url: "http://localhost:3000/api/playlists",
			success: function (data) {
				tmp = data;
			}
		});
		return tmp;
	}();

	playlistTemplate(playlists, mainPlaylists);
});
