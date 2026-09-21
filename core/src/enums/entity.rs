use std::path::PathBuf;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::audio_entity::Audio;
use crate::entities::card_entity::Card;
use crate::entities::document_entity::Document;
use crate::entities::graph_entity::GraphEntity;
use crate::entities::note_entity::Note;
use crate::entities::plugin::Plugin;
use crate::entities::table_entity::Table;
use crate::entities::task_entity::Task;
use crate::entities::trash_entity::Trash;
use crate::entities::user_entity::User;
use crate::entities::video_entity::Video;
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use crate::Project;
use crate::traits::entity::EntityLike;
use crate::traits::storable::Storable;
use crate::traits::trashable::Trashable;
//TODO: Добавить User в TS Enum, и перетащить Project на index[1]

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum Entity {
    User(User),
    Project(Box<Project>),
    Card(Card),
    Document(Document),
    Table(Table),
    Task(Task),
    Video(Video),
    Audio(Audio),
    Trash(Trash),
    Plugin(Plugin),
    Note(Note),
    Graph(GraphEntity)
}
