// Editor — сам компонент редактора кода от Monaco (движок VS Code).
// OnMount — тип функции, которая сработает один раз, когда редактор
// полностью инициализируется — только тогда становится доступен сам
// объект `monaco` со всеми его API для настройки.
import Editor, { OnMount } from "@monaco-editor/react";

// Текст (строка) с описанием API Glyph в формате .d.ts — просто данные,
// не выполняемый код. Нужен, чтобы Monaco знал про Glyph.registerButton
// и мог подсвечивать ошибки/давать автодополнение.
import { glyphApiDeclarationSource } from "../../../Storage/glyphApi.ts";

// Функция, которая настраивает Monaco один раз при монтировании редактора.
// Тип OnMount уже описывает, что она получает editor (сам инстанс
// редактора) и monaco (глобальный объект API всей библиотеки).
const handleEditorMount: OnMount = (editor, monaco) => {

    // Регистрируем свою цветовую тему для редактора — набор правил,
    // как красить разные части синтаксиса (комментарии, ключевые слова,
    // строки) и общий фон/цвет текста.
    monaco.editor.defineTheme("glyph", {
        base: "vs-dark",  // берём тёмную тему VS Code как основу
        inherit: true,     // наследуем остальные правила подсветки от base,
        // переопределяя только то, что указано ниже

        // rules — массив правил "какой токен = какой цвет".
        // token: "" — правило по умолчанию для всего текста, не
        // попавшего под более специфичные правила ниже.
        rules: [
            { token: "", foreground: "FFFFFF" },
            { token: "comment", foreground: "6A737D" },
            { token: "keyword", foreground: "C586C0" },
            { token: "string", foreground: "FFFFFF" }
        ],

        // colors — цвета элементов интерфейса самого редактора
        // (не подсветка синтаксиса, а фон, номера строк, курсор и т.д.)
        colors: {
            "editor.background": "#10161D",
            "editor.foreground": "#FFFFFF",
            "editorLineNumber.foreground": "#555555",
            "editorCursor.foreground": "#FFFFFF",
            "editor.selectionBackground": "#264F78"
        }
    });

    // Подключаем наш файл описания API как "виртуальную библиотеку" —
    // Monaco начинает вести себя так, будто в проекте юзера есть файл
    // glyph-api.d.ts с этим содержимым, даже хотя реального файла нет.
    // Именно отсюда берётся автодополнение "Glyph." → registerButton.
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        glyphApiDeclarationSource,
        'glyph-api.d.ts'
    );

    // Настройки "компилятора" TS-движка для обычных .js-файлов внутри
    // Monaco (реальной компиляции тут нет — noEmit: true прямо говорит
    // "ничего не генерировать", это только для анализа и подсказок).
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,   // разрешить проверку файлов, у
        // которых нет расширения .ts
        checkJs: true,   // ключевая настройка: включает реальную проверку
        // типов в JS-коде против всех известных
        // деклараций (включая наш glyph-api.d.ts)
        noEmit: true,     // не генерировать никакой скомпилированный
                          // код — только анализировать
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        // ^ какую версию JS считать "целевой" при проверке синтаксиса
        //   (например, разрешать ли синтаксис из ES2020)
    });

    // Включаем сами проверки — по умолчанию оба флага можно было бы
    // выставить в true, чтобы ВЫКЛЮЧИТЬ проверки; здесь явно false,
    // то есть "не отключать" — проверки типов и синтаксиса работают.
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,  // false = ПРОВЕРЯТЬ смысловые
        // ошибки (несуществующий метод,
        // недостающие поля объекта)
        noSyntaxValidation: false,     // false = ПРОВЕРЯТЬ синтаксические
        // ошибки (пропущенные скобки и т.д.)
    });

    // Применяем тему, которую определили в самом начале функции.
    monaco.editor.setTheme("glyph");
};

// Описание того, какие пропсы принимает наш компонент-обёртка.
interface CodeEditorProps {
    code?: string;                          // текущий текст в редакторе;
    // ? значит необязательный
    onChange?: (value: string) => void;      // функция, которую вызываем
    // при каждом изменении текста
}

// Сам компонент — тонкая обёртка вокруг библиотечного <Editor>, которая
// прокидывает нужные пропсы и подключает наши настройки через onMount.
export const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
    return (
        <Editor
            height="100%"          // редактор растягивается на всю высоту
            // родительского контейнера
            language="javascript"  // язык подсветки/анализа — обычный JS,
            // без транспиляции перед исполнением
            theme="glyph"          // наша тема, определённая в handleEditorMount
            value={code}           // текущий текст — контролируемый компонент,
            // Monaco не хранит состояние сам, а
            // всегда показывает то, что передано сюда
            onChange={(v) => onChange?.(v ?? '')}
            // ^ Monaco вызывает эту функцию при каждом изменении текста,
            //   передавая новое значение как v. v может быть undefined
            //   (Monaco иногда так делает при полностью пустом поле) —
            //   `v ?? ''` подставляет пустую строку вместо undefined.
            //   `onChange?.(...)` — вызвать onChange, только если он вообще
            //   был передан (опциональный вызов), иначе ничего не делать
            onMount={handleEditorMount}  // подключаем функцию настройки,
            // описанную выше
        />
    );
};