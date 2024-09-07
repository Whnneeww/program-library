async function handleFile(file, format) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result; // ファイル内容
        switch (format) {
            case 'dataurl':
                const dataURL = URL.createObjectURL(file);
                console.log("データURL:", dataURL);
                break;
            case 'text':
                console.log("テキストデータ:", content);
                break;
            case 'binary':
                const binaryArray = new Uint8Array(content);
                console.log("バイナリデータ:", binaryArray);
                break;
            case 'hex':
                const hexString = [...new Uint8Array(content)].map(byte => byte.toString(16).padStart(2, '0')).join(' ');
                console.log("16進数バイナリー:", hexString);
                break;
            case 'binaryString':
                const binaryString = [...new Uint8Array(content)].map(byte => byte.toString(2).padStart(8, '0')).join(' ');
                console.log("2進数バイナリー:", binaryString);
                break;
            default:
                console.log("不明な形式が指定されました:", format);
                break;
        }
    };

    reader.onerror = function() {
        console.error('ファイルの読み込みに失敗しました');
    };

    // 指定された形式に基づいてファイルを読み込む
    switch (format) {
        case 'dataurl':
            reader.readAsDataURL(file);
            break;
        case 'text':
            reader.readAsText(file);
            break;
        case 'binary':
        case 'hex':
        case 'binaryString':
            reader.readAsArrayBuffer(file); // バイナリデータとして読み込む
            break;
        default:
            console.log("不明な形式が指定されました。デフォルトでテキストを読み込みます。");
            reader.readAsText(file);
            break;
    }
}

// ファイル選択ダイアログを開く
async function openFileDialog(extension = '.txt', format = 'text') {
    const options = {
        types: [
            {
                description: 'ファイル',
                accept: { 'text/plain': [extension], 'application/octet-stream': [extension] },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };

    try {
        const [fileHandle] = await window.showOpenFilePicker(options);
        const file = await fileHandle.getFile();
        await handleFile(file, format);
    } catch (error) {
        console.error('ファイル選択中にエラーが発生しました:', error);
    }
}
