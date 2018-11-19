export class Component {
  constructor (kernel, variables) {
    this.kernel = kernel;
    this.variables = variables;
    this.element = null;
  }

  render () {
    return this.template();
  }

  template () {
    return '';
  }

  dehydrate (element) {

  }
}