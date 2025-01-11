import { Injectable } from '@angular/core';
import { Root } from 'postcss';
import { EditorNode, EditorTreeModel, NodeMetadata, EditorNodeType } from '../models/editor-tree.model';
import { PostCSSASTNode, RuleNode, DeclarationNode, AtRuleNode, CommentNode } from '../interfaces/parser.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ASTBuilderService {
  private treeModel: EditorTreeModel;

  constructor() {
    this.treeModel = new EditorTreeModel();
  }

  public buildEditorTree(postCSSAst: PostCSSASTNode): EditorNode {
    this.treeModel = new EditorTreeModel();
    return this.transformNode(postCSSAst, this.treeModel.getRoot().id);
  }

  private transformNode(node: PostCSSASTNode, parentId: string): EditorNode {
    const metadata = this.createNodeMetadata(node);
    const newNode = this.treeModel.addNode(parentId, node.type as EditorNodeType, metadata);

    if (!newNode) {
      throw new Error(`Failed to create node of type ${node.type}`);
    }

    if (node.nodes) {
      node.nodes.forEach((childNode: PostCSSASTNode) => {
        this.transformNode(childNode, newNode.id);
      });
    }

    return newNode;
  }

  private createNodeMetadata(node: PostCSSASTNode): NodeMetadata {
    const metadata: NodeMetadata = {
      source: node.source
    };

    switch (node.type) {
      case 'rule':
        const ruleNode = node as RuleNode;
        metadata.selector = ruleNode.selector;
        break;

      case 'decl':
        const declNode = node as DeclarationNode;
        metadata.property = declNode.prop;
        metadata.value = declNode.value;
        metadata.important = declNode.important;
        break;

      case 'atrule':
        const atRuleNode = node as AtRuleNode;
        metadata.atRuleName = atRuleNode.name;
        metadata.atRuleParams = atRuleNode.params;
        break;

      case 'comment':
        const commentNode = node as CommentNode;
        metadata.commentText = commentNode.text;
        break;
    }

    return metadata;
  }
}