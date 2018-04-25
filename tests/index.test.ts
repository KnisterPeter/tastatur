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

    beforeEach(() => {
      dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
      document = dom.window.document;
      tastatur.install(document);
    });

    afterEach(() => {
      tastatur.uninstall(document);
    });

    it('should respond to bound keys', () => {
      let reactedToKey = false;

      tastatur.bind('a', () => {
        reactedToKey = true;
      });
      document.dispatchEvent(new dom.window.KeyboardEvent('keydown', {
        code: 'KeyA'
      }));

      expect(reactedToKey).to.be.true;
    });

    it('should ignore unbound keys', () => {
      let reactedToKey = false;

      tastatur.bind('a', () => {
        reactedToKey = true;
      });
      document.dispatchEvent(new dom.window.KeyboardEvent('keydown', {
        code: 'KeyB'
      }));

      expect(reactedToKey).to.be.false;
    });  });
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
