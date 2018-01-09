"use strict";

$(function () {
    MAIN_PLAYER.on("click", ".song", function () {
		changeSong($(this).attr("data-player"));
		changeTitleBySong($(this).attr("data-name"));
        $(".song").removeClass("play-now");
        $(this).addClass("play-now");
        $(".song").children("i").removeClass("show-icon");
		$(this).children("i").addClass("show-icon");
		toggleToPause();
	});

	MAIN_PLAYER.on("click", "#backward", function () {
		$(".play-now").prev().click();
	});

	MAIN_PLAYER.on("click", "#forward", function () {
		$(".play-now").next().click();
	});

	MAIN_PLAYER.on("click", "#list", function () {
		LIST.toggleClass("chosen-control");
		$(".playlist-songs").slideToggle();
	});

	MAIN_PLAYER.on("click", "#random", function () {
		$(this).toggleClass("chosen-control");
		if ($(this).attr("data-random") === "false") {
			$(this).attr("data-random", "true");
		} else {
			$(this).attr("data-random", "false");
		}
	});

	MAIN_PLAYER.on("click", "#heart", function () {
		HEART.toggleClass("fill-heart");
		let playlistId = $(this).parents("#mainPlayer").attr("data-id");
		setFavoritePlaylistAction(playlistId);
	});

	MAIN_PLAYER.on("click", "#retweet", function () {
		RETWEET.toggleClass("chosen-control");
		AUDIO.loop = AUDIO.loop === false ? true : false;
		if (AUDIO.loop === false) {
			toggleToPause();
		}
	});
	
	$("#player").on("ended", function () {
		if (RANDOM.attr("data-random") === "false") {
			$(".play-now").next().click();
		} else {
			$(".song").random().click();
		}
	});
    
	setVolume();
	initPlayers();
});


function changeTitleBySong(song) {
	document.title = $("body").find("#playlistNamePlaying").text() + " - " + song;
}

function changeSong(song) {
	$("#sourcePlayer").attr("src", song);
    AUDIO.pause();
    AUDIO.load();
    AUDIO.oncanplaythrough = AUDIO.play();
}

function initProgressBar() {
	let length = AUDIO.duration;
	let currentTime = AUDIO.currentTime;

	if (!isNaN(length)) {
		let totalLength = calculateTotalValue(length);
		END_TIME.html(totalLength);
	}
	
	currentTime = calculateCurrentValue(currentTime);
	START_TIME.html(currentTime);

	if (isNaN(length)) {
		PROGRESS_BAR.value = 0;
	} else {
		PROGRESS_BAR.value = AUDIO.currentTime / length;
	}
	
	PROGRESS_BAR.addEventListener("click", seek);

	if (AUDIO.currentTime == AUDIO.duration) {
		PLAY_PAUSE.addClass("fa-play");
		PLAY_PAUSE.removeClass("fa-pause");
		START_TIME.html("00:00");
		PROGRESS_BAR.value = 0;
	}

	function seek(event) {
		let percent = event.offsetX / this.offsetWidth;
		AUDIO.currentTime = percent * AUDIO.duration;
		PROGRESS_BAR.value = percent / 100;
	}
}

function initPlayers() {
	let isPlaying = false;

	if (PLAY_PAUSE != null) {
		PLAY_PAUSE.on("click", function () {
			togglePlay();
		});
	}

	function togglePlay() {
		if (AUDIO.paused === false) {
			AUDIO.pause();
			isPlaying = false;
			toggleToPlay();
		} else {
			AUDIO.play();
			isPlaying = true;
			toggleToPause();
		}
	}
}

function calculateTotalValue(length) {
	let minutes = Math.floor(length / 60);
	minutes = minutes < 10 ? "0" + minutes : minutes;
	let seconds = length - minutes * 60;
	seconds = seconds.toString();
	seconds = seconds.substr(0, 2);
	let time = minutes + ":" + seconds;
	return time;
}

function calculateCurrentValue(currentTime) {
    let currentHour = parseInt(currentTime / 3600) % 24;
    let currentMinute = parseInt(currentTime / 60) % 60;
    let currentSeconds = currentTime % 60;
	currentSeconds = currentSeconds.toFixed();
	
    if (currentSeconds == 60) {
		currentSeconds = 0;
		currentMinute += 1;
	}
	
	let newCurrentTime = (currentMinute < 10 ? "0" + currentMinute : currentMinute) + ":" + (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
  	return newCurrentTime;
}

function setVolume() {
	RANGE_VOLUME.on("change", function () {
		let volume = $(this).val();

		if (volume > 0.5) {
			toggleVolumeUp();
		} else if (volume > 0) {
			toggleVolumeMiddle();
		} else {
			toggleVolumeDown();
		}

		AUDIO.volume = volume;
	});

	VOLUME.on("click", function () {
		let volume = AUDIO.volume;

		if (volume > 0) {
			toggleVolumeDown();
			RANGE_VOLUME.val("0");
			AUDIO.volume = 0;
		} else {
			toggleVolumeUp();
			RANGE_VOLUME.val("1");
			AUDIO.volume = 1;
		}
	});
}

function stopPlayingMusic() {
	$("#sourcePlayer").attr("src", "");
    AUDIO.pause();
}

function toggleVolumeUp() {
	VOLUME.removeClass("fa-volume-down");
	VOLUME.removeClass("fa-volume-off");
	VOLUME.addClass("fa-volume-up");
}

function toggleVolumeMiddle() {
	VOLUME.removeClass("fa-volume-off");
	VOLUME.removeClass("fa-volume-up");
	VOLUME.addClass("fa-volume-down");
}

function toggleVolumeDown() {
	VOLUME.removeClass("fa-volume-down");
	VOLUME.removeClass("fa-volume-up");
	VOLUME.addClass("fa-volume-off");
}

function toggleToPlay() {
	PLAY_PAUSE.removeClass("fa-pause");
	PLAY_PAUSE.addClass("fa-play");
}

function toggleToPause() {
	PLAY_PAUSE.removeClass("fa-play");
	PLAY_PAUSE.addClass("fa-pause");
}

jQuery.fn.random = function () {
    let randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};
