
// preview.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SafeHtml } from '@angular/platform-browser';
import { PreviewService } from '@core/services/preview.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Input() initialContent: string = '';
  
  previewContent: SafeHtml = '';
  isPreviewVisible: boolean = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private previewService: PreviewService) {}

  ngOnInit() {
    this.setupPreviewSubscription();
    if (this.initialContent) {
      this.updatePreview(this.initialContent);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupPreviewSubscription() {
    this.previewService.previewUpdate$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (content) => this.updatePreview(content),
        error: (err) => this.handleError(err)
      });
  }

  private updatePreview(content: string) {
    try {
      this.previewContent = this.previewService.sanitizeContent(content);
      this.error = null;
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: any) {
    this.error = err?.message || 'An error occurred while updating the preview';
    console.error('Preview error:', err);
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  refreshPreview() {
    this.previewService.refreshPreview();
  }
}

