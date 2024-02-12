"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayOfStrings = void 0;
const isString_1 = require("./isString");
const isArrayOfStrings = (value) => Array.isArray(value) && !value.find(i => !(0, isString_1.isString)(i));
exports.isArrayOfStrings = isArrayOfStrings;
