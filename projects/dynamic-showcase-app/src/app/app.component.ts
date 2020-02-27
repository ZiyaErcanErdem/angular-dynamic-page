import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Theme,
  GenericDynamicAction,
  DynamicActionBuilder,
  ActionType,
  ActionScope,
  DynamicUtil,
  DynamicAction,
  Criteria,
  PageManager,
  QueryMode,
  Condition,
  Operator,
  PageViewMode,
  DataActionType,
  TableFieldControl,
  TableField,
  BasePageView,
  DynamicService
} from 'angular-dynamic-page';
import { TranslateService } from '@ngx-translate/core';
import { Agent } from './model/agent.model';
import { Endpoint } from './model/endpoint.model';
import { EndpointProperty } from './model/endpoint-property.model';
// import { DynamicConfigService } from 'angular-dynamic-page';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BasePageView<Agent> implements OnInit, OnDestroy {
  title = 'dynamic-showcase-app';
  theme: Theme;
  agentTheme: Theme;
  endpointTheme: Theme;
  buttonAction: GenericDynamicAction<any>;
  actions: Array<DynamicAction<any>> = [];

  toogle = true;

  query: Criteria;

  public control: TableFieldControl<any>;

  private registeredActions: Array<GenericDynamicAction<any>> = [];
  themeActions: Array<DynamicAction<any>> = [];

  public agentPageManager: PageManager<Agent>;
  public endpointPageManager: PageManager<Endpoint>;

  constructor(private dynamicService: DynamicService, private translateService: TranslateService) {
    super();

    this.theme = Theme.primary;
    this.agentTheme = Theme.warning;
    this.endpointTheme = Theme.success;

    this.control = new TableFieldControl<any>('Content');

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  ngOnInit() {
    this.themeActions = this.buildThemeActions();
    this.buildTable();
    this.registerActions();
    this.prepareAgentManager();
    this.prepareEndpointManager();
  }

  ngOnDestroy() {
    if (this.control) {
      this.control.destroy();
      this.control = undefined;
    }

    if (this.agentPageManager) {
      this.registeredActions.forEach(a => this.agentPageManager.unregisterAction(a));
      this.agentPageManager.destroy();
      this.agentPageManager = undefined;
    }
    if (this.endpointPageManager) {
      this.registeredActions.forEach(a => this.endpointPageManager.unregisterAction(a));
      this.endpointPageManager.destroy();
      this.endpointPageManager = undefined;
    }

    this.registeredActions = [];
    super.destroy();
  }


  private prepareAgentManager() {
    this.agentPageManager = this.dynamicService.createPageManager<Agent>({qualifier: 'Agent'});
    this.agentPageManager
    .withSortingSample(Agent)
    .withGridColumns('id', 'agentName', 'agentInstanceId', 'agentType', 'agentStatus')
    .withCompactColumns('id', 'agentInstanceId')
    .withPageConfiguration(config => {
      config.queryMode = QueryMode.CRITERIA;
      config.itemsPerPage = 20;
      config.canDownloadExcel = true;
      config.canUploadExcel = true;
      // config.pageTheme = this.theme;
      config.canCreate = true;
      config.canEdit = true;
      config.canDelete = true;
      return config;
    })
    .withDataActionController((a, d) => {
      if (a === DataActionType.BEFORE_DELETE) {
        return this.agentPageManager.openConfirmation('Alooo Agent Silinecek. Okey Mi?', {title: 'Onay Istiyorum', i18n: false});
      }
      return Promise.resolve(true);
    })
    .withMetamodelConfiguration(cmd => {
      if (cmd.name === 'id') {
        cmd.gridColWith = '80px';
        cmd.compactColWidth = '50px';
      }
    })
    .withRelationConfiguration(relation => {
      if (relation.qualifier === 'Agent') {
        relation.accessPath = 'agents';
      } else {
        if (relation.qualifier !== 'Task' && relation.qualifier !== 'Action') {
          relation.searchable = false;
        }
      }
      return relation;
    })
    .withDefaultQuery(query => {
      query
        .withCondition(Condition.OR)
        .addPredicate('agentName', Operator.LIKE, '').and()
        .addPredicate('agentInstanceId', Operator.LIKE, '').and();
    })
    .withViewer(PageViewMode.EDITOR)
    .start();
  }

  private prepareEndpointManager() {
    this.endpointPageManager = this.dynamicService.createPageManager<Endpoint>({qualifier: 'Endpoint'});
    this.endpointPageManager
      .withSortingSample(Endpoint)
      .withGridColumns('id', 'endpointName', 'endpointInstanceId', 'endpointType', 'endpointSpec')
      .withCompactColumns('id', 'endpointName')
      .withPageConfiguration(config => {
        config.queryMode = QueryMode.CRITERIA;
        config.itemsPerPage = 10;
        config.canDownloadExcel = true;
        config.canUploadExcel = true;
        // config.pageTheme = this.theme;
        return config;
      })
      .withDataActionController((a, d) => {
        if (a === DataActionType.BEFORE_DELETE) {
          return this.endpointPageManager.openConfirmation(
            'Alooo Endpoint Silinecek. Okey Mi?',
            {title: 'Onay Istiyorum',
            i18n: false, minWidth: '500px'}
          );
        }
        return Promise.resolve(true);
      })
      .withMetamodelConfiguration(cmd => {
        if (cmd.name === 'id') {
          cmd.gridColWith = '80px';
          cmd.compactColWidth = '50px';
        }
      })
      .withRelationConfiguration(relation => {
        if (relation.group === 'endpointProperty') {
            relation.accessPath = 'endpoint-properties';
            relation.descriptionColumnName = 'propertyName';

            this.endpointPageManager
                .createRelationPageManager(relation)
                .withGridColumns('id', 'propKey', 'propKeyType', 'propValue', 'propValueType')
                .withCompactColumns('id', 'propKey')
                .withSortingSamples(EndpointProperty);
        } else if (relation.group === 'endpoint') {
          relation.accessPath = 'endpoints';
          relation.descriptionColumnName = 'endpointName';
        } else {
          if (relation.qualifier !== 'ActionScript' && relation.qualifier !== 'CheckScript') {
            relation.searchable = true;
          }
        }
        return relation;
      })
      .withDefaultQuery(query => {
        query
          .withCondition(Condition.AND)
          .addPredicate('endpointName', Operator.LIKE, '')
          .and()
          .addPredicate('endpointInstanceId', Operator.LIKE, '')
          .and();
      })
      .withViewer(PageViewMode.EDITOR)
      .start();
  }

  registerActions() {

    this.buttonAction = new DynamicActionBuilder<any>('table.filter', ActionType.SEARCH)
    .withScope(ActionScope.CUSTOM)
    .withOrder(20000)
    .withLabel('Hello')
    .withI18n(false)
    .withButtonClass(DynamicUtil.buttonThemeFor(this.theme))
    .withIconClass('filter')
    .withHandler((comp, d) => {
        comp.disabled = true;
        console.log('Hello clicked');
        this.toogle = !this.toogle;
        comp.disabled = false;
    })
    .build();

    this.actions.push(this.buttonAction);

  }

  buildTable() {
    this.control.addField(TableField.of('id', 'dynamic.field.id', true, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('sourceIndex', 'Source Index', false, 'static'));

    [ ...Array(20).keys()].map(n =>  `txt${n + 1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(20).keys()].map(n =>  `num${n + 1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(10).keys()].map(n =>  `date${n + 1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(5).keys()].map(n =>  `bool${n + 1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });

    this.control.addField(TableField.of('checkScriptId', 'checkScriptId', false, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('flowId', 'flowId', false, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('taskId', 'taskId', false, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('taskExecutionId', 'taskExecutionId', false, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('flowExecutionId', 'flowExecutionId', false, 'static')).withColWidth('65px');

    this.control.readonlyAll(true);
    this.control.hideAll();
    this.control.show('txt1');
    this.control.show('txt2');
    this.control.show('num1');
    this.control.show('num2');
    this.control.show('date1');
    this.control.show('bool1');

    this.control.data = [
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ziya', txt2: 'Erdem', num1: 789, num2: 111213, date1: (new Date()), bool1: false},
      {txt1: 'Berk Efe', txt2: 'Erdem', num1: 141516, num2: 171819, date1: (new Date()), bool1: false},
      {txt1: 'Eylul Ece', txt2: 'Erdem', num1: 202122, num2: 232425, date1: (new Date()), bool1: true},
      {txt1: 'Serpil', txt2: 'Saygi Erdem', num1: 262728, num2: 293031, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1: (new Date()), bool1: true},
    ];
  }

  rowSelected(evt: any) {
    console.log(evt);
  }

  private buildThemeActions(): Array<DynamicAction<any>> {
    return [
      this.createThemeAction(Theme.dark, 'dark'),
      this.createThemeAction(Theme.primary, 'primary'),
      this.createThemeAction(Theme.secondary, 'secondary'),
      this.createThemeAction(Theme.info, 'info'),
      this.createThemeAction(Theme.success, 'success'),
      this.createThemeAction(Theme.warning, 'warning'),
      this.createThemeAction(Theme.danger, 'danger'),
      this.createThemeAction(Theme.light, 'light')
    ];
  }

  private createThemeAction(theme: Theme, label: string): DynamicAction<Theme> {
    return new DynamicActionBuilder<Theme>(`theme.${label}`, ActionType.CUSTOM)
    .withScope(ActionScope.PAGE)
    .withLabel(label).withI18n(false).withPayload(theme)
    .withButtonClass(DynamicUtil.buttonThemeFor(theme))
    // .withIconClass('file-excel')
    .withHandler((comp, d) => {
        comp.disabled = true;
        this.theme = d;
        comp.disabled = false;
    })
    .build();
  }
}
