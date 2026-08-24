use serde::{Deserialize, Serialize};
use crate::network::api_client::ApiClient;


pub async fn get_entities(
    client: &ApiClient
) -> Vec<Entity> {
    let entities = client.get_entities().await;

}