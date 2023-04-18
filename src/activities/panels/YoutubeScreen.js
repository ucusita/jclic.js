/**
 *  File    : activities/panels/YoutubeScreen.js
 *  Created : 19/05/2015
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

/* global window */

import $ from 'jquery';
import { Activity, ActivityPanel } from '../../Activity';
import ActiveBoxGrid from '../../boxes/ActiveBoxGrid';
import BoxBag from '../../boxes/BoxBag';
import { Rectangle, Point } from '../../AWT';

/**
 * This class of {@link module:Activity.Activity Activity} just shows a panel with {@link module:boxes/ActiveBox.ActiveBox ActiveBox} objects.
 * Because active boxes can act as a links to specific points in the project's sequence of
 * activities, this kind of activity is often used as a menu where users can choose from different
 * options.
 * @extends module:Activity.Activity
 */
export class YoutubeScreen extends Activity {
    /**
     * basado en InformationScreen constructor
     * @param {module:project/JClicProject.JClicProject} project - The {@link module:project/JClicProject.JClicProject JClicProject} to which this activity belongs
     */
    constructor(project) {
        super(project);
        // This kind of activities are not reported
        this.includeInReports = false;
        this.reportActions = false;
    }
}

/**
 * The {@link module:Activity.ActivityPanel ActivityPanel} where {@link module:activities/panels/InformationScreen.InformationScreen InformationScreen} activities should display its content
 * @extends module:Activity.ActivityPanel
 */
export class YoutubeScreenPanel extends ActivityPanel {
    /**
     * YoutubeScreenPanel (ex InformationScreenPanel) constructor
     * @param {module:Activity.Activity} act - The {@link module:Activity.Activity Activity} to which this Panel belongs
     * @param {module:JClicPlayer.JClicPlayer} ps - Any object implementing the methods defined in the
     * [PlayStation](http://projectestac.github.io/jclic/apidoc/edu/xtec/jclic/PlayStation.html) Java interface.
     * @param {external:jQuery} [$div] - The jQuery DOM element where this Panel will deploy
     */
    constructor(act, ps, $div) {
        super(act, ps, $div);
    }

    /**
     * Miscellaneous cleaning operations
     * @override
     */
    clear() {
        if (this.bg) {
            this.bg.end();
            this.bg = null;
        }
    }

    /**
     * Prepares the visual components of the activity
     * @override
     */
    buildVisualComponents() {
        if (this.firstRun)
            super.buildVisualComponents();
        this.clear();
        console.log('**************************************************');
        console.log('this.act.url=', this.act.url);
        //console.log('****************** this.a.dim ********************');
        //console.log('this.ps.dim=', this.ps.dim);
        //console.log('this=', this);
        //this.act.url = "https://www.youtube.com/embed/zcSHJRiT2F0";        
        const abc = this.act.abc['primary'];
        if (abc) {
            setTimeout(() => {
                const canvas = document.querySelector('div.JClicActivity canvas');
                const canvasWidth = canvas.clientWidth;
                const canvasHeight = canvas.clientHeight;
                //alert('canvasWidth=' + canvasWidth + ' canvasHeight=' + canvasHeight);
                console.log('height=', canvasHeight);
                console.log('width=', canvasWidth);
                let url = this.act.url.replace('watch?v=', 'embed/');
                url = url + '?rel=0&showinfo=0&modestbranding=0&fs=0&loop=0';
                //Funciona pero el tamaño es incorrecto en ciertas ocasiones
                /* let videocode = '<div class="responsiveRapper"><iframe width="560" height="315"  src="' +
                    url + '" title="YouTube video player" frameborder="0" ></iframe></div>'; */
                let videocode = '<div class="responsiveRapper"><iframe width="' + canvasWidth + '" height="' + canvasHeight + '"  src="' +
                    url + '" title="YouTube video player" frameborder="0" ></iframe></div>';
                //videocode = '<div class="responsiveRapper"><iframe width="560" height="315" src="https://www.youtube.com/embed/zAlX1V3lK5s" autoplay;></iframe></div>';
                //Cuidado con el embed/ si no se lo coloca, no anda.
                this.$video = $(videocode).appendTo(this.$div);
                console.log("THIS.VIDEOCODE");
                console.log(this.$video);
            }, 1000);
        }

        this.bg = ActiveBoxGrid.createEmptyGrid(null, this,
            this.act.margin, this.act.margin,
            abc);
        //this.bg.setContent(abc);
        //if (this.$animatedBg)
        //    this.bg.setCellAttr('tmpTrans', true);
        //this.bg.setVisible(true);
    }

    /**
     * Basic initialization procedure
     * @override
     */
    initActivity() {
        super.initActivity();
        if (!this.firstRun)
            this.buildVisualComponents();
        else
            this.firstRun = false;

        this.invalidate().update();
        this.setAndPlayMsg('initial', 'start');
        this.playing = true;
    }

