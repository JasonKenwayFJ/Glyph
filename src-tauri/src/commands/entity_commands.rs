use crate::glyph_fs::{deleter, loader, writer};
use glyph_core::dto_entities::entity_dto::EntityDto;
use glyph_core::enums::entity::Entity;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::ProjectManager;
use tauri::{Emitter, Manager};

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

    let loaded = loader::load_entities(&app_data_dir)
        .await?;
    entity_state.hydrate(loaded);
    entity_state.get_entities(entity_type, project.id)
}


#[tauri::command]
pub async fn create_entity(
    app: tauri::AppHandle,
    user_state: tauri::State<'_, UserManager>,
    entity_state: tauri::State<'_, EntityManager>,
    project_state: tauri::State<'_, ProjectManager>,
    entity: EntityDto,
) -> Result<Entity, String> {

    let project_id = project_state.get_project().
        ok_or("No active project found".to_string())?.id;
    let user_id = user_state.get_user().
        ok_or("No active user found".to_string())?.id;

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    println!("App data dir: {}", app_data_dir.display());

    let final_entity = entity.get_entity(project_id, user_id);

    // let response =
    //     entity_service::create_entity::<()>(api_state.inner(), &final_entity).await;
    //
    // if response.is_err(){
    //     final_entity.is_pending = true;
    // }


    writer::save_to_disk(&app_data_dir, &final_entity).await?;

    println!("Сущность успешно сохранена на диск");

    entity_state.add_entity_locally(&final_entity);

    println!("Сущность успешно добавлена локально");

    app.emit("OnEntityCreated", &final_entity).map_err(|e| e.to_string())?;
    Ok(final_entity)
}

#[tauri::command]
pub async fn update_entity(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<(), String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    entity_state.update_entity_locally(&entity);
    writer::update_on_disk(&app_data_dir, &entity).await?;

    app.emit("OnEntityUpdated", &entity).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub async fn soft_delete_entity(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    entity: Entity,
) -> Result<(), String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    entity_state.delete_entity_locally(&entity);
    deleter::_soft_delete(&app_data_dir, &entity).await?;

    app.emit("OnEntityDeleted", &entity).map_err(|e| e.to_string())?;
    Ok(())
}

