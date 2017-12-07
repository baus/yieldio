import React from 'react';

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