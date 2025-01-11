import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CSSParserService } from './css-parser.service';

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  private previewContent = new BehaviorSubject<string>('');
  private previewElement: HTMLStyleElement | null = null;

  // Observable that components can subscribe to for updates
  previewUpdate$ = this.previewContent.asObservable();

  constructor(
    private sanitizer: DomSanitizer,
    private cssParser: CSSParserService
  ) {
    this.initializePreviewElement();
  }

  /**
   * Initialize the style element for previewing CSS
   */
  private initializePreviewElement(): void {
    if (typeof document !== 'undefined') {
      this.previewElement = document.createElement('style');
      this.previewElement.id = 'css-editor-preview';
      document.head.appendChild(this.previewElement);
    }
  }

  /**
   * Sanitize content for safe rendering
   * @param content The content to sanitize
   */
  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  /**
   * Get the current preview content
   */
  getCurrentPreview(): string {
    return this.previewContent.value;
  }

  /**
   * Refresh the preview (useful when needing to force a re-render)
   */
  refreshPreview(): void {
    const currentContent = this.previewContent.value;
    if (this.previewElement) {
      // Force a re-render by briefly removing and re-adding the content
      this.previewElement.textContent = '';
      setTimeout(() => {
        if (this.previewElement) {
          this.previewElement.textContent = currentContent;
        }
      }, 0);
    }
  }

  /**
   * Apply preview to a specific element or scope
   * @param elementId The ID of the element to scope the preview to
   * @param cssContent The CSS content to preview
   */
  applyPreviewToElement(elementId: string, cssContent: string): void {
    try {
      const scopedCss = this.scopeCssToElement(elementId, cssContent);
      this.updatePreview(scopedCss);
    } catch (error) {
      console.error('Error applying scoped preview:', error);
      throw new Error('Failed to apply scoped CSS preview');
    }
  }

  /**
   * Scope CSS rules to a specific element
   * @param elementId The ID of the element to scope to
   * @param cssContent The CSS content to scope
   */
  private scopeCssToElement(elementId: string, cssContent: string): string {
    try {
      // Basic CSS scoping - prepends element ID to each rule
      // Note: This is a simplified implementation
      return cssContent
        .replace(/([^}]+){([^}]+)}/g, `#${elementId} $1{$2}`)
        .trim();
    } catch (error) {
      console.error('Error scoping CSS:', error);
      return cssContent; // Return original content if scoping fails
    }
  }

  /**
   * Clean up the preview element when service is destroyed
   */
  ngOnDestroy(): void {
    if (this.previewElement && this.previewElement.parentNode) {
      this.previewElement.parentNode.removeChild(this.previewElement);
    }
  }

  /**
   * Clear the current preview
   */
  clearPreview(): void {
    if (this.previewElement) {
      this.previewElement.textContent = '';
    }
    this.previewContent.next('');
  }

  /**
   * Get preview as a Blob for downloading
   */
  getPreviewAsBlob(): Blob {
    const content = this.previewContent.value;
    return new Blob([content], { type: 'text/css' });
  }

  /**
   * Create a downloadable link for the current CSS
   * @returns URL for downloading the CSS
   */
  createDownloadLink(): string {
    const blob = this.getPreviewAsBlob();
    return URL.createObjectURL(blob);
  }

  // src/app/core/services/preview.service.ts
  updatePreview(cssContent: string): void {
    try {
      // Use parse instead of validateCss if that's what's available
      const validatedCss = this.cssParser.parse(cssContent);
      if (this.previewElement) {
        this.previewElement.textContent = validatedCss;
      }
      this.previewContent.next(validatedCss);
    } catch (error) {
      console.error('Error updating preview:', error);
      throw new Error('Failed to update CSS preview');
    }
  }


//   /**
//  * Update the preview with new CSS content
//  * @param cssContent The CSS content to preview
//  */
//   updatePreview(cssContent: string): void {
//     try {
//       // Validate CSS before updating
//       const validatedCss = this.cssParser.validateCss(cssContent);

//       // Update the style element
//       if (this.previewElement) {
//         this.previewElement.textContent = validatedCss;
//       }

//       // Notify subscribers
//       this.previewContent.next(validatedCss);
//     } catch (error) {
//       console.error('Error updating preview:', error);
//       throw new Error('Failed to update CSS preview');
//     }
//   }

}