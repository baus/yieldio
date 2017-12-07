import React from 'react';
import Spinner from './spinner';

const Panel = props => {
    let content = null;
    if(props.loading) {
        content = (<div><Spinner/>{props.children}</div>);
    } else {
        content = props.children;
    }
    return (
        <div className="panel">
            <div className="panel-heading">{props.heading}</div>
            <div className="panel-body">{content}</div>
        </div>
    );
};


export default Panel;