/**
 *  File    : media/EventSounds.js
 *  Created : 01/04/2015
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

import $ from 'jquery';
import EventSoundsElement from './EventSoundsElement';
import { getTriState, getAttr, setAttr, DEFAULT } from '../Utils';

// Use Webpack to import MP3 files
// import start from './sounds/start.mp3';
// import click from './sounds/click.mp3';
// import actionOk from './sounds/actionOk.mp3';
// import actionError from './sounds/actionError.mp3';
// import finishedOk from './sounds/finishedOk.mp3';
// import finishedError from './sounds/finishedError.mp3';

// import start from './sounds/sfx-magic8.mp3';
// import start0 from './sounds/sfx-magic2.mp3';
// import start1 from './sounds/sfx-magic3.mp3';
// import start2 from './sounds/sfx-magic5.mp3';
// import start3 from './sounds/sfx-magic6.mp3';
// import start4 from './sounds/sfx-magic8.mp3';
// import start5 from './sounds/sfx-magic9.mp3';
// import start6 from './sounds/sfx-magic14.mp3';
// import click from './sounds/sfx-magic5.mp3';
// import actionOk from './sounds/sfx-magic2.mp3';
// import actionError from './sounds/sfx-cartoons.mp3';
// import finishedOk from './sounds/sfx-victory5.mp3';
// import finishedError from './sounds/finishedError.mp3';

/**
 * The EventSounds objects contains specific sounds to be played when JClic events are fired:
 * - start
 * - click
 * - actionError
 * - actionOk
 * - finishedError
 * - finishedOk
 *
 * The sounds are stored in an array of {@link module:media/EventSoundsElement EventSoundsElement} objects.
 */
export class EventSounds {
    /**
     * EventSounds constructor
     * @param {module:media/EventSounds.EventSounds} [parent] - Another EventSounds object that will act as a parent of this one,
     * used to resolve which sound must be played for events when not defined here.
     */
    constructor(parent) {
        if (parent) {
            this.elements = Object.assign({}, this.elements, parent.elements);
            this.enabled = parent.enabled;
        }
    }

    /**
     * Reads the object properties from an XML element
     * @param {external:jQuery} $xml - The XML element to be parsed
     */
    setProperties($xml) {
        this.enabled = getTriState($xml.attr('enabled'), this.enabled);
        $xml.children().each((_n, child) => {
            const id = child.getAttribute('id');
            this.elements[id] = new EventSoundsElement(id);
            this.elements[id].setProperties($(child));
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
            `enabled|${DEFAULT}`,
            'elements',
        ]);
    }

    /**
     * Reads the properties of this EventSounds from a data object
     * @param {object} data - The data object to be parsed
     * @returns {module:media/EventSounds.EventSounds}
     */
    setAttributes(data) {
        return setAttr(this, data, [
            'enabled',
            { key: 'elements', fn: EventSoundsElement, group: 'object' },
        ]);
    }

    /**
     * Instantiates the audio objects needed to play event sounds
     * @param {module:JClicPlayer.JClicPlayer} ps
     * @param {module:bags/MediaBag.MediaBag} mediaBag
     */
    realize(ps, mediaBag) {
        // Values are {EventSoundElement} objects
        $.each(this.elements, (key, value) => value.realize(ps, mediaBag));
    }

    /**
     * Plays a specific event sound
     * @param {string} eventName - The identifier of the event to be played
     */
    play(eventName) {
        let sound;
        console.log('=====>  Play event Sound: "', eventName, '"');
        console.log('=====>  globalEnabled: "', this.globalEnabled, this.enabled);
        if (this.globalEnabled && this.enabled) {
            if (eventName === 'start') {
                let randomNumber = Math.floor(Math.random() * 8);
                let evtName = eventName + `${randomNumber}`;
                sound = this.elements[evtName];
                //console.log(sound, eventName + `${randomNumber}`);
            } else if (eventName === 'finishedOk') {
                let randomNumber = Math.floor(Math.random() * 7);
                let evtName = eventName + `${randomNumber}`;
                sound = this.elements[evtName];
            } else if (eventName === 'actionError') {
                let randomNumber = Math.floor(Math.random() * 10);
                let evtName = eventName + `${randomNumber}`;
                sound = this.elements[evtName];
            } else if (eventName === 'actionOK' || eventName === 'actionOk') {
                let randomNumber = Math.floor(Math.random() * 5);
                let evtName = eventName + `${randomNumber}`;
                sound = this.elements[evtName];
                console.log('Encontro actionOK', sound);
            } else if (eventName === 'click') {
                let randomNumber = Math.floor(Math.random() * 11);
                let evtName = eventName + `${randomNumber}`;
                sound = this.elements[evtName];
            } else {
                sound = this.elements[eventName];
            }
            if (sound && sound.enabled)
                sound.play();
            //alert('EventSounds.Play');
            console.log('sound contiene:', sound);
        }
    }
}

