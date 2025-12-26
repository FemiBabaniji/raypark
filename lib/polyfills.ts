// Polyfill for Iterator.prototype.toArray() for v0 runtime compatibility
// This fixes the "L.current.values().toArray is not a function" error

if (typeof Iterator !== "undefined" && !Iterator.prototype.toArray) {
  // @ts-ignore - Adding polyfill for missing method
  Iterator.prototype.toArray = function () {
    return Array.from(this)
  }
}

// Polyfill for Map/Set values().toArray() pattern
if (typeof Map !== "undefined") {
  const originalMapValues = Map.prototype.values
  // @ts-ignore
  Map.prototype.values = function () {
    const iterator = originalMapValues.call(this)
    if (!iterator.toArray) {
      // @ts-ignore
      iterator.toArray = function () {
        return Array.from(this)
      }
    }
    return iterator
  }
}

if (typeof Set !== "undefined") {
  const originalSetValues = Set.prototype.values
  // @ts-ignore
  Set.prototype.values = function () {
    const iterator = originalSetValues.call(this)
    if (!iterator.toArray) {
      // @ts-ignore
      iterator.toArray = function () {
        return Array.from(this)
      }
    }
    return iterator
  }
}

export {}
