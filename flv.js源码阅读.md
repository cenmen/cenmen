## 了解项目

用纯 JavaScript 编写的 HTML5 Flash 视频 (FLV) 播放器，不含 Flash。flv.js 的工作原理是将 FLV 文件流转换为 ISO BMFF（分段 MP4）片段，然后通过<video\>的媒体源扩展 API 将 mp4 片段提供给 HTML5 元素。

## 亮点

- 具有 H.264 + AAC / MP3 编解码器播放功能的 FLV 容器
- 多部分分段视频播放
- HTTP FLV 低延迟直播流播放
- FLV over WebSocket 实时流播放
- 与 Chrome、FireFox、Safari 10、IE11 和 Edge 兼容
- 极低的开销，并由您的浏览器加速硬件！

## 参考资料

- [全面进阶 H5 直播（上）](https://cloud.tencent.com/developer/article/1020510)
- [全面进阶 H5 直播（下）](https://cloud.tencent.com/developer/article/1005457)
- [软编码 Flv 到 Mp4 容器系列](https://blog.csdn.net/g332065255/article/details/72293670)
- [FLV 封装格式](https://blog.csdn.net/leixiaohua1020/article/details/17934487)
- [浏览器支持视频编码格式表](https://wiki.whatwg.org/wiki/Video_type_parameters#Browser_Support)
- [Media 事件](https://www.w3school.com.cn/tags/html_ref_eventattributes.asp)
- [HTML DOM Video 对象](https://www.w3school.com.cn/jsref/dom_obj_video.asp)
- [MediaSource - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)
- [ReadableStream.getReader()](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream/getReader)

## 阅读

flv.js 的核心代码摘录（FetchStreamLoader 模式)

```javascript
import EventEmitter from "events"

var flvjs = {
  createPlayer: createPlayer(),
}

var flvPlayer = flvjs.createPlayer({
  type: "flv",
  url: "http://example.com/flv/video.flv",
})
flvPlayer.attachMediaElement(videoElement)

function createPlayer(mediaDataSource, optionalConfig) {
  /* ① 创建 FlvPlayer 实例返回 */
  return new FlvPlayer(mediaDataSource, optionalConfig)
}

class FlvPlayer {
  attachMediaElement(mediaElement) {
    /* ②  attachMediaElement 被调用，创建 MSEController 实例并传入 source_open 回调执行 load()*/
    this._msectl = new MSEController()
    this._msectl.on("sourceopen", this.load())
    this._msectl.attachMediaElement(mediaElement)
  }

  load() {
    /* ⑥ load() 方法被回调调用，创建 Transmuxer 实例并注册监听事件*/
    this._transmuxer = new Transmuxer(this._mediaDataSource, this._config)

    this._transmuxer.on("init_segment", (type, is) => {
      /* ㉑ 触发回调 */
      this._msectl.appendInitSegment(is)
    })
    this._transmuxer.on("media_segment", (type, ms) => {
      /* ㉕ 触发回调 */
      this._msectl.appendMediaSegment(ms)
    })
    /* ⑧ 调用 Transmuxer 的 open()*/
    this._transmuxer.open()
  }
}

class MSEController {
  constructor(config) {
    this._mediaSource = null
    this._emitter = new EventEmitter()
    this._mimeTypes = {
      video: null,
      audio: null,
    }
    this._sourceBuffers = {
      video: null,
      audio: null,
    }
    this._lastInitSegments = {
      video: null,
      audio: null,
    }
    this._pendingSegments = {
      video: [],
      audio: [],
    }
  }

  attachMediaElement(mediaElement) {
    /* ③ 创建 MediaSource 实例并添加 sourceopen 监听 */
    let ms = (this._mediaSource = new window.MediaSource())
    ms.addEventListener("sourceopen", this._onSourceOpen)
    // ms.addEventListener("sourceended", this.e.onSourceEnded)
    // ms.addEventListener("sourceclose", this.e.onSourceClose)

    this._mediaSourceObjectURL = window.URL.createObjectURL(this._mediaSource)
    /* ④ 将底层的流（MS）和 video.src 连接中间者 */
    mediaElement.src = this._mediaSourceObjectURL
  }

  appendInitSegment(initSegment, deferred) {
    /* ㉒ 初始化资源类(mime)和音视频资源 segment */
    let is = initSegment
    let mimeType = `${is.container}`
    if (is.codec && is.codec.length > 0) {
      mimeType += `;codecs=${is.codec}`
    }

    let firstInitSegment = false

    this._lastInitSegments[is.type] = is

    if (mimeType !== this._mimeTypes[is.type]) {
      if (!this._mimeTypes[is.type]) {
        firstInitSegment = true
        try {
          /* MIME 列表：https://wiki.whatwg.org/wiki/Video_type_parameters#Browser_Support */
          let sb = (this._sourceBuffers[is.type] = this._mediaSource.addSourceBuffer(mimeType))
          sb.addEventListener("error", this.e.onSourceBufferError)
          sb.addEventListener("updateend", this.e.onSourceBufferUpdateEnd)
        } catch (error) {}
      }
      this._mimeTypes[is.type] = mimeType
    }
  }

  appendMediaSegment(mediaSegment) {
    /* ㉖ 添加 segement 到队列 */
    let ms = mediaSegment
    this._pendingSegments[ms.type].push(ms)
    let sb = this._sourceBuffers[ms.type]
    if (sb && !sb.updating && !this._hasPendingRemoveRanges()) {
      this._doAppendSegments()
    }
  }

  _onSourceOpen() {
    this._mediaSource.removeEventListener("sourceopen", this.e.onSourceOpen)
    if (this._hasPendingSegments()) {
      this._doAppendSegments()
    }
    /* ⑤ sourceopen 触发 */
    this._emitter.emit("sourceopen")
  }

  _doAppendSegments() {
    let pendingSegments = this._pendingSegments
    for (let type in pendingSegments) {
      if (pendingSegments[type].length > 0) {
        try {
          /* ㉗ 添加视频流，实现播放 */
          this._sourceBuffers[type].appendBuffer(segment.data)
        } catch (error) {}
      }
    }
  }
}

class Transmuxer {
  constructor(mediaDataSource, config) {
    this._emitter = new EventEmitter()
    /* ⑦ 创建 TransmuxingController 实例并注册监听事件 */
    this._controller = new TransmuxingController(mediaDataSource, config)
    this._controller.on("init_segment", this._onInitSegment.bind(this))
    this._controller.on("media_segment", this._onMediaSegment.bind(this))
  }

  open() {
    /* ⑨ 调用 TransmuxingController 的 start()*/
    this._controller.start()
  }

  _onInitSegment(type, initSegment) {
    Promise.resolve().then(() => {
      /* ⑳ 触发回调 */
      this._emitter.emit("init_segment", type, initSegment)
    })
  }

  _onMediaSegment(type, mediaSegment) {
    Promise.resolve().then(() => {
      /* ㉔ 触发回调 */
      this._emitter.emit("media_segment", type, mediaSegment)
    })
  }
}

class TransmuxingController {
  constructor(mediaDataSource, config) {
    this._emitter = new EventEmitter()
    this._demuxer = null
    this._remuxer = null
    this._ioctl = null
  }

  start() {
    this._loadSegment(0)
    // this._enableStatisticsReporter()
  }

  _loadSegment(segmentIndex, optionalFrom) {
    /* ⑩ 创建 IOController 实例并绑定事件 */
    let ioctl = (this._ioctl = new IOController(dataSource, this._config, segmentIndex))
    ioctl.onDataArrival = this._onInitChunkArrival.bind(this)
    ioctl.onComplete = this._onIOComplete.bind(this)
    /* ⑫ 调用 IOController 的 open()*/
    ioctl.open(optionalFrom)
  }

  _onInitChunkArrival(data, byteStart) {
    /* ⑱ 触发回调，创建 FLVDemuxer 实例，创建 MP4Remuxer 实例并注册事件 */
    this._demuxer = new FLVDemuxer(FLVDemuxer.probe(data).match, this._config)
    this._remuxer = new MP4Remuxer(this._config)
    this._remuxer.bindDataSource(this._demuxer.bindDataSource(this._ioctl))
    this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this)
    this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this)
  }

  _onIOComplete(extraData) {
    /* ⑰ onComplete 回调，调用 MP4Remuxer 的 flushStashedSamples() */
    let segmentIndex = extraData
    let nextSegmentIndex = segmentIndex + 1
    if (nextSegmentIndex < this._mediaDataSource.segments.length) {
      this._remuxer.flushStashedSamples()
      this._loadSegment(nextSegmentIndex)
    } else {
      this._remuxer.flushStashedSamples()
      // this._emitter.emit(TransmuxingEvents.LOADING_COMPLETE)
    }
  }

  _onRemuxerInitSegmentArrival(type, initSegment) {
    /* ⑲ 触发回调，initSegment 为已转换的 Segment (flv => mp4) */
    this._emitter.emit("init_segment", type, initSegment)
  }

  _onRemuxerMediaSegmentArrival(type, mediaSegment) {
    /* ㉓ 触发回调，initSegment 为已转换的 Segment (flv => mp4) */
    this._emitter.emit("media_segment", type, mediaSegment)
  }
}

class FLVDemuxer {
  bindDataSource(loader) {
    loader.onDataArrival = this.parseChunks.bind(this)
    return this
  }
}

class MP4Remuxer {
  flushStashedSamples() {
    this._remuxVideo(videoTrack, true)
    this._remuxAudio(audioTrack, true)
  }

  _remuxAudio(audioTrack, force) {
    this._onMediaSegment("audio", {
      type: "audio",
      data: this._mergeBoxes(moofbox, mdatbox).buffer,
      sampleCount: mp4Samples.length,
      info: info,
    })
  }

  _remuxVideo(videoTrack, force) {
    this._onMediaSegment("video", {
      type: "video",
      data: this._mergeBoxes(moofbox, mdatbox).buffer,
      sampleCount: mp4Samples.length,
      info: info,
    })
  }

  _mergeBoxes(moof, mdat) {
    let result = new Uint8Array(moof.byteLength + mdat.byteLength)
    result.set(moof, 0)
    result.set(mdat, moof.byteLength)
    return result
  }

  bindDataSource(producer) {
    producer.onDataAvailable = this.remux.bind(this)
    producer.onTrackMetadata = this._onTrackMetadataReceived.bind(this)
    return this
  }

  _onTrackMetadataReceived(type, metadata) {
    this._onInitSegment(type, {
      type: type,
      data: metabox.buffer,
      codec: codec,
      container: `${type}/${container}`,
      mediaDuration: metadata.duration, // in timescale 1000 (milliseconds)
    })
  }

  set onMediaSegment(callback) {
    this._onMediaSegment = callback
  }

  set onInitSegment(callback) {
    this._onInitSegment = callback
  }
}

class IOController {
  constructor(dataSource, config, extraData) {
    /* ⑪ 选择 loader (FetchStreamLoader) 创建实例并绑定事件 */
    this._loader = null
    this._loaderClass = null
    this._selectLoader()
    this._createLoader()
  }

  _selectLoader() {
    // if (this._config.customLoader != null) {
    //     this._loaderClass = this._config.customLoader;
    // } else if (this._isWebSocketURL) {
    //     this._loaderClass = WebSocketLoader;
    // } else if (FetchStreamLoader.isSupported()) {
    this._loaderClass = FetchStreamLoader
    // } else if (MozChunkedLoader.isSupported()) {
    //     this._loaderClass = MozChunkedLoader;
    // } else if (RangeLoader.isSupported()) {
    //     this._loaderClass = RangeLoader;
    // } else {
    //     throw new RuntimeException('Your browser doesn\'t support xhr with arraybuffer responseType!');
  }

  _createLoader() {
    this._loader = new this._loaderClass(this._seekHandler, this._config)
    this._loader.onDataArrival = this._onLoaderChunkArrival.bind(this)
    this._loader.onComplete = this._onLoaderComplete.bind(this)
  }

  open(optionalFrom) {
    /* ⑬ 调用 FetchStreamLoader 的 open() */
    this._currentRange = { from: 0, to: -1 }
    this._loader.open(this._dataSource, Object.assign({}, this._currentRange))
  }

  _dispatchChunks(chunks, byteStart) {
    this._currentRange.to = byteStart + chunks.byteLength - 1
    /* ⑰ 触发回调 */
    return this._onDataArrival(chunks, byteStart)
  }

  _onLoaderChunkArrival(chunk, byteStart, receivedLength) {
    /* ⑰ 触发回调 */
    let consumed = this._dispatchChunks(chunk, byteStart)
  }

  _onLoaderComplete(from, to) {
    if (this._onComplete) {
      this._onComplete(this._extraData)
    }
  }

  set onDataArrival(callback) {
    this._onDataArrival = callback
  }

  set onComplete(callback) {
    this._onComplete = callback
  }
}

class FetchStreamLoader extends BaseLoader {
  open(dataSource, range) {
    /* ⑭ fetch 请求参数的 url 获取 flv 资源 */
    fetch(seekConfig.url, params).then((res) => {
      if (res.ok && res.status >= 200 && res.status <= 299) {
        return this._pump.call(this, res.body.getReader())
      }
    })
  }

  _pump(reader) {
    /* ⑮ 递归处理资源数据 */
    return reader.read().then((result) => {
      if (result.done) {
        if (this._onComplete) {
          /* 最后调用 _onComplete */
          this._onComplete(this._range.from, this._range.from + this._receivedLength - 1)
        }
      } else {
        if (this._onDataArrival) {
          /* ⑯ _onDataArrival 被多次调用 */
          this._onDataArrival(chunk, byteStart, this._receivedLength)
        }
        this._pump(reader)
      }
    })
  }

  set onComplete(callback) {
    this._onComplete = callback
  }
}

class BaseLoader {
  get onDataArrival() {
    return this._onDataArrival
  }

  set onDataArrival(callback) {
    this._onDataArrival = callback
  }

  get onComplete() {
    return this._onComplete
  }

  set onComplete(callback) {
    this._onComplete = callback
  }
}
```
