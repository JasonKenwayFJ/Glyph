use glyph_core::{ProjectManager, Project};
use tauri::Emitter;
use glyph_core::network::api_client::ApiClient;
use glyph_core::network::project_service;
#[tauri::command]
pub fn open_project(
    app: tauri::AppHandle,
    state: tauri::State<ProjectManager>,
    project: Project,
) {
    state.set_project(project.clone());
    app.emit("OnProjectChanged", project).unwrap();
}

#[tauri::command]
pub fn get_project(state: tauri::State<ProjectManager>) -> Option<Project> {
    state.get_project()
}
#[tauri::command]
pub fn get_projects(state: tauri::State<ProjectManager>) -> Option<Vec<Project>>{
    state.get_projects()
}
#[tauri::command]
pub async fn create_project(
    state: tauri::State<'_, ProjectManager>,
    api_state: tauri::State<'_, ApiClient>,
    project: Project,
) -> Result<Project, String> {

    let response = project_service::create_project(
        api_state.inner(),
        &project,
    ).await?;

    let created_project = response
        .data
        .ok_or_else(|| "Сервер не вернул созданный проект".to_string())?;

    state.set_project(created_project.clone());

    Ok(created_project)
}