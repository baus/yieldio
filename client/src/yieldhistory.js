import React from 'react';
import Spinner from './spinner';
import {Button} from 'reactstrap';
import DurationDropdown from './durationdropdown';
import CrosshairPlugin from './plugin.crosshair';
import Chart from 'chart.js';
import * as data from './data';


const YieldHistoryPanel = props => {
    let content = null;
    if (props.loading) {
        content = (<div><Spinner/>{props.children}</div>);
    } else {
        content = props.children;
    }
    let animateButtonText = 'Animate Yield Curve';
    let animateButtonColor = 'success';
    if (props.animationRunning) {
        animateButtonText = 'Stop Animation';
        animateButtonColor = 'danger';
    }

    return (
        <div className="panel">
            <div className="panel-heading">{props.heading}</div>
            <div className="panel-body">{content}</div>
            <DurationDropdown onDurationChange={props.onDurationChange}/>&nbsp;
            <Button color={animateButtonColor} onClick={props.onAnimationToggle}>{animateButtonText}</Button>
        </div>
    );
};


class YieldHistory extends React.Component {
    constructor(props) {
        super(props);
        this.chart = null;
        this.animationTimer = null;
        this.enableCallback = true;
        this.currentAnimationFrame = 0;
        this.state = {
            duration: 120,
            animationRunning: false
        };
    }


    onDurationChange(durationInMonths) {
        this.setState({duration: durationInMonths});
        this.currentAnimationFrame = 0;
        this.props.onDurationChange(durationInMonths);
    }

    onAnimationToggle() {
        this.setState(state => {
            if(!state.animationRunning) {
                this.animateYieldCurve();
            } else {
                clearTimeout(this.animationTimer);
            }
            return {animationRunning: !state.animationRunning}
        });
    }

    render() {
        const heading = data.getDurationLabel(this.state.duration) + " treasury bond yield history";
        return (
            <YieldHistoryPanel loading={!this.props.allYields}
                               heading={heading}
                               onDurationChange={this.onDurationChange.bind(this)}
                               animationRunning={this.state.animationRunning}
                               onAnimationToggle={this.onAnimationToggle.bind(this)}
            >
                <canvas ref="chart" style={{height: '150px', width: '800px'}}></canvas>
            </YieldHistoryPanel>
        );
    }

    animateYieldCurve() {
        const YieldSpreadData = data.getYieldsForDuration(this.state.duration);
        const numFrames = YieldSpreadData.length;

        this.drawCrosshairAtIndex(this.currentAnimationFrame);
        this.props.onDateChange(new Date(YieldSpreadData[this.currentAnimationFrame].t));

        this.currentAnimationFrame++;
        if (this.currentAnimationFrame >= numFrames) {
            this.currentAnimationFrame = 0;
        }

        this.animationTimer = setTimeout(this.animateYieldCurve.bind(this), 10);
    }

    handleMouseOver(date, index) {
        if (this.enableCallback) {
            this.props.onDateChange(date);
            this.currentAnimationFrame = index;
        }
        this.enableCallback = true;
    }

    drawCrosshairAtIndex(index) {
        this.enableCallback = false;
        this.chart.update(0);

        const points = this.chart.getDatasetMeta(0).data;
        const canvasRect = this.chart.canvas.getBoundingClientRect();
        const xCoord = canvasRect.left + points[index]._model.x;
        const yCoord = canvasRect.top + points[index]._model.y;

        const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: xCoord,
            clientY: yCoord
        });
        this.chart.canvas.dispatchEvent(event);
    }

    componentDidUpdate() {
        // Massage the input data to show only the requested yields
        let durationInMonths = this.state.duration;
        let yieldData = data.getYieldsForDuration(durationInMonths);

        if (this.chart !== null) {
            this.chart.data.datasets[0].data = yieldData;
            this.chart.update();
        }
        else {
            this.chart = new Chart(this.refs.chart, {
                plugins: [new CrosshairPlugin(this.handleMouseOver.bind(this))],
                type: 'line',

                data: {
                    datasets: [{
                        data: yieldData,
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

export default YieldHistory;