/**
 * Audio data for default event sounds
 * @name module:media/EventSounds.EventSounds.MEDIA
 * @type {object} */
// EventSounds.MEDIA = {
//     start0,
//     start,
//     start1,
//     start2,
//     start3,
//     start4,
//     start5,
//     start6,
//     start,
//     click,
//     actionOk,
//     actionError,
//     finishedOk,
//     finishedError,
// };
EventSounds.MEDIA = {
    start: '../sounds/start/start.mp3',
    start0: '../sounds/start/sfx-magic8.mp3',
    start1: '../sounds/start/sfx-magic3.mp3',
    start2: '../sounds/start/sfx-magic5.mp3',
    start3: '../sounds/start/sfx-magic6.mp3',
    start4: '../sounds/start/sfx-magic8.mp3',
    start5: '../sounds/start/sfx-magic9.mp3',
    start6: '../sounds/start/sfx-magic14.mp3',
    start7: '../sounds/start/start.mp3',

    click: '../sounds/click/click.mp3',
    click0: '../sounds/click/0.mp3',
    click1: '../sounds/click/1.mp3',
    click2: '../sounds/click/2.mp3',
    click3: '../sounds/click/3.mp3',
    click4: '../sounds/click/4.mp3',
    click5: '../sounds/click/5.mp3',
    click6: '../sounds/click/6.mp3',
    click7: '../sounds/click/7.mp3',
    click8: '../sounds/click/8.mp3',
    click9: '../sounds/click/9.mp3',
    click10: '../sounds/click/click.mp3',

    actionOk: '../sounds/actionOk.mp3',
    actionOk0: '../sounds/actionOk/sfx-cartoons.mp3',
    actionOk1: '../sounds/actionOk/sfx-cartoons2.mp3',
    actionOk2: '../sounds/actionOk/sfx-cartoons14.mp3',
    actionOk3: '../sounds/actionOk/sfx-strings7.mp3',
    actionOk4: '../sounds/actionOk/actionOk.mp3',

    actionOK: '../sounds/actionOk.mp3',
    actionOK0: '../sounds/actionOk/sfx-cartoons.mp3',
    actionOK1: '../sounds/actionOk/sfx-cartoons2.mp3',
    actionOK2: '../sounds/actionOk/sfx-cartoons14.mp3',
    actionOK3: '../sounds/actionOk/sfx-strings7.mp3',
    actionOK4: '../sounds/actionOk/actionOk.mp3',

    actionError: '../sounds/actionError/actionError.mp3',
    actionError0: '../sounds/actionError/0.mp3',
    actionError1: '../sounds/actionError/1.mp3',
    actionError2: '../sounds/actionError/2.mp3',
    actionError3: '../sounds/actionError/3.mp3',
    actionError4: '../sounds/actionError/4.mp3',
    actionError5: '../sounds/actionError/5.mp3',
    actionError6: '../sounds/actionError/6.mp3',
    actionError7: '../sounds/actionError/7.mp3',
    actionError8: '../sounds/actionError/8.mp3',
    actionError9: '../sounds/actionError/9.mp3',
    actionError10: '../sounds/actionError/actionError.mp3',

    finishedOk: '../sounds/finishedOk/finishedOk.mp3',
    finishedOk0: '../sounds/finishedOk/sfx-victory1.mp3',
    finishedOk1: '../sounds/finishedOk/sfx-victory2.mp3',
    finishedOk2: '../sounds/finishedOk/sfx-victory3.mp3',
    finishedOk3: '../sounds/finishedOk/sfx-victory4.mp3',
    finishedOk4: '../sounds/finishedOk/sfx-victory5.mp3',
    finishedOk5: '../sounds/finishedOk/sfx-victory6.mp3',
    finishedOk6: '../sounds/finishedOk/finishedOk.mp3',

    finishedError: '../sounds/finishedError.mp3'
};

