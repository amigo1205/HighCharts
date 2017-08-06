var chartData = [];

window.onload = function() {
    //load json from local resource
    $.getJSON("json/cust_list.json")
        .done(function(data) {
            for (var item of data) {
                if (item.hasOwnProperty("CUSTOMER") == false) {
                    return;
                }

                $('#customer-list').append('<option>' + item.CUSTOMER + '</option>');

                var jsonPath = "json/" + item.CUSTOMER + ".json";
                $.getJSON(jsonPath)
                    .done(function(data, ff) {
                        var customer = this.url.replace('.json', '').replace('json/', '');
                        chartData[customer] = data;
                    })
            }
        })

    var listfile = document.getElementById('listfile');

    listfile.addEventListener('change', function(e) {
        var file = listfile.files[0];
        var textType = ".json";
        chartData = [];

        if (file.name.search(textType) != -1) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#customer-list').empty();
                
                list = JSON.parse(reader.result);
                for (var item of list) {
                    if (item.hasOwnProperty("CUSTOMER") == false) {
                        return;
                    }

                    $('#customer-list').append('<option>' + item.CUSTOMER + '</option>');
                }
            }
            reader.readAsText(file);	
        }
    });

    var datafiles = document.getElementById('datafiles');
    
    datafiles.addEventListener('change', function(e) {
        var textType = ".json";
        chartData = [];
        
        for(var file of datafiles.files) {
            if (file.name.search(textType) != -1) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                    var data = JSON.parse(e.target.result);
                    chartData[e.target.fileName] = data;
                }

                reader.fileName = file.name.replace('.json', '');
                reader.readAsText(file);	
            }
        }
    });
}

$("#customer-list").change(function() {
    var name = $("#customer-list option:selected").eq(0).val();
    var data = chartData[name];

    var categories = data.map(function(a) {return a.ORDER_DATE;});
    var auc_data = data.map(function(a) {return a.AUC;});
    var line_data = data.map(function(a) {return a.LINE_value;});

    Highcharts.chart('chart', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Customer Info Chat'
        },
        subtitle: {
            // text: 'Boomerang91'
        },
        xAxis: [{
            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            categories : categories,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'AUC',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'LINE',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'LINE',
            type: 'column',
            yAxis: 1,
            // data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            data: line_data,
            tooltip: {
                valueSuffix: ''
            }
    
        }, {
            name: 'AUC',
            type: 'spline',
            // data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            data: auc_data,
            tooltip: {
                valueSuffix: ''
            }
        }]
    });

    $("#btnNav").css("visibility", "visible");
})

$(document).keydown(function(e) {
    switch (e.keyCode) {  
        case 37:    //left
            $.fn.prevEvent();
            break;
    
        case 39:    //right
            $.fn.nextEvent();
            break;

        default:
            break;
    }
})

$.fn.prevEvent = function() {
    $selected = $("#customer-list option:selected")
    .prop('selected', false)
    .prev()
    .prop('selected', true);

    $("#customer-list").trigger('change');
}

$.fn.nextEvent = function() {
    $selected = $("#customer-list option:selected")
    .prop('selected', false)
    .next()
    .prop('selected', true);

    $("#customer-list").trigger('change');
}

$("#btnPrev").click(function () {
    $.fn.prevEvent();
})

$("#btnNext").click(function () {
    $.fn.nextEvent();
})