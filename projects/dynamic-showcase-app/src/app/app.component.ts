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
  PageBuilder,
  QueryMode,
  RelationType, 
  Condition,
  Operator,
  PageViewMode,
  DataActionType
 } from 'zee-dynamic-page-lib';
import { TableFieldControl, TableField } from 'zee-dynamic-page-lib';
import { BasePageView } from 'zee-dynamic-page-lib';
import { DynamicService } from 'zee-dynamic-page-lib';
import { TranslateService } from '@ngx-translate/core';
import { Agent } from './model/agent.model';
import { Endpoint } from './model/endpoint.model';
import { EndpointProperty } from './model/endpoint-property.model';
// import { DynamicConfigService } from 'zee-dynamic-page-lib';


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

  query: Criteria;

  public control: TableFieldControl<any>;

  private registeredActions: Array<GenericDynamicAction<any>> = [];

  public agentPageBuilder: PageBuilder<Agent>;
  public endpointPageBuilder: PageBuilder<Endpoint>;

  constructor(private dynamicService: DynamicService, private translateService: TranslateService) {
    super();

    this.theme = Theme.dark;
    this.agentTheme = Theme.primary;
    this.endpointTheme = Theme.dark;

    this.control = new TableFieldControl<any>('Content');

    this.translateService.setDefaultLang('en');
    this.translateService.use('tr');
  }

  ngOnInit() {
    this.buildTable();
    this.registerActions();
    this.prepareAgentBuilder();
    this.prepareEndpointBuilder();  
  }

  ngOnDestroy() {
    if (this.control) {
      this.control.destroy();
      this.control = undefined;
    }

    if (this.agentPageBuilder) {
      this.registeredActions.forEach(a => this.agentPageBuilder.unregisterAction(a));
      this.agentPageBuilder.destroy();
      this.agentPageBuilder = undefined;
    }
    if (this.endpointPageBuilder) {
      this.registeredActions.forEach(a => this.endpointPageBuilder.unregisterAction(a));
      this.endpointPageBuilder.destroy();
      this.endpointPageBuilder = undefined;
    }

    this.registeredActions = [];
    super.destroy();
  }


  private prepareAgentBuilder() {
    this.agentPageBuilder = this.dynamicService.createPageBuilder<Agent>({qualifier: 'Agent'});
    this.agentPageBuilder
    .withSortingSample(Agent)
    .withGridColumns('id', 'agentName', 'agentInstanceId', 'agentType', 'agentStatus')
    .withCompactColumns('id', 'agentInstanceId')
    .withPageConfiguration(config => {
      config.queryMode = QueryMode.CRITERIA;
      config.itemsPerPage = 20;
      config.canDownloadExcel = true;
      config.canUploadExcel = true;
      config.pageTheme = this.agentTheme;
      config.canCreate = true;
      config.canEdit = true;
      config.canDelete = true;
      return config;
    })
    .withDataActionController((a, d) => {
      if (a === DataActionType.BEFORE_DELETE) {
        return this.agentPageBuilder.openConfirmation('Alooo Agent Silinecek. Okey Mi?', null, 'Onay Istiyorum', true);
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
    .withViewer(PageViewMode.EDITOR);
  }

  private prepareEndpointBuilder() {
    this.endpointPageBuilder = this.dynamicService.createPageBuilder<Endpoint>({qualifier: 'Endpoint'});
    this.endpointPageBuilder
      .withSortingSample(Endpoint)
      .withGridColumns('id', 'endpointName', 'endpointInstanceId', 'endpointType', 'endpointSpec')
      .withCompactColumns('id', 'endpointName')
      .withPageConfiguration(config => {
        config.queryMode = QueryMode.CRITERIA;
        config.itemsPerPage = 20;
        config.canDownloadExcel = true;
        config.canUploadExcel = true;
        config.pageTheme = this.endpointTheme;
        return config;
      })
      .withDataActionController((a, d) => {
        if (a === DataActionType.BEFORE_DELETE) {
          return this.endpointPageBuilder.openConfirmation('Alooo Endpoint Silinecek. Okey Mi?', null, 'Onay Istiyorum', true);
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

            this.endpointPageBuilder
                .createRelationPageBuilder(relation)
                .withGridColumns('id','propKey', 'propKeyType', 'propValue', 'propValueType')
                .withCompactColumns('id', 'propKey')
                .withSortingSamples(EndpointProperty);
        } else if (relation.group === 'endpoint') {
          relation.accessPath = 'endpoints';
          relation.descriptionColumnName = 'endpointName';
        } else {
          if (relation.qualifier !== 'ActionScript' && relation.qualifier !== 'CheckScript') {
            relation.searchable = false;
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
      .withViewer(PageViewMode.EDITOR);    
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
        console.log('Hello clicked')
        comp.disabled = false;
    })
    .build();

    this.actions.push(this.buttonAction);
    
  }

  buildTable() {
    this.control.addField(TableField.of('id', 'dynamic.field.id', true, 'static')).withColWidth('65px');
    this.control.addField(TableField.of('sourceIndex', 'Source Index', false, 'static'));

    [ ...Array(20).keys()].map(n =>  `txt${n+1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(20).keys()].map(n =>  `num${n+1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(10).keys()].map(n =>  `date${n+1}`).forEach(s => {
      this.control.addField(TableField.of(s, s, false, 'static'));
    });
    [ ...Array(5).keys()].map(n =>  `bool${n+1}`).forEach(s => {
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
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ziya', txt2: 'Erdem', num1: 789, num2: 111213, date1:(new Date()), bool1: false},
      {txt1: 'Berk Efe', txt2: 'Erdem', num1: 141516, num2: 171819, date1:(new Date()), bool1: false},
      {txt1: 'Eylul Ece', txt2: 'Erdem', num1: 202122, num2: 232425, date1:(new Date()), bool1: true},
      {txt1: 'Serpil', txt2: 'Saygi Erdem', num1: 262728, num2: 293031, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
      {txt1: 'Ali', txt2: 'Can', num1: 123, num2: 456, date1:(new Date()), bool1: true},
    ];
  }

  rowSelected(evt: any) {
    console.log(evt);
  }
}
