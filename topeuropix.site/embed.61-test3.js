function ignoreerror(){return true;}window.onerror=ignoreerror();

document.oncontextmenu = function(){return false;};  
document.onselectstart=function(){return false;};
document.onkeydown=function(e){e=e||window.event;if (e.ctrlKey) {if ((e.keyCode=='85') || (e.keyCode=='67') || (e.keyCode=='65') || (e.keyCode=='45')) return false;}};document.onkeypress=function(e){e=e||window.event;if (e.ctrlKey) {if ((e.keyCode=='85') || (e.keyCode=='67') || (e.keyCode=='65') || (e.keyCode=='45')) return false;}};
window.rInterval=function(a,b){var c=Date.now,d=window.requestAnimationFrame,e=c(),f,g=function(){c()-e<b||(e+=b,a());f||d(g)};d(g);return{clear:function(){f=1}}};
window.rtimeOut=function(a,b){var c=Date.now,d=window.requestAnimationFrame,e=c(),f,g=function(){c()-e<b?f||d(g):a()};d(g);return{clear:function(){f=1}}};


$(document).keydown(function(event){
    if(event.keyCode==123){
        return false;
    }
    else if (event.ctrlKey && event.shiftKey && event.keyCode==73){        
             return false;
    }
});
/*
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        open.call(this, method, url, async, user, pass);
		this.setRequestHeader("Accept", "")
    };
})(XMLHttpRequest.prototype.open);
*/
function loadIss() {
    //window.history.replaceState(null, null, '/');
    document.location.hash = 'iss=' + iss;
}
function isM() {
    var match = window.matchMedia || window.msMatchMedia;
    if(match) {
        var mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
}
function onProgress(e){
            var media =  document.getElementById('olvideo_html5_api');
            durationvideo = media.duration;
			//get the buffered ranges data
			var ranges = [];
			for(var i = 0; i < media.buffered.length; i ++)
			{
				ranges.push([
					media.buffered.start(i),
					media.buffered.end(i)
					]);
			}
			if(ranges.length > 0){
			    
			    //console.debug(ranges);
			    for (var i = 0; i < ranges.length; i++) {
                     rangesvideo.push(ranges[i])
                }
			}
			    
}
function sendtrafficusage(){
    
    if(p2pdownloadedtotal > 0  && sendedtraffic <= videosize){
        if(p2pdownloadedtotal === 0){
            var trange = rangesvideo;
    	    trange=trange.sort(function(a,b){return a[0]-b[0]});
    		trange = merge_intervals(trange);
    		console.log('rangesvideo:');
    		console.debug(rangesvideo);
    		console.log('trange:');
    		console.debug(trange);
    
            var total = 0;
            for (var i = 0; i < trange.length; i++) {
                total = total + trange[i][1]-trange[i][0];
            }
                
                //buffered = total;
            bufferedproc = total/durationvideo*100;
            bufferedbytes = videosize/100*bufferedproc;
            if(bufferedproc > loadedpercent)
                loadedpercent = bufferedproc;
            if(bufferedbytes > loadedbytes)
                loadedbytes = bufferedbytes;
            console.log('loadedpercent: '+loadedpercent);
            console.log('loadedbytes: '+loadedbytes);
        }else{
            console.log('use stats from p2p');
            loadedbytes = p2pdownloadedtotal*1024*1024;
        }
    
        if(loadedbytes > sendedtraffic){
            var diff = loadedbytes - sendedtraffic;
            sendedtraffic = loadedbytes;
            diff = Number(diff/1024/1024).toFixed(2);
            if(diff >= 1 && diff < videosize/1024/1024){
                fistsend = 0;
                var prem = 0;
                if(adtype < 4){
                }else{
                    prem = 1;
                }
                $.post("/ajax.php", { v:2, mode:'insert_traffic_usage', userid: userid, traffic: diff, premium_traffic: prem, vid:videoid, referer:encodeURIComponent(server_referer)});
            }
        }
    }
}

function checkIOSVersion () {
    var agent = window.navigator.userAgent,
    start = agent.indexOf( 'OS ' );
    if( ( agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
        return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
    }
    return 12;
}

function supportWC () {
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    var canvas = document.createElement("canvas");
    // Get WebGLRenderingContext from canvas element.
    var gl = canvas.getContext("webgl"); //|| canvas.getContext("experimental-webgl")
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
  }
  
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

    function generateRnd(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
	function escapeHTML(text) {
		return text.replace(/[\"&<>]/g, function(a) {
			return {
				'"': '&quot;',
				"'": '&#39;',
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;'
			}[a];
		});
	}
	function getJsonFromUrl() {
		var query = location.search.substr(1) + location.hash;
		//console.log(query);
		var result = {};
		query.split(/&|#/).forEach(function(part) {
			var item = part.split("=");
			if (item.length < 2) return;
			result[item[0]] = decodeURIComponent(item[1]);
			//console.debug(result);
		});
		return result;
	}

function self_top(){
    console.log('selftop');
	    window.rtimeOut(function() {
	        document.body.style.background ='';
	        var elements = document.getElementsByClassName("grecaptcha-badge");
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }, 1000);
        document.title = 'Not Found';
        document.body.classList.remove("loader");
	    //document.body.innerHTML='<pre style="word-wrap: break-word; white-space: pre-wrap">We cant give you what you looking for.</pre>';
	    document.body.innerHTML='<h1 style="margin-top: 0px;">Not Found</h1><p>The requested URL was not found on this server.</p><p>Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.</p><hr><address>Apache Server Port 80</address>';
	    throw new Error(" We cant give you what you looking for. ");
		    //self.location.replace("/404.html");
}

        var wpop = Number((window.screen.width/2));
        var hpop = wpop/1.7;
        console.log("window.screen.width: "+wpop);
        var leftpop = Number((screen.width/2)-(wpop/2));
        var toppop = Number((screen.height/2)-(hpop/2));
        
function openpopplayer(vidid){
    if((((typeof BetterJsPop !== 'undefined' && typeof BetterJsPop.checkStack == 'undefined') || device.android() || isMobileDevice() || device.cros() || device.mobile() || device.tablet()) && is_touch_device()) || (device.tv() || device.ps() || device.xbox()) || isIE11 || (typeof $.cookie('userid') !== 'undefined')){
        return false;
    }    
    //}else{
    var mapForm = document.createElement("form");
    var vidk  = generateRnd();
    mapForm.target = "hqqplayer";
    mapForm.method = "POST"; // or "post" if appropriate
    var oi=1;
    var subsm = '&';
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "v";
    mapInput.value = vidid;
    var mapInput2 = document.createElement("input");
    mapInput2.type = "hidden";
    mapInput2.name = "pop";
    mapInput2.value = "1";
    var mapInput3 = document.createElement("input");
    mapInput3.type = "hidden";
    mapInput3.name = "secure";
    mapInput3.value = secure;
    if ($(window).attr('name').indexOf('subs:') === 0) {
		    var strArray = $(window).attr('name').split("subs:");
		    
            for(var i = 1; i < strArray.length; i++){
            strArray[i] = strArray[i].replace(';','');
            
            subsm = subsm+'c'+oi+'_file='+encodeURIComponent(strArray[i])+'&c'+oi+'_label='+i+'_embeded&';
            oi++;
            }
		}
		
	var querystring = getJsonFromUrl();
	console.debug(querystring);
		for (var u = 1;; ++u) {
			var f = querystring['c' + u + '_file'];
			var l = querystring['c' + u + '_label'];
			if (!f || !l) break;
			subsm = subsm+'c'+oi+'_file='+encodeURIComponent(f)+'&c'+oi+'_label='+escapeHTML(l)+'&';
			oi++;
		}
	var urltogo = "/player/embed_player.php?dl="+vidk+subsm;
    mapForm.action = urltogo;	//v="+vidid+"&	
    mapForm.appendChild(mapInput3);
    mapForm.appendChild(mapInput2);
    mapForm.appendChild(mapInput);

    document.body.appendChild(mapForm);

    map = window.open(urltogo, "hqqplayer", "resizable=yes,scrollbars=no,toolbar=yes,menubar=no,location=no,directories=no, status=yes, width="+wpop+", height="+hpop+", top="+toppop+", left="+leftpop);

    if (map) {
        mapForm.submit();
        map.focus();
        return true;
    } else {
        //alert('Disable ADBlock to watch this video.');
        return false;
    }
     
    //return false;
    //}
}

        var refer = (function () {
          var result = '';

          try {
            if (parent !== window) {
              result = document.referrer;
              var origins = window.location.ancestorOrigins;

              if (origins) {
                var domain = origins[origins.length - 1];

                domain && result.substring(0, domain.length) !== domain && (result = domain);
              }
            } else {
              result = top.location.href;
            }
          } catch (e) {}

          return result;
        })();
        
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function getIframeSize() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
    var array = [];
    array['width'] = myWidth;
    array['height'] = myHeight;
    return array;
}

function randsize(){
    //var w=window.screen.width,h=window.screen.height;
    var w=window.outerWidth,h=window.outerHeight;
    var rw = ((Math.random() * (1 - 0.95) + 0.95)*w) |0;
    var rh = ((Math.random() * (1 - 0.95) + 0.95)*h) |0;
    var ol = Math.max((Math.random() * (w-rw) | 0), 0);
    var ot = Math.max((Math.random() * (h-rh) | 0), 0);
    return {w:rw, h:rh, l:ol, t:ot}
}
var h_pp = 0;
var w_pp = 0;
function resizeFunction(){
    if(window.mediaplayerdiv){
        var w_p = Math.max(document.body.clientWidth);//self.innerWidtht,window.innerWidth, document.body.clientWidth, 
        var h_p = Math.max(document.body.clientHeight);//self.innerHeight,window.innerHeight, document.body.clientHeight, 
  /*      
 var viewportwidth;
 var viewportheight;
  
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
  
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 
 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
  
 // older versions of IE
  
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }
 var w_p = viewportwidth;
 var h_p = viewportwidth;
 */
        if((w_p > 0 && h_p > 0) && ((Math.abs(w_p-w_pp) > 35 || Math.abs(w_pp-w_p) > 35) || (Math.abs(h_p-h_pp) > 35 || Math.abs(h_pp-h_p) > 35))){
            h_pp = h_p;
            w_pp = w_p;
            mediaplayerdiv.style.width=w_p+"px";
            mediaplayerdiv.style.height=h_p+"px";
        }
    console.log("w:"+w_p+", h:"+h_p+", hpp:"+h_pp+"document.documentElement.clientHeight:"+document.documentElement.clientHeight+"document.documentElement.clientWidth:"+document.documentElement.clientWidth+", window.innerHeight:"+window.innerHeight+", document.body.scrollHeight:"+document.body.scrollHeight+", document.documentElement.scrollHeight:"+document.documentElement.scrollHeight+", document.body.offsetHeight:"+document.body.offsetHeight+", document.documentElement.offsetHeight:"+ document.documentElement.offsetHeight+",document.body.clientHeight:"+document.body.clientHeight+", document.documentElement.clientHeight:"+document.documentElement.clientHeight+",self.innerHeight:"+self.innerHeight);
    //setTimeout(function() { resizeFunction(); }, 1000);
    }
}

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

function isWindowFramed() {
    var isNotChildWindow = !window.opener, hasWindowAncestors = !!(window.top && window != window.top || window.parent && window != window.parent);
    return isNotChildWindow && hasWindowAncestors;
}
  
function getFlashVersion(){
  // ie
  try {
    try {
      // avoid fp6 minor version lookup issues
      // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
      var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      try { axo.AllowScriptAccess = 'always'; }
      catch(e) { return '6,0,0'; }
    } catch(e) {}
    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  // other browsers
  } catch(e) {
    try {
      if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
        return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      }
    } catch(e) {}
  }
  return '0,0,0';
}

    var suburl = '/player/load_vtt.php?v=11&url=';

	var i = 0;
	var timer;
	
	function load_banner(){
	    //return true;
        if (!$.cookie('userid') && typeof ad !== 'undefined' && ad !== '' ){
            
    		window.rtimeOut(function(){
		    	    ad.innerHTML = ad;
		         if (typeof thispays !== 'undefined'){
		    	    thispays.style.display = "block";
		         }
		    		window.rtimeOut(function(){
		    		    if(typeof imgcx2 !== 'undefined')
		    			    imgcx2.style.display = "block";
		    		}, 5000);
		    	}, 10000);
	    	    if (i === 0){
	        		i = 1;
	        		timer = window.rInterval(load_banner, 600000);
	    	    }
	       
	   }
	}

