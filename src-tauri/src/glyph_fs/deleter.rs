use std::path::Path;
use tokio::fs;
use glyph_core::traits::entity::EntityLike;
use glyph_core::traits::storable::Storable;
use glyph_core::traits::trashable::Trashable;
use crate::glyph_fs::paths::{directory_for_type, TRASH_DIRECTORY};

pub async fn _soft_delete(storage_dir: &Path, item: &dyn EntityLike) -> Result<(), String> {
    let file_path = directory_for_type(storage_dir, item.entity_type()).await
        .map_err(|e| e.to_string())?
        .join(item.file_name());

    let new_path = storage_dir.join(TRASH_DIRECTORY).join(item.file_name());
    let is_exists = fs::try_exists(&file_path)
        .await
        .map_err(|e| e.to_string())?;

    if !is_exists {
        return Err("Файл не существует".to_string());
    }

    fs::rename(file_path, new_path)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}
pub async fn _hard_delete(storage_dir: &Path, item: &dyn EntityLike) -> Result<(), String> {
    let directory = directory_for_type(storage_dir, item.entity_type()).await?;
    let file = directory.join(item.file_name());

    if fs::try_exists(&file)
        .await
        .map_err(|error| format!("Не удалось проверить {}: {error}", file.display()))?
    {
        fs::remove_file(&file)
            .await
            .map_err(|error| format!("Не удалось удалить {}: {error}", file.display()))?;
    }

    Ok(())
}