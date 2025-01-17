/**
 *  File    : media/MediaContent.js
 *  Created : 13/04/2015
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  JClic.js
 *  An HTML5 player of JClic activities
 *  https://projectestac.github.io/jclic.js
 *
 *  @source https://github.com/projectestac/jclic.js
 *
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2000-2020 Educational Telematic Network of Catalonia (XTEC)
 *
 *  Licensed under the EUPL, Version 1.1 or -as soon they will be approved by
 *  the European Commission- subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *
 *  You may obtain a copy of the Licence at:
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  Licence for the specific language governing permissions and limitations
 *  under the Licence.
 *  @licend
 *  @module
 */

/* global Image */

import $ from 'jquery';
import { Point } from '../AWT';
import { nSlash, attrForEach, getBoolean, getAttr, setAttr, svgToURI } from '../Utils';

import generic from './icons/generic.svg';
import audio from './icons/audio.svg';
import mic from './icons/mic.svg';
import movie from './icons/movie.svg';
import music from './icons/music.svg';
import url from './icons/url.svg';

/**
 * This object contains a description of any multimedia content (sound, video, MIDI, voice
 * recording..) or special actions (jump to another point in the sequence, link to an URL, etc.)
 * associated to an {@link module:boxes/ActiveBox.ActiveBox ActiveBox} object.
 */
export class MediaContent {
    /**
     * MediaContent constructor
     * @param {string} type - The type of media. Valid values are: `UNKNOWN`, `PLAY_AUDIO`, `PLAY_VIDEO`,
     * `PLAY_MIDI`, `PLAY_CDAUDIO`, `RECORD_AUDIO`, `PLAY_RECORDED_AUDIO`, `RUN_CLIC_ACTIVITY`,
     * `RUN_CLIC_PACKAGE`, `RUN_EXTERNAL`, `URL`, `EXIT` and `RETURN`
     * @param {string} [file] - Optional parameter indicating the media file name
     */
    constructor(type, file) {
        this.type = type;
        if (file)
            this.file = file;
    }

    /**
     * Loads the MediaContent settings from a specific JQuery XML element
     * @param {external:jQuery} $xml
     */
    setProperties($xml) {
        attrForEach($xml.get(0).attributes, (name, val) => {
            switch (name) {
                case 'type':
                    this.type = val;
                    break;
                case 'file':
                    this.file = nSlash(val);
                    break;
                case 'params':
                    this.externalParam = nSlash(val);
                    break;

                case 'pFrom':
                    this.absLocationFrom = val;
                    break;

                case 'buffer':
                    this.recBuffer = Number(val);
                    break;
                case 'level':
                case 'from':
                case 'to':
                case 'length':
                    this[name] = Number(val);
                    break;

                case 'px':
                case 'py':
                    if (this.absLocation === null)
                        this.absLocation = new Point(0, 0);
                    if (name === 'px')
                        this.absLocation.x = Number(val);
                    else
                        this.absLocation.y = Number(val);
                    break;

                case 'stretch':
                case 'free':
                case 'catchMouseEvents':
                case 'loop':
                case 'autoStart':
                    this[name] = getBoolean(val);
                    break;
            }
        });
        return this;
    }

    /**
     * Gets a object with the basic attributes needed to rebuild this instance excluding functions,
     * parent references, constants and also attributes retaining the default value.
     * The resulting object is commonly usued to serialize elements in JSON format.
     * @returns {object} - The resulting object, with minimal attrributes
     */
    getAttributes() {
        return getAttr(this, [
            'type', 'file', 'externalParam',
            'absLocation', // -> AWT.Point
            'absLocationFrom', 'recBuffer',
            'level|1', 'from', 'to', 'length',
            'stretch', 'free', 'catchMouseEvents', 'loop', 'autoStart'
        ]);
    }

    /**
     * Reads the properties of this MediaContent from a data object
     * @param {object} data - The data object to be parsed
     * @returns {module:media/MediaContent.MediaContent}
     */
    setAttributes(data) {
        return setAttr(this, data, [
            'type', 'file', 'externalParam',
            { key: 'absLocation', fn: Point },
            'absLocationFrom', 'recBuffer',
            'level', 'from', 'to', 'length',
            'stretch', 'free', 'catchMouseEvents', 'loop', 'autoStart',
        ]);
    }

    /**
     * Compares this object with another MediaContent.
     * @param {module:media/MediaContent.MediaContent} mc - The Media Content to compare against to.
     * @returns {boolean} - `true` when both objects are equivalent.
     */
    isEquivalent(mc) {
        return this.type === mc.type &&
            (this.file === mc.file ||
                this.file !== null && mc.file !== null &&
                this.file.toLocaleLowerCase() === mc.file.toLocaleLowerCase()) &&
            this.from === mc.from &&
            this.to === mc.to &&
            this.recBuffer === mc.recBuffer;
    }

    /**
     * Gets a string representing this media content, useful for checking if two different elements
     * are equivalent.
     * @returns {string}
     */
    getDescription() {
            let result = `${this.type}`;
            if (this.file)
                result = `${result} ${this.file}${this.from >= 0 ? ` from:${this.from}` : ''}${this.to >= 0 ? ` to:${this.to}` : ''}`;
    else if (this.externalParam)
      result = `${result} ${this.externalParam}`;
    return result;
  }