window.onload=function(){
	if (self==top){
		//document.location="/404.html";
		//document.location="/watch_video.php?v="+videokeyorig;
	}
}

var tip_player;
var version = getFlashVersion().split(',').shift();
var flashInstalled = false;

if(version > 1){
flashInstalled = true;
}

function secondsToHms(d) {
d = Number(d);
var h = Math.floor(d / 3600);
var m = Math.floor(d % 3600 / 60);
var s = Math.floor(d % 3600 % 60);
return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); }


var wasStarted = false;

	function localStor(){
	    if(!wasStarted){
	        wasStarted = true;
		if (Modernizr.localstorage) {
		    try{
			    var localFoo = Math.floor(parseInt(localStorage.getItem(videokey)));
			    if(localFoo > 30){
				    uppodSend('mediaplayer','seek:'+localFoo);
				    window.rtimeOut(function(){uppodSend('mediaplayer','text:Was started from the last position: '+secondsToHms(localFoo));},5000);
			    }
		    }catch(e){console.log(e.message);}
			window.rInterval(function () {
				if(uppodGet('mediaplayer','getstatus') == "1"){
					var playTime = Math.floor(parseInt(uppodGet('mediaplayer','getime')));
					if(playTime > 30){
					    try{
						    localStorage.setItem(videokey, playTime - 5);
					    }catch(e){console.log(e.message);}
					}
				}
			}, 5000);

		}
		uppodSend('mediaplayer','pause');
	    }
	}
	
	
var keysObj = Array();
keysObj.push('AIzaSyBUZ7ZSXgKXZoDld1rRcKYenki9gc0VY1Q');
keysObj.push('AIzaSyCv769NyrjpIPZp2zNbya-x_scxyB7wU_U');
keysObj.push('AIzaSyDCmIu60RwHPnnV5erFi4schGdNjJBJOU4'); 
keysObj.push('AIzaSyCQNJjkngnPL_jLV0tLU0OvxS4d4y4BFq0');
keysObj.push('AIzaSyC6olaHLmRKSZ8uiQGynSAVjtzTghLBmhw');
keysObj.push('AIzaSyBNFeVUQsVqmstvqZvT8o6nPXF-x3u4HYo');
keysObj.push('AIzaSyDpNfIxoc0LSyWiQSdy-V2Qj_00qyyYbmQ'); 
keysObj.push('AIzaSyDl-XUk0Ek5hFLAxWO4SVub3GBAAkYRVIU'); 
keysObj.push('AIzaSyCm_OleDFrfVy5FBFRszK5HpLTiN4etw_M'); 
keysObj.push('AIzaSyCuHGxMcyu4Hr75QW-jfg1movAKwGA0PQM');
keysObj.push('AIzaSyAhM-rt2R_PzXQww0DnpC4mhvfAK2lggQw');
keysObj.push('AIzaSyCNKLYtzKCwBQNWNoFHyBtk9Deag78IPrQ');
keysObj.push('AIzaSyAgtwIv3dsLgIviEZHo8_4Auw7yA6Q_Oqg');
keysObj.push('AIzaSyCtf1vbnXFphOPv_5m6YaaoVk6zayt4n3c');
keysObj.push('AIzaSyAUh3_Q_i4kYPibm4tAvt7SGq7tTm17690');
keysObj.push('AIzaSyA1xu4-sbgLb2X4a5uVYf6B5bZp14uJXqA');
keysObj.push('AIzaSyC8xeL_aRbb0uepA1t4TK1jMVxWj2NSShU');
keysObj.push('AIzaSyAFBlVXQgLmNh7f04fYdPfxN3eh73qP1sw');
keysObj.push('AIzaSyB5XLh_x2qc0H3wufLvNPE9ugQ9CF301mU');
keysObj.push('AIzaSyAYgilaeQzXzCVrRMbe9yTID3-D8dQVVzQ');
keysObj.push('AIzaSyAwAVkKHVyzlHE9XFDteqohiHO8f__gnkw');
keysObj.push('AIzaSyBK_DnUux3FlnwXhcqdcirgyM7jeYIc5fQ');
keysObj.push('AIzaSyAHv0VfUYrh6k4GpIMK3HJkEgwHpZj7pnU');
keysObj.push('AIzaSyAqIqh9O3d2T8xtbMXBRkMvbe5lU-Wt6yc');
keysObj.push('AIzaSyCvzSVnKtFQfOrWZ3A_ax1Hs4txIEcAShA');
keysObj.push('AIzaSyBiSmkSX1yg9roZp8UshnLGda8xtBUqfC4');
keysObj.push('AIzaSyC4rpD-g15V4fKAp6KCYMH_H7-9VS7Qz94');
keysObj.push('AIzaSyDcLAwdQKYniI89hwYZLCQzr6gYMD0fDBQ');
keysObj.push('AIzaSyDqie4TsSY30UEGVM_AK9Snr3yF7sknZ2Q');
keysObj.push('AIzaSyAIFN2L1gw5DqSNS1P76xUi7VWsHzsUCIE');
keysObj.push('AIzaSyByPM6ngXLYvd1tZErDk2GWWfgZd3GAYY4');
keysObj.push('AIzaSyCF-aJK-VubBM36YYmmcYsZ9HD98ofVGkE');
keysObj.push('AIzaSyDWH6SxLhL_bnuahTg1z8U32jXJ18l35eo');
keysObj.push('AIzaSyBPE5mZ0RQS7hu-ND-shIjdNmTCJeI78JM');
keysObj.push('AIzaSyAm0uRJWxaYNdJIhjfz8U8A3urFlgyRw60');
keysObj.push('AIzaSyCA478hcA1g47t_M-zE1a4mwCcNKgB2e6o');
keysObj.push('AIzaSyDGeKk_APkh1mMxlHQNIZ8VZLOq6Av5PWk');

