import { Component } from './Component.js';

export class Home extends Component {

  execute () {
    return this.kernel.component('Html', {
      content: this.render(),
      title: 'Home'
    }).then(Html => Html.execute())
  }

  template () {
    return `<div>
      <h1>Home</h1>
      <a href="/about">About</a>
    </div>`
  }

  dehydrate (element) {
    this.element = element;
  }
}