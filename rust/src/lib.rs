use wasm_bindgen::prelude::*;
use image::{DynamicImage, GenericImageView};
use std::io::Write;

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

    pub fn convert_to_svg(&self) -> Result<Vec<u8>, JsError> {
        let (width, height) = self.image.dimensions();
        let mut svg_data = Vec::new();

        svg_data.write_all(b"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")?;
        svg_data.write_all(b"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"")?;
        svg_data.write_all(width.to_string().as_bytes())?;
        svg_data.write_all(b"\" height=\"")?;
        svg_data.write_all(height.to_string().as_bytes())?;
        svg_data.write_all(b"\">\n")?;

        for (x, y, pixel) in self.image.pixels() {
            let r = pixel[0];
            let g = pixel[1];
            let b = pixel[2];
            let a = pixel[3];

            svg_data.write_all(b"  <rect x=\"")?;
            svg_data.write_all(x.to_string().as_bytes())?;
            svg_data.write_all(b"\" y=\"")?;
            svg_data.write_all(y.to_string().as_bytes())?;
            svg_data.write_all(b"\" width=\"1\" height=\"1\" fill=\"rgba(")?;
            svg_data.write_all(r.to_string().as_bytes())?;
            svg_data.write_all(b",")?;
            svg_data.write_all(g.to_string().as_bytes())?;
            svg_data.write_all(b",")?;
            svg_data.write_all(b",")?;
            svg_data.write_all(a.to_string().as_bytes())?;
            svg_data.write_all(b")\" />\n")?;
        }

        svg_data.write_all(b"</svg>")?;

        Ok(svg_data)
    }

    pub fn get_dimensions(&self) -> String {
        let (width, height) = self.image.dimensions();
        format!("{}x{}", width, height)
    }
}
