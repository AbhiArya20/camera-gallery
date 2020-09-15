const video = document.querySelector("video");
const permissionWarning = document.querySelector(".permission-warning");
const requestPermissionBtn = document.querySelector(".request-permission-btn");


const constraints = {
  video: true,
  audio: true,
};

// Camera access using mediaDevice API
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  permissionWarning.style.display = 'none';
  video.srcObject = stream;
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