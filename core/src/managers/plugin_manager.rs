use crate::entities::plugin::Plugin;
use std::sync::Mutex;
use uuid::Uuid;

pub struct PluginManager {
    plugins: Mutex<Vec<Plugin>>,
    active_plugins: Mutex<Vec<Plugin>>,
}

impl PluginManager {
    pub fn new() -> PluginManager {
        PluginManager {
            plugins: Mutex::new(Vec::new()),
            active_plugins: Mutex::new(Vec::new()),
        }
    }

    pub fn get_plugin(&self, plugin_id: Uuid) -> Option<Plugin> {
        self.plugins
            .lock()
            .unwrap()
            .iter()
            .find(|plugin| plugin.id == plugin_id)
            .cloned()
    }

    pub fn get_all_plugins(&self) -> Vec<Plugin> {
        self.plugins.lock().unwrap().clone()
    }

    pub fn get_active_plugins(&self) -> Vec<Plugin> {
        self.active_plugins.lock().unwrap().clone()
    }

    pub fn activate_plugin(&self, plugin_id: Uuid) -> Result<(), String> {
        let plugin = {
            let mut plugins = self.plugins.lock().unwrap();

            let plugin = plugins
                .iter_mut()
                .find(|plugin| plugin.id == plugin_id)
                .ok_or("Plugin not found".to_string())?;

            plugin.enabled = true;
            plugin.clone()
        };

        let mut active_plugins = self.active_plugins.lock().unwrap();

        if active_plugins.iter().any(|p| p.id == plugin_id) {
            return Err("Plugin is already active".to_string());
        }

        active_plugins.push(plugin);
        Ok(())
    }

    pub fn deactivate_plugin(&self, plugin_id: Uuid) -> Result<(), String> {
        {
            let mut plugins = self.plugins.lock().unwrap();
            let plugin = plugins
                .iter_mut()
                .find(|plugin| plugin.id == plugin_id)
                .ok_or("Plugin not found".to_string())?;

            plugin.enabled = false;
        }

        {
            let mut active_plugins = self.active_plugins.lock().unwrap();
            let exists = active_plugins.iter().any(|plugin| plugin.id == plugin_id);

            if !exists {
                return Err("Plugin is not active".to_string());
            }

            active_plugins.retain(|plugin| plugin.id != plugin_id);
        }

        Ok(())
    }

    pub fn add_plugin(&self, plugin: Plugin) -> Result<(), String> {
        self.plugins.lock().unwrap().push(plugin);
        Ok(())
    }

    pub fn add_plugins(&self, local_plugins: Vec<Plugin>) {
        self.plugins.lock().unwrap().extend(local_plugins);
    }

    pub fn delete_plugin(&self, plugin_id: Uuid) -> Result<(), String> {
        self.plugins.lock().unwrap().retain(|p| p.id != plugin_id);
        self.active_plugins.lock().unwrap().retain(|p| p.id != plugin_id);
        Ok(())
    }
}