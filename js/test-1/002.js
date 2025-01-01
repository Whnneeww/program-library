const WhnLibrary = (function() {
    function textToBinary(text) {
        return Array.from(text).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    }

    function alternateBinary(text1, text2) {
        const binary1 = textToBinary(text1);
        const binary2 = textToBinary(text2);
        
        let result = '';
        const maxLength = Math.max(binary1.length, binary2.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (i < binary1.length) {
                result += binary1[i]; // 奇数
            }
            if (i < binary2.length) {
                result += binary2[i]; // 偶数
            }
        }
        
        return result;
    }

    function binaryToBase64(binary) {
        const byteArray = [];
        for (let i = 0; i < binary.length; i += 8) {
            byteArray.push(parseInt(binary.substr(i, 8), 2));
        }
        const byteString = String.fromCharCode(...byteArray);
        return btoa(byteString);
    }

    function base64ToBinary(base64) {
        const byteString = atob(base64);
        let binary = '';
        for (let i = 0; i < byteString.length; i++) {
            binary += byteString.charCodeAt(i).toString(2).padStart(8, '0');
        }
        return binary;
    }

    function splitBinary(binary) {
        const length = binary.length;
        const text1 = [];
        const text2 = [];

        for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
                text1.push(binary[i]); // 奇数
            } else {
                text2.push(binary[i]); // 偶数
            }
        }

        const binary1 = text1.join('');
        const binary2 = text2.join('');
        return [binary1, binary2];
    }

    function fscosstxt(text1, text2) {
        const binaryData = alternateBinary(text1, text2);
        return binaryToBase64(binaryData);
    }

    function fscosstxtre(base64) {
        const binaryData = base64ToBinary(base64);
        const [binary1, binary2] = splitBinary(binaryData);
        
        const text1 = binary1.match(/.{1,8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('');
        const text2 = binary2.match(/.{1,8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('');
        
        return [text1, text2];
    }

    return {
        fscosstxt,
        fscosstxtre
    };
})();
