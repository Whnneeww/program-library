class WhmidLibrary {
    constructor() {
        this.version = 0;
        this.tempo = 120;
        this.trackInfo = 1; // ドラムとメロディのトラックを想定
        this.notes = [];
    }

    setVersion(version) {
        this.version = version;
    }

    setTempo(tempo) {
        this.tempo = tempo;
    }

    setTrackInfo(trackInfo) {
        this.trackInfo = trackInfo;
    }

    addNote(pitch, instrument, length, divideLength, startTime, divideTiming, noteTempo) {
        this.notes.push({
            pitch,
            instrument,
            length,
            divideLength,
            startTime,
            divideTiming,
            noteTempo
        });
    }

    generateWhmidFile() {
        const fileHeader = new Uint8Array(4);
        fileHeader[0] = this.version; // バージョン
        fileHeader[1] = this.tempo; // テンポ
        fileHeader[2] = (this.trackInfo >> 8) & 0xFF; // トラック上位バイト
        fileHeader[3] = this.trackInfo & 0xFF; // トラック下位バイト

        const noteData = [];

        for (const note of this.notes) {
            const noteArray = new Uint8Array(26);
            noteArray[0] = (note.pitch >> 8) & 0xFF; // 音の高さ
            noteArray[1] = note.pitch & 0xFF;
            noteArray[2] = (note.instrument >> 8) & 0xFF; // 楽器の種類
            noteArray[3] = note.instrument & 0xFF;
            const lengthArray = new Uint32Array(1);
            lengthArray[0] = note.length;
            noteArray.set(new Uint8Array(lengthArray.buffer), 4);
            const divideLengthArray = new Uint32Array(1);
            divideLengthArray[0] = note.divideLength;
            noteArray.set(new Uint8Array(divideLengthArray.buffer), 8);
            const startTimeArray = new Uint8Array(6);
            const startTimeBytes = this.getBytes(note.startTime, 6);
            noteArray.set(startTimeBytes, 12);
            const divideTimingArray = new Uint32Array(1);
            divideTimingArray[0] = note.divideTiming;
            noteArray.set(new Uint8Array(divideTimingArray.buffer), 18);
            noteArray[22] = (note.noteTempo >> 8) & 0xFF; // テンポ
            noteArray[23] = note.noteTempo & 0xFF;
            noteArray[24] = (this.trackInfo >> 8) & 0xFF; // トラック
            noteArray[25] = this.trackInfo & 0xFF;

            noteData.push(noteArray);
        }

        const finalFile = new Uint8Array(fileHeader.length + noteData.length * 26);
        finalFile.set(fileHeader, 0);

        for (let i = 0; i < noteData.length; i++) {
            finalFile.set(noteData[i], fileHeader.length + i * 26);
        }

        const blob = new Blob([finalFile], { type: 'application/octet-stream' });
        this.saveFile(blob, 'output.whmid');
    }

    getBytes(num, size) {
        const byteArray = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            byteArray[size - 1 - i] = num & 0xFF;
            num >>= 8;
        }
        return byteArray;
    }

    saveFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
