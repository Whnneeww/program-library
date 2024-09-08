import struct
import json

class WhneewwItem:
    def __init__(self, name, item_type, data=None):
        self.name = name
        self.type = item_type
        self.data = data
        self.children = []

class WhneewwArchive:
    @staticmethod
    def create(items):
        header = bytearray(16)
        magic_number = b'WHNEEWW_ARCHIVE'
        header[0:16] = magic_number + struct.pack('<I', 1)  # バージョン

        file_data = bytearray()
        for item in items:
            if item.type == "file":
                file_name_bytes = item.name.encode('utf-8')
                file_size = len(item.data)

                file_entry = struct.pack('<I', len(file_name_bytes)) + file_name_bytes + struct.pack('<I', file_size) + item.data
                file_data += file_entry

        return header + file_data

    @staticmethod
    def extract(blob):
        if blob[:16] != b'WHNEEWW_ARCHIVE':
            raise ValueError('不正なアーカイブ形式.')

        version = struct.unpack('<I', blob[12:16])[0]
        if version != 1:
            raise ValueError('未知のバージョンです.')

        items = []
        offset = 16
        while offset < len(blob):
            file_name_length = struct.unpack('<I', blob[offset:offset + 4])[0]
            offset += 4

            file_name = blob[offset:offset + file_name_length].decode('utf-8')
            offset += file_name_length

            file_size = struct.unpack('<I', blob[offset:offset + 4])[0]
            offset += 4

            file_data = blob[offset:offset + file_size]
            offset += file_size

            items.append(WhneewwItem(file_name, "file", file_data))

        return items

    @staticmethod
    def add_folder(parent, folder_name):
        new_folder = WhneewwItem(folder_name, "folder")
        parent.children.append(new_folder)
        return {"success": True, "item": new_folder}

    @staticmethod
    def delete_folder(parent, folder_name):
        folder_index = next((i for i, item in enumerate(parent.children) 
                              if item.name == folder_name and item.type == "folder"), -1)
        if folder_index != -1:
            del parent.children[folder_index]
            return {"success": True}
        return {"success": False, "message": 'フォルダーが見つかりません。'}

    @staticmethod
    def rename_folder(parent, old_name, new_name):
        folder = next((item for item in parent.children 
                       if item.name == old_name and item.type == "folder"), None)
        if folder:
            folder.name = new_name
            return {"success": True}
        return {"success": False, "message": 'フォルダーが見つかりません。'}

# 使用例
root_folder = WhneewwItem('Root', 'folder')
add_folder_result = WhneewwArchive.add_folder(root_folder, 'NewFolder')
print('フォルダー追加成功' if add_folder_result["success"] else add_folder_result["message"])

rename_folder_result = WhneewwArchive.rename_folder(root_folder, 'NewFolder', 'RenamedFolder')
print('フォルダー名称変更成功' if rename_folder_result["success"] else rename_folder_result["message"])

delete_folder_result = WhneewwArchive.delete_folder(root_folder, 'RenamedFolder')
print('フォルダー削除成功' if delete_folder_result["success"] else delete_folder_result["message"])

print('ルートフォルダーの内容:', [child.name for child in root_folder.children])
