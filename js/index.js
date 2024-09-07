async function JslibraryInstall(url) {
document.getElementById('addLibrary').addEventListener('click', function() {
            // jQueryライブラリを動的に追加
            var script = document.createElement('script');
            script.src = url;
            script.onload = function() {
            };
            document.head.appendChild(script);
        });
}
