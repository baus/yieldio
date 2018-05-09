import strftime from 'strftime';

Date.prototype.strftime = function (fmt) {
    let GMTtime = strftime.timezone(new Date().getTimezoneOffset());
    return GMTtime(fmt, this);
};

var bausutil = (function () {
    'use strict';
    return {
        binarySearch: function (array, find, comparator) {
            // see: http://www.dweebd.com/javascript/binary-search-an-array-in-javascript/
            var low = 0,
                high = array.length - 1,
                i,
                comparison;
            while (low <= high) {
                i = Math.floor((low + high) / 2);
                comparison = comparator(array[i], find);
                if (comparison < 0) {
                    low = i + 1;
                } else if (comparison > 0) {
                    high = i - 1;
                } else {
                    return i;
                }
            }
            return null;
        },

        /**
         * Calculates the values required to draw a histogram based on the input array and the number of buckets.
         * Tails can be removed by limiting the calculation to a specific percentile.
         *
         * @param data
         * @param numBuckets
         * @param limitTo95thPercentile
         * @param predicate
         * @returns {Array}
         */
        createDistribution: function (data, numBuckets, limitToPercentile = 1.00, predicate = x => x) {
            const buckets = [];
            for (let i = 0; i < numBuckets; i++) {
                buckets.push([i, 0]);
            }

            let dataCopy = data.sort((a, b) => predicate(a) - predicate(b));

            if (limitToPercentile !== 1.00) {
                const percentile = predicate(dataCopy[Math.floor(limitToPercentile * dataCopy.length - 1)]);
                console.log(percentile);
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
        },

        Timer: function () {
            this.timerMin = 0.0;
            this.timerMax = 0.0;
            this.timerAvg = 0.0;
            this.timerCount = 0;
            this.timerStart = 0;
            this.timerEnd = 0;

            this.start = function () {
                this.timerStart = new Date();
                return this.timerStart;
            };

            this.lastTime = function () {
                return this.timerEnd.getTime() - this.timerStart.getTime();
            };

            this.stop = function () {
                this.timerEnd = new Date();
                var current = this.lastTime();
                if (this.timerCount <= 0) {
                    this.timerMax = current;
                    this.timerMin = current;
                    this.timerAvg = current;
                } else {
                    this.timerMax = Math.max(this.timerMax, current);
                    this.timerMin = Math.min(this.timerMin, current);
                    this.timerAvg = (this.timerAvg * this.timerCount + current) / (this.timerCount + 1);
                }
                this.timerCount += 1;
                return current;
            };
        }
    };
}());

export default bausutil;
