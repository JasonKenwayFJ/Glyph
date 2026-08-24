use serde::{Deserialize, Serialize};
use crate::network::api_client::ApiClient;
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct AuthorizationRequest {
    email: String,
    password: String,
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RegistrationRequest {
    username: String,
    email: String,
    password: String,
    image_path: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenResponse {
    pub token: String,
}

pub async fn authorization(
    client: &ApiClient,
    email: &str,
    password: &str,
) -> Result<TokenResponse, String> {
    let body = AuthorizationRequest {
        email: email.to_string(),
        password: password.to_string(),
    };
    // Шаг 2: превращаем структуру в строку JSON вручную
    let json_body = serde_json::to_string(&body).map_err(|err| err.to_string())?;
    // Шаг 3: отправляем через ApiClient, получаем строку JSON назад
    let response_text = client.post("/api/auth/login", json_body).await?;
    // Шаг 4: разбираем строку JSON в конкретную структуру AuthResponse
    let auth_response : TokenResponse = serde_json::from_str(&response_text).map_err(|err| err.to_string())?;
    Ok(auth_response)
}

pub async fn registration(
    client: &ApiClient,
    username: &str,
    email: &str,
    password: &str,
    image_path: &str
) -> Result<TokenResponse, String> {

    let body = RegistrationRequest {
        username: username.to_string(),
        email: email.to_string(),
        password: password.to_string(),
        image_path: image_path.to_string(),
    };

    let json_body = serde_json::to_string(&body).map_err(|err| err.to_string())?;
    let response_text = client.post("/api/auth/register", &json_body).await?;
    let token : TokenResponse = serde_json::from_str(&response_text).map_err(|err| err.to_string())?;

    Ok(token)
}

