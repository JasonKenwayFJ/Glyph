use std::path::Path;
use glh::functions::{reader, writer};
use serde::de::DeserializeOwned;
use tokio::fs;
use glyph_core::entities::entity::Entity;
use glyph_core::entities::plugin::Plugin;
use glyph_core::entities::user_entity::User;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::{Project, ProjectManager};
use crate::glyph_fs::paths::directory_for_type;

pub async fn preload_data(storage_dir: &Path) -> Result<(User, Vec<Project>, Vec<Entity>, Vec<Plugin>), String> {
    let user = load_user(storage_dir).await?;
    let projects = load_projects(storage_dir).await?;
    let entities = load_entities(storage_dir).await?;
    let plugins = load_plugins(storage_dir).await?;
    Ok((user, projects, entities, plugins))
}

pub async fn load_plugins(storage_dir: &Path) -> Result<Vec<Plugin>, String>{
    load_files(directory_for_type(storage_dir, EntityType::Plugin).await?.as_path()).await.map_err(|e| e.to_string())
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
        writer::write_typed(path, "User".to_string(), &user).map_err(|e| e.to_string())?;
        return Ok(user);
    }

    Ok(reader::read::<User>(&user_path)?)
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

        items.push(reader::read::<T>(&path)?);
    }

    Ok(items)
}