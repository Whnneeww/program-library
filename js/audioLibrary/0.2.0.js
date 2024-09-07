class AudioProcessor {
    constructor() {
        this.haxData = '';
    }

    async processAudioFile(file) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // HAXデータの生成例
        this.haxData = this.generateHAXData(audioBuffer);
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    generateHAXData(audioBuffer) {
        // ここで実際のHAXデータ生成ロジックを実装します
        // 例として、ダミーのテキストを返します
        const haxHeader = 'HAX_HEADER';
        const haxAudioData = new Uint8Array(audioBuffer.length); // 単純にバッファサイズを使用
        // 実際にはオーディオデータをこのプロセスで変換する
        for (let i = 0; i < audioBuffer.length; i++) {
            haxAudioData[i] = Math.floor(audioBuffer.getChannelData(0)[i] * 255); // 音声データを0-255に変換
        }
        const haxBlob = new Blob([haxHeader, haxAudioData], { type: 'application/octet-stream' });
        return this.convertBlobToBase64(haxBlob);
    }

    convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Base64部分を抽出
            reader.readAsDataURL(blob);
        });
    }

    playHAXData(data) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const haxBlob = this.base64ToBlob(data, 'application/octet-stream');

        const reader = new FileReader();
        reader.onload = (event) => {
            audioContext.decodeAudioData(event.target.result, (buffer) => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);
            });
        };
        reader.readAsArrayBuffer(haxBlob);
    }

    base64ToBlob(base64, type) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: type });
    }
}
