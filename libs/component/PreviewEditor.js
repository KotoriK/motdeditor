import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, EditorState, RichUtils } from 'draft-js'
import { lang } from '../../config/config'
//import {*} as 'FormatCode' from './formatCode'
import { RichString, RichChar, Formats, Color, colorEnum, convertSpecialChar } from './formatCode'
const styleMap = (function () {
    let a = {
        'strikethrough': {
            textDecoration: 'line-through',
        },
        'bold': {
            fontWeight: 'bold'
        },
        'italic': {
            fontStyle: 'italic'
        },
        'underLine': {
            textDecoration: 'underline'
        },
        'obfuscated': {
            backgroundColor: '#ffb3b3b6',
        }
    }
    for (const c in colorEnum) {
        a[`c_${c}`] = { color: colorEnum[c].cssForeColor, textShadow: `1px 0.2px ${colorEnum[c].cssBackColor}` }
    }

    return a
})(), colorMatch = /^c_/
/* class ObfuscatedSpan extends React.Component {
    render() {
        <span {...this.props} style={{ color: 'rgba(0,0,0,0' }}>
            {this.props.children}
        </span>
    }
}
class OperationButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { _onClick: this.props.onClick }
    }
    render() {

    }
} */
class CheckButton extends React.Component {

    /**
     *Creates an instance of CheckButton.
     * @param {{caption:String,_onChange:Function,disabled:boolean, value:boolean, focusOnClick:boolean}} props
     * @memberof CheckButton
     */
    //https://github.com/sstur/react-rte/blob/master/src/ui/Button.js focusOnClick
    constructor(props) {
        super(props)
        this.state = { value: this.props.value }

    }
    _onChange(e) {
        this.setState(
            (prev) => {
                return { value: !this.props.value }
            },
            () => {
                this.props._onChange(this.props.caption, this.state.value)
            })
    }
    render() {
        return (
            <button
                className={`btn btn-toolbox ${this.props.disabled ? 'disabled' : ''} ${this.props.value ? 'active' : ''}`}
                onClick={(e) => this._onChange(e)}
                onMouseDown={this.props.focusOnClick ? (e) => { e.preventDefault() } : () => { }}>
                {lang.values[this.props.caption]}
            </button>)
    }
}
class ColorChooserPanel extends React.Component {

    onChoosed(e, colorStr) {
        this.props.onSelectChange(colorEnum[colorStr])
    }
    render() {
        let colorButton = []
        for (const i in colorEnum) {
            colorButton.push(<div key={i}
                onClick={(e) => this.onChoosed(e, i)}
                className="btn btn-sm color-block"
                style={{ backgroundColor: colorEnum[i].cssForeColor }}
                data-toggle="tooltip"
                data-title={`${lang.values[i]}`}
                onMouseDown={this.props.focusOnClick ? (e) => { e.preventDefault() } : () => { }}>
                <span style={{ fontSize: "0.05em", color: colorEnum[i].cssForeColor }}>empty</span>
            </div>)
        }
        return (
            <div className="card" style={{ position: "absolute", top: this.props.pos.top, left: this.props.pos.left, zIndex: 999 }}>
                <div style={{ paddingTop: '5%', paddingBottom: '5%' }}>
                    {colorButton}
                </div>
            </div>
        )
    }
}
class ColorChooser extends React.Component {
    constructor(props) {
        super(props)
        this.state = { showPanel: false, posPanel: { top: 0, left: 0 } }
    }
    /**
     *
     *
     * @param {Color} changeToColor
     * @memberof ColorChooser
     */
    onSelectChange(changeToColor) {
        this.setState({ showPanel: false })
        this.props.onColorChange(changeToColor)
    }
    /**
     *
     *
     * @param {Event} e
     * @memberof ColorChooser
     */
    _onClick(e) {
        //show panel
        let me = e.target
        let top = me.offsetHeight * 2, left = 0
        this.setState((prev) => ({
            showPanel: !prev.showPanel,
            posPanel: {
                top: top,
                left: left
            }
        }))
    }