    /**
     * Updates the graphic content of this panel.
     * This method will be called from {@link module:AWT.Container#update} when needed.
     * @override
     * @param {module:AWT.Rectangle} dirtyRegion - Specifies the area to be updated. When `null`,
     * it's the whole panel.
     */
    updateContent(dirtyRegion) {
        super.updateContent(dirtyRegion);
        if (this.bg && this.$canvas) {
            const
                canvas = this.$canvas.get(-1),
                ctx = canvas.getContext('2d');
            if (!dirtyRegion)
                dirtyRegion = new Rectangle(0, 0, canvas.width, canvas.height);
            ctx.clearRect(dirtyRegion.pos.x, dirtyRegion.pos.y, dirtyRegion.dim.width, dirtyRegion.dim.height);
            this.bg.update(ctx, dirtyRegion);
        }
        return this;
    }

    /**
     * Sets the real dimension of this panel.
     * @override
     * @param {module:AWT.Dimension} preferredMaxSize - The maximum surface available for the activity panel
     * @returns {module:AWT.Dimension}
     */
    setDimension(preferredMaxSize) {
        return this.getBounds().equals(preferredMaxSize) ?
            preferredMaxSize :
            BoxBag.layoutSingle(preferredMaxSize, this.bg, this.act.margin);
    }

    /**
     * Sets the size and position of this activity panel
     * @override
     * @param {module:AWT.Rectangle} rect
     */
    setBounds(rect) {
        if (this.$canvas)
            this.$canvas.remove();

        super.setBounds(rect);
        if (this.bg) {
            this.$canvas = $('<canvas width="' + rect.dim.width + '" height="' + rect.dim.height + '"/>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -100 //Agregado para ocultar el contenedor canvas
            });
            //alert('canvas width=' + rect.dim.width + ' canvas height=' + rect.dim.height);
            console.log("THIS.CANVAS");
            console.log(this.$canvas);
            // Resize animated gif background
            if (this.$animatedBg) {
                const bgRect = this.bg.getBounds();
                this.$animatedBg.css({
                    left: bgRect.pos.x,
                    top: bgRect.pos.y,
                    width: `${bgRect.dim.width}px`,
                    height: `${bgRect.dim.height}px`,
                    'background-size': `${bgRect.dim.width}px ${bgRect.dim.height}px`
                });
            }
            this.$div.append(this.$canvas);
            this.invalidate().update();
            window.setTimeout(() => this.bg ? this.bg.buildAccessibleElements(this.$canvas, this.$div) : null, 0);
        }
    }

    /**
     * Builds the accessible components needed for this ActivityPanel
     * This method is called when all main elements are placed and visible, when the activity is ready
     * to start or when resized.
     * @override
     */
    buildAccessibleComponents() {
        if (this.$canvas && this.accessibleCanvas && this.bg) {
            super.buildAccessibleComponents();
            this.bg.buildAccessibleElements(this.$canvas, this.$div);
        }
    }

    /**
     * Main handler used to process mouse, touch, keyboard and edit events
     * @override
     * @param {external:Event} event - The HTML event to be processed
     * @returns {boolean} - When this event handler returns `false`, jQuery will stop its
     * propagation through the DOM tree. See: {@link http://api.jquery.com/on}
     */
    processEvent(event) {
        if (this.playing) {
            const p = new Point(
                event.pageX - this.$div.offset().left,
                event.pageY - this.$div.offset().top);
            // Array to be filled with actions to be executed at the end of event processing
            const delayedActions = [];
            this.ps.stopMedia(1);
            const bx = this.bg.findActiveBox(p);
            if (bx) {
                if (!bx.playMedia(this.ps, delayedActions))
                    this.playEvent('click');
            }
            delayedActions.forEach(action => action());
            event.preventDefault();
        }
    }
}

Object.assign(YoutubeScreenPanel.prototype, {
    /**
     * The {@link module:boxes/ActiveBoxbag.ActiveBoxBag ActiveBoxBag} containing the information to be displayed.
     * @name module:activities/panels/InformationScreen.InformationScreenPanel#bg
     * @type {module:boxes/ActiveBoxBag.ActiveBoxBag} */
    bg: null,
    /**
     * List of mouse, touch and keyboard events intercepted by this panel
     * @override
     * @name module:activities/panels/InformationScreen.InformationScreenPanel#events
     * @type {string[]} */
    events: ['click'],
});

/**
 * Panel class associated to this type of activity: {@link module:activities/panels/InformationScreen.InformationScreenPanel InformationScreenPanel}
 * @type {class} */
YoutubeScreen.Panel = YoutubeScreenPanel;

// Register activity class
export default Activity.registerClass('@panels.YoutubeScreen', YoutubeScreen);