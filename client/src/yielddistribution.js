import React from 'react';
import {connect} from 'react-redux';
import Chart from 'chart.js';
import Panel from './panel';
import * as data from './data';
import createHistogram from 'compute-histogram';
import {toggleTrimDistribution} from "./actions/distributionActions";

const NUM_HISTOGRAM_BUCKETS = 30;

class YieldDistribution extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {chart: null};
    }

    createPercentageChangeDistribution(allYields, durationInMonths, numBuckets, limitTo95thPercentile) {
        const durationIndex = data.getDurationIndexFromMonths(durationInMonths);
        const getPercentageChangeFromYields = function (yieldsForDay) {
            const dateSlicedYields = yieldsForDay.slice(1);
            const value = dateSlicedYields[durationIndex][2];
            if (data.isNumber(value)) {
                return value;
            }
            return value;
        };

        const filteredYields = allYields.filter(yieldsForDay => {
            const value = getPercentageChangeFromYields(yieldsForDay);
            return data.isNumber(value);
        });

        const percentageChange = filteredYields.map(getPercentageChangeFromYields);
        return createHistogram(percentageChange,
            numBuckets,
            limitTo95thPercentile?0.05:0.0);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return this.props.durationInMonths !== nextProps.durationInMonths ||
            this.props.allYields !== nextProps.allYields ||
            this.props.limitDurationsTo95th !== nextProps.toggleTrimDistribution;
    }

    render() {
        const heading = 'Distribution of % change in ' + data.getDurationLabel(this.props.durationInMonths) + ' Treasury bond yields';
        return (
            <Panel loading={!this.props.allYields} heading={heading}>
                <div style={{height: '200px'}}>
                    <canvas ref="chart"/>
                </div>
                <div>
                    <p className="scale-trigger">
                        <input type="checkbox" checked={this.props.limitDurationsTo95th}
                               onChange={this.limitDurations.bind(this)}/>
                        <label>&nbsp;Trim tails (5% right and left)</label>
                    </p>
                </div>

            </Panel>
        )
    }

    limitDurations(event) {
        this.props.toggleTrimDistribution( event.target.checked );
    }


    createChartDataAndLabels() {
        const returnVal = {data:[], labels:[]};
        const durationInMonths = this.props.durationInMonths;
        const distribution = this.createPercentageChangeDistribution(this.props.allYields,
            durationInMonths,
            NUM_HISTOGRAM_BUCKETS,
            this.props.limitDurationsTo95th);
        distribution.forEach(xyVal => {
            returnVal.data.push(xyVal[1]);
            returnVal.labels.push(xyVal[0] + 1);
        });
        return returnVal;
    }

    createChart() {
        const dataAndLabels = this.createChartDataAndLabels();
        const chart = Chart.Bar(this.refs.chart, {
            type: 'bar',
            data: {
                labels: dataAndLabels.labels,
                datasets: [{
                    backgroundOpacity: '.3',
                    backgroundColor: 'rgba(74,135,208, .5)',
                    data: dataAndLabels.data
                }]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        categoryPercentage: 1.0,
                        // This is required for the bars to 'touch' each other to
                        // look more like bins in a histogram
                        barPercentage: 1.03
                    }]
                },
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: false,
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
        if (!this.props.allYields) {
            return;
        }
        if (this.state.chart !== null) {
            const dataAndLabels = this.createChartDataAndLabels();
            this.state.chart.data.datasets[0].data = dataAndLabels.data;
            this.state.chart.update();
            return;
        }
        this.createChart();
    }
}

const mapStateToProps = state => {
    return {
        limitDurationsTo95th: state.distribution.trim
    };
}

export default connect(mapStateToProps, {toggleTrimDistribution})(YieldDistribution);