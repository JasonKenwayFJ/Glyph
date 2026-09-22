use crate::glyph_fs::{deleter, loader, writer};
use glyph_core::enums::entity_type::EntityType;
use glyph_core::enums::CreateEntityRequest::CreateEntityRequest;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::traits::entity::EntityLike;
use glyph_core::ProjectManager;
use tauri::{Emitter, Manager};

#[tauri::command]
pub async fn get_entities(
    app: tauri::AppHandle,
    entity_type: EntityType,
    project_state: tauri::State<'_, ProjectManager>,
) -> Result<Vec<Box<dyn EntityLike>>, String> {
    let project = project_state
        .get_project()
        .ok_or("No active project found".to_string())?;
    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph")
        .join(project.title);
    let loaded = loader::load_entities(&app_data_dir).await?;

    let result = project_state.get_entities(EntityType::Card);
    Ok(result)
}

#[tauri::command]
pub async fn create_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    user_state: tauri::State<'_, UserManager>,
    request: CreateEntityRequest,
) -> Result<(), String> {
    let project = project_state
        .get_project()
        .ok_or("No active project found".to_string())?;
    let user_id = user_state
        .get_user()
        .ok_or("No active user found".to_string())?
        .id;

    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph")
        .join(project.title);

    let entity: Box<dyn EntityLike> = match request {
        CreateEntityRequest::Project(dto) => Box::new(dto.into_entity(user_id)),
        CreateEntityRequest::Card(dto) => Box::new(dto.into_entity(project.id, user_id)),
    };

    writer::save_to_disk(&app_data_dir, entity.as_ref()).await?;
    println!("Сущность успешно сохранена на диск");

    project_state.add_boxed_entity(entity.clone_box());
    println!("Сущность успешно добавлена локально");

    app.emit("OnEntityCreated", entity)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    request: Box<dyn EntityLike>,
) -> Result<(), String> {
    let project = project_state
        .get_project()
        .ok_or("No active project found".to_string())?;
    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph")
        .join(project.title);
    writer::update_on_disk(&app_data_dir, request.as_ref()).await?;
    project_state.update_entity(request.clone_box())?;
    app.emit("OnEntityUpdated", request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn soft_delete_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    mut request: Box<dyn EntityLike>,
) -> Result<(), String> {
    let project = project_state
        .get_project()
        .ok_or("No active project found".to_string())?;
    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph")
        .join(project.title);

    deleter::_soft_delete(&app_data_dir, request.as_ref()).await?;

    // TODO: сейчас файл переезжает в Trash, но сама сущность не помечается удалённой.
    // Нужно: request.move_to_trash() (требует Trashable как supertrait EntityLike),
    // затем перезаписать её на диске в Trash-папке и через project_state.update_entity(),
    // иначе is_deleted/deleted_at останутся рассинхронизированы с фактическим положением файла.

    project_state.remove_entity(request.id()); // временно: убираем из активного списка,
    // хотя это не то же самое, что настоящий soft-delete

    app.emit("OnEntityMovedToTrash", request)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn hard_delete_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    request: Box<dyn EntityLike>,
) -> Result<(), String> {
    let project = project_state
        .get_project()
        .ok_or("No active project found".to_string())?;
    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph")
        .join(project.title);
    deleter::_hard_delete(&app_data_dir, request.as_ref()).await?;

    project_state.remove_entity(request.id());

    app.emit("OnEntityDeleted", request)
        .map_err(|e| e.to_string())
}
