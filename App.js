Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

            items: [
                {
                    xtype: 'container',
                    itemId: 'DashboardContainer',
                    border: 1,
                    margin: 8,
                    style: {
                        borderStyle: 'solid',
                        background: 'green'
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'DescriptionHeader',
                            colspan: 1,
                            border: 1,
                            margin: 16,
                            style: {
                                borderStyle: 'solid'
                            }
                        },
                        {
                            xtype: 'container',
                            itemId: 'SummaryContent',
                            colspan: 1,
                            border: 0,
                            margin: 8,
                            style: {
                                borderStyle: 'solid'
                            },
                            layout: 'column',
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'HealthPanel',
                                    columnWidth: .25,
                                    border: 0,
                                    margin: 0,
                                    style: {
                                        borderStyle: 'solid'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            itemId: 'ReleaseNotes',
                                            colspan: 1,
                                            border: 1,
                                            margin: 8,
                                            style: {
                                                borderStyle: 'solid'
                                            }
                                        },
                                        {
                                            xtype: 'container',
                                            itemId: 'FeatureStatus',
                                            html: 'Feature Status',
                                            colspan: 1,
                                            border: 1,
                                            margin: 8,
                                            style: {
                                                borderStyle: 'solid'
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            itemId: 'BlockedWork',
                                            colspan: 1,
                                            border: 1,
                                            margin: 8,
                                            style: {
                                                borderStyle: 'solid'
                                            },
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'Chart',
                                    html: 'Chart Displays Here',
                                    columnWidth: .75,
                                    border: 1,
                                    margin: 8,
                                    style: {
                                        borderStyle: 'solid'
                                    },
                                }
                            ]
                        }

                    ]
                },
            ],

    launch: function() {
      this._CurrentReleaseData();
      this._BlockedStoriesbyReleaseData();
      this._createChart();
    },

                _CurrentReleaseData: function()
                {
                var CurrentReleaseStore = Ext.create('Rally.data.WsapiDataStore', {
                        model: 'Release',
                        autoLoad: true,
                        filters: [
                            {
                                property: 'ReleaseStartDate',
                                operator: '<',
                                value: 'today'
                            },
                            {
                                property: 'ReleaseDate',
                                operator: '>',
                                value: 'today'
                            }
                        ],
                        listeners: {
                            load: function(store, currentreldata, success) {
                               this._GenerateReleaseDescription(store);
                               this._GenerateReleaseNotes(store);
                            },
                            scope: this
                        },
                        scope: this
                });
            },

            _GenerateReleaseDescription:  function(myStore)
                {
                    var myContainer = this.down('#DescriptionHeader');
                    console.log(myStore);
                    myContainer.descriptionheadergrid = Ext.create('Rally.ui.grid.Grid', {
                        store: myStore,
                        showPagingToolbar: false,
                        columnCfgs: [
                            { text: 'Release Name', dataIndex: 'Name' , flex: 1},
                            { text: 'Theme', dataIndex: 'Theme', flex: 3},
                            { text: 'Release Date', dataIndex: 'ReleaseDate', 
                                renderer: function(value){
                                    dateVal = new Date(value);
                                    dateVal = Ext.Date.format(dateVal, 'F j, Y');
                                    return dateVal;
                                },
                             flex: 1},
                        ],
                        title: String(myStore.data.items[0].data.Project._refObjectName), 
                        titleAlign: 'center'
                    });
                    myContainer.add(myContainer.descriptionheadergrid);
                },

            _GenerateReleaseNotes: function(myStore)
                {
                    var myContainer = this.down('#ReleaseNotes');
                    myContainer.releasenotesgrid = Ext.create('Rally.ui.grid.Grid', {
                        store: myStore,
                        showPagingToolbar: false,
                        columnCfgs: [
                            { text: 'Impediments', dataIndex: 'Notes' , flex: 1}
                        ],
                        title: 'Impediments', 
                        titleAlign: 'center',
                        hideHeaders: true,
                        enableEditing: true,
                        selType: 'cellmodel'
                    });
                    myContainer.add(myContainer.releasenotesgrid);
                },

            _BlockedStoriesbyReleaseData: function()
                {
                    var storyStore = Ext.create('Rally.data.WsapiDataStore', {
                        model: 'User Story',
                        autoLoad: true,
                        fetch: ['FormattedId', 'Name', 'BlockedReason', 'Feature', 'Project', '_ref'],
                        filters: [
                            {
                                property: 'Release.ReleaseStartDate',
                                operator: '<',
                                value: 'today'
                            },
                            {
                                property: 'Release.ReleaseDate',
                                operator: '>',
                                value: 'today'
                            },
                            {
                                property: 'Blocked',
                                operator: '=',
                                value: 'true'
                            }
                        ],
                        listeners: {
                                    load: function(store, stories)
                                    {
                                        if (stories.length === 0)
                                        {
                                            console.log('No Blocked Stories');
                                        }
                                        else
                                        {
                                            this._GenerateBlockedStoriesGrid(store)
                                        }
                                        
                                    },
                                    scope: this
                                }
                    });
                },

                _GenerateBlockedStoriesGrid: function(myStore)
                {
                    var myContainer = this.down('#BlockedWork');
                    myContainer.blockedGrid = Ext.create('Rally.ui.grid.Grid', {
                        store: myStore,
                        pagesize: 25,
                        showPagingToolbar: false,
                        columnCfgs: [
                            { 
                                text: 'Feature', dataIndex: 'Feature', flex: 1,
                                renderer: function(value, meta, record){
                                    if (value !== null) {
                                        var proj = record.get('Project')._ref;
                                        proj = String(proj);
                                        proj = proj.substr(9);
                                        var link = "../#/" + proj+'/detail'+String(value._ref)
                                        return '<a href="' + link + '"target="_parent">' + value.Name + '</a>';
                                    }
                                    else {
                                        return 'No Feature';
                                    }

                                }
                            },
                            { 
                                text: 'Blocked Story', dataIndex: 'Name' , flex: 1,
                                renderer: function(value, meta, record) {
                                    var proj = record.get('Project')._ref;
                                    proj = String(proj);
                                    proj = proj.substr(9);
                                    var link = "../#/" + proj+'/detail/userstory/'+String(record.get('_ref').split('/')[2]);
                                    return '<a href="' + link + '"target="_parent">' + value + '</a>';
                                }
                            },
                            { text: 'Blocked Reason', dataIndex: 'BlockedReason', flex: 1},
                        ],

                        title: 'Blocked Stories',
                        titleAlign: 'center'
                    });
                    myContainer.add(myContainer.blockedGrid);
                },

  _createChart: function(){

    var chartContainer = this.down('#Chart');

    var myChart = Ext.create('Rally.ui.chart.Chart',{
      width: 500,
      height: 500,
      chartData: {
        series: [
          {
            type: 'area',
            name: 'AcceptedCount',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 16.9, 19.6],
            pointInterval: 20 * 3600 * 1000,
            pointStart: Date.UTC(2006,0,01)
          },
          {
            type: 'line',
            name: 'Accepted Count Trend',
            data: [19.6,19.6,19.6,19.6,19.6,19.6,19.6,19.6,19.6,19.6,19.6,19.6],
            pointInterval: 20 * 3600 * 1000,
            pointStart: Date.UTC(2006,0,01)
          },
          {
            type: 'area',
            name: 'Release 1.0',
            data: [17.0, 16.9, 19.5, 114.5, 118.2, 121.5, 125.2, 126.5, 123.3, 118.3, 113.9, 100],
            pointInterval: 20 * 3600 * 1000,
            pointStart: Date.UTC(2006,0,01)
          },
          {
            type: 'line',
            name: 'Release 1.0 Trend',
            data: [100,100,100,100,100,100,100,100,100,100,100,100],
            pointInterval: 25 * 3600 * 1000,
            pointStart: Date.UTC(2006,0,10)
          },
          {
                type: 'line',
                name: 'Regression Line',
                data: [[Date.UTC(2006,0,05), 17], [Date.UTC(2006,0,10), 100]],
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                enableMouseTracking: false
          }
        ]
      },
      chartConfig: {
         chart: {
             zoomType: 'x',
             spacingRight: 20
         },
         title: {
             text: 'My Title'
         },
         subtitle: {
             text: 'My SubTitle'
         },
         xAxis: {
          type: 'datetime',
          maxZoom: 1 * 24 * 3600000, // fourteen days
          title: 'x title',
         },
         yAxis: [
             {
                 title: {
                     text: 'Count'
                 }
             }
         ],
         tooltip: {
           shared: true
         },
         plotOptions: {
           line: {
             dashStyle: 'shortDash'
           }
         }
             
       }

    });

    chartContainer.add(myChart);

  }

});



/*
      storeType: 'Rally.data.custom.Store',
      storeConfig: {
        data:myData,
        fields: [
          {name: 'time', type: 'string'}, 
          {name: 'AcceptedCount', type: 'int'}

        ]

      },
      xField: 'time',
      series:[
       {
         type:'column',
         dataIndex:'AcceptedCount',
         name:'Accepted Count',
         visible: 'true'
       }
      ],

*/