import React, {type ChangeEvent} from 'react';
import styles from '../Form.module.css';
import {
  validateLoginPassword,
  validateLoginUser,
  validateRegisterConfirmPassword,
  validateRegisterPassword,
  validateRegisterUser
} from "./validator.ts";
import {connect} from "react-redux";
import type {AuthRequest, RegisterRequest, RootState} from "../../../redux/types.ts";
import {
  authThunk,
  createRegisterSuccessReset, createResetAuthSuccess,
  createResetRegisterServerError,
  registerThunk
} from "../../../redux/actions/authActions.ts";
import store from "../../../redux/store.ts";




interface LoginFormState {
  user: string,
  password: string,
  regUser: string,
  regPassword: string,
  regConfirmPassword: string,
  registerLoading: boolean,
  loginLoading: boolean,
  registerDialogOpened: boolean,
  token: string | null,
  errors: {
    user: string | null,
    password: string | null;
    regUser: string | null;
    regPassword: string | null;
    regConfirmPassword: string | null;
  }
}

export class LoginForm extends React.Component<Props, LoginFormState> {
  registerDialogRef = React.createRef<HTMLDialogElement>();
  registerSuccessDialogRef = React.createRef<HTMLDialogElement>();

  constructor(props: Props) {
    super(props);
    this.state = ({
      user: "",
      password: "",
      regUser: "",
      regPassword: "",
      regConfirmPassword: "",
      registerLoading: false,
      loginLoading: false,
      registerDialogOpened: false,
      token: null,
      errors: {
        user: null,
        password: null,
        regUser: null,
        regPassword: null,
        regConfirmPassword: null,
      }
    })
  }

  clearRegisterFormState = () => {
    this.setState({
      ...this.state,
      regUser: "",
      regPassword: "",
      regConfirmPassword: "",
      errors: {
        ...this.state.errors,
        regUser: null,
        regPassword: null,
        regConfirmPassword: null
      }
    })
  }


  clearLoginFormState = () => {
    this.setState({
      ...this.state,
      user: "",
      password: "",
      errors: {
        ...this.state.errors,
        user: null,
        password: null
      }
    })
  }

  noErrorsInLoginForm = (): boolean => {
    return !this.state.errors.user && !this.state.errors.password;
  }

