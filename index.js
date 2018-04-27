"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Maps key binding names to keycodes.
 */
// tslint:disable:object-literal-key-quotes
exports.KeyMap = {
    'ctrlleft': 'ControlLeft',
    'ctrlright': 'ControlRight',
    'shiftleft': 'ShiftLeft',
    'shiftright': 'ShiftRight',
    'alt': 'AltLeft',
    'altgr': 'AltRight',
    'esc': 'Escape',
    'capslock': 'CapsLock',
    'tab': 'Tab',
    'backquote': 'Backquote',
    'minus': 'Minus',
    'equal': 'Equal',
    'bracketleft': 'BracketLeft',
    'bracketrigth': 'BracketRigth',
    'semicolon': 'Semicolon',
    'quote': 'Quote',
    'backslash': 'Backslash',
    'comma': 'Comma',
    'period': 'Period',
    'slash': 'Slash',
    'intlbackslash': 'IntlBackslash',
    'scrolllock': 'ScrollLock',
    'pause': 'Pause',
    'insert': 'Insert',
    'home': 'Home',
    'pageup': 'PageUp',
    'delete': 'Delete',
    'end': 'End',
    'pagedown': 'PageDown',
    'arrowleft': 'ArrowLeft',
    'arrowup': 'ArrowUp',
    'arrowright': 'ArrowRight',
    'arrowdown': 'ArrowDown',
    'browserback': 'BrowserBack',
    'browserforward': 'BrowserForward',
    'browserfavorites': 'BrowserFavorites',
    'numlock': 'NumLock',
    'numpaddivide': 'NumpadDivide',
    'numpadmultiply': 'NumpadMultiply',
    'numpadsubtract': 'NumpadSubtract',
    'numpadadd': 'NumpadAdd',
    'numpadenter': 'NumpadEnter',
    'numpaddecimal': 'NumpadDecimal',
    'f1': 'F1',
    'f2': 'F2',
    'f3': 'F3',
    'f4': 'F4',
    'f5': 'F5',
    'f6': 'F6',
    'f7': 'F7',
    'f8': 'F8',
    'f9': 'F9',
    'f10': 'F10',
    'f11': 'F11',
    'f12': 'F12',
    'f13': 'F13',
    'f14': 'F14',
    'f15': 'F15',
    'f16': 'F16',
    'f17': 'F17',
    'f18': 'F18',
    'f19': 'F19',
    'f20': 'F20',
    'digit1': 'Digit1',
    'digit2': 'Digit2',
    'digit3': 'Digit3',
    'digit4': 'Digit4',
    'digit5': 'Digit5',
    'digit6': 'Digit6',
    'digit7': 'Digit7',
    'digit8': 'Digit8',
    'digit9': 'Digit9',
    'digit0': 'Digit0',
    'numpad1': 'Numpad1',
    'numpad2': 'Numpad2',
    'numpad3': 'Numpad3',
    'numpad4': 'Numpad4',
    'numpad5': 'Numpad5',
    'numpad6': 'Numpad6',
    'numpad7': 'Numpad7',
    'numpad8': 'Numpad8',
    'numpad9': 'Numpad9',
    'numpad0': 'Numpad0',
    'a': 'KeyA',
    'b': 'KeyB',
    'c': 'KeyC',
    'd': 'KeyD',
    'e': 'KeyE',
    'f': 'KeyF',
    'g': 'KeyG',
    'h': 'KeyH',
    'i': 'KeyI',
    'j': 'KeyJ',
    'k': 'KeyK',
    'l': 'KeyL',
    'm': 'KeyM',
    'n': 'KeyN',
    'o': 'KeyO',
    'p': 'KeyP',
    'q': 'KeyQ',
    'r': 'KeyR',
    's': 'KeyS',
    't': 'KeyT',
    'u': 'KeyU',
    'v': 'KeyV',
    'w': 'KeyW',
    'x': 'KeyX',
    'y': 'KeyY',
    'z': 'KeyZ'
};
var EdgeSpecialMap = {
    'control': 'ctrlleft',
    'shift': 'shiftleft',
    'alt': 'alt'
};
// tslint:enable:object-literal-key-quotes
var Tastatur = /** @class */ (function () {
    function Tastatur(keymap) {
        if (keymap === void 0) { keymap = exports.KeyMap; }
        this.registrations = [];
        this.pressed = {};
        this.keymap = keymap;
        this.handleKey = this.handleKey.bind(this);
    }
    Tastatur.prototype.install = function (el) {
        if (el === void 0) { el = document; }
        el.addEventListener('keydown', this.handleKey);
        el.addEventListener('keypress', this.handleKey);
        el.addEventListener('keyup', this.handleKey);
    };
    Tastatur.prototype.uninstall = function (el) {
        if (el === void 0) { el = document; }
        el.removeEventListener('keydown', this.handleKey);
        el.removeEventListener('keypress', this.handleKey);
        el.removeEventListener('keyup', this.handleKey);
    };
    Tastatur.prototype.bind = function (binding, fn) {
        var _this = this;
        var keys = binding.split('+').map(function (button) { return _this.mapKeyBinding(button); });
        this.registrations.push({ binding: binding, keys: keys, fn: fn });
    };
    Tastatur.prototype.unbind = function (binding) {
        var index = this.registrations
            .findIndex(function (registration) { return registration.binding === binding; });
        if (index > -1) {
            this.registrations.splice(index, 1);
        }
    };
    Tastatur.prototype.mapKeyBinding = function (key) {
        if (key.toLowerCase() in this.keymap) {
            return this.keymap[key.toLowerCase()];
        }
        switch (key.toLowerCase()) {
            case 'ctrl':
                return [this.keymap.ctrlleft, this.keymap.ctrlright];
            case 'shift':
                return [this.keymap.shiftleft, this.keymap.shiftright];
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                return ["Digit" + key, "Numpad" + key];
        }
        throw new Error("Unsupported key '" + key + "'");
    };
    Tastatur.prototype.mapKeyCode = function (e) {
        if (e.code) {
            return e.code;
        }
        // ie/edge quirks
        if (e.key.toLowerCase() in EdgeSpecialMap) {
            return EdgeSpecialMap[e.key.toLowerCase()];
        }
        var key = String.fromCharCode(e.keyCode).toLowerCase();
        if (key in this.keymap) {
            return this.keymap[key];
        }
        switch (key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                return "Digit" + e.key;
        }
        throw new Error("Unsupported key '" + e.key + "'");
    };
    Tastatur.prototype.handleKey = function (e) {
        var _this = this;
        if (e.type === 'keydown') {
            this.pressed[this.mapKeyCode(e)] = true;
        }
        else if (e.type === 'keyup') {
            this.pressed[this.mapKeyCode(e)] = false;
        }
        console.log(this.pressed);
        var registration = this.registrations.find(function (registration) {
            var required = _this.areRequiredKeysPressed(registration);
            var keys = _this.requiredKeys(registration);
            var pressed = Object.keys(_this.pressed).filter(function (key) { return _this.pressed[key]; });
            var others = pressed.every(function (key) { return keys.indexOf(key) > -1; });
            return required && others;
        });
        if (registration) {
            registration.fn(e);
        }
    };
    Tastatur.prototype.requiredKeys = function (registration) {
        return registration.keys.reduce(function (keys, key) {
            if (Array.isArray(key)) {
                return keys.concat(key);
            }
            else {
                return keys.concat([key]);
            }
        }, []);
    };
    Tastatur.prototype.areRequiredKeysPressed = function (registration) {
        var _this = this;
        return registration.keys.reduce(function (result, key) {
            if (Array.isArray(key)) {
                return result && key.some(function (key) { return _this.pressed[key]; });
            }
            else {
                return result && _this.pressed[key];
            }
        }, true);
    };
    return Tastatur;
}());
exports.Tastatur = Tastatur;
//# sourceMappingURL=index.js.map