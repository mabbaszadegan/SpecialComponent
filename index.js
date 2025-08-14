import { Sidebar } from "./Components/Sidebar/sidebar.js";

const root = "pages/samples";
let container;
let sidebarContainer;
let sidebarNav;
let sidebarToggle;
let sidebarOverlay;

window.addEventListener("DOMContentLoaded", () => {
  initializeElements();
  setupSidebar();
  setupMobileSidebar();
  loadDefaultComponent();
});

function initializeElements() {
  container = document.getElementById("containerFrame");
  sidebarContainer = document.getElementById("sidebarContainer");
  sidebarNav = document.getElementById("sidebarNav");
  sidebarToggle = document.getElementById("sidebarToggle");
  sidebarOverlay = document.getElementById("sidebarOverlay");
}

function setupSidebar() {
  const items = [
    {
      key: "textbox",
      text: "تکست باکس ویژه",
      url: `${root}/SpecialTextbox/SpecialTextbox.html`,
      icon: "fa-solid fa-keyboard",
      description: "تکست باکس با انیمیشن و قابلیت RTL",
      category: "form",
      behavior: "clickable"
    },
    {
      key: "resizableElement",
      text: "المان قابل تغییر اندازه",
      url: `${root}/ResizableElement/ResizableElement.html`,
      icon: "fa-solid fa-expand-arrows-alt",
      description: "المان قابل drag & resize",
      category: "interaction",
      behavior: "clickable"
    }
  ];

  // Create the sidebar component
  const sidebar = document.createElement('sc-sidebar');
  sidebar.setAttribute('theme', 'light');
  sidebar.setAttribute('position', 'left');
  sidebar.setAttribute('width', '280px');
  sidebar.setAttribute('collapsible', 'true');
  sidebar.setAttribute('show-header', 'true');
  sidebar.setAttribute('show-footer', 'true');
  sidebar.setAttribute('searchable', 'true');
  sidebar.setAttribute('animations', 'true');
  sidebar.setAttribute('responsive', 'true');
  sidebar.setAttribute('remember-state', 'true');
  sidebar.setAttribute('title', 'کامپوننت‌ها');

  // Add items to sidebar
  items.forEach(itemData => {
    const item = document.createElement('sc-sidebar-item');
    Object.keys(itemData).forEach(key => {
      if (key !== 'children') {
        item.setAttribute(key, itemData[key]);
      }
    });
    
    // Add click handler for navigation
    item.addEventListener('sidebar-item-click', (e) => {
      if (e.detail.behavior === 'clickable') {
        openPage(itemData.url);
      }
    });
    
    sidebar.appendChild(item);
  });

  // Replace the existing sidebar content
  sidebarContainer.innerHTML = '';
  sidebarContainer.appendChild(sidebar);
}

function setupMobileSidebar() {
  if (!sidebarToggle || !sidebarOverlay) return;
  
  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
}

function toggleSidebar() {
  const sidebar = sidebarContainer.querySelector('sc-sidebar');
  if (sidebar) {
    // Use the component's mobile functionality
    if (sidebar.state && sidebar.state.mobileOpen) {
      sidebar.closeMobile();
    } else {
      sidebar.openMobile();
    }
  } else {
    // Fallback to old behavior
    sidebarContainer.classList.toggle("open");
    sidebarOverlay.classList.toggle("open");
  }
  
  // Update toggle button icon
  updateToggleButtonIcon();
}

function closeSidebar() {
  const sidebar = sidebarContainer.querySelector('sc-sidebar');
  if (sidebar && sidebar.closeMobile) {
    sidebar.closeMobile();
  } else {
    sidebarContainer.classList.remove("open");
    sidebarOverlay.classList.remove("open");
  }
  
  updateToggleButtonIcon();
}

function updateToggleButtonIcon() {
  const icon = sidebarToggle.querySelector("i");
  const sidebar = sidebarContainer.querySelector('sc-sidebar');
  
  if (sidebar && sidebar.state && sidebar.state.mobileOpen) {
    icon.className = "fa-solid fa-times";
  } else {
    icon.className = "fa-solid fa-bars";
  }
}

function openPage(path) {
  container.setAttribute("src", path);
  
  // Close mobile sidebar after navigation
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
  
  // Update active state in sidebar
  updateActiveSidebarItem(path);
}

function updateActiveSidebarItem(path) {
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  sidebarItems.forEach(item => {
    item.classList.remove("active");
  });
  
  // Find and activate the current item
  const currentItem = Array.from(sidebarItems).find(item => {
    const itemUrl = item.getAttribute("data-url");
    return itemUrl === path;
  });
  
  if (currentItem) {
    currentItem.classList.add("active");
  }
}

function loadDefaultComponent() {
  // Load the first component by default
  const firstComponent = `${root}/SpecialTextbox/SpecialTextbox.html`;
  container.setAttribute("src", firstComponent);
  
  // Set first sidebar item as active
  setTimeout(() => {
    const firstSidebarItem = document.querySelector(".sidebar-item");
    if (firstSidebarItem) {
      firstSidebarItem.classList.add("active");
    }
  }, 100);
}

// Handle iframe load events
window.addEventListener("message", (event) => {
  if (event.data.type === "componentLoaded") {
    // Component loaded successfully
    console.log("Component loaded:", event.data.component);
  }
});

// Add loading state to sidebar items
function addLoadingState(key) {
  const item = document.querySelector(`[data-key="${key}"]`);
  if (item) {
    item.classList.add("loading");
  }
}

function removeLoadingState(key) {
  const item = document.querySelector(`[data-key="${key}"]`);
  if (item) {
    item.classList.remove("loading");
  }
}

// Export functions for external use
window.SpecialComponents = {
  openPage,
  toggleSidebar,
  closeSidebar,
  addLoadingState,
  removeLoadingState
};
