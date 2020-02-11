//obfuscate.js
var obfuscate={
    flatCharSet:'',
    charSet:[
        {
        name:'Base Latin',
        start:0x0021,
        end:0x007e
    },{
        name:'Latin-1 Supplement',
        start:0x00A1,
        end:0x00ff
    },{
        name:'IPA Extensions',
        start:0x0250,
        end:0x02af
    },{
        name:'Latin Extended',
        start:0x0100,
        end:0x024f
    }
],
isStopped:false,
    obfuscateList:[],
    load(){
        this.isStopped=true;
        this.obfuscateList=[];
        for(const i of (document.getElementsByClassName('obfuscated'))){
            this.obfuscateList.push(i)
        }
        this.flatCharSet= this.charSet.map((item)=>{
            return this.flatlizeCharset(item)
        }).join('')
    },
  
    flatlizeCharset(charSet){
        let str=''
        for(let i=charSet.start;i<=charSet.end;i++){

            str+=String.fromCharCode(i)
        }
        return str
    },
    obfuscate(str){
        let newStr='',length=this.flatCharSet.length-1,charSet=this.flatCharSet
        const lengthStr=str.length
        
        for(let i=0;i<lengthStr;i++){
            newStr+= charSet.charAt(Math.floor( Math.random() * length)) 
        }
        
        return newStr
        
    },
    start(){
        this.isStopped=false;
        setTimeout(()=>{
            if(!this.isStopped){
            this.obfuscateList.map((item)=>{
                if(!this.isStopped){
                    item.innerText=this.obfuscate(item.innerText)
                }
            })
            this.start()}
        },80)
    },
    debug(){
        this.load()
        this.start()
    }
}

