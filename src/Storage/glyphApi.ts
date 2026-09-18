export const glyphApiDeclarationSource = `
declare namespace Glyph {
    interface ButtonOptions {
        /** Уникальный идентификатор кнопки */
        id: string;
        /** Тип кнопки: 'nav' — переход по ссылке, 'action' — вызов функции по клику */
        type: 'nav' | 'action';

        /** Текст, отображаемый на кнопке */
        label: string;
        /** Название иконки: 'settings' | 'trash' | 'favorite' | ... */
        icon: string;
        /** Порядок отображения — меньше значит выше в списке */
        order: number;
        /** Путь для навигационной кнопки (переход по клику) — ОБЯЗАТЕЛЕН, если type: 'nav' */
        path?: string;
        /** Обработчик клика для кнопки-действия — ОБЯЗАТЕЛЕН, если type: 'action' */
        onClick?: () => void;
    }

    interface WindowOptions {
        /** Путь до страницы. Пример: '/newWindow' */
        path: string;

        /** HTML разметка */
        content: string;
        /** Кнопка по которому открывается новая страница */
        button: ButtonOptions;
    }

    /** Добавляет кнопку в боковую панель */
    function registerButton(options: ButtonOptions): void;
    function unregisterButton(options: ButtonOptions): void;

    function createWindow(options: WindowOptions): void;
}
`;