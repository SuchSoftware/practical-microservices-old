module.exports = {
  $init: {
    videoId: null,
    uri: null,
    name: null
  },

  Received (video, received) {
    return {
      ...video,
      videoId: received.data.videoId
    }
  },

  Transcoded (video, transcoded) {
    return {
      ...video,
      uri: transcoded.data.transcodedUri
    }
  }
}
