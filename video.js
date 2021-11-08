function startVideo(id) {
    //Selector for your <video> element
    document.getElementById(
        "videoDiv"
    ).innerHTML = `<video id="myVidPlayer" hide-controls muted autoplay></video>`;
    const video = document.querySelector("#myVidPlayer");
    window.navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: { width: 1920, height: 1080, deviceId: id },
        })
        .then((stream) => {
            video.srcObject = stream;
            console.log(stream);
            video.onloadedmetadata = (e) => {
                video.play();
            };
        })
        .catch(() => {
            alert("You have give browser the permission to run Webcam and mic ;( ");
        });
}

listDevices();
function listDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return;
    }

    // List cameras and microphones.

    navigator.mediaDevices
        .enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind == "videoinput")
                    document.getElementById(
                        "camSelector"
                    ).innerHTML += `<option value="${device.deviceId}">${device.label}</option>`;
                // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
            });
        })
        .catch(function (e) {
            console.log(e.name + ": " + e.message);
        });
}

function stopVideo() {
    location.reload();
}

function fullScreen() {
    document.getElementById("videoDiv").webkitRequestFullScreen();
}
