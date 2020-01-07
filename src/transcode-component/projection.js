module.exports = {
  $init: {
    transcodeId: null,
    source: null,
    transcodedUri: null,
    isTranscoded: false
  }
  // Need to add handlers for any event types that affect this projection.
  // In our present case, that's just the "Transcoded" event
}
