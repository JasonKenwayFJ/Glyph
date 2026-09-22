use std::path::Path;
use glh::functions::writer;
use serde::Serialize;
use glyph_core::traits::entity::EntityLike;
use crate::glyph_fs::paths::directory_for_type;

pub async fn save_to_disk(
    storage_dir: &Path,
    item: &dyn EntityLike
) -> Result<(), String>{
    let directory = directory_for_type(storage_dir, item.entity_type()).await?;

    writer::write_typed(directory, item.file_name(), item)
}
pub async fn update_on_disk(
    storage_dir: &Path,
    item:  &dyn EntityLike,
) -> Result<(), String> {
    save_to_disk(storage_dir, item).await
}
