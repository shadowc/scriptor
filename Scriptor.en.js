window.Scriptor=(function(_1,_2,_3){
var _4={version:{major:2,minor:0,instance:"beta 8",toString:function(){
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
},getInactiveLocation:function(){
return String((_1.location.href.indexOf("#")!=-1)?_1.location.href:_1.location.href+"#");
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
_4.httpRequest.prototype.lang={errors:{createRequestError:"Error loading Ajax object!",requestHandleError:"There has been an error sending an Ajax object.\nPlease, try again later."}};
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
var _b4=_4.element.getOuterBox(this.ul);
var _b5=this.__getInnerBox();
this.target.style.width="auto";
this.width=this.ul.offsetWidth+_b4.left+_b4.right+_b5.left+_b5.right;
this.height=this.ul.offsetHeight+_b4.top+_b4.bottom+_b5.top+_b5.bottom;
this.__updatePosition();
};
_4.ContextMenu.prototype.addItem=function(_b6,ndx){
var _b7={label:"sep",onclick:null,checked:false};
_4.mixin(_b7,_b6);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_b7);
}else{
ndx=this.items.length;
this.items.push(_b7);
}
if(this.target){
var li=_2.createElement("li");
var _b8="";
var _b9=_b7;
if(_b9.label=="sep"){
li.className="contextMenuSep";
}else{
if(_b9.checked){
li.className="OptionChecked";
}
_b8+="<a href=\""+_4.getInactiveLocation()+"\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_b9["class"]){
_b8+=" class=\""+_b9["class"]+"\"";
}
_b8+=">"+_b9.label+"</a>";
}
li.innerHTML=_b8;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_b9.label!="sep"&&typeof (_b9.onclick)=="function"){
_4.event.attach(_2.getElementById(this.divId+"_itm_"+ndx),"onclick",_b9.onclick);
}
this.updateSize();
}
};
_4.ContextMenu.prototype.removeItem=function(_ba){
if(typeof (_ba)=="number"){
if(_ba>=0&&_ba<=this.items.length-1){
this.items.splice(_ba,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_ba]);
}
}
}else{
if(typeof (_ba)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_ba){
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
_4.ContextMenu.prototype.checkItem=function(_bb,_bc){
if(typeof (_bb)=="undefined"){
return;
}
if(typeof (_bc)=="undefined"){
_bc=false;
}
if(typeof (_bb)=="number"){
if(_bb>=0&&_bb<=this.items.length-1){
this.items[_bb].checked=_bc?true:false;
if(this.target){
_4.className[(_bc?"add":"remove")](this.ul.getElementsByTagName("li")[_bb],"OptionChecked");
}
}
}else{
if(typeof (_bb)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_bb){
this.items[n].checked=_bc?true:false;
if(this.target){
_4.className[(_bc?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_4.Panel=function(_bd){
var _be={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_be,_bd);
var cmp=_76.get(_be);
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
_4.TabContainer=function(_bf){
var _c0={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_c0,_bf);
var cmp=_76.get(_c0);
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
var _c1=this._tabList.cmpTarget.offsetWidth;
var _c2=_c1;
if(this._tabsContextMenu.visible){
this._tabsContextMenu.checkMenu();
}
var _c3=_2.getElementById(this._tabList.divId+"_more");
if(_c3){
var _c4=parseInt(_4.className.getComputedProperty(_c3,"margin-left"));
var _c5=parseInt(_4.className.getComputedProperty(_c3,"margin-right"));
_c1-=(_c3.offsetWidth+_c4+_c5);
}
var _c6=0;
var _c7=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _c8=this._tabList.cmpTarget.childNodes[n];
var _c9=parseInt(_4.className.getComputedProperty(_c8,"margin-left"));
var _ca=parseInt(_4.className.getComputedProperty(_c8,"margin-right"));
if(isNaN(_c9)){
_c9=0;
}
if(isNaN(_ca)){
_ca=0;
}
_c6+=_c8.offsetWidth+_c9+_ca;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_c1=_c2;
}
if(_c6>=_c1){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_c7){
this._tabList._extraTabs=n;
_c7=true;
}
_c8.style.visibility="hidden";
}else{
_c8.style.visibility="visible";
}
}
if(_c6<_c1){
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
this._tabList=new _cb({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _cc({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._canHaveChildren=false;
};
_4.TabContainer.prototype.addTab=function(_cd,_ce,ndx){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _cf={title:"",paneId:_ce.divId,pane:_ce,closable:false};
_4.mixin(_cf,_cd);
if(!_cf.pane||!_cf.pane.CMP_SIGNATURE||!_cf.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _d0=new _d1(_cf);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_d0);
}else{
this._tabs.push(_d0);
}
var _d2=this._tabList.cmpTarget.childNodes;
var _d3=_2.createElement("div");
_d3.id=_d0.paneId+"_tablabel";
_d3.className="jsTabLabel";
if(_d0.closable){
_4.className.add(_d3,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_d0.paneId;
_4.className.add(_d3,"jsTabSelected");
}
_d3.innerHTML="<span>"+_d0.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_d0.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_d3);
}else{
this._tabList.cmpTarget.insertBefore(_d3,_d2[ndx]);
}
this._pageContainer.addPage(_d0.pane);
this._pageContainer.activate(this._selectedTabId);
var _d4=_2.getElementById(_d0.paneId+"_closeHandler");
if(!_d0.closable){
_4.className.add(_d4,"jsTabCloseHidden");
}else{
_4.className.add(_d3,"jsTabClosable");
}
_4.event.attach(_d3,"onclick",_4.bindAsEventListener(this.selectTab,this,_d0.paneId));
_4.event.attach(_d4,"onclick",_4.bindAsEventListener(this.closeTab,this,_d0.paneId));
this.resize();
};
_4.TabContainer.prototype.removeTab=function(ref,_d5){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_d5)=="undefined"){
_d5=true;
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
var _d6=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _d6=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_d5);
this._tabs.splice(ndx,1);
if(_d6){
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
_4.TabContainer.prototype.setTitle=function(ref,_d7){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_d7;
this.resize();
}
};
_4.TabContainer.prototype.setClosable=function(ref,_d8){
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
var _d9=this._tabList.cmpTarget.childNodes[ndx];
var _da=_2.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_d8){
_4.className.add(_d9,"jsTabClosable");
_4.className.remove(_da,"jsTabCloseHidden");
}else{
_4.className.remove(_d9,"jsTabClosable");
_4.className.add(_da,"jsTabCloseHidden");
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
var _db=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_db){
if(this._tabsContextMenu.items.length>_db){
while(this._tabsContextMenu.items.length>_db){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_db-this._tabsContextMenu.items.length;n++){
var _dc=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_dc].title,onclick:_4.bindAsEventListener(function(e,_dd,_de){
this.selectTab(_dd);
},this,_dc,this._tabList._extraTabs)},0);
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
var _cb=function(_df){
var _e0={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_e0,_df);
var cmp=_76.get(_e0);
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
var _e1=_2.createElement("span");
_e1.id=this.divId+"_more";
_e1.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_e1);
_e1.innerHTML=" ";
_4.className.add(this.cmpTarget,"jsTabListInner");
_4.event.attach(_e1,"onclick",_4.bindAsEventListener(this.onDropdownClick,this));
};
_cb.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
}
this.parent._tabsContextMenu.show(e);
_4.event.cancel(e,true);
return false;
};
_cb.prototype.showMore=function(){
if(!this._showingMore){
_4.className.remove(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_cb.prototype.hideMore=function(){
if(this._showingMore){
_4.className.add(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _cc=function(_e2){
var _e3={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_e3,_e2);
var cmp=_76.get(_e3);
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
_cc.prototype.addPage=function(_e4){
_4.className.add(_e4.target,"jsTabPage");
this.addChild(_e4);
};
_cc.prototype.removePage=function(_e5,_e6){
this.removeChild(_e5);
if(_e6){
_e5.destroy();
}
};
_cc.prototype.activate=function(_e7){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_e7){
this.components[n].show();
}
}
};
var _d1=function(_e8){
var _e9={title:"",paneId:null,pane:null,closable:false};
_4.mixin(_e9,_e8);
this.title=_e9.title;
this.paneId=_e9.paneId;
this.pane=_e9.pane;
this.closable=_e9.closable;
};
var _ea=20;
var _eb=function(_ec){
var _ed={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_4.mixin(_ed,_ec);
if(!_ed.Name){
_4.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_ed.Name;
this.Type=(typeof (_ee[_ed.Type])!="undefined")?_ed.Type:"alpha";
this.show=_ed.show;
this.percentWidth=null;
if(!isNaN(Number(_ed.Width))){
this.Width=Number(_ed.Width);
}else{
if(typeof (_ed.Width)=="string"){
if(_ed.Width.length>2&&_ed.Width.substr(_ed.Width.length-2)=="px"&&!isNaN(parseInt(_ed.Width))){
this.Width=parseInt(_ed.Width);
}else{
if(_ed.Width.length>1&&_ed.Width.substr(_ed.Width.length-1)=="%"&&!isNaN(parseInt(_ed.Width))){
this.Width=_ea;
this.percentWidth=parseInt(_ed.Width);
}
}
}
}
this.origWidth=this.Width;
this.Format=_ed.Format;
this.displayName=_ed.displayName?_ed.displayName:_ed.Name;
this.sqlName=_ed.sqlName?_ed.sqlName:_ed.Name;
this.showToolTip=_ed.showToolTip;
this.Compare=_ed.Compare;
};
var _ef=function(_f0,_f1){
_f1=_f1?_f1:{};
for(var n=0;n<_f0.length;n++){
var _f2=_f0[n].Name;
var _f3=_f0[n].Type;
this[_f2]=_f1[_f2]?_ee[_f3](_f1[_f2]):_ee[_f3]();
}
for(var _f4 in _f1){
if(this[_f4]===_3){
this[_f4]=_f1[_f4];
}
}
};
var _ee={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _f5=str.split(" ");
if(_f5[0]=="0000-00-00"){
return "";
}else{
var _f6=_f5[0].split("-");
ret=new Date(_f6[0],_f6[1]-1,_f6[2]);
if(_f5[1]){
var _f7=_f5[1].split(":");
ret=new Date(_f6[0],_f6[1]-1,_f6[2],_f7[0],_f7[1],_f7[2]);
}
}
}
return ret;
}};
_4.DataView=function(_f8){
var _f9={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_4.mixin(_f9,_f8);
var cmp=_76.get(_f9);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_f9.multiselect;
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
this.paginating=_f9.paginating;
this.rowsPerPage=_f9.rowsPerPage;
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
var _fa=this.__getInnerBox();
var _fb=this.__getOuterBox();
var _fc=_fa.top+_fa.bottom+_fb.top+_fb.bottom;
if(this._cached.pagination_header){
var _fb=_4.element.getOuterBox(this._cached.pagination_header);
_fc+=this._cached.pagination_header.offsetHeight+_fb.top+_fb.bottom;
}
if(this._cached.header){
var _fb=_4.element.getOuterBox(this._cached.header);
_fc+=this._cached.header.offsetHeight+_fb.top+_fb.bottom;
}
if(this._cached.footer){
var _fb=_4.element.getOuterBox(this._cached.footer);
_fc+=this._cached.footer.offsetHeight+_fb.top+_fb.bottom;
}
this._cached.outer_body.style.height=(this.height-_fc)+"px";
this._adjustColumnsWidth();
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
for(var n=0;n<_f9.columns.length;n++){
this.addColumn(this.createColumn(_f9.columns[n]));
}
};
_4.DataView.prototype.renderTemplate=function(){
if(!this._templateRendered){
var _fd="";
var _fe=_4.getInactiveLocation();
if(this.paginating){
_fd+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_fd+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_fd+="</label></li><li>";
_fd+="<a href=\""+_fe+"\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_fd+="<a href=\""+_fe+"\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_fd+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_fd+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_fd+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_fd+="</li></ul></div>";
}
_fd+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_fd+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_fd+="<li class=\"dataViewCheckBoxHeader\">";
_fd+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_fd+="<li class=\"dataViewSep\"></li>";
}
_fd+="</ul>";
_fd+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_fd+="<a href=\""+_fe+"\"> </a></span></div>";
_fd+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_fd+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_fd+="</div>";
_fd+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_fd;
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
var _ff=0;
var _100=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_100){
n+=this.rowsPerPage;
_ff++;
}
return _ff;
};
_4.DataView.prototype.getNextRowId=function(){
var _101=true;
while(_101){
_101=false;
var _102=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_102){
_101=true;
break;
}
}
}
return _102;
};
_4.DataView.prototype.createColumn=function(opts){
return new _eb(opts);
};
_4.DataView.prototype.addColumn=function(_103,ndx){
if(this.__findColumn(_103.Name)==-1){
if(ndx===_3){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_103);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_103.Name]=_ee[_103.Type]();
}
}
if(!this.orderBy&&_103.show){
this.orderBy=_103.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_4.DataView.prototype.__findColumn=function(_104){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_104){
return n;
}
}
return -1;
};
_4.DataView.prototype.deleteColumn=function(_105){
var _106="";
var ndx=null;
if(typeof (_105)=="string"){
var _107=this.__findColumn(_105);
if(_107!=-1){
_106=this.columns[_107].Name;
ndx=_107;
this.columns.splice(_107,1);
}
}
if(typeof (_105)=="number"){
if(_105>0&&_105<this.columns.length){
_106=this.columns[_105].Name;
ndx=_105;
this.columns.splice(_105,1);
}
}
if(typeof (_105)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_105){
_106=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_106){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_106]=null;
delete this.rows[n][_106];
}
}
if(this.orderBy==_106){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_4.DataView.prototype._addColumnToUI=function(_108,ndx){
var li=_2.createElement("li");
li.style.width=_108.Width+"px";
var _109="dataViewColumn";
if(!_108.show){
_109+=" dataViewColumnHidden";
}
li.className=_109;
var a=_2.createElement("a");
if(this.orderBy==_108.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href",_4.getInactiveLocation());
a.innerHTML=_108.displayName;
li.appendChild(a);
li2=_2.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_109="dataViewFieldSep";
if(!_108.show){
_109+=" dataViewColumnHidden";
}
li2.className=_109;
var _10a=this._cached.headerUl.getElementsByTagName("li");
if(!_10a.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _10b=this.multiselect?2:0;
if(ndx>=0&&(_10b+(ndx*2))<_10a.length){
this._cached.headerUl.insertBefore(li,_10a[_10b+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_10a[_10b+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_108.displayName,onclick:_4.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_108.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_108.Name,ndx);
}
}
this._adjustColumnsWidth();
};
_4.DataView.prototype._removeColumnFromUI=function(ndx){
var _10c=this.multiselect?2:0;
var _10d=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_10c+(ndx*2))<_10d.length){
this._cached.headerUl.removeChild(_10d[_10c+(ndx*2)]);
this._cached.headerUl.removeChild(_10d[_10c+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
this._adjustColumnsWidth();
};
_4.DataView.prototype._addRowToUI=function(_10e){
if(_10e<0||_10e>this.rows.length-1){
return;
}
var _10f=this.rows[_10e].id;
var _110=_2.createElement("ul");
_110.id=this.divId+"_row_"+_10f;
var _111=false;
if(!this.multiselect){
if(this.selectedRow==n){
_111=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_111=true;
break;
}
}
}
if(_111){
_110.className="dataViewRowSelected";
}
if(_10e%2){
_4.className.add(_110,"dataViewRowOdd");
}
if(this.multiselect){
var _112=_2.createElement("li");
var _113="dataViewMultiselectCell";
_112.className=_113;
var _114="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_10f+"\" class=\"dataViewCheckBox\" ";
if(_111){
_114+="checked=\"checked\" ";
}
_114+="/></li>";
_112.innerHTML=_114;
_110.appendChild(_112);
}
var _115=this._cached.rows_body.getElementsByTagName("ul");
if(_115.length==0){
this._cached.rows_body.appendChild(_110);
}else{
if(_10e==this.rows.length-1){
this._cached.rows_body.appendChild(_110);
}else{
var _116=null;
for(var n=_10e+1;n<this.rows.length;n++){
_116=_2.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_116){
break;
}
}
if(_116){
this._cached.rows_body.insertBefore(_110,_116);
}else{
this._cached.rows_body.appendChild(_110);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_10f,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_4.DataView.prototype._removeRowFromUI=function(_117){
if(_117<0||_117>this.rows.length-1){
return;
}
var _118=this.rows[_117].id;
var _119=_2.getElementById(this.divId+"_row_"+_118);
if(_119){
this._cached.rows_body.removeChild(_119);
}
this.__refreshFooter();
};
_4.DataView.prototype._refreshRowInUI=function(_11a){
var row=this.getById(_11a);
if(row){
var _11b=_2.getElementById(this.divId+"_row_"+_11a);
if(_11b){
for(var a=0;a<this.columns.length;a++){
this.setCellValue(_11a,this.columns[a].Name,row[this.columns[a].Name]);
}
}
}
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
if(ndx>=0&&ndx<_11f.length-1){
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
if(ndx>=0&&(_122+ndx)<_124.length){
_123.removeChild(_124[_122+ndx]);
}
}
};
_4.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _ef(this.columns,data);
};
_4.DataView.prototype.addRow=function(_125,ndx,ui){
if(ui===_3){
ui=true;
}
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
_4.DataView.prototype.deleteRow=function(_126,ui){
if(ui===_3){
ui=true;
}
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
if(_127!=-1&&ui){
this._removeRowFromUI(_127);
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
var _136=null;
if(this.selectedRow!=-1&&this.rows[this.selectedRow]){
_136=this.rows[this.selectedRow].id;
}
var _137=[];
if(this.selectedRows.length){
for(var n=0;n<this.selectedRows.length;n++){
if(this.rows[this.selectedRows[n]]){
_137.push(this.rows[this.selectedRows[n]].id);
}
}
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_135){
this._cached.rows_body.innerHTML="";
}
var _138=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_138.length;n++){
var _139=_138[n].id.substr(_138[n].id.lastIndexOf("_")+1);
if(!this.getById(_139)){
this._cached.rows_body.removeChild(_138[n]);
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
if(!_135){
this.selectedRow=-1;
if(_136){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_136){
this.selectedRow=n;
break;
}
}
}
this.selectedRows=[];
if(_137.length){
for(var a=0;a<_137.length;a++){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_137[a]){
this.selectedRows.push(n);
break;
}
}
}
}
}
this._UIUpdateSelection();
if(_135){
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
var _13a="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_13a+=this.lang.noRows;
}else{
if(this.rows.length==1){
_13a+="1 "+" "+this.lang.row;
}else{
_13a+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_2.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_13a+=this.lang.noRows;
}else{
var _13b=(this.rowsPerPage*this.curPage);
var _13c=(_13b+this.rowsPerPage)>this.totalRows?this.totalRows:(_13b+this.rowsPerPage);
_13a+=(_13b+1)+" - "+_13c+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_13a+="</li></ul>";
this._cached.footer.innerHTML=_13a;
};
_4.DataView.prototype.__setOrder=function(_13d){
if(!this.inDOM){
_4.error.report("Cant sort a DataView not in DOM");
return;
}
var _13e=this.columns[_13d].Name;
if(_13d>=0&&_13d<this.columns.length){
var _13f=this.multiselect?2:0;
var _140=this._cached.headerUl.getElementsByTagName("li");
var _141=this.__findColumn(this.orderBy);
_4.className.remove(_140[_13f+(_141*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_13e){
this.orderBy=_13e;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_4.className.add(_140[_13f+(_13d*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _142=e.target||e.srcElement;
var _143=this.divId+"_selectRow_";
if(_142.nodeName.toLowerCase()=="input"&&_142.id.substr(0,_143.length)==_143){
var _144=_142.id.substr(_142.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_144){
this.__markRow(e,n);
break;
}
}
}else{
while(_142.nodeName.toLowerCase()!="ul"){
if(_142==this._cached.rows_body){
return;
}
_142=_142.parentNode;
}
var _144=_142.id.substr(_142.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_144){
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
var _145=e.target||e.srcElement;
if(_145.nodeName.toLowerCase()=="a"){
colNdx=Number(_145.id.substr(_145.id.lastIndexOf("_")+1));
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
var _146=e.target||e.srcElement;
if(_146.nodeName.toLowerCase()=="li"&&_146.className=="dataViewFieldSep"){
var _147=Number(_146.id.substr(_146.id.lastIndexOf("_")+1));
if(!isNaN(_147)){
this.activateResizing(e,_147);
}
}
};
_4.DataView.prototype.__selectRow=function(e,_148){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_148){
e.unselecting=_148;
}else{
if(this.multiselect){
var _149=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_148){
_149=true;
break;
}
}
if(_149){
e.unselecting=_148;
}else{
e.selecting=_148;
}
}else{
e.selecting=_148;
}
}
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_148!=-1){
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
if(this.selectedRow==_148&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_148;
_4.className.add(rows[_148],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_148){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_148;
this.selectedRows=[_148];
}
}else{
if(e.ctrlKey){
var _149=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_148){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_149=true;
}
}
if(!_149){
this.selectedRow=_148;
this.selectedRows.push(_148);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_148){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_148;
for(var n=this.selectedRows[0];(_148>this.selectedRows[0]?n<=_148:n>=_148);(_148>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_148);
this.selectedRow=_148;
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
_4.DataView.prototype.__markRow=function(e,_14a){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_14a;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _14b=this.rows[_14a].id;
elem=_2.getElementById(this.divId+"_selectRow_"+_14b);
if(elem.checked){
this.selectedRows.push(_14a);
this.selectedRow=_14a;
var row=_2.getElementById(this.divId+"_row_"+_14b);
_4.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_14a){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_2.getElementById(this.divId+"_row_"+_14b);
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
_4.DataView.prototype.toggleColumn=function(_14c){
if(this.columns[_14c].show){
this.columns[_14c].show=false;
}else{
this.columns[_14c].show=true;
}
var _14d=this.multiselect?2:0;
var _14e=this._cached.headerUl.getElementsByTagName("li");
if(_14c>=0&&((_14d+(_14c*2)+1)<_14e.length)){
_4.className[this.columns[_14c].show?"remove":"add"](_14e[_14d+(_14c*2)],"dataViewColumnHidden");
_4.className[this.columns[_14c].show?"remove":"add"](_14e[_14d+(_14c*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_14d=this.multiselect?1:0;
_4.className[this.columns[_14c].show?"remove":"add"](rows[n].childNodes[_14d+_14c],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_14c+2,this.columns[_14c].show);
this._adjustColumnsWidth();
};
_4.DataView.prototype._adjustColumnsWidth=function(){
if(this.columns.length&&this._cached){
var _14f=false;
var _150=this._getHeadersWidth();
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Width!=this.columns[n].origWidth){
_14f=true;
this.columns[n].Width=this.columns[n].origWidth;
}
}
var _151=0;
var base=this.multiselect?2:0;
var lis=this._cached.headerUl.getElementsByTagName("li");
if(lis.length==(this.columns.length*2)+base){
var _152=_4.element.getInnerBox(lis[base]);
var _153=_152.left+_152.right+lis[base+1].offsetWidth;
var _154=0;
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show){
_154++;
if(this.columns[n].percentWidth!==null){
_151+=_ea+_153;
}else{
_151+=this.columns[n].Width+_153;
}
}
}
if(_150>=((_ea+_153)*_154)){
while(_151>_150){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].show&&this.columns[n].percentWidth===null&&this.columns[n].Width>_ea){
_14f=true;
this.columns[n].Width--;
_151--;
}
if(_151==_150){
break;
}
}
}
}
if(_14f){
for(var n=0;n<this.columns.length;n++){
lis[base+(n*2)].style.width=this.columns[n].Width+"px";
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
var _155=this.multiselect?1:0;
for(var a=0;a<rows.length;a++){
var rLis=rows[a].getElementsByTagName("li");
for(var n=0;n<this.columns.length;n++){
rLis[_155+n].style.width=this.columns[n].Width+"px";
}
}
}
}
}
};
_4.DataView.prototype._getHeadersWidth=function(){
var _156=_2.getElementById(this.divId+"_optionsMenuBtn");
var _157=_4.element.getOuterBox(_156);
var _158=_4.element.getInnerBox(this._cached.headerUl);
var _159=0;
if(this.multiselect){
var lis=this._cached.headerUl.getElementsByTagName("li");
_159=lis[0].offsetWidth+lis[1].offsetWidth;
}
return this._cached.headerUl.offsetWidth-_158.left-_159-(_156.offsetWidth+_157.left+_157.right);
};
_4.DataView.prototype.__calculateTotalWidth=function(){
var _15a=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_15a+=cols[n].offsetWidth;
}
return _15a;
};
_4.DataView.prototype.__sort=function(_15b){
var n,_15c,swap;
if(!this.orderBy){
return;
}
for(n=_15b+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_15b][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_15b][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_15b][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_15b][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_15c=this.rows[_15b];
this.rows[_15b]=this.rows[n];
this.rows[n]=_15c;
if(this.selectedRow==_15b){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_15b;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_15b){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_15b;
}
}
}
}
}
if(_15b<this.rows.length-2){
this.__sort(_15b+1);
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
_4.DataView.prototype.__getColumnSqlName=function(_15d){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_15d){
return this.columns[n].sqlName;
}
}
return false;
};
_4.DataView.prototype.activateResizing=function(e,_15e){
if(!e){
e=_1.event;
}
this.resColumnId=_15e;
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
this.resizingFrom=this.columns[_15e].Width;
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
var _15f=Math.abs(this.resizingXCache-x);
var _160=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _161=this.resColumnId;
var _162=_161;
for(n=_161+1;n<this.columns.length;n++){
if(this.columns[n].show){
_162=n;
break;
}
}
var _163=false;
var _164=false;
if(!_160){
if((this.columns[_161].Width-_15f)>0){
this.columns[_161].Width-=_15f;
_163=true;
}
}else{
var _165=this.__calculateTotalWidth();
if((_165+_15f)<this._cached.headerUl.offsetWidth){
this.columns[_161].Width+=_15f;
_163=true;
}else{
if(_162!=_161){
if((this.columns[_162].Width-_15f)>0){
this.columns[_161].Width+=_15f;
this.columns[_162].Width-=_15f;
_163=true;
_164=true;
}
}
}
}
var _166=this._cached.headerUl;
if(_166){
var cols=_166.getElementsByTagName("li");
var _167=(this.multiselect?2:0);
var ndx=_167+(_161*2);
cols[ndx].style.width=this.columns[_161].Width+"px";
if(_164){
ndx+=2;
cols[ndx].style.width=this.columns[_162].Width+"px";
}
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var cols=rows[n].getElementsByTagName("li");
var _167=(this.multiselect?1:0);
var _168=this.columns[_161].Width;
cols[_167+(_161)].style.width=_168+"px";
if(_164){
cols[_167+(_161)+1].style.width=this.columns[_162].Width+"px";
}
}
};
_4.DataView.prototype.addDataType=function(name,_169){
if(typeof (name)!="string"){
_4.error.report("Invalid data type name.");
return;
}
if(typeof (_169)!="object"){
_4.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_169.toString)!="function"){
_4.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_ee[name]){
_ee[name]=_169;
}else{
_4.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.DataViewConnector=function(opts){
var _16a={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_16a,opts);
if(!_16a.dataView){
_4.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_16a.api)!="string"||_16a.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_16a.api;
this.dataView=_16a.dataView;
this.parameters=_16a.parameters;
this.type="json";
if(_16a.type){
switch(_16a.type.toLowerCase()){
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
if(typeof (_16a.method)=="string"){
this.method=_16a.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.dataView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _16b="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_16b+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_16b+="&"+this.parameters;
}
this.httpRequest.send(_16b);
_4.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
if(root.getAttribute("success")=="1"){
var _16c=Number(root.getAttribute("totalrows"));
if(!isNaN(_16c)){
this.dataView.totalRows=_16c;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _16d={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _16e=cols[a].getAttribute("name");
if(_16e&&cols[a].firstChild){
var _16f=this.dataView.__findColumn(_16e)!=-1?this.dataView.columns[this.dataView.__findColumn(_16e)].Type:"alpha";
_16d[_16e]=_ee[_16f](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_16d),_3,false);
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
this.dataView.updateRows();
}else{
this.dataView.rows.length=0;
if(data.success){
var _16c=Number(data.totalrows);
if(!isNaN(_16c)){
this.dataView.totalRows=_16c;
}
for(var n=0;n<data.rows.length;n++){
var _16d={};
for(var _16e in data.rows[n]){
var _16f=this.dataView.__findColumn(_16e)!=-1?this.dataView.columns[this.dataView.__findColumn(_16e)].Type:"alpha";
_16d[_16e]=_ee[_16f](data.rows[n][_16e]);
}
this.dataView.addRow(this.dataView.createRow(_16d),_3,false);
}
}else{
this.dataView.setMessage(data.errormessage);
}
this.dataView.updateRows();
}
},_onError:function(_170){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_170+")");
}};
_4.DataView.prototype.lang={"noRows":"No rows to show.","rows":"rows.","row":"row.","pageStart":"Page ","pageMiddle":" of ","pageEnd":" Go to page: ","pageGo":"Go","pagePrev":"<< Previous","pageNext":"Next >>","refresh":"Refresh","of":"of"};
var _171=function(opts){
var _172={id:null,parentId:0,parent:null,Name:""};
_4.mixin(_172,opts);
this.treeView=_172.treeView;
this.id=_172.id!==null?_172.id:this.treeView.getNextNodeId();
this.parentId=_172.parentId;
this.Name=String(_172.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_172.parent;
};
_171.prototype={searchNode:function(id){
var n;
var srch=null;
var _173=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_173<this.childNodes.length){
srch=this.childNodes[_173].searchNode(id);
_173++;
}
return srch;
},updateChildrenNodes:function(){
var _174=_2.getElementById(this.treeView.divId+"_"+this.id+"_branch");
var _175=_4.getInactiveLocation();
for(var i=0;i<this.childNodes.length;i++){
var node=_2.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_174.appendChild(node);
var _176="";
var _177=this.childNodes[i].childNodes.length;
if(_177){
_176+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\""+_175+"\" class=\"";
_176+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_176+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_177){
_176+="class=\"treeViewSingleNode\" ";
}
_176+="href=\""+_175+"\">"+this.childNodes[i].Name+"</a>";
if(_177){
_176+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_176;
if(_177){
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_4.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_4.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_177){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_4.TreeView=function(opts){
var _178={canHaveChildren:false,hasInvalidator:true};
_4.mixin(_178,opts);
var cmp=_76.get(_178);
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
this.masterNode=new _171({id:0,parentId:0,parent:null,Name:"root",treeView:this});
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
var _179=true;
while(_179){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_179=false;
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
var _17a;
if(!_2.getElementById(this.divId+"_message")){
_17a=_2.createElement("div");
_17a.id=this.divId+"_message";
_17a.className="treeViewMessageDiv";
this.target.appendChild(_17a);
}else{
_17a=_2.getElementById(this.divId+"_message");
}
_17a.innerHTML=msg;
}
};
_4.TreeView.prototype._expandNode=function(e,_17b){
if(!e){
e=_1.event;
}
var node=this.searchNode(_17b);
if(node.expanded){
node.expanded=false;
_2.getElementById(this.divId+"_"+_17b+"_expandable").className="treeViewExpandableNode";
_2.getElementById(this.divId+"_"+_17b+"_branch").style.display="none";
}else{
node.expanded=true;
_2.getElementById(this.divId+"_"+_17b+"_expandable").className="treeViewCollapsableNode";
_2.getElementById(this.divId+"_"+_17b+"_branch").style.display="block";
}
_4.event.cancel(e);
return false;
};
_4.TreeView.prototype._selectNode=function(e,_17c){
if(!e){
e=_1.event;
}
if(this.selectedNode!==null){
var _17d=this.searchNode(this.selectedNode);
_4.className.remove(_2.getElementById(this.divId+"_"+_17d.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_17c){
var _17d=this.searchNode(_17c);
_4.className.add(_2.getElementById(this.divId+"_"+_17d.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_17c)?null:_17c;
_4.event.cancel(e,true);
return false;
};
_4.TreeView.prototype.addNode=function(opts,_17e,ndx){
var _17f=(_17e==0)?this.masterNode:this.searchNode(_17e);
if(_17f){
var _180={treeView:this,parentId:_17e,parent:_17f,Name:""};
_4.mixin(_180,opts);
if(ndx>=0&&ndx<_17f.childNodes.length){
_17f.childNodes.splice(ndx,0,new _171(_180));
}else{
_17f.childNodes.push(new _171(_180));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.deleteNode=function(_181){
if(_181==0||_181=="0"){
return;
}
this._searchAndDelete(_181,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype._searchAndDelete=function(_182,node){
var _183=false;
if(typeof (_182)=="number"||typeof (_182)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_182){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_183=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_182){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_183=true;
break;
}
}
}
if(!_183){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_182);
if(done){
_183=done;
break;
}
}
}
return _183;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.TreeViewConnector=function(opts){
var _184={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_184,opts);
if(!_184.treeView){
_4.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_184.api)!="string"||_184.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_184.api;
this.treeView=_184.treeView;
this.parameters=_184.parameters;
this.type="json";
if(_184.type){
switch(_184.type.toLowerCase()){
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
if(typeof (_184.method)=="string"){
this.method=_184.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _171({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _185=this._fetchNodes(root);
if(_185.length){
this._addNodesFromXml(_185,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _171({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_186,_187){
for(var n=0;n<_186.length;n++){
var id=null;
if(_186[n].getAttribute("id")){
id=_186[n].getAttribute("id");
}
var _188=_186[n].getElementsByTagName("label")[0];
if(_188){
labelStr=_188.firstChild.data;
}
var _189=_186[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_187);
if(_189){
this._addNodesFromXml(this._fetchNodes(_186[n]),id);
}
}
},_addNodesFromJson:function(_18a,_18b){
for(var n=0;n<_18a.length;n++){
this.treeView.addNode({Name:_18a[n].label,id:_18a[n].id},_18b);
if(_18a[n].nodes){
this._addNodesFromJson(_18a[n].nodes,_18a[n].id);
}
}
},_onError:function(_18c){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_18c+")");
}};
_4.CalendarView=function(opts){
var _18d=new Date();
var _18e={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_18d.getMonth(),year:_18d.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_4.mixin(_18e,opts);
var cmp=_76.get(_18e);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_18e.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_18e.month))&&_18e.month>=0&&_18e.month<12)?_18e.month:_18d.getMonth();
this.curYear=(!isNaN(Number(_18e.year))&&_18e.year>0)?_18e.year:new _18d.getFullYear();
this.disabledBefore=_18e.disabledBefore;
this.disabledAfter=_18e.disabledAfter;
this.disabledDays=_18e.disabledDays;
this.disabledDates=_18e.disabledDates;
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
var _18f="<div class=\"calendarViewWrapper\"><div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_18f+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_18f+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _190=new Date();
if(this.selectedDates.length){
_190=this.selectedDates[0];
}
_18f+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_18f+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_190.getDate()+"\" /></p>";
_18f+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_18f+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_18f+="<option value=\""+n+"\""+(_190.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_18f+="</select></p>";
_18f+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_18f+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_190.getFullYear()+"\" /></p>";
_18f+="<p><input type=\"button\" class=\"calendarBtn calendarAccept\" id=\""+this.divId+"_advancedAccept\" value=\""+this.lang.accept+"\"> ";
_18f+="<input type=\"button\" class=\"calendarBtn calendarCancel\" id=\""+this.divId+"_advancedCancel\" value=\""+this.lang.cancel+"\"></p>";
_18f+="</div>";
_18f+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div></div>";
this.cmpTarget.innerHTML=_18f;
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
var _191=_2.getElementById(this.divId+"_body");
_191.style.display="";
_2.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
_191.innerHTML="";
var _192=_2.createElement("thead");
var _193,_194,_195,tmpA;
var _193=_2.createElement("tr");
for(var n=0;n<7;n++){
_194=_2.createElement("th");
_194.appendChild(_2.createTextNode(this.lang.shortDays[n]));
_193.appendChild(_194);
}
_192.appendChild(_193);
_191.appendChild(_192);
var _196=new Date();
var _197=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _198=new Date(_197.getTime());
_198.setMonth(_198.getMonth()+1);
var _199=_197.getDay();
var _19a=0;
var _19b=_2.createElement("tbody");
var _193=_2.createElement("tr");
while(_19a<_199){
_195=_2.createElement("td");
_195.appendChild(_2.createTextNode(" "));
_193.appendChild(_195);
_19a++;
}
while(_197<_198){
_195=_2.createElement("td");
_195.setAttribute("align","left");
_195.setAttribute("valign","top");
tmpA=_2.createElement("a");
tmpA.setAttribute("href",_4.getInactiveLocation());
tmpA.appendChild(_2.createTextNode(_197.getDate()));
var _19c=false;
if(this.isEqual(_197,_196)){
_19c=true;
}
var _19d=false;
if(this.isDisabledDate(_197)){
_19d=true;
if(_19c){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_197,this.markedDates[n])){
_19d=true;
if(_19c){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_197,this.selectedDates[n])){
_19d=true;
if(_19c){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_19d&&_19c){
tmpA.className="calendarToday";
}
_195.appendChild(tmpA);
_193.appendChild(_195);
_4.event.attach(tmpA,"onclick",_4.bind(this.selectDate,this,_197.getDate()));
_197.setDate(_197.getDate()+1);
_19a++;
if(_19a>6){
_19b.appendChild(_193);
_193=_2.createElement("tr");
_19a=0;
}
}
if(_19a>0){
_19b.appendChild(_193);
while(_19a<7){
_195=_2.createElement("td");
_195.appendChild(_2.createTextNode(" "));
_193.appendChild(_195);
_19a++;
}
}
_191.appendChild(_19b);
this.__refreshHeader();
this.__refreshFooter();
};
_4.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _19e=_2.getElementById(this.divId+"_header");
_19e.innerHTML="";
var _19f=_4.getInactiveLocation();
var _1a0="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\""+_19f+"\"> </a></li>";
_1a0+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\""+_19f+"\"> </a></li>";
_1a0+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\""+_19f+"\"> </a></li>";
_1a0+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1a0+="</ul>";
_19e.innerHTML=_1a0;
_4.event.attach(_2.getElementById(this.divId+"_prevMonth"),"onclick",_4.bind(this.goPrevMonth,this));
_4.event.attach(_2.getElementById(this.divId+"_viewAdvanced"),"onclick",_4.bind(this.setAdvanced,this));
_4.event.attach(_2.getElementById(this.divId+"_nextMonth"),"onclick",_4.bind(this.goNextMonth,this));
};
_4.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a1=_2.getElementById(this.divId+"_footer");
_1a1.innerHTML="";
var _1a2="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\""+_4.getInactiveLocation()+"\" id=\""+this.divId+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var text=this.lang.oneSelection;
text+=this.lang.shortDays[this.selectedDates[0].getDay()];
text+=" "+this.selectedDates[0].getDate()+" ";
text+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_1a2+=text;
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
_1a2+=text;
}
}else{
_1a2+=this.lang.noSelection+"</p>";
}
_1a1.innerHTML=_1a2;
_4.event.attach(_2.getElementById(this.divId+"_goHome"),"onclick",_4.bind(this.goHomeDate,this));
};
_4.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=_1.event;
}
_2.getElementById(this.divId+"_body").style.display="none";
_2.getElementById(this.divId+"_advanced").style.display="block";
var _1a3=new Date();
if(this.selectedDates.length){
_1a3=this.selectedDates[0];
}
_2.getElementById(this.divId+"DaySelector").value=_1a3.getDate();
_2.getElementById(this.divId+"MonthSelector").selectedIndex=_1a3.getMonth();
_2.getElementById(this.divId+"YearSelector").value=_1a3.getFullYear();
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
var _1a4=_2.getElementById(this.divId+"DaySelector").value;
var _1a5=_2.getElementById(this.divId+"MonthSelector").value;
var _1a6=_2.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1a4))){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1a6))){
alert(this.lang.error2);
_4.event.cancel(e,true);
return false;
}
var _1a7=new Date(_1a6,_1a5,_1a4);
if(_1a7.getMonth()!=_1a5){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1a7)){
alert(this.lang.error3);
_4.event.cancel(e,true);
return false;
}
var _1a8={selecting:_1a7,selectedDates:this.selectedDates};
_1a8=_4.event.fire(this,"onselect",_1a8);
if(_1a8.returnValue==false){
_4.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1a7;
this.goHomeDate(e);
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=_1.event;
}
var _1a9=new Date(this.curYear,this.curMonth,date);
var _1aa={selecting:_1a9,selectedDates:this.selectedDates};
_1aa=_4.event.fire(this,"onselect",_1aa);
if(_1aa.returnValue==false){
_4.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1a9)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1a9;
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
_4.CalendarView.prototype.isEqual=function(_1ab,_1ac){
if(_1ab.getFullYear()==_1ac.getFullYear()&&_1ab.getMonth()==_1ac.getMonth()&&_1ab.getDate()==_1ac.getDate()){
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
var _1ad;
if(this.selectedDates.length){
_1ad=this.selectedDates[0];
}else{
_1ad=new Date();
}
this.curMonth=_1ad.getMonth();
this.curYear=_1ad.getFullYear();
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.hook=function(_1ae){
var elem=null;
if(typeof (_1ae)=="string"){
elem=_2.getElementById(_1ae);
}else{
if(_4.isHTMLElement(_1ae)){
elem=_1ae;
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
var _1af=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1af.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1af.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
};
_4.CalendarView.prototype.getDateFromStr=function(str){
var _1b0=str.split("/");
var ret;
if(!isNaN(Number(_1b0[0]))&&!isNaN(Number(_1b0[1]))&&!isNaN(Number(_1b0[2]))){
if(this.lang.isFrenchDateFormat){
if(_1b0[1]>0&&_1b0[1]<13&&_1b0[0]>0&&_1b0[0]<32&&_1b0[2]>0){
ret=new Date(_1b0[2],_1b0[1]-1,_1b0[0],0,0,0);
}else{
ret=new Date();
}
}else{
if(_1b0[0]>0&&_1b0[0]<13&&_1b0[1]>0&&_1b0[1]<32&&_1b0[2]>0){
ret=new Date(_1b0[2],_1b0[1]-1,_1b0[0],0,0,0);
}else{
ret=new Date();
}
}
}else{
ret=new Date();
}
return ret;
};
_4.CalendarView.prototype.lang={shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","Agoust","September","October","November","December"],noSelection:"No date selected",oneSelection:"Date: ",multipleSelection:"Dates: ",prevMonth:"Previous Month",nextMonth:"Next Month",advanced:"Select month and year",homeDate:"Go to selection date or today",day:"Day:",month:"Month:",year:"Year:",accept:"Accept",cancel:"Cancel",error1:"The date field entered is invalid.",error2:"The year field entered is invalid.",error3:"The selected date is not available.",isFrenchDateFormat:false};
var _1b1=function(_1b2,path,name){
this.thumbnail=_1b2;
this.path=path;
this.name=name;
};
_4.GalleryView=function(opts){
var _1b3={canHaveChildren:true,hasInvalidator:true,thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_4.mixin(_1b3,opts);
var cmp=_76.get(_1b3);
_4.mixin(this,cmp);
this.CMP_SIGNATURE="Scriptor.ui.GalleryView";
this.selectedImage=-1;
this.showNames=_1b3.showNames;
this.fixedThumbSize=_1b3.fixedThumbSize;
this.thumbWidth=_1b3.thumbWidth;
this.thumbHeight=_1b3.thumbHeight;
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
var _1b4={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_4.mixin(_1b4,opts);
if(!_1b4.thumbnail){
_4.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_1b4.insertIndex==this.images.length){
this.images.push(new _1b1(_1b4.thumbnail,_1b4.path,_1b4.name));
}else{
this.images.splice(_1b4.insertIndex,0,new _1b1(_1b4.thumbnail,_1b4.path,_1b4.name));
}
if(this.inDOM){
this.updateImages();
}
};
_4.GalleryView.prototype.deleteImage=function(_1b5){
if(typeof (_1b5)=="number"){
this.images.splice(_1b5,1);
}else{
if(typeof (_1b5)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_1b5){
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
var _1b6;
if(!_2.getElementById(this.divId+"_message")){
_1b6=_2.createElement("p");
_1b6.id=this.divId+"_message";
this.target.appendChild(_1b6);
}else{
_1b6=_2.getElementById(this.divId+"_message");
}
_1b6.innerHTML=msg;
}
};
_4.GalleryView.prototype.updateImages=function(){
if(!this.inDOM){
_4.error.report("Can't update images on non visible galleryView object.");
return;
}
this.cmpTarget.innerHTML="";
var _1b7="";
for(var n=0;n<this.images.length;n++){
_1b7+="<div id=\""+this.divId+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_1b7+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_1b7+="class=\"gvSelectedImage\" ";
}
_1b7+=">";
_1b7+="<img id=\""+this.divId+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_1b7+="<p>"+this.images[n].name+"</p>";
}
_1b7+="</div>";
}
this.cmpTarget.innerHTML=_1b7;
for(var n=0;n<this.images.length;n++){
_4.event.attach(_2.getElementById(this.divId+"_img_"+n),"onclick",_4.bindAsEventListener(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
};
_4.GalleryView.prototype._selectImage=function(e,_1b8){
if(!e){
e=_1.event;
}
e.selectedImage=this.selectedImage;
e.selecting=_1b8;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var imgs=this.cmpTarget.getElementsByTagName("img");
if(_1b8!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<imgs.length;a++){
if(imgs[a].parentNode.className=="gvSelectedImage"){
imgs[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_1b8){
this.selectedImage=-1;
}else{
this.selectedImage=_1b8;
imgs[_1b8].parentNode.className="gvSelectedImage";
}
}
_4.event.cancel(e);
return false;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.GalleryViewConnector=function(opts){
var _1b9={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_1b9,opts);
if(!_1b9.galleryView){
_4.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_1b9.api)!="string"||_1b9.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_1b9.api;
this.galleryView=_1b9.galleryView;
this.parameters=_1b9.parameters;
this.type="json";
if(_1b9.type){
switch(_1b9.type.toLowerCase()){
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
if(typeof (_1b9.method)=="string"){
this.method=_1b9.method.toUpperCase()=="POST"?"POST":"GET";
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
var _1ba=root.getElementsByTagName("image");
for(var n=0;n<_1ba.length;n++){
var _1bb=_1ba.item(n).getElementsByTagName("thumbnail");
var path=_1ba.item(n).getElementsByTagName("path");
var name=_1ba.item(n).getElementsByTagName("name");
var _1bc="";
var _1bd="";
var _1be="";
if(_1bb.length){
if(_1bb.item(0).firstChild){
_1bc=_1bb.item(0).firstChild.data;
}
}
if(path.length){
if(path.item(0).firstChild){
_1bd=path.item(0).firstChild.data;
}
}
if(name.length){
if(name.item(0).firstChild){
_1be=name.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _1b1(_1bc,_1bd,_1be));
var _1bf=_1ba.item(n).getElementsByTagName("param");
if(_1bf.length){
for(var a=0;a<_1bf.length;a++){
var _1c0=_1bf.item(a).getAttribute("name");
var _1c1="";
if(_1bf.item(a).firstChild){
_1c1=_1bf.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_1c0]=_1c1;
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
var _1bc=data.images[n].thumbnail;
var _1bd=data.images[n].path;
var _1be=data.images[n].name;
this.galleryView.images.push(new _1b1(_1bc,_1bd,_1be));
for(var _1c2 in data.images[n]){
if(_1c2!="thumbnail"&&_1c2!="path"&&_1c2!="name"){
this.galleryView.images[this.galleryView.images.length-1][_1c2]=data.images[n][_1c2];
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
},_onError:function(_1c3){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_1c3+")");
}};
_4.Toolbar=function(opts){
var _1c4={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_1c4,opts);
var cmp=_76.get(_1c4);
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
var _1c5=this.cmpTarget.offsetWidth;
var _1c6=_1c5;
var _1c7=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-left"));
var _1c8=parseInt(_4.className.getComputedProperty(this._moreSpan,"margin-right"));
_1c5-=(this._moreSpan.offsetWidth+_1c7+_1c8);
var _1c9=0;
var _1ca=false;
for(var n=0;n<this.cmpTarget.childNodes.length;n++){
var _1cb=this.cmpTarget.childNodes[n];
var _1cc=parseInt(_4.className.getComputedProperty(_1cb,"margin-left"));
var _1cd=parseInt(_4.className.getComputedProperty(_1cb,"margin-right"));
if(isNaN(_1cc)){
_1cc=0;
}
if(isNaN(_1cd)){
_1cd=0;
}
_1c9+=_1cb.offsetWidth+_1cc+_1cd;
if(n==this.cmpTarget.childNodes.length-1){
_1c5=_1c6;
}
if(_1c9>=_1c5){
if(!this._showingMore){
this.showMore();
}
if(!_1ca){
this._extraBtns=n;
_1ca=true;
}
_4.className.remove(_1cb,"jsToolbarLast");
_1cb.style.visibility="hidden";
if(n>0){
_4.className.add(this.buttons[n-1].target,"jsToolbarLast");
}
}else{
if(n<this.buttons.length-1){
_4.className.remove(_1cb,"jsToolbarLast");
}else{
_4.className.add(_1cb,"jsToolbarLast");
}
_1cb.style.visibility="visible";
}
}
if(_1c9<_1c5){
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
var _1ce={label:"",id:this.getNextBtnId(),className:"",onclick:null,onContentAdded:null,target:null};
_4.mixin(_1ce,opts);
_1ce.target=_2.createElement("span");
_1ce.target.id=this.divId+"_btn_"+_1ce.id;
var _1cf="";
if(typeof (_1ce.onContentAdded)!="function"){
_1cf="<a"+(_1ce.className?" class=\""+_1ce.className+"\" ":"")+" href=\""+_4.getInactiveLocation()+"\">"+_1ce.label+"</a>";
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
_1ce.target.className="jsToolbarFirst";
}
if(ndx==this.buttons.length){
if(this.buttons.length){
_4.className.remove(this.buttons[this.buttons.length-1].target,"jsToolbarLast");
}
_4.className.add(_1ce.target,"jsToolbarLast");
}
if(ndx==this.buttons.length){
this.buttons.push(_1ce);
this.cmpTarget.appendChild(_1ce.target);
}else{
if(ndx==0){
this.buttons.splice(ndx,0,_1ce);
}
this.cmpTarget.insertBefore(_1ce.target,this.cmpTarget.childNodes[ndx]);
}
_1ce.target.innerHTML=_1cf;
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
var _1d0=true;
while(_1d0){
_1d0=false;
var _1d1=this.nextBtnId++;
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1d1){
_1d0=true;
break;
}
}
}
return _1d1;
};
_4.Toolbar.prototype.removeButton=function(_1d2){
var ndx=null;
if(typeof (_1d2)=="number"){
ndx=ref;
}else{
if(typeof (_1d2)=="string"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n].id==_1d2){
ndx=n;
break;
}
}
}else{
if(typeof (_1d2)=="object"){
for(var n=0;n<this.buttons.length;n++){
if(this.buttons[n]===_1d2){
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
x=(e.clientX+_2.documentElement.scrollLeft)-this.Width;
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1d3=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1d4,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1d5(_1d6){
_1d3.lastIndex=0;
return _1d3.test(_1d6)?"\""+_1d6.replace(_1d3,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1d6+"\"";
};
function str(key,_1d7){
var i,k,v,_1d8,mind=gap,_1d9,_1da=_1d7[key];
if(_1da&&typeof _1da==="object"&&typeof _1da.toJSON==="function"){
_1da=_1da.toJSON(key);
}
if(typeof rep==="function"){
_1da=rep.call(_1d7,key,_1da);
}
switch(typeof _1da){
case "string":
return _1d5(_1da);
case "number":
return isFinite(_1da)?String(_1da):"null";
case "boolean":
case "null":
return String(_1da);
case "object":
if(!_1da){
return "null";
}
gap+=_1d4;
_1d9=[];
if(Object.prototype.toString.apply(_1da)==="[object Array]"){
_1d8=_1da.length;
for(i=0;i<_1d8;i+=1){
_1d9[i]=str(i,_1da)||"null";
}
v=_1d9.length===0?"[]":gap?"[\n"+gap+_1d9.join(",\n"+gap)+"\n"+mind+"]":"["+_1d9.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1d8=rep.length;
for(i=0;i<_1d8;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1da);
if(v){
_1d9.push(_1d5(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1da){
if(Object.hasOwnProperty.call(_1da,k)){
v=str(k,_1da);
if(v){
_1d9.push(_1d5(k)+(gap?": ":":")+v);
}
}
}
}
v=_1d9.length===0?"{}":gap?"{\n"+gap+_1d9.join(",\n"+gap)+"\n"+mind+"}":"{"+_1d9.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1db,_1dc,_1dd){
var i;
gap="";
_1d4="";
if(typeof _1dd==="number"){
for(i=0;i<_1dd;i+=1){
_1d4+=" ";
}
}else{
if(typeof _1dd==="string"){
_1d4=_1dd;
}
}
rep=_1dc;
if(_1dc&&typeof _1dc!=="function"&&(typeof _1dc!=="object"||typeof _1dc.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1db});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1de){
var j;
function walk(_1df,key){
var k,v,_1e0=_1df[key];
if(_1e0&&typeof _1e0==="object"){
for(k in _1e0){
if(Object.hasOwnProperty.call(_1e0,k)){
v=walk(_1e0,k);
if(v!==undefined){
_1e0[k]=v;
}else{
delete _1e0[k];
}
}
}
}
return _1de.call(_1df,key,_1e0);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1de==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

