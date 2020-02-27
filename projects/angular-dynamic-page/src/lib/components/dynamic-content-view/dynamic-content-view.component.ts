import { Component, OnInit, Input, OnDestroy, Optional } from '@angular/core';
import { DynamicBaseComponent } from '../../model/dynamic-base-component';
import { Observable } from 'rxjs';
import { ContentContext } from './model/content-context';
import { ColumnMetadata } from '../../model/column-metadata';
import { PageMetamodel } from '../../model/page-metamodel';
import { DynamicMetamodelService } from '../../services/dynamic-metamodel.service';
import { PopoverRef } from '../../model/popover-ref';
import { Theme } from '../../model/theme.enum';
import { ManagerType } from '../../model/manager-type.enum';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ColumnType } from '../../model/column-type.enum';
import { DynamicAlertManagerService } from '../../services/dynamic-alert-manager.service';

@Component({
  selector: 'zee-dynamic-content-view',
  templateUrl: './dynamic-content-view.component.html',
  styleUrls: ['./dynamic-content-view.component.scss']
})
export class DynamicContentViewComponent extends DynamicBaseComponent implements OnInit, OnDestroy {
  @Input()
  content: Observable<ContentContext>;

  ctx: ContentContext;
  columns: Array<ColumnMetadata>;
  metamodel: PageMetamodel;
  ready: boolean;

  get entity(): any {
      return this.ctx ? this.ctx.entity : null;
  }

  get qualifier(): string {
      return this.ctx ? this.ctx.qualifier : null;
  }

  constructor(
      private dynamicMetamodelService: DynamicMetamodelService,
      private alertManagerService: DynamicAlertManagerService,
      @Optional() private popoverRef: PopoverRef<{ ctx: ContentContext; theme: Theme }, any>
  ) {
      super();
      this.ready = false;
      this.columns = new Array<ColumnMetadata>();
      this.initIfPopover();
  }

  private initIfPopover() {
      if (this.popoverRef && this.popoverRef.context) {
          this.setupViewFor(this.popoverRef.context.ctx);
          // this.theme = this.popoverRef.context.theme ? this.popoverRef.context.theme : Theme.dark;
      }
  }

  get managerType(): ManagerType {
      return ManagerType.PAGE;
  }

  ngOnInit() {
      if (this.content) {
          this.collect = this.content.subscribe(context => this.setupViewFor(context));
      }
  }

  ngOnDestroy() {
      super.ngOnDestroy();
  }

  private setupViewFor(context: ContentContext): void {
      this.ready = false;
      if (!context || !context.qualifier || !context.entity) {
          return;
      }
      this.ctx = context;
      this.metamodel = undefined;

      const mm = this.dynamicMetamodelService.getCachedMetamodel(this.qualifier, this.ctx.microserviceName);
      if (mm) {
          this.metamodel = mm;
          this.handleView();
          return;
      }
      this.collect = this.dynamicMetamodelService.metadataOf(this.qualifier, this.ctx.microserviceName, this.ctx.appPathPrefix).subscribe(
          (res: HttpResponse<PageMetamodel>) => {
              this.metamodel = res.body;
              this.handleView();
          },
          (res: HttpErrorResponse) => {
              const err = `Could not find metadata of: ${this.qualifier}`;
              this.alertManagerService.warning({msg: err, i18n: false});
          }
      );
  }

  private filterView(cmd: ColumnMetadata, scope: Array<string>): boolean {
      if (cmd.columnType === ColumnType.ASSOCIATION) {
          return false;
      }
      if (scope && scope.length > 0) {
          return scope.includes(cmd.path);
      }
      return true;
  }

  private sortColumns(cols: Array<ColumnMetadata>, scope: Array<string>): Array<ColumnMetadata> {
      if (!scope || scope.length < 0) {
          return cols;
      }
      cols.forEach(col => {
          const order = scope.indexOf(col.name);
          col.order = order < 0 ? col.order + 1000 : order;
      });
      const sortedCols = cols.sort((c1, c2) => {
          return c1.order > c2.order ? 1 : c1.order === c2.order ? 0 : -1;
      });
      return sortedCols;
  }

  private handleView(): void {
      if (!this.metamodel || !this.ctx || !this.entity) {
          return;
      }
      const viewScope = this.ctx.viewScope;
      let cols = this.metamodel.getColumns().filter(cmd => this.filterView(cmd, viewScope));
      cols = this.sortColumns(cols, viewScope);
      if (this.ctx.i18nPrefix || this.ctx.i18nAppName) {
          cols = cols.map(cmd => this.addI18n(cmd));
      }
      this.columns = cols;
      this.ready = true;
  }

  private addI18n(cmd: ColumnMetadata): ColumnMetadata {
      if (cmd.metamodel && cmd.columnType === ColumnType.ASSOCIATION) {
          cmd.label = this.toI18n(cmd.label);
          cmd.metamodel.getColumns().forEach(col => this.addI18n(col));
      } else if (cmd.idColumn) {
          cmd.label = this.toI18n('id', 'dynamic.field.', true);
      } else {
          cmd.label = this.toI18n(cmd.label);
      }

      if (cmd.columnType === ColumnType.ENUM && cmd.options) {
          cmd.options.map(o => {
              o.label = this.toI18nEnum(o.label);
              return o;
          });
      }
      return cmd;
  }

  public toI18nEnum(enumLabel: string, prefix?: string): string {
      const i18nEnumPrefix = prefix ? prefix : this.toI18nEnumPrefix();
      if (!enumLabel || enumLabel.startsWith(i18nEnumPrefix)) {
          return enumLabel;
      }
      return i18nEnumPrefix + enumLabel;
  }

  public toI18n(label: string, prefix?: string, uncapitalizeFirstLetter?: boolean): string {
      const i18nLabelPrefix = prefix ? prefix : this.toI18nLabelPrefix();
      if (!label || label.startsWith(i18nLabelPrefix)) {
          return label;
      }
      return i18nLabelPrefix + (uncapitalizeFirstLetter ? label : this.capitalizeFirstLetter(label));
  }

  private toI18nLabelPrefix(): string {
      let prefix = '';
      if (this.ctx.i18nPrefix) {
          prefix = this.ctx.i18nPrefix + (this.ctx.i18nAppName ? '.' + this.ctx.i18nAppName : '');
      } else {
          prefix = this.ctx.i18nAppName ? this.ctx.i18nAppName : '';
      }
      return prefix;
  }

  private toI18nEnumPrefix(): string {
      return this.ctx.i18nPrefix ? this.ctx.i18nPrefix + '.' : '';
  }

  public capitalizeFirstLetter(txt: string): string {
      return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt;
  }

  public uncapitalizeFirstLetter(txt: string): string {
      return txt ? txt.charAt(0).toLowerCase() + txt.slice(1) : txt;
  }
}

