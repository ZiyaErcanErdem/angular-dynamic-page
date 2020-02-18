import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BasePageView,
  PageManager,
  DynamicActionBuilder,
  DynamicUtil,
  GenericDynamicAction,
  ActionScope,
  ActionType,
  Theme,
  QueryMode,
  Condition,
  Operator,
  PageViewMode,
  PageRelation,
  ColumnMetadata
} from 'angular-dynamic-page';
import { Task } from '../model/task.model';

import { DynamicService, DynamicPopoverService } from 'angular-dynamic-page';
import { TaskExecution } from '../model/task-execution.model';
import { Agent } from '../model/agent.model';
import { CheckScript } from '../model/check-script.model';
import { Flow } from '../model/flow.model';
import { Observable, of } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page-task',
  templateUrl: './page-task.component.html',
  styleUrls: ['./page-task.component.scss']
})
export class PageTaskComponent extends BasePageView<Task> implements OnInit, OnDestroy {

  private registeredActions: Array<GenericDynamicAction<any>> = [];
  private selection: Task;
  private selectionTaskExecution: TaskExecution;
  private executeAction: GenericDynamicAction<any>;
  private contentAction: GenericDynamicAction<any>;

  public pageManager: PageManager<Task>;

  public ts: string;

  constructor(
    private dynamicService: DynamicService,
    private popoverService: DynamicPopoverService,
    private http: HttpClient
  ) {
    super();
    this.theme = Theme.dark;
  }

