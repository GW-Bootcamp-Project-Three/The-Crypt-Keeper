//set up refreces to elements we know we are going to use
//var transactions = data;
var results = d3.select('#results-body'); 
//Select Input Box w/event handler
var inputBox = d3.select('#coin-filter');
inputBox.on('keyup', displayResults);

function init() {
    d3.json('/api/view/vwCoins').then((data) => { 
        //createHeaders(data);
        var pagedata = d3.select('#page-data');
        
        pagedata.attr('value', JSON.stringify(data));
        displayResults();  
    })
 
};
init() ;
function createHeaders(transactions) {
    var tableHead = d3.select('#results-head');
    tableHead.html('');
    var tran = transactions[0];
    Object.keys(tran).forEach(key => {
        var cell = tableHead.append('th');
        cell.text(key);
    })
}

//Function: displayResults
function displayResults() {
    let coins = JSON.parse(d3.select('#page-data').property('value'));
    console.log(coins);
    //get value property in input element
    var inputValue = inputBox.property('value');
    
    //initialize table
    var filterData = coins;

    //use form input to filter data
    if (inputValue != "") {
        filterData = filterData.filter(coin => coin.CoinName.toUpperCase().includes(inputValue.toUpperCase()));
    } 
    var tbody = d3.select('#reuslts-body');
    tbody.html('') 
    filterData.forEach(coin => {
        var row = tbody.append('tr');
        var cell = row.append('td');
        var hrf = cell.append('a');
        hrf.attr("href", "/coin/" + coin['CoinID']);
        hrf.attr('style', "color:#fff;")
        hrf.text(`[ VIEW MORE ]`);
        Object.entries(coin).forEach(([key, value]) => {
            if (key == 'TokenLogo') {
                var cell = row.append('td');
                var img = cell.append('img');
                img.attr('src', value) 
                //cell.text(value);
            }
            if (key == 'CoinName'){
                var cell = row.append('td');  
                cell.text(value);
            }
            if (key == 'TokenName') {
                var cell = row.append('td');
                cell.text(value);
            } 
        }); 
    }); 
}