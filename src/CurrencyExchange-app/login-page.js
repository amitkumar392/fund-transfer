import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/app-route/app-location.js';

import '../CurrencyExchange-app/shared/ajax-call.js';

/**
* @customElement
* @polymer
*/
class UserLogin extends PolymerElement {
  static get template() {
    return html`
<style>
  :host {
    display: block;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

  }

  #form {
    border: 1px solid black;
    width: 500px;
    border-radius:20px;
    padding:8px;
    margin-top: 100px;
    margin-left: 400px;
    background-color:white;
  }
  h2{
    text-align: center;
  }
  paper-button {
    text-align: center;
    margin-top: 40px;
    background-color:black;
    color:white;
    margin-bottom: 40px;
    margin-left: 180px;
  }
  #blankForm {
    --paper-toast-background-color: black;
    --paper-toast-color: white;
  }
</style>

<app-location route={{route}}></app-location>
<ajax-call id="ajax"></ajax-call>
<iron-form id="form">

  <form>
    <h2> Login Page</h2>
    <paper-input label="Email Id" id="emailId" type="email" value={{emailId}} name="email" required error-message="enter valid email id"></paper-input>
    <paper-input label="Password" id="password" type="password" value={{password}} name="password" required error-message="enter correct password" ></paper-input>
    <paper-button raised id="signIn" class="custom indigo" on-click="signIn">Login</paper-button>
  </form>
</iron-form>
<paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>



`;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'Fund Transfer'
      },
      respCheck: Array,
      details: {
        type: Object
      }
    };
  }

  ready(){
    super.ready();
    this.addEventListener('user-details',(e)=>this._handleResponse(e));
  }

  // fetching the user data from database and validating the phone number and password
  signIn() {

    if (this.$.form.validate()) {
      let emailId = this.emailId;
      let password1 = this.password;
      // this.details = { emailId: emailId, password: password }
      // console.log(this.details);
      this.$.ajax._makeAjaxCall('get',`http://localhost:3000/users?emailId=${emailId}&&password=${password1}`,null,'List');
    }
    else {
      this.message = "Please enter valid Details";
      this.$.toast.open();
    }
  }

  // handling error if encounter error from backend server
  _handleError() {
    this.message = "Wrong Credentials";
    this.$.toast.open();
  }

  // getting response from server and storing user name and id in session storage
  _handleResponse(event) {
    this.respCheck = event.detail.data;
    console.log(this.respCheck);
    if (this.respCheck != 0) {

      sessionStorage.setItem('customer', JSON.stringify(this.respCheck[0]));
      this.customer = JSON.parse(sessionStorage.getItem('customer'));
      console.log(this.customer);

      console.log(this.customer.userName);
      console.log(this.customer.accountNumber);
      console.log(this.customer.balance);
      console.log(this.customer.bankName);
      console.log(this.customer.minimumBalance);

      sessionStorage.setItem('userName', this.respCheck[0].userName);
      sessionStorage.setItem('accountNumber', this.respCheck[0].accountNumber);
      sessionStorage.setItem('balance', this.respCheck[0].balance);
      sessionStorage.setItem('bankName', this.respCheck[0].bankName);
      sessionStorage.setItem('minimumBalance', this.respCheck[0].minimumBalance);
      sessionStorage.setItem('userId', this.respCheck.userId);
      this.$.form.reset();
      // this.dispatchEvent(new CustomEvent('refresh-dashboard',{detail:this.respCheck[0].accountNumber,bubbles:true,composed:true}));
      this.set('route.path', './dashboard-page')
    }
    else {
      this.message = "Wrong Credentials";
      this.$.toast.open();
    }
  }
  // calling main ajax call method 
  // _makeAjax(url, method, postObj) {
  //   let ajax = this.$.ajax;
  //   ajax.method = method;
  //   ajax.url = url;
  //   ajax.body = postObj ? JSON.stringify(postObj) : undefined;
  //   ajax.generateRequest();
  // }

}

window.customElements.define('login-page', UserLogin);