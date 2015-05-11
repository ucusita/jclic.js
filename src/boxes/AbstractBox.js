//    File    : AbstractBox.js  
//    Created : 18/04/2015  
//    By      : Francesc Busquets  
//
//    JClic.js  
//    HTML5 player of [JClic](http://clic.xtec.cat) activities  
//    https://github.com/projectestac/jclic.js  
//    (c) 2000-2015 Catalan Educational Telematic Network (XTEC)  
//    This program is free software: you can redistribute it and/or modify it under the terms of
//    the GNU General Public License as published by the Free Software Foundation, version. This
//    program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
//    even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
//    General Public License for more details. You should have received a copy of the GNU General
//    Public License along with this program. If not, see [http://www.gnu.org/licenses/].  

define([
  "jquery",
  "../AWT",
  "./BoxBase"
], function ($, AWT, BoxBase) {

//
// This abstract class is the base for most graphic components of JClic. It
// describes an Area (an AWT.Rectangle by default) with some special properties
// that determine how it must be drawn on screen. Some types of boxes can act as
// containers for other boxes, establishing a hierarchy of dependences.
  var AbstractBox = function (parent, container, boxBase) {
    
    // AbstractBox extends AWT.Rectangle
    AWT.Rectangle.call(this);
    
    this.container = container;
    this.parent = parent;
    this.boxBase = boxBase;
    this.shape = this;
    this.specialShape = false;
    this.visible = true;
  };

  AbstractBox.prototype = {
    constructor: AbstractBox,
    //
    // The [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
    // used to draw this box
    ctx: null,
    //
    // The parent AbstractBox (can be `null`)
    parent: null,
    //
    // The container object this AbstractBox belongs to
    container: null,
    // 
    // The [BoxBase](BoxBase.html) used to draw this AbstractBox
    boxBase: null,
    //
    // The box has border
    border: false,
    // 
    // The shape of this box (the box Rectangle or a specialShape, if set)
    shape: null,
    // 
    // Has special shape
    specialShape: false,
    // 
    // Misc boolean flags:
    visible: true,
    temporaryHidden: false,
    inactive: false,
    inverted: false,
    alternative: false,
    marked: false,
    focused: false,
    //
    // Setter and getter methods for `parent`
    setParent: function (parent) {
      this.parent = parent;
    },
    getParent: function () {
      return this.parent;
    },
    // 
    // Finalizer
    // (overrided by subclasses)
    end: function () {
    },
    //
    // Setter and getter methods for `container`
    // (overrided by subclasses)
    setContainer: function (newContainer) {
      this.container = newContainer;
    },
    getContainerX: function () {
      return this.container;
    },
    getContainerResolve: function () {
      var ab = this;
      while (ab.container === null && ab.parent !== null)
        ab = ab.parent;
      return ab.container;
    },
    //
    // Invalidates the AWT.container zone corresponding to this AbstractBox
    invalidate: function(rect){
      if(!rect)
        rect = this;
      var cnt = this.getContainerResolve();
      if(cnt)
        cnt.invalidate(rect);
    },
    //
    // 
    // Sets the [BoxBase](BoxBase.html) of this box
    setBoxBase: function (boxBase) {
      this.boxBase = boxBase;
      this.invalidate();
    },
    //
    // Gets the real [BoxBase](BoxBase.html) associated to this box, scanning down
    // the parent relationship
    getBoxBaseResolve: function () {
      var ab = this;
      while (!ab.boxBase && ab.parent)
        ab = ab.parent;
      return ab.boxBase ? ab.boxBase : BoxBase.prototype.defaultBoxBase;
    },
    //
    // Setter and getter methods for `shape`
    setShape: function (sh) {
      this.shape = sh;
      this.specialShape = true;
      this.invalidate();
      AWT.Rectangle.prototype.setBounds.call(this, sh.getBounds());
      this.invalidate();
    },
    getShape: function () {
      return this.shape;
    },
    //
    // Check if this AbstractBox contains the provided `AWT.Point`
    contains: function (p) {
      return this.shape === this ?
          AWT.Rectangle.prototype.contains.call(this, p) :
          this.shape.contains(p);
    },
    //
    // Sets a new size and/or dimension
    setBounds: function (rect) {
      // Rectangle comparision
      if (this.equals(rect))
        return;
      if (this.specialShape) {
        if (!this.dim.equals(rect.dim)) {
          this.shape.scaleBy(new AWT.Dimension(rect.dim.width / this.dim.width, rect.dim.height / this.dim.height));
        }
        if (!this.pos.equals(rect.pos)) {
          this.shape.moveTo(rect.pos);
        }
        setShape(this.shape);
      }
      else
        AWT.Rectangle.prototype.setBounds.call(this, rect);
    },
    //
    // Set a new location of this AbstractBox
    // In JClic this method was named 'setLocation'
    moveTo: function (newPos) {
      this.setBounds((new AWT.Rectangle(this)).moveTo(newPos));
    },
    // 
    // Set a new location of this AbstractBox
    // In JClic this method was named 'translate'
    moveBy: function (dx, dy) {
      this.setBounds((new AWT.Rectangle(this)).moveBy(dx, dy));
    },
    //
    // Changes the size of this AbstractBox
    setSize: function (width, height) {
      this.setBounds(new AWT.Rectangle(this.pos, new AWT.Dimension(width, height)));
    },
    //
    // Getter and setter methods for `border`
    hasBorder: function () {
      return this.border;
    },
    setBorder: function (newVal) {
      if (!newVal)
        this.invalidate();
      this.border = newVal;
      if (newVal)
        this.invalidate();
    },
    //
    // Getter and setter methods for `visible`
    isVisible: function () {
      return this.visible;
    },
    setVisible: function (newVal) {
      this.visible = newVal;
      this.invalidate();
    },
    //
    // Getter and setter methods for `temporaryHidden`
    isTemporaryHidden: function () {
      return this.temporaryHidden;
    },
    setTemporaryHidden: function (newVal) {
      this.temporaryHidden = newVal;
    },
    //
    // Getter and setter methods for `inactive`
    isInactive: function () {
      return this.inactive;
    },
    setInactive: function (newVal) {
      this.inactive = newVal;
      this.invalidate();
    },
    //
    // Getter and setter methods for `inverted`
    isInverted: function () {
      return this.inverted;
    },
    setInverted: function (newVal) {
      this.inverted = newVal;
      this.invalidate();
    },
    //
    // Getter and setter methods for `marked`
    isMarked: function () {
      return this.marked;
    },
    setMarked: function (newVal) {
      if (!newVal)
        this.invalidate();
      this.marked = newVal;
      if (newVal)
        this.invalidate();
    },
    //
    // Getter and setter methods for `focused`
    isFocused: function () {
      return this.focused;
    },
    setFocused: function (newVal) {
      if (!newVal)
        this.invalidate();
      this.focused = newVal;
      if (newVal)
        this.invalidate();
    },
    //
    // Getter and setter methods for `alternative`
    isAlternative: function () {
      return this.alternative;
    },
    setAlternative: function (newVal) {
      this.alternative = newVal;
      this.invalidate();
    },
    //
    // TODO: functions to be implemented by subclasses
    repaint: function () {
      if(this.ctx)
        this.update(this.ctx);
    },
    //
    // Graphics operations based on a Canvas context ctx
    update: function (ctx, dirtyRegion) {
      if (this.isEmpty() || !this.isVisible() || this.isTemporaryHidden())
        return false;

      if (dirtyRegion && !this.shape.intersects(dirtyRegion))
        return false;

      /**
       * TODO: Implement clipping
       Shape saveClip=new Area(g2.getClip());
       Area clip=new Area(saveClip);
       clip.intersect(new Area(shape));
       g2.setClip(clip);
       */

      var bb = this.getBoxBaseResolve();
      if (!bb.transparent) {
        if (bb.bgGradient === null || bb.bgGradient.hasTransparency()) {
          ctx.fillStyle = this.inactive ?
              bb.inactiveColor :
              this.inverted ? bb.textColor : bb.backColor;
          // TODO: Implement fill shape!        
          //g2.fill(shape);
          this.fill(ctx);
          ctx.fillStyle = 'black';
        }
        if (bb.bgGradient !== null) {
          ctx.fillStyle = bb.bgGradient.getGradient(ctx, this.shape.getBounds());
          this.shape.paint(ctx);
        }
      }
      this.updateContent(ctx, dirtyRegion);
      //g2.setClip(saveClip);        
      this.drawBorder(ctx);
      return true;
    },
    //
    // Abstract method, to be implemented in subclasses
    updateContent: function (ctx, dirtyRegion) {
    },
    //
    // Draws the box border
    drawBorder: function (ctx) {
      if (this.border || this.marked || this.focused) {
        var bb = this.getBoxBaseResolve();
        ctx.strokeStyle = bb.borderColor;
        bb[(this.marked || this.focused) ? 'markerStroke' : 'borderStroke'].setStroke(ctx);
        if (this.marked || this.focused)
          ctx.globalCompositeOperation = 'xor';
        this.shape.stroke(ctx);
        if (this.marked || this.focused)
          ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'black';
        AWT.Stroke.prototype.setStroke(ctx);
      }
    },
    //
    // Returns the enclosing Rectangle of this box including the border (if any)
    getBorderBounds: function () {
      var result = new Rectangle(this.getBounds());
      if (this.border || this.marked || this.focused) {
        var bb = this.getBoxBaseResolve();
        var w = bb[(this.marked || this.focused) ? 'markerStroke' : 'borderStroke'].lineWidth;
        result.moveBy(-w / 2, -w / 2);
        result.dim.width += w;
        result.dim.height += w;
      }
      return result;
    }
  };

  // AbstractBox extends AWT.Rectangle
  AbstractBox.prototype = $.extend(Object.create(AWT.Rectangle.prototype), AbstractBox.prototype);

  return AbstractBox;
});