use tauri::Manager;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::ProjectManager;
use glyph_core::traits::entity::EntityLike;
use crate::glyph_fs::loader;

#[tauri::command]
pub async fn get_entities(
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    entity_type: EntityType,
    project_state: tauri::State<'_, ProjectManager>,
) -> Result<Vec<Box<dyn EntityLike>>, String> {
    let project = project_state.get_project().ok_or("No active project found".to_string())?;
    let app_data_dir = app.path().document_dir().expect("no app data dir").join("Glyph").join(project.title);
    let loaded = loader::load_entities(&app_data_dir).await?;

    project_state.get_entities(EntityType::Card)?
}