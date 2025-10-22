
import './App.css'
import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/login";
import MainPage from "./pages/main/MainPage.tsx";
import {SERVER_URL} from "../../config.ts";
import type {RootState} from "../../redux/types.ts";
import {connect} from "react-redux";
import {createSetAuthorizedAction} from "../../redux/actions/authActions.ts";
import store from "../../redux/store.ts";


interface AppState {
    loading: boolean
}

class App extends React.Component<Props, AppState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.setState({
                loading: false
            });
            return;
        }
        this.validateToken();
    }


    validateToken = () => {
        this.setState( {
            loading: true
        })
        fetch(`${SERVER_URL}/api/auth/check`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Invalid token`);
                }
                this.setState({
                    loading: false
                });
                store.dispatch(createSetAuthorizedAction(true))
                return {};
            })
            .catch((error) => {
                store.dispatch(createSetAuthorizedAction(false))
                this.setState({
                    loading: false
                });
                if(!(error instanceof TypeError)) {
                    localStorage.removeItem("token")
                }
            });
    }

    render() {
        const { loading } = this.state;
        const { authorized } = this.props;
        if(loading) {
            return (<div>Загрузка...</div>)
        }
        return (
            <Routes>
                <Route path="/" element={ authorized ? <MainPage /> : <LoginPage/>} />
                <Route path="/main" element={ authorized ? <MainPage/> : <Navigate to="/"/>}/>
                <Route path="/login" element={<Navigate to="/"/>}/>
            </Routes>
        );
    }

}

interface Props {
    authorized: boolean
}

const mapStateToProps = (state: RootState) => ({
    authorized: state.auth.authorized
});

export default connect(mapStateToProps)(App);

