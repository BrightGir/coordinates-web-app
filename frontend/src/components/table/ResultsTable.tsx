import React from 'react';
import styles from './ResultsTable.module.css';
import {connect} from "react-redux";
import type {ResultsState, RootState} from "../../redux/types.ts";
import {deleteResultThunk, getResultsThunk, setPage} from "../../redux/actions/resultsActions.ts";
import store from "../../redux/store.ts";


class ResultsTable extends React.Component<ResultsState> {

    handleDeleteResultButton = (id: number) => {
        store.dispatch(deleteResultThunk((id)))
    }

    handleSetPageButton = (page: number) => {
        store.dispatch(setPage(page))
    }

    handlePageButtonClick = (page: number, pageSize: number) => {
        store.dispatch(getResultsThunk(page, pageSize));
    }

    render() {
        const { results, loading, page, totalPages } = this.props;
        const currentPage = page;
        const resultsInPage = 10;


        return (
            <div className={styles.resultsContainer}>
                <h2>История проверок</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.resultsTable}>
                        <thead>
                        <tr>
                            <th>X</th>
                            <th>Y</th>
                            <th>R</th>
                            <th>Результат</th>
                            <th>Время проверки</th>
                            <th>Время выполнения (мс)</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map(result => (
                            <tr key={result.id}>
                                <td>{result.x}</td>
                                <td>{result.y}</td>
                                <td>{result.r}</td>
                                <td>{result.hit ? "Попадание" : "Промах"}</td>
                                <td>{result.formattedTimestamp}</td>
                                <td>{result.formattedExecutionTime}</td>
                                <td>
                                    <button
                                        onClick={() => this.handleDeleteResultButton(result.id)}
                                        className={styles.deleteButton}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {loading && <div className={styles.loadingOverlay}></div>}
                </div>
                <div className={styles.pagination}>
                    <button
                        onClick={() => {
                            const page = 1;
                            this.handleSetPageButton(page);
                            this.handlePageButtonClick(page, resultsInPage)
                        }}
                        disabled={currentPage === 1}>
                        &lt;
                    </button>
                    { currentPage-1 >= 1 &&
                        <button
                            onClick={() => {
                            const page = Math.max(1, currentPage -1);
                            this.handleSetPageButton(page);
                            this.handlePageButtonClick(page, resultsInPage)
                        }}>
                            {currentPage-1}
                        </button>
                    }
                    <button className={styles.activePaginationButton} disabled={true}>
                        {currentPage}
                    </button>
                    { currentPage+1 <= totalPages &&
                    <button
                        onClick={() => {
                            const page = Math.min(totalPages, currentPage + 1);
                            this.handleSetPageButton(page);
                            this.handlePageButtonClick(page, resultsInPage)
                        }}>
                        {currentPage + 1}
                    </button>
                    }
                    <button
                        onClick={() => {
                            const page = totalPages;
                            this.handleSetPageButton(page);
                            this.handlePageButtonClick(page, resultsInPage)
                        }}>
                        &gt;
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    results: state.results.results,
    loading: state.results.loading,
    error: state.results.error,
    r: state.results.r,
    page: state.results.page,
    totalPages: state.results.totalPages,
});

export default connect(mapStateToProps)(ResultsTable);