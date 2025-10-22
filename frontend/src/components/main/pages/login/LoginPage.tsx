import React from 'react';
import {Header} from "../../../header";
import styles from "./Login.module.css"
import LoginForm from "../../../forms/login";


export default class LoginPage extends React.Component {
    render() {
        return (
            <div className={styles.loginMain}>
                 <Header/>
                <LoginForm/>
            </div>
        );
    }
}

