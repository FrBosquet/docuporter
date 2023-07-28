"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocuPorter = void 0;
const path = require("path");
const fs = require("fs");
class DocuPorter {
    constructor(fileName) {
        this.muted = false;
        this.text = this.appendText;
        this.json = this.appendJson;
        this.js = this.appendJs;
        this.ts = this.appendTs;
        this.header = this.appendHeader;
        this.h1 = (header) => this.appendHeader(header, 1);
        this.h2 = (header) => this.appendHeader(header, 2);
        this.h3 = (header) => this.appendHeader(header, 3);
        this.h4 = (header) => this.appendHeader(header, 4);
        this.h5 = (header) => this.appendHeader(header, 5);
        this.filePath = path.join(process.cwd(), fileName);
        fs.writeFileSync(this.filePath, '');
    }
    reset() {
        fs.writeFileSync(this.filePath, '');
    }
    append(text) {
        if (!this.muted) {
            fs.appendFileSync(this.filePath, `\n${text}`);
        }
    }
    appendHeader(header, order = 2) {
        this.append(`${'#'.repeat(order)} ${header}\n`);
    }
    appendText(...text) {
        this.append(`${text.join(' ')}\n`);
    }
    appendCode(code, lang = '') {
        const codeBlock = '```';
        this.append(`${codeBlock}${lang}\n${code}\n${codeBlock}\n`);
    }
    appendJson(json) {
        this.appendCode(JSON.stringify(json, null, 2), 'JSON');
    }
    appendJs(js) {
        this.appendCode(js, 'JavaScript');
    }
    appendTs(ts) {
        this.appendCode(ts, 'TypeScrypt');
    }
    mute(value) {
        if (this.muted)
            return;
        this.muted = value;
    }
    log(...args) {
        if (!this.muted) {
            console.log(...args);
        }
    }
    get quiet() {
        return this.muted;
    }
    get loud() {
        return !this.muted;
    }
    stopMute() {
        this.muted = false;
    }
}
exports.DocuPorter = DocuPorter;
