import { Root, Rule, Declaration, AtRule, Comment, ChildNode } from 'postcss';
import { PostCSSASTNode, RuleNode, DeclarationNode, AtRuleNode, CommentNode } from '../interfaces/parser.interfaces';
import * as postcss from 'postcss';

export class PostCSSASTModel {
  private root: Root;

  constructor(root: Root) {
    this.root = root;
  }

  public toInternalAST(): PostCSSASTNode {
    return this.transformNode(this.root);
  }

  private transformNode(node: any): PostCSSASTNode {
    switch (node.type) {
      case 'root':
        return {
          type: 'root',
          nodes: node.nodes?.map((child: postcss.ChildNode) => this.transformNode(child)) || [],
          source: this.extractSource(node)
        };

      case 'rule':
        return this.transformRule(node);

      case 'decl':
        return this.transformDeclaration(node);

      case 'atrule':
        return this.transformAtRule(node);

      case 'comment':
        return this.transformComment(node);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private transformRule(rule: Rule): RuleNode {
    return {
      type: 'rule',
      selector: rule.selector,
      nodes: rule.nodes?.map(node => this.transformNode(node)) as DeclarationNode[],
      source: this.extractSource(rule)
    };
  }

  private transformDeclaration(decl: Declaration): DeclarationNode {
    return {
      type: 'decl',
      prop: decl.prop,
      value: decl.value,
      important: decl.important,
      source: this.extractSource(decl)
    };
  }

  private transformAtRule(atRule: AtRule): AtRuleNode {
    return {
      type: 'atrule',
      name: atRule.name,
      params: atRule.params,
      nodes: atRule.nodes?.map(node => this.transformNode(node)),
      source: this.extractSource(atRule)
    };
  }

  private transformComment(comment: Comment): CommentNode {
    return {
      type: 'comment',
      text: comment.text,
      source: this.extractSource(comment)
    };
  }

  private extractSource(node: any) {
    if (node.source) {
      return {
        start: {
          line: node.source.start?.line || 0,
          column: node.source.start?.column || 0
        },
        end: {
          line: node.source.end?.line || 0,
          column: node.source.end?.column || 0
        }
      };
    }
    return undefined;
  }
}