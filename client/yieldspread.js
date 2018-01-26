import React from 'react';
import Spinner from './spinner';
import * as data from './data';
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
            duration2: 120
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
                <canvas ref="chart"></canvas>
            </YieldSpreadPanel>
        );
    }

    componentDidUpdate() {
        let yieldDuration1 = this.state.duration1;
        let yieldDuration2 = this.state.duration2;

        const spreads = data.getYieldSpreads(yieldDuration1, yieldDuration2);
        if (this.chart !== null) {
            this.chart.data.datasets[0].data = spreads;
            this.chart.update();
        }
        else {
            this.chart = new Chart(this.refs.chart, {
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
        }
    }
}

export default YieldSpread;
