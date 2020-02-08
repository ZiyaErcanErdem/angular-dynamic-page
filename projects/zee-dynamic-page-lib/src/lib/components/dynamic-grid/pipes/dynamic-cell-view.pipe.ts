import { Pipe, PipeTransform } from '@angular/core';
import { ColumnMetadata } from '../../../model/column-metadata';
import { BuilderType } from '../../../model/builder-type.enum';
import { RelationType } from '../../../model/relation-type.enum';
import { ColumnType } from '../../../model/column-type.enum';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dynamicCellView'
})
export class DynamicCellViewPipe implements PipeTransform {
  transform(row: any, col: ColumnMetadata, builderType: BuilderType): string {
      const path = this.toPath(col, builderType);
      if (col.relType === RelationType.SELF) {
          return this.format(row[path], col);
      } else if (col.relType === RelationType.INNER) {
          const associatedVal = this.readAssociatedValue(row, path);
          return this.format(associatedVal, col);
      } else {
          return '';
      }
  }

  private toPath(col: ColumnMetadata, builderType: BuilderType): string {
      if (builderType === BuilderType.ASSOCIATION) {
          let levels = col.path.split('.');
          if (levels.length > 2 && levels.length >= col.level) {
              levels = levels.slice(col.level - 2);
              const path = levels.join('.');
              return path;
          } else {
              return col.name;
          }
      }
      return col.path;
  }

  private readAssociatedValue(row: any, path: string): any {
      if (!row || !path) {
          return '';
      }
      const levels = path.split('.');
      let val = row;
      levels.forEach(key => {
          if (val) {
              val = val[key];
          }
      });
      return val === undefined || val === null ? '' : val;
  }

  private format(val: any, col: ColumnMetadata): string {
      if (val) {
          if (col.columnType === ColumnType.DATE) {
              return new DatePipe('en-US').transform(val, 'dd.MM.yyyy HH:mm:ss');
          } else if (col.columnType === ColumnType.ENUM) {
              if (col.options) {
                  const label = col.options.find(o => o.name === val);
              }
              return val;
          } else if (col.columnType === ColumnType.BOOLEAN) {
              return val;
          }
      }
      return val;
  }
}

