/**
 *  File    : activities/panels/PintorScreen.js 
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
//import { Rectangle, Point } from '../../AWT'; //Original
import { Rectangle } from '../../AWT';
import { popParticula } from '../../media/MyParticlesEvents';
import lapiz from './icons/lapiz.png';
import goma from './icons/goma.png';

/**
 * This class of {@link module:Activity.Activity Activity} just shows a panel with {@link module:boxes/ActiveBox.ActiveBox ActiveBox} objects.
 * Because active boxes can act as a links to specific points in the project's sequence of
 * activities, this kind of activity is often used as a menu where users can choose from different
 * options.
 * @extends module:Activity.Activity
 */
export class PintorScreen extends Activity {
    /**
     * PintorScreen constructor
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
 * The {@link module:Activity.ActivityPanel ActivityPanel} where {@link module:activities/panels/PintorScreen.PintorScreen InformationScreen} activities should display its content
 * @extends module:Activity.ActivityPanel
 */
export class PintorScreenPanel extends ActivityPanel {
    /**
     * PintorScreenPanel constructor
     * @param {module:Activity.Activity} act - The {@link module:Activity.Activity Activity} to which this Panel belongs
     * @param {module:JClicPlayer.JClicPlayer} ps - Any object implementing the methods defined in the
     * [PlayStation](http://projectestac.github.io/jclic/apidoc/edu/xtec/jclic/PlayStation.html) Java interface.
     * @param {external:jQuery} [$div] - The jQuery DOM element where this Panel will deploy
     */
    constructor(act, ps, $div) {
        super(act, ps, $div);
        //Colores del lapiz (Arco iris, blanco y negro)
        this.colorLapiz=['BF0426','F2A341', 'F2E530', '03A60E', '52A8F2', '023E73', '5E17EB', 'FFFFFF', '000000'];
        this.indexLapiz=1;  //El color inicial del lapiz

        // Array para almacenar los círculos dibujados y sus colores
        this.circles = [];      //Almacena los círculos dibujados para poder borrarlos y refrescarlos
        this.radius=5;          //El diámetro del círculo
        this.Modo='Lapiz';      //Modo Lapiz o Goma
        this.Dibujar=false;     //Establece cuando se comienza a dibujar (al pulsar el ratón)
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
        console.log('PintorScreenPanel.buildVisualComponents');
        if (this.firstRun){
            super.buildVisualComponents();            
        }
        this.clear();
        
        const abc = this.act.abc['primary'];
        if (abc) {
            if (abc.image) {
                console.log('Inserta una imagen si existe');
                abc.setImgContent(this.act.project.mediaBag, null, false);
                if (abc.animatedGifFile && !abc.shaper.rectangularShapes)
                    this.$animatedBg = $('<span/>').css({
                        'background-image': `url(${abc.animatedGifFile})`,
                        'background-position': 'center',
                        'background-repeat': 'no-repeat',
                        position: 'absolute'
                    }).appendTo(this.$div);
            }

            if (this.act.acp !== null)
                this.act.acp.generateContent(abc.nch, abc.ncw, [abc], false);

            this.bg = ActiveBoxGrid.createEmptyGrid(null, this,
                this.act.margin, this.act.margin,
                abc);
            this.bg.setContent(abc);
            if (this.$animatedBg)
                this.bg.setCellAttr('tmpTrans', true);
            this.bg.setVisible(true);
        }
    }

    /**
     * Agregado de partículas de color
     */
    nuevaExplosion(ev) {
        popParticula(ev);
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
        this.drawButtons=false;
    }

