class WhneewwItem {
    constructor(name, type, data = null) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.children = [];
    }
}

class WhneewwArchive {
    static create(items) {
        const header = new Uint8Array(16);
        const magicNumber = new TextEncoder().encode('WHNEEWW_ARCHIVE');
        header.set(magicNumber, 0);
        header.set(new Uint32Array([1]).buffer, 12);
        
        const fileData = [];
        items.forEach(item => {
            if (item.type === "file") {
                const fileNameBytes = new TextEncoder().encode(item.name);
                const fileSize = item.data.byteLength;

                const fileEntry = new Uint8Array(4 + fileNameBytes.length + 4 + fileSize);
                const offset = 0;

                fileEntry.set(new Uint32Array([fileNameBytes.length]), offset);
                fileEntry.set(fileNameBytes, offset + 4);
                fileEntry.set(new Uint32Array([fileSize]), offset + 4 + fileNameBytes.length);
                fileEntry.set(new Uint8Array(item.data), offset + 4 + fileNameBytes.length + 4);

                fileData.push(fileEntry);
            }
        });

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

                const items = [];
                let offset = 16;
                while (offset < data.length) {
                    const fileNameLength = new Uint32Array(data.slice(offset, offset + 4))[0];
                    offset += 4;

                    const fileName = new TextDecoder().decode(data.slice(offset, offset + fileNameLength));
                    offset += fileNameLength;

                    const fileSize = new Uint32Array(data.slice(offset, offset + 4))[0];
                    offset += 4;

                    const fileData = data.slice(offset, offset + fileSize);
                    offset += fileSize;

                    items.push(new WhneewwItem(fileName, "file", fileData));
                }

                resolve(items);
            };
            reader.onerror = function() {
                reject(new Error('ファイルの読み込みに失敗しました.'));
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    static addFolder(parent, folderName) {
        const newFolder = new WhneewwItem(folderName, "folder");
        parent.children.push(newFolder);
        return { success: true, item: newFolder };
    }

    static deleteFolder(parent, folderName) {
        const folderIndex = parent.children.findIndex(item => item.name === folderName && item.type === "folder");
        if (folderIndex !== -1) {
            parent.children.splice(folderIndex, 1);
            return { success: true };
        } else {
            return { success: false, message: 'フォルダーが見つかりません。' };
        }
    }

    static renameFolder(parent, oldName, newName) {
        const folder = parent.children.find(item => item.name === oldName && item.type === "folder");
        if (folder) {
            folder.name = newName;
            return { success: true };
        } else {
            return { success: false, message: 'フォルダーが見つかりません。' };
        }
    }
}

const rootFolder = new WhneewwItem('Root', 'folder');
const addFolderResult = WhneewwArchive.addFolder(rootFolder, 'NewFolder');
console.log(addFolderResult.success ? 'フォルダー追加成功' : addFolderResult.message);

const renameFolderResult = WhneewwArchive.renameFolder(rootFolder, 'NewFolder', 'RenamedFolder');
console.log(renameFolderResult.success ? 'フォルダー名称変更成功' : renameFolderResult.message);

const deleteFolderResult = WhneewwArchive.deleteFolder(rootFolder, 'RenamedFolder');
console.log(deleteFolderResult.success ? 'フォルダー削除成功' : deleteFolderResult.message);

console.log('ルートフォルダーの内容:', rootFolder.children);
