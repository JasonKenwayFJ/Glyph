use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::dto_entities::user_dto::UserDto;
use crate::entities::helpers::data_object::DataObject;
use crate::entities::plugin::{Plugin, PluginTag};
use crate::entities::user_entity::User;
use crate::enums::entity::Entity;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginDto {
    pub title: String,
    pub description: String,
    pub version: String,
    pub author: String,
    pub tags: Vec<PluginTag>,
    pub glyph_version: String,
    pub js_code: String,
    pub html_code: String,
    pub css_code: String,
}

impl PluginDto {
    pub fn get_plugin(&self) -> Plugin {
        Plugin::new(
            Uuid::new_v4(),
            Uuid::new_v4(),
            self.title.clone(),
            self.description.clone(),
            None,
            self.version.clone(),
            self.author.clone(),
            self.tags.clone(),
            self.glyph_version.clone(),
            0,
            false,
            self.css_code.clone(),
            self.html_code.clone(),
            self.js_code.clone(),
        )
    }

    pub fn code(&self) -> (&str, &str, &str) {
        (&self.js_code, &self.html_code, &self.css_code)
    }
}
impl DataObject for PluginDto{
    type Entity = Plugin;

    fn get_title(&self) -> String {self.title.clone()}

    fn get_type(&self) -> Entity {todo!()}

    fn get_entity(&self) -> Self::Entity {
        Plugin::from(self)
    }
}