import { Injectable } from '@angular/core';
import postcss, { Root, Parser, Warning } from 'postcss';
import { Observable, from, catchError, map } from 'rxjs';
import { CSSParserConfig, ParserResult, ParserError } from '../interfaces/parser.interfaces';
import { PostCSSASTModel } from '../models/postcss-ast.model';

@Injectable({
  providedIn: 'root'
})
export class CSSParserService {
  private parser: Parser;

  constructor() {
    this.parser = postcss.parse;
  }

  public parseCSS(css: string, config: CSSParserConfig = {}): Observable<ParserResult> {
    return from(this.parseAsync(css, config)).pipe(
      map(result => ({
        ast: new PostCSSASTModel(result.root).toInternalAST(),
        errors: result.warnings.map((warning: postcss.Warning) => this.convertWarningToError(warning))
      })),
      catchError(error => {
        throw this.handleParseError(error);
      })
    );
  }

  public async stringify(root: Root, config: CSSParserConfig = {}): Promise<string> {
    try {
      const result = await postcss().process(root, {
        from: config.from,
        map: config.sourcemap ? { inline: true } : false
      });
      return result.css;
    } catch (error) {
      throw this.handleParseError(error);
    }
  }

  private async parseAsync(css: string, config: CSSParserConfig): Promise<any> {
    try {
      return await postcss().process(css, {
        from: config.from,
        map: config.sourcemap ? { inline: true } : false
      });
    } catch (error) {
      throw this.handleParseError(error);
    }
  }

  private convertWarningToError(warning: Warning): ParserError {
    return {
      message: warning.text,
      line: warning.line,
      column: warning.column,
      source: warning.source,
      severity: 'warning'
    };
  }

  private handleParseError(error: any): ParserError {
    return {
      message: error.message,
      line: error.line,
      column: error.column,
      source: error.source,
      severity: 'error'
    };
  }
}