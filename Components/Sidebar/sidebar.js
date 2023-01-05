class Sidebar {
  #items;
  #setting;
  #itemClassList = ["sidebar-item"];
  #prefix_sidebar_name = "sidebar-item-";
  constructor(items = [], setting = {}) {
    this.#items = items;
    this.#setting = setting;
  }

  build = () => {
    if (!this.#items | !this.#setting | !this.#setting.sidebarContainer) {
      return;
    }

    const sidebarContainer = this.#setting.sidebarContainer;
    const itemsList = this.#items.map((item) => this.#createSidebarItem(item));

    sidebarContainer.append(...itemsList);
  };

  #createSidebarItem = (sidebarItem) => {
    const control = document.createElement("i");
    control.id = this.#prefix_sidebar_name + sidebarItem.key;
    control.innerText = sidebarItem.text;
    if (this.#setting.itemClassList) {
      this.#itemClassList.push(this.#setting.itemClassList);
    }
    control.classList.add(...this.#itemClassList);
    if (this.#setting.itemClick) {
      control.addEventListener("click", (e) => {
        this.#items.map((item) => {
          item.selected = item.key === sidebarItem.key;
          document
            .getElementById(this.#prefix_sidebar_name + item.key)
            .classList.remove("active");
        });

        e.target.classList.add("active");
        this.#setting.itemClick(sidebarItem.url);
      });
    }

    return control;
  };
}

export { Sidebar };
