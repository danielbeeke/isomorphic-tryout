import { Component } from './Component.js';

export class Html extends Component {

  execute () {
    return new Promise(resolve => resolve(this.template()));
  }

  template () {
    return this.kernel.sharedModule('Template').then(Template => {
      return Template.hx`<html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
            <script type="module" src="App.js"></script>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
            <title>${ this.variables.title }</title>
        </head>
        
        <body>
            <div class="app" slot="content">${ this.variables.content }</div>
        </body>
      </html>`;
    });
  }
}