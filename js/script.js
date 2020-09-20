// Element Selected
const video = document.querySelector("video");
const recordBtnCont = document.querySelector(".record-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const captureBtn = document.querySelector(".capture-btn");
const permissionWarning = document.querySelector(".permission-warning");
const requestPermissionBtn = document.querySelector(".request-permission-btn");

// Recorder btn click listener
recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) {
    return;
  }
  recordFlag = !recordFlag;
  if (recordFlag) {
    recordBtn.classList.add("scale-record");
    recorder.start();
    startTimer()
  } else {
    recordBtn.classList.remove("scale-record");
    recorder.stop();
    stopTimer()
  }
});

// Capture btn click listener
captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture")
  const canvas = document.createElement("canvas")
  canvas.height = video.videoHeight
  canvas.width = video.videoWidth
  const tool = canvas.getContext("2d")
  tool.drawImage(video, 0, 0, canvas.width, canvas.height)
  tool.fillStyle = transparentColor
  tool.fillRect(0, 0, canvas.width, canvas.height)
  const imageURL = canvas.toDataURL();
  if (DB) {
    const imageId = "img-" + shortid()
    const DBTransaction = DB.transaction('image', 'readwrite')
    const videoStore = DBTransaction.objectStore("image")
    const imageEntry = {
      id: imageId,
      blobData: imageURL
    }
    videoStore.add(imageEntry)
  }
  setTimeout(() => {
    captureBtn.classList.remove("scale-capture")
  }, 100);
});

let timerID;
let counter = 0;
const timer = document.querySelector(".timer");

// Start timer while recording
function startTimer() {
  timer.style.display = "block"
  function displayTimer() {
    let totalSeconds = counter;
    let hour = Number.parseInt(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds %= 60;
    let seconds = totalSeconds;
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hour}:${minutes}:${seconds}`;
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}
// Stop timer while recording
function stopTimer() {
  counter = 0
  timer.style.display = "none"
  clearInterval(timerID);
  timer.innerText = "00:00:00";
}

const filterLayer = document.querySelector(".filter-layer")
const allfilter = document.querySelectorAll(".filter")
// Filter change listeners
allfilter.forEach(filterElem => {
  filterElem.addEventListener("click", (e) => {
    transparentColor = getComputedStyle(filterElem).getPropertyValue('background-color')
    filterLayer.style.backgroundColor = transparentColor
  })
})


const gallery = document.querySelector(".gallery")
gallery.addEventListener("click", (e) => {
  location.assign("./gallery.html")
})


requestPermissionBtn.addEventListener("click", async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    permissionWarning.style.display = 'none';
  } catch (error) {
    permissionWarning.style.display = 'block';

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      permissionWarning.textContent = 'You have denied camera access. Please enable it in your browser settings.';
      requestPermissionBtn.style.display = "none";
    }
  }
});