export default (src, emitFrame, debug, { maxLongEdge } = {}) =>
  new Promise((resolve, reject) => {
    if (typeof Worker !== 'function' || typeof VideoDecoder !== 'function') {
      if (debug)
        console.info('WebCodecs/Worker not available, using video fallback.');
      resolve();
      return;
    }

    let worker;
    try {
      worker = new Worker(new URL('./decoder.worker.js', import.meta.url), {
        type: 'module',
      });
    } catch (e) {
      if (debug) console.warn('Failed to start decoder worker', e);
      resolve();
      return;
    }

    const finish = (fn) => {
      worker.terminate();
      fn();
    };

    worker.onmessage = (event) => {
      const message = event.data;

      switch (message.type) {
        case 'frame':
          emitFrame(message.index, message.bitmap);
          break;
        case 'done':
          finish(resolve);
          break;
        case 'unsupported':
          finish(resolve);
          break;
        case 'error':
          finish(() => reject(new Error(message.message)));
          break;
        default:
          break;
      }
    };

    worker.onerror = (event) => {
      finish(() => reject(new Error(event.message || 'Decoder worker error')));
    };

    worker.postMessage({ type: 'decode', src, maxLongEdge, debug });
  });
