"use strict";

const mainPlayer = $("#mainPlayer");
const mainPlaylists = $("#mainPlaylists");
const audio = $("#player")[0];
const startTime = $("#startTime");
const endTime = $("#endTime");
const playPause = $("#playPause");
const progressbar = $("#seek")[0];
const rangeVolume = $("#rangeVolume");
const volume = $("#volume");
const heart = $("#heart");
const retweet = $("#retweet");
const list = $("#list");
const random = $("#random");

$(function () {
    mainPlayer.on("click", ".song", function () {
		changeSong($(this).attr("data-player"));
		changeTitleBySong($(this).attr("data-name"));
        $(".song").removeClass("play-now");
        $(this).addClass("play-now");
        $(".song").children("i").removeClass("show-icon");
		$(this).children("i").addClass("show-icon");
		toggleToPause();
	});

	mainPlayer.on("click", "#backward", function () {
		$(".play-now").prev().click();
	});

	mainPlayer.on("click", "#forward", function () {
		$(".play-now").next().click();
	});

	mainPlayer.on("click", "#heart", function () {
		heart.toggleClass("fill-heart");;
	});

	mainPlayer.on("click", "#list", function () {
		list.toggleClass("chosen-control");
		$(".playlist-songs").slideToggle();
	});

	mainPlayer.on("click", "#random", function () {
		$(this).toggleClass("chosen-control");
		if ($(this).attr("data-random") === "false") {
			$(this).attr("data-random", "true");
		} else {
			$(this).attr("data-random", "false");
		}
	});

	mainPlayer.on("click", "#retweet", function () {
		retweet.toggleClass("chosen-control");
		audio.loop = audio.loop === false ? true : false;
		if (audio.loop === false) {
			toggleToPause();
		}
	});
	
	$("#player").on("ended", function () {
		if (random.attr("data-random") === "false") {
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
    audio.pause();
    audio.load();
    audio.oncanplaythrough = audio.play();
}

function initProgressBar() {
	let length = audio.duration;
	let currentTime = audio.currentTime;

	if (!isNaN(length)) {
		let totalLength = calculateTotalValue(length);
		endTime.html(totalLength);
	}
	
	currentTime = calculateCurrentValue(currentTime);
	startTime.html(currentTime);

	if (isNaN(length)) {
		progressbar.value = 0;
	} else {
		progressbar.value = audio.currentTime / length;
	}
	
	progressbar.addEventListener("click", seek);

	if (audio.currentTime == audio.duration) {
		playPause.addClass("fa-play");
		playPause.removeClass("fa-pause");
		startTime.html("00:00");
		progressbar.value = 0;
	}

	function seek(event) {
		let percent = event.offsetX / this.offsetWidth;
		audio.currentTime = percent * audio.duration;
		progressbar.value = percent / 100;
	}
}

function initPlayers() {
	let isPlaying = false;

	if (playPause != null) {
		playPause.on("click", function () {
			togglePlay();
		});
	}

	function togglePlay() {
		if (audio.paused === false) {
			audio.pause();
			isPlaying = false;
			toggleToPlay();
		} else {
			audio.play();
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
	rangeVolume.on("change", function () {
		let volume = $(this).val();

		if (volume > 0.5) {
			toggleVolumeUp();
		} else if (volume > 0) {
			toggleVolumeMiddle();
		} else {
			toggleVolumeDown();
		}

		audio.volume = volume;
	});

	volume.on("click", function () {
		let volume = audio.volume;

		if (volume > 0) {
			toggleVolumeDown();
			rangeVolume.val("0");
			audio.volume = 0;
		} else {
			toggleVolumeUp();
			rangeVolume.val("1");
			audio.volume = 1;
		}
	});
}

function toggleVolumeUp() {
	volume.removeClass("fa-volume-down");
	volume.removeClass("fa-volume-off");
	volume.addClass("fa-volume-up");
}

function toggleVolumeMiddle() {
	volume.removeClass("fa-volume-off");
	volume.removeClass("fa-volume-up");
	volume.addClass("fa-volume-down");
}

function toggleVolumeDown() {
	volume.removeClass("fa-volume-down");
	volume.removeClass("fa-volume-up");
	volume.addClass("fa-volume-off");
}

function toggleToPlay() {
	playPause.removeClass("fa-pause");
	playPause.addClass("fa-play");
}

function toggleToPause() {
	playPause.removeClass("fa-play");
	playPause.addClass("fa-pause");
}

jQuery.fn.random = function () {
    let randomIndex = Math.floor(Math.random() * this.length);  
    return jQuery(this[randomIndex]);
};
