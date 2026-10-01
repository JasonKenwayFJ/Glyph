use crate::glyph_fs::writer;
use glyph_core::dto_entities::project_dto::ProjectDto;
use glyph_core::entities::helpers::data_object::DataObject;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::{Project, ProjectManager};
use tauri::{Emitter, Manager};
use uuid::Uuid;

#[tauri::command]
pub fn open_project(app: tauri::AppHandle, state: tauri::State<ProjectManager>, data: Project) {
    state.set_current_project(data.clone());
    app.emit("OnProjectSelected", data).unwrap();
}

#[tauri::command]
pub fn get_project(state: tauri::State<ProjectManager>) -> Option<Project> {
    state.get_project()
}
#[tauri::command]
pub async fn get_projects(
    project_state: tauri::State<'_, ProjectManager>,
) -> Result<Vec<Project>, String> {
    Ok(project_state.get_projects())
}
#[tauri::command]
pub async fn update_project(
    app: tauri::AppHandle,
    state: tauri::State<'_, ProjectManager>,
    data: Project,
) -> Result<(), String> {
    let mut project = state
        .get_project_id(data.id)
        .ok_or("No active project found".to_string())?;

    project.title = data.title.clone();
    project.description = data.description.clone();
    project.thumbnail = data.thumbnail.clone();

    state.update_project(project.clone())?;

    app.emit("OnProjectUpdated", &project)
        .map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn delete_project(
    app: tauri::AppHandle,
    state: tauri::State<'_, ProjectManager>,
    data: Project,
) -> Result<(), String> {
    let project = state
        .get_project_id(data.id)
        .ok_or("No active project found".to_string())?;

    state.delete_project(project.id);

    app.emit("OnProjectDeleted", &project)
        .map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn create_project(
    app: tauri::AppHandle,
    state: tauri::State<'_, ProjectManager>,
    user_state: tauri::State<'_, UserManager>,
    data: ProjectDto,
) -> Result<Project, String> {
    println!("=== CREATE PROJECT ===");
    println!("Project: {}", data.title);

    let user_id: Uuid = user_state.get_user_id().ok_or("Not found active User")?;

    let mut project = data.get_entity();
    project.user_id = user_id;

    println!("Project: {}", project.user_id);

    let app_data_dir = app
        .path()
        .document_dir()
        .expect("no app data dir")
        .join("Glyph");

    // println!("Sending project to server...");
    //
    // let response = project_service::create_project(_api_state.inner(), &project)
    //     .await
    //     .map_err(|error| {
    //         println!("ERROR: Server request failed: {}", error);
    //         error
    //     });
    //
    // if response.is_err() {
    //     project.is_pending = true;
    // }

    println!("Saving project to disk...");

    if let Err(error) = writer::save_to_disk(&app_data_dir, &project).await {
        println!("ERROR: Failed to save project to disk: {}", error);
        return Err(error);
    }

    println!("Project successfully saved to disk");

    println!("Updating ProjectManager state...");

    state.add_project(project.clone())?;
    state.set_current_project(project.clone());

    println!("Emitting OnProjectCreated event...");

    if let Err(error) = app.emit("OnProjectCreated", &project) {
        println!("ERROR: Failed to emit event: {}", error);
        return Err(error.to_string());
    }

    println!("=== CREATE PROJECT SUCCESS ===");
    app.emit("OnProjectCreated", &project)
        .map_err(|e| e.to_string())?;
    Ok(project)
}