Object.assign(EventSounds.prototype, {
    /**
     * Collection of {@link module:media/EventSoundsElement EventSoundsElement} objects
     * @name module:media/EventSounds.EventSounds#elements
     * @type {object} */
    elements: {
        start: new EventSoundsElement('start', '../sounds/start/start.mp3'),
        start0: new EventSoundsElement('start', '../sounds/start/sfx-magic2.mp3'),
        start1: new EventSoundsElement('start', '../sounds/start/sfx-magic3.mp3'),
        start2: new EventSoundsElement('start', '../sounds/start/sfx-magic5.mp3'),
        start3: new EventSoundsElement('start', '../sounds/start/sfx-magic6.mp3'),
        start4: new EventSoundsElement('start', '../sounds/start/sfx-magic8.mp3'),
        start5: new EventSoundsElement('start', '../sounds/start/sfx-magic9.mp3'),
        start6: new EventSoundsElement('start', '../sounds/start/sfx-magic14.mp3'),
        start7: new EventSoundsElement('start', '../sounds/start/start.mp3'),

        //click: new EventSoundsElement('click', EventSounds.MEDIA.click),
        click: new EventSoundsElement('click', '../sounds/click/click.mp3'),
        click0: new EventSoundsElement('click', '../sounds/click/0.mp3'),
        click1: new EventSoundsElement('click', '../sounds/click/1.mp3'),
        click2: new EventSoundsElement('click', '../sounds/click/2.mp3'),
        click3: new EventSoundsElement('click', '../sounds/click/3.mp3'),
        click4: new EventSoundsElement('click', '../sounds/click/4.mp3'),
        click5: new EventSoundsElement('click', '../sounds/click/5.mp3'),
        click6: new EventSoundsElement('click', '../sounds/click/6.mp3'),
        click7: new EventSoundsElement('click', '../sounds/click/7.mp3'),
        click8: new EventSoundsElement('click', '../sounds/click/8.mp3'),
        click9: new EventSoundsElement('click', '../sounds/click/9.mp3'),
        click10: new EventSoundsElement('click', '../sounds/click/click.mp3'),

        actionOk: new EventSoundsElement('actionOk', '../sounds/actionOk/actionOk.mp3'),
        actionOk0: new EventSoundsElement('actionOk', '../sounds/actionOk/sfx-cartoons.mp3'),
        actionOk1: new EventSoundsElement('actionOk', '../sounds/actionOk/sfx-cartoons2.mp3'),
        actionOk2: new EventSoundsElement('actionOk', '../sounds/actionOk/sfx-cartoons14.mp3'),
        actionOk3: new EventSoundsElement('actionOk', '../sounds/actionOk/sfx-strings7.mp3'),
        actionOk4: new EventSoundsElement('actionOk', '../sounds/actionOk/actionOk.mp3'),

        actionOK: new EventSoundsElement('actionOK', '../sounds/actionOk/actionOk.mp3'),
        actionOK0: new EventSoundsElement('actionOK', '../sounds/actionOk/sfx-cartoons.mp3'),
        actionOK1: new EventSoundsElement('actionOK', '../sounds/actionOk/sfx-cartoons2.mp3'),
        actionOK2: new EventSoundsElement('actionOK', '../sounds/actionOk/sfx-cartoons14.mp3'),
        actionOK3: new EventSoundsElement('actionOK', '../sounds/actionOk/sfx-strings7.mp3'),
        actionOK4: new EventSoundsElement('actionOK', '../sounds/actionOk/actionOk.mp3'),

        actionError: new EventSoundsElement('actionError', '../sounds/actionError/actionError.mp3'),
        actionError0: new EventSoundsElement('actionError', '../sounds/actionError/0.mp3'),
        actionError1: new EventSoundsElement('actionError', '../sounds/actionError/1.mp3'),
        actionError2: new EventSoundsElement('actionError', '../sounds/actionError/2.mp3'),
        actionError3: new EventSoundsElement('actionError', '../sounds/actionError/3.mp3'),
        actionError4: new EventSoundsElement('actionError', '../sounds/actionError/4.mp3'),
        actionError5: new EventSoundsElement('actionError', '../sounds/actionError/5.mp3'),
        actionError6: new EventSoundsElement('actionError', '../sounds/actionError/6.mp3'),
        actionError7: new EventSoundsElement('actionError', '../sounds/actionError/7.mp3'),
        actionError8: new EventSoundsElement('actionError', '../sounds/actionError/8.mp3'),
        actionError9: new EventSoundsElement('actionError', '../sounds/actionError/9.mp3'),


        finishedOk: new EventSoundsElement('finishedOk', '../sounds/finishedOk/finishedOk.mp3'),
        finishedOk0: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory1.mp3'),
        finishedOk1: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory2.mp3'),
        finishedOk2: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory3.mp3'),
        finishedOk3: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory4.mp3'),
        finishedOk4: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory5.mp3'),
        finishedOk5: new EventSoundsElement('finishedOk', '../sounds/finishedOk/sfx-victory6.mp3'),
        finishedOk6: new EventSoundsElement('finishedOk', '../sounds/finishedOk/finishedOk.mp3'),

        finishedError: new EventSoundsElement('finishedError', '../sounds/finishedError.mp3')
    },
    /**
     * Whether this event sounds are enabled or not
     * @name module:media/EventSounds.EventSounds#enabled
     * @type {number} */
    enabled: DEFAULT,
    /**
     * This attribute is intended to be used at prototype level, to indicate a globally disabled
     * or enabled state.
     * @name module:media/EventSounds.EventSounds#globalEnabled
     * @type {boolean} */
    globalEnabled: true,
});

export default EventSounds;