// Polyfill for Iterator.prototype.toArray() for v0 runtime compatibility
// This fixes the "L.current.values().toArray is not a function" error

// Universal toArray helper that works with any iterator
function addToArrayMethod(obj: any) {
  if (obj && typeof obj === "object" && typeof obj[Symbol.iterator] === "function") {
    if (!obj.toArray) {
      obj.toArray = function () {
        const result = []
        for (const item of this) {
          result.push(item)
        }
        return result
      }
    }
  }
  return obj
}

// Polyfill Iterator.prototype if it exists
if (typeof Iterator !== "undefined" && Iterator.prototype) {
  if (!Iterator.prototype.toArray) {
    // @ts-ignore
    Iterator.prototype.toArray = function () {
      return Array.from(this)
    }
  }
}

// Wrap Map.prototype.values to add toArray to returned iterator
if (typeof Map !== "undefined") {
  const originalMapValues = Map.prototype.values
  // @ts-ignore
  Map.prototype.values = function () {
    const iterator = originalMapValues.call(this)
    return addToArrayMethod(iterator)
  }

  const originalMapKeys = Map.prototype.keys
  // @ts-ignore
  Map.prototype.keys = function () {
    const iterator = originalMapKeys.call(this)
    return addToArrayMethod(iterator)
  }

  const originalMapEntries = Map.prototype.entries
  // @ts-ignore
  Map.prototype.entries = function () {
    const iterator = originalMapEntries.call(this)
    return addToArrayMethod(iterator)
  }
}

// Wrap Set.prototype.values to add toArray to returned iterator
if (typeof Set !== "undefined") {
  const originalSetValues = Set.prototype.values
  // @ts-ignore
  Set.prototype.values = function () {
    const iterator = originalSetValues.call(this)
    return addToArrayMethod(iterator)
  }

  const originalSetKeys = Set.prototype.keys
  // @ts-ignore
  Set.prototype.keys = function () {
    const iterator = originalSetKeys.call(this)
    return addToArrayMethod(iterator)
  }

  const originalSetEntries = Set.prototype.entries
  // @ts-ignore
  Set.prototype.entries = function () {
    const iterator = originalSetEntries.call(this)
    return addToArrayMethod(iterator)
  }
}

// Wrap Array.prototype iterator methods
if (typeof Array !== "undefined") {
  const methods = ["values", "keys", "entries"]
  for (const method of methods) {
    if (Array.prototype[method as keyof Array<any>]) {
      const original = Array.prototype[method as keyof Array<any>] as any
      // @ts-ignore
      Array.prototype[method] = function () {
        const iterator = original.call(this)
        return addToArrayMethod(iterator)
      }
    }
  }
}

export {}
