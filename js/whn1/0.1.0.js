class Whn1AudioFormat {
    constructor() {
        this.audioChunks = [];
    }

    async processAudioFile(file) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        this.audioChunks = this.splitAudioIntoChunks(audioBuffer);
    }

    splitAudioIntoChunks(audioBuffer) {
        const chunkSize = 44100; // 1秒あたりのサンプル数（サンプリングレートに基づく）
        const chunks = [];
        
        for (let start = 0; start < audioBuffer.length; start += chunkSize) {
            const end = Math.min(start + chunkSize, audioBuffer.length);
            const chunk = audioBuffer.getChannelData(0).slice(start, end); // モノラル音声データサンプリング
            const whn1Chunk = this.createWhn1Chunk(chunk);
            chunks.push(whn1Chunk);
        }
        return chunks;
    }

    createWhn1Chunk(chunk) {
        const header = new Uint8Array(4); // ヘッダーサイズ（調整可能）
        // ヘッダー情報をここに追加（必要に応じて）
        
        const chunkData = new Uint8Array(chunk.length * 2);
        
        for (let i = 0; i < chunk.length; i++) {
            chunkData[i * 2] = (chunk[i] * 255) & 0xFF; // 0-255にマッピング
            chunkData[i * 2 + 1] = ((chunk[i] * 255) >> 8) & 0xFF; // 上位ビット
        }
        
        const completeChunk = new Uint8Array(header.length + chunkData.length);
        completeChunk.set(header, 0);
        completeChunk.set(chunkData, header.length);
        
        return completeChunk; // .whn1チャンクデータ
    }

    playWhn1Chunks() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.audioChunks.forEach((chunk) => {
            const buffer = audioContext.createBuffer(1, chunk.length, audioContext.sampleRate);
            buffer.copyToChannel(chunk, 0);
            
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(); // 各チャンクを再生
        });
    }
}
