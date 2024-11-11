use wasm_bindgen::prelude::*;
use image::{DynamicImage, GenericImageView, ImageOutputFormat};
use std::io::{Cursor, Write};

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
            "png" => ImageOutputFormat::Png,
            "gif" => ImageOutputFormat::Gif,
            "bmp" => ImageOutputFormat::Bmp,
            "ico" => ImageOutputFormat::Ico,
            "tiff" => ImageOutputFormat::Tiff,
            "webp" => ImageOutputFormat::WebP,
            "svg" => return self.convert_to_svg(),
            _ => return Err(JsError::new("Unsupported format")),
        };

        self.image.write_to(&mut Cursor::new(&mut buffer), format)
            .map_err(|e| JsError::new(&format!("Failed to convert image: {}", e)))?;
        
        Ok(buffer)
    }

    pub fn get_dimensions(&self) -> String {
        let (width, height) = self.image.dimensions();
        format!("{}x{}", width, height)
    }

    fn convert_to_svg(&self) -> Result<Vec<u8>, JsError> {
        let (width, height) = self.image.dimensions();
        let mut svg_data = Vec::with_capacity((width * height * 100) as usize);

        svg_data.write_all(b"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")?;
        svg_data.write_all(b"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"")?;
        svg_data.write_all(width.to_string().as_bytes())?;
        svg_data.write_all(b"\" height=\"")?;
        svg_data.write_all(height.to_string().as_bytes())?;
        svg_data.write_all(b"\">\n")?;

        for (x, y, pixel) in self.image.pixels() {
            let [r, g, b, a] = pixel.0;

            svg_data.write_all(format!(
                "  <rect x=\"{}\" y=\"{}\" width=\"1\" height=\"1\" fill=\"rgba({}, {}, {}, {})\" />\n",
                x, y, r, g, b, a
            ).as_bytes())?;
        }

        svg_data.write_all(b"</svg>")?;

        Ok(svg_data)
    }
}
