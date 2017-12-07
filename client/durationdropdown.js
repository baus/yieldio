import React from "react";
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from 'reactstrap';
import * as data from "./data";

class DurationDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    durationChange(durationInMonths) {
        this.props.onDurationChange(durationInMonths);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        let label = 'Bond Duration';
        if (this.props.label) {
            label = this.props.label;
        }
        const dropdownItems = data.LONG_DURATION_LABELS.map(label => {
            return (
                <DropdownItem key={label[0]}
                              onClick={this.durationChange.bind(this, label[0])}>{label[1]}</DropdownItem>
            )
        });
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret color="primary">
                    {label}
                </DropdownToggle>
                <DropdownMenu>
                    {dropdownItems}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

export default DurationDropdown;