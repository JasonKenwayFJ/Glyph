use std::fs::create_dir_all;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::traits::storable::Storable;

use glyph_core::entities::user_entity::User;
use glyph_core::Project;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use tokio::fs;
use tokio::fs::{try_exists, File};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use uuid::Uuid;

const USERS_DIRECTORY: &str = "Users";
const ENTITIES_DIRECTORY: &str = "Entities";
const PROJECTS_DIRECTORY: &str = "Projects";
const PENDING_FILE_DIRECTORY: &str = "Entities/PendingFiles";
static TEMP_FILE_COUNTER: AtomicU64 = AtomicU64::new(0);

pub async fn preload_data(storage_dir: &Path) -> Result<(User, Vec<Project>, Vec<Entity>), String> {
    let user = load_user(storage_dir).await?;
    let projects = load_projects(storage_dir).await?;
    let entities = load_entities(storage_dir).await?;

    Ok((user, projects, entities))
}

pub async fn load_user(storage_dir: &Path) -> Result<User, String> {
    let path = directory_for_type(storage_dir, EntityType::User);
    let user_path = path.join("user.json");

    if !fs::try_exists(&user_path)
        .await
        .map_err(|error| error.to_string())?
    {
        fs::create_dir_all(&path)
            .await
            .map_err(|error| format!("Не удалось создать каталог {}: {error}", path.display()))?;

        let user: User = User::new(
            Uuid::new_v4(),
            None,
            "Jabbo".to_string(),
            "example@gmail.com".to_string(),
            None,
        );

        let json = serde_json::to_string_pretty(&user).map_err(|error| error.to_string())?;

        fs::write(&user_path, &json)
            .await
            .map_err(|e| e.to_string())?;
        return Ok(user);
    }

    let mut file = File::open(user_path).await.map_err(|e| e.to_string())?;

    let mut buffer = String::new();

    file.read_to_string(&mut buffer)
        .await
        .map_err(|e| format!("Проблема с чтением файла юзера: {}", e))?;
    let user: User = serde_json::from_str::<User>(&buffer).map_err(|error| error.to_string())?;

    Ok(user)
}
pub async fn load_projects(storage_dir: &Path) -> Result<Vec<Project>, String> {
    let path = directory_for_type(storage_dir, EntityType::Project);
    let mut project_list = Vec::new();
    let mut entries = fs::read_dir(&path).await.map_err(|e| e.to_string())?;

    while let Some(entry) = entries
        .next_entry()
        .await
        .map_err(|error| format!("Не удалось прочитать каталог {}: {error}", &path.display()))?
    {
        let path = entry.path();

        if !path.is_file()
            || path.extension().and_then(|extension| extension.to_str()) != Some("json")
        {
            continue;
        }

        let content = fs::read_to_string(&path)
            .await
            .map_err(|error| format!("Не удалось прочитать {}: {error}", path.display()))?;

        let item = serde_json::from_str::<Project>(&content)
            .map_err(|error| format!("Некорректный JSON в {}: {error}", path.display()))?;

        project_list.push(item);
    }

    Ok(project_list)
}
pub async fn load_entities(storage_dir: &Path) -> Result<(Vec<Entity>), String> {
    let mut entities =
        load_json_files::<Entity>(&directory_for_type(storage_dir, EntityType::Card)).await?;
    entities.extend(
        load_json_files::<Entity>(&directory_for_type(storage_dir, EntityType::Document)).await?,
    );

    Ok(entities)
}

pub async fn save_pending_entities<T: Storable + serde::Serialize>(
    storage_dir: &Path,
    data: T,
) -> Result<(), String> {
    let mut path = storage_dir.join(PENDING_FILE_DIRECTORY);

    path = storage_directory(&path, &data).await.map_err(|e| e.to_string())?;

    let file_name = data.file_name();
    path.push(file_name);

    let json = serde_json::to_string(&data).map_err(|error| error.to_string())?;
    let result = fs::write(path, json).await.map_err(|e| e.to_string())?;
    Ok(result)
}