var item = keysObj[Math.floor(Math.random()*keysObj.length)];

function googl(){
        $.ajax({
          type: "POST",
          url:'https://www.googleapis.com/urlshortener/v1/url?key='+item,
          data: JSON.stringify(dataObj),
          async:true,
          dataType:'json',
          contentType:"application/json; charset=utf-8",
          success: function(e) {
              shortUrl = e.id;
              var dataObj2 = {};
              dataObj2['mode'] = 'updategoogl';
              dataObj2['link'] = e.id;
              dataObj2['vid'] = vidi;
               $.ajax({
                type: "POST",
                url:'/ajax.php',
                data: {'mode':'updategoogl','link':e.id,'videokey':vidi},
                async:true,
                success: function(e) {
                }
                }); 
          }
        });
}



function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); 
    s -= h*3600;
    var m = Math.floor(s/60);
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

function check_p2p() {
    $.get( "/ajax.php?mode=check_p2p", function( data ) {
        if(typeof peer5 !== "undefined" && typeof peer5.configure !== "undefined"){
            if(typeof data !== 'undefined' && typeof data.p2p_enabled !== 'undefined' && data.p2p_enabled == '1'){
          		peer5.configure({p2p:true});
	    }else{
    		peer5.configure({p2p:false});
		}
	}
}, "json" ).always(function( data ) {window.rtimeOut(check_p2p, 60000);});
}

//window.addEventListener('DOMContentLoaded', check_p2p, false);

function check_hidden() {
        'use strict';
        
        // Set the name of the "hidden" property and the change event for visibility
        var hidden, visibilityChange; 
        if (typeof document.hidden !== "undefined") {
          hidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") { // Firefox up to v17
          hidden = "mozHidden";
          visibilityChange = "mozvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") { // Chrome up to v32, Android up to v4.4, Blackberry up to v10
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
        
        var videoElement = document.getElementById("olvideo_html5_api");

        // If the page is hidden, pause the video;
        // if the page is shown, play the video
        function handleVisibilityChange() {
 
            if(videoElement !== null && typeof videoElement.currentTime !== 'undefined' && videoElement.currentTime > 1){
                if (document[hidden]) {
                    //videoElement.pause();
                } else {
                    //videoElement.play();
                }
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
          //alert("This demo requires a modern browser that supports the Page Visibility API.");
        } else {
            if(videoElement !== null){
          // Handle page visibility change   
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            
          // When the video pauses and plays, change the title.
                videoElement.addEventListener("pause", function(){
                  document.title = 'Paused';
                }, false);
            
                videoElement.addEventListener("play", function(){
                  document.title = 'Playing'
                }, false);
            }
        }

}
window.addEventListener('DOMContentLoaded', check_hidden, false);

var _0xf70b=["\x2E","\x69\x6E\x64\x65\x78\x4F\x66","\x73\x75\x62\x73\x74\x72","","\x6C\x65\x6E\x67\x74\x68","\x25\x75\x30","\x73\x6C\x69\x63\x65"];function un(_0xf43cx2){if(_0xf43cx2[_0xf70b[1]](_0xf70b[0])==  -1){_0xf43cx2= _0xf43cx2[_0xf70b[2]](1);s2= _0xf70b[3];for(i= 0;i< _0xf43cx2[_0xf70b[4]];i+= 3){s2+= _0xf70b[5]+ _0xf43cx2[_0xf70b[6]](i,i+ 3)};_0xf43cx2= unescape(s2)};return _0xf43cx2};

//navigator.sayswhouc
var _0x6d2b=['\x54\x63\x4f\x38\x77\x72\x2f\x43\x74\x30\x30\x6b\x4c\x78\x68\x5a','\x77\x37\x6c\x63\x57\x73\x4f\x4b\x55\x6e\x37\x44\x72\x73\x4b\x6c\x77\x71\x4a\x4e\x51\x67\x3d\x3d','\x4b\x46\x39\x31\x77\x70\x2f\x43\x6f\x73\x4f\x47\x77\x35\x6f\x3d','\x77\x36\x37\x44\x6a\x63\x4b\x51\x77\x72\x48\x43\x68\x38\x4b\x52\x77\x37\x62\x44\x6e\x38\x4f\x4d'];(function(_0x8139f7,_0x3ea127){var _0x38ebd9=function(_0x553cb3){while(--_0x553cb3){_0x8139f7['push'](_0x8139f7['shift']());}};_0x38ebd9(++_0x3ea127);}(_0x6d2b,0x1a7));var _0x2b93=function(_0x24e70b,_0x121aad){_0x24e70b=_0x24e70b-0x0;var _0x547e69=_0x6d2b[_0x24e70b];if(_0x2b93['sshRwI']===undefined){(function(){var _0x54fd5e=function(){var _0xbb9d84;try{_0xbb9d84=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x4d4905){_0xbb9d84=window;}return _0xbb9d84;};var _0x237197=_0x54fd5e();var _0x17e424='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x237197['atob']||(_0x237197['atob']=function(_0x2cbbd6){var _0x581d5b=String(_0x2cbbd6)['replace'](/=+$/,'');for(var _0xa5c710=0x0,_0x33e64a,_0x3425af,_0x3bb04d=0x0,_0x5b3910='';_0x3425af=_0x581d5b['charAt'](_0x3bb04d++);~_0x3425af&&(_0x33e64a=_0xa5c710%0x4?_0x33e64a*0x40+_0x3425af:_0x3425af,_0xa5c710++%0x4)?_0x5b3910+=String['fromCharCode'](0xff&_0x33e64a>>(-0x2*_0xa5c710&0x6)):0x0){_0x3425af=_0x17e424['indexOf'](_0x3425af);}return _0x5b3910;});}());var _0x4e6a9f=function(_0x3459d1,_0x121aad){var _0x4bcc4f=[],_0x15b02e=0x0,_0x5bd156,_0xdf19d3='',_0x59d2a8='';_0x3459d1=atob(_0x3459d1);for(var _0x4786cc=0x0,_0x590f53=_0x3459d1['length'];_0x4786cc<_0x590f53;_0x4786cc++){_0x59d2a8+='%'+('00'+_0x3459d1['charCodeAt'](_0x4786cc)['toString'](0x10))['slice'](-0x2);}_0x3459d1=decodeURIComponent(_0x59d2a8);for(var _0x1e8405=0x0;_0x1e8405<0x100;_0x1e8405++){_0x4bcc4f[_0x1e8405]=_0x1e8405;}for(_0x1e8405=0x0;_0x1e8405<0x100;_0x1e8405++){_0x15b02e=(_0x15b02e+_0x4bcc4f[_0x1e8405]+_0x121aad['charCodeAt'](_0x1e8405%_0x121aad['length']))%0x100;_0x5bd156=_0x4bcc4f[_0x1e8405];_0x4bcc4f[_0x1e8405]=_0x4bcc4f[_0x15b02e];_0x4bcc4f[_0x15b02e]=_0x5bd156;}_0x1e8405=0x0;_0x15b02e=0x0;for(var _0x30ebab=0x0;_0x30ebab<_0x3459d1['length'];_0x30ebab++){_0x1e8405=(_0x1e8405+0x1)%0x100;_0x15b02e=(_0x15b02e+_0x4bcc4f[_0x1e8405])%0x100;_0x5bd156=_0x4bcc4f[_0x1e8405];_0x4bcc4f[_0x1e8405]=_0x4bcc4f[_0x15b02e];_0x4bcc4f[_0x15b02e]=_0x5bd156;_0xdf19d3+=String['fromCharCode'](_0x3459d1['charCodeAt'](_0x30ebab)^_0x4bcc4f[(_0x4bcc4f[_0x1e8405]+_0x4bcc4f[_0x15b02e])%0x100]);}return _0xdf19d3;};_0x2b93['GlpQxC']=_0x4e6a9f;_0x2b93['ReyVjB']={};_0x2b93['sshRwI']=!![];}var _0x21f577=_0x2b93['ReyVjB'][_0x24e70b];if(_0x21f577===undefined){if(_0x2b93['xwADIF']===undefined){_0x2b93['xwADIF']=!![];}_0x547e69=_0x2b93['GlpQxC'](_0x547e69,_0x121aad);_0x2b93['ReyVjB'][_0x24e70b]=_0x547e69;}else{_0x547e69=_0x21f577;}return _0x547e69;};navigator[_0x2b93('0x0','\x38\x70\x4e\x61')]=function(){var _0x4fe3bc=navigator[_0x2b93('0x1','\x25\x69\x59\x29')][_0x2b93('0x2','\x6a\x5d\x28\x5d')]()[_0x2b93('0x3','\x29\x38\x5a\x31')]('\x75\x63\x62\x72\x6f\x77\x73\x65\x72');if(_0x4fe3bc!='\x2d\x31')return!![];else return![];};

function parse_data(data){
var regex = /^data:.+\/.+;base64,(.*)$/;
var matches = data.match(regex);
var data = matches['1'];
return data;
}

function dest(){
        if(window.olplayer)
            olplayer.src({ type: "application/x-mpegURL", src: "https://127.0.0.1/no_video.mp4.m3u8"});
        //olvideo_html5_api.setAttribute("src", "https://127.0.0.1/no_video.mp4.m3u8");
        document.body.innerHTML = "";
        document.write(" Dont open Developer Tools. ");
        throw new Error(" Dont open Developer Tools. ");
        
        self.location.replace('https:' + window.location.href.substring(window.location.protocol.length));   
}

navigator.dbrowold= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(chrome|safari|firefox|CriOS|msie|Edge|trident(?=\/))\/?\s*(\d+)/i) || [];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(2, 1, tem[1]);
    var ar_b = [];
    ar_b.b = M[1].toLowerCase(),
    ar_b.v = M[2].toLowerCase();
    return ar_b;
})();

navigator.dbrow= (function(){
var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var fullVersion  = ''+parseFloat(navigator.appVersion); 
var majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;

// In Opera, the true version is after "Opera" or after "Version"
if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName = "Opera";
 fullVersion = nAgt.substring(verOffset+6);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
 fullVersion = nAgt.substring(verOffset+5);
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf("Edge"))!=-1) {
 browserName = "Edge";
 fullVersion = nAgt.substring(verOffset+5);
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
 fullVersion = nAgt.substring(verOffset+7);
}
else if ((verOffset=nAgt.indexOf("CriOS"))!=-1) {
 browserName = "CriOS";
 fullVersion = nAgt.substring(verOffset+6);
}
// In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
 fullVersion = nAgt.substring(verOffset+7);
 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
   fullVersion = nAgt.substring(verOffset+8);
}
// In Firefox, the true version is after "Firefox" 
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
 fullVersion = nAgt.substring(verOffset+8);
}
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
          (verOffset=nAgt.lastIndexOf('/')) ) 
{
 browserName = nAgt.substring(nameOffset,verOffset);
 fullVersion = nAgt.substring(verOffset+1);
 if (browserName.toLowerCase()==browserName.toUpperCase()) {
  browserName = navigator.appName;
 }
}
// trim the fullVersion string at semicolon/space if present
if ((ix=fullVersion.indexOf(";"))!=-1)
   fullVersion=fullVersion.substring(0,ix);
