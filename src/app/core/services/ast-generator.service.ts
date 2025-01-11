import { Injectable } from '@angular/core';
import postcss, { Root, Rule, AtRule, Declaration, Comment } from 'postcss';
import { EditorNode } from '../models/editor-tree.model';

@Injectable({
  providedIn: 'root'
})
export class ASTGeneratorService {
  
  public generatePostCSSAST(editorNode: EditorNode): Root {
    const root = postcss.root();
    if (editorNode.type !== 'root') {
      throw new Error('Expected root node as input');
    }
    
    this.processChildren(editorNode, root);
    return root;
  }

  private processChildren(editorNode: EditorNode, parentNode: Root | Rule | AtRule): void {
    if (!editorNode.enabled) return;

    editorNode.children.forEach(child => {
      if (!child.enabled) return;

      const node = this.createPostCSSNode(child);
      if (node) {
        parentNode.append(node);
        if (child.children.length > 0 && (child.type === 'rule' || child.type === 'atrule')) {
          this.processChildren(child, node as Rule | AtRule);
        }
      }
    });
  }

  private createPostCSSNode(node: EditorNode): Rule | AtRule | Declaration | Comment | null {
    switch (node.type) {
      case 'rule':
        return this.createRule(node);

      case 'atrule':
        return this.createAtRule(node);

      case 'decl':
        return this.createDeclaration(node);

      case 'comment':
        return this.createComment(node);

      default:
        console.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }

  private createRule(node: EditorNode): Rule {
    if (!node.metadata.selector) {
      throw new Error('Rule node missing selector');
    }
    
    const rule = postcss.rule({
      selector: node.metadata.selector,
      source: node.metadata.source
    });
    
    return rule;
  }

  private createAtRule(node: EditorNode): AtRule {
    if (!node.metadata.atRuleName) {
      throw new Error('AtRule node missing name');
    }

    const atRule = postcss.atRule({
      name: node.metadata.atRuleName,
      params: node.metadata.atRuleParams || '',
      source: node.metadata.source
    });

    return atRule;
  }

  private createDeclaration(node: EditorNode): Declaration {
    if (!node.metadata.property || !node.metadata.value) {
      throw new Error('Declaration node missing property or value');
    }

    const decl = postcss.decl({
      prop: node.metadata.property,
      value: node.metadata.value,
      important: node.metadata.important,
      source: node.metadata.source
    });

    return decl;
  }

  private createComment(node: EditorNode): Comment {
    if (!node.metadata.commentText) {
      throw new Error('Comment node missing text');
    }

    const comment = postcss.comment({
      text: node.metadata.commentText,
      source: node.metadata.source
    });

    return comment;
  }
}