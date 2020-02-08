import { Component, OnInit, Optional, Input } from '@angular/core';
import { IViewFormatter, IDynamicElementContent } from '../model/dynamic-element-content';
import { ElementContext } from '../model/element-context';
import { Theme } from '../../../model/theme.enum';

@Component({
  selector: 'zee-base-element-view',
  templateUrl: './base-element-view.component.html',
  styleUrls: ['./base-element-view.component.scss']
})
export class BaseElementViewComponent implements OnInit {
  @Input()
  theme: Theme;
  @Input()
  content: IDynamicElementContent<any>;

  get viewText(): string {
      if (!this.content || !this.content.data) {
          return '???';
      }
      return this.extractView();
  }

  constructor(@Optional() private context: ElementContext<any>) {
      if (this.context) {
          this.content = this.context.content;
          this.theme = this.context.theme;
      }
  }

  private extractView(): string {
      if (!this.content || !this.content.data) {
          return '???';
      }
      if (this.content.formatter) {
          const formatter: IViewFormatter<any> = this.content.formatter;
          if (formatter.extractor) {
              return formatter.extractor(this.content);
          } else if (formatter.label) {
              return this.content.data[formatter.label];
          }
      } else {
          return this.content.index + ' - ' + this.extractText(this.content.id, this.content.data, this.content.type);
      }
  }

  private extractText(id: string | number, data: any, type: string | number): string {
      if (!data) {
          return '???';
      }
      const lbl = data.label;
      const desc = data.description;
      const name = data.name;
      const text = data.text;
      const description = lbl ? lbl : desc ? desc : name ? name : text ? text : '' + this.content.data;

      return `type:${type ? type : ''} id:${id ? id : ''} : ${description}`;
  }

  ngOnInit() {}
}

