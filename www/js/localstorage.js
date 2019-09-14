var LocalStorage = {
	  DEFAULT_SETTINGS: {
	  	  fruit: [],
	  	  vegetable: [],
	  	  meat: [],
	  	  grain: [],
	  	  pastry: [],
	  	  processed: [],
	  	  last_scanned: [],
	  	  initial_start: false,
        pg_start: 0,
        pg_end: 4,
        combined: []
	  },

initialize: function() {
    for (key in this.DEFAULT_SETTINGS) {
      if (this.get(key) == null) this.set(key, this.DEFAULT_SETTINGS[key]);
    }
  },


  /**
   * Access a value from window.localStorage.
   * @param {string} key - The key that the value is associated with.
   * @returns {json} The value for the specified key.
   */
  get: function(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },


  /**
   * Set a key-value pair for window.localStorage.
   * @param {string} key
   * @param {json} value
   */
  set: function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },



  /**
   * Clear all key-value pairs for window.localStorage.
   */
  clear: function() {
    window.localStorage.clear();
  },

}

LocalStorage.initialize();

