// Global polyfill for Iterator.prototype.toArray()
// This must run before any other JavaScript

;(() => {
  // Helper function to add toArray to any iterator
  function addToArrayMethod(iterator) {
    if (iterator && typeof iterator === "object" && !iterator.toArray) {
      iterator.toArray = function () {
        const result = []
        for (const item of this) {
          result.push(item)
        }
        return result
      }
    }
    return iterator
  }

  // Polyfill Iterator.prototype.toArray if Iterator exists
  if (typeof Iterator !== "undefined" && Iterator.prototype) {
    if (!Iterator.prototype.toArray) {
      Iterator.prototype.toArray = function () {
        return Array.from(this)
      }
    }
  }

  // Patch Map prototype methods
  if (typeof Map !== "undefined") {
    const mapMethods = ["values", "keys", "entries", Symbol.iterator]
    mapMethods.forEach((method) => {
      if (Map.prototype[method]) {
        const original = Map.prototype[method]
        Map.prototype[method] = function () {
          const iter = original.call(this)
          return addToArrayMethod(iter)
        }
      }
    })
  }

  // Patch Set prototype methods
  if (typeof Set !== "undefined") {
    const setMethods = ["values", "keys", "entries", Symbol.iterator]
    setMethods.forEach((method) => {
      if (Set.prototype[method]) {
        const original = Set.prototype[method]
        Set.prototype[method] = function () {
          const iter = original.call(this)
          return addToArrayMethod(iter)
        }
      }
    })
  }

  // Patch Array prototype methods
  if (typeof Array !== "undefined") {
    const arrayMethods = ["values", "keys", "entries", Symbol.iterator]
    arrayMethods.forEach((method) => {
      if (Array.prototype[method]) {
        const original = Array.prototype[method]
        Array.prototype[method] = function () {
          const iter = original.call(this)
          return addToArrayMethod(iter)
        }
      }
    })
  }

  // Also add a global helper that can be called manually if needed
  window.__addIteratorToArray = addToArrayMethod

  console.log("[v0] Global Iterator.prototype.toArray polyfill loaded")
})()
