import React from 'react';
import Spinner from './spinner';
import MaterialIcon, {colorPallet} from 'material-icons-react';

const ExpandContractIcon = props => {
    if (props.icon === 'expand') {
        return (<span style={{float: "right"}} onClick={props.onExpand} ><MaterialIcon icon="call_made"/></span>);
    }
    if (props.icon === 'contract') {
        return (<span style={{float: "right"}} onClick={props.onContract}><MaterialIcon icon="call_received"/></span>);
    }
    return (null);
};


const Panel = props => {
    let content = null;
    if (props.loading) {
        content = (<div><Spinner/>{props.children}</div>);
    } else {
        content = props.children;
    }
    if (props.icon) {
        return (
            <div className="panel">
                <div className="panel-heading" ><span style={{float:"left"}}>{props.heading}</span><ExpandContractIcon onExpand={props.onExpand} onContract={props.onContract} icon={props.icon}/></div>
                <div className="panel-body">{content}</div>
            </div>
        );
    } else {
        return (
            <div className="panel">
                <div className="panel-heading">{props.heading}</div>
                <div className="panel-body">{content}</div>
            </div>
        );
    }

};


export default Panel;