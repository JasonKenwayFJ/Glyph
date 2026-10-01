use std::path::{Path, PathBuf};
use tokio::fs;
use glyph_core::enums::entity_type::EntityType;
const _GLYPH_DIRECTORY: &str = "Glyph";
const USERS_DIRECTORY: &str = "Users";
const PLUGIN_DIRECTORY: &str = "Plugins";
const _ENTITIES_DIRECTORY: &str = "Entities";
const PROJECTS_DIRECTORY: &str = "Projects";
const _PENDING_FILE_DIRECTORY: &str = "Entities/PendingFiles";
pub const TRASH_DIRECTORY: &str = "Trash";
pub async fn directory_for_type(storage_dir: &Path, entity_type: EntityType) -> Result<PathBuf, String> {
    let path = match entity_type {
        EntityType::User => storage_dir.join(USERS_DIRECTORY),
        EntityType::Project => storage_dir.join(PROJECTS_DIRECTORY),
        EntityType::Plugin => storage_dir.join(PLUGIN_DIRECTORY),
        EntityType::Card => storage_dir.join("Card"),
        EntityType::Document => storage_dir.join("Document"),
        EntityType::Note => storage_dir.join("Note"),
        EntityType::Audio => storage_dir.join("Audio"),
        EntityType::Video => storage_dir.join("Video"),
        EntityType::Graph => storage_dir.join("Graph"),
        EntityType::Table => storage_dir.join("Table"),
        EntityType::Task => storage_dir.join("Task"),
        EntityType::Trash => storage_dir.join("Trash"),
    };
    if !fs::try_exists(&path)
        .await
        .map_err(|error| error.to_string())?
    {
        fs::create_dir_all(&path)
            .await
            .map_err(|error| error.to_string())?;
    }
    Ok(path)
}