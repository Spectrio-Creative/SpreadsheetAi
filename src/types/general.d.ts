interface Box { height: number; width: number; ratio?: number, top?: number; left?: number }

interface BasicObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface SpreadsheetRow extends BasicObject {
    "Layer Template": string;
    "Template": string;
    "Layer Name": string;
}

type dimension = 'width' | 'height';