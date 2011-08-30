window.Scriptor=(function(_1,_2,_3){
var _4={version:{major:2,minor:0,instance:"beta",toString:function(){
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
var st=_1.getComputedStyle(el);
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
var _31=_2.getElementsByTagName("body")[0];
var _32=_2.getElementsByTagName("head")[0];
if(o===_31||o===_32){
return true;
}
if(o==_2||o===_1){
return false;
}
if(!o){
return false;
}
if(typeof (o.cloneNode)!="function"){
return false;
}
var a=_2.createElement("div");
try{
var _33=o.cloneNode(false);
a.appendChild(_33);
a.removeChild(_33);
a=null;
_33=null;
return (o.nodeType!=3);
}
catch(e){
a=null;
return false;
}
},addOnLoad:function(f){
if(_1.onload){
var _34=_1.onload;
_1.onload=function(){
_34();
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
if(!_35){
_35=_2.getElementsByTagName("body")[0];
}
return _35;
},invalidate:function(_36,msg){
if(_36){
_4._calculateBrowserSize();
var _37=_2.getElementById("scriptor_invalidator");
if(!_37){
_37=_2.createElement("div");
_37.id="scriptor_invalidator";
_4.makeTransparent(_37,50);
_37.style.width=_38+"px";
_37.style.height=_39+"px";
_2.getElementsByTagName("body")[0].appendChild(_37);
}
if(msg){
if(!_37.firstChild){
var _3a="<div class=\"msg\">"+msg+"</div>";
_37.innerHTML=_3a;
_37.firstChild.style.left=((_38/2)-100)+"px";
_37.firstChild.style.top=((_39/2)-15)+"px";
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
_38=_2.body.clientWidth;
}else{
_38=_2.documentElement.clientWidth;
}
if(_2.documentElement.clientHeight==0){
_39=_2.body.clientHeight;
}else{
_39=_2.documentElement.clientHeight;
}
}else{
_38=_1.innerWidth;
_39=_1.innerHeight;
}
var x,y;
var _3b=_2.body.scrollHeight;
var _3c=_2.body.offsetHeight;
if(_3b>_3c){
x=_2.body.scrollWidth;
y=_2.body.scrollHeight;
}else{
x=_2.body.offsetWidth;
y=_2.body.offsetHeight;
}
_38=Math.max(_38,x);
_39=Math.max(_39,y);
var inv=_2.getElementById("scriptor_invalidator");
if(inv){
inv.style.width=_38+"px";
inv.style.height=_39+"px";
if(inv.firstChild){
inv.firstChild.style.left=((_38/2)-100)+"px";
inv.firstChild.style.top=((_39/2)-15)+"px";
}
}
},element:{getInnerBox:function(_3d){
var box={top:0,bottom:0,left:0,right:0};
var _3e=parseInt(_4.className.getComputedProperty(_3d,"padding-top"));
var _3f=parseInt(_4.className.getComputedProperty(_3d,"padding-bottom"));
var _40=parseInt(_4.className.getComputedProperty(_3d,"padding-left"));
var _41=parseInt(_4.className.getComputedProperty(_3d,"padding-right"));
if(!isNaN(_3e)){
box.top=_3e;
}
if(!isNaN(_3f)){
box.bottom=_3f;
}
if(!isNaN(_40)){
box.left=_40;
}
if(!isNaN(_41)){
box.right=_41;
}
var _42=parseInt(_4.className.getComputedProperty(_3d,"border-top-width"));
var _43=parseInt(_4.className.getComputedProperty(_3d,"border-bottom-width"));
var _44=parseInt(_4.className.getComputedProperty(_3d,"border-left-width"));
var _45=parseInt(_4.className.getComputedProperty(_3d,"border-right-width"));
if(!isNaN(_42)){
box.top+=_42;
}
if(!isNaN(_43)){
box.bottom+=_43;
}
if(!isNaN(_44)){
box.left+=_44;
}
if(!isNaN(_45)){
box.right+=_45;
}
return box;
},getOuterBox:function(_46){
var box={top:0,bottom:0,left:0,right:0};
var _47=parseInt(_4.className.getComputedProperty(_46,"margin-top"));
var _48=parseInt(_4.className.getComputedProperty(_46,"margin-bottom"));
var _49=parseInt(_4.className.getComputedProperty(_46,"margin-left"));
var _4a=parseInt(_4.className.getComputedProperty(_46,"margin-right"));
if(!isNaN(_47)){
box.top=_47;
}
if(!isNaN(_48)){
box.bottom=_48;
}
if(!isNaN(_49)){
box.left=_49;
}
if(!isNaN(_4a)){
box.right=_4a;
}
return box;
}},SHA1:function(msg){
var _4b=function(n,s){
var t4=(n<<s)|(n>>>(32-s));
return t4;
};
var _4c=function(val){
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
var _4d=function(val){
var str="";
var i;
var v;
for(i=7;i>=0;i--){
v=(val>>>(i*4))&15;
str+=v.toString(16);
}
return str;
};
var _4e=function(_4f){
_4f=_4f.replace(/\r\n/g,"\n");
var _50="";
for(var n=0;n<_4f.length;n++){
var c=_4f.charCodeAt(n);
if(c<128){
_50+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_50+=String.fromCharCode((c>>6)|192);
_50+=String.fromCharCode((c&63)|128);
}else{
_50+=String.fromCharCode((c>>12)|224);
_50+=String.fromCharCode(((c>>6)&63)|128);
_50+=String.fromCharCode((c&63)|128);
}
}
}
return _50;
};
var _51;
var i,j;
var W=new Array(80);
var H0=1732584193;
var H1=4023233417;
var H2=2562383102;
var H3=271733878;
var H4=3285377520;
var A,B,C,D,E;
var _52;
msg=_4e(msg);
var _53=msg.length;
var _54=new Array();
for(i=0;i<_53-3;i+=4){
j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);
_54.push(j);
}
switch(_53%4){
case 0:
i=2147483648;
break;
case 1:
i=msg.charCodeAt(_53-1)<<24|8388608;
break;
case 2:
i=msg.charCodeAt(_53-2)<<24|msg.charCodeAt(_53-1)<<16|32768;
break;
case 3:
i=msg.charCodeAt(_53-3)<<24|msg.charCodeAt(_53-2)<<16|msg.charCodeAt(_53-1)<<8|128;
break;
}
_54.push(i);
while((_54.length%16)!=14){
_54.push(0);
}
_54.push(_53>>>29);
_54.push((_53<<3)&4294967295);
for(_51=0;_51<_54.length;_51+=16){
for(i=0;i<16;i++){
W[i]=_54[_51+i];
}
for(i=16;i<=79;i++){
W[i]=_4b(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
}
A=H0;
B=H1;
C=H2;
D=H3;
E=H4;
for(i=0;i<=19;i++){
_52=(_4b(A,5)+((B&C)|(~B&D))+E+W[i]+1518500249)&4294967295;
E=D;
D=C;
C=_4b(B,30);
B=A;
A=_52;
}
for(i=20;i<=39;i++){
_52=(_4b(A,5)+(B^C^D)+E+W[i]+1859775393)&4294967295;
E=D;
D=C;
C=_4b(B,30);
B=A;
A=_52;
}
for(i=40;i<=59;i++){
_52=(_4b(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+2400959708)&4294967295;
E=D;
D=C;
C=_4b(B,30);
B=A;
A=_52;
}
for(i=60;i<=79;i++){
_52=(_4b(A,5)+(B^C^D)+E+W[i]+3395469782)&4294967295;
E=D;
D=C;
C=_4b(B,30);
B=A;
A=_52;
}
H0=(H0+A)&4294967295;
H1=(H1+B)&4294967295;
H2=(H2+C)&4294967295;
H3=(H3+D)&4294967295;
H4=(H4+E)&4294967295;
}
var _52=_4d(H0)+_4d(H1)+_4d(H2)+_4d(H3)+_4d(H4);
return _52.toLowerCase();
},MD5:function(_55){
var _56=function(_57,_58){
return (_57<<_58)|(_57>>>(32-_58));
};
var _59=function(lX,lY){
var lX4,lY4,lX8,lY8,_5a;
lX8=(lX&2147483648);
lY8=(lY&2147483648);
lX4=(lX&1073741824);
lY4=(lY&1073741824);
_5a=(lX&1073741823)+(lY&1073741823);
if(lX4&lY4){
return (_5a^2147483648^lX8^lY8);
}
if(lX4|lY4){
if(_5a&1073741824){
return (_5a^3221225472^lX8^lY8);
}else{
return (_5a^1073741824^lX8^lY8);
}
}else{
return (_5a^lX8^lY8);
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
a=_59(a,_59(_59(F(b,c,d),x),ac));
return _59(_56(a,s),b);
};
var GG=function(a,b,c,d,x,s,ac){
a=_59(a,_59(_59(G(b,c,d),x),ac));
return _59(_56(a,s),b);
};
var HH=function(a,b,c,d,x,s,ac){
a=_59(a,_59(_59(H(b,c,d),x),ac));
return _59(_56(a,s),b);
};
var II=function(a,b,c,d,x,s,ac){
a=_59(a,_59(_59(I(b,c,d),x),ac));
return _59(_56(a,s),b);
};
var _5b=function(_5c){
var _5d;
var _5e=_5c.length;
var _5f=_5e+8;
var _60=(_5f-(_5f%64))/64;
var _61=(_60+1)*16;
var _62=Array(_61-1);
var _63=0;
var _64=0;
while(_64<_5e){
_5d=(_64-(_64%4))/4;
_63=(_64%4)*8;
_62[_5d]=(_62[_5d]|(_5c.charCodeAt(_64)<<_63));
_64++;
}
_5d=(_64-(_64%4))/4;
_63=(_64%4)*8;
_62[_5d]=_62[_5d]|(128<<_63);
_62[_61-2]=_5e<<3;
_62[_61-1]=_5e>>>29;
return _62;
};
var _65=function(_66){
var _67="",_68="",_69,_6a;
for(_6a=0;_6a<=3;_6a++){
_69=(_66>>>(_6a*8))&255;
_68="0"+_69.toString(16);
_67=_67+_68.substr(_68.length-2,2);
}
return _67;
};
var _6b=function(_6c){
_6c=_6c.replace(/\r\n/g,"\n");
var _6d="";
for(var n=0;n<_6c.length;n++){
var c=_6c.charCodeAt(n);
if(c<128){
_6d+=String.fromCharCode(c);
}else{
if((c>127)&&(c<2048)){
_6d+=String.fromCharCode((c>>6)|192);
_6d+=String.fromCharCode((c&63)|128);
}else{
_6d+=String.fromCharCode((c>>12)|224);
_6d+=String.fromCharCode(((c>>6)&63)|128);
_6d+=String.fromCharCode((c&63)|128);
}
}
}
return _6d;
};
var x=Array();
var k,AA,BB,CC,DD,a,b,c,d;
var S11=7,S12=12,S13=17,S14=22;
var S21=5,S22=9,S23=14,S24=20;
var S31=4,S32=11,S33=16,S34=23;
var S41=6,S42=10,S43=15,S44=21;
_55=_6b(_55);
x=_5b(_55);
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
a=_59(a,AA);
b=_59(b,BB);
c=_59(c,CC);
d=_59(d,DD);
}
var _6e=_65(a)+_65(b)+_65(c)+_65(d);
return _6e.toLowerCase();
}};
var _6f=0;
var _70="scriptor_"+_6f;
var _71=function(){
_70="scriptor_"+_6f;
_6f++;
while(_2.getElementById(_70)){
_6f++;
_70="scriptor_"+_6f;
}
return _70;
};
var _39=0;
var _38=0;
var _35=null;
_4.cookie.init();
_4.httpRequest=function(_72){
var _73={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_4.mixin(_73,_72);
if(typeof (_73.ApiCall)!="string"||_73.ApiCall==""){
_4.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_73.ApiCall;
this.method="POST";
if(typeof (_73.method)=="string"){
this.method=_73.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_73.Type)=="string"){
switch(_73.Type.toLowerCase()){
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
if(typeof (_73.onLoad)=="function"){
this.onLoad=_73.onLoad;
}
this.onError=null;
if(typeof (_73.onError)=="function"){
this.onError=_73.onError;
}
this.requestHeaders=[];
if(_73.requestHeaders&&_73.requestHeaders.length){
for(var n=0;n<_73.requestHeaders.length;n++){
if(typeof (_73.requestHeaders[n][0])=="string"&&typeof (_73.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_73.requestHeaders[n][0],_73.requestHeaders[n][1]]);
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
},send:function(_74){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_74;
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
this.http_request.send(_74);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _75=null;
switch(this.Type){
case ("xml"):
_75=this.http_request.responseXML;
break;
case ("json"):
_75=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_75=this.http_request.responseText;
break;
}
this.onLoad(_75);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_4.httpRequest.prototype.lang={errors:{createRequestError:"Error creando objeto Ajax!",requestHandleError:"Se ha producido un error al enviar un objeto Ajax.\nPor favor, inténtelo nuevamente más tarde."}};
var _76={get:function(_77){
var _78={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_4.mixin(_78,_77);
if(!_78.divId){
_78.divId=_71();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_78.id,region:_78.region,style:_78.style,className:_78.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_78.canHaveChildren,hasInvalidator:_78.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_78.x,y:_78.y,width:_78.width,height:_78.height,resizable:_78.resizable,minHeight:_78.minHeight,maxHeight:_78.maxHeight,minWidth:_78.minWidth,maxWidth:_78.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
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
this.zIndexCache=this.target.style.zIndex?Number(this.target.style.zIndex):1;
this.target.style.zIndex=this.zIndexCache+1;
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
this.target.style.zIndex=this.zIndexCache;
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
var _79=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_79=n;
break;
}
}
var _7a=false;
var _7b=(_79==this.parent.components.length-1)?0:_79+1;
for(var n=_7b;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_79){
this.parent.components[n].focus();
_7a=true;
break;
}
}
if(!_7a&&_7b>0){
for(var n=0;n<_7b;n++){
if(this.parent.components[n].visible&&n!=_79){
this.parent.components[n].focus();
_7a=true;
break;
}
}
}
if(!_7a){
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
var _7c=this.className?("jsComponent jsComponentHidden "+this.className):"jsComponent jsComponentHidden";
this.target.className=this.target.className?(_7c+" "+this.target.className):_7c;
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
var _7d=_4.className.getComputedProperty(this.target,"width");
var _7e=_4.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_7d))){
this.width=parseInt(_7d);
}
if(this.height==null&&!isNaN(parseInt(_7e))){
this.height=parseInt(_7e);
}
if(_7d.substr(_7d.length-1)=="%"){
this._percentWidth=_7d;
}else{
this._origWidth=_7d;
}
if(_7e.substr(_7e.length-1)=="%"){
this._percentHeight=_7e;
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
var _7f=this.__getInnerBox();
var _80=this.__getOuterBox();
var _81=this.__getChildrenForRegion("top");
var _82=0;
var _83=(this.width-_7f.left-_7f.right-_80.left-_80.right)/_81.length;
var _84=false;
for(var n=0;n<_81.length;n++){
if(_81[n].height>_82){
_82=_81[n].height;
}
_81[n].x=(n*_83);
_81[n].y=0;
_81[n].width=_83;
_81[n].height=_81[n].height;
if(_81[n].resizable){
_84=true;
}
}
var _85=this.__getChildrenForRegion("bottom");
var _86=0;
var _87=(this.width-_7f.left-_7f.right-_80.left-_80.right)/_85.length;
var _88=false;
for(var n=0;n<_85.length;n++){
if(_85[n].height>_86){
_86=_85[n].height;
}
if(_85[n].resizable){
_88=true;
}
}
for(var n=0;n<_85.length;n++){
_85[n].x=(n*_87);
_85[n].y=this.height-_86-_7f.top-_7f.bottom;
_85[n].width=_87;
_85[n].height=_85[n].height;
}
var _89=this.__getChildrenForRegion("left");
var _8a=0;
var _8b=(this.height-_7f.top-_7f.bottom-_80.left-_80.right)/_89.length;
var _8c=false;
for(var n=0;n<_89.length;n++){
if(_89[n].width>_8a){
_8a=_89[n].width;
}
_89[n].x=0;
_89[n].y=_82+(n*_8b);
_89[n].height=_8b-_82-_86;
_89[n].width=_89[n].width;
if(_89[n].resizable){
_8c=true;
}
}
var _8d=this.__getChildrenForRegion("right");
var _8e=0;
var _8f=(this.height-_7f.top-_7f.bottom-_80.top-_80.bottom)/_8d.length;
var _90=false;
for(var n=0;n<_8d.length;n++){
if(_8d[n].width>_8e){
_8e=_8d[n].width;
}
if(_8d[n].resizable){
_90=true;
}
}
for(var n=0;n<_8d.length;n++){
_8d[n].x=this.width-_8e-_7f.left-_7f.right;
_8d[n].y=_82+(n*_8f);
_8d[n].width=_8e;
_8d[n].height=_8f-_82-_86;
}
var _91=this.__getChildrenForRegion("center");
var _92=(this.height-_7f.top-_7f.bottom-_80.top-_80.bottom-_86-_82)/_91.length;
for(var n=0;n<_91.length;n++){
_91[n].x=_8a;
_91[n].y=_82+(n*_92);
_91[n].height=_92;
_91[n].width=this.width-_7f.left-_7f.right-_80.left-_80.right-_8a-_8e;
}
if(_84){
if(!this.splitters.top){
this.splitters.top=_2.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_4.className.add(this.splitters.top,"jsSplitter");
_4.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_4.event.attach(this.splitters.top,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _93=_81[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_7f.left-_7f.right)+"px";
this.splitters.top.style.top=(_82-_93.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_88){
if(!this.splitters.bottom){
this.splitters.bottom=_2.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_4.className.add(this.splitters.bottom,"jsSplitter");
_4.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_4.event.attach(this.splitters.bottom,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _94=_85[0].__getOuterBox();
var _95=parseInt(_4.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_95)){
_95=5;
}
this.splitters.bottom.style.width=(this.width-_7f.left-_7f.right)+"px";
this.splitters.bottom.style.top=(this.height-_86-_95-_94.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_8c){
if(!this.splitters.left){
this.splitters.left=_2.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_4.className.add(this.splitters.left,"jsSplitter");
_4.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_4.event.attach(this.splitters.left,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _96=_89[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_7f.top-_7f.bottom-_82-_86)+"px";
this.splitters.left.style.top=(_82)+"px";
this.splitters.left.style.left=(_8a-_96.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_90){
if(!this.splitters.right){
this.splitters.right=_2.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_4.className.add(this.splitters.right,"jsSplitter");
_4.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_4.event.attach(this.splitters.right,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _97=_8d[0].__getOuterBox();
var _98=parseInt(_4.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_98)){
_98=5;
}
this.splitters.right.style.height=(this.height-_7f.top-_7f.bottom-_82-_86)+"px";
this.splitters.right.style.top=(_82)+"px";
this.splitters.right.style.left=(this.width-_8e-_98-_97.left)+"px";
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
},resizeTo:function(_99){
if(_99){
if(_99.width){
this.width=_99.width;
this._percentWidth=null;
}
if(_99.height){
this.height=_99.height;
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
var _9a=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_9a=true;
break;
}
}
if(!_9a&&ref.CMP_SIGNATURE&&this.canHaveChildren){
if(ref.parent){
ref.parent.removeChild(ref);
}
if(ref.target.parentNode){
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
var _9b=this.__getInnerBox();
var _9c=this.__getOuterBox();
var _9d=0,_9e=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_9c.left-_9c.right-_9b.left-_9b.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_9c=this.__getOuterBox();
_9d=this.target.parentNode.offsetWidth-_9c.left-_9c.right-_9b.left-_9b.right;
if(isNaN(_9d)||_9d<0){
_9d=0;
}
this.width=_9d;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_9e=this.target.offsetHeight-_9c.top-_9c.bottom-_9b.top-_9b.bottom;
if(isNaN(_9e)||_9e<0){
_9e=0;
}
this.height=_9e;
}
if(this.width!==null){
_9d=this.width-_9b.left-_9b.right-_9c.left-_9c.right;
if(isNaN(_9d)||_9d<0){
_9d=0;
}
this.target.style.width=_9d+"px";
}
if(this.height!==null){
_9e=this.height-_9b.top-_9b.bottom-_9c.top-_9c.bottom;
if(isNaN(_9e)||_9e<0){
_9e=0;
}
this.target.style.height=_9e+"px";
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
var _9f=parseInt(_4.className.getComputedProperty(this.target,"padding-top"));
var _a0=parseInt(_4.className.getComputedProperty(this.target,"padding-bottom"));
var _a1=parseInt(_4.className.getComputedProperty(this.target,"padding-left"));
var _a2=parseInt(_4.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_9f)){
box.top=_9f;
}
if(!isNaN(_a0)){
box.bottom=_a0;
}
if(!isNaN(_a1)){
box.left=_a1;
}
if(!isNaN(_a2)){
box.right=_a2;
}
var _a3=parseInt(_4.className.getComputedProperty(this.target,"border-top-width"));
var _a4=parseInt(_4.className.getComputedProperty(this.target,"border-bottom-width"));
var _a5=parseInt(_4.className.getComputedProperty(this.target,"border-left-width"));
var _a6=parseInt(_4.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_a3)){
box.top+=_a3;
}
if(!isNaN(_a4)){
box.bottom+=_a4;
}
if(!isNaN(_a5)){
box.left+=_a5;
}
if(!isNaN(_a6)){
box.right+=_a6;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _a7=parseInt(_4.className.getComputedProperty(this.target,"margin-top"));
var _a8=parseInt(_4.className.getComputedProperty(this.target,"margin-bottom"));
var _a9=parseInt(_4.className.getComputedProperty(this.target,"margin-left"));
var _aa=parseInt(_4.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_a7)){
box.top=_a7;
}
if(!isNaN(_a8)){
box.bottom=_a8;
}
if(!isNaN(_a9)){
box.left=_a9;
}
if(!isNaN(_aa)){
box.right=_aa;
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
},_onResizeStart:function(e,_ab){
if(!e){
e=_1.event;
}
this.resizingRegion=_ab;
_4.event.attach(_2,"mousemove",this._resizeMoveHandler=_4.bindAsEventListener(this._onResizeMove,this));
_4.event.attach(_2,"mouseup",this._resizeStopHandler=_4.bindAsEventListener(this._onResizeStop,this));
if(_ab=="top"||_ab=="bottom"){
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
var _ac=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_ac){
_4.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_ac;
var _ad=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_ad=_4.event.getPointXY(e).y;
}else{
_ad=_4.event.getPointXY(e).x;
}
var _ae=_ad-this.resizeStartingPosition;
this.resizeStartingPosition=_ad;
var _af=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_af.length;n++){
_af[n].resizeTo({height:_af[n].height+_ae});
}
break;
case ("bottom"):
for(var n=0;n<_af.length;n++){
_af[n].resizeTo({height:_af[n].height-_ae});
}
break;
case ("left"):
for(var n=0;n<_af.length;n++){
_af[n].resizeTo({width:_af[n].width+_ae});
}
break;
case ("right"):
for(var n=0;n<_af.length;n++){
_af[n].resizeTo({width:_af[n].width-_ae});
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
var _b0=["center","left","top","bottom","right"];
var _b1=false;
for(var n=0;n<_b0.length;n++){
if(cmp.region==_b0[n]){
_b1=true;
break;
}
}
if(!_b1){
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
cmp.divId=_71();
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
_4.ContextMenu=function(_b2){
var _b3={canHaveChildren:false,hasInvalidator:false,items:[]};
_4.mixin(_b3,_b2);
var cmp=_76.get(_b3);
for(var _b4 in cmp){
this[_b4]=cmp[_b4];
}
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
for(var n=0;n<_b3.items.length;n++){
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
x=(e.clientX+_2.documentElement.scrollLeft)-this.Width;
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
var _b5=_4.element.getOuterBox(this.ul);
var _b6=this.__getInnerBox();
this.width=this.ul.offsetWidth+_b5.left+_b5.right+_b6.left+_b6.right;
this.height=this.ul.offsetHeight+_b5.top+_b5.bottom+_b6.top+_b6.bottom;
this.__updatePosition();
};
_4.ContextMenu.prototype.addItem=function(_b7,ndx){
var _b8={label:"sep",onclick:null,checked:false};
_4.mixin(_b8,_b7);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_b8);
}else{
ndx=this.items.length;
this.items.push(_b8);
}
if(this.target){
var li=_2.createElement("li");
var _b9="";
var _ba=_b8;
if(_ba.label=="sep"){
li.className="contextMenuSep";
}else{
if(_ba.checked){
li.className="OptionChecked";
}
_b9+="<a href=\"#\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_ba["class"]){
_b9+=" class=\""+_ba["class"]+"\"";
}
_b9+=">"+_ba.label+"</a>";
}
li.innerHTML=_b9;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_ba.label!="sep"&&typeof (_ba.onclick)=="function"){
_4.event.attach(_2.getElementById(this.divId+"_itm_"+ndx),"onclick",_ba.onclick);
}
this.updateSize();
}
};
_4.ContextMenu.prototype.removeItem=function(_bb){
if(typeof (_bb)=="number"){
if(_bb>=0&&_bb<=this.items.length-1){
this.items.splice(_bb,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_bb]);
}
}
}else{
if(typeof (_bb)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_bb){
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
_4.ContextMenu.prototype.checkItem=function(_bc,_bd){
if(typeof (_bc)=="undefined"){
return;
}
if(typeof (_bd)=="undefined"){
_bd=false;
}
if(typeof (_bc)=="number"){
if(_bc>=0&&_bc<=this.items.length-1){
this.items[_bc].checked=_bd?true:false;
if(this.target){
_4.className[(_bd?"add":"remove")](this.ul.getElementsByTagName("li")[_bc],"OptionChecked");
}
}
}else{
if(typeof (_bc)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_bc){
this.items[n].checked=_bd?true:false;
if(this.target){
_4.className[(_bd?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_4.Panel=function(_be){
var _bf={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_bf,_be);
var cmp=_76.get(_bf);
for(var _c0 in cmp){
this[_c0]=cmp[_c0];
}
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
_4.TabContainer=function(_c1){
var _c2={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_c2,_c1);
var cmp=_76.get(_c2);
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
var _c3=this._tabList.cmpTarget.offsetWidth;
var _c4=_c3;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _c5=_2.getElementById(this._tabList.divId+"_more");
if(_c5){
var _c6=parseInt(_4.className.getComputedProperty(_c5,"margin-left"));
var _c7=parseInt(_4.className.getComputedProperty(_c5,"margin-right"));
_c3-=(_c5.offsetWidth+_c6+_c7);
}
var _c8=0;
var _c9=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _ca=this._tabList.cmpTarget.childNodes[n];
var _cb=parseInt(_4.className.getComputedProperty(_ca,"margin-left"));
var _cc=parseInt(_4.className.getComputedProperty(_ca,"margin-right"));
if(isNaN(_cb)){
_cb=0;
}
if(isNaN(_cc)){
_cc=0;
}
_c8+=_ca.offsetWidth+_cb+_cc;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_c3=_c4;
}
if(_c8>=_c3){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_c9){
this._tabList._extraTabs=n;
_c9=true;
}
_ca.style.visibility="hidden";
}else{
_ca.style.visibility="visible";
}
}
if(_c8<_c3){
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
this._tabList=new _cd({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _ce({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_4.TabContainer.prototype.addTab=function(_cf,_d0,ndx){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _d1={title:"",paneId:_d0.divId,pane:_d0,closable:false};
_4.mixin(_d1,_cf);
if(!_d1.pane||!_d1.pane.CMP_SIGNATURE||!_d1.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _d2=new _d3(_d1);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_d2);
}else{
this._tabs.push(_d2);
}
var _d4=this._tabList.cmpTarget.childNodes;
var _d5=_2.createElement("div");
_d5.id=_d2.paneId+"_tablabel";
_d5.className="jsTabLabel";
if(_d2.closable){
_4.className.add(_d5,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_d2.paneId;
_4.className.add(_d5,"jsTabSelected");
}
_d5.innerHTML="<span>"+_d2.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_d2.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_d5);
}else{
this._tabList.cmpTarget.insertBefore(_d5,_d4[ndx]);
}
this._pageContainer.addPage(_d2.pane);
this._pageContainer.activate(this._selectedTabId);
var _d6=_2.getElementById(_d2.paneId+"_closeHandler");
if(!_d2.closable){
_4.className.add(_d6,"jsTabCloseHidden");
}else{
_4.className.add(_d5,"jsTabClosable");
}
_4.event.attach(_d5,"onclick",_4.bindAsEventListener(this.selectTab,this,_d2.paneId));
_4.event.attach(_d6,"onclick",_4.bindAsEventListener(this.closeTab,this,_d2.paneId));
this.resize();
};
_4.TabContainer.prototype.removeTab=function(ref,_d7){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_d7)=="undefined"){
_d7=true;
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
var _d8=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _d8=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_d7);
this._tabs.splice(ndx,1);
if(_d8){
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
_4.TabContainer.prototype.setTitle=function(ref,_d9){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_d9;
this.resize();
}
};
_4.TabContainer.prototype.setClosable=function(ref,_da){
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
var _db=this._tabList.cmpTarget.childNodes[ndx];
var _dc=_2.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_da){
_4.className.add(_db,"jsTabClosable");
_4.className.remove(_dc,"jsTabCloseHidden");
}else{
_4.className.remove(_db,"jsTabClosable");
_4.className.add(_dc,"jsTabCloseHidden");
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
var _dd=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_dd){
if(this._tabsContextMenu.items.length>_dd){
while(this._tabsContextMenu.items.length>_dd){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_dd-this._tabsContextMenu.items.length;n++){
var _de=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_de].title,onclick:_4.bindAsEventListener(function(e,_df,_e0){
this.selectTab(_df);
},this,_de,this._tabList._extraTabs)},0);
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
var _cd=function(_e1){
var _e2={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_e2,_e1);
var cmp=_76.get(_e2);
for(var _e3 in cmp){
this[_e3]=cmp[_e3];
}
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
var _e4=_2.createElement("span");
_e4.id=this.divId+"_more";
_e4.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_e4);
_e4.innerHTML=" ";
_4.className.add(this.cmpTarget,"jsTabListInner");
_4.event.attach(_e4,"onclick",_4.bindAsEventListener(this.onDropdownClick,this));
};
_cd.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
}
this.parent._tabsContextMenu.show(e);
_4.event.cancel(e,true);
return false;
};
_cd.prototype.showMore=function(){
if(!this._showingMore){
_4.className.remove(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_cd.prototype.hideMore=function(){
if(this._showingMore){
_4.className.add(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _ce=function(_e5){
var _e6={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_e6,_e5);
var cmp=_76.get(_e6);
for(var _e7 in cmp){
this[_e7]=cmp[_e7];
}
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
_ce.prototype.addPage=function(_e8){
_4.className.add(_e8.target,"jsTabPage");
this.addChild(_e8);
};
_ce.prototype.removePage=function(_e9,_ea){
this.removeChild(_e9);
if(_ea){
_e9.destroy();
}
};
_ce.prototype.activate=function(_eb){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_eb){
this.components[n].show();
}
}
};
var _d3=function(_ec){
var _ed={title:"",paneId:null,pane:null,closable:false};
_4.mixin(_ed,_ec);
this.title=_ed.title;
this.paneId=_ed.paneId;
this.pane=_ed.pane;
this.closable=_ed.closable;
};
var _ee=function(_ef){
var _f0={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_4.mixin(_f0,_ef);
if(!_f0.Name){
_4.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_f0.Name;
this.Type=(typeof (_f1[_f0.Type])!="undefined")?_f0.Type:"alpha";
this.show=_f0.show;
this.Width=isNaN(Number(_f0.Width))?80:Number(_f0.Width);
this.Format=_f0.Format;
this.displayName=_f0.displayName?_f0.displayName:_f0.Name;
this.sqlName=_f0.sqlName?_f0.sqlName:_f0.Name;
this.showToolTip=_f0.showToolTip;
this.Compare=_f0.Compare;
};
var _f2=function(_f3,_f4){
_f4=_f4?_f4:{};
for(var n=0;n<_f3.length;n++){
var _f5=_f3[n].Name;
var _f6=_f3[n].Type;
this[_f5]=_f4[_f5]?_f1[_f6](_f4[_f5]):_f1[_f6]();
}
for(var _f7 in _f4){
if(this[_f7]===_3){
this[_f7]=_f4[_f7];
}
}
};
var _f1={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _f8=str.split(" ");
if(_f8[0]=="0000-00-00"){
return "";
}else{
var _f9=_f8[0].split("-");
ret=new Date(_f9[0],_f9[1]-1,_f9[2]);
if(_f8[1]){
var _fa=_f8[1].split(":");
ret=new Date(_f9[0],_f9[1]-1,_f9[2],_fa[0],_fa[1],_fa[2]);
}
}
}
return ret;
}};
_4.DataView=function(_fb){
var _fc={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_4.mixin(_fc,_fb);
var cmp=_76.get(_fc);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_fc.multiselect;
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
this.paginating=_fc.paginating;
this.rowsPerPage=_fc.rowsPerPage;
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
var _fd=this.__getInnerBox();
var _fe=this.__getOuterBox();
var _ff=_fd.top+_fd.bottom+_fe.top+_fe.bottom;
if(this._cached.pagination_header){
var _fe=_4.element.getOuterBox(this._cached.pagination_header);
_ff+=this._cached.pagination_header.offsetHeight+_fe.top+_fe.bottom;
}
if(this._cached.header){
var _fe=_4.element.getOuterBox(this._cached.header);
_ff+=this._cached.header.offsetHeight+_fe.top+_fe.bottom;
}
if(this._cached.footer){
var _fe=_4.element.getOuterBox(this._cached.footer);
_ff+=this._cached.footer.offsetHeight+_fe.top+_fe.bottom;
}
this._cached.outer_body.style.height=(this.height-_ff)+"px";
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
this._removeColumnFromUI(n);
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
for(var n=0;n<_fc.columns.length;n++){
this.addColumn(this.createColumn(_fc.columns[n]));
}
};
_4.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _100="";
if(this.paginating){
_100+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_100+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_100+="</label></li><li>";
_100+="<a href=\"#\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_100+="<a href=\"#\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_100+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_100+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_100+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_100+="</li></ul></div>";
}
_100+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_100+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_100+="<li class=\"dataViewCheckBoxHeader\">";
_100+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_100+="<li class=\"dataViewSep\"></li>";
}
_100+="</ul>";
_100+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_100+="<a href=\"#\"> </a></span></div>";
_100+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_100+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_100+="</div>";
_100+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_100;
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
var _101=0;
var _102=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_102){
n+=this.rowsPerPage;
_101++;
}
return _101;
};
_4.DataView.prototype.getNextRowId=function(){
var _103=true;
while(_103){
_103=false;
var _104=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_104){
_103=true;
break;
}
}
}
return _104;
};
_4.DataView.prototype.createColumn=function(opts){
return new _ee(opts);
};
_4.DataView.prototype.addColumn=function(_105,ndx){
if(this.__findColumn(_105.Name)==-1){
if(ndx===_3){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_105);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_105.Name]=_f1[_105.Type]();
}
}
if(!this.orderBy&&_105.show){
this.orderBy=_105.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_4.DataView.prototype.__findColumn=function(_106){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_106){
return n;
}
}
return -1;
};
_4.DataView.prototype.deleteColumn=function(_107){
var _108="";
var ndx=null;
if(typeof (_107)=="string"){
var _109=this.__findColumn(_107);
if(_109!=-1){
_108=this.columns[_109].Name;
ndx=_109;
this.columns.splice(_109,1);
}
}
if(typeof (_107)=="number"){
if(_107>0&&_107<this.columns.length){
_108=this.columns[_107].Name;
ndx=_107;
this.columns.splice(_107,1);
}
}
if(typeof (_107)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_107){
_108=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_108){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_108]=null;
delete this.rows[n][_108];
}
}
if(this.orderBy==_108){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_4.DataView.prototype._addColumnToUI=function(_10a,ndx){
var li=_2.createElement("li");
li.style.width=_10a.Width+"px";
var _10b="dataViewColumn";
if(!_10a.show){
_10b+=" dataViewColumnHidden";
}
li.className=_10b;
var a=_2.createElement("a");
if(this.orderBy==_10a.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href","#");
a.innerHTML=_10a.Name;
li.appendChild(a);
li2=_2.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_10b="dataViewFieldSep";
if(!_10a.show){
_10b+=" dataViewColumnHidden";
}
li2.className=_10b;
var _10c=this._cached.headerUl.getElementsByTagName("li");
if(!_10c.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _10d=this.multiselect?2:0;
if(ndx>=0&&(_10d+(ndx*2))<_10c.length){
this._cached.headerUl.insertBefore(li,_10c[_10d+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_10c[_10d+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_10a.Name,onclick:_4.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_10a.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_10a.Name,ndx);
}
}
};
_4.DataView.prototype._removeColumnFromUI=function(ndx){
var _10e=this.multiselect?2:0;
var _10f=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_10e+(ndx*2))<_10f.length){
this._cached.headerUl.removeChild(_10f[_10e+(ndx*2)]);
this._cached.headerUl.removeChild(_10f[_10e+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
};
_4.DataView.prototype._addRowToUI=function(_110){
if(_110<0||_110>this.rows.length-1){
return;
}
var _111=this.rows[_110].id;
var _112=_2.createElement("ul");
_112.id=this.divId+"_row_"+_111;
var _113=false;
if(!this.multiselect){
if(this.selectedRow==n){
_113=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_113=true;
break;
}
}
}
if(_113){
_112.className="dataViewRowSelected";
}
if(_110%2){
_4.className.add(_112,"dataViewRowOdd");
}
if(this.multiselect){
var _114=_2.createElement("li");
var _115="dataViewMultiselectCell";
_114.className=_115;
var _116="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_111+"\" class=\"dataViewCheckBox\" ";
if(_113){
_116+="checked=\"checked\" ";
}
_116+="/></li>";
_114.innerHTML=_116;
_112.appendChild(_114);
}
var _117=this._cached.rows_body.getElementsByTagName("ul");
if(_117.length==0){
this._cached.rows_body.appendChild(_112);
}else{
if(_110==this.rows.length-1){
this._cached.rows_body.appendChild(_112);
}else{
var _118=null;
for(var n=_110+1;n<this.rows.length;n++){
_118=_2.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_118){
break;
}
}
if(_118){
this._cached.rows_body.insertBefore(_112,_118);
}else{
this._cached.rows_body.appendChild(_112);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_111,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_4.DataView.prototype._removeRowFromUI=function(_119){
if(_119<0||_119>this.rows.length-1){
return;
}
var _11a=this.rows[_119].id;
var _11b=_2.getElementById(this.divId+"_row_"+_11a);
if(_11b){
this._cached.rows_body.removeChild(_11b);
}
this.__refreshFooter();
};
_4.DataView.prototype._addCellToUI=function(_11c,_11d,ndx){
var _11e=_2.getElementById(this.divId+"_row_"+_11c);
if(_11e){
var _11f=_11e.getElementsByTagName("li");
var li=_2.createElement("li");
li.id=this.divId+"_cell_"+_11c+"_"+ndx;
var _120="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_120+=" dataViewCellHidden";
}
if(ndx==0){
_120+=" dataViewFirstCell";
}
li.className=_120;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_11c)[_11d]);
}
if(ndx>0&&ndx<_11f.length-1){
_11e.insertBefore(li,_11f[ndx]);
}else{
_11e.appendChild(li);
}
this.setCellValue(_11c,_11d,this.getById(_11c)[_11d]);
}
};
_4.DataView.prototype._removeCellFromUI=function(_121,ndx){
var _122=this.multiselect?1:0;
var _123=_2.getElementById(this.divId+"_row_"+_121);
if(_123){
var _124=_123.getElementsByTagName("li");
if(ndx>0&&(_122+ndx)<_124.length){
_123.removeChild(_124[_122+ndx]);
}
}
};
_4.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _f2(this.columns,data);
};
_4.DataView.prototype.addRow=function(_125,ndx){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(!_125){
_125=this.createRow();
}else{
if(!_125.id){
_125.id=this.getNextRowId();
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
this.rows.splice(ndx,0,_125);
}else{
this.rows.push(_125);
}
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
};
_4.DataView.prototype.deleteRow=function(_126){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
var _127=-1;
if(typeof (_126)=="number"){
_127=_126;
this.rows.splice(_126,1);
}
if(typeof (_126)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_126){
_127=n;
this.rows.splice(n,1);
}
}
}
if(_127!=-1){
this._removeRowFromUI(_127);
}
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_127){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_127){
this.selectedRows[n]--;
}
}
}
}
this._UIUpdateSelection();
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
_4.DataView.prototype.searchRows=function(_128,_129){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_128]==_129){
ret.push(this.rows[n]);
}
}
return ret;
};
_4.DataView.prototype.setCellValue=function(_12a,_12b,_12c){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return false;
}
var _12d=this.__findColumn(_12b);
if(_12d==-1){
return false;
}
var _12e=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_12a){
_12e=n;
break;
}
}
if(_12e===null){
return false;
}
this.rows[_12e][_12b]=_12c;
var cell=_2.getElementById(this.divId+"_cell_"+_12a+"_"+_12d);
if(typeof (this.columns[_12d].Format)=="function"){
var _12f=this.columns[_12d].Format(_12c);
cell.innerHTML="";
if(typeof (_12f)=="string"){
cell.innerHTML=_12f;
}else{
cell.appendChild(_12f);
}
}else{
cell.innerHTML=_12c;
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
var _130;
if(!_2.getElementById(this.divId+"_message")){
_130=_2.createElement("div");
_130.id=this.divId+"_message";
_130.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_130);
}else{
_130=_2.getElementById(this.divId+"_message");
}
_130.innerHTML=msg;
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
_4.DataView.prototype._UISelectAll=function(_131){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_4.className[(_131?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_131;
}
};
_4.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _132=false;
if(!this.multiselect){
if(this.selectedRow==n){
_132=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_132=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_132;
}
_4.className[(_132?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_4.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_2.getElementById(this.divId+"_pageInput").value;
var _133=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_133){
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
var _134=this.getTotalPages();
if(this.curPage<_134-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.updateRows=function(_135){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(_135===_3){
_135=false;
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_135){
this._cached.rows_body.innerHTML="";
}
var _136=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_136.length;n++){
var _137=_136[n].id.substr(_136[n].id.lastIndexOf("_")+1);
if(!this.getById(_137)){
this._cached.rows_body.removeChild(_136[n]);
n--;
}
}
for(var n=0;n<this.rows.length;n++){
if(!_2.getElementById(this.divId+"_row_"+this.rows[n].id)){
this._addRowToUI(n);
}
}
if(this.selectedRow>=this.rows.length){
this.selectedRow=-1;
}
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>=this.rows.length){
this.selectedRows.splice(n,1);
n--;
}
}
if(!_135){
this._UIUpdateSelection();
}
this.__refreshFooter();
_4.event.fire(this,"oncontentupdated");
};
_4.DataView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Attempt to refresh footer on DataView not added to DOM");
return;
}
var _138="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_138+=this.lang.noRows;
}else{
if(this.rows.length==1){
_138+="1 "+" "+this.lang.row;
}else{
_138+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_2.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_138+=this.lang.noRows;
}else{
var _139=(this.rowsPerPage*this.curPage);
var _13a=(_139+this.rowsPerPage)>this.totalRows?this.totalRows:(_139+this.rowsPerPage);
_138+=(_139+1)+" - "+_13a+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_138+="</li></ul>";
this._cached.footer.innerHTML=_138;
};
_4.DataView.prototype.__setOrder=function(_13b){
if(!this.inDOM){
_4.error.report("Cant sort a DataView not in DOM");
return;
}
var _13c=this.columns[_13b].Name;
if(_13b>=0&&_13b<this.columns.length){
var _13d=this.multiselect?2:0;
var _13e=this._cached.headerUl.getElementsByTagName("li");
var _13f=this.__findColumn(this.orderBy);
_4.className.remove(_13e[_13d+(_13f*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_13c){
this.orderBy=_13c;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_4.className.add(_13e[_13d+(_13b*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _140=e.target||e.srcElement;
var _141=this.divId+"_selectRow_";
if(_140.nodeName.toLowerCase()=="input"&&_140.id.substr(0,_141.length)==_141){
var _142=_140.id.substr(_140.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_142){
this.__markRow(e,n);
break;
}
}
}else{
while(_140.nodeName.toLowerCase()!="ul"){
if(_140==this._cached.rows_body){
return;
}
_140=_140.parentNode;
}
var _142=_140.id.substr(_140.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_142){
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
var _143=e.target||e.srcElement;
if(_143.nodeName.toLowerCase()=="a"){
colNdx=Number(_143.id.substr(_143.id.lastIndexOf("_")+1));
if(!isNaN(colNdx)){
this.__setOrder(colNdx);
}
}
};
_4.DataView.prototype._onHeaderColumnMousedown=function(e){
if(!e){
e=_1.event;
}
var _144=e.target||e.srcElement;
if(_144.nodeName.toLowerCase()=="li"&&_144.className=="dataViewFieldSep"){
var _145=Number(_144.id.substr(_144.id.lastIndexOf("_")+1));
if(!isNaN(_145)){
this.activateResizing(e,_145);
}
}
};
_4.DataView.prototype.__selectRow=function(e,_146){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_146){
e.unselecting=_146;
}else{
if(this.multiselect){
var _147=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_146){
_147=true;
break;
}
}
if(_147){
e.unselecting=_146;
}else{
e.selecting=_146;
}
}else{
e.selecting=_146;
}
}
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_146!=-1){
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
if(this.selectedRow==_146&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_146;
_4.className.add(rows[_146],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_146){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_146;
this.selectedRows=[_146];
}
}else{
if(e.ctrlKey){
var _147=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_146){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_147=true;
}
}
if(!_147){
this.selectedRow=_146;
this.selectedRows.push(_146);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_146){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_146;
for(var n=this.selectedRows[0];(_146>this.selectedRows[0]?n<=_146:n>=_146);(_146>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_146);
this.selectedRow=_146;
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
_4.DataView.prototype.__markRow=function(e,_148){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_148;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _149=this.rows[_148].id;
elem=_2.getElementById(this.divId+"_selectRow_"+_149);
if(elem.checked){
this.selectedRows.push(_148);
this.selectedRow=_148;
var row=_2.getElementById(this.divId+"_row_"+_149);
_4.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_148){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_2.getElementById(this.divId+"_row_"+_149);
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
_4.DataView.prototype.toggleColumn=function(_14a){
if(this.columns[_14a].show){
this.columns[_14a].show=false;
}else{
this.columns[_14a].show=true;
}
var _14b=this.multiselect?2:0;
var _14c=this._cached.headerUl.getElementsByTagName("li");
if(_14a>=0&&((_14b+(_14a*2)+1)<_14c.length)){
_4.className[this.columns[_14a].show?"remove":"add"](_14c[_14b+(_14a*2)],"dataViewColumnHidden");
_4.className[this.columns[_14a].show?"remove":"add"](_14c[_14b+(_14a*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_14b=this.multiselect?1:0;
_4.className[this.columns[_14a].show?"remove":"add"](rows[n].childNodes[_14b+_14a],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_14a+2,this.columns[_14a].show);
};
_4.DataView.prototype.forceWidth=function(w){
};
_4.DataView.prototype.__calculateMinWidth=function(){
};
_4.DataView.prototype.__calculateTotalWidth=function(){
var _14d=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_14d+=cols[n].offsetWidth;
}
return _14d;
};
_4.DataView.prototype.__sort=function(_14e){
var n,_14f,swap;
if(!this.orderBy){
return;
}
for(n=_14e+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_14e][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_14e][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_14e][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_14e][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_14f=this.rows[_14e];
this.rows[_14e]=this.rows[n];
this.rows[n]=_14f;
if(this.selectedRow==_14e){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_14e;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_14e){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_14e;
}
}
}
}
}
if(_14e<this.rows.length-2){
this.__sort(_14e+1);
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
_4.DataView.prototype.__getColumnSqlName=function(_150){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_150){
return this.columns[n].sqlName;
}
}
return false;
};
_4.DataView.prototype.activateResizing=function(e,_151){
if(!e){
e=_1.event;
}
this.resColumnId=_151;
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
this.resizingFrom=this.columns[_151].Width;
this.resizingXCache=x;
_4.event.attach(_2,"mousemove",this._mouseMoveBind=_4.bindAsEventListener(this.doResizing,this));
_4.event.attach(_2,"mouseup",this._mouseUpBind=_4.bindAsEventListener(this.deactivateResizing,this));
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
var _152=Math.abs(this.resizingXCache-x);
var _153=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _154=this.resColumnId;
var _155=_154;
for(n=_154+1;n<this.columns.length;n++){
if(this.columns[n].show){
_155=n;
break;
}
}
var _156=false;
var _157=false;
if(!_153){
if((this.columns[_154].Width-_152)>0){
this.columns[_154].Width-=_152;
_156=true;
}
}else{
var _158=this.__calculateTotalWidth();
if((_158+_152)<this._cached.headerUl.offsetWidth){
this.columns[_154].Width+=_152;
_156=true;
}else{
if(_155!=_154){
if((this.columns[_155].Width-_152)>0){
this.columns[_154].Width+=_152;
this.columns[_155].Width-=_152;
_156=true;
_157=true;
}
}
}
}
var _159=this._cached.headerUl;
if(_159){
var cols=_159.getElementsByTagName("li");
var _15a=(this.multiselect?2:0);
var ndx=_15a+(_154*2);
cols[ndx].style.width=this.columns[_154].Width+"px";
if(_157){
ndx+=2;
cols[ndx].style.width=this.columns[_155].Width+"px";
}
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var cols=rows[n].getElementsByTagName("li");
var _15a=(this.multiselect?1:0);
var _15b=this.columns[_154].Width;
cols[_15a+(_154)].style.width=_15b+"px";
if(_157){
cols[_15a+(_154)+1].style.width=this.columns[_155].Width+"px";
}
}
};
_4.DataView.prototype.addDataType=function(name,_15c){
if(typeof (name)!="string"){
_4.error.report("Invalid data type name.");
return;
}
if(typeof (_15c)!="object"){
_4.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_15c.toString)!="function"){
_4.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_f1[name]){
_f1[name]=_15c;
}else{
_4.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.DataViewConnector=function(opts){
var _15d={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_15d,opts);
if(!_15d.dataView){
_4.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_15d.api)!="string"||_15d.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_15d.api;
this.dataView=_15d.dataView;
this.parameters=_15d.parameters;
this.type="json";
if(_15d.type){
switch(_15d.type.toLowerCase()){
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
if(typeof (_15d.method)=="string"){
this.method=_15d.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.dataView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _15e="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_15e+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_15e+="&"+this.parameters;
}
this.httpRequest.send(_15e);
_4.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(root.getAttribute("success")=="1"){
var _15f=Number(root.getAttribute("totalrows"));
if(!isNaN(_15f)){
this.dataView.totalRows=_15f;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _160={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _161=cols[a].getAttribute("name");
if(_161&&cols[a].firstChild){
var _162=this.dataView.__findColumn(_161)!=-1?this.dataView.columns[this.dataView.__findColumn(_161)].Type:"alpha";
_160[_161]=_f1[_162](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_160));
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
}else{
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(data.success){
var _15f=Number(data.totalrows);
if(!isNaN(_15f)){
this.dataView.totalRows=_15f;
}
for(var n=0;n<data.rows.length;n++){
var _160={};
for(var _161 in data.rows[n]){
var _162=this.dataView.__findColumn(_161)!=-1?this.dataView.columns[this.dataView.__findColumn(_161)].Type:"alpha";
_160[_161]=_f1[_162](data.rows[n][_161]);
}
this.dataView.addRow(this.dataView.createRow(_160));
}
}else{
this.dataView.setMessage(data.errormessage);
}
}
},_onError:function(_163){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_163+")");
}};
_4.DataView.prototype.lang={"noRows":"No hay filas para mostrar.","rows":"filas.","row":"fila.","pageStart":"Página ","pageMiddle":" de ","pageEnd":" Ir a página: ","pageGo":"Ir","pagePrev":"<< Anterior","pageNext":"Siguiente >>","refresh":"Actualizar","of":"de"};
var _164=function(opts){
var _165={id:null,parentId:0,parent:null,Name:""};
_4.mixin(_165,opts);
this.treeView=_165.treeView;
this.id=_165.id!==null?_165.id:this.treeView.getNextNodeId();
this.parentId=_165.parentId;
this.Name=String(_165.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_165.parent;
};
_164.prototype={searchNode:function(id){
var n;
var srch=null;
var _166=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_166<this.childNodes.length){
srch=this.childNodes[_166].searchNode(id);
_166++;
}
return srch;
},updateChildrenNodes:function(){
var _167=_2.getElementById(this.treeView.divId+"_"+this.id+"_branch");
for(var i=0;i<this.childNodes.length;i++){
var node=_2.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_167.appendChild(node);
var _168="";
var _169=this.childNodes[i].childNodes.length;
if(_169){
_168+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\"#\" class=\"";
_168+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_168+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_169){
_168+="class=\"treeViewSingleNode\" ";
}
_168+="href=\"#\">"+this.childNodes[i].Name+"</a>";
if(_169){
_168+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_168;
if(_169){
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_4.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_4.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_169){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_4.TreeView=function(opts){
var _16a={canHaveChildren:false,hasInvalidator:true};
_4.mixin(_16a,opts);
var cmp=_76.get(_16a);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.TreeView";
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
this.masterNode=new _164({id:0,parentId:0,parent:null,Name:"root",treeView:this});
this.nextNodeId=1;
this.create();
_4.className.add(this.target,"treeView");
var ul=_2.createElement("ul");
ul.id=this.divId+"_0_branch";
ul.className="treeViewContainer";
this.target.insertBefore(ul,this.invalidator);
this._registeredEvents=[];
this.DOMAddedImplementation=function(){
this.updateNodes();
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
}
};
};
_4.TreeView.prototype.getNextNodeId=function(){
var _16b=true;
while(_16b){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_16b=false;
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
var _16c;
if(!_2.getElementById(this.divId+"_message")){
_16c=_2.createElement("div");
_16c.id=this.divId+"_message";
_16c.className="treeViewMessageDiv";
this.target.appendChild(_16c);
}else{
_16c=_2.getElementById(this.divId+"_message");
}
_16c.innerHTML=msg;
}
};
_4.TreeView.prototype._expandNode=function(e,_16d){
if(!e){
e=_1.event;
}
var node=this.searchNode(_16d);
if(node.expanded){
node.expanded=false;
_2.getElementById(this.divId+"_"+_16d+"_branch").style.display="none";
}else{
node.expanded=true;
_2.getElementById(this.divId+"_"+_16d+"_branch").style.display="block";
}
_4.event.cancel(e);
return false;
};
_4.TreeView.prototype._selectNode=function(e,_16e){
if(!e){
e=_1.event;
}
if(this.selectedNode!==null){
var _16f=this.searchNode(this.selectedNode);
_4.className.remove(_2.getElementById(this.divId+"_"+_16f.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_16e){
var _16f=this.searchNode(_16e);
_4.className.add(_2.getElementById(this.divId+"_"+_16f.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_16e)?null:_16e;
_4.event.cancel(e,true);
return false;
};
_4.TreeView.prototype.addNode=function(opts,_170,ndx){
var _171=(_170==0)?this.masterNode:this.searchNode(_170);
if(_171){
var _172={treeView:this,parentId:_170,parent:_171,Name:""};
_4.mixin(_172,opts);
if(ndx>=0&&ndx<_171.childNodes.length){
_171.childNodes.splice(ndx,0,new _164(_172));
}else{
_171.childNodes.push(new _164(_172));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.deleteNode=function(_173){
if(_173==0||_173=="0"){
return;
}
this._searchAndDelete(_173,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype._searchAndDelete=function(_174,node){
var _175=false;
if(typeof (_174)=="number"||typeof (_174)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_174){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_175=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_174){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_175=true;
break;
}
}
}
if(!_175){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_174);
if(done){
_175=done;
break;
}
}
}
return _175;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.TreeViewConnector=function(opts){
var _176={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_176,opts);
if(!_176.treeView){
_4.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_176.api)!="string"||_176.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_176.api;
this.treeView=_176.treeView;
this.parameters=_176.parameters;
this.type="json";
if(_176.type){
switch(_176.type.toLowerCase()){
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
if(typeof (_176.method)=="string"){
this.method=_176.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _164({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _177=this._fetchNodes(root);
if(_177.length){
this._addNodesFromXml(_177,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _164({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_178,_179){
for(var n=0;n<_178.length;n++){
var id=null;
if(_178[n].getAttribute("id")){
id=_178[n].getAttribute("id");
}
var _17a=_178[n].getElementsByTagName("label")[0];
if(_17a){
labelStr=_17a.firstChild.data;
}
var _17b=_178[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_179);
if(_17b){
this._addNodesFromXml(this._fetchNodes(_178[n]),id);
}
}
},_addNodesFromJson:function(_17c,_17d){
for(var n=0;n<_17c.length;n++){
this.treeView.addNode({Name:_17c[n].label,id:_17c[n].id},_17d);
if(_17c[n].nodes){
this._addNodesFromJson(_17c[n].nodes,_17c[n].id);
}
}
},_onError:function(_17e){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_17e+")");
}};
_4.CalendarView=function(opts){
var _17f=new Date();
var _180={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_17f.getMonth(),year:_17f.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_4.mixin(_180,opts);
var cmp=_76.get(_180);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_180.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_180.month))&&_180.month>=0&&_180.month<12)?_180.month:_17f.getMonth();
this.curYear=(!isNaN(Number(_180.year))&&_180.year>0)?_180.year:new _17f.getFullYear();
this.disabledBefore=_180.disabledBefore;
this.disabledAfter=_180.disabledAfter;
this.disabledDays=_180.disabledDays;
this.disabledDates=_180.disabledDates;
this.markedDates=[];
this.hookedTo=null;
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
this.create();
_4.className.add(this.cmpTarget,"calendarView");
this.renderTemplate();
this.canHaveChildren=false;
this._registeredEvents=[];
this.DOMAddedImplementation=function(){
this.updateDates();
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_advancedAccept"),"onclick",_4.bindAsEventListener(this.selectAdvanced,this)));
this._registeredEvents.push(_4.event.attach(_2.getElementById(this.divId+"_advancedCancel"),"onclick",_4.bindAsEventListener(this.cancelAdvanced,this)));
};
this.DOMRemovedImplementation=function(){
while(this._registeredEvents.length){
_4.event.detach(this._registeredEvents.pop());
}
};
};
_4.CalendarView.prototype.renderTemplate=function(){
var _181="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_181+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_181+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _182=new Date();
if(this.selectedDates.length){
_182=this.selectedDates[0];
}
_181+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_181+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_182.getDate()+"\" /></p>";
_181+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_181+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_181+="<option value=\""+n+"\""+(_182.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_181+="</select></p>";
_181+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_181+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_182.getFullYear()+"\" /></p>";
_181+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_181+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_181+="</div>";
_181+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_181;
};
_4.CalendarView.prototype.updateDates=function(){
if(!this.inDOM){
_4.error.report("Can't update data on non visible calendarView object.");
return;
}
var _183=_2.getElementById(this.divId+"_body");
_183.style.display="";
_2.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
_183.innerHTML="";
var _184=_2.createElement("thead");
var _185,_186,_187,tmpA;
var _185=_2.createElement("tr");
for(var n=0;n<7;n++){
_186=_2.createElement("th");
_186.appendChild(_2.createTextNode(this.lang.shortDays[n]));
_185.appendChild(_186);
}
_184.appendChild(_185);
_183.appendChild(_184);
var _188=new Date();
var _189=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _18a=new Date(_189.getTime());
_18a.setMonth(_18a.getMonth()+1);
var _18b=_189.getDay();
var _18c=0;
var _18d=_2.createElement("tbody");
var _185=_2.createElement("tr");
while(_18c<_18b){
_187=_2.createElement("td");
_187.appendChild(_2.createTextNode(" "));
_185.appendChild(_187);
_18c++;
}
while(_189<_18a){
_187=_2.createElement("td");
_187.setAttribute("align","left");
_187.setAttribute("valign","top");
tmpA=_2.createElement("a");
tmpA.setAttribute("href","#");
tmpA.appendChild(_2.createTextNode(_189.getDate()));
var _18e=false;
if(this.isEqual(_189,_188)){
_18e=true;
}
var _18f=false;
if(this.isDisabledDate(_189)){
_18f=true;
if(_18e){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_189,this.markedDates[n])){
_18f=true;
if(_18e){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_189,this.selectedDates[n])){
_18f=true;
if(_18e){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_18f&&_18e){
tmpA.className="calendarToday";
}
_187.appendChild(tmpA);
_185.appendChild(_187);
_4.event.attach(tmpA,"onclick",_4.bind(this.selectDate,this,_189.getDate()));
_189.setDate(_189.getDate()+1);
_18c++;
if(_18c>6){
_18d.appendChild(_185);
_185=_2.createElement("tr");
_18c=0;
}
}
if(_18c>0){
_18d.appendChild(_185);
while(_18c<7){
_187=_2.createElement("td");
_187.appendChild(_2.createTextNode(" "));
_185.appendChild(_187);
_18c++;
}
}
_183.appendChild(_18d);
this.__refreshHeader();
this.__refreshFooter();
};
_4.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _190=_2.getElementById(this.divId+"_header");
_190.innerHTML="";
var _191="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\"#\"> </a></li>";
_191+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\"#\"> </a></li>";
_191+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\"#\"> </a></li>";
_191+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_191+="</ul>";
_190.innerHTML=_191;
_4.event.attach(_2.getElementById(this.divId+"_prevMonth"),"onclick",_4.bind(this.goPrevMonth,this));
_4.event.attach(_2.getElementById(this.divId+"_viewAdvanced"),"onclick",_4.bind(this.setAdvanced,this));
_4.event.attach(_2.getElementById(this.divId+"_nextMonth"),"onclick",_4.bind(this.goNextMonth,this));
};
_4.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _192=_2.getElementById(this.divId+"_footer");
_192.innerHTML="";
var _193="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\"#\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_193+=text;
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
_193+=text;
}
}else{
_193+=this.lang.noSelection+"</p>";
}
_192.innerHTML=_193;
_4.event.attach(_2.getElementById(this.divId+"_goHome"),"onclick",_4.bind(this.goHomeDate,this));
};
_4.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=_1.event;
}
_2.getElementById(this.divId+"_body").style.display="none";
_2.getElementById(this.divId+"_advanced").style.display="block";
var _194=new Date();
if(this.selectedDates.length){
_194=this.selectedDates[0];
}
_2.getElementById(this.divId+"DaySelector").value=_194.getDate();
_2.getElementById(this.divId+"MonthSelector").selectedIndex=_194.getMonth();
_2.getElementById(this.divId+"YearSelector").value=_194.getFullYear();
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
var _195=_2.getElementById(this.divId+"DaySelector").value;
var _196=_2.getElementById(this.divId+"MonthSelector").value;
var _197=_2.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_195))){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(isNaN(Number(_197))){
alert(this.lang.error2);
_4.event.cancel(e,true);
return false;
}
var _198=new Date(_197,_196,_195);
if(_198.getMonth()!=_196){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_198)){
alert(this.lang.error3);
_4.event.cancel(e,true);
return false;
}
var _199={selecting:_198,selectedDates:this.selectedDates};
_199=_4.event.fire(this,"onselect",_199);
if(_199.returnValue==false){
_4.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_198;
this.goHomeDate(e);
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=_1.event;
}
var _19a=new Date(this.curYear,this.curMonth,date);
var _19b={selecting:_19a,selectedDates:this.selectedDates};
_19b=_4.event.fire(this,"onselect",_19b);
if(_19b.returnValue==false){
_4.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_19a)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_19a;
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
_4.CalendarView.prototype.isEqual=function(_19c,_19d){
if(_19c.getFullYear()==_19d.getFullYear()&&_19c.getMonth()==_19d.getMonth()&&_19c.getDate()==_19d.getDate()){
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
var _19e;
if(this.selectedDates.length){
_19e=this.selectedDates[0];
}else{
_19e=new Date();
}
this.curMonth=_19e.getMonth();
this.curYear=_19e.getFullYear();
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.hook=function(_19f){
var elem=null;
if(typeof (_19f)=="string"){
elem=_2.getElementById(_19f);
}else{
if(_4.isHTMLElement(_19f)){
elem=_19f;
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
var _1a0=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1a0.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1a0.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
};
_4.CalendarView.prototype.getDateFromStr=function(str){
var _1a1=str.split("/");
var ret;
if(!isNaN(Number(_1a1[0]))&&!isNaN(Number(_1a1[1]))&&!isNaN(Number(_1a1[2]))){
if(this.lang.isFrenchDateFormat){
if(_1a1[1]>0&&_1a1[1]<13&&_1a1[0]>0&&_1a1[0]<32&&_1a1[2]>0){
ret=new Date(_1a1[2],_1a1[1]-1,_1a1[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1a1[0]>0&&_1a1[0]<13&&_1a1[1]>0&&_1a1[1]<32&&_1a1[2]>0){
ret=new Date(_1a1[2],_1a1[1]-1,_1a1[0],0,0,0);
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
var _1a2=function(_1a3,path,name){
this.thumbnail=_1a3;
this.path=path;
this.name=name;
};
_4.GalleryView=function(div,opts){
var _1a4={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_4.mixin(_1a4,opts);
var cmp=_76.get(_1a4);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1a4.showNames;
this.fixedThumbSize=_1a4.fixedThumbSize;
this.thumbWidth=_1a4.thumbWidth;
this.thumbHeight=_1a4.thumbHeight;
this.images=[];
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
this.DOMAddedImplementation=function(){
this.updateImages();
};
};
_4.GalleryView.prototype.addImage=function(opts){
var _1a5={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_4.mixin(_1a5,opts);
if(!_1a5.thumbnail){
_4.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1a5.insertIndex==this.images.length){
this.images.push(new _1a2(_1a5.thumbnail,_1a5.path,_1a5.name));
}else{
this.images.splice(_1a5.insertIndex,0,new _1a2(_1a5.thumbnail,_1a5.path,_1a5.name));
}
if(this.inDOM){
this.updateImages();
}
};
_4.GalleryView.prototype.deleteImage=function(_1a6){
if(typeof (_1a6)=="number"){
this.images.splice(_1a6,1);
}else{
if(typeof (_1a6)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1a6){
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
var _1a7;
if(!_2.getElementById(this.divId+"_message")){
_1a7=_2.createElement("p");
_1a7.id=this.divId+"_message";
this.target.appendChild(_1a7);
}else{
_1a7=_2.getElementById(this.divId+"_message");
}
_1a7.innerHTML=msg;
}
};
_4.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_4.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1a8="";
for(var n=0;n<this.images.length;n++){
_1a8+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1a8+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1a8+="class=\"gvSelectedImage\" ";
}
_1a8+=">";
_1a8+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1a8+="<p>"+this.images[n].name+"</p>";
}
_1a8+="</div>";
}
this.cmpTarget.innerHTML=_1a8;
for(var n=0;n<this.images.length;n++){
_4.event.attach(_2.getElementById(this.divId+"_img_"+n),"onclick",_4.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_4.GalleryView.prototype._selectImage=function(e,_1a9){
if(!e){
e=_1.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1a9;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1a9!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1a9){
this.selectedImage=-1;
}else{
this.selectedImage=_1a9;
imgs[_1a9].parentNode.className="gvSelectedImage";
}
}
_4.event.cancel(e);
return false;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.GalleryViewConnector=function(opts){
var _1aa={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_1aa,opts);
if(!_1aa.galleryView){
_4.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1aa.api)!="string"||_1aa.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_1aa.api;
this.galleryView=_1aa.galleryView;
this.parameters=_1aa.parameters;
this.type="json";
if(_1aa.type){
switch(_1aa.type.toLowerCase()){
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
if(typeof (_1aa.method)=="string"){
this.method=_1aa.method.toUpperCase()=="POST"?"POST":"GET";
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
var _1ab=root.getElementsByTagName("image");
for(var n=0;n<_1ab.length;n++){
var _1ac=_1ab.item(n).getElementsByTagName("thumbnail");
var path=_1ab.item(n).getElementsByTagName("path");
var name=_1ab.item(n).getElementsByTagName("name");
var _1ad="";
var _1ae="";
var _1af="";
if(_1ac.length){
if(_1ac.item(0).firstChild){
_1ad=_1ac.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1ae=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1af=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1a2(_1ad,_1ae,_1af));
var _1b0=_1ab.item(n).getElementsByTagName("param");
if(_1b0.length){
for(var a=0;a<_1b0.length;a++){
var _1b1=_1b0.item(a).getAttribute("name");
var _1b2="";
if(_1b0.item(a).firstChild){
_1b2=_1b0.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1b1]=_1b2;
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
var _1ad=data.images[n].thumbnail;
var _1ae=data.images[n].path;
var _1af=data.images[n].name;
this.galleryView.images.push(new _1a2(_1ad,_1ae,_1af));
for(var _1b3 in data.images[n]){
if(_1b3!="thumbnail"&&_1b3!="path"&&_1b3!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1b3]=data.images[n][_1b3];
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
},_onError:function(_1b4){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1b4+")");
}};
_4.Toolbar=function(opts){
var _1b5={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_1b5,opts);
var cmp=_76.get(_1b5);
for(var prop in cmp){
this[prop]=cmp[prop];
}
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
this.create();
_4.className.add(this.target,"jsToolbar");
this._moreSpan=_2.createElement("span");
this._moreSpan.id=this.divId+"_more";
this._moreSpan.className="jsToolbarDropdown jsToolbarDropdownHidden";
this.target.appendChild(this._moreSpan);
this._moreSpan.innerHTML=" ";
this._showingMore=false;
this._extraBtns=1;
this._extraButtons=_2.createElement("div");
this._extraButtons.id=this.divId+"_extraBtns";
this._extraButtons.className="jsComponent jsContextMenu jsToolbarExtraPanel jsToolbarExtraPanelHidden";
this._showingExtraButtons=false;
this._checkMenuBind=null;
_4.body().appendChild(this._extraButtons);
this.buttons=[];
this.nextButtonId="0";
this._registeredEvents=[];
this.DOMAddedImplementation=function(){
for(var n=0;n<this.buttons.length;n++){
this.addClickEvent(this.buttons[n]);
}
this._registeredEvents.push(_4.event.attach(this._moreSpan,"onclick",_4.bindAsEventListener(this.onDropdownClick,this)));
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
var _1b6=this.cmpTarget.offsetWidth;
var _1b7=_1b6;
var _1b8=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1b9=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-right"));
_1b6-=(this._moreSpan.offsetWidth+_1b8+_1b9);
var _1ba=0;
var _1bb=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1bc=this.cmpTarget.childNodes[n];
var _1bd=parseInt(_4.className.getComputedProperty(_1bc,"margin-left"));
var _1be=parseInt(_4.className.getComputedProperty(_1bc,"margin-right"));
if(isNaN(_1bd)){
_1bd=0;
}
if(isNaN(_1be)){
_1be=0;
}
_1ba+=_1bc.offsetWidth+_1bd+_1be;
if(n==this.cmpTarget.childNodes.length-1){
_1b6=_1b7;
}
if(_1ba>=_1b6){
if(!this._showingMore){
this.showMore();
}
if(!_1bb){
this._extraBtns=n;
_1bb=true;
}
_1bc.style.visibility="hidden";
}else{
_1bc.style.visibility="visible";
}
}
if(_1ba<_1b6){
if(this._showingMore){
this.hideMore();
}
this._extraBtns=this.buttons.length;
}
};
this.destroyImplementation=function(){
this._extraButtons.parentNode.removeChild(this._extraButtons);
};
};
_4.Toolbar.prototype.addButton=function(opts,ndx){
var _1bf={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_4.mixin(_1bf,opts);
_1bf.target=_2.createElement("span");
_1bf.target.id=this.divId+"_btn_"+_1bf.id;
var _1c0="";
if(typeof (_1bf.onContentAdded)!="function"){
_1c0="<a"+(_1bf.className?" class=\""+_1bf.className+"\" ":"")+" href=\"#\">"+_1bf.label+"</a>";
}
if(ndx===_3){
ndx=this.buttons.length;
}
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<=this.buttons.length){
if(this._showingExtraButtons){
this.hideDropDown();
}
if(ndx==this.buttons.length){
this.buttons.push(_1bf);
this.cmpTarget.appendChild(_1bf.target);
}else{
this.buttons.splice(ndx,0,_1bf);
this.cmpTarget.insertBefore(_1bf.target,this.cmpTarget.childNodes[ndx]);
}
_1bf.target.innerHTML=_1c0;
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
var _1c1=true;
while(_1c1){
_1c1=false;
var _1c2=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1c2){
_1c1=true;
break;
}
}
}
return _1c2;
};
_4.Toolbar.prototype.removeButton=function(_1c3){
var ndx=null;
if(typeof (_1c3)=="number"){
ndx=ref;
}else{
if(typeof (_1c3)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1c3){
ndx=n;
break;
}
}
}else{
if(typeof (_1c3)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1c3){
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
x=(e.clientX+_2.documentElement.scrollLeft)-this.Width;
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1c4=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1c5,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1c6(_1c7){
_1c4.lastIndex=0;
return _1c4.test(_1c7)?"\""+_1c7.replace(_1c4,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1c7+"\"";
};
function str(key,_1c8){
var i,k,v,_1c9,mind=gap,_1ca,_1cb=_1c8[key];
if(_1cb&&typeof _1cb==="object"&&typeof _1cb.toJSON==="function"){
_1cb=_1cb.toJSON(key);
}
if(typeof rep==="function"){
_1cb=rep.call(_1c8,key,_1cb);
}
switch(typeof _1cb){
case "string":
return _1c6(_1cb);
case "number":
return isFinite(_1cb)?String(_1cb):"null";
case "boolean":
case "null":
return String(_1cb);
case "object":
if(!_1cb){
return "null";
}
gap+=_1c5;
_1ca=[];
if(Object.prototype.toString.apply(_1cb)==="[object Array]"){
_1c9=_1cb.length;
for(i=0;i<_1c9;i+=1){
_1ca[i]=str(i,_1cb)||"null";
}
v=_1ca.length===0?"[]":gap?"[\n"+gap+_1ca.join(",\n"+gap)+"\n"+mind+"]":"["+_1ca.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1c9=rep.length;
for(i=0;i<_1c9;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1cb);
if(v){
_1ca.push(_1c6(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1cb){
if(Object.hasOwnProperty.call(_1cb,k)){
v=str(k,_1cb);
if(v){
_1ca.push(_1c6(k)+(gap?": ":":")+v);
}
}
}
}
v=_1ca.length===0?"{}":gap?"{\n"+gap+_1ca.join(",\n"+gap)+"\n"+mind+"}":"{"+_1ca.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1cc,_1cd,_1ce){
var i;
gap="";
_1c5="";
if(typeof _1ce==="number"){
for(i=0;i<_1ce;i+=1){
_1c5+=" ";
}
}else{
if(typeof _1ce==="string"){
_1c5=_1ce;
}
}
rep=_1cd;
if(_1cd&&typeof _1cd!=="function"&&(typeof _1cd!=="object"||typeof _1cd.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1cc});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1cf){
var j;
function walk(_1d0,key){
var k,v,_1d1=_1d0[key];
if(_1d1&&typeof _1d1==="object"){
for(k in _1d1){
if(Object.hasOwnProperty.call(_1d1,k)){
v=walk(_1d1,k);
if(v!==undefined){
_1d1[k]=v;
}else{
delete _1d1[k];
}
}
}
}
return _1cf.call(_1d0,key,_1d1);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1cf==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

