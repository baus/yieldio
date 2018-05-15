import React from 'react';
import strftime from 'strftime';

Date.prototype.strftime = function (fmt) {
    let GMTtime = strftime.timezone(new Date().getTimezoneOffset());
    return GMTtime(fmt, this);
};

class FormattedDate extends React.Component {
    static format(d) {
        return d ? d.strftime('%-m/%-d/%Y') : '';
    }
    render() {
        const formattedDate = FormattedDate.format(this.props.date);
        return (
            <span>{formattedDate}</span>
        );
    }
}

export default FormattedDate;