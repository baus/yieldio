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
