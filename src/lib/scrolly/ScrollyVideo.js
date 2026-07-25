import videoDecoder from './videoDecoder';
import {
  debounce,
  isScrollPositionAtTarget,
  displayMaxLongEdge,
  frameCacheBudgetBytes,
} from './utils';

class ScrollyVideo {
  constructor({
    src,
    scrollyVideoContainer,
    cover = true,
    sticky = true,
    full = true,
    trackScroll = true,
    lockScroll = true,
    transitionSpeed = 8,
    frameThreshold = 0.1,
    useWebCodecs = true,
    onReady = () => {},
    onChange = () => {},
    debug = false,
  }) {
    if (typeof document !== 'object') {
      console.error('ScrollyVideo must be initiated in a DOM context');
      return;
    }

    if (!scrollyVideoContainer) {
      console.error('scrollyVideoContainer must be a valid DOM object');
      return;
    }
    if (!src) {
      console.error('Must provide valid video src to ScrollyVideo');
      return;
    }

    if (scrollyVideoContainer instanceof Element)
      this.container = scrollyVideoContainer;
    else if (typeof scrollyVideoContainer === 'string') {
      this.container = document.getElementById(scrollyVideoContainer);
      if (!this.container)
        throw new Error('scrollyVideoContainer must be a valid DOM object');
    } else {
      throw new Error('scrollyVideoContainer must be a valid DOM object');
    }

    this.src = src;
    this.transitionSpeed = transitionSpeed;
    this.frameThreshold = frameThreshold;
    this.useWebCodecs = useWebCodecs;
    this.cover = cover;
    this.sticky = sticky;
    this.trackScroll = trackScroll;
    this.onReady = onReady;
    this.onChange = onChange;
    this.debug = debug;

    this.video = document.createElement('video');
    this.video.src = src;
    this.video.preload = 'metadata';
    this.video.tabIndex = 0;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.pause();
    this.video.load();

    this.videoPercentage = 0;

    this.container.appendChild(this.video);

    if (sticky) {
      this.container.style.display = 'block';
      this.container.style.position = 'sticky';
      this.container.style.top = '0';
    }

    if (full) {
      this.container.style.width = '100%';
      this.container.style.height = '100vh';
      this.container.style.overflow = 'hidden';
    }

    if (cover) this.setCoverStyle(this.video);

    const ua = typeof navigator === 'object' ? navigator.userAgent || '' : '';
    this.isSafari = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
    this.isChromeIOS = /CriOS/.test(ua);
    if (debug && this.isSafari) console.info('Safari browser detected');
    if (debug && this.isChromeIOS) console.info('Chrome iOS detected');

    this.currentTime = 0;
    this.targetTime = 0;
    this.transitionToken = 0;
    this.canvas = null;
    this.context = null;
    this.frames = [];
    this.frameRate = 0;
    this.destroyed = false;

    const debouncedScroll = debounce(() => {
      window.requestAnimationFrame(() => {
        this.setScrollPercent(this.videoPercentage);
      });
    }, 100);

    this.updateScrollPercentage = (jump) => {
      const containerBoundingClientRect =
        this.container.parentNode.getBoundingClientRect();

      const scrollPercent =
        -containerBoundingClientRect.top /
        (containerBoundingClientRect.height - window.innerHeight);

      if (this.debug) {
        console.info('ScrollyVideo scrolled to', scrollPercent);
      }

      if (this.targetScrollPosition == null) {
        this.setTargetTimePercent(scrollPercent, { jump });
        this.onChange(scrollPercent);
      } else if (isScrollPositionAtTarget(this.targetScrollPosition)) {
        this.targetScrollPosition = null;
      } else if (lockScroll && this.targetScrollPosition != null) {
        debouncedScroll();
      }
    };

    if (this.trackScroll) {
      window.addEventListener('scroll', this.updateScrollPercentage);

      this.video.addEventListener(
        'loadedmetadata',
        () => this.updateScrollPercentage(true),
        { once: true },
      );
    } else {
      this.video.addEventListener(
        'loadedmetadata',
        () => this.setTargetTimePercent(0, { jump: true }),
        { once: true },
      );
    }

    this.resize = () => {
      if (this.debug) console.info('ScrollyVideo resizing...');
      if (this.cover) this.setCoverStyle(this.canvas || this.video);
      this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
    };

    window.addEventListener('resize', this.resize);
    this.video.addEventListener('progress', this.resize);

    this.decodeVideo();
  }

