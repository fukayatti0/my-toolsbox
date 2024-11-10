'use client';
import { useState } from 'react';
import Module from '../../components/image-converter/image_converter';

async function convertImage(inputFile: File, format: string): Promise<string> {
    const moduleInstance = await Module();
    const converter = new moduleInstance.ImageConverter();
    
    const arrayBuffer = await inputFile.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    let convertedData;
    let mimeType;
    switch (format) {
        case 'png':
            convertedData = converter.toPNG(data);
            mimeType = 'image/png';
            break;
        case 'jpeg':
            convertedData = converter.toJPEG(data, 90);
            mimeType = 'image/jpeg';
            break;
        case 'bmp':
            convertedData = converter.toBMP(data);
            mimeType = 'image/bmp';
            break;
        case 'tga':
            convertedData = converter.toTGA(data);
            mimeType = 'image/x-tga';
            break;
        default:
            throw new Error('Unsupported format');
    }
    
    const blob = new Blob([convertedData], { type: mimeType });
    return URL.createObjectURL(blob);
}

const ImageConverterPage: React.FC = () => {
    const [url, setUrl] = useState<string | null>(null);
    const [format, setFormat] = useState<string>('png');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormat(e.target.value);
    };

    const handleConvert = async () => {
        if (file) {
            const convertedUrl = await convertImage(file, format);
            setUrl(convertedUrl);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="converter bg-white shadow-md rounded-lg p-6">
                <label htmlFor="file-input" className="block text-gray-700 text-sm font-bold mb-2">Choose a file:</label>
                <input id="file-input" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                
                <label htmlFor="format-select" className="block text-gray-700 text-sm font-bold mt-4 mb-2">Select format:</label>
                <select id="format-select" value={format} onChange={handleFormatChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none">
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="bmp">BMP</option>
                    <option value="tga">TGA</option>
                </select>
                
                <button onClick={handleConvert} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none">Convert</button>
                
                {url && (
                    <div className="mt-4">
                        <p className="text-gray-700 text-sm font-bold mb-2">Converted image URL:</p>
                        <a href={url} download={`image.${format}`} className="text-blue-500 hover:underline">Download {format.toUpperCase()}</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageConverterPage;
