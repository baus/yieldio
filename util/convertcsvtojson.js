var fs = require('fs');
var babyparse = require('babyparse');


parsed = babyparse.parseFiles('yields.csv');

rows = parsed.data;

// Data from: https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield

var outArray = [];
var prevArray = [];
var curArray = [];
for (var i = 0; i < 11; ++i) {
    prevArray.push(NaN);
}
for (let row of rows) {
    var date = new Date(row[0]);
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    var dateArray = [];
    dateArray.push(date.getTime());
    i = 0;
    for (var col of row.slice(1, row.length)) {
        let yieldArray = [];
        if (col === 'N/A') {
            yieldArray.push('NaN');
            curArray.push(NaN);
        }
        else {
            yieldArray.push(parseFloat(col));
            curArray.push(parseFloat(col));
        }
        if (!isNaN(prevArray[i]) && !isNaN(curArray[i])) {
            yieldArray.push(Number((curArray[i] - prevArray[i]).toFixed(2)));
            yieldArray.push(Number((((curArray[i] - prevArray[i]) / prevArray[i]) * 100.0).toFixed(2)));
        }
        else {
            yieldArray.push('NaN');
            yieldArray.push('NaN');
        }
        dateArray.push(yieldArray);
        ++i;
    }
    prevArray = curArray;
    curArray = [];
    outArray.push(dateArray);
}

fs.writeFile("yields.json", JSON.stringify(outArray), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("yields.json was saved!");
});

