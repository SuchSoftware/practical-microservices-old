module.exports = {
  $init: {
    videoId: null,
    source: null,
    transcodedUri: null,
    isReceived: false,
    isMoved: false,
    isTranscoded: false,
    isCataloged: false
  },

  Received (video, received) {
    return {
      ...video,
      videoId: received.data.videoId,
      source: received.data.source,
      isReceived: true
    }
  },

  Moved (video, moved) {
    return {
      ...video,
      destination: moved.data.destination,
      isMoved: true
    }
  },

  Transcoded (video, transcoded) {
    return {
      ...video,
      transcodedUri: transcoded.data.transcodedUri,
      isTranscoded: true
    }
  },

  Cataloged (video, cataloged) {
    return {
      ...video,
      isCataloged: true
    }
  }
}
