import { js_beautify } from 'js-beautify/js/lib/beautify';
import { EditorView, lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { createEle, isCtrlKey } from '.';

if (document.readyState !== 'loading') {
  start();
} else {
  // add css, js src when <head> appears
  document.addEventListener('DOMContentLoaded', start);
}

let codeMirror;
let pre;

function start() {
  const { pathname } = window.location;
  pre = document.querySelector('pre');
  const head = document.head || document.body;

  if (!pre) {
    console.error('[SF] No <pre> tag found');
    return;
  }
  if (pathname.endsWith('user.js')) {
    console.log('[SF] Not apply on userscript');
  } else if ((pathname.endsWith('.js') || pathname.endsWith('.css'))) {
    createEle(head, {
      name: 'style',
      attr: {
        id: 'sfcss',
      },
      content: '.hidden{display:none}',
    });

    codeMirror = createEle(document.body, {
      name: 'div',
      attr: {
        id: 'container',
        class: 'hidden',
      },
    });

    const btnFormat = createEle(null, {
      name: 'button',
      content: 'Execute',
      class: 'sfbutton-format',
    });
    document.body.insertBefore(btnFormat, pre);
    addMirrow(js_beautify(pre.textContent));
    btnFormat.addEventListener('click', () => {
      toggleMirror();
    });

    document.addEventListener('keydown', (e) => {
      if (isCtrlKey(e) && e.key === 'Enter') {
        btnFormat.click();
      }
    });
  }
}

function addMirrow(doc) {
  window.editor = new EditorView(
    {
      doc,
      extensions: [
        syntaxHighlighting(defaultHighlightStyle),
        lineNumbers(),
        javascript(),
      ],
      parent: codeMirror,
    },
  );
}

function toggleMirror() {
  if (codeMirror.classList.contains('hidden')) {
    codeMirror.classList.remove('hidden');
    pre.classList.add('hidden');
  } else {
    codeMirror.classList.add('hidden');
    pre.classList.remove('hidden');
  }
}
