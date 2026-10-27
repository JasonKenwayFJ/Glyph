use std::path::Path;
use glh::functions::writer;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::traits::entity_like::EntityLike;
use crate::glyph_fs::paths::directory_for_type;

pub async fn save_to_disk(
    storage_dir: &Path,
    item: &mut dyn EntityLike
) -> Result<(), String>{
    let mut directory = directory_for_type(storage_dir, item.entity_type()).await?;
    if item.entity_type() == EntityType::Project {
        directory = directory.join(item.file_name());
        if !directory.exists() {
            std::fs::create_dir_all(&directory).map_err(|e| e.to_string())?;
        }
    }
    writer::write_typed(directory.clone(), item.file_name(), item)?;
    item.set_path(directory).map_err(|e| e.to_string())
}
pub async fn update_on_disk(
    storage_dir: &Path,
    item:  &mut dyn EntityLike,
) -> Result<(), String> {
    save_to_disk(storage_dir, item).await
}