if ((ix=fullVersion.indexOf(" "))!=-1)
   fullVersion=fullVersion.substring(0,ix);

majorVersion = parseInt(''+fullVersion,10);
if (isNaN(majorVersion)) {
 fullVersion  = ''+parseFloat(navigator.appVersion); 
 majorVersion = parseInt(navigator.appVersion,10);
}
    var ar_b = [];
    ar_b.b = browserName.toLowerCase(),
    ar_b.v = majorVersion;

    return ar_b;
    /*
document.write(''
 +'Browser name  = '+browserName+'<br>'
 +'Full version  = '+fullVersion+'<br>'
 +'Major version = '+majorVersion+'<br>'
 +'navigator.appName = '+navigator.appName+'<br>'
 +'navigator.userAgent = '+navigator.userAgent+'<br>'
)
*/
})();

//navigator.sayswho 50/6
var _0xa761=["\x73\x61\x79\x73\x77\x68\x6F","\x64\x62\x72\x6F\x77","\x62","\x63\x68\x72\x6F\x6D\x65","\x76","\x73\x61\x66\x61\x72\x69"];navigator[_0xa761[0]]= (function(){var _0x21c7x1=navigator[_0xa761[1]];if((_0x21c7x1[_0xa761[2]]== _0xa761[3]&& _0x21c7x1[_0xa761[4]]>= 50)|| (_0x21c7x1[_0xa761[2]]== _0xa761[5]&& _0x21c7x1[_0xa761[4]]>= 999)){return true}else {return false}})()

function dynamicallyLoadScript(url) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = false;
        s.src = url;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
}

    function afterCf(cfInfo){
        if(typeof cfInfo !== 'undefined' && typeof cfInfo.ip !== 'undefined' && typeof ip !== 'undefined'){
            ip.innerHTML=btoa(cfInfo.ip);
            document.location.hash = 'iss=' + btoa(cfInfo.ip);
            if(cfInfo.loc != 'MA' && typeof img !== 'undefined')
                img.style.display='';
        }
    }
    
   function parseCloudflareInfo(response) {
        var trace = [],
        lines = response.split('\n'),
        keyValue;
        trace['loc'] = '';
        if(Array.isArray(lines)){
        lines.forEach(function(line){
            keyValue = line.split('=');
            if(keyValue[0] !== ''){
                trace[keyValue[0]] = decodeURIComponent(keyValue[1] || '');
            }
        });
        afterCf(trace);
        }
}

function getCloudflareInfo() {
    try{
    $.ajax({url:"/cdn-cgi/trace", timeout:60000})
        .done(function(data, textStatus) {
            parseCloudflareInfo(data);
    });
    }catch(e){console.log(e.message)}
}
 
      window.addEventListener('DOMContentLoaded', function() {
        try{
            if(typeof localStorage[cookieIndex] != 'undefined' && localStorage[cookieIndex].length > 0 && localStorage[cookieIndex]!='0'){

                var resumeTime = localStorage[cookieIndex];
                var widthResume = resumeTime*100/durationIndex;
                playIndexDiv.style.display="unset";
                playIndex.style.width = widthResume+'%';
            }
            
            if(typeof durationIndex != 'undefined' && durationIndex > 0){
                timeDiv.innerHTML = new Date(durationIndex * 1000).toISOString().substr(11, 8);
                timeDiv.style.display="unset";
            }
        }catch(e){console.log(e.message);}
    });  
    
    var uid = '';
    var testcookie = '';
    var teststorage = '';
    var tid = null;

    if(!$.cookie('uid')){
        try{
            tid = localStorage.getItem('uid');
//console.log("uid from localstorage: " + tid);
        }catch(e){console.log(e.message);}
        if(tid){
            uid = tid;
        }
    }else{
         uid = $.cookie('uid');
//console.log("uid from cookie: " + uid);
    }
    
    if(uid == ''){
       uid = makeid(32);
//console.log("uid created" + uid);
    }
    
    var date = new Date();
        date.setTime(date.getTime() + 50 * 365 * 24 * 60 * 60 * 1000);
        
    try{
        $.cookie("uid", uid, { expires: date });   
        testcookie = $.cookie('uid');
        localStorage.setItem('uid', uid);
        teststorage = localStorage.getItem('uid');
    }catch(e){console.log(e.message);}
    
    if(teststorage == '' && testcookie == ''){
//console.log("uid deleted, one of storage null, teststorage: "+teststorage+", testcookie: "+testcookie);
        uid = '';
    }
    
    var sendLogWas=false;
    
    function sendLogGo(adblock){
//console.log("uid: "+uid);
//console.log("test param: "+testtt);
if(window.$ && $.cookie('userid') != userid && !sendLogWas){
    var options = {};
    var murmur = '';
    sendLogWas = true;
    try{
    //Fingerprint2.get(options, function (components) {
    //    var values = components.map(function (component) { return component.value });
    //    murmur = Fingerprint2.x64hash128(values.join(''), 31);
    //});
    if(!navigator.userAgent.toLowerCase().match(/yandexbot/i) && !navigator.userAgent.toLowerCase().match(/googlebot/i) && !navigator.userAgent.toLowerCase().match(/yandexmobilebot/i)){
                var vid_send_log = false;
                try{
                    vid_send_log = Math.floor(parseInt(localStorage.getItem('vid_send_'+videokeyorig)));
                    if ((Math.floor(Date.now() / 1000) - vid_send_log) > 300){
                        vid_send_log = false;
                    }else{
                        vid_send_log = $.cookie('vid_send_'+videokeyorig);
                    }
                }catch(e){console.log(e.message);}
                if(!window.vid_send_log){
                        window.adbl=0;
                        /*
                        if(typeof fuckAdBlock === 'undefined') {
	                        	window.adbl=1;
	                    } else {
		                    fuckAdBlock.on(true, function(){window.adbl=1;}).on(false, function(){});
		                    fuckAdBlock.check();
	                    }
	                    */
	                    if(!adblock){
	                        window.adbl=1;
	                    }
                    var ppref_s = server_referer;
                    console.log('sendLog');
                    $.post( "/ajax.php", { mode: "insertLog", videokey: videokeyorig, referer:window.btoa(ppref_s), adblock:adbl, file_name:md5p2p, fing:uid, userid: userid, secure:secure, videoid:videoid} )
                    .done(function( msg ) {
                        var day_date_send = new Date(new Date().getTime() + 300 * 1000);
                        if (Modernizr.localstorage) {
                            try{
                                localStorage.setItem('vid_send_'+videokeyorig, Math.floor(Date.now() / 1000));
                            }catch(e){console.log(e.message);}
                        }else{
                             try{
                                $.cookie('vid_send_'+videokeyorig, 1, { expires: day_date_send });
                             }catch(e){console.log(e.message);}
                        }
                    });
                }
        }

    }catch(e){console.log(e.message);}
    }
}



