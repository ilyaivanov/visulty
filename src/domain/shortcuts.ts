import { UIState } from "./uiState";

export class Shortcuts {
  constructor(private uiState: UIState) {
    document.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown")
      this.preventDefault(e, this.uiState.moveSelectionDown);
    if (e.key === "ArrowUp")
      this.preventDefault(e, this.uiState.moveSelectionUp);
    if (e.key === "ArrowLeft")
      this.preventDefault(e, this.uiState.moveSelectionLeft);
    if (e.key === "ArrowRight")
      this.preventDefault(e, this.uiState.moveSelectionRight);
    if (e.key === "1" && e.ctrlKey)
      this.preventDefault(e, this.switchToMainTab);
    if (e.key === "2" && e.ctrlKey)
      this.preventDefault(e, this.switchToSearchTab);
  };

  switchToMainTab = () => this.uiState.focusOnTab("main");

  switchToSearchTab = () => this.uiState.focusOnTab("search");

  preventDefault = (e: KeyboardEvent, action: () => void) => {
    e.preventDefault();
    action();
  };
}
