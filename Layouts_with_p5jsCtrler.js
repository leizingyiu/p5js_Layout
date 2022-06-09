// let console={};
// console.log=()=>{};

class Layouts {
    constructor(grid, p5js_ctrler) {
        let that = this;
        this.layouts = {};

        this.grid = grid,
            this.p5js_ctrler = p5js_ctrler.type == 'p5js_ctrler' ? p5js_ctrler : p5js_ctrler.parent(),
            this.ctrler_container = p5js_ctrler;


        this.addBtn = this.ctrler_container.button('addingText', 'add a text', () => {
            that.add('text' + Object.keys(this.layouts).length, 'text_PlaceHolder, change in below');
        });

        this.ctrler_container.select('setting_layout', [], (e) => {
            // 下拉菜单选择对应layout后，更新slider

            let layoutName = e.target.value;
            that.setOpcGridAble(layoutName);
            that.updateCtrler();
            that.updateInputBoxs();
        });

        this.selector = this.p5js_ctrler.ctrlers['setting_layout'];

        this.contentsDict = {
            "Layouts_str": "str",
            "Layouts_font_url": "font"
        };

        this.inputBoxs = {};

        Object.keys(this.contentsDict).map(n => {
            this.ctrler_container.input(n, '', (e) => {
                let layoutName = this.selector.value();
                let propertyGrop = 'contents';
                let prop = this.contentsDict[n];
                switch (prop) {
                    case 'str':
                        let fontName = this.inputBoxs[n].value(),
                            font;
                        let reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
                        if (fontName.match(reg) != null) {
                            font = loadFont(fontName);
                        } else {
                            font = fontName;
                        }
                        this.layouts[layoutName][propertyGrop][prop] = font;
                        break;
                    case 'font':
                        this.layouts[layoutName][propertyGrop][prop] = this.inputBoxs[n].value();
                        break;
                };
                that.update();
            });
            this.inputBoxs[n] = this.p5js_ctrler.ctrlers[n];
        });

        this.modusDict = {
            'grid': 'griding',
            'measurement': 'measureing'
        };
        this.ctrler_container.radio('Layouts_modus',
            Object.keys(this.modusDict),
            (e) => {
                let layoutName = that.selector.value();
                let modus = that.modusSelector.getCtrlerVal();

                // console.log(layoutName,'|',modus,'|',this.layouts,'|',this.modusDict,'|',this.modusDict[modus]);

                that.layouts[layoutName][this.modusDict[modus]]();
                that.updateCtrler();
            });
        this.modusSelector = this.p5js_ctrler.ctrlers['Layouts_modus'];

        let l = new Layout('', { font: textFont() });
        let layoutFuncs = [...l.layoutFuncs];
        this.ctrler_container.select('Layouts_layoutType', layoutFuncs, (e) => {
            let layoutName = this.selector.value();

            that.layouts[layoutName].layoutType = this.layoutTypeSelector.value();
            that.layouts[layoutName].layout.layoutType = this.layoutTypeSelector.value();
            that.layouts[layoutName].layout.layoutFunc();
        })

        this.layoutTypeSelector = this.p5js_ctrler.ctrlers['Layouts_layoutType'];

        this.ctrler_container.hr();

        this.varDict = { // 变量字典:{ 全局变量 : layout 内部变量名称}
            'Layouts_margin': 'margin',
            'Layouts_padding': 'padding',
            'Layouts_spacing': 'spacing',
            'Layouts_left': 'left',
            'Layouts_top': 'top',
            "Layouts_row": "row",
            "Layouts_col": "col",
            'Layouts_w': 'w',
            'Layouts_h': 'h',
        };
        this.propertyDict = { // layout内部属性字典:{属性: 属性所在组}
            'margin': 'space',
            'padding': 'space',
            'spacing': 'space',
            'row': 'grid',
            'col': 'grid',
            'left': 'measurement',
            'top': 'measurement',
            'w': ['grid', 'measurement'],
            'h': ['grid', 'measurement']
        };

        this.sliderDefault = { // 初始滑块限位:{ layout内部属性 : 默认,最小,最大 }
            "margin": {
                "default": 0,
                "min": 0,
                "max": Math.max(width, height) / 2
            },
            "padding": {
                "default": 0,
                "min": 0,
                "max": Math.max(width, height) / 4
            },
            "spacing": {
                "default": 0,
                "min": 0,
                "max": Math.max(width, height) / 4
            },
            "row": {
                "default": 0,
                "min": 0,
                "max": this.grid.row - 1
            },
            "col": {
                "default": 0,
                "min": 0,
                "max": this.grid.col - 1
            },

            "left": {
                "default": 0,
                "min": 0,
                "max": width
            },
            "top": {
                "default": 0,
                "min": 0,
                "max": height
            },
            "w": {
                "default": width,
                "min": 0,
                "max": width * 2
            },
            "h": {
                "default": height,
                "min": 0,
                "max": height * 2
            },
        }

        this.ctrlers = {};
        Object.keys(this.varDict).map(n => {
            // console.log(this.sliderDefault[this.varDict[n]].default)
            this.ctrler_container.slider(n,
                this.sliderDefault[this.varDict[n]].default,
                this.sliderDefault[this.varDict[n]].min,
                this.sliderDefault[this.varDict[n]].max,
                1,
                (e) => {
                    let layoutName = this.selector.value();
                    let propertyGrop = this.propertyDict[this.varDict[n]];
                    let prop = this.varDict[n];
                    if (['w', 'h'].indexOf(this.varDict[n]) != -1) {
                        propertyGrop = this.layouts[layoutName].modus;
                    }

                    console.log(n, this.varDict[n], propertyGrop, that.layouts[layoutName], that.layouts[layoutName][propertyGrop]);

                    that.layouts[layoutName][propertyGrop][prop] = Number(e.path[0].value);

                    that.update();

                });
            this.ctrlers[n] = this.p5js_ctrler.ctrlers[n];
        });

        this.ctrler_container.hr();

        this.styleDict = {
            '_fill': drawingContext.fillStyle,
            '_stroke': drawingContext.strokeStyle,
            '_fillBoo': true,
            '_strokeBoo': true,
            '_strokeWeight': drawingContext.lineWidth,
            '_strokeJoin': drawingContext.lineJoin,
            '_blendMode': drawingContext.globalCompositeOperation
        };
        Object.entries(this.styleDict).map(style => {
            let [styleType, value] = style;
            switch (styleType) {
                case '_fill':
                case '_stroke':
                    that.ctrler_container.color(styleType, value, (e) => {
                        let v = that.p5js_ctrler.getCtrlerVal(styleType);
                        let layoutName = that.selector.value();
                        console.log(e, v, that.layouts[layoutName].style, that.layouts[layoutName].style[styleType]);
                        that.layouts[layoutName].style[styleType] = v;
                        that.layouts[layoutName].style[styleType + 'Style'] = false;
                    });
                    break;
                case '_fillBoo':
                case '_strokeBoo':
                    that.ctrler_container.checkbox(styleType, value, ['yes', 'no'], (e) => {
                        let v = that.p5js_ctrler.getCtrlerVal(styleType);
                        let layoutName = that.selector.value();
                        console.log(e, v, that.layouts[layoutName].style, that.layouts[layoutName].style[styleType]);
                        that.layouts[layoutName].style[styleType] = v;
                    });
                    break;
                case '_strokeWeight':
                    that.ctrler_container.slider(styleType, Number(value), 0, 48, 1, (e) => {
                        let v = that.p5js_ctrler.getCtrlerVal(styleType);
                        let layoutName = that.selector.value();
                        that.layouts[layoutName].style[styleType] = v;
                    });
                    break;
                case '_blendMode':
                    that.ctrler_container.select(styleType, ['source-over', 'lighter', 'darken', 'lighten', 'difference', 'exclusion', 'multiply', 'screen', 'copy', 'overlay', 'hard-light', 'soft-light', 'color-dodge', 'color-burn'],
                        (e) => {
                            let v = that.p5js_ctrler.getCtrlerVal(styleType);
                            let layoutName = that.selector.value();
                            that.layouts[layoutName].style[styleType] = v;
                        });
                    break;
                case '_strokeJoin':
                    that.ctrler_container.select(styleType, [MITER, BEVEL, ROUND],
                        (e) => {
                            let v = that.p5js_ctrler.getCtrlerVal(styleType);
                            let layoutName = that.selector.value();
                            that.layouts[layoutName].style[styleType] = v;
                        });
                    break;
            }
            that.p5js_ctrler.update(styleType, value);
            that.ctrlers[styleType] = that.p5js_ctrler.ctrlers[styleType];
        })

        this.gridAdaptFuncs = ['gridFill', 'gridFillCeil', 'gridFillFloor'];
    }

