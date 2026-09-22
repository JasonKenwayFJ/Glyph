use crate::glyph_fs::paths::directory_for_type;
use glh::functions::{reader, writer};
use glyph_core::entities::plugin::Plugin;
use glyph_core::entities::user_entity::User;
use glyph_core::entities::document_entity::Document; // добавил — нужен конкретный тип для документов, "Entity" больше не используется
use glyph_core::enums::entity_type::EntityType;
use glyph_core::traits::entity_like::EntityLike;
use glyph_core::entities::card_entity::Card; // добавил — нужен конкретный тип для карточек
use glyph_core::Project;
use serde::de::DeserializeOwned;
use std::path::Path;
use tokio::fs;


pub async fn preload_data(
    storage_dir: &Path,
) -> Result<(User, Vec<Project>, Vec<Box<dyn EntityLike>>, Vec<Plugin>), String> {
    let user = load_user(storage_dir).await?;
    let projects = load_projects(storage_dir).await?;
    let entities = load_entities(storage_dir).await?;
    let plugins = load_plugins(storage_dir).await?;
    Ok((user, projects, entities, plugins))
}


pub async fn load_plugins(storage_dir: &Path) -> Result<Vec<Plugin>, String> {
    load_files::<Plugin>( // добавил явный turbofish — без него компилятор не поймёт, что читать
                          directory_for_type(storage_dir, EntityType::Plugin)
                              .await?
                              .as_path(),
    )
        .await
}

pub async fn load_user(storage_dir: &Path) -> Result<User, String> {
    let path = directory_for_type(storage_dir, EntityType::User)
        .await
        .map_err(|e| e.to_string())?;
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
    load_files::<Project>(
        &directory_for_type(storage_dir, EntityType::Project)
            .await
            .map_err(|e| e.to_string())?,
    )
        .await
}


pub async fn load_entities(storage_dir: &Path) -> Result<Vec<Box<dyn EntityLike>>, String> {

    let cards: Vec<Card> =
        load_files::<Card>(&directory_for_type(storage_dir, EntityType::Card).await?).await?;

    let documents: Vec<Document> =
        load_files::<Document>(&directory_for_type(storage_dir, EntityType::Document).await?).await?;

    // тут и происходит "обезличивание" — оборачиваем каждую конкретную сущность
    // в Box<dyn EntityLike> уже здесь, а не внутри load_files
    let cards_boxed = cards.into_iter().map(|c| Box::new(c) as Box<dyn EntityLike>);
    let documents_boxed = documents.into_iter().map(|d| Box::new(d) as Box<dyn EntityLike>);

    Ok(cards_boxed.chain(documents_boxed).collect())
}


async fn load_files<T: DeserializeOwned>(directory: &Path) -> Result<Vec<T>, String> {
    if !fs::try_exists(directory).await.map_err(|e| e.to_string())? {
        return Ok(vec![]);
    }

    let mut items = Vec::new();
    let mut entries = fs::read_dir(directory).await.map_err(|e| e.to_string())?;

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();

        if !path.is_file() || path.extension().and_then(|e| e.to_str()) != Some("glh") {
            continue;
        }

        let item: T = reader::read::<T>(&path)?;
        items.push(item);
    }

    Ok(items)
}