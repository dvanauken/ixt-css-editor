import { Source } from 'postcss';

export type NodeType = 'root' | 'rule' | 'declaration' | 'comment' | 'at-rule';

export interface CSSNode {
  id: string;
  type: NodeType;
  value: string;
  parent?: string;
  children?: string[];
  enabled: boolean;
  metadata?: {
    selector?: string;
    property?: string;
    important?: boolean;
    errors?: ValidationError[];
  };
}

export interface ValidationError {
  type: 'syntax' | 'value' | 'property';
  message: string;
  severity: 'error' | 'warning';
}

export interface TreeOperation {
  type: 'update' | 'add' | 'remove' | 'move' | 'toggle';
  nodeId: string;
  data?: Partial<CSSNode>;
  prevParent?: string;
  newParent?: string;
  position?: number;
}

export interface TreeState {
  nodes: Map<string, CSSNode>;
  root: string;
  selectedNode?: string;
  validation: {
    hasErrors: boolean;
    errorCount: number;
    warningCount: number;
  };
}