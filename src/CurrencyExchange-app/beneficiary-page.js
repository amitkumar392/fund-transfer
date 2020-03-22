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
 * @description:this will add beneficairy details
* @customElement
* @polymer
*/
class BeneficiaryPage extends PolymerElement {
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
  <paper-input label="Beneficiary Name" type="text" id="beneficiaryName" name="beneficiaryName" required error-message="Please Enter Beneficiary Name"></paper-input>
  <paper-input label="Beneficiary Account Number" type="text" id="beneficiaryAccountNumber" name="beneficiaryAccountNumber" required error-message="Please Enter Beneficiary account numer"></paper-input>
  <paper-input label="IFSC Code" type="text" id="ifscCode" name="ifscCode" required error-message="Please Enter IFSC code"></paper-input>
 
  
  
<paper-button raised class="custom indigo" id = "beneficiary" on-click="_handleBeneficiary">Add Beneficiary</paper-button>
</form>
</iron-form>
<iron-ajax id="ajax" handle-as="json" on-response="_handleResponse" 
content-type="application/json" on-error="_handleError"></iron-ajax>

<paper-toast text={{message}}  class="fit-bottom" id="toast"></paper-toast>


`;
  }
  static get properties() {
    return {
      currencies: Array,
      action: {
        type: String,
        value: 'List'
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
      beneficiary: {
        type: Object
      }
    };
  }
  //if session storage is clear then it will be redirected to login page
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
  }

  // to move to dashboard page
  _handleDashboard() {
    this.set('route.path', './dashboard-page')
  }

  _handleBeneficiary() {
    let beneficiaryName = this.$.beneficiaryName.value;
    let beneficiaryAccountNumber = this.$.beneficiaryAccountNumber.value;
    let ifscCode = this.$.ifscCode.value;
    this.beneficiary = {
      beneficiaryName: beneficiaryName, beneficiaryAccountNumber: beneficiaryAccountNumber
      , ifscCode: ifscCode
    };
    console.log(this.beneficiary);
    this._makeAjax('http://localhost:3000/addBeneficiary', 'post', this.beneficiary);
    this.message = 'Beneficiary successfully added';
    this.$.toast.open();
  }

  // getting response from server and storing user name and id in session storage
  _handleResponse(event) {
    console.log(event.detail.response);
  }

  // If transaction api throws an error
  _handleError() {
    this.$.fail.open();
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
window.customElements.define('beneficiary-page', BeneficiaryPage);