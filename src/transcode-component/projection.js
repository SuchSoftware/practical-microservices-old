module.exports = {
  $init: {
    transcodeId: null,
    source: null,
    destination: null,
    isMoved: false,
    version: -1
  }
  // Need to add handlers for any event types that affect this projection.
  // In our present case, that's just the "Transcoded" event
}
