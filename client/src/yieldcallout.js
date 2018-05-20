import React from 'react';
import Panel from './panel';
import CalloutValue from './calloutvalue';
import FormattedDate from './formatteddate';
import * as data from './data';

const YieldCallout = props => {
    let yieldsForDurationAndDate = [];
    if (props.yieldsForDate) {
        yieldsForDurationAndDate = props.yieldsForDate[data.getDurationIndexFromMonths(props.durationInMonths)];
    }
    const durationLabel = data.LONG_DURATION_LABELS.find(element => element[0] === props.durationInMonths)[1];
    const callout = props.yieldsForDate && data.isNumber(yieldsForDurationAndDate[0]) ? yieldsForDurationAndDate[0].toFixed(2) + '%' : '';
    const bpsChange = yieldsForDurationAndDate[1];
    const bpsCallout = props.yieldsForDate && data.isNumber(bpsChange) ? (bpsChange * 100).toFixed(0) : '';
    const percentageChangeCallout = props.yieldsForDate && data.isNumber(yieldsForDurationAndDate[2]) ? (yieldsForDurationAndDate[2]).toFixed(2) + '%' : '';
    return (
        <Panel loading={!props.yieldsForDate}>
            <div className="row">
                <div className="col-sm-7">
                    <span className="the-number"><CalloutValue text={callout} bpsChange={bpsChange}/></span><br></br>
                    {durationLabel} yield as of <FormattedDate date={props.currentDate}/>
                </div>
                <div className="col-sm-5 callout">
                    <div><span>{bpsCallout}</span> bps</div>
                    <div>% change: <span>{percentageChangeCallout}</span></div>
                </div>
            </div>
        </Panel>
    );
};

export default YieldCallout;
