import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TreeManagerService } from '../../../../core/services/tree-manager.service';
import { EditorNode } from '../../../../core/models/editor-tree.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TreeViewComponent implements OnInit, OnDestroy {
  editingNode?: EditorNode;
  nodeForm: FormGroup;
  private subscription?: Subscription;
  nodes$ = this.treeManager.getTree(); // Add this public property

  constructor(
    private treeManager: TreeManagerService,
    private fb: FormBuilder
  ) {
    this.nodeForm = this.createNodeForm();
  }

  ngOnInit(): void {
    this.subscription = this.treeManager.getTree().subscribe(root => {
      // Handle tree updates
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private createNodeForm(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      value: [''],
      selector: [''],
      property: [''],
      important: [false]
    });
  }

  private updateForm(node: EditorNode): void {
    this.nodeForm.patchValue({
      type: node.type,
      value: node.metadata.value || '',
      selector: node.metadata.selector || '',
      property: node.metadata.property || '',
      important: node.metadata.important || false
    });
  }

  onNodeSelect(node: EditorNode): void {
    if (this.editingNode?.id === node.id) return;
    this.editingNode = node;
    this.updateForm(node);
  }

  onSubmit(): void {
    if (!this.editingNode || !this.nodeForm.valid) return;
    const formValue = this.nodeForm.value;
    const updates = {
      value: formValue.value,
      selector: formValue.selector,
      property: formValue.property,
      important: formValue.important
    };

    this.treeManager.updateNode(this.editingNode.id, updates);
  }



  hasErrors(node: EditorNode | undefined): boolean {
    if (!node) return false;
    return node.metadata.errors?.some(error => error.severity === 'error') || false;
  }

  hasWarnings(node: EditorNode | undefined): boolean {
    if (!node) return false;
    return node.metadata.errors?.some(error => error.severity === 'warning') || false;
  }

}