    add(name, str,
        settings = {
            font: textFont(),
            margin: false,
            padding: false,
            spacing: false,
            left: false,
            top: false,
            w: width,
            h: height,
            layoutFunc: false,
            rectMode: CENTER,
            textHorizAlign: CENTER,
            textVertAlign: CENTER,
            fillCell: 'height',
            fill: '#ffffff',
            stroke: '#000000',
            fillBoo: true,
            strokeBoo: true,
            strokeWeight: 1,
            blendMode: 'source-over',
            fillStyle: false,
            strokeStyle: false,
            strokeJoin: MITER
        }
    ) {
        let defaultSettings = {
            font: textFont(),
            margin: 0,
            padding: 0,
            spacing: 0,
            left: 0,
            top: 0,
            w: width,
            h: height,
            layoutFunc: false,
            rectMode: CENTER,
            textHorizAlign: CENTER,
            textVertAlign: CENTER,
            fillCell: 'height',
            fill: '#ffffff',
            stroke: '#000000',
            fillBoo: true,
            strokeBoo: true,
            strokeWeight: 1,
            blendMode: 'source-over',
            fillStyle: false,
            strokeStyle: false,
            strokeJoin: MITER
        };

        if (settings instanceof Array) {
            let temp = [...settings];
            settings = {};
            temp.length = Math.max(temp.length, Object.keys(defaultSettings).length);
            Object.keys(defaultSettings).map((k, kIdx) => {
                settings[k] = temp[kIdx];
            });
        }

        Object.keys(defaultSettings).map((k, kIdx) => {

            if (typeof settings[k] == 'undefined' || settings[k] == false) {
                settings[k] = defaultSettings[k];
            }
        });

        let stickToCanvas;
        if (arguments.length < 9) {
            stickToCanvas = true;
        } else {
            stickToCanvas = false;
        }

        let that = this;



        this.layouts[name] = {
            contents: {
                str: str,
                font: settings.font
            },
            space: {
                margin: settings.margin,
                padding: settings.padding,
                spacing: settings.spacing,
            },
            gridAdaptBoo: this.gridAdaptFuncs.includes(settings.layoutFunc) ? true : false,
            grid: this.gridAdaptFuncs.includes(settings.layoutFunc) ?
                Object.fromEntries([settings.left, settings.top, settings.w, settings.h].map((i, idx) => [
                    ['col', 'row', 'w', 'h'][idx], i
                ])) : {
                    row: 0,
                    col: 0,
                    w: 1,
                    h: 1
                },
            measurement: {
                left: settings.left,
                top: settings.top,
                w: settings.w,
                h: settings.h,
            },
            settings: settings,
            layoutType: '',
            modus: '',
            range: {},
            style: {
                _fill: settings.fill,
                _stroke: settings.stroke,
                _fillBoo: settings.fillBoo,
                _strokeBoo: settings.strokeBoo,
                _strokeWeight: settings.strokeWeight,
                _blendMode: settings.blendMode,
                _fillStyle: settings.fillStyle,
                _strokeStyle: settings.strokeStyle,
                _strokeJoin: settings.strokeJoin
            },
            letterFillFn: false,
            letterStrokeFn: false
        };
        this.layouts[name].stickToCanvas = stickToCanvas;



        if (this.layouts[name].gridAdaptBoo == false) {


            this.layouts[name].layout = new Layout(
                this.layouts[name].contents.str,
                {
                    font: this.layouts[name].contents.font,
                    ...this.layouts[name].space,
                    ...this.layouts[name].measurement,
                    ...this.layouts[name].settings
                });

            this.layouts[name].modus = 'measurement';

        } else {

            this.layouts[name].layout = new Layout(
                this.layouts[name].contents.str,
                {
                    font: this.layouts[name].contents.font,
                    ...this.layouts[name].space,
                    ...this.grid.cellArgsObj(...Object.values(this.layouts[name].grid, this.layouts[name].settings.rectMode)),
                    ...this.layouts[name].settings
                }
            );

            this.layouts[name].modus = 'grid';


        }






        this.layouts[name].layout.layoutFunc(this.layouts[name].layoutType);


        this.layouts[name].griding = (
            row = this.layouts[name].grid.row,
            col = this.layouts[name].grid.col,
            w = this.layouts[name].grid.w,
            h = this.layouts[name].grid.h) => {
            that.layouts[name].gridAdaptBoo = true;

            // console.log('griding', that.layouts[name].gridAdaptBoo);

            that.layouts[name].grid = {
                row: row,
                col: col,
                w: w,
                h: h,
                width: w,
                height: h
            };
            that.layouts[name].modus = 'grid';

            that.update(name);

            return that.layouts[name];
        };

        this.layouts[name].measureing = function (
            l = this.layouts[name].measurement.left,
            t = this.layouts[name].measurement.top,
            w = this.layouts[name].measurement.w,
            h = this.layouts[name].measurement.h
        ) {
            // if (arguments.length > 2) {
            //     that.layouts[name].stickToCanvas = false;
            // }
            that.layouts[name].gridAdaptBoo = false;
            that.layouts[name].measurement = {
                l: l,
                t: t,
                w: w,
                h: h,
                left: l,
                top: t,
                width: w,
                height: h,
            };

            that.layouts[name].modus = 'measurement';

            that.update(name);
            return that.layouts[name];
        };

        this.selector.option(name);

        this.setOpcGridAble();
        this.updateCtrler();
        this.updateInputBoxs();

        return this.layouts[name];
    }

