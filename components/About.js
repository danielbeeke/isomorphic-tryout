import { Component } from './Component.js';

export class About extends Component {

  execute () {
    return new Promise(resolve => resolve(this.template()));
  }

  template () {
    return this.kernel.sharedModule('Template').then(Template => {
      return Template.hx`<div>
        <h1>About</h1>
        <a href="/home">Home</a>
      </div>`
    });
  }

  dehydrate (element) {
    this.element = element;
  }

}