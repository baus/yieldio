/**
 * Calculates the values required to draw a histogram based on the input array and the number of buckets.
 * Tails can be removed by limiting the calculation to a specific percentile.
 *
 * Note: should probably updated to eliminate tails on both sides of the distribution.
 *
 * @param data
 * @param numBuckets
 * @param limitToPercentile
 * @param predicate which is used to extract elements from input data. This is used to prevent reshaping the data
 * @returns Two dimensional array. First dimension is the index of the bucket, and the second index
 *          is the count. This allows for direct import into ChartJS without having to change the data shape
 */
function calculateHistogram(data, numBuckets, limitToPercentile = 1.00, predicate = x => x) {
    const buckets = [];
    for (let i = 0; i < numBuckets; i++) {
        buckets.push([i, 0]);
    }

    let dataCopy = data.sort((a, b) => predicate(a) - predicate(b));

    if (limitToPercentile !== 1.00) {
        const percentile = predicate(dataCopy[Math.floor(limitToPercentile * dataCopy.length - 1)]);
        // This could be moved to forEach loop below to eliminate one linear search
        dataCopy = dataCopy.filter(x => predicate(x) <= percentile);
    }

    const min = predicate(dataCopy[0]);
    const max = predicate(dataCopy[dataCopy.length - 1]);
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
};

export default calculateHistogram;
