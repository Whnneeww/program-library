(function() {
    const whnspir = function(element) {
        if (!element) {
            console.error("無効な要素です。");
            return;
        }

        let isVisible = false;

        // 初期スタイルを追加
        const style = document.createElement('style');
        style.innerHTML = `
            whnspir {
                color: transparent; /* 最初は透明 */
                background-color: #000112; /* 背景は黒 */
                cursor: pointer;
                transition: color 0.3s ease;
            }
            whnspir.show {
            color: black;
            background-color: #fafafa;
            }
        `;
        document.head.appendChild(style);

        // トグル関数
        const toggleVisibility = function() {
            isVisible = !isVisible;
            element.classList.toggle('show', isVisible);
        };

        // イベントリスナーを設定
        element.addEventListener('click', toggleVisibility);
    };

    // 自動的にWhnspirを初期化
    document.addEventListener('DOMContentLoaded', () => {
        const whnspirElements = document.querySelectorAll('whnspir');
        whnspirElements.forEach(whnspirElement => new whnspir(whnspirElement));
    });

    // グローバルオブジェクトに登録
    window.Whnspir = whnspir;
})();
