const video = document.querySelector("video");
const permissionWarning = document.querySelector(".permission-warning");
const requestPermissionBtn = document.querySelector(".request-permission-btn");

// Filter color variable
let transparentColor = "transparent"

// Recorder toggle variable
let recordFlag = false;

let recorder;

let chucks = [];
const constraints = {
  video: true,
  audio: true,
};

// Camera access using mediaDevice API
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  permissionWarning.style.display = 'none';
  video.srcObject = stream;
  
  // Recording video stream
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chucks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chucks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chucks, { type: "video/mp4" });
    if (DB) {
      const videoId = "vid-" + shortid()
      const DBTransaction = DB.transaction('video', 'readwrite')
      const videoStore = DBTransaction.objectStore("video")
      const videoEntry = {
        id: videoId,
        blobData: blob
      }
      videoStore.add(videoEntry)
    }
  });

}).catch(() => {
  permissionWarning.style.display = 'block';
});



// Request permission button handler
requestPermissionBtn.addEventListener("click", async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    permissionWarning.style.display = 'none';
  } catch (error) {
    permissionWarning.style.display = 'block';
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      permissionWarning.textContent = 'You have denied camera or audio access. Please enable it in your browser settings.';
      requestPermissionBtn.style.display = "none";
    }
  }
});