// Whnライブラリー
class WhneewwItem {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.children = [];
    }
}

class WhneewwArchive {
    // 新しいアイテムの作成
    static createItem(name, type) {
        return new WhneewwItem(name, type);
    }

    // アーカイブの圧縮生成
    static createCompressed(items) {
        const stringifiedItems = JSON.stringify(items);
        const compressedData = pako.deflate(stringifiedItems, { to: 'string' });
        return new Blob([compressedData], { type: 'application/octet-stream' });
    }

    // アーカイブの解凍
    static async extractCompressed(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const decompressedData = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });
        const items = JSON.parse(decompressedData);
        return items;
    }

    // フォルダの操作
    static addFolder(rootFolder, folderName) {
        const newFolder = new WhneewwItem(folderName, 'folder');
        rootFolder.children.push(newFolder);
        return { success: true, message: 'フォルダー追加成功' };
    }

    static renameFolder(rootFolder, oldName, newName) {
        const folder = rootFolder.children.find(item => item.name === oldName && item.type === 'folder');
        if (folder) {
            folder.name = newName;
            return { success: true, message: 'フォルダー名称変更成功' };
        }
        return { success: false, message: 'フォルダーが見つかりませんでした' };
    }

    static deleteFolder(rootFolder, folderName) {
        const index = rootFolder.children.findIndex(item => item.name === folderName && item.type === 'folder');
        if (index > -1) {
            rootFolder.children.splice(index, 1);
            return { success: true, message: 'フォルダー削除成功' };
        }
        return { success: false, message: 'フォルダーが見つかりませんでした' };
    }
}

// 使用例
const rootFolder = WhneewwArchive.createItem('Root', 'folder');
const addFolderResult = WhneewwArchive.addFolder(rootFolder, 'NewFolder');
console.log(addFolderResult.message);
const compressedBlob = WhneewwArchive.createCompressed([rootFolder]);
console.log('圧縮アーカイブが生成されました:', compressedBlob);

// 圧縮アーカイブの解凍例
WhneewwArchive.extractCompressed(compressedBlob).then(items => {
    console.log('解凍されたアイテム:', items);
});
