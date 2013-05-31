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
                            columnWidth: .25,
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
                                    },
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
                                    },
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

      /*var dataStore = this._createSampleDataSet();*/ 


    	this._createChart();
    },

/*
   _createSampleDataSet: function(){
   	


   		var myStore = Ext.create('Rally.data.custom.Store', {
   			data:myData,
   			fields: [
   				{name: 'time', type: 'string'}, 
   				{name: 'AcceptedCount', type: 'int'}
   			]

   		});
   		return myStore;
   },
*/
	_createChart: function(){

    Ext.define('MyCalculator', {
      extend:'Rally.data.lookback.calculator.BaseCalculator'
      });

    var myData = [
        {time: "0", AcceptedCount: 0},
        {time: "1", AcceptedCount: 10},
        {time: "2", AcceptedCount: 20},
        {time: "3", AcceptedCount: 30},
        {time: "4", AcceptedCount: 40},
        {time: "5", AcceptedCount: 40},
        {time: "6", AcceptedCount: 50},
        {time: "7", AcceptedCount: 70},
        {time: "8", AcceptedCount: 50},
        {time: "9", AcceptedCount: 90}
      ];

		var myChart = Ext.create('Rally.ui.chart.Chart',{
			width: 500,
			height: 500,
			storeType: 'Rally.data.custom.Store',
      storeConfig: {
        data:myData,
        fields: [
          {name: 'time', type: 'string'}, 
          {name: 'AcceptedCount', type: 'int'}

        ]

      },
      calculatorType: 'Rally.data.lookback.calculator.BaseCalculator',
      calculatorConfig: {}, 
			xField: 'time',
			series:[
			 {
			 	type:'column',
			 	dataIndex:'AcceptedCount',
			 	name:'Accepted Count',
			 	visible: 'true'
			 }
			],
	        chartConfig: {
                 chart: {
                     zoomType: 'xy'
                 },
                 title: {
                     text: 'My Chart'
                 },
                 xAxis: {
                     tickmarkPlacement: 'on',
                     tickInterval: 20,
                     title: {
                         text: 'Days'
                     }
                 },
                 yAxis: [
                     {
                         title: {
                             text: 'Count'
                         }
                     }
                 ]
            }

		});

		this.add(myChart);


        console.log("hello");


	}

});


