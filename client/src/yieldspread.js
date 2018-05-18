import React from 'react';
import Spinner from './spinner';
import * as data from './data';
import Chart from 'chart.js';
import DurationDropdown from './durationdropdown';


const YieldSpreadPanel = props => {
    let content = null;
    if (props.loading) {
        content = (<div><Spinner/>{props.children}</div>);
    } else {
        content = props.children;
    }
    return (
        <div className="panel">
            <div className="panel-heading">{props.heading}</div>
            <div className="panel-body">{content}</div>
            <DurationDropdown label="Bond Duration 1" onDurationChange={props.onDuration1Change}/>&nbsp;
            <DurationDropdown label="Bond Duration 2" onDurationChange={props.onDuration2Change}/>&nbsp;
        </div>
    );
};


class YieldSpread extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            duration1: 360,
            duration2: 120,
            chart: null
        };
    }

    onDuration1Change(durationInMonths) {
        this.setState({duration1: durationInMonths});

    }

    onDuration2Change(durationInMonths) {
        this.setState({duration2: durationInMonths});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.allYields !== nextProps.allYields ||
            this.state.duration1 !== nextState.duration1 ||
            this.state.duration2 !== nextState.duration2
    }

    render() {
        const heading = data.getShortDurationLabel(this.state.duration1) + ' - ' +
            data.getShortDurationLabel(this.state.duration2) + ' Treasury bond spread';
        return (
            <YieldSpreadPanel loading={!this.props.allYields}
                              heading={heading}
                              onDuration1Change={this.onDuration1Change.bind(this)}
                              onDuration2Change={this.onDuration2Change.bind(this)}>
                <canvas ref="chart"/>
            </YieldSpreadPanel>
        );
    }

    createChart() {
        const spreads = data.getYieldSpreads(this.state.duration1, this.state.duration2);

        const chart = new Chart(this.refs.chart, {
            type: 'line',

            data: {
                datasets: [{
                    data: spreads,
                    borderColor: '#4A87D0',
                    borderWidth: '2',
                    backgroundOpacity: '.3',
                    backgroundColor: 'rgba(74,135,208, .5)'
                }]
            },
            options: {
                maintainAspectRatio: false,
                hover: {
                    intersect: false,
                    mode: 'index'
                },
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20
                        },
                        time: {
                            unit: 'year'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            callback: value => value.toFixed(1) + '%'
                        }
                    }]
                }
            }
        });
        this.setState({chart: chart});
    }

    componentDidMount() {
        if (!this.props.allYields) {
            return;
        }
        this.createChart();
    }

    componentDidUpdate() {
        if (this.state.chart !== null) {
            this.state.chart.data.datasets[0].data = data.getYieldSpreads(this.state.duration1, this.state.duration2);
            this.state.chart.update();
        }
        else {
            this.createChart();
        }
    }
}

export default YieldSpread;
