// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from './features/editor/editor.module';
import { ToolbarAction } from './features/editor/components/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, EditorModule]
})
export class AppComponent {
  title = 'ixt-css-editor';

  handleToolbarAction(event: ToolbarAction): void {
    switch (event.type) {
      case 'add':
        console.log('Add action triggered');
        break;
      case 'delete':
        console.log('Delete action triggered');
        break;
      case 'undo':
        console.log('Undo action triggered');
        break;
      case 'redo':
        console.log('Redo action triggered');
        break;
      case 'save':
        console.log('Save action triggered');
        break;
      case 'load':
        console.log('Load action triggered', event.payload);
        break;
      default:
        console.warn('Unknown action:', event);
    }
  }
}