    updateCtrler(ctrlerName) { //更新某个 opc ,如果输入的参数不唯一，或者没有参数，就逐个参数更新，或者更新所有参数

        if (arguments.length != 1) { // 参数不唯一，进入递归
            let args = [];
            if (arguments.length == 0) {
                args = Object.keys(this.ctrlers);
            } else {
                args = [...arguments];
            }
            args.map(a => {
                this.updateCtrler(a);
            })
        } else { // 参数唯一，更新PC


            let layoutName = this.selector.value();


            let prop = Object.keys(this.styleDict).includes(ctrlerName) ? ctrlerName : this.varDict[ctrlerName];
            let propGroup = Object.keys(this.styleDict).includes(ctrlerName) ? 'style' : this.propertyDict[prop];;


            if (this.layouts[layoutName].gridAdaptBoo == true && ['w', 'h'].indexOf(prop) != -1) {
                propGroup = 'grid';
            } else if (this.layouts[layoutName].gridAdaptBoo == false && ['w', 'h'].indexOf(prop) != -1) {
                propGroup = 'measurement';
            }


            this.p5js_ctrler.update(ctrlerName, this.layouts[layoutName][propGroup][prop]);
        }


    }
    setOpcGridAble(layoutName) {

        if (arguments.length == 0) {
            layoutName = this.selector.value();
        }

        let defaultGroupName;

        if (this.layouts[layoutName].gridAdaptBoo == true) {
            ['Layouts_left', 'Layouts_top'].map(i => {
                this.p5js_ctrler.disable(i)
            });
            ['Layouts_row', 'Layouts_col'].map(i => {
                this.p5js_ctrler.enable(i)
            });

            ['Layouts_w', 'Layouts_h'].map((i, idx) => {
                this.p5js_ctrler.range(i, 1, this.grid[['col', 'row'][idx]]);
            });


        } else {
            ['Layouts_left', 'Layouts_top'].map(i => {
                this.p5js_ctrler.enable(i)
            });
            ['Layouts_row', 'Layouts_col'].map(i => {
                this.p5js_ctrler.disable(i)
            });
            defaultGroupName = ['w', 'h'];
            ['Layouts_w', 'Layouts_h'].map((i, idx) => {
                this.p5js_ctrler.range(i,
                    this.sliderDefault[defaultGroupName[idx]]['min'],
                    this.sliderDefault[defaultGroupName[idx]]['max']);
            });
        };
    };