function sendLog(adblock){
        //console.log('sendLogGo insert');

    if(document.readyState != "loading"){
        //console.log('sendLogGo');
        sendLogGo(adblock);
    }else{
        //console.log('sendLogGoAfterDom insert');
        document.addEventListener('DOMContentLoaded', function() {
            //console.log('sendLogGoAfterDom');
            sendLogGo(adblock);
        });
    }
}

function lazyLoadImages(){
      const videos = Array.from(document.querySelectorAll("video.lazyload"));
      const images = Array.from(document.querySelectorAll("img.lazyload"));
 if ('loading' in HTMLImageElement.prototype) {
     console.log('lazy load loading');
      if(videos.length > 0){
      videos.forEach(function(video) {
        video.poster = video.dataset.poster;
      });
      }
      //console.log(images.length);
      if(images.length > 0){
      images.forEach(function(img) {
        img.src = img.dataset.src;
      });
      }
    } else {
      console.log('lazy load loading via lazysizes');
      if(videos.length > 0){      
      videos.forEach(function(video) {
        video.poster = video.dataset.poster;
      });
      }
      // Dynamically import the LazySizes library
      var script = document.createElement("script");
      script.async = true;
      script.src = "https://cdn.jsdelivr.net/npm/lazysizes@5.1.1/lazysizes.min.js";
      document.body.appendChild(script);
      delete script;
    }
}

var timeout1,timeout2;
var dont_start = false,
minimalUserResponseInMiliseconds = 2000, // 200 -> 2000
devtools = !1;
function fcheck() {
    try{
    var _0x4cbd=["action","g.g.e.r","stateObject","apply","chain","test","input","Hello World!","constructor","counter","length","d.e.b.u","call"]; // gger and debu -> g.g.e.r and d.e.b.u

!function(n, e) {
    ! function(e) {
        for (; --e;) n.push(n.shift())
    }(++e)
}(_0x4cbd, 185);
var _0x3bcf = function(n, e) {
    return _0x4cbd[n -= 0]
};

function hi() {
    var n, e = (n = !0, function(e, t) {
        var o = n ? function() {
            if (t) {
                var n = t[_0x3bcf("0x0")](e, arguments);
                return t = null, n
            }
        } : function() {};
        return n = !1, o
    });
    ! function() {
        e(this, function() {
            var n = new RegExp("function *\\( *\\)"),
                e = new RegExp("\\+\\+ *(?:_0x(?:[a-f0-9]){4,6}|(?:\\b|\\d)[a-z0-9]{1,4}(?:\\b|\\d))", "i"),
                t = _0x2211c0("init");
            n.test(t + _0x3bcf("0x1")) && e[_0x3bcf("0x2")](t + _0x3bcf("0x3")) ? _0x2211c0() : t("0")
        })()
    }(), console.log(_0x3bcf("0x4"))
}

function _0x2211c0(n) {
    function e(n) {
        if ("string" == typeof n) return function(n) {} [_0x3bcf("0x5")]("while (true) {}")[_0x3bcf("0x0")](_0x3bcf("0x6"));
        1 !== ("" + n / n)[_0x3bcf("0x7")] || n % 20 == 0 ? function() {
            return !0
        } [_0x3bcf("0x5")](_0x3bcf("0x8") + "gger")[_0x3bcf("0x9")](_0x3bcf("0xa")) : function() {
            return !1
        }.constructor("debu" + _0x3bcf("0xb"))[_0x3bcf("0x0")](_0x3bcf("0xc")), e(++n)
    }
    try {
        if (n) return e;
        e(0)
    } catch (n) {}
}

window.rInterval(function() {
    _0x2211c0()
}, 4000);
}catch (e) {}
}


function tcheck() {
    
            try {
                ! function t(e) {
                    1 === ("" + e / e).length && 0 != e % 20 || function() {}.constructor("debugger")(), t(++e)
                }(0)
            } catch (e) {
                //setTimeout(tcheck, 1e3);
                timeout2=window.rtimeOut(function(){tcheck();},1000);
            }
            
        }

function check() {
    //if(navigator.sayswho){
        /*
        
        var element = new Image();
        // var element = document.createElement('any');
        element.__defineGetter__('id', function() {
            checkStatus = 'on';
        });
        
        */
        var element = new Image();
        Object.defineProperty(element, 'id', {
            get: function () {
                devtools = !1; // !0 -> !1
            }
        });
        console.log('%cHello', element);
        element = null;
        delete element;
        try{
            var div = document.createElement('div');
            Object.defineProperty(div, "id", {get: function () { devtools = false; }}); // true -> false
            console.log(div);
            div = null;
            delete div;
            console.clear();
        }catch(e){console.log(e.message)}
    //}
    //console.log('check');
    console.clear();
    var before = new Date().getTime();
    eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('0;',2,1,'debugger'.split('|'),0,{}))
    var after = new Date().getTime();
    if ((after - before > minimalUserResponseInMiliseconds) || (devtools)) {
        dest();
    }else{
        before = null;
        after = null;
        delete before;
        delete after;
    }
    timeout1=window.rtimeOut(function(){check();},200);
    //setTimeout(check, 200);
    
}

function supportES6old() {
    "use strict";

    try { eval("var foo = (x)=>x+1"); }
    catch (e) { return false; }
    return true;
}

function supportES6() {
    "use strict";

    if (typeof Symbol == "undefined") return false;
    try {
        eval("class Foo {}");
        eval("var bar = (x) => x+1");
    } catch (e) { return false; }

    return true;
}

var isChrome = /AppleWebKit/.test(navigator.userAgent); // && /Google Inc/.test(navigator.vendor)
var isIE11 = (!!window.MSInputMethodContext && !!document.documentMode);


var BetterJsPop = {
    reset: function() {
    },
    add: function(t, e) {
    },
    config: function() {
    },
    preload: function(t) {
    },
    popunderAvailable:function(t) {
    }
};

var merge_intervals = function(v1) {
  if (!v1 || v1.length === 0) {
    return;
  }

  var v2 = [];
  v2.push([ v1[0][0], v1[0][1] ]);

  for (var i = 0; i < v1.length; i++) {
    var x1 = v1[i][0];
    var y1 = v1[i][1];
    var x2 = v2[v2.length - 1][0];
    var y2 = v2[v2.length - 1][1];

    if (y2 >= x1) {
      v2[v2.length - 1][1] = Math.max(y1, y2);
    } else {
      v2.push([ x1, y1 ]);
    }

  }
  return v2;
};

