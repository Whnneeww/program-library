const whnscript = (() => {
    const builtInFunctions = {
        variables: {},
        gv: function (name) {
            return this.variables[name] !== undefined ? this.variables[name] : null;
        },
        addNumbers: function (a, b) {
            return parseFloat(a) + parseFloat(b);
        },
        var: function (name, value) {
            this.variables[name] = value;
        },
        isTrue: function (condition) {
            return condition.toLowerCase() === 'true';
        },
        alert: function (alerttxt) {
            alert(alerttxt);
        },
        playSound: function (soundUrl) {
            const audio = new Audio(soundUrl);
            return audio.play().then(() => null).catch(error => error.message);
        },
        playSoundraw: function (soundData) {
            const blob = new Blob([soundData], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            return audio.play().then(() => {
                URL.revokeObjectURL(url);
                return null;
            }).catch(error => error.message);
        }
    };

    const processParams = (params) => {
        return params.map(param => {
            if (param.startsWith('"') && param.endsWith('"')) {
                return param.slice(1, -1);
            } else if (builtInFunctions[param]) {
                return builtInFunctions[param]();
            } else {
                return builtInFunctions.gv(param) !== undefined ? builtInFunctions.gv(param) : null;
            }
        });
    };

    const runWhnScript = (code) => {
        const functionPattern = /(\w+)\[(.*?)\]/g;
        const ifPattern = /if\[(.*?)\]t\{(.*?)\}f\{(.*?)\}/g;
        const varsPattern = /vars\["(.*?)"\]\{(.*?)\}/g;

        // vars文の処理
        let match;
        while ((match = varsPattern.exec(code)) !== null) {
            const varName = match[1].trim();
            const codeToExecute = match[2].trim();

            // コードを実行し、変数に代入
            const result = runWhnScript(codeToExecute);
            builtInFunctions.var(varName, result);
        }

        // if文の処理
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

        // 関数呼び出しの処理
        while ((match = functionPattern.exec(code)) !== null) {
            const functionName = match[1];
            const params = match[2].split(',').map(param => param.trim());
            const processedParams = processParams(params);

            if (builtInFunctions[functionName]) {
                return builtInFunctions[functionName](...processedParams); // 結果を返す
            } else {
                console.error(`関数 '${functionName}' は定義されていません。`);
            }
        }
        return null; // デフォルトでnullを返す
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
                    const externalScriptResponse = await fetch(src);
                    const code = await externalScriptResponse.text();
                    runWhnScript(code);
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                runWhnScript(script.textContent);
            }
        }
    };

    window.addEventListener('DOMContentLoaded', executeWhnScripts);

    return {
        runWhnScript
    };
})();
