import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-typed-text',
  template: `<div *ngIf="showText" class="typed-text">{{ typedText }}</div>`,
  styleUrls: ['./typed-text.component.scss']
})
export class TypedTextComponent {
  showText = false;
  typedText: string = '';

  @Output() typedTextChanged = new EventEmitter<string>();

  /**
   * Listens for keyboard events and updates typedText accordingly.
   * Emits the typed text whenever it changes.
   * @param event The keyboard event.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.typedText = this.typedText.slice(0, -1);
    } else if (/^[a-zA-Z\s]$/.test(event.key)) {
      this.typedText += event.key;
      this.showText = true;

      this.typedTextChanged.emit(this.typedText);
    } else if (event.key === 'Enter'){
      this.typedText = '';
    }
  }
}
