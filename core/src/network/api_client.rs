pub struct ApiClient{
    base_url: String,
    client: reqwest::Client
}

impl ApiClient {
    pub fn new(base_url: &str) -> ApiClient {
        ApiClient {
            base_url: base_url.to_string(),
            client: reqwest::Client::new()
        }
    }

    pub async fn post(&self, path: &str, json_body: String) -> Result<String,String>{
        let url = format!("{}/{}", self.base_url, path);

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .body(json_body)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        let status = response.status();
        let text = response.text().await.map_err(|err| err.to_string())?;

        if !status.is_success() {
            return Err(format!("Сервер ответил ошибкой {}: {}", status, text));
        }

        Ok(text)
    }
}