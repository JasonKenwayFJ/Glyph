use serde::Serialize;
use crate::network::api_client::{ApiClient, ApiResponse};

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

pub async fn authorization(
    client: &ApiClient,
    email: &str,
    password: &str,
) -> Result<ApiResponse<String>, String> {
    let body = AuthorizationRequest {
        email: email.to_string(),
        password: password.to_string(),
    };

    let response = client
        .post::<AuthorizationRequest, String>("/api/auth/login", &body)
        .await
        .map_err(|e| e.to_string())?;
    if !response.success {
        println!("Error while authorization");
        return Err(response.message);
    }
    println!("Authorized {}", response.status);
    Ok(response)
}

pub async fn registration(
    client: &ApiClient,
    username: &str,
    email: &str,
    password: &str,
    image_path: &str,
) -> Result<ApiResponse<String>, String> {
    let body = RegistrationRequest {
        username: username.to_string(),
        email: email.to_string(),
        password: password.to_string(),
        image_path: image_path.to_string(),
    };

    let response = client
        .post::<RegistrationRequest, String>("/api/auth/register", &body)
        .await
        .map_err(|e| e.to_string())?;
    if !response.success {
        println!("Error while authorization");
        return Err(response.message);
    }
    println!("Authorized {}", response.status);
    Ok(response)
}