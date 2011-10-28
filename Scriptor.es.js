window.Scriptor=(function(_1,_2,_3){
var _4={version:{major:2,minor:2,instance:"alpha 1",toString:function(){
return this.major+"."+this.minor+" "+this.instance;
}},bind:function(_5,_6){
if(arguments.length>2){
var _7=[];
for(var n=2;n<arguments.length;n++){
_7.push(arguments[n]);
}
return function(){
var _8=[];
for(var i=0;i<arguments.length;i++){
_8.push(arguments[i]);
}
for(var i=0;i<_7.length;i++){
_8.push(_7[i]);
}
return _5.apply(_6,_8);
};
}else{
return function(){
return _5.apply(_6,arguments);
};
}
},bindAsEventListener:function(_9,_a){
if(arguments.length>2){
var _b=[];
for(var n=2;n<arguments.length;n++){
_b.push(arguments[n]);
}
return function(e){
var _c=[e||_1.event];
for(var i=0;i<_b.length;i++){
_c.push(_b[i]);
}
return _9.apply(_a,_c);
};
}else{
return function(e){
return _9.apply(_a,[e||_1.event]);
};
}
},mixin:function(_d,_e){
if(!_d){
_d={};
}
for(var i=1,l=arguments.length;i<l;i++){
_4._mixin(_d,arguments[i]);
}
return _d;
},_mixin:function(_f,_10){
var _11,_12,_13={};
for(var i in {toString:1}){
_11=[];
break;
}
_11=_11||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
_12=_11.length;
var _14,s,i;
for(_14 in _10){
s=_10[_14];
if(!(_14 in _f)||(_f[_14]!==s&&(!(_14 in _13)||_13[_14]!==s))){
_f[_14]=s;
}
}
if(_12&&_10){
for(i=0;i<_12;++i){
_14=_11[i];
s=_10[_14];
if(!(_14 in _f)||(_f[_14]!==s&&(!(_14 in _13)||_13[_14]!==s))){
_f[_14]=s;
}
}
}
return _f;
},event:{init:function(obj){
obj._customEventStacks={};
},registerCustomEvent:function(obj,_15,_16){
_16=_16||obj;
if(obj._customEventStacks){
obj._customEventStacks[_15]={context:_16,stack:[]};
}
},attach:function(_17,evt,_18){
if(_4.isHtmlElement(_17)||_17===_2||_17===_1){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(_17.addEventListener){
_17.addEventListener(evt,_18,false);
}else{
if(_17.attachEvent){
_17.attachEvent("on"+evt,_18);
}
}
}else{
if(_17._customEventStacks){
if(_17._customEventStacks[evt]){
_4.event.detach(_17,evt,_18);
_17._customEventStacks[evt].stack.push(_18);
}
}
}
return [_17,evt,_18];
},detach:function(){
var _19,evt,_1a;
if(typeof (arguments[0])=="object"&&arguments[0].length){
htmlElement=arguments[0][0];
evt=arguments[0][1];
_1a=arguments[0][2];
}else{
htmlElement=arguments[0];
evt=arguments[1];
_1a=arguments[2];
}
if(_4.isHtmlElement(htmlElement)||htmlElement===_2||htmlElement===_1){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(htmlElement.removeEventListener){
htmlElement.removeEventListener(evt,_1a,false);
}else{
if(htmlElement.detachEvent){
htmlElement.detachEvent("on"+evt,_1a);
}
}
}else{
if(htmlElement._customEventStacks){
if(htmlElement._customEventStacks[evt]){
for(var n=0;n<htmlElement._customEventStacks[evt].stack.length;n++){
if(htmlElement._customEventStacks[evt].stack[n]==_1a){
htmlElement._customEventStacks[evt].stack.splice(n,1);
break;
}
}
}
}
}
},fire:function(obj,evt,_1b){
_1b=typeof (_1b)=="object"?_1b:{};
_1b.customEventName=evt;
if(_1b.returnValue===_3){
_1b.returnValue=true;
}
if(!obj._customEventStacks||!obj._customEventStacks[evt]||!obj._customEventStacks[evt].stack.length){
return _1b;
}
var _1c=[_1b];
for(var n=0;n<obj._customEventStacks[evt].stack.length;n++){
obj._customEventStacks[evt].stack[n].apply(obj._customEventStacks[evt].context,_1c);
}
return _1b;
},cancel:function(e,_1d){
if(!e){
return;
}
if(typeof (_1d)=="undefined"){
_1d=true;
}
if(typeof (e.preventDefault)=="function"){
e.preventDefault();
}
e.returnValue=false;
if(_1d){
if(typeof (e.stopPropagation)=="function"){
e.stopPropagation();
}
e.cancelBubble=true;
}
},getPointXY:function(evt){
if(evt.pageX===_3&&evt.clientX===_3){
return {x:0,y:0};
}
return {x:evt.pageX||(evt.clientX+(_2.documentElement.scrollLeft||_2.body.scrollLeft)),y:evt.pageY||(evt.clientY+(_2.documentElement.scrollTop||_2.body.scrollTop))};
}},className:{has:function(_1e,_1f){
if(!(_1e)){
return false;
}
var _20=_1e.className;
var _21=new RegExp("(^|\\s)"+_1f+"(\\s|$)");
return (_20.length>0&&(_20==_1f||_21.test(_20)));
},add:function(_22,_23){
if(typeof (_23)!="string"){
return;
}
if(!(_22)){
return;
}
if(_22.className===_3){
_22.className="";
}
if(!_4.className.has(_22,_23)){
_22.className+=(_22.className?" ":"")+_23;
}
},remove:function(_24,_25){
if(typeof (_25)!="string"){
return;
}
if(!(_24)){
return;
}
if(_24.className===_3){
_24.className="";
}
_24.className=_24.className.replace(new RegExp("(^|\\s+)"+_25+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"");
},getComputedProperty:function(el,_26){
if(_1.getComputedStyle){
var st=_1.getComputedStyle(el,null);
if(st){
return st.getPropertyValue(_26);
}
}else{
if(el.currentStyle){
st=el.currentStyle;
if(st){
var _27="";
var _28=false;
for(var n=0;n<_26.length;n++){
var c=_26.substr(n,1);
if(c=="-"){
_28=true;
}else{
if(_28){
_27+=c.toUpperCase();
_28=false;
}else{
_27+=c;
}
}
}
return st[_27];
}
}
}
return null;
}},cookie:{cookies:{},init:function(){
var ca=_2.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _29=c.substring(0,c.indexOf("="));
this.cookies[_29]=c.substring(_29.length+1,c.length);
}
},get:function(_2a){
return this.cookies[_2a]?this.cookies[_2a]:"";
},create:function(_2b,_2c,_2d){
if(_2d){
var _2e=new Date();
_2e.setTime(_2e.getTime()+(_2d*24*60*60*1000));
var _2f="; expires="+_2e.toGMTString();
}else{
var _2f="";
}
_2.cookie=_2b+"="+_2c+_2f+"; path=/";
this.cookies[_2b]=_2c;
},erase:function(_30){
this.create(_30,"",-1);
delete this.cookies[_30];
}},isHtmlElement:function(o){
var _31=_2.getElementsByTagName("head")[0];
if(o===_4.body()||o===_31){
return true;
}
if(o==_2||o===_1){
return false;
}
if(!o){
return false;
}
if(typeof (o.cloneNode)!="function"&&typeof (o.cloneNode)!="object"){
return false;
}
var a=_2.createElement("div");
try{
var _32=o.cloneNode(false);
a.appendChild(_32);
a.removeChild(_32);
a=null;
_32=null;
return (o.nodeType!=3);
}
catch(e){
a=null;
return false;
}
},addOnLoad:function(f){
if(_1.onload){
var _33=_1.onload;
_1.onload=function(){
_33();
f();
};
}else{
_1.onload=f;
}
},error:{alertErrors:false,muteErrors:false,report:function(msg){
if(_4.error.alertErrors){
alert(msg);
}
if(!_4.error.muteErrors){
throw msg;
}
}},makeTransparent:function(obj,ndx){
if(obj.style){
if(obj.style.opacity!==_3){
obj.style.opacity="0."+ndx;
}else{
if(obj.style.MozOpacity!==_3){
obj.style.MozOpacity="0."+ndx;
}else{
if(obj.style.filter!==_3){
obj.style.filter="alpha(opacity="+ndx+");";
}
}
}
}
},body:function(){
if(!_34){
_34=_2.getElementsByTagName("body")[0];
}
return _34;
},getInactiveLocation:function(){
return String((_1.location.href.indexOf("#")!=-1)?_1.location.href:_1.location.href+"#");
},invalidate:function(_35,msg){
if(_35){
_4._calculateBrowserSize();
var _36=_2.getElementById("scriptor_invalidator");
if(!_36){
_36=_2.createElement("div");
_36.id="scriptor_invalidator";
_4.makeTransparent(_36,50);
_36.style.width=_37+"px";
_36.style.height=_38+"px";
_2.getElementsByTagName("body")[0].appendChild(_36);
}
if(msg){
if(!_36.firstChild){
var _39="<div class=\"msg\">"+msg+"</div>";
_36.innerHTML=_39;
_36.firstChild.style.left=((_37/2)-100)+"px";
_36.firstChild.style.top=((_38/2)-15)+"px";
}
}
_4.event.attach(_1,"onresize",_4._calculateBrowserSize);
}else{
if(_2.getElementById("scriptor_invalidator")){
_2.getElementById("scriptor_invalidator").parentNode.removeChild(_2.getElementById("scriptor_invalidator"));
}
_4.event.detach(_1,"onresize",_4._calculateBrowserSize);
}
},_calculateBrowserSize:function(){
if(navigator.userAgent.indexOf("MSIE")!=-1){
if(_2.documentElement.clientWidth==0){
_37=_2.body.clientWidth;
}else{
_37=_2.documentElement.clientWidth;
}
if(_2.documentElement.clientHeight==0){
_38=_2.body.clientHeight;
}else{
_38=_2.documentElement.clientHeight;
}
}else{
_37=_1.innerWidth;
_38=_1.innerHeight;
}
var x,y;
var _3a=_2.body.scrollHeight;
var _3b=_2.body.offsetHeight;
if(_3a>_3b){
x=_2.body.scrollWidth;
y=_2.body.scrollHeight;
}else{
x=_2.body.offsetWidth;
y=_2.body.offsetHeight;
}
_37=Math.max(_37,x);
_38=Math.max(_38,y);
var inv=_2.getElementById("scriptor_invalidator");
if(inv){
inv.style.width=_37+"px";
inv.style.height=_38+"px";
if(inv.firstChild){
inv.firstChild.style.left=((_37/2)-100)+"px";
inv.firstChild.style.top=((_38/2)-15)+"px";
}
}
},element:{getInnerBox:function(_3c){
var box={top:0,bottom:0,left:0,right:0};
var _3d=parseInt(_4.className.getComputedProperty(_3c,"padding-top"));
var _3e=parseInt(_4.className.getComputedProperty(_3c,"padding-bottom"));
var _3f=parseInt(_4.className.getComputedProperty(_3c,"padding-left"));
var _40=parseInt(_4.className.getComputedProperty(_3c,"padding-right"));
if(!isNaN(_3d)){
box.top=_3d;
}
if(!isNaN(_3e)){
box.bottom=_3e;
}
if(!isNaN(_3f)){
box.left=_3f;
}
if(!isNaN(_40)){
box.right=_40;
}
var _41=parseInt(_4.className.getComputedProperty(_3c,"border-top-width"));
var _42=parseInt(_4.className.getComputedProperty(_3c,"border-bottom-width"));
var _43=parseInt(_4.className.getComputedProperty(_3c,"border-left-width"));
var _44=parseInt(_4.className.getComputedProperty(_3c,"border-right-width"));
if(!isNaN(_41)){
box.top+=_41;
}
if(!isNaN(_42)){
box.bottom+=_42;
}
if(!isNaN(_43)){
box.left+=_43;
}
if(!isNaN(_44)){
box.right+=_44;
}
return box;
},getOuterBox:function(_45){
var box={top:0,bottom:0,left:0,right:0};
var _46=parseInt(_4.className.getComputedProperty(_45,"margin-top"));
var _47=parseInt(_4.className.getComputedProperty(_45,"margin-bottom"));
var _48=parseInt(_4.className.getComputedProperty(_45,"margin-left"));
var _49=parseInt(_4.className.getComputedProperty(_45,"margin-right"));
if(!isNaN(_46)){
box.top=_46;
}
if(!isNaN(_47)){
box.bottom=_47;
}
if(!isNaN(_48)){
box.left=_48;
}
if(!isNaN(_49)){
box.right=_49;
}
return box;
}},SHA1:function(msg){
var _4a=function(n,s){
var t4=(n<<s)|(n>>>(32-s));
return t4;
};
var _4b=function(val){
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
var _4c=function(val){
var str="";
var i;
var v;
for(i=7;i>=0;i--){
v=(val>>>(i*4))&15;
str+=v.toString(16);
}
return str;
};
var _4d=function(_4e){
_4e=_4e.replace(/\r\n/g,"\n");
var _4f="";
for(var n=0;n<_4e.length;n++){
var c=_4e.charCodeAt(n);
if(c<128){
_4f+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_4f+=String.fromCharCode((c>>6)|192);
_4f+=String.fromCharCode((c&63)|128);
}else{
_4f+=String.fromCharCode((c>>12)|224);
_4f+=String.fromCharCode(((c>>6)&63)|128);
_4f+=String.fromCharCode((c&63)|128);
}
}
}
return _4f;
};
var _50;
var i,j;
var W=new Array(80);
var H0=1732584193;
var H1=4023233417;
var H2=2562383102;
var H3=271733878;
var H4=3285377520;
var A,B,C,D,E;
var _51;
msg=_4d(msg);
var _52=msg.length;
var _53=new Array();
for(i=0;i<_52-3;i+=4){
j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);
_53.push(j);
}
switch(_52%4){
case 0:
i=2147483648;
break;
case 1:
i=msg.charCodeAt(_52-1)<<24|8388608;
break;
case 2:
i=msg.charCodeAt(_52-2)<<24|msg.charCodeAt(_52-1)<<16|32768;
break;
case 3:
i=msg.charCodeAt(_52-3)<<24|msg.charCodeAt(_52-2)<<16|msg.charCodeAt(_52-1)<<8|128;
break;
}
_53.push(i);
while((_53.length%16)!=14){
_53.push(0);
}
_53.push(_52>>>29);
_53.push((_52<<3)&4294967295);
for(_50=0;_50<_53.length;_50+=16){
for(i=0;i<16;i++){
W[i]=_53[_50+i];
}
for(i=16;i<=79;i++){
W[i]=_4a(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
}
A=H0;
B=H1;
C=H2;
D=H3;
E=H4;
for(i=0;i<=19;i++){
_51=(_4a(A,5)+((B&C)|(~B&D))+E+W[i]+1518500249)&4294967295;
E=D;
D=C;
C=_4a(B,30);
B=A;
A=_51;
}
for(i=20;i<=39;i++){
_51=(_4a(A,5)+(B^C^D)+E+W[i]+1859775393)&4294967295;
E=D;
D=C;
C=_4a(B,30);
B=A;
A=_51;
}
for(i=40;i<=59;i++){
_51=(_4a(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+2400959708)&4294967295;
E=D;
D=C;
C=_4a(B,30);
B=A;
A=_51;
}
for(i=60;i<=79;i++){
_51=(_4a(A,5)+(B^C^D)+E+W[i]+3395469782)&4294967295;
E=D;
D=C;
C=_4a(B,30);
B=A;
A=_51;
}
H0=(H0+A)&4294967295;
H1=(H1+B)&4294967295;
H2=(H2+C)&4294967295;
H3=(H3+D)&4294967295;
H4=(H4+E)&4294967295;
}
var _51=_4c(H0)+_4c(H1)+_4c(H2)+_4c(H3)+_4c(H4);
return _51.toLowerCase();
},MD5:function(_54){
var _55=function(_56,_57){
return (_56<<_57)|(_56>>>(32-_57));
};
var _58=function(lX,lY){
var lX4,lY4,lX8,lY8,_59;
lX8=(lX&2147483648);
lY8=(lY&2147483648);
lX4=(lX&1073741824);
lY4=(lY&1073741824);
_59=(lX&1073741823)+(lY&1073741823);
if(lX4&lY4){
return (_59^2147483648^lX8^lY8);
}
if(lX4|lY4){
if(_59&1073741824){
return (_59^3221225472^lX8^lY8);
}else{
return (_59^1073741824^lX8^lY8);
}
}else{
return (_59^lX8^lY8);
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
a=_58(a,_58(_58(F(b,c,d),x),ac));
return _58(_55(a,s),b);
};
var GG=function(a,b,c,d,x,s,ac){
a=_58(a,_58(_58(G(b,c,d),x),ac));
return _58(_55(a,s),b);
};
var HH=function(a,b,c,d,x,s,ac){
a=_58(a,_58(_58(H(b,c,d),x),ac));
return _58(_55(a,s),b);
};
var II=function(a,b,c,d,x,s,ac){
a=_58(a,_58(_58(I(b,c,d),x),ac));
return _58(_55(a,s),b);
};
var _5a=function(_5b){
var _5c;
var _5d=_5b.length;
var _5e=_5d+8;
var _5f=(_5e-(_5e%64))/64;
var _60=(_5f+1)*16;
var _61=Array(_60-1);
var _62=0;
var _63=0;
while(_63<_5d){
_5c=(_63-(_63%4))/4;
_62=(_63%4)*8;
_61[_5c]=(_61[_5c]|(_5b.charCodeAt(_63)<<_62));
_63++;
}
_5c=(_63-(_63%4))/4;
_62=(_63%4)*8;
_61[_5c]=_61[_5c]|(128<<_62);
_61[_60-2]=_5d<<3;
_61[_60-1]=_5d>>>29;
return _61;
};
var _64=function(_65){
var _66="",_67="",_68,_69;
for(_69=0;_69<=3;_69++){
_68=(_65>>>(_69*8))&255;
_67="0"+_68.toString(16);
_66=_66+_67.substr(_67.length-2,2);
}
return _66;
};
var _6a=function(_6b){
_6b=_6b.replace(/\r\n/g,"\n");
var _6c="";
for(var n=0;n<_6b.length;n++){
var c=_6b.charCodeAt(n);
if(c<128){
_6c+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_6c+=String.fromCharCode((c>>6)|192);
_6c+=String.fromCharCode((c&63)|128);
}else{
_6c+=String.fromCharCode((c>>12)|224);
_6c+=String.fromCharCode(((c>>6)&63)|128);
_6c+=String.fromCharCode((c&63)|128);
}
}
}
return _6c;
};
var x=Array();
var k,AA,BB,CC,DD,a,b,c,d;
var S11=7,S12=12,S13=17,S14=22;
var S21=5,S22=9,S23=14,S24=20;
var S31=4,S32=11,S33=16,S34=23;
var S41=6,S42=10,S43=15,S44=21;
_54=_6a(_54);
x=_5a(_54);
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
a=_58(a,AA);
b=_58(b,BB);
c=_58(c,CC);
d=_58(d,DD);
}
var _6d=_64(a)+_64(b)+_64(c)+_64(d);
return _6d.toLowerCase();
}};
var _6e=0;
var _6f="scriptor_"+_6e;
var _70=function(){
_6f="scriptor_"+_6e;
_6e++;
while(_2.getElementById(_6f)){
_6e++;
_6f="scriptor_"+_6e;
}
return _6f;
};
var _38=0;
var _37=0;
var _34=null;
_4.cookie.init();
_4.httpRequest=function(_71){
var _72={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_4.mixin(_72,_71);
if(typeof (_72.ApiCall)!="string"||_72.ApiCall==""){
_4.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_72.ApiCall;
this.method="POST";
if(typeof (_72.method)=="string"){
this.method=_72.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_72.Type)=="string"){
switch(_72.Type.toLowerCase()){
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
if(typeof (_72.onLoad)=="function"){
this.onLoad=_72.onLoad;
}
this.onError=null;
if(typeof (_72.onError)=="function"){
this.onError=_72.onError;
}
this.requestHeaders=[];
if(_72.requestHeaders&&_72.requestHeaders.length){
for(var n=0;n<_72.requestHeaders.length;n++){
if(typeof (_72.requestHeaders[n][0])=="string"&&typeof (_72.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_72.requestHeaders[n][0],_72.requestHeaders[n][1]]);
}
}
}
this.inRequest=false;
this.http_request=null;
this.createRequest();
};
_4.httpRequest.prototype={createRequest:function(){
if(!this.http_request){
if(_1.XMLHttpRequest){
this.http_request=new XMLHttpRequest();
if(this.http_request.overrideMimeType){
this.http_request.overrideMimeType(this._mimeTypes[this.Type]);
}
}else{
if(_1.ActiveXObject){
try{
this.http_request=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
this.http_request=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e){
_4.error.report("httpRequest could not create Ajax object.");
}
}
}
}
}
},send:function(_73){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_73;
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
this.http_request.onreadystatechange=_4.bind(this.handleRequest,this);
this.http_request.send(_73);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _74=null;
switch(this.Type){
case ("xml"):
_74=this.http_request.responseXML;
break;
case ("json"):
_74=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_74=this.http_request.responseText;
break;
}
this.onLoad(_74);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_4.httpRequest.prototype.lang={errors:{createRequestError:"Error creando objeto Ajax!",requestHandleError:"Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde."}};
var _75=0;
var _76=function(){
return "q"+(_75++);
};
_4.effects={effectsQueue:{},lastId:0,intervalId:null,started:false,requestAnimFrame:(_1.requestAnimationFrame||_1.webkitRequestAnimationFrame||_1.mozRequestAnimationFrame||_1.oRequestAnimationFrame||_1.msRequestAnimationFrame||null),scheduleEffect:function(_77){
var _78=_76();
this.effectsQueue[_78]=this._getEffectInstance();
_4.mixin(this.effectsQueue[_78],_77);
return _78;
},startAll:function(){
for(var fId in this.effectsQueue){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(this.requestAnimFrame){
this.requestAnimFrame(_4.bind(this.loop,this));
}else{
this.intervalId=setInterval(_4.bind(this.loop,this),10);
}
this.started=true;
}
},start:function(fId){
if(this.effectsQueue[fId]){
this.effectsQueue[fId].started=true;
}
if(!this.started){
if(this.requestAnimFrame){
this.requestAnimFrame(_4.bind(this.loop,this));
}else{
this.intervalId=setInterval(_4.bind(this.loop,this),10);
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
for(var n=0;n<_79.property.length;n++){
_79.elem.style[_79.property[n]]=_79.end[n]+_79.unit[n];
}
if(typeof (_79.callback)=="function"){
setTimeout(jsOs.bind(this.callBackAndDestroy,this,fId),10);
}else{
delete this.effectsQueue[fId];
this.checkInterval();
}
},callBackAndDestroy:function(fId){
if(this.effectsQueue[fId]){
this.effectsQueue[fId].callback();
delete this.effectsQueue[fId];
this.checkInterval();
}
},loop:function(_7a){
if(typeof (_7a)=="undefined"){
_7a=new Date().getTime();
}
for(var fId in this.effectsQueue){
var _7b=this.effectsQueue[fId];
if(_7b.started){
if(_7b.startTime==null){
_7b.startTime=_7a;
}
if((_7b.startTime+_7b.duration)<=_7a){
this.cancel(fId);
}else{
var _7c=(_7a-_7b.startTime)/_7b.duration;
for(var n=0;n<_7b.property.length;n++){
var _7d=_7b.start[n]+((_7b.end[n]-_7b.start[n])*_7c);
_7b.elem.style[_7b.property[n]]=_7d+_7b.unit[n];
}
}
}
}
this.checkGoOn();
},checkInterval:function(){
var _7e=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_7e=true;
break;
}
}
if(!_7e&&this.started){
clearInterval(this.intervalId);
this.intervalId=null;
this.started=false;
}
},checkGoOn:function(){
if(this.started){
var _7f=false;
for(var fId in this.effectsQueue){
if(this.effectsQueue[fId].started){
_7f=true;
break;
}
}
if(_7f){
if(this.requestAnimFrame){
this.requestAnimFrame(_4.bind(this.loop,this));
}
}
}
},_getEffectInstance:function(){
return {elem:null,property:[],start:[],end:[],unit:[],duration:500,callback:null,started:false,startTime:null};
}};
var _80={get:function(_81){
var _82={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_4.mixin(_82,_81);
if(!_82.divId){
_82.divId=_70();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_82.id,region:_82.region,style:_82.style,className:_82.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_82.canHaveChildren,hasInvalidator:_82.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_82.x,y:_82.y,width:_82.width,height:_82.height,resizable:_82.resizable,minHeight:_82.minHeight,maxHeight:_82.maxHeight,minWidth:_82.minWidth,maxWidth:_82.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
},DOMRemovedImplementation:function(){
},showImplementation:function(){
},resizeImplementation:function(){
},focusImplementation:function(){
},blurImplementation:function(){
},hideImplementation:function(){
},destroyImplementation:function(){
},focus:function(e){
if(!e){
e=_1.event;
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
_4.event.fire(this,"onfocus");
this.hasFocus=true;
_4.className.add(this.target,"jsComponentFocused");
}
return false;
},blur:function(){
if(this.hasFocus){
this.blurImplementation.apply(this,arguments);
_4.event.fire(this,"onblur");
this.hasFocus=false;
_4.className.remove(this.target,"jsComponentFocused");
for(var n=0;n<this.components.length;n++){
this.components[n].blur();
}
}
},passFocus:function(){
if(this.hasFocus){
if(this.parent&&this.parent.CMP_SIGNATURE){
if(this.parent.components.length>1){
var _83=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_83=n;
break;
}
}
var _84=false;
var _85=(_83==this.parent.components.length-1)?0:_83+1;
for(var n=_85;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_83){
this.parent.components[n].focus();
_84=true;
break;
}
}
if(!_84&&_85>0){
for(var n=0;n<_85;n++){
if(this.parent.components[n].visible&&n!=_83){
this.parent.components[n].focus();
_84=true;
break;
}
}
}
if(!_84){
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
this.target=_4.ComponentRegistry.spawnTarget(this);
this.__updatePosition();
if(this.style){
this.target.setAttribute("style",this.style);
}
var _86=this.className?("jsComponent jsComponentHidden "+this.className):"jsComponent jsComponentHidden";
this.target.className=this.target.className?(_86+" "+this.target.className):_86;
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
_4.event.attach(this.target,"mousedown",_4.bindAsEventListener(this.focus,this));
if(this.canHaveChildren){
this.cmpTarget=_2.createElement("div");
this.cmpTarget.id=this.divId+"_cmpTarget";
_4.className.add(this.cmpTarget,"jsTargetComponent");
this.target.appendChild(this.cmpTarget);
this.splitters.top=null;
this.splitters.left=null;
this.splitters.right=null;
this.splitters.bottom=null;
}
if(this.hasInvalidator){
this.invalidator=_4.ComponentRegistry.spawnInvalidator(this);
}
_4.event.fire(this,"oncreate");
this.created=true;
if(_2.getElementById(this.divId)){
this.onDOMAdded();
}
}
},__reReadDimentions:function(){
if(_2.getElementById(this.target.id)){
targetMinHeight=parseInt(_4.className.getComputedProperty(this.target,"min-height"));
targetMaxHeight=parseInt(_4.className.getComputedProperty(this.target,"max-height"));
targetMinWidth=parseInt(_4.className.getComputedProperty(this.target,"min-width"));
targetMaxWidth=parseInt(_4.className.getComputedProperty(this.target,"max-width"));
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
var _87=_4.className.getComputedProperty(this.target,"width");
var _88=_4.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_87))){
this.width=parseInt(_87);
}
if(this.height==null&&!isNaN(parseInt(_88))){
this.height=parseInt(_88);
}
if(_87.substr(_87.length-1)=="%"){
this._percentWidth=_87;
}else{
this._origWidth=_87;
}
if(_88.substr(_88.length-1)=="%"){
this._percentHeight=_88;
}
}
for(var n=0;n<this.components.length;n++){
this.components[n].__reReadDimentions();
}
},destroy:function(){
var e=_4.event.fire(this,"onbeforedestroy");
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
_4.event.fire(this,"ondestroy");
this.passFocus();
if(this.parent){
this.parent.removeChild(this);
}
this.created=false;
_4.ComponentRegistry.destroy(this);
}
},show:function(){
var e=_4.event.fire(this,"onbeforeshow");
if(!e.returnValue){
return;
}
if(!this.created){
this.create();
}
if(!this.visible&&this.target){
_4.className.remove(this.target,"jsComponentHidden");
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
_4.event.fire(this,"onshow");
}
},resize:function(){
if(this.target){
this.__updatePosition();
if(this.components.length){
var _89=this.__getInnerBox();
var _8a=this.__getOuterBox();
var _8b=this.__getChildrenForRegion("top");
var _8c=0;
var _8d=(this.width-_89.left-_89.right-_8a.left-_8a.right)/_8b.length;
var _8e=false;
for(var n=0;n<_8b.length;n++){
if(_8b[n].height>_8c){
_8c=_8b[n].height;
}
_8b[n].x=(n*_8d);
_8b[n].y=0;
_8b[n].width=_8d;
_8b[n].height=_8b[n].height;
if(_8b[n].resizable){
_8e=true;
}
}
var _8f=this.__getChildrenForRegion("bottom");
var _90=0;
var _91=(this.width-_89.left-_89.right-_8a.left-_8a.right)/_8f.length;
var _92=false;
for(var n=0;n<_8f.length;n++){
if(_8f[n].height>_90){
_90=_8f[n].height;
}
if(_8f[n].resizable){
_92=true;
}
}
for(var n=0;n<_8f.length;n++){
_8f[n].x=(n*_91);
_8f[n].y=this.height-_90-_89.top-_89.bottom;
_8f[n].width=_91;
_8f[n].height=_8f[n].height;
}
var _93=this.__getChildrenForRegion("left");
var _94=0;
var _95=(this.height-_89.top-_89.bottom-_8a.left-_8a.right)/_93.length;
var _96=false;
for(var n=0;n<_93.length;n++){
if(_93[n].width>_94){
_94=_93[n].width;
}
_93[n].x=0;
_93[n].y=_8c+(n*_95);
_93[n].height=_95-_8c-_90;
_93[n].width=_93[n].width;
if(_93[n].resizable){
_96=true;
}
}
var _97=this.__getChildrenForRegion("right");
var _98=0;
var _99=(this.height-_89.top-_89.bottom-_8a.top-_8a.bottom)/_97.length;
var _9a=false;
for(var n=0;n<_97.length;n++){
if(_97[n].width>_98){
_98=_97[n].width;
}
if(_97[n].resizable){
_9a=true;
}
}
for(var n=0;n<_97.length;n++){
_97[n].x=this.width-_98-_89.left-_89.right;
_97[n].y=_8c+(n*_99);
_97[n].width=_98;
_97[n].height=_99-_8c-_90;
}
var _9b=this.__getChildrenForRegion("center");
var _9c=(this.height-_89.top-_89.bottom-_8a.top-_8a.bottom-_90-_8c)/_9b.length;
for(var n=0;n<_9b.length;n++){
_9b[n].x=_94;
_9b[n].y=_8c+(n*_9c);
_9b[n].height=_9c;
_9b[n].width=this.width-_89.left-_89.right-_8a.left-_8a.right-_94-_98;
}
if(_8e){
if(!this.splitters.top){
this.splitters.top=_2.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_4.className.add(this.splitters.top,"jsSplitter");
_4.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_4.event.attach(this.splitters.top,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _9d=_8b[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_89.left-_89.right)+"px";
this.splitters.top.style.top=(_8c-_9d.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_92){
if(!this.splitters.bottom){
this.splitters.bottom=_2.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_4.className.add(this.splitters.bottom,"jsSplitter");
_4.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_4.event.attach(this.splitters.bottom,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _9e=_8f[0].__getOuterBox();
var _9f=parseInt(_4.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_9f)){
_9f=5;
}
this.splitters.bottom.style.width=(this.width-_89.left-_89.right)+"px";
this.splitters.bottom.style.top=(this.height-_90-_9f-_9e.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_96){
if(!this.splitters.left){
this.splitters.left=_2.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_4.className.add(this.splitters.left,"jsSplitter");
_4.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_4.event.attach(this.splitters.left,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _a0=_93[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_89.top-_89.bottom-_8c-_90)+"px";
this.splitters.left.style.top=(_8c)+"px";
this.splitters.left.style.left=(_94-_a0.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_9a){
if(!this.splitters.right){
this.splitters.right=_2.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_4.className.add(this.splitters.right,"jsSplitter");
_4.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_4.event.attach(this.splitters.right,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _a1=_97[0].__getOuterBox();
var _a2=parseInt(_4.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_a2)){
_a2=5;
}
this.splitters.right.style.height=(this.height-_89.top-_89.bottom-_8c-_90)+"px";
this.splitters.right.style.top=(_8c)+"px";
this.splitters.right.style.left=(this.width-_98-_a2-_a1.left)+"px";
}else{
if(this.splitters.right){
this.splitters.right.parentNode.removeChild(this.splitters.right);
this.splitters.right=null;
}
}
}
this.resizeImplementation.apply(this,arguments);
_4.event.fire(this,"onresize");
for(var n=0;n<this.components.length;n++){
this.components[n].resize();
}
}
},resizeTo:function(_a3){
if(_a3){
if(_a3.width){
this.width=_a3.width;
this._percentWidth=null;
}
if(_a3.height){
this.height=_a3.height;
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
var e=_4.event.fire(this,"onbeforehide");
if(!e.returnValue){
return;
}
if(this.visible&&this.target){
_4.className.add(this.target,"jsComponentHidden");
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
_4.event.fire(this,"onhide");
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
if(_4.isHtmlElement(ref)){
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
var _a4=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_a4=true;
break;
}
}
if(!_a4&&ref.CMP_SIGNATURE&&this.canHaveChildren){
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
_4.className.add(ref.target,"jsComponentChild");
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
_4.className.remove(ref.target,"jsComponentChild");
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
var _a5=this.__getInnerBox();
var _a6=this.__getOuterBox();
var _a7=0,_a8=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_a6.left-_a6.right-_a5.left-_a5.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_a6=this.__getOuterBox();
_a7=this.target.parentNode.offsetWidth-_a6.left-_a6.right-_a5.left-_a5.right;
if(isNaN(_a7)||_a7<0){
_a7=0;
}
this.width=_a7;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_a8=this.target.offsetHeight-_a6.top-_a6.bottom-_a5.top-_a5.bottom;
if(isNaN(_a8)||_a8<0){
_a8=0;
}
this.height=_a8;
}
if(this.width!==null){
_a7=this.width-_a5.left-_a5.right-_a6.left-_a6.right;
if(isNaN(_a7)||_a7<0){
_a7=0;
}
this.target.style.width=_a7+"px";
}
if(this.height!==null){
_a8=this.height-_a5.top-_a5.bottom-_a6.top-_a6.bottom;
if(isNaN(_a8)||_a8<0){
_a8=0;
}
this.target.style.height=_a8+"px";
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
var _a9=parseInt(_4.className.getComputedProperty(this.target,"padding-top"));
var _aa=parseInt(_4.className.getComputedProperty(this.target,"padding-bottom"));
var _ab=parseInt(_4.className.getComputedProperty(this.target,"padding-left"));
var _ac=parseInt(_4.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_a9)){
box.top=_a9;
}
if(!isNaN(_aa)){
box.bottom=_aa;
}
if(!isNaN(_ab)){
box.left=_ab;
}
if(!isNaN(_ac)){
box.right=_ac;
}
var _ad=parseInt(_4.className.getComputedProperty(this.target,"border-top-width"));
var _ae=parseInt(_4.className.getComputedProperty(this.target,"border-bottom-width"));
var _af=parseInt(_4.className.getComputedProperty(this.target,"border-left-width"));
var _b0=parseInt(_4.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_ad)){
box.top+=_ad;
}
if(!isNaN(_ae)){
box.bottom+=_ae;
}
if(!isNaN(_af)){
box.left+=_af;
}
if(!isNaN(_b0)){
box.right+=_b0;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _b1=parseInt(_4.className.getComputedProperty(this.target,"margin-top"));
var _b2=parseInt(_4.className.getComputedProperty(this.target,"margin-bottom"));
var _b3=parseInt(_4.className.getComputedProperty(this.target,"margin-left"));
var _b4=parseInt(_4.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_b1)){
box.top=_b1;
}
if(!isNaN(_b2)){
box.bottom=_b2;
}
if(!isNaN(_b3)){
box.left=_b3;
}
if(!isNaN(_b4)){
box.right=_b4;
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
},_onResizeStart:function(e,_b5){
if(!e){
e=_1.event;
}
this.resizingRegion=_b5;
_4.event.attach(_2,"mousemove",this._resizeMoveHandler=_4.bindAsEventListener(this._onResizeMove,this));
_4.event.attach(_2,"mouseup",this._resizeStopHandler=_4.bindAsEventListener(this._onResizeStop,this));
if(_b5=="top"||_b5=="bottom"){
this.resizeStartingPosition=_4.event.getPointXY(e).y;
}else{
this.resizeStartingPosition=_4.event.getPointXY(e).x;
}
_4.event.cancel(e,true);
return false;
},_onResizeMove:function(e){
if(!e){
e=_1.event;
}
var _b6=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_b6){
_4.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_b6;
var _b7=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_b7=_4.event.getPointXY(e).y;
}else{
_b7=_4.event.getPointXY(e).x;
}
var _b8=_b7-this.resizeStartingPosition;
this.resizeStartingPosition=_b7;
var _b9=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_b9.length;n++){
_b9[n].resizeTo({height:_b9[n].height+_b8});
}
break;
case ("bottom"):
for(var n=0;n<_b9.length;n++){
_b9[n].resizeTo({height:_b9[n].height-_b8});
}
break;
case ("left"):
for(var n=0;n<_b9.length;n++){
_b9[n].resizeTo({width:_b9[n].width+_b8});
}
break;
case ("right"):
for(var n=0;n<_b9.length;n++){
_b9[n].resizeTo({width:_b9[n].width-_b8});
}
break;
}
_4.event.cancel(e,true);
return false;
},_onResizeStop:function(e){
if(!e){
e=_1.event;
}
_4.event.detach(_2,"mousemove",this._resizeMoveHandler);
_4.event.detach(_2,"mouseup",this._resizeStopHandler);
this.lastResizeTimeStamp=null;
this.resizingRegion="";
_4.event.cancel(e,true);
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
var _ba=["center","left","top","bottom","right"];
var _bb=false;
for(var n=0;n<_ba.length;n++){
if(cmp.region==_ba[n]){
_bb=true;
break;
}
}
if(!_bb){
cmp.region="center";
}
return cmp;
}};
_4.ComponentRegistry={_registry:[],add:function(id,cmp){
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
cmp.divId=_70();
}
var ret=_2.getElementById(cmp.divId);
if(!ret){
ret=_2.createElement("div");
ret.id=cmp.divId;
}
this.add(cmp.divId,cmp);
return ret;
},spawnInvalidator:function(cmp){
if(!cmp.divId||!cmp.target){
return null;
}
ret=_2.createElement("div");
ret.id=cmp.divId+"_invalidator";
ret.className="jsComponentInvalidator";
ret.style.display="none";
cmp.target.appendChild(ret);
return ret;
},destroy:function(cmp){
if(_2.getElementById(cmp.divId)){
cmp.target.parentNode.removeChild(cmp.target);
}
cmp.target=null;
if(cmp.invalidator){
if(_2.getElementById(cmp.invalidator.id)){
cmp.invalidator.parentNode.removeChild(cmp.invalidator);
}
cmp.invalidator=null;
}
if(cmp.cmpTarget){
if(_2.getElementById(cmp.cmpTarget.id)){
cmp.cmpTarget.parentNode.removeChild(cmp.cmpTarget);
}
cmp.cmpTarget=null;
}
this.remove(cmp);
},onWindowResized:function(e){
setTimeout(_4.bind(function(){
for(var n=0;n<this._registry.length;n++){
if(!this._registry[n].cmp.parent){
this._registry[n].cmp.resize();
}
}
},this),1);
}};
_4.event.attach(_1,"onresize",_4.bindAsEventListener(_4.ComponentRegistry.onWindowResized,_4.ComponentRegistry));
_4.ContextMenu=function(_bc){
var _bd={canHaveChildren:false,hasInvalidator:false,items:[]};
_4.mixin(_bd,_bc);
var cmp=_80.get(_bd);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.ContextMenu";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
this.create();
_4.className.add(this.target,"jsContextMenu");
this.target.innerHTML="<ul id=\""+this.divId+"_ul\"></ul>";
_4.body().appendChild(this.target);
this.ul=_2.getElementById(this.divId+"_ul");
this.onDOMAdded();
this._origWidth=null;
this.items=[];
for(var n=0;n<_bd.items.length;n++){
this.addItem(this.items[n]);
}
this.showImplementation=function(e){
if(!e){
e=_1.event;
}
for(var n=0;n<_4.ComponentRegistry._registry.length;n++){
var cmp=_4.ComponentRegistry._registry[n].cmp;
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
x=(e.clientX+_2.documentElement.scrollLeft);
y=(e.clientY+_2.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
if(x+this.width>_4.body().offsetWidth){
x=x-this.width;
}
if(y+this.height>_4.body().offsetHeight){
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
_4.event.detach(_2,"onclick",this._checkMenuBind);
}
setTimeout(_4.bind(function(){
_4.event.attach(_2,"onclick",this._checkMenuBind=_4.bind(this.checkMenu,this));
},this),1);
_4.event.cancel(e);
return false;
};
};
_4.ContextMenu.prototype.updateSize=function(){
var _be=_4.element.getOuterBox(this.ul);
var _bf=this.__getInnerBox();
this.target.style.width="auto";
this.width=this.ul.offsetWidth+_be.left+_be.right+_bf.left+_bf.right;
this.height=this.ul.offsetHeight+_be.top+_be.bottom+_bf.top+_bf.bottom;
this.__updatePosition();
};
_4.ContextMenu.prototype.addItem=function(_c0,ndx){
var _c1={label:"sep",onclick:null,checked:false};
_4.mixin(_c1,_c0);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_c1);
}else{
ndx=this.items.length;
this.items.push(_c1);
}
if(this.target){
var li=_2.createElement("li");
var _c2="";
var _c3=_c1;
if(_c3.label=="sep"){
li.className="contextMenuSep";
}else{
if(_c3.checked){
li.className="OptionChecked";
}
_c2+="<a href=\""+_4.getInactiveLocation()+"\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_c3["class"]){
_c2+=" class=\""+_c3["class"]+"\"";
}
_c2+=">"+_c3.label+"</a>";
}
li.innerHTML=_c2;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_c3.label!="sep"&&typeof (_c3.onclick)=="function"){
_4.event.attach(_2.getElementById(this.divId+"_itm_"+ndx),"onclick",_c3.onclick);
}
this.updateSize();
}
};
_4.ContextMenu.prototype.removeItem=function(_c4){
if(typeof (_c4)=="number"){
if(_c4>=0&&_c4<=this.items.length-1){
this.items.splice(_c4,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_c4]);
}
}
}else{
if(typeof (_c4)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_c4){
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
_4.ContextMenu.prototype.checkItem=function(_c5,_c6){
if(typeof (_c5)=="undefined"){
return;
}
if(typeof (_c6)=="undefined"){
_c6=false;
}
if(typeof (_c5)=="number"){
if(_c5>=0&&_c5<=this.items.length-1){
this.items[_c5].checked=_c6?true:false;
if(this.target){
_4.className[(_c6?"add":"remove")](this.ul.getElementsByTagName("li")[_c5],"OptionChecked");
}
}
}else{
if(typeof (_c5)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_c5){
this.items[n].checked=_c6?true:false;
if(this.target){
_4.className[(_c6?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
}
break;
}
}
}
}
};
_4.ContextMenu.prototype.checkMenu=function(){
if(this._checkMenuBind){
_4.event.detach(_2,"onclick",this._checkMenuBind);
}
this.hide();
};
_4.Panel=function(_c7){
var _c8={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_c8,_c7);
var cmp=_80.get(_c8);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Panel";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
this.create();
_4.className.add(this.target,"jsPanel");
};
_4.TabContainer=function(_c9){
var _ca={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_ca,_c9);
var cmp=_80.get(_ca);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.TabContainer";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
_4.event.registerCustomEvent(this,"onselect");
_4.event.registerCustomEvent(this,"ontabclosed");
this._tabs=[];
this._selectedTabId=null;
this.resizeImplementation=function(){
var _cb=this._tabList.cmpTarget.offsetWidth;
var _cc=_cb;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _cd=_2.getElementById(this._tabList.divId+"_more");
if(_cd){
var _ce=parseInt(_4.className.getComputedProperty(_cd,"margin-left"));
var _cf=parseInt(_4.className.getComputedProperty(_cd,"margin-right"));
_cb-=(_cd.offsetWidth+_ce+_cf);
}
var _d0=0;
var _d1=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _d2=this._tabList.cmpTarget.childNodes[n];
var _d3=parseInt(_4.className.getComputedProperty(_d2,"margin-left"));
var _d4=parseInt(_4.className.getComputedProperty(_d2,"margin-right"));
if(isNaN(_d3)){
_d3=0;
}
if(isNaN(_d4)){
_d4=0;
}
_d0+=_d2.offsetWidth+_d3+_d4;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_cb=_cc;
}
if(_d0>=_cb){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_d1){
this._tabList._extraTabs=n;
_d1=true;
}
_d2.style.visibility="hidden";
}else{
_d2.style.visibility="visible";
}
}
if(_d0<_cb){
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
_4.className.add(this.target,"jsTabContainer");
this._tabsContextMenu=new _4.ContextMenu();
this._tabList=new _d5({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _d6({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_4.TabContainer.prototype.addTab=function(_d7,_d8,ndx){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _d9={title:"",paneId:_d8.divId,pane:_d8,closable:false};
_4.mixin(_d9,_d7);
if(!_d9.pane||!_d9.pane.CMP_SIGNATURE||!_d9.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _da=new _db(_d9);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_da);
}else{
this._tabs.push(_da);
}
var _dc=this._tabList.cmpTarget.childNodes;
var _dd=_2.createElement("div");
_dd.id=_da.paneId+"_tablabel";
_dd.className="jsTabLabel";
if(_da.closable){
_4.className.add(_dd,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_da.paneId;
_4.className.add(_dd,"jsTabSelected");
}
_dd.innerHTML="<span>"+_da.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_da.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_dd);
}else{
this._tabList.cmpTarget.insertBefore(_dd,_dc[ndx]);
}
this._pageContainer.addPage(_da.pane);
this._pageContainer.activate(this._selectedTabId);
var _de=_2.getElementById(_da.paneId+"_closeHandler");
if(!_da.closable){
_4.className.add(_de,"jsTabCloseHidden");
}else{
_4.className.add(_dd,"jsTabClosable");
}
_4.event.attach(_dd,"onclick",_4.bindAsEventListener(this.selectTab,this,_da.paneId));
_4.event.attach(_de,"onclick",_4.bindAsEventListener(this.closeTab,this,_da.paneId));
this.resize();
};
_4.TabContainer.prototype.removeTab=function(ref,_df){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_df)=="undefined"){
_df=true;
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
var _e0=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _e0=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_df);
this._tabs.splice(ndx,1);
if(_e0){
if(this._tabs[ndx]){
this._selectedTabId=this._tabs[ndx].paneId;
}else{
if(this._tabs.length){
this._selectedTabId=this._tabs[this._tabs.length-1].paneId;
}else{
this._selectedTabId=null;
}
}
_4.className.add(_2.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
this._pageContainer.activate(this._selectedTabId);
}
this.resize();
}
};
_4.TabContainer.prototype.selectTab=function(e,ref){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before selecting tabs!");
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
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
}
_4.className.remove(_2.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
if(this._tabs[ndx]){
this._selectedTabId=this._tabs[ndx].paneId;
for(var n=0;n<this._tabsContextMenu.items.length;n++){
this._tabsContextMenu.checkItem(n,(n==ndx-this._tabList._extraTabs));
}
}
_4.className.add(_2.getElementById(this._selectedTabId+"_tablabel"),"jsTabSelected");
this._pageContainer.activate(this._selectedTabId);
}
_4.event.cancel(e,true);
return false;
};
_4.TabContainer.prototype.getSelectedTab=function(){
for(var n=0;n<this._tabs.length;n++){
if(this._tabs[n].paneId==this._selectedTabId){
return this._tabs[n].pane;
}
}
return null;
};
_4.TabContainer.prototype.setTitle=function(ref,_e1){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_e1;
this.resize();
}
};
_4.TabContainer.prototype.setClosable=function(ref,_e2){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before calling to setClosable!");
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
var _e3=this._tabList.cmpTarget.childNodes[ndx];
var _e4=_2.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_e2){
_4.className.add(_e3,"jsTabClosable");
_4.className.remove(_e4,"jsTabCloseHidden");
}else{
_4.className.remove(_e3,"jsTabClosable");
_4.className.add(_e4,"jsTabCloseHidden");
}
this.resize();
}
};
_4.TabContainer.prototype.closeTab=function(e,ref){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before closing tabs!");
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
e=_4.event.fire(this,"ontabclosed",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
}
this.removeTab(ndx);
}
_4.event.cancel(e,true);
return false;
};
_4.TabContainer.prototype._updateExtraTabsContextMenu=function(){
var _e5=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_e5){
if(this._tabsContextMenu.items.length>_e5){
while(this._tabsContextMenu.items.length>_e5){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_e5-this._tabsContextMenu.items.length;n++){
var _e6=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_e6].title,onclick:_4.bindAsEventListener(function(e,_e7,_e8){
this.selectTab(_e7);
},this,_e6,this._tabList._extraTabs)},0);
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
var _d5=function(_e9){
var _ea={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_ea,_e9);
var cmp=_80.get(_ea);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.private.TabListObj";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
this.create();
this._extraTabs=0;
this._showingMore=false;
var _eb=_2.createElement("span");
_eb.id=this.divId+"_more";
_eb.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_eb);
_eb.innerHTML=" ";
_4.className.add(this.cmpTarget,"jsTabListInner");
_4.event.attach(_eb,"onclick",_4.bindAsEventListener(this.onDropdownClick,this));
};
_d5.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
}
this.parent._tabsContextMenu.show(e);
_4.event.cancel(e,true);
return false;
};
_d5.prototype.showMore=function(){
if(!this._showingMore){
_4.className.remove(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_d5.prototype.hideMore=function(){
if(this._showingMore){
_4.className.add(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _d6=function(_ec){
var _ed={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_ed,_ec);
var cmp=_80.get(_ed);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.private.TabPageContainer";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
this.create();
};
_d6.prototype.addPage=function(_ee){
_4.className.add(_ee.target,"jsTabPage");
this.addChild(_ee);
};
_d6.prototype.removePage=function(_ef,_f0){
this.removeChild(_ef);
if(_f0){
_ef.destroy();
}
};
_d6.prototype.activate=function(_f1){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_f1){
this.components[n].show();
}
}
};
var _db=function(_f2){
var _f3={title:"",paneId:null,pane:null,closable:false};
_4.mixin(_f3,_f2);
this.title=_f3.title;
this.paneId=_f3.paneId;
this.pane=_f3.pane;
this.closable=_f3.closable;
};
var _f4=20;
var _f5=function(_f6){
var _f7={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_4.mixin(_f7,_f6);
if(!_f7.Name){
_4.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_f7.Name;
this.Type=(typeof (_f8[_f7.Type])!="undefined")?_f7.Type:"alpha";
this.show=_f7.show;
this.percentWidth=null;
if(!isNaN(Number(_f7.Width))){
this.Width=Number(_f7.Width);
}else{
if(typeof (_f7.Width)=="string"){
if(_f7.Width.length>2&&_f7.Width.substr(_f7.Width.length-2)=="px"&&!isNaN(parseInt(_f7.Width))){
this.Width=parseInt(_f7.Width);
}else{
if(_f7.Width.length>1&&_f7.Width.substr(_f7.Width.length-1)=="%"&&!isNaN(parseInt(_f7.Width))){
this.Width=_f4;
this.percentWidth=parseInt(_f7.Width);
}
}
}
}
this.origWidth=this.Width;
this.Format=_f7.Format;
this.displayName=_f7.displayName?_f7.displayName:_f7.Name;
this.sqlName=_f7.sqlName?_f7.sqlName:_f7.Name;
this.showToolTip=_f7.showToolTip;
this.Compare=_f7.Compare;
};
var _f9=function(_fa,_fb){
_fb=_fb?_fb:{};
for(var n=0;n<_fa.length;n++){
var _fc=_fa[n].Name;
var _fd=_fa[n].Type;
this[_fc]=_fb[_fc]?_f8[_fd](_fb[_fc]):_f8[_fd]();
}
for(var _fe in _fb){
if(this[_fe]===_3){
this[_fe]=_fb[_fe];
}
}
};
var _f8={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _ff=str.split(" ");
if(_ff[0]=="0000-00-00"){
return "";
}else{
var _100=_ff[0].split("-");
ret=new Date(_100[0],_100[1]-1,_100[2]);
if(_ff[1]){
var _101=_ff[1].split(":");
ret=new Date(_100[0],_100[1]-1,_100[2],_101[0],_101[1],_101[2]);
}
}
}
return ret;
}};
_4.DataView=function(opts){
var _102={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_4.mixin(_102,opts);
var cmp=_80.get(_102);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_102.multiselect;
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
_4.event.registerCustomEvent(this,"onrefresh");
_4.event.registerCustomEvent(this,"oncontentupdated");
_4.event.registerCustomEvent(this,"onselect");
_4.event.registerCustomEvent(this,"oncolumnresize");
this.orderBy=false;
this.orderWay="ASC";
this.paginating=_102.paginating;
this.rowsPerPage=_102.rowsPerPage;
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
var _103=this.__getInnerBox();
var _104=this.__getOuterBox();
var _105=_103.top+_103.bottom+_104.top+_104.bottom;
if(this._cached.pagination_header){
var _104=_4.element.getOuterBox(this._cached.pagination_header);
_105+=this._cached.pagination_header.offsetHeight+_104.top+_104.bottom;
}
if(this._cached.header){
var _104=_4.element.getOuterBox(this._cached.header);
_105+=this._cached.header.offsetHeight+_104.top+_104.bottom;
}
if(this._cached.footer){
var _104=_4.element.getOuterBox(this._cached.footer);
_105+=this._cached.footer.offsetHeight+_104.top+_104.bottom;
}
var _106=this.height!==null?this.height-_105:0;
if(_106<0){
_106=0;
}
this._cached.outer_body.style.height=_106+"px";
this._adjustColumnsWidth(true);
}
};
this.DOMAddedImplementation=function(){
this._checkCache();
if(this._cached){
this.__refreshFooter();
if(this.multiselect){
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_selectAll"),"click",_4.bindAsEventListener(this.__selectAll,this)));
}
if(this.paginating){
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_goToPagePrev"),"click",_4.bindAsEventListener(this.__goToPagePrev,this)));
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_goToPageNext"),"click",_4.bindAsEventListener(this.__goToPageNext,this)));
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_pageInput"),"keypress",_4.bindAsEventListener(this.__checkGoToPage,this)));
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_pageInputBtn"),"click",_4.bindAsEventListener(this.__goToPage,this)));
}
for(var n=0;n<this.columns.length;n++){
this._addColumnToUI(this.columns[n],n);
}
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_optionsMenuBtn"),"click",_4.bindAsEventListener(this.showOptionsMenu,this)));
this._registeredEvents.push(_4.event.attach(this._cached.headerUl,"click",_4.bindAsEventListener(this._onHeaderColumnClicked,this)));
this._registeredEvents.push(_4.event.attach(this._cached.headerUl,"mousedown",_4.bindAsEventListener(this._onHeaderColumnMousedown,this)));
this._registeredEvents.push(_4.event.attach(this._cached.rows_body,"click",_4.bindAsEventListener(this._onRowBodyClicked,this)));
this.updateRows(true);
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
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
_4.className.add(this.target,"dataViewMain");
this.renderTemplate();
this.canHaveChildren=false;
this.optionsMenu=new _4.ContextMenu();
this.optionsMenu.addItem({label:this.lang.refresh,onclick:_4.bindAsEventListener(function(e){
this.refresh();
},this)});
this.optionsMenu.addItem({label:"sep"});
for(var n=0;n<_102.columns.length;n++){
this.addColumn(this.createColumn(_102.columns[n]));
}
};
_4.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _107="";
var _108=_4.getInactiveLocation();
if(this.paginating){
_107+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_107+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_107+="</label></li><li>";
_107+="<a href=\""+_108+"\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_107+="<a href=\""+_108+"\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_107+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_107+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_107+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_107+="</li></ul></div>";
}
_107+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_107+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_107+="<li class=\"dataViewCheckBoxHeader\">";
_107+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_107+="<li class=\"dataViewSep\"></li>";
}
_107+="</ul>";
_107+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_107+="<a href=\""+_108+"\"> </a></span></div>";
_107+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_107+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_107+="</div>";
_107+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_107;
this._templateRendered=true;
if(this.inDOM&&this._registeredEvents.length==0){
this.DOMAddedImplementation();
}
}
};
_4.DataView.prototype._checkCache=function(){
if(!this._cached&&_2.getElementById(this.divId+"_columnsHeader")){
this._cached={pagination_header:_2.getElementById(this.divId+"_paginationHeader"),header:_2.getElementById(this.divId+"_columnsHeader"),headerUl:_2.getElementById(this.divId+"_columnsUl"),outer_body:_2.getElementById(this.divId+"_outerBody"),rows_body:_2.getElementById(this.divId+"_body"),footer:_2.getElementById(this.divId+"_footer")};
}
};
_4.DataView.prototype.getTotalPages=function(){
var _109=0;
var _10a=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_10a){
n+=this.rowsPerPage;
_109++;
}
return _109;
};
_4.DataView.prototype.getNextRowId=function(){
var _10b=true;
while(_10b){
_10b=false;
var _10c=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_10c){
_10b=true;
break;
}
}
}
return _10c;
};
_4.DataView.prototype.createColumn=function(opts){
return new _f5(opts);
};
_4.DataView.prototype.addColumn=function(_10d,ndx){
if(this.__findColumn(_10d.Name)==-1){
if(ndx===_3){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_10d);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_10d.Name]=_f8[_10d.Type]();
}
}
if(!this.orderBy&&_10d.show){
this.orderBy=_10d.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_4.DataView.prototype.__findColumn=function(_10e){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_10e){
return n;
}
}
return -1;
};
_4.DataView.prototype.deleteColumn=function(_10f){
var _110="";
var ndx=null;
if(typeof (_10f)=="string"){
var _111=this.__findColumn(_10f);
if(_111!=-1){
_110=this.columns[_111].Name;
ndx=_111;
this.columns.splice(_111,1);
}
}
if(typeof (_10f)=="number"){
if(_10f>0&&_10f<this.columns.length){
_110=this.columns[_10f].Name;
ndx=_10f;
this.columns.splice(_10f,1);
}
}
if(typeof (_10f)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_10f){
_110=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_110){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_110]=null;
delete this.rows[n][_110];
}
}
if(this.orderBy==_110){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_4.DataView.prototype._addColumnToUI=function(_112,ndx){
var li=_2.createElement("li");
li.style.width=_112.Width+"px";
var _113="dataViewColumn";
if(!_112.show){
_113+=" dataViewColumnHidden";
}
li.className=_113;
var a=_2.createElement("a");
if(this.orderBy==_112.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href",_4.getInactiveLocation());
a.innerHTML=_112.displayName;
li.appendChild(a);
li2=_2.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_113="dataViewFieldSep";
if(_112.percentWidth!==null){
_113+=" dataViewFieldSepNoResize";
}
if(!_112.show){
_113+=" dataViewColumnHidden";
}
li2.className=_113;
var _114=this._cached.headerUl.getElementsByTagName("li");
if(!_114.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _115=this.multiselect?2:0;
if(ndx>=0&&(_115+(ndx*2))<_114.length){
this._cached.headerUl.insertBefore(li,_114[_115+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_114[_115+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_112.displayName,onclick:_4.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_112.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_112.Name,ndx);
}
}
this._adjustColumnsWidth();
};
_4.DataView.prototype._removeColumnFromUI=function(ndx){
var _116=this.multiselect?2:0;
var _117=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_116+(ndx*2))<_117.length){
this._cached.headerUl.removeChild(_117[_116+(ndx*2)]);
this._cached.headerUl.removeChild(_117[_116+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
this._adjustColumnsWidth();
};
_4.DataView.prototype._addRowToUI=function(_118){
if(_118<0||_118>this.rows.length-1){
return;
}
var _119=this.rows[_118].id;
var _11a=_2.createElement("ul");
_11a.id=this.divId+"_row_"+_119;
var _11b=false;
if(!this.multiselect){
if(this.selectedRow==n){
_11b=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_11b=true;
break;
}
}
}
if(_11b){
_11a.className="dataViewRowSelected";
}
if(_118%2){
_4.className.add(_11a,"dataViewRowOdd");
}
if(this.multiselect){
var _11c=_2.createElement("li");
var _11d="dataViewMultiselectCell";
_11c.className=_11d;
var _11e="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_119+"\" class=\"dataViewCheckBox\" ";
if(_11b){
_11e+="checked=\"checked\" ";
}
_11e+="/></li>";
_11c.innerHTML=_11e;
_11a.appendChild(_11c);
}
var _11f=this._cached.rows_body.getElementsByTagName("ul");
if(_11f.length==0){
this._cached.rows_body.appendChild(_11a);
}else{
if(_118==this.rows.length-1){
this._cached.rows_body.appendChild(_11a);
}else{
var _120=null;
for(var n=_118+1;n<this.rows.length;n++){
_120=_2.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_120){
break;
}
}
if(_120){
this._cached.rows_body.insertBefore(_11a,_120);
}else{
this._cached.rows_body.appendChild(_11a);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_119,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_4.DataView.prototype._removeRowFromUI=function(_121){
if(_121<0||_121>this.rows.length-1){
return;
}
var _122=this.rows[_121].id;
var _123=_2.getElementById(this.divId+"_row_"+_122);
if(_123){
this._cached.rows_body.removeChild(_123);
}
this.__refreshFooter();
};
_4.DataView.prototype._refreshRowInUI=function(_124){
var row=this.getById(_124);
if(row){
var _125=_2.getElementById(this.divId+"_row_"+_124);
if(_125){
for(var a=0;a<this.columns.length;a++){
this.setCellValue(_124,this.columns[a].Name,row[this.columns[a].Name]);
}
}
}
};
_4.DataView.prototype._addCellToUI=function(_126,_127,ndx){
var _128=_2.getElementById(this.divId+"_row_"+_126);
if(_128){
var _129=_128.getElementsByTagName("li");
var li=_2.createElement("li");
li.id=this.divId+"_cell_"+_126+"_"+ndx;
var _12a="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_12a+=" dataViewCellHidden";
}
if(ndx==0){
_12a+=" dataViewFirstCell";
}
li.className=_12a;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_126)[_127]);
}
if(ndx>=0&&ndx<_129.length-1){
_128.insertBefore(li,_129[ndx]);
}else{
_128.appendChild(li);
}
this.setCellValue(_126,_127,this.getById(_126)[_127]);
}
};
_4.DataView.prototype._removeCellFromUI=function(_12b,ndx){
var _12c=this.multiselect?1:0;
var _12d=_2.getElementById(this.divId+"_row_"+_12b);
if(_12d){
var _12e=_12d.getElementsByTagName("li");
if(ndx>=0&&(_12c+ndx)<_12e.length){
_12d.removeChild(_12e[_12c+ndx]);
}
}
};
_4.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _f9(this.columns,data);
};
_4.DataView.prototype.addRow=function(_12f,ndx,ui){
if(ui===_3){
ui=true;
}
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(!_12f){
_12f=this.createRow();
}else{
if(!_12f.id){
_12f.id=this.getNextRowId();
}
}
if(ndx===_3){
ndx=this.rows.length;
}else{
if(ndx<0||ndx>this.rows.length){
ndx=this.rows.length;
}
}
if(ndx>0&&ndx<this.rows.length){
this.rows.splice(ndx,0,_12f);
}else{
this.rows.push(_12f);
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
_4.DataView.prototype.deleteRow=function(_130,ui){
if(ui===_3){
ui=true;
}
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
var _131=-1;
if(typeof (_130)=="number"){
_131=_130;
this.rows.splice(_130,1);
}
if(typeof (_130)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_130){
_131=n;
this.rows.splice(n,1);
}
}
}
if(_131!=-1&&ui){
this._removeRowFromUI(_131);
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_131){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_131){
this.selectedRows[n]--;
}
}
}
}
this._UIUpdateSelection();
}
};
_4.DataView.prototype.curRow=function(){
return this.selectedRow!=-1?this.rows[this.selectedRow]:null;
};
_4.DataView.prototype.curRows=function(){
var rows=[];
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
rows.push(this.rows[this.selectedRows[n]]);
}
}
return this.multiselect?rows:this.curRow();
};
_4.DataView.prototype.getById=function(id){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==id){
return this.rows[n];
}
}
return null;
};
_4.DataView.prototype.searchRows=function(_132,_133){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_132]==_133){
ret.push(this.rows[n]);
}
}
return ret;
};
_4.DataView.prototype.setCellValue=function(_134,_135,_136){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return false;
}
var _137=this.__findColumn(_135);
if(_137==-1){
return false;
}
var _138=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_134){
_138=n;
break;
}
}
if(_138===null){
return false;
}
this.rows[_138][_135]=_136;
var cell=_2.getElementById(this.divId+"_cell_"+_134+"_"+_137);
if(typeof (this.columns[_137].Format)=="function"){
var _139=this.columns[_137].Format(_136);
cell.innerHTML="";
if(typeof (_139)=="string"){
cell.innerHTML=_139;
}else{
cell.appendChild(_139);
}
}else{
cell.innerHTML=_136;
}
return true;
};
_4.DataView.prototype.refresh=function(){
var e=_4.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateRows();
}
};
_4.DataView.prototype.setLoading=function(val){
if(!this.inDOM){
_4.error.report("Cant message on DataView not in DOM");
return;
}
this._cached.rows_body.style.display=val?"none":"";
this._cached.outer_body.className=val?"dataViewOuterBody dataViewLoading":"dataViewOuterBody";
};
_4.DataView.prototype.setMessage=function(msg){
if(!this.inDOM){
_4.error.report("Cant message on DataView not in DOM");
return;
}
if(msg===false||msg===null||typeof (msg)!="string"){
if(_2.getElementById(this.divId+"_message")){
this._cached.outer_body.removeChild(_2.getElementById(this.divId+"_message"));
}
this._cached.rows_body.style.display="";
}else{
this._cached.rows_body.style.display="none";
var _13a;
if(!_2.getElementById(this.divId+"_message")){
_13a=_2.createElement("div");
_13a.id=this.divId+"_message";
_13a.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_13a);
}else{
_13a=_2.getElementById(this.divId+"_message");
}
_13a.innerHTML=msg;
}
};
_4.DataView.prototype.clearSelection=function(){
this.selectedRow=-1;
this.selectedRows=[];
_2.getElementById(this.divId+"_selectAll").checked=false;
if(this.inDOM){
this._UISelectAll(false);
}
};
_4.DataView.prototype.__selectAll=function(e){
if(!e){
e=_1.event;
}
var elem=_2.getElementById(this.divId+"_selectAll");
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
_4.DataView.prototype._UISelectAll=function(_13b){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_4.className[(_13b?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_13b;
}
};
_4.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _13c=false;
if(!this.multiselect){
if(this.selectedRow==n){
_13c=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_13c=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_13c;
}
_4.className[(_13c?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_4.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_2.getElementById(this.divId+"_pageInput").value;
var _13d=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_13d){
alert("Invalid page number.");
return;
}else{
this.curPage=Number(page)-1;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_2.getElementById(this.divId+"_pageInput").focus();
}
};
_4.DataView.prototype.__checkGoToPage=function(e){
if(!e){
e=_1.event;
}
if(e.keyCode==13){
this.__goToPage(e);
}
};
_4.DataView.prototype.__goToPagePrev=function(e){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e);
return false;
}
if(this.curPage>0){
this.curPage--;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.__goToPageNext=function(e){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e);
return false;
}
var _13e=this.getTotalPages();
if(this.curPage<_13e-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.updateRows=function(_13f){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(_13f===_3){
_13f=false;
}
var _140=null;
if(this.selectedRow!=-1&&this.rows[this.selectedRow]){
_140=this.rows[this.selectedRow].id;
}
var _141=[];
if(this.selectedRows.length){
for(var n=0;n<this.selectedRows.length;n++){
if(this.rows[this.selectedRows[n]]){
_141.push(this.rows[this.selectedRows[n]].id);
}
}
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_13f){
this._cached.rows_body.innerHTML="";
}
var _142=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_142.length;n++){
var _143=_142[n].id.substr(_142[n].id.lastIndexOf("_")+1);
if(!this.getById(_143)){
this._cached.rows_body.removeChild(_142[n]);
n--;
}
}
for(var n=0;n<this.rows.length;n++){
if(!_2.getElementById(this.divId+"_row_"+this.rows[n].id)){
this._addRowToUI(n);
}else{
this._refreshRowInUI(this.rows[n].id);
}
}
if(!_13f){
this.selectedRow=-1;
if(_140){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_140){
this.selectedRow=n;
break;
}
}
}
this.selectedRows=[];
if(_141.length){
for(var a=0;a<_141.length;a++){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_141[a]){
this.selectedRows.push(n);
break;
}
}
}
}
}
this._UIUpdateSelection();
if(_13f){
this._cached.outer_body.scrollTop=this._oldScrollTop?this._oldScrollTop:0;
}
this.__refreshFooter();
_4.event.fire(this,"oncontentupdated");
};
_4.DataView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Attempt to refresh footer on DataView not added to DOM");
return;
}
var _144="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_144+=this.lang.noRows;
}else{
if(this.rows.length==1){
_144+="1 "+" "+this.lang.row;
}else{
_144+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_2.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_144+=this.lang.noRows;
}else{
var _145=(this.rowsPerPage*this.curPage);
var _146=(_145+this.rowsPerPage)>this.totalRows?this.totalRows:(_145+this.rowsPerPage);
_144+=(_145+1)+" - "+_146+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_144+="</li></ul>";
this._cached.footer.innerHTML=_144;
};
_4.DataView.prototype.__setOrder=function(_147){
if(!this.inDOM){
_4.error.report("Cant sort a DataView not in DOM");
return;
}
var _148=this.columns[_147].Name;
if(_147>=0&&_147<this.columns.length){
var _149=this.multiselect?2:0;
var _14a=this._cached.headerUl.getElementsByTagName("li");
var _14b=this.__findColumn(this.orderBy);
_4.className.remove(_14a[_149+(_14b*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_148){
this.orderBy=_148;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_4.className.add(_14a[_149+(_147*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
_4.DataView.prototype._onRowBodyClicked=function(e){
if(!e){
e=_1.event;
}
var _14c=e.target||e.srcElement;
var _14d=this.divId+"_selectRow_";
if(_14c.nodeName.toLowerCase()=="input"&&_14c.id.substr(0,_14d.length)==_14d){
var _14e=_14c.id.substr(_14c.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14e){
this.__markRow(e,n);
break;
}
}
}else{
while(_14c.nodeName.toLowerCase()!="ul"){
if(_14c==this._cached.rows_body){
return;
}
_14c=_14c.parentNode;
}
var _14e=_14c.id.substr(_14c.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_14e){
this.__selectRow(e,n);
break;
}
}
}
};
_4.DataView.prototype._onHeaderColumnClicked=function(e){
if(!e){
e=_1.event;
}
var _14f=e.target||e.srcElement;
if(_14f.nodeName.toLowerCase()=="a"){
colNdx=Number(_14f.id.substr(_14f.id.lastIndexOf("_")+1));
if(!isNaN(colNdx)){
this.__setOrder(colNdx);
}
_4.event.cancel(e,true);
return false;
}
return true;
};
_4.DataView.prototype._onHeaderColumnMousedown=function(e){
if(!e){
e=_1.event;
}
var _150=e.target||e.srcElement;
if(_150.nodeName.toLowerCase()=="li"&&_150.className=="dataViewFieldSep"){
var _151=Number(_150.id.substr(_150.id.lastIndexOf("_")+1));
if(!isNaN(_151)){
this.activateResizing(e,_151);
}
}
};
_4.DataView.prototype.__selectRow=function(e,_152){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_152){
e.unselecting=_152;
}else{
if(this.multiselect){
var _153=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_152){
_153=true;
break;
}
}
if(_153){
e.unselecting=_152;
}else{
e.selecting=_152;
}
}else{
e.selecting=_152;
}
}
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_152!=-1){
if(!this.multiselect){
if(this.selectedRow!=-1){
_4.className.remove(rows[this.selectedRow],"dataViewRowSelected");
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
rows[this.selectedRows[a]].childNodes[0].firstChild.checked=false;
_4.className.remove(rows[this.selectedRows[a]],"dataViewRowSelected");
}
}
if(this.selectedRow==_152&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_152;
_4.className.add(rows[_152],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_152){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_152;
this.selectedRows=[_152];
}
}else{
if(e.ctrlKey){
var _153=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_152){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_153=true;
}
}
if(!_153){
this.selectedRow=_152;
this.selectedRows.push(_152);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_152){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_152;
for(var n=this.selectedRows[0];(_152>this.selectedRows[0]?n<=_152:n>=_152);(_152>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_152);
this.selectedRow=_152;
}
}
}
}
for(var a=0;a<this.selectedRows.length;a++){
rows[this.selectedRows[a]].childNodes[0].firstChild.checked=true;
_4.className.add(rows[this.selectedRows[a]],"dataViewRowSelected");
}
}
}
}
return false;
};
_4.DataView.prototype.__markRow=function(e,_154){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_154;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _155=this.rows[_154].id;
elem=_2.getElementById(this.divId+"_selectRow_"+_155);
if(elem.checked){
this.selectedRows.push(_154);
this.selectedRow=_154;
var row=_2.getElementById(this.divId+"_row_"+_155);
_4.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_154){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_2.getElementById(this.divId+"_row_"+_155);
_4.className.remove(row,"dataViewRowSelected");
break;
}
}
}
return true;
};
_4.DataView.prototype.showOptionsMenu=function(e){
if(!e){
e=_1.event;
}
this.optionsMenu.show(e);
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.toggleColumn=function(_156){
if(this.columns[_156].show){
this.columns[_156].show=false;
}else{
this.columns[_156].show=true;
}
var _157=this.multiselect?2:0;
var _158=this._cached.headerUl.getElementsByTagName("li");
if(_156>=0&&((_157+(_156*2)+1)<_158.length)){
_4.className[this.columns[_156].show?"remove":"add"](_158[_157+(_156*2)],"dataViewColumnHidden");
_4.className[this.columns[_156].show?"remove":"add"](_158[_157+(_156*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_157=this.multiselect?1:0;
_4.className[this.columns[_156].show?"remove":"add"](rows[n].childNodes[_157+_156],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_156+2,this.columns[_156].show);
this._adjustColumnsWidth();
};
_4.DataView.prototype._adjustColumnsWidth=function(_159){
if(this.columns.length&&this._cached){
if(_159===_3){
_159=false;
}
var _15a=false;
var _15b=this._getHeadersWidth();
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Width!=this.columns[n].origWidth){
_15a=true;
this.columns[n].Width=this.columns[n].origWidth;
}
}
var _15c=0;
var base=this.multiselect?2:0;
var lis=this._cached.headerUl.getElementsByTagName("li");
if(lis.length==(this.columns.length*2)+base&&_15b>0){
var _15d=0;
var _15e=false;
var _15f=null;
var _160=0;
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
if(!_15e){
_15f=_4.element.getInnerBox(lis[base+(n*2)]);
_160=_15f.left+_15f.right+lis[base+(n*2)+1].offsetWidth;
_15e=true;
break;
}
}
}
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_15d++;
if(this.columns[n].percentWidth!==null){
_15c+=_f4+_160;
}else{
_15c+=this.columns[n].Width+_160;
}
}
}
if(_15d&&_15b>=((_f4+_160)*_15d)){
while(_15c>_15b){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show&&this.columns[n].percentWidth===null&&this.columns[n].Width>_f4){
_15a=true;
this.columns[n].Width--;
_15c--;
}
if(_15c==_15b){
break;
}
}
}
}else{
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_15a=true;
this.columns[n].Width=_f4;
}
}
}
var _161=_15b-_15c;
if(_161){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].percentWidth!==null){
this.columns[n].Width+=_161*(this.columns[n].percentWidth/100);
}
}
}
if(_15a||_159){
for(var n=0;n<this.columns.length;n++){
lis[base+(n*2)].style.width=this.columns[n].Width+"px";
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
var _162=this.multiselect?1:0;
for(var a=0;a<rows.length;a++){
var rLis=rows[a].getElementsByTagName("li");
for(var n=0;n<this.columns.length;n++){
rLis[_162+n].style.width=this.columns[n].Width+"px";
}
}
}
}
}
};
_4.DataView.prototype._getHeadersWidth=function(){
var _163=_2.getElementById(this.divId+"_optionsMenuBtn");
var _164=_4.element.getOuterBox(_163);
var _165=_4.element.getInnerBox(this._cached.headerUl);
var _166=0;
if(this.multiselect){
var lis=this._cached.headerUl.getElementsByTagName("li");
_166=lis[0].offsetWidth+lis[1].offsetWidth;
}
return this._cached.headerUl.offsetWidth-_165.left-_166-(_163.offsetWidth+_164.left+_164.right);
};
_4.DataView.prototype.__calculateTotalWidth=function(){
var _167=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_167+=cols[n].offsetWidth;
}
return _167;
};
_4.DataView.prototype.__sort=function(_168){
var n,_169,swap;
if(!this.orderBy){
return;
}
for(n=_168+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_168][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_168][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_168][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_168][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_169=this.rows[_168];
this.rows[_168]=this.rows[n];
this.rows[n]=_169;
if(this.selectedRow==_168){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_168;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_168){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_168;
}
}
}
}
}
if(_168<this.rows.length-2){
this.__sort(_168+1);
}
};
_4.DataView.prototype.colum_exists=function(str){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==str){
return true;
}
}
return false;
};
_4.DataView.prototype.__getColumnSqlName=function(_16a){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_16a){
return this.columns[n].sqlName;
}
}
return false;
};
_4.DataView.prototype.activateResizing=function(e,_16b){
if(!e){
e=_1.event;
}
if(this.columns[_16b].percentWidth===null){
this.resColumnId=_16b;
var x;
if(typeof (e.pageX)=="number"){
x=e.pageX;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_2.documentElement.scrollLeft);
}else{
x=0;
}
}
this.resizingFrom=this.columns[_16b].Width;
this.resizingXCache=x;
_4.event.attach(_2,"mousemove",this._mouseMoveBind=_4.bindAsEventListener(this.doResizing,this));
_4.event.attach(_2,"mouseup",this._mouseUpBind=_4.bindAsEventListener(this.deactivateResizing,this));
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.deactivateResizing=function(e){
if(!e){
e=_1.event;
}
_4.event.detach(_2,"mousemove",this._mouseMoveBind);
_4.event.detach(_2,"mouseup",this._mouseUpBind);
e.columnId=this.resColumnId;
e.resizingFrom=this.resizingFrom;
e.resizedTo=this.columns[this.resColumnId].Width;
_4.event.fire(this,"oncolumnresize",e);
this.resColumnId=null;
this.resizingXCache=0;
};
_4.DataView.prototype.doResizing=function(e){
if(!e){
e=_1.event;
}
var x;
if(typeof (e.pageX)=="number"){
x=e.pageX;
}else{
if(typeof (e.clientX)=="number"){
x=(e.clientX+_2.documentElement.scrollLeft);
}else{
x=0;
}
}
var _16c=Math.abs(this.resizingXCache-x);
var _16d=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _16e=this.resColumnId;
var _16f=false;
if(!_16d){
if((this.columns[_16e].Width-_16c)>_f4){
this.columns[_16e].Width-=_16c;
this.columns[_16e].origWidth=this.columns[_16e].Width;
_16f=true;
}
}else{
this.columns[_16e].Width+=_16c;
this.columns[_16e].origWidth=this.columns[_16e].Width;
_16f=true;
}
if(_16f){
this._adjustColumnsWidth(true);
}
};
_4.DataView.prototype.addDataType=function(name,_170){
if(typeof (name)!="string"){
_4.error.report("Invalid data type name.");
return;
}
if(typeof (_170)!="object"){
_4.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_170.toString)!="function"){
_4.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_f8[name]){
_f8[name]=_170;
}else{
_4.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.DataViewConnector=function(opts){
var _171={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_171,opts);
if(!_171.dataView){
_4.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_171.api)!="string"||_171.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_171.api;
this.dataView=_171.dataView;
this.parameters=_171.parameters;
this.type="json";
if(_171.type){
switch(_171.type.toLowerCase()){
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
if(typeof (_171.method)=="string"){
this.method=_171.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.dataView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _172="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_172+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_172+="&"+this.parameters;
}
this.httpRequest.send(_172);
_4.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
if(root.getAttribute("success")=="1"){
var _173=Number(root.getAttribute("totalrows"));
if(!isNaN(_173)){
this.dataView.totalRows=_173;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _174={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _175=cols[a].getAttribute("name");
if(_175&&cols[a].firstChild){
var _176=this.dataView.__findColumn(_175)!=-1?this.dataView.columns[this.dataView.__findColumn(_175)].Type:"alpha";
_174[_175]=_f8[_176](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_174),_3,false);
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
this.dataView.updateRows();
}else{
this.dataView.rows.length=0;
if(data.success){
var _173=Number(data.totalrows);
if(!isNaN(_173)){
this.dataView.totalRows=_173;
}
for(var n=0;n<data.rows.length;n++){
var _174={};
for(var _175 in data.rows[n]){
var _176=this.dataView.__findColumn(_175)!=-1?this.dataView.columns[this.dataView.__findColumn(_175)].Type:"alpha";
_174[_175]=_f8[_176](data.rows[n][_175]);
}
this.dataView.addRow(this.dataView.createRow(_174),_3,false);
}
}else{
this.dataView.setMessage(data.errormessage);
}
this.dataView.updateRows();
}
},_onError:function(_177){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_177+")");
}};
_4.DataView.prototype.lang={"noRows":"No hay filas para mostrar.","rows":"filas.","row":"fila.","pageStart":"Página ","pageMiddle":" de ","pageEnd":" Ir a página: ","pageGo":"Ir","pagePrev":"<< Anterior","pageNext":"Siguiente >>","refresh":"Actualizar","of":"de"};
var _178=function(opts){
var _179={id:null,parentId:0,parent:null,Name:""};
_4.mixin(_179,opts);
this.treeView=_179.treeView;
this.id=_179.id!==null?_179.id:this.treeView.getNextNodeId();
this.parentId=_179.parentId;
this.Name=String(_179.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_179.parent;
};
_178.prototype={searchNode:function(id){
var n;
var srch=null;
var _17a=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_17a<this.childNodes.length){
srch=this.childNodes[_17a].searchNode(id);
_17a++;
}
return srch;
},updateChildrenNodes:function(){
var _17b=_2.getElementById(this.treeView.divId+"_"+this.id+"_branch");
var _17c=_4.getInactiveLocation();
for(var i=0;i<this.childNodes.length;i++){
var node=_2.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_17b.appendChild(node);
var _17d="";
var _17e=this.childNodes[i].childNodes.length;
if(_17e){
_17d+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\""+_17c+"\" class=\"";
_17d+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_17d+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_17e){
_17d+="class=\"treeViewSingleNode\" ";
}
_17d+="href=\""+_17c+"\">"+this.childNodes[i].Name+"</a>";
if(_17e){
_17d+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_17d;
if(_17e){
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_4.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_4.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_17e){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_4.TreeView=function(opts){
var _17f={canHaveChildren:false,hasInvalidator:true};
_4.mixin(_17f,opts);
var cmp=_80.get(_17f);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.TreeView";
this.DOMAddedImplementation=function(){
if(this._templateRendered){
this.updateNodes();
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
}
};
this.selectedNode=null;
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
_4.event.registerCustomEvent(this,"onrefresh");
_4.event.registerCustomEvent(this,"oncontentupdated");
_4.event.registerCustomEvent(this,"onselect");
this.masterNode=new _178({id:0,parentId:0,parent:null,Name:"root",treeView:this});
this.nextNodeId=1;
this._registeredEvents=[];
this._templateRendered=false;
this.create();
_4.className.add(this.target,"treeView");
this.renderTemplate();
};
_4.TreeView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var ul=_2.createElement("ul");
ul.id=this.divId+"_0_branch";
ul.className="treeViewContainer";
this.target.insertBefore(ul,this.invalidator);
this._templateRendered=true;
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.getNextNodeId=function(){
var _180=true;
while(_180){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_180=false;
}else{
this.nextNodeId++;
}
}
return this.nextNodeId;
};
_4.TreeView.prototype.searchNode=function(id){
return this.masterNode.searchNode(id);
};
_4.TreeView.prototype.refresh=function(){
var e=_4.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype.updateNodes=function(){
if(!this.inDOM){
_4.error.report("Add treeView to DOM before working with elements");
return;
}
_2.getElementById(this.divId+"_0_branch").innerHTML="";
this.masterNode.updateChildrenNodes();
};
_4.TreeView.prototype.setLoading=function(val){
_4.className[val?"add":"remove"](this.target,"treeViewLoading");
};
_4.TreeView.prototype.setMessage=function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_2.getElementById(this.divId+"_message")){
_2.getElementById(this.divId+"_message").parentNode.removeChild(_2.getElementById(this.divId+"_message"));
}
_2.getElementById(this.divId+"_0_branch").style.display="";
}else{
_2.getElementById(this.divId+"_0_branch").style.display="none";
var _181;
if(!_2.getElementById(this.divId+"_message")){
_181=_2.createElement("div");
_181.id=this.divId+"_message";
_181.className="treeViewMessageDiv";
this.target.appendChild(_181);
}else{
_181=_2.getElementById(this.divId+"_message");
}
_181.innerHTML=msg;
}
};
_4.TreeView.prototype._expandNode=function(e,_182){
if(!e){
e=_1.event;
}
var node=this.searchNode(_182);
if(node.expanded){
node.expanded=false;
_2.getElementById(this.divId+"_"+_182+"_expandable").className="treeViewExpandableNode";
_2.getElementById(this.divId+"_"+_182+"_branch").style.display="none";
}else{
node.expanded=true;
_2.getElementById(this.divId+"_"+_182+"_expandable").className="treeViewCollapsableNode";
_2.getElementById(this.divId+"_"+_182+"_branch").style.display="block";
}
_4.event.cancel(e);
return false;
};
_4.TreeView.prototype._selectNode=function(e,_183){
if(!e){
e=_1.event;
}
if(this.selectedNode!==null){
var _184=this.searchNode(this.selectedNode);
_4.className.remove(_2.getElementById(this.divId+"_"+_184.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_183){
var _184=this.searchNode(_183);
_4.className.add(_2.getElementById(this.divId+"_"+_184.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_183)?null:_183;
_4.event.cancel(e,true);
return false;
};
_4.TreeView.prototype.addNode=function(opts,_185,ndx){
var _186=(_185==0)?this.masterNode:this.searchNode(_185);
if(_186){
var _187={treeView:this,parentId:_185,parent:_186,Name:""};
_4.mixin(_187,opts);
if(ndx>=0&&ndx<_186.childNodes.length){
_186.childNodes.splice(ndx,0,new _178(_187));
}else{
_186.childNodes.push(new _178(_187));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.deleteNode=function(_188){
if(_188==0||_188=="0"){
return;
}
this._searchAndDelete(_188,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype._searchAndDelete=function(_189,node){
var _18a=false;
if(typeof (_189)=="number"||typeof (_189)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_189){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18a=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_189){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18a=true;
break;
}
}
}
if(!_18a){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_189);
if(done){
_18a=done;
break;
}
}
}
return _18a;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.TreeViewConnector=function(opts){
var _18b={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_18b,opts);
if(!_18b.treeView){
_4.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_18b.api)!="string"||_18b.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_18b.api;
this.treeView=_18b.treeView;
this.parameters=_18b.parameters;
this.type="json";
if(_18b.type){
switch(_18b.type.toLowerCase()){
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
if(typeof (_18b.method)=="string"){
this.method=_18b.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.treeView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.TreeViewConnector.prototype={_onRefresh:function(e){
this.treeView.setLoading(true);
this.httpRequest.send(this.parameters);
_4.event.cancel(e);
},_onLoad:function(data){
this.treeView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
delete this.treeView.masterNode;
this.treeView.masterNode=new _178({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _18c=this._fetchNodes(root);
if(_18c.length){
this._addNodesFromXml(_18c,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _178({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_18d,_18e){
for(var n=0;n<_18d.length;n++){
var id=null;
if(_18d[n].getAttribute("id")){
id=_18d[n].getAttribute("id");
}
var _18f=_18d[n].getElementsByTagName("label")[0];
if(_18f){
labelStr=_18f.firstChild.data;
}
var _190=_18d[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_18e);
if(_190){
this._addNodesFromXml(this._fetchNodes(_18d[n]),id);
}
}
},_addNodesFromJson:function(_191,_192){
for(var n=0;n<_191.length;n++){
this.treeView.addNode({Name:_191[n].label,id:_191[n].id},_192);
if(_191[n].nodes){
this._addNodesFromJson(_191[n].nodes,_191[n].id);
}
}
},_onError:function(_193){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_193+")");
}};
_4.CalendarView=function(opts){
var _194=new Date();
var _195={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_194.getMonth(),year:_194.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_4.mixin(_195,opts);
var cmp=_80.get(_195);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_195.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_195.month))&&_195.month>=0&&_195.month<12)?_195.month:_194.getMonth();
this.curYear=(!isNaN(Number(_195.year))&&_195.year>0)?_195.year:new _194.getFullYear();
this.disabledBefore=_195.disabledBefore;
this.disabledAfter=_195.disabledAfter;
this.disabledDays=_195.disabledDays;
this.disabledDates=_195.disabledDates;
this.markedDates=[];
this.hookedTo=null;
this._registeredEvents=[];
this._templateRendered=false;
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
_4.event.registerCustomEvent(this,"onselect");
this.DOMAddedImplementation=function(){
if(_2.getElementById(this.divId+"_body")){
this.updateDates();
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_advancedAccept"),"onclick",_4.bindAsEventListener(this.selectAdvanced,this)));
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_advancedCancel"),"onclick",_4.bindAsEventListener(this.cancelAdvanced,this)));
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
}
};
this.create();
_4.className.add(this.cmpTarget,"calendarView");
this.renderTemplate();
this.canHaveChildren=false;
};
_4.CalendarView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _196="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_196+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_196+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _197=new Date();
if(this.selectedDates.length){
_197=this.selectedDates[0];
}
_196+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_196+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_197.getDate()+"\" /></p>";
_196+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_196+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_196+="<option value=\""+n+"\""+(_197.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_196+="</select></p>";
_196+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_196+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_197.getFullYear()+"\" /></p>";
_196+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_196+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_196+="</div>";
_196+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_196;
this._templateRendered=true;
if(this.inDOM&&this._registeredEvents.length==0){
this.DOMAddedImplementation();
}
}
};
_4.CalendarView.prototype.updateDates=function(){
if(!this.inDOM){
_4.error.report("Can't update data on non visible calendarView object.");
return;
}
var _198=_2.getElementById(this.divId+"_body");
_198.style.display="";
_2.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
while(_198.firstChild){
_198.removeChild(_198.firstChild);
}
var _199=_2.createElement("thead");
var _19a,_19b,_19c,tmpA;
var _19a=_2.createElement("tr");
for(var n=0;n<7;n++){
_19b=_2.createElement("th");
_19b.appendChild(_2.createTextNode(this.lang.shortDays[n]));
_19a.appendChild(_19b);
}
_199.appendChild(_19a);
_198.appendChild(_199);
var _19d=new Date();
var _19e=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _19f=new Date(_19e.getTime());
_19f.setMonth(_19f.getMonth()+1);
var _1a0=_19e.getDay();
var _1a1=0;
var _1a2=_2.createElement("tbody");
var _19a=_2.createElement("tr");
while(_1a1<_1a0){
_19c=_2.createElement("td");
_19c.appendChild(_2.createTextNode(" "));
_19a.appendChild(_19c);
_1a1++;
}
while(_19e<_19f){
_19c=_2.createElement("td");
_19c.setAttribute("align","left");
_19c.setAttribute("valign","top");
tmpA=_2.createElement("a");
tmpA.setAttribute("href",_4.getInactiveLocation());
tmpA.appendChild(_2.createTextNode(_19e.getDate()));
var _1a3=false;
if(this.isEqual(_19e,_19d)){
_1a3=true;
}
var _1a4=false;
if(this.isDisabledDate(_19e)){
_1a4=true;
if(_1a3){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_19e,this.markedDates[n])){
_1a4=true;
if(_1a3){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_19e,this.selectedDates[n])){
_1a4=true;
if(_1a3){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_1a4&&_1a3){
tmpA.className="calendarToday";
}
_19c.appendChild(tmpA);
_19a.appendChild(_19c);
_4.event.attach(tmpA,"onclick",_4.bind(this.selectDate,this,_19e.getDate()));
_19e.setDate(_19e.getDate()+1);
_1a1++;
if(_1a1>6){
_1a2.appendChild(_19a);
_19a=_2.createElement("tr");
_1a1=0;
}
}
if(_1a1>0){
_1a2.appendChild(_19a);
while(_1a1<7){
_19c=_2.createElement("td");
_19c.appendChild(_2.createTextNode(" "));
_19a.appendChild(_19c);
_1a1++;
}
}
_198.appendChild(_1a2);
this.__refreshHeader();
this.__refreshFooter();
};
_4.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a5=_2.getElementById(this.divId+"_header");
_1a5.innerHTML="";
var _1a6=_4.getInactiveLocation();
var _1a7="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\""+_1a6+"\"> </a></li>";
_1a7+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\""+_1a6+"\"> </a></li>";
_1a7+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\""+_1a6+"\"> </a></li>";
_1a7+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1a7+="</ul>";
_1a5.innerHTML=_1a7;
_4.event.attach(_2.getElementById(this.divId+"_prevMonth"),"onclick",_4.bind(this.goPrevMonth,this));
_4.event.attach(_2.getElementById(this.divId+"_viewAdvanced"),"onclick",_4.bind(this.setAdvanced,this));
_4.event.attach(_2.getElementById(this.divId+"_nextMonth"),"onclick",_4.bind(this.goNextMonth,this));
};
_4.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a8=_2.getElementById(this.divId+"_footer");
_1a8.innerHTML="";
var _1a9="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\""+_4.getInactiveLocation()+"\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_1a9+=text;
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
_1a9+=text;
}
}else{
_1a9+=this.lang.noSelection+"</p>";
}
_1a8.innerHTML=_1a9;
_4.event.attach(_2.getElementById(this.divId+"_goHome"),"onclick",_4.bind(this.goHomeDate,this));
};
_4.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=_1.event;
}
_2.getElementById(this.divId+"_body").style.display="none";
_2.getElementById(this.divId+"_advanced").style.display="block";
var _1aa=new Date();
if(this.selectedDates.length){
_1aa=this.selectedDates[0];
}
_2.getElementById(this.divId+"DaySelector").value=_1aa.getDate();
_2.getElementById(this.divId+"MonthSelector").selectedIndex=_1aa.getMonth();
_2.getElementById(this.divId+"YearSelector").value=_1aa.getFullYear();
this.advanced=true;
_4.event.cancel(e);
return false;
};
_4.CalendarView.prototype.cancelAdvanced=function(){
_2.getElementById(this.divId+"_body").style.display="";
_2.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
};
_4.CalendarView.prototype.selectAdvanced=function(e){
if(!e){
e=_1.event;
}
var _1ab=_2.getElementById(this.divId+"DaySelector").value;
var _1ac=_2.getElementById(this.divId+"MonthSelector").value;
var _1ad=_2.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1ab))){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1ad))){
alert(this.lang.error2);
_4.event.cancel(e,true);
return false;
}
var _1ae=new Date(_1ad,_1ac,_1ab);
if(_1ae.getMonth()!=_1ac){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1ae)){
alert(this.lang.error3);
_4.event.cancel(e,true);
return false;
}
var _1af={selecting:_1ae,selectedDates:this.selectedDates};
_1af=_4.event.fire(this,"onselect",_1af);
if(_1af.returnValue==false){
_4.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1ae;
this.goHomeDate(e);
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=_1.event;
}
var _1b0=new Date(this.curYear,this.curMonth,date);
var _1b1={selecting:_1b0,selectedDates:this.selectedDates};
_1b1=_4.event.fire(this,"onselect",_1b1);
if(_1b1.returnValue==false){
_4.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1b0)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1b0;
}else{
_4.error.report("Error: multiselect function not implemented.");
_4.event.cancel(e,true);
return false;
}
this.updateDates();
}
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.isDisabledDate=function(date){
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
_4.CalendarView.prototype.isEqual=function(_1b2,_1b3){
if(_1b2.getFullYear()==_1b3.getFullYear()&&_1b2.getMonth()==_1b3.getMonth()&&_1b2.getDate()==_1b3.getDate()){
return true;
}else{
return false;
}
};
_4.CalendarView.prototype.goPrevMonth=function(e){
if(!e){
e=_1.event;
}
this.curMonth--;
if(this.curMonth<0){
this.curMonth=11;
this.curYear--;
}
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.goNextMonth=function(e){
if(!e){
e=_1.event;
}
this.curMonth++;
if(this.curMonth>11){
this.curMonth=0;
this.curYear++;
}
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.goHomeDate=function(e){
if(!e){
e=_1.event;
}
var _1b4;
if(this.selectedDates.length){
_1b4=this.selectedDates[0];
}else{
_1b4=new Date();
}
this.curMonth=_1b4.getMonth();
this.curYear=_1b4.getFullYear();
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.hook=function(_1b5){
var elem=null;
if(typeof (_1b5)=="string"){
elem=_2.getElementById(_1b5);
}else{
if(_4.isHTMLElement(_1b5)){
elem=_1b5;
}
}
if(elem){
this.hookedTo=elem;
calElem=_2.getElementById(this.div);
_4.event.attach(elem,"onfocus",_4.bind(this.showHooked,this));
calElem.style.display="none";
calElem.style.position="absolute";
_4.event.attach(this,"onselect",_4.bind(this.assignToHooked,this));
}
};
_4.CalendarView.prototype.showHooked=function(e){
if(!e){
e=_1.event;
}
var elem=this.hookedTo;
var date=this.getDateFromStr(elem.value);
this.curMonth=date.getMonth();
this.curYear=date.getFullYear();
this.selectedDates.length=0;
this.selectedDates[0]=date;
this.Show();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
_4.event.attach(_2,"onclick",this._hideHookedBind=_4.bind(this.hideHooked,this));
this.divElem.style.display="block";
this.divElem.zIndex="1000";
if(e.offsetX){
x=e.offsetX;
y=e.offsetY;
}else{
x=e.pageX-_2.getBoxObjectFor(elem).x;
y=e.pageY-_2.getBoxObjectFor(elem).y;
}
if(e.pageX){
x=e.pageX-x;
y=e.pageY-y+24;
}else{
if(e.x){
x=e.x+_2.documentElement.scrollLeft-x;
y=e.y+_2.documentElement.scrollTop-y+24;
}
}
this.y=y;
this.x=x;
this.updateSize();
};
_4.CalendarView.prototype.hideHooked=function(e){
if(!e){
e=_1.event;
}
this.hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
};
_4.CalendarView.prototype.assignToHooked=function(){
var date=this.selectedDates[0];
var _1b6=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1b6.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1b6.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
};
_4.CalendarView.prototype.getDateFromStr=function(str){
var _1b7=str.split("/");
var ret;
if(!isNaN(Number(_1b7[0]))&&!isNaN(Number(_1b7[1]))&&!isNaN(Number(_1b7[2]))){
if(this.lang.isFrenchDateFormat){
if(_1b7[1]>0&&_1b7[1]<13&&_1b7[0]>0&&_1b7[0]<32&&_1b7[2]>0){
ret=new Date(_1b7[2],_1b7[1]-1,_1b7[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1b7[0]>0&&_1b7[0]<13&&_1b7[1]>0&&_1b7[1]<32&&_1b7[2]>0){
ret=new Date(_1b7[2],_1b7[1]-1,_1b7[0],0,0,0);
}else{
ret=new Date();
}
}
}else{
ret=new Date();
}
return ret;
};
_4.CalendarView.prototype.lang={shortDays:["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],longDays:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],shortMonths:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],longMonths:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],noSelection:"Sin seleccionar",oneSelection:"Fecha: ",multipleSelection:"Fechas: ",prevMonth:"Mes Anterior",nextMonth:"Mes Próximo",advanced:"Seleccionar mes y año",homeDate:"Ir a selección o al día de hoy",day:"Día:",month:"Mes:",year:"Año:",accept:"Aceptar",cancel:"Cancelar",error1:"El campo del día ingresado es inválido.",error2:"El campo del año ingresado es inválido.",error3:"La fecha seleccionada no está disponible.",isFrenchDateFormat:true};
var _1b8=function(_1b9,path,name){
this.thumbnail=_1b9;
this.path=path;
this.name=name;
};
_4.GalleryView=function(opts){
var _1ba={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_4.mixin(_1ba,opts);
var cmp=_80.get(_1ba);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1ba.showNames;
this.fixedThumbSize=_1ba.fixedThumbSize;
this.thumbWidth=_1ba.thumbWidth;
this.thumbHeight=_1ba.thumbHeight;
this.images=[];
this.DOMAddedImplementation=function(){
this.updateImages();
};
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
_4.event.registerCustomEvent(this,"onrefresh");
_4.event.registerCustomEvent(this,"onselect");
this.create();
_4.className.add(this.target,"galleryViewWrapper");
_4.className.add(this.cmpTarget,"galleryView");
this.canHaveChildren=false;
};
_4.GalleryView.prototype.addImage=function(opts){
var _1bb={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_4.mixin(_1bb,opts);
if(!_1bb.thumbnail){
_4.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1bb.insertIndex==this.images.length){
this.images.push(new _1b8(_1bb.thumbnail,_1bb.path,_1bb.name));
}else{
this.images.splice(_1bb.insertIndex,0,new _1b8(_1bb.thumbnail,_1bb.path,_1bb.name));
}
if(this.inDOM){
this.updateImages();
}
};
_4.GalleryView.prototype.deleteImage=function(_1bc){
if(typeof (_1bc)=="number"){
this.images.splice(_1bc,1);
}else{
if(typeof (_1bc)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1bc){
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
_4.GalleryView.prototype.refresh=function(){
var e=_4.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.inDOM){
this.updateImages();
}
};
_4.GalleryView.prototype.setLoading=function(val){
_4.className[(val?"add":"remove")](this.cmpTarget,"galleryViewLoading");
};
_4.GalleryView.prototype.setMessage=function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_2.getElementById(this.divId+"_message")){
this.target.removeChild(_2.getElementById(this.divId+"_message"));
}
_4.className.remove(this.cmpTarget,"galleryViewMessage");
}else{
_4.className.add(this.cmpTarget,"galleryViewMessage");
var _1bd;
if(!_2.getElementById(this.divId+"_message")){
_1bd=_2.createElement("p");
_1bd.id=this.divId+"_message";
this.target.appendChild(_1bd);
}else{
_1bd=_2.getElementById(this.divId+"_message");
}
_1bd.innerHTML=msg;
}
};
_4.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_4.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1be="";
for(var n=0;n<this.images.length;n++){
_1be+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1be+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1be+="class=\"gvSelectedImage\" ";
}
_1be+=">";
_1be+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1be+="<p>"+this.images[n].name+"</p>";
}
_1be+="</div>";
}
this.cmpTarget.innerHTML=_1be;
for(var n=0;n<this.images.length;n++){
_4.event.attach(_2.getElementById(this.divId+"_img_"+n),"onclick",_4.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_4.GalleryView.prototype._selectImage=function(e,_1bf){
if(!e){
e=_1.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1bf;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1bf!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1bf){
this.selectedImage=-1;
}else{
this.selectedImage=_1bf;
imgs[_1bf].parentNode.className="gvSelectedImage";
}
}
_4.event.cancel(e);
return false;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.GalleryViewConnector=function(opts){
var _1c0={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_1c0,opts);
if(!_1c0.galleryView){
_4.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1c0.api)!="string"||_1c0.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_1c0.api;
this.galleryView=_1c0.galleryView;
this.parameters=_1c0.parameters;
this.type="json";
if(_1c0.type){
switch(_1c0.type.toLowerCase()){
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
if(typeof (_1c0.method)=="string"){
this.method=_1c0.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.galleryView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.GalleryViewConnector.prototype={_onRefresh:function(e){
this.galleryView.setLoading(true);
this.httpRequest.send(this.parameters);
_4.event.cancel(e);
},_onLoad:function(data){
this.galleryView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.galleryView.images.length=0;
if(root.getAttribute("success")=="1"){
var _1c1=root.getElementsByTagName("image");
for(var n=0;n<_1c1.length;n++){
var _1c2=_1c1.item(n).getElementsByTagName("thumbnail");
var path=_1c1.item(n).getElementsByTagName("path");
var name=_1c1.item(n).getElementsByTagName("name");
var _1c3="";
var _1c4="";
var _1c5="";
if(_1c2.length){
if(_1c2.item(0).firstChild){
_1c3=_1c2.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1c4=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1c5=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1b8(_1c3,_1c4,_1c5));
var _1c6=_1c1.item(n).getElementsByTagName("param");
if(_1c6.length){
for(var a=0;a<_1c6.length;a++){
var _1c7=_1c6.item(a).getAttribute("name");
var _1c8="";
if(_1c6.item(a).firstChild){
_1c8=_1c6.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1c7]=_1c8;
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
var _1c3=data.images[n].thumbnail;
var _1c4=data.images[n].path;
var _1c5=data.images[n].name;
this.galleryView.images.push(new _1b8(_1c3,_1c4,_1c5));
for(var _1c9 in data.images[n]){
if(_1c9!="thumbnail"&&_1c9!="path"&&_1c9!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1c9]=data.images[n][_1c9];
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
},_onError:function(_1ca){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1ca+")");
}};
_4.Toolbar=function(opts){
var _1cb={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_1cb,opts);
var cmp=_80.get(_1cb);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.Toolbar";
_4.event.init(this);
_4.event.registerCustomEvent(this,"onbeforeshow");
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onbeforehide");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onbeforedestroy");
_4.event.registerCustomEvent(this,"ondestroy");
_4.event.registerCustomEvent(this,"oncreate");
_4.event.registerCustomEvent(this,"onresize");
_4.event.registerCustomEvent(this,"onfocus");
_4.event.registerCustomEvent(this,"onblur");
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
this._registeredEvents.push(_4.event.attach(this._moreSpan,"onclick",_4.bindAsEventListener(this.onDropdownClick,this)));
}
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
}
};
this.resizeImplementation=function(){
if(this._showingExtraButtons){
this.hideDropDown();
}
var _1cc=this.cmpTarget.offsetWidth;
var _1cd=_1cc;
var _1ce=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1cf=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-right"));
_1cc-=(this._moreSpan.offsetWidth+_1ce+_1cf);
var _1d0=0;
var _1d1=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1d2=this.cmpTarget.childNodes[n];
var _1d3=parseInt(_4.className.getComputedProperty(_1d2,"margin-left"));
var _1d4=parseInt(_4.className.getComputedProperty(_1d2,"margin-right"));
if(isNaN(_1d3)){
_1d3=0;
}
if(isNaN(_1d4)){
_1d4=0;
}
_1d0+=_1d2.offsetWidth+_1d3+_1d4;
if(n==this.cmpTarget.childNodes.length-1){
_1cc=_1cd;
}
if(_1d0>=_1cc){
if(!this._showingMore){
this.showMore();
}
if(!_1d1){
this._extraBtns=n;
_1d1=true;
}
_4.className.remove(_1d2,"jsToolbarLast");
_1d2.style.visibility="hidden";
if(n>0){
_4.className.add(this.buttons[n-1].target,"jsToolbarLast");
}
}else{
if(n<this.buttons.length-1){
_4.className.remove(_1d2,"jsToolbarLast");
}else{
_4.className.add(_1d2,"jsToolbarLast");
}
_1d2.style.visibility="visible";
}
}
if(_1d0<_1cc){
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
_4.className.add(this.target,"jsToolbar");
this._moreSpan=_2.createElement("span");
this._moreSpan.id=this.divId+"_more";
this._moreSpan.className="jsToolbarDropdown jsToolbarDropdownHidden";
this.target.appendChild(this._moreSpan);
this._moreSpan.innerHTML=" ";
if(this.inDOM){
this._registeredEvents.push(_4.event.attach(this._moreSpan,"onclick",_4.bindAsEventListener(this.onDropdownClick,this)));
}
this._extraButtons=_2.createElement("div");
this._extraButtons.id=this.divId+"_extraBtns";
this._extraButtons.className="jsComponent jsContextMenu jsToolbarExtraPanel jsToolbarExtraPanelHidden";
_4.body().appendChild(this._extraButtons);
};
_4.Toolbar.prototype.addButton=function(opts,ndx){
var _1d5={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_4.mixin(_1d5,opts);
_1d5.target=_2.createElement("span");
_1d5.target.id=this.divId+"_btn_"+_1d5.id;
var _1d6="";
if(typeof (_1d5.onContentAdded)!="function"){
_1d6="<a"+(_1d5.className?" class=\""+_1d5.className+"\" ":"")+" href=\""+_4.getInactiveLocation()+"\">"+_1d5.label+"</a>";
}
if(ndx===_3){
ndx=this.buttons.length;
}
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<=this.buttons.length){
if(this._showingExtraButtons){
this.hideDropDown();
}
if(ndx==0){
if(this.buttons.length){
_4.className.remove(this.buttons[0].target,"jsToolbarFirst");
}
_1d5.target.className="jsToolbarFirst";
}
if(ndx==this.buttons.length){
if(this.buttons.length){
_4.className.remove(this.buttons[this.buttons.length-1].target,"jsToolbarLast");
}
_4.className.add(_1d5.target,"jsToolbarLast");
}
if(ndx==this.buttons.length){
this.buttons.push(_1d5);
this.cmpTarget.appendChild(_1d5.target);
}else{
if(ndx==0){
this.buttons.splice(ndx,0,_1d5);
}
this.cmpTarget.insertBefore(_1d5.target,this.cmpTarget.childNodes[ndx]);
}
_1d5.target.innerHTML=_1d6;
if(this.inDOM){
this.addClickEvent(this.buttons[ndx]);
this.resize();
}
}
};
_4.Toolbar.prototype.addClickEvent=function(btn){
if(typeof (btn.onContentAdded)=="function"){
btn.target.innerHTML="";
btn.onContentAdded();
}else{
if(typeof (btn.onclick)=="function"){
this._registeredEvents.push(_4.event.attach(btn.target.firstChild,"onclick",btn.onclick));
}
}
};
_4.Toolbar.prototype.getNextBtnId=function(){
var _1d7=true;
while(_1d7){
_1d7=false;
var _1d8=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1d8){
_1d7=true;
break;
}
}
}
return _1d8;
};
_4.Toolbar.prototype.removeButton=function(_1d9){
var ndx=null;
if(typeof (_1d9)=="number"){
ndx=ref;
}else{
if(typeof (_1d9)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1d9){
ndx=n;
break;
}
}
}else{
if(typeof (_1d9)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1d9){
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
_4.className.add(this.buttons[1].target,"jsToolbarFirst");
}
}
if(ndx==this.buttons.length-1){
if(this.buttons.length>1){
_4.className.add(this.buttons[this.buttons.length-2].target,"jsToolbarLast");
}
}
for(var n=0;n<this._registeredEvents.length;n++){
if(this._registeredEvents[n][0].parentNode==this.buttons[ndx].target){
_4.event.detach(this._registeredEvents[n]);
this._registeredEvents.splice(n,1);
break;
}
}
this.buttons.splice(ndx,1);
this.cmpTarget.removeChild(this.buttons[ndx].target);
this.resize();
}
};
_4.Toolbar.prototype.showMore=function(){
_4.className.remove(this._moreSpan,"jsToolbarDropdownHidden");
this._showingMore=true;
};
_4.Toolbar.prototype.hideMore=function(){
_4.className.add(this._moreSpan,"jsToolbarDropdownHidden");
this._showingMore=false;
if(this._showingExtraButtons){
this.hideDropDown();
}
};
_4.Toolbar.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
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
x=(e.clientX+_2.documentElement.scrollLeft);
y=(e.clientY+_2.documentElement.scrollTop);
}else{
x=0;
y=0;
}
}
}
if(x+this._extraButtons.offsetWidth>_4.body().offsetWidth){
x=x-this._extraButtons.offsetWidth;
}
if(y+this._extraButtons.offsetHeight>_4.body().offsetHeight){
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
_4.event.detach(_2,"onclick",this._checkMenuBind);
}
setTimeout(_4.bind(function(){
_4.event.attach(_2,"onclick",this._checkMenuBind=_4.bind(this.checkDropDown,this));
},this),1);
_4.className.remove(this._extraButtons,"jsToolbarExtraPanelHidden");
this._showingExtraButtons=true;
}
_4.event.cancel(e,true);
return false;
};
_4.Toolbar.prototype.checkDropDown=function(e){
if(this._checkMenuBind){
_4.event.detach(_2,"onclick",this._checkMenuBind);
}
this.hideDropDown();
};
_4.Toolbar.prototype.hideDropDown=function(){
if(this._showingExtraButtons){
while(this._extraButtons.childNodes.length){
this._extraButtons.childNodes[0].style.visibility="hidden";
this.cmpTarget.appendChild(this._extraButtons.childNodes[0]);
}
this._showingExtraButtons=false;
_4.className.add(this._extraButtons,"jsToolbarExtraPanelHidden");
}
};
return _4;
})(window,document);
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1da=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1db,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1dc(_1dd){
_1da.lastIndex=0;
return _1da.test(_1dd)?"\""+_1dd.replace(_1da,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1dd+"\"";
};
function str(key,_1de){
var i,k,v,_1df,mind=gap,_1e0,_1e1=_1de[key];
if(_1e1&&typeof _1e1==="object"&&typeof _1e1.toJSON==="function"){
_1e1=_1e1.toJSON(key);
}
if(typeof rep==="function"){
_1e1=rep.call(_1de,key,_1e1);
}
switch(typeof _1e1){
case "string":
return _1dc(_1e1);
case "number":
return isFinite(_1e1)?String(_1e1):"null";
case "boolean":
case "null":
return String(_1e1);
case "object":
if(!_1e1){
return "null";
}
gap+=_1db;
_1e0=[];
if(Object.prototype.toString.apply(_1e1)==="[object Array]"){
_1df=_1e1.length;
for(i=0;i<_1df;i+=1){
_1e0[i]=str(i,_1e1)||"null";
}
v=_1e0.length===0?"[]":gap?"[\n"+gap+_1e0.join(",\n"+gap)+"\n"+mind+"]":"["+_1e0.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1df=rep.length;
for(i=0;i<_1df;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1e1);
if(v){
_1e0.push(_1dc(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1e1){
if(Object.hasOwnProperty.call(_1e1,k)){
v=str(k,_1e1);
if(v){
_1e0.push(_1dc(k)+(gap?": ":":")+v);
}
}
}
}
v=_1e0.length===0?"{}":gap?"{\n"+gap+_1e0.join(",\n"+gap)+"\n"+mind+"}":"{"+_1e0.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1e2,_1e3,_1e4){
var i;
gap="";
_1db="";
if(typeof _1e4==="number"){
for(i=0;i<_1e4;i+=1){
_1db+=" ";
}
}else{
if(typeof _1e4==="string"){
_1db=_1e4;
}
}
rep=_1e3;
if(_1e3&&typeof _1e3!=="function"&&(typeof _1e3!=="object"||typeof _1e3.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1e2});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1e5){
var j;
function walk(_1e6,key){
var k,v,_1e7=_1e6[key];
if(_1e7&&typeof _1e7==="object"){
for(k in _1e7){
if(Object.hasOwnProperty.call(_1e7,k)){
v=walk(_1e7,k);
if(v!==undefined){
_1e7[k]=v;
}else{
delete _1e7[k];
}
}
}
}
return _1e5.call(_1e6,key,_1e7);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1e5==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