    render() {
        return (
            <div className={`btn border ${this.state.showPanel ? 'btn-primary active' : 'border-primary'}`}
                onMouseDown={this.props.focusOnClick ? (e) => { e.preventDefault() } : () => { }}>
                <span>字体颜色：</span>
                <div className="btn color-block" onClick={(e) => this._onClick(e)}
                    style={
                        {
                            backgroundColor: this.props.value.cssForeColor,
                            color: this.props.value.cssForeColor
                        }}>
                    <span style={{ padding: 0, fontSize: "0.05em" }}></span>
                </div>
                {this.state.showPanel ? (<ColorChooserPanel pos={this.state.posPanel} onSelectChange={(c) => this.onSelectChange(c)} focusOnClick={this.props.focusOnClick} />) : ''}</div>
        )
    }
}
class ToolsBar extends React.Component {
    constructor(props) {
        super(props)
    }
    _onCheckbuttonChange(key, newValue) {
        this.props._onChange(key, newValue)
    }
    _onColorChange(color) {
        this.props._onChange('Color', color)
    }
    render() {
        let color = this.props.state.Color ? this.props.state.Color : colorEnum.empty
        let checkBtns = []
        for (const i in this.props.state.Decoration) {
            checkBtns.push(
                <CheckButton key={i} caption={i} _onChange={(a, b) => this._onCheckbuttonChange(a, b)} focusOnClick={true} value={this.props.state.Decoration[i]}></CheckButton>)
        }
        return (
            <div className="row">
                <div className='col'>
                    <div className="btn-group" >
                        <div className="btn-group btn-group-toggle"
                        >{checkBtns}</div>
                        <ColorChooser value={color} onColorChange={(c) => this._onColorChange(c)} focusOnClick={true} /></div>

                </div>
            </div>)
    }
}

class PreviewEditor extends React.Component {

