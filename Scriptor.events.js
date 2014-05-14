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
_3.event={init:function(_f){
_f._customEventStacks={};
},registerCustomEvent:function(obj,_10,_11){
_11=_11||obj;
if(obj._customEventStacks){
obj._customEventStacks[_10]={context:_11,stack:[]};
}
},attach:function(_12,evt,_13,_14){
if(_3.isHtmlElement(_12)||_12===_1||_12===window){
if(_14){
_13=_3.bindAsEventListener(_13,_14);
}
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(_12.addEventListener){
if(_14){
_12.addEventListener(evt,_13,false);
}else{
_12.addEventListener(evt,_13,false);
}
}else{
if(_12.attachEvent){
_12.attachEvent("on"+evt,_13);
}
}
}else{
if(_12._customEventStacks){
if(_12._customEventStacks[evt]){
_3.event.detach(_12,evt,_13);
_12._customEventStacks[evt].stack.push({callback:_13,context:_14});
}
}
}
return [_12,evt,_13];
},detach:function(){
var _15,evt,_16;
if(typeof (arguments[0])=="object"&&arguments[0].length){
htmlElement=arguments[0][0];
evt=arguments[0][1];
_16=arguments[0][2];
}else{
htmlElement=arguments[0];
evt=arguments[1];
_16=arguments[2];
}
if(_3.isHtmlElement(htmlElement)||htmlElement===_1||htmlElement===window){
if(evt.substr(0,2)=="on"){
evt=evt.substr(2);
}
if(htmlElement.removeEventListener){
htmlElement.removeEventListener(evt,_16,false);
}else{
if(htmlElement.detachEvent){
htmlElement.detachEvent("on"+evt,_16);
}
}
}else{
if(htmlElement._customEventStacks){
if(htmlElement._customEventStacks[evt]){
for(var n=0;n<htmlElement._customEventStacks[evt].stack.length;n++){
if(htmlElement._customEventStacks[evt].stack[n].callback==_16){
htmlElement._customEventStacks[evt].stack.splice(n,1);
break;
}
}
}
}
}
},fire:function(obj,evt,_17){
_17=typeof (_17)=="object"?_17:{};
_17.customEventName=evt;
if(_17.returnValue===_2){
_17.returnValue=true;
}
if(!obj._customEventStacks||!obj._customEventStacks[evt]||!obj._customEventStacks[evt].stack.length){
return _17;
}
var _18=[_17];
for(var n=0;n<obj._customEventStacks[evt].stack.length;n++){
var _19=obj._customEventStacks[evt].stack[n].context||obj._customEventStacks[evt].context;
obj._customEventStacks[evt].stack[n].callback.apply(_19,_18);
}
return _17;
},cancel:function(e,_1a){
if(!e){
return;
}
if(typeof (_1a)=="undefined"){
_1a=true;
}
if(typeof (e.preventDefault)=="function"){
e.preventDefault();
}
e.returnValue=false;
if(_1a){
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
Scriptor.mixin(window.Scriptor,window.__tmpScriptor);
delete window.__tmpScriptor;

