import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js'
/**
 * @customElement
 * @polymer
 */
class AjaxCall extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    <iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" handle-as="json" content-type="application/json"> </iron-ajax>
    `;
  }
  static get properties() {
    return {

    };
  }
  /**
   * @description:handle diferent  ajax calls  
  *@param {String} url url of specific location
  *@param {String} method method type:get/put/post/delete
  *@param {Object} postObj needs object as value for put/post and null for get/delete
  *@param {Boolean} sync true for synchronization and false for asynchronization
  **/
  _makeAjaxCall(method, url, obj, action) {
    const ajax = this.$.ajax;
    this.action = action
    ajax.body = obj ? JSON.stringify(obj) : undefined;
    ajax.method = method;
    ajax.url = url;
    ajax.generateRequest();
  }

/**
 * @description: Fired everytime when ajax call is made.It handles response of the ajax 
 * @param {*} event 
 */
  _handleResponse(event) {
    const data = event.detail.response
    console.log(data)
    console.log(this.action)
    //All the response has been handled through switch case by dispatching event details to the parent
    switch (this.action) {
      case 'ajaxResponse': this.dispatchEvent(new CustomEvent('ajax-response', { bubbles: true, composed: true, detail: { data , loading: true} }))
      break;
      case 'bookSlot': this.dispatchEvent(new CustomEvent('book-slot', { bubbles: true, composed: true, detail: { data , loading: true} }))
      break;
      case 'List': this.dispatchEvent(new CustomEvent('user-details', { bubbles: true, composed: true, detail: { data , loading: true} }))
      break;
      default:
    }
  }
  _handleError(event) {
    //All the response has been handled through switch case by dispatching event details to the parent
    const data = event.detail.request.response;
    console.log(data)
    switch (this.action) {
      case 'ajaxResponse': this.dispatchEvent(new CustomEvent('ajax-response', { bubbles: true, composed: true, detail: { data } }))
      break;
    
  }
}
}
window.customElements.define('ajax-call', AjaxCall);