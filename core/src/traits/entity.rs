use std::path::PathBuf;
use uuid::Uuid;
use crate::entities::entity::EntityType;

pub trait EntityLike{
    fn id(&self) -> Uuid;
    fn user_id(&self) -> Uuid;
    fn  project_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn thumbnail(&self) -> PathBuf;
}