const root = "pages/samples";
let container;

window.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("containerFrame");
});

const openPage = (path) => {
  container.setAttribute("src", `${root}/${path}/${path}.html`);
};
