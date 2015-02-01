var storage = chrome.storage.sync
var runtime = chrome.runtime

ChromeStorage = {
  /**
   * Save something
   *
   * @param key String key name
   * @param val Any object to save with key
   * [@callback {function([error])}]
   */
  set: function(key, val, fn) {
    (toSave = {})[key] = val
    storage.set(toSave, function() {
      if (fn !== undefined)
        fn.call(ChromeStorage, runtime.lastError)
    })
  },

  /**
   * Retrieve data
   *
   * @param key String of key or Array of keys to retrieve
   * @callback {function(error, results)}
   *   If given one key, results will be just the value
   *   If given an array of keys, results will be an object with key/value pairs
   */
  get: function(key, fn) {
    storage.get(key, function(results) {
      if (key.trim !== undefined)
        results = results[key]
      fn.call(ChromeStorage, runtime.lastError, results)
    })
  },

  /**
   * Retrieve total collection
   *
   * @callback {function(error, results)} results is an object w/ key/value pairs
   */
  all: function(fn) {
    storage.get(null, function(items) {
      fn.call(ChromeStorage, runtime.lastError, items)
    })
  },

  /**
   * Delete data at a key
   *
   * @param key String of key
   * [@callback {function(error)}]
   */
  remove: function(key, fn) {
    storage.remove(key, function() {
      if (fn !== undefined)
        fn.call(ChromeStorage, runtime.lastError)
    })
  }
}
