import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DynamicDateParserService {
  private pattern = 'yyyy-MM-dd';
  private datePipe: DatePipe;

  constructor() {
      this.datePipe = new DatePipe('en');
  }

  convertDateTimeFromServer(date: any) {
      if (date) {
          return new Date(date);
      } else {
          return null;
      }
  }

  convertLocalDateFromServer(date: any) {
      if (date) {
          const dateString = date.split('-');
          return new Date(dateString[0], dateString[1] - 1, dateString[2]);
      }
      return null;
  }

  convertLocalDateToServer(date: any, pattern = this.pattern) {
      if (date) {
          const newDate = new Date(date.year, date.month - 1, date.day);
          return this.datePipe.transform(newDate, pattern);
      } else {
          return null;
      }
  }

  dateformat() {
      return this.pattern;
  }

  toDate(date: any): Date {
      if (date === undefined || date === null) {
          return null;
      }
      const dateParts = date.split(/\D+/);
      if (dateParts.length === 7) {
          return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5], dateParts[6]);
      }
      if (dateParts.length === 6) {
          return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
      }
      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);
  }
}
