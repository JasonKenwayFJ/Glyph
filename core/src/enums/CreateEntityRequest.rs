use serde::Deserialize;
use crate::dto_entities::card_dto::CardDto;
use crate::dto_entities::document_dto::DocumentDto;
use crate::dto_entities::plugin_dto::PluginDto;
use crate::dto_entities::project_dto::ProjectDto;
use crate::dto_entities::task_dto::TaskDto;
use crate::dto_entities::user_dto::UserDto;

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum CreateEntityRequest {
    User(UserDto),
    Project(ProjectDto),
    Plugin(PluginDto),
    Card(CardDto),
    Document(DocumentDto),
    Task(TaskDto)
}