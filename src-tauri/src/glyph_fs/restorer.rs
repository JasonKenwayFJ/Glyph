use std::path::Path;
use glyph_core::entities::trash_entity::Trash;
use glyph_core::traits::storable::Storable;
use glyph_core::traits::trashable::Trashable;
use crate::glyph_fs::paths::directory_for_type;

pub async fn _restore<T : Trashable + Storable>(
    storage_dir: &Path,
    item: Trash
) -> Result<(), String>{

    // let old_file_path = directory_for_type(storage_dir, item.entity_type()).await?;
    directory_for_type(storage_dir, item.entity_type).await?;
    Ok(())
}