//app.js

window.$ = window.jQuery= import('jQuery')
//import "./impjQuery"
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import "./libs/component/MotdEditor.css"
import React from 'react'
import ReactDom from 'react-dom' 
import ShareContentState from './libs/component/PreviewEditor'
class App extends React.Component{
    render(){
        return (<div><ShareContentState/></div>
        )
    }
}
ReactDom.render(<App></App>,document.getElementById('App'))