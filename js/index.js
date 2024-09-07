async function JslibraryInstall(url) {
document.getElementById('addLibrary').addEventListener('click', function() {
            var script = document.createElement('script');
            script.src = url;
            script.onload = function() {
            };
            document.head.appendChild(script);
        });
}
