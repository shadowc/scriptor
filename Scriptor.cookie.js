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
_3.cookie={cookies:{},init:function(){
var ca=_1.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
var _f=c.substring(0,c.indexOf("="));
this.cookies[_f]=c.substring(_f.length+1,c.length);
}
},get:function(_10){
return this.cookies[_10]?this.cookies[_10]:"";
},create:function(_11,_12,_13){
if(_13){
var _14=new Date();
_14.setTime(_14.getTime()+(_13*24*60*60*1000));
var _15="; expires="+_14.toGMTString();
}else{
var _15="";
}
_1.cookie=_11+"="+_12+_15+"; path=/";
this.cookies[_11]=_12;
},erase:function(_16){
this.create(_16,"",-1);
delete this.cookies[_16];
}};
_3.cookie.init();
return _3;
})(document);
if(!window.Scriptor){
window.Scriptor={};
}
Scriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

