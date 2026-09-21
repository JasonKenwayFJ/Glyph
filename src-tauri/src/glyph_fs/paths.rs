use std::path::{Path, PathBuf};
use tokio::fs;
use glyph_core::enums::entity_type::EntityType;
const GLYPH_DIRECTORY: &str = "Glyph";
const USERS_DIRECTORY: &str = "Users";
const PLUGIN_DIRECTORY: &str = "Plugins";
const ENTITIES_DIRECTORY: &str = "Entities";
const PROJECTS_DIRECTORY: &str = "Projects";
const PENDING_FILE_DIRECTORY: &str = "Entities/PendingFiles";
pub const TRASH_DIRECTORY: &str = "Trash";
pub async fn directory_for_type(storage_dir: &Path, entity_type: EntityType) -> Result<PathBuf, String> {
    let path = match entity_type {
        EntityType::User => storage_dir.join(GLYPH_DIRECTORY).join(USERS_DIRECTORY),
        EntityType::Project => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY),
        EntityType::Plugin => storage_dir.join(GLYPH_DIRECTORY).join(PLUGIN_DIRECTORY),
        EntityType::Card => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Card"),
        EntityType::Document => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Document"),
        EntityType::Note => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Note"),
        EntityType::Audio => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Audio"),
        EntityType::Video => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Video"),
        EntityType::Graph => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Graph"),
        EntityType::Table => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Table"),
        EntityType::Task => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(ENTITIES_DIRECTORY).join("Task"),
        EntityType::Trash => storage_dir.join(GLYPH_DIRECTORY).join(PROJECTS_DIRECTORY).join(TRASH_DIRECTORY).join("Trash"),
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