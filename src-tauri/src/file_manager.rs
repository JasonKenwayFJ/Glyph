// src-tauri/src/file_manager.rs (или как назовёшь)
use std::fs;
use std::path::PathBuf;
use glyph_core::entities::entity::Entity;

pub fn load_entities(storage_dir: &PathBuf) -> Result<Vec<Entity>, String> {
    let entity_folder = storage_dir.join("Entities");

    if !entity_folder.exists() {
        fs::create_dir_all(&entity_folder).map_err(|e| e.to_string())?;
        return Ok(Vec::new()); // только что создали — пусто, это нормально
    }

    let mut entities = Vec::new();

    for entry in fs::read_dir(&entity_folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.is_file() {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let entity: Entity = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            entities.push(entity);
        }
    }

    Ok(entities)
}