  /**
   * Returns a simplified description of this media content. Useful for accessibility methods.
   * @returns {string}
   */
  toString() {
    return `${this.type}${this.file ? ` ${this.file}` : ''}`;
  }

  /**
   * Returns an image to be used as icon for representing this media content.
   * @returns {external:HTMLImageElement}
   */
  getIcon() {
    let icon = null;
    switch (this.type) {
      case 'PLAY_AUDIO':
      case 'PLAY_RECORDED_AUDIO':
        icon = 'audio';
        break;
      case 'RECORD_AUDIO':
        icon = 'mic';
        break;
      case 'PLAY_VIDEO':
        icon = 'movie';
        break;
      case 'PLAY_MIDI':
        icon = 'music';
        break;
      case 'URL':
        icon = 'url';
        break;
      default:
        icon = 'generic';
        break;
    }
    return icon ? MediaContent.ICONS[icon] : null;
  }
}

Object.assign(MediaContent.prototype, {
  /**
   * The type of media. Valid values are: `UNKNOWN`, `PLAY_AUDIO`, `PLAY_VIDEO`,
   * `PLAY_MIDI`, `PLAY_CDAUDIO`, `RECORD_AUDIO`, `PLAY_RECORDED_AUDIO`, `RUN_CLIC_ACTIVITY`,
   * `RUN_CLIC_PACKAGE`, `RUN_EXTERNAL`, `URL`, `EXIT` and `RETURN`
   * @name module:media/MediaContent.MediaContent#type
   * @type {string} */
  type: 'UNKNOWN',
  /**
   * The priority level is important when different medias want to play together. Objects with
   * highest priority level can mute lower ones.
   * @name module:media/MediaContent.MediaContent#level
   * @type {number} */
  level: 1,
  /**
   * Media file name
   * @name module:media/MediaContent.MediaContent#file
   * @type {string} */
  file: null,
  /**
   * Optional parameters passed to external calls
   * @name module:media/MediaContent.MediaContent#externalParams
   * @type {string} */
  externalParam: null,
  /**
   * Special setting used to play only a fragment of media. `-1` means not used (plays full
   * length, from the beginning)
   * @name module:media/MediaContent.MediaContent#from
   * @type {number} */
  from: -1,
  /**
   * Special setting used to play only a fragment of media. `-1` means not used (plays to the end
   * of the media)
   * @name module:media/MediaContent.MediaContent#to
   * @type {number} */
  to: -1,
  /**
   * When `type` is `RECORD_AUDIO`, this member stores the maximum length of the recorded
   * sound, in seconds.
   * @name module:media/MediaContent.MediaContent#length
   * @type {number} */
  length: 3,
  /**
   * When `type` is `RECORD_AUDIO`, this member stores the buffer ID where the recording
   * will be stored.
   * @name module:media/MediaContent.MediaContent#recBuffer
   * @type {number} */
  recBuffer: 0,
  /**
   * Whether to stretch or not the video size to fit the cell space.
   * @name module:media/MediaContent.MediaContent#stretch
   * @type {boolean} */
  stretch: false,
  /**
   * When `true`, the video plays out of the cell, centered on the activity window.
   * @name module:media/MediaContent.MediaContent#free
   * @type {boolean} */
  free: false,
  /**
   * Places the video window at a specific location.
   * @name module:media/MediaContent.MediaContent#absLocation
   * @type {module:AWT.Point} */
  absLocation: null,
  /**
   * When {@link module:media/MediaContent.MediaContent#absLocation} is not `null`, this field indicates from where to
   * measure its coordinates. Valid values are: `BOX`, `WINDOW` or `FRAME`.
   * @name module:media/MediaContent.MediaContent#absLocationFrom
   * @type {string} */
  absLocationFrom: null,
  /**
   * `true` when the video window must catch mouse clicks.
   * @name module:media/MediaContent.MediaContent#catchMouseEvents
   * @type {boolean} */
  catchMouseEvents: false,
  /**
   * Whether to repeat the media in loop, or just one time.
   * @name module:media/MediaContent.MediaContent#loop
   * @type {boolean} */
  loop: false,
  /**
   * When `true`, the media will automatically start playing when the associated {@link module:boxes/ActiveBox.ActiveBox ActiveBox}
   * become active.
   * @name module:media/MediaContent.MediaContent#autoStart
   * @type {boolean} */
  autoStart: false,
});

/**
 * Default icons for media types.
 * @type {object} */
const ICONS = {
  generic,
  audio,
  movie,
  mic,
  music,
  url,
};

/**
 * Collection of icon {@link external:HTMLImageElement} objects
 * @name module:media/MediaContent.MediaContent.ICONS
 * @type {object} */
MediaContent.ICONS = {};

// Load the icons
$.each(ICONS, (key, value) => {
  const img = new Image();
  img.src = svgToURI(value);
  MediaContent.ICONS[key] = img;
});

export default MediaContent;