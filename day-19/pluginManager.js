class PluginManager {
  plugins = [];

  add(plugin) {
    this.plugins.push(plugin);
  }

  setPlugins(plugins) {
    this.plugins = plugins;
  }

  get() {
    return this.plugins;
  }
}

const pluginManager = new PluginManager();
module.exports = pluginManager;
