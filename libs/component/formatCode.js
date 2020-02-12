//Formatting code func

//§=\u00A7

/* 代码	官方名称
MOTD代码
§0	黑色	\u00A70
§1	深蓝色	\u00A71
§2	深绿色	\u00A72
§3	湖蓝色	\u00A73
§4	深红色	\u00A74
§5	紫色	\u00A75
§6	金色	\u00A76
§7	灰色	\u00A77
§8	深灰色	\u00A78
§9	蓝色	\u00A79
§a	绿色	\u00A7a
§b	天蓝色	\u00A7b
§c	红色	\u00A7c
§d	粉红色	\u00A7d
§e	黄色	\u00A7e
§f	白色	\u00A7f
§k	随机字符	\u00A7k
§l	粗体	\u00A7l
§m	删除线	\u00A7m
§n	下划线	\u00A7n
§o	斜体	\u00A7o
§r	重置文字样式	\u00A7r
\n	换行	\n */

function convertSpecialChar(string) {
    let array = [];
    for (const i of string) {
        if (/[\u0020-\u007F]/i.test(i)) {
            array.push(i);
        } else
         {
            let str = i.charCodeAt(0)
            isNaN(str)?str='0000':str=str.toString(16)
            while (str.length < 4) {
                str = `0${str}`;
            }
            array.push(`\\u${str}`);
        }
    }
    let str2 = '';
    for (const i of array) {
        str2 += i;
    }
    return str2;
}
/**
 *
 *
 * @param {String} formatCode
 * @returns
 */
function toRaw(formatCode) {
    return formatCode.replace(/§[0-9a-z]/gi, '')
}
function cleanKvpRepeat(KvpArray){
    let nameArray=[],newArray=[];
    for(const i of KvpArray){
        if(!nameArray.includes(i.name)){
            nameArray.push(i.name);
            newArray.push(i);
        }
    }
    return newArray;
}
function toRichString(formatCode) {
    let preRichStringArray = formatCode.match(/(§[0-9a-z])+([^§]+)?/g),
    lastFormat=new Formats(),
    RichChars=[];
    for (const i in preRichStringArray) {
        let kvp=toKVP(preRichStringArray[i]),str=preRichStringArray[i].replace(/(§[0-9a-z])/g,''),
        KVPArray=kvp.result;
        let formats;
        if(kvp.isReset){
formats=new Formats(KVPArray);
        }else{
            formats=lastFormat.attach(new Formats(KVPArray));
        }
        if(str===''){
            str='\u0000'
        }
        for(const char of str){
            RichChars.push(new RichChar(char,formats));
        }
        lastFormat=formats;
    }
    return new RichString(RichChars);
}
/**
 *
 *
 * @param {String} formatCode
 * @returns
 */
function checkIfValidate(formatCode){
    let matchResult=formatCode.match(/(§[^0-9a-fk-or])/g),
    r=[],nowPos=0;
    for(const i of matchResult){
        nowPos=formatCode.indexOf(i,nowPos)
        r.push({char:i,pos:nowPos})
        nowPos++;
    }
    let endPos=formatCode.length-1;
    if(formatCode.lastIndexOf('§')===endPos){
        r.push({char:'§',pos:endPos})
    }
    return r;
}
function toKVP(formatCode) {
    let formatArray = formatCode.match(/(§[0-9a-z])/g),resultArray=[],isReset=false;
    for(const value of formatArray){
        let objReturn = {
            name: '',
            value: false
        };
        if (/[1-9a-f]/.test(value)) {
            objReturn.name = 'color';
            switch (value) {
                case '§0': //黑色	\u00A70
                objReturn.value = colorEnum.black;
                break;
                case '§1': //	深蓝色	\u00A71
                    objReturn.value = colorEnum.dark_blue;
                    break;
                case '§2': //	深绿色	\u00A72
                    objReturn.value = colorEnum.dark_green;
                    break;
                case '§3': //	湖蓝色	\u00A73
                    objReturn.value = colorEnum.dark_aqua;
                    break;
                case '§4': //	深红色	\u00A74
                    
                    objReturn.value = colorEnum.dark_red;
                    break;
                case '§5': //	紫色	\u00A75
                    
                    objReturn.value = colorEnum.dark_purple;
                    break;
                case '§6': //	金色	\u00A76
                    
                    objReturn.value = colorEnum.gold;
                    break;
                case '§7': //	灰色	\u00A77
                    
                    objReturn.value = colorEnum.gray;
                    break;
                case '§8': //	深灰色	\u00A78
                objReturn.value = colorEnum.dark_gray;
                    break;
                case '§9': //	蓝色	\u00A79
                objReturn.value = colorEnum.blue;
                    break;
                case '§a': //	绿色	\u00A7a
                objReturn.value = colorEnum.green;
                    break;
                case '§b': //	天蓝色	\u00A7b
                objReturn.value = colorEnum.aqua;
                    break;
                case '§c': //	红色	\u00A7c
                objReturn.value = colorEnum.red;
                    break;
                case '§d': //	粉红色	\u00A7d
                objReturn.value = colorEnum.light_purple;
                    break;
                case '§e': //	黄色	\u00A7e
                objReturn.value = colorEnum.yellow;
                    break;
                case '§f': //	白色	\u00A7f
                objReturn.value = colorEnum.white;
                    break;
                    default:
                        break;
            }
        }else{
            objReturn.value=true;
            switch (value) {
            case '§k': //	随机字符	\u00A7k
            objReturn.name='obfuscated';
            break;
            case '§l': //	粗体	\u00A7l
            objReturn.name='bold';
            break;
            case '§m': //	删除线	\u00A7m
            objReturn.name='strikethrough';
            break;
            case '§n': //	下划线	\u00A7n
            objReturn.name='underLine';
            break;
            case '§o': //	斜体	\u00A7o
            objReturn.name='italic';
            break;
            case '§r': //	重置文字样式	\u00A7r
            isReset=true;
            while(resultArray.length!=0){
              resultArray.shift()   
            }
            break;
            default:
                throw {code:11,descr:'不支持的样式代码。'}       
        }
        }
        if(objReturn.name){resultArray.push(objReturn);}
    }
    return {isReset:isReset,result:resultArray}
}
class Color {
    constructor(name, formatCode, cssForeColor, cssBackColor) {
        this.name = name;
        this.formatCode = formatCode;
        this.cssBackColor = cssBackColor;
        this.cssForeColor = cssForeColor;

    }
}
const colorEnum = {
    black: new Color('black', '§0', '#000000', '#000000'),
    dark_blue: new Color('dark_blue', '§1', '#0000AA', '#00002A'),
    dark_green: new Color('dark_green', '§2', '#00AA00', '#002A00'),
    dark_aqua: new Color('dark_aqua', '§3', '#00AAAA', '#002A2A'),
    dark_red: new Color('dark_red', '§4', '#AA0000', '#2A0000'),
    dark_purple: new Color('dark_purple', '§5', '#AA00AA', '#2A002A'),
    gold: new Color('gold', '§6', '#FFAA00', '#2A2A00'),
    gray: new Color('gray', '§7', '#AAAAAA', '#2A2A2A'),
    dark_gray: new Color('dark_gray', '§8', '#555555', '#151515'),
    blue: new Color('blue', '§9', '#5555FF', '#15153F'),
    green: new Color('green', '§a', '#55FF55', '#153F15'),
    aqua: new Color('aqua', '§b', '#55FFFF', '#153F3F'),
    red: new Color('red', '§c', '#FF5555', '#3F1515'),
    light_purple: new Color('light_purple', '§d', '#FF55FF', '#3F153F'),
    yellow: new Color('yellow', '§e', '#FFFF55', '#3F3F15'),
    white: new Color('white', '§f', '#FFFFFF', '#3F3F3F'),
    empty: new Color('', '', '', '')
};
class Formats {
    differ(objFormats) {
        let diff = new Formats()
        for (const i in diff.value) {
            diff.value[i] = (objFormats.value[i] !== this.value[i])
        }
        return diff;
    }

