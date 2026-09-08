use crate::file_manager;
use glyph_core::entities::entity::{Entity, EntityType};
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::network::api_client::{ApiClient, ApiResponse};
use glyph_core::network::entity_service;
use tauri::{Emitter, Manager};
use glyph_core::dto_entities::entity_dto::EntityDto;
use glyph_core::ProjectManager;

#[tauri::command]
pub async fn get_entities(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    entity_type: EntityType,
    project_state: tauri::State<'_, ProjectManager>,
) -> Result<Vec<Entity>, String> {
    let project = project_state.get_project().
        ok_or("No active project found".to_string())?;
    let app_data_dir = app.path().app_data_dir().expect("no app data dir");
    println!("App data dir: {}", app_data_dir.display());
    let loaded = file_manager::load_entities(&app_data_dir)
        .await?;
    entity_state.hydrate(loaded);
    entity_state.get_entities(entity_type, project.id)
}


#[tauri::command]
pub async fn create_entity(
    app: tauri::AppHandle,
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    project_state: tauri::State<'_, ProjectManager>,
    entity: EntityDto,
) -> Result<Entity, String> {

    let project = project_state.get_project().
        ok_or("No active project found".to_string())?;

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    println!("App data dir: {}", app_data_dir.display());

    let mut final_entity = entity.get_entity(project.id);

    let response =
        entity_service::create_entity::<()>(api_state.inner(), &final_entity).await;

    if response.is_err(){
        final_entity.is_pending = true;
    }


    file_manager::save_to_disk(&app_data_dir, &final_entity).await?;

    println!("Сущность успешно сохранена на диск");

    entity_state.add_entity_locally(&final_entity);

    println!("Сущность успешно добавлена локально");

    app.emit("OnEntityCreated", &final_entity).map_err(|e| e.to_string())?;
    Ok(final_entity)
}

#[tauri::command]
pub async fn update_entity(
    app: tauri::AppHandle,
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<ApiResponse<()>, String> {
    let response = entity_service::update_entity::<()>(api_state.inner(), &entity).await?;
    entity_state.update_entity_locally(&entity);

    app.emit("OnEntityUpdated", &entity).map_err(|e| e.to_string())?;
    Ok(response)
}
#[tauri::command]
pub async fn delete_entity(
    app: tauri::AppHandle,
    api_state: tauri::State<'_, ApiClient>,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<ApiResponse<()>, String> {
    let response = entity_service::delete_entity::<()>(api_state.inner(), &entity).await?;
    entity_state.delete_entity_locally(&entity);
    app.emit("OnEntityDeleted", &entity).map_err(|e| e.to_string())?;
    Ok(response)
}
