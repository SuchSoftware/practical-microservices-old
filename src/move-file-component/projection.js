// Paste the projection from exercises/step-004/002-projecting.js here

module.exports = {
  $init: {
    fileId: null,
    source: null,
    destination: null,
    isMoved: false,
    version: -1
  },
  // Need to add handlers for any event types that affect this projection.
  // In our present case, that's just the "Moved" event
  Moved (file, moved) {
    return {
      ...file,
      filedId: moved.data.fileId,
      source: moved.data.source,
      destination: moved.data.destination,
      isMoved: true,
      version: moved.globalPosition
    }
  }
}
