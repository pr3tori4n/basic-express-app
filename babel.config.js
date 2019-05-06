module.exports = function (api) {
    api.cache(true);
    //TODO: replace preset with explicit plugins to cut down on babel footprint
    const presets = [ "@babel/preset-env" ];
    const plugins = [ ];
  
    return {
      presets,
      plugins
    };
  }