use glyph_core::entities::user_entity::User;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::{Project, ProjectManager};
use tauri::{Emitter, Manager};
use glyph_core::dto_entities::project_dto::ProjectDto;
use glyph_core::entities::helpers::dto::DataObject;
use crate::glyph_fs::{writer};

#[tauri::command]
pub fn open_project(app: tauri::AppHandle, state: tauri::State<ProjectManager>, project: Project) {
    state.set_current_project(project.clone());
    app.emit("OnProjectChanged", project).unwrap();
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
pub async fn create_project(
    app: tauri::AppHandle,
    state: tauri::State<'_, ProjectManager>,
    user_state: tauri::State<'_, UserManager>,
    project: ProjectDto,
) -> Result<Project, String> {
    println!("=== CREATE PROJECT ===");
    println!("Project: {}", project.title);

    let user: User = user_state
        .get_user()
        .ok_or("Cannot get the user: Create_project::Command".to_string())?;

    let project = project.get_entity();

    // project.user_id = user.id;

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

    state.set_current_project(project.clone());

    println!("Emitting OnProjectCreated event...");

    if let Err(error) = app.emit("OnProjectCreated", &project) {
        println!("ERROR: Failed to emit event: {}", error);
        return Err(error.to_string());
    }

    println!("=== CREATE PROJECT SUCCESS ===");
    Ok(project)
}
