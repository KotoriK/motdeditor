//app.js
/*  import "jquery/dist/jquery" */
/* import "popper.js" */
/* import $ from 'jquery'  */
import "./impjQuery"
import  "bootstrap";
/* import  "bootstrap/dist/js/bootstrap.bundle";
import  "bootstrap/dist/js/bootstrap"; */

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