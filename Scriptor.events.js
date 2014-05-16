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
_3.event={init:function(obj){
obj._customEventStacks={};
},registerCustomEvent:function(obj,_16,_17){
_17=_17||obj;
if(obj._customEventStacks){
obj._customEventStacks[_16]={context:_17,stack:[]};
}
},attach:function(_18,evt,_19,_1a){
if(_3.isHtmlElement(_18)||_18===_1||_18===window){
if(_1a){
_19=_3.bindAsEventListener(_19,_1a);
}
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(_18.addEventListener){
if(_1a){
_18.addEventListener(evt,_19,false);
}else{
_18.addEventListener(evt,_19,false);
}
}else{
if(_18.attachEvent){
_18.attachEvent("on"+evt,_19);
}
}
}else{
if(_18._customEventStacks){
if(_18._customEventStacks[evt]){
_3.event.detach(_18,evt,_19);
_18._customEventStacks[evt].stack.push({callback:_19,context:_1a});
}
}
}
return [_18,evt,_19];
},detach:function(){
var _1b,evt,_1c;
if(typeof (arguments[0])=="object"&&arguments[0].length){
htmlElement=arguments[0][0];
evt=arguments[0][1];
_1c=arguments[0][2];
}else{
htmlElement=arguments[0];
evt=arguments[1];
_1c=arguments[2];
}
if(_3.isHtmlElement(htmlElement)||htmlElement===_1||htmlElement===window){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(htmlElement.removeEventListener){
htmlElement.removeEventListener(evt,_1c,false);
}else{
if(htmlElement.detachEvent){
htmlElement.detachEvent("on"+evt,_1c);
}
}
}else{
if(htmlElement._customEventStacks){
if(htmlElement._customEventStacks[evt]){
for(var n=0;n<htmlElement._customEventStacks[evt].stack.length;n++){
if(htmlElement._customEventStacks[evt].stack[n].callback==_1c){
htmlElement._customEventStacks[evt].stack.splice(n,1);
break;
}
}
}
}
}
},fire:function(obj,evt,_1d){
_1d=typeof (_1d)=="object"?_1d:{};
_1d.customEventName=evt;
if(_1d.returnValue===_2){
_1d.returnValue=true;
}
if(!obj._customEventStacks||!obj._customEventStacks[evt]||!obj._customEventStacks[evt].stack.length){
return _1d;
}
var _1e=[_1d];
for(var n=0;n<obj._customEventStacks[evt].stack.length;n++){
var _1f=obj._customEventStacks[evt].stack[n].context||obj._customEventStacks[evt].context;
obj._customEventStacks[evt].stack[n].callback.apply(_1f,_1e);
}
return _1d;
},cancel:function(e,_20){
if(!e){
return;
}
if(typeof (_20)=="undefined"){
_20=true;
}
if(typeof (e.preventDefault)=="function"){
e.preventDefault();
}
e.returnValue=false;
if(_20){
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
return _3;
})(document);
if(!window.Scriptor){
window.Scriptor={};
}
__tmpScriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

