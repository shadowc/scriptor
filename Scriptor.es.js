window.__tmpScriptor=(function(_1,_2){
var _3={version:{major:2,minor:3,instance:"beta 1",toString:function(){
return this.major+"."+this.minor+" "+this.instance;
}},mixin:function(_4,_5){
if(!_4){
_4={};
}
for(var i=1,l=arguments.length;i<l;i++){
_3._mixin(_4,arguments[i]);
}
return _4;
},_mixin:function(_6,_7){
var _8,_9,_a={};
for(var i in {toString:1}){
_8=[];
break;
}
_8=_8||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
_9=_8.length;
var _b,s,i;
for(_b in _7){
s=_7[_b];
if(!(_b in _6)||(_6[_b]!==s&&(!(_b in _a)||_a[_b]!==s))){
_6[_b]=s;
}
}
if(_9&&_7){
for(i=0;i<_9;++i){
_b=_8[i];
s=_7[_b];
if(!(_b in _6)||(_6[_b]!==s&&(!(_b in _a)||_a[_b]!==s))){
_6[_b]=s;
}
}
}
return _6;
},bind:function(_c,_d){
if(arguments.length>2){
var _e=[];
for(var n=2;n<arguments.length;n++){
_e.push(arguments[n]);
}
return function(){
var _f=[];
for(var i=0;i<arguments.length;i++){
_f.push(arguments[i]);
}
for(var i=0;i<_e.length;i++){
_f.push(_e[i]);
}
return _c.apply(_d,_f);
};
}else{
return function(){
return _c.apply(_d,arguments);
};
}
},bindAsEventListener:function(_10,obj){
if(arguments.length>2){
var _11=[];
for(var n=2;n<arguments.length;n++){
_11.push(arguments[n]);
}
return function(e){
var _12=[e||window.event];
for(var i=0;i<_11.length;i++){
_12.push(_11[i]);
}
return _10.apply(obj,_12);
};
}else{
return function(e){
return _10.apply(obj,[e||window.event]);
};
}
},isHtmlElement:function(o){
var _13=_1.getElementsByTagName("head")[0];
if(o===_3.body()||o===_13){
return true;
}
if(o==_1||o===window){
return false;
}
if(!o){
return false;
}
if(typeof (o.cloneNode)!="function"&&typeof (o.cloneNode)!="object"){
return false;
}
var a=_1.createElement("div");
try{
var _14=o.cloneNode(false);
a.appendChild(_14);
a.removeChild(_14);
a=null;
_14=null;
return (o.nodeType!=3);
}
catch(e){
a=null;
return false;
}
},body:function(){
if(!_15){
_15=_1.getElementsByTagName("body")[0];
}
return _15;
}};
var _15=null;
var _16=0;
var _17="scriptor_"+_16;
var _18=function(){
_17="scriptor_"+_16;
_16++;
while(_1.getElementById(_17)){
_16++;
_17="scriptor_"+_16;
}
return _17;
};
var _19=0;
var _1a=0;
_3.addOnLoad=function(f){
if(window.onload){
var _1b=window.onload;
window.onload=function(){
_1b();
f();
};
}else{
window.onload=f;
}
};
_3.makeTransparent=function(obj,ndx){
if(obj.style){
if(obj.style.opacity!==_2){
obj.style.opacity="0."+ndx;
}else{
if(obj.style.MozOpacity!==_2){
obj.style.MozOpacity="0."+ndx;
}else{
if(obj.style.filter!==_2){
obj.style.filter="alpha(opacity="+ndx+");";
}
}
}
}
};
_3.getInactiveLocation=function(){
return String((window.location.href.indexOf("#")!=-1)?window.location.href:window.location.href+"#");
};
_3.invalidate=function(_1c,msg){
if(_1c){
_3._calculateBrowserSize();
var _1d=_1.getElementById("scriptor_invalidator");
if(!_1d){
_1d=_1.createElement("div");
_1d.id="scriptor_invalidator";
_3.makeTransparent(_1d,50);
_1d.style.width=_1a+"px";
_1d.style.height=_19+"px";
_1.getElementsByTagName("body")[0].appendChild(_1d);
}
if(msg){
if(!_1d.firstChild){
var _1e="<div class=\"msg\">"+msg+"</div>";
_1d.innerHTML=_1e;
_1d.firstChild.style.left=((_1a/2)-100)+"px";
_1d.firstChild.style.top=((_19/2)-15)+"px";
}
}
_3.event.attach(window,"onresize",_3._calculateBrowserSize);
}else{
if(_1.getElementById("scriptor_invalidator")){
_1.getElementById("scriptor_invalidator").parentNode.removeChild(_1.getElementById("scriptor_invalidator"));
}
_3.event.detach(window,"onresize",_3._calculateBrowserSize);
}
};
_3._calculateBrowserSize=function(){
if(navigator.userAgent.indexOf("MSIE")!=-1){
if(_1.documentElement.clientWidth==0){
_1a=_1.body.clientWidth;
}else{
_1a=_1.documentElement.clientWidth;
}
if(_1.documentElement.clientHeight==0){
_19=_1.body.clientHeight;
}else{
_19=_1.documentElement.clientHeight;
}
}else{
_1a=window.innerWidth;
_19=window.innerHeight;
}
var x,y;
var _1f=_1.body.scrollHeight;
var _20=_1.body.offsetHeight;
if(_1f>_20){
x=_1.body.scrollWidth;
y=_1.body.scrollHeight;
}else{
x=_1.body.offsetWidth;
y=_1.body.offsetHeight;
}
_1a=Math.max(_1a,x);
_19=Math.max(_19,y);
var inv=_1.getElementById("scriptor_invalidator");
if(inv){
inv.style.width=_1a+"px";
inv.style.height=_19+"px";
if(inv.firstChild){
inv.firstChild.style.left=((_1a/2)-100)+"px";
inv.firstChild.style.top=((_19/2)-15)+"px";
}
}
};
_3.SHA1=function(msg){
var _21=function(n,s){
var t4=(n<<s)|(n>>>(32-s));
return t4;
};
var _22=function(val){
var str="";
var i;
var vh;
var vl;
for(i=0;i<=6;i+=2){
vh=(val>>>(i*4+4))&15;
vl=(val>>>(i*4))&15;
str+=vh.toString(16)+vl.toString(16);
}
return str;
};
var _23=function(val){
var str="";
var i;
var v;
for(i=7;i>=0;i--){
v=(val>>>(i*4))&15;
str+=v.toString(16);
}
return str;
};
var _24=function(_25){
_25=_25.replace(/\r\n/g,"\n");
var _26="";
for(var n=0;n<_25.length;n++){
var c=_25.charCodeAt(n);
if(c<128){
_26+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_26+=String.fromCharCode((c>>6)|192);
_26+=String.fromCharCode((c&63)|128);
}else{
_26+=String.fromCharCode((c>>12)|224);
_26+=String.fromCharCode(((c>>6)&63)|128);
_26+=String.fromCharCode((c&63)|128);
}
}
}
return _26;
};
var _27;
var i,j;
var W=new Array(80);
var H0=1732584193;
var H1=4023233417;
var H2=2562383102;
var H3=271733878;
var H4=3285377520;
var A,B,C,D,E;
var _28;
msg=_24(msg);
var _29=msg.length;
var _2a=new Array();
for(i=0;i<_29-3;i+=4){
j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);
_2a.push(j);
}
switch(_29%4){
case 0:
i=2147483648;
break;
case 1:
i=msg.charCodeAt(_29-1)<<24|8388608;
break;
case 2:
i=msg.charCodeAt(_29-2)<<24|msg.charCodeAt(_29-1)<<16|32768;
break;
case 3:
i=msg.charCodeAt(_29-3)<<24|msg.charCodeAt(_29-2)<<16|msg.charCodeAt(_29-1)<<8|128;
break;
}
_2a.push(i);
while((_2a.length%16)!=14){
_2a.push(0);
}
_2a.push(_29>>>29);
_2a.push((_29<<3)&4294967295);
for(_27=0;_27<_2a.length;_27+=16){
for(i=0;i<16;i++){
W[i]=_2a[_27+i];
}
for(i=16;i<=79;i++){
W[i]=_21(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
}
A=H0;
B=H1;
C=H2;
D=H3;
E=H4;
for(i=0;i<=19;i++){
_28=(_21(A,5)+((B&C)|(~B&D))+E+W[i]+1518500249)&4294967295;
E=D;
D=C;
C=_21(B,30);
B=A;
A=_28;
}
for(i=20;i<=39;i++){
_28=(_21(A,5)+(B^C^D)+E+W[i]+1859775393)&4294967295;
E=D;
D=C;
C=_21(B,30);
B=A;
A=_28;
}
for(i=40;i<=59;i++){
_28=(_21(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+2400959708)&4294967295;
E=D;
D=C;
C=_21(B,30);
B=A;
A=_28;
}
for(i=60;i<=79;i++){
_28=(_21(A,5)+(B^C^D)+E+W[i]+3395469782)&4294967295;
E=D;
D=C;
C=_21(B,30);
B=A;
A=_28;
}
H0=(H0+A)&4294967295;
H1=(H1+B)&4294967295;
H2=(H2+C)&4294967295;
H3=(H3+D)&4294967295;
H4=(H4+E)&4294967295;
}
var _28=_23(H0)+_23(H1)+_23(H2)+_23(H3)+_23(H4);
return _28.toLowerCase();
};
_3.MD5=function(_2b){
var _2c=function(_2d,_2e){
return (_2d<<_2e)|(_2d>>>(32-_2e));
};
var _2f=function(lX,lY){
var lX4,lY4,lX8,lY8,_30;
lX8=(lX&2147483648);
lY8=(lY&2147483648);
lX4=(lX&1073741824);
lY4=(lY&1073741824);
_30=(lX&1073741823)+(lY&1073741823);
if(lX4&lY4){
return (_30^2147483648^lX8^lY8);
}
if(lX4|lY4){
if(_30&1073741824){
return (_30^3221225472^lX8^lY8);
}else{
return (_30^1073741824^lX8^lY8);
}
}else{
return (_30^lX8^lY8);
}
};
var F=function(x,y,z){
return (x&y)|((~x)&z);
};
var G=function(x,y,z){
return (x&z)|(y&(~z));
};
var H=function(x,y,z){
return (x^y^z);
};
var I=function(x,y,z){
return (y^(x|(~z)));
};
var FF=function(a,b,c,d,x,s,ac){
a=_2f(a,_2f(_2f(F(b,c,d),x),ac));
return _2f(_2c(a,s),b);
};
var GG=function(a,b,c,d,x,s,ac){
a=_2f(a,_2f(_2f(G(b,c,d),x),ac));
return _2f(_2c(a,s),b);
};
var HH=function(a,b,c,d,x,s,ac){
a=_2f(a,_2f(_2f(H(b,c,d),x),ac));
return _2f(_2c(a,s),b);
};
var II=function(a,b,c,d,x,s,ac){
a=_2f(a,_2f(_2f(I(b,c,d),x),ac));
return _2f(_2c(a,s),b);
};
var _31=function(_32){
var _33;
var _34=_32.length;
var _35=_34+8;
var _36=(_35-(_35%64))/64;
var _37=(_36+1)*16;
var _38=Array(_37-1);
var _39=0;
var _3a=0;
while(_3a<_34){
_33=(_3a-(_3a%4))/4;
_39=(_3a%4)*8;
_38[_33]=(_38[_33]|(_32.charCodeAt(_3a)<<_39));
_3a++;
}
_33=(_3a-(_3a%4))/4;
_39=(_3a%4)*8;
_38[_33]=_38[_33]|(128<<_39);
_38[_37-2]=_34<<3;
_38[_37-1]=_34>>>29;
return _38;
};
var _3b=function(_3c){
var _3d="",_3e="",_3f,_40;
for(_40=0;_40<=3;_40++){
_3f=(_3c>>>(_40*8))&255;
_3e="0"+_3f.toString(16);
_3d=_3d+_3e.substr(_3e.length-2,2);
}
return _3d;
};
var _41=function(_42){
_42=_42.replace(/\r\n/g,"\n");
var _43="";
for(var n=0;n<_42.length;n++){
var c=_42.charCodeAt(n);
if(c<128){
_43+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_43+=String.fromCharCode((c>>6)|192);
_43+=String.fromCharCode((c&63)|128);
}else{
_43+=String.fromCharCode((c>>12)|224);
_43+=String.fromCharCode(((c>>6)&63)|128);
_43+=String.fromCharCode((c&63)|128);
}
}
}
return _43;
};
var x=Array();
var k,AA,BB,CC,DD,a,b,c,d;
var S11=7,S12=12,S13=17,S14=22;
var S21=5,S22=9,S23=14,S24=20;
var S31=4,S32=11,S33=16,S34=23;
var S41=6,S42=10,S43=15,S44=21;
_2b=_41(_2b);
x=_31(_2b);
a=1732584193;
b=4023233417;
c=2562383102;
d=271733878;
for(k=0;k<x.length;k+=16){
AA=a;
BB=b;
CC=c;
DD=d;
a=FF(a,b,c,d,x[k+0],S11,3614090360);
d=FF(d,a,b,c,x[k+1],S12,3905402710);
c=FF(c,d,a,b,x[k+2],S13,606105819);
b=FF(b,c,d,a,x[k+3],S14,3250441966);
a=FF(a,b,c,d,x[k+4],S11,4118548399);
d=FF(d,a,b,c,x[k+5],S12,1200080426);
c=FF(c,d,a,b,x[k+6],S13,2821735955);
b=FF(b,c,d,a,x[k+7],S14,4249261313);
a=FF(a,b,c,d,x[k+8],S11,1770035416);
d=FF(d,a,b,c,x[k+9],S12,2336552879);
c=FF(c,d,a,b,x[k+10],S13,4294925233);
b=FF(b,c,d,a,x[k+11],S14,2304563134);
a=FF(a,b,c,d,x[k+12],S11,1804603682);
d=FF(d,a,b,c,x[k+13],S12,4254626195);
c=FF(c,d,a,b,x[k+14],S13,2792965006);
b=FF(b,c,d,a,x[k+15],S14,1236535329);
a=GG(a,b,c,d,x[k+1],S21,4129170786);
d=GG(d,a,b,c,x[k+6],S22,3225465664);
c=GG(c,d,a,b,x[k+11],S23,643717713);
b=GG(b,c,d,a,x[k+0],S24,3921069994);
a=GG(a,b,c,d,x[k+5],S21,3593408605);
d=GG(d,a,b,c,x[k+10],S22,38016083);
c=GG(c,d,a,b,x[k+15],S23,3634488961);
b=GG(b,c,d,a,x[k+4],S24,3889429448);
a=GG(a,b,c,d,x[k+9],S21,568446438);
d=GG(d,a,b,c,x[k+14],S22,3275163606);
c=GG(c,d,a,b,x[k+3],S23,4107603335);
b=GG(b,c,d,a,x[k+8],S24,1163531501);
a=GG(a,b,c,d,x[k+13],S21,2850285829);
d=GG(d,a,b,c,x[k+2],S22,4243563512);
c=GG(c,d,a,b,x[k+7],S23,1735328473);
b=GG(b,c,d,a,x[k+12],S24,2368359562);
a=HH(a,b,c,d,x[k+5],S31,4294588738);
d=HH(d,a,b,c,x[k+8],S32,2272392833);
c=HH(c,d,a,b,x[k+11],S33,1839030562);
b=HH(b,c,d,a,x[k+14],S34,4259657740);
a=HH(a,b,c,d,x[k+1],S31,2763975236);
d=HH(d,a,b,c,x[k+4],S32,1272893353);
c=HH(c,d,a,b,x[k+7],S33,4139469664);
b=HH(b,c,d,a,x[k+10],S34,3200236656);
a=HH(a,b,c,d,x[k+13],S31,681279174);
d=HH(d,a,b,c,x[k+0],S32,3936430074);
c=HH(c,d,a,b,x[k+3],S33,3572445317);
b=HH(b,c,d,a,x[k+6],S34,76029189);
a=HH(a,b,c,d,x[k+9],S31,3654602809);
d=HH(d,a,b,c,x[k+12],S32,3873151461);
c=HH(c,d,a,b,x[k+15],S33,530742520);
b=HH(b,c,d,a,x[k+2],S34,3299628645);
a=II(a,b,c,d,x[k+0],S41,4096336452);
d=II(d,a,b,c,x[k+7],S42,1126891415);
c=II(c,d,a,b,x[k+14],S43,2878612391);
b=II(b,c,d,a,x[k+5],S44,4237533241);
a=II(a,b,c,d,x[k+12],S41,1700485571);
d=II(d,a,b,c,x[k+3],S42,2399980690);
c=II(c,d,a,b,x[k+10],S43,4293915773);
b=II(b,c,d,a,x[k+1],S44,2240044497);
a=II(a,b,c,d,x[k+8],S41,1873313359);
d=II(d,a,b,c,x[k+15],S42,4264355552);
c=II(c,d,a,b,x[k+6],S43,2734768916);
b=II(b,c,d,a,x[k+13],S44,1309151649);
a=II(a,b,c,d,x[k+4],S41,4149444226);
d=II(d,a,b,c,x[k+11],S42,3174756917);
c=II(c,d,a,b,x[k+2],S43,718787259);
b=II(b,c,d,a,x[k+9],S44,3951481745);
a=_2f(a,AA);
b=_2f(b,BB);
c=_2f(c,CC);
d=_2f(d,DD);
}
var _44=_3b(a)+_3b(b)+_3b(c)+_3b(d);
return _44.toLowerCase();
};
if(typeof (JSON)=="undefined"){
JSON={};
}
(function(){
function f(n){
return n<10?"0"+n:n;
};
if(typeof Date.prototype.toJSON!=="function"){
Date.prototype.toJSON=function(key){
return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null;
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){
return this.valueOf();
};
}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_45=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_46,_47={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _48(_49){
_45.lastIndex=0;
return _45.test(_49)?"\""+_49.replace(_45,function(a){
var c=_47[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_49+"\"";
};
function str(key,_4a){
var i,k,v,_4b,_4c=gap,_4d,_4e=_4a[key];
if(_4e&&typeof _4e==="object"&&typeof _4e.toJSON==="function"){
_4e=_4e.toJSON(key);
}
if(typeof rep==="function"){
_4e=rep.call(_4a,key,_4e);
}
switch(typeof _4e){
case "string":
return _48(_4e);
case "number":
return isFinite(_4e)?String(_4e):"null";
case "boolean":
case "null":
return String(_4e);
case "object":
if(!_4e){
return "null";
}
gap+=_46;
_4d=[];
if(Object.prototype.toString.apply(_4e)==="[object Array]"){
_4b=_4e.length;
for(i=0;i<_4b;i+=1){
_4d[i]=str(i,_4e)||"null";
}
v=_4d.length===0?"[]":gap?"[\n"+gap+_4d.join(",\n"+gap)+"\n"+_4c+"]":"["+_4d.join(",")+"]";
gap=_4c;
return v;
}
if(rep&&typeof rep==="object"){
_4b=rep.length;
for(i=0;i<_4b;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_4e);
if(v){
_4d.push(_48(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _4e){
if(Object.hasOwnProperty.call(_4e,k)){
v=str(k,_4e);
if(v){
_4d.push(_48(k)+(gap?": ":":")+v);
}
}
}
}
v=_4d.length===0?"{}":gap?"{\n"+gap+_4d.join(",\n"+gap)+"\n"+_4c+"}":"{"+_4d.join(",")+"}";
gap=_4c;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_4f,_50,_51){
var i;
gap="";
_46="";
if(typeof _51==="number"){
for(i=0;i<_51;i+=1){
_46+=" ";
}
}else{
if(typeof _51==="string"){
_46=_51;
}
}
rep=_50;
if(_50&&typeof _50!=="function"&&(typeof _50!=="object"||typeof _50.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_4f});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(_52,_53){
var j;
function _54(_55,key){
var k,v,_56=_55[key];
if(_56&&typeof _56==="object"){
for(k in _56){
if(Object.hasOwnProperty.call(_56,k)){
v=_54(_56,k);
if(v!==_2){
_56[k]=v;
}else{
delete _56[k];
}
}
}
}
return _53.call(_55,key,_56);
};
cx.lastIndex=0;
if(cx.test(_52)){
_52=_52.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(_52.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+_52+")");
return typeof _53==="function"?_54({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());
_3.event={init:function(obj){
obj._customEventStacks={};
},registerCustomEvent:function(obj,_57,_58){
_58=_58||obj;
if(obj._customEventStacks){
obj._customEventStacks[_57]={context:_58,stack:[]};
}
},attach:function(_59,evt,_5a,_5b){
if(_3.isHtmlElement(_59)||_59===_1||_59===window){
if(_5b){
_5a=_3.bindAsEventListener(_5a,_5b);
}
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(_59.addEventListener){
if(_5b){
_59.addEventListener(evt,_5a,false);
}else{
_59.addEventListener(evt,_5a,false);
}
}else{
if(_59.attachEvent){
_59.attachEvent("on"+evt,_5a);
}
}
}else{
if(_59._customEventStacks){
if(_59._customEventStacks[evt]){
_3.event.detach(_59,evt,_5a);
_59._customEventStacks[evt].stack.push({callback:_5a,context:_5b});
}
}
}
return [_59,evt,_5a];
},detach:function(){
var _5c,evt,_5d;
if(typeof (arguments[0])=="object"&&arguments[0].length){
htmlElement=arguments[0][0];
evt=arguments[0][1];
_5d=arguments[0][2];
}else{
htmlElement=arguments[0];
evt=arguments[1];
_5d=arguments[2];
}
if(_3.isHtmlElement(htmlElement)||htmlElement===_1||htmlElement===window){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(htmlElement.removeEventListener){
htmlElement.removeEventListener(evt,_5d,false);
}else{
if(htmlElement.detachEvent){
htmlElement.detachEvent("on"+evt,_5d);
}
}
}else{
if(htmlElement._customEventStacks){
if(htmlElement._customEventStacks[evt]){
for(var n=0;n<htmlElement._customEventStacks[evt].stack.length;n++){
if(htmlElement._customEventStacks[evt].stack[n].callback==_5d){
htmlElement._customEventStacks[evt].stack.splice(n,1);
break;
}
}
}
}
}
},fire:function(obj,evt,_5e){
_5e=typeof (_5e)=="object"?_5e:{};
_5e.customEventName=evt;
if(_5e.returnValue===_2){
_5e.returnValue=true;
}
if(!obj._customEventStacks||!obj._customEventStacks[evt]||!obj._customEventStacks[evt].stack.length){
return _5e;
}
var _5f=[_5e];
for(var n=0;n<obj._customEventStacks[evt].stack.length;n++){
var _60=obj._customEventStacks[evt].stack[n].context||obj._customEventStacks[evt].context;
obj._customEventStacks[evt].stack[n].callback.apply(_60,_5f);
}
return _5e;
},cancel:function(e,_61){
if(!e){
return;
}
if(typeof (_61)=="undefined"){
_61=true;
}
if(typeof (e.preventDefault)=="function"){
e.preventDefault();
}
e.returnValue=false;
if(_61){
if(typeof (e.stopPropagation)=="function"){
e.stopPropagation();
}
e.cancelBubble=true;
}
},getPointXY:function(evt){
if(evt.pageX===_2&&evt.clientX===_2){
return {x:0,y:0};
}
return {x:evt.pageX||(evt.clientX+(_1.documentElement.scrollLeft||_1.body.scrollLeft)),y:evt.pageY||(evt.clientY+(_1.documentElement.scrollTop||_1.body.scrollTop))};
}};
_3.element={getInnerBox:function(_62){
var box={top:0,bottom:0,left:0,right:0};
var _63=parseInt(_3.className.getComputedProperty(_62,"padding-top"));
var _64=parseInt(_3.className.getComputedProperty(_62,"padding-bottom"));
var _65=parseInt(_3.className.getComputedProperty(_62,"padding-left"));
var _66=parseInt(_3.className.getComputedProperty(_62,"padding-right"));
if(!isNaN(_63)){
box.top=_63;
}
if(!isNaN(_64)){
box.bottom=_64;
}
if(!isNaN(_65)){
box.left=_65;
}
if(!isNaN(_66)){
box.right=_66;
}
var _67=parseInt(_3.className.getComputedProperty(_62,"border-top-width"));
var _68=parseInt(_3.className.getComputedProperty(_62,"border-bottom-width"));
var _69=parseInt(_3.className.getComputedProperty(_62,"border-left-width"));
var _6a=parseInt(_3.className.getComputedProperty(_62,"border-right-width"));
if(!isNaN(_67)){
box.top+=_67;
}
if(!isNaN(_68)){
box.bottom+=_68;
}
if(!isNaN(_69)){
box.left+=_69;
}
if(!isNaN(_6a)){
box.right+=_6a;
}
return box;
},getOuterBox:function(_6b){
var box={top:0,bottom:0,left:0,right:0};
var _6c=parseInt(_3.className.getComputedProperty(_6b,"margin-top"));
var _6d=parseInt(_3.className.getComputedProperty(_6b,"margin-bottom"));
var _6e=parseInt(_3.className.getComputedProperty(_6b,"margin-left"));
var _6f=parseInt(_3.className.getComputedProperty(_6b,"margin-right"));
if(!isNaN(_6c)){
box.top=_6c;
}
if(!isNaN(_6d)){
box.bottom=_6d;
}
if(!isNaN(_6e)){
box.left=_6e;
}
if(!isNaN(_6f)){
box.right=_6f;
}
return box;
}};
_3.error={alertErrors:false,muteErrors:false,report:function(msg){
if(_3.error.alertErrors){
alert(msg);
}
if(!_3.error.muteErrors){
throw msg;
}
}};
_3.className={has:function(_70,_71){
if(!(_70)){
return false;
}
var _72=_70.className;
var _73=new RegExp("(^|\\s)"+_71+"(\\s|$)");
return (_72.length>0&&(_72==_71||_73.test(_72)));
},add:function(_74,_75){
if(typeof (_75)!="string"){
return;
}
if(!(_74)){
return;
}
if(_74.className===_2){
_74.className="";
}
if(!_3.className.has(_74,_75)){
_74.className+=(_74.className?" ":"")+_75;
}
},remove:function(_76,_77){
if(typeof (_77)!="string"){
return;
}
if(!(_76)){
return;
}
if(_76.className===_2){
_76.className="";
}
_76.className=_76.className.replace(new RegExp("(^|\\s+)"+_77+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"");
},getComputedProperty:function(el,_78){
if(window.getComputedStyle){
var st=window.getComputedStyle(el,null);
if(st){
return st.getPropertyValue(_78);
}
}else{
if(el.currentStyle){
st=el.currentStyle;
if(st){
var _79="";
var _7a=false;
for(var n=0;n<_78.length;n++){
var c=_78.substr(n,1);
if(c=="-"){
_7a=true;
}else{
if(_7a){
_79+=c.toUpperCase();
_7a=false;
}else{
_79+=c;
}
}
}
return st[_79];
}
}
}
return null;
}};
_3.cookie={cookies:{},initialized:false,init:function(){
if(!_3.cookie.initialized){
var ca=_1.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _7b=c.substring(0,c.indexOf("="));
this.cookies[_7b]=c.substring(_7b.length+1,c.length);
}
}
},get:function(_7c){
if(!_3.cookies.initialized){
_3.cookies.init();
}
return this.cookies[_7c]?this.cookies[_7c]:"";
},create:function(_7d,_7e,_7f,_80){
if(_80===_2){
_80="/";
}
if(_7f){
var _81=new Date();
_81.setTime(_81.getTime()+(_7f*24*60*60*1000));
var _82="; expires="+_81.toGMTString();
}else{
var _82="";
}
_1.cookie=_7d+"="+_7e+_82+"; path="+_80;
this.cookies[_7d]=_7e;
},erase:function(_83){
this.create(_83,"",-1);
delete this.cookies[_83];
}};
_3.cookie.init();
_3.httpRequest=function(_84){
var _85={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_3.mixin(_85,_84);
if(typeof (_85.ApiCall)!="string"||_85.ApiCall==""){
_3.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_85.ApiCall;
this.method="POST";
if(typeof (_85.method)=="string"){
this.method=_85.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_85.Type)=="string"){
switch(_85.Type.toLowerCase()){
case ("xml"):
this.Type="xml";
break;
case ("json"):
this.Type="json";
break;
case ("text"):
default:
this.Type="text";
break;
}
}
this._mimeTypes={xml:"text/xml",text:"text/plain",json:"text/plain"};
this.onLoad=null;
if(typeof (_85.onLoad)=="function"){
this.onLoad=_85.onLoad;
}
this.onError=null;
if(typeof (_85.onError)=="function"){
this.onError=_85.onError;
}
this.requestHeaders=[];
if(_85.requestHeaders&&_85.requestHeaders.length){
for(var n=0;n<_85.requestHeaders.length;n++){
if(typeof (_85.requestHeaders[n][0])=="string"&&typeof (_85.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_85.requestHeaders[n][0],_85.requestHeaders[n][1]]);
}
}
}
this.inRequest=false;
this.http_request=null;
this.createRequest();
};
_3.httpRequest.prototype={createRequest:function(){
if(!this.http_request){
if(window.XMLHttpRequest){
this.http_request=new XMLHttpRequest();
if(this.http_request.overrideMimeType){
this.http_request.overrideMimeType(this._mimeTypes[this.Type]);
}
}else{
if(window.ActiveXObject){
try{
this.http_request=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
this.http_request=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e){
_3.error.report("httpRequest could not create Ajax object.");
}
}
}
}
}
},send:function(_86){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_86;
}
this.http_request.open(this.method,url,true);
if(this.method=="POST"){
this.http_request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
if(this.requestHeaders.length){
for(var n=0;n<this.requestHeaders.length;n++){
this.http_request.setRequestHeader(this.requestHeaders[n][0],this.requestHeaders[n][1]);
}
}
this.http_request.onreadystatechange=_3.bind(this.handleRequest,this);
this.http_request.send(_86);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _87=null;
switch(this.Type){
case ("xml"):
_87=this.http_request.responseXML;
break;
case ("json"):
_87=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_87=this.http_request.responseText;
break;
}
this.onLoad(_87);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_3.httpRequest.prototype.lang={errors:{createRequestError:"Error creando objeto Ajax!",requestHandleError:"Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde."}};
var _88=0;
var _89=function(){
return "q"+(_88++);
};
var _8a=(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null);
_3.effects={effectsQueue:{},lastId:0,intervalId:null,started:false,scheduleEffect:function(_8b){
var _8c=_89();
this.effectsQueue[_8c]=this._getEffectInstance();
_3.mixin(this.effectsQueue[_8c],_8b);
return _8c;
},startAll:function(){
for(var fId in this.effectsQueue){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(_8a){
_8a(this.loop);
}else{
this.intervalId=setInterval(this.loop,10);
}
this.started=true;
}
},start:function(fId){
if(this.effectsQueue[fId]){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(_8a){
_8a(this.loop);
}else{
this.intervalId=setInterval(this.loop,10);
}
this.started=true;
}
},stop:function(fId){
if(this.effectsQueue[fId]){
this.effectsQueue[fId].started=false;
}
this.checkInterval();
},stopAll:function(){
for(var fId in this.effectsQueue){
this.effectsQueue[fId].started=false;
}
this.checkInterval();
},cancelAll:function(){
for(var fId in this.effectsQueue){
this.cancel(fId);
}
this.checkInterval();
},cancel:function(fId){
var _8d=this.effectsQueue[fId];
if(_8d){
_8d.started=false;
for(var n=0;n<_8d.property.length;n++){
var _8e=_8d.property[n];
if(_8e.substr(0,6)=="style."){
_8d.elem.style[_8e.substr(6)]=_8d.end[n]+_8d.unit[n];
}else{
if(typeof (_8d.setAttribute)=="function"){
_8d.elem.setAttribute(_8e,_8d.end[n]+_8d.unit[n]);
}else{
_8d.elem[_8e]=_8d.end[n]+_8d.unit[n];
}
}
}
if(typeof (_8d.callback)=="function"){
this.callBackAndDestroy(fId);
}else{
delete this.effectsQueue[fId];
this.checkInterval();
}
}
},callBackAndDestroy:function(fId){
if(this.effectsQueue[fId]){
this.effectsQueue[fId].callback();
delete this.effectsQueue[fId];
this.checkInterval();
}
},loop:function(){
var _8f=new Date().getTime();
for(var fId in _3.effects.effectsQueue){
var _90=_3.effects.effectsQueue[fId];
if(_90.started){
if(_90.startTime==null){
_90.startTime=_8f;
}
if((_90.startTime+_90.duration)<=_8f){
_3.effects.cancel(fId);
}else{
var _91=(_8f-_90.startTime)/_90.duration;
for(var n=0;n<_90.property.length;n++){
var _92=_90.start[n]+((_90.end[n]-_90.start[n])*_91);
var _93=_90.property[n];
if(_93.substr(0,6)=="style."){
_90.elem.style[_93.substr(6)]=_92+_90.unit[n];
}else{
if(typeof (_90.setAttribute)=="function"){
_90.elem.setAttribute(_93,_92+_90.unit[n]);
}else{
_90.elem[_93]=_92+_90.unit[n];
}
}
}
if(typeof (_90.step)=="function"){
_90.step(_8f);
}
}
}
}
_3.effects.checkGoOn();
},checkInterval:function(){
var _94=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_94=true;
break;
}
}
if(!_94&&this.started){
clearInterval(this.intervalId);
this.intervalId=null;
this.started=false;
}
},checkGoOn:function(){
if(this.started){
var _95=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_95=true;
break;
}
}
if(_95){
if(_8a){
_8a(this.loop);
}
}
}
},_getEffectInstance:function(){
return {elem:null,property:[],start:[],end:[],unit:[],duration:500,callback:null,step:null,started:false,startTime:null};
}};
var _96={get:function(_97){
var _98={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_3.mixin(_98,_97);
if(!_98.divId){
_98.divId=_18();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_98.id,region:_98.region,style:_98.style,className:_98.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_98.canHaveChildren,hasInvalidator:_98.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_98.x,y:_98.y,width:_98.width,height:_98.height,resizable:_98.resizable,minHeight:_98.minHeight,maxHeight:_98.maxHeight,minWidth:_98.minWidth,maxWidth:_98.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
},DOMRemovedImplementation:function(){
},showImplementation:function(){
},resizeImplementation:function(){
},focusImplementation:function(){
},blurImplementation:function(){
},hideImplementation:function(){
},destroyImplementation:function(){
},focus:function(e){
if(!e){
e=window.event;
}
if(!this.hasFocus){
if(this.parent&&this.parent.CMP_SIGNATURE){
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
this.parent.components[n].blur();
break;
}
}
}
this.focusImplementation.apply(this,arguments);
_3.event.fire(this,"onfocus");
this.hasFocus=true;
_3.className.add(this.target,"jsComponentFocused");
}
return false;
},blur:function(){
if(this.hasFocus){
this.blurImplementation.apply(this,arguments);
_3.event.fire(this,"onblur");
this.hasFocus=false;
_3.className.remove(this.target,"jsComponentFocused");
for(var n=0;n<this.components.length;n++){
this.components[n].blur();
}
}
},passFocus:function(){
if(this.hasFocus){
if(this.parent&&this.parent.CMP_SIGNATURE){
if(this.parent.components.length>1){
var _99=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_99=n;
break;
}
}
var _9a=false;
var _9b=(_99==this.parent.components.length-1)?0:_99+1;
for(var n=_9b;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_99){
this.parent.components[n].focus();
_9a=true;
break;
}
}
if(!_9a&&_9b>0){
for(var n=0;n<_9b;n++){
if(this.parent.components[n].visible&&n!=_99){
this.parent.components[n].focus();
_9a=true;
break;
}
}
}
if(!_9a){
this.blur();
}
}else{
this.blur();
}
}else{
this.blur();
}
}
},create:function(){
if(!this.created){
this.target=_3.ComponentRegistry.spawnTarget(this);
this.__updatePosition();
if(this.style){
this.target.setAttribute("style",this.style);
}
var _9c=this.className?("jsComponent jsComponentHidden "+this.className):"jsComponent jsComponentHidden";
this.target.className=this.target.className?(_9c+" "+this.target.className):_9c;
targetMinHeight=parseInt(this.target.style.minHeight);
targetMaxHeight=parseInt(this.target.style.maxHeight);
targetMinWidth=parseInt(this.target.style.minWidth);
targetMaxWidth=parseInt(this.target.style.maxWidth);
if(!isNaN(targetMinHeight)){
this.minHeight=targetMinHeight;
}
if(!isNaN(targetMaxHeight)){
this.maxHeight=targetMaxHeight;
}
if(!isNaN(targetMinWidth)){
this.minWidth=targetMinWidth;
}
if(!isNaN(targetMaxWidth)){
this.maxWidth=targetMaxWidth;
}
if(this.width==null&&!isNaN(parseInt(this.target.style.width))){
this.width=parseInt(this.target.style.width);
}
if(this.height==null&&!isNaN(parseInt(this.target.style.height))){
this.height=parseInt(this.target.style.height);
}
if(this.target.style.width.substr(this.target.style.width.length-1)=="%"){
this._percentWidth=this.target.style.width;
}else{
this._origWidth=this.target.style.width;
}
if(this.target.style.height.substr(this.target.style.height.length-1)=="%"){
this._percentHeight=this.target.style.height;
}
_3.event.attach(this.target,"mousedown",_3.bindAsEventListener(this.focus,this));
if(this.canHaveChildren){
this.cmpTarget=_1.createElement("div");
this.cmpTarget.id=this.divId+"_cmpTarget";
_3.className.add(this.cmpTarget,"jsTargetComponent");
this.target.appendChild(this.cmpTarget);
this.splitters.top=null;
this.splitters.left=null;
this.splitters.right=null;
this.splitters.bottom=null;
}
if(this.hasInvalidator){
this.invalidator=_3.ComponentRegistry.spawnInvalidator(this);
}
_3.event.fire(this,"oncreate");
this.created=true;
if(_1.getElementById(this.divId)){
this.onDOMAdded();
}
}
},__reReadDimentions:function(){
if(_1.getElementById(this.target.id)){
targetMinHeight=parseInt(_3.className.getComputedProperty(this.target,"min-height"));
targetMaxHeight=parseInt(_3.className.getComputedProperty(this.target,"max-height"));
targetMinWidth=parseInt(_3.className.getComputedProperty(this.target,"min-width"));
targetMaxWidth=parseInt(_3.className.getComputedProperty(this.target,"max-width"));
if(!isNaN(targetMinHeight)){
this.minHeight=targetMinHeight;
}
if(!isNaN(targetMaxHeight)){
this.maxHeight=targetMaxHeight;
}
if(!isNaN(targetMinWidth)){
this.minWidth=targetMinWidth;
}
if(!isNaN(targetMaxWidth)){
this.maxWidth=targetMaxWidth;
}
var _9d=_3.className.getComputedProperty(this.target,"width");
var _9e=_3.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_9d))){
this.width=parseInt(_9d);
}
if(this.height==null&&!isNaN(parseInt(_9e))){
this.height=parseInt(_9e);
}
if(_9d.substr(_9d.length-1)=="%"){
this._percentWidth=_9d;
}else{
this._origWidth=_9d;
}
if(_9e.substr(_9e.length-1)=="%"){
this._percentHeight=_9e;
}
}
for(var n=0;n<this.components.length;n++){
this.components[n].__reReadDimentions();
}
},destroy:function(){
var e=_3.event.fire(this,"onbeforedestroy");
if(!e.returnValue){
return;
}
if(this.target){
this.visible=false;
this.onDOMRemoved();
for(var n=0;n<this.components.length;n++){
this.components[n].destroy();
}
this.destroyImplementation.apply(this,arguments);
_3.event.fire(this,"ondestroy");
this.passFocus();
if(this.parent){
this.parent.removeChild(this);
}
this.created=false;
_3.ComponentRegistry.destroy(this);
}
},show:function(){
var e=_3.event.fire(this,"onbeforeshow");
if(!e.returnValue){
return;
}
if(!this.created){
this.create();
}
if(!this.visible&&this.target){
_3.className.remove(this.target,"jsComponentHidden");
this.visible=true;
this.showImplementation.apply(this,arguments);
for(var n=0;n<this.components.length;n++){
this.components[n].show();
}
if(this.parent){
this.parent.resize();
}else{
this.resize();
}
this.focus();
_3.event.fire(this,"onshow");
}
},resize:function(){
if(this.target){
this.__updatePosition();
this.resizeImplementation.apply(this,arguments);
if(this.components.length){
var _9f=this.__getInnerBox();
var _a0=this.__getOuterBox();
var _a1=this.__getChildrenForRegion("top");
var _a2=0;
var _a3=(this.width-_9f.left-_9f.right-_a0.left-_a0.right)/_a1.length;
var _a4=false;
for(var n=0;n<_a1.length;n++){
if(_a1[n].height>_a2){
_a2=_a1[n].height;
}
_a1[n].x=(n*_a3);
_a1[n].y=0;
_a1[n].width=_a3;
_a1[n].height=_a1[n].height;
if(_a1[n].resizable){
_a4=true;
}
}
var _a5=this.__getChildrenForRegion("bottom");
var _a6=0;
var _a7=(this.width-_9f.left-_9f.right-_a0.left-_a0.right)/_a5.length;
var _a8=false;
for(var n=0;n<_a5.length;n++){
if(_a5[n].height>_a6){
_a6=_a5[n].height;
}
if(_a5[n].resizable){
_a8=true;
}
}
for(var n=0;n<_a5.length;n++){
_a5[n].x=(n*_a7);
_a5[n].y=this.height-_a6-_9f.top-_9f.bottom;
_a5[n].width=_a7;
_a5[n].height=_a5[n].height;
}
var _a9=this.__getChildrenForRegion("left");
var _aa=0;
var _ab=(this.height-_9f.top-_9f.bottom-_a0.left-_a0.right)/_a9.length;
var _ac=false;
for(var n=0;n<_a9.length;n++){
if(_a9[n].width>_aa){
_aa=_a9[n].width;
}
_a9[n].x=0;
_a9[n].y=_a2+(n*_ab);
_a9[n].height=_ab-_a2-_a6;
_a9[n].width=_a9[n].width;
if(_a9[n].resizable){
_ac=true;
}
}
var _ad=this.__getChildrenForRegion("right");
var _ae=0;
var _af=(this.height-_9f.top-_9f.bottom-_a0.top-_a0.bottom)/_ad.length;
var _b0=false;
for(var n=0;n<_ad.length;n++){
if(_ad[n].width>_ae){
_ae=_ad[n].width;
}
if(_ad[n].resizable){
_b0=true;
}
}
for(var n=0;n<_ad.length;n++){
_ad[n].x=this.width-_ae-_9f.left-_9f.right;
_ad[n].y=_a2+(n*_af);
_ad[n].width=_ae;
_ad[n].height=_af-_a2-_a6;
}
var _b1=this.__getChildrenForRegion("center");
var _b2=(this.height-_9f.top-_9f.bottom-_a0.top-_a0.bottom-_a6-_a2)/_b1.length;
for(var n=0;n<_b1.length;n++){
_b1[n].x=_aa;
_b1[n].y=_a2+(n*_b2);
_b1[n].height=_b2;
_b1[n].width=this.width-_9f.left-_9f.right-_a0.left-_a0.right-_aa-_ae;
}
if(_a4){
if(!this.splitters.top){
this.splitters.top=_1.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_3.className.add(this.splitters.top,"jsSplitter");
_3.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_3.event.attach(this.splitters.top,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _b3=_a1[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_9f.left-_9f.right)+"px";
this.splitters.top.style.top=(_a2-_b3.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_a8){
if(!this.splitters.bottom){
this.splitters.bottom=_1.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_3.className.add(this.splitters.bottom,"jsSplitter");
_3.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_3.event.attach(this.splitters.bottom,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _b4=_a5[0].__getOuterBox();
var _b5=parseInt(_3.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_b5)){
_b5=5;
}
this.splitters.bottom.style.width=(this.width-_9f.left-_9f.right)+"px";
this.splitters.bottom.style.top=(this.height-_a6-_b5-_b4.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_ac){
if(!this.splitters.left){
this.splitters.left=_1.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_3.className.add(this.splitters.left,"jsSplitter");
_3.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_3.event.attach(this.splitters.left,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _b6=_a9[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_9f.top-_9f.bottom-_a2-_a6)+"px";
this.splitters.left.style.top=(_a2)+"px";
this.splitters.left.style.left=(_aa-_b6.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_b0){
if(!this.splitters.right){
this.splitters.right=_1.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_3.className.add(this.splitters.right,"jsSplitter");
_3.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_3.event.attach(this.splitters.right,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _b7=_ad[0].__getOuterBox();
var _b8=parseInt(_3.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_b8)){
_b8=5;
}
this.splitters.right.style.height=(this.height-_9f.top-_9f.bottom-_a2-_a6)+"px";
this.splitters.right.style.top=(_a2)+"px";
this.splitters.right.style.left=(this.width-_ae-_b8-_b7.left)+"px";
}else{
if(this.splitters.right){
this.splitters.right.parentNode.removeChild(this.splitters.right);
this.splitters.right=null;
}
}
}
_3.event.fire(this,"onresize");
for(var n=0;n<this.components.length;n++){
this.components[n].resize();
}
}
},resizeTo:function(_b9){
if(_b9){
if(_b9.width){
this.width=_b9.width;
this._percentWidth=null;
}
if(_b9.height){
this.height=_b9.height;
this._percentHeight=null;
}
this.__updatePosition();
if(this.parent){
this.parent.resize();
}else{
for(var n=0;n<this.components.length;n++){
this.components[n].resize();
}
}
}
},hide:function(){
var e=_3.event.fire(this,"onbeforehide");
if(!e.returnValue){
return;
}
if(this.visible&&this.target){
_3.className.add(this.target,"jsComponentHidden");
this.visible=false;
this.hideImplementation.apply(this,arguments);
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
if(this.parent){
this.parent.resize();
}else{
this.resize();
}
this.passFocus();
_3.event.fire(this,"onhide");
}
},setContent:function(ref){
if(this.created&&this.canHaveChildren){
while(this.components.length){
this.removeChild(this.components[0]);
}
if(ref){
if(ref.CMP_SIGNATURE){
this.addChild(ref);
return true;
}else{
if(_3.isHtmlElement(ref)){
this.cmpTarget.appendChild(ref);
this.resize();
return true;
}else{
if(typeof (ref)=="string"){
this.cmpTarget.innerHTML=ref;
this.resize();
return true;
}
}
}
}
}
return false;
},addChild:function(ref){
if(this.created&&this.canHaveChildren){
var _ba=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_ba=true;
break;
}
}
if(!_ba&&ref.CMP_SIGNATURE&&this.canHaveChildren){
if(ref.parent){
ref.parent.removeChild(ref);
}
if(ref.target.parentNode&&ref.target.parentNode.nodeType!==11){
ref.onDOMRemoved();
ref.target.parentNode.removeChild(ref.target);
}
this.components.push(ref);
this.cmpTarget.appendChild(ref.target);
ref.parent=this;
_3.className.add(ref.target,"jsComponentChild");
this.__reReadDimentions();
if(ref.visible!=this.visible){
if(ref.visible){
ref.hide();
}else{
ref.show();
}
}
if(this.inDOM){
ref.onDOMAdded();
}
this.resize();
return true;
}
}
return false;
},removeChild:function(ref){
if(this.created&&this.canHaveChildren){
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
ref.onDOMRemoved();
ref.target.parentNode.removeChild(ref.target);
this.components.splice(n,1);
_3.className.remove(ref.target,"jsComponentChild");
ref.parent=null;
this.resize();
return true;
}
}
}
return false;
},onDOMAdded:function(){
this.inDOM=true;
this.DOMAddedImplementation();
for(var n=0;n<this.components.length;n++){
this.components[n].onDOMAdded();
}
},onDOMRemoved:function(){
this.inDOM=false;
this.DOMRemovedImplementation();
for(var n=0;n<this.components.length;n++){
this.components[n].onDOMRemoved();
}
},__updatePosition:function(){
if(this.target){
var _bb=this.__getInnerBox();
var _bc=this.__getOuterBox();
var _bd=0,_be=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_bc.left-_bc.right-_bb.left-_bb.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_bc=this.__getOuterBox();
_bd=this.target.parentNode.offsetWidth-_bc.left-_bc.right-_bb.left-_bb.right;
if(isNaN(_bd)||_bd<0){
_bd=0;
}
this.width=_bd;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_be=this.target.offsetHeight-_bc.top-_bc.bottom-_bb.top-_bb.bottom;
if(isNaN(_be)||_be<0){
_be=0;
}
this.height=_be;
}
if(this.width!==null){
_bd=this.width-_bb.left-_bb.right-_bc.left-_bc.right;
if(isNaN(_bd)||_bd<0){
_bd=0;
}
this.target.style.width=_bd+"px";
}
if(this.height!==null){
_be=this.height-_bb.top-_bb.bottom-_bc.top-_bc.bottom;
if(isNaN(_be)||_be<0){
_be=0;
}
this.target.style.height=_be+"px";
}
if(this.x!==null){
this.target.style.left=this.x+"px";
}
if(this.y!==null){
this.target.style.top=this.y+"px";
}
if(this.maxHeight!==null){
this.target.style.maxHeight=this.maxHeight+"px";
}
if(this.minHeight!==null){
this.target.style.minHeight=this.minHeight+"px";
}
if(this.maxWidth!==null){
this.target.style.maxWidth=this.maxWidth+"px";
}
if(this.minWidth!==null){
this.target.style.minWidth=this.minWidth+"px";
}
}
},__getInnerBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _bf=parseInt(_3.className.getComputedProperty(this.target,"padding-top"));
var _c0=parseInt(_3.className.getComputedProperty(this.target,"padding-bottom"));
var _c1=parseInt(_3.className.getComputedProperty(this.target,"padding-left"));
var _c2=parseInt(_3.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_bf)){
box.top=_bf;
}
if(!isNaN(_c0)){
box.bottom=_c0;
}
if(!isNaN(_c1)){
box.left=_c1;
}
if(!isNaN(_c2)){
box.right=_c2;
}
var _c3=parseInt(_3.className.getComputedProperty(this.target,"border-top-width"));
var _c4=parseInt(_3.className.getComputedProperty(this.target,"border-bottom-width"));
var _c5=parseInt(_3.className.getComputedProperty(this.target,"border-left-width"));
var _c6=parseInt(_3.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_c3)){
box.top+=_c3;
}
if(!isNaN(_c4)){
box.bottom+=_c4;
}
if(!isNaN(_c5)){
box.left+=_c5;
}
if(!isNaN(_c6)){
box.right+=_c6;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _c7=parseInt(_3.className.getComputedProperty(this.target,"margin-top"));
var _c8=parseInt(_3.className.getComputedProperty(this.target,"margin-bottom"));
var _c9=parseInt(_3.className.getComputedProperty(this.target,"margin-left"));
var _ca=parseInt(_3.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_c7)){
box.top=_c7;
}
if(!isNaN(_c8)){
box.bottom=_c8;
}
if(!isNaN(_c9)){
box.left=_c9;
}
if(!isNaN(_ca)){
box.right=_ca;
}
return box;
},__getChildrenForRegion:function(str){
var ret=[];
for(var n=0;n<this.components.length;n++){
if(this.components[n].region==str&&this.components[n].visible){
ret.push(this.components[n]);
}
}
return ret;
},_onResizeStart:function(e,_cb){
if(!e){
e=window.event;
}
this.resizingRegion=_cb;
_3.event.attach(_1,"mousemove",this._resizeMoveHandler=_3.bindAsEventListener(this._onResizeMove,this));
_3.event.attach(_1,"mouseup",this._resizeStopHandler=_3.bindAsEventListener(this._onResizeStop,this));
if(_cb=="top"||_cb=="bottom"){
this.resizeStartingPosition=_3.event.getPointXY(e).y;
}else{
this.resizeStartingPosition=_3.event.getPointXY(e).x;
}
_3.event.cancel(e,true);
return false;
},_onResizeMove:function(e){
if(!e){
e=window.event;
}
var _cc=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_cc){
_3.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_cc;
var _cd=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_cd=_3.event.getPointXY(e).y;
}else{
_cd=_3.event.getPointXY(e).x;
}
var _ce=_cd-this.resizeStartingPosition;
this.resizeStartingPosition=_cd;
var _cf=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_cf.length;n++){
_cf[n].resizeTo({height:_cf[n].height+_ce});
}
break;
case ("bottom"):
for(var n=0;n<_cf.length;n++){
_cf[n].resizeTo({height:_cf[n].height-_ce});
}
break;
case ("left"):
for(var n=0;n<_cf.length;n++){
_cf[n].resizeTo({width:_cf[n].width+_ce});
}
break;
case ("right"):
for(var n=0;n<_cf.length;n++){
_cf[n].resizeTo({width:_cf[n].width-_ce});
}
break;
}
_3.event.cancel(e,true);
return false;
},_onResizeStop:function(e){
if(!e){
e=window.event;
}
_3.event.detach(_1,"mousemove",this._resizeMoveHandler);
_3.event.detach(_1,"mouseup",this._resizeStopHandler);
this.lastResizeTimeStamp=null;
this.resizingRegion="";
_3.event.cancel(e,true);
return false;
},invalidate:function(){
if(this.invalidator&&this.enabled){
this.enabled=false;
this.invalidator.style.display="block";
}
},revalidate:function(){
if(this.invalidator&&!this.enabled){
this.enabled=true;
this.invalidator.style.display="none";
}
}};
var _d0=["center","left","top","bottom","right"];
var _d1=false;
for(var n=0;n<_d0.length;n++){
if(cmp.region==_d0[n]){
_d1=true;
break;
}
}
if(!_d1){
cmp.region="center";
}
return cmp;
}};
_3.ComponentRegistry={_registry:[],add:function(id,cmp){
if(!this.getById(id)){
this._registry.push({"id":id,"cmp":cmp});
}else{
throw "Warning: duplicate component id "+id;
}
},remove:function(ref){
if(typeof (ref)=="string"){
for(var n=0;n<this._registry.length;n++){
if(this._registry[n].id==ref){
this._registry.splice(n,1);
return;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._registry.length;n++){
if(this._registry[n].cmp===ref){
this._registry.splice(n,1);
return;
}
}
}
}
},getById:function(id){
for(var n=0;n<this._registry.length;n++){
if(this._registry[n].id==id){
return this._registry[n].cmp;
}
}
return null;
},spawnTarget:function(cmp){
if(!cmp.divId){
cmp.divId=_18();
}
var ret=_1.getElementById(cmp.divId);
if(!ret){
ret=_1.createElement("div");
ret.id=cmp.divId;
}
this.add(cmp.divId,cmp);
return ret;
},spawnInvalidator:function(cmp){
if(!cmp.divId||!cmp.target){
return null;
}
ret=_1.createElement("div");
ret.id=cmp.divId+"_invalidator";
ret.className="jsComponentInvalidator";
ret.style.display="none";
cmp.target.appendChild(ret);
return ret;
},destroy:function(cmp){
if(_1.getElementById(cmp.divId)){
cmp.target.parentNode.removeChild(cmp.target);
}
cmp.target=null;
if(cmp.invalidator){
if(_1.getElementById(cmp.invalidator.id)){
cmp.invalidator.parentNode.removeChild(cmp.invalidator);
}
cmp.invalidator=null;
}
if(cmp.cmpTarget){
if(_1.getElementById(cmp.cmpTarget.id)){
cmp.cmpTarget.parentNode.removeChild(cmp.cmpTarget);
}
cmp.cmpTarget=null;
}
this.remove(cmp);
},onWindowResized:function(e){
setTimeout(_3.bind(function(){
for(var n=0;n<this._registry.length;n++){
if(!this._registry[n].cmp.parent){
this._registry[n].cmp.resize();
}
}
},this),1);
}};
_3.event.attach(window,"onresize",_3.bindAsEventListener(_3.ComponentRegistry.onWindowResized,_3.ComponentRegistry));
_3.ContextMenu=function(_d2){
var _d3={canHaveChildren:false,hasInvalidator:false,items:[]};
_3.mixin(_d3,_d2);
var cmp=_96.get(_d3);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.ContextMenu";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
this.create();
_3.className.add(this.target,"jsContextMenu");
this.target.innerHTML="<ul id=\""+this.divId+"_ul\"></ul>";
_3.body().appendChild(this.target);
this.ul=_1.getElementById(this.divId+"_ul");
this.onDOMAdded();
this._origWidth=null;
this.items=[];
for(var n=0;n<_d3.items.length;n++){
this.addItem(this.items[n]);
}
this.showImplementation=function(e){
if(!e){
e=window.event;
}
for(var n=0;n<_3.ComponentRegistry._registry.length;n++){
var cmp=_3.ComponentRegistry._registry[n].cmp;
if(cmp.CMP_SIGNATURE=="Scriptor.ui.ContextMenu"&&cmp.visible&&cmp!=this){
cmp.hide();
}
}
var x=0,y=0;
if(e){
if(typeof (e.pageX)=="number"){
x=e.pageX;
y=e.pageY;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
y=(e.clientY+_1.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
if(x+this.width>_3.body().offsetWidth){
x=x-this.width;
}
if(y+this.height>_3.body().offsetHeight){
y=y-this.height;
}
if(x<0){
x=0;
}
if(y<0){
y=0;
}
this.y=y;
this.x=x;
this.updateSize();
if(this._checkMenuBind){
_3.event.detach(_1,"onclick",this._checkMenuBind);
}
setTimeout(_3.bind(function(){
_3.event.attach(_1,"onclick",this._checkMenuBind=_3.bind(this.checkMenu,this));
},this),1);
_3.event.cancel(e);
return false;
};
};
_3.ContextMenu.prototype.updateSize=function(){
var _d4=_3.element.getOuterBox(this.ul);
var _d5=this.__getInnerBox();
this.target.style.width="auto";
this.width=this.ul.offsetWidth+_d4.left+_d4.right+_d5.left+_d5.right;
this.height=this.ul.offsetHeight+_d4.top+_d4.bottom+_d5.top+_d5.bottom;
this.__updatePosition();
};
_3.ContextMenu.prototype.addItem=function(_d6,ndx){
var _d7={label:"sep",onclick:null,checked:false};
_3.mixin(_d7,_d6);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_d7);
}else{
ndx=this.items.length;
this.items.push(_d7);
}
if(this.target){
var li=_1.createElement("li");
var _d8="";
var _d9=_d7;
if(_d9.label=="sep"){
li.className="contextMenuSep";
}else{
if(_d9.checked){
li.className="OptionChecked";
}
_d8+="<a href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_d9["class"]){
_d8+=" class=\""+_d9["class"]+"\"";
}
_d8+=">"+_d9.label+"</a>";
}
li.innerHTML=_d8;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_d9.label!="sep"&&typeof (_d9.onclick)=="function"){
_3.event.attach(_1.getElementById(this.divId+"_itm_"+ndx),"onclick",_d9.onclick);
}
this.updateSize();
}
};
_3.ContextMenu.prototype.removeItem=function(_da){
if(typeof (_da)=="number"){
if(_da>=0&&_da<=this.items.length-1){
this.items.splice(_da,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_da]);
}
}
}else{
if(typeof (_da)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_da){
this.items.splice(n,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[n]);
}
break;
}
}
}
}
if(this.target){
this.updateSize();
}
};
_3.ContextMenu.prototype.checkItem=function(_db,_dc){
if(typeof (_db)=="undefined"){
return;
}
if(typeof (_dc)=="undefined"){
_dc=false;
}
if(typeof (_db)=="number"){
if(_db>=0&&_db<=this.items.length-1){
this.items[_db].checked=_dc?true:false;
if(this.target){
_3.className[(_dc?"add":"remove")](this.ul.getElementsByTagName("li")[_db],"OptionChecked");
}
}
}else{
if(typeof (_db)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_db){
this.items[n].checked=_dc?true:false;
if(this.target){
_3.className[(_dc?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
}
break;
}
}
}
}
};
_3.ContextMenu.prototype.checkMenu=function(){
if(this._checkMenuBind){
_3.event.detach(_1,"onclick",this._checkMenuBind);
}
this.hide();
};
_3.Panel=function(_dd){
var _de={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_de,_dd);
var cmp=_96.get(_de);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Panel";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
var _df="";
if(_1.getElementById(this.divId)){
var _e0=_1.getElementById(this.divId);
_df=_e0.innerHTML;
_e0.innerHTML="";
}
this.create();
if(_df){
this.setContent(_df);
}
_3.className.add(this.target,"jsPanel");
};
_3.TabContainer=function(_e1){
var _e2={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_e2,_e1);
var cmp=_96.get(_e2);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.TabContainer";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
_3.event.registerCustomEvent(this,"onselect");
_3.event.registerCustomEvent(this,"ontabclosed");
this._tabs=[];
this._selectedTabId=null;
this.resizeImplementation=function(){
var _e3=this._tabList.cmpTarget.offsetWidth;
var _e4=_e3;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _e5=_1.getElementById(this._tabList.divId+"_more");
if(_e5){
var _e6=parseInt(_3.className.getComputedProperty(_e5,"margin-left"));
var _e7=parseInt(_3.className.getComputedProperty(_e5,"margin-right"));
_e3-=(_e5.offsetWidth+_e6+_e7);
}
var _e8=0;
var _e9=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _ea=this._tabList.cmpTarget.childNodes[n];
var _eb=parseInt(_3.className.getComputedProperty(_ea,"margin-left"));
var _ec=parseInt(_3.className.getComputedProperty(_ea,"margin-right"));
if(isNaN(_eb)){
_eb=0;
}
if(isNaN(_ec)){
_ec=0;
}
_e8+=_ea.offsetWidth+_eb+_ec;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_e3=_e4;
}
if(_e8>=_e3){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_e9){
this._tabList._extraTabs=n;
_e9=true;
}
_ea.style.visibility="hidden";
}else{
_ea.style.visibility="visible";
}
}
if(_e8<_e3){
if(this._tabList._showingMore){
this._tabList.hideMore();
}
this._tabList._extraTabs=this._tabs.length;
}
this._updateExtraTabsContextMenu();
};
this.destroyImplementation=function(){
this._tabsContextMenu.destroy();
};
this.create();
_3.className.add(this.target,"jsTabContainer");
this._tabsContextMenu=new _3.ContextMenu();
this._tabList=new _ed({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _ee({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_3.TabContainer.prototype.addTab=function(_ef,_f0,ndx){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _f1={title:"",paneId:_f0.divId,pane:_f0,closable:false};
_3.mixin(_f1,_ef);
if(!_f1.pane||!_f1.pane.CMP_SIGNATURE||!_f1.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _f2=new _f3(_f1);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_f2);
}else{
this._tabs.push(_f2);
}
var _f4=this._tabList.cmpTarget.childNodes;
var _f5=_1.createElement("div");
_f5.id=_f2.paneId+"_tablabel";
_f5.className="jsTabLabel";
if(_f2.closable){
_3.className.add(_f5,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_f2.paneId;
_3.className.add(_f5,"jsTabSelected");
}
_f5.innerHTML="<span>"+_f2.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_f2.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_f5);
}else{
this._tabList.cmpTarget.insertBefore(_f5,_f4[ndx]);
}
this._pageContainer.addPage(_f2.pane);
this._pageContainer.activate(this._selectedTabId);
var _f6=_1.getElementById(_f2.paneId+"_closeHandler");
if(!_f2.closable){
_3.className.add(_f6,"jsTabCloseHidden");
}else{
_3.className.add(_f5,"jsTabClosable");
}
_3.event.attach(_f5,"onclick",_3.bindAsEventListener(this.selectTab,this,_f2.paneId));
_3.event.attach(_f6,"onclick",_3.bindAsEventListener(this.closeTab,this,_f2.paneId));
this.resize();
};
_3.TabContainer.prototype.removeTab=function(ref,_f7){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_f7)=="undefined"){
_f7=true;
}
var ndx=null;
if(typeof (ref)=="number"){
ndx=ref;
}else{
if(typeof (ref)=="string"){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==ref){
ndx=n;
break;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].pane===ref){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
var _f8=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _f8=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_f7);
this._tabs.splice(ndx,1);
if(_f8){
if(this._tabs[ndx]){
this._selectedTabId=this._tabs[ndx].paneId;
}else{
if(this._tabs.length){
this._selectedTabId=this._tabs[this._tabs.length-1].paneId;
}else{
this._selectedTabId=null;
}
}
_3.className.add(_1.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
this._pageContainer.activate(this._selectedTabId);
}
this.resize();
}
};
_3.TabContainer.prototype.selectTab=function(e,ref){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before selecting tabs!");
return false;
}
if(arguments.length==1){
ref=e;
}
var ndx=null;
if(typeof (ref)=="number"){
ndx=ref;
}else{
if(typeof (ref)=="string"){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==ref){
ndx=n;
break;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].pane===ref){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
if(arguments.length>1){
e.selectedTabId=this._selectedTabId;
e.selecting=ndx;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
}
_3.className.remove(_1.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
if(this._tabs[ndx]){
this._selectedTabId=this._tabs[ndx].paneId;
for(var n=0;n<this._tabsContextMenu.items.length;n++){
this._tabsContextMenu.checkItem(n,(n==ndx-this._tabList._extraTabs));
}
}
_3.className.add(_1.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
this._pageContainer.activate(this._selectedTabId);
}
_3.event.cancel(e,true);
return false;
};
_3.TabContainer.prototype.getSelectedTab=function(){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==this._selectedTabId){
return this._tabs[n].pane;
}
}
return null;
};
_3.TabContainer.prototype.setTitle=function(ref,_f9){
var ndx=null;
if(typeof (ref)=="number"){
ndx=ref;
}else{
if(typeof (ref)=="string"){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==ref){
ndx=n;
break;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].pane===ref){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_f9;
this.resize();
}
};
_3.TabContainer.prototype.setClosable=function(ref,_fa){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before calling to setClosable!");
return;
}
var ndx=null;
if(typeof (ref)=="number"){
ndx=ref;
}else{
if(typeof (ref)=="string"){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==ref){
ndx=n;
break;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].pane===ref){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
var _fb=this._tabList.cmpTarget.childNodes[ndx];
var _fc=_1.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_fa){
_3.className.add(_fb,"jsTabClosable");
_3.className.remove(_fc,"jsTabCloseHidden");
}else{
_3.className.remove(_fb,"jsTabClosable");
_3.className.add(_fc,"jsTabCloseHidden");
}
this.resize();
}
};
_3.TabContainer.prototype.closeTab=function(e,ref){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before closing tabs!");
return false;
}
if(arguments.length==1){
ref=e;
}
var ndx=null;
if(typeof (ref)=="number"){
ndx=ref;
}else{
if(typeof (ref)=="string"){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==ref){
ndx=n;
break;
}
}
}else{
if(ref.CMP_SIGNATURE){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].pane===ref){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
if(arguments.length>1){
e.selectedTabId=this._selectedTabId;
e.closing=ndx;
e=_3.event.fire(this,"ontabclosed",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
}
this.removeTab(ndx);
}
_3.event.cancel(e,true);
return false;
};
_3.TabContainer.prototype._updateExtraTabsContextMenu=function(){
var _fd=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_fd){
if(this._tabsContextMenu.items.length>_fd){
while(this._tabsContextMenu.items.length>_fd){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_fd-this._tabsContextMenu.items.length;n++){
var _fe=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_fe].title,onclick:_3.bindAsEventListener(function(e,_ff,_100){
this.selectTab(_ff);
},this,_fe,this._tabList._extraTabs)},0);
}
}
var ndx=null;
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==this._selectedTabId){
ndx=n;
break;
}
}
for(var n=0;n<this._tabsContextMenu.items.length;n++){
this._tabsContextMenu.checkItem(n,(n==ndx-this._tabList._extraTabs));
}
}
};
var _ed=function(opts){
var _101={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_101,opts);
var cmp=_96.get(_101);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.private.TabListObj";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
this.create();
this._extraTabs=0;
this._showingMore=false;
var _102=_1.createElement("span");
_102.id=this.divId+"_more";
_102.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_102);
_102.innerHTML=" ";
_3.className.add(this.cmpTarget,"jsTabListInner");
_3.event.attach(_102,"onclick",_3.bindAsEventListener(this.onDropdownClick,this));
};
_ed.prototype.onDropdownClick=function(e){
if(!e){
e=window.event;
}
this.parent._tabsContextMenu.show(e);
_3.event.cancel(e,true);
return false;
};
_ed.prototype.showMore=function(){
if(!this._showingMore){
_3.className.remove(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_ed.prototype.hideMore=function(){
if(this._showingMore){
_3.className.add(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _ee=function(opts){
var _103={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_103,opts);
var cmp=_96.get(_103);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.private.TabPageContainer";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
this.create();
};
_ee.prototype.addPage=function(pane){
_3.className.add(pane.target,"jsTabPage");
this.addChild(pane);
};
_ee.prototype.removePage=function(pane,_104){
this.removeChild(pane);
if(_104){
pane.destroy();
}
};
_ee.prototype.activate=function(_105){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_105){
this.components[n].show();
}
}
};
var _f3=function(opts){
var _106={title:"",paneId:null,pane:null,closable:false};
_3.mixin(_106,opts);
this.title=_106.title;
this.paneId=_106.paneId;
this.pane=_106.pane;
this.closable=_106.closable;
};
var _107=20;
var _108=function(opts){
var _109={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_3.mixin(_109,opts);
if(!_109.Name){
_3.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_109.Name;
this.Type=(typeof (_10a[_109.Type])!="undefined")?_109.Type:"alpha";
this.show=_109.show;
this.percentWidth=null;
if(!isNaN(Number(_109.Width))){
this.Width=Number(_109.Width);
}else{
if(typeof (_109.Width)=="string"){
if(_109.Width.length>2&&_109.Width.substr(_109.Width.length-2)=="px"&&!isNaN(parseInt(_109.Width))){
this.Width=parseInt(_109.Width);
}else{
if(_109.Width.length>1&&_109.Width.substr(_109.Width.length-1)=="%"&&!isNaN(parseInt(_109.Width))){
this.Width=_107;
this.percentWidth=parseInt(_109.Width);
}
}
}
}
this.origWidth=this.Width;
this.Format=_109.Format;
this.displayName=_109.displayName?_109.displayName:_109.Name;
this.sqlName=_109.sqlName?_109.sqlName:_109.Name;
this.showToolTip=_109.showToolTip;
this.Compare=_109.Compare;
};
var _10b=function(_10c,_10d){
_10d=_10d?_10d:{};
for(var n=0;n<_10c.length;n++){
var name=_10c[n].Name;
var type=_10c[n].Type;
this[name]=_10d[name]?_10a[type](_10d[name]):_10a[type]();
}
for(var prop in _10d){
if(this[prop]===_2){
this[prop]=_10d[prop];
}
}
};
var _10a={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _10e=str.split(" ");
if(_10e[0]=="0000-00-00"){
return "";
}else{
var _10f=_10e[0].split("-");
ret=new Date(_10f[0],_10f[1]-1,_10f[2]);
if(_10e[1]){
var _110=_10e[1].split(":");
ret=new Date(_10f[0],_10f[1]-1,_10f[2],_110[0],_110[1],_110[2]);
}
}
}
return ret;
}};
_3.DataView=function(opts){
var _111={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_3.mixin(_111,opts);
var cmp=_96.get(_111);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_111.multiselect;
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
_3.event.registerCustomEvent(this,"onrefresh");
_3.event.registerCustomEvent(this,"oncontentupdated");
_3.event.registerCustomEvent(this,"onselect");
_3.event.registerCustomEvent(this,"oncolumnresize");
this.orderBy=false;
this.orderWay="ASC";
this.paginating=_111.paginating;
this.rowsPerPage=_111.rowsPerPage;
this.curPage=0;
this.totalRows=0;
this.resizingXCache=0;
this.resizingFrom=0;
this.resColumnId=null;
this.nextRowId=1;
this._cached=null;
this._templateRendered=false;
this._registeredEvents=[];
this.resizeImplementation=function(){
this._checkCache();
if(this._cached){
var _112=this.__getInnerBox();
var _113=this.__getOuterBox();
var _114=_112.top+_112.bottom+_113.top+_113.bottom;
if(this._cached.pagination_header){
var _113=_3.element.getOuterBox(this._cached.pagination_header);
_114+=this._cached.pagination_header.offsetHeight+_113.top+_113.bottom;
}
if(this._cached.header){
var _113=_3.element.getOuterBox(this._cached.header);
_114+=this._cached.header.offsetHeight+_113.top+_113.bottom;
}
if(this._cached.footer){
var _113=_3.element.getOuterBox(this._cached.footer);
_114+=this._cached.footer.offsetHeight+_113.top+_113.bottom;
}
var _115=this.height!==null?this.height-_114:0;
if(_115<0){
_115=0;
}
this._cached.outer_body.style.height=_115+"px";
this._adjustColumnsWidth(true);
}
};
this.DOMAddedImplementation=function(){
this._checkCache();
if(this._cached){
this.__refreshFooter();
if(this.multiselect){
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_selectAll"),"click",_3.bindAsEventListener(this.__selectAll,this)));
}
if(this.paginating){
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_goToPagePrev"),"click",_3.bindAsEventListener(this.__goToPagePrev,this)));
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_goToPageNext"),"click",_3.bindAsEventListener(this.__goToPageNext,this)));
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_pageInput"),"keypress",_3.bindAsEventListener(this.__checkGoToPage,this)));
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_pageInputBtn"),"click",_3.bindAsEventListener(this.__goToPage,this)));
}
for(var n=0;n<this.columns.length;n++){
this._addColumnToUI(this.columns[n],n);
}
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_optionsMenuBtn"),"click",_3.bindAsEventListener(this.showOptionsMenu,this)));
this._registeredEvents.push(_3.event.attach(this._cached.headerUl,"click",_3.bindAsEventListener(this._onHeaderColumnClicked,this)));
this._registeredEvents.push(_3.event.attach(this._cached.headerUl,"mousedown",_3.bindAsEventListener(this._onHeaderColumnMousedown,this)));
this._registeredEvents.push(_3.event.attach(this._cached.rows_body,"click",_3.bindAsEventListener(this._onRowBodyClicked,this)));
this.updateRows(true);
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_3.event.detach(this._registeredEvents.pop());
}
for(var n=0;n<this.columns.length;n++){
this._removeColumnFromUI(0);
}
this._cached=null;
};
this.destroyImplementation=function(){
this.optionsMenu.destroy();
};
this.create();
_3.className.add(this.target,"dataViewMain");
this.renderTemplate();
this.canHaveChildren=false;
this.optionsMenu=new _3.ContextMenu();
this.optionsMenu.addItem({label:this.lang.refresh,onclick:_3.bindAsEventListener(function(e){
this.refresh();
},this)});
this.optionsMenu.addItem({label:"sep"});
for(var n=0;n<_111.columns.length;n++){
this.addColumn(this.createColumn(_111.columns[n]));
}
};
_3.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _116="";
var _117=_3.getInactiveLocation();
if(this.paginating){
_116+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_116+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_116+="</label></li><li>";
_116+="<a href=\""+_117+"\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_116+="<a href=\""+_117+"\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_116+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_116+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_116+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_116+="</li></ul></div>";
}
_116+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_116+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_116+="<li class=\"dataViewCheckBoxHeader\">";
_116+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_116+="<li class=\"dataViewSep\"></li>";
}
_116+="</ul>";
_116+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_116+="<a href=\""+_117+"\"> </a></span></div>";
_116+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_116+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_116+="</div>";
_116+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_116;
this._templateRendered=true;
if(this.inDOM&&this._registeredEvents.length==0){
this.DOMAddedImplementation();
}
}
};
_3.DataView.prototype._checkCache=function(){
if(!this._cached&&_1.getElementById(this.divId+"_columnsHeader")){
this._cached={pagination_header:_1.getElementById(this.divId+"_paginationHeader"),header:_1.getElementById(this.divId+"_columnsHeader"),headerUl:_1.getElementById(this.divId+"_columnsUl"),outer_body:_1.getElementById(this.divId+"_outerBody"),rows_body:_1.getElementById(this.divId+"_body"),footer:_1.getElementById(this.divId+"_footer")};
}
};
_3.DataView.prototype.getTotalPages=function(){
var _118=0;
var _119=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_119){
n+=this.rowsPerPage;
_118++;
}
return _118;
};
_3.DataView.prototype.getNextRowId=function(){
var _11a=true;
while(_11a){
_11a=false;
var _11b=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_11b){
_11a=true;
break;
}
}
}
return _11b;
};
_3.DataView.prototype.createColumn=function(opts){
return new _108(opts);
};
_3.DataView.prototype.addColumn=function(_11c,ndx){
if(this.__findColumn(_11c.Name)==-1){
if(ndx===_2){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_11c);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_11c.Name]=_10a[_11c.Type]();
}
}
if(!this.orderBy&&_11c.show){
this.orderBy=_11c.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_3.DataView.prototype.__findColumn=function(_11d){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_11d){
return n;
}
}
return -1;
};
_3.DataView.prototype.deleteColumn=function(_11e){
var _11f="";
var ndx=null;
if(typeof (_11e)=="string"){
var _120=this.__findColumn(_11e);
if(_120!=-1){
_11f=this.columns[_120].Name;
ndx=_120;
this.columns.splice(_120,1);
}
}
if(typeof (_11e)=="number"){
if(_11e>0&&_11e<this.columns.length){
_11f=this.columns[_11e].Name;
ndx=_11e;
this.columns.splice(_11e,1);
}
}
if(typeof (_11e)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_11e){
_11f=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_11f){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_11f]=null;
delete this.rows[n][_11f];
}
}
if(this.orderBy==_11f){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_3.DataView.prototype._addColumnToUI=function(_121,ndx){
var li=_1.createElement("li");
li.style.width=_121.Width+"px";
var _122="dataViewColumn";
if(!_121.show){
_122+=" dataViewColumnHidden";
}
li.className=_122;
var a=_1.createElement("a");
if(this.orderBy==_121.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href",_3.getInactiveLocation());
a.innerHTML=_121.displayName;
li.appendChild(a);
li2=_1.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_122="dataViewFieldSep";
if(_121.percentWidth!==null){
_122+=" dataViewFieldSepNoResize";
}
if(!_121.show){
_122+=" dataViewColumnHidden";
}
li2.className=_122;
var _123=this._cached.headerUl.getElementsByTagName("li");
if(!_123.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _124=this.multiselect?2:0;
if(ndx>=0&&(_124+(ndx*2))<_123.length){
this._cached.headerUl.insertBefore(li,_123[_124+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_123[_124+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_121.displayName,onclick:_3.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_121.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_121.Name,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._removeColumnFromUI=function(ndx){
var _125=this.multiselect?2:0;
var _126=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_125+(ndx*2))<_126.length){
this._cached.headerUl.removeChild(_126[_125+(ndx*2)]);
this._cached.headerUl.removeChild(_126[_125+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._addRowToUI=function(_127){
if(_127<0||_127>this.rows.length-1){
return;
}
var _128=this.rows[_127].id;
var _129=_1.createElement("ul");
_129.id=this.divId+"_row_"+_128;
var _12a=false;
if(!this.multiselect){
if(this.selectedRow==n){
_12a=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_12a=true;
break;
}
}
}
if(_12a){
_129.className="dataViewRowSelected";
}
if(_127%2){
_3.className.add(_129,"dataViewRowOdd");
}
if(this.multiselect){
var _12b=_1.createElement("li");
var _12c="dataViewMultiselectCell";
_12b.className=_12c;
var _12d="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_128+"\" class=\"dataViewCheckBox\" ";
if(_12a){
_12d+="checked=\"checked\" ";
}
_12d+="/></li>";
_12b.innerHTML=_12d;
_129.appendChild(_12b);
}
var _12e=this._cached.rows_body.getElementsByTagName("ul");
if(_12e.length==0){
this._cached.rows_body.appendChild(_129);
}else{
if(_127==this.rows.length-1){
this._cached.rows_body.appendChild(_129);
}else{
var _12f=null;
for(var n=_127+1;n<this.rows.length;n++){
_12f=_1.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_12f){
break;
}
}
if(_12f){
this._cached.rows_body.insertBefore(_129,_12f);
}else{
this._cached.rows_body.appendChild(_129);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_128,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_3.DataView.prototype._removeRowFromUI=function(_130){
if(_130<0||_130>this.rows.length-1){
return;
}
var _131=this.rows[_130].id;
var _132=_1.getElementById(this.divId+"_row_"+_131);
if(_132){
this._cached.rows_body.removeChild(_132);
}
this.__refreshFooter();
};
_3.DataView.prototype._refreshRowInUI=function(_133){
var row=this.getById(_133);
if(row){
var _134=_1.getElementById(this.divId+"_row_"+_133);
if(_134){
for(var a=0;a<this.columns.length;a++){
this.setCellValue(_133,this.columns[a].Name,row[this.columns[a].Name]);
}
}
}
};
_3.DataView.prototype._addCellToUI=function(_135,_136,ndx){
var _137=_1.getElementById(this.divId+"_row_"+_135);
if(_137){
var _138=_137.getElementsByTagName("li");
var li=_1.createElement("li");
li.id=this.divId+"_cell_"+_135+"_"+ndx;
var _139="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_139+=" dataViewCellHidden";
}
if(ndx==0){
_139+=" dataViewFirstCell";
}
li.className=_139;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_135)[_136]);
}
if(ndx>=0&&ndx<_138.length-1){
_137.insertBefore(li,_138[ndx]);
}else{
_137.appendChild(li);
}
this.setCellValue(_135,_136,this.getById(_135)[_136]);
}
};
_3.DataView.prototype._removeCellFromUI=function(_13a,ndx){
var _13b=this.multiselect?1:0;
var _13c=_1.getElementById(this.divId+"_row_"+_13a);
if(_13c){
var _13d=_13c.getElementsByTagName("li");
if(ndx>=0&&(_13b+ndx)<_13d.length){
_13c.removeChild(_13d[_13b+ndx]);
}
}
};
_3.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _10b(this.columns,data);
};
_3.DataView.prototype.addRow=function(_13e,ndx,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(!_13e){
_13e=this.createRow();
}else{
if(!_13e.id){
_13e.id=this.getNextRowId();
}
}
if(ndx===_2){
ndx=this.rows.length;
}else{
if(ndx<0||ndx>this.rows.length){
ndx=this.rows.length;
}
}
if(ndx>0&&ndx<this.rows.length){
this.rows.splice(ndx,0,_13e);
}else{
this.rows.push(_13e);
}
if(ui){
this._addRowToUI(ndx);
if(this.selectedRow>=ndx){
this.selectedRow++;
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows>=ndx){
this.selectedRows[n]++;
}
}
}
this._UIUpdateSelection();
}
};
_3.DataView.prototype.deleteRow=function(_13f,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
var _140=-1;
if(typeof (_13f)=="number"){
_140=_13f;
this.rows.splice(_13f,1);
}
if(typeof (_13f)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_13f){
_140=n;
this.rows.splice(n,1);
}
}
}
if(_140!=-1&&ui){
this._removeRowFromUI(_140);
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_140){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_140){
this.selectedRows[n]--;
}
}
}
}
this._UIUpdateSelection();
}
};
_3.DataView.prototype.curRow=function(){
return this.selectedRow!=-1?this.rows[this.selectedRow]:null;
};
_3.DataView.prototype.curRows=function(){
var rows=[];
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
rows.push(this.rows[this.selectedRows[n]]);
}
}
return this.multiselect?rows:this.curRow();
};
_3.DataView.prototype.getById=function(id){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==id){
return this.rows[n];
}
}
return null;
};
_3.DataView.prototype.searchRows=function(_141,_142){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_141]==_142){
ret.push(this.rows[n]);
}
}
return ret;
};
_3.DataView.prototype.setCellValue=function(_143,_144,_145){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return false;
}
var _146=this.__findColumn(_144);
if(_146==-1){
return false;
}
var _147=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_143){
_147=n;
break;
}
}
if(_147===null){
return false;
}
this.rows[_147][_144]=_145;
var cell=_1.getElementById(this.divId+"_cell_"+_143+"_"+_146);
if(typeof (this.columns[_146].Format)=="function"){
var _148=this.columns[_146].Format(_145);
cell.innerHTML="";
if(typeof (_148)=="string"){
cell.innerHTML=_148;
}else{
cell.appendChild(_148);
}
}else{
cell.innerHTML=_145;
}
return true;
};
_3.DataView.prototype.refresh=function(){
var e=_3.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateRows();
}
};
_3.DataView.prototype.setLoading=function(val){
if(!this.inDOM){
_3.error.report("Cant message on DataView not in DOM");
return;
}
this._cached.rows_body.style.display=val?"none":"";
this._cached.outer_body.className=val?"dataViewOuterBody dataViewLoading":"dataViewOuterBody";
};
_3.DataView.prototype.setMessage=function(msg){
if(!this.inDOM){
_3.error.report("Cant message on DataView not in DOM");
return;
}
if(msg===false||msg===null||typeof (msg)!="string"){
if(_1.getElementById(this.divId+"_message")){
this._cached.outer_body.removeChild(_1.getElementById(this.divId+"_message"));
}
this._cached.rows_body.style.display="";
}else{
this._cached.rows_body.style.display="none";
var _149;
if(!_1.getElementById(this.divId+"_message")){
_149=_1.createElement("div");
_149.id=this.divId+"_message";
_149.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_149);
}else{
_149=_1.getElementById(this.divId+"_message");
}
_149.innerHTML=msg;
}
};
_3.DataView.prototype.clearSelection=function(){
this.selectedRow=-1;
this.selectedRows=[];
_1.getElementById(this.divId+"_selectAll").checked=false;
if(this.inDOM){
this._UISelectAll(false);
}
};
_3.DataView.prototype.__selectAll=function(e){
if(!e){
e=window.event;
}
var elem=_1.getElementById(this.divId+"_selectAll");
if(this.rows.length){
if(elem.checked){
this.selectedRow=this.rows.length-1;
this.selectedRows=[];
for(var n=0;n<this.rows.length;n++){
this.selectedRows.push(n);
}
this._UISelectAll(true);
}else{
this.selectedRow=-1;
this.selectedRows=[];
this._UISelectAll(false);
}
}else{
elem.checked=false;
}
};
_3.DataView.prototype._UISelectAll=function(_14a){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_3.className[(_14a?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_14a;
}
};
_3.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _14b=false;
if(!this.multiselect){
if(this.selectedRow==n){
_14b=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_14b=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_14b;
}
_3.className[(_14b?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_3.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_1.getElementById(this.divId+"_pageInput").value;
var _14c=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_14c){
alert("Invalid page number.");
return;
}else{
this.curPage=Number(page)-1;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_1.getElementById(this.divId+"_pageInput").focus();
}
};
_3.DataView.prototype.__checkGoToPage=function(e){
if(!e){
e=window.event;
}
if(e.keyCode==13){
this.__goToPage(e);
}
};
_3.DataView.prototype.__goToPagePrev=function(e){
if(!e){
e=window.event;
}
if(!this.enabled){
_3.event.cancel(e);
return false;
}
if(this.curPage>0){
this.curPage--;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.__goToPageNext=function(e){
if(!e){
e=window.event;
}
if(!this.enabled){
_3.event.cancel(e);
return false;
}
var _14d=this.getTotalPages();
if(this.curPage<_14d-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.updateRows=function(_14e){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(_14e===_2){
_14e=false;
}
var _14f=null;
if(this.selectedRow!=-1&&this.rows[this.selectedRow]){
_14f=this.rows[this.selectedRow].id;
}
var _150=[];
if(this.selectedRows.length){
for(var n=0;n<this.selectedRows.length;n++){
if(this.rows[this.selectedRows[n]]){
_150.push(this.rows[this.selectedRows[n]].id);
}
}
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_14e){
this._cached.rows_body.innerHTML="";
}
var _151=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_151.length;n++){
var _152=_151[n].id.substr(_151[n].id.lastIndexOf("_")+1);
if(!this.getById(_152)){
this._cached.rows_body.removeChild(_151[n]);
n--;
}
}
for(var n=0;n<this.rows.length;n++){
if(!_1.getElementById(this.divId+"_row_"+this.rows[n].id)){
this._addRowToUI(n);
}else{
this._refreshRowInUI(this.rows[n].id);
}
}
if(!_14e){
this.selectedRow=-1;
if(_14f){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14f){
this.selectedRow=n;
break;
}
}
}
this.selectedRows=[];
if(_150.length){
for(var a=0;a<_150.length;a++){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_150[a]){
this.selectedRows.push(n);
break;
}
}
}
}
}
this._UIUpdateSelection();
if(_14e){
this._cached.outer_body.scrollTop=this._oldScrollTop?this._oldScrollTop:0;
}
this.__refreshFooter();
_3.event.fire(this,"oncontentupdated");
};
_3.DataView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_3.error.report("Attempt to refresh footer on DataView not added to DOM");
return;
}
var _153="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_153+=this.lang.noRows;
}else{
if(this.rows.length==1){
_153+="1 "+" "+this.lang.row;
}else{
_153+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_1.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_153+=this.lang.noRows;
}else{
var _154=(this.rowsPerPage*this.curPage);
var _155=(_154+this.rowsPerPage)>this.totalRows?this.totalRows:(_154+this.rowsPerPage);
_153+=(_154+1)+" - "+_155+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_153+="</li></ul>";
this._cached.footer.innerHTML=_153;
};
_3.DataView.prototype.__setOrder=function(_156){
if(!this.inDOM){
_3.error.report("Cant sort a DataView not in DOM");
return;
}
var _157=this.columns[_156].Name;
if(_156>=0&&_156<this.columns.length){
var _158=this.multiselect?2:0;
var _159=this._cached.headerUl.getElementsByTagName("li");
var _15a=this.__findColumn(this.orderBy);
_3.className.remove(_159[_158+(_15a*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_157){
this.orderBy=_157;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_3.className.add(_159[_158+(_156*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(!this.paginating){
this.__sort(0);
if(this.inDOM){
this.updateRows(true);
}
}else{
if(this.inDOM){
this.refresh();
}
}
}
return;
};
_3.DataView.prototype._onRowBodyClicked=function(e){
if(!e){
e=window.event;
}
var _15b=e.target||e.srcElement;
var _15c=this.divId+"_selectRow_";
if(_15b.nodeName.toLowerCase()=="input"&&_15b.id.substr(0,_15c.length)==_15c){
var _15d=_15b.id.substr(_15b.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_15d){
this.__markRow(e,n);
break;
}
}
}else{
while(_15b.nodeName.toLowerCase()!="ul"){
if(_15b==this._cached.rows_body){
return;
}
_15b=_15b.parentNode;
}
var _15d=_15b.id.substr(_15b.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_15d){
this.__selectRow(e,n);
break;
}
}
}
};
_3.DataView.prototype._onHeaderColumnClicked=function(e){
if(!e){
e=window.event;
}
var _15e=e.target||e.srcElement;
if(_15e.nodeName.toLowerCase()=="a"){
colNdx=Number(_15e.id.substr(_15e.id.lastIndexOf("_")+1));
if(!isNaN(colNdx)){
this.__setOrder(colNdx);
}
_3.event.cancel(e,true);
return false;
}
return true;
};
_3.DataView.prototype._onHeaderColumnMousedown=function(e){
if(!e){
e=window.event;
}
var _15f=e.target||e.srcElement;
if(_15f.nodeName.toLowerCase()=="li"&&_15f.className=="dataViewFieldSep"){
var _160=Number(_15f.id.substr(_15f.id.lastIndexOf("_")+1));
if(!isNaN(_160)){
this.activateResizing(e,_160);
}
}
};
_3.DataView.prototype.__selectRow=function(e,_161){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_161){
e.unselecting=_161;
}else{
if(this.multiselect){
var _162=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_161){
_162=true;
break;
}
}
if(_162){
e.unselecting=_161;
}else{
e.selecting=_161;
}
}else{
e.selecting=_161;
}
}
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_161!=-1){
if(!this.multiselect){
if(this.selectedRow!=-1){
_3.className.remove(rows[this.selectedRow],"dataViewRowSelected");
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
rows[this.selectedRows[a]].childNodes[0].firstChild.checked=false;
_3.className.remove(rows[this.selectedRows[a]],"dataViewRowSelected");
}
}
if(this.selectedRow==_161&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_161;
_3.className.add(rows[_161],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_161){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_161;
this.selectedRows=[_161];
}
}else{
if(e.ctrlKey){
var _162=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_161){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_162=true;
}
}
if(!_162){
this.selectedRow=_161;
this.selectedRows.push(_161);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_161){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_161;
for(var n=this.selectedRows[0];(_161>this.selectedRows[0]?n<=_161:n>=_161);(_161>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_161);
this.selectedRow=_161;
}
}
}
}
for(var a=0;a<this.selectedRows.length;a++){
rows[this.selectedRows[a]].childNodes[0].firstChild.checked=true;
_3.className.add(rows[this.selectedRows[a]],"dataViewRowSelected");
}
}
}
}
return false;
};
_3.DataView.prototype.__markRow=function(e,_163){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_163;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var _164=this.rows[_163].id;
elem=_1.getElementById(this.divId+"_selectRow_"+_164);
if(elem.checked){
this.selectedRows.push(_163);
this.selectedRow=_163;
var row=_1.getElementById(this.divId+"_row_"+_164);
_3.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_163){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_1.getElementById(this.divId+"_row_"+_164);
_3.className.remove(row,"dataViewRowSelected");
break;
}
}
}
return true;
};
_3.DataView.prototype.showOptionsMenu=function(e){
if(!e){
e=window.event;
}
this.optionsMenu.show(e);
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.toggleColumn=function(_165){
if(this.columns[_165].show){
this.columns[_165].show=false;
}else{
this.columns[_165].show=true;
}
var _166=this.multiselect?2:0;
var _167=this._cached.headerUl.getElementsByTagName("li");
if(_165>=0&&((_166+(_165*2)+1)<_167.length)){
_3.className[this.columns[_165].show?"remove":"add"](_167[_166+(_165*2)],"dataViewColumnHidden");
_3.className[this.columns[_165].show?"remove":"add"](_167[_166+(_165*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_166=this.multiselect?1:0;
_3.className[this.columns[_165].show?"remove":"add"](rows[n].childNodes[_166+_165],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_165+2,this.columns[_165].show);
this._adjustColumnsWidth();
};
_3.DataView.prototype._adjustColumnsWidth=function(_168){
if(this.columns.length&&this._cached){
if(_168===_2){
_168=false;
}
var _169=false;
var _16a=this._getHeadersWidth();
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Width!=this.columns[n].origWidth){
_169=true;
this.columns[n].Width=this.columns[n].origWidth;
}
}
var _16b=0;
var base=this.multiselect?2:0;
var lis=this._cached.headerUl.getElementsByTagName("li");
if(lis.length==(this.columns.length*2)+base&&_16a>0){
var _16c=0;
var _16d=false;
var _16e=null;
var _16f=0;
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
if(!_16d){
_16e=_3.element.getInnerBox(lis[base+(n*2)]);
_16f=_16e.left+_16e.right+lis[base+(n*2)+1].offsetWidth;
_16d=true;
break;
}
}
}
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_16c++;
if(this.columns[n].percentWidth!==null){
_16b+=_107+_16f;
}else{
_16b+=this.columns[n].Width+_16f;
}
}
}
if(_16c&&_16a>=((_107+_16f)*_16c)){
while(_16b>_16a){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show&&this.columns[n].percentWidth===null&&this.columns[n].Width>_107){
_169=true;
this.columns[n].Width--;
_16b--;
}
if(_16b==_16a){
break;
}
}
}
}else{
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_169=true;
this.columns[n].Width=_107;
}
}
}
var _170=_16a-_16b;
if(_170){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].percentWidth!==null){
this.columns[n].Width+=_170*(this.columns[n].percentWidth/100);
}
}
}
if(_169||_168){
for(var n=0;n<this.columns.length;n++){
lis[base+(n*2)].style.width=this.columns[n].Width+"px";
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
var _171=this.multiselect?1:0;
for(var a=0;a<rows.length;a++){
var rLis=rows[a].getElementsByTagName("li");
for(var n=0;n<this.columns.length;n++){
rLis[_171+n].style.width=this.columns[n].Width+"px";
}
}
}
}
}
};
_3.DataView.prototype._getHeadersWidth=function(){
var _172=_1.getElementById(this.divId+"_optionsMenuBtn");
var _173=_3.element.getOuterBox(_172);
var _174=_3.element.getInnerBox(this._cached.headerUl);
var _175=0;
if(this.multiselect){
var lis=this._cached.headerUl.getElementsByTagName("li");
_175=lis[0].offsetWidth+lis[1].offsetWidth;
}
return this._cached.headerUl.offsetWidth-_174.left-_175-(_172.offsetWidth+_173.left+_173.right);
};
_3.DataView.prototype.__calculateTotalWidth=function(){
var _176=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_176+=cols[n].offsetWidth;
}
return _176;
};
_3.DataView.prototype.__sort=function(_177){
var n,_178,swap;
if(!this.orderBy){
return;
}
for(n=_177+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_177][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_177][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_177][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_177][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_178=this.rows[_177];
this.rows[_177]=this.rows[n];
this.rows[n]=_178;
if(this.selectedRow==_177){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_177;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_177){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_177;
}
}
}
}
}
if(_177<this.rows.length-2){
this.__sort(_177+1);
}
};
_3.DataView.prototype.colum_exists=function(str){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==str){
return true;
}
}
return false;
};
_3.DataView.prototype.__getColumnSqlName=function(_179){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_179){
return this.columns[n].sqlName;
}
}
return false;
};
_3.DataView.prototype.activateResizing=function(e,_17a){
if(!e){
e=window.event;
}
if(this.columns[_17a].percentWidth===null){
this.resColumnId=_17a;
var x;
if(typeof (e.pageX)=="number"){
x=e.pageX;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
}else{
x=0;
}
}
this.resizingFrom=this.columns[_17a].Width;
this.resizingXCache=x;
_3.event.attach(_1,"mousemove",this._mouseMoveBind=_3.bindAsEventListener(this.doResizing,this));
_3.event.attach(_1,"mouseup",this._mouseUpBind=_3.bindAsEventListener(this.deactivateResizing,this));
}
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.deactivateResizing=function(e){
if(!e){
e=window.event;
}
_3.event.detach(_1,"mousemove",this._mouseMoveBind);
_3.event.detach(_1,"mouseup",this._mouseUpBind);
e.columnId=this.resColumnId;
e.resizingFrom=this.resizingFrom;
e.resizedTo=this.columns[this.resColumnId].Width;
_3.event.fire(this,"oncolumnresize",e);
this.resColumnId=null;
this.resizingXCache=0;
};
_3.DataView.prototype.doResizing=function(e){
if(!e){
e=window.event;
}
var x;
if(typeof (e.pageX)=="number"){
x=e.pageX;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
}else{
x=0;
}
}
var _17b=Math.abs(this.resizingXCache-x);
var _17c=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _17d=this.resColumnId;
var _17e=false;
if(!_17c){
if((this.columns[_17d].Width-_17b)>_107){
this.columns[_17d].Width-=_17b;
this.columns[_17d].origWidth=this.columns[_17d].Width;
_17e=true;
}
}else{
this.columns[_17d].Width+=_17b;
this.columns[_17d].origWidth=this.columns[_17d].Width;
_17e=true;
}
if(_17e){
this._adjustColumnsWidth(true);
}
};
_3.DataView.prototype.addDataType=function(name,_17f){
if(typeof (name)!="string"){
_3.error.report("Invalid data type name.");
return;
}
if(typeof (_17f)!="object"){
_3.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_17f.toString)!="function"){
_3.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_10a[name]){
_10a[name]=_17f;
}else{
_3.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.DataViewConnector=function(opts){
var _180={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_180,opts);
if(!_180.dataView){
_3.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_180.api)!="string"||_180.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_180.api;
this.dataView=_180.dataView;
this.parameters=_180.parameters;
this.type="json";
if(_180.type){
switch(_180.type.toLowerCase()){
case ("xml"):
this.type="xml";
break;
case ("json"):
default:
this.type="json";
break;
}
}
this.method="POST";
if(typeof (_180.method)=="string"){
this.method=_180.method.toUpperCase()=="POST"?"POST":"GET";
}
_3.event.attach(this.dataView,"onrefresh",_3.bind(this._onRefresh,this));
this.httpRequest=new _3.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_3.bind(this._onError,this),onLoad:_3.bind(this._onLoad,this)});
};
_3.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _181="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_181+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_181+="&"+this.parameters;
}
this.httpRequest.send(_181);
_3.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
if(root.getAttribute("success")=="1"){
var _182=Number(root.getAttribute("totalrows"));
if(!isNaN(_182)){
this.dataView.totalRows=_182;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _183={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _184=cols[a].getAttribute("name");
if(_184&&cols[a].firstChild){
var _185=this.dataView.__findColumn(_184)!=-1?this.dataView.columns[this.dataView.__findColumn(_184)].Type:"alpha";
_183[_184]=_10a[_185](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_183),_2,false);
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
this.dataView.updateRows();
}else{
this.dataView.rows.length=0;
if(data.success){
var _182=Number(data.totalrows);
if(!isNaN(_182)){
this.dataView.totalRows=_182;
}
for(var n=0;n<data.rows.length;n++){
var _183={};
for(var _184 in data.rows[n]){
var _185=this.dataView.__findColumn(_184)!=-1?this.dataView.columns[this.dataView.__findColumn(_184)].Type:"alpha";
_183[_184]=_10a[_185](data.rows[n][_184]);
}
this.dataView.addRow(this.dataView.createRow(_183),_2,false);
}
}else{
this.dataView.setMessage(data.errormessage);
}
this.dataView.updateRows();
}
},_onError:function(_186){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_186+")");
}};
_3.DataView.prototype.lang={"noRows":"No hay filas para mostrar.","rows":"filas.","row":"fila.","pageStart":"Página ","pageMiddle":" de ","pageEnd":" Ir a página: ","pageGo":"Ir","pagePrev":"<< Anterior","pageNext":"Siguiente >>","refresh":"Actualizar","of":"de"};
var _187=function(opts){
var _188={id:null,parentId:0,parent:null,Name:""};
_3.mixin(_188,opts);
this.treeView=_188.treeView;
this.id=_188.id!==null?_188.id:this.treeView.getNextNodeId();
this.parentId=_188.parentId;
this.Name=String(_188.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_188.parent;
};
_187.prototype={searchNode:function(id){
var n;
var srch=null;
var _189=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_189<this.childNodes.length){
srch=this.childNodes[_189].searchNode(id);
_189++;
}
return srch;
},updateChildrenNodes:function(){
var _18a=_1.getElementById(this.treeView.divId+"_"+this.id+"_branch");
var _18b=_3.getInactiveLocation();
for(var i=0;i<this.childNodes.length;i++){
var node=_1.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_18a.appendChild(node);
var _18c="";
var _18d=this.childNodes[i].childNodes.length;
if(_18d){
_18c+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\""+_18b+"\" class=\"";
_18c+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_18c+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_18d){
_18c+="class=\"treeViewSingleNode\" ";
}
_18c+="href=\""+_18b+"\">"+this.childNodes[i].Name+"</a>";
if(_18d){
_18c+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_18c;
if(_18d){
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_3.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_3.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_18d){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_3.TreeView=function(opts){
var _18e={canHaveChildren:false,hasInvalidator:true};
_3.mixin(_18e,opts);
var cmp=_96.get(_18e);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.TreeView";
this.DOMAddedImplementation=function(){
if(this._templateRendered){
this.updateNodes();
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_3.event.detach(this._registeredEvents.pop());
}
};
this.selectedNode=null;
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
_3.event.registerCustomEvent(this,"onrefresh");
_3.event.registerCustomEvent(this,"oncontentupdated");
_3.event.registerCustomEvent(this,"onselect");
this.masterNode=new _187({id:0,parentId:0,parent:null,Name:"root",treeView:this});
this.nextNodeId=1;
this._registeredEvents=[];
this._templateRendered=false;
this.create();
_3.className.add(this.target,"treeView");
this.renderTemplate();
};
_3.TreeView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var ul=_1.createElement("ul");
ul.id=this.divId+"_0_branch";
ul.className="treeViewContainer";
this.target.insertBefore(ul,this.invalidator);
this._templateRendered=true;
if(this.inDOM){
this.updateNodes();
}
}
};
_3.TreeView.prototype.getNextNodeId=function(){
var _18f=true;
while(_18f){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_18f=false;
}else{
this.nextNodeId++;
}
}
return this.nextNodeId;
};
_3.TreeView.prototype.searchNode=function(id){
return this.masterNode.searchNode(id);
};
_3.TreeView.prototype.refresh=function(){
var e=_3.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateNodes();
}
};
_3.TreeView.prototype.updateNodes=function(){
if(!this.inDOM){
_3.error.report("Add treeView to DOM before working with elements");
return;
}
_1.getElementById(this.divId+"_0_branch").innerHTML="";
this.masterNode.updateChildrenNodes();
};
_3.TreeView.prototype.setLoading=function(val){
_3.className[val?"add":"remove"](this.target,"treeViewLoading");
};
_3.TreeView.prototype.setMessage=function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_1.getElementById(this.divId+"_message")){
_1.getElementById(this.divId+"_message").parentNode.removeChild(_1.getElementById(this.divId+"_message"));
}
_1.getElementById(this.divId+"_0_branch").style.display="";
}else{
_1.getElementById(this.divId+"_0_branch").style.display="none";
var _190;
if(!_1.getElementById(this.divId+"_message")){
_190=_1.createElement("div");
_190.id=this.divId+"_message";
_190.className="treeViewMessageDiv";
this.target.appendChild(_190);
}else{
_190=_1.getElementById(this.divId+"_message");
}
_190.innerHTML=msg;
}
};
_3.TreeView.prototype._expandNode=function(e,_191){
if(!e){
e=window.event;
}
var node=this.searchNode(_191);
if(node.expanded){
node.expanded=false;
_1.getElementById(this.divId+"_"+_191+"_expandable").className="treeViewExpandableNode";
_1.getElementById(this.divId+"_"+_191+"_branch").style.display="none";
}else{
node.expanded=true;
_1.getElementById(this.divId+"_"+_191+"_expandable").className="treeViewCollapsableNode";
_1.getElementById(this.divId+"_"+_191+"_branch").style.display="block";
}
_3.event.cancel(e);
return false;
};
_3.TreeView.prototype._selectNode=function(e,_192){
if(!e){
e=window.event;
}
if(this.selectedNode!==null){
var _193=this.searchNode(this.selectedNode);
_3.className.remove(_1.getElementById(this.divId+"_"+_193.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_192){
var _193=this.searchNode(_192);
_3.className.add(_1.getElementById(this.divId+"_"+_193.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_192)?null:_192;
_3.event.cancel(e,true);
return false;
};
_3.TreeView.prototype.addNode=function(opts,_194,ndx){
var _195=(_194==0)?this.masterNode:this.searchNode(_194);
if(_195){
var _196={treeView:this,parentId:_194,parent:_195,Name:""};
_3.mixin(_196,opts);
if(ndx>=0&&ndx<_195.childNodes.length){
_195.childNodes.splice(ndx,0,new _187(_196));
}else{
_195.childNodes.push(new _187(_196));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_3.TreeView.prototype.deleteNode=function(_197){
if(_197==0||_197=="0"){
return;
}
this._searchAndDelete(_197,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_3.TreeView.prototype._searchAndDelete=function(_198,node){
var _199=false;
if(typeof (_198)=="number"||typeof (_198)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_198){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_199=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_198){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_199=true;
break;
}
}
}
if(!_199){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_198);
if(done){
_199=done;
break;
}
}
}
return _199;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.TreeViewConnector=function(opts){
var _19a={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_19a,opts);
if(!_19a.treeView){
_3.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_19a.api)!="string"||_19a.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_19a.api;
this.treeView=_19a.treeView;
this.parameters=_19a.parameters;
this.type="json";
if(_19a.type){
switch(_19a.type.toLowerCase()){
case ("xml"):
this.type="xml";
break;
case ("json"):
default:
this.type="json";
break;
}
}
this.method="POST";
if(typeof (_19a.method)=="string"){
this.method=_19a.method.toUpperCase()=="POST"?"POST":"GET";
}
_3.event.attach(this.treeView,"onrefresh",_3.bind(this._onRefresh,this));
this.httpRequest=new _3.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_3.bind(this._onError,this),onLoad:_3.bind(this._onLoad,this)});
};
_3.DataConnectors.TreeViewConnector.prototype={_onRefresh:function(e){
this.treeView.setLoading(true);
this.httpRequest.send(this.parameters);
_3.event.cancel(e);
},_onLoad:function(data){
this.treeView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
delete this.treeView.masterNode;
this.treeView.masterNode=new _187({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _19b=this._fetchNodes(root);
if(_19b.length){
this._addNodesFromXml(_19b,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _187({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(data.success){
if(data.nodes&&data.nodes.length){
this._addNodesFromJson(data.nodes,0);
}
}else{
this.treeView.setMessage(data.errormessage);
}
}
},_fetchNodes:function(elem){
var ret=[];
for(var n=0;n<elem.childNodes.length;n++){
if(elem.childNodes[n].nodeName=="node"){
ret.push(elem.childNodes[n]);
}
}
return ret;
},_addNodesFromXml:function(_19c,_19d){
for(var n=0;n<_19c.length;n++){
var id=null;
if(_19c[n].getAttribute("id")){
id=_19c[n].getAttribute("id");
}
var _19e=_19c[n].getElementsByTagName("label")[0];
if(_19e){
labelStr=_19e.firstChild.data;
}
var _19f=_19c[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_19d);
if(_19f){
this._addNodesFromXml(this._fetchNodes(_19c[n]),id);
}
}
},_addNodesFromJson:function(_1a0,_1a1){
for(var n=0;n<_1a0.length;n++){
this.treeView.addNode({Name:_1a0[n].label,id:_1a0[n].id},_1a1);
if(_1a0[n].nodes){
this._addNodesFromJson(_1a0[n].nodes,_1a0[n].id);
}
}
},_onError:function(_1a2){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_1a2+")");
}};
_3.CalendarView=function(opts){
var _1a3=new Date();
var _1a4={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_1a3.getMonth(),year:_1a3.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_3.mixin(_1a4,opts);
var cmp=_96.get(_1a4);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_1a4.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_1a4.month))&&_1a4.month>=0&&_1a4.month<12)?_1a4.month:_1a3.getMonth();
this.curYear=(!isNaN(Number(_1a4.year))&&_1a4.year>0)?_1a4.year:new _1a3.getFullYear();
this.disabledBefore=_1a4.disabledBefore;
this.disabledAfter=_1a4.disabledAfter;
this.disabledDays=_1a4.disabledDays;
this.disabledDates=_1a4.disabledDates;
this.markedDates=[];
this.hookedTo=null;
this._registeredEvents=[];
this._templateRendered=false;
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
_3.event.registerCustomEvent(this,"onselect");
this.DOMAddedImplementation=function(){
if(_1.getElementById(this.divId+"_body")){
this.updateDates();
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_advancedAccept"),"onclick",_3.bindAsEventListener(this.selectAdvanced,this)));
this._registeredEvents.push(_3.event.attach(_1.getElementById(this.divId+"_advancedCancel"),"onclick",_3.bindAsEventListener(this.cancelAdvanced,this)));
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_3.event.detach(this._registeredEvents.pop());
}
};
this.create();
_3.className.add(this.cmpTarget,"calendarView");
this.renderTemplate();
this.canHaveChildren=false;
};
_3.CalendarView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _1a5="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_1a5+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_1a5+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _1a6=new Date();
if(this.selectedDates.length){
_1a6=this.selectedDates[0];
}
_1a5+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_1a5+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_1a6.getDate()+"\" /></p>";
_1a5+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_1a5+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_1a5+="<option value=\""+n+"\""+(_1a6.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_1a5+="</select></p>";
_1a5+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_1a5+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_1a6.getFullYear()+"\" /></p>";
_1a5+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_1a5+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_1a5+="</div>";
_1a5+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_1a5;
this._templateRendered=true;
if(this.inDOM&&this._registeredEvents.length==0){
this.DOMAddedImplementation();
}
}
};
_3.CalendarView.prototype.updateDates=function(){
if(!this.inDOM){
_3.error.report("Can't update data on non visible calendarView object.");
return;
}
var _1a7=_1.getElementById(this.divId+"_body");
_1a7.style.display="";
_1.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
while(_1a7.firstChild){
_1a7.removeChild(_1a7.firstChild);
}
var _1a8=_1.createElement("thead");
var _1a9,_1aa,_1ab,tmpA;
var _1a9=_1.createElement("tr");
for(var n=0;n<7;n++){
_1aa=_1.createElement("th");
_1aa.appendChild(_1.createTextNode(this.lang.shortDays[n]));
_1a9.appendChild(_1aa);
}
_1a8.appendChild(_1a9);
_1a7.appendChild(_1a8);
var _1ac=new Date();
var _1ad=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _1ae=new Date(_1ad.getTime());
_1ae.setMonth(_1ae.getMonth()+1);
var _1af=_1ad.getDay();
var _1b0=0;
var _1b1=_1.createElement("tbody");
var _1a9=_1.createElement("tr");
while(_1b0<_1af){
_1ab=_1.createElement("td");
_1ab.appendChild(_1.createTextNode(" "));
_1a9.appendChild(_1ab);
_1b0++;
}
while(_1ad<_1ae){
_1ab=_1.createElement("td");
_1ab.setAttribute("align","left");
_1ab.setAttribute("valign","top");
tmpA=_1.createElement("a");
tmpA.setAttribute("href",_3.getInactiveLocation());
tmpA.appendChild(_1.createTextNode(_1ad.getDate()));
var _1b2=false;
if(this.isEqual(_1ad,_1ac)){
_1b2=true;
}
var _1b3=false;
if(this.isDisabledDate(_1ad)){
_1b3=true;
if(_1b2){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_1ad,this.markedDates[n])){
_1b3=true;
if(_1b2){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_1ad,this.selectedDates[n])){
_1b3=true;
if(_1b2){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_1b3&&_1b2){
tmpA.className="calendarToday";
}
_1ab.appendChild(tmpA);
_1a9.appendChild(_1ab);
_3.event.attach(tmpA,"onclick",_3.bind(this.selectDate,this,_1ad.getDate()));
_1ad.setDate(_1ad.getDate()+1);
_1b0++;
if(_1b0>6){
_1b1.appendChild(_1a9);
_1a9=_1.createElement("tr");
_1b0=0;
}
}
if(_1b0>0){
_1b1.appendChild(_1a9);
while(_1b0<7){
_1ab=_1.createElement("td");
_1ab.appendChild(_1.createTextNode(" "));
_1a9.appendChild(_1ab);
_1b0++;
}
}
_1a7.appendChild(_1b1);
this.__refreshHeader();
this.__refreshFooter();
};
_3.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1b4=_1.getElementById(this.divId+"_header");
_1b4.innerHTML="";
var _1b5=_3.getInactiveLocation();
var _1b6="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\""+_1b5+"\"> </a></li>";
_1b6+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\""+_1b5+"\"> </a></li>";
_1b6+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\""+_1b5+"\"> </a></li>";
_1b6+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1b6+="</ul>";
_1b4.innerHTML=_1b6;
_3.event.attach(_1.getElementById(this.divId+"_prevMonth"),"onclick",_3.bind(this.goPrevMonth,this));
_3.event.attach(_1.getElementById(this.divId+"_viewAdvanced"),"onclick",_3.bind(this.setAdvanced,this));
_3.event.attach(_1.getElementById(this.divId+"_nextMonth"),"onclick",_3.bind(this.goNextMonth,this));
};
_3.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1b7=_1.getElementById(this.divId+"_footer");
_1b7.innerHTML="";
var _1b8="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_1b8+=text;
}else{
var text=this.lang.multipleSelection;
for(var n=0;n<this.selectedDates.length;n++){
if(n>0){
text+=", ";
}
text+=this.lang.shortDays[this.selectedDates[n].getDay()];
text+=" "+this.selectedDates[n].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[n].getMonth()];
}
_1b8+=text;
}
}else{
_1b8+=this.lang.noSelection+"</p>";
}
_1b7.innerHTML=_1b8;
_3.event.attach(_1.getElementById(this.divId+"_goHome"),"onclick",_3.bind(this.goHomeDate,this));
};
_3.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=window.event;
}
_1.getElementById(this.divId+"_body").style.display="none";
_1.getElementById(this.divId+"_advanced").style.display="block";
var _1b9=new Date();
if(this.selectedDates.length){
_1b9=this.selectedDates[0];
}
_1.getElementById(this.divId+"DaySelector").value=_1b9.getDate();
_1.getElementById(this.divId+"MonthSelector").selectedIndex=_1b9.getMonth();
_1.getElementById(this.divId+"YearSelector").value=_1b9.getFullYear();
this.advanced=true;
_3.event.cancel(e);
return false;
};
_3.CalendarView.prototype.cancelAdvanced=function(){
_1.getElementById(this.divId+"_body").style.display="";
_1.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
};
_3.CalendarView.prototype.selectAdvanced=function(e){
if(!e){
e=window.event;
}
var _1ba=_1.getElementById(this.divId+"DaySelector").value;
var _1bb=_1.getElementById(this.divId+"MonthSelector").value;
var _1bc=_1.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1ba))){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1bc))){
alert(this.lang.error2);
_3.event.cancel(e,true);
return false;
}
var _1bd=new Date(_1bc,_1bb,_1ba);
if(_1bd.getMonth()!=_1bb){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1bd)){
alert(this.lang.error3);
_3.event.cancel(e,true);
return false;
}
var _1be={selecting:_1bd,selectedDates:this.selectedDates};
_1be=_3.event.fire(this,"onselect",_1be);
if(_1be.returnValue==false){
_3.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1bd;
this.goHomeDate(e);
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=window.event;
}
var _1bf=new Date(this.curYear,this.curMonth,date);
var _1c0={selecting:_1bf,selectedDates:this.selectedDates};
_1c0=_3.event.fire(this,"onselect",_1c0);
if(_1c0.returnValue==false){
_3.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1bf)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1bf;
}else{
_3.error.report("Error: multiselect function not implemented.");
_3.event.cancel(e,true);
return false;
}
this.updateDates();
}
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.isDisabledDate=function(date){
if(this.disabledBefore){
if(date.getFullYear()<this.disabledBefore.getFullYear()){
return true;
}else{
if(date.getFullYear()<=this.disabledBefore.getFullYear()&&date.getMonth()<this.disabledBefore.getMonth()){
return true;
}else{
if(date.getFullYear()<=this.disabledBefore.getFullYear()&&date.getMonth()<=this.disabledBefore.getMonth()&&date.getDate()<this.disabledBefore.getDate()){
return true;
}
}
}
}
if(this.disabledAfter){
if(date.getFullYear()>this.disabledAfter.getFullYear()){
return true;
}else{
if(date.getFullYear()>=this.disabledAfter.getFullYear()&&date.getMonth()>this.disabledAfter.getMonth()){
return true;
}else{
if(date.getFullYear()>=this.disabledAfter.getFullYear()&&date.getMonth()>=this.disabledAfter.getMonth()&&date.getDate()>this.disabledAfter.getDate()){
return true;
}
}
}
}
if(this.disabledDays[date.getDay()]){
return true;
}
for(var n=0;n<this.disabledDates.length;n++){
if(this.isEqual(date,this.disabledDates[n])){
return true;
}
}
return false;
};
_3.CalendarView.prototype.isEqual=function(_1c1,_1c2){
if(_1c1.getFullYear()==_1c2.getFullYear()&&_1c1.getMonth()==_1c2.getMonth()&&_1c1.getDate()==_1c2.getDate()){
return true;
}else{
return false;
}
};
_3.CalendarView.prototype.goPrevMonth=function(e){
if(!e){
e=window.event;
}
this.curMonth--;
if(this.curMonth<0){
this.curMonth=11;
this.curYear--;
}
this.updateDates();
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.goNextMonth=function(e){
if(!e){
e=window.event;
}
this.curMonth++;
if(this.curMonth>11){
this.curMonth=0;
this.curYear++;
}
this.updateDates();
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.goHomeDate=function(e){
if(!e){
e=window.event;
}
var _1c3;
if(this.selectedDates.length){
_1c3=this.selectedDates[0];
}else{
_1c3=new Date();
}
this.curMonth=_1c3.getMonth();
this.curYear=_1c3.getFullYear();
this.updateDates();
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.hook=function(_1c4){
var elem=null;
if(typeof (_1c4)=="string"){
elem=_1.getElementById(_1c4);
}else{
if(_3.isHTMLElement(_1c4)){
elem=_1c4;
}
}
if(elem){
this.hookedTo=elem;
calElem=_1.getElementById(this.div);
_3.event.attach(elem,"onfocus",_3.bind(this.showHooked,this));
calElem.style.display="none";
calElem.style.position="absolute";
_3.event.attach(this,"onselect",_3.bind(this.assignToHooked,this));
}
};
_3.CalendarView.prototype.showHooked=function(e){
if(!e){
e=window.event;
}
var elem=this.hookedTo;
var date=this.getDateFromStr(elem.value);
this.curMonth=date.getMonth();
this.curYear=date.getFullYear();
this.selectedDates.length=0;
this.selectedDates[0]=date;
this.Show();
if(this._hideHookedBind){
_3.event.detach(_1,"onclick",this._hideHookedBind);
}
_3.event.attach(_1,"onclick",this._hideHookedBind=_3.bind(this.hideHooked,this));
this.divElem.style.display="block";
this.divElem.zIndex="1000";
if(e.offsetX){
x=e.offsetX;
y=e.offsetY;
}else{
x=e.pageX-_1.getBoxObjectFor(elem).x;
y=e.pageY-_1.getBoxObjectFor(elem).y;
}
if(e.pageX){
x=e.pageX-x;
y=e.pageY-y+24;
}else{
if(e.x){
x=e.x+_1.documentElement.scrollLeft-x;
y=e.y+_1.documentElement.scrollTop-y+24;
}
}
this.y=y;
this.x=x;
this.updateSize();
};
_3.CalendarView.prototype.hideHooked=function(e){
if(!e){
e=window.event;
}
this.hide();
if(this._hideHookedBind){
_3.event.detach(_1,"onclick",this._hideHookedBind);
}
};
_3.CalendarView.prototype.assignToHooked=function(){
var date=this.selectedDates[0];
var _1c5=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1c5.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1c5.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_3.event.detach(_1,"onclick",this._hideHookedBind);
}
};
_3.CalendarView.prototype.getDateFromStr=function(str){
var _1c6=str.split("/");
var ret;
if(!isNaN(Number(_1c6[0]))&&!isNaN(Number(_1c6[1]))&&!isNaN(Number(_1c6[2]))){
if(this.lang.isFrenchDateFormat){
if(_1c6[1]>0&&_1c6[1]<13&&_1c6[0]>0&&_1c6[0]<32&&_1c6[2]>0){
ret=new Date(_1c6[2],_1c6[1]-1,_1c6[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1c6[0]>0&&_1c6[0]<13&&_1c6[1]>0&&_1c6[1]<32&&_1c6[2]>0){
ret=new Date(_1c6[2],_1c6[1]-1,_1c6[0],0,0,0);
}else{
ret=new Date();
}
}
}else{
ret=new Date();
}
return ret;
};
_3.CalendarView.prototype.lang={shortDays:["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],longDays:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],shortMonths:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],longMonths:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],noSelection:"Sin seleccionar",oneSelection:"Fecha: ",multipleSelection:"Fechas: ",prevMonth:"Mes Anterior",nextMonth:"Mes Próximo",advanced:"Seleccionar mes y año",homeDate:"Ir a selección o al día de hoy",day:"Día:",month:"Mes:",year:"Año:",accept:"Aceptar",cancel:"Cancelar",error1:"El campo del día ingresado es inválido.",error2:"El campo del año ingresado es inválido.",error3:"La fecha seleccionada no está disponible.",isFrenchDateFormat:true};
var _1c7=function(_1c8,path,name){
this.thumbnail=_1c8;
this.path=path;
this.name=name;
};
_3.GalleryView=function(opts){
var _1c9={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_3.mixin(_1c9,opts);
var cmp=_96.get(_1c9);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1c9.showNames;
this.fixedThumbSize=_1c9.fixedThumbSize;
this.thumbWidth=_1c9.thumbWidth;
this.thumbHeight=_1c9.thumbHeight;
this.images=[];
this.DOMAddedImplementation=function(){
this.updateImages();
};
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
_3.event.registerCustomEvent(this,"onrefresh");
_3.event.registerCustomEvent(this,"onselect");
this.create();
_3.className.add(this.target,"galleryViewWrapper");
_3.className.add(this.cmpTarget,"galleryView");
this.canHaveChildren=false;
};
_3.GalleryView.prototype.addImage=function(opts){
var _1ca={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_3.mixin(_1ca,opts);
if(!_1ca.thumbnail){
_3.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1ca.insertIndex==this.images.length){
this.images.push(new _1c7(_1ca.thumbnail,_1ca.path,_1ca.name));
}else{
this.images.splice(_1ca.insertIndex,0,new _1c7(_1ca.thumbnail,_1ca.path,_1ca.name));
}
if(this.inDOM){
this.updateImages();
}
};
_3.GalleryView.prototype.deleteImage=function(_1cb){
if(typeof (_1cb)=="number"){
this.images.splice(_1cb,1);
}else{
if(typeof (_1cb)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1cb){
this.images.splice(n,1);
break;
}
}
}
}
if(this.selectedImage>this.images.length-1){
this.selectedImage=-1;
}
if(this.inDOM){
this.updateImages();
}
};
_3.GalleryView.prototype.refresh=function(){
var e=_3.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateImages();
}
};
_3.GalleryView.prototype.setLoading=function(val){
_3.className[(val?"add":"remove")](this.cmpTarget,"galleryViewLoading");
};
_3.GalleryView.prototype.setMessage=function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_1.getElementById(this.divId+"_message")){
this.target.removeChild(_1.getElementById(this.divId+"_message"));
}
_3.className.remove(this.cmpTarget,"galleryViewMessage");
}else{
_3.className.add(this.cmpTarget,"galleryViewMessage");
var _1cc;
if(!_1.getElementById(this.divId+"_message")){
_1cc=_1.createElement("p");
_1cc.id=this.divId+"_message";
this.target.appendChild(_1cc);
}else{
_1cc=_1.getElementById(this.divId+"_message");
}
_1cc.innerHTML=msg;
}
};
_3.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_3.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1cd="";
for(var n=0;n<this.images.length;n++){
_1cd+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1cd+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1cd+="class=\"gvSelectedImage\" ";
}
_1cd+=">";
_1cd+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1cd+="<p>"+this.images[n].name+"</p>";
}
_1cd+="</div>";
}
this.cmpTarget.innerHTML=_1cd;
for(var n=0;n<this.images.length;n++){
_3.event.attach(_1.getElementById(this.divId+"_img_"+n),"onclick",_3.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_3.GalleryView.prototype._selectImage=function(e,_1ce){
if(!e){
e=window.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1ce;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1ce!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1ce){
this.selectedImage=-1;
}else{
this.selectedImage=_1ce;
imgs[_1ce].parentNode.className="gvSelectedImage";
}
}
_3.event.cancel(e);
return false;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.GalleryViewConnector=function(opts){
var _1cf={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_1cf,opts);
if(!_1cf.galleryView){
_3.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1cf.api)!="string"||_1cf.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_1cf.api;
this.galleryView=_1cf.galleryView;
this.parameters=_1cf.parameters;
this.type="json";
if(_1cf.type){
switch(_1cf.type.toLowerCase()){
case ("xml"):
this.type="xml";
break;
case ("json"):
default:
this.type="json";
break;
}
}
this.method="POST";
if(typeof (_1cf.method)=="string"){
this.method=_1cf.method.toUpperCase()=="POST"?"POST":"GET";
}
_3.event.attach(this.galleryView,"onrefresh",_3.bind(this._onRefresh,this));
this.httpRequest=new _3.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_3.bind(this._onError,this),onLoad:_3.bind(this._onLoad,this)});
};
_3.DataConnectors.GalleryViewConnector.prototype={_onRefresh:function(e){
this.galleryView.setLoading(true);
this.httpRequest.send(this.parameters);
_3.event.cancel(e);
},_onLoad:function(data){
this.galleryView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.galleryView.images.length=0;
if(root.getAttribute("success")=="1"){
var _1d0=root.getElementsByTagName("image");
for(var n=0;n<_1d0.length;n++){
var _1d1=_1d0.item(n).getElementsByTagName("thumbnail");
var path=_1d0.item(n).getElementsByTagName("path");
var name=_1d0.item(n).getElementsByTagName("name");
var _1d2="";
var _1d3="";
var _1d4="";
if(_1d1.length){
if(_1d1.item(0).firstChild){
_1d2=_1d1.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1d3=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1d4=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1c7(_1d2,_1d3,_1d4));
var _1d5=_1d0.item(n).getElementsByTagName("param");
if(_1d5.length){
for(var a=0;a<_1d5.length;a++){
var _1d6=_1d5.item(a).getAttribute("name");
var _1d7="";
if(_1d5.item(a).firstChild){
_1d7=_1d5.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1d6]=_1d7;
}
}
}
}else{
this.galleryView.setMessage(root.getAttribute("errormessage"));
}
if(this.galleryView.inDOM){
this.galleryView.updateImages();
}
}else{
this.galleryView.images.length=0;
if(data.success){
for(var n=0;n<data.images.length;n++){
var _1d2=data.images[n].thumbnail;
var _1d3=data.images[n].path;
var _1d4=data.images[n].name;
this.galleryView.images.push(new _1c7(_1d2,_1d3,_1d4));
for(var _1d8 in data.images[n]){
if(_1d8!="thumbnail"&&_1d8!="path"&&_1d8!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1d8]=data.images[n][_1d8];
}
}
}
}else{
this.galleryView.setMessage(data.errormessage);
}
if(this.galleryView.inDOM){
this.galleryView.updateImages();
}
}
},_onError:function(_1d9){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1d9+")");
}};
_3.Toolbar=function(opts){
var _1da={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_1da,opts);
var cmp=_96.get(_1da);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Toolbar";
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
this.buttons=[];
this.nextBtnId=0;
this._showingMore=false;
this._extraBtns=1;
this._showingExtraButtons=false;
this._checkMenuBind=null;
this._registeredEvents=[];
this.DOMAddedImplementation=function(){
for(var n=0;n<this.buttons.length;n++){
this.addClickEvent(this.buttons[n]);
}
if(this._moreSpan){
this._registeredEvents.push(_3.event.attach(this._moreSpan,"onclick",_3.bindAsEventListener(this.onDropdownClick,this)));
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_3.event.detach(this._registeredEvents.pop());
}
};
this.resizeImplementation=function(){
if(this._showingExtraButtons){
this.hideDropDown();
}
var _1db=this.cmpTarget.offsetWidth;
var _1dc=_1db;
var _1dd=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1de=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-right"));
_1db-=(this._moreSpan.offsetWidth+_1dd+_1de);
var _1df=0;
var _1e0=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1e1=this.cmpTarget.childNodes[n];
var _1e2=parseInt(_3.className.getComputedProperty(_1e1,"margin-left"));
var _1e3=parseInt(_3.className.getComputedProperty(_1e1,"margin-right"));
if(isNaN(_1e2)){
_1e2=0;
}
if(isNaN(_1e3)){
_1e3=0;
}
_1df+=_1e1.offsetWidth+_1e2+_1e3;
if(n==this.cmpTarget.childNodes.length-1){
_1db=_1dc;
}
if(_1df>=_1db){
if(!this._showingMore){
this.showMore();
}
if(!_1e0){
this._extraBtns=n;
_1e0=true;
}
_3.className.remove(_1e1,"jsToolbarLast");
_1e1.style.visibility="hidden";
if(n>0){
_3.className.add(this.buttons[n-1].target,"jsToolbarLast");
}
}else{
if(n<this.buttons.length-1){
_3.className.remove(_1e1,"jsToolbarLast");
}else{
_3.className.add(_1e1,"jsToolbarLast");
}
_1e1.style.visibility="visible";
}
}
if(_1df<_1db){
if(this._showingMore){
this.hideMore();
}
this._extraBtns=this.buttons.length;
}
};
this.destroyImplementation=function(){
this._extraButtons.parentNode.removeChild(this._extraButtons);
};
this.create();
_3.className.add(this.target,"jsToolbar");
this._moreSpan=_1.createElement("span");
this._moreSpan.id=this.divId+"_more";
this._moreSpan.className="jsToolbarDropdown jsToolbarDropdownHidden";
this.target.appendChild(this._moreSpan);
this._moreSpan.innerHTML=" ";
if(this.inDOM){
this._registeredEvents.push(_3.event.attach(this._moreSpan,"onclick",_3.bindAsEventListener(this.onDropdownClick,this)));
}
this._extraButtons=_1.createElement("div");
this._extraButtons.id=this.divId+"_extraBtns";
this._extraButtons.className="jsComponent jsContextMenu jsToolbarExtraPanel jsToolbarExtraPanelHidden";
_3.body().appendChild(this._extraButtons);
};
_3.Toolbar.prototype.addButton=function(opts,ndx){
var _1e4={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_3.mixin(_1e4,opts);
_1e4.target=_1.createElement("span");
_1e4.target.id=this.divId+"_btn_"+_1e4.id;
var _1e5="";
if(typeof (_1e4.onContentAdded)!="function"){
_1e5="<a"+(_1e4.className?" class=\""+_1e4.className+"\" ":"")+" href=\""+_3.getInactiveLocation()+"\">"+_1e4.label+"</a>";
}
if(ndx===_2){
ndx=this.buttons.length;
}
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<=this.buttons.length){
if(this._showingExtraButtons){
this.hideDropDown();
}
if(ndx==0){
if(this.buttons.length){
_3.className.remove(this.buttons[0].target,"jsToolbarFirst");
}
_1e4.target.className="jsToolbarFirst";
}
if(ndx==this.buttons.length){
if(this.buttons.length){
_3.className.remove(this.buttons[this.buttons.length-1].target,"jsToolbarLast");
}
_3.className.add(_1e4.target,"jsToolbarLast");
}
if(ndx==this.buttons.length){
this.buttons.push(_1e4);
this.cmpTarget.appendChild(_1e4.target);
}else{
if(ndx==0){
this.buttons.splice(ndx,0,_1e4);
}
this.cmpTarget.insertBefore(_1e4.target,this.cmpTarget.childNodes[ndx]);
}
_1e4.target.innerHTML=_1e5;
if(this.inDOM){
this.addClickEvent(this.buttons[ndx]);
this.resize();
}
}
};
_3.Toolbar.prototype.addClickEvent=function(btn){
if(typeof (btn.onContentAdded)=="function"){
btn.target.innerHTML="";
btn.onContentAdded();
}else{
if(typeof (btn.onclick)=="function"){
this._registeredEvents.push(_3.event.attach(btn.target.firstChild,"onclick",btn.onclick));
}
}
};
_3.Toolbar.prototype.getNextBtnId=function(){
var _1e6=true;
while(_1e6){
_1e6=false;
var _1e7=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1e7){
_1e6=true;
break;
}
}
}
return _1e7;
};
_3.Toolbar.prototype.removeButton=function(_1e8){
var ndx=null;
if(typeof (_1e8)=="number"){
ndx=ref;
}else{
if(typeof (_1e8)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1e8){
ndx=n;
break;
}
}
}else{
if(typeof (_1e8)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1e8){
ndx=n;
break;
}
}
}
}
}
if(ndx!==null){
if(this._showingExtraButtons){
this.hideDropDown();
}
if(ndx==0){
if(this.buttons.length>1){
_3.className.add(this.buttons[1].target,"jsToolbarFirst");
}
}
if(ndx==this.buttons.length-1){
if(this.buttons.length>1){
_3.className.add(this.buttons[this.buttons.length-2].target,"jsToolbarLast");
}
}
for(var n=0;n<this._registeredEvents.length;n++){
if(this._registeredEvents[n][0].parentNode==this.buttons[ndx].target){
_3.event.detach(this._registeredEvents[n]);
this._registeredEvents.splice(n,1);
break;
}
}
this.buttons.splice(ndx,1);
this.cmpTarget.removeChild(this.buttons[ndx].target);
this.resize();
}
};
_3.Toolbar.prototype.showMore=function(){
_3.className.remove(this._moreSpan,"jsToolbarDropdownHidden");
this._showingMore=true;
};
_3.Toolbar.prototype.hideMore=function(){
_3.className.add(this._moreSpan,"jsToolbarDropdownHidden");
this._showingMore=false;
if(this._showingExtraButtons){
this.hideDropDown();
}
};
_3.Toolbar.prototype.onDropdownClick=function(e){
if(!e){
e=window.event;
}
if(!this._showingExtraButtons){
for(var n=this._extraBtns;n<this.buttons.length;n++){
this._extraButtons.appendChild(this.buttons[n].target);
this.buttons[n].target.style.visibility="visible";
}
var x=0,y=0;
if(e){
if(typeof (e.pageX)=="number"){
x=e.pageX;
y=e.pageY;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
y=(e.clientY+_1.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
if(x+this._extraButtons.offsetWidth>_3.body().offsetWidth){
x=x-this._extraButtons.offsetWidth;
}
if(y+this._extraButtons.offsetHeight>_3.body().offsetHeight){
y=y-this._extraButtons.offsetHeight;
}
if(x<0){
x=0;
}
if(y<0){
y=0;
}
this._extraButtons.style.top=y+"px";
this._extraButtons.style.left=x+"px";
if(this._checkMenuBind){
_3.event.detach(_1,"onclick",this._checkMenuBind);
}
setTimeout(_3.bind(function(){
_3.event.attach(_1,"onclick",this._checkMenuBind=_3.bind(this.checkDropDown,this));
},this),1);
_3.className.remove(this._extraButtons,"jsToolbarExtraPanelHidden");
this._showingExtraButtons=true;
}
_3.event.cancel(e,true);
return false;
};
_3.Toolbar.prototype.checkDropDown=function(e){
if(this._checkMenuBind){
_3.event.detach(_1,"onclick",this._checkMenuBind);
}
this.hideDropDown();
};
_3.Toolbar.prototype.hideDropDown=function(){
if(this._showingExtraButtons){
while(this._extraButtons.childNodes.length){
this._extraButtons.childNodes[0].style.visibility="hidden";
this.cmpTarget.appendChild(this._extraButtons.childNodes[0]);
}
this._showingExtraButtons=false;
_3.className.add(this._extraButtons,"jsToolbarExtraPanelHidden");
}
};
_3.Dialog=function(opts){
var _1e9={canHaveChildren:true,hasInvalidator:true,centerOnShow:true,x:0,y:0,width:400,height:300,closable:true,title:"Dialog"};
_3.mixin(_1e9,opts);
var cmp=_96.get(_1e9);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Dialog";
this.centerOnShow=_1e9.centerOnShow?true:false;
this.closable=_1e9.closable?true:false;
this.title=_1e9.title;
_3.event.init(this);
_3.event.registerCustomEvent(this,"onbeforeshow");
_3.event.registerCustomEvent(this,"onshow");
_3.event.registerCustomEvent(this,"onbeforehide");
_3.event.registerCustomEvent(this,"onhide");
_3.event.registerCustomEvent(this,"onbeforedestroy");
_3.event.registerCustomEvent(this,"ondestroy");
_3.event.registerCustomEvent(this,"oncreate");
_3.event.registerCustomEvent(this,"onresize");
_3.event.registerCustomEvent(this,"onfocus");
_3.event.registerCustomEvent(this,"onblur");
this.resizeImplementation=function(){
var _1ea=_3.element.getInnerBox(this.target);
var _1eb=this._titlePanel.offsetHeight;
this.cmpTarget.style.height=(this.title?((this.height-_1eb-_1ea.top-_1ea.bottom)+"px"):"100%");
};
this.showing=false;
this.show=function(){
var e=_3.event.fire(this,"onbeforeshow");
if(!e.returnValue){
return;
}
if(!this.created){
this.create();
}
if(!this.visible&&this.target&&!this.showing&&!this.hiding){
if(this.centerOnShow){
this.x=(_3.body().offsetWidth/2)-(this.width/2);
this.y=(_3.body().offsetHeight/2)-(this.height/2);
}
this.__updatePosition();
_3.className.remove(this.target,"jsComponentHidden");
this.target.style.opacity="0";
this.target.style.mozOpacity="0";
var eId=_3.effects.scheduleEffect({elem:this.target,property:["style.opacity","style.mozOpacity"],start:[0,0],end:[1,1],unit:[0,0],duration:200,callback:_3.bind(this.doShow,this)});
_3.effects.start(eId);
this.showing=true;
}
};
this.doShow=function(){
this.target.style.opacity="1";
this.target.style.mozOpacity="1";
this.showing=false;
this.visible=true;
for(var n=0;n<this.components.length;n++){
this.components[n].show();
}
if(this.parent){
this.parent.resize();
}else{
this.resize();
}
this.focus();
_3.event.fire(this,"onshow");
};
this.hiding=false;
this.hide=function(){
var e=_3.event.fire(this,"onbeforehide");
if(!e.returnValue){
return;
}
if(this.visible&&this.target&&!this.hiding&&!this.showing){
this.target.style.opacity="0";
this.target.style.mozOpacity="0";
var eId=_3.effects.scheduleEffect({elem:this.target,property:["style.opacity","style.mozOpacity"],start:[1,1],end:[0,0],unit:[0,0],duration:200,callback:_3.bind(this.doHide,this)});
_3.effects.start(eId);
this.hiding=true;
}
};
this.doHide=function(){
this.target.style.opacity="1";
this.target.style.mozOpacity="1";
_3.className.add(this.target,"jsComponentHidden");
this.hiding=false;
this.visible=false;
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
if(this.parent){
this.parent.resize();
}else{
this.resize();
}
this.passFocus();
_3.event.fire(this,"onhide");
};
this.create();
_3.className.add(this.target,"jsDialog");
_3.body().appendChild(this.target);
this._titlePanel=_1.createElement("div");
this._titlePanel.id=this.divId+"_title";
this._titlePanel.className="jsDialogTitle";
if(this.title){
this._titlePanel.innerHTML="<span id=\""+this.divId+"_titleText\">"+this.title+"</span><span id=\""+this.divId+"_closeHandle\" class=\"jsDialogClose\"></span>";
}else{
_3.className.add(this._titlePanel,"jsDialogTitleHidden");
}
this.target.insertBefore(this._titlePanel,this.cmpTarget);
if(!this.closable){
_3.className.add(_1.getElementById(this.divId+"_closeHandle"),"jsDialogCloseHidden");
}
this.resize();
this.onDOMAdded();
_3.event.attach(this._titlePanel,"onmousedown",_3.bindAsEventListener(this._startDragging,this));
this._dragMoveEvent=null;
this._dragDropEvent=null;
this._cacheX=0;
this._cacheY=0;
_3.event.attach(_1.getElementById(this.divId+"_closeHandle"),"onclick",_3.bind(this.hide,this));
};
_3.Dialog.prototype._startDragging=function(e){
if(!e){
e=window.event;
}
this._dragMoveEvent=_3.event.attach(_1,"onmousemove",_3.bindAsEventListener(this._moveDrag,this));
this._dragDropEvent=_3.event.attach(_1,"onmouseup",_3.bindAsEventListener(this._stopDragging,this));
var x=0,y=0;
if(e){
if(typeof (e.pageX)=="number"){
x=e.pageX;
y=e.pageY;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
y=(e.clientY+_1.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
this._cacheX=x;
this._cacheY=y;
_3.event.cancel(e,true);
};
_3.Dialog.prototype._moveDrag=function(e){
if(!e){
e=window.event;
}
var x=0,y=0;
if(e){
if(typeof (e.pageX)=="number"){
x=e.pageX;
y=e.pageY;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_1.documentElement.scrollLeft);
y=(e.clientY+_1.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
var _1ec=x-this._cacheX;
var _1ed=y-this._cacheY;
this.x+=_1ec;
this.y+=_1ed;
this.__updatePosition();
this._cacheX=x;
this._cacheY=y;
_3.event.cancel(e,true);
};
_3.Dialog.prototype._stopDragging=function(e){
if(!e){
e=window.event;
}
_3.event.detach(this._dragMoveEvent);
_3.event.detach(this._dragDropEvent);
this._dragMoveEvent=null;
this._dragDropEvent=null;
_3.event.cancel(e,true);
};
return _3;
})(document);
if(!window.Scriptor){
window.Scriptor={};
}
__tmpScriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

