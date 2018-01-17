const fs = require('fs');
const contents = fs.readFileSync('allyieldsarray.json');
const allYieldsArray = JSON.parse(contents);

allYieldsArray.forEach(dateArray=>dateArray
		       .slice(1).forEach(durationArray=>durationArray
					 .forEach((durationValue, index, array)=>{
					     !durationValue || durationValue === 'NaN'? array[index] = null : array[index]=Math.round(100 * durationValue) / 100
					 })));
fs.writeFileSync('output.json', JSON.stringify(allYieldsArray));

