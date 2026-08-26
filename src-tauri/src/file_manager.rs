use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::traits::storable::Storable;

use serde::Serialize;
use std::path::{PathBuf};

use tokio::fs;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

async fn collect_entities(entity_folder: &PathBuf) -> Result<Vec<Entity>, String> {
    let mut entities = Vec::new();

    let mut dir = fs::read_dir(entity_folder)
        .await
        .map_err(|e| e.to_string())?;

    while let Some(entry) = dir.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();

        // Нашли папку: Card, Document, Project...
        if path.is_dir() {
            let mut files = fs::read_dir(&path).await.map_err(|e| e.to_string())?;

            // Перебираем файлы внутри неё
            while let Some(entry) = files.next_entry().await.map_err(|e| e.to_string())? {
                let file_path = entry.path();

                if !file_path.is_file() {
                    continue;
                }

                let content = fs::read_to_string(&file_path)
                    .await
                    .map_err(|e| e.to_string())?;

                let entity = serde_json::from_str::<Entity>(&content).map_err(|e| e.to_string())?;

                entities.push(entity);
            }
        }
    }

    Ok(entities)
}
fn define_path<T: Storable>(storage_dir: &PathBuf, item: &T) -> PathBuf {
    let folder_name = match item.entity_type() {
        EntityType::Project => "Project",
        EntityType::Card => "Card",
        EntityType::Document => "Document",
    };

    storage_dir.join(folder_name)
}
pub async fn load_entities(storage_dir: &PathBuf) -> Result<Vec<Entity>, String> {
    let entity_folder = storage_dir.join("Entities");

    if !fs::try_exists(&entity_folder)
        .await
        .map_err(|e| e.to_string())?
    {
        fs::create_dir_all(&entity_folder)
            .await
            .map_err(|e| e.to_string())?;
        return Ok(Vec::new());
    }

    Ok(collect_entities(&entity_folder).await?)
}

pub async fn save_to_disk<T: Storable + Serialize>(
    storage_dir: &PathBuf,
    item: &T,
) -> Result<(), String> {
    let entity_folder = define_path(storage_dir, item);
    let entity = entity_folder.join(item.file_name());

    let mut file = File::create(&entity)
        .await
        .map_err(|e| e.to_string())?;

    let json = serde_json::to_string(item)
        .map_err(|e| e.to_string())?;

    file.write_all(json.as_bytes())
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn update_on_disk<T: Storable + Serialize>(
    storage_dir: &PathBuf,
    item: &T,
) -> Result<(), String> {
    Ok(save_to_disk(storage_dir, item).await?)
}
pub async fn delete_from_disk<T: Storable + Serialize>(
    storage_dir: &PathBuf,
    item: &T,
) -> Result<(), String> {
    let entity_folder = define_path(storage_dir, item);
    let entity: PathBuf = entity_folder.join(item.file_name());

    if fs::try_exists(&entity).await.map_err(|e| e.to_string())? {
        fs::remove_file(&entity).await.map_err(|e| e.to_string())?;
    }

    Ok(())
}