    constructor(props) {
        super(props); global.a = this
        this.state = {
            editorState: EditorState.createEmpty(),
            toolsBarState: {
                Decoration: {
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    underLine: false,
                    obfuscated: false
                },
                Color: colorEnum.empty
            }

        }
        this.props.funcChangeContentState((s) => this.changeEditorState(s))
    }
    onChange(editorState) {
        const inlineType = editorState.getCurrentInlineStyle()

        let decor = this.state.toolsBarState.Decoration, lastColor = undefined
        for (const i in decor) {
            if (inlineType.has(i)) {
                decor[i] = true
            } else {
                decor[i] = false
            }
        }
        for (const c in colorEnum) {
            if (inlineType.has(`c_${colorEnum[c].name}`)) {
                if (lastColor) {
                    editorState = RichUtils.toggleInlineStyle(editorState, `c_${lastColor.name}`)
                }
                lastColor = colorEnum[c]
            }
        }


        this.setState({
            editorState, toolsBarState: {
                Decoration: decor,
                Color: lastColor
            }
        });
        if (typeof this.props.onStateChange === "function") {
            this.props.onStateChange(editorState.getCurrentContent())
        }
    }
    toggleInlineStyle(inlineStyle) {
        this.changeEditorState(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    toggleInlineStyleGroup(inlineStyles) {
        this.setState((prev) => {
            let editorState = prev
            for (const c of inlineStyles) {
                editorState = RichUtils.toggleInlineStyle(editorState, `c_${c.name}`)
            }
            return editorState
        })

    }
    changeEditorState(editorState) {
        this.setState({ editorState })
        if (typeof this.props.onStateChange === "function") {
            this.props.onStateChange(editorState.getCurrentContent())
        }
    }
    /**
     *
     *
     * @param {String} key
     * @param {Color} newValue
     * @memberof PreviewEditor
     */
    _onToolsBarChange(key, newValue) {
        if (key === 'Color') {
            const inlineStyle = this.state.editorState.getCurrentInlineStyle()
            if (!inlineStyle.has(`c_${newValue.name}`)) {
                this.setState((prev) => {
                    let a = prev.toolsBarState, editorState = prev.editorState
                    a.Color = newValue
                    for (const i of inlineStyle.toArray()) {
                        if (i.match(colorMatch)) {
                            editorState = RichUtils.toggleInlineStyle(editorState, i)
                        }
                    }
                    return {
                        editorState: RichUtils.toggleInlineStyle(
                            editorState,
                            `c_${newValue.name}`
                        ), toolsBarState: a
                    }
                }
                )
            }

        } else {
            this.setState((prev) => {
                let a = prev.toolsBarState
                a.Decoration[key] = newValue
                return {
                    editorState: RichUtils.toggleInlineStyle(
                        prev.editorState,
                        key
                    ), toolsBarState: a
                }

                /* let newDecoration = prev.toolsBarState.Decoration;
                newDecoration[key] = newValue
                return {
                    toolsBarState: {
                        Decoration: newDecoration
                    }
                } */
            },()=>{ if (typeof this.props.onStateChange === "function") {
                this.props.onStateChange(this.state.editorState.getCurrentContent())
            }})
           
        }


    }

    render() {

        return (
            <div>
                <ToolsBar state={this.state.toolsBarState}
                    _onChange={(k, v) => this._onToolsBarChange(k, v)}></ToolsBar>
                <div className="row">
                    <div className='col'>
                        <div className="border border-primary">
                            <Editor customStyleMap={styleMap} editorState={this.state.editorState}
                                onChange={(s) => this.onChange(s)}
                            ></Editor></div>
                    </div>
                </div>
            </div>)

    }

}
class FormatCodeRawView extends React.Component {
    constructor(props) {
        super(props)

    }
    render() {
        let raw = "";
        if (this.props.ContentState) {
            for (const block of this.props.ContentState.getBlocksAsArray()) {
                let text = block.text, metaArray = block.getCharacterList().toArray(), rcArray = [new RichChar('')]
                if (text.length === metaArray.length) {
                    for (const c in text) {
                        let kvPairs = []
                        for (const f of metaArray[c].getStyle().toArray()) {
                            if (f.match(colorMatch)) {
                                kvPairs.push({ name: 'color', value: colorEnum[f.slice(2, f.length)] })
                            } else {
                                kvPairs.push({ name: f, value: true })
                            }

                        }
                        rcArray.push(new RichChar(text[c], new Formats(kvPairs)))
                    }
                    raw = new RichString(rcArray).convertToFormatCode()
                    if (this.props.convertToUnicode) {
                        raw = convertSpecialChar(raw)

                    }

                } else {
                    throw new Error('length not paired')
                }
            }
        }

        return (<div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">{this.props.prepend}</span>
            </div>
            <p className="form-control border border-primary">{raw}</p>

        </div>)
    }
}
class ShareContentState extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            funcChangeContentState: undefined,
            ContentState: undefined
        }
    }
    onContentStateUpdate(newContentState) {
        this.setState({ ContentState: newContentState })
    }
    getFuncChangeContentState(func) {
        this.setState({ funcChangeContentState: func })
    }
    render() {
        return (<div className="container" style={{ minWidth: "515px" }}>
            <PreviewEditor onStateChange={(c) => this.onContentStateUpdate(c)} funcChangeContentState={(func) => this.getFuncChangeContentState(func)}></PreviewEditor>
            <div>
                <FormatCodeRawView ContentState={this.state.ContentState} funcChangeContentState={this.state.funcChangeContentState} convertToUnicode={false} prepend="格式代码"></FormatCodeRawView>
                <FormatCodeRawView ContentState={this.state.ContentState} funcChangeContentState={this.state.funcChangeContentState} convertToUnicode={true} prepend="格式代码(特殊字符已转换)">></FormatCodeRawView>
            </div>
        </div>)

    }
}

export {
    ShareContentState as default
}