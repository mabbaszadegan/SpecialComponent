import { Sidebar } from "./Components/Sidebar/sidebar.js";

const root = "pages/samples";
let container;
let sidebarContainer;

window.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("containerFrame");
  sidebarContainer = document.getElementById("sidebarContainer");

  const items = [
    {
      key: "textbox",
      text: "تکست باکس",
      url: `${root}/SpecialTextbox/SpecialTextbox.html`,
    },
    {
      key: "resizableElement",
      text: "باکس با قابلیت تغییر سایز",
      url: `${root}/ResizableElement/ResizableElement.html`,
    },
  ];

  const setting = {
    sidebarContainer: sidebarContainer,
    contentContainer: container,
    itemClassList: ["fa-solid", "fa-bars"],
    itemClick: openPage,
  };
  const sidebar = new Sidebar(items, setting);
  sidebar.build();
});

const openPage = (path) => {
  container.setAttribute("src", `${path}`);
};
