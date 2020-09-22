const galleryCont = document.querySelector(".gallery-cont");
const emptyGallery = document.querySelector(".empty-gallery");

setTimeout(() => {
  if (DB) {
    const videoDBTransaction = DB.transaction("video", "readonly");
    const videoStore = videoDBTransaction.objectStore("video");
    const videoRequest = videoStore.getAll();
    videoRequest.onsuccess = (e) => {
      const videoResult = videoRequest.result;

      if (videoResult.length) {
        emptyGallery.classList.add("hide");
      }
      videoResult.forEach((videoObj) => {
        const url = URL.createObjectURL(videoObj.blobData);
        const mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>`;
        galleryCont.appendChild(mediaElem);

        const deleteBtn = mediaElem.querySelector(".delete");
        const downloadBtn = mediaElem.querySelector(".download");
        deleteBtn.addEventListener("click", (e) => {
          remove(e);
        });
        downloadBtn.addEventListener("click", (e) => {
          download(e);
        });
      });
    };

    const imageDBTransaction = DB.transaction("image", "readonly");
    const imageStore = imageDBTransaction.objectStore("image");
    const imageRequest = imageStore.getAll();
    imageRequest.onsuccess = (e) => {
      const imageResult = imageRequest.result;

      if (imageResult.length) {
        emptyGallery.classList.add("hide");
      }

      imageResult.forEach((imageObj) => {
        const url = imageObj.blobData;
        const mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);
        mediaElem.innerHTML = `
        <div class="media">
            <image src="${url}"></image>
        </div>
        <div class="delete action-btn">DELETE</div>
        <div class="download action-btn">DOWNLOAD</div>`;
        galleryCont.appendChild(mediaElem);

        const deleteBtn = mediaElem.querySelector(".delete");
        const downloadBtn = mediaElem.querySelector(".download");
        deleteBtn.addEventListener("click", (e) => {
          remove(e);
        });
        downloadBtn.addEventListener("click", (e) => {
          download(e);
        });
      });
    };
  }
}, 100);

function remove(e) {
  const id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) == "vid") {
    const videoDBTransaction = DB.transaction("video", "readwrite");
    const videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);
  } else {
    const imageDBTransaction = DB.transaction("image", "readwrite");
    const imageStore = imageDBTransaction.objectStore("image");
    imageStore.delete(id);
  }
  e.target.parentElement.remove();

  if (galleryCont.children.length === 1) {
    emptyGallery.classList.remove("hide");
  }

}

function download(e) {
  const id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) == "vid") {
    const videoDBTransaction = DB.transaction("video", "readonly");
    const videoStore = videoDBTransaction.objectStore("video");
    const videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(videoRequest.result.blobData);
      a.download = "video.mp4";
      a.click();
    };
  } else {
    const imageDBTransaction = DB.transaction("image", "readonly");
    const imageStore = imageDBTransaction.objectStore("image");
    const imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      const a = document.createElement("a");
      a.href = imageRequest.result.blobData;
      a.download = "image.jpg";
      a.click();
    };
  }
}