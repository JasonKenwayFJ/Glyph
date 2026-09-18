// Главная функция запуска пользовательского кода. Принимает:
// - code: текст скрипта, который ввёл юзер в редакторе
// - onRegisterButton: функция, которую хост (CodeEditorPage) передаёт сюда,
//   чтобы узнать "юзер зарегистрировал кнопку" и положить её в стор.
// Зачем: это единственная точка входа для запуска чужого, недоверенного кода —
// весь остальной файл существует, чтобы сделать это безопасно.
export function runPluginCode(code: string, onRegisterButton: (btn: any) => void) {


    const iframe = document.createElement('iframe');

    // Это и есть песочница. sandbox.add('allow-scripts') разрешает iframe исполнять
    // JS — но НЕ добавляет allow-same-origin, а значит iframe не может достать
    // localStorage, cookies или DOM родительского окна. Именно это свойство не даёт
    // юзерскому коду сломать или прочитать что-то из основного приложения.

    iframe.sandbox.add('allow-scripts');

    // Iframe не должен быть виден на экране — он существует только для исполнения
    // кода, а не для показа UI юзеру.
    iframe.style.display = 'none';

    // Iframe должен быть реально вставлен в DOM, иначе браузер вообще не станет
    // его грузить и исполнять — просто создать объект в памяти недостаточно.
    document.body.appendChild(iframe);

    // Функция возвращает Promise, потому что исполнение кода в iframe — процесс
    // асинхронный (мы не знаем заранее, сколько времени займёт код и когда он
    // пришлёт сообщение "готово"). { ok, error? } — по этой структуре вызывающий
    // код (handleApply) поймёт, прошло ли всё гладко.
    return new Promise<{ ok: boolean; error?: string }>((resolve) => {

        // Слушаем ВСЕ сообщения postMessage в этом окне — от любого источника,
        // не только от нашего iframe. Поэтому первая проверка внутри — фильтр.
        window.addEventListener('message', function handler(e) {
            console.log('got message:', e.data, 'from correct source:', e.source === iframe.contentWindow);

            // Критически важная строка: проверяем, что сообщение пришло именно
            // от НАШЕГО iframe (e.source — это window, откуда отправлено
            // сообщение), а не от какого-то другого iframe/окна на странице.
            // Без этой проверки чужой код на странице (или другой открытый
            // плагин) мог бы притвориться нашим iframe и слать поддельные команды.
            if (e.source !== iframe.contentWindow) return;

            // Если пришло сообщение "хочу кнопку" — вызываем колбэк, который
            // передал хост, и отдаём ему данные кнопки.
            if (e.data.type === 'register-button') onRegisterButton(e.data.payload);

            // Сообщение "код закончил исполняться" (успешно или с ошибкой).
            if (e.data.type === 'done') {

                // Отписываемся от слушателя — иначе он продолжит висеть в памяти
                window.removeEventListener('message', handler);

                // Удаляем iframe из DOM — он больше не нужен, разовое исполнение
                // завершено. Изменить: если хочешь поддержать action-кнопки
                // (с onClick внутри iframe, как обсуждали раньше) — iframe нужно
                // НЕ удалять здесь, а держать живым, пока кнопки скрипта существуют.
                document.body.removeChild(iframe);

                resolve(e.data.error ? { ok: false, error: e.data.error } : { ok: true });
            }
        });


        iframe.srcdoc = `
            <script>

                window.Glyph = {
                    registerButton: (btn) => {
                        parent.postMessage({ type: 'register-button', payload: btn }, '*');
                        return btn;
                        },
                    unregisterButton: (btn) => parent.postMessage({ type: 'unregister-button', payload: btn }, '*'),
                    createWindow: (options) => parent.postMessage({ type: 'register-window', payload: options }, '*')
                };

  
                try {
                    ${code}
                    parent.postMessage({ type: 'done' }, '*');
                } catch (e) {

                    parent.postMessage({ type: 'done', error: e.message }, '*');
                }
            </script>
        `;
    });
}