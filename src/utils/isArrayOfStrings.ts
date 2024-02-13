import { isString } from "./isString";

export const isArrayOfStrings = (value: any) => Array.isArray(value) && !value.find(i => !isString(i))