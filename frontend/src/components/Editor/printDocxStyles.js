import {AlignmentType} from "docx";

export const styles = {
    title: {
        id: "myTitleStyle",
        name: "My Title Style",
        basedOn: "title",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Bold",
            size: 48,
            bold: true,
            color: "000000",
        },
        paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }
    },
    subTitle: {
        id: "Heading1",
        name: "My Sub Title Style",
        basedOn: "Heading1",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Bold",
            size: 36,
            bold: true,
            color: "000000",
        },
        paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
                spacing: { after: 200 },
            },
        },
    },
    section: {
        id: "Heading2",
        name: "My section Style",
        basedOn: "Heading2",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Bold",
            size: 28,
            bold: true,
            color: "000000",
        },
        paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
                after: 480,  // 문단 뒤쪽에 4줄(120 * 4 = 480)
            },
        },
    },
    heading1: {
        id: "myHeading1Style",
        name: "My Heading 1 Style",
        basedOn: "normal",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Regular",
            size: 32,
            bold: true,
        },
    },
    heading2: {
        id: "myHeading2Style",
        name: "My Heading 2 Style",
        basedOn: "normal",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Regular",
            size: 28,
            bold: true,
        },
    },
    heading3: {
        id: "myHeading3Style",
        name: "My Heading 3 Style",
        basedOn: "normal",
        next: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Regular",
            size: 24,
            bold: true,
        },
    },
    normal: {
        id: "myNormalStyle",
        name: "My Normal Style",
        basedOn: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Regular",
            size: 22,
            bold: false
        },
    },
    tableOfContent: {
        id: "tableOfContent",
        name: "My Table Of Content Style",
        basedOn: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Bold",
            size: 36,
        },
        paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        },
    },
    quote: {
        id: "myQuoteStyle",
        name: "My quote Style",
        basedOn: "Normal",
        quickFormat: true,
        run: {
            font: "나눔고딕 Regular",
            size: 22,
        },
        paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        },
    },

};