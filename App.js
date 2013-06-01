Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'DashboardContainer',
            border: 1,
            margin: 6,
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
                    margin: 12,
                    style: {
                        borderStyle: 'solid'
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'SummaryContent',
                    colspan: 1,
                    border: 0,
                    margin: 6,
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
                                    xtype: 'rallygrid',
                                    //Detects click
                                    viewConfig: {
                                        listeners: {
                                            cellclick: function (view, cell, cellIndex, therecord, row, rowIndex, e) {
                                                Ext.create('Rally.ui.dialog.RichTextDialog', {
                                                    autoShow: true,
                                                    resizable: true,
                                                    draggable: true,
                                                    title: 'Edit Impediments',
                                                    record: therecord,
                                                    fieldName: 'Notes',
                                                    width: 400,
                                                    height: 250
                                                });
                                            }
                                        }
                                    },
                                    itemId: 'ReleaseNotes',
                                    colspan: 1,
                                    border: 1,
                                    margin: 6,
                                    store: Ext.create('Rally.data.WsapiDataStore', {
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
                                        ]
                                    }),
                                    showPagingToolbar: false,
                                    columnCfgs: [
                                        { text: 'Impediments', dataIndex: 'Notes' , flex: 1}
                                    ],
                                    title: 'Impediments', 
                                    titleAlign: 'center',
                                    hideHeaders: true,
                                    enableEditing: true
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'FeatureStatus',
                                    colspan: 1,
                                    border: 1,
                                    margin: 6,
                                    style: {
                                        borderStyle: 'solid'
                                    }
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'BlockedWork',
                                    colspan: 1,
                                    border: 1,
                                    margin: 6,
                                    style: {
                                        borderStyle: 'solid'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            itemId: 'Chart',
                            columnWidth: .75,
                            border: 1,
                            margin: 6,
                            style: {
                                borderStyle: 'solid'
                            }
                        }
                    ]
                }

            ]
        },
    ], 
    launch: function() {
      this._CurrentReleaseData();
      this._BlockedStoriesbyReleaseData();
      

      //Create the chart
      this._getReleaseData(); 

      console.log("context: ", this.getContext().getDataContext());

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
                   this._GenerateFeatureData(currentreldata[0].get('_ref'));
                },
                scope: this
            },
            scope: this
    });
  },

  _GenerateReleaseDescription:  function(myStore)
    {
        var myContainer = this.down('#DescriptionHeader');
        myContainer.panel = new Ext.Panel({
            html: "<B>" + String(myStore.data.items[0].data.Project._refObjectName) + "</B>",
            style: {
                'text-align': 'center'
            },
            bodyStyle: {
                'background': '#C5E9F8',
                'font-size': '1.75em',
                'padding': '2px',
                'box-shadow': 'inset 0 0 10px #157AB6'
            },
        });
        myContainer.add(myContainer.panel);

        console.log(myStore);
        myContainer.descriptionheadergrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStore,
            showPagingToolbar: false,
            columnCfgs: [
                { text: 'Release Name', dataIndex: 'Name' , flex: 1},
                { text: 'Release Theme', dataIndex: 'Theme', flex: 3},
                { text: 'Release Date', dataIndex: 'ReleaseDate', 
                    renderer: function(value){
                        dateVal = new Date(value);
                        dateVal = Ext.Date.format(dateVal, 'F j, Y');
                        return dateVal;
                    },
                 flex: 1}
            ]
        });
        myContainer.add(myContainer.descriptionheadergrid);
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

  _getReleaseData: function(){


    this.releaseTally= {};

    Ext.create('Rally.data.WsapiDataStore',{
        model: 'Release',
        autoLoad: 'true',
        pageSize: 500,
        sorters: [
          {
          property: 'ReleaseStartDate',
          direction: 'ASC'
          }
        ],
/*        context: {
          project:'/project/6009023180',
          projectScopeUp: false,
          projectScopeDown: false
        }, */
        listeners: {
          load: function(store, releaseRecords, success) {

             console.log("releaseRecords", releaseRecords);

             Ext.each(releaseRecords, function(releaseRecord, index){
               console.log(this);

               this.releaseTally[releaseRecord.get("ObjectID")] = {data:[]};

             },this);



             this._queryRecords(releaseRecords); 
          },
          scope: this
        }

      });

  },


  _queryRecords: function(releaseRecords){

    this.relObjQueryFilters = [];

    this.relObjIDs = []; 

    Ext.each(releaseRecords, function(releaseRecord, index) {
      this.relObjQueryFilters.push({property: 'ReleaseObjectID', operatation: '=', value: releaseRecord.get("ObjectID")});
      this.relObjIDs.push(releaseRecord.get("ObjectID"));
    }, this);

    var filter = Rally.data.QueryFilter.or(this.relObjQueryFilters);

    console.log("filter = ", filter.toString());



    this.orderedDates = [];

    Ext.create('Rally.data.WsapiDataStore',{
        model: 'ReleaseCumulativeFlowData',
        autoLoad: 'true',
        limit: 5000,
        sorters: [
          {
            property: 'CreationDate',
            direction: 'ASC'
          }
        ],
        filters: filter,
/*        context: {
          project:'/project/6009023180',
          projectScopeUp: false,
          projectScopeDown: false
        }, */
        listeners: {
          load: function(store, releasesCumFlowRecs, success) {

              console.log ("releasesCumFlowRecs: ", releasesCumFlowRecs.length, releasesCumFlowRecs);
              console.log(this);
              Ext.each(releasesCumFlowRecs, function(releasesCumFlowRecs, index) {
                    
                    var relObjID = releasesCumFlowRecs.get('ReleaseObjectID');

                    if (this.releaseTally[relObjID] === undefined) {
                      this.releaseTally[relObjID] = {};
                      console.log("New Release", relObjID);
                    }

                    var creationDate = releasesCumFlowRecs.get('CreationDate');
                    creationDate = Ext.Date.format(creationDate,'c');

                    if (this.releaseTally[relObjID][creationDate] === undefined ) {
                       this.releaseTally[relObjID][creationDate] = {acceptedCount: 0, totalCount: 0};
                       this.orderedDates.push(creationDate);

                    }

                    if (releasesCumFlowRecs.get('CardState') === 'Accepted') {
                      this.releaseTally[relObjID][creationDate].acceptedCount = releasesCumFlowRecs.get('CardEstimateTotal');
                    } else {
                      this.releaseTally[relObjID][creationDate].totalCount += releasesCumFlowRecs.get('CardEstimateTotal');
                    }

                },
                this);

              console.log("release Tally: ", this.releaseTally);
              console.log("orderedDates: ", this.orderedDates);


              this._createChartSeries();
              this._createChart();  

          },
          scope:this
        }

      });


  },

  _createChartSeries: function(){

    this.series = [];

    var numYAxes = this.relObjIDs.length;
    console.log("relObjIDs",this.relObjIDs);

    for(var i = 0; i<numYAxes; i++){

      if (this.series[i] === undefined){
        this.series[i] = {data:[]};
      }

      // 0 is acceptedCounts
      if (i == 0){
        
        var j = 0;        
        Ext.each(this.orderedDates, function(orderedDate, index){
          
          var accumulatedTotal = 0;


          console.log(orderedDate)
          Ext.each(this.relObjIDs, function(relObjID, index){

            if (this.releaseTally[relObjID][orderedDate] !== undefined){
              accumulatedTotal += this.releaseTally[relObjID][orderedDate].acceptedCount;
            }

          },this);

          this.series[i].data[j] = accumulatedTotal;  

          j++;

        },this); 

      }


    }

    console.log("this.series", this.series);


  },
  _GenerateFeatureData: function(releaseRef) {
      var featureStore = Ext.create('Rally.data.WsapiDataStore', {
          model: 'Portfolio Item/Feature',
          autoLoad: true,
          filters: [
              {
                  property: 'Release.ObjectID', //maybe change to id at some point
                  operator: '=',
                  value: releaseRef.split('/')[2]
              }
          ],
          listeners: {
              load: function(store, features) {
                  if (features === null || features.length === 0)
                  {
                      console.log('No Features');
                  }
                  else {
                      console.log(features);
                      this._GenerateFeatureGrid(store);
                  }
              },
              scope: this
          }
      });
  },

  _GenerateFeatureGrid: function(myStore) {
      var myContainer = this.down('#FeatureStatus');
      myContainer.featureGrid = Ext.create('Rally.ui.grid.Grid', {
          pagesize: 25,
          showPagingToolbar: false,
          store: myStore,
          columnCfgs: [
              { 
                  text: 'Feature', dataIndex: 'Name', flex: 1,
                  renderer: function(value, meta, record){
                      var proj = record.get('Project')._ref;
                      proj = String(proj);
                      proj = proj.substr(9);
                      var link = "../#/" + proj+'/detail'+String(record.get('_ref'));
                      return '<a href="' + link + '"target="_parent">' + value + '</a>';
                  }
              },
              {
                  text: 'Percent Complete',
                  xtype: 'templatecolumn',
                  tpl: Ext.create('Rally.ui.renderer.template.PercentDoneTemplate', 
                  {
                      percentDoneName: 'PercentDoneByStoryPlanEstimate'
                  })
              }
          ],
          title: 'Feature Status',
          titleAlign: 'center'
      });
      myContainer.add(myContainer.featureGrid);
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
            data: this.series[0].data/*, 
            pointInterval: 20 * 3600 * 1000,
            pointStart: Date.UTC(2006,0,01) */
          }/*,
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
          } */
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
          /*type: 'datetime',
          maxZoom: 1 * 24 * 3600000, // fourteen days */
          categories: this.orderedDates,
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