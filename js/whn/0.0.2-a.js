// whneewwArchive.js
class WhneewwArchive {
    static create(files) {
        const header = new Uint8Array(16); // ヘッダーサイズを定義
        const magicNumber = new TextEncoder().encode('WHNEEWW_ARCHIVE');
        header.set(magicNumber, 0);
        header.set(new Uint32Array([1]).buffer, 12); // Version 1

        const fileData = [];

        files.forEach(file => {
            const fileNameBytes = new TextEncoder().encode(file.name);
            const fileSize = file.data.byteLength;

            // ファイル名の長さとファイルデータを追加
            const fileEntry = new Uint8Array(4 + fileNameBytes.length + 4 + fileSize);
            const offset = 0;

            // ファイル名の長さ
            fileEntry.set(new Uint32Array([fileNameBytes.length]), offset);
            fileEntry.set(fileNameBytes, offset + 4);
            fileEntry.set(new Uint32Array([fileSize]), offset + 4 + fileNameBytes.length);
            fileEntry.set(new Uint8Array(file.data), offset + 4 + fileNameBytes.length + 4);

            fileData.push(fileEntry);
        });

        // 最終的なBlobの作成
        return new Blob([header, ...fileData], { type: 'application/octet-stream' });
    }

    static extract(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const data = new Uint8Array(event.target.result);
                const magicNumber = new TextDecoder().decode(data.slice(0, 16));
                const version = new Uint32Array(data.slice(12, 16))[0];

                if (magicNumber !== 'WHNEEWW_ARCHIVE' || version !== 1) {
                    return reject(new Error('不正なアーカイブ形式.'));
                }

                const files = [];
                let offset = 16; // ヘッダーのサイズ

                while (offset < data.length) {
                    const fileNameLength = new Uint32Array(data.slice(offset, offset + 4))[0];
                    offset += 4;

                    const fileName = new TextDecoder().decode(data.slice(offset, offset + fileNameLength));
                    offset += fileNameLength;

                    const fileSize = new Uint32Array(data.slice(offset, offset + 4))[0];
                    offset += 4;

                    const fileData = data.slice(offset, offset + fileSize);
                    offset += fileSize;

                    files.push({ name: fileName, data: fileData });
                }

                resolve(files);
            };
            reader.onerror = function() {
                reject(new Error('ファイルの読み込みに失敗しました.'));
            };
            reader.readAsArrayBuffer(blob);
        });
    }
}

// モジュールとしてエクスポート（Node.jsやESモジュールで使えるように）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhneewwArchive;
} else {
    window.WhneewwArchive = WhneewwArchive;
}