    /**
     *
     * 
     * @param {Formats} objFormats
     * @returns Boolean
     * @memberof Formats
     */
    equal(objFormats) {

        for (const i in objFormats.value) {
            if (objFormats.value[i] !== this.value[i]) {
                return false;
            }
        }
        return true;
    }
    convertToFormatCode() {
        let str = '';
        if (this.value.obfuscated) str += '§k';
        if (this.value.bold) str += '§l';
        if (this.value.strikethrough) str += '§m';
        if (this.value.underLine) str += '§n';
        if (this.value.italic) str += '§o';
        str += this.value.color.formatCode;
        return str;
    }
    /**
     *
     *
     * @param {Formats} formats
     * @memberof Formats
     */
    attach(formats){
        let b=formats.value,aa=this.clone(),a=aa.value;
        for(const i in b){
            if(b[i]===true){
                a[i]=true;
            }
        }
        a.color=b.color;
        return aa;
    }
    clone(){
        let a=new Formats();
        for(const i in a.value){
            a.value[i]=this.value[i];
        }
        return a;
    }
    
    /**
     *Creates an instance of Formats.
     * @param {Array<{name:String,value:Boolean}>} [keyValuePairs=undefined]
     * @memberof Formats
     */

    constructor(keyValuePairs = undefined) {
        this.value = {
            obfuscated: false,
            bold: false,
            strikethrough: false,
            underLine: false,
            italic: false,
            color: colorEnum.empty,
        }
        if (keyValuePairs) {
            for (const i of keyValuePairs) {
                this.value[i.name] = i.value;
            }
        }
    }
}
class RichChar {
    convertToFormatCode () {
        return this.formats.convertToFormatCode() + this.char;
    }
    constructor(char, formats = new Formats()) {
        this.char = char;
        this.formats = formats;
    }
}
class RichString {
    convertToFormatCode() {
        let chars = [...this.chars];
        let nowFormat = chars[0].formats,
            nextFormat;
        let fc = nowFormat.convertToFormatCode() + chars[0].char;
        chars.shift();
        for (const i of chars) {
            nextFormat = i.formats;
            let diff = nextFormat.differ(nowFormat),
                needReset = false,
                needUpdate = [];
            for (const j in diff.value) {
                if (diff.value[j]) {
                    if (nowFormat.value[j]) {
                        if (j === 'color') {
                            needUpdate.push({
                                name: j,
                                value: nextFormat.value[j]
                            });
                        } else {
                            needReset = true;
                            break;
                        }

                    } else {
                        needUpdate.push({
                            name: j,
                            value: nextFormat.value[j]
                        });
                    }
                }
            }
            let char=(i.char==='\u0000'?'':(i.char==='\n'?'\\n':i.char))
            if (needReset) {
                fc += '§r' + nextFormat.convertToFormatCode() + char;
                needReset = false;
            } else {
                fc += new Formats(needUpdate).convertToFormatCode() + char;
            }
            nowFormat = nextFormat;
        }
        return fc;
    }
    toRaw() {
        let str = '';
        for (const i of this.chars) {
            str += i.char;
        }
        return str;
    }
    /**
     *Creates an instance of RichString.
     * @param {Array<RichChar>} chars
     * @memberof RichString
     */
    constructor(chars) {
        this.chars = chars;

    }
}
export {RichString,RichChar,Formats,Color,colorEnum,convertSpecialChar}
