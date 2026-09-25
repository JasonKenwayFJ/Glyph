use crate::glyph_fs::{deleter, loader, writer};
use glyph_core::enums::entity_type::EntityType;
use glyph_core::enums::CreateEntityRequest::CreateEntityRequest;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::ProjectManager;
use tauri::{Emitter, Manager};
use glyph_core::traits::entity_like::EntityLike;

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

    let local_data = project_state.get_entities(entity_type);
    if !local_data.is_empty(){
        return Ok(local_data)
    }

    let disk_data = loader::load_entities(&app_data_dir).await?;
    if !disk_data.is_empty(){
        project_state.set_entities(disk_data.clone());
        return Ok(disk_data)
    }


    Ok(Vec::new())

}

#[tauri::command]
pub async fn create_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    user_state: tauri::State<'_, UserManager>,
    data: CreateEntityRequest,
) -> Result<(), String> {

    let mut project = project_state
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
        .join("Projects")
        .join(&project.title);

    let entity: Box<dyn EntityLike> = match data {
        CreateEntityRequest::Project(dto) => Box::new(dto.into_entity(user_id)),
        CreateEntityRequest::Card(dto) => Box::new(dto.into_entity(project.id, user_id)),
        _ => {todo!()}
    };

    writer::save_to_disk(&app_data_dir, entity.as_ref()).await?;
    println!("Сущность успешно сохранена на диск");

    project_state.add_boxed_entity(entity.clone_box());
    println!("Сущность успешно добавлена локально");

    project.weight += 1;
    project_state.update_project(project).map_err(|e| e.to_string())?;




    app.emit("OnEntityCreated", entity)
        .map_err(|e| e.to_string())
}


#[tauri::command]
pub async fn update_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    data: Box<dyn EntityLike>,
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
    writer::update_on_disk(&app_data_dir, data.as_ref()).await?;
    project_state.update_entity(data.clone_box())?;
    app.emit("OnEntityUpdated", data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn soft_delete_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    mut data: Box<dyn EntityLike>,
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

    data.move_to_trash();

    deleter::_soft_delete(&app_data_dir, data.as_ref()).await?;
    writer::update_on_disk(&app_data_dir.join("Trash"), data.as_ref()).await?;
    project_state.update_entity(data.clone_box())?;

    app.emit("OnEntityMovedToTrash", data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn hard_delete_entity(
    app: tauri::AppHandle,
    project_state: tauri::State<'_, ProjectManager>,
    data: Box<dyn EntityLike>,
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
    deleter::_hard_delete(&app_data_dir, data.as_ref()).await?;

    project_state.remove_entity(data.id());

    app.emit("OnEntityDeleted", data)
        .map_err(|e| e.to_string())
}
