import { Module } from '../client/Module.js';
import { hyperx } from '../vendor/hyperx.js'

export class Template extends Module {
  constructor () {
    super(...arguments);
    this.hx = hyperx(this.h);
  }

  h (type, props, ...children) {
    return { type, props: props || {}, children };
  }

  createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    node.children
      .map(this.createElement)
      .forEach($el.appendChild.bind($el));
    return $el;
  }

  updateElement($parent, newNode, oldNode, index = 0) {
    let changed = (node1, node2) => {
      return typeof node1 !== typeof node2 ||
        typeof node1 === 'string' && node1 !== node2 ||
        node1.type !== node2.type
    };

    if (!oldNode) {
      $parent.appendChild(
        this.createElement(newNode)
      );
    } else if (!newNode) {
      $parent.removeChild(
        $parent.childNodes[index]
      );
    } else if (changed(newNode, oldNode)) {
      $parent.replaceChild(
        this.createElement(newNode),
        $parent.childNodes[index]
      );
    } else if (newNode.type) {
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        this.updateElement(
          $parent.childNodes[index],
          newNode.children[i],
          oldNode.children[i],
          i
        );
      }
    }
  }

  toHtml (tree) {

  }
}



// ---------------------------------------------------------------------
//
// const a = hx`<ul>
//   <li>item 1</li>
// <li>item 2</li>
// </ul>`;
//
// const b = `<ul>
//   <li>item 1</li>
// <li>hello!</li>
// </ul>`;
//
// const $root = document.getElementById('root');
// const $reload = document.getElementById('reload');
//
// updateElement($root, a);
// $reload.addEventListener('click', () => {
//   updateElement($root, b, a);
// });
//
//
//