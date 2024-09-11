// Encryptor.js
class Encryptor {
    constructor(repeatCount) {
        this.repeatCount = repeatCount; // 繰り返し回数
    }

    // 暗号化メソッド
    encrypt(data) {
        let data1 = data.slice(0, data.length / 2);
        let data2 = data.slice(data.length / 2);

        for (let i = 0; i < this.repeatCount; i++) {
            let newData1 = '';
            let newData2 = '';

            for (let j = 0; j < data1.length; j++) {
                if (data1[j] === '0') {
                    newData1 += (data2[j] === '1') ? '0' : '1'; // 簡単なビット逆転処理
                } else {
                    newData1 += data1[j];
                }

                newData2 += data2[j]; // データ2をそのままコピー
            }

            data1 = newData1; 
            data2 = newData2; 
        }

        return data1 + data2; // 最終的なデータを結合して返す
    }
}

// エクスポート
export { Encryptor };
