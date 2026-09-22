use serde::Deserialize;
use crate::dto_entities::card_dto::CardDto;
use crate::dto_entities::project_dto::ProjectDto;

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum CreateEntityRequest {
    Card(CardDto),
    Project(ProjectDto),
}