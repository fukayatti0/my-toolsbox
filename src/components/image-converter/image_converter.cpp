#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image.h"
#include "stb_image_write.h"
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <string>

using namespace emscripten;

class ImageConverter {
private:
    std::vector<unsigned char> imageData;
    int width;
    int height;
    int channels;

    bool loadImage(const std::string& inputBuffer) {
        unsigned char* data = stbi_load_from_memory(
            reinterpret_cast<const unsigned char*>(inputBuffer.data()),
            inputBuffer.size(),
            &width,
            &height,
            &channels,
            0
        );

        if (!data) {
            return false;
        }

        imageData = std::vector<unsigned char>(
            data,
            data + (width * height * channels)
        );
        stbi_image_free(data);
        return true;
    }

public:
    ImageConverter() : width(0), height(0), channels(0) {}

    // PNG変換
    std::string toPNG(const std::string& inputBuffer) {
        if (!loadImage(inputBuffer)) {
            return "";
        }

        std::vector<unsigned char> output;
        stbi_write_png_to_func(
            [](void* context, void* data, int size) {
                auto* output = static_cast<std::vector<unsigned char>*>(context);
                output->insert(
                    output->end(),
                    static_cast<unsigned char*>(data),
                    static_cast<unsigned char*>(data) + size
                );
            },
            &output,
            width,
            height,
            channels,
            imageData.data(),
            width * channels
        );

        return std::string(output.begin(), output.end());
    }

    // JPEG変換
    std::string toJPEG(const std::string& inputBuffer, int quality = 90) {
        if (!loadImage(inputBuffer)) {
            return "";
        }

        std::vector<unsigned char> output;
        stbi_write_jpg_to_func(
            [](void* context, void* data, int size) {
                auto* output = static_cast<std::vector<unsigned char>*>(context);
                output->insert(
                    output->end(),
                    static_cast<unsigned char*>(data),
                    static_cast<unsigned char*>(data) + size
                );
            },
            &output,
            width,
            height,
            channels,
            imageData.data(),
            quality
        );

        return std::string(output.begin(), output.end());
    }

    // BMP変換
    std::string toBMP(const std::string& inputBuffer) {
        if (!loadImage(inputBuffer)) {
            return "";
        }

        std::vector<unsigned char> output;
        stbi_write_bmp_to_func(
            [](void* context, void* data, int size) {
                auto* output = static_cast<std::vector<unsigned char>*>(context);
                output->insert(
                    output->end(),
                    static_cast<unsigned char*>(data),
                    static_cast<unsigned char*>(data) + size
                );
            },
            &output,
            width,
            height,
            channels,
            imageData.data()
        );

        return std::string(output.begin(), output.end());
    }

    // TGA変換
    std::string toTGA(const std::string& inputBuffer) {
        if (!loadImage(inputBuffer)) {
            return "";
        }

        std::vector<unsigned char> output;
        stbi_write_tga_to_func(
            [](void* context, void* data, int size) {
                auto* output = static_cast<std::vector<unsigned char>*>(context);
                output->insert(
                    output->end(),
                    static_cast<unsigned char*>(data),
                    static_cast<unsigned char*>(data) + size
                );
            },
            &output,
            width,
            height,
            channels,
            imageData.data()
        );

        return std::string(output.begin(), output.end());
    }

    // 画像情報の取得
    val getImageInfo() const {
        val info = val::object();
        info.set("width", width);
        info.set("height", height);
        info.set("channels", channels);
        return info;
    }
};

EMSCRIPTEN_BINDINGS(image_converter) {
    class_<ImageConverter>("ImageConverter")
        .constructor<>()
        .function("toPNG", &ImageConverter::toPNG)
        .function("toJPEG", &ImageConverter::toJPEG)
        .function("toBMP", &ImageConverter::toBMP)
        .function("toTGA", &ImageConverter::toTGA)
        .function("getImageInfo", &ImageConverter::getImageInfo);
}