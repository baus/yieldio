import React from 'react';
import Panel from './panel';
import util from './util.js';
import Chart from 'chart.js';
import * as data from './data.js';

class YieldDistribution extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {limitDurationsTo95th: true};
    }

    createPercentageChangeDistribution(allYields, durationInMonths, numBuckets, limitTo95thPercentile) {
        const durationIndex = data.getDurationIndexFromMonths(durationInMonths);
        const getPercentageChangeFromYields = function (yieldsForDay) {
            const dateSlicedYields = yieldsForDay.slice(1);
            const value = dateSlicedYields[durationIndex][2];
            if (data.isNumber(value)) {
                return Math.abs(value);
            }
            return value;
        };

        const filteredYields = allYields.filter(yieldsForDay => {
            const value = getPercentageChangeFromYields(yieldsForDay);
            return data.isNumber(value);
        });

        return util.createDistribution(filteredYields,
            numBuckets,
            limitTo95thPercentile,
            getPercentageChangeFromYields);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return this.props.durationInMonths !== nextProps.durationInMonths ||
            this.props.allYields !== nextProps.allYields ||
            this.state.limitDurationsTo95th !== nextState.limitDurationsTo95th;
    }

    render() {
        const heading = 'Distribution of % change in ' + data.getDurationLabel(this.props.durationInMonths) + ' treasury bonds';
        return (
            <Panel loading={!this.props.allYields} heading={heading}>
                <div style={{height: '200px'}}>
                    <canvas ref="chart"/>
                </div>
                <div>
                    <p className="scale-trigger">
                        <input type="checkbox" checked={this.state.limitDurationsTo95th}
                               onChange={this.limitDurations.bind(this)}/>
                        <label>&nbsp;Limit to 95th percentile</label>
                    </p>
                </div>

            </Panel>
        )
    }

    limitDurations(event) {
        this.setState({limitDurationsTo95th: event.target.checked});
    }

    componentDidUpdate() {
        if (!this.props.allYields) {
            return;
        }
        const durationInMonths = this.props.durationInMonths;
        const distribution = this.createPercentageChangeDistribution(this.props.allYields,
            durationInMonths,
            20,
            this.state.limitDurationsTo95th);
        const data = [];
        const labels = [];
        distribution.forEach(xyVal => {
            data.push(xyVal[1]);
            labels.push(xyVal[0] + 1);
        });

        if (this.chart !== null) {
            this.chart.data.datasets[0].data = data;
            this.chart.update();
        }
        else {
            this.chart = new Chart(this.refs.chart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        backgroundOpacity: '.3',
                        backgroundColor: 'rgba(74,135,208, .5)',
                        data: data
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {display: false},
                    title: {
                        display: false,
                    }
                }
            });
        }
    }
}

export default YieldDistribution;