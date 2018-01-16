'use strict';

/** Uses ES 5 style in case we want to make a PR back to chart.js to include this feature **/

 function drawCrosshairAtPoint(chart, x, y) {
    if (x < chart.chartArea.left || x > chart.chartArea.right) {
        return;
    }
    const canvas = chart.canvas;
    const context = canvas.getContext("2d");
    context.setLineDash([3, 5]);
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.scrollHeight);
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
}

function CrosshairPlugin(callback) {
    this.x = null;
    this.y = null;
    this.callback = callback;
    this.afterEvent = function (targetChart, e) {
        this.x = e.x;
        this.y = e.y;
        let elem = targetChart.getElementsAtEventForMode(e, 'x', {
            intersect: false
        })[0];
        if (elem !== undefined) {
            this.callback(new Date(targetChart.config.data.datasets[0].data[elem._index].t), elem._index);
        }
    };
    this.afterDraw = function (targetChart) {
        drawCrosshairAtPoint(targetChart, this.x, this.y);
    };
}


module.exports = CrosshairPlugin;
