use std::path::{Path, PathBuf};
use std::sync::atomic::AtomicU64;
use glh::functions::*;
use glh::models::data::Data;
use tokio::fs;
use tokio::fs::File;
use uuid::Uuid;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::entities::user_entity::User;
use glyph_core::Project;

const USERS_DIRECTORY: &str = "Users";
const ENTITIES_DIRECTORY: &str = "Entities";
const PROJECTS_DIRECTORY: &str = "Projects";
const PENDING_FILE_DIRECTORY: &str = "Entities/PendingFiles";
const TRASH_DIRECTORY: &str = "Trash";
static TEMP_FILE_COUNTER: AtomicU64 = AtomicU64::new(0);

fn directory_for_type(storage_dir: &Path, entity_type: EntityType) -> PathBuf {
    match entity_type {
        EntityType::User => storage_dir.join(USERS_DIRECTORY),
        EntityType::Project => storage_dir.join(PROJECTS_DIRECTORY),
        EntityType::Card => storage_dir.join(ENTITIES_DIRECTORY).join("Card"),
        EntityType::Document => storage_dir.join(ENTITIES_DIRECTORY).join("Document"),
        EntityType::Note => storage_dir.join(ENTITIES_DIRECTORY).join("Note"),
        EntityType::Audio => storage_dir.join(ENTITIES_DIRECTORY).join("Audio"),
        EntityType::Video => storage_dir.join(ENTITIES_DIRECTORY).join("Video"),
        EntityType::Graph => storage_dir.join(ENTITIES_DIRECTORY).join("Graph"),
        EntityType::Table => storage_dir.join(ENTITIES_DIRECTORY).join("Table"),
        EntityType::List => storage_dir.join(ENTITIES_DIRECTORY).join("List"),
        EntityType::Task => storage_dir.join(ENTITIES_DIRECTORY).join("Task"),
    }
}
pub async fn preload_data(storage_dir: &Path) -> Result<(User, Vec<Project>, Vec<Entity>), String> {
    let user = load_user(storage_dir).await?;
    let projects = load_projects(storage_dir).await?;
    let entities = load_entities(storage_dir).await?;
    Ok((user, projects, entities))
}

pub async fn load_user(storage_dir: &Path) -> Result<User, String> {
    let path = directory_for_type(storage_dir, EntityType::User);
    let user_path = path.join("user.glh");

    if !fs::try_exists(&user_path)
        .await
        .map_err(|error| error.to_string())?
    {
        fs::create_dir_all(&path)
            .await
            .map_err(|error| format!("Не удалось создать каталог {}: {error}", path.display()))?;

        let user: User = User::default();
        let result = writing::write_typed(path, "User".to_string(), &user).map_err(|e| e.to_string());
        return Ok(user);
    }

    Ok(reading::read::<User>(&user_path)?)
}

pub async fn load_projects(storage_dir: &Path) -> Result<Vec<Project>, String> {
    
}