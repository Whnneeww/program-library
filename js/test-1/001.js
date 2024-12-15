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
                color: black;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            whnspir.show {
                color: transparent;
                background-color: black;
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

    // グローバルオブジェクトに登録
    window.Whnspir = whnspir;
})();

// 使用方法
document.addEventListener('DOMContentLoaded', () => {
    const whnspirElement = document.querySelector('whnspir');
    new Whnspir(whnspirElement); // 使用する際に用います
});
