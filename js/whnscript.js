const whnscript = (() => {
    const builtInFunctions = {
//下定義
        variables: {},
        gv: function(name) {
            return this.variables[name] !== undefined ? this.variables[name] : null; 
        },
        addNumbers: function(a, b) {
            return parseFloat(a) + parseFloat(b);
        },
        var: function(name, value) {
            this.variables[name] = value;
        },
        isTrue: function(condition) {
            return condition.toLowerCase() === 'true';
        },
        playSound: function(soundUrl) {
            const audio = new Audio(soundUrl);
            return audio.play().then(() => null).catch(error => error.message);
        },
        playSoundraw: function(soundData) {
            const blob = new Blob([soundData], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            return audio.play().then(() => {
                URL.revokeObjectURL(url);
                return null;
            }).catch(error => error.message);
        }
//上定義
    };

    const runWhnScript = (code) => {
        const functionPattern = /(\w+)\[(.*?)\]/g;
        const ifPattern = /if\[(.*?)\]t\{(.*?)\}f\{(.*?)\}/g;

        let match;

        while ((match = ifPattern.exec(code)) !== null) {
            const condition = match[1].trim();
            const trueCode = match[2].trim();
            const falseCode = match[3].trim();

            const isTrue = builtInFunctions.isTrue(condition);
            if (isTrue) {
                runWhnScript(trueCode);
            } else {
                runWhnScript(falseCode);
            }
        }

        while ((match = functionPattern.exec(code)) !== null) {
            const functionName = match[1];
            const params = match[2].split(',').map(param => param.trim());
            if (builtInFunctions[functionName]) {
                builtInFunctions[functionName](...params);
            } else {
                console.error(`関数 '${functionName}' は定義されていません。`);
            }
        }
    };

    const loadExternalScript = (src) => {
        return new Promise((resolve, reject) => {
            const scriptElement = document.createElement('script');
            scriptElement.src = src;
            scriptElement.onload = () => resolve();
            scriptElement.onerror = () => reject(new Error(`スクリプトの読み込みに失敗しました: ${src}`));
            document.head.appendChild(scriptElement);
        });
    };

    const executeWhnScripts = async () => {
        const scripts = document.querySelectorAll('whnscript');
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (src) {
                try {
                    await loadExternalScript(src);
                    // スクリプトが読み込まれたら、次に内容を実行
                    const externalScriptResponse = await fetch(src); // スクリプトをフェッチ
                    const code = await externalScriptResponse.text(); // スクリプトの内容を取得
                    runWhnScript(code); // その内容を実行
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                runWhnScript(script.textContent); // srcが指定されていない場合
            }
        }
    };

    window.addEventListener('DOMContentLoaded', executeWhnScripts);

    return {
        runWhnScript
    };
})();
