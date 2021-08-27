const FB_APP_ID = 4163881890398318;

const loginBtn = document.getElementById('loginBtn');

if(localStorage.getItem('USER')){
    setUserInfo();
}

loginBtn.addEventListener('click', loginUser)

// User facebook authorization event
function loginUser(e) {
    e.preventDefault()
    // Get Facebook Token
    window.fbAsyncInit = function() {
        FB.init({
        appId            : FB_APP_ID,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v11.0',
        });
    };

    (function _(a,b,c,d,e){var f=window.console;f&&Math.floor(new Date().getTime()/1e3)-b>7*24*60*60&&f.warn("The Facebook JSSDK is more than 7 days old.");if(window[c])return;if(!window.JSON)return;var g=window[c]={__buffer:{replay:function(){var a=this,b=function(d){var b=window[c];a.calls[d][0].split(".").forEach(function(a){return b=b[a]});b.apply(null,a.calls[d][1])};for(var d=0;d<this.calls.length;d++)b(d);this.calls=[]},calls:[],opts:null},getUserID:function(){return""},getAuthResponse:function(){return null},getAccessToken:function(){return null},init:function(a){g.__buffer.opts=a}};for(var b=0;b<d.length;b++){f=d[b];if(f in g)continue;var h=f.split("."),i=h.pop(),j=g;for(var k=0;k<h.length;k++)j=j[h[k]]||(j[h[k]]={});j[i]=function(a){if(a==="init")return;return function(){g.__buffer.calls.push([a,Array.prototype.slice.call(arguments)])}}(f)}k=document.createElement("script");k.src=a;k.async=!0;e&&(k.crossOrigin="anonymous");h=document.getElementsByTagName("script")[0];h.parentNode&&h.parentNode.insertBefore(k,h)})("https:\/\/connect.facebook.net\/en_US\/sdk.js?hash=e25068e9a6b996ca05627f95f274bdcc", 1629729127, "FB", ["AppEvents.EventNames","AppEvents.ParameterNames","AppEvents.activateApp","AppEvents.clearAppVersion","AppEvents.clearUserID","AppEvents.getAppVersion","AppEvents.getUserID","AppEvents.logEvent","AppEvents.logPageView","AppEvents.logPurchase","AppEvents.setAppVersion","AppEvents.setUserID","AppEvents.updateUserProperties","Canvas.Plugin.showPluginElement","Canvas.Plugin.hidePluginElement","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.startTimer","Canvas.stopTimer","Event.subscribe","Event.unsubscribe","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui"], true);

    FB.login(function (response) {
        if (response.status == 'connected') {
        const accessToken = response.authResponse.accessToken;
        const expirationTime = JSON.stringify(response.authResponse.data_access_expiration_time);
        const userID = response.authResponse.userID;

        FB.api('/me/permissions', function(res) {
            const emailStatus = res.data.find(email => email.permission === 'email').status
            if(emailStatus !== 'declined'){

                fetch(`/authorization/${accessToken}&${expirationTime}&${userID}`, { method: 'POST' })
                .then((response) => {
                    if (response.status === 200) {
                    return response.json();
                    } else if (response.status === 401){
                    console.log('Unauthorized User')
                    }
                })
                .then((userInfo) => {
                    if(userInfo != undefined){
                        localStorage.setItem('USER', JSON.stringify(userInfo.localStore))
                        location.reload();
                    }
                })
            } else {
                console.log('please grant email and continue')
            }
        });
        }
    }, {scope: 'email', auth_type: "rerequest"})
}


// Sets logined user information
function setUserInfo(){

    const localStore = JSON.parse(localStorage.getItem('USER'));

    let userName;
    if(localStore.userFirstName != null){
        userName = localStore.userFirstName;
    }
    if (localStore.userLastName != null) {
        userName += ' ' + localStore.userLastName
    } 
    if (localStore.userFirstName == null && localStore.userLastName == null){
        userName = localStore.userLoginName
    }

    let loginInfo = document.getElementById('loginInfo');
    let logoutBtn = document.getElementById('logoutBtn');

    loginBtn.classList.add('disabled');

    if(document.getElementById('joinBtn')){
        joinBtn.classList.add('disabled');
    }

    if(document.getElementById('hiddenToken')){
        hiddenToken.value = localStore.token
    }

    loginInfo.innerHTML = `
    <img src="${localStore.userImgPath}">
    <h4>${userName}</h4>
    `
    loginInfo.href = `/user/${localStore.userID}`
    loginInfo.classList.add('login-info-active')
    logoutBtn.classList.add('logout-btn-active')

    logoutBtn.addEventListener('click', () => {
        window.localStorage.clear()            
        location.reload();
    })
}