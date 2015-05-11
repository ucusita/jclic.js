//    File    : MediaBagElement.js  
//    Created : 07/04/2015  
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
  "../Utils",
  "../AWT"
], function ($, Utils, AWT) {

// This kind of objects are the members of [MediaBag](MediaBag.html).
// Media elements have a name, a reference to a file (the `fileName` field)
// and, when initialized, a `data` field pointing to the object that contains
// the media. They have also a flag indicating if the data must be saved
// into the [JClicProject](JClicProject.html) file or just mantained as a 
// reference to an external file.
//
  var MediaBagElement = function (fileName) {
    if (fileName) {
      this.fileName = fileName;
      this.name = fileName;
      this.ext = this.fileName.toLowerCase().split('.').pop();
      this.type = this.getFileType(this.ext);
    }
  };

  MediaBagElement.prototype = {
    constructor: MediaBagElement,
    //
    // The name of this element. Usually is the same as `fileName`
    name: '',
    //
    // The file this element points to
    fileName: '',
    //
    // When loaded, this field will store the realized media object
    data: null,
    //
    // Flag to indicate that `data` is ready to be used
    ready: false,
    //
    // Normalized extension of `fileName`, useful to determine the kind of media
    ext: '',
    // 
    // The resource type (audio, image, midi, video, font)
    type: null,
    // 
    // Other fields present in JClic, currently not used:  
    // animated: false,  
    // usageCount: 0,  
    // projectFlag: false,  
    // saveFlag: true,  
    // hasThumb: false,  
    //   
    // Loads the object settings from a specific JQuery XML element 
    setProperties: function ($xml) {
      this.name = $xml.attr('name');
      this.fileName = $xml.attr('file');
      this.ext = this.fileName.toLowerCase().split('.').pop();
      this.type = this.getFileType(this.ext);
      return this;
    },
    // Checks if the MediaBagElement has been initiated
    isEmpty: function () {
      return this.data === null;
    },
    //
    // Determines the type of this MediaBagElement based on the file extension
    getFileType: function (ext) {
      var result = null;
      for (var type in Utils.settings.FILE_TYPES) {
        if (Utils.settings.FILE_TYPES[type].indexOf(ext) >= 0)
          result = type;
      }
      return result;
    },
    //
    // Realizes the media content
    // The optional `callback` method is called when the referred resource is ready
    build: function (callback) {
      var media = this;
      switch (this.type) {
        case 'font':
          var format = this.ext === 'ttf' ? 'truetype'
              : this.ext === 'otf' ? 'embedded-opentype'
              : this.ext;
          $('head').prepend(
              '<style type="text/css">' +
              '@font-face{font-family:"' + this.name + '";' +
              'src:url(' + this.fileName + ') format("' + format + '");}' +
              '</style>');
          this.data = new AWT.Font(this.name);
          this.ready = true;
          break;

        case 'image':
          this.data = new Image();
          $(this.data).attr('src', this.fileName);
          if (this.data.complete || this.data.readyState === 4 || this.data.readyState === 'complete')
            // Image was in cache
            this.ready = true;
          else
            $(this.data).load(function (response, status, xhr) {
              if (status !== 'error') {
                this.ready = true;
                if (callback)
                  callback.apply(media);
              }
            });
          break;

        case 'audio':
          this.data = new Audio(this.fileName);
          if (this.data.complete || this.data.readyState === 4 || this.data.readyState === 'complete')
            // Audio was in cache
            this.ready = true;
          else
            $(this.data).load(function (response, status, xhr) {
              if (status !== 'error') {
                this.ready = true;
                if (callback)
                  callback.apply(media);
              }
            });
          break;

        case 'xml':
          this.data = '';
          $.get(this.fileName, function (response, status, xhr) {
            if (status !== 'error') {
              this.data = response;
              this.ready = true;
              if (callback)
                callback.apply(media);
            }
          }, 'xml');
          break;

        default:
          // Always simulate resource ready
          // TODO: Load the real resource
          this.ready = true;
          return;

      }

      console.log('loading ' + this.name);

      if (this.ready && callback)
        callback.apply(media);

      return this;
    }
  };

  return MediaBagElement;

});