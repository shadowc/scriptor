window.__tmpScriptor=(function(_1,_2){
var _3={version:{major:2,minor:3,instance:"beta 1",toString:function(){
return this.major+"."+this.minor+" "+this.instance;
}},bind:function(_4,_5){
if(arguments.length>2){
var _6=[];
for(var n=2;n<arguments.length;n++){
_6.push(arguments[n]);
}
return function(){
var _7=[];
for(var i=0;i<arguments.length;i++){
_7.push(arguments[i]);
}
for(var i=0;i<_6.length;i++){
_7.push(_6[i]);
}
return _4.apply(_5,_7);
};
}else{
return function(){
return _4.apply(_5,arguments);
};
}
},bindAsEventListener:function(_8,_9){
if(arguments.length>2){
var _a=[];
for(var n=2;n<arguments.length;n++){
_a.push(arguments[n]);
}
return function(e){
var _b=[e||window.event];
for(var i=0;i<_a.length;i++){
_b.push(_a[i]);
}
return _8.apply(_9,_b);
};
}else{
return function(e){
return _8.apply(_9,[e||window.event]);
};
}
},isHtmlElement:function(o){
var _c=_1.getElementsByTagName("head")[0];
if(o===_3.body()||o===_c){
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
var _d=o.cloneNode(false);
a.appendChild(_d);
a.removeChild(_d);
a=null;
_d=null;
return (o.nodeType!=3);
}
catch(e){
a=null;
return false;
}
},body:function(){
if(!_e){
_e=_1.getElementsByTagName("body")[0];
}
return _e;
}};
var _e=null;
var _f=0;
var _10="scriptor_"+_f;
var _11=function(){
_10="scriptor_"+_f;
_f++;
while(_1.getElementById(_10)){
_f++;
_10="scriptor_"+_f;
}
return _10;
};
var _12=0;
var _13=0;
_3.mixin=function(obj,_14){
if(!obj){
obj={};
}
for(var i=1,l=arguments.length;i<l;i++){
_3._mixin(obj,arguments[i]);
}
return obj;
};
_3._mixin=function(_15,_16){
var _17,_18,_19={};
for(var i in {toString:1}){
_17=[];
break;
}
_17=_17||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
_18=_17.length;
var _1a,s,i;
for(_1a in _16){
s=_16[_1a];
if(!(_1a in _15)||(_15[_1a]!==s&&(!(_1a in _19)||_19[_1a]!==s))){
_15[_1a]=s;
}
}
if(_18&&_16){
for(i=0;i<_18;++i){
_1a=_17[i];
s=_16[_1a];
if(!(_1a in _15)||(_15[_1a]!==s&&(!(_1a in _19)||_19[_1a]!==s))){
_15[_1a]=s;
}
}
}
return _15;
};
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
_1d.style.width=_13+"px";
_1d.style.height=_12+"px";
_1.getElementsByTagName("body")[0].appendChild(_1d);
}
if(msg){
if(!_1d.firstChild){
var _1e="<div class=\"msg\">"+msg+"</div>";
_1d.innerHTML=_1e;
_1d.firstChild.style.left=((_13/2)-100)+"px";
_1d.firstChild.style.top=((_12/2)-15)+"px";
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
_13=_1.body.clientWidth;
}else{
_13=_1.documentElement.clientWidth;
}
if(_1.documentElement.clientHeight==0){
_12=_1.body.clientHeight;
}else{
_12=_1.documentElement.clientHeight;
}
}else{
_13=window.innerWidth;
_12=window.innerHeight;
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
_13=Math.max(_13,x);
_12=Math.max(_12,y);
var inv=_1.getElementById("scriptor_invalidator");
if(inv){
inv.style.width=_13+"px";
inv.style.height=_12+"px";
if(inv.firstChild){
inv.firstChild.style.left=((_13/2)-100)+"px";
inv.firstChild.style.top=((_12/2)-15)+"px";
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
_3.cookie={cookies:{},init:function(){
var ca=_1.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _7b=c.substring(0,c.indexOf("="));
this.cookies[_7b]=c.substring(_7b.length+1,c.length);
}
},get:function(_7c){
return this.cookies[_7c]?this.cookies[_7c]:"";
},create:function(_7d,_7e,_7f){
if(_7f){
var _80=new Date();
_80.setTime(_80.getTime()+(_7f*24*60*60*1000));
var _81="; expires="+_80.toGMTString();
}else{
var _81="";
}
_1.cookie=_7d+"="+_7e+_81+"; path=/";
this.cookies[_7d]=_7e;
},erase:function(_82){
this.create(_82,"",-1);
delete this.cookies[_82];
}};
_3.cookie.init();
_3.httpRequest=function(_83){
var _84={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_3.mixin(_84,_83);
if(typeof (_84.ApiCall)!="string"||_84.ApiCall==""){
_3.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_84.ApiCall;
this.method="POST";
if(typeof (_84.method)=="string"){
this.method=_84.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_84.Type)=="string"){
switch(_84.Type.toLowerCase()){
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
if(typeof (_84.onLoad)=="function"){
this.onLoad=_84.onLoad;
}
this.onError=null;
if(typeof (_84.onError)=="function"){
this.onError=_84.onError;
}
this.requestHeaders=[];
if(_84.requestHeaders&&_84.requestHeaders.length){
for(var n=0;n<_84.requestHeaders.length;n++){
if(typeof (_84.requestHeaders[n][0])=="string"&&typeof (_84.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_84.requestHeaders[n][0],_84.requestHeaders[n][1]]);
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
},send:function(_85){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_85;
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
this.http_request.send(_85);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _86=null;
switch(this.Type){
case ("xml"):
_86=this.http_request.responseXML;
break;
case ("json"):
_86=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_86=this.http_request.responseText;
break;
}
this.onLoad(_86);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_3.httpRequest.prototype.lang={errors:{createRequestError:"Error creando objeto Ajax!",requestHandleError:"Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde."}};
var _87=0;
var _88=function(){
return "q"+(_87++);
};
var _89=(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null);
_3.effects={effectsQueue:{},lastId:0,intervalId:null,started:false,scheduleEffect:function(_8a){
var _8b=_88();
this.effectsQueue[_8b]=this._getEffectInstance();
_3.mixin(this.effectsQueue[_8b],_8a);
return _8b;
},startAll:function(){
for(var fId in this.effectsQueue){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(_89){
_89(this.loop);
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
if(_89){
_89(this.loop);
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
var _8c=this.effectsQueue[fId];
if(_8c){
_8c.started=false;
for(var n=0;n<_8c.property.length;n++){
var _8d=_8c.property[n];
if(_8d.substr(0,6)=="style."){
_8c.elem.style[_8d.substr(6)]=_8c.end[n]+_8c.unit[n];
}else{
if(typeof (_8c.setAttribute)=="function"){
_8c.elem.setAttribute(_8d,_8c.end[n]+_8c.unit[n]);
}else{
_8c.elem[_8d]=_8c.end[n]+_8c.unit[n];
}
}
}
if(typeof (_8c.callback)=="function"){
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
var _8e=new Date().getTime();
for(var fId in _3.effects.effectsQueue){
var _8f=_3.effects.effectsQueue[fId];
if(_8f.started){
if(_8f.startTime==null){
_8f.startTime=_8e;
}
if((_8f.startTime+_8f.duration)<=_8e){
_3.effects.cancel(fId);
}else{
var _90=(_8e-_8f.startTime)/_8f.duration;
for(var n=0;n<_8f.property.length;n++){
var _91=_8f.start[n]+((_8f.end[n]-_8f.start[n])*_90);
var _92=_8f.property[n];
if(_92.substr(0,6)=="style."){
_8f.elem.style[_92.substr(6)]=_91+_8f.unit[n];
}else{
if(typeof (_8f.setAttribute)=="function"){
_8f.elem.setAttribute(_92,_91+_8f.unit[n]);
}else{
_8f.elem[_92]=_91+_8f.unit[n];
}
}
}
if(typeof (_8f.step)=="function"){
_8f.step(_8e);
}
}
}
}
_3.effects.checkGoOn();
},checkInterval:function(){
var _93=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_93=true;
break;
}
}
if(!_93&&this.started){
clearInterval(this.intervalId);
this.intervalId=null;
this.started=false;
}
},checkGoOn:function(){
if(this.started){
var _94=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_94=true;
break;
}
}
if(_94){
if(_89){
_89(this.loop);
}
}
}
},_getEffectInstance:function(){
return {elem:null,property:[],start:[],end:[],unit:[],duration:500,callback:null,step:null,started:false,startTime:null};
}};
var _95={get:function(_96){
var _97={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_3.mixin(_97,_96);
if(!_97.divId){
_97.divId=_11();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_97.id,region:_97.region,style:_97.style,className:_97.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_97.canHaveChildren,hasInvalidator:_97.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_97.x,y:_97.y,width:_97.width,height:_97.height,resizable:_97.resizable,minHeight:_97.minHeight,maxHeight:_97.maxHeight,minWidth:_97.minWidth,maxWidth:_97.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
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
var _98=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_98=n;
break;
}
}
var _99=false;
var _9a=(_98==this.parent.components.length-1)?0:_98+1;
for(var n=_9a;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_98){
this.parent.components[n].focus();
_99=true;
break;
}
}
if(!_99&&_9a>0){
for(var n=0;n<_9a;n++){
if(this.parent.components[n].visible&&n!=_98){
this.parent.components[n].focus();
_99=true;
break;
}
}
}
if(!_99){
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
var _9b=this.className?("jsComponent jsComponentHidden "+this.className):"jsComponent jsComponentHidden";
this.target.className=this.target.className?(_9b+" "+this.target.className):_9b;
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
var _9c=_3.className.getComputedProperty(this.target,"width");
var _9d=_3.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_9c))){
this.width=parseInt(_9c);
}
if(this.height==null&&!isNaN(parseInt(_9d))){
this.height=parseInt(_9d);
}
if(_9c.substr(_9c.length-1)=="%"){
this._percentWidth=_9c;
}else{
this._origWidth=_9c;
}
if(_9d.substr(_9d.length-1)=="%"){
this._percentHeight=_9d;
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
var _9e=this.__getInnerBox();
var _9f=this.__getOuterBox();
var _a0=this.__getChildrenForRegion("top");
var _a1=0;
var _a2=(this.width-_9e.left-_9e.right-_9f.left-_9f.right)/_a0.length;
var _a3=false;
for(var n=0;n<_a0.length;n++){
if(_a0[n].height>_a1){
_a1=_a0[n].height;
}
_a0[n].x=(n*_a2);
_a0[n].y=0;
_a0[n].width=_a2;
_a0[n].height=_a0[n].height;
if(_a0[n].resizable){
_a3=true;
}
}
var _a4=this.__getChildrenForRegion("bottom");
var _a5=0;
var _a6=(this.width-_9e.left-_9e.right-_9f.left-_9f.right)/_a4.length;
var _a7=false;
for(var n=0;n<_a4.length;n++){
if(_a4[n].height>_a5){
_a5=_a4[n].height;
}
if(_a4[n].resizable){
_a7=true;
}
}
for(var n=0;n<_a4.length;n++){
_a4[n].x=(n*_a6);
_a4[n].y=this.height-_a5-_9e.top-_9e.bottom;
_a4[n].width=_a6;
_a4[n].height=_a4[n].height;
}
var _a8=this.__getChildrenForRegion("left");
var _a9=0;
var _aa=(this.height-_9e.top-_9e.bottom-_9f.left-_9f.right)/_a8.length;
var _ab=false;
for(var n=0;n<_a8.length;n++){
if(_a8[n].width>_a9){
_a9=_a8[n].width;
}
_a8[n].x=0;
_a8[n].y=_a1+(n*_aa);
_a8[n].height=_aa-_a1-_a5;
_a8[n].width=_a8[n].width;
if(_a8[n].resizable){
_ab=true;
}
}
var _ac=this.__getChildrenForRegion("right");
var _ad=0;
var _ae=(this.height-_9e.top-_9e.bottom-_9f.top-_9f.bottom)/_ac.length;
var _af=false;
for(var n=0;n<_ac.length;n++){
if(_ac[n].width>_ad){
_ad=_ac[n].width;
}
if(_ac[n].resizable){
_af=true;
}
}
for(var n=0;n<_ac.length;n++){
_ac[n].x=this.width-_ad-_9e.left-_9e.right;
_ac[n].y=_a1+(n*_ae);
_ac[n].width=_ad;
_ac[n].height=_ae-_a1-_a5;
}
var _b0=this.__getChildrenForRegion("center");
var _b1=(this.height-_9e.top-_9e.bottom-_9f.top-_9f.bottom-_a5-_a1)/_b0.length;
for(var n=0;n<_b0.length;n++){
_b0[n].x=_a9;
_b0[n].y=_a1+(n*_b1);
_b0[n].height=_b1;
_b0[n].width=this.width-_9e.left-_9e.right-_9f.left-_9f.right-_a9-_ad;
}
if(_a3){
if(!this.splitters.top){
this.splitters.top=_1.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_3.className.add(this.splitters.top,"jsSplitter");
_3.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_3.event.attach(this.splitters.top,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _b2=_a0[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_9e.left-_9e.right)+"px";
this.splitters.top.style.top=(_a1-_b2.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_a7){
if(!this.splitters.bottom){
this.splitters.bottom=_1.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_3.className.add(this.splitters.bottom,"jsSplitter");
_3.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_3.event.attach(this.splitters.bottom,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _b3=_a4[0].__getOuterBox();
var _b4=parseInt(_3.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_b4)){
_b4=5;
}
this.splitters.bottom.style.width=(this.width-_9e.left-_9e.right)+"px";
this.splitters.bottom.style.top=(this.height-_a5-_b4-_b3.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_ab){
if(!this.splitters.left){
this.splitters.left=_1.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_3.className.add(this.splitters.left,"jsSplitter");
_3.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_3.event.attach(this.splitters.left,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _b5=_a8[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_9e.top-_9e.bottom-_a1-_a5)+"px";
this.splitters.left.style.top=(_a1)+"px";
this.splitters.left.style.left=(_a9-_b5.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_af){
if(!this.splitters.right){
this.splitters.right=_1.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_3.className.add(this.splitters.right,"jsSplitter");
_3.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_3.event.attach(this.splitters.right,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _b6=_ac[0].__getOuterBox();
var _b7=parseInt(_3.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_b7)){
_b7=5;
}
this.splitters.right.style.height=(this.height-_9e.top-_9e.bottom-_a1-_a5)+"px";
this.splitters.right.style.top=(_a1)+"px";
this.splitters.right.style.left=(this.width-_ad-_b7-_b6.left)+"px";
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
},resizeTo:function(_b8){
if(_b8){
if(_b8.width){
this.width=_b8.width;
this._percentWidth=null;
}
if(_b8.height){
this.height=_b8.height;
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
var _b9=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_b9=true;
break;
}
}
if(!_b9&&ref.CMP_SIGNATURE&&this.canHaveChildren){
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
var _ba=this.__getInnerBox();
var _bb=this.__getOuterBox();
var _bc=0,_bd=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_bb.left-_bb.right-_ba.left-_ba.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_bb=this.__getOuterBox();
_bc=this.target.parentNode.offsetWidth-_bb.left-_bb.right-_ba.left-_ba.right;
if(isNaN(_bc)||_bc<0){
_bc=0;
}
this.width=_bc;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_bd=this.target.offsetHeight-_bb.top-_bb.bottom-_ba.top-_ba.bottom;
if(isNaN(_bd)||_bd<0){
_bd=0;
}
this.height=_bd;
}
if(this.width!==null){
_bc=this.width-_ba.left-_ba.right-_bb.left-_bb.right;
if(isNaN(_bc)||_bc<0){
_bc=0;
}
this.target.style.width=_bc+"px";
}
if(this.height!==null){
_bd=this.height-_ba.top-_ba.bottom-_bb.top-_bb.bottom;
if(isNaN(_bd)||_bd<0){
_bd=0;
}
this.target.style.height=_bd+"px";
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
var _be=parseInt(_3.className.getComputedProperty(this.target,"padding-top"));
var _bf=parseInt(_3.className.getComputedProperty(this.target,"padding-bottom"));
var _c0=parseInt(_3.className.getComputedProperty(this.target,"padding-left"));
var _c1=parseInt(_3.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_be)){
box.top=_be;
}
if(!isNaN(_bf)){
box.bottom=_bf;
}
if(!isNaN(_c0)){
box.left=_c0;
}
if(!isNaN(_c1)){
box.right=_c1;
}
var _c2=parseInt(_3.className.getComputedProperty(this.target,"border-top-width"));
var _c3=parseInt(_3.className.getComputedProperty(this.target,"border-bottom-width"));
var _c4=parseInt(_3.className.getComputedProperty(this.target,"border-left-width"));
var _c5=parseInt(_3.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_c2)){
box.top+=_c2;
}
if(!isNaN(_c3)){
box.bottom+=_c3;
}
if(!isNaN(_c4)){
box.left+=_c4;
}
if(!isNaN(_c5)){
box.right+=_c5;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _c6=parseInt(_3.className.getComputedProperty(this.target,"margin-top"));
var _c7=parseInt(_3.className.getComputedProperty(this.target,"margin-bottom"));
var _c8=parseInt(_3.className.getComputedProperty(this.target,"margin-left"));
var _c9=parseInt(_3.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_c6)){
box.top=_c6;
}
if(!isNaN(_c7)){
box.bottom=_c7;
}
if(!isNaN(_c8)){
box.left=_c8;
}
if(!isNaN(_c9)){
box.right=_c9;
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
},_onResizeStart:function(e,_ca){
if(!e){
e=window.event;
}
this.resizingRegion=_ca;
_3.event.attach(_1,"mousemove",this._resizeMoveHandler=_3.bindAsEventListener(this._onResizeMove,this));
_3.event.attach(_1,"mouseup",this._resizeStopHandler=_3.bindAsEventListener(this._onResizeStop,this));
if(_ca=="top"||_ca=="bottom"){
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
var _cb=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_cb){
_3.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_cb;
var _cc=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_cc=_3.event.getPointXY(e).y;
}else{
_cc=_3.event.getPointXY(e).x;
}
var _cd=_cc-this.resizeStartingPosition;
this.resizeStartingPosition=_cc;
var _ce=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_ce.length;n++){
_ce[n].resizeTo({height:_ce[n].height+_cd});
}
break;
case ("bottom"):
for(var n=0;n<_ce.length;n++){
_ce[n].resizeTo({height:_ce[n].height-_cd});
}
break;
case ("left"):
for(var n=0;n<_ce.length;n++){
_ce[n].resizeTo({width:_ce[n].width+_cd});
}
break;
case ("right"):
for(var n=0;n<_ce.length;n++){
_ce[n].resizeTo({width:_ce[n].width-_cd});
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
var _cf=["center","left","top","bottom","right"];
var _d0=false;
for(var n=0;n<_cf.length;n++){
if(cmp.region==_cf[n]){
_d0=true;
break;
}
}
if(!_d0){
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
cmp.divId=_11();
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
_3.ContextMenu=function(_d1){
var _d2={canHaveChildren:false,hasInvalidator:false,items:[]};
_3.mixin(_d2,_d1);
var cmp=_95.get(_d2);
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
for(var n=0;n<_d2.items.length;n++){
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
var _d3=_3.element.getOuterBox(this.ul);
var _d4=this.__getInnerBox();
this.target.style.width="auto";
this.width=this.ul.offsetWidth+_d3.left+_d3.right+_d4.left+_d4.right;
this.height=this.ul.offsetHeight+_d3.top+_d3.bottom+_d4.top+_d4.bottom;
this.__updatePosition();
};
_3.ContextMenu.prototype.addItem=function(_d5,ndx){
var _d6={label:"sep",onclick:null,checked:false};
_3.mixin(_d6,_d5);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_d6);
}else{
ndx=this.items.length;
this.items.push(_d6);
}
if(this.target){
var li=_1.createElement("li");
var _d7="";
var _d8=_d6;
if(_d8.label=="sep"){
li.className="contextMenuSep";
}else{
if(_d8.checked){
li.className="OptionChecked";
}
_d7+="<a href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_d8["class"]){
_d7+=" class=\""+_d8["class"]+"\"";
}
_d7+=">"+_d8.label+"</a>";
}
li.innerHTML=_d7;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_d8.label!="sep"&&typeof (_d8.onclick)=="function"){
_3.event.attach(_1.getElementById(this.divId+"_itm_"+ndx),"onclick",_d8.onclick);
}
this.updateSize();
}
};
_3.ContextMenu.prototype.removeItem=function(_d9){
if(typeof (_d9)=="number"){
if(_d9>=0&&_d9<=this.items.length-1){
this.items.splice(_d9,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_d9]);
}
}
}else{
if(typeof (_d9)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_d9){
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
_3.ContextMenu.prototype.checkItem=function(_da,_db){
if(typeof (_da)=="undefined"){
return;
}
if(typeof (_db)=="undefined"){
_db=false;
}
if(typeof (_da)=="number"){
if(_da>=0&&_da<=this.items.length-1){
this.items[_da].checked=_db?true:false;
if(this.target){
_3.className[(_db?"add":"remove")](this.ul.getElementsByTagName("li")[_da],"OptionChecked");
}
}
}else{
if(typeof (_da)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_da){
this.items[n].checked=_db?true:false;
if(this.target){
_3.className[(_db?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_3.Panel=function(_dc){
var _dd={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_dd,_dc);
var cmp=_95.get(_dd);
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
var _de="";
if(_1.getElementById(this.divId)){
var _df=_1.getElementById(this.divId);
_de=_df.innerHTML;
_df.innerHTML="";
}
this.create();
if(_de){
this.setContent(_de);
}
_3.className.add(this.target,"jsPanel");
};
_3.TabContainer=function(_e0){
var _e1={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_e1,_e0);
var cmp=_95.get(_e1);
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
var _e2=this._tabList.cmpTarget.offsetWidth;
var _e3=_e2;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _e4=_1.getElementById(this._tabList.divId+"_more");
if(_e4){
var _e5=parseInt(_3.className.getComputedProperty(_e4,"margin-left"));
var _e6=parseInt(_3.className.getComputedProperty(_e4,"margin-right"));
_e2-=(_e4.offsetWidth+_e5+_e6);
}
var _e7=0;
var _e8=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _e9=this._tabList.cmpTarget.childNodes[n];
var _ea=parseInt(_3.className.getComputedProperty(_e9,"margin-left"));
var _eb=parseInt(_3.className.getComputedProperty(_e9,"margin-right"));
if(isNaN(_ea)){
_ea=0;
}
if(isNaN(_eb)){
_eb=0;
}
_e7+=_e9.offsetWidth+_ea+_eb;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_e2=_e3;
}
if(_e7>=_e2){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_e8){
this._tabList._extraTabs=n;
_e8=true;
}
_e9.style.visibility="hidden";
}else{
_e9.style.visibility="visible";
}
}
if(_e7<_e2){
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
this._tabList=new _ec({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _ed({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_3.TabContainer.prototype.addTab=function(_ee,_ef,ndx){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _f0={title:"",paneId:_ef.divId,pane:_ef,closable:false};
_3.mixin(_f0,_ee);
if(!_f0.pane||!_f0.pane.CMP_SIGNATURE||!_f0.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _f1=new _f2(_f0);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_f1);
}else{
this._tabs.push(_f1);
}
var _f3=this._tabList.cmpTarget.childNodes;
var _f4=_1.createElement("div");
_f4.id=_f1.paneId+"_tablabel";
_f4.className="jsTabLabel";
if(_f1.closable){
_3.className.add(_f4,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_f1.paneId;
_3.className.add(_f4,"jsTabSelected");
}
_f4.innerHTML="<span>"+_f1.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_f1.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_f4);
}else{
this._tabList.cmpTarget.insertBefore(_f4,_f3[ndx]);
}
this._pageContainer.addPage(_f1.pane);
this._pageContainer.activate(this._selectedTabId);
var _f5=_1.getElementById(_f1.paneId+"_closeHandler");
if(!_f1.closable){
_3.className.add(_f5,"jsTabCloseHidden");
}else{
_3.className.add(_f4,"jsTabClosable");
}
_3.event.attach(_f4,"onclick",_3.bindAsEventListener(this.selectTab,this,_f1.paneId));
_3.event.attach(_f5,"onclick",_3.bindAsEventListener(this.closeTab,this,_f1.paneId));
this.resize();
};
_3.TabContainer.prototype.removeTab=function(ref,_f6){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_f6)=="undefined"){
_f6=true;
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
var _f7=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _f7=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_f6);
this._tabs.splice(ndx,1);
if(_f7){
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
_3.TabContainer.prototype.setTitle=function(ref,_f8){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_f8;
this.resize();
}
};
_3.TabContainer.prototype.setClosable=function(ref,_f9){
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
var _fa=this._tabList.cmpTarget.childNodes[ndx];
var _fb=_1.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_f9){
_3.className.add(_fa,"jsTabClosable");
_3.className.remove(_fb,"jsTabCloseHidden");
}else{
_3.className.remove(_fa,"jsTabClosable");
_3.className.add(_fb,"jsTabCloseHidden");
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
var _fc=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_fc){
if(this._tabsContextMenu.items.length>_fc){
while(this._tabsContextMenu.items.length>_fc){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_fc-this._tabsContextMenu.items.length;n++){
var _fd=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_fd].title,onclick:_3.bindAsEventListener(function(e,_fe,_ff){
this.selectTab(_fe);
},this,_fd,this._tabList._extraTabs)},0);
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
var _ec=function(opts){
var _100={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_100,opts);
var cmp=_95.get(_100);
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
var _101=_1.createElement("span");
_101.id=this.divId+"_more";
_101.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_101);
_101.innerHTML=" ";
_3.className.add(this.cmpTarget,"jsTabListInner");
_3.event.attach(_101,"onclick",_3.bindAsEventListener(this.onDropdownClick,this));
};
_ec.prototype.onDropdownClick=function(e){
if(!e){
e=window.event;
}
this.parent._tabsContextMenu.show(e);
_3.event.cancel(e,true);
return false;
};
_ec.prototype.showMore=function(){
if(!this._showingMore){
_3.className.remove(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_ec.prototype.hideMore=function(){
if(this._showingMore){
_3.className.add(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _ed=function(opts){
var _102={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_102,opts);
var cmp=_95.get(_102);
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
_ed.prototype.addPage=function(pane){
_3.className.add(pane.target,"jsTabPage");
this.addChild(pane);
};
_ed.prototype.removePage=function(pane,_103){
this.removeChild(pane);
if(_103){
pane.destroy();
}
};
_ed.prototype.activate=function(_104){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_104){
this.components[n].show();
}
}
};
var _f2=function(opts){
var _105={title:"",paneId:null,pane:null,closable:false};
_3.mixin(_105,opts);
this.title=_105.title;
this.paneId=_105.paneId;
this.pane=_105.pane;
this.closable=_105.closable;
};
var _106=20;
var _107=function(opts){
var _108={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_3.mixin(_108,opts);
if(!_108.Name){
_3.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_108.Name;
this.Type=(typeof (_109[_108.Type])!="undefined")?_108.Type:"alpha";
this.show=_108.show;
this.percentWidth=null;
if(!isNaN(Number(_108.Width))){
this.Width=Number(_108.Width);
}else{
if(typeof (_108.Width)=="string"){
if(_108.Width.length>2&&_108.Width.substr(_108.Width.length-2)=="px"&&!isNaN(parseInt(_108.Width))){
this.Width=parseInt(_108.Width);
}else{
if(_108.Width.length>1&&_108.Width.substr(_108.Width.length-1)=="%"&&!isNaN(parseInt(_108.Width))){
this.Width=_106;
this.percentWidth=parseInt(_108.Width);
}
}
}
}
this.origWidth=this.Width;
this.Format=_108.Format;
this.displayName=_108.displayName?_108.displayName:_108.Name;
this.sqlName=_108.sqlName?_108.sqlName:_108.Name;
this.showToolTip=_108.showToolTip;
this.Compare=_108.Compare;
};
var _10a=function(_10b,_10c){
_10c=_10c?_10c:{};
for(var n=0;n<_10b.length;n++){
var name=_10b[n].Name;
var type=_10b[n].Type;
this[name]=_10c[name]?_109[type](_10c[name]):_109[type]();
}
for(var prop in _10c){
if(this[prop]===_2){
this[prop]=_10c[prop];
}
}
};
var _109={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _10d=str.split(" ");
if(_10d[0]=="0000-00-00"){
return "";
}else{
var _10e=_10d[0].split("-");
ret=new Date(_10e[0],_10e[1]-1,_10e[2]);
if(_10d[1]){
var _10f=_10d[1].split(":");
ret=new Date(_10e[0],_10e[1]-1,_10e[2],_10f[0],_10f[1],_10f[2]);
}
}
}
return ret;
}};
_3.DataView=function(opts){
var _110={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_3.mixin(_110,opts);
var cmp=_95.get(_110);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_110.multiselect;
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
this.paginating=_110.paginating;
this.rowsPerPage=_110.rowsPerPage;
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
var _111=this.__getInnerBox();
var _112=this.__getOuterBox();
var _113=_111.top+_111.bottom+_112.top+_112.bottom;
if(this._cached.pagination_header){
var _112=_3.element.getOuterBox(this._cached.pagination_header);
_113+=this._cached.pagination_header.offsetHeight+_112.top+_112.bottom;
}
if(this._cached.header){
var _112=_3.element.getOuterBox(this._cached.header);
_113+=this._cached.header.offsetHeight+_112.top+_112.bottom;
}
if(this._cached.footer){
var _112=_3.element.getOuterBox(this._cached.footer);
_113+=this._cached.footer.offsetHeight+_112.top+_112.bottom;
}
var _114=this.height!==null?this.height-_113:0;
if(_114<0){
_114=0;
}
this._cached.outer_body.style.height=_114+"px";
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
for(var n=0;n<_110.columns.length;n++){
this.addColumn(this.createColumn(_110.columns[n]));
}
};
_3.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _115="";
var _116=_3.getInactiveLocation();
if(this.paginating){
_115+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_115+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_115+="</label></li><li>";
_115+="<a href=\""+_116+"\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_115+="<a href=\""+_116+"\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_115+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_115+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_115+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_115+="</li></ul></div>";
}
_115+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_115+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_115+="<li class=\"dataViewCheckBoxHeader\">";
_115+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_115+="<li class=\"dataViewSep\"></li>";
}
_115+="</ul>";
_115+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_115+="<a href=\""+_116+"\"> </a></span></div>";
_115+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_115+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_115+="</div>";
_115+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_115;
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
var _117=0;
var _118=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_118){
n+=this.rowsPerPage;
_117++;
}
return _117;
};
_3.DataView.prototype.getNextRowId=function(){
var _119=true;
while(_119){
_119=false;
var _11a=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_11a){
_119=true;
break;
}
}
}
return _11a;
};
_3.DataView.prototype.createColumn=function(opts){
return new _107(opts);
};
_3.DataView.prototype.addColumn=function(_11b,ndx){
if(this.__findColumn(_11b.Name)==-1){
if(ndx===_2){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_11b);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_11b.Name]=_109[_11b.Type]();
}
}
if(!this.orderBy&&_11b.show){
this.orderBy=_11b.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_3.DataView.prototype.__findColumn=function(_11c){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_11c){
return n;
}
}
return -1;
};
_3.DataView.prototype.deleteColumn=function(_11d){
var _11e="";
var ndx=null;
if(typeof (_11d)=="string"){
var _11f=this.__findColumn(_11d);
if(_11f!=-1){
_11e=this.columns[_11f].Name;
ndx=_11f;
this.columns.splice(_11f,1);
}
}
if(typeof (_11d)=="number"){
if(_11d>0&&_11d<this.columns.length){
_11e=this.columns[_11d].Name;
ndx=_11d;
this.columns.splice(_11d,1);
}
}
if(typeof (_11d)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_11d){
_11e=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_11e){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_11e]=null;
delete this.rows[n][_11e];
}
}
if(this.orderBy==_11e){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_3.DataView.prototype._addColumnToUI=function(_120,ndx){
var li=_1.createElement("li");
li.style.width=_120.Width+"px";
var _121="dataViewColumn";
if(!_120.show){
_121+=" dataViewColumnHidden";
}
li.className=_121;
var a=_1.createElement("a");
if(this.orderBy==_120.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href",_3.getInactiveLocation());
a.innerHTML=_120.displayName;
li.appendChild(a);
li2=_1.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_121="dataViewFieldSep";
if(_120.percentWidth!==null){
_121+=" dataViewFieldSepNoResize";
}
if(!_120.show){
_121+=" dataViewColumnHidden";
}
li2.className=_121;
var _122=this._cached.headerUl.getElementsByTagName("li");
if(!_122.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _123=this.multiselect?2:0;
if(ndx>=0&&(_123+(ndx*2))<_122.length){
this._cached.headerUl.insertBefore(li,_122[_123+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_122[_123+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_120.displayName,onclick:_3.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_120.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_120.Name,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._removeColumnFromUI=function(ndx){
var _124=this.multiselect?2:0;
var _125=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_124+(ndx*2))<_125.length){
this._cached.headerUl.removeChild(_125[_124+(ndx*2)]);
this._cached.headerUl.removeChild(_125[_124+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._addRowToUI=function(_126){
if(_126<0||_126>this.rows.length-1){
return;
}
var _127=this.rows[_126].id;
var _128=_1.createElement("ul");
_128.id=this.divId+"_row_"+_127;
var _129=false;
if(!this.multiselect){
if(this.selectedRow==n){
_129=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_129=true;
break;
}
}
}
if(_129){
_128.className="dataViewRowSelected";
}
if(_126%2){
_3.className.add(_128,"dataViewRowOdd");
}
if(this.multiselect){
var _12a=_1.createElement("li");
var _12b="dataViewMultiselectCell";
_12a.className=_12b;
var _12c="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_127+"\" class=\"dataViewCheckBox\" ";
if(_129){
_12c+="checked=\"checked\" ";
}
_12c+="/></li>";
_12a.innerHTML=_12c;
_128.appendChild(_12a);
}
var _12d=this._cached.rows_body.getElementsByTagName("ul");
if(_12d.length==0){
this._cached.rows_body.appendChild(_128);
}else{
if(_126==this.rows.length-1){
this._cached.rows_body.appendChild(_128);
}else{
var _12e=null;
for(var n=_126+1;n<this.rows.length;n++){
_12e=_1.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_12e){
break;
}
}
if(_12e){
this._cached.rows_body.insertBefore(_128,_12e);
}else{
this._cached.rows_body.appendChild(_128);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_127,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_3.DataView.prototype._removeRowFromUI=function(_12f){
if(_12f<0||_12f>this.rows.length-1){
return;
}
var _130=this.rows[_12f].id;
var _131=_1.getElementById(this.divId+"_row_"+_130);
if(_131){
this._cached.rows_body.removeChild(_131);
}
this.__refreshFooter();
};
_3.DataView.prototype._refreshRowInUI=function(_132){
var row=this.getById(_132);
if(row){
var _133=_1.getElementById(this.divId+"_row_"+_132);
if(_133){
for(var a=0;a<this.columns.length;a++){
this.setCellValue(_132,this.columns[a].Name,row[this.columns[a].Name]);
}
}
}
};
_3.DataView.prototype._addCellToUI=function(_134,_135,ndx){
var _136=_1.getElementById(this.divId+"_row_"+_134);
if(_136){
var _137=_136.getElementsByTagName("li");
var li=_1.createElement("li");
li.id=this.divId+"_cell_"+_134+"_"+ndx;
var _138="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_138+=" dataViewCellHidden";
}
if(ndx==0){
_138+=" dataViewFirstCell";
}
li.className=_138;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_134)[_135]);
}
if(ndx>=0&&ndx<_137.length-1){
_136.insertBefore(li,_137[ndx]);
}else{
_136.appendChild(li);
}
this.setCellValue(_134,_135,this.getById(_134)[_135]);
}
};
_3.DataView.prototype._removeCellFromUI=function(_139,ndx){
var _13a=this.multiselect?1:0;
var _13b=_1.getElementById(this.divId+"_row_"+_139);
if(_13b){
var _13c=_13b.getElementsByTagName("li");
if(ndx>=0&&(_13a+ndx)<_13c.length){
_13b.removeChild(_13c[_13a+ndx]);
}
}
};
_3.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _10a(this.columns,data);
};
_3.DataView.prototype.addRow=function(_13d,ndx,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(!_13d){
_13d=this.createRow();
}else{
if(!_13d.id){
_13d.id=this.getNextRowId();
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
this.rows.splice(ndx,0,_13d);
}else{
this.rows.push(_13d);
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
_3.DataView.prototype.deleteRow=function(_13e,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
var _13f=-1;
if(typeof (_13e)=="number"){
_13f=_13e;
this.rows.splice(_13e,1);
}
if(typeof (_13e)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_13e){
_13f=n;
this.rows.splice(n,1);
}
}
}
if(_13f!=-1&&ui){
this._removeRowFromUI(_13f);
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_13f){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_13f){
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
_3.DataView.prototype.searchRows=function(_140,_141){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_140]==_141){
ret.push(this.rows[n]);
}
}
return ret;
};
_3.DataView.prototype.setCellValue=function(_142,_143,_144){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return false;
}
var _145=this.__findColumn(_143);
if(_145==-1){
return false;
}
var _146=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_142){
_146=n;
break;
}
}
if(_146===null){
return false;
}
this.rows[_146][_143]=_144;
var cell=_1.getElementById(this.divId+"_cell_"+_142+"_"+_145);
if(typeof (this.columns[_145].Format)=="function"){
var _147=this.columns[_145].Format(_144);
cell.innerHTML="";
if(typeof (_147)=="string"){
cell.innerHTML=_147;
}else{
cell.appendChild(_147);
}
}else{
cell.innerHTML=_144;
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
var _148;
if(!_1.getElementById(this.divId+"_message")){
_148=_1.createElement("div");
_148.id=this.divId+"_message";
_148.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_148);
}else{
_148=_1.getElementById(this.divId+"_message");
}
_148.innerHTML=msg;
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
_3.DataView.prototype._UISelectAll=function(_149){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_3.className[(_149?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_149;
}
};
_3.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _14a=false;
if(!this.multiselect){
if(this.selectedRow==n){
_14a=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_14a=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_14a;
}
_3.className[(_14a?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_3.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_1.getElementById(this.divId+"_pageInput").value;
var _14b=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_14b){
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
var _14c=this.getTotalPages();
if(this.curPage<_14c-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.updateRows=function(_14d){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(_14d===_2){
_14d=false;
}
var _14e=null;
if(this.selectedRow!=-1&&this.rows[this.selectedRow]){
_14e=this.rows[this.selectedRow].id;
}
var _14f=[];
if(this.selectedRows.length){
for(var n=0;n<this.selectedRows.length;n++){
if(this.rows[this.selectedRows[n]]){
_14f.push(this.rows[this.selectedRows[n]].id);
}
}
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_14d){
this._cached.rows_body.innerHTML="";
}
var _150=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_150.length;n++){
var _151=_150[n].id.substr(_150[n].id.lastIndexOf("_")+1);
if(!this.getById(_151)){
this._cached.rows_body.removeChild(_150[n]);
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
if(!_14d){
this.selectedRow=-1;
if(_14e){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14e){
this.selectedRow=n;
break;
}
}
}
this.selectedRows=[];
if(_14f.length){
for(var a=0;a<_14f.length;a++){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14f[a]){
this.selectedRows.push(n);
break;
}
}
}
}
}
this._UIUpdateSelection();
if(_14d){
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
var _152="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_152+=this.lang.noRows;
}else{
if(this.rows.length==1){
_152+="1 "+" "+this.lang.row;
}else{
_152+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_1.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_152+=this.lang.noRows;
}else{
var _153=(this.rowsPerPage*this.curPage);
var _154=(_153+this.rowsPerPage)>this.totalRows?this.totalRows:(_153+this.rowsPerPage);
_152+=(_153+1)+" - "+_154+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_152+="</li></ul>";
this._cached.footer.innerHTML=_152;
};
_3.DataView.prototype.__setOrder=function(_155){
if(!this.inDOM){
_3.error.report("Cant sort a DataView not in DOM");
return;
}
var _156=this.columns[_155].Name;
if(_155>=0&&_155<this.columns.length){
var _157=this.multiselect?2:0;
var _158=this._cached.headerUl.getElementsByTagName("li");
var _159=this.__findColumn(this.orderBy);
_3.className.remove(_158[_157+(_159*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_156){
this.orderBy=_156;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_3.className.add(_158[_157+(_155*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _15a=e.target||e.srcElement;
var _15b=this.divId+"_selectRow_";
if(_15a.nodeName.toLowerCase()=="input"&&_15a.id.substr(0,_15b.length)==_15b){
var _15c=_15a.id.substr(_15a.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_15c){
this.__markRow(e,n);
break;
}
}
}else{
while(_15a.nodeName.toLowerCase()!="ul"){
if(_15a==this._cached.rows_body){
return;
}
_15a=_15a.parentNode;
}
var _15c=_15a.id.substr(_15a.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_15c){
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
var _15d=e.target||e.srcElement;
if(_15d.nodeName.toLowerCase()=="a"){
colNdx=Number(_15d.id.substr(_15d.id.lastIndexOf("_")+1));
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
var _15e=e.target||e.srcElement;
if(_15e.nodeName.toLowerCase()=="li"&&_15e.className=="dataViewFieldSep"){
var _15f=Number(_15e.id.substr(_15e.id.lastIndexOf("_")+1));
if(!isNaN(_15f)){
this.activateResizing(e,_15f);
}
}
};
_3.DataView.prototype.__selectRow=function(e,_160){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_160){
e.unselecting=_160;
}else{
if(this.multiselect){
var _161=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_160){
_161=true;
break;
}
}
if(_161){
e.unselecting=_160;
}else{
e.selecting=_160;
}
}else{
e.selecting=_160;
}
}
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_160!=-1){
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
if(this.selectedRow==_160&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_160;
_3.className.add(rows[_160],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_160){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_160;
this.selectedRows=[_160];
}
}else{
if(e.ctrlKey){
var _161=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_160){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_161=true;
}
}
if(!_161){
this.selectedRow=_160;
this.selectedRows.push(_160);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_160){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_160;
for(var n=this.selectedRows[0];(_160>this.selectedRows[0]?n<=_160:n>=_160);(_160>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_160);
this.selectedRow=_160;
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
_3.DataView.prototype.__markRow=function(e,_162){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_162;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var _163=this.rows[_162].id;
elem=_1.getElementById(this.divId+"_selectRow_"+_163);
if(elem.checked){
this.selectedRows.push(_162);
this.selectedRow=_162;
var row=_1.getElementById(this.divId+"_row_"+_163);
_3.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_162){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_1.getElementById(this.divId+"_row_"+_163);
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
_3.DataView.prototype.toggleColumn=function(_164){
if(this.columns[_164].show){
this.columns[_164].show=false;
}else{
this.columns[_164].show=true;
}
var _165=this.multiselect?2:0;
var _166=this._cached.headerUl.getElementsByTagName("li");
if(_164>=0&&((_165+(_164*2)+1)<_166.length)){
_3.className[this.columns[_164].show?"remove":"add"](_166[_165+(_164*2)],"dataViewColumnHidden");
_3.className[this.columns[_164].show?"remove":"add"](_166[_165+(_164*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_165=this.multiselect?1:0;
_3.className[this.columns[_164].show?"remove":"add"](rows[n].childNodes[_165+_164],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_164+2,this.columns[_164].show);
this._adjustColumnsWidth();
};
_3.DataView.prototype._adjustColumnsWidth=function(_167){
if(this.columns.length&&this._cached){
if(_167===_2){
_167=false;
}
var _168=false;
var _169=this._getHeadersWidth();
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Width!=this.columns[n].origWidth){
_168=true;
this.columns[n].Width=this.columns[n].origWidth;
}
}
var _16a=0;
var base=this.multiselect?2:0;
var lis=this._cached.headerUl.getElementsByTagName("li");
if(lis.length==(this.columns.length*2)+base&&_169>0){
var _16b=0;
var _16c=false;
var _16d=null;
var _16e=0;
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
if(!_16c){
_16d=_3.element.getInnerBox(lis[base+(n*2)]);
_16e=_16d.left+_16d.right+lis[base+(n*2)+1].offsetWidth;
_16c=true;
break;
}
}
}
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_16b++;
if(this.columns[n].percentWidth!==null){
_16a+=_106+_16e;
}else{
_16a+=this.columns[n].Width+_16e;
}
}
}
if(_16b&&_169>=((_106+_16e)*_16b)){
while(_16a>_169){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show&&this.columns[n].percentWidth===null&&this.columns[n].Width>_106){
_168=true;
this.columns[n].Width--;
_16a--;
}
if(_16a==_169){
break;
}
}
}
}else{
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_168=true;
this.columns[n].Width=_106;
}
}
}
var _16f=_169-_16a;
if(_16f){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].percentWidth!==null){
this.columns[n].Width+=_16f*(this.columns[n].percentWidth/100);
}
}
}
if(_168||_167){
for(var n=0;n<this.columns.length;n++){
lis[base+(n*2)].style.width=this.columns[n].Width+"px";
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
var _170=this.multiselect?1:0;
for(var a=0;a<rows.length;a++){
var rLis=rows[a].getElementsByTagName("li");
for(var n=0;n<this.columns.length;n++){
rLis[_170+n].style.width=this.columns[n].Width+"px";
}
}
}
}
}
};
_3.DataView.prototype._getHeadersWidth=function(){
var _171=_1.getElementById(this.divId+"_optionsMenuBtn");
var _172=_3.element.getOuterBox(_171);
var _173=_3.element.getInnerBox(this._cached.headerUl);
var _174=0;
if(this.multiselect){
var lis=this._cached.headerUl.getElementsByTagName("li");
_174=lis[0].offsetWidth+lis[1].offsetWidth;
}
return this._cached.headerUl.offsetWidth-_173.left-_174-(_171.offsetWidth+_172.left+_172.right);
};
_3.DataView.prototype.__calculateTotalWidth=function(){
var _175=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_175+=cols[n].offsetWidth;
}
return _175;
};
_3.DataView.prototype.__sort=function(_176){
var n,_177,swap;
if(!this.orderBy){
return;
}
for(n=_176+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_176][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_176][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_176][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_176][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_177=this.rows[_176];
this.rows[_176]=this.rows[n];
this.rows[n]=_177;
if(this.selectedRow==_176){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_176;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_176){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_176;
}
}
}
}
}
if(_176<this.rows.length-2){
this.__sort(_176+1);
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
_3.DataView.prototype.__getColumnSqlName=function(_178){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_178){
return this.columns[n].sqlName;
}
}
return false;
};
_3.DataView.prototype.activateResizing=function(e,_179){
if(!e){
e=window.event;
}
if(this.columns[_179].percentWidth===null){
this.resColumnId=_179;
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
this.resizingFrom=this.columns[_179].Width;
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
var _17a=Math.abs(this.resizingXCache-x);
var _17b=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _17c=this.resColumnId;
var _17d=false;
if(!_17b){
if((this.columns[_17c].Width-_17a)>_106){
this.columns[_17c].Width-=_17a;
this.columns[_17c].origWidth=this.columns[_17c].Width;
_17d=true;
}
}else{
this.columns[_17c].Width+=_17a;
this.columns[_17c].origWidth=this.columns[_17c].Width;
_17d=true;
}
if(_17d){
this._adjustColumnsWidth(true);
}
};
_3.DataView.prototype.addDataType=function(name,_17e){
if(typeof (name)!="string"){
_3.error.report("Invalid data type name.");
return;
}
if(typeof (_17e)!="object"){
_3.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_17e.toString)!="function"){
_3.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_109[name]){
_109[name]=_17e;
}else{
_3.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.DataViewConnector=function(opts){
var _17f={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_17f,opts);
if(!_17f.dataView){
_3.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_17f.api)!="string"||_17f.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_17f.api;
this.dataView=_17f.dataView;
this.parameters=_17f.parameters;
this.type="json";
if(_17f.type){
switch(_17f.type.toLowerCase()){
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
if(typeof (_17f.method)=="string"){
this.method=_17f.method.toUpperCase()=="POST"?"POST":"GET";
}
_3.event.attach(this.dataView,"onrefresh",_3.bind(this._onRefresh,this));
this.httpRequest=new _3.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_3.bind(this._onError,this),onLoad:_3.bind(this._onLoad,this)});
};
_3.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _180="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_180+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_180+="&"+this.parameters;
}
this.httpRequest.send(_180);
_3.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
if(root.getAttribute("success")=="1"){
var _181=Number(root.getAttribute("totalrows"));
if(!isNaN(_181)){
this.dataView.totalRows=_181;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _182={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _183=cols[a].getAttribute("name");
if(_183&&cols[a].firstChild){
var _184=this.dataView.__findColumn(_183)!=-1?this.dataView.columns[this.dataView.__findColumn(_183)].Type:"alpha";
_182[_183]=_109[_184](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_182),_2,false);
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
this.dataView.updateRows();
}else{
this.dataView.rows.length=0;
if(data.success){
var _181=Number(data.totalrows);
if(!isNaN(_181)){
this.dataView.totalRows=_181;
}
for(var n=0;n<data.rows.length;n++){
var _182={};
for(var _183 in data.rows[n]){
var _184=this.dataView.__findColumn(_183)!=-1?this.dataView.columns[this.dataView.__findColumn(_183)].Type:"alpha";
_182[_183]=_109[_184](data.rows[n][_183]);
}
this.dataView.addRow(this.dataView.createRow(_182),_2,false);
}
}else{
this.dataView.setMessage(data.errormessage);
}
this.dataView.updateRows();
}
},_onError:function(_185){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_185+")");
}};
_3.DataView.prototype.lang={"noRows":"No hay filas para mostrar.","rows":"filas.","row":"fila.","pageStart":"Página ","pageMiddle":" de ","pageEnd":" Ir a página: ","pageGo":"Ir","pagePrev":"<< Anterior","pageNext":"Siguiente >>","refresh":"Actualizar","of":"de"};
var _186=function(opts){
var _187={id:null,parentId:0,parent:null,Name:""};
_3.mixin(_187,opts);
this.treeView=_187.treeView;
this.id=_187.id!==null?_187.id:this.treeView.getNextNodeId();
this.parentId=_187.parentId;
this.Name=String(_187.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_187.parent;
};
_186.prototype={searchNode:function(id){
var n;
var srch=null;
var _188=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_188<this.childNodes.length){
srch=this.childNodes[_188].searchNode(id);
_188++;
}
return srch;
},updateChildrenNodes:function(){
var _189=_1.getElementById(this.treeView.divId+"_"+this.id+"_branch");
var _18a=_3.getInactiveLocation();
for(var i=0;i<this.childNodes.length;i++){
var node=_1.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_189.appendChild(node);
var _18b="";
var _18c=this.childNodes[i].childNodes.length;
if(_18c){
_18b+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\""+_18a+"\" class=\"";
_18b+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_18b+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_18c){
_18b+="class=\"treeViewSingleNode\" ";
}
_18b+="href=\""+_18a+"\">"+this.childNodes[i].Name+"</a>";
if(_18c){
_18b+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_18b;
if(_18c){
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_3.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_3.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_18c){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_3.TreeView=function(opts){
var _18d={canHaveChildren:false,hasInvalidator:true};
_3.mixin(_18d,opts);
var cmp=_95.get(_18d);
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
this.masterNode=new _186({id:0,parentId:0,parent:null,Name:"root",treeView:this});
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
var _18e=true;
while(_18e){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_18e=false;
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
var _18f;
if(!_1.getElementById(this.divId+"_message")){
_18f=_1.createElement("div");
_18f.id=this.divId+"_message";
_18f.className="treeViewMessageDiv";
this.target.appendChild(_18f);
}else{
_18f=_1.getElementById(this.divId+"_message");
}
_18f.innerHTML=msg;
}
};
_3.TreeView.prototype._expandNode=function(e,_190){
if(!e){
e=window.event;
}
var node=this.searchNode(_190);
if(node.expanded){
node.expanded=false;
_1.getElementById(this.divId+"_"+_190+"_expandable").className="treeViewExpandableNode";
_1.getElementById(this.divId+"_"+_190+"_branch").style.display="none";
}else{
node.expanded=true;
_1.getElementById(this.divId+"_"+_190+"_expandable").className="treeViewCollapsableNode";
_1.getElementById(this.divId+"_"+_190+"_branch").style.display="block";
}
_3.event.cancel(e);
return false;
};
_3.TreeView.prototype._selectNode=function(e,_191){
if(!e){
e=window.event;
}
if(this.selectedNode!==null){
var _192=this.searchNode(this.selectedNode);
_3.className.remove(_1.getElementById(this.divId+"_"+_192.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_191){
var _192=this.searchNode(_191);
_3.className.add(_1.getElementById(this.divId+"_"+_192.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_191)?null:_191;
_3.event.cancel(e,true);
return false;
};
_3.TreeView.prototype.addNode=function(opts,_193,ndx){
var _194=(_193==0)?this.masterNode:this.searchNode(_193);
if(_194){
var _195={treeView:this,parentId:_193,parent:_194,Name:""};
_3.mixin(_195,opts);
if(ndx>=0&&ndx<_194.childNodes.length){
_194.childNodes.splice(ndx,0,new _186(_195));
}else{
_194.childNodes.push(new _186(_195));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_3.TreeView.prototype.deleteNode=function(_196){
if(_196==0||_196=="0"){
return;
}
this._searchAndDelete(_196,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_3.TreeView.prototype._searchAndDelete=function(_197,node){
var _198=false;
if(typeof (_197)=="number"||typeof (_197)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_197){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_198=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_197){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_198=true;
break;
}
}
}
if(!_198){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_197);
if(done){
_198=done;
break;
}
}
}
return _198;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.TreeViewConnector=function(opts){
var _199={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_199,opts);
if(!_199.treeView){
_3.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_199.api)!="string"||_199.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_199.api;
this.treeView=_199.treeView;
this.parameters=_199.parameters;
this.type="json";
if(_199.type){
switch(_199.type.toLowerCase()){
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
if(typeof (_199.method)=="string"){
this.method=_199.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _186({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _19a=this._fetchNodes(root);
if(_19a.length){
this._addNodesFromXml(_19a,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _186({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_19b,_19c){
for(var n=0;n<_19b.length;n++){
var id=null;
if(_19b[n].getAttribute("id")){
id=_19b[n].getAttribute("id");
}
var _19d=_19b[n].getElementsByTagName("label")[0];
if(_19d){
labelStr=_19d.firstChild.data;
}
var _19e=_19b[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_19c);
if(_19e){
this._addNodesFromXml(this._fetchNodes(_19b[n]),id);
}
}
},_addNodesFromJson:function(_19f,_1a0){
for(var n=0;n<_19f.length;n++){
this.treeView.addNode({Name:_19f[n].label,id:_19f[n].id},_1a0);
if(_19f[n].nodes){
this._addNodesFromJson(_19f[n].nodes,_19f[n].id);
}
}
},_onError:function(_1a1){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_1a1+")");
}};
_3.CalendarView=function(opts){
var _1a2=new Date();
var _1a3={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_1a2.getMonth(),year:_1a2.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_3.mixin(_1a3,opts);
var cmp=_95.get(_1a3);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_1a3.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_1a3.month))&&_1a3.month>=0&&_1a3.month<12)?_1a3.month:_1a2.getMonth();
this.curYear=(!isNaN(Number(_1a3.year))&&_1a3.year>0)?_1a3.year:new _1a2.getFullYear();
this.disabledBefore=_1a3.disabledBefore;
this.disabledAfter=_1a3.disabledAfter;
this.disabledDays=_1a3.disabledDays;
this.disabledDates=_1a3.disabledDates;
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
var _1a4="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_1a4+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_1a4+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _1a5=new Date();
if(this.selectedDates.length){
_1a5=this.selectedDates[0];
}
_1a4+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_1a4+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_1a5.getDate()+"\" /></p>";
_1a4+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_1a4+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_1a4+="<option value=\""+n+"\""+(_1a5.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_1a4+="</select></p>";
_1a4+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_1a4+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_1a5.getFullYear()+"\" /></p>";
_1a4+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_1a4+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_1a4+="</div>";
_1a4+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_1a4;
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
var _1a6=_1.getElementById(this.divId+"_body");
_1a6.style.display="";
_1.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
while(_1a6.firstChild){
_1a6.removeChild(_1a6.firstChild);
}
var _1a7=_1.createElement("thead");
var _1a8,_1a9,_1aa,tmpA;
var _1a8=_1.createElement("tr");
for(var n=0;n<7;n++){
_1a9=_1.createElement("th");
_1a9.appendChild(_1.createTextNode(this.lang.shortDays[n]));
_1a8.appendChild(_1a9);
}
_1a7.appendChild(_1a8);
_1a6.appendChild(_1a7);
var _1ab=new Date();
var _1ac=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _1ad=new Date(_1ac.getTime());
_1ad.setMonth(_1ad.getMonth()+1);
var _1ae=_1ac.getDay();
var _1af=0;
var _1b0=_1.createElement("tbody");
var _1a8=_1.createElement("tr");
while(_1af<_1ae){
_1aa=_1.createElement("td");
_1aa.appendChild(_1.createTextNode(" "));
_1a8.appendChild(_1aa);
_1af++;
}
while(_1ac<_1ad){
_1aa=_1.createElement("td");
_1aa.setAttribute("align","left");
_1aa.setAttribute("valign","top");
tmpA=_1.createElement("a");
tmpA.setAttribute("href",_3.getInactiveLocation());
tmpA.appendChild(_1.createTextNode(_1ac.getDate()));
var _1b1=false;
if(this.isEqual(_1ac,_1ab)){
_1b1=true;
}
var _1b2=false;
if(this.isDisabledDate(_1ac)){
_1b2=true;
if(_1b1){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_1ac,this.markedDates[n])){
_1b2=true;
if(_1b1){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_1ac,this.selectedDates[n])){
_1b2=true;
if(_1b1){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_1b2&&_1b1){
tmpA.className="calendarToday";
}
_1aa.appendChild(tmpA);
_1a8.appendChild(_1aa);
_3.event.attach(tmpA,"onclick",_3.bind(this.selectDate,this,_1ac.getDate()));
_1ac.setDate(_1ac.getDate()+1);
_1af++;
if(_1af>6){
_1b0.appendChild(_1a8);
_1a8=_1.createElement("tr");
_1af=0;
}
}
if(_1af>0){
_1b0.appendChild(_1a8);
while(_1af<7){
_1aa=_1.createElement("td");
_1aa.appendChild(_1.createTextNode(" "));
_1a8.appendChild(_1aa);
_1af++;
}
}
_1a6.appendChild(_1b0);
this.__refreshHeader();
this.__refreshFooter();
};
_3.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1b3=_1.getElementById(this.divId+"_header");
_1b3.innerHTML="";
var _1b4=_3.getInactiveLocation();
var _1b5="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\""+_1b4+"\"> </a></li>";
_1b5+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\""+_1b4+"\"> </a></li>";
_1b5+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\""+_1b4+"\"> </a></li>";
_1b5+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1b5+="</ul>";
_1b3.innerHTML=_1b5;
_3.event.attach(_1.getElementById(this.divId+"_prevMonth"),"onclick",_3.bind(this.goPrevMonth,this));
_3.event.attach(_1.getElementById(this.divId+"_viewAdvanced"),"onclick",_3.bind(this.setAdvanced,this));
_3.event.attach(_1.getElementById(this.divId+"_nextMonth"),"onclick",_3.bind(this.goNextMonth,this));
};
_3.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1b6=_1.getElementById(this.divId+"_footer");
_1b6.innerHTML="";
var _1b7="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_1b7+=text;
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
_1b7+=text;
}
}else{
_1b7+=this.lang.noSelection+"</p>";
}
_1b6.innerHTML=_1b7;
_3.event.attach(_1.getElementById(this.divId+"_goHome"),"onclick",_3.bind(this.goHomeDate,this));
};
_3.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=window.event;
}
_1.getElementById(this.divId+"_body").style.display="none";
_1.getElementById(this.divId+"_advanced").style.display="block";
var _1b8=new Date();
if(this.selectedDates.length){
_1b8=this.selectedDates[0];
}
_1.getElementById(this.divId+"DaySelector").value=_1b8.getDate();
_1.getElementById(this.divId+"MonthSelector").selectedIndex=_1b8.getMonth();
_1.getElementById(this.divId+"YearSelector").value=_1b8.getFullYear();
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
var _1b9=_1.getElementById(this.divId+"DaySelector").value;
var _1ba=_1.getElementById(this.divId+"MonthSelector").value;
var _1bb=_1.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1b9))){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1bb))){
alert(this.lang.error2);
_3.event.cancel(e,true);
return false;
}
var _1bc=new Date(_1bb,_1ba,_1b9);
if(_1bc.getMonth()!=_1ba){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1bc)){
alert(this.lang.error3);
_3.event.cancel(e,true);
return false;
}
var _1bd={selecting:_1bc,selectedDates:this.selectedDates};
_1bd=_3.event.fire(this,"onselect",_1bd);
if(_1bd.returnValue==false){
_3.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1bc;
this.goHomeDate(e);
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=window.event;
}
var _1be=new Date(this.curYear,this.curMonth,date);
var _1bf={selecting:_1be,selectedDates:this.selectedDates};
_1bf=_3.event.fire(this,"onselect",_1bf);
if(_1bf.returnValue==false){
_3.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1be)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1be;
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
_3.CalendarView.prototype.isEqual=function(_1c0,_1c1){
if(_1c0.getFullYear()==_1c1.getFullYear()&&_1c0.getMonth()==_1c1.getMonth()&&_1c0.getDate()==_1c1.getDate()){
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
var _1c2;
if(this.selectedDates.length){
_1c2=this.selectedDates[0];
}else{
_1c2=new Date();
}
this.curMonth=_1c2.getMonth();
this.curYear=_1c2.getFullYear();
this.updateDates();
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.hook=function(_1c3){
var elem=null;
if(typeof (_1c3)=="string"){
elem=_1.getElementById(_1c3);
}else{
if(_3.isHTMLElement(_1c3)){
elem=_1c3;
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
var _1c4=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1c4.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1c4.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_3.event.detach(_1,"onclick",this._hideHookedBind);
}
};
_3.CalendarView.prototype.getDateFromStr=function(str){
var _1c5=str.split("/");
var ret;
if(!isNaN(Number(_1c5[0]))&&!isNaN(Number(_1c5[1]))&&!isNaN(Number(_1c5[2]))){
if(this.lang.isFrenchDateFormat){
if(_1c5[1]>0&&_1c5[1]<13&&_1c5[0]>0&&_1c5[0]<32&&_1c5[2]>0){
ret=new Date(_1c5[2],_1c5[1]-1,_1c5[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1c5[0]>0&&_1c5[0]<13&&_1c5[1]>0&&_1c5[1]<32&&_1c5[2]>0){
ret=new Date(_1c5[2],_1c5[1]-1,_1c5[0],0,0,0);
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
var _1c6=function(_1c7,path,name){
this.thumbnail=_1c7;
this.path=path;
this.name=name;
};
_3.GalleryView=function(opts){
var _1c8={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_3.mixin(_1c8,opts);
var cmp=_95.get(_1c8);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1c8.showNames;
this.fixedThumbSize=_1c8.fixedThumbSize;
this.thumbWidth=_1c8.thumbWidth;
this.thumbHeight=_1c8.thumbHeight;
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
var _1c9={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_3.mixin(_1c9,opts);
if(!_1c9.thumbnail){
_3.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1c9.insertIndex==this.images.length){
this.images.push(new _1c6(_1c9.thumbnail,_1c9.path,_1c9.name));
}else{
this.images.splice(_1c9.insertIndex,0,new _1c6(_1c9.thumbnail,_1c9.path,_1c9.name));
}
if(this.inDOM){
this.updateImages();
}
};
_3.GalleryView.prototype.deleteImage=function(_1ca){
if(typeof (_1ca)=="number"){
this.images.splice(_1ca,1);
}else{
if(typeof (_1ca)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1ca){
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
var _1cb;
if(!_1.getElementById(this.divId+"_message")){
_1cb=_1.createElement("p");
_1cb.id=this.divId+"_message";
this.target.appendChild(_1cb);
}else{
_1cb=_1.getElementById(this.divId+"_message");
}
_1cb.innerHTML=msg;
}
};
_3.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_3.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1cc="";
for(var n=0;n<this.images.length;n++){
_1cc+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1cc+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1cc+="class=\"gvSelectedImage\" ";
}
_1cc+=">";
_1cc+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1cc+="<p>"+this.images[n].name+"</p>";
}
_1cc+="</div>";
}
this.cmpTarget.innerHTML=_1cc;
for(var n=0;n<this.images.length;n++){
_3.event.attach(_1.getElementById(this.divId+"_img_"+n),"onclick",_3.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_3.GalleryView.prototype._selectImage=function(e,_1cd){
if(!e){
e=window.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1cd;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1cd!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1cd){
this.selectedImage=-1;
}else{
this.selectedImage=_1cd;
imgs[_1cd].parentNode.className="gvSelectedImage";
}
}
_3.event.cancel(e);
return false;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.GalleryViewConnector=function(opts){
var _1ce={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_1ce,opts);
if(!_1ce.galleryView){
_3.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1ce.api)!="string"||_1ce.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_1ce.api;
this.galleryView=_1ce.galleryView;
this.parameters=_1ce.parameters;
this.type="json";
if(_1ce.type){
switch(_1ce.type.toLowerCase()){
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
if(typeof (_1ce.method)=="string"){
this.method=_1ce.method.toUpperCase()=="POST"?"POST":"GET";
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
var _1cf=root.getElementsByTagName("image");
for(var n=0;n<_1cf.length;n++){
var _1d0=_1cf.item(n).getElementsByTagName("thumbnail");
var path=_1cf.item(n).getElementsByTagName("path");
var name=_1cf.item(n).getElementsByTagName("name");
var _1d1="";
var _1d2="";
var _1d3="";
if(_1d0.length){
if(_1d0.item(0).firstChild){
_1d1=_1d0.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1d2=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1d3=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1c6(_1d1,_1d2,_1d3));
var _1d4=_1cf.item(n).getElementsByTagName("param");
if(_1d4.length){
for(var a=0;a<_1d4.length;a++){
var _1d5=_1d4.item(a).getAttribute("name");
var _1d6="";
if(_1d4.item(a).firstChild){
_1d6=_1d4.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1d5]=_1d6;
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
var _1d1=data.images[n].thumbnail;
var _1d2=data.images[n].path;
var _1d3=data.images[n].name;
this.galleryView.images.push(new _1c6(_1d1,_1d2,_1d3));
for(var _1d7 in data.images[n]){
if(_1d7!="thumbnail"&&_1d7!="path"&&_1d7!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1d7]=data.images[n][_1d7];
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
},_onError:function(_1d8){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1d8+")");
}};
_3.Toolbar=function(opts){
var _1d9={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_1d9,opts);
var cmp=_95.get(_1d9);
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
var _1da=this.cmpTarget.offsetWidth;
var _1db=_1da;
var _1dc=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1dd=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-right"));
_1da-=(this._moreSpan.offsetWidth+_1dc+_1dd);
var _1de=0;
var _1df=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1e0=this.cmpTarget.childNodes[n];
var _1e1=parseInt(_3.className.getComputedProperty(_1e0,"margin-left"));
var _1e2=parseInt(_3.className.getComputedProperty(_1e0,"margin-right"));
if(isNaN(_1e1)){
_1e1=0;
}
if(isNaN(_1e2)){
_1e2=0;
}
_1de+=_1e0.offsetWidth+_1e1+_1e2;
if(n==this.cmpTarget.childNodes.length-1){
_1da=_1db;
}
if(_1de>=_1da){
if(!this._showingMore){
this.showMore();
}
if(!_1df){
this._extraBtns=n;
_1df=true;
}
_3.className.remove(_1e0,"jsToolbarLast");
_1e0.style.visibility="hidden";
if(n>0){
_3.className.add(this.buttons[n-1].target,"jsToolbarLast");
}
}else{
if(n<this.buttons.length-1){
_3.className.remove(_1e0,"jsToolbarLast");
}else{
_3.className.add(_1e0,"jsToolbarLast");
}
_1e0.style.visibility="visible";
}
}
if(_1de<_1da){
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
var _1e3={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_3.mixin(_1e3,opts);
_1e3.target=_1.createElement("span");
_1e3.target.id=this.divId+"_btn_"+_1e3.id;
var _1e4="";
if(typeof (_1e3.onContentAdded)!="function"){
_1e4="<a"+(_1e3.className?" class=\""+_1e3.className+"\" ":"")+" href=\""+_3.getInactiveLocation()+"\">"+_1e3.label+"</a>";
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
_1e3.target.className="jsToolbarFirst";
}
if(ndx==this.buttons.length){
if(this.buttons.length){
_3.className.remove(this.buttons[this.buttons.length-1].target,"jsToolbarLast");
}
_3.className.add(_1e3.target,"jsToolbarLast");
}
if(ndx==this.buttons.length){
this.buttons.push(_1e3);
this.cmpTarget.appendChild(_1e3.target);
}else{
if(ndx==0){
this.buttons.splice(ndx,0,_1e3);
}
this.cmpTarget.insertBefore(_1e3.target,this.cmpTarget.childNodes[ndx]);
}
_1e3.target.innerHTML=_1e4;
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
var _1e5=true;
while(_1e5){
_1e5=false;
var _1e6=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1e6){
_1e5=true;
break;
}
}
}
return _1e6;
};
_3.Toolbar.prototype.removeButton=function(_1e7){
var ndx=null;
if(typeof (_1e7)=="number"){
ndx=ref;
}else{
if(typeof (_1e7)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1e7){
ndx=n;
break;
}
}
}else{
if(typeof (_1e7)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1e7){
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
var _1e8={canHaveChildren:true,hasInvalidator:true,centerOnShow:true,x:0,y:0,width:400,height:300,closable:true,title:"Dialog"};
_3.mixin(_1e8,opts);
var cmp=_95.get(_1e8);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Dialog";
this.centerOnShow=_1e8.centerOnShow?true:false;
this.closable=_1e8.closable?true:false;
this.title=_1e8.title;
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
var _1e9=_3.element.getInnerBox(this.target);
var _1ea=this._titlePanel.offsetHeight;
this.cmpTarget.style.height=(this.title?((this.height-_1ea-_1e9.top-_1e9.bottom)+"px"):"100%");
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
var _1eb=x-this._cacheX;
var _1ec=y-this._cacheY;
this.x+=_1eb;
this.y+=_1ec;
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
Scriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

