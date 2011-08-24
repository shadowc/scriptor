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
var _72=function(_73,_74,_75){
this.thumbnail=_73;
this.path=_74;
this.name=_75;
};
galleryView=_4.galleryView=function(div,_76){
var _77={thumbWidth:154,thumbHeight:184,showNames:true,fixedThumbSize:true};
_4.mixin(_77,_76);
this.selectedImage=-1;
this.enabled=true;
this.showNames=_77.showNames;
this.fixedThumbSize=_77.fixedThumbSize;
this.thumbWidth=_77.thumbWidth;
this.thumbHeight=_77.thumbHeight;
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
galleryView.prototype={addImage:function(_78){
var _79={thumbnail:null,path:null,name:null,insertIndex:this.images.length};
_4.mixin(_79,_78);
if(!_79.thumbnail){
_4.error.report("Missing thumbnail information for galleryView image");
return;
}
if(_79.insertIndex==this.images.length){
this.images.push(new _72(_79.thumbnail,_79.path,_79.name));
}else{
this.images.splice(_79.insertIndex,0,new _72(_79.thumbnail,_79.path,_79.name));
}
if(this.visible){
this.updateImages();
}
},deleteImage:function(_7a){
if(typeof (_7a)=="number"){
this.images.splice(_7a,1);
}else{
if(typeof (_7a)=="object"){
for(var n=0;n<this.images.length;n++){
if(this.images[n]==_7a){
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
},Show:function(_7b){
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
var _7c=this.divElem;
_7c.className="galleryView scriptor";
_7c.innerHTML="";
this.visible=true;
if(_7b){
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
var _7d=_2.getElementById(this.div);
_7d.className=val?"galleryView scriptor galleryViewLoading":"galleryView scriptor";
},setMessage:function(msg){
if(msg===false||msg===null||typeof (msg)!="string"){
if(_2.getElementById(this.div+"_message")){
_2.getElementById(this.div+"_message").parentNode.removeChild(_2.getElementById(this.div+"_message"));
}
this.divElem.className="galleryView scriptor";
}else{
this.divElem.className="galleryView scriptor galleryViewMessage";
var _7e;
if(!_2.getElementById(this.div+"_message")){
_7e=_2.createElement("p");
_7e.id=this.div+"_message";
_2.getElementById(this.div).appendChild(_7e);
}else{
_7e=_2.getElementById(this.div+"_message");
}
_7e.innerHTML=msg;
}
},updateImages:function(){
if(!this.visible){
_4.error.report("Can't update rows on non visible galleryView object.");
return;
}
var _7f=_2.getElementById(this.div);
if(!this._oldScrollTop){
this._oldScrollTop=_7f.parentNode.scrollTop;
}
_7f.innerHTML="";
var _80="";
for(var n=0;n<this.images.length;n++){
_80+="<div id=\""+this.div+"_envelop_"+n+"\" ";
if(this.fixedThumbSize){
_80+="style=\"width: "+this.thumbWidth+"px; height: "+this.thumbHeight+"px; overflow: hidden;\"";
}
if(this.selectedImage==n){
_80+="class=\"gvSelectedImage\" ";
}
_80+=">";
_80+="<img id=\""+this.div+"_img_"+n+"\" src=\""+this.images[n].thumbnail+"\" />";
if(this.showNames&&this.images[n].name){
_80+="<p>"+this.images[n].name+"</p>";
}
_80+="</div>";
}
_7f.innerHTML=_80;
for(var n=0;n<this.images.length;n++){
_4.event.attach(_2.getElementById(this.div+"_img_"+n),"onclick",_4.bind(this._selectImage,this,n));
}
if(this.selectedImage>=this.images.length){
this.selectedImage=-1;
}
},_selectImage:function(e,_81){
if(!e){
e=_1.event;
}
if(!this.visible||!this.enabled){
_4.event.cancel(e,true);
return false;
}
e.selectedImage=this.selectedImage;
e.selecting=_81;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _82=this.divElem.getElementsByTagName("img");
if(_81!=-1){
if(this.selectedImage!=-1){
for(var a=0;a<_82.length;a++){
if(_82[a].parentNode.className=="gvSelectedImage"){
_82[a].parentNode.className="";
break;
}
}
}
if(this.selectedImage==_81){
this.selectedImage=-1;
}else{
this.selectedImage=_81;
_82[_81].parentNode.className="gvSelectedImage";
}
}
_4.event.cancel(e);
return false;
}};
galleryViewConnector=_4.galleryViewConnector=function(_83){
var _84={galleryView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_84,_83);
if(!_84.galleryView){
_4.error.report("Must provide galleryView reference to galleryViewConnector object.");
return;
}
if(typeof (_84.api)!="string"||_84.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_84.api;
this.galleryView=_84.galleryView;
this.parameters=_84.parameters;
this.type="json";
if(_84.type){
switch(_84.type.toLowerCase()){
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
if(typeof (_84.method)=="string"){
this.method=_84.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.galleryView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
galleryViewConnector.prototype={_onRefresh:function(e){
this.galleryView.setLoading(true);
this.httpRequest.send(this.parameters);
_4.event.cancel(e);
},_onLoad:function(_85){
this.galleryView.setLoading(false);
if(this.type=="xml"){
var _86=_85.getElementsByTagName("root").item(0);
var _87=this.galleryView.visible;
this.galleryView.visible=false;
this.galleryView.images.length=0;
if(_86.getAttribute("success")=="1"){
var _88=_86.getElementsByTagName("image");
for(var n=0;n<_88.length;n++){
var _89=_88.item(n).getElementsByTagName("thumbnail");
var _8a=_88.item(n).getElementsByTagName("path");
var _8b=_88.item(n).getElementsByTagName("name");
var _8c="";
var _8d="";
var _8e="";
if(_89.length){
if(_89.item(0).firstChild){
_8c=_89.item(0).firstChild.data;
}
}
if(_8a.length){
if(_8a.item(0).firstChild){
_8d=_8a.item(0).firstChild.data;
}
}
if(_8b.length){
if(_8b.item(0).firstChild){
_8e=_8b.item(0).firstChild.data;
}
}
this.galleryView.images.push(new _72(_8c,_8d,_8e));
var _8f=_88.item(n).getElementsByTagName("param");
if(_8f.length){
for(var a=0;a<_8f.length;a++){
var _90=_8f.item(a).getAttribute("name");
var _91="";
if(_8f.item(a).firstChild){
_91=_8f.item(a).firstChild.data;
}
this.galleryView.images[this.galleryView.images.length-1][_90]=_91;
}
}
}
}else{
this.galleryView.setMessage(_86.getAttribute("errormessage"));
}
if(_87){
this.galleryView.visible=_87;
this.galleryView.updateImages();
}
}else{
var _87=this.galleryView.visible;
this.galleryView.visible=false;
this.galleryView.images.length=0;
if(_85.success){
for(var n=0;n<_85.images.length;n++){
var _8c=_85.images[n].thumbnail;
var _8d=_85.images[n].path;
var _8e=_85.images[n].name;
this.galleryView.images.push(new _72(_8c,_8d,_8e));
for(var _92 in _85.images[n]){
if(_92!="thumbnail"&&_92!="path"&&_92!="name"){
this.galleryView.images[this.galleryView.images.length-1][_92]=_85.images[n][_92];
}
}
}
}else{
this.galleryView.setMessage(_85.errormessage);
}
if(_87){
this.galleryView.visible=_87;
this.galleryView.updateImages();
}
}
},_onError:function(_93){
this.galleryView.setLoading(false);
this.galleryView.setMessage("Error: Unable to load galleryView object (HTTP status: "+_93+")");
}};
_4.httpRequest=function(_94){
var _95={ApiCall:null,method:"POST",Type:"json",onLoad:null,onError:null,requestHeaders:[]};
_4.mixin(_95,_94);
if(typeof (_95.ApiCall)!="string"||_95.ApiCall==""){
_4.error.report("httpRequest Error: first parameter must be a string.");
return;
}
this.ApiCall=_95.ApiCall;
this.method="POST";
if(typeof (_95.method)=="string"){
this.method=_95.method.toUpperCase()=="POST"?"POST":"GET";
}
this.Type="text";
if(typeof (_95.Type)=="string"){
switch(_95.Type.toLowerCase()){
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
if(typeof (_95.onLoad)=="function"){
this.onLoad=_95.onLoad;
}
this.onError=null;
if(typeof (_95.onError)=="function"){
this.onError=_95.onError;
}
this.requestHeaders=[];
if(_95.requestHeaders&&_95.requestHeaders.length){
for(var n=0;n<_95.requestHeaders.length;n++){
if(typeof (_95.requestHeaders[n][0])=="string"&&typeof (_95.requestHeaders[n][1])=="string"){
this.requestHeaders.push([_95.requestHeaders[n][0],_95.requestHeaders[n][1]]);
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
},send:function(_96){
if(this.inRequest){
this.http_request.abort();
this.inRequest=false;
}
var url=this.ApiCall;
if(this.method=="GET"){
url+="?"+_96;
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
this.http_request.send(_96);
this.inRequest=true;
},handleRequest:function(){
if(this.inRequest&&this.http_request.readyState==4){
this.inRequest=false;
if(this.http_request.status==200){
if(this.onLoad){
var _97=null;
switch(this.Type){
case ("xml"):
_97=this.http_request.responseXML;
break;
case ("json"):
_97=JSON.parse(this.http_request.responseText);
break;
case ("text"):
default:
_97=this.http_request.responseText;
break;
}
this.onLoad(_97);
}
}else{
if(this.onError){
this.onError(this.http_request.status);
}
}
}
}};
_4.httpRequest.prototype.lang={errors:{createRequestError:"Error loading Ajax object!",requestHandleError:"There has been an error sending an Ajax object.\nPlease, try again later."}};
var _98={get:function(_99){
var _9a={id:null,region:"center",style:"",className:"",width:null,height:null,x:null,y:null,canHaveChildren:false,hasInvalidator:false,resizable:false,minHeight:null,maxHeight:null,minWidth:null,maxWidth:null};
_4.mixin(_9a,_99);
if(!_9a.divId){
_9a.divId=_71();
}
var cmp={CMP_SIGNATURE:"Scriptor.ui.Component",divId:_9a.id,region:_9a.region,style:_9a.style,className:_9a.className,target:null,cmpTarget:null,invalidator:null,canHaveChildren:_9a.canHaveChildren,hasInvalidator:_9a.hasInvalidator,enabled:true,splitters:{},resizingRegion:"",resizeStartingPosition:0,resizeInterval:20,lastResizeTimeStamp:null,created:false,inDOM:false,visible:false,x:_9a.x,y:_9a.y,width:_9a.width,height:_9a.height,resizable:_9a.resizable,minHeight:_9a.minHeight,maxHeight:_9a.maxHeight,minWidth:_9a.minWidth,maxWidth:_9a.maxWidth,_percentWidth:null,_percentHeight:null,_origWidth:null,zIndexCache:1,components:[],parent:null,hasFocus:false,DOMAddedImplementation:function(){
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
var _9b=false;
for(var n=0;n<this.parent.components.length;n++){
if(this.parent.components[n].hasFocus){
_9b=n;
break;
}
}
var _9c=false;
var _9d=(_9b==this.parent.components.length-1)?0:_9b+1;
for(var n=_9d;n<this.parent.components.length;n++){
if(this.parent.components[n].visible&&n!=_9b){
this.parent.components[n].focus();
_9c=true;
break;
}
}
if(!_9c&&_9d>0){
for(var n=0;n<_9d;n++){
if(this.parent.components[n].visible&&n!=_9b){
this.parent.components[n].focus();
_9c=true;
break;
}
}
}
if(!_9c){
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
var _9e=_4.className.getComputedProperty(this.target,"width");
var _9f=_4.className.getComputedProperty(this.target,"height");
if(this.width==null&&!isNaN(parseInt(_9e))){
this.width=parseInt(_9e);
}
if(this.height==null&&!isNaN(parseInt(_9f))){
this.height=parseInt(_9f);
}
if(_9e.substr(_9e.length-1)=="%"){
this._percentWidth=_9e;
}else{
this._origWidth=_9e;
}
if(_9f.substr(_9f.length-1)=="%"){
this._percentHeight=_9f;
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
var _a0=this.__getInnerBox();
var _a1=this.__getOuterBox();
var _a2=this.__getChildrenForRegion("top");
var _a3=0;
var _a4=(this.width-_a0.left-_a0.right-_a1.left-_a1.right)/_a2.length;
var _a5=false;
for(var n=0;n<_a2.length;n++){
if(_a2[n].height>_a3){
_a3=_a2[n].height;
}
_a2[n].x=(n*_a4);
_a2[n].y=0;
_a2[n].width=_a4;
_a2[n].height=_a2[n].height;
if(_a2[n].resizable){
_a5=true;
}
}
var _a6=this.__getChildrenForRegion("bottom");
var _a7=0;
var _a8=(this.width-_a0.left-_a0.right-_a1.left-_a1.right)/_a6.length;
var _a9=false;
for(var n=0;n<_a6.length;n++){
if(_a6[n].height>_a7){
_a7=_a6[n].height;
}
if(_a6[n].resizable){
_a9=true;
}
}
for(var n=0;n<_a6.length;n++){
_a6[n].x=(n*_a8);
_a6[n].y=this.height-_a7-_a0.top-_a0.bottom;
_a6[n].width=_a8;
_a6[n].height=_a6[n].height;
}
var _aa=this.__getChildrenForRegion("left");
var _ab=0;
var _ac=(this.height-_a0.top-_a0.bottom-_a1.left-_a1.right)/_aa.length;
var _ad=false;
for(var n=0;n<_aa.length;n++){
if(_aa[n].width>_ab){
_ab=_aa[n].width;
}
_aa[n].x=0;
_aa[n].y=_a3+(n*_ac);
_aa[n].height=_ac-_a3-_a7;
_aa[n].width=_aa[n].width;
if(_aa[n].resizable){
_ad=true;
}
}
var _ae=this.__getChildrenForRegion("right");
var _af=0;
var _b0=(this.height-_a0.top-_a0.bottom-_a1.top-_a1.bottom)/_ae.length;
var _b1=false;
for(var n=0;n<_ae.length;n++){
if(_ae[n].width>_af){
_af=_ae[n].width;
}
if(_ae[n].resizable){
_b1=true;
}
}
for(var n=0;n<_ae.length;n++){
_ae[n].x=this.width-_af-_a0.left-_a0.right;
_ae[n].y=_a3+(n*_b0);
_ae[n].width=_af;
_ae[n].height=_b0-_a3-_a7;
}
var _b2=this.__getChildrenForRegion("center");
var _b3=(this.height-_a0.top-_a0.bottom-_a1.top-_a1.bottom-_a7-_a3)/_b2.length;
for(var n=0;n<_b2.length;n++){
_b2[n].x=_ab;
_b2[n].y=_a3+(n*_b3);
_b2[n].height=_b3;
_b2[n].width=this.width-_a0.left-_a0.right-_a1.left-_a1.right-_ab-_af;
}
if(_a5){
if(!this.splitters.top){
this.splitters.top=_2.createElement("div");
this.splitters.top.id=this.divId+"_splitter_top";
_4.className.add(this.splitters.top,"jsSplitter");
_4.className.add(this.splitters.top,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.top);
_4.event.attach(this.splitters.top,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"top"));
}
var _b4=_a2[0].__getOuterBox();
this.splitters.top.style.width=(this.width-_a0.left-_a0.right)+"px";
this.splitters.top.style.top=(_a3-_b4.bottom)+"px";
}else{
if(this.splitters.top){
this.splitters.top.parentNode.removeChild(this.splitters.top);
this.splitters.top=null;
}
}
if(_a9){
if(!this.splitters.bottom){
this.splitters.bottom=_2.createElement("div");
this.splitters.bottom.id=this.divId+"_splitter_bottom";
_4.className.add(this.splitters.bottom,"jsSplitter");
_4.className.add(this.splitters.bottom,"jsSplitterHorizontal");
this.cmpTarget.appendChild(this.splitters.bottom);
_4.event.attach(this.splitters.bottom,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"bottom"));
}
var _b5=_a6[0].__getOuterBox();
var _b6=parseInt(_4.className.getComputedProperty(this.splitters.bottom,"height"));
if(isNaN(_b6)){
_b6=5;
}
this.splitters.bottom.style.width=(this.width-_a0.left-_a0.right)+"px";
this.splitters.bottom.style.top=(this.height-_a7-_b6-_b5.top)+"px";
}else{
if(this.splitters.bottom){
this.splitters.bottom.parentNode.removeChild(this.splitters.bottom);
this.splitters.bottom=null;
}
}
if(_ad){
if(!this.splitters.left){
this.splitters.left=_2.createElement("div");
this.splitters.left.id=this.divId+"_splitter_left";
_4.className.add(this.splitters.left,"jsSplitter");
_4.className.add(this.splitters.left,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.left);
_4.event.attach(this.splitters.left,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"left"));
}
var _b7=_aa[0].__getOuterBox();
this.splitters.left.style.height=(this.height-_a0.top-_a0.bottom-_a3-_a7)+"px";
this.splitters.left.style.top=(_a3)+"px";
this.splitters.left.style.left=(_ab-_b7.right)+"px";
}else{
if(this.splitters.left){
this.splitters.left.parentNode.removeChild(this.splitters.left);
this.splitters.left=null;
}
}
if(_b1){
if(!this.splitters.right){
this.splitters.right=_2.createElement("div");
this.splitters.right.id=this.divId+"_splitter_right";
_4.className.add(this.splitters.right,"jsSplitter");
_4.className.add(this.splitters.right,"jsSplitterVertical");
this.cmpTarget.appendChild(this.splitters.right);
_4.event.attach(this.splitters.right,"mousedown",_4.bindAsEventListener(this._onResizeStart,this,"right"));
}
var _b8=_ae[0].__getOuterBox();
var _b9=parseInt(_4.className.getComputedProperty(this.splitters.right,"width"));
if(isNaN(_b9)){
_b9=5;
}
this.splitters.right.style.height=(this.height-_a0.top-_a0.bottom-_a3-_a7)+"px";
this.splitters.right.style.top=(_a3)+"px";
this.splitters.right.style.left=(this.width-_af-_b9-_b8.left)+"px";
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
},resizeTo:function(_ba){
if(_ba){
if(_ba.width){
this.width=_ba.width;
this._percentWidth=null;
}
if(_ba.height){
this.height=_ba.height;
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
var _bb=false;
for(var n=0;n<this.components.length;n++){
if(this.components[n]===ref){
_bb=true;
break;
}
}
if(!_bb&&ref.CMP_SIGNATURE&&this.canHaveChildren){
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
var _bc=this.__getInnerBox();
var _bd=this.__getOuterBox();
var _be=0,_bf=0;
if(this._percentWidth!==null){
this.target.style.width=this._percentWidth;
this.width=this.target.offsetWidth-_bd.left-_bd.right-_bc.left-_bc.right;
}else{
if(this._origWidth!==null){
if((!this._origWidth||this._origWidth=="auto")&&this.parent===null){
if(this.target.parentNode){
_bd=this.__getOuterBox();
_be=this.target.parentNode.offsetWidth-_bd.left-_bd.right-_bc.left-_bc.right;
if(isNaN(_be)||_be<0){
_be=0;
}
this.width=_be;
}
}
}
}
if(this._percentHeight!==null){
this.target.style.height=this._percentHeight;
_bf=this.target.offsetHeight-_bd.top-_bd.bottom-_bc.top-_bc.bottom;
if(isNaN(_bf)||_bf<0){
_bf=0;
}
this.height=_bf;
}
if(this.width!==null){
_be=this.width-_bc.left-_bc.right-_bd.left-_bd.right;
if(isNaN(_be)||_be<0){
_be=0;
}
this.target.style.width=_be+"px";
}
if(this.height!==null){
_bf=this.height-_bc.top-_bc.bottom-_bd.top-_bd.bottom;
if(isNaN(_bf)||_bf<0){
_bf=0;
}
this.target.style.height=_bf+"px";
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
var _c0=parseInt(_4.className.getComputedProperty(this.target,"padding-top"));
var _c1=parseInt(_4.className.getComputedProperty(this.target,"padding-bottom"));
var _c2=parseInt(_4.className.getComputedProperty(this.target,"padding-left"));
var _c3=parseInt(_4.className.getComputedProperty(this.target,"padding-right"));
if(!isNaN(_c0)){
box.top=_c0;
}
if(!isNaN(_c1)){
box.bottom=_c1;
}
if(!isNaN(_c2)){
box.left=_c2;
}
if(!isNaN(_c3)){
box.right=_c3;
}
var _c4=parseInt(_4.className.getComputedProperty(this.target,"border-top-width"));
var _c5=parseInt(_4.className.getComputedProperty(this.target,"border-bottom-width"));
var _c6=parseInt(_4.className.getComputedProperty(this.target,"border-left-width"));
var _c7=parseInt(_4.className.getComputedProperty(this.target,"border-right-width"));
if(!isNaN(_c4)){
box.top+=_c4;
}
if(!isNaN(_c5)){
box.bottom+=_c5;
}
if(!isNaN(_c6)){
box.left+=_c6;
}
if(!isNaN(_c7)){
box.right+=_c7;
}
return box;
},__getOuterBox:function(){
var box={top:0,bottom:0,left:0,right:0};
var _c8=parseInt(_4.className.getComputedProperty(this.target,"margin-top"));
var _c9=parseInt(_4.className.getComputedProperty(this.target,"margin-bottom"));
var _ca=parseInt(_4.className.getComputedProperty(this.target,"margin-left"));
var _cb=parseInt(_4.className.getComputedProperty(this.target,"margin-right"));
if(!isNaN(_c8)){
box.top=_c8;
}
if(!isNaN(_c9)){
box.bottom=_c9;
}
if(!isNaN(_ca)){
box.left=_ca;
}
if(!isNaN(_cb)){
box.right=_cb;
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
},_onResizeStart:function(e,_cc){
if(!e){
e=_1.event;
}
this.resizingRegion=_cc;
_4.event.attach(_2,"mousemove",this._resizeMoveHandler=_4.bindAsEventListener(this._onResizeMove,this));
_4.event.attach(_2,"mouseup",this._resizeStopHandler=_4.bindAsEventListener(this._onResizeStop,this));
if(_cc=="top"||_cc=="bottom"){
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
var _cd=new Date().getTime();
if(this.lastResizeTimeStamp&&this.lastResizeTimeStamp+this.resizeInterval>_cd){
_4.event.cancel(e,true);
return false;
}
this.lastResizeTimeStamp=_cd;
var _ce=0;
if(this.resizingRegion=="top"||this.resizingRegion=="bottom"){
_ce=_4.event.getPointXY(e).y;
}else{
_ce=_4.event.getPointXY(e).x;
}
var _cf=_ce-this.resizeStartingPosition;
this.resizeStartingPosition=_ce;
var _d0=this.__getChildrenForRegion(this.resizingRegion);
switch(this.resizingRegion){
case ("top"):
for(var n=0;n<_d0.length;n++){
_d0[n].resizeTo({height:_d0[n].height+_cf});
}
break;
case ("bottom"):
for(var n=0;n<_d0.length;n++){
_d0[n].resizeTo({height:_d0[n].height-_cf});
}
break;
case ("left"):
for(var n=0;n<_d0.length;n++){
_d0[n].resizeTo({width:_d0[n].width+_cf});
}
break;
case ("right"):
for(var n=0;n<_d0.length;n++){
_d0[n].resizeTo({width:_d0[n].width-_cf});
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
var _d1=["center","left","top","bottom","right"];
var _d2=false;
for(var n=0;n<_d1.length;n++){
if(cmp.region==_d1[n]){
_d2=true;
break;
}
}
if(!_d2){
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
_4.ContextMenu=function(_d3){
var _d4={canHaveChildren:false,hasInvalidator:false,items:[]};
_4.mixin(_d4,_d3);
var cmp=_98.get(_d4);
for(var _d5 in cmp){
this[_d5]=cmp[_d5];
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
for(var n=0;n<_d4.items.length;n++){
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
var _d6=_4.element.getOuterBox(this.ul);
var _d7=this.__getInnerBox();
this.width=this.ul.offsetWidth+_d6.left+_d6.right+_d7.left+_d7.right;
this.height=this.ul.offsetHeight+_d6.top+_d6.bottom+_d7.top+_d7.bottom;
this.__updatePosition();
};
_4.ContextMenu.prototype.addItem=function(_d8,ndx){
var _d9={label:"sep",onclick:null,checked:false};
_4.mixin(_d9,_d8);
if(!isNaN(Number(ndx))&&ndx>=0&&ndx<this.items.length){
this.items.splice(ndx,0,_d9);
}else{
ndx=this.items.length;
this.items.push(_d9);
}
if(this.target){
var li=_2.createElement("li");
var _da="";
var _db=_d9;
if(_db.label=="sep"){
li.className="contextMenuSep";
}else{
if(_db.checked){
li.className="OptionChecked";
}
_da+="<a href=\"#\" id=\""+this.divId+"_itm_"+ndx+"\"";
if(_db["class"]){
_da+=" class=\""+_db["class"]+"\"";
}
_da+=">"+_db.label+"</a>";
}
li.innerHTML=_da;
if(ndx==this.items.length-1){
this.ul.appendChild(li);
}else{
this.ul.insertBefore(li,this.ul.getElementsByTagName("li")[ndx]);
}
if(_db.label!="sep"&&typeof (_db.onclick)=="function"){
_4.event.attach(_2.getElementById(this.divId+"_itm_"+ndx),"onclick",_db.onclick);
}
this.updateSize();
}
};
_4.ContextMenu.prototype.removeItem=function(_dc){
if(typeof (_dc)=="number"){
if(_dc>=0&&_dc<=this.items.length-1){
this.items.splice(_dc,1);
if(this.target){
this.ul.removeChild(this.ul.getElementsByTagName("li")[_dc]);
}
}
}else{
if(typeof (_dc)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_dc){
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
_4.ContextMenu.prototype.checkItem=function(_dd,_de){
if(typeof (_dd)=="undefined"){
return;
}
if(typeof (_de)=="undefined"){
_de=false;
}
if(typeof (_dd)=="number"){
if(_dd>=0&&_dd<=this.items.length-1){
this.items[_dd].checked=_de?true:false;
if(this.target){
_4.className[(_de?"add":"remove")](this.ul.getElementsByTagName("li")[_dd],"OptionChecked");
}
}
}else{
if(typeof (_dd)=="object"){
for(var n=0;n<this.items.length;n++){
if(this.items[n]==_dd){
this.items[n].checked=_de?true:false;
if(this.target){
_4.className[(_de?"add":"remove")](this.ul.getElementsByTagName("li")[n],"OptionChecked");
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
_4.Panel=function(_df){
var _e0={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_e0,_df);
var cmp=_98.get(_e0);
for(var _e1 in cmp){
this[_e1]=cmp[_e1];
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
_4.TabContainer=function(_e2){
var _e3={canHaveChildren:true,hasInvalidator:true};
_4.mixin(_e3,_e2);
var cmp=_98.get(_e3);
for(var _e4 in cmp){
this[_e4]=cmp[_e4];
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
this._tabList=new _e5({id:this.divId+"_tabList",region:"top",className:"jsTabList"});
this.addChild(this._tabList);
this._pageContainer=new _e6({id:this.divId+"_pageContainer",region:"center",className:"jsPageContainer"});
this.addChild(this._pageContainer);
this._tabsContextMenu=new _4.ContextMenu();
this._canHaveChildren=false;
this._tabs=[];
this._selectedTabId=null;
this.resizeImplementation=function(){
var _e7=this._tabList.cmpTarget.offsetWidth;
var _e8=_e7;
var _e9=_2.getElementById(this._tabList.divId+"_more");
if(_e9){
var _ea=parseInt(_4.className.getComputedProperty(_e9,"margin-left"));
var _eb=parseInt(_4.className.getComputedProperty(_e9,"margin-right"));
_e7-=(_e9.offsetWidth+_ea+_eb);
}
var _ec=0;
var _ed=false;
for(var n=0;n<this._tabList.cmpTarget.childNodes.length;n++){
var _ee=this._tabList.cmpTarget.childNodes[n];
var _ef=parseInt(_4.className.getComputedProperty(_ee,"margin-left"));
var _f0=parseInt(_4.className.getComputedProperty(_ee,"margin-right"));
if(isNaN(_ef)){
_ef=0;
}
if(isNaN(_f0)){
_f0=0;
}
_ec+=_ee.offsetWidth+_ef+_f0;
if(n==this._tabList.cmpTarget.childNodes.length-1){
_e7=_e8;
}
if(_ec>=_e7){
if(!this._tabList._showingMore){
this._tabList.showMore();
}
if(!_ed){
this._tabList._extraTabs=n;
_ed=true;
}
_ee.style.visibility="hidden";
}else{
_ee.style.visibility="visible";
}
}
if(_ec<_e7){
if(this._tabList._showingMore){
this._tabList.hideMore();
}
this._tabList._extraTabs=this._tabs.length;
}
this._updateExtraTabsContextMenu();
};
};
_4.TabContainer.prototype.addTab=function(_f1,_f2,ndx){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before adding tabs!");
return;
}
var _f3={title:"",paneId:_f2.divId,pane:_f2,closable:false};
_4.mixin(_f3,_f1);
if(!_f3.pane||!_f3.pane.CMP_SIGNATURE||!_f3.pane.created){
return;
}
if(typeof (ndx)=="undefined"){
ndx=this._tabs.length;
}else{
if(ndx<0||ndx>this._tabs.length){
ndx=this._tabs.length;
}
}
var _f4=new _f5(_f3);
if(ndx<this._tabs.length){
this._tabs.splice(ndx,0,_f4);
}else{
this._tabs.push(_f4);
}
var _f6=this._tabList.cmpTarget.childNodes;
var _f7=_2.createElement("div");
_f7.id=_f4.paneId+"_tablabel";
_f7.className="jsTabLabel";
if(_f4.closable){
_4.className.add(_f7,"jsTabClosable");
}
if(this._tabs.length==1){
this._selectedTabId=_f4.paneId;
_4.className.add(_f7,"jsTabSelected");
}
_f7.innerHTML="<span>"+_f4.title+"</span>"+"<span class=\"jsTabCloseBtn\" id=\""+_f4.paneId+"_closeHandler\"> </span>";
if(ndx==this._tabs.length-1){
this._tabList.cmpTarget.appendChild(_f7);
}else{
this._tabList.cmpTarget.insertBefore(_f7,_f6[ndx]);
}
this._pageContainer.addPage(_f4.pane);
this._pageContainer.activate(this._selectedTabId);
var _f8=_2.getElementById(_f4.paneId+"_closeHandler");
if(!_f4.closable){
_4.className.add(_f8,"jsTabCloseHidden");
}else{
_4.className.add(_f7,"jsTabClosable");
}
_4.event.attach(_f7,"onclick",_4.bindAsEventListener(this.selectTab,this,_f4.paneId));
_4.event.attach(_f8,"onclick",_4.bindAsEventListener(this.closeTab,this,_f4.paneId));
this.resize();
};
_4.TabContainer.prototype.removeTab=function(ref,_f9){
if(!this.inDOM){
_4.error.report("TabContainer must be added to DOM before removing tabs!");
return;
}
if(typeof (_f9)=="undefined"){
_f9=true;
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
var _fa=false;
if(this._selectedTabId==this._tabs[ndx].paneId){
var _fa=true;
}
this._tabList.cmpTarget.removeChild(this._tabList.cmpTarget.childNodes[ndx]);
this._pageContainer.removePage(this._tabs[ndx].pane,_f9);
this._tabs.splice(ndx,1);
if(_fa){
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
_4.TabContainer.prototype.setTitle=function(ref,_fb){
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
this._tabList.cmpTarget.childNodes[ndx].firstChild.innerHTML=_fb;
this.resize();
}
};
_4.TabContainer.prototype.setClosable=function(ref,_fc){
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
var _fd=this._tabList.cmpTarget.childNodes[ndx];
var _fe=_2.getElementById(this._tabs[ndx].paneId+"_closeHandler");
if(_fc){
_4.className.add(_fd,"jsTabClosable");
_4.className.remove(_fe,"jsTabCloseHidden");
}else{
_4.className.remove(_fd,"jsTabClosable");
_4.className.add(_fe,"jsTabCloseHidden");
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
var _ff=this._tabs.length-this._tabList._extraTabs;
if(this._tabsContextMenu.items.length!=_ff){
if(this._tabsContextMenu.items.length>_ff){
while(this._tabsContextMenu.items.length>_ff){
this._tabsContextMenu.removeItem(0);
}
}else{
for(var n=0;n<_ff-this._tabsContextMenu.items.length;n++){
var _100=this._tabList._extraTabs+n;
this._tabsContextMenu.addItem({label:this._tabs[_100].title,onclick:_4.bindAsEventListener(function(e,_101,_102){
this.selectTab(_101);
},this,_100,this._tabList._extraTabs)},0);
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
var _e5=function(opts){
var _103={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_103,opts);
var cmp=_98.get(_103);
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
var _104=_2.createElement("span");
_104.id=this.divId+"_more";
_104.className="jsTabListDropdown jsTabListDropdownHidden";
this.target.appendChild(_104);
_104.innerHTML=" ";
_4.className.add(this.cmpTarget,"jsTabListInner");
_4.event.attach(_104,"onclick",_4.bindAsEventListener(this.onDropdownClick,this));
};
_e5.prototype.onDropdownClick=function(e){
if(!e){
e=_1.event;
}
this.parent._tabsContextMenu.show(e);
_4.event.cancel(e,true);
return false;
};
_e5.prototype.showMore=function(){
if(!this._showingMore){
_4.className.remove(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=true;
}
};
_e5.prototype.hideMore=function(){
if(this._showingMore){
_4.className.add(_2.getElementById(this.divId+"_more"),"jsTabListDropdownHidden");
this._showingMore=false;
}
};
var _e6=function(opts){
var _105={canHaveChildren:true,hasInvalidator:false};
_4.mixin(_105,opts);
var cmp=_98.get(_105);
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
_e6.prototype.addPage=function(pane){
_4.className.add(pane.target,"jsTabPage");
this.addChild(pane);
};
_e6.prototype.removePage=function(pane,_106){
this.removeChild(pane);
if(_106){
pane.destroy();
}
};
_e6.prototype.activate=function(_107){
for(var n=0;n<this.components.length;n++){
this.components[n].hide();
}
for(var n=0;n<this.components.length;n++){
if(this.components[n].divId==_107){
this.components[n].show();
}
}
};
var _f5=function(opts){
var _108={title:"",paneId:null,pane:null,closable:false};
_4.mixin(_108,opts);
this.title=_108.title;
this.paneId=_108.paneId;
this.pane=_108.pane;
this.closable=_108.closable;
};
var _109=function(opts){
var _10a={Name:null,Type:"alpha",show:true,Width:80,Format:null,displayName:null,sqlName:null,showToolTip:false,Comparator:null};
_4.mixin(_10a,opts);
if(!_10a.Name){
_4.error.report("DataColumn, invalid column data provided to constructor");
return;
}
this.Name=_10a.Name;
this.Type=(typeof (_10b[_10a.Type])!="undefined")?_10a.Type:"alpha";
this.show=_10a.show;
this.Width=isNaN(Number(_10a.Width))?80:Number(_10a.Width);
this.Format=_10a.Format;
this.displayName=_10a.displayName?_10a.displayName:_10a.Name;
this.sqlName=_10a.sqlName?_10a.sqlName:_10a.Name;
this.showToolTip=_10a.showToolTip;
this.Compare=_10a.Compare;
};
var _10c=function(_10d,_10e){
_10e=_10e?_10e:{};
for(var n=0;n<_10d.length;n++){
var name=_10d[n].Name;
var type=_10d[n].Type;
this[name]=_10e[name]?_10b[type](_10e[name]):_10b[type]();
}
for(var prop in _10e){
if(this[prop]===_3){
this[prop]=_10e[prop];
}
}
};
var _10b={"num":Number,"number":Number,"alpha":String,"string":String,"date":function(str){
if(!str){
return "";
}
if(str instanceof Date){
return str;
}
var ret=new Date();
if(typeof (str)=="string"){
var _10f=str.split(" ");
if(_10f[0]=="0000-00-00"){
return "";
}else{
var _110=_10f[0].split("-");
ret=new Date(_110[0],_110[1]-1,_110[2]);
if(_10f[1]){
var _111=_10f[1].split(":");
ret=new Date(_110[0],_110[1]-1,_110[2],_111[0],_111[1],_111[2]);
}
}
}
return ret;
}};
_4.DataView=function(opts){
var _112={canHaveChildren:true,hasInvalidator:true,multiselect:true,paginating:false,rowsPerPage:20,columns:[]};
_4.mixin(_112,opts);
var cmp=_98.get(_112);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.DataView";
this.rows=[];
this.columns=[];
this.selectedRow=-1;
this.selectedRows=[];
this.multiselect=_112.multiselect;
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
this.paginating=_112.paginating;
this.rowsPerPage=_112.rowsPerPage;
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
for(var n=0;n<_112.columns.length;n++){
this.addColumn(this.createColumn(_112.columns[n]));
}
this.optionsMenu=new _4.ContextMenu();
this.optionsMenu.addItem({label:this.lang.refresh,onclick:_4.bindAsEventListener(function(e){
this.refresh();
},this)});
this.optionsMenu.addItem({label:"sep"});
this.resizeImplementation=function(){
this._checkCache();
if(this._cached){
var _113=this.__getInnerBox();
var _114=this.__getOuterBox();
var _115=_113.top+_113.bottom+_114.top+_114.bottom;
if(this._cached.pagination_header){
var _114=_4.element.getOuterBox(this._cached.pagination_header);
_115+=this._cached.pagination_header.offsetHeight+_114.top+_114.bottom;
}
if(this._cached.header){
var _114=_4.element.getOuterBox(this._cached.header);
_115+=this._cached.header.offsetHeight+_114.top+_114.bottom;
}
if(this._cached.footer){
var _114=_4.element.getOuterBox(this._cached.footer);
_115+=this._cached.footer.offsetHeight+_114.top+_114.bottom;
}
this._cached.outer_body.style.height=(this.height-_115)+"px";
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
var _116="";
if(this.paginating){
_116+="<div class=\"dataViewPaginationHeader dataViewToolbar\" id=\""+this.divId+"_paginationHeader\"><ul><li class=\"first\">";
_116+="<label class=\"dataViewPaginationPages\" id=\""+this.divId+"_paginationLabel\">"+this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
_116+="</label></li><li>";
_116+="<a href=\"#\" class=\"dataViewPrevBtn\" id=\""+this.divId+"_goToPagePrev\"> </a>";
_116+="<a href=\"#\" class=\"dataViewNextBtn\" id=\""+this.divId+"_goToPageNext\"> </a>";
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
_116+="<a href=\"#\"> </a></span></div>";
var _117=0;
if(this.paginating){
_117=(this.height-40);
}else{
_117=(this.height-40);
}
_116+="<div id=\""+this.divId+"_outerBody\" class=\"dataViewOuterBody\">";
_116+="<div class=\"dataViewBody"+(this.multiselect?" dataViewMultiselect":"")+"\" id=\""+this.divId+"_body\"></div>";
_116+="</div>";
_116+="<div id=\""+this.divId+"_footer\" class=\"dataViewFooter dataViewToolbar\"></div>";
this.cmpTarget.innerHTML=_116;
this._checkCache();
};
_4.DataView.prototype._checkCache=function(){
if(!this._cached&&_2.getElementById(this.divId+"_columnsHeader")){
this._cached={pagination_header:_2.getElementById(this.divId+"_paginationHeader"),header:_2.getElementById(this.divId+"_columnsHeader"),headerUl:_2.getElementById(this.divId+"_columnsUl"),outer_body:_2.getElementById(this.divId+"_outerBody"),rows_body:_2.getElementById(this.divId+"_body"),footer:_2.getElementById(this.divId+"_footer")};
}
};
_4.DataView.prototype.getTotalPages=function(){
var _118=0;
var _119=this.totalRows?this.totalRows:this.rows.length;
var n=0;
while(n<_119){
n+=this.rowsPerPage;
_118++;
}
return _118;
};
_4.DataView.prototype.getNextRowId=function(){
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
_4.DataView.prototype.createColumn=function(opts){
return new _109(opts);
};
_4.DataView.prototype.addColumn=function(_11c,ndx){
if(this.__findColumn(_11c.Name)==-1){
if(ndx===_3){
ndx=this.columns.length;
}
this.columns.splice(ndx,0,_11c);
if(this.rows.length>0){
for(var n=0;n<this.rows.length;n++){
this.rows[n][_11c.Name]=_10b[_11c.Type]();
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
_4.DataView.prototype.__findColumn=function(_11d){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_11d){
return n;
}
}
return -1;
};
_4.DataView.prototype.deleteColumn=function(_11e){
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
_4.DataView.prototype._addColumnToUI=function(_121,ndx){
var li=_2.createElement("li");
li.style.width=_121.Width+"px";
var _122="dataViewColumn";
if(!_121.show){
_122+=" dataViewColumnHidden";
}
li.className=_122;
var a=_2.createElement("a");
if(this.orderBy==_121.Name){
if(this.orderWay=="ASC"){
a.className="dataViewSortAsc";
}else{
a.className="dataViewSortDesc";
}
}
a.id=this.divId+"_columnHeader_"+ndx;
a.setAttribute("href","#");
a.innerHTML=_121.Name;
li.appendChild(a);
li2=_2.createElement("li");
li2.id=this.divId+"_sep_"+ndx;
_122="dataViewFieldSep";
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
this.optionsMenu.addItem({label:_121.Name,onclick:_4.bindAsEventListener(function(e,ndx){
this.toggleColumn(ndx);
},this,ndx),checked:_121.show},ndx+2);
if(this.rows.length){
for(var n=0;n<this.rows.length;n++){
this._addCellToUI(this.rows[n].id,_121.Name,ndx);
}
}
};
_4.DataView.prototype._removeColumnFromUI=function(ndx){
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
};
_4.DataView.prototype._addRowToUI=function(_127){
if(_127<0||_127>this.rows.length-1){
return;
}
var _128=this.rows[_127].id;
var _129=_2.createElement("ul");
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
_4.className.add(_129,"dataViewRowOdd");
}
if(this.multiselect){
var _12b=_2.createElement("li");
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
_12f=_2.getElementById(this.divId+"_row_"+this.rows[n].id);
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
_4.DataView.prototype._removeRowFromUI=function(_130){
if(_130<0||_130>this.rows.length-1){
return;
}
var _131=this.rows[_130].id;
var _132=_2.getElementById(this.divId+"_row_"+_131);
if(_132){
this._cached.rows_body.removeChild(_132);
}
this.__refreshFooter();
};
_4.DataView.prototype._addCellToUI=function(_133,_134,ndx){
var _135=_2.getElementById(this.divId+"_row_"+_133);
if(_135){
var _136=_135.getElementsByTagName("li");
var li=_2.createElement("li");
li.id=this.divId+"_cell_"+_133+"_"+ndx;
var _137="dataView"+this.columns[ndx].Type;
if(!this.columns[ndx].show){
_137+=" dataViewCellHidden";
}
if(ndx==0){
_137+=" dataViewFirstCell";
}
li.className=_137;
li.style.width=this.columns[ndx].Width+"px";
if(this.columns[ndx].showToolTip){
li.setAttribute("title",this.getById(_133)[_134]);
}
if(ndx>0&&ndx<_136.length-1){
_135.insertBefore(li,_136[ndx]);
}else{
_135.appendChild(li);
}
this.setCellValue(_133,_134,this.getById(_133)[_134]);
}
};
_4.DataView.prototype._removeCellFromUI=function(_138,ndx){
var _139=this.multiselect?1:0;
var _13a=_2.getElementById(this.divId+"_row_"+_138);
if(_13a){
var _13b=_13a.getElementsByTagName("li");
if(ndx>0&&(_139+ndx)<_13b.length){
_13a.removeChild(_13b[_139+ndx]);
}
}
};
_4.DataView.prototype.createRow=function(data){
data=data?data:{};
if(!data.id){
data.id=this.getNextRowId();
}
return new _10c(this.columns,data);
};
_4.DataView.prototype.addRow=function(_13c,ndx){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(!_13c){
_13c=this.createRow();
}else{
if(!_13c.id){
_13c.id=this.getNextRowId();
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
this.rows.splice(ndx,0,_13c);
}else{
this.rows.push(_13c);
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
_4.DataView.prototype.deleteRow=function(_13d){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
var _13e=-1;
if(typeof (_13d)=="number"){
_13e=_13d;
this.rows.splice(_13d,1);
}
if(typeof (_13d)=="object"){
for(var n=0;n<this.rows.length;n++){
if(this.rows[n]==_13d){
_13e=n;
this.rows.splice(n,1);
}
}
}
if(_13e!=-1){
this._removeRowFromUI(_13e);
}
if(this.selectedRow>this.rows.length-1){
this.selectedRow=-1;
}else{
if(this.selectedRow>=_13e){
this.selectedRow--;
}
}
if(this.multiselect){
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]>this.rows.length-1){
this.selectedRows.splice(n,1);
n--;
}else{
if(this.selectedRows[n]>=_13e){
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
_4.DataView.prototype.searchRows=function(_13f,_140){
var ret=[];
for(var n=0;n<this.rows.length;n++){
if(this.rows[n][_13f]==_140){
ret.push(this.rows[n]);
}
}
return ret;
};
_4.DataView.prototype.setCellValue=function(_141,_142,_143){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return false;
}
var _144=this.__findColumn(_142);
if(_144==-1){
return false;
}
var _145=null;
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_141){
_145=n;
break;
}
}
if(_145===null){
return false;
}
this.rows[_145][_142]=_143;
var cell=_2.getElementById(this.divId+"_cell_"+_141+"_"+_144);
if(typeof (this.columns[_144].Format)=="function"){
var _146=this.columns[_144].Format(_143);
cell.innerHTML="";
if(typeof (_146)=="string"){
cell.innerHTML=_146;
}else{
cell.appendChild(_146);
}
}else{
cell.innerHTML=_143;
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
var _147;
if(!_2.getElementById(this.divId+"_message")){
_147=_2.createElement("div");
_147.id=this.divId+"_message";
_147.className="dataViewMessageDiv";
this._cached.outer_body.appendChild(_147);
}else{
_147=_2.getElementById(this.divId+"_message");
}
_147.innerHTML=msg;
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
_4.DataView.prototype._UISelectAll=function(_148){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_4.className[(_148?"add":"remove")](rows[n],"dataViewRowSelected");
rows[n].firstChild.firstChild.checked=_148;
}
};
_4.DataView.prototype._UIUpdateSelection=function(){
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var _149=false;
if(!this.multiselect){
if(this.selectedRow==n){
_149=true;
}
}else{
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==n){
_149=true;
break;
}
}
}
if(this.multiselect){
rows[n].childNodes[0].firstChild.checked=_149;
}
_4.className[(_149?"add":"remove")](rows[n],"dataViewRowSelected");
}
};
_4.DataView.prototype.__goToPage=function(e){
if(!this.enabled){
return;
}
var page=_2.getElementById(this.divId+"_pageInput").value;
var _14a=this.getTotalPages();
if(isNaN(Number(page))){
alert("Invalid page number.");
return;
}else{
if(page<1||Number(page)>_14a){
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
var _14b=this.getTotalPages();
if(this.curPage<_14b-1){
this.curPage++;
this.selectedRow=-1;
this.selectedRows=[];
this.refresh();
}
_4.event.cancel(e);
return false;
};
_4.DataView.prototype.updateRows=function(_14c){
if(!this.inDOM){
_4.error.report("Add table to DOM before working with rows");
return;
}
if(_14c===_3){
_14c=false;
}
if(!this._oldScrollTop){
this._oldScrollTop=this._cached.outer_body.scrollTop;
}
if(_14c){
this._cached.rows_body.innerHTML="";
}
var _14d=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<_14d.length;n++){
var _14e=_14d[n].id.substr(_14d[n].id.lastIndexOf("_")+1);
if(!this.getById(_14e)){
this._cached.rows_body.removeChild(_14d[n]);
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
if(!_14c){
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
var _14f="<ul><li class=\"first\">";
if(!this.paginating){
if(this.rows.length==0){
_14f+=this.lang.noRows;
}else{
if(this.rows.length==1){
_14f+="1 "+" "+this.lang.row;
}else{
_14f+=this.rows.length+" "+this.lang.rows;
}
}
}else{
_2.getElementById(this.divId+"_paginationLabel").innerHTML=this.lang.pageStart+(this.curPage+1)+this.lang.pageMiddle+"<span id=\""+this.divId+"_totalPagesHandler\">"+(this.getTotalPages())+"</span>";
if(this.rows.length==0){
_14f+=this.lang.noRows;
}else{
var _150=(this.rowsPerPage*this.curPage);
var _151=(_150+this.rowsPerPage)>this.totalRows?this.totalRows:(_150+this.rowsPerPage);
_14f+=(_150+1)+" - "+_151+" "+this.lang.of+" "+this.totalRows+" "+this.lang.rows;
}
}
_14f+="</li></ul>";
this._cached.footer.innerHTML=_14f;
};
_4.DataView.prototype.__setOrder=function(_152){
if(!this.inDOM){
_4.error.report("Cant sort a DataView not in DOM");
return;
}
var _153=this.columns[_152].Name;
if(_152>=0&&_152<this.columns.length){
var _154=this.multiselect?2:0;
var _155=this._cached.headerUl.getElementsByTagName("li");
var _156=this.__findColumn(this.orderBy);
_4.className.remove(_155[_154+(_156*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
if(this.orderBy!=_153){
this.orderBy=_153;
this.orderWay="ASC";
}else{
if(this.orderWay=="ASC"){
this.orderWay="DESC";
}else{
this.orderWay="ASC";
}
}
_4.className.add(_155[_154+(_152*2)].firstChild,(this.orderWay=="ASC"?"dataViewSortAsc":"dataViewSortDesc"));
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
var _157=e.target||e.srcElement;
var _158=this.divId+"_selectRow_";
if(_157.nodeName.toLowerCase()=="input"&&_157.id.substr(0,_158.length)==_158){
var _159=_157.id.substr(_157.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_159){
this.__markRow(e,n);
break;
}
}
}else{
while(_157.nodeName.toLowerCase()!="ul"){
if(_157==this._cached.rows_body){
return;
}
_157=_157.parentNode;
}
var _159=_157.id.substr(_157.id.lastIndexOf("_")+1);
for(var n=0;n<this.rows.length;n++){
if(this.rows[n].id==_159){
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
var _15a=e.target||e.srcElement;
if(_15a.nodeName.toLowerCase()=="a"){
colNdx=Number(_15a.id.substr(_15a.id.lastIndexOf("_")+1));
if(!isNaN(colNdx)){
this.__setOrder(colNdx);
}
}
};
_4.DataView.prototype._onHeaderColumnMousedown=function(e){
if(!e){
e=_1.event;
}
var _15b=e.target||e.srcElement;
if(_15b.nodeName.toLowerCase()=="li"&&_15b.className=="dataViewFieldSep"){
var _15c=Number(_15b.id.substr(_15b.id.lastIndexOf("_")+1));
if(!isNaN(_15c)){
this.activateResizing(e,_15c);
}
}
};
_4.DataView.prototype.__selectRow=function(e,_15d){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
if(this.selectedRow==_15d){
e.unselecting=_15d;
}else{
if(this.multiselect){
var _15e=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_15d){
_15e=true;
break;
}
}
if(_15e){
e.unselecting=_15d;
}else{
e.selecting=_15d;
}
}else{
e.selecting=_15d;
}
}
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
if(_15d!=-1){
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
if(this.selectedRow==_15d&&!this.multiselect){
this.selectedRow=-1;
}else{
if(!this.multiselect){
this.selectedRow=_15d;
_4.className.add(rows[_15d],"dataViewRowSelected");
}else{
if(!e.ctrlKey&&!e.shiftKey){
if(this.selectedRow==_15d){
this.selectedRow=-1;
this.selectedRows=[];
}else{
this.selectedRow=_15d;
this.selectedRows=[_15d];
}
}else{
if(e.ctrlKey){
var _15e=false;
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_15d){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
_15e=true;
}
}
if(!_15e){
this.selectedRow=_15d;
this.selectedRows.push(_15d);
}
}else{
if(e.shiftKey){
if(this.selectedRows.length){
this.selectedRows.length=1;
if(this.selectedRows[0]==_15d){
this.selectedRows=[];
this.selectedRow=-1;
}else{
this.selectedRow=_15d;
for(var n=this.selectedRows[0];(_15d>this.selectedRows[0]?n<=_15d:n>=_15d);(_15d>this.selectedRows[0]?n++:n--)){
if(n!=this.selectedRows[0]){
this.selectedRows.push(n);
}
}
}
}else{
this.selectedRows.push(_15d);
this.selectedRow=_15d;
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
_4.DataView.prototype.__markRow=function(e,_15f){
if(!e){
e=_1.event;
}
e.selectedRow=this.selectedRow;
if(this.multiselect){
e.selectedRows=this.selectedRows;
}
e.selecting=_15f;
e=_4.event.fire(this,"onselect",e);
if(e.returnValue==false){
_4.event.cancel(e,true);
return false;
}
var _160=this.rows[_15f].id;
elem=_2.getElementById(this.divId+"_selectRow_"+_160);
if(elem.checked){
this.selectedRows.push(_15f);
this.selectedRow=_15f;
var row=_2.getElementById(this.divId+"_row_"+_160);
_4.className.add(row,"dataViewRowSelected");
}else{
for(var n=0;n<this.selectedRows.length;n++){
if(this.selectedRows[n]==_15f){
this.selectedRows.splice(n,1);
if(this.selectedRows.length){
this.selectedRow=this.selectedRows[this.selectedRows.length-1];
}else{
this.selectedRow=-1;
}
var row=_2.getElementById(this.divId+"_row_"+_160);
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
_4.DataView.prototype.toggleColumn=function(_161){
if(this.columns[_161].show){
this.columns[_161].show=false;
}else{
this.columns[_161].show=true;
}
var _162=this.multiselect?2:0;
var _163=this._cached.headerUl.getElementsByTagName("li");
if(_161>=0&&((_162+(_161*2)+1)<_163.length)){
_4.className[this.columns[_161].show?"remove":"add"](_163[_162+(_161*2)],"dataViewColumnHidden");
_4.className[this.columns[_161].show?"remove":"add"](_163[_162+(_161*2)+1],"dataViewColumnHidden");
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
_162=this.multiselect?1:0;
_4.className[this.columns[_161].show?"remove":"add"](rows[n].childNodes[_162+_161],"dataViewCellHidden");
}
this.optionsMenu.checkItem(_161+2,this.columns[_161].show);
};
_4.DataView.prototype.forceWidth=function(w){
};
_4.DataView.prototype.__calculateMinWidth=function(){
};
_4.DataView.prototype.__calculateTotalWidth=function(){
var _164=0;
var cols=this._cached.headerUl.getElementsByTagName("li");
for(var n=0;n<cols.length;n++){
_164+=cols[n].offsetWidth;
}
return _164;
};
_4.DataView.prototype.__sort=function(_165){
var n,_166,swap;
if(!this.orderBy){
return;
}
for(n=_165+1;n<this.rows.length;n++){
var swap=false;
var func=this.columns[this.__findColumn(this.orderBy)].Comparator;
if(this.orderWay=="ASC"){
swap=(typeof (func)=="function")?func(this.rows[_165][this.orderBy],this.rows[n][this.orderBy])>0:(this.rows[_165][this.orderBy]>this.rows[n][this.orderBy]);
}else{
swap=(typeof (func)=="function")?func(this.rows[_165][this.orderBy],this.rows[n][this.orderBy]<0):(this.rows[_165][this.orderBy]<this.rows[n][this.orderBy]);
}
if(swap){
_166=this.rows[_165];
this.rows[_165]=this.rows[n];
this.rows[n]=_166;
if(this.selectedRow==_165){
this.selectedRow=n;
}else{
if(this.selectedRow==n){
this.selectedRow=_165;
}
}
for(var a=0;a<this.selectedRows.length;a++){
if(this.selectedRows[a]==_165){
this.selectedRows[a]=n;
}else{
if(this.selectedRows[a]==n){
this.selectedRows[a]=_165;
}
}
}
}
}
if(_165<this.rows.length-2){
this.__sort(_165+1);
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
_4.DataView.prototype.__getColumnSqlName=function(_167){
for(var n=0;n<this.columns.length;n++){
if(this.columns[n].Name==_167){
return this.columns[n].sqlName;
}
}
return false;
};
_4.DataView.prototype.activateResizing=function(e,_168){
if(!e){
e=_1.event;
}
this.resColumnId=_168;
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
this.resizingFrom=this.columns[_168].Width;
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
var _169=Math.abs(this.resizingXCache-x);
var _16a=(this.resizingXCache<x)?true:false;
this.resizingXCache=x;
var _16b=this.resColumnId;
var _16c=_16b;
for(n=_16b+1;n<this.columns.length;n++){
if(this.columns[n].show){
_16c=n;
break;
}
}
var _16d=false;
var _16e=false;
if(!_16a){
if((this.columns[_16b].Width-_169)>0){
this.columns[_16b].Width-=_169;
_16d=true;
}
}else{
var _16f=this.__calculateTotalWidth();
if((_16f+_169)<this._cached.headerUl.offsetWidth){
this.columns[_16b].Width+=_169;
_16d=true;
}else{
if(_16c!=_16b){
if((this.columns[_16c].Width-_169)>0){
this.columns[_16b].Width+=_169;
this.columns[_16c].Width-=_169;
_16d=true;
_16e=true;
}
}
}
}
var _170=this._cached.headerUl;
if(_170){
var cols=_170.getElementsByTagName("li");
var _171=(this.multiselect?2:0);
var ndx=_171+(_16b*2);
cols[ndx].style.width=this.columns[_16b].Width+"px";
if(_16e){
ndx+=2;
cols[ndx].style.width=this.columns[_16c].Width+"px";
}
}
var rows=this._cached.rows_body.getElementsByTagName("ul");
for(var n=0;n<rows.length;n++){
var cols=rows[n].getElementsByTagName("li");
var _171=(this.multiselect?1:0);
var _172=this.columns[_16b].Width;
cols[_171+(_16b)].style.width=_172+"px";
if(_16e){
cols[_171+(_16b)+1].style.width=this.columns[_16c].Width+"px";
}
}
};
_4.DataView.prototype.addDataType=function(name,_173){
if(typeof (name)!="string"){
_4.error.report("Invalid data type name.");
return;
}
if(typeof (_173)!="object"){
_4.error.report("Invalid data type constructor.");
return;
}else{
if(typeof (_173.toString)!="function"){
_4.error.report("Data type constructor missing toString method.");
return;
}
}
if(!_10b[name]){
_10b[name]=_173;
}else{
_4.error.report("Tried to instantiate a data type but data type was already defined");
}
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.DataViewConnector=function(opts){
var _174={dataView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_174,opts);
if(!_174.dataView){
_4.error.report("Must provide dataView reference to dataViewConnector object.");
return;
}
if(typeof (_174.api)!="string"||_174.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_174.api;
this.dataView=_174.dataView;
this.parameters=_174.parameters;
this.type="json";
if(_174.type){
switch(_174.type.toLowerCase()){
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
if(typeof (_174.method)=="string"){
this.method=_174.method.toUpperCase()=="POST"?"POST":"GET";
}
_4.event.attach(this.dataView,"onrefresh",_4.bind(this._onRefresh,this));
this.httpRequest=new _4.httpRequest({ApiCall:this.api,method:this.method,Type:this.type,onError:_4.bind(this._onError,this),onLoad:_4.bind(this._onLoad,this)});
};
_4.DataConnectors.DataViewConnector.prototype={_onRefresh:function(e){
this.dataView.setLoading(true);
this.dataView.__refreshFooter();
var _175="orderby="+this.dataView.orderBy+"&orderway="+this.dataView.orderWay;
if(this.dataView.paginating){
_175+="&limit="+(this.dataView.rowsPerPage*this.dataView.curPage)+","+((this.dataView.rowsPerPage*this.dataView.curPage)+this.dataView.rowsPerPage);
}
if(this.parameters){
_175+="&"+this.parameters;
}
this.httpRequest.send(_175);
_4.event.cancel(e);
},_onLoad:function(data){
this.dataView.setLoading(false);
if(this.type=="xml"){
var root=data.getElementsByTagName("root").item(0);
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(root.getAttribute("success")=="1"){
var _176=Number(root.getAttribute("totalrows"));
if(!isNaN(_176)){
this.dataView.totalRows=_176;
}
var rows=root.getElementsByTagName("row");
for(var n=0;n<rows.length;n++){
var _177={};
var cols=rows[n].getElementsByTagName("column");
for(var a=0;a<cols.length;a++){
var _178=cols[a].getAttribute("name");
if(_178&&cols[a].firstChild){
var _179=this.dataView.__findColumn(_178)!=-1?this.dataView.columns[this.dataView.__findColumn(_178)].Type:"alpha";
_177[_178]=_10b[_179](cols[a].firstChild.data);
}
}
this.dataView.addRow(this.dataView.createRow(_177));
}
}else{
this.dataView.setMessage(root.getAttribute("errormessage"));
}
}else{
this.dataView.rows.length=0;
this.dataView.updateRows(true);
if(data.success){
var _176=Number(data.totalrows);
if(!isNaN(_176)){
this.dataView.totalRows=_176;
}
for(var n=0;n<data.rows.length;n++){
var _177={};
for(var _178 in data.rows[n]){
var _179=this.dataView.__findColumn(_178)!=-1?this.dataView.columns[this.dataView.__findColumn(_178)].Type:"alpha";
_177[_178]=_10b[_179](data.rows[n][_178]);
}
this.dataView.addRow(this.dataView.createRow(_177));
}
}else{
this.dataView.setMessage(data.errormessage);
}
}
},_onError:function(_17a){
this.dataView.setLoading(false);
this.dataView.setMessage("Error: Unable to load dataView object (HTTP status: "+_17a+")");
}};
_4.DataView.prototype.lang={"noRows":"No rows to show.","rows":"rows.","row":"row.","pageStart":"Page ","pageMiddle":" of ","pageEnd":" Go to page: ","pageGo":"Go","pagePrev":"<< Previous","pageNext":"Next >>","refresh":"Refresh","of":"of"};
var _17b=function(opts){
var _17c={id:null,parentId:0,parent:null,Name:""};
_4.mixin(_17c,opts);
this.treeView=_17c.treeView;
this.id=_17c.id!==null?_17c.id:this.treeView.getNextNodeId();
this.parentId=_17c.parentId;
this.Name=String(_17c.Name);
this.expanded=false;
this.childNodes=[];
this.parentNode=_17c.parent;
};
_17b.prototype={searchNode:function(id){
var n;
var srch=null;
var _17d=0;
for(n=0;n<this.childNodes.length;n++){
if(this.childNodes[n].id==id){
srch=this.childNodes[n];
break;
}
}
while(!srch&&_17d<this.childNodes.length){
srch=this.childNodes[_17d].searchNode(id);
_17d++;
}
return srch;
},updateChildrenNodes:function(){
var _17e=_2.getElementById(this.treeView.divId+"_"+this.id+"_branch");
for(var i=0;i<this.childNodes.length;i++){
var node=_2.createElement("li");
node.id=this.treeView.divId+"_"+this.childNodes[i].id;
_17e.appendChild(node);
var _17f="";
var _180=this.childNodes[i].childNodes.length;
if(_180){
_17f+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_expandable\" href=\"#\" class=\"";
_17f+=(this.childNodes[i].expanded?"treeViewCollapsableNode":"treeViewExpandableNode")+"\"></a>";
}
_17f+="<a id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode\" ";
if(!_180){
_17f+="class=\"treeViewSingleNode\" ";
}
_17f+="href=\"#\">"+this.childNodes[i].Name+"</a>";
if(_180){
_17f+="<ul id=\""+this.treeView.divId+"_"+this.childNodes[i].id+"_branch\"></ul>";
}
node.innerHTML=_17f;
if(_180){
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_expandable"),"click",_4.bind(this.treeView._expandNode,this.treeView,this.childNodes[i].id));
}
_4.event.attach(_2.getElementById(this.treeView.divId+"_"+this.childNodes[i].id+"_selectNode"),"click",_4.bind(this.treeView._selectNode,this.treeView,this.childNodes[i].id));
if(_180){
this.childNodes[i].updateChildrenNodes();
}
}
},toString:function(){
return "[Name: "+this.Name+", ParentId: "+this.parentId+", Children: "+this.childNodes.length+"]";
}};
_4.TreeView=function(opts){
var _181={canHaveChildren:false,hasInvalidator:true};
_4.mixin(_181,opts);
var cmp=_98.get(_181);
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
this.masterNode=new _17b({id:0,parentId:0,parent:null,Name:"root",treeView:this});
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
var _182=true;
while(_182){
if(this.masterNode.searchNode(this.nextNodeId)===null){
_182=false;
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
var _183;
if(!_2.getElementById(this.divId+"_message")){
_183=_2.createElement("div");
_183.id=this.divId+"_message";
_183.className="treeViewMessageDiv";
this.target.appendChild(_183);
}else{
_183=_2.getElementById(this.divId+"_message");
}
_183.innerHTML=msg;
}
};
_4.TreeView.prototype._expandNode=function(e,_184){
if(!e){
e=_1.event;
}
var node=this.searchNode(_184);
if(node.expanded){
node.expanded=false;
_2.getElementById(this.divId+"_"+_184+"_branch").style.display="none";
}else{
node.expanded=true;
_2.getElementById(this.divId+"_"+_184+"_branch").style.display="block";
}
_4.event.cancel(e);
return false;
};
_4.TreeView.prototype._selectNode=function(e,_185){
if(!e){
e=_1.event;
}
if(this.selectedNode!==null){
var _186=this.searchNode(this.selectedNode);
_4.className.remove(_2.getElementById(this.divId+"_"+_186.id+"_selectNode"),"treeViewSelectedNode");
}
if(this.selectedNode!=_185){
var _186=this.searchNode(_185);
_4.className.add(_2.getElementById(this.divId+"_"+_186.id+"_selectNode"),"treeViewSelectedNode");
}
this.selectedNode=(this.selectedNode==_185)?null:_185;
_4.event.cancel(e,true);
return false;
};
_4.TreeView.prototype.addNode=function(opts,_187,ndx){
var _188=(_187==0)?this.masterNode:this.searchNode(_187);
if(_188){
var _189={treeView:this,parentId:_187,parent:_188,Name:""};
_4.mixin(_189,opts);
if(ndx>=0&&ndx<_188.childNodes.length){
_188.childNodes.splice(ndx,0,new _17b(_189));
}else{
_188.childNodes.push(new _17b(_189));
}
if(this.inDOM){
this.updateNodes();
}
}
};
_4.TreeView.prototype.deleteNode=function(_18a){
if(_18a==0||_18a=="0"){
return;
}
this._searchAndDelete(_18a,this.masterNode);
if(this.inDOM){
this.updateNodes();
}
};
_4.TreeView.prototype._searchAndDelete=function(_18b,node){
var _18c=false;
if(typeof (_18b)=="number"||typeof (_18b)=="string"){
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n].id==_18b){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18c=true;
break;
}
}
}else{
for(var n=0;n<node.childNodes.length;n++){
if(node.childNodes[n]==_18b){
if(this.selectedNode==node.childNodes[n].id){
this.selectedNode=null;
}
node.childNodes.splice(n,1);
_18c=true;
break;
}
}
}
if(!_18c){
for(var n=0;n<node.childNodes.length;n++){
var done=this._searchAndDelete(node.childNodes[n],_18b);
if(done){
_18c=done;
break;
}
}
}
return _18c;
};
if(_4.DataConnectors===_3){
_4.DataConnectors={};
}
_4.DataConnectors.TreeViewConnector=function(opts){
var _18d={treeView:null,api:null,method:"POST",type:"json",parameters:""};
_4.mixin(_18d,opts);
if(!_18d.treeView){
_4.error.report("Must provide treeView reference to treeViewConnector object.");
return;
}
if(typeof (_18d.api)!="string"||_18d.api==""){
_4.error.report("Invalid Api string.");
return;
}
this.api=_18d.api;
this.treeView=_18d.treeView;
this.parameters=_18d.parameters;
this.type="json";
if(_18d.type){
switch(_18d.type.toLowerCase()){
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
if(typeof (_18d.method)=="string"){
this.method=_18d.method.toUpperCase()=="POST"?"POST":"GET";
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
this.treeView.masterNode=new _17b({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
this.treeView.nextNodeId=1;
this.treeView.updateNodes();
if(root.getAttribute("success")=="1"){
var _18e=this._fetchNodes(root);
if(_18e.length){
this._addNodesFromXml(_18e,0);
}
}else{
this.treeView.setMessage(root.getAttribute("errormessage"));
}
}else{
delete this.treeView.masterNode;
this.treeView.masterNode=new _17b({id:0,parentId:0,parent:null,Name:"root",treeView:this.treeView});
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
},_addNodesFromXml:function(_18f,_190){
for(var n=0;n<_18f.length;n++){
var id=null;
if(_18f[n].getAttribute("id")){
id=_18f[n].getAttribute("id");
}
var _191=_18f[n].getElementsByTagName("label")[0];
if(_191){
labelStr=_191.firstChild.data;
}
var _192=_18f[n].getElementsByTagName("node");
this.treeView.addNode({Name:labelStr,id:id},_190);
if(_192){
this._addNodesFromXml(this._fetchNodes(_18f[n]),id);
}
}
},_addNodesFromJson:function(_193,_194){
for(var n=0;n<_193.length;n++){
this.treeView.addNode({Name:_193[n].label,id:_193[n].id},_194);
if(_193[n].nodes){
this._addNodesFromJson(_193[n].nodes,_193[n].id);
}
}
},_onError:function(_195){
this.treeView.setLoading(false);
this.treeView.setMessage("Error: Unable to load treeView object (HTTP status: "+_195+")");
}};
_4.CalendarView=function(opts){
var _196=new Date();
var _197={canHaveChildren:true,hasInvalidator:true,multiselect:false,month:_196.getMonth(),year:_196.getFullYear(),disabledBefore:null,disabledAfter:null,disabledDays:[false,false,false,false,false,false,false],disabledDates:[]};
_4.mixin(_197,opts);
var cmp=_98.get(_197);
for(var prop in cmp){
this[prop]=cmp[prop];
}
this.CMP_SIGNATURE="Scriptor.ui.CalendarView";
this.selectedDates=[];
this.multiSelect=_197.multiselect;
this.advanced=false;
this.curMonth=(!isNaN(Number(_197.month))&&_197.month>=0&&_197.month<12)?_197.month:_196.getMonth();
this.curYear=(!isNaN(Number(_197.year))&&_197.year>0)?_197.year:new _196.getFullYear();
this.disabledBefore=_197.disabledBefore;
this.disabledAfter=_197.disabledAfter;
this.disabledDays=_197.disabledDays;
this.disabledDates=_197.disabledDates;
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
var _198="<div class=\"calendarViewHeader\" id=\""+this.divId+"_header\"></div>";
_198+="<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"calendarViewBody\" id=\""+this.divId+"_body\"></table>";
_198+="<div class=\"calendarViewAdvanced\" style=\"display: none;\" id=\""+this.divId+"_advanced\">";
var _199=new Date();
if(this.selectedDates.length){
_199=this.selectedDates[0];
}
_198+="<p><label for=\""+this.divId+"DaySelector\">"+this.lang.day+"</label>";
_198+="<input type=\"text\" id=\""+this.divId+"DaySelector\" value=\""+_199.getDate()+"\" /></p>";
_198+="<p><label for=\""+this.divId+"MonthSelector\">"+this.lang.month+"</label>";
_198+="<select id=\""+this.divId+"MonthSelector\">";
for(var n=0;n<12;n++){
_198+="<option value=\""+n+"\""+(_199.getMonth()==n?" selected=\"selected\"":"")+">"+this.lang.longMonths[n]+"</option>";
}
_198+="</select></p>";
_198+="<p><label for=\""+this.divId+"YearSelector\">"+this.lang.year+"</label>";
_198+="<input type=\"text\" id=\""+this.divId+"YearSelector\" value=\""+_199.getFullYear()+"\" /></p>";
_198+="<p><a class=\"calendarAccept\" id=\""+this.divId+"_advancedAccept\">"+this.lang.accept+"</a>";
_198+="<a class=\"calendarCancel\" id=\""+this.divId+"_advancedCancel\">"+this.lang.cancel+"</a></p>";
_198+="</div>";
_198+="<div class=\"calendarViewFooter\" id=\""+this.divId+"_footer\"></div>";
this.cmpTarget.innerHTML=_198;
};
_4.CalendarView.prototype.updateDates=function(){
if(!this.inDOM){
_4.error.report("Can't update data on non visible calendarView object.");
return;
}
var _19a=_2.getElementById(this.divId+"_body");
_19a.style.display="";
_2.getElementById(this.divId+"_advanced").style.display="none";
this.advanced=false;
_19a.innerHTML="";
var _19b=_2.createElement("thead");
var _19c,_19d,_19e,tmpA;
var _19c=_2.createElement("tr");
for(var n=0;n<7;n++){
_19d=_2.createElement("th");
_19d.appendChild(_2.createTextNode(this.lang.shortDays[n]));
_19c.appendChild(_19d);
}
_19b.appendChild(_19c);
_19a.appendChild(_19b);
var _19f=new Date();
var _1a0=new Date(this.curYear,this.curMonth,1,0,0,0,0);
var _1a1=new Date(_1a0.getTime());
_1a1.setMonth(_1a1.getMonth()+1);
var _1a2=_1a0.getDay();
var _1a3=0;
var _1a4=_2.createElement("tbody");
var _19c=_2.createElement("tr");
while(_1a3<_1a2){
_19e=_2.createElement("td");
_19e.appendChild(_2.createTextNode(" "));
_19c.appendChild(_19e);
_1a3++;
}
while(_1a0<_1a1){
_19e=_2.createElement("td");
_19e.setAttribute("align","left");
_19e.setAttribute("valign","top");
tmpA=_2.createElement("a");
tmpA.setAttribute("href","#");
tmpA.appendChild(_2.createTextNode(_1a0.getDate()));
var _1a5=false;
if(this.isEqual(_1a0,_19f)){
_1a5=true;
}
var _1a6=false;
if(this.isDisabledDate(_1a0)){
_1a6=true;
if(_1a5){
tmpA.className="calendarDisabled calendarToday";
}else{
tmpA.className="calendarDisabled";
}
}
for(var n=0;n<this.markedDates.length;n++){
if(this.isEqual(_1a0,this.markedDates[n])){
_1a6=true;
if(_1a5){
tmpA.className="calendarMarked calendarToday";
}else{
tmpA.className="calendarMarked";
}
}
}
for(var n=0;n<this.selectedDates.length;n++){
if(this.isEqual(_1a0,this.selectedDates[n])){
_1a6=true;
if(_1a5){
tmpA.className="calendarSelected calendarToday";
}else{
tmpA.className="calendarSelected";
}
}
}
if(!_1a6&&_1a5){
tmpA.className="calendarToday";
}
_19e.appendChild(tmpA);
_19c.appendChild(_19e);
_4.event.attach(tmpA,"onclick",_4.bind(this.selectDate,this,_1a0.getDate()));
_1a0.setDate(_1a0.getDate()+1);
_1a3++;
if(_1a3>6){
_1a4.appendChild(_19c);
_19c=_2.createElement("tr");
_1a3=0;
}
}
if(_1a3>0){
_1a4.appendChild(_19c);
while(_1a3<7){
_19e=_2.createElement("td");
_19e.appendChild(_2.createTextNode(" "));
_19c.appendChild(_19e);
_1a3++;
}
}
_19a.appendChild(_1a4);
this.__refreshHeader();
this.__refreshFooter();
};
_4.CalendarView.prototype.__refreshHeader=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a7=_2.getElementById(this.divId+"_header");
_1a7.innerHTML="";
var _1a8="<ul><li class=\"calendarViewLeft\"><a class=\"calendarViewPrev\" title=\""+this.lang.prevMonth+"\" id=\""+this.divId+"_prevMonth\" href=\"#\"> </a></li>";
_1a8+="<li class=\"calendarViewLeft\"><a class=\"calendarAdvanced\" title=\""+this.lang.advanced+"\" id=\""+this.divId+"_viewAdvanced\" href=\"#\"> </a></li>";
_1a8+="<li class=\"calendarViewRight\"><a class=\"calendarViewNext\" title=\""+this.lang.nextMonth+"\" id=\""+this.divId+"_nextMonth\" href=\"#\"> </a></li>";
_1a8+="<li><p class=\"calendarViewMonth\">"+this.lang.longMonths[this.curMonth]+" "+this.curYear+"</p></li>";
_1a8+="</ul>";
_1a7.innerHTML=_1a8;
_4.event.attach(_2.getElementById(this.divId+"_prevMonth"),"onclick",_4.bind(this.goPrevMonth,this));
_4.event.attach(_2.getElementById(this.divId+"_viewAdvanced"),"onclick",_4.bind(this.setAdvanced,this));
_4.event.attach(_2.getElementById(this.divId+"_nextMonth"),"onclick",_4.bind(this.goNextMonth,this));
};
_4.CalendarView.prototype.__refreshFooter=function(){
if(!this.inDOM){
_4.error.report("Can't update calendar on non visible calendarView object.");
return;
}
var _1a9=_2.getElementById(this.divId+"_footer");
_1a9.innerHTML="";
var _1aa="<p><a class=\"calendarGoHome\" title=\""+this.lang.homeDate+"\" href=\"#\" id=\""+this.divId+"_goHome\"> </a>";
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
_4.event.attach(_2.getElementById(this.divId+"_goHome"),"onclick",_4.bind(this.goHomeDate,this));
};
_4.CalendarView.prototype.setAdvanced=function(e){
if(!e){
e=_1.event;
}
_2.getElementById(this.divId+"_body").style.display="none";
_2.getElementById(this.divId+"_advanced").style.display="block";
var _1ab=new Date();
if(this.selectedDates.length){
_1ab=this.selectedDates[0];
}
_2.getElementById(this.divId+"DaySelector").value=_1ab.getDate();
_2.getElementById(this.divId+"MonthSelector").selectedIndex=_1ab.getMonth();
_2.getElementById(this.divId+"YearSelector").value=_1ab.getFullYear();
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
var _1ac=_2.getElementById(this.divId+"DaySelector").value;
var _1ad=_2.getElementById(this.divId+"MonthSelector").value;
var _1ae=_2.getElementById(this.divId+"YearSelector").value;
if(isNaN(Number(_1ac))){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(isNaN(Number(_1ae))){
alert(this.lang.error2);
_4.event.cancel(e,true);
return false;
}
var _1af=new Date(_1ae,_1ad,_1ac);
if(_1af.getMonth()!=_1ad){
alert(this.lang.error1);
_4.event.cancel(e,true);
return false;
}
if(this.isDisabledDate(_1af)){
alert(this.lang.error3);
_4.event.cancel(e,true);
return false;
}
var _1b0={selecting:_1af,selectedDates:this.selectedDates};
_1b0=_4.event.fire(this,"onselect",_1b0);
if(_1b0.returnValue==false){
_4.event.cancel(e,true);
return false;
}
this.selectedDates.length=0;
this.selectedDates[0]=_1af;
this.goHomeDate(e);
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.selectDate=function(e,date){
if(!e){
e=_1.event;
}
var _1b1=new Date(this.curYear,this.curMonth,date);
var _1b2={selecting:_1b1,selectedDates:this.selectedDates};
_1b2=_4.event.fire(this,"onselect",_1b2);
if(_1b2.returnValue==false){
_4.event.cancel(e,true);
return false;
}
if(!this.isDisabledDate(_1b1)){
if(!this.multiSelect){
this.selectedDates.length=0;
this.selectedDates[0]=_1b1;
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
_4.CalendarView.prototype.isEqual=function(_1b3,_1b4){
if(_1b3.getFullYear()==_1b4.getFullYear()&&_1b3.getMonth()==_1b4.getMonth()&&_1b3.getDate()==_1b4.getDate()){
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
var _1b5;
if(this.selectedDates.length){
_1b5=this.selectedDates[0];
}else{
_1b5=new Date();
}
this.curMonth=_1b5.getMonth();
this.curYear=_1b5.getFullYear();
this.updateDates();
_4.event.cancel(e,true);
return false;
};
_4.CalendarView.prototype.hook=function(_1b6){
var elem=null;
if(typeof (_1b6)=="string"){
elem=_2.getElementById(_1b6);
}else{
if(_4.isHTMLElement(_1b6)){
elem=_1b6;
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
var _1b7=this.hookedTo;
if(this.lang.isFrenchDateFormat){
_1b7.value=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}else{
_1b7.value=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
this.Hide();
if(this._hideHookedBind){
_4.event.detach(_2,"onclick",this._hideHookedBind);
}
};
_4.CalendarView.prototype.getDateFromStr=function(str){
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
_4.CalendarView.prototype.lang={shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","Agoust","September","October","November","December"],noSelection:"No date selected",oneSelection:"Date: ",multipleSelection:"Dates: ",prevMonth:"Previous Month",nextMonth:"Next Month",advanced:"Select month and year",homeDate:"Go to selection date or today",day:"Day:",month:"Month:",year:"Year:",accept:"Accept",cancel:"Cancel",error1:"The date field entered is invalid.",error2:"The year field entered is invalid.",error3:"The selected date is not available.",isFrenchDateFormat:false};
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
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_1b9=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_1ba,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1bb(_1bc){
_1b9.lastIndex=0;
return _1b9.test(_1bc)?"\""+_1bc.replace(_1b9,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_1bc+"\"";
};
function str(key,_1bd){
var i,k,v,_1be,mind=gap,_1bf,_1c0=_1bd[key];
if(_1c0&&typeof _1c0==="object"&&typeof _1c0.toJSON==="function"){
_1c0=_1c0.toJSON(key);
}
if(typeof rep==="function"){
_1c0=rep.call(_1bd,key,_1c0);
}
switch(typeof _1c0){
case "string":
return _1bb(_1c0);
case "number":
return isFinite(_1c0)?String(_1c0):"null";
case "boolean":
case "null":
return String(_1c0);
case "object":
if(!_1c0){
return "null";
}
gap+=_1ba;
_1bf=[];
if(Object.prototype.toString.apply(_1c0)==="[object Array]"){
_1be=_1c0.length;
for(i=0;i<_1be;i+=1){
_1bf[i]=str(i,_1c0)||"null";
}
v=_1bf.length===0?"[]":gap?"[\n"+gap+_1bf.join(",\n"+gap)+"\n"+mind+"]":"["+_1bf.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_1be=rep.length;
for(i=0;i<_1be;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_1c0);
if(v){
_1bf.push(_1bb(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _1c0){
if(Object.hasOwnProperty.call(_1c0,k)){
v=str(k,_1c0);
if(v){
_1bf.push(_1bb(k)+(gap?": ":":")+v);
}
}
}
}
v=_1bf.length===0?"{}":gap?"{\n"+gap+_1bf.join(",\n"+gap)+"\n"+mind+"}":"{"+_1bf.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_1c1,_1c2,_1c3){
var i;
gap="";
_1ba="";
if(typeof _1c3==="number"){
for(i=0;i<_1c3;i+=1){
_1ba+=" ";
}
}else{
if(typeof _1c3==="string"){
_1ba=_1c3;
}
}
rep=_1c2;
if(_1c2&&typeof _1c2!=="function"&&(typeof _1c2!=="object"||typeof _1c2.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_1c1});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_1c4){
var j;
function walk(_1c5,key){
var k,v,_1c6=_1c5[key];
if(_1c6&&typeof _1c6==="object"){
for(k in _1c6){
if(Object.hasOwnProperty.call(_1c6,k)){
v=walk(_1c6,k);
if(v!==undefined){
_1c6[k]=v;
}else{
delete _1c6[k];
}
}
}
}
return _1c4.call(_1c5,key,_1c6);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _1c4==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
}());

