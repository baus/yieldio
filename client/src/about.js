import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <span>
                <a class="about" href="#" onClick={this.toggle}>About</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>About Yield.IO</ModalHeader>
                    <ModalBody>
                        <p>
                        Yield.IO collects bond data from the US Treasury website and creates a dashboard of common
                            charts based on historical bond yields.
                        </p>
                        <p>
                            The Treasury calculates yields for
                            common outstanding bond durations daily after the close of the bond market.
                        </p>
                        <p>
                            Yield.IO updates a <a href="https://twitter.com/yieldio">Twitter feed</a> when new yields
                            are available.
                        </p>
                        <p>
                        The application uses React, Redux, Bootstrap, Chartjs, and AWS Lambda.
                            The code is available <a href="https://github.com/baus/yieldio">on Github</a>.
                        </p>
                        <p>
                        &copy; 2017-2018 Christopher Baus &lt;christopher@baus.net&gt;
                        </p>
                    </ModalBody>

                </Modal>
            </span>
        );
    }
}

export default About;