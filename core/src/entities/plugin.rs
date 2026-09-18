use serde::{Deserialize, Serialize};
use uuid::Uuid;
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
pub struct Plugin {
    pub id: Uuid,
    pub name: String,
    pub description: String,

    pub version: String,
    pub author: String,

    pub tags: Vec<PluginTag>,

    pub glyph_version: String,
    pub size: u64,
    pub enabled: bool,
}
#[derive(Clone, Serialize, Deserialize)]
pub struct PluginManifest {
    pub id: Uuid,
    pub name: String,
    pub version: String,

    pub entry_point: String,
    pub permissions: Vec<PluginPermission>,
}