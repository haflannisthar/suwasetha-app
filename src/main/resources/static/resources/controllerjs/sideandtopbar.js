window.addEventListener('load',()=>{

    //refresh function for table and form

    userdetail=ajaxGetReq("/profile/loggeduser");

    if (userdetail.user_photo!=null){
        showuserImage.src=atob(userdetail.user_photo);
    }
    else{
        showuserImage.src='/resources/images/user2.jpg'
    }
})