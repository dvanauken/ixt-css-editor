import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { PreviewComponent } from './components/preview/preview.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    PreviewComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreeViewComponent  // Moved here since it's standalone
  ],
  exports: [
    TreeViewComponent,
    PreviewComponent,
    ToolbarComponent
  ]
})
export class EditorModule { }