// src-tauri/src/file_manager.rs (или как назовёшь)
use glyph_core::entities::entity::{Entity, EntityType};

use std::path::PathBuf;
use serde::Serialize;
use glyph_core::traits::storable::Storable;

use tokio::fs;

pub async fn load_entities(storage_dir: &PathBuf) -> Result<Vec<Entity>, String> {
    let entity_folder = storage_dir.join("Entities");

    if !fs::try_exists(&entity_folder).await.map_err(|e| e.to_string())? {
        fs::create_dir_all(&entity_folder).await.map_err(|e| e.to_string())?;
        return Ok(Vec::new());
    }

    let mut entities = Vec::new();
    let mut dir = fs::read_dir(&entity_folder).await.map_err(|e| e.to_string())?;

    while let Some(entry) = dir.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        if path.is_file() {
            let content = fs::read_to_string(&path).await.map_err(|e| e.to_string())?;
            let entity: Entity = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            entities.push(entity);
        }
    }

    Ok(entities)
}

pub async fn save_to_disk<T: Storable + Serialize>(storage_dir: &PathBuf, item: &T) -> Result<(), String> {
    let entity_folder = define_path(storage_dir, item);

    Ok(())
}

async fn entity_check(entity_folder: &PathBuf) -> Result<(), String> {
    if !entity_folder.exists() {
        return fs::create_dir_all(&entity_folder).await.map_err(|e| e.to_string())
    }
    Ok(())
}
fn define_path<T: Storable>(storage_dir: &PathBuf, item: &T) -> PathBuf {
    let folder_name = match item.entity_type() {
        EntityType::Project => "Project",
        EntityType::Card => "Card",
        EntityType::Document => "Document",
    };

    storage_dir.join(folder_name)
}