import React, { Component } from "react";

class LinearLoadingSymbol extends Component {
    render() {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        );
    }
}

export default LinearLoadingSymbol;