fn directory_for_type(storage_dir: &Path, entity_type: EntityType) -> PathBuf {
    match entity_type {
        EntityType::User => storage_dir.join(ENTITIES_DIRECTORY).join(USERS_DIRECTORY),
        EntityType::Project => storage_dir
            .join(ENTITIES_DIRECTORY)
            .join(PROJECTS_DIRECTORY),
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
async fn storage_directory<T: Storable>(storage_dir: &Path, item: &T) -> Result<PathBuf, String> {
    let directory = directory_for_type(storage_dir, item.entity_type());

    fs::create_dir_all(&directory).await.map_err(|error| {
        format!(
            "Не удалось создать каталог {}: {error}",
            directory.display()
        )
    })?;

    Ok(directory)
}
async fn load_json_files<T: DeserializeOwned>(directory: &Path) -> Result<Vec<T>, String> {
    if !fs::try_exists(directory).await.map_err(|error| {
        format!(
            "Не удалось проверить каталог {}: {error}",
            directory.display()
        )
    })? {
        return Ok(Vec::new());
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
            || path.extension().and_then(|extension| extension.to_str()) != Some("json")
        {
            continue;
        }

        let content = fs::read_to_string(&path)
            .await
            .map_err(|error| format!("Не удалось прочитать {}: {error}", path.display()))?;

        let item = serde_json::from_str::<T>(&content)
            .map_err(|error| format!("Некорректный JSON в {}: {error}", path.display()))?;

        items.push(item);
    }

    Ok(items)
}

//TODO: Заменить "Result<Vec<Entity>" на Generic для расширения функционала в будущем

pub async fn save_to_disk<T: Storable + Serialize>(
    storage_dir: &Path,
    item: &T,
) -> Result<(), String> {
    let directory = storage_directory(storage_dir, item).await?;
    let destination = directory.join(item.file_name());
    let temporary_file = destination.with_extension(format!(
        "json.{}.{}.tmp",
        std::process::id(),
        TEMP_FILE_COUNTER.fetch_add(1, Ordering::Relaxed),
    ));

    let json = serde_json::to_vec_pretty(item)
        .map_err(|error| format!("Не удалось сериализовать данные: {error}"))?;

    let mut file = File::create(&temporary_file)
        .await
        .map_err(|error| format!("Не удалось создать {}: {error}", temporary_file.display()))?;

    file.write_all(&json)
        .await
        .map_err(|error| format!("Не удалось записать {}: {error}", temporary_file.display()))?;

    file.sync_all().await.map_err(|error| {
        format!(
            "Не удалось синхронизировать {}: {error}",
            temporary_file.display()
        )
    })?;
    drop(file);

    fs::rename(&temporary_file, &destination)
        .await
        .map_err(|error| {
            format!(
                "Не удалось завершить сохранение {}: {error}",
                destination.display()
            )
        })?;

    Ok(())
}

pub async fn update_on_disk<T: Storable + Serialize>(
    storage_dir: &Path,
    item: &T,
) -> Result<(), String> {
    save_to_disk(storage_dir, item).await
}

pub async fn delete_from_disk<T: Storable>(storage_dir: &Path, item: &T) -> Result<(), String> {
    let directory = storage_directory(storage_dir, item).await?;
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
#[cfg(test)]
mod tests {
    use super::*;
    use glyph_core::entities::project_entity::Project;
    use tempfile::tempdir;
    use uuid::Uuid;
    use glyph_core::entities::entity::EntityType::Project;

    #[tokio::test]
    async fn save_project(){
        let dir = tempdir().unwrap();
        let storage_dir = dir.path().to_path_buf();
        
        let project = Project::new_out_dto(
            "title",
            "description",
            ""
        );
    }
    #[tokio::test]
    async fn save_and_load_roundup() {
        let dir = tempdir().unwrap(); // временная папка, удаляется сама в конце теста
        let storage_dir = dir.path().to_path_buf();

        let entity = Entity::new(
            Uuid::new_v4(),
            "Test",
            "",
            "",
            "",
            EntityType::Card,
            vec![],
            vec![],
            vec![],
        );

        save_to_disk(&storage_dir, &entity).await.unwrap();
        let loaded = load_entities(&storage_dir).await.unwrap();

        assert_eq!(loaded.len(), 1);
        assert_eq!(loaded[0].id, entity.id);
    }

    #[tokio::test]
    async fn load_projects() {
        let dir = tempdir().unwrap(); // временная папка, удаляется сама в конце теста
        let storage_dir = dir.path().to_path_buf();
    
        let project = Project::new(
            Uuid::new_v4(),
            "Test project",
            "Test project for testing",
            "",
        );
    
        let result = save_to_disk(&storage_dir, &project).await;
    
        assert!(result.is_ok());
    
        let loaded = load_projects(&storage_dir).await.unwrap();
    
        assert_eq!(loaded.len(), 1);
        assert_eq!(loaded[0].id, project.id);
        assert_eq!(loaded[0].title, "Test project");
    }
}