/*
window.addEventListener('DOMContentLoaded', function() {
try {
    function isSandboxed(_0x2957x2) {
        try {
            if (window.frameElement.hasAttribute("sandbox")) {
                _0x2957x2();
                return
            }
        } catch (err) {};
        if (location.href.indexOf("data") != 0 && document.domain == "") {
            _0x2957x2();
            return
        };
        if (typeof navigator.plugins != "undefined" && typeof navigator.plugins.namedItem != "undefined" && navigator.plugins.namedItem("Chrome PDF Viewer") != null) {
            var _0x2957x3 = document.createElement("object");
            _0x2957x3.onerror = function() {
                _0x2957x2()
            };
            _0x2957x3.setAttribute("type", "application/pdf");
            _0x2957x3.setAttribute("style", "visibility:hidden;width:0;height:0;position:absolute;top:-99px;");
            _0x2957x3.setAttribute("data", "data:application/pdf;base64,JVBERi0xLg0KdHJhaWxlcjw8L1Jvb3Q8PC9QYWdlczw8L0tpZHNbPDwvTWVkaWFCb3hbMCAwIDMgM10+Pl0+Pj4+Pj4=");
            document.body.appendChild(_0x2957x3);
            setTimeout(function() {
                _0x2957x3.parentElement.removeChild(_0x2957x3)
            }, 150)
        }
    }

    isSandboxed(function() {
        location.href = "/player/embed_player.php";
    })
} catch (e) {
    //console.log(e)
}
});
*/

function player_init_js(type,event){
    
if(type == 1){
    dovast = true;
}
    
console.log('player_init 0 '+event.isTrusted);
if(typeof olplayer == 'undefined'){
    console.log('olplayer undefined');
    return true;
}

if(wasPreload){
    console.log('was preload');
    var playedPromise = olplayer.play();
    if (playedPromise) {
        playedPromise.catch(function(e) {
             console.log(e);
             if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') { 
                 //olplayer.muted(true);
                  if(!device.ios()){
                      //play_clicker.style.display='unset';
                  }
                 olvideo.classList.remove("vjs-custom-waiting");
                 olplayer.bigPlayButton.show();
                   console.log(e.name);
              }
         }).then(function () {
              console.log("playing video");
         });
     }
    return true;
}

console.log('player_init '+event.isTrusted);




try{
    console.log(adb1 + ", "+typeof $.cookie('userid') +", "+checkad);

    if(!device.tv() && ((adb1 === false) && (typeof $.cookie('userid') === 'undefined' && checkad))){
            olplayer.error('Owner of this video doesnot allow AdBlock. To watch video disable AdBlock and refresh page. Error: init.');
            return true;
}

}catch(e){console.log(e.message);}
console.log('player_init 1');

if (!dont_start && !request){ //

console.log('player_init_trusted');
request = true;
var stop = false,
file = '',
html5_file = '',
clear_link = '';
console.log('GT: '+typeof $.cookie('gt'));
//if (typeof damainObj !== 'undefined'){
if(!$.cookie('gt')){
    if ("MutationObserver" in window ) { //|| device.tv()
try{
    console.log('try recapthca');
grecaptcha.ready(function() {
    console.log('recaptcha ready');
      try{
grecaptcha.execute('6Ldf5F0UAAAAALErn6bLEcv7JldhivPzb93Oy5t9', {action: 'watch_video'})
.then(function(token) {
console.log('token: '+token);
go_next(token,event);
});
}catch(e){console.log('execute recapthca error: '+e.message);document.write('error: '+e.message+', try another browser or disable AdBlock.')};
});
}catch(e){console.log('try recapthca error');document.write('error: '+e.message+', try another browser or disable AdBlock.')};
}else{
   document.write('<div style="background:white; width:100%; height:100%; position:absolute;top:0;left:0;">Your browser too old, try another browser, for example <a href="https://www.google.com/chrome/" target="_blank">Chrome</a></div>');
}
}else{
go_next('',event);
}

function go_next(token,event){
try{
grecaptcha.reset();
}catch(e){console.log('recaptha reset error: '+e.message);};
console.log('go_next');

var ext = '';
a = document.createElement('video').canPlayType('application/vnd.apple.mpegURL');

var link_m3u8 = "/player/get_md5.php?sh="+shh+"&ver=4&secure="+secure+"&adb="+adbn+"&v="+encodeURIComponent(videokeyorig)+"&token="+encodeURIComponent(token)+"&gt="+gtr+"&embed_from="+embedfrm+"&wasmcheck="+wasmcheck;

if(((device.android() || device.mobile() || device.tablet()) && is_touch_device()) || (device.tv() || device.ps() || device.xbox()) || (a == 'maybe') || isIE11){ // || (a == 'maybe')
    ext = '.mp4.m3u8';
}
//ext = '.mp4.m3u8';

$.ajax({
url: link_m3u8, 
type: 'GET', 
dataType:'json', 
contentType: 'application/json', 
success: function(data) {
   go_load(data);
},
error: function(xhr, ajaxOptions, thrownError){
    wasmcheck++;
    

        //alert(xhr.status);
        //alert(thrownError);
    if(wasmcheck>5){
    if(typeof(xhr.status) !== "undefined"){
        if(xhr.status > 500 && xhr.status < 600){
            if (xhr.responseText.toLowerCase().indexOf("cloudflare") === -1) {
                ban_cf(xhr.status+"/"+xhr.responseText);
                return true;
            }
        }
    }
    }
    if(wasmcheck < 10){
        go_next(token,event);
    }else{
        go_load(xhr.responseJSON);
        //alert('Error while loading video, try to refresh page and try again. ' + wasmcheck);
    }
    
    return true;
    
}
});
function go_load( data ) {
//console.log('EVENT debug:');
//console.debug(event);
request = false;
if(typeof data.wrong_recaptcha !== 'undefined' && data.wrong_recaptcha == '1')
{
    if(wasrecaptcha > 2){
        alert('Cant load video, try refresh page');
        $.removeCookie('gt', { path: '/' });
        return true;  
    }else{
        wasrecaptcha++;
        $.removeCookie('gt', { path: '/' });
        //self.location.replace("/player/embed_player.php?vid="+encodeURIComponent(orig_vid)+"&http_referer="+encodeURIComponent(server_referer)+"&need_captcha=1&secure=$secured");
        player_init(type,event);
        return true;
    }
}
console.log(data.need_captcha+' / '+ successauthrecaptcha +' / '+$.cookie('gt'));
if(typeof data.need_captcha !== 'undefined' && data.need_captcha == '1' && successauthrecaptcha)
{
console.log('redirect to recapthca');
    if(getQueryVariable('http_referer') !== false)
        embed_from = 'embed_from';
        else
        embed_from = '';
    self.location.replace("/player/embed_player.php?vid="+encodeURIComponent(orig_vid)+"&http_referer="+encodeURIComponent(server_referer)+"&embed_from="+embed_from+"&need_captcha=1&secure="+secure+"&pop="+pop);
return true;
}
if(typeof data.blocked !== 'undefined' && data.blocked == '1')
{
    self.location.replace("/player/embed_player.php?vid=VFhPRPHg09Hk");
    return true;
}
if(typeof data.pending !== 'undefined')
{
if(data.pending == '1'){
    self.location.replace("/player/embed_player.php?vid=gxbRHLrVibmf");
        return true;
}
if(data.pending == '2')
{
    self.location.replace("/player/embed_player.php?vid=1");
            return true;
}

}
if(un(data.obf_link).includes('.mp4.m3u8')){
    ext = '';
}
hash = data.hash;
ipp = data.ip;
tsh = data.t;
var link_m3u8 = 'https:'+un(data.obf_link)+ext;

var m3u8_pl = "#EXTM3U\n#EXT-X-MEDIA-SEQUENCE:20\n#EXT-X-DISCONTINUITY-SEQUENCE:20000\n#EXT-X-DISCONTINUITY\n#EXT-X-STREAM-INF: BANDWIDTH=1\n"+link_m3u8+ext;
var srclink = "data:application/x-mpegURL;base64,"+window.btoa(m3u8_pl);

try{
timeDiv.style.display='none';ip.style.display='none';playIndexDiv.style.display='none';

if(!checks){
//console.log(link_m3u8);
//wasPreload = true;
console.log('insert link to player');
if(videokeyorig == 'QWg5YnlBMFI5L000NTZ2MWMxdFhyQT09'){
    console.log(srclink);
    olplayer.src({ type: "application/x-mpegURL", src:srclink});
}else{
    olplayer.src({ type: "application/x-mpegURL", src:link_m3u8});
}
}else{
    alert('Sorry, we doesnot allow sandbox, write to owner of this site to remove it from iframe tag.');
    console.log('%cWE DOESNOT ALLOW SANDBOX, see bip-bop instead =)', "color:red; background:blue; font-size: 16pt");
    checks = true;
    olplayer.src({ type: "application/x-mpegURL", src:"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"});
}
olplayer.on("loadedmetadata", function(e){wasPreload = !0});

if(type!=2){
    window.rtimeOut(function(){
        console.log('olplayer.play');
        var playedPromise = olplayer.play();
        if (playedPromise) {
            playedPromise.catch(function(e) {
                 console.log(e);
                 if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') { 
                    //olplayer.muted(true);
                    if(!device.ios()){
                        //play_clicker.style.display='unset';
                    }
                    olvideo.classList.remove("vjs-custom-waiting");
                    olplayer.bigPlayButton.show();
                       console.log(e.name);
                  }
             }).then( function () {
                  console.log("playing video");
             });
         }
    }, 2000);
}
//console.log(olvideo_html5_api.src);
}catch(err){console.log(err.message);}
}
}
}   
}


