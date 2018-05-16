
// Data from: https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield
const fs = require('fs');
const babyparse = require('babyparse');


const parsed = babyparse.parseFiles('yields.csv');
const rows = parsed.data;

function isNumber(number) {
    return number !== null && !isNaN(number);
}

const outArray = [];
let prevArray = [];
let curArray = [];
for (let i = 0; i < 11; ++i) {
    prevArray.push(null);
}
for (let row of rows) {
    let date = new Date(row[0]);
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    const dateArray = [];
    dateArray.push(date.getTime());
    let i = 0;
    for (let col of row.slice(1, row.length)) {
        let yieldArray = [];
        if (col === 'N/A') {
            yieldArray.push(null);
            curArray.push(null);
        }
        else {
            yieldArray.push(parseFloat(col));
            curArray.push(parseFloat(col));
        }
        if (isNumber(prevArray[i]) && isNumber(curArray[i])) {
            yieldArray.push(Number((curArray[i] - prevArray[i]).toFixed(2)));
            yieldArray.push(Number((((curArray[i] - prevArray[i]) / prevArray[i]) * 100.0).toFixed(2)));
        }
        else {
            yieldArray.push(null);
            yieldArray.push(null);
        }
        dateArray.push(yieldArray);
        ++i;
    }
    prevArray = curArray;
    curArray = [];
    outArray.push(dateArray);
}

fs.writeFile("yields.json", JSON.stringify(outArray), (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("yields.json was saved!");
});

