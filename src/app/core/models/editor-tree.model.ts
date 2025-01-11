
export type EditorNodeType = 'rule' | 'declaration' | 'atrule' | 'comment' | 'root';

export interface EditorNode {
  id: string;
  type: EditorNodeType;
  parent?: EditorNode;
  children: EditorNode[];
  enabled: boolean;
  metadata: NodeMetadata;
}

import { ValidationError } from '@core/interfaces/tree.interfaces';
import { Source } from 'postcss';


export interface NodeMetadata {
  selector?: string;
  property?: string;
  value?: string;
  important?: boolean;
  atRuleName?: string;
  atRuleParams?: string;
  commentText?: string;
  source?: Source;
  errors?: ValidationError[];  // Add this line
}

export class EditorTreeModel {
  private root: EditorNode;
  private nodeMap: Map<string, EditorNode>;

  constructor() {
    this.nodeMap = new Map();
    this.root = this.createNode('root', 'root', {});
  }

  public getRoot(): EditorNode {
    return this.root;
  }

  public getNodeById(id: string): EditorNode | undefined {
    return this.nodeMap.get(id);
  }

  public addNode(
    parentId: string,
    type: EditorNode['type'],
    metadata: NodeMetadata
  ): EditorNode | null {
    const parent = this.getNodeById(parentId);
    if (!parent) return null;

    const newNode = this.createNode(this.generateId(), type, metadata);
    newNode.parent = parent;
    parent.children.push(newNode);
    this.nodeMap.set(newNode.id, newNode);

    return newNode;
  }

  public removeNode(id: string): boolean {
    const node = this.getNodeById(id);
    if (!node || !node.parent) return false;

    const parentNode = node.parent;
    const index = parentNode.children.indexOf(node);
    if (index > -1) {
      parentNode.children.splice(index, 1);
      this.removeNodeFromMap(node);
      return true;
    }
    return false;
  }

  public updateNode(id: string, metadata: Partial<NodeMetadata>): boolean {
    const node = this.getNodeById(id);
    if (!node) return false;

    node.metadata = { ...node.metadata, ...metadata };
    return true;
  }

  public toggleNode(id: string): boolean {
    const node = this.getNodeById(id);
    if (!node) return false;

    node.enabled = !node.enabled;
    return true;
  }

  private createNode(
    id: string,
    type: EditorNode['type'],
    metadata: NodeMetadata
  ): EditorNode {
    const node: EditorNode = {
      id,
      type,
      children: [],
      enabled: true,
      metadata
    };
    this.nodeMap.set(id, node);
    return node;
  }

  private removeNodeFromMap(node: EditorNode): void {
    this.nodeMap.delete(node.id);
    node.children.forEach(child => this.removeNodeFromMap(child));
  }

  private generateId(): string {
    return `node_${Math.random().toString(36).substr(2, 9)}`;
  }
}