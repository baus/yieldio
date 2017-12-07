import React from 'react';
import Spinner from './spinner';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from 'reactstrap';
import DurationDropdown from './durationdropdown';
import * as data from './data';


const YieldSpreadPanel = props => {
    let content = null;
    if (props.loading) {
        content = (<div><Spinner/>{props.children}</div>);
    } else {
        content = props.children;
    }
    let animateButtonText = 'Animate Yield Curve';
    let animateButtonColor = 'success';
    if (props.animationRunning) {
        animateButtonText = 'Stop Animation'
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


class YieldSpread extends React.Component {
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

    drawCrosshairAtPoint(x, y) {
        if (x < this.chart.chartArea.left || x > this.chart.chartArea.right) {
            return;
        }
        const canvas = this.chart.canvas;
        const context = canvas.getContext("2d");
        context.setLineDash([3, 5]);
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.scrollHeight);
        context.strokeStyle = "black";
        context.stroke();
        context.closePath();
    }

    render() {
        const heading = data.getDurationLabel(this.state.duration) + " treasury bond yield history";
        return (
            <YieldSpreadPanel loading={!this.props.allYields}
                               heading={heading}
                               onDurationChange={this.onDurationChange.bind(this)}
                               animationRunning={this.state.animationRunning}
                               onAnimationToggle={this.onAnimationToggle.bind(this)}
            >
                <canvas ref="chart" style={{height: '150px', width: '800px'}}></canvas>
            </YieldSpreadPanel>
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
        let that = this;
        let mouseOverPlugin = {
            x: null,
            y: null,
            afterEvent: function (targetChart, e) {
                this.x = e.x;
                this.y = e.y;
                let elem = targetChart.getElementsAtEventForMode(e, 'x', {
                    intersect: false
                })[0];
                if (elem !== undefined && that.enableCallback) {
                    that.props.onDateChange(new Date(targetChart.config.data.datasets[0].data[elem._index].t));
                    that.currentAnimationFrame = elem._index;
                }
                that.enableCallback = true;
            },
            afterDraw: function (targetChart) {
                that.drawCrosshairAtPoint(this.x, this.y);
            }
        };

        if (this.chart !== null) {
            this.chart.data.datasets[0].data = yieldData;
            this.chart.update();
        }
        else {
            this.chart = new Chart(this.refs.chart, {
                plugins: [mouseOverPlugin],
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
