export function getSampleEndpointData(): any[] {
    return [ {
        id: 1,
        endpointName: 'DevMySQL',
        endpointInstanceId: 'mysql001',
        endpointType: 'DATABASE',
        endpointSpec: 'MYSQL',
        endpointDescription: 'MySQL Connection Properties',
        endpointProperties: null,
        checkScripts: null,
        actionScripts: null
      } ];
}

export function getSampleEndpointPropertyData(): any[] {
    return [ {
        id: 16,
        propKey: 'driverClassName',
        propKeyType: 'ANY',
        propValue: 'com.mysql.jdbc.Driver',
        propValueType: 'STRING',
        propDescription: 'JDBC Connection driver class name',
        endpoint: {
          id: 1,
          endpointName: 'DevMySQL',
          endpointInstanceId: 'mysql001',
          endpointType: 'DATABASE',
          endpointSpec: 'MYSQL',
          endpointDescription: 'MySQL Connection Properties',
          checkScripts: null,
          actionScripts: null
        }
      }, {
        id: 14,
        propKey: 'jdbcUrl',
        propKeyType: 'URI',
        propValue: 'jdbc:mysql://localhost:3306/zeemon',
        propValueType: 'STRING',
        propDescription: 'Database host',
        endpoint: {
          id: 1,
          endpointName: 'DevMySQL',
          endpointInstanceId: 'mysql001',
          endpointType: 'DATABASE',
          endpointSpec: 'MYSQL',
          endpointDescription: 'MySQL Connection Properties',
          checkScripts: null,
          actionScripts: null
        }
      }, {
        id: 13,
        propKey: 'password',
        propKeyType: 'PASSWORD',
        propValue: 'zeess2020',
        propValueType: 'STRING',
        propDescription: 'Database connection password',
        endpoint: {
          id: 1,
          endpointName: 'DevMySQL',
          endpointInstanceId: 'mysql001',
          endpointType: 'DATABASE',
          endpointSpec: 'MYSQL',
          endpointDescription: 'MySQL Connection Properties',
          checkScripts: null,
          actionScripts: null
        }
      }, {
        id: 1,
        propKey: 'username',
        propKeyType: 'UID',
        propValue: 'dbzee',
        propValueType: 'STRING',
        propDescription: 'Database connection user',
        endpoint: {
          id: 1,
          endpointName: 'DevMySQL',
          endpointInstanceId: 'mysql001',
          endpointType: 'DATABASE',
          endpointSpec: 'MYSQL',
          endpointDescription: 'MySQL Connection Properties',
          checkScripts: null,
          actionScripts: null
        }
      } ];
}

