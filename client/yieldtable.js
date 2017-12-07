import React from 'react';
import Panel from './panel';
import CalloutValue from './calloutvalue';
import FormattedDate from './formatteddate';
import * as data from './data';

const YieldRow = props => {
    const percentageYield = data.isNumber(props.percentageYield) ?
        props.percentageYield.toFixed(2) + '%' : 'N/A';
    const bpsChange = data.isNumber(props.bpsChange) ?
        (props.bpsChange * 100).toFixed(0) : 'N/A';
    const percentageChange = data.isNumber(props.percentageChange) ?
        props.percentageChange.toFixed(2) + '%' : 'N/A';
    return (
        <tr>
            <td className="labeltext">{props.label}</td>
            <td><CalloutValue text={percentageYield} bpsChange={props.bpsChange}/></td>
            <td>{bpsChange}</td>
            <td>{percentageChange}</td>
        </tr>
    )
};

const YieldTable = props => {
    let yieldRows = [];
    const heading = "Treasury bond yields as of " + FormattedDate.format(props.currentDate);
    if (props.yieldsForDate) {
        yieldRows = data.SHORT_DURATION_LABELS.map((durationLabel, index) => {
            const label = durationLabel[1];
            const percentageYield = props.yieldsForDate[index][0];
            const bpsChange = props.yieldsForDate[index][1];
            const percentageChange = props.yieldsForDate[index][2];
            return (
                <YieldRow key={durationLabel[0]} label={label} percentageYield={percentageYield} bpsChange={bpsChange}
                          percentageChange={percentageChange}/>
            );
        });
    }
    return (
        <Panel loading={false} heading={heading}>
            <table id="yield-curve-legend" className="table">
                <thead>
                <tr>
                    <th>duration</th>
                    <th>yield</th>
                    <th>bps change</th>
                    <th>% change</th>
                </tr>
                </thead>
                <tbody>
                {yieldRows}
                </tbody>
            </table>
        </Panel>
    );
};

export default YieldTable;
