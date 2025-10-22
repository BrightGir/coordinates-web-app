import styles from './Header.module.css';
import React from 'react';


export class Header extends React.Component {
    render() {
        return (
            <header className={styles.header}>
                <h1>Лабораторная работа №4</h1>
                <p>Фонарева Виктория P3210</p>
                <p>Вариант 1234</p>
            </header>
        );
    }
}

