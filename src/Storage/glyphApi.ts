export const glyphApiDeclarationSource = `
declare namespace Glyph {
    export namespace ui {
        interface ButtonOptions {
            id: string;
            type: 'nav' | 'action';
            label: string;
            icon: string;
            order: number;
            path?: string;
            onClick?: () => void;
        }

        interface PageOptions {
            path: string;
            content: string;
        }

        export function createButton(options: ButtonOptions): void;
        export function createPage(options: PageOptions): void;
    }

    export namespace plugin {
        interface InfoOptions {
            name: string;
            version: string;
            author: string;
            tags: string[];
        }

        export function setInfo(options: InfoOptions): void;
    }
}
`;