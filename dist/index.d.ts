export declare class DocuPorter {
    private filePath;
    private muted;
    constructor(fileName: string);
    reset(): void;
    private append;
    appendHeader(header: string, order?: 1 | 2 | 3 | 4 | 5): void;
    appendText(...text: string[]): void;
    appendCode(code: string, lang?: string): void;
    appendJson(json: any): void;
    appendJs(js: string): void;
    appendTs(ts: any): void;
    text: (...text: string[]) => void;
    json: (json: any) => void;
    js: (js: string) => void;
    ts: (ts: any) => void;
    header: (header: string, order?: 1 | 2 | 3 | 4 | 5) => void;
    h1: (header: string) => void;
    h2: (header: string) => void;
    h3: (header: string) => void;
    h4: (header: string) => void;
    h5: (header: string) => void;
    mute(value: boolean): void;
    log(...args: any[]): void;
    get quiet(): boolean;
    get loud(): boolean;
    stopMute(): void;
}
