use glyph_core::{ProjectManager, Project};
use tauri::Emitter;

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