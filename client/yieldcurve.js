import React from 'react';
import Panel from './panel';
import FormattedDate from './formatteddate';
import Chart from 'chart.js';
import * as data from './data';


class YieldCurve extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
    }

    render() {
        const heading = 'Treasury bond yields as of ' + FormattedDate.format(this.props.currentDate);

        return (
            <Panel loading={!this.props.yieldsForDate} heading={heading}>
                <canvas className="yield-curve-graph" id="yield-curve-graph-id"></canvas>
            </Panel>
        )

    }

    componentDidUpdate() {
        if (!this.props.yieldsForDate) {
            return;
        }
        let yieldData = this.props.yieldsForDate.map((currentYield, i) => {
            if (typeof currentYield[0] === 'number') {
                return {x: data.DURATIONS[i], y: currentYield[0]};
            }
        });


        const xAxes = [{
            type: 'linear',
            display: true,

            ticks: {
                callback: value => data.DURATIONS.includes(value) && value % 12 === 0 ? value / 12 + 'y' : null,
                min: 0,
                max: 360,
                autoSkip: true,
                maxTicksLimit: 30,
                stepSize: 12,
                maxRotation: 0,
                minRotation: 0
            }
        }];

        const yAxes = [{
            ticks: {
                min: 0,
                max: 10,
                callback: value => value.toFixed(1) + '%'
            }
        }];

        if (this.chart) {
            this.chart.data.datasets[0].data = yieldData;
            this.chart.update(0);
        } else {
            this.chart = new Chart(document.getElementById('yield-curve-graph-id'), {
                type: 'line',
                data: {
                    datasets: [
                        {
                            data: yieldData,
                            lineTension: 0,
                            borderColor: '#4A87D0',
                            borderWidth: '2',
                            backgroundOpacity: '.3',
                            backgroundColor: 'rgba(74,135,208, .5)'
                        }
                    ]
                },
                options: {
                    legend: {display: false},
                    title: {
                        display: false,
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    scales: {
                        xAxes: xAxes,
                        yAxes: yAxes
                    }
                }
            });
        }
    }
}

export default YieldCurve;
