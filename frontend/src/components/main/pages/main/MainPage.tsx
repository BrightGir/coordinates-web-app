import React from 'react';

import styles from "./Main.module.css"
import {CoordinatesForm} from "../../../forms/coordinates";
import Graph from "../../../graph";
import ResultsTable from "../../../table";
import store from "../../../../redux/store.ts";
import {getResultsThunk} from "../../../../redux/actions/resultsActions.ts";


export default class MainPage extends React.Component {

    componentDidMount() {
        store.dispatch(getResultsThunk(1, 10));
    }

    handleQuitButton = () => {
        localStorage.removeItem("token");
        window.location.href = '/';
    }

    render() {
        return (
            <div className={styles.main}>
                <button className={styles.submitButtonRed} onClick={this.handleQuitButton}>Выйти</button>
                <div className={styles.mainWrapper}>
                    <CoordinatesForm/>
                    <Graph loading={false} error={null}/>
                    <ResultsTable />
                </div>
            </div>
        );
    }
}