    /**
     * Updates the graphic content of this panel.
     * This method will be called from {@link module:AWT.Container#update} when needed.
     * @override
     * @param {module:AWT.Rectangle} dirtyRegion - Specifies the area to be updated. When `null`,
     * it's the whole panel.
     */
    updateContent(dirtyRegion) {
        console.log('PintorScreenPanel.updateContent');
        super.updateContent(dirtyRegion);
        let radio=this.radius;
        if (this.bg && this.$canvas) {
            const
                canvas = this.$canvas.get(-1),
                ctx = canvas.getContext('2d');
            if (!dirtyRegion)
                dirtyRegion = new Rectangle(0, 0, canvas.width, canvas.height);
            ctx.clearRect(dirtyRegion.pos.x, dirtyRegion.pos.y, dirtyRegion.dim.width, dirtyRegion.dim.height);
            this.bg.update(ctx, dirtyRegion);

            // Dibujar los círculos     
            console.log(this.circles);     
            this.circles.forEach(circle => {
                console.log(circle.lapizColor);
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, radio, 0, 2 * Math.PI);
                ctx.fillStyle = '#' + circle.lapizColor;
                ctx.fill();
              });
              
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
        //let drawButtons = false;
        if (this.$canvas)
            this.$canvas.remove();

        super.setBounds(rect);
        if (this.bg) {
            this.$canvas = $('<canvas width="' + rect.dim.width + '" height="' + rect.dim.height + '"/>').css({
                position: 'absolute',
                top: 0,
                left: 0
            });
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
            
            var buttonContainer = $('<div id="botonesPintor">').addClass('button-container').css({
                'position': 'fixed',
                'up': '30px', /* Ajusta esta propiedad según la posición vertical deseada */
                'left': '20px', /* Ajusta esta propiedad según la posición horizontal deseada */
                'display': 'flex',
                'flex-direction': 'column',
                'align-items': 'flex-end',
                'z-index': '9999' /* Asegura que los botones estén por encima de otros elementos */
              });
            
            var lapizBtn = $('<button>').addClass('floating-button').html(`<img src="${lapiz}" alt="Lápiz">`).css({
            'background-color': '#F2A341',
            'color': '#fff',
            'border': 'none',
            'padding': '10px',
            'border-radius': '5px',
            'cursor': 'pointer',
            'margin-bottom': '5px',
            'margin-top': '5px',
            'border': '2px solid #fff'            
            }).on('click', () => {
                if(this.Modo=='Lapiz'){
                    this.indexLapiz = (this.indexLapiz + 1) % this.colorLapiz.length;
                    var nextColor = this.colorLapiz[this.indexLapiz];
                }
                this.Modo='Lapiz';
                this.Dibujar=false;
                $(lapizBtn).css({'background-color': '#' + nextColor,'border': '2px solid #fff'});  
                $(gomaBtn).css({'border': '0px solid #fff'}); 
              });
        
            var gomaBtn = $('<button>').addClass('floating-button').html(`<img src="${goma}" alt="Goma">`).css({
            'background-color': '#007bff',
            'color': '#fff',
            'border': 'none',
            'padding': '10px',
            'border-radius': '5px',
            'cursor': 'pointer',
            'margin-bottom': '5px'
            }).on('click', () => {
                this.Modo='Goma';
                this.Dibujar=false;
                $(lapizBtn).css({'border': '0px solid #fff'});  
                $(gomaBtn).css({'border': '2px solid #fff'}); 
              });
        
            if (!this.drawButtons) {
                buttonContainer.append(lapizBtn, gomaBtn);
                $( ".JClicPlayer" ).prepend( buttonContainer ); 
                this.drawButtons = true;
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
            this.bg.buildAccessibleElements(this.$canvas, this.$div, 'mousemove');
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
        /* console.log('llamada a play');
        console.log(event);
        console.log(this);
        console.log(this.$div[0]);
        console.log(this.$div);
        console.log(this.$canvas[0]); */
        //'click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'
        
        let radio=this.radius;

        if (this.playing) {
            //Eventos Computer
            if (event.type=='click') {
                if(this.Dibujar==false){
                    this.Dibujar=true;
                } else {
                    this.Dibujar=false;
                }
            }   
            //Eventos mobile
            if (event.type=='touchstart')
                    this.Dibujar=true;
            if (event.type=='touchend')
                    this.Dibujar=false;


            let datosXYok=true;     //Para analizar si está detectando datos de la posición del ratón
            if(this.Dibujar==true){
                let x=event.pageX - this.$div.offset().left;
                let y=event.pageY - this.$div.offset().top;
                //console.log('x: '+x+' y: '+y);
                if (isNaN(x)) {
                    // x no es NaN, realizar operaciones con x
                    //x = event.clientX - this.$div.offset().left;
                    //y = event.clientY - this.$div.offset().top;
                    let touch = event.targetTouches[0];
                    try {
                        x = touch.pageX - this.$div.offset().left;
                        y = touch.pageY - this.$div.offset().top;    
                    } catch (error) {
                        console.log('No ha podido leer datos del touch');
                    }
                    
                    if (isNaN(x)) datosXYok=false;
                }
                //console.log('x: '+x+' y: '+y);
                
                if (datosXYok==true) {
                                    
                    if(this.Modo=='Lapiz'){
                    // Dibujar el círculo
                        let lapizColor = this.colorLapiz[this.indexLapiz];
                        this.drawCircle(this.$canvas[0], x, y, lapizColor, radio);
                        
                        // Almacenar el círculo y su color en el array
                        //console.log(lapizColor, radio);
                        this.circles.push({ x, y, lapizColor, radio });
                    }else{
                        // Verificar si se hizo clic en algún círculo
                        this.circles.forEach((circle, i) => {
                            let distance = Math.sqrt((circle.x - x) ** 2 + (circle.y - y) ** 2);
                        
                            // Si la distancia entre el punto clicado y el centro del círculo es menor o igual al radio, borrar el círculo
                            if (distance <= radio) {
                            this.borrarCirculo(this.$canvas[0], i);
                            return; // Salir del bucle una vez que se haya borrado el círculo
                            }
                        });
                        
                    }
                }
            }

            //console.log(this.Dibujar, this.Modo);

            // Array to be filled with actions to be executed at the end of event processing
            const delayedActions = [];
            this.ps.stopMedia(1);
            delayedActions.forEach(action => action());
            event.preventDefault();
        }        
    }

    //function to draw a red circle into the canvas called this.$canvas
    drawCircle (canvas, x, y, lapizColor, radius) {
        var ctx = canvas.getContext('2d');
    
        // Dibujar el círculo rojo
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        //let lapizColor = this.colorLapiz[this.indexLapiz];
        ctx.fillStyle = '#' + lapizColor;
        ctx.fill();
    };

    // Función para borrar un círculo dado su índice en el array
    borrarCirculo(canvas, index) {
        var ctx = canvas.getContext('2d');

        // Eliminar el círculo del array
        this.circles.splice(index, 1);
    
        // Volver a dibujar todos los círculos en el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let dirtyRegion = new Rectangle(0, 0, canvas.width, canvas.height);
            ctx.clearRect(dirtyRegion.pos.x, dirtyRegion.pos.y, dirtyRegion.dim.width, dirtyRegion.dim.height);
            this.bg.update(ctx, dirtyRegion);
        this.circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#' + circle.lapizColor;
        ctx.fill();
        });
    };

}


Object.assign(PintorScreenPanel.prototype, {
    /**
     * The {@link module:boxes/ActiveBoxbag.ActiveBoxBag ActiveBoxBag} containing the Pintor to be displayed.
     * @name module:activities/panels/PintorScreen.PintorScreenPanel#bg
     * @type {module:boxes/ActiveBoxBag.ActiveBoxBag} */
    bg: null,
    /**
     * List of mouse, touch and keyboard events intercepted by this panel
     * @override
     * @name module:activities/panels/PintorScreen.PintorScreenPanel#events
     * @type {string[]} */
    events: ['click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove'],
});

/**
 * Panel class associated to this type of activity: {@link module:activities/panels/PintorScreen.PintorScreenPanel PintorScreenPanel}
 * @type {class} */
PintorScreen.Panel = PintorScreenPanel;

// Register activity class
export default Activity.registerClass('@panels.PintorScreen', PintorScreen);