const computeIQR = require('compute-iqr');

/**
 * Calculates the values required to draw a histogram based on the input array and the number of buckets.
 * Tails can be removed by limiting the calculation to a specific percentile.
 *
 * @param data
 * @param numBuckets If numBuckets === 0, then max of the Sturges and Freedman–Diaconis' choice methods is used
 *        See: https://en.wikipedia.org/wiki/Histogram
 * @param trimTailPercentage removes the right and left tails from the distribution
 * @param predicate function used to extract elements from input data. This is provided to prevent reshaping the data
 * @returns Two dimensional array. First dimension is the index of the bucket, and the second index
 *          is the count. This allows for direct import into ChartJS without having to change the data shape
 */
function calculateHistogram(data, numBuckets = 0, trimTailPercentage = 0.00, predicate = x => x) {
    const buckets = [];

    let dataCopy = data.sort((a, b) => predicate(a) - predicate(b));

    if (trimTailPercentage !== 0.00) {
        const rightPercentile = predicate(dataCopy[Math.floor((1.0 - trimTailPercentage) * dataCopy.length - 1)]);
        const leftPercentile = predicate(dataCopy[Math.ceil(trimTailPercentage * dataCopy.length - 1)]);
        dataCopy = dataCopy.filter(x => predicate(x) <= rightPercentile && predicate(x) >= leftPercentile);
    }

    const min = predicate(dataCopy[0]);
    const max = predicate(dataCopy[dataCopy.length - 1]);

    if(numBuckets === 0){
        const sturges = Math.ceil(Math.log2(dataCopy.length)) + 1;
        const iqr = computeIQR(dataCopy.map(predicate));
        const fd =  2.0 * (iqr / Math.pow(dataCopy.length, (1.0 / 3.0)));
        const fdbuckets = Math.ceil((max - min) / fd);
        numBuckets = Math.max(sturges, fdbuckets);
    }
    for (let i = 0; i < numBuckets; i++) {
        buckets.push([i, 0]);
    }


    const bucketSize = (max - min) / numBuckets === 0 ? 1 : (max - min) / numBuckets;
    dataCopy.forEach(item => {
        let bucketIndex = Math.floor((predicate(item) - min) / bucketSize);
        // for values that lie exactly on last bucket we need to subtract one
        if (bucketIndex === numBuckets) {
            bucketIndex--;
        }
        buckets[bucketIndex][1]++;
    });

    return buckets;
}
module.exports = calculateHistogram;
