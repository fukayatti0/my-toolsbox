import { useState } from 'react';
import Module from '../../components/image-converter/image_converter';

async function convertImage(inputFile: File): Promise<{ png: string; jpeg: string; bmp: string; tga: string }> {
    const moduleInstance = await Module();
    const converter = new moduleInstance.ImageConverter();
    
    const arrayBuffer = await inputFile.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    const pngData = converter.toPNG(data);
    const jpegData = converter.toJPEG(data, 90);
    const bmpData = converter.toBMP(data);
    const tgaData = converter.toTGA(data);
    
    const imageInfo = converter.getImageInfo();
    console.log(`Width: ${imageInfo.width}, Height: ${imageInfo.height}, Channels: ${imageInfo.channels}`);
    
    const pngBlob = new Blob([pngData], { type: 'image/png' });
    const jpegBlob = new Blob([jpegData], { type: 'image/jpeg' });
    const bmpBlob = new Blob([bmpData], { type: 'image/bmp' });
    const tgaBlob = new Blob([tgaData], { type: 'image/x-tga' });
    
    const pngUrl = URL.createObjectURL(pngBlob);
    const jpegUrl = URL.createObjectURL(jpegBlob);
    const bmpUrl = URL.createObjectURL(bmpBlob);
    const tgaUrl = URL.createObjectURL(tgaBlob);
    
    return {
        png: pngUrl,
        jpeg: jpegUrl,
        bmp: bmpUrl,
        tga: tgaUrl
    };
}

const ImageConverterPage: React.FC = () => {
    const [urls, setUrls] = useState<{ png: string; jpeg: string; bmp: string; tga: string } | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const convertedUrls = await convertImage(file);
            setUrls(convertedUrls);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="converter bg-white shadow-md rounded-lg p-6">
                <label htmlFor="file-input" className="block text-gray-700 text-sm font-bold mb-2">Choose a file:</label>
                <input id="file-input" type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                {urls && (
                    <div className="mt-4">
                        <p className="text-gray-700 text-sm font-bold mb-2">Converted image URLs:</p>
                        <ul className="list-disc list-inside">
                            <li><a href={urls.png} download="image.png" className="text-blue-500 hover:underline">Download PNG</a></li>
                            <li><a href={urls.jpeg} download="image.jpeg" className="text-blue-500 hover:underline">Download JPEG</a></li>
                            <li><a href={urls.bmp} download="image.bmp" className="text-blue-500 hover:underline">Download BMP</a></li>
                            <li><a href={urls.tga} download="image.tga" className="text-blue-500 hover:underline">Download TGA</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageConverterPage;
