"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const routes_1 = require("./routes");
const nodePath = __importStar(require("node:path"));
const router = (path, method, data) => {
    let action = undefined;
    let signature = [];
    let params = nodePath.parse(path).base;
    for (const route in routes_1.ROUTES) {
        const regex = new RegExp(route);
        if (regex.test(path || '')) {
            const routeObject = routes_1.ROUTES[route];
            if (method && routeObject.hasOwnProperty(method)) {
                let existingRoute = routeObject[method];
                existingRoute && (action = existingRoute['action'], signature = existingRoute['signature']);
                break;
            }
        }
    }
    if (!action) {
        return {
            status: 404,
            header: 'Content-Type: application/json',
            body: JSON.stringify({ error: 'Not Found' }),
        };
    }
    else {
        console.log(action);
        return action(...signature.map(i => {
            if (i === 'id')
                return params;
            if (i === 'data')
                return data;
        }));
    }
};
exports.router = router;
