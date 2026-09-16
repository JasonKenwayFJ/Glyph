use glh::functions::*;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::entities::user_entity::User;
use glyph_core::Project;
use serde::de::DeserializeOwned;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64};
use serde::Serialize;
use tokio::fs;
use glyph_core::traits::storable::Storable;
use glyph_core::traits::Trashable::Trashable;

const USERS_DIRECTORY: &str = "Users";
const ENTITIES_DIRECTORY: &str = "Entities";
const PROJECTS_DIRECTORY: &str = "Projects";
const PENDING_FILE_DIRECTORY: &str = "Entities/PendingFiles";
const TRASH_DIRECTORY: &str = "Trash";


async fn directory_for_type(storage_dir: &Path, entity_type: EntityType) -> Result<PathBuf, String> {
    let path = match entity_type {
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
pub async fn preload_data(storage_dir: &Path) -> Result<(User, Vec<Project>, Vec<Entity>), String> {
    let user = load_user(storage_dir).await?;
    let projects = load_projects(storage_dir).await?;
    let entities = load_entities(storage_dir).await?;
    Ok((user, projects, entities))
}

pub async fn load_user(storage_dir: &Path) -> Result<User, String> {
    let path = directory_for_type(storage_dir, EntityType::User)
        .await.map_err(|e| e.to_string())?;
    let user_path = path.join("user.glh");

    if !fs::try_exists(&user_path)
        .await
        .map_err(|error| error.to_string())?
    {
        let user: User = User::default();
        writing::write_typed(path, "User".to_string(), &user).map_err(|e| e.to_string())?;
        return Ok(user);
    }

    Ok(reading::read::<User>(&user_path)?)
}

pub async fn load_projects(storage_dir: &Path) -> Result<Vec<Project>, String> {
    load_files(&directory_for_type(storage_dir, EntityType::Project).await.map_err(|e| e.to_string())?).await.map_err(|e| e.to_string())
}
pub async fn load_entities(storage_dir: &Path) -> Result<Vec<Entity>, String> {
    let cards = load_files::<Entity>(
        &directory_for_type(storage_dir, EntityType::Card).await?
    ).await?;

    let documents = load_files::<Entity>(
        &directory_for_type(storage_dir, EntityType::Document).await?
    ).await?;

    Ok(cards.into_iter().chain(documents).collect())
}
async fn load_files<T: DeserializeOwned>(directory: &Path) -> Result<Vec<T>, String> {
    if !fs::try_exists(directory).await.map_err(|error| {
        format!(
            "Не удалось проверить каталог {}: {error}",
            directory.display()
        )
    })? {
        return Ok(vec![]);
    }

    let mut items = Vec::new();

    let mut entries = fs::read_dir(directory).await.map_err(|error| {
        format!(
            "Не удалось открыть каталог {}: {error}",
            directory.display()
        )
    })?;

    while let Some(entry) = entries.next_entry().await.map_err(|error| {
        format!(
            "Не удалось прочитать каталог {}: {error}",
            directory.display()
        )
    })? {
        let path = entry.path();

        if !path.is_file()
            || path.extension().and_then(|extension| extension.to_str()) != Some("glh")
        {
            continue;
        }

        items.push(reading::read::<T>(&path)?);
    }

    Ok(items)
}


pub(crate) async fn save_to_disk<T: Storable + Serialize + Trashable>(
    storage_dir: &Path,
    item: &T
) -> Result<(), String>{
    let directory = directory_for_type(storage_dir, item.entity_type()).await?;

    writing::write_typed(directory, item.file_name(), item)
}
pub async fn update_on_disk<T: Storable + Serialize + Trashable>(
    storage_dir: &Path,
    item: &T,
) -> Result<(), String> {
    save_to_disk(storage_dir, item).await
}
pub async fn hard_delete<T: Trashable + Storable>(storage_dir: &Path, item: &T) -> Result<(), String> {
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
pub async fn soft_delete<T: Trashable + Storable>(storage_dir: &Path, item: &T) -> Result<(), String> {
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