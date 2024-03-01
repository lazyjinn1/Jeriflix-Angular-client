// typed-text.component.ts
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.typedText = this.typedText.slice(0, -1);
    } else if (/^[a-zA-Z\s]$/.test(event.key)) {
      this.typedText += event.key;
      this.showText = true;

      this.typedTextChanged.emit(this.typedText);

      setTimeout(() => {
        this.showText = false;
        this.typedText = '';
      }, 1500);
    }
  }
}
