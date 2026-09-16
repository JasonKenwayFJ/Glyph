use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserConfig {
    theme: String,
    language: String,
    auto_save: bool,
    auto_save_interval: u32,
    notifications_enabled: bool,
    use_online_features: bool,
}

impl Default for UserConfig {
    fn default() -> Self {
        Self {
            theme: "Dark".to_string(),
            language: "Ru".to_string(),
            auto_save: false,
            auto_save_interval: 0,
            notifications_enabled: true,
            use_online_features: false,
        }
    }
}

impl UserConfig {
    pub fn new(
        theme: String,
        language: String,
        auto_save: bool,
        auto_save_interval: u32,
        notifications_enabled: bool,
        use_online_features: bool,
    ) -> Self {
        Self {
            theme,
            language,
            auto_save,
            auto_save_interval,
            notifications_enabled,
            use_online_features,
        }
    }

    pub fn default_json() -> String {
        serde_json::to_string_pretty(&Self::default()).unwrap()
    }
}