    updateInputBoxs(boxName) {
        if (arguments.length != 1) {
            let args = [];
            if (arguments.length == 0) {
                args = Object.keys(this.inputBoxs);
            } else {
                args = [...arguments];
            }
            args.map(a => {
                this.updateInputBoxs(a);
            })
        } else {
            // console.log(boxName);

            let layoutName = this.selector.value();
            let propertyGrop = 'contents';
            let prop = this.contentsDict[boxName];
            switch (prop) {
                case 'str':
                    this.p5js_ctrler.update(boxName, this.layouts[layoutName][propertyGrop][prop]);
                    break;
                case 'font':
                    push();
                    let font = this.layouts[layoutName][propertyGrop][prop];
                    textFont(font);
                    let fontName = textFont();
                    console.log(fontName, fontName instanceof p5.Font);
                    fontName = typeof fontName == 'string' ? fontName : Object.values(fontName.font.names.fullName)[0];

                    this.p5js_ctrler.update(boxName, fontName);
                    pop();
                    break;
            }
        }
    };

    updateLayoutTypeSelector() {
        let layoutName = this.selector.value();
        this.p5js_ctrler.update('Layouts_layoutType', this.layouts[layoutName].layoutType);
    };

    updateModusSelector() {
        let layoutName = this.selector.value();
        this.p5js_ctrler.update('Layouts_modus', this.layouts[layoutName].modus);
    };
    update() { //update layout inside data to layout.init;
        let names = [];
        if (arguments.length == 0) {
            names = Object.keys(this.layouts);
        } else {
            names = [...arguments];
        }

        names.map(_name => {

            this.layouts[_name].settings = Object.assign(
                this.layouts[_name].settings,
                this.layouts[_name].contents,
                this.layouts[_name].space
            );

            switch (this.layouts[_name].modus) {
                case 'grid':
                    this.layouts[_name].settings = Object.assign(
                        this.layouts[_name].settings,
                        this.grid.cellArgsObj(
                            ...['col', 'row', 'w', 'h'].map(n => this.layouts[_name].grid[n]),
                            'corner'
                        ));
                    break;
                case 'measurement':
                    this.layouts[_name].settings = Object.assign(
                        this.layouts[_name].settings,
                        this.layouts[_name].measurement
                    );
                    break;
            }

            if (Object.keys(this.layouts).indexOf(_name) != -1) {

                this.layouts[_name].layout.init(
                    this.layouts[_name].contents.str,
                    this.layouts[_name].settings
                );

                this.layouts[_name].layout.layoutFunc(this.layouts[_name].layoutType);
            }
        });
        this.setOpcGridAble(this.selector.value());
    };
    text() {

        Object.keys(this.layouts).map(k => {
            push();
            textSize(this.layouts[k].layout.fontsize);
            textFont(this.layouts[k].layout.font);

            strokeWeight(this.layouts[k].style._strokeWeight);
            strokeJoin(this.layouts[k].style._strokeJoin);
            blendMode(this.layouts[k].style._blendMode);

            if (this.layouts[k].layout.fillStyleFn == false) {
                fill(color(this.layouts[k].style._fill));
                if (Boolean(this.layouts[k].style._fillStyle)) {
                    drawingContext.fillStyle = this.layouts[k].style._fillStyle;
                }
                if (this.layouts[k].style._fillBoo == false) {
                    noFill()
                }
            }

            stroke(color(this.layouts[k].style._stroke));
            if (Boolean(this.layouts[k].style._strokeStyle)) {
                drawingContext.strokeStyle = this.layouts[k].style._strokeStyle;
            }
            if (this.layouts[k].style._strokeBoo == false) {
                noStroke()
            }



            this.layouts[k].layout.text();


            pop()
        });

    }

    rect() {
        Object.keys(this.layouts).map(k => {
            push();
            textSize(this.layouts[k].layout.fontsize);
            fill(color(this.layouts[k].style._fill));
            stroke(color(this.layouts[k].style._stroke));
            strokeWeight(this.layouts[k].style._strokeWeight);
            blendMode(this.layouts[k].style._blendMode);
            if (Boolean(this.layouts[k].style._fillStyle)) {
                drawingContext.fillStyle = this.layouts[k].style._fillStyle;
            }
            if (Boolean(this.layouts[k].style._strokeStyle)) {
                drawingContext.strokeStyle = this.layouts[k].style._strokeStyle;
            }
            if (this.layouts[k].style._fillBoo == false) {
                noFill()
            }
            if (this.layouts[k].style._strokeBoo == false) {
                noStroke()
            }
            this.layouts[k].layout.rect();
            pop();
        });
    }
}