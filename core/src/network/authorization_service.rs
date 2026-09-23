use serde::Serialize;
use crate::dto_entities::user_dto::UserDto;
use crate::entities::user_entity::User;
use crate::network::api_client::{ApiClient};

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
) -> Result<User, String> {
    let body = AuthorizationRequest {
        email: email.to_string(),
        password: password.to_string(),
    };

    let response = client
        .post::<AuthorizationRequest, User>("/api/auth/login", &body)
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

pub async fn registration(
    client: &ApiClient,
    data: &UserDto
) -> Result<String, String> {
    let body = RegistrationRequest {
        username: data.user_name.to_string(),
        email: data.email.to_string(),
        password: data.password.to_string(),
        image_path: data.thumbnail.clone()
            .unwrap_or_else(|| "/glyph-default-userpfp.png".to_string()),

    };

    let response = client
        .post::<RegistrationRequest, String>("/api/auth/register", &body)
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

pub async fn verify_user(
    client: &ApiClient,
    data: String
) -> Result<bool, String>{
    let response = client
        .post::<String, bool>("/api/auth/verify", &data)
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

/// Удаляет аккаунт на сервере.
///
/// Путь `api/auth/account/{id}` — предположение. У клиента пока нет заголовка
/// Authorization (токен нигде не подставляется), поэтому идентификатор уходит
/// прямо в адрес. Сверься с сервером: если ручка защищённая, то сначала нужно
/// добавить токен в ApiClient — иначе здесь всегда будет 401.
pub async fn delete_account(client: &ApiClient, user: &User) -> Result<(), String> {
    client
        .delete(format!("api/auth/account/{}", user.id))
        .await
        .map_err(|error| {
            println!("Не удалось удалить аккаунт на сервере: {error}");
            error
        })
}