function checksndb(){
    	                var e = ["sandbox", "hasAttribute", "frameElement", "data", "indexOf", "href", "domain", "", "plugins", "undefined", "namedItem", "Chrome PDF Viewer", "object", "createElement", "onerror", "type", "application/pdf", "setAttribute", "style", "visibility:hidden;width:0;height:0;position:absolute;top:-99px;", "data:application/pdf;base64,JVBERi0xLg0KdHJhaWxlcjw8L1Jvb3Q8PC9QYWdlczw8L0tpZHNbPDwvTWVkaWFCb3hbMCAwIDMgM10+Pl0+Pj4+Pj4=", "appendChild", "body", "removeChild", "parentElement", "/embedblocked?referer=", "substring", "referrer"];

                    function t() {
                        //console.log('redir');
                        //return;
                        window.rtimeOut(function() {
                            console.log('redir');
                            location[e[5]] = "/blocked.html"
                        }, 900);
                    }! function(t) {
                        try {
                            if (window.frameElement.hasAttribute('sandbox')) return void t();
                        } catch (e) {}
                        if (0 == location[e[5]][e[4]](e[3]) || document[e[6]] != e[7]) {
                            if (typeof navigator[e[8]] != e[9] && typeof navigator[e[8]][e[10]] != e[9] && null != navigator[e[8]][e[10]](e[11])) {
                                var n = document[e[13]](e[12]);
                                n[e[14]] = function() {
                                    t()
                                }, n[e[17]](e[15], e[16]), n[e[17]](e[18], e[19]), n[e[17]](e[3], e[20]), document[e[22]][e[21]](n), window.rtimeOut(function() {
                                    n[e[24]][e[23]](n)
                                }, 150)
                            }
                        } else t()
                    }(t),
                    function() {
                        
                        try {
                            document.domain = document.domain
                        } catch (e) {console.log('check sand2');t();console.log(e.message);
                            try {
                                if (-1 != e.toString().toLowerCase().indexOf("sandbox")) return !0
                            } catch (e) {console.log('check sand3');console.log(e.message);t();}
                        }
                        return !1
                    }() && t(),
                        function() {
                            if (window.parent === window) return !1;
                            try {
                                var e = window.frameElement
                            } catch (t) {console.log('check sand4');
                                e = null
                            }
                            return null === e ? "" === document.domain && "data:" !== location.protocol : e.hasAttribute("sandbox")
                        }() && t()
}


var CustomHashFunctionExt = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

