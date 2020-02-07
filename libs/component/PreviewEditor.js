import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, EditorState, RichUtils } from 'draft-js'
import { lang } from '../../config/config'
//import {*} as 'FormatCode' from './formatCode'
import { RichString, RichChar, Formats, Color, colorEnum } from './formatCode'
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
    }
    for (const c in colorEnum) {
        a[c] = { color: colorEnum[c].cssForeColor }
    }

    return a
})()
class ObfuscatedSpan extends React.Component {
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
}
class CheckButton extends React.Component {

    /**
     *Creates an instance of CheckButton.
     * @param {{caption:String,_onChange:Function,disabled:boolean, value:boolean, focusOnClick:boolean}} props
     * @memberof CheckButton
     */
    //https://github.com/sstur/react-rte/blob/master/src/ui/Button.js focusOnClick
    constructor(props) {
        super(props)

    }
    _onChange(e) {
        this.props._onChange(this.props.caption, e.target.checked)
    }
    render() {
        return (
            <label className={`btn btn-toolbox ${this.props.disabled ? 'disabled' : ''} ${this.props.value ? 'active' : ''}`} onMouseDown={this.props.focusOnClick ? (e) => { e.preventDefault() } : () => { }}>
                <input type="checkbox" onClick={(e) => this._onChange(e)} value={this.props.value} onMouseDown={this.props.focusOnClick ? (e) => { e.preventDefault() } : () => { }} /> {lang.values[this.props.caption]}
            </label>)
    }
}
class ColorChooserPanel extends React.Component {

    onChoosed(e, colorStr) {
        this.props.onSelectChange(colorEnum[colorStr])
    }
    render() {
        let colorButton = []
        for (const i in colorEnum) {
            colorButton.push(<div key={i} onClick={(e) => this.onChoosed(e, i)} className="btn btn-sm color-block" style={{ backgroundColor: colorEnum[i].cssForeColor }} data-toggle="tooltip" data-title={`${lang.values[i]}`}>
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
        this.state = {showPanel: false, posPanel: { top: 0, left: 0 }} 
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
            <div className={`btn border ${this.state.showPanel ? 'btn-primary active' : 'border-primary'}`}>
                <span>字体颜色：</span>
                <div className="btn color-block" onClick={(e) => this._onClick(e)} style={{ backgroundColor: this.props.value.cssForeColor, color: this.props.value.cssForeColor }}>
                    <span style={{ padding: 0, fontSize: "0.05em" }}></span>
                </div>
                {this.state.showPanel ? (<ColorChooserPanel pos={this.state.posPanel} onSelectChange={(c) => this.onSelectChange(c)} />) : ''}</div>
        )
    }
}
class ToolsBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.props.state
    }
    _onCheckbuttonChange(key, newValue) {
        this.props._onChange(key, newValue)
    }
    _onColorChange(color) {
        this.props._onChange('Color', color)
    }
    render() {
        let checkBtns = []
        for (const i in this.state.Decoration) {
            checkBtns.push(
                <CheckButton key={i} caption={i} _onChange={(a, b) => this._onCheckbuttonChange(a, b)} focusOnClick={true} value={this.state.Decoration[i]}></CheckButton>)
        }
        return (
            <div className="row prevent-focus">
                <div className='col'>
                    <div className="btn-group " >
                        <div className="btn-group btn-group-toggle"
                            data-toggle="buttons">{checkBtns}</div>
                        <ColorChooser value={this.state.Color} onColorChange={(c) => this._onColorChange(c)} /></div>

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

    }
    onChange(editorState) {
        this.setState({ editorState });
    }
    toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
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
            this.setState((prev)=>{
                let a=prev.toolsBarState
                a.Color=newValue
                return {toolsBarState:a}
            }
               )

            this.toggleInlineStyle(newValue.name)
        } else {
            this.setState((prev)=>{
                let newDecoration = prev.toolsBarState.Decoration;
            newDecoration[key] = newValue
                return {
                toolsBarState: {
                    Decoration: newDecoration
                }
            }})
            this.toggleInlineStyle(key)
        }


    }

    render() {
        return (
            <div className="container" style={{ minWidth: "515px" }}>


                <ToolsBar state={this.state.toolsBarState} _onChange={(k, v) => this._onToolsBarChange(k, v)}></ToolsBar>


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

export {
    PreviewEditor as default
}