export function getSampleEndpointPropertyMetamodelData(): any {
    return {
        qualifier: 'EndpointProperty',
        group: 'endpointProperty',
        path: '',
        level: 1,
        distance: 0,
        relType: 'SELF',
        columns: [ {
          name: 'id',
          columnType: 'NUMBER',
          options: [ ],
          order: 1,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 0,
          features: '0|1|1|1|0|0|1',
          metamodel: null
        }, {
          name: 'propDescription',
          columnType: 'STRING',
          options: [ ],
          order: 102,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 512,
          features: '1|1|1|1|1|0|0',
          metamodel: null
        }, {
          name: 'propKey',
          columnType: 'STRING',
          options: [ ],
          order: 103,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 100,
          features: '0|1|1|1|1|0|0',
          metamodel: null
        }, {
          name: 'propKeyType',
          columnType: 'ENUM',
          options: [ {
            name: 'ANY',
            label: 'PropKeyType.ANY',
            value: 'ANY'
          }, {
            name: 'SCHEMA',
            label: 'PropKeyType.SCHEMA',
            value: 'SCHEMA'
          }, {
            name: 'HOST',
            label: 'PropKeyType.HOST',
            value: 'HOST'
          }, {
            name: 'PORT',
            label: 'PropKeyType.PORT',
            value: 'PORT'
          }, {
            name: 'URI',
            label: 'PropKeyType.URI',
            value: 'URI'
          }, {
            name: 'BASEPATH',
            label: 'PropKeyType.BASEPATH',
            value: 'BASEPATH'
          }, {
            name: 'UID',
            label: 'PropKeyType.UID',
            value: 'UID'
          }, {
            name: 'PASSWORD',
            label: 'PropKeyType.PASSWORD',
            value: 'PASSWORD'
          }, {
            name: 'CLIENT_ID',
            label: 'PropKeyType.CLIENT_ID',
            value: 'CLIENT_ID'
          }, {
            name: 'CLIENT_SECRET',
            label: 'PropKeyType.CLIENT_SECRET',
            value: 'CLIENT_SECRET'
          }, {
            name: 'CLIENT_AUDIENCE',
            label: 'PropKeyType.CLIENT_AUDIENCE',
            value: 'CLIENT_AUDIENCE'
          }, {
            name: 'CLIENT_SCOPE',
            label: 'PropKeyType.CLIENT_SCOPE',
            value: 'CLIENT_SCOPE'
          }, {
            name: 'KEYSTORE_TYPE',
            label: 'PropKeyType.KEYSTORE_TYPE',
            value: 'KEYSTORE_TYPE'
          }, {
            name: 'KEYSTORE_PATH',
            label: 'PropKeyType.KEYSTORE_PATH',
            value: 'KEYSTORE_PATH'
          }, {
            name: 'KEYSTORE_ALIAS',
            label: 'PropKeyType.KEYSTORE_ALIAS',
            value: 'KEYSTORE_ALIAS'
          }, {
            name: 'KEYSTORE_PASSWORD',
            label: 'PropKeyType.KEYSTORE_PASSWORD',
            value: 'KEYSTORE_PASSWORD'
          } ],
          order: 104,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 255,
          features: '0|1|1|1|1|0|0',
          metamodel: null
        }, {
          name: 'propValue',
          columnType: 'STRING',
          options: [ ],
          order: 105,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 512,
          features: '0|1|1|1|1|0|0',
          metamodel: null
        }, {
          name: 'propValueType',
          columnType: 'ENUM',
          options: [ {
            name: 'STRING',
            label: 'DataType.STRING',
            value: 'STRING'
          }, {
            name: 'NUMBER',
            label: 'DataType.NUMBER',
            value: 'NUMBER'
          }, {
            name: 'DATE',
            label: 'DataType.DATE',
            value: 'DATE'
          }, {
            name: 'BOOLEAN',
            label: 'DataType.BOOLEAN',
            value: 'BOOLEAN'
          } ],
          order: 106,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 255,
          features: '0|1|1|1|1|0|0',
          metamodel: null
        }, {
          name: 'endpoint',
          columnType: 'ASSOCIATION',
          options: [ ],
          order: 507,
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 0,
          features: '0|1|1|0|0|0|0',
          metamodel: {
            qualifier: 'Endpoint',
            group: 'endpoint',
            path: 'endpoint',
            level: 2,
            distance: 0,
            relType: 'INNER',
            columns: [ {
              name: 'endpointDescription',
              columnType: 'STRING',
              options: [ ],
              order: 201,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 512,
              features: '1|1|1|0|0|0|0',
              metamodel: null
            }, {
              name: 'endpointInstanceId',
              columnType: 'STRING',
              options: [ ],
              order: 202,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 100,
              features: '1|1|1|0|0|0|0',
              metamodel: null
            }, {
              name: 'endpointName',
              columnType: 'STRING',
              options: [ ],
              order: 203,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 100,
              features: '0|1|1|0|0|0|0',
              metamodel: null
            }, {
              name: 'endpointSpec',
              columnType: 'ENUM',
              options: [ {
                name: 'ANY',
                label: 'EndpointSpec.ANY',
                value: 'ANY'
              }, {
                name: 'MSSQL',
                label: 'EndpointSpec.MSSQL',
                value: 'MSSQL'
              }, {
                name: 'MYSQL',
                label: 'EndpointSpec.MYSQL',
                value: 'MYSQL'
              }, {
                name: 'POSTGRESQL',
                label: 'EndpointSpec.POSTGRESQL',
                value: 'POSTGRESQL'
              }, {
                name: 'ORACLE',
                label: 'EndpointSpec.ORACLE',
                value: 'ORACLE'
              }, {
                name: 'MONGODB',
                label: 'EndpointSpec.MONGODB',
                value: 'MONGODB'
              } ],
              order: 204,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 255,
              features: '0|1|1|0|0|0|0',
              metamodel: null
            }, {
              name: 'endpointType',
              columnType: 'ENUM',
              options: [ {
                name: 'DATABASE',
                label: 'EndpointType.DATABASE',
                value: 'DATABASE'
              }, {
                name: 'FILE_SYSTEM',
                label: 'EndpointType.FILE_SYSTEM',
                value: 'FILE_SYSTEM'
              }, {
                name: 'FTP',
                label: 'EndpointType.FTP',
                value: 'FTP'
              }, {
                name: 'SFTP',
                label: 'EndpointType.SFTP',
                value: 'SFTP'
              }, {
                name: 'SSH',
                label: 'EndpointType.SSH',
                value: 'SSH'
              }, {
                name: 'REST',
                label: 'EndpointType.REST',
                value: 'REST'
              }, {
                name: 'WEBSERVICE',
                label: 'EndpointType.WEBSERVICE',
                value: 'WEBSERVICE'
              }, {
                name: 'AGENT',
                label: 'EndpointType.AGENT',
                value: 'AGENT'
              } ],
              order: 205,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 255,
              features: '0|1|1|0|0|0|0',
              metamodel: null
            }, {
              name: 'id',
              columnType: 'NUMBER',
              options: [ ],
              order: 6,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 0,
              features: '0|1|1|1|0|0|1',
              metamodel: null
            }, {
              name: 'actionScripts',
              columnType: 'ASSOCIATION',
              options: [ ],
              order: 807,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 0,
              features: '1|1|0|1|0|0|0',
              metamodel: {
                qualifier: 'ActionScript',
                group: 'actionScript',
                path: 'endpoint.actionScripts',
                level: 3,
                distance: 1,
                relType: 'OUTER',
                columns: [ {
                  name: 'actionCode',
                  columnType: 'STRING',
                  options: [ ],
                  order: 201,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 20,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'actionSource',
                  columnType: 'STRING',
                  options: [ ],
                  order: 202,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 2048,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'actionType',
                  columnType: 'ENUM',
                  options: [ {
                    name: 'EMAIL',
                    label: 'ActionType.EMAIL',
                    value: 'EMAIL'
                  }, {
                    name: 'SMS',
                    label: 'ActionType.SMS',
                    value: 'SMS'
                  }, {
                    name: 'SCRIPT',
                    label: 'ActionType.SCRIPT',
                    value: 'SCRIPT'
                  } ],
                  order: 203,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 255,
                  features: '0|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'id',
                  columnType: 'NUMBER',
                  options: [ ],
                  order: 4,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '0|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'scriptName',
                  columnType: 'STRING',
                  options: [ ],
                  order: 205,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 255,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'scriptType',
                  columnType: 'ENUM',
                  options: [ {
                    name: 'SQL_SCRIPT',
                    label: 'ScriptType.SQL_SCRIPT',
                    value: 'SQL_SCRIPT'
                  }, {
                    name: 'SHELL_SCRIPT',
                    label: 'ScriptType.SHELL_SCRIPT',
                    value: 'SHELL_SCRIPT'
                  } ],
                  order: 206,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 255,
                  features: '0|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'actionParams',
                  columnType: 'ASSOCIATION',
                  options: [ ],
                  order: 1107,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '1|1|0|1|0|0|0',
                  metamodel: {
                    qualifier: 'ActionParam',
                    group: 'actionParam',
                    path: 'endpoint.actionScripts.actionParams',
                    level: 4,
                    distance: 2,
                    relType: 'OUTER',
                    columns: [ {
                      name: 'id',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 1,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramDataType',
                      columnType: 'ENUM',
                      options: [ {
                        name: 'STRING',
                        label: 'DataType.STRING',
                        value: 'STRING'
                      }, {
                        name: 'NUMBER',
                        label: 'DataType.NUMBER',
                        value: 'NUMBER'
                      }, {
                        name: 'DATE',
                        label: 'DataType.DATE',
                        value: 'DATE'
                      }, {
                        name: 'BOOLEAN',
                        label: 'DataType.BOOLEAN',
                        value: 'BOOLEAN'
                      } ],
                      order: 202,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramExpression',
                      columnType: 'STRING',
                      options: [ ],
                      order: 203,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramName',
                      columnType: 'STRING',
                      options: [ ],
                      order: 204,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramValue',
                      columnType: 'STRING',
                      options: [ ],
                      order: 205,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    } ],
                    aliases: [ 'endpoint.actionScripts.actionParams' ],
                    key: 'id',
                    operators: {
                      ASSOCIATION: [ ],
                      BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                      TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                      DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                  }
                }, {
                  name: 'actions',
                  columnType: 'ASSOCIATION',
                  options: [ ],
                  order: 1108,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '1|1|0|1|0|0|0',
                  metamodel: {
                    qualifier: 'Action',
                    group: 'action',
                    path: 'endpoint.actionScripts.actions',
                    level: 4,
                    distance: 2,
                    relType: 'OUTER',
                    columns: [ {
                      name: 'actionDescription',
                      columnType: 'STRING',
                      options: [ ],
                      order: 201,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 512,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'actionName',
                      columnType: 'STRING',
                      options: [ ],
                      order: 202,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'actionState',
                      columnType: 'ENUM',
                      options: [ {
                        name: 'PENDING',
                        label: 'ActionState.PENDING',
                        value: 'PENDING'
                      }, {
                        name: 'PAUSED',
                        label: 'ActionState.PAUSED',
                        value: 'PAUSED'
                      }, {
                        name: 'PROCESSING',
                        label: 'ActionState.PROCESSING',
                        value: 'PROCESSING'
                      }, {
                        name: 'COMPLETED',
                        label: 'ActionState.COMPLETED',
                        value: 'COMPLETED'
                      }, {
                        name: 'RESOLVED',
                        label: 'ActionState.RESOLVED',
                        value: 'RESOLVED'
                      } ],
                      order: 203,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'id',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 4,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'nextExecutionStartTime',
                      columnType: 'DATE',
                      options: [ ],
                      order: 205,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'resolutionRuleExpression',
                      columnType: 'STRING',
                      options: [ ],
                      order: 206,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 2048,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'actionExecutions',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1407,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '1|1|0|1|0|0|0',
                      metamodel: {
                        qualifier: 'ActionExecution',
                        group: 'actionExecution',
                        path: 'endpoint.actionScripts.actions.actionExecutions',
                        level: 5,
                        distance: 3,
                        relType: 'OUTER',
                        columns: [ {
                          name: 'actionLog',
                          columnType: 'STRING',
                          options: [ ],
                          order: 201,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 2048,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionEndTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStartTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStatus',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'PENDING',
                            label: 'ExecutionStatus.PENDING',
                            value: 'PENDING'
                          }, {
                            name: 'EXECUTING',
                            label: 'ExecutionStatus.EXECUTING',
                            value: 'EXECUTING'
                          }, {
                            name: 'CANCELLED',
                            label: 'ExecutionStatus.CANCELLED',
                            value: 'CANCELLED'
                          }, {
                            name: 'SUCCESS',
                            label: 'ExecutionStatus.SUCCESS',
                            value: 'SUCCESS'
                          }, {
                            name: 'FAILED',
                            label: 'ExecutionStatus.FAILED',
                            value: 'FAILED'
                          } ],
                          order: 204,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 5,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        } ],
                        aliases: [ 'endpoint.actionScripts.actions.actionExecutions' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    }, {
                      name: 'agent',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1408,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|0|0|0|0',
                      metamodel: {
                        qualifier: 'Agent',
                        group: 'agent',
                        path: 'endpoint.actionScripts.actions.agent',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                          name: 'agentDescription',
                          columnType: 'STRING',
                          options: [ ],
                          order: 201,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 512,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'agentInstanceId',
                          columnType: 'STRING',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 100,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'agentName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 100,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'agentStatus',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'ACTIVE',
                            label: 'AgentStatus.ACTIVE',
                            value: 'ACTIVE'
                          }, {
                            name: 'PASSIVE',
                            label: 'AgentStatus.PASSIVE',
                            value: 'PASSIVE'
                          }, {
                            name: 'DISCONNECTED',
                            label: 'AgentStatus.DISCONNECTED',
                            value: 'DISCONNECTED'
                          } ],
                          order: 204,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'agentType',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'SQL_AGENT',
                            label: 'AgentType.SQL_AGENT',
                            value: 'SQL_AGENT'
                          }, {
                            name: 'SHELL_AGENT',
                            label: 'AgentType.SHELL_AGENT',
                            value: 'SHELL_AGENT'
                          }, {
                            name: 'SQL_AND_SHELL_AGENT',
                            label: 'AgentType.SQL_AND_SHELL_AGENT',
                            value: 'SQL_AND_SHELL_AGENT'
                          } ],
                          order: 205,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 6,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|1|1|0|0|1',
                          metamodel: null
                        }, {
                          name: 'listenURI',
                          columnType: 'STRING',
                          options: [ ],
                          order: 207,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 512,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        } ],
                        aliases: [ 'endpoint.actionScripts.actions.agent' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    } ],
                    aliases: [ 'endpoint.actionScripts.actions' ],
                    key: 'id',
                    operators: {
                      ASSOCIATION: [ ],
                      BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                      TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                      DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                  }
                } ],
                aliases: [ 'endpoint.actionScripts' ],
                key: 'id',
                operators: {
                  ASSOCIATION: [ ],
                  BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                  TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                  ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                  DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                  DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                  STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                  NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
              }
            }, {
              name: 'checkScripts',
              columnType: 'ASSOCIATION',
              options: [ ],
              order: 808,
              min: 0,
              max: 0,
              minLength: 0,
              maxLength: 0,
              features: '1|1|0|1|0|0|0',
              metamodel: {
                qualifier: 'CheckScript',
                group: 'checkScript',
                path: 'endpoint.checkScripts',
                level: 3,
                distance: 1,
                relType: 'OUTER',
                columns: [ {
                  name: 'actionRuleExpression',
                  columnType: 'STRING',
                  options: [ ],
                  order: 201,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 2048,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'id',
                  columnType: 'NUMBER',
                  options: [ ],
                  order: 2,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '0|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'scriptName',
                  columnType: 'STRING',
                  options: [ ],
                  order: 203,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 255,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'scriptSource',
                  columnType: 'STRING',
                  options: [ ],
                  order: 204,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 2048,
                  features: '1|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'scriptType',
                  columnType: 'ENUM',
                  options: [ {
                    name: 'SQL_SCRIPT',
                    label: 'ScriptType.SQL_SCRIPT',
                    value: 'SQL_SCRIPT'
                  }, {
                    name: 'SHELL_SCRIPT',
                    label: 'ScriptType.SHELL_SCRIPT',
                    value: 'SHELL_SCRIPT'
                  } ],
                  order: 205,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 255,
                  features: '0|1|0|1|0|0|0',
                  metamodel: null
                }, {
                  name: 'contentMapper',
                  columnType: 'ASSOCIATION',
                  options: [ ],
                  order: 1106,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '0|1|1|0|0|0|0',
                  metamodel: {
                    qualifier: 'ContentMapper',
                    group: 'contentMapper',
                    path: 'endpoint.checkScripts.contentMapper',
                    level: 4,
                    distance: 1,
                    relType: 'INNER',
                    columns: [ {
                      name: 'containsHeader',
                      columnType: 'BOOLEAN',
                      options: [ ],
                      order: 201,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|1|0|0|0|0',
                      metamodel: null
                    }, {
                      name: 'fieldDelimiter',
                      columnType: 'STRING',
                      options: [ ],
                      order: 202,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 50,
                      features: '0|1|1|0|0|0|0',
                      metamodel: null
                    }, {
                      name: 'id',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 3,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|1|0|0|1',
                      metamodel: null
                    }, {
                      name: 'itemFormat',
                      columnType: 'ENUM',
                      options: [ {
                        name: 'SQL_RESULTSET',
                        label: 'ItemFormat.SQL_RESULTSET',
                        value: 'SQL_RESULTSET'
                      }, {
                        name: 'JSON',
                        label: 'ItemFormat.JSON',
                        value: 'JSON'
                      }, {
                        name: 'XML',
                        label: 'ItemFormat.XML',
                        value: 'XML'
                      }, {
                        name: 'DELIMITED_TEXT',
                        label: 'ItemFormat.DELIMITED_TEXT',
                        value: 'DELIMITED_TEXT'
                      }, {
                        name: 'FIXED_LENGTH_TEXT',
                        label: 'ItemFormat.FIXED_LENGTH_TEXT',
                        value: 'FIXED_LENGTH_TEXT'
                      }, {
                        name: 'ANY',
                        label: 'ItemFormat.ANY',
                        value: 'ANY'
                      } ],
                      order: 204,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|1|0|0|0|0',
                      metamodel: null
                    }, {
                      name: 'mapperName',
                      columnType: 'STRING',
                      options: [ ],
                      order: 205,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|1|0|0|0|0',
                      metamodel: null
                    }, {
                      name: 'fieldMappings',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1406,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '1|1|0|1|0|0|0',
                      metamodel: {
                        qualifier: 'FieldMapping',
                        group: 'fieldMapping',
                        path: 'endpoint.checkScripts.contentMapper.fieldMappings',
                        level: 5,
                        distance: 2,
                        relType: 'OUTER',
                        columns: [ {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 1,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'requiredData',
                          columnType: 'BOOLEAN',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceDataType',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'STRING',
                            label: 'DataType.STRING',
                            value: 'STRING'
                          }, {
                            name: 'NUMBER',
                            label: 'DataType.NUMBER',
                            value: 'NUMBER'
                          }, {
                            name: 'DATE',
                            label: 'DataType.DATE',
                            value: 'DATE'
                          }, {
                            name: 'BOOLEAN',
                            label: 'DataType.BOOLEAN',
                            value: 'BOOLEAN'
                          } ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceEndIndex',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 204,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceFormat',
                          columnType: 'STRING',
                          options: [ ],
                          order: 205,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceIndex',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 206,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 207,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'sourceStartIndex',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 208,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'targetColName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 209,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'targetDataType',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'STRING',
                            label: 'DataType.STRING',
                            value: 'STRING'
                          }, {
                            name: 'NUMBER',
                            label: 'DataType.NUMBER',
                            value: 'NUMBER'
                          }, {
                            name: 'DATE',
                            label: 'DataType.DATE',
                            value: 'DATE'
                          }, {
                            name: 'BOOLEAN',
                            label: 'DataType.BOOLEAN',
                            value: 'BOOLEAN'
                          } ],
                          order: 210,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'targetName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 211,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        }, {
                          name: 'transformation',
                          columnType: 'STRING',
                          options: [ ],
                          order: 212,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 2048,
                          features: '1|1|0|1|0|0|0',
                          metamodel: null
                        } ],
                        aliases: [ 'endpoint.checkScripts.contentMapper.fieldMappings' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    } ],
                    aliases: [ 'endpoint.checkScripts.contentMapper' ],
                    key: 'id',
                    operators: {
                      ASSOCIATION: [ ],
                      BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                      TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                      DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                  }
                }, {
                  name: 'contents',
                  columnType: 'ASSOCIATION',
                  options: [ ],
                  order: 1107,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '1|1|0|1|0|0|0',
                  metamodel: {
                    qualifier: 'Content',
                    group: 'content',
                    path: 'endpoint.checkScripts.contents',
                    level: 4,
                    distance: 2,
                    relType: 'OUTER',
                    columns: [ {
                      name: 'bool1',
                      columnType: 'DATE',
                      options: [ ],
                      order: 201,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'bool2',
                      columnType: 'DATE',
                      options: [ ],
                      order: 202,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'bool3',
                      columnType: 'DATE',
                      options: [ ],
                      order: 203,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'bool4',
                      columnType: 'DATE',
                      options: [ ],
                      order: 204,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'bool5',
                      columnType: 'DATE',
                      options: [ ],
                      order: 205,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date1',
                      columnType: 'DATE',
                      options: [ ],
                      order: 206,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date10',
                      columnType: 'DATE',
                      options: [ ],
                      order: 207,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date2',
                      columnType: 'DATE',
                      options: [ ],
                      order: 208,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date3',
                      columnType: 'DATE',
                      options: [ ],
                      order: 209,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date4',
                      columnType: 'DATE',
                      options: [ ],
                      order: 210,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date5',
                      columnType: 'DATE',
                      options: [ ],
                      order: 211,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date6',
                      columnType: 'DATE',
                      options: [ ],
                      order: 212,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date7',
                      columnType: 'DATE',
                      options: [ ],
                      order: 213,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date8',
                      columnType: 'DATE',
                      options: [ ],
                      order: 214,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'date9',
                      columnType: 'DATE',
                      options: [ ],
                      order: 215,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'id',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 16,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num1',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 217,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num10',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 218,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num11',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 219,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num12',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 220,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num13',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 221,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num14',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 222,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num15',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 223,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num16',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 224,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num17',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 225,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num18',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 226,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num19',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 227,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num2',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 228,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num20',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 229,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num3',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 230,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num4',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 231,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num5',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 232,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num6',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 233,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num7',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 234,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num8',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 235,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'num9',
                      columnType: 'DOUBLE',
                      options: [ ],
                      order: 236,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'sourceIndex',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 237,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt1',
                      columnType: 'STRING',
                      options: [ ],
                      order: 238,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt10',
                      columnType: 'STRING',
                      options: [ ],
                      order: 239,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt11',
                      columnType: 'STRING',
                      options: [ ],
                      order: 240,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt12',
                      columnType: 'STRING',
                      options: [ ],
                      order: 241,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt13',
                      columnType: 'STRING',
                      options: [ ],
                      order: 242,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt14',
                      columnType: 'STRING',
                      options: [ ],
                      order: 243,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt15',
                      columnType: 'STRING',
                      options: [ ],
                      order: 244,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt16',
                      columnType: 'STRING',
                      options: [ ],
                      order: 245,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt17',
                      columnType: 'STRING',
                      options: [ ],
                      order: 246,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt18',
                      columnType: 'STRING',
                      options: [ ],
                      order: 247,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt19',
                      columnType: 'STRING',
                      options: [ ],
                      order: 248,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt2',
                      columnType: 'STRING',
                      options: [ ],
                      order: 249,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt20',
                      columnType: 'STRING',
                      options: [ ],
                      order: 250,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt3',
                      columnType: 'STRING',
                      options: [ ],
                      order: 251,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt4',
                      columnType: 'STRING',
                      options: [ ],
                      order: 252,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt5',
                      columnType: 'STRING',
                      options: [ ],
                      order: 253,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt6',
                      columnType: 'STRING',
                      options: [ ],
                      order: 254,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt7',
                      columnType: 'STRING',
                      options: [ ],
                      order: 255,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt8',
                      columnType: 'STRING',
                      options: [ ],
                      order: 256,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'txt9',
                      columnType: 'STRING',
                      options: [ ],
                      order: 257,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'task',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1458,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|0|0|0|0',
                      metamodel: {
                        qualifier: 'Task',
                        group: 'task',
                        path: 'endpoint.checkScripts.contents.task',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 1,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|1|1|0|0|1',
                          metamodel: null
                        }, {
                          name: 'nextExecutionStartTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'taskDescription',
                          columnType: 'STRING',
                          options: [ ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 512,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'taskName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 204,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'taskState',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'PENDING',
                            label: 'TaskState.PENDING',
                            value: 'PENDING'
                          }, {
                            name: 'PAUSED',
                            label: 'TaskState.PAUSED',
                            value: 'PAUSED'
                          }, {
                            name: 'PROCESSING',
                            label: 'TaskState.PROCESSING',
                            value: 'PROCESSING'
                          } ],
                          order: 205,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'contentValidationErrors',
                          columnType: 'ASSOCIATION',
                          options: [ ],
                          order: 1706,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '1|1|0|1|0|0|0',
                          metamodel: {
                            qualifier: 'ContentValidationError',
                            group: 'contentValidationError',
                            path: 'endpoint.checkScripts.contents.task.contentValidationErrors',
                            level: 6,
                            distance: 3,
                            relType: 'OUTER',
                            columns: [ {
                              name: 'errorText',
                              columnType: 'STRING',
                              options: [ ],
                              order: 201,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 2048,
                              features: '1|1|0|1|0|0|0',
                              metamodel: null
                            }, {
                              name: 'id',
                              columnType: 'NUMBER',
                              options: [ ],
                              order: 2,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 0,
                              features: '0|1|0|1|0|0|0',
                              metamodel: null
                            }, {
                              name: 'sourceIndex',
                              columnType: 'NUMBER',
                              options: [ ],
                              order: 203,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '0|1|0|1|0|0|0',
                              metamodel: null
                            }, {
                              name: 'sourceText',
                              columnType: 'STRING',
                              options: [ ],
                              order: 204,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 2048,
                              features: '1|1|0|1|0|0|0',
                              metamodel: null
                            } ],
                            aliases: [
                              'endpoint.checkScripts.contents.task.contentValidationErrors',
                              'endpoint.checkScripts.contents.taskExecution.contentValidationErrors'
                            ],
                            key: 'id',
                            operators: {
                              ASSOCIATION: [ ],
                              BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                              TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                              ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                              DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                              DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                              STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                              NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                            }
                          }
                        } ],
                        aliases: [ 'endpoint.checkScripts.contents.task' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    }, {
                      name: 'flow',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1459,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|0|0|0|0',
                      metamodel: {
                        qualifier: 'Flow',
                        group: 'flow',
                        path: 'endpoint.checkScripts.contents.flow',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                          name: 'flowDescription',
                          columnType: 'STRING',
                          options: [ ],
                          order: 201,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 512,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'flowName',
                          columnType: 'STRING',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'flowState',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'PENDING',
                            label: 'FlowState.PENDING',
                            value: 'PENDING'
                          }, {
                            name: 'PAUSED',
                            label: 'FlowState.PAUSED',
                            value: 'PAUSED'
                          }, {
                            name: 'PROCESSING',
                            label: 'FlowState.PROCESSING',
                            value: 'PROCESSING'
                          } ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 4,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|1|1|0|0|1',
                          metamodel: null
                        }, {
                          name: 'nextExecutionStartTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 205,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'eventTrigger',
                          columnType: 'ASSOCIATION',
                          options: [ ],
                          order: 1706,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '1|1|1|0|0|0|0',
                          metamodel: {
                            qualifier: 'EventTrigger',
                            group: 'eventTrigger',
                            path: 'endpoint.checkScripts.contents.flow.eventTrigger',
                            level: 6,
                            distance: 2,
                            relType: 'INNER',
                            columns: [ {
                              name: 'id',
                              columnType: 'NUMBER',
                              options: [ ],
                              order: 1,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 0,
                              features: '0|1|1|1|0|0|1',
                              metamodel: null
                            }, {
                              name: 'triggerCronExpression',
                              columnType: 'STRING',
                              options: [ ],
                              order: 202,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '1|1|1|0|0|0|0',
                              metamodel: null
                            }, {
                              name: 'triggerCronTimeZone',
                              columnType: 'STRING',
                              options: [ ],
                              order: 203,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '1|1|1|0|0|0|0',
                              metamodel: null
                            }, {
                              name: 'triggerName',
                              columnType: 'STRING',
                              options: [ ],
                              order: 204,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 100,
                              features: '0|1|1|0|0|0|0',
                              metamodel: null
                            }, {
                              name: 'triggerPeriod',
                              columnType: 'NUMBER',
                              options: [ ],
                              order: 205,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '1|1|1|0|0|0|0',
                              metamodel: null
                            }, {
                              name: 'triggerTimeUnit',
                              columnType: 'ENUM',
                              options: [ {
                                name: 'SECOND',
                                label: 'TimeUnit.SECOND',
                                value: 'SECOND'
                              }, {
                                name: 'MINUTE',
                                label: 'TimeUnit.MINUTE',
                                value: 'MINUTE'
                              }, {
                                name: 'HOUR',
                                label: 'TimeUnit.HOUR',
                                value: 'HOUR'
                              }, {
                                name: 'DAY',
                                label: 'TimeUnit.DAY',
                                value: 'DAY'
                              } ],
                              order: 206,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '1|1|1|0|0|0|0',
                              metamodel: null
                            }, {
                              name: 'triggerType',
                              columnType: 'ENUM',
                              options: [ {
                                name: 'MANUAL',
                                label: 'TriggerType.MANUAL',
                                value: 'MANUAL'
                              }, {
                                name: 'PERIODIC',
                                label: 'TriggerType.PERIODIC',
                                value: 'PERIODIC'
                              }, {
                                name: 'CRON',
                                label: 'TriggerType.CRON',
                                value: 'CRON'
                              }, {
                                name: 'EVENT',
                                label: 'TriggerType.EVENT',
                                value: 'EVENT'
                              } ],
                              order: 207,
                              min: 0,
                              max: 0,
                              minLength: 0,
                              maxLength: 255,
                              features: '0|1|1|0|0|0|0',
                              metamodel: null
                            } ],
                            aliases: [ 'endpoint.checkScripts.contents.flow.eventTrigger' ],
                            key: 'id',
                            operators: {
                              ASSOCIATION: [ ],
                              BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                              TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                              ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                              DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                              DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                              STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                              NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                            }
                          }
                        } ],
                        aliases: [ 'endpoint.checkScripts.contents.flow' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    }, {
                      name: 'flowExecution',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1460,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|0|0|0|0',
                      metamodel: {
                        qualifier: 'FlowExecution',
                        group: 'flowExecution',
                        path: 'endpoint.checkScripts.contents.flowExecution',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                          name: 'errorTaskCount',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 201,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionEndTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStartTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStatus',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'PENDING',
                            label: 'ExecutionStatus.PENDING',
                            value: 'PENDING'
                          }, {
                            name: 'EXECUTING',
                            label: 'ExecutionStatus.EXECUTING',
                            value: 'EXECUTING'
                          }, {
                            name: 'CANCELLED',
                            label: 'ExecutionStatus.CANCELLED',
                            value: 'CANCELLED'
                          }, {
                            name: 'SUCCESS',
                            label: 'ExecutionStatus.SUCCESS',
                            value: 'SUCCESS'
                          }, {
                            name: 'FAILED',
                            label: 'ExecutionStatus.FAILED',
                            value: 'FAILED'
                          } ],
                          order: 204,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 5,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|1|1|0|0|1',
                          metamodel: null
                        }, {
                          name: 'runningTaskCount',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 206,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'totalTaskCount',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 207,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '1|1|1|0|0|0|0',
                          metamodel: null
                        } ],
                        aliases: [ 'endpoint.checkScripts.contents.flowExecution' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    }, {
                      name: 'taskExecution',
                      columnType: 'ASSOCIATION',
                      options: [ ],
                      order: 1461,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|1|0|0|0|0',
                      metamodel: {
                        qualifier: 'TaskExecution',
                        group: 'taskExecution',
                        path: 'endpoint.checkScripts.contents.taskExecution',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                          name: 'executionEndTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 201,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStartTime',
                          columnType: 'DATE',
                          options: [ ],
                          order: 202,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'executionStatus',
                          columnType: 'ENUM',
                          options: [ {
                            name: 'PENDING',
                            label: 'ExecutionStatus.PENDING',
                            value: 'PENDING'
                          }, {
                            name: 'EXECUTING',
                            label: 'ExecutionStatus.EXECUTING',
                            value: 'EXECUTING'
                          }, {
                            name: 'CANCELLED',
                            label: 'ExecutionStatus.CANCELLED',
                            value: 'CANCELLED'
                          }, {
                            name: 'SUCCESS',
                            label: 'ExecutionStatus.SUCCESS',
                            value: 'SUCCESS'
                          }, {
                            name: 'FAILED',
                            label: 'ExecutionStatus.FAILED',
                            value: 'FAILED'
                          } ],
                          order: 203,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 255,
                          features: '0|1|1|0|0|0|0',
                          metamodel: null
                        }, {
                          name: 'id',
                          columnType: 'NUMBER',
                          options: [ ],
                          order: 4,
                          min: 0,
                          max: 0,
                          minLength: 0,
                          maxLength: 0,
                          features: '0|1|1|1|0|0|1',
                          metamodel: null
                        } ],
                        aliases: [ 'endpoint.checkScripts.contents.taskExecution' ],
                        key: 'id',
                        operators: {
                          ASSOCIATION: [ ],
                          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                      }
                    } ],
                    aliases: [ 'endpoint.checkScripts.contents' ],
                    key: 'id',
                    operators: {
                      ASSOCIATION: [ ],
                      BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                      TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                      DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                  }
                }, {
                  name: 'scriptParams',
                  columnType: 'ASSOCIATION',
                  options: [ ],
                  order: 1108,
                  min: 0,
                  max: 0,
                  minLength: 0,
                  maxLength: 0,
                  features: '1|1|0|1|0|0|0',
                  metamodel: {
                    qualifier: 'ScriptParam',
                    group: 'scriptParam',
                    path: 'endpoint.checkScripts.scriptParams',
                    level: 4,
                    distance: 2,
                    relType: 'OUTER',
                    columns: [ {
                      name: 'id',
                      columnType: 'NUMBER',
                      options: [ ],
                      order: 1,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 0,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramDataType',
                      columnType: 'ENUM',
                      options: [ {
                        name: 'STRING',
                        label: 'DataType.STRING',
                        value: 'STRING'
                      }, {
                        name: 'NUMBER',
                        label: 'DataType.NUMBER',
                        value: 'NUMBER'
                      }, {
                        name: 'DATE',
                        label: 'DataType.DATE',
                        value: 'DATE'
                      }, {
                        name: 'BOOLEAN',
                        label: 'DataType.BOOLEAN',
                        value: 'BOOLEAN'
                      } ],
                      order: 202,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '0|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramExpression',
                      columnType: 'STRING',
                      options: [ ],
                      order: 203,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramName',
                      columnType: 'STRING',
                      options: [ ],
                      order: 204,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    }, {
                      name: 'paramValue',
                      columnType: 'STRING',
                      options: [ ],
                      order: 205,
                      min: 0,
                      max: 0,
                      minLength: 0,
                      maxLength: 255,
                      features: '1|1|0|1|0|0|0',
                      metamodel: null
                    } ],
                    aliases: [ 'endpoint.checkScripts.scriptParams' ],
                    key: 'id',
                    operators: {
                      ASSOCIATION: [ ],
                      BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                      TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                      DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                      STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                      NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                  }
                } ],
                aliases: [ 'endpoint.checkScripts' ],
                key: 'id',
                operators: {
                  ASSOCIATION: [ ],
                  BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                  TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                  ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                  DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                  DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                  STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                  NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
              }
            } ],
            aliases: [ 'endpoint' ],
            key: 'id',
            operators: {
              ASSOCIATION: [ ],
              BOOLEAN: [ 'EQ', 'NOT_EQ' ],
              TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
              ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
              DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
              DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
              STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
              NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
            }
          }
        } ],
        aliases: [ ],
        key: 'id',
        operators: {
          ASSOCIATION: [ ],
          BOOLEAN: [ 'EQ', 'NOT_EQ' ],
          TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
          ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
          DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
          DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
          STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
          NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
        }
      };
}


