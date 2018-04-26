// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import { Tastatur } from '../lib/index';

describe('Tastatur', () => {
  let tastatur!: Tastatur;

  beforeEach(() => {
    tastatur = new Tastatur();
  });

  describe('when installed', () => {
    let dom!: JSDOM;
    let document!: Document;

    function testKey(binding: string, code: string): void {
      try {
        let reactedToKey = false;

        tastatur.bind(binding, () => {
          reactedToKey = true;
        });
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code
          })
        );

        expect(reactedToKey, `Failed to handle ${binding} -> ${code}`).to.be.true;
      } finally {
        tastatur.unbind(binding);
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keyup', {
            code
          })
        );
      }
    }

    beforeEach(() => {
      dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
      document = dom.window.document;
      tastatur.install(document);
    });

    afterEach(() => {
      tastatur.uninstall(document);
    });

    it('should respond to bound keys', () => {
      testKey('a', 'KeyA');
    });

    it('should not respond to unbound keys', () => {
      let reactedToKey = 0;

      tastatur.bind('a', () => {
        reactedToKey++;
      });
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
          code: 'KeyA'
        })
      );
      tastatur.unbind('a');
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
          code: 'KeyA'
        })
      );

      expect(reactedToKey).to.be.eq(1);
    });

    it('should ignore unbound keys', () => {
      let reactedToKey = false;

      tastatur.bind('a', () => {
        reactedToKey = true;
      });
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
          code: 'KeyB'
        })
      );

      expect(reactedToKey).to.be.false;
    });

    it('should respond to special keys', () => {
      testKey('CtrlLeft', 'ControlLeft');
      testKey('CtrlRight', 'ControlRight');
      testKey('Ctrl', 'ControlRight');
      testKey('Ctrl', 'ControlLeft');

      testKey('ShiftLeft', 'ShiftLeft');
      testKey('ShiftRight', 'ShiftRight');
      testKey('Shift', 'ShiftRight');
      testKey('Shift', 'ShiftLeft');

      testKey('Alt', 'AltLeft');
      testKey('AltGr', 'AltRight');
    });

    describe('and bind combinations', () => {
      it('should respond to it', () => {
        let reactedToKey = false;

        tastatur.bind('a+b', () => {
          reactedToKey = true;
        });
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
        );

        expect(reactedToKey).to.be.true;
      });

      it('should respond matching one', () => {
        let reactedToB = false;
        let reactedToAB = false;

        tastatur.bind('b', () => {
          reactedToB = true;
        });
        tastatur.bind('a+b', () => {
          reactedToAB = true;
        });
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
        );

        expect(reactedToB).to.be.false;
        expect(reactedToAB).to.be.true;
      });

      it('should handle keyup state', () => {
        let reactedToKey = false;

        tastatur.bind('a+b', () => {
          reactedToKey = true;
        });
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keyup', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
        );

        expect(reactedToKey).to.be.false;
      });
    });
  });

  describe('when uninstalled', () => {
    it('should not respond to bound keys', () => {
      let reactedToKey = false;
      tastatur.bind('a', e => {
        console.log(e);
        reactedToKey = true;
      });

      expect(reactedToKey).to.be.false;
    });
  });
});
