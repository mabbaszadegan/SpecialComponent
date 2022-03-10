window.addEventListener("load", pageLoad);

let width = 200;
let height = 30;
let textPos = "right";
let placeholder = "";

function pageLoad() {
    let controls = document.querySelectorAll("input.special");
    controls.forEach(function (item) {
        if (item.getAttribute("placeholder") != null && item.getAttribute("placeholder") != "")
            placeholder = item.getAttribute("placeholder");
        if (item.getAttribute("width") != null && item.getAttribute("width") != "")
            width = item.getAttribute("width");
        if (item.getAttribute("height") != null && item.getAttribute("height") != "")
            height = item.getAttribute("height");
        if (item.getAttribute("textPos") != null && item.getAttribute("textPos") != "")
            textPos = item.getAttribute("textPos");

        let mainDiv = document.createElement('div');
        item.parentNode.append(mainDiv);
        mainDiv.style.width = width;
        mainDiv.style.height = height;
        mainDiv.style.position = "relative";
        mainDiv.style.overflow = "hidden";
        mainDiv.style.paddingTop = "10pt";
        mainDiv.style.marginBottom = "10pt";
        mainDiv.style.float = item.style.float;
        mainDiv.style.display = item.style.display;
        mainDiv.append(item);

        let lblText = document.createElement('label');
        lblText.innerText = placeholder;
        lblText.style.pointerEvents = "none";
        lblText.style.position = "absolute";
        if (textPos != null && textPos.toLowerCase() == "left")
            lblText.style.left = "10px";
        else
            lblText.style.right = "10px";
        lblText.style.bottom = "0px";
        item.after(lblText);

        item.removeAttribute("placeholder");
        item.removeAttribute("width");
        item.removeAttribute("height");

        item.style.width = "100%";
        item.style.height = "100%";
        item.style.border = "none";
        item.style.borderBottom ="1px solid #c9c9c9";

        if (item.value.length > 0)
            animateText(item, "f");
        else
            animateText(item, "b");

        item.addEventListener("focus", function () {
            if (this.value.length > 0)
                return;

            animateText(this, "f");
        });

        item.addEventListener("blur", function () {
            if (this.value.length > 0)
                return;
            animateText(this, "b");
        });
    });
}

function animateText(oInput, state) {
    const elem = oInput.nextElementSibling;
    let id = null;
    let pos = elem.offsetTop;
    clearInterval(id);
    if (state === "f") {
        id = setInterval(frameUp, 5);
        elem.style.bottom = "";
        elem.style.fontSize = "10pt";
        elem.style.color = "#f09b9bfa";
        oInput.style.outline = "none";
        oInput.style.borderBottom = "1px solid red";
    }
    if (state === "b") {
        id = setInterval(frameDown, 5);
        pos = elem.clientHeight;
        elem.style.top = "";
        elem.style.fontSize = "";
        elem.style.color = "#534c4c8c";
        oInput.style.outline = "";
        oInput.style.borderBottom = "1px solid #c9c9c9";
    }
    function frameUp() {
        if (pos == 0) {
            clearInterval(id);
        }
        else {
            pos--;
            elem.style.top = pos + "px";
        }
    }

    function frameDown() {
        if (pos == 0) {
            clearInterval(id);
        }
        else {
            pos--;
            elem.style.bottom = pos + "px";
        }
    }
}
