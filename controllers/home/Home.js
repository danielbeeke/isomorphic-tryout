export class Home {
  constructor (kernel) {
    this.kernel = kernel;
  }

  execute () {
    return this.kernel.view('Home');
  }
}