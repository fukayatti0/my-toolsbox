"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Download } from "lucide-react";

const ImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<{
    url: string;
    dimensions: string;
    format: string;
  } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError("");
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setConvertedImage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".jpeg",
        ".jpg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".ico",
        ".tiff",
        ".pdf",
      ],
    },
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError("");

    try {
      const imageModule = await import("../../../rust/pkg/image_converter");
      await imageModule.default(); // Initialize WASM module
      const arrayBuffer = await (file as File).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const converter = new imageModule.ImageConverter(uint8Array);
      const convertedData = converter.convert_to(selectedFormat);
      const dimensions = converter.get_dimensions();

      const blob = new Blob([convertedData], {
        type: `image/${selectedFormat}`,
      });
      setConvertedImage({
        url: URL.createObjectURL(blob),
        dimensions,
        format: selectedFormat,
      });
    } catch (err) {
      setError((err as Error).message || "Failed to convert image");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;

    const link = document.createElement("a");
    link.href = convertedImage?.url;
    link.download = `converted-image.${convertedImage?.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Image Format Converter
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
            <div
              {...getRootProps()}
              className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <p className="text-gray-600 font-medium">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop an image, or click to select"}
              </p>
            </div>

            {file && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700 font-medium">
                    {file?.name}
                  </span>
                </div>

                <div className="flex space-x-4">
                  <select
                    title="Select format"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WebP</option>
                    <option value="gif">GIF</option>
                    <option value="bmp">BMP</option>
                    <option value="ico">ICO</option>
                    <option value="tiff">TIFF</option>
                    <option value="svg">SVG</option>
                    <option value="png">Lossless (PNG)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={isConverting || !file}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium shadow-md"
                  >
                    {isConverting ? "Converting..." : "Convert"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {convertedImage && (
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={convertedImage?.url}
                    alt="Converted"
                    className="object-contain"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium px-3 py-1 bg-gray-100 rounded-full">
                    {convertedImage?.dimensions} •{" "}
                    {convertedImage?.format.toUpperCase()}
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
