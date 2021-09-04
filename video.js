function startVideo() {
    //Selector for your <video> element
document.getElementById('videoDiv').innerHTML=`<video id="myVidPlayer" hide-controls muted autoplay></video>`;
const video = document.querySelector('#myVidPlayer');
    window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: 1920, height: 1080 }
      })
    .then(stream => {
        
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
        };
    })
    .catch( () => {
        alert('You have give browser the permission to run Webcam and mic ;( ');
    });
}



function stopVideo() {
    location.reload();
}
