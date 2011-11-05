window.Scriptor=(function(_1,_2){
var _3={version:{major:2,minor:2,instance:"beta 4",toString:function(){
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
},mixin:function(_c,_d){
if(!_c){
_c={};
}
for(var i=1,l=arguments.length;i<l;i++){
_3._mixin(_c,arguments[i]);
}
return _c;
},_mixin:function(_e,_f){
var _10,_11,_12={};
for(var i in {toString:1}){
_10=[];
break;
}
_10=_10||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
_11=_10.length;
var _13,s,i;
for(_13 in _f){
s=_f[_13];
if(!(_13 in _e)||(_e[_13]!==s&&(!(_13 in _12)||_12[_13]!==s))){
_e[_13]=s;
}
}
if(_11&&_f){
for(i=0;i<_11;++i){
_13=_10[i];
s=_f[_13];
if(!(_13 in _e)||(_e[_13]!==s&&(!(_13 in _12)||_12[_13]!==s))){
_e[_13]=s;
}
}
}
return _e;
},event:{init:function(obj){
obj._customEventStacks={};
},registerCustomEvent:function(obj,_14,_15){
_15=_15||obj;
if(obj._customEventStacks){
obj._customEventStacks[_14]={context:_15,stack:[]};
}
},attach:function(_16,evt,_17){
if(_3.isHtmlElement(_16)||_16===_1||_16===window){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(_16.addEventListener){
_16.addEventListener(evt,_17,false);
}else{
if(_16.attachEvent){
_16.attachEvent("on"+evt,_17);
}
}
}else{
if(_16._customEventStacks){
if(_16._customEventStacks[evt]){
_3.event.detach(_16,evt,_17);
_16._customEventStacks[evt].stack.push(_17);
}
}
}
return [_16,evt,_17];
},detach:function(){
var _18,evt,_19;
if(typeof (arguments[0])=="object"&&arguments[0].length){
htmlElement=arguments[0][0];
evt=arguments[0][1];
_19=arguments[0][2];
}else{
htmlElement=arguments[0];
evt=arguments[1];
_19=arguments[2];
}
if(_3.isHtmlElement(htmlElement)||htmlElement===_1||htmlElement===window){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(htmlElement.removeEventListener){
htmlElement.removeEventListener(evt,_19,false);
}else{
if(htmlElement.detachEvent){
htmlElement.detachEvent("on"+evt,_19);
}
}
}else{
if(htmlElement._customEventStacks){
if(htmlElement._customEventStacks[evt]){
for(var n=0;n<htmlElement._customEventStacks[evt].stack.length;n++){
if(htmlElement._customEventStacks[evt].stack[n]==_19){
htmlElement._customEventStacks[evt].stack.splice(n,1);
break;
}
}
}
}
}
},fire:function(obj,evt,_1a){
_1a=typeof (_1a)=="object"?_1a:{};
_1a.customEventName=evt;
if(_1a.returnValue===_2){
_1a.returnValue=true;
}
if(!obj._customEventStacks||!obj._customEventStacks[evt]||!obj._customEventStacks[evt].stack.length){
return _1a;
}
var _1b=[_1a];
for(var n=0;n<obj._customEventStacks[evt].stack.length;n++){
obj._customEventStacks[evt].stack[n].apply(obj._customEventStacks[evt].context,_1b);
}
return _1a;
},cancel:function(e,_1c){
if(!e){
return;
}
if(typeof (_1c)=="undefined"){
_1c=true;
}
if(typeof (e.preventDefault)=="function"){
e.preventDefault();
}
e.returnValue=false;
if(_1c){
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
}},className:{has:function(_1d,_1e){
if(!(_1d)){
return false;
}
var _1f=_1d.className;
var _20=new RegExp("(^|\\s)"+_1e+"(\\s|$)");
return (_1f.length>0&&(_1f==_1e||_20.test(_1f)));
},add:function(_21,_22){
if(typeof (_22)!="string"){
return;
}
if(!(_21)){
return;
}
if(_21.className===_2){
_21.className="";
}
if(!_3.className.has(_21,_22)){
_21.className+=(_21.className?" ":"")+_22;
}
},remove:function(_23,_24){
if(typeof (_24)!="string"){
return;
}
if(!(_23)){
return;
}
if(_23.className===_2){
_23.className="";
}
_23.className=_23.className.replace(new RegExp("(^|\\s+)"+_24+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"");
},getComputedProperty:function(el,_25){
if(window.getComputedStyle){
var st=window.getComputedStyle(el,null);
if(st){
return st.getPropertyValue(_25);
}
}else{
if(el.currentStyle){
st=el.currentStyle;
if(st){
var _26="";
var _27=false;
for(var n=0;n<_25.length;n++){
var c=_25.substr(n,1);
if(c=="-"){
_27=true;
}else{
if(_27){
_26+=c.toUpperCase();
_27=false;
}else{
_26+=c;
}
}
}
return st[_26];
}
}
}
return null;
}},cookie:{cookies:{},init:function(){
var ca=_1.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _28=c.substring(0,c.indexOf("="));
this.cookies[_28]=c.substring(_28.length+1,c.length);
}
},get:function(_29){
return this.cookies[_29]?this.cookies[_29]:"";
},create:function(_2a,_2b,_2c){
if(_2c){
var _2d=new Date();
_2d.setTime(_2d.getTime()+(_2c*24*60*60*1000));
var _2e="; expires="+_2d.toGMTString();
}else{
var _2e="";
}
_1.cookie=_2a+"="+_2b+_2e+"; path=/";
this.cookies[_2a]=_2b;
},erase:function(_2f){
this.create(_2f,"",-1);
delete this.cookies[_2f];
}},isHtmlElement:function(o){
var _30=_1.getElementsByTagName("head")[0];
if(o===_3.body()||o===_30){
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
var _31=o.cloneNode(false);
a.appendChild(_31);
a.removeChild(_31);
a=null;
_31=null;
return (o.nodeType!=3);
}
catch(e){
a=null;
return false;
}
},addOnLoad:function(f){
if(window.onload){
var _32=window.onload;
window.onload=function(){
_32();
f();
};
}else{
window.onload=f;
}
},error:{alertErrors:false,muteErrors:false,report:function(msg){
if(_3.error.alertErrors){
alert(msg);
}
if(!_3.error.muteErrors){
throw msg;
}
}},makeTransparent:function(obj,ndx){
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
},body:function(){
if(!_33){
_33=_1.getElementsByTagName("body")[0];
}
return _33;
},getInactiveLocation:function(){
return String((window.location.href.indexOf("#")!=-1)?window.location.href:window.location.href+"#");
},invalidate:function(_34,msg){
if(_34){
_3._calculateBrowserSize();
var _35=_1.getElementById("scriptor_invalidator");
if(!_35){
_35=_1.createElement("div");
_35.id="scriptor_invalidator";
_3.makeTransparent(_35,50);
_35.style.width=_36+"px";
_35.style.height=_37+"px";
_1.getElementsByTagName("body")[0].appendChild(_35);
}
if(msg){
if(!_35.firstChild){
var _38="<div class=\"msg\">"+msg+"</div>";
_35.innerHTML=_38;
_35.firstChild.style.left=((_36/2)-100)+"px";
_35.firstChild.style.top=((_37/2)-15)+"px";
}
}
_3.event.attach(window,"onresize",_3._calculateBrowserSize);
}else{
if(_1.getElementById("scriptor_invalidator")){
_1.getElementById("scriptor_invalidator").parentNode.removeChild(_1.getElementById("scriptor_invalidator"));
}
_3.event.detach(window,"onresize",_3._calculateBrowserSize);
}
},_calculateBrowserSize:function(){
if(navigator.userAgent.indexOf("MSIE")!=-1){
if(_1.documentElement.clientWidth==0){
_36=_1.body.clientWidth;
}else{
_36=_1.documentElement.clientWidth;
}
if(_1.documentElement.clientHeight==0){
_37=_1.body.clientHeight;
}else{
_37=_1.documentElement.clientHeight;
}
}else{
_36=window.innerWidth;
_37=window.innerHeight;
}
var x,y;
var _39=_1.body.scrollHeight;
var _3a=_1.body.offsetHeight;
if(_39>_3a){
x=_1.body.scrollWidth;
y=_1.body.scrollHeight;
}else{
x=_1.body.offsetWidth;
y=_1.body.offsetHeight;
}
_36=Math.max(_36,x);
_37=Math.max(_37,y);
var inv=_1.getElementById("scriptor_invalidator");
if(inv){
inv.style.width=_36+"px";
inv.style.height=_37+"px";
if(inv.firstChild){
inv.firstChild.style.left=((_36/2)-100)+"px";
inv.firstChild.style.top=((_37/2)-15)+"px";
}
}
},element:{getInnerBox:function(_3b){
var box={top:0,bottom:0,left:0,right:0};
var _3c=parseInt(_3.className.getComputedProperty(_3b,"padding-top"));
var _3d=parseInt(_3.className.getComputedProperty(_3b,"padding-bottom"));
var _3e=parseInt(_3.className.getComputedProperty(_3b,"padding-left"));
var _3f=parseInt(_3.className.getComputedProperty(_3b,"padding-right"));
if(!isNaN(_3c)){
box.top=_3c;
}
if(!isNaN(_3d)){
box.bottom=_3d;
}
if(!isNaN(_3e)){
box.left=_3e;
}
if(!isNaN(_3f)){
box.right=_3f;
}
var _40=parseInt(_3.className.getComputedProperty(_3b,"border-top-width"));
var _41=parseInt(_3.className.getComputedProperty(_3b,"border-bottom-width"));
var _42=parseInt(_3.className.getComputedProperty(_3b,"border-left-width"));
var _43=parseInt(_3.className.getComputedProperty(_3b,"border-right-width"));
if(!isNaN(_40)){
box.top+=_40;
}
if(!isNaN(_41)){
box.bottom+=_41;
}
if(!isNaN(_42)){
box.left+=_42;
}
if(!isNaN(_43)){
box.right+=_43;
}
return box;
},getOuterBox:function(_44){
var box={top:0,bottom:0,left:0,right:0};
var _45=parseInt(_3.className.getComputedProperty(_44,"margin-top"));
var _46=parseInt(_3.className.getComputedProperty(_44,"margin-bottom"));
var _47=parseInt(_3.className.getComputedProperty(_44,"margin-left"));
var _48=parseInt(_3.className.getComputedProperty(_44,"margin-right"));
if(!isNaN(_45)){
box.top=_45;
}
if(!isNaN(_46)){
box.bottom=_46;
}
if(!isNaN(_47)){
box.left=_47;
}
if(!isNaN(_48)){
box.right=_48;
}
return box;
}},SHA1:function(msg){
var _49=function(n,s){
var t4=(n<<s)|(n>>>(32-s));
return t4;
};
var _4a=function(val){
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
var _4b=function(val){
var str="";
var i;
var v;
for(i=7;i>=0;i--){
v=(val>>>(i*4))&15;
str+=v.toString(16);
}
return str;
};
var _4c=function(_4d){
_4d=_4d.replace(/\r\n/g,"\n");
var _4e="";
for(var n=0;n<_4d.length;n++){
var c=_4d.charCodeAt(n);
if(c<128){
_4e+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_4e+=String.fromCharCode((c>>6)|192);
_4e+=String.fromCharCode((c&63)|128);
}else{
_4e+=String.fromCharCode((c>>12)|224);
_4e+=String.fromCharCode(((c>>6)&63)|128);
_4e+=String.fromCharCode((c&63)|128);
}
}
}
return _4e;
};
var _4f;
var i,j;
var W=new Array(80);
var H0=1732584193;
var H1=4023233417;
var H2=2562383102;
var H3=271733878;
var H4=3285377520;
var A,B,C,D,E;
var _50;
msg=_4c(msg);
var _51=msg.length;
var _52=new Array();
for(i=0;i<_51-3;i+=4){
j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);
_52.push(j);
}
switch(_51%4){
case 0:
i=2147483648;
break;
case 1:
i=msg.charCodeAt(_51-1)<<24|8388608;
break;
case 2:
i=msg.charCodeAt(_51-2)<<24|msg.charCodeAt(_51-1)<<16|32768;
break;
case 3:
i=msg.charCodeAt(_51-3)<<24|msg.charCodeAt(_51-2)<<16|msg.charCodeAt(_51-1)<<8|128;
break;
}
_52.push(i);
while((_52.length%16)!=14){
_52.push(0);
}
_52.push(_51>>>29);
_52.push((_51<<3)&4294967295);
for(_4f=0;_4f<_52.length;_4f+=16){
for(i=0;i<16;i++){
W[i]=_52[_4f+i];
}
for(i=16;i<=79;i++){
W[i]=_49(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
}
A=H0;
B=H1;
C=H2;
D=H3;
E=H4;
for(i=0;i<=19;i++){
_50=(_49(A,5)+((B&C)|(~B&D))+E+W[i]+1518500249)&4294967295;
E=D;
D=C;
C=_49(B,30);
B=A;
A=_50;
}
for(i=20;i<=39;i++){
_50=(_49(A,5)+(B^C^D)+E+W[i]+1859775393)&4294967295;
E=D;
D=C;
C=_49(B,30);
B=A;
A=_50;
}
for(i=40;i<=59;i++){
_50=(_49(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+2400959708)&4294967295;
E=D;
D=C;
C=_49(B,30);
B=A;
A=_50;
}
for(i=60;i<=79;i++){
_50=(_49(A,5)+(B^C^D)+E+W[i]+3395469782)&4294967295;
E=D;
D=C;
C=_49(B,30);
B=A;
A=_50;
}
H0=(H0+A)&4294967295;
H1=(H1+B)&4294967295;
H2=(H2+C)&4294967295;
H3=(H3+D)&4294967295;
H4=(H4+E)&4294967295;
}
var _50=_4b(H0)+_4b(H1)+_4b(H2)+_4b(H3)+_4b(H4);
return _50.toLowerCase();
},MD5:function(_53){
var _54=function(_55,_56){
return (_55<<_56)|(_55>>>(32-_56));
};
var _57=function(lX,lY){
var lX4,lY4,lX8,lY8,_58;
lX8=(lX&2147483648);
lY8=(lY&2147483648);
lX4=(lX&1073741824);
lY4=(lY&1073741824);
_58=(lX&1073741823)+(lY&1073741823);
if(lX4&lY4){
return (_58^2147483648^lX8^lY8);
}
if(lX4|lY4){
if(_58&1073741824){
return (_58^3221225472^lX8^lY8);
}else{
return (_58^1073741824^lX8^lY8);
}
}else{
return (_58^lX8^lY8);
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
a=_57(a,_57(_57(F(b,c,d),x),ac));
return _57(_54(a,s),b);
};
var GG=function(a,b,c,d,x,s,ac){
a=_57(a,_57(_57(G(b,c,d),x),ac));
return _57(_54(a,s),b);
};
var HH=function(a,b,c,d,x,s,ac){
a=_57(a,_57(_57(H(b,c,d),x),ac));
return _57(_54(a,s),b);
};
var II=function(a,b,c,d,x,s,ac){
a=_57(a,_57(_57(I(b,c,d),x),ac));
return _57(_54(a,s),b);
};
var _59=function(_5a){
var _5b;
var _5c=_5a.length;
var _5d=_5c+8;
var _5e=(_5d-(_5d%64))/64;
var _5f=(_5e+1)*16;
var _60=Array(_5f-1);
var _61=0;
var _62=0;
while(_62<_5c){
_5b=(_62-(_62%4))/4;
_61=(_62%4)*8;
_60[_5b]=(_60[_5b]|(_5a.charCodeAt(_62)<<_61));
_62++;
}
_5b=(_62-(_62%4))/4;
_61=(_62%4)*8;
_60[_5b]=_60[_5b]|(128<<_61);
_60[_5f-2]=_5c<<3;
_60[_5f-1]=_5c>>>29;
return _60;
};
var _63=function(_64){
var _65="",_66="",_67,_68;
for(_68=0;_68<=3;_68++){
_67=(_64>>>(_68*8))&255;
_66="0"+_67.toString(16);
_65=_65+_66.substr(_66.length-2,2);
}
return _65;
};
var _69=function(_6a){
_6a=_6a.replace(/\r\n/g,"\n");
var _6b="";
for(var n=0;n<_6a.length;n++){
var c=_6a.charCodeAt(n);
if(c<128){
_6b+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_6b+=String.fromCharCode((c>>6)|192);
_6b+=String.fromCharCode((c&63)|128);
}else{
_6b+=String.fromCharCode((c>>12)|224);
_6b+=String.fromCharCode(((c>>6)&63)|128);
_6b+=String.fromCharCode((c&63)|128);
}
}
}
return _6b;
};
var x=Array();
var k,AA,BB,CC,DD,a,b,c,d;
var S11=7,S12=12,S13=17,S14=22;
var S21=5,S22=9,S23=14,S24=20;
var S31=4,S32=11,S33=16,S34=23;
var S41=6,S42=10,S43=15,S44=21;
_53=_69(_53);
x=_59(_53);
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
a=_57(a,AA);
b=_57(b,BB);
c=_57(c,CC);
d=_57(d,DD);
}
var _6c=_63(a)+_63(b)+_63(c)+_63(d);
return _6c.toLowerCase();
}};
var _6d=0;
var _6e="scriptor_"+_6d;
var _6f=function(){
_6e="scriptor_"+_6d;
_6d++;
while(_1.getElementById(_6e)){
_6d++;
_6e="scriptor_"+_6d;
}
return _6e;
};
var _37=0;
var _36=0;
var _33=null;
_3.cookie.init();
_3.httpRequest=function(_70){
var _71={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_3.mixin(_71,_70);
if(typeof (_71.ApiCall)!="string"||_71.ApiCall==""){
_3.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_71.ApiCall;
this.method="POST";
if(typeof (_71.method)=="string"){
this.method=_71.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_71.Type)=="string"){
switch(_71.Type.toLowerCase()){
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
if(typeof (_71.onLoad)=="function"){
this.onLoad=_71.onLoad;
}
this.onError=null;
if(typeof (_71.onError)=="function"){
this.onError=_71.onError;
}
this.requestHeaders=[];
if(_71.requestHeaders&&_71.requestHeaders.length){
for(var n=0;n<_71.requestHeaders.length;n++){
if(typeof (_71.requestHeaders[n][0])=="string"&&typeof (_71.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_71.requestHeaders[n][0],_71.requestHeaders[n][1]]);
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
},send:function(_72){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_72;
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
this.http_request.send(_72);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _73=null;
switch(this.Type){
case ("xml"):
_73=this.http_request.responseXML;
break;
case ("json"):
_73=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_73=this.http_request.responseText;
break;
}
this.onLoad(_73);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_3.httpRequest.prototype.lang={errors:{createRequestError:"Error creando objeto Ajax!",requestHandleError:"Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde."}};
var _74=0;
var _75=function(){
return "q"+(_74++);
};
var _76=(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null);
_3.effects={effectsQueue:{},lastId:0,intervalId:null,started:false,scheduleEffect:function(_77){
var _78=_75();
this.effectsQueue[_78]=this._getEffectInstance();
_3.mixin(this.effectsQueue[_78],_77);
return _78;
},startAll:function(){
for(var fId in this.effectsQueue){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(_76){
_76(this.loop);
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
if(_76){
_76(this.loop);
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
var _79=this.effectsQueue[fId];
if(_79){
_79.started=false;
for(var n=0;n<_79.property.length;n++){
var _7a=_79.property[n];
if(_7a.substr(0,6)=="style."){
_79.elem.style[_7a.substr(6)]=_79.end[n]+_79.unit[n];
}else{
if(typeof (_79.setAttribute)=="function"){
_79.elem.setAttribute(_7a,_79.end[n]+_79.unit[n]);
}else{
_79.elem[_7a]=_79.end[n]+_79.unit[n];
}
}
}
if(typeof (_79.callback)=="function"){
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
var _7b=new Date().getTime();
for(var fId in _3.effects.effectsQueue){
var _7c=_3.effects.effectsQueue[fId];
if(_7c.started){
if(_7c.startTime==null){
_7c.startTime=_7b;
}
if((_7c.startTime+_7c.duration)<=_7b){
_3.effects.cancel(fId);
}else{
var _7d=(_7b-_7c.startTime)/_7c.duration;
for(var n=0;n<_7c.property.length;n++){
var _7e=_7c.start[n]+((_7c.end[n]-_7c.start[n])*_7d);
var _7f=_7c.property[n];
if(_7f.substr(0,6)=="style."){
_7c.elem.style[_7f.substr(6)]=_7e+_7c.unit[n];
}else{
if(typeof (_7c.setAttribute)=="function"){
_7c.elem.setAttribute(_7f,_7e+_7c.unit[n]);
}else{
_7c.elem[_7f]=_7e+_7c.unit[n];
}
}
}
if(typeof (_7c.step)=="function"){
_7c.step(_7b);
}
}
}
}
_3.effects.checkGoOn();
},checkInterval:function(){
var _80=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_80=true;
break;
}
}
if(!_80&&this.started){
clearInterval(this.intervalId);
this.intervalId=null;
this.started=false;
}
},checkGoOn:function(){
if(this.started){
var _81=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_81=true;
break;
}
}
if(_81){
if(_76){
_76(this.loop);
}
}
}
},_getEffectInstance:function(){
return {elem:null,property:[],start:[],end:[],unit:[],duration:500,callback:null,step:null,started:false,startTime:null};
}};
var _82={get:function(_83){
var _84={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_3.mixin(_84,_83);
if(!_84.divId){
_84.divId=_6f();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_84.id,region:_84.region,style:_84.style,className:_84.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_84.canHaveChildren,hasInvalidator:_84.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_84.x,y:_84.y,width:_84.width,height:_84.height,resizable:_84.resizable,minHeight:_84.minHeight,maxHeight:_84.maxHeight,minWidth:_84.minWidth,maxWidth:_84.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
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
var _85=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_85=n;
break;
}
}
var _86=false;
var _87=(_85==this.parent.components.length-1)?0:_85+1;
for(var n=_87;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_85){
this.parent.components[n].focus();
_86=true;
break;
}
}
if(!_86&&_87>0){
for(var n=0;n<_87;n++){
if(this.parent.components[n].visible&&n!=_85){
this.parent.components[n].focus();
_86=true;
break;
}
}
}
if(!_86){
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
var _88=this.className?("jsComponent jsComponentHidden "+this.className):"jsComponent jsComponentHidden";
this.target.className=this.target.className?(_88+" "+this.target.className):_88;
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
var _89=_3.className.getComputedProperty(this.target,"width");
var _8a=_3.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_89))){
this.width=parseInt(_89);
}
if(this.height==null&&!isNaN(parseInt(_8a))){
this.height=parseInt(_8a);
}
if(_89.substr(_89.length-1)=="%"){
this._percentWidth=_89;
}else{
this._origWidth=_89;
}
if(_8a.substr(_8a.length-1)=="%"){
this._percentHeight=_8a;
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
var _8b=this.__getInnerBox();
var _8c=this.__getOuterBox();
var _8d=this.__getChildrenForRegion("top");
var _8e=0;
var _8f=(this.width-_8b.left-_8b.right-_8c.left-_8c.right)/_8d.length;
var _90=false;
for(var n=0;n<_8d.length;n++){
if(_8d[n].height>_8e){
_8e=_8d[n].height;
}
_8d[n].x=(n*_8f);
_8d[n].y=0;
_8d[n].width=_8f;
_8d[n].height=_8d[n].height;
if(_8d[n].resizable){
_90=true;
}
}
var _91=this.__getChildrenForRegion("bottom");
var _92=0;
var _93=(this.width-_8b.left-_8b.right-_8c.left-_8c.right)/_91.length;
var _94=false;
for(var n=0;n<_91.length;n++){
if(_91[n].height>_92){
_92=_91[n].height;
}
if(_91[n].resizable){
_94=true;
}
}
for(var n=0;n<_91.length;n++){
_91[n].x=(n*_93);
_91[n].y=this.height-_92-_8b.top-_8b.bottom;
_91[n].width=_93;
_91[n].height=_91[n].height;
}
var _95=this.__getChildrenForRegion("left");
var _96=0;
var _97=(this.height-_8b.top-_8b.bottom-_8c.left-_8c.right)/_95.length;
var _98=false;
for(var n=0;n<_95.length;n++){
if(_95[n].width>_96){
_96=_95[n].width;
}
_95[n].x=0;
_95[n].y=_8e+(n*_97);
_95[n].height=_97-_8e-_92;
_95[n].width=_95[n].width;
if(_95[n].resizable){
_98=true;
}
}
var _99=this.__getChildrenForRegion("right");
var _9a=0;
var _9b=(this.height-_8b.top-_8b.bottom-_8c.top-_8c.bottom)/_99.length;
var _9c=false;
for(var n=0;n<_99.length;n++){
if(_99[n].width>_9a){
_9a=_99[n].width;
}
if(_99[n].resizable){
_9c=true;
}
}
for(var n=0;n<_99.length;n++){
_99[n].x=this.width-_9a-_8b.left-_8b.right;
_99[n].y=_8e+(n*_9b);
_99[n].width=_9a;
_99[n].height=_9b-_8e-_92;
}
var _9d=this.__getChildrenForRegion("center");
var _9e=(this.height-_8b.top-_8b.bottom-_8c.top-_8c.bottom-_92-_8e)/_9d.length;
for(var n=0;n<_9d.length;n++){
_9d[n].x=_96;
_9d[n].y=_8e+(n*_9e);
_9d[n].height=_9e;
_9d[n].width=this.width-_8b.left-_8b.right-_8c.left-_8c.right-_96-_9a;
}
if(_90){
if(!this.splitters.top){
this.splitters.top=_1.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_3.className.add(this.splitters.top,"jsSplitter");
_3.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_3.event.attach(this.splitters.top,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _9f=_8d[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_8b.left-_8b.right)+"px";
this.splitters.top.style.top=(_8e-_9f.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_94){
if(!this.splitters.bottom){
this.splitters.bottom=_1.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_3.className.add(this.splitters.bottom,"jsSplitter");
_3.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_3.event.attach(this.splitters.bottom,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _a0=_91[0].__getOuterBox();
var _a1=parseInt(_3.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_a1)){
_a1=5;
}
this.splitters.bottom.style.width=(this.width-_8b.left-_8b.right)+"px";
this.splitters.bottom.style.top=(this.height-_92-_a1-_a0.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_98){
if(!this.splitters.left){
this.splitters.left=_1.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_3.className.add(this.splitters.left,"jsSplitter");
_3.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_3.event.attach(this.splitters.left,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _a2=_95[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_8b.top-_8b.bottom-_8e-_92)+"px";
this.splitters.left.style.top=(_8e)+"px";
this.splitters.left.style.left=(_96-_a2.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_9c){
if(!this.splitters.right){
this.splitters.right=_1.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_3.className.add(this.splitters.right,"jsSplitter");
_3.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_3.event.attach(this.splitters.right,"mousedown",_3.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _a3=_99[0].__getOuterBox();
var _a4=parseInt(_3.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_a4)){
_a4=5;
}
this.splitters.right.style.height=(this.height-_8b.top-_8b.bottom-_8e-_92)+"px";
this.splitters.right.style.top=(_8e)+"px";
this.splitters.right.style.left=(this.width-_9a-_a4-_a3.left)+"px";
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
},resizeTo:function(_a5){
if(_a5){
if(_a5.width){
this.width=_a5.width;
this._percentWidth=null;
}
if(_a5.height){
this.height=_a5.height;
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
var _a6=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_a6=true;
break;
}
}
if(!_a6&&ref.CMP_SIGNATURE&&this.canHaveChildren){
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
var _a7=this.__getInnerBox();
var _a8=this.__getOuterBox();
var _a9=0,_aa=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_a8.left-_a8.right-_a7.left-_a7.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_a8=this.__getOuterBox();
_a9=this.target.parentNode.offsetWidth-_a8.left-_a8.right-_a7.left-_a7.right;
if(isNaN(_a9)||_a9<0){
_a9=0;
}
this.width=_a9;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_aa=this.target.offsetHeight-_a8.top-_a8.bottom-_a7.top-_a7.bottom;
if(isNaN(_aa)||_aa<0){
_aa=0;
}
this.height=_aa;
}
if(this.width!==null){
_a9=this.width-_a7.left-_a7.right-_a8.left-_a8.right;
if(isNaN(_a9)||_a9<0){
_a9=0;
}
this.target.style.width=_a9+"px";
}
if(this.height!==null){
_aa=this.height-_a7.top-_a7.bottom-_a8.top-_a8.bottom;
if(isNaN(_aa)||_aa<0){
_aa=0;
}
this.target.style.height=_aa+"px";
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
var _ab=parseInt(_3.className.getComputedProperty(this.target,"padding-top"));
var _ac=parseInt(_3.className.getComputedProperty(this.target,"padding-bottom"));
var _ad=parseInt(_3.className.getComputedProperty(this.target,"padding-left"));
var _ae=parseInt(_3.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_ab)){
box.top=_ab;
}
if(!isNaN(_ac)){
box.bottom=_ac;
}
if(!isNaN(_ad)){
box.left=_ad;
}
if(!isNaN(_ae)){
box.right=_ae;
}
var _af=parseInt(_3.className.getComputedProperty(this.target,"border-top-width"));
var _b0=parseInt(_3.className.getComputedProperty(this.target,"border-bottom-width"));
var _b1=parseInt(_3.className.getComputedProperty(this.target,"border-left-width"));
var _b2=parseInt(_3.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_af)){
box.top+=_af;
}
if(!isNaN(_b0)){
box.bottom+=_b0;
}
if(!isNaN(_b1)){
box.left+=_b1;
}
if(!isNaN(_b2)){
box.right+=_b2;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _b3=parseInt(_3.className.getComputedProperty(this.target,"margin-top"));
var _b4=parseInt(_3.className.getComputedProperty(this.target,"margin-bottom"));
var _b5=parseInt(_3.className.getComputedProperty(this.target,"margin-left"));
var _b6=parseInt(_3.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_b3)){
box.top=_b3;
}
if(!isNaN(_b4)){
box.bottom=_b4;
}
if(!isNaN(_b5)){
box.left=_b5;
}
if(!isNaN(_b6)){
box.right=_b6;
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
},_onResizeStart:function(e,_b7){
if(!e){
e=window.event;
}
this.resizingRegion=_b7;
_3.event.attach(_1,"mousemove",this._resizeMoveHandler=_3.bindAsEventListener(this._onResizeMove,this));
_3.event.attach(_1,"mouseup",this._resizeStopHandler=_3.bindAsEventListener(this._onResizeStop,this));
if(_b7=="top"||_b7=="bottom"){
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
var _b8=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_b8){
_3.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_b8;
var _b9=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_b9=_3.event.getPointXY(e).y;
}else{
_b9=_3.event.getPointXY(e).x;
}
var _ba=_b9-this.resizeStartingPosition;
this.resizeStartingPosition=_b9;
var _bb=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_bb.length;n++){
_bb[n].resizeTo({height:_bb[n].height+_ba});
}
break;
case ("bottom"):
for(var n=0;n<_bb.length;n++){
_bb[n].resizeTo({height:_bb[n].height-_ba});
}
break;
case ("left"):
for(var n=0;n<_bb.length;n++){
_bb[n].resizeTo({width:_bb[n].width+_ba});
}
break;
case ("right"):
for(var n=0;n<_bb.length;n++){
_bb[n].resizeTo({width:_bb[n].width-_ba});
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
var _bc=["center","left","top","bottom","right"];
var _bd=false;
for(var n=0;n<_bc.length;n++){
if(cmp.region==_bc[n]){
_bd=true;
break;
}
}
if(!_bd){
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
cmp.divId=_6f();
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
_3.ContextMenu=function(_be){
var _bf={canHaveChildren:false,hasInvalidator:false,items:[]};
_3.mixin(_bf,_be);
var cmp=_82.get(_bf);
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
for(var n=0;n<_bf.items.length;n++){
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
var _c0=_3.element.getOuterBox(this.ul);
var _c1=this.__getInnerBox();
this.target.style.width="auto";
this.width=this.ul.offsetWidth+_c0.left+_c0.right+_c1.left+_c1.right;
this.height=this.ul.offsetHeight+_c0.top+_c0.bottom+_c1.top+_c1.bottom;
this.__updatePosition();
};
_3.ContextMenu.prototype.addItem=function(_c2,ndx){
var _c3={label:"sep",onclick:null,checked:false};
_3.mixin(_c3,_c2);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_c3);
}else{
ndx=this.items.length;
this.items.push(_c3);
}
if(this.target){
var li=_1.createElement("li");
var _c4="";
var _c5=_c3;
if(_c5.label=="sep"){
li.className="contextMenuSep";
}else{
if(_c5.checked){
li.className="OptionChecked";
}
_c4+="<a href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_c5["class"]){
_c4+=" class=\""+_c5["class"]+"\"";
}
_c4+=">"+_c5.label+"</a>";
}
li.innerHTML=_c4;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_c5.label!="sep"&&typeof (_c5.onclick)=="function"){
_3.event.attach(_1.getElementById(this.divId+"_itm_"+ndx),"onclick",_c5.onclick);
}
this.updateSize();
}
};
_3.ContextMenu.prototype.removeItem=function(_c6){
if(typeof (_c6)=="number"){
if(_c6>=0&&_c6<=this.items.length-1){
this.items.splice(_c6,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_c6]);
}
}
}else{
if(typeof (_c6)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_c6){
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
_3.ContextMenu.prototype.checkItem=function(_c7,_c8){
if(typeof (_c7)=="undefined"){
return;
}
if(typeof (_c8)=="undefined"){
_c8=false;
}
if(typeof (_c7)=="number"){
if(_c7>=0&&_c7<=this.items.length-1){
this.items[_c7].checked=_c8?true:false;
if(this.target){
_3.className[(_c8?"add":"remove")](this.ul.getElementsByTagName("li")[_c7],"OptionChecked");
}
}
}else{
if(typeof (_c7)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_c7){
this.items[n].checked=_c8?true:false;
if(this.target){
_3.className[(_c8?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_3.Panel=function(_c9){
var _ca={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_ca,_c9);
var cmp=_82.get(_ca);
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
var _cb="";
if(_1.getElementById(this.divId)){
var _cc=_1.getElementById(this.divId);
_cb=_cc.innerHTML;
_cc.innerHTML="";
}
this.create();
if(_cb){
this.setContent(_cb);
}
_3.className.add(this.target,"jsPanel");
};
_3.TabContainer=function(_cd){
var _ce={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_ce,_cd);
var cmp=_82.get(_ce);
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
var _cf=this._tabList.cmpTarget.offsetWidth;
var _d0=_cf;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _d1=_1.getElementById(this._tabList.divId+"_more");
if(_d1){
var _d2=parseInt(_3.className.getComputedProperty(_d1,"margin-left"));
var _d3=parseInt(_3.className.getComputedProperty(_d1,"margin-right"));
_cf-=(_d1.offsetWidth+_d2+_d3);
}
var _d4=0;
var _d5=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _d6=this._tabList.cmpTarget.childNodes[n];
var _d7=parseInt(_3.className.getComputedProperty(_d6,"margin-left"));
var _d8=parseInt(_3.className.getComputedProperty(_d6,"margin-right"));
if(isNaN(_d7)){
_d7=0;
}
if(isNaN(_d8)){
_d8=0;
}
_d4+=_d6.offsetWidth+_d7+_d8;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_cf=_d0;
}
if(_d4>=_cf){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_d5){
this._tabList._extraTabs=n;
_d5=true;
}
_d6.style.visibility="hidden";
}else{
_d6.style.visibility="visible";
}
}
if(_d4<_cf){
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
this._tabList=new _d9({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _da({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_3.TabContainer.prototype.addTab=function(_db,_dc,ndx){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _dd={title:"",paneId:_dc.divId,pane:_dc,closable:false};
_3.mixin(_dd,_db);
if(!_dd.pane||!_dd.pane.CMP_SIGNATURE||!_dd.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _de=new _df(_dd);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_de);
}else{
this._tabs.push(_de);
}
var _e0=this._tabList.cmpTarget.childNodes;
var _e1=_1.createElement("div");
_e1.id=_de.paneId+"_tablabel";
_e1.className="jsTabLabel";
if(_de.closable){
_3.className.add(_e1,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_de.paneId;
_3.className.add(_e1,"jsTabSelected");
}
_e1.innerHTML="<span>"+_de.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_de.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_e1);
}else{
this._tabList.cmpTarget.insertBefore(_e1,_e0[ndx]);
}
this._pageContainer.addPage(_de.pane);
this._pageContainer.activate(this._selectedTabId);
var _e2=_1.getElementById(_de.paneId+"_closeHandler");
if(!_de.closable){
_3.className.add(_e2,"jsTabCloseHidden");
}else{
_3.className.add(_e1,"jsTabClosable");
}
_3.event.attach(_e1,"onclick",_3.bindAsEventListener(this.selectTab,this,_de.paneId));
_3.event.attach(_e2,"onclick",_3.bindAsEventListener(this.closeTab,this,_de.paneId));
this.resize();
};
_3.TabContainer.prototype.removeTab=function(ref,_e3){
if(!this.inDOM){
_3.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_e3)=="undefined"){
_e3=true;
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
var _e4=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _e4=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_e3);
this._tabs.splice(ndx,1);
if(_e4){
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
_3.TabContainer.prototype.setTitle=function(ref,_e5){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_e5;
this.resize();
}
};
_3.TabContainer.prototype.setClosable=function(ref,_e6){
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
var _e7=this._tabList.cmpTarget.childNodes[ndx];
var _e8=_1.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_e6){
_3.className.add(_e7,"jsTabClosable");
_3.className.remove(_e8,"jsTabCloseHidden");
}else{
_3.className.remove(_e7,"jsTabClosable");
_3.className.add(_e8,"jsTabCloseHidden");
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
var _e9=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_e9){
if(this._tabsContextMenu.items.length>_e9){
while(this._tabsContextMenu.items.length>_e9){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_e9-this._tabsContextMenu.items.length;n++){
var _ea=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_ea].title,onclick:_3.bindAsEventListener(function(e,_eb,_ec){
this.selectTab(_eb);
},this,_ea,this._tabList._extraTabs)},0);
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
var _d9=function(_ed){
var _ee={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_ee,_ed);
var cmp=_82.get(_ee);
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
var _ef=_1.createElement("span");
_ef.id=this.divId+"_more";
_ef.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_ef);
_ef.innerHTML=" ";
_3.className.add(this.cmpTarget,"jsTabListInner");
_3.event.attach(_ef,"onclick",_3.bindAsEventListener(this.onDropdownClick,this));
};
_d9.prototype.onDropdownClick=function(e){
if(!e){
e=window.event;
}
this.parent._tabsContextMenu.show(e);
_3.event.cancel(e,true);
return false;
};
_d9.prototype.showMore=function(){
if(!this._showingMore){
_3.className.remove(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_d9.prototype.hideMore=function(){
if(this._showingMore){
_3.className.add(_1.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _da=function(_f0){
var _f1={canHaveChildren:true,hasInvalidator:false};
_3.mixin(_f1,_f0);
var cmp=_82.get(_f1);
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
_da.prototype.addPage=function(_f2){
_3.className.add(_f2.target,"jsTabPage");
this.addChild(_f2);
};
_da.prototype.removePage=function(_f3,_f4){
this.removeChild(_f3);
if(_f4){
_f3.destroy();
}
};
_da.prototype.activate=function(_f5){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_f5){
this.components[n].show();
}
}
};
var _df=function(_f6){
var _f7={title:"",paneId:null,pane:null,closable:false};
_3.mixin(_f7,_f6);
this.title=_f7.title;
this.paneId=_f7.paneId;
this.pane=_f7.pane;
this.closable=_f7.closable;
};
var _f8=20;
var _f9=function(_fa){
var _fb={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_3.mixin(_fb,_fa);
if(!_fb.Name){
_3.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_fb.Name;
this.Type=(typeof (_fc[_fb.Type])!="undefined")?_fb.Type:"alpha";
this.show=_fb.show;
this.percentWidth=null;
if(!isNaN(Number(_fb.Width))){
this.Width=Number(_fb.Width);
}else{
if(typeof (_fb.Width)=="string"){
if(_fb.Width.length>2&&_fb.Width.substr(_fb.Width.length-2)=="px"&&!isNaN(parseInt(_fb.Width))){
this.Width=parseInt(_fb.Width);
}else{
if(_fb.Width.length>1&&_fb.Width.substr(_fb.Width.length-1)=="%"&&!isNaN(parseInt(_fb.Width))){
this.Width=_f8;
this.percentWidth=parseInt(_fb.Width);
}
}
}
}
this.origWidth=this.Width;
this.Format=_fb.Format;
this.displayName=_fb.displayName?_fb.displayName:_fb.Name;
this.sqlName=_fb.sqlName?_fb.sqlName:_fb.Name;
this.showToolTip=_fb.showToolTip;
this.Compare=_fb.Compare;
};
var _fd=function(_fe,_ff){
_ff=_ff?_ff:{};
for(var n=0;n<_fe.length;n++){
var name=_fe[n].Name;
var type=_fe[n].Type;
this[name]=_ff[name]?_fc[type](_ff[name]):_fc[type]();
}
for(var prop in _ff){
if(this[prop]===_2){
this[prop]=_ff[prop];
}
}
};
var _fc={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _100=str.split(" ");
if(_100[0]=="0000-00-00"){
return "";
}else{
var _101=_100[0].split("-");
ret=new Date(_101[0],_101[1]-1,_101[2]);
if(_100[1]){
var _102=_100[1].split(":");
ret=new Date(_101[0],_101[1]-1,_101[2],_102[0],_102[1],_102[2]);
}
}
}
return ret;
}};
_3.DataView=function(opts){
var _103={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_3.mixin(_103,opts);
var cmp=_82.get(_103);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_103.multiselect;
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
this.paginating=_103.paginating;
this.rowsPerPage=_103.rowsPerPage;
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
var _104=this.__getInnerBox();
var _105=this.__getOuterBox();
var _106=_104.top+_104.bottom+_105.top+_105.bottom;
if(this._cached.pagination_header){
var _105=_3.element.getOuterBox(this._cached.pagination_header);
_106+=this._cached.pagination_header.offsetHeight+_105.top+_105.bottom;
}
if(this._cached.header){
var _105=_3.element.getOuterBox(this._cached.header);
_106+=this._cached.header.offsetHeight+_105.top+_105.bottom;
}
if(this._cached.footer){
var _105=_3.element.getOuterBox(this._cached.footer);
_106+=this._cached.footer.offsetHeight+_105.top+_105.bottom;
}
var _107=this.height!==null?this.height-_106:0;
if(_107<0){
_107=0;
}
this._cached.outer_body.style.height=_107+"px";
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
for(var n=0;n<_103.columns.length;n++){
this.addColumn(this.createColumn(_103.columns[n]));
}
};
_3.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _108="";
var _109=_3.getInactiveLocation();
if(this.paginating){
_108+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_108+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_108+="</label></li><li>";
_108+="<a href=\""+_109+"\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_108+="<a href=\""+_109+"\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_108+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_108+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_108+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_108+="</li></ul></div>";
}
_108+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_108+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_108+="<li class=\"dataViewCheckBoxHeader\">";
_108+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_108+="<li class=\"dataViewSep\"></li>";
}
_108+="</ul>";
_108+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_108+="<a href=\""+_109+"\"> </a></span></div>";
_108+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_108+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_108+="</div>";
_108+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_108;
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
var _10a=0;
var _10b=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_10b){
n+=this.rowsPerPage;
_10a++;
}
return _10a;
};
_3.DataView.prototype.getNextRowId=function(){
var _10c=true;
while(_10c){
_10c=false;
var _10d=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_10d){
_10c=true;
break;
}
}
}
return _10d;
};
_3.DataView.prototype.createColumn=function(opts){
return new _f9(opts);
};
_3.DataView.prototype.addColumn=function(_10e,ndx){
if(this.__findColumn(_10e.Name)==-1){
if(ndx===_2){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_10e);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_10e.Name]=_fc[_10e.Type]();
}
}
if(!this.orderBy&&_10e.show){
this.orderBy=_10e.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_3.DataView.prototype.__findColumn=function(_10f){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_10f){
return n;
}
}
return -1;
};
_3.DataView.prototype.deleteColumn=function(_110){
var _111="";
var ndx=null;
if(typeof (_110)=="string"){
var _112=this.__findColumn(_110);
if(_112!=-1){
_111=this.columns[_112].Name;
ndx=_112;
this.columns.splice(_112,1);
}
}
if(typeof (_110)=="number"){
if(_110>0&&_110<this.columns.length){
_111=this.columns[_110].Name;
ndx=_110;
this.columns.splice(_110,1);
}
}
if(typeof (_110)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_110){
_111=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_111){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_111]=null;
delete this.rows[n][_111];
}
}
if(this.orderBy==_111){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_3.DataView.prototype._addColumnToUI=function(_113,ndx){
var li=_1.createElement("li");
li.style.width=_113.Width+"px";
var _114="dataViewColumn";
if(!_113.show){
_114+=" dataViewColumnHidden";
}
li.className=_114;
var a=_1.createElement("a");
if(this.orderBy==_113.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href",_3.getInactiveLocation());
a.innerHTML=_113.displayName;
li.appendChild(a);
li2=_1.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_114="dataViewFieldSep";
if(_113.percentWidth!==null){
_114+=" dataViewFieldSepNoResize";
}
if(!_113.show){
_114+=" dataViewColumnHidden";
}
li2.className=_114;
var _115=this._cached.headerUl.getElementsByTagName("li");
if(!_115.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _116=this.multiselect?2:0;
if(ndx>=0&&(_116+(ndx*2))<_115.length){
this._cached.headerUl.insertBefore(li,_115[_116+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_115[_116+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_113.displayName,onclick:_3.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_113.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_113.Name,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._removeColumnFromUI=function(ndx){
var _117=this.multiselect?2:0;
var _118=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_117+(ndx*2))<_118.length){
this._cached.headerUl.removeChild(_118[_117+(ndx*2)]);
this._cached.headerUl.removeChild(_118[_117+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
this._adjustColumnsWidth();
};
_3.DataView.prototype._addRowToUI=function(_119){
if(_119<0||_119>this.rows.length-1){
return;
}
var _11a=this.rows[_119].id;
var _11b=_1.createElement("ul");
_11b.id=this.divId+"_row_"+_11a;
var _11c=false;
if(!this.multiselect){
if(this.selectedRow==n){
_11c=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_11c=true;
break;
}
}
}
if(_11c){
_11b.className="dataViewRowSelected";
}
if(_119%2){
_3.className.add(_11b,"dataViewRowOdd");
}
if(this.multiselect){
var _11d=_1.createElement("li");
var _11e="dataViewMultiselectCell";
_11d.className=_11e;
var _11f="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_11a+"\" class=\"dataViewCheckBox\" ";
if(_11c){
_11f+="checked=\"checked\" ";
}
_11f+="/></li>";
_11d.innerHTML=_11f;
_11b.appendChild(_11d);
}
var _120=this._cached.rows_body.getElementsByTagName("ul");
if(_120.length==0){
this._cached.rows_body.appendChild(_11b);
}else{
if(_119==this.rows.length-1){
this._cached.rows_body.appendChild(_11b);
}else{
var _121=null;
for(var n=_119+1;n<this.rows.length;n++){
_121=_1.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_121){
break;
}
}
if(_121){
this._cached.rows_body.insertBefore(_11b,_121);
}else{
this._cached.rows_body.appendChild(_11b);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_11a,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_3.DataView.prototype._removeRowFromUI=function(_122){
if(_122<0||_122>this.rows.length-1){
return;
}
var _123=this.rows[_122].id;
var _124=_1.getElementById(this.divId+"_row_"+_123);
if(_124){
this._cached.rows_body.removeChild(_124);
}
this.__refreshFooter();
};
_3.DataView.prototype._refreshRowInUI=function(_125){
var row=this.getById(_125);
if(row){
var _126=_1.getElementById(this.divId+"_row_"+_125);
if(_126){
for(var a=0;a<this.columns.length;a++){
this.setCellValue(_125,this.columns[a].Name,row[this.columns[a].Name]);
}
}
}
};
_3.DataView.prototype._addCellToUI=function(_127,_128,ndx){
var _129=_1.getElementById(this.divId+"_row_"+_127);
if(_129){
var _12a=_129.getElementsByTagName("li");
var li=_1.createElement("li");
li.id=this.divId+"_cell_"+_127+"_"+ndx;
var _12b="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_12b+=" dataViewCellHidden";
}
if(ndx==0){
_12b+=" dataViewFirstCell";
}
li.className=_12b;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_127)[_128]);
}
if(ndx>=0&&ndx<_12a.length-1){
_129.insertBefore(li,_12a[ndx]);
}else{
_129.appendChild(li);
}
this.setCellValue(_127,_128,this.getById(_127)[_128]);
}
};
_3.DataView.prototype._removeCellFromUI=function(_12c,ndx){
var _12d=this.multiselect?1:0;
var _12e=_1.getElementById(this.divId+"_row_"+_12c);
if(_12e){
var _12f=_12e.getElementsByTagName("li");
if(ndx>=0&&(_12d+ndx)<_12f.length){
_12e.removeChild(_12f[_12d+ndx]);
}
}
};
_3.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _fd(this.columns,data);
};
_3.DataView.prototype.addRow=function(_130,ndx,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(!_130){
_130=this.createRow();
}else{
if(!_130.id){
_130.id=this.getNextRowId();
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
this.rows.splice(ndx,0,_130);
}else{
this.rows.push(_130);
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
_3.DataView.prototype.deleteRow=function(_131,ui){
if(ui===_2){
ui=true;
}
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
var _132=-1;
if(typeof (_131)=="number"){
_132=_131;
this.rows.splice(_131,1);
}
if(typeof (_131)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_131){
_132=n;
this.rows.splice(n,1);
}
}
}
if(_132!=-1&&ui){
this._removeRowFromUI(_132);
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_132){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_132){
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
_3.DataView.prototype.searchRows=function(_133,_134){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_133]==_134){
ret.push(this.rows[n]);
}
}
return ret;
};
_3.DataView.prototype.setCellValue=function(_135,_136,_137){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return false;
}
var _138=this.__findColumn(_136);
if(_138==-1){
return false;
}
var _139=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_135){
_139=n;
break;
}
}
if(_139===null){
return false;
}
this.rows[_139][_136]=_137;
var cell=_1.getElementById(this.divId+"_cell_"+_135+"_"+_138);
if(typeof (this.columns[_138].Format)=="function"){
var _13a=this.columns[_138].Format(_137);
cell.innerHTML="";
if(typeof (_13a)=="string"){
cell.innerHTML=_13a;
}else{
cell.appendChild(_13a);
}
}else{
cell.innerHTML=_137;
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
var _13b;
if(!_1.getElementById(this.divId+"_message")){
_13b=_1.createElement("div");
_13b.id=this.divId+"_message";
_13b.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_13b);
}else{
_13b=_1.getElementById(this.divId+"_message");
}
_13b.innerHTML=msg;
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
_3.DataView.prototype._UISelectAll=function(_13c){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_3.className[(_13c?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_13c;
}
};
_3.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _13d=false;
if(!this.multiselect){
if(this.selectedRow==n){
_13d=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_13d=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_13d;
}
_3.className[(_13d?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_3.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_1.getElementById(this.divId+"_pageInput").value;
var _13e=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_13e){
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
var _13f=this.getTotalPages();
if(this.curPage<_13f-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_3.event.cancel(e);
return false;
};
_3.DataView.prototype.updateRows=function(_140){
if(!this.inDOM){
_3.error.report("Add table to DOM before working with rows");
return;
}
if(_140===_2){
_140=false;
}
var _141=null;
if(this.selectedRow!=-1&&this.rows[this.selectedRow]){
_141=this.rows[this.selectedRow].id;
}
var _142=[];
if(this.selectedRows.length){
for(var n=0;n<this.selectedRows.length;n++){
if(this.rows[this.selectedRows[n]]){
_142.push(this.rows[this.selectedRows[n]].id);
}
}
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_140){
this._cached.rows_body.innerHTML="";
}
var _143=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_143.length;n++){
var _144=_143[n].id.substr(_143[n].id.lastIndexOf("_")+1);
if(!this.getById(_144)){
this._cached.rows_body.removeChild(_143[n]);
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
if(!_140){
this.selectedRow=-1;
if(_141){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_141){
this.selectedRow=n;
break;
}
}
}
this.selectedRows=[];
if(_142.length){
for(var a=0;a<_142.length;a++){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_142[a]){
this.selectedRows.push(n);
break;
}
}
}
}
}
this._UIUpdateSelection();
if(_140){
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
var _145="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_145+=this.lang.noRows;
}else{
if(this.rows.length==1){
_145+="1 "+" "+this.lang.row;
}else{
_145+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_1.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_145+=this.lang.noRows;
}else{
var _146=(this.rowsPerPage*this.curPage);
var _147=(_146+this.rowsPerPage)>this.totalRows?this.totalRows:(_146+this.rowsPerPage);
_145+=(_146+1)+" - "+_147+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_145+="</li></ul>";
this._cached.footer.innerHTML=_145;
};
_3.DataView.prototype.__setOrder=function(_148){
if(!this.inDOM){
_3.error.report("Cant sort a DataView not in DOM");
return;
}
var _149=this.columns[_148].Name;
if(_148>=0&&_148<this.columns.length){
var _14a=this.multiselect?2:0;
var _14b=this._cached.headerUl.getElementsByTagName("li");
var _14c=this.__findColumn(this.orderBy);
_3.className.remove(_14b[_14a+(_14c*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_149){
this.orderBy=_149;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_3.className.add(_14b[_14a+(_148*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _14d=e.target||e.srcElement;
var _14e=this.divId+"_selectRow_";
if(_14d.nodeName.toLowerCase()=="input"&&_14d.id.substr(0,_14e.length)==_14e){
var _14f=_14d.id.substr(_14d.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14f){
this.__markRow(e,n);
break;
}
}
}else{
while(_14d.nodeName.toLowerCase()!="ul"){
if(_14d==this._cached.rows_body){
return;
}
_14d=_14d.parentNode;
}
var _14f=_14d.id.substr(_14d.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14f){
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
var _150=e.target||e.srcElement;
if(_150.nodeName.toLowerCase()=="a"){
colNdx=Number(_150.id.substr(_150.id.lastIndexOf("_")+1));
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
var _151=e.target||e.srcElement;
if(_151.nodeName.toLowerCase()=="li"&&_151.className=="dataViewFieldSep"){
var _152=Number(_151.id.substr(_151.id.lastIndexOf("_")+1));
if(!isNaN(_152)){
this.activateResizing(e,_152);
}
}
};
_3.DataView.prototype.__selectRow=function(e,_153){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_153){
e.unselecting=_153;
}else{
if(this.multiselect){
var _154=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_153){
_154=true;
break;
}
}
if(_154){
e.unselecting=_153;
}else{
e.selecting=_153;
}
}else{
e.selecting=_153;
}
}
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_153!=-1){
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
if(this.selectedRow==_153&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_153;
_3.className.add(rows[_153],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_153){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_153;
this.selectedRows=[_153];
}
}else{
if(e.ctrlKey){
var _154=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_153){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_154=true;
}
}
if(!_154){
this.selectedRow=_153;
this.selectedRows.push(_153);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_153){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_153;
for(var n=this.selectedRows[0];(_153>this.selectedRows[0]?n<=_153:n>=_153);(_153>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_153);
this.selectedRow=_153;
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
_3.DataView.prototype.__markRow=function(e,_155){
if(!e){
e=window.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_155;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var _156=this.rows[_155].id;
elem=_1.getElementById(this.divId+"_selectRow_"+_156);
if(elem.checked){
this.selectedRows.push(_155);
this.selectedRow=_155;
var row=_1.getElementById(this.divId+"_row_"+_156);
_3.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_155){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_1.getElementById(this.divId+"_row_"+_156);
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
_3.DataView.prototype.toggleColumn=function(_157){
if(this.columns[_157].show){
this.columns[_157].show=false;
}else{
this.columns[_157].show=true;
}
var _158=this.multiselect?2:0;
var _159=this._cached.headerUl.getElementsByTagName("li");
if(_157>=0&&((_158+(_157*2)+1)<_159.length)){
_3.className[this.columns[_157].show?"remove":"add"](_159[_158+(_157*2)],"dataViewColumnHidden");
_3.className[this.columns[_157].show?"remove":"add"](_159[_158+(_157*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_158=this.multiselect?1:0;
_3.className[this.columns[_157].show?"remove":"add"](rows[n].childNodes[_158+_157],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_157+2,this.columns[_157].show);
this._adjustColumnsWidth();
};
_3.DataView.prototype._adjustColumnsWidth=function(_15a){
if(this.columns.length&&this._cached){
if(_15a===_2){
_15a=false;
}
var _15b=false;
var _15c=this._getHeadersWidth();
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Width!=this.columns[n].origWidth){
_15b=true;
this.columns[n].Width=this.columns[n].origWidth;
}
}
var _15d=0;
var base=this.multiselect?2:0;
var lis=this._cached.headerUl.getElementsByTagName("li");
if(lis.length==(this.columns.length*2)+base&&_15c>0){
var _15e=0;
var _15f=false;
var _160=null;
var _161=0;
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
if(!_15f){
_160=_3.element.getInnerBox(lis[base+(n*2)]);
_161=_160.left+_160.right+lis[base+(n*2)+1].offsetWidth;
_15f=true;
break;
}
}
}
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_15e++;
if(this.columns[n].percentWidth!==null){
_15d+=_f8+_161;
}else{
_15d+=this.columns[n].Width+_161;
}
}
}
if(_15e&&_15c>=((_f8+_161)*_15e)){
while(_15d>_15c){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show&&this.columns[n].percentWidth===null&&this.columns[n].Width>_f8){
_15b=true;
this.columns[n].Width--;
_15d--;
}
if(_15d==_15c){
break;
}
}
}
}else{
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_15b=true;
this.columns[n].Width=_f8;
}
}
}
var _162=_15c-_15d;
if(_162){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].percentWidth!==null){
this.columns[n].Width+=_162*(this.columns[n].percentWidth/100);
}
}
}
if(_15b||_15a){
for(var n=0;n<this.columns.length;n++){
lis[base+(n*2)].style.width=this.columns[n].Width+"px";
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
var _163=this.multiselect?1:0;
for(var a=0;a<rows.length;a++){
var rLis=rows[a].getElementsByTagName("li");
for(var n=0;n<this.columns.length;n++){
rLis[_163+n].style.width=this.columns[n].Width+"px";
}
}
}
}
}
};
_3.DataView.prototype._getHeadersWidth=function(){
var _164=_1.getElementById(this.divId+"_optionsMenuBtn");
var _165=_3.element.getOuterBox(_164);
var _166=_3.element.getInnerBox(this._cached.headerUl);
var _167=0;
if(this.multiselect){
var lis=this._cached.headerUl.getElementsByTagName("li");
_167=lis[0].offsetWidth+lis[1].offsetWidth;
}
return this._cached.headerUl.offsetWidth-_166.left-_167-(_164.offsetWidth+_165.left+_165.right);
};
_3.DataView.prototype.__calculateTotalWidth=function(){
var _168=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_168+=cols[n].offsetWidth;
}
return _168;
};
_3.DataView.prototype.__sort=function(_169){
var n,_16a,swap;
if(!this.orderBy){
return;
}
for(n=_169+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_169][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_169][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_169][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_169][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_16a=this.rows[_169];
this.rows[_169]=this.rows[n];
this.rows[n]=_16a;
if(this.selectedRow==_169){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_169;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_169){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_169;
}
}
}
}
}
if(_169<this.rows.length-2){
this.__sort(_169+1);
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
_3.DataView.prototype.__getColumnSqlName=function(_16b){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_16b){
return this.columns[n].sqlName;
}
}
return false;
};
_3.DataView.prototype.activateResizing=function(e,_16c){
if(!e){
e=window.event;
}
if(this.columns[_16c].percentWidth===null){
this.resColumnId=_16c;
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
this.resizingFrom=this.columns[_16c].Width;
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
var _16d=Math.abs(this.resizingXCache-x);
var _16e=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _16f=this.resColumnId;
var _170=false;
if(!_16e){
if((this.columns[_16f].Width-_16d)>_f8){
this.columns[_16f].Width-=_16d;
this.columns[_16f].origWidth=this.columns[_16f].Width;
_170=true;
}
}else{
this.columns[_16f].Width+=_16d;
this.columns[_16f].origWidth=this.columns[_16f].Width;
_170=true;
}
if(_170){
this._adjustColumnsWidth(true);
}
};
_3.DataView.prototype.addDataType=function(name,_171){
if(typeof (name)!="string"){
_3.error.report("Invalid data type name.");
return;
}
if(typeof (_171)!="object"){
_3.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_171.toString)!="function"){
_3.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_fc[name]){
_fc[name]=_171;
}else{
_3.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.DataViewConnector=function(opts){
var _172={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_172,opts);
if(!_172.dataView){
_3.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_172.api)!="string"||_172.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_172.api;
this.dataView=_172.dataView;
this.parameters=_172.parameters;
this.type="json";
if(_172.type){
switch(_172.type.toLowerCase()){
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
if(typeof (_172.method)=="string"){
this.method=_172.method.toUpperCase()=="POST"?"POST":"GET";
}
_3.event.attach(this.dataView,"onrefresh",_3.bind(this._onRefresh,this));
this.httpRequest=new _3.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_3.bind(this._onError,this),onLoad:_3.bind(this._onLoad,this)});
};
_3.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _173="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_173+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_173+="&"+this.parameters;
}
this.httpRequest.send(_173);
_3.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
if(root.getAttribute("success")=="1"){
var _174=Number(root.getAttribute("totalrows"));
if(!isNaN(_174)){
this.dataView.totalRows=_174;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _175={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _176=cols[a].getAttribute("name");
if(_176&&cols[a].firstChild){
var _177=this.dataView.__findColumn(_176)!=-1?this.dataView.columns[this.dataView.__findColumn(_176)].Type:"alpha";
_175[_176]=_fc[_177](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_175),_2,false);
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
this.dataView.updateRows();
}else{
this.dataView.rows.length=0;
if(data.success){
var _174=Number(data.totalrows);
if(!isNaN(_174)){
this.dataView.totalRows=_174;
}
for(var n=0;n<data.rows.length;n++){
var _175={};
for(var _176 in data.rows[n]){
var _177=this.dataView.__findColumn(_176)!=-1?this.dataView.columns[this.dataView.__findColumn(_176)].Type:"alpha";
_175[_176]=_fc[_177](data.rows[n][_176]);
}
this.dataView.addRow(this.dataView.createRow(_175),_2,false);
}
}else{
this.dataView.setMessage(data.errormessage);
}
this.dataView.updateRows();
}
},_onError:function(_178){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_178+")");
}};
_3.DataView.prototype.lang={"noRows":"No hay filas para mostrar.","rows":"filas.","row":"fila.","pageStart":"Página ","pageMiddle":" de ","pageEnd":" Ir a página: ","pageGo":"Ir","pagePrev":"<< Anterior","pageNext":"Siguiente >>","refresh":"Actualizar","of":"de"};
var _179=function(opts){
var _17a={id:null,parentId:0,parent:null,Name:""};
_3.mixin(_17a,opts);
this.treeView=_17a.treeView;
this.id=_17a.id!==null?_17a.id:this.treeView.getNextNodeId();
this.parentId=_17a.parentId;
this.Name=String(_17a.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_17a.parent;
};
_179.prototype={searchNode:function(id){
var n;
var srch=null;
var _17b=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_17b<this.childNodes.length){
srch=this.childNodes[_17b].searchNode(id);
_17b++;
}
return srch;
},updateChildrenNodes:function(){
var _17c=_1.getElementById(this.treeView.divId+"_"+this.id+"_branch");
var _17d=_3.getInactiveLocation();
for(var i=0;i<this.childNodes.length;i++){
var node=_1.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_17c.appendChild(node);
var _17e="";
var _17f=this.childNodes[i].childNodes.length;
if(_17f){
_17e+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\""+_17d+"\" class=\"";
_17e+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_17e+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_17f){
_17e+="class=\"treeViewSingleNode\" ";
}
_17e+="href=\""+_17d+"\">"+this.childNodes[i].Name+"</a>";
if(_17f){
_17e+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_17e;
if(_17f){
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_3.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_3.event.attach(_1.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_3.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_17f){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_3.TreeView=function(opts){
var _180={canHaveChildren:false,hasInvalidator:true};
_3.mixin(_180,opts);
var cmp=_82.get(_180);
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
this.masterNode=new _179({id:0,parentId:0,parent:null,Name:"root",treeView:this});
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
var _181=true;
while(_181){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_181=false;
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
var _182;
if(!_1.getElementById(this.divId+"_message")){
_182=_1.createElement("div");
_182.id=this.divId+"_message";
_182.className="treeViewMessageDiv";
this.target.appendChild(_182);
}else{
_182=_1.getElementById(this.divId+"_message");
}
_182.innerHTML=msg;
}
};
_3.TreeView.prototype._expandNode=function(e,_183){
if(!e){
e=window.event;
}
var node=this.searchNode(_183);
if(node.expanded){
node.expanded=false;
_1.getElementById(this.divId+"_"+_183+"_expandable").className="treeViewExpandableNode";
_1.getElementById(this.divId+"_"+_183+"_branch").style.display="none";
}else{
node.expanded=true;
_1.getElementById(this.divId+"_"+_183+"_expandable").className="treeViewCollapsableNode";
_1.getElementById(this.divId+"_"+_183+"_branch").style.display="block";
}
_3.event.cancel(e);
return false;
};
_3.TreeView.prototype._selectNode=function(e,_184){
if(!e){
e=window.event;
}
if(this.selectedNode!==null){
var _185=this.searchNode(this.selectedNode);
_3.className.remove(_1.getElementById(this.divId+"_"+_185.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_184){
var _185=this.searchNode(_184);
_3.className.add(_1.getElementById(this.divId+"_"+_185.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_184)?null:_184;
_3.event.cancel(e,true);
return false;
};
_3.TreeView.prototype.addNode=function(opts,_186,ndx){
var _187=(_186==0)?this.masterNode:this.searchNode(_186);
if(_187){
var _188={treeView:this,parentId:_186,parent:_187,Name:""};
_3.mixin(_188,opts);
if(ndx>=0&&ndx<_187.childNodes.length){
_187.childNodes.splice(ndx,0,new _179(_188));
}else{
_187.childNodes.push(new _179(_188));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_3.TreeView.prototype.deleteNode=function(_189){
if(_189==0||_189=="0"){
return;
}
this._searchAndDelete(_189,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_3.TreeView.prototype._searchAndDelete=function(_18a,node){
var _18b=false;
if(typeof (_18a)=="number"||typeof (_18a)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_18a){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18b=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_18a){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18b=true;
break;
}
}
}
if(!_18b){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_18a);
if(done){
_18b=done;
break;
}
}
}
return _18b;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.TreeViewConnector=function(opts){
var _18c={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_18c,opts);
if(!_18c.treeView){
_3.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_18c.api)!="string"||_18c.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_18c.api;
this.treeView=_18c.treeView;
this.parameters=_18c.parameters;
this.type="json";
if(_18c.type){
switch(_18c.type.toLowerCase()){
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
if(typeof (_18c.method)=="string"){
this.method=_18c.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _179({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _18d=this._fetchNodes(root);
if(_18d.length){
this._addNodesFromXml(_18d,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _179({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_18e,_18f){
for(var n=0;n<_18e.length;n++){
var id=null;
if(_18e[n].getAttribute("id")){
id=_18e[n].getAttribute("id");
}
var _190=_18e[n].getElementsByTagName("label")[0];
if(_190){
labelStr=_190.firstChild.data;
}
var _191=_18e[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_18f);
if(_191){
this._addNodesFromXml(this._fetchNodes(_18e[n]),id);
}
}
},_addNodesFromJson:function(_192,_193){
for(var n=0;n<_192.length;n++){
this.treeView.addNode({Name:_192[n].label,id:_192[n].id},_193);
if(_192[n].nodes){
this._addNodesFromJson(_192[n].nodes,_192[n].id);
}
}
},_onError:function(_194){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_194+")");
}};
_3.CalendarView=function(opts){
var _195=new Date();
var _196={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_195.getMonth(),year:_195.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_3.mixin(_196,opts);
var cmp=_82.get(_196);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_196.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_196.month))&&_196.month>=0&&_196.month<12)?_196.month:_195.getMonth();
this.curYear=(!isNaN(Number(_196.year))&&_196.year>0)?_196.year:new _195.getFullYear();
this.disabledBefore=_196.disabledBefore;
this.disabledAfter=_196.disabledAfter;
this.disabledDays=_196.disabledDays;
this.disabledDates=_196.disabledDates;
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
var _197="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_197+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_197+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _198=new Date();
if(this.selectedDates.length){
_198=this.selectedDates[0];
}
_197+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_197+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_198.getDate()+"\" /></p>";
_197+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_197+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_197+="<option value=\""+n+"\""+(_198.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_197+="</select></p>";
_197+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_197+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_198.getFullYear()+"\" /></p>";
_197+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_197+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_197+="</div>";
_197+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_197;
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
var _199=_1.getElementById(this.divId+"_body");
_199.style.display="";
_1.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
while(_199.firstChild){
_199.removeChild(_199.firstChild);
}
var _19a=_1.createElement("thead");
var _19b,_19c,_19d,tmpA;
var _19b=_1.createElement("tr");
for(var n=0;n<7;n++){
_19c=_1.createElement("th");
_19c.appendChild(_1.createTextNode(this.lang.shortDays[n]));
_19b.appendChild(_19c);
}
_19a.appendChild(_19b);
_199.appendChild(_19a);
var _19e=new Date();
var _19f=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _1a0=new Date(_19f.getTime());
_1a0.setMonth(_1a0.getMonth()+1);
var _1a1=_19f.getDay();
var _1a2=0;
var _1a3=_1.createElement("tbody");
var _19b=_1.createElement("tr");
while(_1a2<_1a1){
_19d=_1.createElement("td");
_19d.appendChild(_1.createTextNode(" "));
_19b.appendChild(_19d);
_1a2++;
}
while(_19f<_1a0){
_19d=_1.createElement("td");
_19d.setAttribute("align","left");
_19d.setAttribute("valign","top");
tmpA=_1.createElement("a");
tmpA.setAttribute("href",_3.getInactiveLocation());
tmpA.appendChild(_1.createTextNode(_19f.getDate()));
var _1a4=false;
if(this.isEqual(_19f,_19e)){
_1a4=true;
}
var _1a5=false;
if(this.isDisabledDate(_19f)){
_1a5=true;
if(_1a4){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_19f,this.markedDates[n])){
_1a5=true;
if(_1a4){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_19f,this.selectedDates[n])){
_1a5=true;
if(_1a4){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_1a5&&_1a4){
tmpA.className="calendarToday";
}
_19d.appendChild(tmpA);
_19b.appendChild(_19d);
_3.event.attach(tmpA,"onclick",_3.bind(this.selectDate,this,_19f.getDate()));
_19f.setDate(_19f.getDate()+1);
_1a2++;
if(_1a2>6){
_1a3.appendChild(_19b);
_19b=_1.createElement("tr");
_1a2=0;
}
}
if(_1a2>0){
_1a3.appendChild(_19b);
while(_1a2<7){
_19d=_1.createElement("td");
_19d.appendChild(_1.createTextNode(" "));
_19b.appendChild(_19d);
_1a2++;
}
}
_199.appendChild(_1a3);
this.__refreshHeader();
this.__refreshFooter();
};
_3.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a6=_1.getElementById(this.divId+"_header");
_1a6.innerHTML="";
var _1a7=_3.getInactiveLocation();
var _1a8="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\""+_1a7+"\"> </a></li>";
_1a8+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\""+_1a7+"\"> </a></li>";
_1a8+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\""+_1a7+"\"> </a></li>";
_1a8+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1a8+="</ul>";
_1a6.innerHTML=_1a8;
_3.event.attach(_1.getElementById(this.divId+"_prevMonth"),"onclick",_3.bind(this.goPrevMonth,this));
_3.event.attach(_1.getElementById(this.divId+"_viewAdvanced"),"onclick",_3.bind(this.setAdvanced,this));
_3.event.attach(_1.getElementById(this.divId+"_nextMonth"),"onclick",_3.bind(this.goNextMonth,this));
};
_3.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_3.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a9=_1.getElementById(this.divId+"_footer");
_1a9.innerHTML="";
var _1aa="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\""+_3.getInactiveLocation()+"\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_1aa+=text;
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
_1aa+=text;
}
}else{
_1aa+=this.lang.noSelection+"</p>";
}
_1a9.innerHTML=_1aa;
_3.event.attach(_1.getElementById(this.divId+"_goHome"),"onclick",_3.bind(this.goHomeDate,this));
};
_3.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=window.event;
}
_1.getElementById(this.divId+"_body").style.display="none";
_1.getElementById(this.divId+"_advanced").style.display="block";
var _1ab=new Date();
if(this.selectedDates.length){
_1ab=this.selectedDates[0];
}
_1.getElementById(this.divId+"DaySelector").value=_1ab.getDate();
_1.getElementById(this.divId+"MonthSelector").selectedIndex=_1ab.getMonth();
_1.getElementById(this.divId+"YearSelector").value=_1ab.getFullYear();
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
var _1ac=_1.getElementById(this.divId+"DaySelector").value;
var _1ad=_1.getElementById(this.divId+"MonthSelector").value;
var _1ae=_1.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1ac))){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1ae))){
alert(this.lang.error2);
_3.event.cancel(e,true);
return false;
}
var _1af=new Date(_1ae,_1ad,_1ac);
if(_1af.getMonth()!=_1ad){
alert(this.lang.error1);
_3.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1af)){
alert(this.lang.error3);
_3.event.cancel(e,true);
return false;
}
var _1b0={selecting:_1af,selectedDates:this.selectedDates};
_1b0=_3.event.fire(this,"onselect",_1b0);
if(_1b0.returnValue==false){
_3.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1af;
this.goHomeDate(e);
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=window.event;
}
var _1b1=new Date(this.curYear,this.curMonth,date);
var _1b2={selecting:_1b1,selectedDates:this.selectedDates};
_1b2=_3.event.fire(this,"onselect",_1b2);
if(_1b2.returnValue==false){
_3.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1b1)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1b1;
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
_3.CalendarView.prototype.isEqual=function(_1b3,_1b4){
if(_1b3.getFullYear()==_1b4.getFullYear()&&_1b3.getMonth()==_1b4.getMonth()&&_1b3.getDate()==_1b4.getDate()){
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
var _1b5;
if(this.selectedDates.length){
_1b5=this.selectedDates[0];
}else{
_1b5=new Date();
}
this.curMonth=_1b5.getMonth();
this.curYear=_1b5.getFullYear();
this.updateDates();
_3.event.cancel(e,true);
return false;
};
_3.CalendarView.prototype.hook=function(_1b6){
var elem=null;
if(typeof (_1b6)=="string"){
elem=_1.getElementById(_1b6);
}else{
if(_3.isHTMLElement(_1b6)){
elem=_1b6;
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
var _1b7=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1b7.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1b7.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_3.event.detach(_1,"onclick",this._hideHookedBind);
}
};
_3.CalendarView.prototype.getDateFromStr=function(str){
var _1b8=str.split("/");
var ret;
if(!isNaN(Number(_1b8[0]))&&!isNaN(Number(_1b8[1]))&&!isNaN(Number(_1b8[2]))){
if(this.lang.isFrenchDateFormat){
if(_1b8[1]>0&&_1b8[1]<13&&_1b8[0]>0&&_1b8[0]<32&&_1b8[2]>0){
ret=new Date(_1b8[2],_1b8[1]-1,_1b8[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1b8[0]>0&&_1b8[0]<13&&_1b8[1]>0&&_1b8[1]<32&&_1b8[2]>0){
ret=new Date(_1b8[2],_1b8[1]-1,_1b8[0],0,0,0);
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
var _1b9=function(_1ba,path,name){
this.thumbnail=_1ba;
this.path=path;
this.name=name;
};
_3.GalleryView=function(opts){
var _1bb={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_3.mixin(_1bb,opts);
var cmp=_82.get(_1bb);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1bb.showNames;
this.fixedThumbSize=_1bb.fixedThumbSize;
this.thumbWidth=_1bb.thumbWidth;
this.thumbHeight=_1bb.thumbHeight;
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
var _1bc={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_3.mixin(_1bc,opts);
if(!_1bc.thumbnail){
_3.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1bc.insertIndex==this.images.length){
this.images.push(new _1b9(_1bc.thumbnail,_1bc.path,_1bc.name));
}else{
this.images.splice(_1bc.insertIndex,0,new _1b9(_1bc.thumbnail,_1bc.path,_1bc.name));
}
if(this.inDOM){
this.updateImages();
}
};
_3.GalleryView.prototype.deleteImage=function(_1bd){
if(typeof (_1bd)=="number"){
this.images.splice(_1bd,1);
}else{
if(typeof (_1bd)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1bd){
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
var _1be;
if(!_1.getElementById(this.divId+"_message")){
_1be=_1.createElement("p");
_1be.id=this.divId+"_message";
this.target.appendChild(_1be);
}else{
_1be=_1.getElementById(this.divId+"_message");
}
_1be.innerHTML=msg;
}
};
_3.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_3.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1bf="";
for(var n=0;n<this.images.length;n++){
_1bf+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1bf+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1bf+="class=\"gvSelectedImage\" ";
}
_1bf+=">";
_1bf+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1bf+="<p>"+this.images[n].name+"</p>";
}
_1bf+="</div>";
}
this.cmpTarget.innerHTML=_1bf;
for(var n=0;n<this.images.length;n++){
_3.event.attach(_1.getElementById(this.divId+"_img_"+n),"onclick",_3.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_3.GalleryView.prototype._selectImage=function(e,_1c0){
if(!e){
e=window.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1c0;
e=_3.event.fire(this,"onselect",e);
if(e.returnValue==false){
_3.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1c0!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1c0){
this.selectedImage=-1;
}else{
this.selectedImage=_1c0;
imgs[_1c0].parentNode.className="gvSelectedImage";
}
}
_3.event.cancel(e);
return false;
};
if(_3.DataConnectors===_2){
_3.DataConnectors={};
}
_3.DataConnectors.GalleryViewConnector=function(opts){
var _1c1={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_3.mixin(_1c1,opts);
if(!_1c1.galleryView){
_3.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1c1.api)!="string"||_1c1.api==""){
_3.error.report("Invalid Api string.");
return;
}
this.api=_1c1.api;
this.galleryView=_1c1.galleryView;
this.parameters=_1c1.parameters;
this.type="json";
if(_1c1.type){
switch(_1c1.type.toLowerCase()){
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
if(typeof (_1c1.method)=="string"){
this.method=_1c1.method.toUpperCase()=="POST"?"POST":"GET";
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
var _1c2=root.getElementsByTagName("image");
for(var n=0;n<_1c2.length;n++){
var _1c3=_1c2.item(n).getElementsByTagName("thumbnail");
var path=_1c2.item(n).getElementsByTagName("path");
var name=_1c2.item(n).getElementsByTagName("name");
var _1c4="";
var _1c5="";
var _1c6="";
if(_1c3.length){
if(_1c3.item(0).firstChild){
_1c4=_1c3.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1c5=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1c6=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1b9(_1c4,_1c5,_1c6));
var _1c7=_1c2.item(n).getElementsByTagName("param");
if(_1c7.length){
for(var a=0;a<_1c7.length;a++){
var _1c8=_1c7.item(a).getAttribute("name");
var _1c9="";
if(_1c7.item(a).firstChild){
_1c9=_1c7.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1c8]=_1c9;
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
var _1c4=data.images[n].thumbnail;
var _1c5=data.images[n].path;
var _1c6=data.images[n].name;
this.galleryView.images.push(new _1b9(_1c4,_1c5,_1c6));
for(var _1ca in data.images[n]){
if(_1ca!="thumbnail"&&_1ca!="path"&&_1ca!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1ca]=data.images[n][_1ca];
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
},_onError:function(_1cb){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1cb+")");
}};
_3.Toolbar=function(opts){
var _1cc={canHaveChildren:true,hasInvalidator:true};
_3.mixin(_1cc,opts);
var cmp=_82.get(_1cc);
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
var _1cd=this.cmpTarget.offsetWidth;
var _1ce=_1cd;
var _1cf=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1d0=parseInt(_3.className.getComputedProperty(this._moreSpan,"margin-right"));
_1cd-=(this._moreSpan.offsetWidth+_1cf+_1d0);
var _1d1=0;
var _1d2=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1d3=this.cmpTarget.childNodes[n];
var _1d4=parseInt(_3.className.getComputedProperty(_1d3,"margin-left"));
var _1d5=parseInt(_3.className.getComputedProperty(_1d3,"margin-right"));
if(isNaN(_1d4)){
_1d4=0;
}
if(isNaN(_1d5)){
_1d5=0;
}
_1d1+=_1d3.offsetWidth+_1d4+_1d5;
if(n==this.cmpTarget.childNodes.length-1){
_1cd=_1ce;
}
if(_1d1>=_1cd){
if(!this._showingMore){
this.showMore();
}
if(!_1d2){
this._extraBtns=n;
_1d2=true;
}
_3.className.remove(_1d3,"jsToolbarLast");
_1d3.style.visibility="hidden";
if(n>0){
_3.className.add(this.buttons[n-1].target,"jsToolbarLast");
}
}else{
if(n<this.buttons.length-1){
_3.className.remove(_1d3,"jsToolbarLast");
}else{
_3.className.add(_1d3,"jsToolbarLast");
}
_1d3.style.visibility="visible";
}
}
if(_1d1<_1cd){
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
var _1d6={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_3.mixin(_1d6,opts);
_1d6.target=_1.createElement("span");
_1d6.target.id=this.divId+"_btn_"+_1d6.id;
var _1d7="";
if(typeof (_1d6.onContentAdded)!="function"){
_1d7="<a"+(_1d6.className?" class=\""+_1d6.className+"\" ":"")+" href=\""+_3.getInactiveLocation()+"\">"+_1d6.label+"</a>";
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
_1d6.target.className="jsToolbarFirst";
}
if(ndx==this.buttons.length){
if(this.buttons.length){
_3.className.remove(this.buttons[this.buttons.length-1].target,"jsToolbarLast");
}
_3.className.add(_1d6.target,"jsToolbarLast");
}
if(ndx==this.buttons.length){
this.buttons.push(_1d6);
this.cmpTarget.appendChild(_1d6.target);
}else{
if(ndx==0){
this.buttons.splice(ndx,0,_1d6);
}
this.cmpTarget.insertBefore(_1d6.target,this.cmpTarget.childNodes[ndx]);
}
_1d6.target.innerHTML=_1d7;
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
var _1d8=true;
while(_1d8){
_1d8=false;
var _1d9=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1d9){
_1d8=true;
break;
}
}
}
return _1d9;
};
_3.Toolbar.prototype.removeButton=function(_1da){
var ndx=null;
if(typeof (_1da)=="number"){
ndx=ref;
}else{
if(typeof (_1da)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1da){
ndx=n;
break;
}
}
}else{
if(typeof (_1da)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1da){
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
var _1db={canHaveChildren:true,hasInvalidator:true,centerOnShow:true,x:0,y:0,width:400,height:300,closable:true,title:"Dialog"};
_3.mixin(_1db,opts);
var cmp=_82.get(_1db);
_3.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Dialog";
this.centerOnShow=_1db.centerOnShow?true:false;
this.closable=_1db.closable?true:false;
this.title=_1db.title;
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
var _1dc=_3.element.getInnerBox(this.target);
var _1dd=this._titlePanel.offsetHeight;
this.cmpTarget.style.height=(this.title?((this.height-_1dd-_1dc.top-_1dc.bottom)+"px"):"100%");
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
var _1de=x-this._cacheX;
var _1df=y-this._cacheY;
this.x+=_1de;
this.y+=_1df;
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1e0=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1e1,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1e2(_1e3){
_1e0.lastIndex=0;
return _1e0.test(_1e3)?"\""+_1e3.replace(_1e0,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1e3+"\"";
};
function str(key,_1e4){
var i,k,v,_1e5,mind=gap,_1e6,_1e7=_1e4[key];
if(_1e7&&typeof _1e7==="object"&&typeof _1e7.toJSON==="function"){
_1e7=_1e7.toJSON(key);
}
if(typeof rep==="function"){
_1e7=rep.call(_1e4,key,_1e7);
}
switch(typeof _1e7){
case "string":
return _1e2(_1e7);
case "number":
return isFinite(_1e7)?String(_1e7):"null";
case "boolean":
case "null":
return String(_1e7);
case "object":
if(!_1e7){
return "null";
}
gap+=_1e1;
_1e6=[];
if(Object.prototype.toString.apply(_1e7)==="[object Array]"){
_1e5=_1e7.length;
for(i=0;i<_1e5;i+=1){
_1e6[i]=str(i,_1e7)||"null";
}
v=_1e6.length===0?"[]":gap?"[\n"+gap+_1e6.join(",\n"+gap)+"\n"+mind+"]":"["+_1e6.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1e5=rep.length;
for(i=0;i<_1e5;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1e7);
if(v){
_1e6.push(_1e2(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1e7){
if(Object.hasOwnProperty.call(_1e7,k)){
v=str(k,_1e7);
if(v){
_1e6.push(_1e2(k)+(gap?": ":":")+v);
}
}
}
}
v=_1e6.length===0?"{}":gap?"{\n"+gap+_1e6.join(",\n"+gap)+"\n"+mind+"}":"{"+_1e6.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1e8,_1e9,_1ea){
var i;
gap="";
_1e1="";
if(typeof _1ea==="number"){
for(i=0;i<_1ea;i+=1){
_1e1+=" ";
}
}else{
if(typeof _1ea==="string"){
_1e1=_1ea;
}
}
rep=_1e9;
if(_1e9&&typeof _1e9!=="function"&&(typeof _1e9!=="object"||typeof _1e9.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1e8});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1eb){
var j;
function walk(_1ec,key){
var k,v,_1ed=_1ec[key];
if(_1ed&&typeof _1ed==="object"){
for(k in _1ed){
if(Object.hasOwnProperty.call(_1ed,k)){
v=walk(_1ed,k);
if(v!==undefined){
_1ed[k]=v;
}else{
delete _1ed[k];
}
}
}
}
return _1eb.call(_1ec,key,_1ed);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1eb==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

