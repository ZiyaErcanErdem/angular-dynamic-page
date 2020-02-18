import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BasePageView,
  PageManager,
  GenericDynamicAction,
  Theme,
  QueryMode,
  Condition,
  Operator,
  PageViewMode,
  PageRelation
} from 'angular-dynamic-page';
import { Task } from '../model/task.model';

import { DynamicService, DynamicPopoverService } from 'angular-dynamic-page';
import { Flow } from '../model/flow.model';
import { HttpClient } from '@angular/common/http';
import { EventTrigger } from '../model/event-trigger.model';
import { FlowExecution } from '../model/flow-execution.model';

@Component({
  selector: 'app-page-flow',
  templateUrl: './page-flow.component.html',
  styleUrls: ['./page-flow.component.scss']
})
export class PageFlowComponent extends BasePageView<Flow> implements OnInit, OnDestroy {
  private registeredActions: Array<GenericDynamicAction<any>> = [];
  public pageBuilder: PageManager<Flow>;

  constructor(
    private dynamicService: DynamicService,
    private popoverService: DynamicPopoverService,
    private http: HttpClient,
  ) {
    super();
    this.theme = Theme.dark;
  }

  ngOnInit() {
    this.pageBuilder = this.dynamicService.createPageBuilder<Flow>({qualifier: 'Flow'});
    this.pageBuilder
      .withSortingSample(Flow, EventTrigger)
      .withGridColumns('id', 'flowName', 'nextExecutionStartTime', 'flowState', 'eventTrigger.triggerName', 'eventTrigger.triggerType')
      .withCompactColumns('id', 'flowName')
      .withPageConfiguration(config => {
        config.queryMode = QueryMode.CRITERIA;
        config.itemsPerPage = 20;
        config.canDownloadExcel = true;
        config.canUploadExcel = true;
        config.pageTheme = this.theme;
        return config;
      })
      .withMetamodelConfiguration(cmd => {
        if (cmd.name === 'id') {
          cmd.gridColWith = '80px';
          cmd.compactColWidth = '50px';
        }
      })
      .withRelationConfiguration(relation => {
          if (relation.qualifier === 'Flow') {
            relation.accessPath = 'flows';
          } else if (relation.qualifier === 'EventTrigger') {
            relation.accessPath = 'event-triggers';
            relation.descriptionColumnName = 'triggerName';
            relation.popupColumns = ['id', 'triggerName', 'triggerType'];
          } else if (relation.qualifier === 'Task') {
            relation.accessPath = 'tasks';
            relation.descriptionColumnName = 'taskName';
            this.configureTaskRelation(relation);
          } else if (relation.qualifier === 'FlowExecution') {
            relation.accessPath = 'flow-executions';
            relation.descriptionColumnName = 'flowName';
            this.configureFlowExecutionRelation(relation);
          } else {
            relation.searchable = false;
          }
          return relation;
      })
      .withDefaultQuery(query => {
        query
          .withCondition(Condition.OR)
          .addPredicate('flowName', Operator.LIKE, '').and()
          .addPredicate('eventTrigger.triggerName', Operator.LIKE, '').and();
      })
      .withViewer(PageViewMode.EDITOR);
  }

  private configureFlowExecutionRelation(relation: PageRelation): void {
    this.pageBuilder
    .createRelationPageBuilder(relation)
    .withPageConfiguration(config => {
      config.queryMode = QueryMode.CRITERIA;
      config.itemsPerPage = 50;
      config.canDownloadExcel = true;
      config.canUploadExcel = true;
      config.pageTheme = this.theme;
      config.canCreate = false;
      config.canEdit = false;
      config.canDelete = false;
      return config;
    })
    .withGridColumns('id', 'executionStartTime', 'executionEndTime', 'executionStatus')
    .withCompactColumns('id', 'executionStartTime')
    .withSortingSamples(FlowExecution)
    .withRelationConfiguration((pb, rel) => {
        if (rel.qualifier === 'Flow') {
            rel.accessPath = 'flows';
            rel.descriptionColumnName = 'flowName';
            rel.popupColumns = ['id', 'flowName', 'flowState', 'nextExecutionStartTime'];
        }
        return rel;
     })
     .withViewer(PageViewMode.DETAIL);
  }

  private configureTaskRelation(relation: PageRelation): void {
    this.pageBuilder
      .createRelationPageBuilder(relation)
      .withGridColumns('id', 'taskName', 'taskState', 'checkScript.scriptName', 'flow.flowName', 'agent.agentName')
      .withCompactColumns('id', 'taskName')
      .withSortingSamples(Task)
      .withRelationConfiguration((pb, rel) => {
          if (rel.qualifier === 'CheckScript') {
              rel.accessPath = 'check-scripts';
              rel.descriptionColumnName = 'scriptName';
              rel.popupColumns = ['id', 'scriptName', 'scriptType'];
          } else if (rel.qualifier === 'Flow') {
              rel.accessPath = 'flows';
              rel.descriptionColumnName = 'flowName';
              rel.popupColumns = ['id', 'flowName', 'flowState'];
          } else if (rel.qualifier === 'Agent') {
              rel.accessPath = 'agent';
              rel.descriptionColumnName = 'agentName';
              rel.popupColumns = ['id', 'agentName', 'agentStatus'];
          }
          return relation;
      });
  }

  ngOnDestroy() {
    this.registeredActions.forEach(a => this.pageBuilder.unregisterAction(a));
    this.registeredActions = [];

    if (this.pageBuilder) {
      this.registeredActions.forEach(a => this.pageBuilder.unregisterAction(a));
      this.pageBuilder.destroy();
      this.pageBuilder = undefined;
      alert('destroyed');
    }
    super.ngOnDestroy();
  }

}
