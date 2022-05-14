// import SignPad from "/dist/signpad.js";
let canvasList = document.querySelectorAll("canvas.signpad");

let config = {
    bgColor: "#eee"
};
console.log(SignPad)
let signpadList = Array(canvasList.length).fill(null);
for(var i = 0; i < canvasList.length; i++){
    signpadList[i] = new SignPad.SmoothSignature(canvasList[i], config);
    console.log(i, signpadList[i]);
}