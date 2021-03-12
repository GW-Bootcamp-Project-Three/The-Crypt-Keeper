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
        title: 'Historical Price Data',
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
        },
        // updatemenus: [{
        //     x: 0.5,
        //     y: 0,
        //     yanchor: "top",
        //     xanchor: "center",
        //     showactive: false,
        //     direction: "left",
        //     type: "buttons",
        //     pad: { "t": 87, "r": 10 },
        //     buttons: [{
        //         method: "animate",
        //         args: [null, {
        //             fromcurrent: true,
        //             transition: {
        //                 duration: 1,
        //             },
        //             frame: {
        //                 duration: 40,
        //                 redraw: false
        //             }
        //         }],
        //         label: "Play"
        //     }, {
        //         method: "animate",
        //         args: [
        //             [null],
        //             {
        //                 mode: "immediate",
        //                 transition: {
        //                     duration: 0
        //                 },
        //                 frame: {
        //                     duration: 0,
        //                     redraw: false
        //                 }
        //             }
        //         ],
        //         label: "Pause"
        //     }]
        // }];
    };
    //console.log(trace1);
    //  return; 
    Plotly.newPlot('plot', data, layout, { displayModeBar: false }).then(function () {
        Plotly.addFrames('plot', frames);
    
    });
};


$(document).ready(function () {
    // var element = $('.updatemenu-button  rect .updatemenu-item-rect')
    // element.trigger('click');
    // console.log(element)


    // $('#navbarDropdown').trigger('click');
});


// function barplotloader() {
//     var trace1 = {
//         x: ['giraffes', 'orangutans', 'monkeys'],
//         y: [20, 14, 23],
//         name: 'SF Zoo',
//         type: 'bar'
//     };

//     var trace2 = {
//         x: ['giraffes', 'orangutans', 'monkeys'],
//         y: [12, 18, 29],
//         name: 'LA Zoo',
//         type: 'bar'
//     };

//     var data = [trace1, trace2];

//     var layout = { 
//         barmode: 'group', 
//         autosize: true,
//         plot_bgcolor: 'rgba(0,0,0,.0)',
//         paper_bgcolor: "rgba(0,0,0,0)",
//         title: 'Historical Price Data',
//     };

//     Plotly.newPlot('coin-barplot', data, layout);
// }

d3.select('#InvDate').on('change', InvestMachine);
d3.select('#ifInvested').on('keyup', InvestMachine);

function InvestMachine() {
    var InvDate = d3.select('#InvDate');
    var ifInvested = d3.select('#ifInvested');
    let InvDateVal = InvDate.property('value');
    let invValue = ifInvested.property('value');

    if (InvDateVal != '' && invValue != '') {
        // console.log('TacoCat')

        let g = parseFloat(InvDateVal) * parseFloat(invValue);
        d3.select('#grossResult').html('$' + g)

        let n = g - parseFloat(invValue);
        d3.select('#netResult').html('$' + n)

    }

    console.log(d3.select('#InvDate option'))
    x = []
    y = []

    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
    };

    var data = [trace1];

    Plotly.newPlot('investPlot', data, { displayModeBar: false });



}



