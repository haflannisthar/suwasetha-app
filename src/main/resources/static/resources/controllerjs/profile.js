
window.addEventListener('load',()=>{

    //refresh function for table and form



    refreshprofile();


    filldatatomodal();




})

const refreshprofile=(rowOb)=>{
    userdetail=ajaxGetReq("/profile/loggeduser");

    if (userdetail.user_photo==null){

        userImgPreview.src='/resources/images/user2.jpg';
    } else {

        userImgPreview.src=atob(userdetail.user_photo)
    }

    usernameData.innerHTML=userdetail.username;

    roleData.innerHTML=''
    userdetail.roles.forEach(element=>{
        roleData.innerHTML+=element.name +" "
    })

    usernameData2.innerHTML=userdetail.username;


    emailData.innerHTML=userdetail.email

    if (userdetail.status){
        statusData.innerHTML="<span class=' text-success border border-success rounded text-center p-1'>Active</span>"
    }

//     rolesData2
    rolesData2.innerHTML=''
    userdetail.roles.forEach(element=>{
        rolesData2.innerHTML+=element.name +" "
    })

    regnoData.innerHTML=userdetail.employee_id.empnumber
    fullnameData.innerHTML=userdetail.employee_id.fullname
    callingnameData.innerHTML=userdetail.employee_id.callingname
    nicData.innerHTML=userdetail.employee_id.nic
    emailData2.innerHTML=userdetail.employee_id.email
    mobileData.innerHTML=userdetail.employee_id.mobile

    if (userdetail.employee_id.landno!=null){
        landnoData.innerHTML=userdetail.employee_id.landno
    }
    else {
        landnoData.innerHTML=" - "
    }





    addressData.innerHTML=userdetail.employee_id.address
    civilstatusData.innerHTML=userdetail.employee_id.civilstatus
    genderData.innerHTML=userdetail.employee_id.gender






}

const filldatatomodal=()=>{
    userprofilechange=ajaxGetReq("/profile/changeuserprofile");
    console.log(userprofilechange)


    user={}

    textUsername.value=userprofilechange.username
    userprofilechange.username=textUsername.value
    user.username=textUsername.value

    textEmail.value=userprofilechange.email
    userprofilechange.email=textEmail.value
    user.email=textEmail.value


    textPassword.value=''
    textPasswordRT.value=''
    txtUserPhoto.value=''


    if (userprofilechange.user_photo==null){

        fileUserPhoto.src='/resources/images/user2.jpg';

    } else {
        imgUserPreview.src=atob(userprofilechange.user_photo)
        user.img=atob(userprofilechange.user_photo)
        txtUserPhoto.value=userprofilechange.user_photo_name
    }

    textUsername.classList.add('is-valid')
    textEmail.classList.add('is-valid')
    textPassword.classList.remove('is-valid')
    textCurrentPassword.classList.remove('is-valid')
    textPasswordRT.classList.remove('is-valid')
    txtUserPhoto.classList.remove('is-valid')

    textUsername.classList.remove('is-invalid')
    textPassword.classList.remove('is-invalid')
    textPasswordRT.classList.remove('is-invalid')
    txtUserPhoto.classList.remove('is-invalid')
    textCurrentPassword.classList.remove('is-invalid')



}

// define password for retype password
const PasswordRTValidatorProfile=()=>{
    if (textPassword.value!="") {
        if (textPassword.value==textPasswordRT.value) {
            textPassword.classList.remove('is-invalid');
            textPasswordRT.classList.remove('is-invalid')

            textPassword.classList.add('is-valid');
            textPasswordRT.classList.add('is-valid')

            userprofilechange.newpassword=textPassword.value;

        } else {
            textPassword.classList.add('is-invalid');
            textPasswordRT.classList.add('is-invalid')

            userprofilechange.newpassword=null;
        }
    } else {
        textPassword.classList.add('is-invalid');
        textPasswordRT.classList.add('is-invalid')

        userprofilechange.newpassword=null;
    }
}

const validatefileprofile=(fieldId,object,propertyOne,propertyTwo,previewId,nameFieldId)=>{



    if (fieldId.value!=""){


        let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (!allowedExtensions.exec(fieldId.value)) {
            Swal.fire({

                title: "Invalid File Type",
                text:'please upload a image of following type - jpg,jpeg,png ',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                        // imgEmpPreview.src='/resources/images/user2.jpg'
                        txtEmpPhoto.value=''
                        fileEmpPhoto.files=null

                    if (rowOb.user_photo==null){

                        imgEmpPreview.src='/resources/images/user2.jpg';
                    } else {
                        imgEmpPreview.src=atob(rowOb.user_photo)
                    }
                }
            });

        }else {
            let file=fieldId.files[0];
            nameFieldId.value=file['name'];

            window[object][propertyTwo]=file['name'];


            let fileReader =new FileReader();

            fileReader.onload=function (e){

                previewId.src=e.target.result;
                window[object][propertyOne]=btoa(e.target.result);

            }

            fileReader.readAsDataURL(file);
            return;
        }


    }

}

const formerrors=()=>{
    let error=''

    if (userprofilechange.username==null || textUsername.value==''){
        error+='Username cannot be empty'
        textUsername.classList.add('is-invalid');
    }

    if (textPassword.value!=textPasswordRT.value){
        error+='Password Mismatch. Please check again<br>'
    }

    if (textEmail.value=='' || userprofilechange.email==null){
        error+='Email Cannot Be Empty<br>'
        textEmail.classList.add('is-invalid');

    }



    return error;
}

const btnClearImage=()=>{
    userprofilechange.user_photo=null;
    userprofilechange.user_photo_name=null;
    imgUserPreview.src='/resources/images/user2.jpg'
    txtUserPhoto.value=''
    fileUserPhoto.files=null
}


const formUpdate=()=>{

    let updateDetails=''

    if (user.username!=userprofilechange.username){
         updateDetails='user name changed';
    }
    if (userprofilechange.newpassword!=null){
        updateDetails='password changed';

    }
    if (user.email!=userprofilechange.email){
        updateDetails='Email changed';

    }

    if (user.img!=userprofilechange.user_photo){
        updateDetails='Profile Picture changed';

    }

    return updateDetails;
}

const btnUserUpdate=()=>{
    console.log(userprofilechange)
     let errors=formerrors()
    if (errors===''){

let updates=formUpdate();

        if (updates!=''){
            Swal.fire({
                title: "Are you sure to update the user?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let ajaxUpdateResponse = ajaxRequestBody("/profile/changedetails", "PUT", userprofilechange);
                    if (ajaxUpdateResponse == "OK") {
                        Swal.fire({
                            title: " User details updated successfully!",
                            icon: "success"
                        });

                        window.location.assign("/logout")
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Update not successful",
                            html:"Have some errors <br>" + ajaxUpdateResponse


                        });
                    }
                }else {
                    Swal.fire({
                        icon: "error",
                        title: "Action Aborted"


                    });
                }

            })
        }else {
            Swal.fire({
                title: "No changes Found",
                icon: "warning"
            });
        }


    }else{
        Swal.fire({
            title: "Form has following errors",
            html:errors,
            icon: "warning"
        });
    }



}


const refreshodal=()=>{
    filldatatomodal();
}