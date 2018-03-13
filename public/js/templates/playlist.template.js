"use strict";

function playlistTemplate(playlists, element) {
    let output = ``;
    for (let playlist of playlists) {
        let image = ``;
        if (playlist.image === null) {
            image = `defaults/default-album.jpg`;
        } else {
            image = `albums/${playlist.image}`;
        }
        output += `
        <div class="col-lg-3 mb-5 mt-3 text-center col-playlist" data-id="${playlist._id}">
            <span class="playlist-title" title="${playlist.name}">${playlist.name}</span>
            <span class="songs-count">${playlist.songs.length}</span>
            <i class="fa fa-trash trash-player playlist-icon-trash float-right deletePlaylistFromPlaylists"></i>
            <i class="fa fa-pencil pencil-player playlist-icon-pencil float-right editPlaylistFromPlaylists"></i>
            <i class="fa fa-play play-playlist"></i>
            <img src="images/${image}" class="album-image-playlists">
        </div>
        `;
    }
    element.html(output);
}
