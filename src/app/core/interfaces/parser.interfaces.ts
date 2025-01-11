import { EditorNode } from '@core/models/editor-tree.model';
import { Root, Node, Rule, Declaration, Input } from 'postcss';

export interface CSSParserConfig {
  sourcemap?: boolean;
  position?: boolean;
  from?: string;
}

export interface ParserResult {
  ast: PostCSSASTNode;
  errors?: ParserError[];
}

export interface ParserError {
  message: string;
  line?: number;
  column?: number;
  source: string;
  severity: 'error' | 'warning';
}


// Node Types
export interface PostCSSASTNode {
  type: string;
  source?: Source;
  nodes?: PostCSSASTNode[];
  parent?: PostCSSASTNode;
}

export interface RuleNode extends PostCSSASTNode {
  type: 'rule';
  selector: string;
  nodes: DeclarationNode[];
}

export interface DeclarationNode extends PostCSSASTNode {
  type: 'decl';
  prop: string;
  value: string;
  important?: boolean;
}

export interface AtRuleNode extends PostCSSASTNode {
  type: 'atrule';
  name: string;
  params: string;
  nodes?: PostCSSASTNode[];
}

export interface CommentNode extends PostCSSASTNode {
  type: 'comment';
  text: string;
}

// Parser Types
export interface CSSParserConfig {
  sourcemap?: boolean;
  position?: boolean;
  from?: string;
}

export interface ParserResult {
  ast: PostCSSASTNode;
  errors?: ParserError[];
}

export interface ParserError {
  message: string;
  line?: number;
  column?: number;
  source: string;
  severity: 'error' | 'warning';
}

export interface TransformationResult {
  css: string;
  map?: any;
  errors?: ParserError[];
}

export interface ASTTransformer {
  transformToEditorTree(ast: Root): EditorNode;
  transformToPostCSS(node: EditorNode): Root;
}

export interface RuleNode extends PostCSSASTNode {
  type: 'rule';
  selector: string;
  nodes: DeclarationNode[];
}

export interface DeclarationNode extends PostCSSASTNode {
  type: 'decl';
  prop: string;
  value: string;
  important?: boolean;
}

export interface CommentNode extends PostCSSASTNode {
  type: 'comment';
  text: string;
}

export interface AtRuleNode extends PostCSSASTNode {
  type: 'atrule';
  name: string;
  params: string;
  nodes?: PostCSSASTNode[];
}

export interface TransformationResult {
  css: string;
  map?: any;
  errors?: ParserError[];
}

export interface ASTTransformer {
  transformToEditorTree(ast: Root): EditorNode;
  transformToPostCSS(node: EditorNode): Root;
}

export interface Source {
  input: Input;
  start: { line: number; column: number };
  end: { line: number; column: number };
}

export interface PostCSSSource {
  input: Input;
  start: { line: number; column: number };
  end: { line: number; column: number };
}

export interface PostCSSASTNode {
  type: string;
  source?: PostCSSSource;
  nodes?: PostCSSASTNode[];
  parent?: PostCSSASTNode;
}