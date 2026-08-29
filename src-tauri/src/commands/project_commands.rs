use crate::file_manager;
use glyph_core::network::api_client::ApiClient;
use glyph_core::{Project, ProjectManager};
use tauri::{Emitter, Manager};
use glyph_core::managers::user_manager::UserManager;
use glyph_core::network::project_service;
#[tauri::command]
pub fn open_project(
    app: tauri::AppHandle,
    state: tauri::State<ProjectManager>,
    project: Project) {
    state.set_project(project.clone());
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
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    let projects = manager.get_projects();

    if projects.unwrap().is_empty() {
        let user = user_manager.get_user();
        let local_response = file_manager::load_projects(&app_data_dir).await?;
        if local_response.is_empty() {
            let response = project_service::get_projects(_api_state.inner(), &user.id).await.map_err(|error|
                format!("Error getting projects: {}", error)
            )?;
            if response.is_empty(){
                return Ok(Vec::new())
            }
            return Ok(Vec::from(response));
        }
        return Ok(Vec::from(local_response))
    }
    Ok(Vec::new())
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

    project.user_id = user_state.get_user().unwrap().id;

    println!("Project: {}", project.user_id);

    let app_data_dir = match app.path().app_data_dir() {
        Ok(path) => {
            println!("App data dir: {}", path.display());
            path
        }
        Err(error) => {
            println!("ERROR: Failed to get app data dir: {}", error);
            return Err(error.to_string());
        }
    };

    println!("Sending project to server...");

    let response = match project_service::create_project(_api_state.inner(), &project).await {
        Ok(response) => {
            println!("Server response received");
            println!("Success: {}", response.success);
            println!("Status: {}", response.status);
            println!("Message: {}", response.message);
            response
        }
        Err(error) => {
            println!("ERROR: Server request failed: {}", error);
            return Err(error);
        }
    };

    if !response.success {
        println!("ERROR: Server rejected project: {}", response.message);
        return Err(response.message);
    }

    println!("Saving project to disk...");

    if let Err(error) = file_manager::save_to_disk(&app_data_dir, &project).await {
        println!("ERROR: Failed to save project to disk: {}", error);
        return Err(error);
    }

    println!("Project successfully saved to disk");

    // let created_project = match response.data {
    //     Some(project) => {
    //         println!("Server returned created project");
    //         project
    //     }
    //     None => {
    //         println!("ERROR: Server did not return created project");
    //         return Err("Сервер не вернул созданный проект".to_string());
    //     }
    // };

    println!("Updating ProjectManager state...");

    state.set_project(project.clone());

    println!("Emitting OnProjectCreated event...");

    if let Err(error) = app.emit("OnProjectCreated", &project) {
        println!("ERROR: Failed to emit event: {}", error);
        return Err(error.to_string());
    }

    println!("=== CREATE PROJECT SUCCESS ===");

    Ok(project)
}
