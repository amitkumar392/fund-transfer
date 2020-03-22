import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';


/**
* @customElement
* @polymer
*/
class Dashboard extends PolymerElement {
  static get template() {
    return html`
<style>
  :host {
    display: block; 
  }
  table, td, th {  
    border: 1px solid rgb(0, 0, 0);
    text-align: left;
    border-style: dashed;
  }
  
  table {
    border-collapse: collapse;
    margin-top:20px;
    margin-bottom:20px;
    width: 90%;
  }
  
  th, td {
    padding: 15px;
  }
  #form {
    border: 2px solid black;
    width: 500px;
    margin-left: 400px;
  }

  form {
    margin-left: 20px;
    margin-right: 20px;
  }
  h2{
    text-align: center;
  }
  #buttons{
    position:absolute;
    top:50px;
    left:1000px;
  }
  h2{
    text-align:center;
    color:white;
    position:absolute;
    top:22px;
    left:300px;

}
  paper-button {
    text-align: center;
    background-color:black;
    color:white;
  }
  h1{
      text-align:center;
      padding-bottom:20px;
      padding-top:20px;
  }
  a{
    text-decoration:none;
    color:white;
  }
</style>

<app-location route={{route}}></app-location>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" 
content-type="application/json" on-error="_handleError"></iron-ajax>
<h2>Welcome, {{data.userName}}</h2>
<div id="buttons">
<paper-button raised class="custom indigo" on-click="_handleTransfer">Transfer</paper-button>
<paper-button raised class="custom indigo" on-click="_handleBeneficiary">Beneficiary</paper-button>
<paper-button raised class="custom indigo" on-click="_handleLogout"><a name="login-page" href="[[rootPath]]login-page">Logout</a></paper-button>
</div>
<h3>Account Number: {{data.accountNumber}}</h3>
<h3>Balance: {{data.balance}} INR</h3>
<h3>Bank Name: {{data.bankName}}</h3>
<h3>Minimum Balance: {{data.minimumBalance}} INR</h3>
<h1>Transaction History</h1>
<table>
  <tr>
    <th>To Account</th>
    <th>Beneficiary Account</th>
    <th> Transfer Amount</th>
    <th> Transaction Date </th>
    </tr>
    <template is="dom-repeat" items={{userData}} as="historyData">
  <tr>
    <td>{{historyData.toAccountNumber}}</td>
    <td>{{historyData.beneficiaryAccountNumber}}</td>
    <td>{{historyData.transferAmount}}</td>
    <td>{{historyData.transactionDate}}</td>
  
   
  </tr>
  </template>
</table>


`;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'Forex Transfer'
      },
      action: {
        type: String
      },
      data: Array,
      userData: Array
    };
  }

  //if session storage is clear then it will be redirected to login page
  ready() {
    super.ready();
    this.customer = JSON.parse(sessionStorage.getItem('customer'));
    // console.log(this.customer.userName);
    if (this.customer.userName === null) {
      this.set('route.path', './login-page')
    }
  }

  //getting list of all the transasctions
  connectedCallback() {
    super.connectedCallback();
    this._makeAjax(`http://localhost:3000/users?accountNumber=${this.customer.accountNumber}`, 'get', null)
    this.action = 'Data'

  }
  //Refresh the page
  // _handleRefresh(accountNumber)
  // {
  //   console.log(accountNumber,"abhinav2")
  //   this._makeAjax(`http://localhost:3000/users?accountNumber=${accountNumber}`, 'get', null)
  //   this.action = 'Data'
  // }
  // calling main ajax call method 
  _makeAjax(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
  //routing to the fund transfer section
  _handleTransfer() {
    this.set('route.path', './fund-transfer')
  }

  _handleLogout() {

    sessionStorage.clear();
    
    this.set('route.path', './login-page');
    window.location.reload();

  }

  _handleBeneficiary() {
    this.set('route.path', './beneficiary-page');
  }
  //handling the responses from the API call
  _handleResponse(event) {
    switch (this.action) {
      case 'Data':
        this.data = event.detail.response[0];
        console.log(this.data);
        console.log(this.data.accountNumber);
        this._makeAjax(`http://localhost:3000/history?toAccountNumber=${this.customer.accountNumber}`, 'get', null)
        this.action = 'History';
        break;

      case 'History':
        this.userData = event.detail.response;
        break;
    }
  }
}

window.customElements.define('dashboard-page', Dashboard);