module.exports = {
  $init: {
    transcodeId: null,
    source: null,
    transcodedUri: null,
    isTranscoded: false
  },

  Transcoded (transcoding, transcoded) {
    return {
      ...transcoding,
      transcodedUri: transcoded.data.transcodedUri,
      isTranscoded: true
    }
  }
}
