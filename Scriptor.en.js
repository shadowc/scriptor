window.Scriptor=(function(_1,_2,_3){
var _4={version:{major:2,minor:0,instance:"alpha 5",toString:function(){
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
calendarView=_4.calendarView=function(div,_72){
if((typeof (div)!="string"&&!_4.isHtmlElement(div))||div==""){
_4.error.report("Error: first parameter must be a non empty string or a html object.");
return;
}
var _73={"multiselect":false,"month":new Date().getMonth(),"year":new Date().getFullYear()};
_4.mixin(_73,_72);
this.selectedDates=[];
this.multiSelect=_73.multiselect;
this.enabled=true;
this.advanced=false;
this.curMonth=(!isNaN(Number(_73.month))&&_73.month>=0&&_73.month<12)?_73.month:new Date().getMonth();
this.curYear=(!isNaN(Number(_73.year))&&_73.year>0)?_73.year:new Date().getFullYear();
_4.event.init(this);
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onselect");
this.disabledBefore=null;
this.disabledAfter=null;
this.disabledDays=[false,false,false,false,false,false,false];
this.disabledDates=[];
this.markedDates=[];
this.divElem=typeof (div)=="string"?_2.getElementById(div):div;
this.div=typeof (div)=="string"?div:this.divElem.id;
this.hookedTo=null;
};
calendarView.prototype={Show:function(){
var e=_4.event.fire(this,"onshow");
if(!e.returnValue){
return;
}
if(!this.divElem){
this.divElem=_2.getElementById(this.div);
}else{
if(!this.divElem.id){
if(!this.div){
this.div=_71();
}
this.divElem.id=this.div;
}
}
if(!this.divElem){
_4.error.report("Error: calendarView DIV does not exist.");
return;
}
var _74=this.divElem;
_74.className="calendarView scriptor";
_74.innerHTML="";
var _75="<div class=\"calendarViewHeader\" id=\""+this.div+"_header\"></div>";
_75+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.div+"_body\"></table>";
_75+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.div+"_advanced\">";
var _76=new Date();
if(this.selectedDates.length){
_76=this.selectedDates[0];
}
_75+="<p><label for=\""+this.div+"DaySelector\">"+this.lang.day+"</label>";
_75+="<input type=\"text\" id=\""+this.div+"DaySelector\" value=\""+_76.getDate()+"\" /></p>";
_75+="<p><label for=\""+this.div+"MonthSelector\">"+this.lang.month+"</label>";
_75+="<select id=\""+this.div+"MonthSelector\">";
for(var n=0;n<12;n++){
_75+="<option value=\""+n+"\""+(_76.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_75+="</select></p>";
_75+="<p><label for=\""+this.div+"YearSelector\">"+this.lang.year+"</label>";
_75+="<input type=\"text\" id=\""+this.div+"YearSelector\" value=\""+_76.getFullYear()+"\" /></p>";
_75+="<p><a class=\"calendarAccept\" id=\""+this.div+"_advancedAccept\">"+this.lang.accept+"</a>";
_75+="<a class=\"calendarCancel\" id=\""+this.div+"_advancedCancel\">"+this.lang.cancel+"</a></p>";
_75+="</div>";
_75+="<div class=\"calendarViewFooter\" id=\""+this.div+"_footer\"></div>";
_74.innerHTML=_75;
_4.event.attach(_2.getElementById(this.div+"_advancedAccept"),"onclick",_4.bind(this.selectAdvanced,this));
_4.event.attach(_2.getElementById(this.div+"_advancedCancel"),"onclick",_4.bind(this.cancelAdvanced,this));
this.visible=true;
this.updateDates();
},Hide:function(){
var e=_4.event.fire(this,"onhide");
if(!e.returnValue){
return;
}
if(this.divElem){
this.divElem.style.display="none";
}
this.visible=false;
},updateDates:function(){
if(!this.visible){
_4.error.report("Can't update data on non visible calendarView object.");
return;
}
var _77=_2.getElementById(this.div+"_body");
_77.style.display="";
_2.getElementById(this.div+"_advanced").style.display="none";
this.advanced=false;
_77.innerHTML="";
var _78=_2.createElement("thead");
var _79,_7a,_7b,_7c;
var _79=_2.createElement("tr");
for(var n=0;n<7;n++){
_7a=_2.createElement("th");
_7a.appendChild(_2.createTextNode(this.lang.shortDays[n]));
_79.appendChild(_7a);
}
_78.appendChild(_79);
_77.appendChild(_78);
var _7d=new Date();
var _7e=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _7f=new Date(_7e.getTime());
_7f.setMonth(_7f.getMonth()+1);
var _80=_7e.getDay();
var _81=0;
var _82=_2.createElement("tbody");
var _79=_2.createElement("tr");
while(_81<_80){
_7b=_2.createElement("td");
_7b.appendChild(_2.createTextNode(" "));
_79.appendChild(_7b);
_81++;
}
while(_7e<_7f){
_7b=_2.createElement("td");
_7b.setAttribute("align","left");
_7b.setAttribute("valign","top");
_7c=_2.createElement("a");
_7c.setAttribute("href","#");
_7c.appendChild(_2.createTextNode(_7e.getDate()));
var _83=false;
if(this.isEqual(_7e,_7d)){
_83=true;
}
var _84=false;
if(this.isDisabledDate(_7e)){
_84=true;
if(_83){
_7c.className="calendarDisabled calendarToday";
}else{
_7c.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_7e,this.markedDates[n])){
_84=true;
if(_83){
_7c.className="calendarMarked calendarToday";
}else{
_7c.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_7e,this.selectedDates[n])){
_84=true;
if(_83){
_7c.className="calendarSelected calendarToday";
}else{
_7c.className="calendarSelected";
}
}
}
if(!_84&&_83){
_7c.className="calendarToday";
}
_7b.appendChild(_7c);
_79.appendChild(_7b);
_4.event.attach(_7c,"onclick",_4.bind(this.selectDate,this,_7e.getDate()));
_7e.setDate(_7e.getDate()+1);
_81++;
if(_81>6){
_82.appendChild(_79);
_79=_2.createElement("tr");
_81=0;
}
}
if(_81>0){
_82.appendChild(_79);
while(_81<7){
_7b=_2.createElement("td");
_7b.appendChild(_2.createTextNode(" "));
_79.appendChild(_7b);
_81++;
}
}
_77.appendChild(_82);
this.__refreshHeader();
this.__refreshFooter();
},__refreshHeader:function(){
if(!this.visible){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _85=_2.getElementById(this.div+"_header");
_85.innerHTML="";
var _86="<ul><li><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.div+"_prevMonth\" href=\"#\"> </a></li>";
_86+="<li><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.div+"_viewAdvanced\" href=\"#\"> </a></li>";
_86+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_86+="<li><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.div+"_nextMonth\" href=\"#\"> </a></li>";
_85.innerHTML=_86;
_4.event.attach(_2.getElementById(this.div+"_prevMonth"),"onclick",_4.bind(this.goPrevMonth,this));
_4.event.attach(_2.getElementById(this.div+"_viewAdvanced"),"onclick",_4.bind(this.setAdvanced,this));
_4.event.attach(_2.getElementById(this.div+"_nextMonth"),"onclick",_4.bind(this.goNextMonth,this));
},__refreshFooter:function(){
if(!this.visible){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _87=_2.getElementById(this.div+"_footer");
_87.innerHTML="";
var _88="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\"#\" id=\""+this.div+"_goHome\"> </a>";
if(this.selectedDates.length){
if(this.selectedDates.length==1){
var _89=this.lang.oneSelection;
_89+=this.lang.shortDays[this.selectedDates[0].getDay()];
_89+=" "+this.selectedDates[0].getDate()+" ";
_89+=this.lang.shortMonths[this.selectedDates[0].getMonth()];
_88+=_89;
}else{
var _89=this.lang.multipleSelection;
for(var n=0;n<this.selectedDates.length;n++){
if(n>0){
_89+=", ";
}
_89+=this.lang.shortDays[this.selectedDates[n].getDay()];
_89+=" "+this.selectedDates[n].getDate()+" ";
_89+=this.lang.shortMonths[this.selectedDates[n].getMonth()];
}
_88+=_89;
}
}else{
_88+=this.lang.noSelection+"</p>";
}
_87.innerHTML=_88;
_4.event.attach(_2.getElementById(this.div+"_goHome"),"onclick",_4.bind(this.goHomeDate,this));
},setAdvanced:function(e){
if(!e){
e=_1.event;
}
_2.getElementById(this.div+"_body").style.display="none";
_2.getElementById(this.div+"_advanced").style.display="block";
var _8a=new Date();
if(this.selectedDates.length){
_8a=this.selectedDates[0];
}
_2.getElementById(this.div+"DaySelector").value=_8a.getDate();
_2.getElementById(this.div+"MonthSelector").selectedIndex=_8a.getMonth();
_2.getElementById(this.div+"YearSelector").value=_8a.getFullYear();
this.advanced=true;
_4.event.cancel(e);
return false;
},cancelAdvanced:function(_8b){
_2.getElementById(this.div+"_body").style.display="";
_2.getElementById(this.div+"_advanced").style.display="none";
this.advanced=false;
},selectAdvanced:function(e){
if(!e){
e=_1.event;
}
var _8c=_2.getElementById(this.div+"DaySelector").value;
var _8d=_2.getElementById(this.div+"MonthSelector").value;
var _8e=_2.getElementById(this.div+"YearSelector").value;
if(isNaN(Number(_8c))){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(isNaN(Number(_8e))){
alert(this.lang.error2);
_4.event.cancel(e,true);
return false;
}
var _8f=new Date(_8e,_8d,_8c);
if(_8f.getMonth()!=_8d){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_8f)){
alert(this.lang.error3);
_4.event.cancel(e,true);
return false;
}
var _90={selecting:_8f,selectedDates:this.selectedDates};
_90=_4.event.fire(this,"onselect",_90);
if(_90.returnValue==false){
_4.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_8f;
this.goHomeDate(e);
_4.event.cancel(e,true);
return false;
},selectDate:function(e,_91){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e,true);
return false;
}
var _92=new Date(this.curYear,this.curMonth,_91);
var _93={selecting:_92,selectedDates:this.selectedDates};
_93=_4.event.fire(this,"onselect",_93);
if(_93.returnValue==false){
_4.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_92)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_92;
}else{
_4.error.report("Error: multiselect function not implemented.");
_4.event.cancel(e,true);
return false;
}
this.updateDates();
}
_4.event.cancel(e,true);
return false;
},isDisabledDate:function(_94){
if(this.disabledBefore){
if(_94.getFullYear()<this.disabledBefore.getFullYear()){
return true;
}else{
if(_94.getFullYear()<=this.disabledBefore.getFullYear()&&_94.getMonth()<this.disabledBefore.getMonth()){
return true;
}else{
if(_94.getFullYear()<=this.disabledBefore.getFullYear()&&_94.getMonth()<=this.disabledBefore.getMonth()&&_94.getDate()<this.disabledBefore.getDate()){
return true;
}
}
}
}
if(this.disabledAfter){
if(_94.getFullYear()>this.disabledAfter.getFullYear()){
return true;
}else{
if(_94.getFullYear()>=this.disabledAfter.getFullYear()&&_94.getMonth()>this.disabledAfter.getMonth()){
return true;
}else{
if(_94.getFullYear()>=this.disabledAfter.getFullYear()&&_94.getMonth()>=this.disabledAfter.getMonth()&&_94.getDate()>this.disabledAfter.getDate()){
return true;
}
}
}
}
if(this.disabledDays[_94.getDay()]){
return true;
}
for(var n=0;n<this.disabledDates.length;n++){
if(this.isEqual(_94,this.disabledDates[n])){
return true;
}
}
return false;
},isEqual:function(_95,_96){
if(_95.getFullYear()==_96.getFullYear()&&_95.getMonth()==_96.getMonth()&&_95.getDate()==_96.getDate()){
return true;
}else{
return false;
}
},goPrevMonth:function(e){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e,true);
return false;
}
this.curMonth--;
if(this.curMonth<0){
this.curMonth=11;
this.curYear--;
}
this.updateDates();
_4.event.cancel(e,true);
return false;
},goNextMonth:function(e){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e,true);
return false;
}
this.curMonth++;
if(this.curMonth>11){
this.curMonth=0;
this.curYear++;
}
this.updateDates();
_4.event.cancel(e,true);
return false;
},goHomeDate:function(e){
if(!e){
e=_1.event;
}
if(!this.enabled){
_4.event.cancel(e,true);
return false;
}
var _97;
if(this.selectedDates.length){
_97=this.selectedDates[0];
}else{
_97=new Date();
}
this.curMonth=_97.getMonth();
this.curYear=_97.getFullYear();
this.updateDates();
_4.event.cancel(e,true);
return false;
},hook:function(_98){
var _99=null;
if(typeof (_98)=="string"){
_99=_2.getElementById(_98);
}else{
if(_4.isHTMLElement(_98)){
_99=_98;
}
}
if(_99){
this.hookedTo=_99;
calElem=_2.getElementById(this.div);
_4.event.attach(_99,"onfocus",_4.bind(this.showHooked,this));
calElem.style.display="none";
calElem.style.position="absolute";
_4.event.attach(this,"onselect",_4.bind(this.assignToHooked,this));
this.onselect=CaViE.assignToHooked;
}
},showHooked:function(e){
if(!e){
e=_1.event;
}
var _9a=this.hookedTo;
var _9b=this.getDateFromStr(_9a.value);
this.curMonth=_9b.getMonth();
this.curYear=_9b.getFullYear();
this.selectedDates.length=0;
this.selectedDates[0]=_9b;
this.Show();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
_4.event.attach(_2,"onclick",this._hideHooked=_4.bind(this.hideHooked,this));
this.divElem.style.display="block";
this.divElem.zIndex="1000";
if(e.offsetX){
x=e.offsetX;
y=e.offsetY;
}else{
x=e.pageX-_2.getBoxObjectFor(_9a).x;
y=e.pageY-_2.getBoxObjectFor(_9a).y;
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
this.divElem.style.left=x+"px";
this.divElem.style.top=y+"px";
},hideHooked:function(e){
if(!e){
e=_1.event;
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
},assignToHooked:function(){
var _9c=this.selectedDates[0];
var _9d=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_9d.value=_9c.getDate()+"/"+(_9c.getMonth()+1)+"/"+_9c.getFullYear();
}else{
_9d.value=(_9c.getMonth()+1)+"/"+_9c.getDate()+"/"+_9c.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
},getDateFromStr:function(str){
var _9e=str.split("/");
var ret;
if(!isNaN(Number(_9e[0]))&&!isNaN(Number(_9e[1]))&&!isNaN(Number(_9e[2]))){
if(_9e[1]>0&&_9e[1]<13&&_9e[0]>0&&_9e[0]<32&&_9e[2]>0){
ret=new Date(_9e[2],_9e[1]-1,_9e[0],0,0,0);
}else{
ret=new Date();
}
}else{
ret=new Date();
}
return ret;
}};
calendarView.prototype.lang={shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","Agoust","September","October","November","December"],noSelection:"No date selected",oneSelection:"Date: ",multipleSelection:"Dates: ",prevMonth:"Previous Month",nextMonth:"Next Month",advanced:"Select month and year",homeDate:"Go to selection date or today",day:"Day:",month:"Month:",year:"Year:",accept:"Accept",cancel:"Cancel",error1:"The date field entered is invalid.",error2:"The year field entered is invalid.",error3:"The selected date is not available.",isFrenchDateFormat:false};
var _9f=function(_a0,_a1,_a2){
this.thumbnail=_a0;
this.path=_a1;
this.name=_a2;
};
galleryView=_4.galleryView=function(div,_a3){
var _a4={thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_4.mixin(_a4,_a3);
this.selectedImage=-1;
this.enabled=true;
this.showNames=_a4.showNames;
this.fixedThumbSize=_a4.fixedThumbSize;
this.thumbWidth=_a4.thumbWidth;
this.thumbHeight=_a4.thumbHeight;
_4.event.init(this);
_4.event.registerCustomEvent(this,"onshow");
_4.event.registerCustomEvent(this,"onrefresh");
_4.event.registerCustomEvent(this,"onhide");
_4.event.registerCustomEvent(this,"onselect");
this.visible=false;
this.divElem=typeof (div)=="string"?_2.getElementById(div):div;
this.div=typeof (div)=="string"?div:this.divElem.id;
this.images=[];
};
galleryView.prototype={addImage:function(_a5){
var _a6={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_4.mixin(_a6,_a5);
if(!_a6.thumbnail){
_4.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_a6.insertIndex==this.images.length){
this.images.push(new _9f(_a6.thumbnail,_a6.path,_a6.name));
}else{
this.images.splice(_a6.insertIndex,0,new _9f(_a6.thumbnail,_a6.path,_a6.name));
}
if(this.visible){
this.updateImages();
}
},deleteImage:function(_a7){
if(typeof (_a7)=="number"){
this.images.splice(_a7,1);
}else{
if(typeof (_a7)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_a7){
this.images.splice(n,1);
break;
}
}
}
}
if(this.selectedImage>this.images.length-1){
this.selectedImage=-1;
}
if(this.visible){
this.updateImages();
}
},Refresh:function(){
var e=_4.event.fire(this,"onrefresh");
if(!e.returnValue){
return;
}
if(this.visible){
this.updateImages();
}
},Show:function(_a8){
var e=_4.event.fire(this,"onshow");
if(!e.returnValue){
return;
}
if(this.visible){
this._oldScrollTop=_2.getElementById(this.div).scrollTop;
}
if(!this.divElem){
this.divElem=_2.getElementById(this.div);
}else{
if(!this.divElem.id){
if(!this.div){
this.div=_71();
}
this.divElem.id=this.div;
}
}
if(!this.divElem){
_4.error.report("Error: galleryView DIV does not exist.");
return;
}
var _a9=this.divElem;
_a9.className="galleryView scriptor";
_a9.innerHTML="";
this.visible=true;
if(_a8){
this.Refresh();
}
},Hide:function(){
var e=_4.event.fire(this,"onhide");
if(!e.returnValue){
return;
}
if(this.divElem){
this.divElem.style.display="none";
}
this.visible=false;
},setLoading:function(val){
var _aa=_2.getElementById(this.div);
_aa.className=val?"galleryView scriptor galleryViewLoading":"galleryView scriptor";
},setMessage:function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_2.getElementById(this.div+"_message")){
_2.getElementById(this.div+"_message").parentNode.removeChild(_2.getElementById(this.div+"_message"));
}
this.divElem.className="galleryView scriptor";
}else{
this.divElem.className="galleryView scriptor galleryViewMessage";
var _ab;
if(!_2.getElementById(this.div+"_message")){
_ab=_2.createElement("p");
_ab.id=this.div+"_message";
_2.getElementById(this.div).appendChild(_ab);
}else{
_ab=_2.getElementById(this.div+"_message");
}
_ab.innerHTML=msg;
}
},updateImages:function(){
if(!this.visible){
_4.error.report("Can't update rows on non visible galleryView object.");
return;
}
var _ac=_2.getElementById(this.div);
if(!this._oldScrollTop){
this._oldScrollTop=_ac.parentNode.scrollTop;
}
_ac.innerHTML="";
var _ad="";
for(var n=0;n<this.images.length;n++){
_ad+="<div id=\""+this.div+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_ad+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_ad+="class=\"gvSelectedImage\" ";
}
_ad+=">";
_ad+="<img id=\""+this.div+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_ad+="<p>"+this.images[n].name+"</p>";
}
_ad+="</div>";
}
_ac.innerHTML=_ad;
for(var n=0;n<this.images.length;n++){
_4.event.attach(_2.getElementById(this.div+"_img_"+n),"onclick",_4.bind(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
},_selectImage:function(e,_ae){
if(!e){
e=_1.event;
}
if(!this.visible||!this.enabled){
_4.event.cancel(e,true);
return false;
}
e.selectedImage=this.selectedImage;
e.selecting=_ae;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _af=this.divElem.getElementsByTagName("img");
if(_ae!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<_af.length;a++){
if(_af[a].parentNode.className=="gvSelectedImage"){
_af[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_ae){
this.selectedImage=-1;
}else{
this.selectedImage=_ae;
_af[_ae].parentNode.className="gvSelectedImage";
}
}
_4.event.cancel(e);
return false;
}};
galleryViewConnector=_4.galleryViewConnector=function(_b0){
var _b1={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_b1,_b0);
if(!_b1.galleryView){
_4.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_b1.api)!="string"||_b1.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_b1.api;
this.galleryView=_b1.galleryView;
this.parameters=_b1.parameters;
this.type="json";
if(_b1.type){
switch(_b1.type.toLowerCase()){
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
if(typeof (_b1.method)=="string"){
this.method=_b1.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.galleryView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
galleryViewConnector.prototype={_onRefresh:function(e){
this.galleryView.setLoading(true);
this.httpRequest.send(this.parameters);
_4.event.cancel(e);
},_onLoad:function(_b2){
this.galleryView.setLoading(false);
if(this.type=="xml"){
var _b3=_b2.getElementsByTagName("root").item(0);
var _b4=this.galleryView.visible;
this.galleryView.visible=false;
this.galleryView.images.length=0;
if(_b3.getAttribute("success")=="1"){
var _b5=_b3.getElementsByTagName("image");
for(var n=0;n<_b5.length;n++){
var _b6=_b5.item(n).getElementsByTagName("thumbnail");
var _b7=_b5.item(n).getElementsByTagName("path");
var _b8=_b5.item(n).getElementsByTagName("name");
var _b9="";
var _ba="";
var _bb="";
if(_b6.length){
if(_b6.item(0).firstChild){
_b9=_b6.item(0).firstChild.data;
}
}
if(_b7.length){
if(_b7.item(0).firstChild){
_ba=_b7.item(0).firstChild.data;
}
}
if(_b8.length){
if(_b8.item(0).firstChild){
_bb=_b8.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _9f(_b9,_ba,_bb));
var _bc=_b5.item(n).getElementsByTagName("param");
if(_bc.length){
for(var a=0;a<_bc.length;a++){
var _bd=_bc.item(a).getAttribute("name");
var _be="";
if(_bc.item(a).firstChild){
_be=_bc.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_bd]=_be;
}
}
}
}else{
this.galleryView.setMessage(_b3.getAttribute("errormessage"));
}
if(_b4){
this.galleryView.visible=_b4;
this.galleryView.updateImages();
}
}else{
var _b4=this.galleryView.visible;
this.galleryView.visible=false;
this.galleryView.images.length=0;
if(_b2.success){
for(var n=0;n<_b2.images.length;n++){
var _b9=_b2.images[n].thumbnail;
var _ba=_b2.images[n].path;
var _bb=_b2.images[n].name;
this.galleryView.images.push(new _9f(_b9,_ba,_bb));
for(var _bf in _b2.images[n]){
if(_bf!="thumbnail"&&_bf!="path"&&_bf!="name"){
this.galleryView.images[this.galleryView.images.length-1][_bf]=_b2.images[n][_bf];
}
}
}
}else{
this.galleryView.setMessage(_b2.errormessage);
}
if(_b4){
this.galleryView.visible=_b4;
this.galleryView.updateImages();
}
}
},_onError:function(_c0){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_c0+")");
}};
_4.httpRequest=function(_c1){
var _c2={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_4.mixin(_c2,_c1);
if(typeof (_c2.ApiCall)!="string"||_c2.ApiCall==""){
_4.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_c2.ApiCall;
this.method="POST";
if(typeof (_c2.method)=="string"){
this.method=_c2.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_c2.Type)=="string"){
switch(_c2.Type.toLowerCase()){
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
if(typeof (_c2.onLoad)=="function"){
this.onLoad=_c2.onLoad;
}
this.onError=null;
if(typeof (_c2.onError)=="function"){
this.onError=_c2.onError;
}
this.requestHeaders=[];
if(_c2.requestHeaders&&_c2.requestHeaders.length){
for(var n=0;n<_c2.requestHeaders.length;n++){
if(typeof (_c2.requestHeaders[n][0])=="string"&&typeof (_c2.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_c2.requestHeaders[n][0],_c2.requestHeaders[n][1]]);
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
},send:function(_c3){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_c3;
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
this.http_request.send(_c3);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _c4=null;
switch(this.Type){
case ("xml"):
_c4=this.http_request.responseXML;
break;
case ("json"):
_c4=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_c4=this.http_request.responseText;
break;
}
this.onLoad(_c4);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_4.httpRequest.prototype.lang={errors:{createRequestError:"Error loading Ajax object!",requestHandleError:"There has been an error sending an Ajax object.\nPlease, try again later."}};
var _c5={get:function(_c6){
var _c7={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_4.mixin(_c7,_c6);
if(!_c7.divId){
_c7.divId=_71();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_c7.id,region:_c7.region,style:_c7.style,className:_c7.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_c7.canHaveChildren,hasInvalidator:_c7.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_c7.x,y:_c7.y,width:_c7.width,height:_c7.height,resizable:_c7.resizable,minHeight:_c7.minHeight,maxHeight:_c7.maxHeight,minWidth:_c7.minWidth,maxWidth:_c7.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
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
var _c8=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_c8=n;
break;
}
}
var _c9=false;
var _ca=(_c8==this.parent.components.length-1)?0:_c8+1;
for(var n=_ca;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_c8){
this.parent.components[n].focus();
_c9=true;
break;
}
}
if(!_c9&&_ca>0){
for(var n=0;n<_ca;n++){
if(this.parent.components[n].visible&&n!=_c8){
this.parent.components[n].focus();
_c9=true;
break;
}
}
}
if(!_c9){
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
this.target.className=this.className?"jsComponent jsComponentHidden "+this.className:"jsComponent jsComponentHidden";
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
var _cb=_4.className.getComputedProperty(this.target,"width");
var _cc=_4.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_cb))){
this.width=parseInt(_cb);
}
if(this.height==null&&!isNaN(parseInt(_cc))){
this.height=parseInt(_cc);
}
if(_cb.substr(_cb.length-1)=="%"){
this._percentWidth=_cb;
}else{
this._origWidth=_cb;
}
if(_cc.substr(_cc.length-1)=="%"){
this._percentHeight=_cc;
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
var _cd=this.__getInnerBox();
var _ce=this.__getOuterBox();
var _cf=this.__getChildrenForRegion("top");
var _d0=0;
var _d1=(this.width-_cd.left-_cd.right-_ce.left-_ce.right)/_cf.length;
var _d2=false;
for(var n=0;n<_cf.length;n++){
if(_cf[n].height>_d0){
_d0=_cf[n].height;
}
_cf[n].x=(n*_d1);
_cf[n].y=0;
_cf[n].width=_d1;
_cf[n].height=_cf[n].height;
if(_cf[n].resizable){
_d2=true;
}
}
var _d3=this.__getChildrenForRegion("bottom");
var _d4=0;
var _d5=(this.width-_cd.left-_cd.right-_ce.left-_ce.right)/_d3.length;
var _d6=false;
for(var n=0;n<_d3.length;n++){
if(_d3[n].height>_d4){
_d4=_d3[n].height;
}
if(_d3[n].resizable){
_d6=true;
}
}
for(var n=0;n<_d3.length;n++){
_d3[n].x=(n*_d5);
_d3[n].y=this.height-_d4-_cd.top-_cd.bottom;
_d3[n].width=_d5;
_d3[n].height=_d3[n].height;
}
var _d7=this.__getChildrenForRegion("left");
var _d8=0;
var _d9=(this.height-_cd.top-_cd.bottom-_ce.left-_ce.right)/_d7.length;
var _da=false;
for(var n=0;n<_d7.length;n++){
if(_d7[n].width>_d8){
_d8=_d7[n].width;
}
_d7[n].x=0;
_d7[n].y=_d0+(n*_d9);
_d7[n].height=_d9-_d0-_d4;
_d7[n].width=_d7[n].width;
if(_d7[n].resizable){
_da=true;
}
}
var _db=this.__getChildrenForRegion("right");
var _dc=0;
var _dd=(this.height-_cd.top-_cd.bottom-_ce.top-_ce.bottom)/_db.length;
var _de=false;
for(var n=0;n<_db.length;n++){
if(_db[n].width>_dc){
_dc=_db[n].width;
}
if(_db[n].resizable){
_de=true;
}
}
for(var n=0;n<_db.length;n++){
_db[n].x=this.width-_dc-_cd.left-_cd.right;
_db[n].y=_d0+(n*_dd);
_db[n].width=_dc;
_db[n].height=_dd-_d0-_d4;
}
var _df=this.__getChildrenForRegion("center");
var _e0=(this.height-_cd.top-_cd.bottom-_ce.top-_ce.bottom-_d4-_d0)/_df.length;
for(var n=0;n<_df.length;n++){
_df[n].x=_d8;
_df[n].y=_d0+(n*_e0);
_df[n].height=_e0;
_df[n].width=this.width-_cd.left-_cd.right-_ce.left-_ce.right-_d8-_dc;
}
if(_d2){
if(!this.splitters.top){
this.splitters.top=_2.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_4.className.add(this.splitters.top,"jsSplitter");
_4.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_4.event.attach(this.splitters.top,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _e1=_cf[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_cd.left-_cd.right)+"px";
this.splitters.top.style.top=(_d0-_e1.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_d6){
if(!this.splitters.bottom){
this.splitters.bottom=_2.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_4.className.add(this.splitters.bottom,"jsSplitter");
_4.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_4.event.attach(this.splitters.bottom,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _e2=_d3[0].__getOuterBox();
var _e3=parseInt(_4.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_e3)){
_e3=5;
}
this.splitters.bottom.style.width=(this.width-_cd.left-_cd.right)+"px";
this.splitters.bottom.style.top=(this.height-_d4-_e3-_e2.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_da){
if(!this.splitters.left){
this.splitters.left=_2.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_4.className.add(this.splitters.left,"jsSplitter");
_4.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_4.event.attach(this.splitters.left,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _e4=_d7[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_cd.top-_cd.bottom-_d0-_d4)+"px";
this.splitters.left.style.top=(_d0)+"px";
this.splitters.left.style.left=(_d8-_e4.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_de){
if(!this.splitters.right){
this.splitters.right=_2.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_4.className.add(this.splitters.right,"jsSplitter");
_4.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_4.event.attach(this.splitters.right,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _e5=_db[0].__getOuterBox();
var _e6=parseInt(_4.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_e6)){
_e6=5;
}
this.splitters.right.style.height=(this.height-_cd.top-_cd.bottom-_d0-_d4)+"px";
this.splitters.right.style.top=(_d0)+"px";
this.splitters.right.style.left=(this.width-_dc-_e6-_e5.left)+"px";
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
},resizeTo:function(_e7){
if(_e7){
if(_e7.width){
this.width=_e7.width;
this._percentWidth=null;
}
if(_e7.height){
this.height=_e7.height;
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
var _e8=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_e8=true;
break;
}
}
if(!_e8&&ref.CMP_SIGNATURE&&this.canHaveChildren){
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
var _e9=this.__getInnerBox();
var _ea=this.__getOuterBox();
var _eb=0,_ec=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_ea.left-_ea.right-_e9.left-_e9.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_ea=this.__getOuterBox();
_eb=this.target.parentNode.offsetWidth-_ea.left-_ea.right-_e9.left-_e9.right;
if(isNaN(_eb)||_eb<0){
_eb=0;
}
this.width=_eb;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_ec=this.target.offsetHeight-_ea.top-_ea.bottom-_e9.top-_e9.bottom;
if(isNaN(_ec)||_ec<0){
_ec=0;
}
this.height=_ec;
}
if(this.width!==null){
_eb=this.width-_e9.left-_e9.right-_ea.left-_ea.right;
if(isNaN(_eb)||_eb<0){
_eb=0;
}
this.target.style.width=_eb+"px";
}
if(this.height!==null){
_ec=this.height-_e9.top-_e9.bottom-_ea.top-_ea.bottom;
if(isNaN(_ec)||_ec<0){
_ec=0;
}
this.target.style.height=_ec+"px";
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
var _ed=parseInt(_4.className.getComputedProperty(this.target,"padding-top"));
var _ee=parseInt(_4.className.getComputedProperty(this.target,"padding-bottom"));
var _ef=parseInt(_4.className.getComputedProperty(this.target,"padding-left"));
var _f0=parseInt(_4.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_ed)){
box.top=_ed;
}
if(!isNaN(_ee)){
box.bottom=_ee;
}
if(!isNaN(_ef)){
box.left=_ef;
}
if(!isNaN(_f0)){
box.right=_f0;
}
var _f1=parseInt(_4.className.getComputedProperty(this.target,"border-top-width"));
var _f2=parseInt(_4.className.getComputedProperty(this.target,"border-bottom-width"));
var _f3=parseInt(_4.className.getComputedProperty(this.target,"border-left-width"));
var _f4=parseInt(_4.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_f1)){
box.top+=_f1;
}
if(!isNaN(_f2)){
box.bottom+=_f2;
}
if(!isNaN(_f3)){
box.left+=_f3;
}
if(!isNaN(_f4)){
box.right+=_f4;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _f5=parseInt(_4.className.getComputedProperty(this.target,"margin-top"));
var _f6=parseInt(_4.className.getComputedProperty(this.target,"margin-bottom"));
var _f7=parseInt(_4.className.getComputedProperty(this.target,"margin-left"));
var _f8=parseInt(_4.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_f5)){
box.top=_f5;
}
if(!isNaN(_f6)){
box.bottom=_f6;
}
if(!isNaN(_f7)){
box.left=_f7;
}
if(!isNaN(_f8)){
box.right=_f8;
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
},_onResizeStart:function(e,_f9){
if(!e){
e=_1.event;
}
this.resizingRegion=_f9;
_4.event.attach(_2,"mousemove",this._resizeMoveHandler=_4.bindAsEventListener(this._onResizeMove,this));
_4.event.attach(_2,"mouseup",this._resizeStopHandler=_4.bindAsEventListener(this._onResizeStop,this));
if(_f9=="top"||_f9=="bottom"){
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
var _fa=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_fa){
_4.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_fa;
var _fb=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_fb=_4.event.getPointXY(e).y;
}else{
_fb=_4.event.getPointXY(e).x;
}
var _fc=_fb-this.resizeStartingPosition;
this.resizeStartingPosition=_fb;
var _fd=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_fd.length;n++){
_fd[n].resizeTo({height:_fd[n].height+_fc});
}
break;
case ("bottom"):
for(var n=0;n<_fd.length;n++){
_fd[n].resizeTo({height:_fd[n].height-_fc});
}
break;
case ("left"):
for(var n=0;n<_fd.length;n++){
_fd[n].resizeTo({width:_fd[n].width+_fc});
}
break;
case ("right"):
for(var n=0;n<_fd.length;n++){
_fd[n].resizeTo({width:_fd[n].width-_fc});
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
var _fe=["center","left","top","bottom","right"];
var _ff=false;
for(var n=0;n<_fe.length;n++){
if(cmp.region==_fe[n]){
_ff=true;
break;
}
}
if(!_ff){
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
_4.ContextMenu=function(opts){
var _100={canHaveChildren:false,hasInvalidator:false,items:[]};
_4.mixin(_100,opts);
var cmp=_c5.get(_100);
for(var prop in cmp){
this[prop]=cmp[prop];
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
for(var n=0;n<_100.items.length;n++){
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
var ubox=_4.element.getOuterBox(this.ul);
var ibox=this.__getInnerBox();
this.width=this.ul.offsetWidth+ubox.left+ubox.right+ibox.left+ibox.right;
this.height=this.ul.offsetHeight+ubox.top+ubox.bottom+ibox.top+ibox.bottom;
this.__updatePosition();
};
_4.ContextMenu.prototype.addItem=function(opts,ndx){
var _101={label:"sep",onclick:null,checked:false};
_4.mixin(_101,opts);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_101);
}else{
ndx=this.items.length;
this.items.push(_101);
}
if(this.target){
var li=_2.createElement("li");
var _102="";
var item=_101;
if(item.label=="sep"){
li.className="contextMenuSep";
}else{
if(item.checked){
li.className="OptionChecked";
}
_102+="<a href=\"#\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(item["class"]){
_102+=" class=\""+item["class"]+"\"";
}
_102+=">"+item.label+"</a>";
}
li.innerHTML=_102;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(item.label!="sep"&&typeof (item.onclick)=="function"){
_4.event.attach(_2.getElementById(this.divId+"_itm_"+ndx),"onclick",item.onclick);
}
this.updateSize();
}
};
_4.ContextMenu.prototype.removeItem=function(_103){
if(typeof (_103)=="number"){
if(_103>=0&&_103<=this.items.length-1){
this.items.splice(_103,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_103]);
}
}
}else{
if(typeof (_103)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_103){
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
_4.ContextMenu.prototype.checkItem=function(_104,_105){
if(typeof (_104)=="undefined"){
return;
}
if(typeof (_105)=="undefined"){
_105=false;
}
if(typeof (_104)=="number"){
if(_104>=0&&_104<=this.items.length-1){
this.items[_104].checked=_105?true:false;
if(this.target){
_4.className[(_105?"add":"remove")](this.ul.getElementsByTagName("li")[_104],"OptionChecked");
}
}
}else{
if(typeof (_104)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_104){
this.items[n].checked=_105?true:false;
if(this.target){
_4.className[(_105?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_4.Panel=function(opts){
var _106={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_106,opts);
var cmp=_c5.get(_106);
for(var prop in cmp){
this[prop]=cmp[prop];
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
_4.TabContainer=function(opts){
var _107={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_107,opts);
var cmp=_c5.get(_107);
for(var prop in cmp){
this[prop]=cmp[prop];
}
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
this.create();
_4.className.add(this.target,"jsTabContainer");
this._tabList=new _108({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _109({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._tabsContextMenu=new _4.ContextMenu();
this._canHaveChildren=false;
this._tabs=[];
this._selectedTabId=null;
this.resizeImplementation=function(){
var _10a=this._tabList.cmpTarget.offsetWidth;
var _10b=_10a;
var _10c=_2.getElementById(this._tabList.divId+"_more");
if(_10c){
var _10d=parseInt(_4.className.getComputedProperty(_10c,"margin-left"));
var _10e=parseInt(_4.className.getComputedProperty(_10c,"margin-right"));
_10a-=(_10c.offsetWidth+_10d+_10e);
}
var _10f=0;
var _110=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _111=this._tabList.cmpTarget.childNodes[n];
var _112=parseInt(_4.className.getComputedProperty(_111,"margin-left"));
var _113=parseInt(_4.className.getComputedProperty(_111,"margin-right"));
if(isNaN(_112)){
_112=0;
}
if(isNaN(_113)){
_113=0;
}
_10f+=_111.offsetWidth+_112+_113;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_10a=_10b;
}
if(_10f>=_10a){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_110){
this._tabList._extraTabs=n;
_110=true;
}
_111.style.visibility="hidden";
}else{
_111.style.visibility="visible";
}
}
if(_10f<_10a){
if(this._tabList._showingMore){
this._tabList.hideMore();
}
this._tabList._extraTabs=this._tabs.length;
}
this._updateExtraTabsContextMenu();
};
};
_4.TabContainer.prototype.addTab=function(opts,_114,ndx){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _115={title:"",paneId:_114.divId,pane:_114,closable:false};
_4.mixin(_115,opts);
if(!_115.pane||!_115.pane.CMP_SIGNATURE||!_115.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _116=new _117(_115);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_116);
}else{
this._tabs.push(_116);
}
var tabs=this._tabList.cmpTarget.childNodes;
var _118=_2.createElement("div");
_118.id=_116.paneId+"_tablabel";
_118.className="jsTabLabel";
if(_116.closable){
_4.className.add(_118,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_116.paneId;
_4.className.add(_118,"jsTabSelected");
}
_118.innerHTML="<span>"+_116.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_116.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_118);
}else{
this._tabList.cmpTarget.insertBefore(_118,tabs[ndx]);
}
this._pageContainer.addPage(_116.pane);
this._pageContainer.activate(this._selectedTabId);
var _119=_2.getElementById(_116.paneId+"_closeHandler");
if(!_116.closable){
_4.className.add(_119,"jsTabCloseHidden");
}else{
_4.className.add(_118,"jsTabClosable");
}
_4.event.attach(_118,"onclick",_4.bindAsEventListener(this.selectTab,this,_116.paneId));
_4.event.attach(_119,"onclick",_4.bindAsEventListener(this.closeTab,this,_116.paneId));
this.resize();
};
_4.TabContainer.prototype.removeTab=function(ref,_11a){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_11a)=="undefined"){
_11a=true;
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
var _11b=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _11b=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_11a);
this._tabs.splice(ndx,1);
if(_11b){
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
_4.TabContainer.prototype.setTitle=function(ref,_11c){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_11c;
this.resize();
}
};
_4.TabContainer.prototype.setClosable=function(ref,_11d){
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
var _11e=this._tabList.cmpTarget.childNodes[ndx];
var _11f=_2.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_11d){
_4.className.add(_11e,"jsTabClosable");
_4.className.remove(_11f,"jsTabCloseHidden");
}else{
_4.className.remove(_11e,"jsTabClosable");
_4.className.add(_11f,"jsTabCloseHidden");
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
var _120=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_120){
if(this._tabsContextMenu.items.length>_120){
while(this._tabsContextMenu.items.length>_120){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_120-this._tabsContextMenu.items.length;n++){
var _121=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_121].title,onclick:_4.bindAsEventListener(function(e,_122,_123){
this.selectTab(_122);
},this,_121,this._tabList._extraTabs)},0);
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
var _108=function(opts){
var _124={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_124,opts);
var cmp=_c5.get(_124);
for(var prop in cmp){
this[prop]=cmp[prop];
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
var _125=_2.createElement("span");
_125.id=this.divId+"_more";
_125.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_125);
_125.innerHTML=" ";
_4.className.add(this.cmpTarget,"jsTabListInner");
_4.event.attach(_125,"onclick",_4.bindAsEventListener(this.onDropdownClick,this));
};
_108.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
}
this.parent._tabsContextMenu.show(e);
_4.event.cancel(e,true);
return false;
};
_108.prototype.showMore=function(){
if(!this._showingMore){
_4.className.remove(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_108.prototype.hideMore=function(){
if(this._showingMore){
_4.className.add(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _109=function(opts){
var _126={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_126,opts);
var cmp=_c5.get(_126);
for(var prop in cmp){
this[prop]=cmp[prop];
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
_109.prototype.addPage=function(pane){
_4.className.add(pane.target,"jsTabPage");
this.addChild(pane);
};
_109.prototype.removePage=function(pane,_127){
this.removeChild(pane);
if(_127){
pane.destroy();
}
};
_109.prototype.activate=function(_128){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_128){
this.components[n].show();
}
}
};
var _117=function(opts){
var _129={title:"",paneId:null,pane:null,closable:false};
_4.mixin(_129,opts);
this.title=_129.title;
this.paneId=_129.paneId;
this.pane=_129.pane;
this.closable=_129.closable;
};
var _12a=function(opts){
var _12b={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_4.mixin(_12b,opts);
if(!_12b.Name){
_4.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_12b.Name;
this.Type=(typeof (_12c[_12b.Type])!="undefined")?_12b.Type:"alpha";
this.show=_12b.show;
this.Width=isNaN(Number(_12b.Width))?80:Number(_12b.Width);
this.Format=_12b.Format;
this.displayName=_12b.displayName?_12b.displayName:_12b.Name;
this.sqlName=_12b.sqlName?_12b.sqlName:_12b.Name;
this.showToolTip=_12b.showToolTip;
this.Compare=_12b.Compare;
};
var _12d=function(_12e,_12f){
_12f=_12f?_12f:{};
for(var n=0;n<_12e.length;n++){
var name=_12e[n].Name;
var type=_12e[n].Type;
this[name]=_12f[name]?_12c[type](_12f[name]):_12c[type]();
}
for(var prop in _12f){
if(this[prop]===_3){
this[prop]=_12f[prop];
}
}
};
var _12c={"num":Number,"alpha":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _130=str.split(" ");
if(_130[0]=="0000-00-00"){
return "";
}else{
var _131=_130[0].split("-");
ret=new Date(_131[0],_131[1]-1,_131[2]);
if(_130[1]){
var _132=_130[1].split(":");
ret=new Date(_131[0],_131[1]-1,_131[2],_132[0],_132[1],_132[2]);
}
}
}
return ret;
}};
_4.DataView=function(opts){
var _133={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_4.mixin(_133,opts);
var cmp=_c5.get(_133);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_133.multiselect;
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
this.paginating=_133.paginating;
this.rowsPerPage=_133.rowsPerPage;
this.curPage=0;
this.totalRows=0;
this.resizingXCache=0;
this.resizingFrom=0;
this.resColumnId=null;
this.nextRowId=1;
this._cached=null;
this.create();
_4.className.add(this.target,"dataViewMain");
this.renderTemplate();
this.canHaveChildren=false;
for(var n=0;n<_133.columns.length;n++){
this.addColumn(this.createColumn(_133.columns[n]));
}
this.optionsMenu=new _4.ContextMenu();
this.optionsMenu.addItem({label:this.lang.refresh,onclick:_4.bindAsEventListener(function(e){
this.refresh();
},this)});
this.optionsMenu.addItem({label:"sep"});
this.resizeImplementation=function(){
this._checkCache();
if(this._cached){
var _134=this.__getInnerBox();
var _135=this.__getOuterBox();
var _136=_134.top+_134.bottom+_135.top+_135.bottom;
if(this._cached.pagination_header){
var _135=_4.element.getOuterBox(this._cached.pagination_header);
_136+=this._cached.pagination_header.offsetHeight+_135.top+_135.bottom;
}
if(this._cached.header){
var _135=_4.element.getOuterBox(this._cached.header);
_136+=this._cached.header.offsetHeight+_135.top+_135.bottom;
}
if(this._cached.footer){
var _135=_4.element.getOuterBox(this._cached.footer);
_136+=this._cached.footer.offsetHeight+_135.top+_135.bottom;
}
this._cached.outer_body.style.height=(this.height-_136)+"px";
}
};
this._registeredEvents=[];
this.DOMAddedImplementation=function(){
this._checkCache();
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
};
_4.DataView.prototype.renderTemplate=function(){
var _137="";
if(this.paginating){
_137+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_137+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_137+="</label></li><li>";
_137+="<a href=\"#\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_137+="<a href=\"#\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
_137+="</li><li><label class=\"dataViewPaginationGotoPage\" for=\""+this.divId+"_pageInput\">"+this.lang.pageEnd+"</label>";
_137+="<input type=\"text\" class=\"dataViewPaginationInput\" id=\""+this.divId+"_pageInput\" />";
_137+="<input type=\"button\" value=\""+this.lang.pageGo+"\" class=\"dataViewPageButton\" id=\""+this.divId+"_pageInputBtn\" />";
_137+="</li></ul></div>";
}
_137+="<div class=\"dataViewHeader"+(this.multiselect?" dataViewMultiselect":"")+" dataViewToolbar\" id=\""+this.divId+"_columnsHeader\">";
_137+="<ul id=\""+this.divId+"_columnsUl\">";
if(this.multiselect){
_137+="<li class=\"dataViewCheckBoxHeader\">";
_137+="<input type=\"checkbox\" id=\""+this.divId+"_selectAll\" class=\"dataViewCheckBox\" /></li>";
_137+="<li class=\"dataViewSep\"></li>";
}
_137+="</ul>";
_137+="<span id=\""+this.divId+"_optionsMenuBtn\" class=\"dataViewHeaderMenu\">";
_137+="<a href=\"#\"> </a></span></div>";
var _138=0;
if(this.paginating){
_138=(this.height-40);
}else{
_138=(this.height-40);
}
_137+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_137+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_137+="</div>";
_137+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_137;
this._checkCache();
};
_4.DataView.prototype._checkCache=function(){
if(!this._cached&&_2.getElementById(this.divId+"_columnsHeader")){
this._cached={pagination_header:_2.getElementById(this.divId+"_paginationHeader"),header:_2.getElementById(this.divId+"_columnsHeader"),headerUl:_2.getElementById(this.divId+"_columnsUl"),outer_body:_2.getElementById(this.divId+"_outerBody"),rows_body:_2.getElementById(this.divId+"_body"),footer:_2.getElementById(this.divId+"_footer")};
}
};
_4.DataView.prototype.getTotalPages=function(){
var _139=0;
var _13a=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_13a){
n+=this.rowsPerPage;
_139++;
}
return _139;
};
_4.DataView.prototype.getNextRowId=function(){
var _13b=true;
while(_13b){
_13b=false;
var _13c=this.nextRowId++;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_13c){
_13b=true;
break;
}
}
}
return _13c;
};
_4.DataView.prototype.createColumn=function(opts){
return new _12a(opts);
};
_4.DataView.prototype.addColumn=function(_13d,ndx){
if(this.__findColumn(_13d.Name)==-1){
if(ndx===_3){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_13d);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_13d.Name]=_12c[_13d.Type]();
}
}
if(!this.orderBy&&_13d.show){
this.orderBy=_13d.Name;
}
if(this.inDOM){
this._addColumnToUI(this.columns[ndx],ndx);
}
}
};
_4.DataView.prototype.__findColumn=function(_13e){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_13e){
return n;
}
}
return -1;
};
_4.DataView.prototype.deleteColumn=function(_13f){
var _140="";
var ndx=null;
if(typeof (_13f)=="string"){
var _141=this.__findColumn(_13f);
if(_141!=-1){
_140=this.columns[_141].Name;
ndx=_141;
this.columns.splice(_141,1);
}
}
if(typeof (_13f)=="number"){
if(_13f>0&&_13f<this.columns.length){
_140=this.columns[_13f].Name;
ndx=_13f;
this.columns.splice(_13f,1);
}
}
if(typeof (_13f)=="object"){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n]==_13f){
_140=this.columns[n].Name;
ndx=n;
this.columns.splice(n,1);
}
}
}
if(_140){
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_140]=null;
delete this.rows[n][_140];
}
}
if(this.orderBy==_140){
this.orderBy=this.columns[this.columns.length-1].Name;
}
if(this.inDOM){
this._removeColumnFromUI(ndx);
}
}
};
_4.DataView.prototype._addColumnToUI=function(_142,ndx){
var li=_2.createElement("li");
li.style.width=_142.Width+"px";
var _143="dataViewColumn";
if(!_142.show){
_143+=" dataViewColumnHidden";
}
li.className=_143;
var a=_2.createElement("a");
if(this.orderBy==_142.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href","#");
a.innerHTML=_142.Name;
li.appendChild(a);
li2=_2.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_143="dataViewFieldSep";
if(!_142.show){
_143+=" dataViewColumnHidden";
}
li2.className=_143;
var _144=this._cached.headerUl.getElementsByTagName("li");
if(!_144.length){
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}else{
var _145=this.multiselect?2:0;
if(ndx>=0&&(_145+(ndx*2))<_144.length){
this._cached.headerUl.insertBefore(li,_144[_145+(ndx*2)]);
this._cached.headerUl.insertBefore(li2,_144[_145+(ndx*2)+1]);
}else{
this._cached.headerUl.appendChild(li);
this._cached.headerUl.appendChild(li2);
}
}
this.optionsMenu.addItem({label:_142.Name,onclick:_4.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_142.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_142.Name,ndx);
}
}
};
_4.DataView.prototype._removeColumnFromUI=function(ndx){
var _146=this.multiselect?2:0;
var _147=this._cached.headerUl.getElementsByTagName("li");
if(ndx>=0&&(_146+(ndx*2))<_147.length){
this._cached.headerUl.removeChild(_147[_146+(ndx*2)]);
this._cached.headerUl.removeChild(_147[_146+(ndx*2)]);
}
this.optionsMenu.removeItem(ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._removeCellFromUI(this.rows[n].id,ndx);
}
}
};
_4.DataView.prototype._addRowToUI=function(_148){
if(_148<0||_148>this.rows.length-1){
return;
}
var _149=this.rows[_148].id;
var _14a=_2.createElement("ul");
_14a.id=this.divId+"_row_"+_149;
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
if(_14b){
_14a.className="dataViewRowSelected";
}
if(_148%2){
_4.className.add(_14a,"dataViewRowOdd");
}
if(this.multiselect){
var _14c=_2.createElement("li");
var _14d="dataViewMultiselectCell";
_14c.className=_14d;
var _14e="<input type=\"checkbox\" id=\""+this.divId+"_selectRow_"+_149+"\" class=\"dataViewCheckBox\" ";
if(_14b){
_14e+="checked=\"checked\" ";
}
_14e+="/></li>";
_14c.innerHTML=_14e;
_14a.appendChild(_14c);
}
var _14f=this._cached.rows_body.getElementsByTagName("ul");
if(_14f.length==0){
this._cached.rows_body.appendChild(_14a);
}else{
if(_148==this.rows.length-1){
this._cached.rows_body.appendChild(_14a);
}else{
var _150=null;
for(var n=_148+1;n<this.rows.length;n++){
_150=_2.getElementById(this.divId+"_row_"+this.rows[n].id);
if(_150){
break;
}
}
if(_150){
this._cached.rows_body.insertBefore(_14a,_150);
}else{
this._cached.rows_body.appendChild(_14a);
}
}
}
for(var a=0;a<this.columns.length;a++){
this._addCellToUI(_149,this.columns[a].Name,a);
}
this.__refreshFooter();
};
_4.DataView.prototype._removeRowFromUI=function(_151){
if(_151<0||_151>this.rows.length-1){
return;
}
var _152=this.rows[_151].id;
var _153=_2.getElementById(this.divId+"_row_"+_152);
if(_153){
this._cached.rows_body.removeChild(_153);
}
this.__refreshFooter();
};
_4.DataView.prototype._addCellToUI=function(_154,_155,ndx){
var _156=_2.getElementById(this.divId+"_row_"+_154);
if(_156){
var _157=_156.getElementsByTagName("li");
var li=_2.createElement("li");
li.id=this.divId+"_cell_"+_154+"_"+ndx;
var _158="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_158+=" dataViewCellHidden";
}
if(ndx==0){
_158+=" dataViewFirstCell";
}
li.className=_158;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_154)[_155]);
}
if(ndx>0&&ndx<_157.length-1){
_156.insertBefore(li,_157[ndx]);
}else{
_156.appendChild(li);
}
this.setCellValue(_154,_155,this.getById(_154)[_155]);
}
};
_4.DataView.prototype._removeCellFromUI=function(_159,ndx){
var _15a=this.multiselect?1:0;
var _15b=_2.getElementById(this.divId+"_row_"+_159);
if(_15b){
var _15c=_15b.getElementsByTagName("li");
if(ndx>0&&(_15a+ndx)<_15c.length){
_15b.removeChild(_15c[_15a+ndx]);
}
}
};
_4.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _12d(this.columns,data);
};
_4.DataView.prototype.addRow=function(_15d,ndx){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(!_15d){
_15d=this.createRow();
}else{
if(!_15d.id){
_15d.id=this.getNextRowId();
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
this.rows.splice(ndx,0,_15d);
}else{
this.rows.push(_15d);
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
_4.DataView.prototype.deleteRow=function(_15e){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
var _15f=-1;
if(typeof (_15e)=="number"){
_15f=_15e;
this.rows.splice(_15e,1);
}
if(typeof (_15e)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_15e){
_15f=n;
this.rows.splice(n,1);
}
}
}
if(_15f!=-1){
this._removeRowFromUI(_15f);
}
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_15f){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_15f){
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
_4.DataView.prototype.searchRows=function(_160,_161){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_160]==_161){
ret.push(this.rows[n]);
}
}
return ret;
};
_4.DataView.prototype.setCellValue=function(_162,_163,_164){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return false;
}
var _165=this.__findColumn(_163);
if(_165==-1){
return false;
}
var _166=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_162){
_166=n;
break;
}
}
if(_166===null){
return false;
}
this.rows[_166][_163]=_164;
var cell=_2.getElementById(this.divId+"_cell_"+_162+"_"+_165);
if(typeof (this.columns[_165].Format)=="function"){
var _167=this.columns[_165].Format(_164);
cell.innerHTML="";
if(typeof (_167)=="string"){
cell.innerHTML=_167;
}else{
cell.appendChild(_167);
}
}else{
cell.innerHTML=_164;
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
var _168;
if(!_2.getElementById(this.divId+"_message")){
_168=_2.createElement("div");
_168.id=this.divId+"_message";
_168.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_168);
}else{
_168=_2.getElementById(this.divId+"_message");
}
_168.innerHTML=msg;
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
_4.DataView.prototype._UISelectAll=function(_169){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_4.className[(_169?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_169;
}
};
_4.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _16a=false;
if(!this.multiselect){
if(this.selectedRow==n){
_16a=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_16a=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_16a;
}
_4.className[(_16a?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_4.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_2.getElementById(this.divId+"_pageInput").value;
var _16b=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_16b){
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
var _16c=this.getTotalPages();
if(this.curPage<_16c-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.updateRows=function(_16d){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(_16d===_3){
_16d=false;
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_16d){
this._cached.rows_body.innerHTML="";
}
var _16e=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_16e.length;n++){
var _16f=_16e[n].id.substr(_16e[n].id.lastIndexOf("_")+1);
if(!this.getById(_16f)){
this._cached.rows_body.removeChild(_16e[n]);
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
if(!_16d){
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
var _170="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_170+=this.lang.noRows;
}else{
if(this.rows.length==1){
_170+="1 "+" "+this.lang.row;
}else{
_170+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_2.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_170+=this.lang.noRows;
}else{
var _171=(this.rowsPerPage*this.curPage);
var _172=(_171+this.rowsPerPage)>this.totalRows?this.totalRows:(_171+this.rowsPerPage);
_170+=(_171+1)+" - "+_172+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_170+="</li></ul>";
this._cached.footer.innerHTML=_170;
};
_4.DataView.prototype.__setOrder=function(_173){
if(!this.inDOM){
_4.error.report("Cant sort a DataView not in DOM");
return;
}
var _174=this.columns[_173].Name;
if(_173>=0&&_173<this.columns.length){
var _175=this.multiselect?2:0;
var _176=this._cached.headerUl.getElementsByTagName("li");
var _177=this.__findColumn(this.orderBy);
_4.className.remove(_176[_175+(_177*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_174){
this.orderBy=_174;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_4.className.add(_176[_175+(_173*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _178=e.target||e.srcElement;
var _179=this.divId+"_selectRow_";
if(_178.nodeName.toLowerCase()=="input"&&_178.id.substr(0,_179.length)==_179){
var _17a=_178.id.substr(_178.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_17a){
this.__markRow(e,n);
break;
}
}
}else{
while(_178.nodeName.toLowerCase()!="ul"){
if(_178==this._cached.rows_body){
return;
}
_178=_178.parentNode;
}
var _17a=_178.id.substr(_178.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_17a){
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
var _17b=e.target||e.srcElement;
if(_17b.nodeName.toLowerCase()=="a"){
colNdx=Number(_17b.id.substr(_17b.id.lastIndexOf("_")+1));
if(!isNaN(colNdx)){
this.__setOrder(colNdx);
}
}
};
_4.DataView.prototype._onHeaderColumnMousedown=function(e){
if(!e){
e=_1.event;
}
var _17c=e.target||e.srcElement;
if(_17c.nodeName.toLowerCase()=="li"&&_17c.className=="dataViewFieldSep"){
var _17d=Number(_17c.id.substr(_17c.id.lastIndexOf("_")+1));
if(!isNaN(_17d)){
this.activateResizing(e,_17d);
}
}
};
_4.DataView.prototype.__selectRow=function(e,_17e){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_17e){
e.unselecting=_17e;
}else{
if(this.multiselect){
var _17f=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_17e){
_17f=true;
break;
}
}
if(_17f){
e.unselecting=_17e;
}else{
e.selecting=_17e;
}
}else{
e.selecting=_17e;
}
}
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_17e!=-1){
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
if(this.selectedRow==_17e&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_17e;
_4.className.add(rows[_17e],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_17e){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_17e;
this.selectedRows=[_17e];
}
}else{
if(e.ctrlKey){
var _17f=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_17e){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_17f=true;
}
}
if(!_17f){
this.selectedRow=_17e;
this.selectedRows.push(_17e);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_17e){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_17e;
for(var n=this.selectedRows[0];(_17e>this.selectedRows[0]?n<=_17e:n>=_17e);(_17e>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_17e);
this.selectedRow=_17e;
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
_4.DataView.prototype.__markRow=function(e,_180){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_180;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _181=this.rows[_180].id;
elem=_2.getElementById(this.divId+"_selectRow_"+_181);
if(elem.checked){
this.selectedRows.push(_180);
this.selectedRow=_180;
var row=_2.getElementById(this.divId+"_row_"+_181);
_4.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_180){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_2.getElementById(this.divId+"_row_"+_181);
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
_4.DataView.prototype.toggleColumn=function(_182){
if(this.columns[_182].show){
this.columns[_182].show=false;
}else{
this.columns[_182].show=true;
}
var _183=this.multiselect?2:0;
var _184=this._cached.headerUl.getElementsByTagName("li");
if(_182>=0&&((_183+(_182*2)+1)<_184.length)){
_4.className[this.columns[_182].show?"remove":"add"](_184[_183+_182],"dataViewColumnHidden");
_4.className[this.columns[_182].show?"remove":"add"](_184[_183+_182+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_183=this.multiselect?1:0;
_4.className[this.columns[_182].show?"remove":"add"](rows[n].childNodes[_183+_182],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_182+2,this.columns[_182].show);
};
_4.DataView.prototype.forceWidth=function(w){
};
_4.DataView.prototype.__calculateMinWidth=function(){
};
_4.DataView.prototype.__calculateTotalWidth=function(){
var _185=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_185+=cols[n].offsetWidth;
}
return _185;
};
_4.DataView.prototype.__sort=function(_186){
var n,_187,swap;
if(!this.orderBy){
return;
}
for(n=_186+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_186][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_186][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_186][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_186][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_187=this.rows[_186];
this.rows[_186]=this.rows[n];
this.rows[n]=_187;
if(this.selectedRow==_186){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_186;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_186){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_186;
}
}
}
}
}
if(_186<this.rows.length-2){
this.__sort(_186+1);
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
_4.DataView.prototype.__getColumnSqlName=function(_188){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_188){
return this.columns[n].sqlName;
}
}
return false;
};
_4.DataView.prototype.activateResizing=function(e,_189){
if(!e){
e=_1.event;
}
this.resColumnId=_189;
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
this.resizingFrom=this.columns[_189].Width;
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
var _18a=Math.abs(this.resizingXCache-x);
var _18b=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _18c=this.resColumnId;
var _18d=_18c;
for(n=_18c+1;n<this.columns.length;n++){
if(this.columns[n].show){
_18d=n;
break;
}
}
var _18e=false;
var _18f=false;
if(!_18b){
if((this.columns[_18c].Width-_18a)>0){
this.columns[_18c].Width-=_18a;
_18e=true;
}
}else{
var _190=this.__calculateTotalWidth();
if((_190+_18a)<this._cached.headerUl.offsetWidth){
this.columns[_18c].Width+=_18a;
_18e=true;
}else{
if(_18d!=_18c){
if((this.columns[_18d].Width-_18a)>0){
this.columns[_18c].Width+=_18a;
this.columns[_18d].Width-=_18a;
_18e=true;
_18f=true;
}
}
}
}
var _191=this._cached.headerUl;
if(_191){
var cols=_191.getElementsByTagName("li");
var _192=(this.multiselect?2:0);
var ndx=_192+(_18c*2);
cols[ndx].style.width=this.columns[_18c].Width+"px";
if(_18f){
ndx+=2;
cols[ndx].style.width=this.columns[_18d].Width+"px";
}
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var cols=rows[n].getElementsByTagName("li");
var _192=(this.multiselect?1:0);
var _193=this.columns[_18c].Width;
cols[_192+(_18c)].style.width=_193+"px";
if(_18f){
cols[_192+(_18c)+1].style.width=this.columns[_18d].Width+"px";
}
}
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.DataViewConnector=function(opts){
var _194={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_194,opts);
if(!_194.dataView){
_4.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_194.api)!="string"||_194.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_194.api;
this.dataView=_194.dataView;
this.parameters=_194.parameters;
this.type="json";
if(_194.type){
switch(_194.type.toLowerCase()){
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
if(typeof (_194.method)=="string"){
this.method=_194.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.dataView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _195="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_195+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_195+="&"+this.parameters;
}
this.httpRequest.send(_195);
_4.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(root.getAttribute("success")=="1"){
var _196=Number(root.getAttribute("totalrows"));
if(!isNaN(_196)){
this.dataView.totalRows=_196;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _197={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _198=cols[a].getAttribute("name");
if(_198&&cols[a].firstChild){
var _199=this.dataView.__findColumn(_198)!=-1?this.dataView.columns[this.dataView.__findColumn(_198)].Type:"alpha";
_197[_198]=_12c[_199](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_197));
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
}else{
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(data.success){
var _196=Number(data.totalrows);
if(!isNaN(_196)){
this.dataView.totalRows=_196;
}
for(var n=0;n<data.rows.length;n++){
var _197={};
for(var _198 in data.rows[n]){
var _199=this.dataView.__findColumn(_198)!=-1?this.dataView.columns[this.dataView.__findColumn(_198)].Type:"alpha";
_197[_198]=_12c[_199](data.rows[n][_198]);
}
this.dataView.addRow(this.dataView.createRow(_197));
}
}else{
this.dataView.setMessage(data.errormessage);
}
}
},_onError:function(_19a){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_19a+")");
}};
_4.DataView.prototype.lang={"noRows":"No rows to show.","rows":"rows.","row":"row.","pageStart":"Page ","pageMiddle":" of ","pageEnd":" Go to page: ","pageGo":"Go","pagePrev":"<< Previous","pageNext":"Next >>","refresh":"Refresh","of":"of"};
var _19b=function(opts){
var _19c={id:null,parentId:0,parent:null,Name:""};
_4.mixin(_19c,opts);
this.treeView=_19c.treeView;
this.id=_19c.id!==null?_19c.id:this.treeView.getNextNodeId();
this.parentId=_19c.parentId;
this.Name=String(_19c.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_19c.parent;
};
_19b.prototype={searchNode:function(id){
var n;
var srch=null;
var _19d=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_19d<this.childNodes.length){
srch=this.childNodes[_19d].searchNode(id);
_19d++;
}
return srch;
},updateChildrenNodes:function(){
var _19e=_2.getElementById(this.treeView.divId+"_"+this.id+"_branch");
for(var i=0;i<this.childNodes.length;i++){
var node=_2.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_19e.appendChild(node);
var _19f="";
var _1a0=this.childNodes[i].childNodes.length;
if(_1a0){
_19f+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\"#\" class=\"";
_19f+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_19f+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_1a0){
_19f+="class=\"treeViewSingleNode\" ";
}
_19f+="href=\"#\">"+this.childNodes[i].Name+"</a>";
if(_1a0){
_19f+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_19f;
if(_1a0){
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_4.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_4.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_1a0){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_4.TreeView=function(opts){
var _1a1={canHaveChildren:false,hasInvalidator:true};
_4.mixin(_1a1,opts);
var cmp=_c5.get(_1a1);
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
this.masterNode=new _19b({id:0,parentId:0,parent:null,Name:"root",treeView:this});
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
var _1a2=true;
while(_1a2){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_1a2=false;
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
var _1a3;
if(!_2.getElementById(this.divId+"_message")){
_1a3=_2.createElement("div");
_1a3.id=this.divId+"_message";
_1a3.className="treeViewMessageDiv";
this.target.appendChild(_1a3);
}else{
_1a3=_2.getElementById(this.divId+"_message");
}
_1a3.innerHTML=msg;
}
};
_4.TreeView.prototype._expandNode=function(e,_1a4){
if(!e){
e=_1.event;
}
var node=this.searchNode(_1a4);
if(node.expanded){
node.expanded=false;
_2.getElementById(this.divId+"_"+_1a4+"_branch").style.display="none";
}else{
node.expanded=true;
_2.getElementById(this.divId+"_"+_1a4+"_branch").style.display="block";
}
_4.event.cancel(e);
return false;
};
_4.TreeView.prototype._selectNode=function(e,_1a5){
if(!e){
e=_1.event;
}
if(this.selectedNode!==null){
var _1a6=this.searchNode(this.selectedNode);
_4.className.remove(_2.getElementById(this.divId+"_"+_1a6.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_1a5){
var _1a6=this.searchNode(_1a5);
_4.className.add(_2.getElementById(this.divId+"_"+_1a6.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_1a5)?null:_1a5;
_4.event.cancel(e,true);
return false;
};
_4.TreeView.prototype.addNode=function(opts,_1a7,ndx){
var _1a8=(_1a7==0)?this.masterNode:this.searchNode(_1a7);
if(_1a8){
var _1a9={treeView:this,parentId:_1a7,parent:_1a8,Name:""};
_4.mixin(_1a9,opts);
if(ndx>=0&&ndx<_1a8.childNodes.length){
_1a8.childNodes.splice(ndx,0,new _19b(_1a9));
}else{
_1a8.childNodes.push(new _19b(_1a9));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.deleteNode=function(_1aa){
if(_1aa==0||_1aa=="0"){
return;
}
this._searchAndDelete(_1aa,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype._searchAndDelete=function(_1ab,node){
var _1ac=false;
if(typeof (_1ab)=="number"||typeof (_1ab)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_1ab){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_1ac=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_1ab){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_1ac=true;
break;
}
}
}
if(!_1ac){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_1ab);
if(done){
_1ac=done;
break;
}
}
}
return _1ac;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.TreeViewConnector=function(opts){
var _1ad={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_1ad,opts);
if(!_1ad.treeView){
_4.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_1ad.api)!="string"||_1ad.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_1ad.api;
this.treeView=_1ad.treeView;
this.parameters=_1ad.parameters;
this.type="json";
if(_1ad.type){
switch(_1ad.type.toLowerCase()){
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
if(typeof (_1ad.method)=="string"){
this.method=_1ad.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _19b({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _1ae=this._fetchNodes(root);
if(_1ae.length){
this._addNodesFromXml(_1ae,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _19b({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_1af,_1b0){
for(var n=0;n<_1af.length;n++){
var id=null;
if(_1af[n].getAttribute("id")){
id=_1af[n].getAttribute("id");
}
var _1b1=_1af[n].getElementsByTagName("label")[0];
if(_1b1){
labelStr=_1b1.firstChild.data;
}
var _1b2=_1af[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_1b0);
if(_1b2){
this._addNodesFromXml(this._fetchNodes(_1af[n]),id);
}
}
},_addNodesFromJson:function(_1b3,_1b4){
for(var n=0;n<_1b3.length;n++){
this.treeView.addNode({Name:_1b3[n].label,id:_1b3[n].id},_1b4);
if(_1b3[n].nodes){
this._addNodesFromJson(_1b3[n].nodes,_1b3[n].id);
}
}
},_onError:function(_1b5){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_1b5+")");
}};
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1b6=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1b7,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1b8(_1b9){
_1b6.lastIndex=0;
return _1b6.test(_1b9)?"\""+_1b9.replace(_1b6,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1b9+"\"";
};
function str(key,_1ba){
var i,k,v,_1bb,mind=gap,_1bc,_1bd=_1ba[key];
if(_1bd&&typeof _1bd==="object"&&typeof _1bd.toJSON==="function"){
_1bd=_1bd.toJSON(key);
}
if(typeof rep==="function"){
_1bd=rep.call(_1ba,key,_1bd);
}
switch(typeof _1bd){
case "string":
return _1b8(_1bd);
case "number":
return isFinite(_1bd)?String(_1bd):"null";
case "boolean":
case "null":
return String(_1bd);
case "object":
if(!_1bd){
return "null";
}
gap+=_1b7;
_1bc=[];
if(Object.prototype.toString.apply(_1bd)==="[object Array]"){
_1bb=_1bd.length;
for(i=0;i<_1bb;i+=1){
_1bc[i]=str(i,_1bd)||"null";
}
v=_1bc.length===0?"[]":gap?"[\n"+gap+_1bc.join(",\n"+gap)+"\n"+mind+"]":"["+_1bc.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1bb=rep.length;
for(i=0;i<_1bb;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1bd);
if(v){
_1bc.push(_1b8(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1bd){
if(Object.hasOwnProperty.call(_1bd,k)){
v=str(k,_1bd);
if(v){
_1bc.push(_1b8(k)+(gap?": ":":")+v);
}
}
}
}
v=_1bc.length===0?"{}":gap?"{\n"+gap+_1bc.join(",\n"+gap)+"\n"+mind+"}":"{"+_1bc.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1be,_1bf,_1c0){
var i;
gap="";
_1b7="";
if(typeof _1c0==="number"){
for(i=0;i<_1c0;i+=1){
_1b7+=" ";
}
}else{
if(typeof _1c0==="string"){
_1b7=_1c0;
}
}
rep=_1bf;
if(_1bf&&typeof _1bf!=="function"&&(typeof _1bf!=="object"||typeof _1bf.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1be});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1c1){
var j;
function walk(_1c2,key){
var k,v,_1c3=_1c2[key];
if(_1c3&&typeof _1c3==="object"){
for(k in _1c3){
if(Object.hasOwnProperty.call(_1c3,k)){
v=walk(_1c3,k);
if(v!==undefined){
_1c3[k]=v;
}else{
delete _1c3[k];
}
}
}
}
return _1c1.call(_1c2,key,_1c3);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1c1==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

