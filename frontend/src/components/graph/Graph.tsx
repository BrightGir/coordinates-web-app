import React from 'react';
import {connect} from "react-redux";
import type {CoordinatesRequest, ResultsState, RootState} from "../../redux/types.ts";
import {getLabelsView, getPointView, getShapesView} from "./graph-handler.tsx";
import store from "../../redux/store.ts";
import {addResultThunk} from "../../redux/actions/resultsActions.ts";
import {ONE_UNIT_PX, centerY, centerX} from "./graph-handler.tsx";
import styles from './Graph.module.css';

class Graph extends React.Component<ResultsState, object> {

    handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
        const r = this.props.r;
        if(r <= 0) {
            return;
        }
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        const mathX = Number(((clickX - centerX) / ONE_UNIT_PX));
        const mathY = Number(((centerY - clickY) / ONE_UNIT_PX));

        const formData: CoordinatesRequest = {
            x: mathX,
            y: mathY,
            r: r,
            clientTimestamp: Date.now(),
            clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        store.dispatch(addResultThunk(formData));

    }

    render() {
        const {results, r} = this.props;
        return (
            <div className={styles.graphContainer}>
                <h2>График</h2>
                <div className="graph-wrapper">
                    <svg id="graph-svg" width="700" height="700" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 700 700" onClick={this.handleSvgClick}>
                        <g id="shapes" fill="#302f2d">
                            {getShapesView(r)}
                        </g>
                        <g id="labels" fill="WHITE" fontSize="14">
                            <text x="360" y="20">Y</text>
                            <text x="680" y="340">X</text>
                            {getLabelsView(r)}
                        </g>
                        <g id="axes" stroke="WHITE">
                        <line x1="350" y1="0" x2="350" y2="700"></line>
                            <polygon points="350,0 345,15 355,15" fill="black"></polygon>
                            <line x1="0" y1="350" x2="700" y2="350"></line>
                            <polygon points="700,350 685,345 685,355" fill="black"></polygon>
                        </g>
                        <g id="history-points">
                            {results.map(result => (
                                <g key={result.id}>
                                    {getPointView(result, r)}
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state: RootState) => ({
    results: state.results.results,
    r: state.results.r,
    totalPages: state.results.totalPages,
    page: state.results.totalPages
});

export default connect(mapStateToProps)(Graph);