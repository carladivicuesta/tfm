Highcharts.chart('container', {

    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },

    yAxis: {
        title: {
            text: 'Kg aliments'
        }
    },
    legend: {
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2001
        }
    },

    series: [{
        name: 'Total',
        data: [242061,2319601,2548962,2101690,2336129,2643949,3362483,5055738,7043000,7249000, 8303000, 10178000, 10652000, 14214000, 16191000, 16402000, 17914000,17343000]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});