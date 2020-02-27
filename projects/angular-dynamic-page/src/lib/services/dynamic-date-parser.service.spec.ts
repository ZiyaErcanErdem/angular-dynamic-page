import { TestBed } from '@angular/core/testing';

import { DynamicDateParserService } from './dynamic-date-parser.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';

describe('DynamicDateParserService', () => {
  let service: DynamicDateParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicDateParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert formatted date string to javascript Date', () => {
    const date = service.toDate('2019-12-05 23:16:45');
    expect(date).toBeTruthy();
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
    expect(date.getSeconds()).toEqual(45);
  });

  it('should format date like object', () => {
    const dateText = service.convertLocalDateToServer({year: 2020, month: 5, day: 19}, 'yyyy-MM-dd');
    expect(dateText).toBeTruthy();
    expect(dateText).toEqual('2020-05-19');
  });

  it('should convert date string to javascript Date', () => {
    const date = service.convertLocalDateFromServer('2019-12-05');
    expect(date).toBeTruthy();
    expect(date.getFullYear()).toEqual(2019);
    expect(date.getMonth()).toEqual(11);
    expect(date.getDate()).toEqual(5);
  });

  it('should convert ISO formatted date string to javascript Date', () => {
    const date = service.convertDateTimeFromServer('2020-02-26T18:47:13.874Z');
    expect(date).toBeTruthy();
    expect(date.getFullYear()).toEqual(2020);
    expect(date.getDate()).toEqual(26);
    expect(date.getMonth()).toEqual(1);
    expect(date.getSeconds()).toEqual(13);
  });

});
