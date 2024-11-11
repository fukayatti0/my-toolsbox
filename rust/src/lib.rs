use image::{DynamicImage, GenericImageView, ImageOutputFormat, Rgba};
use std::io::Cursor;
// use png::HasParameters; // Remove this line as it's no longer needed
use svg::node::element::Rectangle;
use svg::Document;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ImageConverter {
    image: DynamicImage,
}

#[wasm_bindgen]
impl ImageConverter {
    #[wasm_bindgen(constructor)]
    pub fn new(data: &[u8]) -> Result<ImageConverter, JsError> {
        let img = image::load_from_memory(data)
            .map_err(|e| JsError::new(&format!("Failed to load image: {}", e)))?;

        Ok(ImageConverter { image: img })
    }

    pub fn convert_to(&self, format: &str) -> Result<Vec<u8>, JsError> {
        let mut buffer = Vec::new();
        let format = match format {
            "jpeg" => ImageOutputFormat::Jpeg(80),
            "png" => return self.convert_to_png(),
            "gif" => ImageOutputFormat::Gif,
            "bmp" => ImageOutputFormat::Bmp,
            "ico" => ImageOutputFormat::Ico,
            "tiff" => ImageOutputFormat::Tiff,
            "webp" => ImageOutputFormat::WebP,
            "svg" => return self.convert_to_svg(),
            _ => return Err(JsError::new("Unsupported format")),
        };

        self.image
            .write_to(&mut Cursor::new(&mut buffer), format)
            .map_err(|e| JsError::new(&format!("Failed to convert image: {}", e)))?;

        Ok(buffer)
    }

    pub fn get_dimensions(&self) -> String {
        let (width, height) = self.image.dimensions();
        format!("{}x{}", width, height)
    }

    fn convert_to_png(&self) -> Result<Vec<u8>, JsError> {
        let mut buffer = Vec::new();
        {
            let w = &mut Cursor::new(&mut buffer);
            let mut encoder = png::Encoder::new(w, self.image.width(), self.image.height());
            encoder.set_color(png::ColorType::Rgba);
            encoder.set_depth(png::BitDepth::Eight);
            let mut writer = encoder.write_header().map_err(|e| JsError::new(&format!("Failed to write PNG header: {}", e)))?;
            writer.write_image_data(self.image.to_rgba8().as_raw()).map_err(|e| JsError::new(&format!("Failed to write PNG data: {}", e)))?;
        }
        Ok(buffer)
    }

    fn convert_to_svg(&self) -> Result<Vec<u8>, JsError> {
        let (width, height) = self.image.dimensions();
        let mut svg_document = Document::new().set("viewBox", (0, 0, width, height));

        for y in 0..height {
            let mut x = 0;
            while x < width {
                let pixel_color = self.image.get_pixel(x, y);
                let rgb_alpha = pixel_color[3];
                if rgb_alpha == 0 {
                    x += 1;
                    continue;
                }

                let mut line_length = 1;
                while x + line_length < width
                    && self.image.get_pixel(x + line_length, y) == pixel_color
                {
                    line_length += 1;
                }

                let opacity = if rgb_alpha == 255 {
                    1.0
                } else {
                    f32::from(rgb_alpha) / 255.0
                };

                let line = Rectangle::new()
                    .set("x", x)
                    .set("y", y)
                    .set("width", line_length)
                    .set("height", 1)
                    .set("fill", rgb_to_hex(pixel_color))
                    .set("fill-opacity", opacity);
                svg_document = svg_document.add(line);

                x += line_length;
            }
        }

        let mut svg_data = Vec::new();
        svg::write(&mut svg_data, &svg_document)
            .map_err(|e| JsError::new(&format!("Failed to write SVG: {}", e)))?;

        Ok(svg_data)
    }
}

fn rgb_to_hex(rgb: Rgba<u8>) -> String {
    format!("#{:02X}{:02X}{:02X}", rgb[0], rgb[1], rgb[2])
}
