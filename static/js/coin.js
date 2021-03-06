function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function plotloader(data) {


    var frames = []
    var x = unpack(data, 'RecordDateNormalized')
    var y = unpack(data, 'High')
    var x2 = unpack(data, 'RecordDateNormalized')
    var y2 = unpack(data, 'Low')
    var max = x.length;
    for (var i = 0; i < max; i++) {
        frames[i] = { data: [{ x: [], y: [] }, { x: [], y: [] }] }
        frames[i].data[1].x = x.slice(0, i + 1);
        frames[i].data[1].y = y.slice(0, i + 1);
        frames[i].data[0].x = x2.slice(0, i + 1);
        frames[i].data[0].y = y2.slice(0, i + 1);
    }

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: 'High',
        fill: 'tonexty',
        x: frames[max - 1].data[1].x,
        y: frames[max - 1].data[1].y,
        line: { color: 'rgba(255,255,255,1)' }
    }

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'Low',
        x: frames[max - 1].data[0].x,
        y: frames[max - 1].data[0].y,
        line: { color: 'rgba(255,255,255,.2)' }
    }

    var data = [trace1, trace2];

    var layout = {
        plot_bgcolor: 'rgba(0,0,0,.0)',
        paper_bgcolor: "rgba(0,0,0,0)",
        title: 'Market Data',
        transition: { duration: 1000, },
        xaxis: {
            range: [frames[max - 1].data[0].x[0], frames[max - 1].data[0].x[max - 1]],
            showgrid: false,
            autorange: true,
            nticks: '12',
            tickangle: '25',
            tickfont: {
                family: 'tahoma', size: 11, color: '#fff'
            },
        },
        yaxis: {
            range: [0, frames[max - 1].data[1].x[max - 1]],
            showgrid: false,
            tickfont: {
                family: 'tahoma', size: 14, color: '#fff'
            },
        },
        legend: {
            orientation: 'h', x: 0.5, y: 1.2, xanchor: 'center'
        }
    };
    //console.log(trace1);
    //  return; 
    Plotly.newPlot('plot', data, layout).then(function () {
        Plotly.addFrames('plot', frames);
    });
}