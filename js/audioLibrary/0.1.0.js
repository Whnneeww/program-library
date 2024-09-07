class AudioProcessor {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.haxData = [];
    }

    // 音声ファイルを処理するメソッド
    async processAudioFile(file) {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const audioBuffer = await this.decodeAudioData(arrayBuffer);
        this.haxData = this.convertToHAX(audioBuffer.getChannelData(0));
        console.log(this.haxData); // HAXデータを表示
    }

    // ArrayBufferにファイルを読み込むヘルパーメソッド
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    // ArrayBufferを音声データにデコードするメソッド
    decodeAudioData(arrayBuffer) {
        return new Promise((resolve, reject) => {
            this.audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        });
    }

    // 音声データをHAXデータに変換するメソッド
    convertToHAX(inputBuffer) {
        return Array.from(inputBuffer).map(sample => Math.max(-1, Math.min(1, sample)));
    }

    // HAXデータを再生するメソッド
    playHAXData(haxArray) {
        const audioBuffer = this.audioContext.createBuffer(1, haxArray.length, this.audioContext.sampleRate);
        audioBuffer.copyToChannel(new Float32Array(haxArray), 0);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
}