  setVideoPercentage(percentage, options = {}) {
    if (this.videoPercentage === percentage) return;

    if (this.transitioningRaf) {
      window.cancelAnimationFrame(this.transitioningRaf);
    }

    this.videoPercentage = percentage;

    this.onChange(percentage);

    if (this.trackScroll) {
      this.setScrollPercent(percentage);
    }

    this.setTargetTimePercent(percentage, options);
  }

  setCoverStyle(el) {
    if (this.cover) {
      el.style.position = 'absolute';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.minWidth = '101%';
      el.style.minHeight = '101%';

      const { width: containerWidth, height: containerHeight } =
        this.container.getBoundingClientRect();

      const width = el.videoWidth || el.width;
      const height = el.videoHeight || el.height;

      if (this.debug)
        console.info('Container dimensions:', [containerWidth, containerHeight]);
      if (this.debug) console.info('Element dimensions:', [width, height]);

      if (containerWidth / containerHeight > width / height) {
        el.style.width = '100%';
        el.style.height = 'auto';
      } else {
        el.style.height = '100%';
        el.style.width = 'auto';
      }
    }
  }

  async decodeVideo() {
    if (!this.useWebCodecs) {
      if (this.debug)
        console.warn('Cannot perform video decode: `useWebCodes` disabled');

      this.video.preload = 'auto';
      this.video.load();
      this.onReady();

      return;
    }

    if (!this.src) {
      if (this.debug)
        console.warn('Cannot perform video decode: no `src` found');

      return;
    }

    try {
      await videoDecoder(
        this.src,
        (index, bitmap) => {
          if (this.destroyed) {
            bitmap.close();
            return;
          }
          this.frames[index] = bitmap;
        },
        this.debug,
        {
          maxLongEdge: displayMaxLongEdge(),
          budgetBytes: frameCacheBudgetBytes(),
        },
      );
    } catch (error) {
      if (this.debug)
        console.error('Error encountered while decoding video', error);

      this.frames = [];

      this.video.preload = 'auto';
      this.video.load();
    }

    if (this.frames.length === 0) {
      if (this.debug) console.error('No frames were received from webCodecs');

      this.video.preload = 'auto';
      this.video.load();

      this.onReady();
      return;
    }

    this.frameRate = this.frames.length / this.video.duration;
    if (this.debug) console.info('Received', this.frames.length, 'frames');

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.video.style.display = 'none';
    this.container.appendChild(this.canvas);
    if (this.cover) this.setCoverStyle(this.canvas);

    this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));

    this.onReady();
  }

  paintCanvasFrame(frameNum) {
    const currFrame = this.frames[frameNum];

    if (!this.canvas || !currFrame) {
      return;
    }

    if (this.debug) {
      console.info('Painting frame', frameNum);
    }

    this.canvas.width = currFrame.width;
    this.canvas.height = currFrame.height;
    const { width, height } = this.container.getBoundingClientRect();

    if (width / height > currFrame.width / currFrame.height) {
      this.canvas.style.width = '100%';
      this.canvas.style.height = 'auto';
    } else {
      this.canvas.style.height = '100%';
      this.canvas.style.width = 'auto';
    }

    this.context.drawImage(currFrame, 0, 0, currFrame.width, currFrame.height);
  }

  transitionToTargetTime({
    jump,
    transitionSpeed = this.transitionSpeed,
    easing = null,
  }) {
    if (this.debug) {
      console.info(
        'Transitioning targetTime:',
        this.targetTime,
        'currentTime:',
        this.currentTime,
      );
    }

    const diff = this.targetTime - this.currentTime;
    const distance = Math.abs(diff);
    const duration = distance * 1000;
    const isForwardTransition = diff > 0;

    if (this.transitioningRaf) {
      cancelAnimationFrame(this.transitioningRaf);
      this.transitioningRaf = null;
    }

    this.transitionToken += 1;
    const token = this.transitionToken;

    const tick = ({ startCurrentTime, startTimestamp, timestamp }) => {
      if (this.transitionToken !== token) return;

      const progress = (timestamp - startTimestamp) / duration;

      const hasPassedThreshold = isForwardTransition
        ? this.currentTime >= this.targetTime
        : this.currentTime <= this.targetTime;

      if (
        isNaN(this.targetTime) ||
        Math.abs(this.targetTime - this.currentTime) < this.frameThreshold ||
        hasPassedThreshold
      ) {
        this.video.pause();

        if (this.transitioningRaf) {
          cancelAnimationFrame(this.transitioningRaf);
          this.transitioningRaf = null;
        }

        return;
      }

      if (this.targetTime > this.video.duration)
        this.targetTime = this.video.duration;
      if (this.targetTime < 0) this.targetTime = 0;

      const transitionForward = this.targetTime - this.currentTime;
      const easedProgress =
        easing && Number.isFinite(progress) ? easing(progress) : null;
      const easedCurrentTime = isForwardTransition
        ? startCurrentTime +
          easedProgress * Math.abs(distance) * transitionSpeed
        : startCurrentTime -
          easedProgress * Math.abs(distance) * transitionSpeed;

      if (this.canvas) {
        if (jump) {
          this.currentTime = this.targetTime;
        } else if (easedProgress) {
          this.currentTime = easedCurrentTime;
        } else {
          this.currentTime += transitionForward / (256 / transitionSpeed);
        }

        this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
      } else if (
        jump ||
        this.isSafari ||
        !this.useWebCodecs ||
        !isForwardTransition
      ) {
        this.video.pause();

        if (easedProgress) {
          this.currentTime = easedCurrentTime;
        } else {
          this.currentTime += transitionForward / (64 / transitionSpeed);
        }

        if (jump) {
          this.currentTime = this.targetTime;
        }

        this.video.currentTime = this.currentTime;
      } else {
        const playbackRate = Math.max(
          Math.min(transitionForward * 4, transitionSpeed, 16),
          1,
        );
        if (this.debug)
          console.info('ScrollyVideo playbackRate:', playbackRate);
        if (!isNaN(playbackRate)) {
          this.video.playbackRate = playbackRate;
          this.video.play();
        }
        this.currentTime = this.video.currentTime;
      }

      if (typeof requestAnimationFrame === 'function') {
        this.transitioningRaf = requestAnimationFrame((currentTimestamp) =>
          tick({
            startCurrentTime,
            startTimestamp,
            timestamp: currentTimestamp,
          }),
        );
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      this.transitioningRaf = requestAnimationFrame((startTimestamp) => {
        tick({
          startCurrentTime: this.currentTime,
          startTimestamp,
          timestamp: startTimestamp,
        });
      });
    }
  }

  setTargetTimePercent(percentage, options = {}) {
    const targetDuration =
      this.frames.length && this.frameRate
        ? this.frames.length / this.frameRate
        : this.video.duration;
    this.targetTime = Math.max(Math.min(percentage, 1), 0) * targetDuration;

    if (
      !options.jump &&
      Math.abs(this.currentTime - this.targetTime) < this.frameThreshold
    )
      return;

    if (!this.canvas && !this.video.paused) this.video.play();

    this.transitionToTargetTime(options);
  }

  setScrollPercent(percentage) {
    if (!this.trackScroll) {
      console.warn('`setScrollPercent` requires enabled `trackScroll`');
      return;
    }

    const parent = this.container.parentNode;
    const { top, height } = parent.getBoundingClientRect();

    const startPoint = top + window.pageYOffset;
    const containerHeightInViewport = height - window.innerHeight;
    const targetPosition = startPoint + containerHeightInViewport * percentage;

    if (isScrollPositionAtTarget(targetPosition)) {
      this.targetScrollPosition = null;
    } else {
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      this.targetScrollPosition = targetPosition;
    }
  }

  destroy() {
    if (this.debug) console.info('Destroying ScrollyVideo');

    this.destroyed = true;

    if (this.trackScroll)
      window.removeEventListener('scroll', this.updateScrollPercentage);

    window.removeEventListener('resize', this.resize);

    if (this.frames) this.frames.forEach((frame) => frame.close && frame.close());
    this.frames = [];

    if (this.container) this.container.innerHTML = '';
  }
}

export default ScrollyVideo;
