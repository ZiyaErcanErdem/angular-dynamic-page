import { TestBed, tick } from '@angular/core/testing';

import { DynamicAlertManagerService } from './dynamic-alert-manager.service';
import { prepareDynamicTestImports } from '../test/dynamic-test-util';
import { AlertType } from '../model/alert-type.enum';

describe('DynamicAlertManagerService', () => {
  let service: DynamicAlertManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...prepareDynamicTestImports()]
    });
    service = TestBed.inject(DynamicAlertManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should activate/passivate notifiers', () => {

    const first = service.getNotifierId();
    const second = service.getNotifierId();

    service.activateNotifier(first);

    expect(service.isActiveNotifier(first)).toEqual(true);
    expect(service.isActiveNotifier(second)).toEqual(false);

    service.passivateNotifier(first);

    expect(service.isActiveNotifier(first)).toEqual(false);

  });

  it('should not passivate notifier with wrong id', () => {

    const first = service.getNotifierId();
    const second = service.getNotifierId();

    service.activateNotifier(first);

    expect(service.isActiveNotifier(first)).toEqual(true);
    expect(service.isActiveNotifier(second)).toEqual(false);

    service.passivateNotifier(second);

    expect(service.isActiveNotifier(first)).toEqual(true);
    expect(service.isActiveNotifier(second)).toEqual(false);

  });

  it('should subscribe to alerts', () => {

    service.alerts().subscribe(alerts => {
      expect(alerts.length).toEqual(0);
    });

  });

  it('should create alerts', () => {

    const alert1 = service.alert({msg: 'Alert_1', params: {param: 'a'}, i18n: true});
    const error1 = service.error({msg: 'Error_1', params: {param: 'e'}, i18n: true});
    const info1 = service.info({msg: 'Info_1', params: {param: 'i'}, i18n: true});
    const warning1 = service.warning({msg: 'Warning_1', params: {param: 'w'}, i18n: true});
    
    service.alerts().subscribe(alerts => {
      expect(alerts.length).toEqual(4);

      expect(alerts[0].type).toEqual(AlertType.alert);
      expect(alerts[1].type).toEqual(AlertType.error);
      expect(alerts[2].type).toEqual(AlertType.info);
      expect(alerts[3].type).toEqual(AlertType.warning);
    });

  });

  it('should clear alerts', () => {

    service.alert({msg: 'Alert_1', params: {param: 'a'}, i18n: true});
    service.error({msg: 'Error_1', params: {param: 'e'}, i18n: true});
    service.info({msg: 'Info_1', params: {param: 'i'}, i18n: true});
    service.warning({msg: 'Warning_1', params: {param: 'w'}, i18n: true});

    service.clear();
    
    service.alerts().subscribe(alerts => {
      expect(alerts.length).toEqual(0);
    });

  });

  it('alerts should be closable', () => {

    const alert1 = service.alert({msg: 'Alert_1', params: {param: 'a'}, i18n: true});
    service.error({msg: 'Error_1', params: {param: 'e'}, i18n: true});
    service.info({msg: 'Info_1', params: {param: 'i'}, i18n: true});
    service.warning({msg: 'Warning_1', params: {param: 'w'}, i18n: true});

    alert1.close();
    
    service.alerts().subscribe(alerts => {
      expect(alerts.length).toEqual(3);
    });

  });

  it('should close alert with id', () => {

    const alert1 = service.alert({msg: 'Alert_1', params: {param: 'a'}, i18n: true});
    service.error({msg: 'Error_1', params: {param: 'e'}, i18n: true});
    service.info({msg: 'Info_1', params: {param: 'i'}, i18n: true});
    service.warning({msg: 'Warning_1', params: {param: 'w'}, i18n: true});

    service.closeAlert(alert1.id);
    
    service.alerts().subscribe(alerts => {
      expect(alerts.length).toEqual(3);
    });

  });

});
