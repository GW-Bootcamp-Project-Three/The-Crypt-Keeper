//set up refreces to elements we know we are going to use
//var transactions = data;
var results = d3.select('#results-body'); 
//Select Input Box w/event handler
var inputBox = d3.select('#coin-filter');
inputBox.on('keyup', displayResults);

function init() {
    d3.json('/api/view/vwCoins').then((data) => { 
        createHeaders();
        var pagedata = d3.select('#page-data'); 
        pagedata.attr('value', JSON.stringify(data));
        displayResults();  
    })
 
};
init() ;
function createHeaders() {
    var tableHead = d3.select('#results-head');
    tableHead.html('');
    let ColHeads = ['More Info', ' ', 'Coin', 'Symbol', 'Price', 'High', 'Low', 'Closing', 'Adj Close', 'Volume']
    ColHeads.forEach(item => {
        var cell = tableHead.append('th');
        cell.text(item);

    })
}

//Function: displayResults
function displayResults() {
    let coins = JSON.parse(d3.select('#page-data').property('value'));
    //console.log(coins);
    //get value property in input element
    var inputValue = inputBox.property('value');
    
    //initialize table
    var filterData = coins;

    //use form input to filter data
    if (inputValue != "") {
        filterData = filterData.filter(
            coin => coin.CoinName.toUpperCase().includes(inputValue.toUpperCase()) 
            || coin.TokenName.toUpperCase().includes(inputValue.toUpperCase())
            );
    } 
    var tbody = d3.select('#reuslts-body');
    tbody.html('') 
    filterData.forEach(coin => {
        var row = tbody.append('tr');
        var cell = row.append('td');
        var hrf = cell.append('a');
        hrf.attr("href", "/coin/" + coin['CoinID']);
        // hrf.attr('style', "color:#fff;")
        hrf.attr('class', 'button button-invert')
        hrf.text(` CLICK HERE `);

        let imgsrc = coin['TokenLogo'];
        if (imgsrc == ""){
            imgsrc = 'static/images/bm-o-125.png'
        };
        var cell = row.append('td');
        var img = cell.append('img');
        img.attr('src', imgsrc);

        var cell = row.append('td');
        cell.text(coin['CoinName']);

        var cell = row.append('td');
        cell.text(coin['TokenName']);
        
        var cell = row.append('td');
        let formatOpenPrice = formatNumbers(coin['OpenPrice']);
        cell.text('$' + formatOpenPrice);

        var cell = row.append('td');
        let formatHigh = formatNumbers(coin['High']);
        cell.text('$' + formatHigh);

        var cell = row.append('td');
        let formatLow = formatNumbers(coin['Low']);
        cell.text('$' + formatLow);

        var cell = row.append('td');
        let formatClose = formatNumbers(coin['ClosingPrice']);
        cell.text('$' + formatClose);

        var cell = row.append('td');
        let formatAdjClose = formatNumbers(coin['AdjClose']);
        cell.text('$' + formatAdjClose);

        var cell = row.append('td');
        let formatVol = formatNumbers(coin['Volume']);
        cell.text('$' + formatVol);

        var cell = row.append('td');
        cell.attr('id', coin['TokenName']);
    }); 
        

}