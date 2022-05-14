// import SignPad from "/dist/signpad.js";
let canvasList = document.querySelectorAll("canvas.signpad");
function $(selector) {
    return document.querySelector(selector);
}

let config = {
    maxWidth: 15,
    bgColor: "#fff"
};
let signpadList = Array(canvasList.length).fill(null);
function resize(ev) {
    let rat_wh = 2;
    for(var i = 0;i < canvasList.length;i++) {
        let div = canvasList[i].parentElement;
        let tmp = canvasList[i];
        let rect = div.getBoundingClientRect();
        let w = rect.width, h = rect.height;
        let t = Math.min(w-10, (h-10)*rat_wh);
        w = Math.floor(t), h = Math.floor(t / rat_wh);
        console.log(w, h);
        signpadList[i].width = w;
        signpadList[i].height = h;
        tmp.style.width  = w + "px";
        tmp.style.height = h + "px";
        tmp.width = w;
        tmp.height = h;
    }
}
for(var i = 0; i < canvasList.length; i++){
    signpadList[i] = new SignPad.SmoothSignature(canvasList[i], config);
    console.log(i, signpadList[i]);
}
resize();
window.addEventListener("resize", resize);
$("#clear").addEventListener("click", () => {
    for(var i = 0; i < signpadList.length; i++){
        signpadList[i].clear();
    }
})
