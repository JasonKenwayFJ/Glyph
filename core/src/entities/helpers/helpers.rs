#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Characteristic {
    id: Uuid,
    title: String,
}
impl Characteristic {
    pub fn new(id: Uuid, title: &str) -> Self {
        Characteristic {
            id,
            title: title.to_string(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtraField {
    id: Uuid,
    title: String,
}
impl ExtraField {
    pub fn new(id: Uuid, title: &str) -> Self {
        ExtraField {
            id,
            title: title.to_string(),
        }
    }
}