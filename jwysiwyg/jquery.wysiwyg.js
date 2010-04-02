/**
 * WYSIWYG - jQuery plugin 0.7
 *
 * Copyright (c) 2008-2009 Juan M Martinez
 * http://plugins.jquery.com/project/jWYSIWYG
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Id: $
 */

/*jslint browser: true, forin: true */

(function ($)
{
        /**
         * @constructor
         * @private
         */
        var Wysiwyg = function (element, options)
        {
                this.init(element, options);
        };

        $.fn.document = function ()
        {
                var element = this.get(0);

                if (element.nodeName.toLowerCase() == 'iframe')
                {
                        return element.contentWindow.document;
                        /*
                         return ( $.browser.msie )
                         ? document.frames[element.id].document
                         : element.contentWindow.document // contentDocument;
                         */
                }
                return this;
        };

        $.fn.documentSelection = function ()
        {
                var element = this.get(0);

                if (element.contentWindow.document.selection)
                {
                        return element.contentWindow.document.selection.createRange().text;
                }
                else
                {
                        return element.contentWindow.getSelection().toString();
                }
        };

        $.fn.wysiwyg = function (options)
        {
                if (arguments.length > 0 && arguments[0].constructor == String)
                {
                        var action = arguments[0].toString();
                        var params = [];

                        for (var i = 1; i < arguments.length; i++)
                        {
                                params[i - 1] = arguments[i];
                        }
                        if (action == 'enabled')
                        {
                                return this.data('wysiwyg') != null;
                        }
                        if (action in Wysiwyg)
                        {
                                return this.each(function ()
                                {
                                        $.data(this, 'wysiwyg').designMode();

                                        Wysiwyg[action].apply(this, params);
                                });
                        }
                        else
                        {
                                return this;
                        }
                }

                var controls = { };

                /**
                 * If the user set custom controls, we catch it, and merge with the
                 * defaults controls later.
                 */
                if (options && options['controls'])
                {
                        controls = options['controls'];
                        delete options['controls'];
                }

                options = $.extend($.fn.wysiwyg.defaults, options);
                options.controls = $.extend(true, options.controls, $.fn.wysiwyg.controls);
                for (var control in controls)
                {
                        if (control in options.controls)
                        {
                                $.extend(options.controls[control], controls[control]);
                        }
                        else
                        {
                                options.controls[control] = controls[control];
                        }
                }

                // not break the chain
                return this.each(function ()
                {
                        new Wysiwyg(this, options);
                });
        };

        $.fn.wysiwyg.defaults = {
                html: '<' + '?xml version="1.0" encoding="UTF-8"?' + '><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body style="margin: 0px;">INITIAL_CONTENT</body></html>',
                formHtml: '<form class="wysiwyg"><fieldset><legend>Insert table</legend><label>Count of columns: <input type="text" name="colCount" value="3" /></label><label>Count of rows: <input type="text" name="rowCount" value="3" /></label><input type="submit" class="button" value="Insert table" /> <input type="reset" value="Cancel" /></fieldset></form>',
                formWidth: 440,
                formHeight: 220,
                tableFiller: 'Lorem ipsum',
                css: { },
                debug: false,
                autoSave: true,
                // http://code.google.com/p/jwysiwyg/issues/detail?id=11
                rmUnwantedBr: true,
                // http://code.google.com/p/jwysiwyg/issues/detail?id=15
                brIE: true,
                messages: 
                {
                        nonSelection: 'select the text you wish to link'
                },
                controls: { }
        };
        $.fn.wysiwyg.controls = {
                bold: {
                        visible: true,
                        tags: ['b', 'strong'],
                        css: {
                                fontWeight: 'bold'
                        },
                        tooltip: 'Bold'
                },
                italic: {
                        visible: true,
                        tags: ['i', 'em'],
                        css: {
                                fontStyle: 'italic'
                        },
                        tooltip: 'Italic'
                        },
                strikeThrough: {
                        visible: true,
                        tags: ['s', 'strike'],
                        css: {
                                textDecoration: 'line-through'
                        },
                        tooltip: 'Strike-through'
                },
                underline: {
                        visible: true,
                        tags: ['u'],
                        css: {
                                textDecoration: 'underline'
                        },
                        tooltip: 'Underline'
                },
                justifyLeft: {
                        visible: true,
                        separated: true,
                        css: {
                                textAlign: 'left'
                        },
                        tooltip: 'Justify Left'
                },
                justifyCenter: {
                        visible: true,
                        tags: ['center'],
                        css: {
                                textAlign: 'center'
                        },
                        tooltip: 'Justify Center'
                },
                justifyRight: {
                        visible: true,
                        css: {
                                textAlign: 'right'
                        },
                        tooltip: 'Justify Right'
                },
                justifyFull: {
                        visible: true,
                        css: {
                                textAlign: 'justify'
                        },
                        tooltip: 'Justify Full'
                },
                indent: {
                        separated: true,
                        visible: true,
                        tooltip: 'Indent'
                },
                outdent: {
                        visible: true,
                        tooltip: 'Outdent'
                },
                subscript: {
                        separated: true,
                        visible: true,
                        tags: ['sub'],
                        tooltip: 'Subscript'
                        },
                superscript: {
                        visible: true,
                        tags: ['sup'],
                        tooltip: 'Superscript'
                        },
                undo: {
                        separated: true,
                        visible: true,
                        tooltip: 'Undo'
                },
                redo: {
                        visible: true,
                        tooltip: 'Redo'
                },
                insertOrderedList: {
                        separated: true,
                        visible: true,
                        tags: ['ol'],
                        tooltip: 'Insert Ordered List'
                },
                insertUnorderedList: {
                        visible: true,
                        tags: ['ul'],
                        tooltip: 'Insert Unordered List'
                },
                insertHorizontalRule: {
                        visible: true,
                        tags: ['hr'],
                        tooltip: 'Insert Horizontal Rule'
                },
                createLink: {
                        separated: true,
                        visible: true,
                        exec: function ()
                        {
                                var selection = $(this.editor).documentSelection();

                                if (selection.length > 0)
                                {
                                        if ($.browser.msie)
                                        {
                                                this.focus();
                                                this.editorDoc.execCommand('createLink', true, null);
                                        }
                                        else
                                        {
                                                var szURL = prompt('URL', 'http://');
                                                if (szURL && szURL.length > 0)
                                                {
                                                        this.editorDoc.execCommand('unlink', false, []);
                                                        this.editorDoc.execCommand('createLink', false, szURL);
                                                }
                                        }
                                }
                                else if (this.options.messages.nonSelection)
                                {
                                        alert(this.options.messages.nonSelection);
                                }
                        },
                        tags: ['a'],
                        tooltip: 'Create link'
                },
                insertImage: {
                        visible: true,
                        exec: function ()
                        {
                                if ($.browser.msie)
                                {
                                        this.focus();
                                        this.editorDoc.execCommand('insertImage', true, null);
                                }
                                else
                                {
                                        var szURL = prompt('URL', 'http://');
                                        if (szURL && szURL.length > 0)
                                        {
                                                this.editorDoc.execCommand('insertImage', false, szURL);
                                        }
                                }
                        },
                        tags: ['img'],
                        tooltip: 'Insert image'
                },
                insertTable: {
                        visible: true,
                        exec: function ()
                        {
                                if ($.modal)
                                {
                                        var self = this;
                                        $.modal($.fn.wysiwyg.defaults.formHtml, {
                                                onShow: function(dialog)
                                                {
                                                        $('input:submit', dialog.data).click(function(e)
                                                        {
                                                                e.preventDefault();
                                                                var rowCount = $('input[name="rowCount"]', dialog.data).val();
                                                                var colCount = $('input[name="colCount"]', dialog.data).val();
                                                                self.insertTable(colCount, rowCount, $.fn.wysiwyg.defaults.tableFiller);
                                                                $.modal.close();
                                                        });
                                                        $('input:reset', dialog.data).click(function(e)
                                                        {
                                                                e.preventDefault();
                                                                $.modal.close();
                                                        });
                                                },
                                                maxWidth: $.fn.wysiwyg.defaults.formWidth,
                                                maxHeight: $.fn.wysiwyg.defaults.formHeight,
                                                overlayClose: true
                                        });
                                }
                                else
                                {
                                        var colCount = prompt('Count of columns', '3');
                                        var rowCount = prompt('Count of rows', '3');
                                        this.insertTable(colCount, rowCount, $.fn.wysiwyg.defaults.tableFiller);
                                }
                        },
                        tags: ['table'],
                        tooltip: 'Insert table'
                },
                h1: {
                        visible: true,
                        separated: true,
                        className: 'h1',
                        command: $.browser.msie ? 'FormatBlock' : 'heading',
                        arguments: [$.browser.msie ? '<h1>' : 'h1'],
                        tags: ['h1'],
                        tooltip: 'Header 1'
                },
                h2: {
                        visible: true,
                        className: 'h2',
                        command: $.browser.msie ? 'FormatBlock' : 'heading',
                        arguments: [$.browser.msie ? '<h2>' : 'h2'],
                        tags: ['h2'],
                        tooltip: 'Header 2'
                },
                h3: {
                        visible: true,
                        className: 'h3',
                        command: $.browser.msie ? 'FormatBlock' : 'heading',
                        arguments: [$.browser.msie ? '<h3>' : 'h3'],
                        tags: ['h3'],
                        tooltip: 'Header 3'
                },
                cut: {
                        separated: true,
                        visible: false,
                        tooltip: 'Cut'
                        },
                copy: {
                        visible: false,
                        tooltip: 'Copy'
                },
                paste: {
                        visible: false,
                        tooltip: 'Paste'
                },
                increaseFontSize: {
                        separated: true,
                        visible: false && !($.browser.msie),
                        tags: ['big'],
                        tooltip: 'Increase font size'
                },
                decreaseFontSize: {
                        visible: false && !($.browser.msie),
                        tags: ['small'],
                        tooltip: 'Decrease font size'
                },
                html: {
                        separated: true,
                        visible: false,
                        exec: function ()
                        {
                                if (this.viewHTML)
                                {
                                        this.setContent($(this.original).val());
                                        $(this.original).hide();
                                }
                                else
                                {
                                        this.saveContent();
                                        $(this.original).show();
                                }

                                this.viewHTML = !(this.viewHTML);
                         },
                         tooltip: 'View source code'
                },
                removeFormat: {
                         visible: true,
                         exec: function ()
                         {
                                if ($.browser.msie)
                                {
                                        this.focus();
                                }
                                this.editorDoc.execCommand('removeFormat', false, []);
                                this.editorDoc.execCommand('unlink', false, []);
                         },
                         tooltip: 'Remove formatting'
                }
        };

        $.extend(Wysiwyg, {
                insertImage: function (szURL, attributes)
                {
                        var self = $.data(this, 'wysiwyg');
                        if (self.constructor == Wysiwyg && szURL && szURL.length > 0)
                        {
                                if ($.browser.msie)
                                {
                                        self.focus();
                                }
                                if (attributes)
                                {
                                        self.editorDoc.execCommand('insertImage', false, '#jwysiwyg#');
                                        var img = self.getElementByAttributeValue('img', 'src', '#jwysiwyg#');

                                        if (img)
                                        {
                                                img.src = szURL;

                                                for (var attribute in attributes)
                                                {
                                                        img.setAttribute(attribute, attributes[attribute]);
                                                }
                                        }
                                }
                                else
                                {
                                        self.editorDoc.execCommand('insertImage', false, szURL);
                                }
                        }
                },

                createLink: function (szURL)
                {
                        var self = $.data(this, 'wysiwyg');

                        if (self.constructor == Wysiwyg && szURL && szURL.length > 0)
                        {
                                var selection = $(self.editor).documentSelection();

                                if (selection.length > 0)
                                {
                                        if ($.browser.msie)
                                        {
                                                self.focus();
                                        }
                                        self.editorDoc.execCommand('unlink', false, []);
                                        self.editorDoc.execCommand('createLink', false, szURL);
                                }
                                else if (self.options.messages.nonSelection)
                                {
                                        alert(self.options.messages.nonSelection);
                                }
                        }
                },

                insertHtml: function (szHTML)
                {
                        var self = $.data(this, 'wysiwyg');
                        self.insertHtml(szHTML);
                },

                insertTable: function(colCount, rowCount, filler)
                {
                        $.data(this, 'wysiwyg').insertTable(colCount, rowCount, filler);
                },

                setContent: function (newContent)
                {
                        var self = $.data(this, 'wysiwyg');
                        self.setContent(newContent);
                        self.saveContent();
                },

                clear: function ()
                {
                        var self = $.data(this, 'wysiwyg');
                        self.setContent('');
                        self.saveContent();
                },

                removeFormat: function ()
                {
                        var self = $.data(this, 'wysiwyg');
                        self.removeFormat();
                },

                save: function ()
                {
                        var self = $.data(this, 'wysiwyg');
                        self.saveContent();
                },

                destroy: function ()
                {
                        var self = $.data(this, 'wysiwyg');
                        self.destroy();
                }
        });

        $.extend(Wysiwyg.prototype, {
                original: null,
                options: {
                },

                element: null,
                editor: null,

                removeFormat: function ()
                {
                        if ($.browser.msie) this.focus();
                        this.editorDoc.execCommand('removeFormat', false, []);
                        this.editorDoc.execCommand('unlink', false, []);
                },
                destroy: function ()
                {
                        $(this.element).remove();
                        $.removeData(this.original, 'wysiwyg');
                        $(this.original).show();
                },
                focus: function ()
                {
                        $(this.editorDoc.body).focus();
                },

                init: function (element, options)
                {
                        var self = this;

                        this.editor = element;
                        this.options = options || {
                        };

                        $.data(element, 'wysiwyg', this);

                        var newX = element.width || element.clientWidth || 0;
                        var newY = element.height || element.clientHeight || 0;

                        if (element.nodeName.toLowerCase() == 'textarea')
                        {
                                this.original = element;

                                if (newX == 0 && element.cols)
                                {
                                        newX = (element.cols * 8) + 21;
                                }
                                if (newY == 0 && element.rows)
                                {
                                        newY = (element.rows * 16) + 16;
                                }
                                this.editor = $(location.protocol == 'https:' ? '<iframe src="javascript:false;"></iframe>' : '<iframe></iframe>').css(
                                {
                                        minHeight: (newY - 6).toString() + 'px',
                                        width: (newX - 8).toString() + 'px'
                                }).attr('id', $(element).attr('id') + 'IFrame').attr('frameborder', '0');

                                /**
                                 * http://code.google.com/p/jwysiwyg/issues/detail?id=96
                                 */
                                this.editor.attr('tabindex', $(element).attr('tabindex'));

                                if ($.browser.msie)
                                {
                                        this.editor.css('height', (newY).toString() + 'px');

                                        /**
                                         var editor = $('<span></span>').css({
                                         width	 : ( newX - 6 ).toString() + 'px',
                                         height	: ( newY - 8 ).toString() + 'px'
                                         }).attr('id', $(element).attr('id') + 'IFrame');
                                         
                                         editor.outerHTML = this.editor.outerHTML;
                                         */
                                }
                        }

                        var panel = this.panel = $('<ul role="menu" class="panel"></ul>');

                        this.appendControls();
                        this.element = $('<div></div>').css(
                        {
                                width: (newX > 0) ? (newX).toString() + 'px' : '100%'
                        }).addClass('wysiwyg').append(panel).append($('<div><!-- --></div>').css(
                        {
                                clear: 'both'
                        })).append(this.editor);

                        $(element).hide().before(this.element);

                        this.viewHTML = false;
                        this.initialHeight = newY - 8;

                        /**
                         * @link http://code.google.com/p/jwysiwyg/issues/detail?id=52
                         */
                        this.initialContent = $(element).val();
                        this.initFrame();

                        if (this.initialContent.length === 0)
                        {
                                this.setContent('');
                        }

                        /**
                         * http://code.google.com/p/jwysiwyg/issues/detail?id=100
                         */
                        var form = $(element).closest('form');

                        if (this.options.autoSave)
                        {
                                form.submit(function ()
                                {
                                        self.saveContent();
                                });
                        }

                        form.bind('reset', function ()
                        {
                                self.setContent(self.initialContent);
                                self.saveContent();
                        });
                },

                initFrame: function ()
                {
                        var self = this;
                        var style = '';

                        /**
                         * @link http://code.google.com/p/jwysiwyg/issues/detail?id=14
                         */
                        if (this.options.css && this.options.css.constructor == String)
                        {
                                style = '<link rel="stylesheet" type="text/css" media="screen" href="' + this.options.css + '" />';
                        }

                        this.editorDoc = $(this.editor).document();
                        this.editorDoc_designMode = false;

                        try
                        {
                                this.editorDoc.designMode = 'on';
                                this.editorDoc_designMode = true;
                        }
                        catch (e)
                        {
                                // Will fail on Gecko if the editor is placed in an hidden container element
                                // The design mode will be set ones the editor is focused
                                $(this.editorDoc).focus(function ()
                                {
                                        self.designMode();
                                });
                        }

                        this.editorDoc.open();
                        this.editorDoc.write(
                        this.options.html
                        /**
                         * @link http://code.google.com/p/jwysiwyg/issues/detail?id=144
                         */
                        .replace(/INITIAL_CONTENT/, function ()
                        {
                                return self.initialContent;
                        }).replace(/STYLE_SHEET/, function ()
                        {
                                return style;
                        }));
                        this.editorDoc.close();

                        this.editorDoc.contentEditable = 'true';

                        if ($.browser.msie)
                        {
                                /**
                                 * Remove the horrible border it has on IE.
                                 */
                                window.setTimeout(function ()
                                {
                                        $(self.editorDoc.body).css('border', 'none');
                                }, 0);
                        }

                        $(this.editorDoc).click(function (event)
                        {
                                self.checkTargets(event.target ? event.target : event.srcElement);
                        });

                        /**
                         * @link http://code.google.com/p/jwysiwyg/issues/detail?id=20
                         */
                        $(this.original).focus(function ()
                        {
                                if (!$.browser.msie)
                                {
                                        self.focus();
                                }
                        });

                        if (!$.browser.msie)
                        {
                                $(this.editorDoc).keydown(function (event)
                                {
                                        if (event.ctrlKey)
                                        {
                                                switch (event.keyCode)
                                                {
                                                case 66:
                                                        // Ctrl + B
                                                        this.execCommand('Bold', false, false);
                                                        return false;
                                                case 73:
                                                        // Ctrl + I
                                                        this.execCommand('Italic', false, false);
                                                        return false;
                                                case 85:
                                                        // Ctrl + U
                                                        this.execCommand('Underline', false, false);
                                                        return false;
                                                }
                                        }
                                        return true;
                                });
                        }
                        else if (this.options.brIE)
                        {
                                $(this.editorDoc).keydown(function (event)
                                {
                                        if (event.keyCode == 13)
                                        {
                                                var rng = self.getRange();
                                                rng.pasteHTML('<br />');
                                                rng.collapse(false);
                                                rng.select();
                                                return false;
                                        }
                                        return true;
                                });
                        }

                        if (this.options.autoSave)
                        {
                                /**
                                 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=11
                                 */
                                $(this.editorDoc).keydown(function ()
                                {
                                        self.saveContent();
                                }).keyup(function ()
                                {
                                        self.saveContent();
                                }).mousedown(function ()
                                {
                                        self.saveContent();
                                });
                        }

                        if (this.options.css)
                        {
                                window.setTimeout(function ()
                                {
                                        if (self.options.css.constructor == String)
                                        {
                                                /**
                                                 * $(self.editorDoc)
                                                 * .find('head')
                                                 * .append(
                                                 *	 $('<link rel="stylesheet" type="text/css" media="screen" />')
                                                 *	 .attr('href', self.options.css)
                                                 * );
                                                 */
                                        }
                                        else
                                        {
                                                $(self.editorDoc).find('body').css(self.options.css);
                                        }
                                }, 0);
                        }
                },

                designMode: function ()
                {
                        if (!(this.editorDoc_designMode))
                        {
                                try
                                {
                                        this.editorDoc.designMode = 'on';
                                        this.editorDoc_designMode = true;
                                }
                                catch (e)
                                {
                                }
                        }
                },

                getSelection: function ()
                {
                        return (window.getSelection) ? window.getSelection() : document.selection;
                },

                getRange: function ()
                {
                        var selection = this.getSelection();

                        if (!(selection))
                        {
                                return null;
                        }

                        return (selection.rangeCount > 0) ? selection.getRangeAt(0) : selection.createRange();
                },

                getContent: function ()
                {
                        return $($(this.editor).document()).find('body').html();
                },

                setContent: function (newContent)
                {
                        $($(this.editor).document()).find('body').html(newContent);
                },
                insertHtml: function (szHTML)
                {
                        if (szHTML && szHTML.length > 0)
                        {
                                if ($.browser.msie)
                                {
                                        this.focus();
                                        this.editorDoc.execCommand('insertImage', false, '#jwysiwyg#');
                                        var img = this.getElementByAttributeValue('img', 'src', '#jwysiwyg#');
                                        if (img)
                                        {
                                                $(img).replaceWith(szHTML);
                                        }
                                }
                                else
                                {
                                        this.editorDoc.execCommand('insertHTML', false, szHTML);
                                }
                        }
                },
                insertTable: function(colCount, rowCount, filler)
                {
                        if (isNaN(rowCount) || isNaN(colCount))
                        {
                                return;
                        }
                        colCount = parseInt(colCount);
                        rowCount = parseInt(rowCount);
                        if (filler == null)
                        {
                                filler = '&nbsp;';
                        }
                        filler = '<td>' + filler + '</td>';
                        var html = ['<table border="1" style="width: 100%;"><tbody>'];
                        for (var i = rowCount; i > 0; i--)
                        {
                                html.push('<tr>');
                                for (var j = colCount; j > 0; j--)
                                {
                                        html.push(filler);
                                }
                                html.push('</tr>');
                        }
                        html.push('</tbody></table>');
                        this.insertHtml(html.join(''));
                },
                saveContent: function ()
                {
                        if (this.original)
                        {
                                var content = this.getContent();

                                if (this.options.rmUnwantedBr)
                                {
                                        content = (content.substr(-4) == '<br>') ? content.substr(0, content.length - 4) : content;
                                }

                                $(this.original).val(content);
                        }
                },

                withoutCss: function ()
                {
                        if ($.browser.mozilla)
                        {
                                try
                                {
                                        this.editorDoc.execCommand('styleWithCSS', false, false);
                                }
                                catch (e)
                                {
                                        try
                                        {
                                                this.editorDoc.execCommand('useCSS', false, true);
                                        }
                                        catch (e2)
                                        {
                                        }
                                }
                        }
                },

                appendMenu: function (cmd, args, className, fn, tooltip)
                {
                        var self = this;
                        args = args || [];

                        $('<li></li>').append(
                        $('<a role="menuitem" tabindex="-1" href="javascript:;">' + (className || cmd) + '</a>').addClass(className || cmd).attr('title', tooltip)).click(function ()
                        {
                                if (fn)
                                {
                                        fn.apply(self);
                                }
                                else
                                {
                                        self.focus();
                                        self.withoutCss();
                                        self.editorDoc.execCommand(cmd, false, args);
                                }
                                if (self.options.autoSave)
                                {
                                        self.saveContent();
                                }
                                this.blur();
                        }).appendTo(this.panel);
                },

                appendMenuSeparator: function ()
                {
                        $('<li role="separator" class="separator"></li>').appendTo(this.panel);
                },

                appendControls: function ()
                {
                        for (var name in this.options.controls)
                        {
                                var control = this.options.controls[name];
                                if (!control.visible)
                                {
                                        continue;
                                }
                                if (control.separator || control.separated)
                                {
                                        this.appendMenuSeparator();
                                }
                                if (control.separator)
                                {
                                        continue;
                                }
                                this.appendMenu(
                                        control.command || name,
                                        control.arguments || [],
                                        control.className || control.command || name || 'empty',
                                        control.exec,
                                        control.tooltip || control.command || name || ''
                                );
                        }
                },

                checkTargets: function (element)
                {
                        for (var name in this.options.controls)
                        {
                                var control = this.options.controls[name];
                                var className = control.className || control.command || name || 'empty';

                                $('.' + className, this.panel).removeClass('active');

                                if (control.tags)
                                {
                                        var elm = element;
                                        do
                                        {
                                                if (elm.nodeType != 1)
                                                {
                                                        break;
                                                }

                                                if ($.inArray(elm.tagName.toLowerCase(), control.tags) != -1)
                                                {
                                                        $('.' + className, this.panel).addClass('active');
                                                }
                                        } while ((elm = elm.parentNode));
                                }

                                if (control.css)
                                {
                                        var el = $(element);

                                        do
                                        {
                                                if (el[0].nodeType != 1)
                                                {
                                                        break;
                                                }

                                                for (var cssProperty in control.css)
                                                {
                                                        if (el.css(cssProperty).toString().toLowerCase() == control.css[cssProperty])
                                                        {
                                                                $('.' + className, this.panel).addClass('active');
                                                        }
                                                }
                                        } while ((el = el.parent()));
                                }
                        }
                },

                getElementByAttributeValue: function (tagName, attributeName, attributeValue)
                {
                        var elements = this.editorDoc.getElementsByTagName(tagName);

                        for (var i = 0; i < elements.length; i++)
                        {
                                var value = elements[i].getAttribute(attributeName);

                                if ($.browser.msie)
                                { /** IE add full path, so I check by the last chars. */
                                        value = value.substr(value.length - attributeValue.length);
                                }

                                if (value == attributeValue)
                                {
                                        return elements[i];
                                }
                        }

                        return false;
                }
        });
})(jQuery);
