import os
import zipfile
import requests
import tkinter as tk
from tkinter import messagebox
import pythoncom
from win32com.client import Dispatch
import subprocess  # バッチファイルを実行するためにインポート

def download_file(url, dest):
    try:
        response = requests.get(url)
        response.raise_for_status()  # エラーチェック
        with open(dest, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"ファイルのダウンロード中にエラーが発生しました: {e}")
        return False

def create_shortcut(target, shortcut_path, working_directory):
    shell = Dispatch('WScript.Shell')
    shortcut = shell.CreateShortCut(shortcut_path)
    shortcut.TargetPath = target
    shortcut.WorkingDirectory = working_directory
    shortcut.IconLocation = target  # アイコンを同じに設定する
    shortcut.save()

def install_app():
    app_name = "YourApplicationName"
    main_executable = "YourApp.exe"  # メインファイル名
    bat_file = "setup.bat"  # 実行するバッチファイル名

    home_dir = os.path.expanduser("~")
    install_dir = os.path.join(home_dir, "fscoss-app", app_name)
    shortcut_dir = os.path.join(home_dir, "Desktop")  # ショートカットをデスクトップに作成
    url = "https://example.com/path/to/your/file.zip"  # ZIPファイルのURL
    zip_dest = os.path.join(home_dir, "temp.zip")  # 一時ZIPファイルの保存場所

    if download_file(url, zip_dest):
        try:
            os.makedirs(install_dir, exist_ok=True)  # インストール先フォルダの作成
            with zipfile.ZipFile(zip_dest, 'r') as zip_ref:
                zip_ref.extractall(install_dir)  # 解凍
            
            # ショートカットの作成
            target_path = os.path.join(install_dir, main_executable)
            shortcut_path = os.path.join(shortcut_dir, f"{app_name}.lnk")
            create_shortcut(target_path, shortcut_path, install_dir)
            
            # バッチファイルの実行
            bat_path = os.path.join(install_dir, bat_file)
            subprocess.run([bat_path], check=True)  # バッチファイルを実行

            messagebox.showinfo("成功", "インストールが完了し、ショートカットが作成され、バッチファイルが実行されました！")
        except Exception as e:
            messagebox.showerror("エラー", f"エラーが発生しました: {e}")
        finally:
            if os.path.exists(zip_dest):
                os.remove(zip_dest)  # 一時ファイルの削除
    else:
        messagebox.showerror("エラー", "ZIPファイルのダウンロードに失敗しました。")

def create_installer_window():
    window = tk.Tk()
    window.title("アプリインストーラー")

    label = tk.Label(window, text="インストールボタンをクリックしてください:")
    label.pack()

    install_button = tk.Button(window, text="インストール", command=install_app)
    install_button.pack()

    window.mainloop()

if __name__ == "__main__":
    create_installer_window()
