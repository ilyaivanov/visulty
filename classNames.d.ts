//TODO: this screams for BEM. I need to consider using BEM to organize my classes

type ClassName =
  | "app"
  | "app-light"
  | "app-dark"
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
  | "item-icon-download-container"
  | "item-icon-download"
  | "item-icon-download-spinner"
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
  | "left-sidebar-hidden"
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

  //PLAYER
  | "player"
  | "player-iframe"
  | "player-iframeHidden"
  | "play-button"
  | "text-area"
  | "text-area-titles-container"
  | "text-area-item-path"
  | "text-area-item-path-element"
  | "text-area-title"
  | "footer-icon"
  | "footer-video-image"
  | "footer-icon-play-previous"
  | "footer-icon-container"
  | "player-progress-container-padding"
  | "player-progress-container"
  | "player-progress-buffer"
  | "player-progress-ellapsed"
  | "player-progress-bulp"
  | "player-progress-text"

  //RIGHT SIDEBAR (part of PLAYER feature)
  | "right-sidebar"
  | "right-sidebar-label"
  | "right-sidebar-queue-title"
  | "right-sidebar-queue-title_currentlyPlayed"
  | "right-sidebar-hidden"
  | "right-sidebar-item"
  | "right-sidebar-item-image"
  | "right-sidebar-item-title"

  //MODAL
  | "modal-overlay"
  | "modal"
  | "modal-input"
  | "modal-row-item"
  | "modal-row-item-highlight"
  | "modal-row-list"
  | "modal-row-item-selected";
