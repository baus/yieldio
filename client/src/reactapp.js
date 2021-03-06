import React from 'react';
import {Provider} from 'react-redux';
import YieldHistory from './yieldhistory';
import YieldCurve from './yieldcurve';
import YieldDistribution from './yielddistribution';
import YieldTable from './yieldtable';
import YieldCallout from './yieldcallout';
import YieldSpread from './yieldspread';
import About from './about';

import * as data from './data';

import store from './store';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            durationInMonths: 120,
            yieldCurveExpanded: false
        };
    }

    componentDidMount() {
        data.getAllYields(allYields => {
            this.setState({
                date: new Date(allYields[allYields.length - 1][0])
            });
        });
    }

    onDurationChange(durationInMonths) {
        this.setState({durationInMonths: durationInMonths});
    }

    onDateChange(date) {
        this.setState({date: date});
    }


    render() {
        const yieldsForDate = this.state.date ? data.getYieldsForDate(this.state.date) : null;
        const durationInMonths = this.state.durationInMonths;
        if (this.state.yieldCurveExpanded) {
            return (
                <Provider store={store}>
                    <div className="container-fluid">
                        <div className="row heading no-gutters">
                            <div className="col-md-12"><span className="brand">yield.IO</span>
                                <span> bond charts updated daily</span><About/>
                            </div>
                        </div>
                        <div className="row no-gutters">
                            <div className="col-md-12">
                                <YieldHistory allYields={data.allYields}
                                              onDurationChange={this.onDurationChange.bind(this)}
                                              onDateChange={this.onDateChange.bind(this)}
                                />
                            </div>
                        </div>

                        <div className="row no-gutters">
                            <div className="col-md-12">
                                <YieldCurve yieldsForDate={yieldsForDate}
                                            onContract={() => {
                                                this.setState({yieldCurveExpanded: false})
                                            }}
                                            currentDate={this.state.date}
                                            icon="contract"
                                />
                            </div>
                        </div>


                        <div className="row no-gutters">
                            <div className="col-md-5">
                                <YieldCallout yieldsForDate={yieldsForDate}
                                              currentDate={this.state.date}
                                              durationInMonths={durationInMonths}
                                />
                                <YieldTable yieldsForDate={yieldsForDate} currentDate={this.state.date}/>
                            </div>

                            <div className="col-md-7">
                                <YieldSpread allYields={data.allYields}/>
                                <YieldDistribution allYields={data.allYields} durationInMonths={durationInMonths}/>
                            </div>
                        </div>
                    </div>
                </Provider>)
        }
        return (
            <Provider store={store}>
                <div className="container-fluid">
                    <div className="row heading no-gutters">
                        <div className="col-md-12"><span className="brand">yield.IO</span>
                            <span> bond charts updated daily</span><About/>
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-md-12">
                            <YieldHistory allYields={data.allYields}
                                          onDurationChange={this.onDurationChange.bind(this)}
                                          onDateChange={this.onDateChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row no-gutters">
                        <div className="col-md-5">
                            <YieldCallout yieldsForDate={yieldsForDate}
                                          currentDate={this.state.date}
                                          durationInMonths={durationInMonths}
                            />
                            <YieldTable yieldsForDate={yieldsForDate} currentDate={this.state.date}/>
                        </div>

                        <div className="col-md-7">
                            <YieldCurve yieldsForDate={yieldsForDate}
                                        onExpand={() => {
                                            this.setState({yieldCurveExpanded: true})
                                        }}
                                        currentDate={this.state.date}
                                        icon="expand"/>
                            <YieldSpread allYields={data.allYields}/>
                            <YieldDistribution allYields={data.allYields} durationInMonths={durationInMonths}/>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }
}

export default App;