
// toolbar.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TreeManagerService } from '@core/services/tree-manager.service';

export interface ToolbarAction {
  type: 'add' | 'delete' | 'undo' | 'redo' | 'save' | 'load';
  payload?: any;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() action = new EventEmitter<ToolbarAction>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  canUndo: boolean = false;
  canRedo: boolean = false;
  canAdd: boolean = true;
  canDelete: boolean = false;
  validationMessage: string | null = null;
  hasError: boolean = false;

  constructor(private treeManager: TreeManagerService) {
    this.subscribeToTreeManager();
  }

  ngOnInit() {
    // Subscribe to tree manager updates
    this.treeManager.stateChanges$.subscribe(state => {
      this.canUndo = state.canUndo;
      this.canRedo = state.canRedo;
      this.canDelete = state.hasSelection;
      this.validationMessage = state.validationMessage;
    });
  }

  private subscribeToTreeManager() {
    this.treeManager.getState().subscribe(state => {
      this.canUndo = state.canUndo;
      this.canRedo = state.canRedo;
      this.canDelete = state.hasSelection;
      this.validationMessage = state.validationMessage;
      this.hasError = state.hasError;
    });
  }

  emitAction(type: ToolbarAction['type']) {
    this.action.emit({ type });
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.action.emit({ type: 'load', payload: content });
      };
      reader.readAsText(file);
    }
  }
}

