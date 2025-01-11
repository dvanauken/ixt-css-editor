import { Injectable } from '@angular/core';
import { EditorNode, EditorTreeModel, NodeMetadata } from '../models/editor-tree.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeState, TreeOperation, CSSNode } from '@core/interfaces/tree.interfaces';
import { PreviewService } from './preview.service';

@Injectable({
  providedIn: 'root'
})
export class TreeManagerService {
  private stateSubject = new BehaviorSubject<TreeState>({
    canUndo: false,
    canRedo: false,
    hasSelection: false,
    validationMessage: null
  });

  private treeModel: EditorTreeModel;
  private treeSubject: BehaviorSubject<EditorNode>;
  stateChanges$ = this.stateSubject.asObservable();

  constructor(private previewService: PreviewService) {
    this.treeModel = new EditorTreeModel();
    this.treeSubject = new BehaviorSubject<EditorNode>(this.treeModel.getRoot());
  }

  public getTree(): Observable<EditorNode> {
    return this.treeSubject.asObservable();
  }

  public updateNode(id: string, metadata: NodeMetadata): boolean {
    const success = this.treeModel.updateNode(id, metadata);
    if (success) {
      this.notifyTreeUpdate();
      this.updatePreview();
    }
    return success;
  }

  public addNode(parentId: string, type: EditorNode['type'], metadata: NodeMetadata): EditorNode | null {
    const newNode = this.treeModel.addNode(parentId, type, metadata);
    if (newNode) {
      this.notifyTreeUpdate();
      this.updatePreview();
    }
    return newNode;
  }

  public removeNode(id: string): boolean {
    const success = this.treeModel.removeNode(id);
    if (success) {
      this.notifyTreeUpdate();
      this.updatePreview();
    }
    return success;
  }

  public toggleNode(id: string): boolean {
    const success = this.treeModel.toggleNode(id);
    if (success) {
      this.notifyTreeUpdate();
      this.updatePreview();
    }
    return success;
  }

  public moveNode(nodeId: string, newParentId: string, index?: number): boolean {
    const node = this.treeModel.getNodeById(nodeId);
    const newParent = this.treeModel.getNodeById(newParentId);
    if (!node || !newParent) {
      return false;
    }

    const oldParent = node.parent;
    if (!oldParent) {
      return false;
    }

    const oldIndex = oldParent.children.indexOf(node);
    if (oldIndex > -1) {
      oldParent.children.splice(oldIndex, 1);
    }

    if (typeof index === 'number' && index >= 0 && index <= newParent.children.length) {
      newParent.children.splice(index, 0, node);
    } else {
      newParent.children.push(node);
    }

    node.parent = newParent;
    this.notifyTreeUpdate();
    this.updatePreview();
    return true;
  }

  public getNodeById(id: string): EditorNode | undefined {
    return this.treeModel.getNodeById(id);
  }

  public setTree(root: EditorNode): void {
    this.treeModel = new EditorTreeModel();
    this.recursivelyAddNodes(root, this.treeModel.getRoot().id);
    this.notifyTreeUpdate();
    this.updatePreview();
  }

  private recursivelyAddNodes(node: EditorNode, parentId: string): void {
    const newNode = this.treeModel.addNode(parentId, node.type, node.metadata);
    if (newNode) {
      node.children.forEach(child => {
        this.recursivelyAddNodes(child, newNode.id);
      });
    }
  }

  private notifyTreeUpdate(): void {
    this.treeSubject.next(this.treeModel.getRoot());
  }


  // src/app/core/services/tree-manager.service.ts
  updatePreview(): void {
    const cssString = this.treeModel.generateCss(); // Add this method to your tree model
    this.previewService.updatePreview(cssString);
  }
}