function createWhneewwArchive(files) {
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
