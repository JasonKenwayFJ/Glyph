use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum Source {
    File(PathBuf),
    Url(String),
}