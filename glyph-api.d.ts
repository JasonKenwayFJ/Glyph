// glyph-api.d.ts
declare namespace Glyph {
    interface ButtonOptions {
        /** Уникальный идентификатор кнопки */
        id: string;
        /** Текст, отображаемый на кнопке */
        label: string;
        /** Название иконки: 'settings' | 'trash' | 'favorite' | ... */
        icon: string;
        /** Порядок отображения — меньше = выше в списке */
        order: number;
        /** Путь для навигационной кнопки */
        path?: string;
        /** Обработчик клика для кнопки-действия */
        onClick?: () => void;
    }
    interface WindowCharacteristic{
        path: string;
        content: string;
        button: ButtonOptions;
    }

    /** Добавляет кнопку в боковую панель */
    function registerButton(options: ButtonOptions): void;
    /** Убирает кнопку в боковую панель */
    function unregisterButton(options: ButtonOptions) : void;
    function createWindow(options: WindowCharacteristic) : void
}