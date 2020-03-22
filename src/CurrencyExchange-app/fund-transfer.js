import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';

/**
* @customElement
* @polymer
*/
class FundTransfer extends PolymerElement {
  static get template() {
    return html`
<style>
  :host {
    display: block;
    
  }
#buttons{
  position:absolute;
  top:50px;
  left:1000px;
}
  #form {
    border: 1px solid black;
    width: 500px;
    border-radius:20px;
    padding:18px;
    margin-top: 30px;
    margin-left: 400px;
    background-color:white;
  }
  h2{
    text-align: center;
  }
  paper-button {
    text-align: center;
    background-color:black;
    color:white;
  }
  h1{
      text-align:center;
      color:white;
      position:absolute;
      top:19px;
      left:300px;
  
  }
  paper-toast {
    --paper-toast-background-color: black;
    --paper-toast-color: white;
  }
a{
  text-decoration:none;
  color:white;
}
</style>
<app-location route={{route}}></app-location>
<h1>Welcome, {{customer.userName}}</h1>
<div id="buttons">
<paper-button raised class="custom indigo" on-click="_handleDashboard">Dashboard</paper-button>
<paper-button raised class="custom indigo" on-click="_handleLogout"><a name="login-page" href="[[rootPath]]login-page">Logout</a></paper-button>
</div>
<iron-form id="form">
  <form>
  <h3>From Account: {{customer.accountNumber}}</h3>
  

  <paper-dropdown-menu label="To Account" required id="toAccount">
  <paper-listbox slot="dropdown-content" selected="0">
  <template is="dom-repeat" items={{beneficiary}}>
    <paper-item>{{item.beneficiaryAccountNumber}}</paper-item>
</template>
  </paper-listbox>
</paper-dropdown-menu>


<paper-input label="Amount in INR" type="number"  id="amount" name="amount" required error-message="Please Enter Amount"></paper-input>
<paper-button raised class="custom indigo" on-click="_handleTransfer">Transfer</paper-button>
</form>
</iron-form>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" 
content-type="application/json" on-error="_handleError"></iron-ajax>
<paper-toast text={{message}} class="fit-bottom" id="toast"></paper-toast>


`;
  }
  static get properties() {
    return {
      beneficiary: Array,
      action: {
        type: String,
      },
      convertedAmount: {
        type: Object
      },
      currency: {
        type: String
      },
      data: {
        type: Array
      },
      upadatedData: {
        type: Object
      }
    };
  }

  ready() {
    super.ready();
    this.customer = JSON.parse(sessionStorage.getItem('customer'));
    if (this.customer.userName === null) {
      this.set('route.path', './login-page')
    }
  }
  // getting the values of the currencies list from the API
  connectedCallback() {
    super.connectedCallback();
    this.userName = sessionStorage.getItem('userName');
    this._makeAjax(`http://localhost:3000/addBeneficiary`, 'get', null)
    this.action = "List";
  }


  // to move to dashboard page
  _handleDashboard() {

    this.set('route.path', './dashboard-page')

  }


  _handleTransfer() {
    this.enterAmount = parseInt(this.$.amount.value);
    this.beneficiaryNumber = this.$.toAccount.value;
    const postObj = JSON.parse(sessionStorage.getItem('customer'));
    let balance = sessionStorage.getItem('balance');
    if (balance > this.enterAmount) {
      balance = balance - this.enterAmount;
      console.log(balance);
      postObj.balance = balance;
      this._makeAjax(`http://localhost:3000/users/${postObj.id}`, 'put', postObj)
      this.action = 'update'
      this.message = 'Amount Transferred successfully';
      this.$.toast.open();
    }
    else {
      this.message = 'balance is not sufficient';
      this.$.toast.open();
    }
  }
  // getting response from server and storing user name and id in session storage
  _handleResponse(event) {
    switch (this.action) {
      case 'List':
        this.beneficiary = event.detail.response;
        break;

      case 'update':
        // console.log(this.beneficiaryNumber);
        this._makeAjax(`http://localhost:3000/users?accountNumber=${this.beneficiaryNumber}`, 'get', null)
        this.action = 'transfer';

        // console.log(event.detail.response);
        break;


      case 'transfer':
        // console.log(event.detail.response[0]);
        event.detail.response[0].balance += this.enterAmount;
        this._makeAjax(`http://localhost:3000/users/${event.detail.response[0].id}`, 'put', event.detail.response[0])

        this.action = 'history';
        break;

      case 'history':
        let toAccountNumber = sessionStorage.getItem('accountNumber')
        let beneficiaryAccountNumber = this.beneficiaryNumber;
        let transferAmount = this.enterAmount;
        let transactionDate = new Date().toLocaleDateString();


        const historyData = { toAccountNumber, beneficiaryAccountNumber, transferAmount,transactionDate };
        console.log(historyData)

        this._makeAjax(`http://localhost:3000/history`, 'POST', historyData)

        break;
    }
  }


  // If transaction api throws an error
  _handleError() {
    // this.$.fail.open();
  }

  // calling main ajax call method 
  _makeAjax(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
  // handling the Logout
  _handleLogout() {
    sessionStorage.clear();
  }

}

window.customElements.define('fund-transfer', FundTransfer);