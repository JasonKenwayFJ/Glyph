use crate::file_manager;
use glyph_core::entities::user_entity::User;
use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::network::project_service;
use glyph_core::{Project, ProjectManager};
use tauri::{Emitter, Manager};

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
    app: tauri::AppHandle,
    manager: tauri::State<'_, ProjectManager>,
    user_manager: tauri::State<'_, UserManager>,
    _api_state: tauri::State<'_, ApiClient>,
) -> Result<Vec<Project>, String> {
    println!("=== get_projects START ===");

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    println!("app_data_dir -> OK: {:?}", app_data_dir);

    let projects = manager.get_projects();

    match projects {
        Some(existing) if !existing.is_empty() => {
            println!("BRANCH: manager projects NOT EMPTY");
            println!("RETURN: {} projects from manager", existing.len());
            println!("=== get_projects END ===");
            Ok(existing)
        }
        _ => {
            println!("BRANCH: manager projects EMPTY");

            let user = user_manager
                .get_user()
                .ok_or_else(|| format!("Error at line {}", 42))?;

            println!("user_manager.get_user -> OK: {}", user.id);

            let local_response = file_manager::load_projects(&app_data_dir).await?;
            println!("load_projects -> {} projects", local_response.len());

            if local_response.is_empty() {
                println!("BRANCH: local projects EMPTY");

                let response = project_service::get_projects(_api_state.inner(), &user.id)
                    .await
                    .map_err(|error| format!("Error getting projects: {}", error))?;

                println!("API get_projects -> {} projects", response.len());

                if response.is_empty() {
                    println!("BRANCH: API projects EMPTY");
                    println!("RETURN: empty Vec");
                    return Ok(Vec::new());
                }

                println!("BRANCH: API projects NOT EMPTY");
                println!("RETURN: {} API projects", response.len());
                return Ok(Vec::from(response));
            }

            println!("BRANCH: local projects NOT EMPTY");
            println!("RETURN: {} local projects", local_response.len());
            Ok(local_response)
        }
    }
}

#[tauri::command]
pub async fn create_project(
    app: tauri::AppHandle,
    state: tauri::State<'_, ProjectManager>,
    user_state: tauri::State<'_, UserManager>,
    _api_state: tauri::State<'_, ApiClient>,
    mut project: Project,
) -> Result<Project, String> {
    println!("=== CREATE PROJECT ===");
    println!("Project: {}", project.title);

    let user: User = user_state
        .get_user()
        .ok_or("Cannot get the user: Create_project::Command".to_string())?;

    project.user_id = user.id;

    println!("Project: {}", project.user_id);

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;

    println!("Sending project to server...");

    let response = project_service::create_project(_api_state.inner(), &project)
        .await
        .map_err(|error| {
            println!("ERROR: Server request failed: {}", error);
            error
        });

    if response.is_err() {
        project.is_pending = true;
    }

    println!("Saving project to disk...");

    if let Err(error) = file_manager::save_to_disk(&app_data_dir, &project).await {
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
