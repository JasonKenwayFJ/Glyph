use std::path::PathBuf;
use uuid::Uuid;
use crate::enums::entity_type::EntityType;

pub trait EntityLike{
    fn id(&self) -> Uuid;
    fn user_id(&self) -> Uuid;
    fn  project_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn thumbnail(&self) -> PathBuf;
}