use serde::Deserialize;
use uuid::Uuid;
use crate::entities::plugin::{Plugin, PluginTag};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginDto {
    title: String,
    description: String,
    version: String,
    author: String,
    tags: Vec<PluginTag>,
    glyph_version: String,
    code: String,   // сам исполняемый JS-текст из редактора
}

impl PluginDto {
    pub fn get_plugin(&self) -> Plugin {
        Plugin::new(
            Uuid::new_v4(),
            self.title.clone(),
            self.description.clone(),
            self.version.clone(),
            self.author.clone(),
            self.tags.clone(),
            self.glyph_version.clone(),
            0,
            false,
            self.code.clone(),
        )
    }

    pub fn code(&self) -> &str {
        &self.code
    }
}