use uuid::Uuid;
use glyph_core::entities::helpers::dto::DataObject;
use glyph_core::entities::user_entity::User;
use glyph_core::enums::entity::Entity;
use glyph_core::enums::entity_type::EntityType;
use glyph_core::managers::entity_manager::EntityManager;
use glyph_core::traits::storable::Storable;
use glyph_core::{Project, ProjectManager};
use glyph_core::dto_entities::project_dto::ProjectDto;

#[tauri::command]
pub async fn get_entities(
    entity_type: EntityType,
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    project_state: tauri::State<'_, ProjectManager>,
) -> Result<Vec<Entity>, String> {
    todo!()
}

#[tauri::command]
pub async fn create<T: DataObject>(
    entity_type: EntityType,
    app: tauri::AppHandle,
    entity_state: tauri::State<'_, EntityManager>,
    project_state: tauri::State<'_, ProjectManager>,
    data: T,
) -> Result<(), String> {
    let project_id = project_state.get_project().unwrap();
    let data = ProjectDto::new(
        "asdas".to_string(),
        "asdasd".to_string(),
        None,
        None,
        Entity::Project(Box::new(Project::new(
            Uuid::new_v4(),
            "temp",
            "temp",
            None,
            false,
        ))),
    );

    let object = data.get_entity();


    match object.entity_type() {
        EntityType::User => {}
        EntityType::Project => { project_state.add_project(object)?; }
        EntityType::Plugin => {}

        EntityType::Card => {}
        EntityType::Document => {}
        EntityType::Trash => {}
        EntityType::Audio => {}
        EntityType::Video => {}
        EntityType::Table => {}
        EntityType::Graph => {}

        EntityType::Note => {}
        EntityType::Task => {}
    }

    Ok(())
}
