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
_3.cookie={cookies:{},init:function(){
var ca=_1.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _16=c.substring(0,c.indexOf("="));
this.cookies[_16]=c.substring(_16.length+1,c.length);
}
},get:function(_17){
return this.cookies[_17]?this.cookies[_17]:"";
},create:function(_18,_19,_1a){
if(_1a){
var _1b=new Date();
_1b.setTime(_1b.getTime()+(_1a*24*60*60*1000));
var _1c="; expires="+_1b.toGMTString();
}else{
var _1c="";
}
_1.cookie=_18+"="+_19+_1c+"; path=/";
this.cookies[_18]=_19;
},erase:function(_1d){
this.create(_1d,"",-1);
delete this.cookies[_1d];
}};
_3.cookie.init();
return _3;
})(document);
if(!window.Scriptor){
window.Scriptor={};
}
__tmpScriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

