import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Optional } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { PageManager } from '../../model/page-manager';
import { Theme } from '../../model/theme.enum';
import { PageConfig } from '../../model/page-config';
import { GenericDynamicAction, DynamicActionBuilder, ActionType, ActionScope } from '../../model/dynamic-action';
import { Subject } from 'rxjs';
import { PopoverRef } from '../../model/popover-ref';
import { DynamicUtil } from '../../model/dynamic-util';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'zee-dynamic-excel',
  templateUrl: './dynamic-excel.component.html',
  styleUrls: ['./dynamic-excel.component.scss']
})
export class DynamicExcelComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  manager: PageManager<any>;
  @Input()
  theme: Theme = Theme.dark;

  @ViewChild('exportTemplateLink')
  private exportTemplateLink: ElementRef;
  @ViewChild('file')
  private file: ElementRef;

  public ready = false;
  public pageConfig: PageConfig<any>;

  public selectedFile: File;
  public uploadInfo: string;
  public downloadInfo: string;
  public i18nParams: any;
  public isUploaderVisible: boolean;
  public title: string;
  public actions: Array<GenericDynamicAction<any>> = [];
  public progress: Subject<number>;
  public uploading = false;
  public uploadSuccessful = false;

  constructor(@Optional() private popoverRef: PopoverRef<PageManager<any>, any>) {
      super();
      this.isUploaderVisible = true;
      this.downloadInfo = null;
      this.uploadInfo = 'dynamic.excel.empty';
      this.i18nParams = {};

      this.initIfPopover();
  }

  private initIfPopover() {
      if (this.popoverRef && this.popoverRef.context) {
          this.manager = this.popoverRef.context;
          this.theme = this.popoverRef.config.theme ? this.popoverRef.config.theme : Theme.dark;
      }
  }

  ngOnInit() {
      this.clearFiles();
      this.setPageConfig(this.manager.config);

      this.collect = this.manager.ready().subscribe(isReady => {
          if (isReady) {
              this.ready = isReady;
              this.registerActions();
          }
      });
  }

  ngOnDestroy() {
      super.ngOnDestroy();
      if (this.actions) {
          this.actions.forEach(a => a.destroy());
          this.actions = undefined;
      }
  }

  private setPageConfig(config: PageConfig<any>) {
      this.pageConfig = config;
      this.title = this.pageConfig.pageTitle;
  }

  private registerAction(action: GenericDynamicAction<any>) {
      this.actions.push(action);
  }

  private registerActions(): void {
      let action: GenericDynamicAction<any> = null;

      if (this.pageConfig.canDownloadExcel) {
          action = new DynamicActionBuilder<any>('page.excel.export', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.exceldownload')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('download')
              .withOrder(101)
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.exportData();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      }

      if (this.pageConfig.canUploadExcel) {
          action = new DynamicActionBuilder<any>('page.excel.template', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.exceltemplate')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('table')
              .withOrder(102)
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.exportTemplate();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);

          action = new DynamicActionBuilder<any>('page.excel.import', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.excelupload')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('upload')
              .withOrder(103)
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.importData();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);

          action = new DynamicActionBuilder<any>('page.excel.import.cancel', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.cancel')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('trash-alt')
              .withOrder(104)
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.clearFiles();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);

          action = new DynamicActionBuilder<any>('page.excel.close', ActionType.CUSTOM)
              .withScope(ActionScope.PAGE)
              .withLabel('dynamic.action.back')
              .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
              .withIconClass('arrow-alt-circle-left')
              .withOrder(105)
              .withHandler((comp, d) => {
                  comp.disabled = true;
                  this.closePage();
                  comp.disabled = false;
              })
              .build();
          this.registerAction(action);
      }

      this.setActionStates();
  }

  public canUpload(): boolean {
      return this.pageConfig ? this.pageConfig.canUploadExcel : false;
  }

  public canDownload(): boolean {
      return this.pageConfig ? this.pageConfig.canDownloadExcel : false;
  }

  public clearDownloadInfo(): void {
      this.downloadInfo = null;
      this.uploadInfo = 'dynamic.excel.upload';
      this.i18nParams = {};
  }

  private clearFiles(): void {
      this.downloadInfo = null;
      this.uploadInfo = 'dynamic.excel.upload';
      this.i18nParams = {};
      this.selectedFile = undefined;
      if (this.file) {
          this.file.nativeElement.value = '';
      }
      this.setActionStates();
  }

  private closePage(): void {
      if (this.popoverRef) {
          this.popoverRef.close('Success');
      }
  }

  private setActionStates(): void {
      this.actions.forEach(a => {
          if (this.uploadSuccessful) {
              a.visible = 'page.excel.close' === a.id ? true : false;
          } else {
              if ('page.excel.template' === a.id) {
                  a.visible = this.selectedFile ? false : true;
              } else if ('page.excel.export' === a.id) {
                  a.visible = this.selectedFile ? false : true;
              } else if ('page.excel.import' === a.id) {
                  a.visible = this.selectedFile ? true : false;
                  a.disabled = this.uploading ? true : false;
              } else if ('page.excel.import.cancel' === a.id) {
                  a.visible = this.selectedFile ? true : false;
                  a.disabled = this.uploading ? true : false;
              } else if ('page.excel.close' === a.id) {
                  a.visible = this.uploadSuccessful ? true : false;
              }
          }
      });
  }

  public async exportTemplate(): Promise<void> {
      const blob = await this.manager.exportExcelTemplate();
      const fileName = this.toFileName(this.pageConfig.qualifier, 'Template');
      this.manager.convertToExcel(blob, fileName, this.exportTemplateLink);
      this.downloadInfo = 'dynamic.excel.templatesuccess';
      this.i18nParams = { filename: fileName };
  }

  public async exportData(): Promise<void> {
      const blob = await this.manager.exportExcelData();
      const fileName = this.toFileName(this.pageConfig.qualifier, 'Data');
      this.manager.convertToExcel(blob, fileName, this.exportTemplateLink);
      this.downloadInfo = 'dynamic.excel.downloadsuccess';
      this.i18nParams = { filename: fileName };
  }

  public importData(): void {
      this.setActionStates();
      if (!this.selectedFile) {
          this.clearFiles();
          return;
      }
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.progress = new Subject<number>();

      this.collect = this.manager.importExcelData(formData).subscribe(
          httpEvent => {
              if (httpEvent.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round((100 * httpEvent.loaded) / httpEvent.total);
                  this.progress.next(percentDone);
              } else if (httpEvent instanceof HttpResponse) {
                  const resource = httpEvent.body as Blob;
                  this.progress.complete();
                  this.uploadCompleted();
                  this.showUploadResult(resource);
              }
          },
          err => this.uploadCompleted(err)
      );

      this.collect = this.progress.subscribe(p => {
          this.uploadInfo = 'dynamic.excel.uploading';
          this.i18nParams = { filename: this.selectedFile.name, progress: p };
      });
  }

  private showUploadResult(resource: Blob): void {
      if (!resource) {
          return;
      }
      const fileName = this.toFileName(this.pageConfig.qualifier, 'Result');
      this.manager.convertToExcel(resource, fileName, this.exportTemplateLink);
  }

  private uploadCompleted(err?: any): void {
      if (err) {
          this.uploadInfo = 'dynamic.excel.uploadfail';
          this.i18nParams = { filename: this.selectedFile.name, message: err };
      } else {
          this.selectedFile = undefined;
          const fileName = this.toFileName(this.pageConfig.qualifier, 'Result');
          this.uploadInfo = 'dynamic.excel.uploadsuccess';
          this.i18nParams = { filename: fileName };
      }
      this.uploadSuccessful = true;
      this.uploading = false;
      this.setActionStates();
  }

  public onFilesAdded($event): void {
      this.downloadInfo = null;
      this.uploadInfo = 'dynamic.excel.empty';
      this.i18nParams = {};
      this.selectedFile = undefined;
      const files: { [key: string]: File } = $event.target.files;
      for (const key in files) {
          if (!isNaN(parseInt(key, 10))) {
              const file = files[key];
              const fileType = file.type;
              const fileName = file.name;
              if (
                  fileType.includes('excel') ||
                  fileType.includes('sheet') ||
                  fileName.endsWith('.xls') ||
                  fileName.endsWith('.xlsx') ||
                  fileName.endsWith('.csv')
              ) {
                  this.selectedFile = file;
                  this.uploadInfo = 'dynamic.excel.selectedfile';
                  this.i18nParams = { filename: this.selectedFile.name };
              }
          }
      }
      if (!this.selectedFile) {
          this.clearFiles();
      }
      this.setActionStates();
  }

  private toFileName(prefix: string, posfix: string): string {
      if (!posfix) {
          posfix = '';
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = this.pad(now.getMonth() + 1);
      const day = this.pad(now.getDate());
      const hour = this.pad(now.getHours());
      const min = this.pad(now.getMinutes());
      const sec = this.pad(now.getSeconds());
      const out = `${prefix}${posfix}_${year}${month}${day}_${hour}${min}${sec}.xlsx`;
      return out;
  }

  private pad(val: number): string {
      return ('00' + (val + 1)).slice(-2);
  }
}
