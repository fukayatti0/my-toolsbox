use wasm_bindgen::prelude::*;
use image::{DynamicImage, ImageFormat, GenericImageView};
use std::io::Cursor;

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
        let format = match format.to_lowercase().as_str() {
            "jpeg" | "jpg" => ImageFormat::Jpeg,
            "png" => ImageFormat::Png,
            "gif" => ImageFormat::Gif,
            "webp" => ImageFormat::WebP,
            "bmp" => ImageFormat::Bmp,
            "ico" => ImageFormat::Ico,
            "tiff" => ImageFormat::Tiff,
            format => return Err(JsError::new(&format!("Unsupported format: {}", format))),
        };

        let mut buffer = Cursor::new(Vec::new());
        self.image
            .write_to(&mut buffer, format)
            .map_err(|e| JsError::new(&format!("Failed to convert image: {}", e)))?;

        Ok(buffer.into_inner())
    }

    pub fn get_dimensions(&self) -> String {
        let (width, height) = self.image.dimensions();
        format!("{}x{}", width, height)
    }
}

// エラーハンドリングのためのヘルパー関数
#[wasm_bindgen]
pub fn supported_formats() -> Vec<JsValue> {
    vec![
        "JPEG".into(),
        "PNG".into(),
        "GIF".into(),
        "WebP".into(),
        "BMP".into(),
        "ICO".into(),
        "TIFF".into(),
    ]
}