export function getSampleEndpointMetamodelData(): any {
    return {
        qualifier: 'Endpoint',
        group: 'endpoint',
        path: '',
        level: 1,
        distance: 0,
        relType: 'SELF',
        columns: [ {
        name: 'endpointDescription',
        columnType: 'STRING',
        options: [ ],
        order: 101,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 512,
        features: '1|1|1|1|1|0|0',
        metamodel: null
        }, {
        name: 'endpointInstanceId',
        columnType: 'STRING',
        options: [ ],
        order: 102,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 100,
        features: '1|1|1|1|1|0|0',
        metamodel: null
        }, {
        name: 'endpointName',
        columnType: 'STRING',
        options: [ ],
        order: 103,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 100,
        features: '0|1|1|1|1|0|0',
        metamodel: null
        }, {
        name: 'endpointSpec',
        columnType: 'ENUM',
        options: [ {
            name: 'ANY',
            label: 'EndpointSpec.ANY',
            value: 'ANY'
        }, {
            name: 'MSSQL',
            label: 'EndpointSpec.MSSQL',
            value: 'MSSQL'
        }, {
            name: 'MYSQL',
            label: 'EndpointSpec.MYSQL',
            value: 'MYSQL'
        }, {
            name: 'POSTGRESQL',
            label: 'EndpointSpec.POSTGRESQL',
            value: 'POSTGRESQL'
        }, {
            name: 'ORACLE',
            label: 'EndpointSpec.ORACLE',
            value: 'ORACLE'
        }, {
            name: 'MONGODB',
            label: 'EndpointSpec.MONGODB',
            value: 'MONGODB'
        } ],
        order: 104,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 255,
        features: '0|1|1|1|1|0|0',
        metamodel: null
        }, {
        name: 'endpointType',
        columnType: 'ENUM',
        options: [ {
            name: 'DATABASE',
            label: 'EndpointType.DATABASE',
            value: 'DATABASE'
        }, {
            name: 'FILE_SYSTEM',
            label: 'EndpointType.FILE_SYSTEM',
            value: 'FILE_SYSTEM'
        }, {
            name: 'FTP',
            label: 'EndpointType.FTP',
            value: 'FTP'
        }, {
            name: 'SFTP',
            label: 'EndpointType.SFTP',
            value: 'SFTP'
        }, {
            name: 'SSH',
            label: 'EndpointType.SSH',
            value: 'SSH'
        }, {
            name: 'REST',
            label: 'EndpointType.REST',
            value: 'REST'
        }, {
            name: 'WEBSERVICE',
            label: 'EndpointType.WEBSERVICE',
            value: 'WEBSERVICE'
        }, {
            name: 'AGENT',
            label: 'EndpointType.AGENT',
            value: 'AGENT'
        } ],
        order: 105,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 255,
        features: '0|1|1|1|1|0|0',
        metamodel: null
        }, {
        name: 'id',
        columnType: 'NUMBER',
        options: [ ],
        order: 6,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        features: '0|1|1|1|0|0|1',
        metamodel: null
        }, {
        name: 'actionScripts',
        columnType: 'ASSOCIATION',
        options: [ ],
        order: 507,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        features: '1|1|0|1|0|0|0',
        metamodel: {
            qualifier: 'ActionScript',
            group: 'actionScript',
            path: 'actionScripts',
            level: 2,
            distance: 1,
            relType: 'OUTER',
            columns: [ {
            name: 'actionCode',
            columnType: 'STRING',
            options: [ ],
            order: 201,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 20,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'actionSource',
            columnType: 'STRING',
            options: [ ],
            order: 202,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 2048,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'actionType',
            columnType: 'ENUM',
            options: [ {
                name: 'EMAIL',
                label: 'ActionType.EMAIL',
                value: 'EMAIL'
            }, {
                name: 'SMS',
                label: 'ActionType.SMS',
                value: 'SMS'
            }, {
                name: 'SCRIPT',
                label: 'ActionType.SCRIPT',
                value: 'SCRIPT'
            } ],
            order: 203,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'id',
            columnType: 'NUMBER',
            options: [ ],
            order: 4,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'scriptName',
            columnType: 'STRING',
            options: [ ],
            order: 205,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'scriptType',
            columnType: 'ENUM',
            options: [ {
                name: 'SQL_SCRIPT',
                label: 'ScriptType.SQL_SCRIPT',
                value: 'SQL_SCRIPT'
            }, {
                name: 'SHELL_SCRIPT',
                label: 'ScriptType.SHELL_SCRIPT',
                value: 'SHELL_SCRIPT'
            } ],
            order: 206,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'actionParams',
            columnType: 'ASSOCIATION',
            options: [ ],
            order: 807,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '1|1|0|1|0|0|0',
            metamodel: {
                qualifier: 'ActionParam',
                group: 'actionParam',
                path: 'actionScripts.actionParams',
                level: 3,
                distance: 2,
                relType: 'OUTER',
                columns: [ {
                name: 'id',
                columnType: 'NUMBER',
                options: [ ],
                order: 1,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramDataType',
                columnType: 'ENUM',
                options: [ {
                    name: 'STRING',
                    label: 'DataType.STRING',
                    value: 'STRING'
                }, {
                    name: 'NUMBER',
                    label: 'DataType.NUMBER',
                    value: 'NUMBER'
                }, {
                    name: 'DATE',
                    label: 'DataType.DATE',
                    value: 'DATE'
                }, {
                    name: 'BOOLEAN',
                    label: 'DataType.BOOLEAN',
                    value: 'BOOLEAN'
                } ],
                order: 202,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramExpression',
                columnType: 'STRING',
                options: [ ],
                order: 203,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramName',
                columnType: 'STRING',
                options: [ ],
                order: 204,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramValue',
                columnType: 'STRING',
                options: [ ],
                order: 205,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                } ],
                aliases: [ 'actionScripts.actionParams' ],
                key: 'id',
                operators: {
                ASSOCIATION: [ ],
                BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
            }
            }, {
            name: 'actions',
            columnType: 'ASSOCIATION',
            options: [ ],
            order: 808,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '1|1|0|1|0|0|0',
            metamodel: {
                qualifier: 'Action',
                group: 'action',
                path: 'actionScripts.actions',
                level: 3,
                distance: 2,
                relType: 'OUTER',
                columns: [ {
                name: 'actionDescription',
                columnType: 'STRING',
                options: [ ],
                order: 201,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 512,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'actionName',
                columnType: 'STRING',
                options: [ ],
                order: 202,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'actionState',
                columnType: 'ENUM',
                options: [ {
                    name: 'PENDING',
                    label: 'ActionState.PENDING',
                    value: 'PENDING'
                }, {
                    name: 'PAUSED',
                    label: 'ActionState.PAUSED',
                    value: 'PAUSED'
                }, {
                    name: 'PROCESSING',
                    label: 'ActionState.PROCESSING',
                    value: 'PROCESSING'
                }, {
                    name: 'COMPLETED',
                    label: 'ActionState.COMPLETED',
                    value: 'COMPLETED'
                }, {
                    name: 'RESOLVED',
                    label: 'ActionState.RESOLVED',
                    value: 'RESOLVED'
                } ],
                order: 203,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'id',
                columnType: 'NUMBER',
                options: [ ],
                order: 4,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'nextExecutionStartTime',
                columnType: 'DATE',
                options: [ ],
                order: 205,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'resolutionRuleExpression',
                columnType: 'STRING',
                options: [ ],
                order: 206,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 2048,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'actionExecutions',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1107,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '1|1|0|1|0|0|0',
                metamodel: {
                    qualifier: 'ActionExecution',
                    group: 'actionExecution',
                    path: 'actionScripts.actions.actionExecutions',
                    level: 4,
                    distance: 3,
                    relType: 'OUTER',
                    columns: [ {
                    name: 'actionLog',
                    columnType: 'STRING',
                    options: [ ],
                    order: 201,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 2048,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionEndTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStartTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStatus',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'PENDING',
                        label: 'ExecutionStatus.PENDING',
                        value: 'PENDING'
                    }, {
                        name: 'EXECUTING',
                        label: 'ExecutionStatus.EXECUTING',
                        value: 'EXECUTING'
                    }, {
                        name: 'CANCELLED',
                        label: 'ExecutionStatus.CANCELLED',
                        value: 'CANCELLED'
                    }, {
                        name: 'SUCCESS',
                        label: 'ExecutionStatus.SUCCESS',
                        value: 'SUCCESS'
                    }, {
                        name: 'FAILED',
                        label: 'ExecutionStatus.FAILED',
                        value: 'FAILED'
                    } ],
                    order: 204,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 5,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    } ],
                    aliases: [ 'actionScripts.actions.actionExecutions' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                }, {
                name: 'agent',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1108,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|0|0|0|0',
                metamodel: {
                    qualifier: 'Agent',
                    group: 'agent',
                    path: 'actionScripts.actions.agent',
                    level: 4,
                    distance: 2,
                    relType: 'INNER',
                    columns: [ {
                    name: 'agentDescription',
                    columnType: 'STRING',
                    options: [ ],
                    order: 201,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 512,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'agentInstanceId',
                    columnType: 'STRING',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 100,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'agentName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 100,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'agentStatus',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'ACTIVE',
                        label: 'AgentStatus.ACTIVE',
                        value: 'ACTIVE'
                    }, {
                        name: 'PASSIVE',
                        label: 'AgentStatus.PASSIVE',
                        value: 'PASSIVE'
                    }, {
                        name: 'DISCONNECTED',
                        label: 'AgentStatus.DISCONNECTED',
                        value: 'DISCONNECTED'
                    } ],
                    order: 204,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'agentType',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'SQL_AGENT',
                        label: 'AgentType.SQL_AGENT',
                        value: 'SQL_AGENT'
                    }, {
                        name: 'SHELL_AGENT',
                        label: 'AgentType.SHELL_AGENT',
                        value: 'SHELL_AGENT'
                    }, {
                        name: 'SQL_AND_SHELL_AGENT',
                        label: 'AgentType.SQL_AND_SHELL_AGENT',
                        value: 'SQL_AND_SHELL_AGENT'
                    } ],
                    order: 205,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 6,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|1|1|0|0|1',
                    metamodel: null
                    }, {
                    name: 'listenURI',
                    columnType: 'STRING',
                    options: [ ],
                    order: 207,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 512,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    } ],
                    aliases: [ 'actionScripts.actions.agent' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                } ],
                aliases: [ 'actionScripts.actions' ],
                key: 'id',
                operators: {
                ASSOCIATION: [ ],
                BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
            }
            } ],
            aliases: [ 'actionScripts' ],
            key: 'id',
            operators: {
            ASSOCIATION: [ ],
            BOOLEAN: [ 'EQ', 'NOT_EQ' ],
            TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
            DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
            }
        }
        }, {
        name: 'checkScripts',
        columnType: 'ASSOCIATION',
        options: [ ],
        order: 508,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        features: '1|1|0|1|0|0|0',
        metamodel: {
            qualifier: 'CheckScript',
            group: 'checkScript',
            path: 'checkScripts',
            level: 2,
            distance: 1,
            relType: 'OUTER',
            columns: [ {
            name: 'actionRuleExpression',
            columnType: 'STRING',
            options: [ ],
            order: 201,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 2048,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'id',
            columnType: 'NUMBER',
            options: [ ],
            order: 2,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'scriptName',
            columnType: 'STRING',
            options: [ ],
            order: 203,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'scriptSource',
            columnType: 'STRING',
            options: [ ],
            order: 204,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 2048,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'scriptType',
            columnType: 'ENUM',
            options: [ {
                name: 'SQL_SCRIPT',
                label: 'ScriptType.SQL_SCRIPT',
                value: 'SQL_SCRIPT'
            }, {
                name: 'SHELL_SCRIPT',
                label: 'ScriptType.SHELL_SCRIPT',
                value: 'SHELL_SCRIPT'
            } ],
            order: 205,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'contentMapper',
            columnType: 'ASSOCIATION',
            options: [ ],
            order: 806,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '0|1|1|0|0|0|0',
            metamodel: {
                qualifier: 'ContentMapper',
                group: 'contentMapper',
                path: 'checkScripts.contentMapper',
                level: 3,
                distance: 1,
                relType: 'INNER',
                columns: [ {
                name: 'containsHeader',
                columnType: 'BOOLEAN',
                options: [ ],
                order: 201,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|1|0|0|0|0',
                metamodel: null
                }, {
                name: 'fieldDelimiter',
                columnType: 'STRING',
                options: [ ],
                order: 202,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 50,
                features: '0|1|1|0|0|0|0',
                metamodel: null
                }, {
                name: 'id',
                columnType: 'NUMBER',
                options: [ ],
                order: 3,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|1|0|0|1',
                metamodel: null
                }, {
                name: 'itemFormat',
                columnType: 'ENUM',
                options: [ {
                    name: 'SQL_RESULTSET',
                    label: 'ItemFormat.SQL_RESULTSET',
                    value: 'SQL_RESULTSET'
                }, {
                    name: 'JSON',
                    label: 'ItemFormat.JSON',
                    value: 'JSON'
                }, {
                    name: 'XML',
                    label: 'ItemFormat.XML',
                    value: 'XML'
                }, {
                    name: 'DELIMITED_TEXT',
                    label: 'ItemFormat.DELIMITED_TEXT',
                    value: 'DELIMITED_TEXT'
                }, {
                    name: 'FIXED_LENGTH_TEXT',
                    label: 'ItemFormat.FIXED_LENGTH_TEXT',
                    value: 'FIXED_LENGTH_TEXT'
                }, {
                    name: 'ANY',
                    label: 'ItemFormat.ANY',
                    value: 'ANY'
                } ],
                order: 204,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|1|0|0|0|0',
                metamodel: null
                }, {
                name: 'mapperName',
                columnType: 'STRING',
                options: [ ],
                order: 205,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|1|0|0|0|0',
                metamodel: null
                }, {
                name: 'fieldMappings',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1106,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '1|1|0|1|0|0|0',
                metamodel: {
                    qualifier: 'FieldMapping',
                    group: 'fieldMapping',
                    path: 'checkScripts.contentMapper.fieldMappings',
                    level: 4,
                    distance: 2,
                    relType: 'OUTER',
                    columns: [ {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 1,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'requiredData',
                    columnType: 'BOOLEAN',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceDataType',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'STRING',
                        label: 'DataType.STRING',
                        value: 'STRING'
                    }, {
                        name: 'NUMBER',
                        label: 'DataType.NUMBER',
                        value: 'NUMBER'
                    }, {
                        name: 'DATE',
                        label: 'DataType.DATE',
                        value: 'DATE'
                    }, {
                        name: 'BOOLEAN',
                        label: 'DataType.BOOLEAN',
                        value: 'BOOLEAN'
                    } ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceEndIndex',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 204,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceFormat',
                    columnType: 'STRING',
                    options: [ ],
                    order: 205,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceIndex',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 206,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 207,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'sourceStartIndex',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 208,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'targetColName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 209,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'targetDataType',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'STRING',
                        label: 'DataType.STRING',
                        value: 'STRING'
                    }, {
                        name: 'NUMBER',
                        label: 'DataType.NUMBER',
                        value: 'NUMBER'
                    }, {
                        name: 'DATE',
                        label: 'DataType.DATE',
                        value: 'DATE'
                    }, {
                        name: 'BOOLEAN',
                        label: 'DataType.BOOLEAN',
                        value: 'BOOLEAN'
                    } ],
                    order: 210,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'targetName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 211,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    }, {
                    name: 'transformation',
                    columnType: 'STRING',
                    options: [ ],
                    order: 212,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 2048,
                    features: '1|1|0|1|0|0|0',
                    metamodel: null
                    } ],
                    aliases: [ 'checkScripts.contentMapper.fieldMappings' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                } ],
                aliases: [ 'checkScripts.contentMapper' ],
                key: 'id',
                operators: {
                ASSOCIATION: [ ],
                BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
            }
            }, {
            name: 'contents',
            columnType: 'ASSOCIATION',
            options: [ ],
            order: 807,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '1|1|0|1|0|0|0',
            metamodel: {
                qualifier: 'Content',
                group: 'content',
                path: 'checkScripts.contents',
                level: 3,
                distance: 2,
                relType: 'OUTER',
                columns: [ {
                name: 'bool1',
                columnType: 'DATE',
                options: [ ],
                order: 201,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'bool2',
                columnType: 'DATE',
                options: [ ],
                order: 202,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'bool3',
                columnType: 'DATE',
                options: [ ],
                order: 203,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'bool4',
                columnType: 'DATE',
                options: [ ],
                order: 204,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'bool5',
                columnType: 'DATE',
                options: [ ],
                order: 205,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date1',
                columnType: 'DATE',
                options: [ ],
                order: 206,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date10',
                columnType: 'DATE',
                options: [ ],
                order: 207,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date2',
                columnType: 'DATE',
                options: [ ],
                order: 208,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date3',
                columnType: 'DATE',
                options: [ ],
                order: 209,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date4',
                columnType: 'DATE',
                options: [ ],
                order: 210,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date5',
                columnType: 'DATE',
                options: [ ],
                order: 211,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date6',
                columnType: 'DATE',
                options: [ ],
                order: 212,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date7',
                columnType: 'DATE',
                options: [ ],
                order: 213,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date8',
                columnType: 'DATE',
                options: [ ],
                order: 214,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'date9',
                columnType: 'DATE',
                options: [ ],
                order: 215,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'id',
                columnType: 'NUMBER',
                options: [ ],
                order: 16,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num1',
                columnType: 'DOUBLE',
                options: [ ],
                order: 217,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num10',
                columnType: 'DOUBLE',
                options: [ ],
                order: 218,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num11',
                columnType: 'DOUBLE',
                options: [ ],
                order: 219,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num12',
                columnType: 'DOUBLE',
                options: [ ],
                order: 220,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num13',
                columnType: 'DOUBLE',
                options: [ ],
                order: 221,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num14',
                columnType: 'DOUBLE',
                options: [ ],
                order: 222,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num15',
                columnType: 'DOUBLE',
                options: [ ],
                order: 223,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num16',
                columnType: 'DOUBLE',
                options: [ ],
                order: 224,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num17',
                columnType: 'DOUBLE',
                options: [ ],
                order: 225,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num18',
                columnType: 'DOUBLE',
                options: [ ],
                order: 226,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num19',
                columnType: 'DOUBLE',
                options: [ ],
                order: 227,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num2',
                columnType: 'DOUBLE',
                options: [ ],
                order: 228,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num20',
                columnType: 'DOUBLE',
                options: [ ],
                order: 229,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num3',
                columnType: 'DOUBLE',
                options: [ ],
                order: 230,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num4',
                columnType: 'DOUBLE',
                options: [ ],
                order: 231,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num5',
                columnType: 'DOUBLE',
                options: [ ],
                order: 232,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num6',
                columnType: 'DOUBLE',
                options: [ ],
                order: 233,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num7',
                columnType: 'DOUBLE',
                options: [ ],
                order: 234,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num8',
                columnType: 'DOUBLE',
                options: [ ],
                order: 235,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'num9',
                columnType: 'DOUBLE',
                options: [ ],
                order: 236,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'sourceIndex',
                columnType: 'NUMBER',
                options: [ ],
                order: 237,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt1',
                columnType: 'STRING',
                options: [ ],
                order: 238,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt10',
                columnType: 'STRING',
                options: [ ],
                order: 239,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt11',
                columnType: 'STRING',
                options: [ ],
                order: 240,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt12',
                columnType: 'STRING',
                options: [ ],
                order: 241,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt13',
                columnType: 'STRING',
                options: [ ],
                order: 242,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt14',
                columnType: 'STRING',
                options: [ ],
                order: 243,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt15',
                columnType: 'STRING',
                options: [ ],
                order: 244,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt16',
                columnType: 'STRING',
                options: [ ],
                order: 245,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt17',
                columnType: 'STRING',
                options: [ ],
                order: 246,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt18',
                columnType: 'STRING',
                options: [ ],
                order: 247,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt19',
                columnType: 'STRING',
                options: [ ],
                order: 248,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt2',
                columnType: 'STRING',
                options: [ ],
                order: 249,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt20',
                columnType: 'STRING',
                options: [ ],
                order: 250,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt3',
                columnType: 'STRING',
                options: [ ],
                order: 251,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt4',
                columnType: 'STRING',
                options: [ ],
                order: 252,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt5',
                columnType: 'STRING',
                options: [ ],
                order: 253,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt6',
                columnType: 'STRING',
                options: [ ],
                order: 254,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt7',
                columnType: 'STRING',
                options: [ ],
                order: 255,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt8',
                columnType: 'STRING',
                options: [ ],
                order: 256,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'txt9',
                columnType: 'STRING',
                options: [ ],
                order: 257,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'task',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1158,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|0|0|0|0',
                metamodel: {
                    qualifier: 'Task',
                    group: 'task',
                    path: 'checkScripts.contents.task',
                    level: 4,
                    distance: 2,
                    relType: 'INNER',
                    columns: [ {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 1,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|1|1|0|0|1',
                    metamodel: null
                    }, {
                    name: 'nextExecutionStartTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'taskDescription',
                    columnType: 'STRING',
                    options: [ ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 512,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'taskName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 204,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'taskState',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'PENDING',
                        label: 'TaskState.PENDING',
                        value: 'PENDING'
                    }, {
                        name: 'PAUSED',
                        label: 'TaskState.PAUSED',
                        value: 'PAUSED'
                    }, {
                        name: 'PROCESSING',
                        label: 'TaskState.PROCESSING',
                        value: 'PROCESSING'
                    } ],
                    order: 205,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'contentValidationErrors',
                    columnType: 'ASSOCIATION',
                    options: [ ],
                    order: 1406,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '1|1|0|1|0|0|0',
                    metamodel: {
                        qualifier: 'ContentValidationError',
                        group: 'contentValidationError',
                        path: 'checkScripts.contents.task.contentValidationErrors',
                        level: 5,
                        distance: 3,
                        relType: 'OUTER',
                        columns: [ {
                        name: 'errorText',
                        columnType: 'STRING',
                        options: [ ],
                        order: 201,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 2048,
                        features: '1|1|0|1|0|0|0',
                        metamodel: null
                        }, {
                        name: 'id',
                        columnType: 'NUMBER',
                        options: [ ],
                        order: 2,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 0,
                        features: '0|1|0|1|0|0|0',
                        metamodel: null
                        }, {
                        name: 'sourceIndex',
                        columnType: 'NUMBER',
                        options: [ ],
                        order: 203,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '0|1|0|1|0|0|0',
                        metamodel: null
                        }, {
                        name: 'sourceText',
                        columnType: 'STRING',
                        options: [ ],
                        order: 204,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 2048,
                        features: '1|1|0|1|0|0|0',
                        metamodel: null
                        } ],
                        aliases: [
                          'checkScripts.contents.task.contentValidationErrors',
                          'checkScripts.contents.taskExecution.contentValidationErrors'
                        ],
                        key: 'id',
                        operators: {
                        ASSOCIATION: [ ],
                        BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                        TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                        ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                        DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                        DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                        STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                        NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                    }
                    } ],
                    aliases: [ 'checkScripts.contents.task' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                }, {
                name: 'flow',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1159,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|0|0|0|0',
                metamodel: {
                    qualifier: 'Flow',
                    group: 'flow',
                    path: 'checkScripts.contents.flow',
                    level: 4,
                    distance: 2,
                    relType: 'INNER',
                    columns: [ {
                    name: 'flowDescription',
                    columnType: 'STRING',
                    options: [ ],
                    order: 201,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 512,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'flowName',
                    columnType: 'STRING',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'flowState',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'PENDING',
                        label: 'FlowState.PENDING',
                        value: 'PENDING'
                    }, {
                        name: 'PAUSED',
                        label: 'FlowState.PAUSED',
                        value: 'PAUSED'
                    }, {
                        name: 'PROCESSING',
                        label: 'FlowState.PROCESSING',
                        value: 'PROCESSING'
                    } ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 4,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|1|1|0|0|1',
                    metamodel: null
                    }, {
                    name: 'nextExecutionStartTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 205,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'eventTrigger',
                    columnType: 'ASSOCIATION',
                    options: [ ],
                    order: 1406,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '1|1|1|0|0|0|0',
                    metamodel: {
                        qualifier: 'EventTrigger',
                        group: 'eventTrigger',
                        path: 'checkScripts.contents.flow.eventTrigger',
                        level: 5,
                        distance: 2,
                        relType: 'INNER',
                        columns: [ {
                        name: 'id',
                        columnType: 'NUMBER',
                        options: [ ],
                        order: 1,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 0,
                        features: '0|1|1|1|0|0|1',
                        metamodel: null
                        }, {
                        name: 'triggerCronExpression',
                        columnType: 'STRING',
                        options: [ ],
                        order: 202,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '1|1|1|0|0|0|0',
                        metamodel: null
                        }, {
                        name: 'triggerCronTimeZone',
                        columnType: 'STRING',
                        options: [ ],
                        order: 203,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '1|1|1|0|0|0|0',
                        metamodel: null
                        }, {
                        name: 'triggerName',
                        columnType: 'STRING',
                        options: [ ],
                        order: 204,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 100,
                        features: '0|1|1|0|0|0|0',
                        metamodel: null
                        }, {
                        name: 'triggerPeriod',
                        columnType: 'NUMBER',
                        options: [ ],
                        order: 205,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '1|1|1|0|0|0|0',
                        metamodel: null
                        }, {
                        name: 'triggerTimeUnit',
                        columnType: 'ENUM',
                        options: [ {
                            name: 'SECOND',
                            label: 'TimeUnit.SECOND',
                            value: 'SECOND'
                        }, {
                            name: 'MINUTE',
                            label: 'TimeUnit.MINUTE',
                            value: 'MINUTE'
                        }, {
                            name: 'HOUR',
                            label: 'TimeUnit.HOUR',
                            value: 'HOUR'
                        }, {
                            name: 'DAY',
                            label: 'TimeUnit.DAY',
                            value: 'DAY'
                        } ],
                        order: 206,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '1|1|1|0|0|0|0',
                        metamodel: null
                        }, {
                        name: 'triggerType',
                        columnType: 'ENUM',
                        options: [ {
                            name: 'MANUAL',
                            label: 'TriggerType.MANUAL',
                            value: 'MANUAL'
                        }, {
                            name: 'PERIODIC',
                            label: 'TriggerType.PERIODIC',
                            value: 'PERIODIC'
                        }, {
                            name: 'CRON',
                            label: 'TriggerType.CRON',
                            value: 'CRON'
                        }, {
                            name: 'EVENT',
                            label: 'TriggerType.EVENT',
                            value: 'EVENT'
                        } ],
                        order: 207,
                        min: 0,
                        max: 0,
                        minLength: 0,
                        maxLength: 255,
                        features: '0|1|1|0|0|0|0',
                        metamodel: null
                        } ],
                        aliases: [ 'checkScripts.contents.flow.eventTrigger' ],
                        key: 'id',
                        operators: {
                        ASSOCIATION: [ ],
                        BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                        TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                        ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                        DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                        DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                        STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                        NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                        }
                    }
                    } ],
                    aliases: [ 'checkScripts.contents.flow' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                }, {
                name: 'flowExecution',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1160,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|0|0|0|0',
                metamodel: {
                    qualifier: 'FlowExecution',
                    group: 'flowExecution',
                    path: 'checkScripts.contents.flowExecution',
                    level: 4,
                    distance: 2,
                    relType: 'INNER',
                    columns: [ {
                    name: 'errorTaskCount',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 201,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionEndTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStartTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStatus',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'PENDING',
                        label: 'ExecutionStatus.PENDING',
                        value: 'PENDING'
                    }, {
                        name: 'EXECUTING',
                        label: 'ExecutionStatus.EXECUTING',
                        value: 'EXECUTING'
                    }, {
                        name: 'CANCELLED',
                        label: 'ExecutionStatus.CANCELLED',
                        value: 'CANCELLED'
                    }, {
                        name: 'SUCCESS',
                        label: 'ExecutionStatus.SUCCESS',
                        value: 'SUCCESS'
                    }, {
                        name: 'FAILED',
                        label: 'ExecutionStatus.FAILED',
                        value: 'FAILED'
                    } ],
                    order: 204,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 5,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|1|1|0|0|1',
                    metamodel: null
                    }, {
                    name: 'runningTaskCount',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 206,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'totalTaskCount',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 207,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '1|1|1|0|0|0|0',
                    metamodel: null
                    } ],
                    aliases: [ 'checkScripts.contents.flowExecution' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                }, {
                name: 'taskExecution',
                columnType: 'ASSOCIATION',
                options: [ ],
                order: 1161,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|1|0|0|0|0',
                metamodel: {
                    qualifier: 'TaskExecution',
                    group: 'taskExecution',
                    path: 'checkScripts.contents.taskExecution',
                    level: 4,
                    distance: 2,
                    relType: 'INNER',
                    columns: [ {
                    name: 'executionEndTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 201,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStartTime',
                    columnType: 'DATE',
                    options: [ ],
                    order: 202,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'executionStatus',
                    columnType: 'ENUM',
                    options: [ {
                        name: 'PENDING',
                        label: 'ExecutionStatus.PENDING',
                        value: 'PENDING'
                    }, {
                        name: 'EXECUTING',
                        label: 'ExecutionStatus.EXECUTING',
                        value: 'EXECUTING'
                    }, {
                        name: 'CANCELLED',
                        label: 'ExecutionStatus.CANCELLED',
                        value: 'CANCELLED'
                    }, {
                        name: 'SUCCESS',
                        label: 'ExecutionStatus.SUCCESS',
                        value: 'SUCCESS'
                    }, {
                        name: 'FAILED',
                        label: 'ExecutionStatus.FAILED',
                        value: 'FAILED'
                    } ],
                    order: 203,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 255,
                    features: '0|1|1|0|0|0|0',
                    metamodel: null
                    }, {
                    name: 'id',
                    columnType: 'NUMBER',
                    options: [ ],
                    order: 4,
                    min: 0,
                    max: 0,
                    minLength: 0,
                    maxLength: 0,
                    features: '0|1|1|1|0|0|1',
                    metamodel: null
                    } ],
                    aliases: [ 'checkScripts.contents.taskExecution' ],
                    key: 'id',
                    operators: {
                    ASSOCIATION: [ ],
                    BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                    TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                    DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                    STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                    NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                    }
                }
                } ],
                aliases: [ 'checkScripts.contents' ],
                key: 'id',
                operators: {
                ASSOCIATION: [ ],
                BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
            }
            }, {
            name: 'scriptParams',
            columnType: 'ASSOCIATION',
            options: [ ],
            order: 808,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '1|1|0|1|0|0|0',
            metamodel: {
                qualifier: 'ScriptParam',
                group: 'scriptParam',
                path: 'checkScripts.scriptParams',
                level: 3,
                distance: 2,
                relType: 'OUTER',
                columns: [ {
                name: 'id',
                columnType: 'NUMBER',
                options: [ ],
                order: 1,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 0,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramDataType',
                columnType: 'ENUM',
                options: [ {
                    name: 'STRING',
                    label: 'DataType.STRING',
                    value: 'STRING'
                }, {
                    name: 'NUMBER',
                    label: 'DataType.NUMBER',
                    value: 'NUMBER'
                }, {
                    name: 'DATE',
                    label: 'DataType.DATE',
                    value: 'DATE'
                }, {
                    name: 'BOOLEAN',
                    label: 'DataType.BOOLEAN',
                    value: 'BOOLEAN'
                } ],
                order: 202,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '0|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramExpression',
                columnType: 'STRING',
                options: [ ],
                order: 203,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramName',
                columnType: 'STRING',
                options: [ ],
                order: 204,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                }, {
                name: 'paramValue',
                columnType: 'STRING',
                options: [ ],
                order: 205,
                min: 0,
                max: 0,
                minLength: 0,
                maxLength: 255,
                features: '1|1|0|1|0|0|0',
                metamodel: null
                } ],
                aliases: [ 'checkScripts.scriptParams' ],
                key: 'id',
                operators: {
                ASSOCIATION: [ ],
                BOOLEAN: [ 'EQ', 'NOT_EQ' ],
                TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
                DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
                STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
                NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
                }
            }
            } ],
            aliases: [ 'checkScripts' ],
            key: 'id',
            operators: {
            ASSOCIATION: [ ],
            BOOLEAN: [ 'EQ', 'NOT_EQ' ],
            TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
            DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
            }
        }
        }, {
        name: 'endpointProperties',
        columnType: 'ASSOCIATION',
        options: [ ],
        order: 509,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        features: '1|1|0|1|0|0|0',
        metamodel: {
            qualifier: 'EndpointProperty',
            group: 'endpointProperty',
            path: 'endpointProperties',
            level: 2,
            distance: 1,
            relType: 'OUTER',
            columns: [ {
            name: 'id',
            columnType: 'NUMBER',
            options: [ ],
            order: 1,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 0,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'propDescription',
            columnType: 'STRING',
            options: [ ],
            order: 202,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 512,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'propKey',
            columnType: 'STRING',
            options: [ ],
            order: 203,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 100,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'propKeyType',
            columnType: 'ENUM',
            options: [ {
                name: 'ANY',
                label: 'PropKeyType.ANY',
                value: 'ANY'
            }, {
                name: 'SCHEMA',
                label: 'PropKeyType.SCHEMA',
                value: 'SCHEMA'
            }, {
                name: 'HOST',
                label: 'PropKeyType.HOST',
                value: 'HOST'
            }, {
                name: 'PORT',
                label: 'PropKeyType.PORT',
                value: 'PORT'
            }, {
                name: 'URI',
                label: 'PropKeyType.URI',
                value: 'URI'
            }, {
                name: 'BASEPATH',
                label: 'PropKeyType.BASEPATH',
                value: 'BASEPATH'
            }, {
                name: 'UID',
                label: 'PropKeyType.UID',
                value: 'UID'
            }, {
                name: 'PASSWORD',
                label: 'PropKeyType.PASSWORD',
                value: 'PASSWORD'
            }, {
                name: 'CLIENT_ID',
                label: 'PropKeyType.CLIENT_ID',
                value: 'CLIENT_ID'
            }, {
                name: 'CLIENT_SECRET',
                label: 'PropKeyType.CLIENT_SECRET',
                value: 'CLIENT_SECRET'
            }, {
                name: 'CLIENT_AUDIENCE',
                label: 'PropKeyType.CLIENT_AUDIENCE',
                value: 'CLIENT_AUDIENCE'
            }, {
                name: 'CLIENT_SCOPE',
                label: 'PropKeyType.CLIENT_SCOPE',
                value: 'CLIENT_SCOPE'
            }, {
                name: 'KEYSTORE_TYPE',
                label: 'PropKeyType.KEYSTORE_TYPE',
                value: 'KEYSTORE_TYPE'
            }, {
                name: 'KEYSTORE_PATH',
                label: 'PropKeyType.KEYSTORE_PATH',
                value: 'KEYSTORE_PATH'
            }, {
                name: 'KEYSTORE_ALIAS',
                label: 'PropKeyType.KEYSTORE_ALIAS',
                value: 'KEYSTORE_ALIAS'
            }, {
                name: 'KEYSTORE_PASSWORD',
                label: 'PropKeyType.KEYSTORE_PASSWORD',
                value: 'KEYSTORE_PASSWORD'
            } ],
            order: 204,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'propValue',
            columnType: 'STRING',
            options: [ ],
            order: 205,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 512,
            features: '1|1|0|1|0|0|0',
            metamodel: null
            }, {
            name: 'propValueType',
            columnType: 'ENUM',
            options: [ {
                name: 'STRING',
                label: 'DataType.STRING',
                value: 'STRING'
            }, {
                name: 'NUMBER',
                label: 'DataType.NUMBER',
                value: 'NUMBER'
            }, {
                name: 'DATE',
                label: 'DataType.DATE',
                value: 'DATE'
            }, {
                name: 'BOOLEAN',
                label: 'DataType.BOOLEAN',
                value: 'BOOLEAN'
            } ],
            order: 206,
            min: 0,
            max: 0,
            minLength: 0,
            maxLength: 255,
            features: '0|1|0|1|0|0|0',
            metamodel: null
            } ],
            aliases: [ 'endpointProperties' ],
            key: 'id',
            operators: {
            ASSOCIATION: [ ],
            BOOLEAN: [ 'EQ', 'NOT_EQ' ],
            TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
            DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
            STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
            NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
            }
        }
        } ],
        aliases: [ ],
        key: 'id',
        operators: {
        ASSOCIATION: [ ],
        BOOLEAN: [ 'EQ', 'NOT_EQ' ],
        TEXT: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
        ENUM: [ 'EQ', 'NOT_EQ', 'IN', 'NOT_IN' ],
        DATE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
        DOUBLE: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ],
        STRING: [ 'EQ', 'NOT_EQ', 'EW', 'NOT_EW', 'SW', 'NOT_SW', 'LIKE', 'NOT_LIKE', 'IS_NULL', 'IS_NOT_NULL' ],
        NUMBER: [ 'EQ', 'NOT_EQ', 'GT', 'GTE', 'LT', 'LTE' ]
        }
    };
}
