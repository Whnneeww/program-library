const FileHandler = (() => {
    const handleFile = async (file, format) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;

            switch (format) {
                case 'dataurl':
                    const dataURL = URL.createObjectURL(file);
                    console.log("dataurl:", dataURL);
                    break;
                case 'text':
                    console.log("txt:", content);
                    break;
                case 'binary':
                    const binaryArray = new Uint8Array(content);
                    console.log("binarydata:", binaryArray);
                    break;
                case 'hex':
                    const hexString = [...new Uint8Array(content)]
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join(' ');
                    console.log("hexbinary:", hexString);
                    break;
                case 'binaryString':
                    const binaryString = [...new Uint8Array(content)]
                        .map(byte => byte.toString(2).padStart(8, '0'))
                        .join(' ');
                    console.log("Towbinary:", binaryString);
                    break;
                default:
                    console.log("notformat:", format);
                    break;
            }
        };

        reader.onerror = () => {
            console.error('error');
        };

        switch (format) {
            case 'dataurl':
                reader.readAsDataURL(file);
                break;
            case 'text':
                reader.readAsText(file);
                break;
            case 'binary':
            case 'hex':
            case 'binaryString':
                reader.readAsArrayBuffer(file);
                break;
            default:
                reader.readAsText(file);
                break;
        }
    }

    const openFileDialog = async (extension = '.txt', format = 'text') => {
        const options = {
            types: [{
                description: 'Files of the specified type',
                accept: {
                    '*/*': ['.*'],
                    [extension]: [extension]
                },
            }],
            excludeAcceptAllOption: false,
            multiple: false,
        };

        try {
            const [fileHandle] = await window.showOpenFilePicker(options);
            const file = await fileHandle.getFile();
            await handleFile(file, format);
        } catch (error) {
            console.error('uperror:', error);
        }
    }

    return {
        openFileDialog
    };
})();
