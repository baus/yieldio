import React from 'react';
import Panel from './panel';
import FormattedDate from './formatteddate';
import Chart from 'chart.js';
import * as data from './data';


class YieldCurve extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chart: null};
        this.chart = null;
    }

    render() {
        const heading = 'Treasury bond yields as of ' + FormattedDate.format(this.props.currentDate);

        return (
            <Panel loading={!this.props.yieldsForDate} heading={heading} onExpand={this.props.onExpand}
                   onContract={this.props.onContract} icon={this.props.icon}>
                <div style={{height: '275px'}}>
                    <canvas ref="chart"/>
                </div>
            </Panel>
        )

    }

    createChart() {
        const yieldData = this.getYieldData();
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
        const chart = new Chart(this.refs.chart, {
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
                animation: false,
                maintainAspectRatio: false,
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
        this.setState({chart: chart});
    }

    getYieldData() {
        let yieldData = this.props.yieldsForDate.map((currentYield, i) => {
            if (typeof currentYield[0] === 'number') {
                return {x: data.DURATIONS[i], y: currentYield[0]};
            }
        });
        return yieldData;
    }

    componentDidMount() {
        if (!this.props.yieldsForDate) {
            return;
        }
        this.createChart();
    }

    componentDidUpdate() {
        const chart = this.state.chart;
        if (chart) {
            chart.data.datasets[0].data = this.getYieldData();
            chart.update(0);
            return;
        }
        this.createChart();
    }
}

export default YieldCurve;
