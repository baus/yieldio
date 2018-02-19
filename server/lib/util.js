module.exports = {
    percentageChange: function (oldValue, newValue) {
        if (oldValue === 0.0) {
            return NaN;
        }
        return ((newValue - oldValue) / oldValue) * 100.0;
    }
};


