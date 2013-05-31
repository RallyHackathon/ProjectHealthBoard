Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'DashboardContainer',
            html: 'Dashboard Container',
            
            border: 5,
            margin: 10,
            style: {
                borderColor: 'green',
                borderStyle: 'solid'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'DescriptionHeader',
                    html: 'Description Header',
                    colspan: 1,
                    border: 5,
                    margin: 10,
                    style: {
                        borderColor: 'blue',
                        borderStyle: 'solid'
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'SummaryContent',
                    colspan: 1,
                    border: 5,
                    margin: 10,
                    style: {
                        borderColor: 'red',
                        borderStyle: 'solid'
                    },
                    layout: 'column',
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'HealthPanel',
                            columnWidth: 0.25,
                            border: 5,
                            margin: 10,
                            style: {
                                borderColor: 'orange',
                                borderStyle: 'solid'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'ReleaseNotes',
                                    html: 'Release Notes',
                                    colspan: 1,
                                    border: 5,
                                    margin: 10,
                                    style: {
                                        borderColor: 'pink',
                                        borderStyle: 'solid'
                                    }
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'FeatureStatus',
                                    html: 'Feature Status',
                                    colspan: 1,
                                    border: 5,
                                    margin: 10,
                                    style: {
                                        borderColor: 'purple',
                                        borderStyle: 'solid'
                                    }
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'BlockedWork',
                                    html: 'Blocked Work',
                                    colspan: 1,
                                    border: 5,
                                    margin: 10,
                                    style: {
                                        borderColor: 'yellow',
                                        borderStyle: 'solid'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            itemId: 'Chart',
                            html: 'Chart Displays Here',
                            columnWidth: .75,
                            border: 5,
                            margin: 10,
                            style: {
                                borderColor: 'khaki',
                                borderStyle: 'solid'
                            },
                        }
                    ]
                }

            ]
        },
    ],

    launch: function() {

      this._createChart();
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
