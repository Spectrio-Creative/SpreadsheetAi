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

type DimensionType = 'width' | 'height';

type SizeOption = "contain" | "cover" | "original";

type HorizontalAlignment = "left" | "center" | "right";

type VerticalAlignment = "top" | "center" | "bottom";

type Alignment = HorizontalAlignment | VerticalAlignment;

type DoubleAlignment = "left top" | "left center" | "left bottom" | "right top" | "right center" | "right bottom" | "center top" | "center center" | "center bottom";

// interface PageItemUUID extends PageItem {
//     uuid?: string;
// }

interface PageItem {
    uuid?: string;
}

interface TextRange {
    start: number;
    end: number;
}

declare const enum ElementPlacement {
    // @ts-ignore
    PLACEATBEGINNING = ElementPlacement.PLACEATBEGINNING,
    // @ts-ignore
    PLACEATEND = ElementPlacement.PLACEATEND,
    // @ts-ignore
    PLACEBEFORE = ElementPlacement.PLACEBEFORE,
    // @ts-ignore
    PLACEAFTER = ElementPlacement.PLACEAFTER,
}