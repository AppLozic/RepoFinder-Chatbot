$(document).ready(function() {
  

  var $userId = $('#userId');
  var $appKey = $('#appKey');
  var $contactNumber = $('#contactNumber');
  var $password = $('#password');
  var $chat_form = $('#chat-form');
  var $chat_submit = $('#chat-submit');
  var $chat_relauncher = $('#chat-relauncher');
  var $chat_response = $('#chat-response');
  var $chat_postlaunch = $('#chat-post-launch');
  var firstTimeUser;


  var bot_contacts = [{"userId": "RepoFinder", "displayName": "Repo Finder",
                          "imageLink": "/images/panda-logo.png"
                          }];

  function getRandomId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


   if (Cookies.get("repofinderid")) {
                userId = Cookies.get("repofinderid");
            } else {
                userId = getRandomId();
                firstTimeUser = true;
                Cookies.set("repofinderid", userId);
            }
    var appKey = $appKey.val();
    var userContactNumber = $contactNumber.val();
    var userPassword = $password.val();
    var topicBoxEnabled = true;

    /*var displayName = '';
    displayName = '${param.displayName}';*/

    function onInitialize(data) {
      if (data.status == 'success') {
        // write your logic exectute after plugin initialize.
        if(firstTimeUser){
          populateWelcomeMessage(userId);
        }else{
        $('body').css('backgroundImage','url(/images/panda-cover.jpg)');
        $('#chat').css('display', 'none');
        $('#chat-box-div').css('display', 'block');
        }
        $applozic.fn.applozic('loadContacts', {"contacts":bot_contacts});
        $applozic.fn.applozic('loadTab', "RepoFinder");

      }
    }

    $applozic.fn.applozic({
      notificationIconLink:
          '/images/notification-image.png',
      userId: userId,
      // appId: appKey,
      appId: 'applozic-sample-app',
      // email:'userEmail',
      //accessToken: userPassword,
      desktopNotification: true,
      swNotification: true,
      olStatus: true,
      onInit: onInitialize,
      locShare: true,
     // googleApiKey: 'AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4',
      launchOnUnreadMessage: true,
      topicBox: topicBoxEnabled,
      authenticationTypeId: 1,
     // readConversation: populateWelcomeMessage
      //initAutoSuggestions : initAutoSuggestions
      // topicDetail: function(topicId) {}
    });






    function populateWelcomeMessage(userId){
    console.log("populating welcome message "+userId);
        setTimeout(function(){
         $.ajax({
                url: "/bot/welcomeMessage?userId="+userId+"&botId=RepoFinder",
                type: 'get',
                contentType: 'application/json',
                success: function(result) {
                  //console.log(JSON.stringify(result));
                  $('body').css('backgroundImage','url(/images/panda-cover.jpg)');
                  $('#chat').css('display', 'none');
                  $('#chat-box-div').css('display', 'block');
                }

        }); }, 3000);



    };


  $chat_relauncher.on('click', function() {
    sessionStorage.clear();
    window.location = '/login.html';
  });

});