  noErrorsInRegisterForm = (): boolean => {
    return !this.state.errors.regUser && !this.state.errors.regPassword
        && !this.state.errors.regConfirmPassword;
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value
    })
  };

  handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userError = validateLoginUser(this.state.user);
    const passwordError = validateLoginPassword(this.state.password);
    this.setState({
      ...this.state,
      errors: {
        ...this.state.errors,
        user: userError,
        password: passwordError
      }
    });
    if(userError || passwordError) return;
    const request: AuthRequest = {
      user: this.state.user,
      password: this.state.password
    }
    if(!userError && !passwordError) {
      this.clearLoginFormState();
      store.dispatch(authThunk(request));
    }
  };

  handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      regUser: this.state.regUser?.trim()
    })
    const regUserError = validateRegisterUser(this.state.regUser);
    const regPasswordError = validateRegisterPassword(this.state.regPassword);
    const regPasswordConfirmError = validateRegisterConfirmPassword(this.state.regPassword, this.state.regConfirmPassword);
    this.setState({
      ...this.state,
      regUser: this.state.regUser,
      errors: {
        ...this.state.errors,
        regUser: regUserError,
        regPassword: regPasswordError,
        regConfirmPassword: regPasswordConfirmError
      }
    });
    const request: RegisterRequest = {
      user: this.state.regUser,
      password: this.state.regPassword
    }
    if(!regUserError && !regPasswordError && !regPasswordConfirmError) {
      this.clearRegisterFormState();
      store.dispatch(createResetRegisterServerError());
      store.dispatch(registerThunk(request));
    }
  }

  handleCloseRegisterDialog = () => {
    const dialog = this.registerDialogRef.current;
    this.makeClosingAnimation(dialog, () => {
      dialog?.close();
    })
  }

  handleCloseRegisterSuccessDialog = () => {
    const dialog = this.registerSuccessDialogRef.current;
    this.makeClosingAnimation(dialog, () => {
      dialog?.close();
    })
  }

  makeClosingAnimation = (element: HTMLDialogElement | null, doAfter: () => void) => {
    if(element) {
      element.setAttribute('closing', '');
      setTimeout(() => {
        doAfter();
        element.removeAttribute('closing');
      }, 250);
    }
  }


  handleRegisterButton = () => {
    this.setState({
      ...this.state,
    }, () => {
      this.clearRegisterFormState();
      store.dispatch(createResetRegisterServerError());
      this.registerDialogRef.current?.showModal();
    });
  }

  render() {
    const { errors, loginLoading, registerLoading, registerSuccess , authSuccess} = this.props;

    if(registerSuccess) {
      this.makeClosingAnimation(this.registerDialogRef.current, () => {
        this.registerDialogRef.current?.close();
        store.dispatch(createRegisterSuccessReset());
      });
      this.registerSuccessDialogRef.current?.showModal();
    }

    if(authSuccess) {
      store.dispatch(createResetAuthSuccess());
      window.location.href = '/main'
      return (<></>);
    }

    return (
        <div className={styles.loginFormContainer}>
          {loginLoading && <div className={styles.loadingOverlay}></div>}
          <h2>Вход в систему</h2>
          <form onSubmit={this.handleLoginSubmit} className={styles.form}>
            <div className={styles.loginFormGroup}>
              <label htmlFor="user-input" className={styles.label}>
                Имя пользователя
              </label>
              <input id="user-input" type="text"
                     value={this.state.user} name="user"
                     placeholder="Имя пользователя"
                     onChange={this.handleChange}
                     className={styles.textInput}/>
              {this.state.errors.user &&
                  (<label className={styles.errorMessage}>{this.state.errors.user}</label>)
              }
            </div>
            <div className={styles.loginFormGroup}>
              <label htmlFor="password-input" className={styles.label}>
                Пароль
              </label>
              <input id="password-input" type="password"
                     value={this.state.password} name="password"
                     onChange={this.handleChange}
                     placeholder="Пароль"
                     className={styles.textInput}/>
              {this.state.errors.password &&
                  (<label className={styles.errorMessage}>{this.state.errors.password}</label>)
              }
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.loginSubmitButton}>
                Войти
              </button>
              <button type="button" className={styles.loginSubmitButton} onClick={this.handleRegisterButton}>
                Зарегистрироваться
              </button>
            </div>
            {this.noErrorsInLoginForm() && !authSuccess && errors.loginServerError &&
                <label className={styles.errorMessageBig}>{errors.loginServerError}</label>}
          </form>

          <dialog ref={this.registerDialogRef} className={`${styles.registerDialog} ${styles.animatableDialog}`}>
            <div className={styles.registerFormContainer}>
              {registerLoading && <div className={styles.loadingOverlay}></div>}
              <form method="dialog" onSubmit={this.handleRegisterSubmit}>
                <label className={styles.bigLabel}>Регистрация</label>

                <div className={styles.registerFormGroup}>
                  <label className={styles.label} htmlFor="regUser">Имя пользователя</label>
                  <input
                      id="regUser"
                      type="text"
                      name="regUser"
                      placeholder="Введите имя пользователя"
                      className={styles.textInput}
                      onChange={this.handleChange}
                      value={this.state.regUser}
                  />
                  {this.state.errors.regUser &&
                      <label className={styles.errorMessage}>{this.state.errors.regUser}</label>}
                </div>

                <div className={styles.registerFormGroup}>
                  <label className={styles.label} htmlFor="regPassword">Пароль</label>
                  <input
                      id="regPassword"
                      type="password"
                      name="regPassword"
                      placeholder="Введите пароль"
                      className={styles.textInput}
                      onChange={this.handleChange}
                      value={this.state.regPassword}
                  />
                  {this.state.errors.regPassword &&
                      <label className={styles.errorMessage}>{this.state.errors.regPassword}</label>}
                </div>

                <div className={styles.registerFormGroup}>
                  <label className={styles.label} htmlFor="confirmPassword">Подтвердите пароль</label>
                  <input
                      id="confirmPassword"
                      type="password"
                      name="regConfirmPassword"
                      placeholder="Повторите пароль"
                      className={styles.textInput}
                      onChange={this.handleChange}
                      value={this.state.regConfirmPassword}
                  />
                  {this.state.errors.regConfirmPassword &&
                      <label className={styles.errorMessage}>{this.state.errors.regConfirmPassword}</label>}
                </div>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitButton}>
                    Зарегистрироваться
                  </button>
                  <button type="button" onClick={this.handleCloseRegisterDialog} className={styles.submitButtonRed}>
                    Отмена
                  </button>
                </div>
                {this.noErrorsInRegisterForm() && !registerSuccess && !registerLoading && errors.registerServerError &&
                    <label className={styles.errorMessageBig}>{errors.registerServerError}</label>}
              </form>
            </div>
          </dialog>
          <dialog ref={this.registerSuccessDialogRef} className={`${styles.registerDialog} ${styles.animatableDialog}`}>
            <div className={styles.registerSuccessContainer}>
              <label className={styles.label}>Вы успешно зарегистрировались!</label>
              <div className={styles.registerSuccessButtonWrapper}>
              <button type="button" onClick={this.handleCloseRegisterSuccessDialog} className={styles.submitButton}>ОК</button>
              </div>
            </div>
          </dialog>
        </div>
  );
  }
  }
  const mapStateToProps = (state: RootState) => ({
    registerLoading: state.auth.registerLoading,
  loginLoading: state.auth.loginLoading,
  registerSuccess: state.auth.registerSuccess,
    authSuccess: state.auth.authSuccess,
  errors: {
    loginServerError: state.auth.loginError,
    registerServerError: state.auth.registerError
  }
}) ;

interface Props {
  registerLoading: boolean,
  loginLoading: boolean,
  registerSuccess: boolean,
  authSuccess: boolean,
  errors: {
    loginServerError: string | null,
    registerServerError: string | null
  }
}

export default connect(mapStateToProps)(LoginForm);