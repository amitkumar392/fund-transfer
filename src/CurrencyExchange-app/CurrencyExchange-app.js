import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js'
import '@polymer/app-route/app-location.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@polymer/iron-selector/iron-selector.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs-icons.js'
import '@polymer/paper-button/paper-button.js'
import { setRootPath } from '@polymer/polymer/lib/utils/settings.js'
/**
* @customElement
* @polymer
*/
setRootPath(MyAppGlobals.rootPath)
class CurrencyExchangeApp extends PolymerElement {
  static get template() {
    return html`
<style>
  :host {
    display: block;
  }
  paper-tabs {
    background-color: lightgreen;
  }
  a {
    margin-top: 20px;
    font-size: 20px;
    color: black;
    ;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  .custom {
    background-color: lightgreen;
  }
</style>
<div>
  <app-location route={{route}}></app-location>
  <app-route data="{{routeData}}" route="{{route}}" pattern="[[rootPath]]:page"></app-route>
  <iron-pages selected={{page}} attr-for-selected="name" role="main">
    <dashboard-page id="dashboard" name="dashboard-page"></dashboard-page>
    <login-page name="login-page"></login-page>
    <fund-transfer name="fund-transfer"></fund-transfer>
    <beneficiary-page name="beneficiary-page"></beneficiary-page>
  </iron-pages>

  `;
  }
  static get properties() {
    return {

      page: {
        type: String,
        observer: '_changePage'
      },
      routeData: {
        type: Object
      },
      oppGen: String,
    };
  }
ready()
{
  super.ready();
  // this.addEventListener('refresh-dashboard',(e)=>this.refreshDashboard(e));
}
  // complex observer
  static get observers() {
    return ['_pageChanged(routeData.page)']
  }
  // refreshDashboard(event)
  // {
  //   let accountNumber=event.detail;
  // this.$.dashboard._handleRefresh(accountNumber);
  // }
  // method of complex observer
  _pageChanged(page) {
    this.page = page || 'login-page';
  }


  // method of simple observer to change the page according the page name , calling the required page
  _changePage(page) {
    switch (page) {
      case ('dashboard-page'):
        {
          import('./dashboard-page.js');
          break;
        }
      case ('login-page'):
        {
          import('./login-page.js');
          break;
        }
      case ('fund-transfer'):
        {
          import('./fund-transfer.js');
          break;
        }

      case ('beneficiary-page'):
        {
          import('./beneficiary-page.js');
          break;
        }
    }
  }
}

window.customElements.define('currency-exchange', CurrencyExchangeApp);