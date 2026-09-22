use std::path::PathBuf;
use chrono::{DateTime, Utc};
use crate::enums::entity_type::EntityType;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::traits::entity_like::EntityLike;
use crate::traits::trashable::Trashable;

#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub enum PluginTag {
    UI,
    Logic,
    Window,
    Automation,
}
#[derive(Clone,Serialize, Deserialize, PartialEq)]
pub enum PluginPermission {
    Filesystem,
    Network,
    Process,
    Clipboard,
    Notifications,
    Camera,
    Microphone,
    Project,
    UserData,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct PluginManifest {
    pub id: Uuid,
    pub name: String,
    pub version: String,

    pub entry_point: String,
    pub permissions: Vec<PluginPermission>,
}
#[derive(Clone, Serialize, Deserialize, PartialEq)]
pub struct Plugin {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub description: String,
    pub thumbnail: Option<PathBuf>,
    pub version: String,
    pub author: String,

    pub tags: Vec<PluginTag>,

    pub glyph_version: String,
    pub size: u64,
    pub enabled: bool,
    pub entity_type: EntityType,
    pub js_code: String,
    pub html_code: String,
    pub css_code: String,
}
impl Plugin {
    pub fn new(
        id: Uuid,
        user_id: Uuid,
        title: String,
        description: String,
        thumbnail: Option<PathBuf>,
        version: String,
        author: String,
        tags: Vec<PluginTag>,
        glyph_version: String,
        size: u64,
        enabled: bool,
        js_code: String,
        html_code: String,
        css_code: String,
        
    ) -> Self {
        Plugin{
            id,
            user_id,
            title,
            description,
            thumbnail,
            version,
            author,
            tags,
            glyph_version,
            size,
            enabled,
            js_code,
            html_code,
            css_code,
            entity_type: EntityType::Plugin
        }
    }
}

impl Trashable for Plugin {
    fn is_deleted(&self) -> bool {
        true
    }

    fn deleted_at(&self) -> Option<DateTime<Utc>> {
        None
    }

    fn move_to_trash(&mut self) {
        todo!()
    }

    fn restore(&mut self) {
        todo!()
    }
}

#[typetag::serde]
impl EntityLike for Plugin{
    fn id(&self) -> Uuid {self.id}
    fn user_id(&self) -> Uuid {self.user_id}
    fn project_id(&self) -> Uuid {self.id}
    fn entity_type(&self) -> EntityType {self.entity_type}
    fn thumbnail(&self) -> PathBuf { self.thumbnail.clone().unwrap_or_else(| | PathBuf::from("public/glyph-default-cover.svg")) }
    fn file_name(&self) -> String {
        self.title.clone()
    }
    fn clone_box(&self) -> Box<dyn EntityLike> {
        Box::new(self.clone())
    }
}

