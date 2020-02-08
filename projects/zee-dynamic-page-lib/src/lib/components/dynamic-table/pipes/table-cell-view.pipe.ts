import { Pipe, PipeTransform } from '@angular/core';
import { TableField } from '../../../model/table-field';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'tableCellView'
})
export class TableCellViewPipe implements PipeTransform {
  transform(row: any, field: TableField<any>): string {
      if (field.reader) {
          const val = field.reader(row);
          return this.format(val, field);
      } else {
          const val = row[field.name];
          return this.format(val, field);
      }
  }

  private format(val: any, field: TableField<any>): string {
      if (val) {
          if (field.originalType === 'date') {
              return new DatePipe('en-US').transform(val, 'dd.MM.yyyy HH:mm:ss');
          } else if (field.type === 'selection') {
              if (field.selection) {
                  const label = field.selection.find(o => o.value === val);
                  return label ? '' + label : val;
              }
          }
      }
      return val;
  }
}
