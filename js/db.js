// Open Database
const openRequest = indexedDB.open('myDB')
let DB;

openRequest.addEventListener("success", (e) => {
    DB = openRequest.result
})

openRequest.addEventListener("error", (e) => {
    console.log('error in DATABASE connection');
})

openRequest.addEventListener("upgradeneeded", (e) => {
    DB = openRequest.result;
    DB.createObjectStore("video", { keyPath: "id" })
    DB.createObjectStore("image", { keyPath: "id" })
})
