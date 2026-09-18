use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::entity::Entity;
use crate::enums::entity_type::EntityType;
use crate::traits::storable::Storable;

#[derive(Clone,Serialize, Deserialize, PartialEq)]
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
#[derive(Clone, Serialize, Deserialize)]
pub struct Plugin {
    pub id: Uuid,
    pub title: String,
    pub description: String,

    pub version: String,
    pub author: String,

    pub tags: Vec<PluginTag>,

    pub glyph_version: String,
    pub size: u64,
    pub enabled: bool,
    pub entity_type: EntityType,
    pub code: String,
}
impl Plugin {
    pub fn new(
        id: Uuid,
        title: String,
        description: String,
        version: String,
        author: String,
        tags: Vec<PluginTag>,
        glyph_version: String,
        size: u64,
        enabled: bool,
        code: String
        
    ) -> Self {
        Plugin{
            id,
            title,
            description,
            version,
            author,
            tags,
            glyph_version,
            size,
            enabled,
            code,
            entity_type: EntityType::Plugin
        }
    }
}
impl Storable for Plugin{
    fn file_name(&self) -> String {self.title.clone()}

    fn storage_id(&self) -> Uuid{
        self.id
    }
    fn entity_type(&self) -> EntityType{
        self.entity_type
    }
}
