import React, { Component } from 'react';
import { ServiceConsumer } from '../helpers/Context';
const MakeRequest = require('../helpers/MakeRequest');

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
    * Funcion para consultar el API para el logeo en la aplicacion
    */
    handleSubmit(event) {
        event.preventDefault();
        let form = event.target,
            data = {
                username : form.querySelector('#username').value,
                password : form.querySelector('#password').value
            }
        ;
        MakeRequest({
            method: 'post',
            url: '/user/login',
            data : JSON.stringify(data)
        }).then(response => {
            if (response.error) {
                return window.M.toast({html: response.message});
            }

            window.sessionStorage.setItem('isAuthenticated', true);
            window.sessionStorage.setItem('username', data.username);
            this.userHasAuthenticated(true);
            window.location = '/';
        });
    }

    render() {
        return (
            <div className="container" style={{marginTop : '50px'}}>
                <div className="row">
                    <ServiceConsumer>
                    {value => {
                        this.isAuthenticated = value.isAuthenticated;
                        this.userHasAuthenticated = value.userHasAuthenticated;
                    }}
                    </ServiceConsumer>
                    <div className="col l6 offset-l3 m8 offset-m2">
                        <div className="col s12 m12">
                            <div className="card-panel">
                                <form name="login-form" method='post' data-method-api="post" onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col s12 m12 center"><b>Welcome</b>. Please login</div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m12">
                                            <i className="material-icons prefix">account_circle</i>
                                            <input id="username" placeholder="username" type="text" name="username" required className="validate"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12 m12">
                                            <i className="material-icons prefix">vpn_key</i>
                                            <input id="password" placeholder="password" name='password' type="password" required className="validate"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col s12 m12 center">
                                            <button className="btn btn-success" type="submit" style={{width: '100%'}}>LOG IN</button>
                                        </div>
                                    </div>
                                </form>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
