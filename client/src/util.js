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

        createDistribution: function (data, numBuckets, limitTo95thPercentile, predicate) {
            const buckets = [];
            for (let i =  0; i < numBuckets; i++) {
                buckets.push([i, 0]);
            }

            let dataCopy = data.sort((a,b)=>predicate(a) - predicate(b));

            if (limitTo95thPercentile) {
                const percentile = predicate(dataCopy[Math.floor(0.95 * dataCopy.length)]);
                dataCopy = dataCopy.filter( x => predicate(x) <= percentile);
            }

            const min = predicate(dataCopy[0]);
            const max = predicate(dataCopy[dataCopy.length - 1]);
            const bucketSize = (max - min) / numBuckets === 0?1:(max - min) / numBuckets;

            dataCopy.forEach(item => {
                let bucketIndex = Math.floor((predicate(item) - min) / bucketSize);
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
