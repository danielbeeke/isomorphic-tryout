export class About {
  constructor (kernel) {
    this.kernel = kernel;
  }

  execute () {
    return this.kernel.view('About');
  }
}