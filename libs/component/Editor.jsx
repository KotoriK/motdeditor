const React=require(React)
const ReactDom=require(ReactDOM)
const {Editor, EditorState} =require(Draft)
require('./formatCode')
let RichCharArray=[]//RichCharSign=>RichChar
class RichCharSpan extends React.Component{
    constructor(props){
        super(props)
        this.state=props.RichChar
    }
    handleSelect(e){

    }
    render(){
        let f=this.props.RichChar.formats.value,classList=[];
    if(f.italic){
        classList.push('italic')
    }
    if(f.obfuscated){
        classList.push('obfuscated')
    }
    if(f.strikethrough){
        classList.push('strikethrough')
    }
    if(f.underLine){
        let a=classList.findIndex('strikethrough')
        if(a!==-1){
           classList[a]='twoLine'
        }else{
            classList.push('underLine')
        }
    }
    if(f.bold){
        classList.push('bold')
    }
        return(
        <span class={f.join(' ')} style={`color:${f.color.cssForeColor} text-shadow:1px 1px ${f.color.cssBackColor}`} onSelect={this.handleSelect}>{this.props.RichChar.char}</span>
        )
    }
}
class ColorChooser extends React.Component{
    handleSelect(e){

    }
    render(){
        let colorDivArray=[]
        for(const i in colorEnum){
            colorDivArray.push( <div class="color-block" data-toggle="tooltip" data-placement="top"  data-title={i} style={`background-color:${colorEnum[i].cssForeColor}`}><br/></div>)
        }
        return(
            {colorDivArray}
        )
    }
}
class PreviewEditor extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.handleChange = (editorState) => this.setState({
            editorState
        });
        this.handleKeyCommand = (command) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                this.onChange(newState);
                return true;
            }
            return false;
        }

    }
    render(){
        return (
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">编辑</h5>
                    <div class="row">
                        <div class="col">
                            <Editor editorState={this.state.editorState} onChange={this.handleChange}
                                handleKeyCommand={this.handleKeyCommand} placeholder="" />
                        </div>
                    </div>
                    <div class="card">
    <div class="card-body">
      <h5 class="card-title">字体编辑</h5>
      <div class="d-flex flex-row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">字体</h5>
              <div class="form-check">
                <label><input type="checkbox" name="optradio"/><span class="bold">粗体</span></label>
              </div>
              <div class="form-check">
                <label><input type="checkbox" name="optradio"/><span class="italic">斜体</span></label>
              </div>
              <div class="form-check">
                <label><input type="checkbox" name="optradio"/><span class="strikethrough">删除线</span></label>
              </div>
              <div class="form-check">
                <label><input type="checkbox" name="optradio"/><span class="underLine">下划线</span></label>
              </div>
              <div class="form-check">
                <label><input type="checkbox" name="optradio"/>随机字符<span class="obfuscated">obfuscated</span></label>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">颜色</h5>
              <div class="row">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

                </div>
            </div>
        )
    }
}
class FormatCodeArea extends React.Component{
    handleChange(e){

    }
    /**
     *
     *
     * @param {String} formatCode
     * @param {Number} charPos
     * @memberof FormatCodeArea
     */
    getCharFormats(formatCode,charPos){
        
    }
  render(){
    return ( <div class="card">
        <div class="card-body">
            <h5 class="card-title">编辑</h5>
            <div class="row">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">样式代码</span>
                        </div>
                        <input class="form-control" type="text" name=""></input>
                        <div class="input-group-append">
                         <button class="btn btn-primary" type="button">刷新预览</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    )
}
}
class Notification extends React.Component{
    render(){

    }
}
class FontDecorationPanel extends React.Component{

}
class ColorPanel extends React.Component{

}
class AttributePanel extends React.Component{
    render(){
        return (
            
        )
    }
}
class FormatCodeEditor extends React.Component{

}