// whnscript.js
const whnscript = (() => {
  // 事前に用意された関数たちをここに定義
  const builtInFunctions = {
//ここより下定義


    const variables = {};
    gv: function(name) {
      if (variables[name] !== undefined) {
        return variables[name];
      } else {
        return null;
      }
    },
  addNumbers: function(a, b) {
      console.log(a + b);
    },
    var: function(name, value) {
      variables[name] = value;
    },
    through: function() {},
    isTrue: function(condition) {
      return condition.toLowerCase() === 'true';
    },
    playSound: function(soundUrl) {
        const audio = new Audio(soundUrl);
        return audio.play().then(() => {
            return null; // 成功時はnullを返す
        }).catch(error => {
        return error.message; // エラー時はエラーメッセージを返す
        });
    }
    playSoundraw: function(soundData) {
    const blob = new Blob([soundData], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);  
    const audio = new Audio(url);
    return audio.play().then(() => {
        URL.revokeObjectURL(url); 
        return null;
    }).catch(error => {
        return error.message;
    });
}


//ここより上定義
};






// CoreのrunWhnScript関数
const runWhnScript = (code) => {
  const functionPattern = /(\w+)\[(.*?)\]/g;
  const ifPattern = /if\[(.*?)\]t\{(.*?)\}f\{(.*?)\}/g;

  let match;

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

  // 通常の関数呼び出しの処理
  while ((match = functionPattern.exec(code)) !== null) {
    const functionName = match[1];
    const params = match[2].split(',').map(param => param.trim());

    // ビルトイン関数を実行
    if (builtInFunctions[functionName]) {
      builtInFunctions[functionName](...params);
    } else {
      console.error(`関数 '${functionName}' は定義されていません。`);
    }
  }
};

// HTML内のwhnscriptタグを探索し、内容を実行
const executeWhnScripts = () => {
  const scripts = document.querySelectorAll('whnscript');
  scripts.forEach(script => {
    runWhnScript(script.textContent);
  });
};

// ページロード時にwhnscriptを自動実行
window.addEventListener('DOMContentLoaded', executeWhnScripts);

// ライブラリの公開API
return {
  runWhnScript
};
})();
