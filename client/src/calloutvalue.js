import React from 'react';

const CalloutValue = props => {
    let labelClass = 'neutral';

    if (props.bpsChange === 'NaN' || props.bpsChange === 0.0) {
        labelClass = 'neutral';
    } else if (props.bpsChange > 0.0) {
        labelClass = 'positive';
    } else if (props.bpsChange < 0.0) {
        labelClass = 'negative';
    }
    return (
        <span className={labelClass}>{props.text}</span>
    )
};

export default CalloutValue;