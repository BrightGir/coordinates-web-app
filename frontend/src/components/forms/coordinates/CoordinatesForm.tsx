import React, {type ChangeEvent} from 'react';
import type { CoordinatesRequest } from '../../../redux/types.ts';
import styles from '../Form.module.css';
import store from "../../../redux/store.ts";
import {addResultThunk, changeR} from "../../../redux/actions/resultsActions.ts";


interface CoordinatesFormState {
  x: string
  y: string
  r: string
  errors: {
    y: string | null,
    r: string | null;
  }
}

export class CoordinatesForm extends React.Component<object, CoordinatesFormState> {
  xArray = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];
  rArray = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];

  constructor(props: object) {
    super(props);
    this.state = {
      x: '0',
      y: '',
      r: '0',
      errors: {
        y: null,
        r: null
      }
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value
    })
    if(name == 'r') {
      store.dispatch(changeR(Number(value)));
    }
  };

  validateY = (y: string): string | null => {
    if(!y.trim()) {
      return "Выберите значение Y";
    }
    const yNum = Number(y.trim().replace(',','.'));
    if(isNaN(yNum)) {
      return "Y должно быть числом";
    }
    if(yNum < -5 || yNum > 5) {
      return "Y должно быть от -5 до 5";
    }
    return null;
  }

  validateR = (r: string): string | null => {
    const rNum = Number(r);
    if(rNum <= 0) {
      return "R должен быть положительным";
    }
    return null;
  }



  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yError = this.validateY(this.state.y);
    const rError = this.validateR(this.state.r);
    this.setState({
      ...this.state,
      errors: {
        r: rError,
        y: yError
      }
    });
    if(yError || rError) return;
    const formData: CoordinatesRequest = {
      x: Number(this.state.x.trim().replace(",",".")),
      y: Number(this.state.y.trim().replace(",",".")),
      r: Number(this.state.r.trim().replace(",",".")),
      clientTimestamp: Date.now(),
      clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    this.setState({
      ...this.state,
      x: "0",
      y: "",
      r: "0",
      errors: {
        r: rError,
        y: yError
      }
    });
    store.dispatch(addResultThunk(formData));
  };

  render() {
    return (
      <div className={styles.formContainer}>
        <h2>Параметры</h2>
        <form onSubmit={this.handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Координата X</label>
            <select 
              name="x" 
              value={this.state.x} 
              onChange={this.handleChange}
              className={styles.selectInput}
            >
              {this.xArray.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="y-input" className={styles.label}>
              Координата Y (от -5 до 5)
            </label>
            <input id="y-input" type="text"
              value={this.state.y} name = "y"
              placeholder="От -5 до 5"
              className={styles.textInput} onChange={this.handleChange}
            />
            {this.state.errors.y &&
                (<label className={styles.errorMessage}>{this.state.errors.y}</label>)
            }
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Радиус R</label>
            <select 
              name="r" 
              value={this.state.r} 
              onChange={this.handleChange}
              className={styles.selectInput}>
              {this.rArray.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            {this.state.errors.r &&
                (<label className={styles.errorMessage}>{this.state.errors.r}</label>)
            }
          </div>

          <button type="submit" className={styles.submitButton}>
            Проверить
          </button>
        </form>
      </div>
    );
  }
}
