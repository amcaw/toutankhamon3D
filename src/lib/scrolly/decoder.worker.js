import * as MP4Box from 'mp4box';

class Writer {
  constructor(size) {
    this.data = new Uint8Array(size);
    this.idx = 0;
    this.size = size;
  }

  getData() {
    if (this.idx !== this.size)
      throw new Error('Mismatch between size reserved and sized used');
    return this.data.slice(0, this.idx);
  }

  writeUint8(value) {
    this.data.set([value], this.idx);
    this.idx += 1;
  }

  writeUint16(value) {
    const arr = new Uint16Array(1);
    arr[0] = value;
    const buffer = new Uint8Array(arr.buffer);
    this.data.set([buffer[1], buffer[0]], this.idx);
    this.idx += 2;
  }

  writeUint8Array(value) {
    this.data.set(value, this.idx);
    this.idx += value.length;
  }
}

const getExtradata = (avccBox) => {
  let i;
  let size = 7;
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    size += 2 + avccBox.SPS[i].length;
  }
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    size += 2 + avccBox.PPS[i].length;
  }

  const writer = new Writer(size);

  writer.writeUint8(avccBox.configurationVersion);
  writer.writeUint8(avccBox.AVCProfileIndication);
  writer.writeUint8(avccBox.profile_compatibility);
  writer.writeUint8(avccBox.AVCLevelIndication);
  writer.writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));

  writer.writeUint8(avccBox.nb_SPS_nalus + (7 << 5));
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    writer.writeUint16(avccBox.SPS[i].length);
    writer.writeUint8Array(avccBox.SPS[i].nalu);
  }

  writer.writeUint8(avccBox.nb_PPS_nalus);
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    writer.writeUint16(avccBox.PPS[i].length);
    writer.writeUint8Array(avccBox.PPS[i].nalu);
  }

  return writer.getData();
};

function computeTarget(width, height, maxLongEdge) {
  if (!maxLongEdge || !width || !height) return null;

  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) return null;

  const scale = maxLongEdge / longEdge;
  return {
    width: Math.max(2, Math.round(width * scale)),
    height: Math.max(2, Math.round(height * scale)),
  };
}

function decode({ src, maxLongEdge, debug }) {
  if (
    typeof VideoDecoder !== 'function' ||
    typeof EncodedVideoChunk !== 'function'
  ) {
    postMessage({ type: 'unsupported' });
    return;
  }

  const mp4boxfile = MP4Box.createFile();
  let codec;
  let target = null;
  let frameIndex = 0;
  const pending = [];

  const decoder = new VideoDecoder({
    output: (frame) => {
      const index = frameIndex;
      frameIndex += 1;

      const options = { resizeQuality: 'low' };
      if (target) {
        options.resizeWidth = target.width;
        options.resizeHeight = target.height;
      }

      const promise = createImageBitmap(frame, options).then((bitmap) => {
        frame.close();
        postMessage({ type: 'frame', index, bitmap }, [bitmap]);
      });

      pending.push(promise);
    },
    error: (e) => {
      postMessage({
        type: 'error',
        message: String(e && e.message ? e.message : e),
      });
    },
  });

  mp4boxfile.onError = (e) => {
    postMessage({ type: 'error', message: String(e) });
  };

  mp4boxfile.onReady = (info) => {
    if (info && info.videoTracks && info.videoTracks[0]) {
      const track = info.videoTracks[0];
      [{ codec }] = info.videoTracks;
      if (debug) console.info('Video with codec:', codec);

      const width = (track.video && track.video.width) || track.track_width;
      const height = (track.video && track.video.height) || track.track_height;
      target = computeTarget(width, height, maxLongEdge);

      const avccBox =
        mp4boxfile.moov.traks[0].mdia.minf.stbl.stsd.entries[0].avcC;
      const extradata = getExtradata(avccBox);

      decoder.configure({ codec, description: extradata });

      mp4boxfile.setExtractionOptions(track.id);
      mp4boxfile.start();
    } else {
      postMessage({
        type: 'error',
        message: 'URL provided is not a valid mp4 video file.',
      });
    }
  };

  mp4boxfile.onSamples = (track_id, ref, samples) => {
    for (let i = 0; i < samples.length; i += 1) {
      const sample = samples[i];

      decoder.decode(
        new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: sample.cts,
          duration: sample.duration,
          data: sample.data,
        }),
      );
    }
  };

  fetch(src)
    .then((res) => {
      if (!res.ok) {
        postMessage({
          type: 'error',
          message: `Failed to fetch video: ${res.status} ${res.statusText}`,
        });
        return;
      }

      const reader = res.body.getReader();
      let offset = 0;

      const append = ({ done, value }) => {
        if (done) {
          mp4boxfile.flush();
          decoder
            .flush()
            .then(() => Promise.all(pending))
            .then(() => {
              postMessage({ type: 'done' });
              if (decoder.state !== 'closed') decoder.close();
            })
            .catch((e) => {
              postMessage({
                type: 'error',
                message: String(e && e.message ? e.message : e),
              });
            });
          return null;
        }

        const buf = value.buffer;
        buf.fileStart = offset;
        offset += buf.byteLength;
        mp4boxfile.appendBuffer(buf);

        return reader.read().then(append);
      };

      reader.read().then(append);
    })
    .catch((e) => {
      postMessage({
        type: 'error',
        message: String(e && e.message ? e.message : e),
      });
    });
}

self.onmessage = (event) => {
  if (event.data && event.data.type === 'decode') decode(event.data);
};
