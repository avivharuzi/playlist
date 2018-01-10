"use strict";

function addSongsToPlaylistForm() {
    $("#addSongsToPlaylistForm").on("click", ".remove-song", function () {
        $(this).parents(".add-new-song-col").remove();
    });
}

function select2Genre() {
    let genre = 
    ["Blues", "Classic Rock", "Country", "Dance", "Disco", "Funk", "Grunge",
    "Hip Hop", "Jazz", "Metal", "New Age", "Oldies", "Other", "Pop", "R&B",
    "Rap", "Reggae", "Rock", "Techno", "Industrial", "Alternative", "Ska",
    "Death Metal", "Pranks", "Soundtrack", "Euro Techno", "Ambient",
    "Trip Hop", "Vocal", "Jazz Funk", "Fusion", "Trance", "Classical",
    "Instrumental", "Acid", "House", "Game", "Sound Clip", "Gospel",
    "Noise", "AlternRock", "Bass", "Soul", "Punk", "Space", "Meditative",
    "Instrumental Pop", "Instrumental Rock", "Ethnic", "Gothic",
    "Darkwave", "Techno Industrial", "Electronic", "Pop-Folk",
    "Eurodance", "Dream", "Southern Rock", "Comedy", "Cult", "Gangsta",
    "Christian Rap", "Pop Funk", "Jungle", "Native American",
    "Cabaret", "New Wave", "Psychadelic", "Rave", "Showtunes", "Trailer",
    "Lo Fi", "Tribal", "Acid Punk", "Acid Jazz", "Polka", "Retro",
    "Musical", "Rock & Roll", "Hard Rock", "Folk", "Folk-Rock",
    "National Folk", "Swing", "Fast Fusion", "Bebob", "Latin", "Revival",
    "Celtic", "Bluegrass", "Avantgarde", "Gothic Rock", "Progressive Rock",
    "Psychedelic Rock", "Symphonic Rock", "Slow Rock", "Big Band",
    "Chorus", "Easy Listening", "Acoustic", "Humour", "Speech", "Chanson",
    "Opera", "Chamber Music", "Sonata", "Symphony", "Booty Bass", "Primus",
    "Porn Groove", "Satire", "Slow Jam", "Club", "Tango", "Samba",
    "Folklore", "Ballad", "Power Ballad", "Rhythmic Soul", "Freestyle",
    "Duet", "Punk Rock", "Drum Solo", "Acapella", "Euro House", "Dance Hall"].sort();
    
    $("#genre").select2({
        placeholder: "Genre",
        data: genre,
        allowClear: true,
        language: "en",
        tags: true,
        width: "100%",
        dropdownParent: $("#playlistModal")
    });
}

function setPlaylistFinally() {
    $("body").on("click", "#setPlaylistFinally", function () {
        let data = checkInputsFormPlaylist();
        if (data === true) {
            setPlaylistAction();
        } else {
            messageTemplate(data, $("#playlistMessage"));
        }
    });
}

function setBootstrapThemeToSelect() {
    $.fn.select2.defaults.set("theme", "bootstrap");
}

function checkInputsFormPlaylist() {
    let errors = [];

    const PLAYLIST_NAME_REGEX = /^[A-Za-z0-9!@#$%^&*()_., ]{3,255}$/;
    const GENRE_REGEX = /^[A-Za-z0-9 &]{3,55}$/;
    const SONG_NAME_REGEX = /^[A-Za-z0-9!@#$%^&*()_., -]{3,255}$/;

    let playlistNameValue = $("#playlistName").val();
    let genreValue = $("#genre").val();
    let songNames = $("input[name=songName]");

    if (playlistNameValue === "") {
        errors.push("Playlist name is required");
    } else if (!PLAYLIST_NAME_REGEX.test(playlistNameValue)) {
        errors.push("Playlist name is invalid");
    }

    if (genreValue === "") {
        errors.push("Genre is required");
    } else if (!GENRE_REGEX.test(genreValue)) {
        errors.push("Genre is invalid");
    }

    for (let songName of songNames) {
        if (songName.value === "") {
            errors.push("Song name is required");
            break;
        } else if (!SONG_NAME_REGEX.test(songName.value)) {
            errors.push(`Song name ${songName.value} is invalid`);
        }
    }

    if (errors.length > 0) {
        let data = {
            response: false,
            errors: errors
        }
        return data;
    } else {
        return true;
    }
}
