// app/image-converter/page.tsx
"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, Image as ImageIcon, Download } from "lucide-react";

interface ConvertedImage {
    format: string;
    url: string;
    size: number;
}

const ImageConverterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [_originalImage, setOriginalImage] = useState<File | null>(null);
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [imageInfo, setImageInfo] = useState<{
        width: number;
        height: number;
        channels: number;
    } | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setOriginalImage(file);
        setConvertedImages([]);
        setImageInfo(null);

        try {
            // Ensure the WebAssembly module path is correct
            const imageConverterModule = await import(
                "../../lib/image-converter/image_converter"
            ).catch((err) => {
                throw new Error("Failed to load WebAssembly module: " + err.message);
            });
            const imageConverter = await imageConverterModule.default();
            const converter = new imageConverter.ImageConverter();

            const buffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);
            const inputString = new TextDecoder().decode(uint8Array);

            const formats = [
                {
                    name: "PNG",
                    func: () => converter.toPNG(inputString),
                    mime: "image/png",
                },
                {
                    name: "JPEG",
                    func: () => converter.toJPEG(inputString, 90),
                    mime: "image/jpeg",
                },
                {
                    name: "BMP",
                    func: () => converter.toBMP(inputString),
                    mime: "image/bmp",
                },
                {
                    name: "TGA",
                    func: () => converter.toTGA(inputString),
                    mime: "image/x-tga",
                },
            ];

            const converted = await Promise.all(
                formats.map(async (format) => {
                    const result = await format.func();
                    const blob = new Blob([result], { type: format.mime });
                    return {
                        format: format.name,
                        url: URL.createObjectURL(blob),
                        size: blob.size,
                    };
                })
            );

            setConvertedImages(converted);
            setImageInfo(converter.getImageInfo());
        } catch (err) {
            setError("画像の変換中にエラーが発生しました。");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".bmp", ".tga"],
        },
        maxFiles: 1,
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        画像フォーマット変換
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        PNG, JPEG, BMP, TGA形式の相互変換が可能です
                    </p>
                </div>

                <div className="mt-12">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                            ${
                                isDragActive
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                            <Upload
                                className={`w-12 h-12 mb-4 ${
                                    isDragActive ? "text-blue-500" : "text-gray-400"
                                }`}
                            />
                            {isDragActive ? (
                                <p className="text-lg text-blue-500">
                                    ここにドロップしてください
                                </p>
                            ) : (
                                <p className="text-lg text-gray-500">
                                    クリックまたはドラッグ&ドロップで画像をアップロード
                                </p>
                            )}
                            <p className="mt-2 text-sm text-gray-500">
                                対応フォーマット: PNG, JPEG, BMP, TGA
                            </p>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="mt-8 text-center">
                            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
                            <p className="mt-2 text-gray-600">変換中...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {imageInfo && (
                        <div className="mt-8 p-6 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-900">画像情報</h2>
                            <dl className="mt-4 grid grid-cols-3 gap-4">
                                <div>
                                    <dt className="text-sm text-gray-500">幅</dt>
                                    <dd className="mt-1 text-lg text-gray-900">
                                        {imageInfo.width}px
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">高さ</dt>
                                    <dd className="mt-1 text-lg text-gray-900">
                                        {imageInfo.height}px
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">チャンネル数</dt>
                                    <dd className="mt-1 text-lg text-gray-900">
                                        {imageInfo.channels}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {convertedImages.length > 0 && (
                        <div className="mt-8 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">変換結果</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {convertedImages.map((image) => (
                                    <div
                                        key={image.format}
                                        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <ImageIcon className="w-6 h-6 text-gray-400 mr-2" />
                                                <span className="font-medium text-gray-900">
                                                    {image.format}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {(image.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                        <a
                                            href={image.url}
                                            download={`converted.${image.format.toLowerCase()}`}
                                            className="mt-4 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            ダウンロード
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageConverterPage;
