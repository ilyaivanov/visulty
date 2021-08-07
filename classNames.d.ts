//TODO: this screams for BEM. I need to consider using BEM to organize my classes

type ClassName =
  | "app"
  | "app-light"
  | "app-dark"
  | "player"
  | "gallery"
  | "tab"
  | "tab-title"
  | "main-tab"
  | "search-tab"
  | "search-tab_hidden"

  //ITEM TREE
  | "item-title"
  | "item-titleInput"
  | "item-row"
  | "item-row-title"
  | "item-container-row-title"
  | "item-row_selected"
  | "item-children-border"
  | "item-row-children"
  | "item-icon-svg"
  | "item-icon-circle"
  | "item-icon-chevron"
  | "item-icon-chevron_open"
  | "item-icon-chevron_visible"
  | "item-icon-chevron_active"
  | "hide"
  | "item-row_showOnHoverOrSelected"
  | "item-icon-circle_hidden"
  | "item-icon-image_square"
  | "item-icon-image_circle"
  | "item-icon-video"
  | "item-icon-image_closed"

  //DND
  | "item-dragAvatar"
  | "item-dragDestinationLine"
  | "item-dragDestinationBulp"

  //LEFT SIDEBAR
  | "left-sidebar"
  | "left-sidebar-item"
  | "left-sidebar-item-circle"
  | "left-sidebar-item-children"
  | "left-sidebar-item-chevron"
  | "left-sidebar-item-chevron-rotated"

  //HEADER
  | "header"
  | "header-icon"
  | "header-icon-disabled"
  | "header-icon-separator"
  | "header-icon-separator-svg"
  | "header-icon-text"
  | "header-icon-svg"
  | "header-icon-svg-rotated"
  | "header-context-menu"
  | "header-context-menu-visible"
  | "header-context-menu-item"
  | "header-context-menu-item-active"

  //MODAL
  | "modal-overlay"
  | "modal"
  | "modal-input"
  | "modal-row-item"
  | "modal-row-item-highlight"
  | "modal-row-list"
  | "modal-row-item-selected";