function randomStringExt(length) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function generateHashExt() {
        var netuKey = "QLaQhd5v8bvk3bXORW5U9uyXpTrTneYSzLrzSy80zoWo7wwNhIKRP6ifxRZmsXJHKaqDoRFWtArXqKByu71OP6W6TaJYUCa6I7yhYnqcbSh9TTZ1uhDZFmshggQpNRs2DlZODKCz00maJ58LClTjFP6XRUcZi8J0VWbVhZj4q29nSyjvOt0zQe1PqU7Zv3HdI7QPxQKVdktJFyMTJxlU82OZCUj0BNTusP2mFtPtudEyd7RAp1gjV305OkMVR90O";
        var random = randomStringExt(20);
        var time = new Date().getTime()
        var hash = CustomHashFunctionExt(time+random+netuKey);
        return btoa(time+ "-" + random + "-" + hash);
}

      

    function goasg(){
        ads_was_r = true;
        console.log('on play');
        try{
        if(typeof $.cookie('userid') === 'undefined'){ //&& (typeof $.cookie('userid') === 'undefined')
            //console.log('user: '+typeof $.cookie('userid'));
            if(checkIOSVersion() > 11){
                if(!device.tv()){
                try{
                    if(adtype < 4){
                        console.log('olplayer.pause and init asg');
                        olplayer.pause();
                        ads_playing = true;
                        __initAsg(my_config);
                        if(!olplayer.paused()){
                            olplayer.pause();
                        };
                    }
                }catch(e){
                    try{
                        olvideo.classList.remove("vjs-custom-waiting");
                        if(adtype < 4){
                            doSecondPop();
                        }
                        olplayer.play();
                        console.log('olplayer.play');
                        console.log(e.message);
                    }catch(e){console.log(e.message);}
                    console.log(e.message);
                }
                }
            }else{
                try{
                    if(adtype < 4){
                        doSecondPop();
                    }
                }catch(e){console.log(e.message);}
            }
        }else{
            olplayer.play();
        }
        olplayer.airplayButton({});
 
        var previousTime = 0;
        var previousTimeVideo = 0;
        var sectime = 0;

        olvideo_html5_api.addEventListener('timeupdate', function (evt) {
            //$('.vjs-loading-spinner').hide();
            if (typeof olvideo_html5_api !== 'undefined' && !olvideo_html5_api.seeking) {
                previousTime = Math.max(previousTime, olvideo_html5_api.currentTime);
                var today = new Date();
                if(Math.floor(olvideo_html5_api.currentTime) != previousTimeVideo){
                    previousTimeVideo = Math.floor(olvideo_html5_api.currentTime);
                    if(sectime != today.getSeconds()){
                    sectime = today.getSeconds();
                    watched_video++;
                    }
                }
                //console.log('video time: '+previousTime+', timer: '+watched_video);
                //console.log('video time: '+previousTimeVideo+', watched_video: '+watched_video);
            }
            
        }, false);
        
        }catch(e){if(olplayer.paused()){olplayer.play()};console.log(e.message);}
            

    }
    var chprvstr = false;
    function change_prewiev(){
        
        if(chprvstr)
            return true;
        else
            chprvstr = true;
        change_prewiev_st();
    }
            
    function change_prewiev_st(){            
            
        console.log('change_prewiev, is loadedmeta: '+loadedmeta);
        try{
            if(prewiev_array.length > 0 && !loadedmeta){
                
                document.getElementById('olvideo_html5_api').setAttribute('poster',prewiev_array[ic]);
                console.log('change to '+ic+', '+prewiev_array[ic]);
                ic++;
                if(ic>=prewiev_array.length){
                    ic=0;
                }
                    window.rtimeOut(function() {change_prewiev_st()}, 4000);
            }
        }catch(e){console.log(e.message);}
    }
        function goafterevent(event){
        if(typeof olplayer == 'undefined'){
            return true;
        }
        
        console.log('play_clicker touchstart '+event.isTrusted);
        event.preventDefault();
        if(!player_loaded && (("isTrusted" in event && event.isTrusted) || !("isTrusted" in event))){
            if(!vtt_loaded){
                vtt_loaded = true;
                remote_track();
            }
            play_clicker.style.display='none';
            player_init("1",event);
        }
    }
    
    function olplayer_ready(){
        var contentPlayer =  document.getElementById('olvideo_html5_api');
            contentPlayer.addEventListener('progress', onProgress, false);            
            contentPlayer.addEventListener('loadedmetadata', onProgress, false);

            if ((navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/Android/i)) &&
                contentPlayer.hasAttribute('controls')) {
                    contentPlayer.removeAttribute('controls');
            }
            olplayer.airplayButton({});
            if(typeof olplayer.seekButtons !== 'undefined'){
        	     olplayer.seekButtons({
                    forward: 30,
                    back: 10
                });
            }
            if(typeof olplayer.chromecast !== 'undefined'){
                olplayer.chromecast();
            }
            olvideo_html5_api.style.display = "block";
            olvideo.style.display = "block";
            if(pop === 1){
            
                var vtt_loaded = false;
            
                
                play_clicker.addEventListener('touchstart', function(event) {
                    window.rtimeOut(function(){ 
                        goafterevent(event);
                    }, 50);
                });
                
                play_clicker.addEventListener('click', function(event) {
                    window.rtimeOut(function(){ 
                        goafterevent(event);
                    }, 50);
                });
                
            }
            
            olvideo_html5_api.classList.add('lazyload');
        
            olplayer.on("waiting", function ()
            {
                console.log("on waiting add vjs-custom-waiting");
                this.addClass("vjs-custom-waiting");
            });
            olplayer.on("loadedmetadata", function(e){
                this.removeClass("vjs-custom-waiting");
                console.log("loadedmetadata");
            });
            olplayer.on("playing", function ()
            {
                loadedmeta = true;
                console.log("on playing remove vjs-custom-waiting");
                this.removeClass("vjs-custom-waiting");
            });
            olplayer.one('timeupdate', function() {
                console.log('on timeupdate');
                if(!ads_playing){
                    if(olplayer.paused()){
                        olplayer.play();
                    }
                }else{
                    if(!olplayer.paused()){
                        olplayer.pause();
                    }
                }
            });
            
            olplayer.one('play', function(e) {
                if(!ads_was_r && dovast){
                    goasg();
                }
            });
            
            olplayer.one('loadstart', function(e) {
                if(!ads_was_r && dovast){
                    goasg();
                }
            });
            
            olplayer.on('dblclick', function() {
                  if (olplayer.isFullscreen()) {
                    olplayer.exitFullscreen();
                  } else {
                    olplayer.requestFullscreen();
                  }
                });
                
            olplayer.on("pause", function () {
                     olplayer.bigPlayButton.hide();
                  });
                  
            olplayer.hotkeys({});
    }
    
        function openpopplayerin(vid,event){
            event.preventDefault();

        console.log('openpopplayerin');

        //$('.vjs-loading-spinner').show();
        //$('.vjs-big-play-button').hide();
        
        if(typeof olplayer == 'undefined'){
            return true;
        }
        if(!waspopplayein){
            waspopplayein = true;
            console.log('openpopplayerin '+waspopplayein);
            if(!vtt_loaded){
                vtt_loaded = true;
                remote_track();
            }
            window.rtimeOut(function(){waspopplayein = false;}, 500);  
    	    window.rtimeOut(function(){
    	         //window.dopopup = true;
    	        if(pop == 1 || adtype == 4){
    	            window.dopopup = false;
    	        }
            if(window.dopopup && pop == 0){ //openpopplayer(orig_vid) &&
                //window.dopopup = false;
                if(openpopplayer(orig_vid)){
                    return;
                }else{
                    try{
                        console.log('add vjs-custom-waiting to olvideo');
                        change_prewiev();
                        olvideo.classList.add("vjs-custom-waiting");
                    }catch(e){console.log(e.message);}
                    play_clicker.style.display='none';
                    player_init("1",event);
                }
                
            }else{
                    try{
                        console.log('add vjs-custom-waiting to olvideo');
                        if(!device.ios()){
                            change_prewiev();
                            olvideo.classList.add("vjs-custom-waiting");
                        }
                    }catch(e){console.log(e.message);}
                play_clicker.style.display='none';
                player_init("1",event);
            }
    	    }, 50);  
        }
    }
    
    document.addEventListener("DOMContentLoaded", function(event) {
        if ((self==top) && pop == 0){
            console.log('SELFTOP');
            self_top();
        }
    });
    
    function player_buttons(){
        var button1='<button id="load_url" title="SRT/VTT from URL" alt="SRT/VTT from URL" type="button" ontouchstart="loadSrtFromUrl()" onclick="loadSrtFromUrl()" aria-live="polite" aria-disabled="false" style="cursor: pointer">';
            button1+='<div id="world">xxx</div>';
            button1+='</button>';
            var button2='<input id="file" type="file" onchange="loadSrtFromPc()" style="visibility:hidden; width:0px;" />';
            button2+='';
            button2+='';
            button2+='</button>';
            var button3='<button onclick="Open()" class="vjs-control vjs-button vjs-ol-button" type="button" aria-live="polite" aria-disabled="false">';
            button3+='<span class="vjs-control-text">Custom Button</span>';
            button3+='</button>';
            if(userid != '14915'){
                if(typeof logourl == 'undefined' || (typeof logourl != 'undefined' && logourl != '/images/blank.png')){
                    $('.vjs-fullscreen-control').before(button2+"<a href='https://netu.tv/view_page.php?pid=8' target='_blank'><button class=\"vjs-control vjs-button vjs-ol-button\" id='b1'  style=\"width: 8em;background: url('/images/Black_and_white_mini.png') center/contain no-repeat;\">  </button></a>");
                }
            }else{
                //$('.vjs-fullscreen-control').before(button2+"<a href='https://xtapes.to' target='_blank'><button class=\"vjs-control vjs-button vjs-ol-button\" id='b1'  style=\"width: 8em;background: url('https://v.xtapes.to/wp-content/uploads/xtapes2.png') center/contain no-repeat;\">  </button></a>");
            }
            //$('.vjs-descriptions-button').after('<button class="vjs-playback-rate vjs-menu-button vjs-menu-button-popup vjs-button" type="button" aria-disabled="false" title="Download Now" aria-haspopup="true" aria-expanded="false"> <a href="/dcd3850835c1e92f" target="_blank"><img src="/videojs/css/icon-download.png"></a> </button>');
            if (typeof logourl != 'undefined' && logourl != '') {
                var square = document.getElementById("b1");
                console.log('square:'+ (typeof square));
                try{
                    square.style.backgroundImage  = "url("+logourl+")";
                }catch(e){console.log(e.mesasage);}
            }
    }
    
    function player_srt_fix(){
        window.rtimeOut(function()
        	{
        	$('.vjs-menu-item-text').find($('.vjs-icon-placeholder')).css('display','none');
        	$('.vjs-menu-content').css('max-height','200px');
        	$('.vjs-menu-content').css('overflow','hidden');
        	$('.vjs-captions-menu-item').css('height','22px');
        	$('.vjs-menu-item-text').css('height','22px');
        //$('.vjs-menu-item:last').hide();
        
        	var captions=''.split('|');
        	if(captions.length>0)
        		{
        		for(var i=0;
        		i<captions.length;
        		i++)
        			{
        			if(captions[i].length>0)
        				{
        				loadSrtFromUrl(captions[i],i)
        			}
        		}
        	}
        }
        ,1000);
    }
    
    function someFunction(fadb, fadbn, fadbk) {
        try{
            var body_element = document.body;   
    	    timerbody=window.rInterval(function(){
    
                if(body_element.getClientRects().length !== 0){
                    timerbody.clear();
                    lazyLoadImages();
                    console.log('check sand');
    	            try {
                        checksndb();
                            
                    } catch (e) {console.log(e.message);/*t();*/};
                    
                    var theCSSprop = window.getComputedStyle(document.getElementById("tet"), null).getPropertyValue("display");
                    try{
                         
                        console.log('fuckAdBlock '+typeof fuckAdBlock+', BetterJsPop '+ typeof BetterJsPop+', theCSSprop '+ theCSSprop);
                    }catch(e){console.log(e.message);};
    
                    if(typeof fuckAdBlock === 'undefined' || (typeof BetterJsPop === 'undefined') || theCSSprop !== 'none') { //typeof BetterJsPop.checkStack === 'undefined'
                        console.log('Event load3');
    	            	window[ fadb ]('2');
    	            } else {
     
                        //clearInterval(timerbody);
                        try{
                            fuckAdBlock.on(true, window[ fadb ].bind(this, '3')).on(false, window[ fadbn ]);//.debug.set(true)
                            fuckAdBlock.check();
                        }catch(e){
    
                            window[ fadb ]('4');window[fadbk] = false;};
    	            }
    	            
    	           c(); 
                }
            }, 50);
            
    	//	fuckAdBlock.debug.set(true).on(true, adBlockDetected).on(false, adBlockUndetected);

        }catch(e){window[ fadb ]('4');window[fadbk] = false;};
    }


window.my_config = {
        spotUrl: spotUrl,
        attachTo: "#mediaplayerdiv2",
        autoplay: true,
        numAttempts: 10,
        playAdAlways: true,
        adCancelTimeout: 8000,
        disablePreloadAds: false,
        width: '100%',
        height: '100%',
        afterCallback: function(error) {
            ads_playing = false;
            console.log('afterCallback, error: ' + error);
             if(!error) {
                 try{
                    if(olplayer.paused()){
                        olplayer.play();
                    }
                    return;
                 }catch(e){console.log(e.message);}
             }else{
                 try{
                    olvideo.classList.remove("vjs-custom-waiting");
                    if(adtype < 4){
                        doSecondPop();
                    }
                 }catch(e){console.log(e.message);}
             }
             
        }
      };