  ngOnInit() {
    this.pageManager = this.dynamicService.createPageManager<Task>({qualifier: 'Task'});
    this.pageManager
      .withSortingSample(Task, Agent, CheckScript, Flow)
      .withGridColumns(
        'id', 'taskName', 'nextExecutionStartTime', 'taskState',
        'checkScript.scriptName', 'flow.flowName', 'agent.agentName'
      )
      .withCompactColumns('id', 'taskName', 'taskState')
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
        this.attachSelector(cmd);
      })
      .withRelationConfiguration(relation => {
        if (relation.qualifier === 'Task') {
          relation.accessPath = 'tasks';
          relation.descriptionColumnName = 'taskName';
        } else if (relation.qualifier === 'CheckScript') {
          relation.accessPath = 'check-scripts';
          relation.descriptionColumnName = 'scriptName';
          relation.popupColumns = ['id', 'scriptName', 'scriptType'];
        } else if (relation.qualifier === 'Flow') {
          relation.accessPath = 'flows';
          relation.descriptionColumnName = 'flowName';
          relation.popupColumns = ['id', 'flowName', 'flowState'];
        } else if (relation.qualifier === 'Agent') {
          relation.accessPath = 'agent';
          relation.descriptionColumnName = 'agentName';
          relation.popupColumns = ['id', 'agentName', 'agentStatus'];
        } else if (relation.qualifier === 'TaskExecution') {
          relation.accessPath = 'task-executions';
          relation.descriptionColumnName = 'executionStartTime';

          this.attachTaskExecutionRelation(relation);
        } else {
            relation.searchable = false;
        }

        return relation;
      })
      .withDefaultQuery(query => {
        query
          .withCondition(Condition.OR)
          .addPredicate('agent.agentName', Operator.LIKE, '').and()
          .addPredicate('flow.flowName', Operator.LIKE, '').and()
          .addPredicate('contents.txt3', Operator.LIKE, '').and()
          .addPredicate('checkScript.scriptName', Operator.LIKE, '').and()
          .addPredicate('taskName', Operator.LIKE, '').and();
       })
      .withViewer(PageViewMode.EDITOR);

    this.pageManager.ready().subscribe(isReady => {
      if (isReady) {
        this.registerActions();
      }
    });

    /*
    this.collect = this.pageManager.formItemChange('taskName', 'taskState').subscribe(change => {
      change.form.get('taskDescription').setValue('Desc of ' + change.value);
    });
    */

    this.collect = this.pageManager.dataSelectionChange().subscribe( _ => {
      this.selection = this.pageManager.getSelectedData();
      this.checkActionState();
    });
  }

  private attachTaskExecutionRelation(relation: PageRelation): void {
    this.pageManager
    .createRelationPageManager(relation)
    .withPageConfiguration(config => {
      config.queryMode = QueryMode.CRITERIA;
      config.itemsPerPage = 50;
      config.canDownloadExcel = true;
      config.canUploadExcel = true;
      config.pageTheme = this.theme;
      config.canCreate = false;
      config.canEdit = false;
      config.canEdit = false;
      return config;
    })
    .withGridColumns('id', 'executionStartTime', 'executionEndTime', 'executionStatus')
    .withCompactColumns('id', 'executionStartTime')
    .withSortingSamples(TaskExecution)
    .withRelationConfiguration((pb, rel) => {
        if (rel.qualifier === 'TaskExecution') {
            rel.accessPath = 'task-executions';
            this.registerExecutionActions(pb);
            this.collect = pb.dataSelectionChange().subscribe(_ => {
              this.selectionTaskExecution = pb.getSelectedData();
              this.checkActionState();
            });
        } else if (rel.qualifier === 'Task') {
            rel.accessPath = 'tasks';
            rel.descriptionColumnName = 'taskName';
            rel.popupColumns = ['id', 'taskName'];
        } else if (rel.qualifier === 'FlowExecution') {
            rel.accessPath = 'flow-executions';
            rel.descriptionColumnName = 'executionStatus';
            rel.popupColumns = ['id', 'executionStatus', 'totalTaskCount', 'errorTaskCount', 'runningTaskCount'];
        }
        return relation;
     })
     .withViewer(PageViewMode.DETAIL);
  }

  private attachSelector(cmd: ColumnMetadata): void {
    if (cmd.qualifier === 'CheckScript' &&  cmd.name === 'scriptName') {
      cmd.selector = this.pageManager
        .createSelectorBuilder(cmd.qualifier, 'check-scripts')
        .withSelectionKey(cmd.name)
        .withSelectorColumns('id', 'scriptName', 'scriptType')
        .addSelectionMapping(cmd.name, cmd.name)
        .preventManuelEntry()
        .addSelectorColumnWidth('id', '40px')
        .addSelectorColumnWidth('scriptName', '300px')
        .addSelectorColumnWidth('scriptType', '150px')
        .addQueryItem({ name: cmd.name, operator: Operator.LIKE, value: '' })
        .build();
    } else if (cmd.qualifier === 'Flow' &&  cmd.name === 'flowName') {
      cmd.selector = this.pageManager
        .createSelectorBuilder(cmd.qualifier, 'flows')
        .withSelectionKey(cmd.name)
        .withSelectorColumns('id', 'flowName', 'flowState')
        .addSelectionMapping(cmd.name, cmd.name)
        .preventManuelEntry()
        .addSelectorColumnWidth('id', '40px')
        .addSelectorColumnWidth('flowName', '300px')
        .addSelectorColumnWidth('flowState', '150px')
        .addQueryItem({ name: cmd.name, operator: Operator.LIKE, value: '' })
        .build();
    } else if (cmd.qualifier === 'Agent' &&  (cmd.name === 'agentName' || cmd.name === 'agentInstanceId')) {
      cmd.selector = this.pageManager
        .createSelectorBuilder(cmd.qualifier, 'agents')
        .withSelectionKey(cmd.name)
        .withSelectorColumns('id', 'agentName', 'agentInstanceId', 'agentType', 'agentStatus')
        .addSelectionMapping(cmd.name, cmd.name)
        .addQueryItem({ name: cmd.name, operator: Operator.LIKE, value: '' })
        .build();
    }
  }

  private executeTask(): Observable<boolean> {
    const current: Task = this.pageManager.getSelectedData();
    if (!current || !current.id) {
      return of(false);
    }
    let params: HttpParams = new HttpParams();
    params = params.set('action', 'execute-sql-task');
    const requestURL = `http://localhost:8590/api/execute-sql-task/${current.id}`;
    return this.http.post<boolean>(requestURL, { params, observe: 'response' });
  }

  /*
  public openExecutionContent(comp: GenericDynamicAction<any>): void {

    if (!this.selectionTaskExecution) {
      return;
    }

    const taskExecutionId = this.selectionTaskExecution.id;
    const theme = this.theme;
    const context: { taskExecutionId: number; theme: Theme } = { taskExecutionId, theme };
    const ref = this.popoverService.openDialog<{ taskExecutionId: number; theme: Theme }, any>(
      ExecutionContentViewComponent, context, undefined, undefined, undefined, '1000px'
    );
    ref.afterClosed$.subscribe(result => {
        // console.log('ExecutionResult dialog is closed => ' + (result ? result.type + ':' + result.data : ''));
        ref.context = undefined;
        comp.disabled = false;
    });
  }
  */

  private registerAction(action: GenericDynamicAction<any>): boolean {
    if (this.pageManager.registerAction(action)) {
      this.registeredActions.push(action);
      return true;
    }
    return false;
  }

  private registerActions(): void {
    this.executeAction = new DynamicActionBuilder<any>('extension.action.execute', ActionType.CUSTOM)
      .withScope(ActionScope.EDITOR)
      .withLabel('extension.action.execute')
      .withButtonClass(DynamicUtil.themeFor('btn-', Theme.danger))
      .withIconClass('bolt')
      .withHandler((comp, d) => {
        comp.disabled = true;
        this.executeTask().subscribe(ok => {
          if (ok) {
            const notification = {
              message: 'extension.message.PRM_CS_EXECUTED',
              notificationType: 'alert',
              title: ''
            };
            this.pageManager.notify(notification);
          }
          comp.disabled = false;
        });
      })
      .build();
    this.registerAction(this.executeAction);
    this.checkActionState();
  }

  private registerExecutionActions(taskExecutionPageManager: PageManager<any>): void {
    this.contentAction = new DynamicActionBuilder<any>('extension.action.content', ActionType.CUSTOM)
      .withScope(ActionScope.EDITOR)
      .withLabel('extension.action.content')
      .withButtonClass(DynamicUtil.themeFor('btn-', Theme.primary))
      .withIconClass('tasks')
      .withHandler((comp, d) => {
        comp.disabled = true;
        // this.openExecutionContent(comp);
        alert('open execution');
      })
      .build();

    taskExecutionPageManager.registerAction(this.contentAction);

    this.checkActionState();
  }

  protected checkActionState(): void {
    if (this.contentAction) {
        this.contentAction.visible = !!this.selection;
    }
  }

  ngOnDestroy() {
    this.registeredActions.forEach(a => this.pageManager.unregisterAction(a));
    this.registeredActions = [];
    this.executeAction = undefined;
    this.contentAction = undefined;

    if (this.pageManager) {
      this.registeredActions.forEach(a => this.pageManager.unregisterAction(a));
      this.pageManager.destroy();
      this.pageManager = undefined;
      alert('destroyed');
    }
    super.ngOnDestroy();
  }

}
