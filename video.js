const streamSource = {
    mic: null,
    camera: null,
};
const $videoDiv = document.getElementById("videoDiv");
const $audioDiv = document.getElementById("audioDiv");
const $startVideoBtn = document.getElementById("startVideoBtn");
const $startAudioBtn = document.getElementById("startAudioBtn");
const $stopVideoBtn = document.getElementById("stopVideoBtn");
const $stopAudioBtn = document.getElementById("stopAudioBtn");
let currentLoudness = null;

function startVideo(id) {
    //Selector for your <video> element
    stopVideo();
    const video = document.createElement("video");
    video.setAttribute("id", "myVidPlayer");
    video.setAttribute("hide-controls", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    $videoDiv.appendChild(video);
    window.navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: { width: 1920, height: 1080, deviceId: id },
        })
        .then((stream) => {
            streamSource.camera = stream;
            video.srcObject = stream;
            console.log(stream);
            video.onloadedmetadata = (e) => {
                video.play();
            };
        })
        .catch((error) => {
            console.error("Error accessing video devices:", error);
        });
}

function logLoudness(analyser, dataArray) {
    if (!streamSource.mic) {
        //stop recuirsion when stream is clear
        return;
    }
    analyser.getByteFrequencyData(dataArray);
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;
    const newVal = Math.ceil(average);
    if (currentLoudness != newVal) {
        $audioDiv.innerHTML = "🔈 " + "❚".repeat(newVal);
    }
    // console.log("Loudness:", average);
    requestAnimationFrame(() => logLoudness(analyser, dataArray));
}

function startAudio(id) {
    // Create an audio context
    stopAudio();
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    // Get user media for audio
    navigator.mediaDevices
        .getUserMedia({ audio: { deviceId: id } })
        .then((stream) => {
            streamSource.mic = stream;
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            // Create a buffer to hold the data
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            // Start logging loudness
            logLoudness(analyser, dataArray);
        })
        .catch((error) => {
            console.error("Error accessing audio devices:", error);
        });
}

function listCameras() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
    }

    navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind == "videoinput")
                    document.getElementById(
                        "camSelector"
                    ).innerHTML += `<option value="${device.deviceId}">${device.label}</option>`;
            });
        })
        .catch(function (e) {
            console.log(e.name + ": " + e.message);
        });
}

function listMics() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
    }

    // List microphones.
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind == "audioinput")
                    document.getElementById(
                        "micSelector"
                    ).innerHTML += `<option value="${device.deviceId}">${device.label}</option>`;
            });
        })
        .catch(function (e) {
            console.log(e.name + ": " + e.message);
        });
}

const stopStream = (stream) => {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
};

function stopVideo() {
    stopStream(streamSource.camera);
    streamSource.camera = null;
    $videoDiv.innerHTML = "";
}
function stopAudio() {
    stopStream(streamSource.mic);
    streamSource.mic = null;
    $audioDiv.innerHTML = "";
}

function fullScreen() {
    document.getElementById("videoDiv").webkitRequestFullScreen();
}

window.onload = (e) => {
    listCameras();
    listMics();
};

$startVideoBtn.onclick = (e) => {
    startVideo(document.getElementById("camSelector").value);
};

$startAudioBtn.onclick = (e) => {
    startAudio(document.getElementById("micSelector").value);
};

$stopVideoBtn.onclick = stopVideo;
$stopAudioBtn.onclick = stopAudio;
