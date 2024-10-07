
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{

  userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/User");
  // console.log(userPrivilege)

  //refresh function for table and form
    refreshUserTable()
    refreshUserForm()
    $('[data-bs-toggle="tooltip"]').tooltip()


    
})
//function to refresh table
const refreshUserTable=()=>{

 
    
// //array for store employee
  users=ajaxGetReq("/user/findall")

   const displayProperty=[
    {property:getemployee,datatype:'function'},
    {property:'username',datatype:'string'},
    {property:'email',datatype:'string'},
    {property:getStatus ,datatype:'function'},
    {property:getrole ,datatype:'function'}
  ]

  //fillDataIntoTable function call
  //fillDataIntoTable(tableId,datalist,propertylist,refill employee,delete employee,print employee,userprivilege)
  fillDataIntoTable(tableuser,users,displayProperty,refilluserform,deleteuserform,printuserform,true,userPrivilege);

//
//
  disablebtnfordeletedstatus()
  $('#tableuser').dataTable();





}
const getemployee=(rowOb)=>{
  return rowOb.employee_id.fullname;
    }

    const getStatus=(rowOb)=>{
  if (rowOb.status) {
       return '<p  ><span class="text-success border border-success rounded text-center p-1 ">active</span></p>'
  } else {
    return '<p  ><span class="text-danger border border-danger rounded text-center p-1 ">not-active</span></p>'
  }
    }
  
    const getrole=(rowOb)=>{
      // return "role";
      let userRoles = "";

      rowOb.roles.forEach((element, index) => {
       userRoles+=element.name;
        if (index !==  rowOb.roles.length - 1) {
          userRoles += ", ";
        }
      });


    return userRoles;
    }


// delete button disable for deleted status
const  disablebtnfordeletedstatus=()=>{
  const tableUser = document.getElementById("tableuser");
  const tableRows = tableUser.querySelectorAll("tbody tr");

  tableRows.forEach(function(row) {
    const statusCell = row.querySelector("td:nth-child(5)");

    if (statusCell) {
      const statusValue = statusCell.textContent.trim();
      const actionCell = row.querySelector("td:nth-child(7)");
      const dropdown = actionCell.querySelector(".dropdown");
      const deleteButton = dropdown.querySelector(".btn-danger");


      if (userPrivilege.delete){
        if (statusValue === "not-active") {
          deleteButton.disabled = true;

          deleteButton.style.display = "none";

        }
      }

    }


  });
}


//function to refresh form
const refreshUserForm=()=>{

  userTitle.innerText='New User Enrollment'
  userrefreshbtn.style.visibility = 'visible'

  // create new object
  user= new Object();

  user.roles=new Array();


  user.status=false;

  //employee list without user account
    employeeAccountWithoutAccount=ajaxGetReq("/employee/empwithoutuseraccount")
  fillDataIntoSelect(selectEmployee,'select employee',employeeAccountWithoutAccount,'fullname');
  selectEmployee.disabled=false



// set default color
  selectEmployee.classList.remove("is-valid")
  textUsername.classList.remove("is-valid")
  textPassword.classList.remove("is-valid")
  textPasswordRT.classList.remove("is-valid")
  textEmail.classList.remove("is-valid")
  textNote.classList.remove("is-valid")

  selectEmployee.classList.remove("is-invalid")
  textUsername.classList.remove("is-invalid")
  textPassword.classList.remove("is-invalid")
  textPasswordRT.classList.remove("is-invalid")
  textEmail.classList.remove("is-invalid")
  textNote.classList.remove("is-invalid")


  selectEmployee.value = ""
  textUsername.value = ""
  textPassword.value = ""
  textPasswordRT.value = ""
  textEmail.value = ""
  textNote.value = ""
  checkUserStatus.checked=false;
  checkUserStatusLabel.innerHTML="User Account is not Active"

  textPassword.placeholder = "Enter Password"
  textPasswordRT.placeholder = "Re-enter Password"

  btnclear.disabled=false

  user.user_photo=null;
  user.user_photo_name=null;
  imgUserPreview.src='/resources/images/user2.jpg'
  txtUserPhoto.value=''
  fileUserPhoto.files=null


  // need to get roles list
  roles=ajaxGetReq("/role/list")
  divRoles.innerHTML="";

  roles.forEach(element => {
    const div=document.createElement('div')
    div.className="form-check form-check-inline"

    const inputCHK=document.createElement('input')
    inputCHK.type="checkbox";
    inputCHK.className="form-check-input "
    inputCHK.id="chk"+element.name

    // Disable the Admin checkbox immediately
    if (element.name === "Admin") {
      inputCHK.disabled = true;

    }

    inputCHK.onchange=function () {
      if (this.checked) {
        user.roles.push(element);
      } else {
        let extIndex=user.roles.map(item=>item.name).indexOf(element.name);
        if (extIndex!=-1) {
          user.roles.splice(extIndex,1);
        }
      }
    }

    const label=document.createElement('label')
    label.className="form-check-label "
    label.htmlFor=inputCHK.id;
    label.innerText=element.name;

    div.appendChild(inputCHK);
    div.appendChild(label);
    divRoles.appendChild(div)
  });

  // disable update button when form load
  userUpdBtn.disabled="disabled"
  // btnUpdateEmp.style.cursor="not-allowed"
  $("#userUpdBtn").css("cursor","not-allowed")

if (userPrivilege.insert){
  userAddBtn.disabled=""
  userAddBtn.style.cursor="pointer"
  }
   else {
      btnAddEmp.disabled="disabled"
      btnAddEmp.style.cursor="not-allowed"
  }

// disable admin checkbox
  const adminCheckbox = document.querySelector('input[value="Admin"]');

// Disable the checkbox
  if (adminCheckbox) {
    adminCheckbox.disabled = true;
  }


}

// get user confirmation befor form refresh
const  refreshUserFormByuserConfirm=()=>{
  Swal.fire({

    title: "Are you sure to refresh the form",
    text:"Entered Data will be cleared",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
  }).then((result) => {
    if (result.isConfirmed) {
      refreshUserForm();
    }
  });
}


// define password for retype password
const PasswordRTValidator=()=>{
  if (textPassword.value!="") {
    if (textPassword.value==textPasswordRT.value) {
      textPassword.classList.remove('is-invalid');
      textPasswordRT.classList.remove('is-invalid')

      textPassword.classList.add('is-valid');
      textPasswordRT.classList.add('is-valid')

      user.password=textPassword.value;
      
    } else {
      textPassword.classList.add('is-invalid');
      textPasswordRT.classList.add('is-invalid')

      user.password=null;
    }
  } else {
    textPassword.classList.add('is-invalid');
    textPasswordRT.classList.add('is-invalid')

    user.password=null;
  }
}
 // check user for error
  const checkUserFormError=()=>{
  let formerrors=''

  if (user.employee_id==null || selectEmployee.value=='') {
    formerrors=formerrors+ "please select a employee <br>";
    selectEmployee.classList.add('is-invalid')
  }
  if (user.username ==null || textUsername.value=='') {
    formerrors=formerrors+ "please fill the username field  <br>";
    textUsername.classList.add('is-invalid')

  }
  if (user.password ==null) {
    formerrors=formerrors+ "please fill the password field  <br>";
    textPassword.classList.add('is-invalid')

  }
  if (textPasswordRT.value ==null) {
    formerrors=formerrors+ "please fill the re-password field  <br>";
    textPasswordRT.classList.add('is-invalid')

  }

  if (user.email ==null || textEmail.value=='') {
    formerrors=formerrors+ "please fill the email field  <br>";
    textEmail.classList.add('is-invalid')

  }
    if (user.roles.length==0) {
      formerrors=formerrors+ "please select roles  <br>";

    }



  return formerrors;
}
// // define function submit for user object
const btnUserAdd=()=>{
  console.log(user);



  
  // need to check form error

  let checckerror=checkUserFormError();


  let div=document.createElement('div')
  div.style.textAlign='left'
  div.style.marginLeft='50px'


  if (checckerror==""){
    let UserInfo = `Fullname: ${user.employee_id.fullname}<br>
                 Username: ${user.username}<br>
           Password : ${user.password}<br>
             Email : ${user.email}<br>`

    if (user.status){
      UserInfo +=`User Status : Active <br>`
    }else {
      UserInfo +=`User Status : In-active <br>`
    }

    if (user.note != null) {
      UserInfo += `Note: ${user.note}<br>`;
    }
    UserInfo+=`Assigned roles : `
    user.roles.forEach(elemet=>{
      UserInfo+=  ` ${ elemet.name}`
    })
    div.innerHTML=UserInfo
    Swal.fire({
      title: "Are you sure to add the following User record?",
      html: div,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirm"
    }).then((result) => {
      if (result.isConfirmed) {
        let serverResponse=ajaxRequestBody("/user","POST",user);
        if (serverResponse=="OK") {
          Swal.fire({
            title: "User record Added Successfully!",
            text: "",
            icon: "success"
          });
          //need to refresh table and form
          refreshUserForm();
          refreshUserTable();
          $('a[href="#UserTable"]').tab('show');




        }
        else{
          Swal.fire("Something went wrong", serverResponse, "info");

        }

      }
      else{
        Swal.fire({
          icon: "error",
          title: "Action Aborted"


        });
      }
    });
  }
  else {
    div.innerHTML=checckerror
    swal.fire({
      icon: "error",
      title: "Form has following error",
      html: div,


    });
  }





}

const deleteuserform=(rowOb,rowind)=>{

  Swal.fire({
    title: "Are you sure to delete following user?",
    text: "Full name :" +rowOb.employee_id.fullname,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm"
  }).then((result) => {
    if (result.isConfirmed) {
      let  serverRespnse=ajaxRequestBody("/user","DELETE",rowOb)
      if (serverRespnse=="OK") {


        Swal.fire({
          title: "User Deleted Successfully!",

          icon: "success"
        });
        refreshUserForm();
        refreshUserTable();




      } else {

        Swal.fire("Something went wrong", serverRespnse, "info");
      }

    }
    else {
      Swal.fire({
        icon: "error",
        title: "Action Aborted"


      });
    }

  });






  }
//
// //edit function
 const refilluserform=(rowOb,rowind)=>{

   userTitle.innerText='User Update'


  user=JSON.parse(JSON.stringify(rowOb))
  userold=JSON.parse(JSON.stringify(rowOb))


   userInfo=` Username : ${rowOb.username}`

   let div=document.createElement('div')
   div.innerHTML=userInfo

   Swal.fire({
     title: "Are you sure edit the following user?",
     html: div,
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085d6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Confirm"
   }).then((result) => {
     if (result.isConfirmed) {
       $('a[href="#UserForm"]').tab('show');

       userrefreshbtn.style.visibility = 'visible'


       selectEmployee.classList.remove("is-invalid")
       textUsername.classList.remove("is-invalid")
       textPassword.classList.remove("is-invalid")
       textPasswordRT.classList.remove("is-invalid")
       textEmail.classList.remove("is-invalid")
       textNote.classList.remove("is-invalid")


       user=rowOb;


       btnclear.disabled=true

       textUsername.value=user.username;
       textUsername.classList.add("is-valid")
       textEmail.value=user.email
       textEmail.classList.add("is-valid")
       textPassword.disabled=true;
       textPasswordRT.disabled=true;

       if (user.note != null){
         textNote.value=user.note
         textNote.classList.add("is-valid")
       }
       else{
         textNote.value=""
       }
       if (user.status){
         checkUserStatus.checked=true
         checkUserStatusLabel.innerText="user account is active"
       }
       else{
         checkUserStatus.checked=false
         checkUserStatusLabel.innerText="user account is not active"
       }


       textPassword.placeholder='password'
       textPasswordRT.placeholder='password'


       // refill image
       if (user.user_photo==null){
         imgUserPreview.src='/resources/images/user2.jpg'
         txtUserPhoto.value='';

       }else {
         imgUserPreview.src=atob(user.user_photo);
         txtUserPhoto.value=user.user_photo_name;
       }



       employeeAccountWithoutAccount.push(user.employee_id)
       fillDataIntoSelect(selectEmployee,'select employee',employeeAccountWithoutAccount,'fullname',user.employee_id.fullname)
       selectEmployee.disabled=true
       selectEmployee.classList.add("is-valid")
       roles=ajaxGetReq("/role/list")
       divRoles.innerHTML="";

       roles.forEach(element => {
         const div=document.createElement('div')
         div.className="form-check form-check-inline"

         const inputCHK=document.createElement('input')
         inputCHK.type="checkbox";
         inputCHK.className="form-check-input"
         inputCHK.id="chk"+element.name

         // Disable the Admin checkbox immediately
         if (element.name === "Admin") {
           inputCHK.disabled = true;

         }

         inputCHK.onchange=function () {
           if (this.checked) {
             user.roles.push(element);
           } else {
             let extIndex=user.roles.map(item=>item.name).indexOf(element.name);
             if (extIndex!=-1) {
               user.roles.splice(extIndex,1);
             }
           }
         }

         let extRoleIndex=user.roles.map(item=>item.name).indexOf(element.name);
         if(extRoleIndex!=-1){
           inputCHK.checked=true;
         }



         const label=document.createElement('label')
         label.className="form-check-label"
         label.for=inputCHK.id
         label.innerText=element.name;

         div.appendChild(inputCHK);
         div.appendChild(label);
         divRoles.appendChild(div)
       });

       // disable update button when form load
       userUpdBtn.disabled=""
       // btnUpdateEmp.style.cursor="not-allowed"
       $("#userUpdBtn").css("cursor","pointer")

if (userPrivilege.update){
       userAddBtn.disabled="disabled"
       userAddBtn.style.cursor="not-allowed"
       }
        else {
           btnAddEmp.disabled="disabled"
           btnAddEmp.style.cursor="not-allowed"
       }



     }

     else{
       Swal.fire({
         icon: "error",
         title: "Action Aborted"


       });
     }

   });


 }


//
//
// // check user update
const checkupdate=()=>{
  let updateForm='';
  if (user.username!=userold.username) {
    updateForm=updateForm + "Username " +userold.username+ " changed into " + user.username +"<br>";

  }
  if (user.email!=userold.email) {
    updateForm=updateForm + "Email " +userold.email+ " changed into " + user.email +"<br>";

  }

  if (user.note!=userold.notw) {
    updateForm=updateForm + "Note " +userold.note+ " changed into " + user.note +"<br>";

  }

  if (user.user_photo!=userold.user_photo) {
    updateForm=updateForm + "User Image Changed <br>";

  }
  if (user.status!=userold.status) {
   if (user.status) {
    updateForm=updateForm + "Status not active changed into active" +"<br>";

   }
   else{
    updateForm=updateForm + "Status  active changed into not active" +"<br>";

   }
  }



  let  newroles=[]

  for (let  element of user.roles){

    let extrolecount=userold.roles.map(item=>item.id).indexOf(element.id)
    console.log(extrolecount)
    if (extrolecount==-1){
     newroles.push(element.name)
    }
  }
  console.log(newroles)
  if (newroles.length>0){
    updateForm=updateForm + "<b>Newly assigned roles :</b><br> "

    updateForm=updateForm + newroles.join('<br>');
  }


  let removedroles=[]

  for ( let element of userold.roles){
    let extindex=user.roles.map(role=>role.id).indexOf(element.id)
    if (extindex==-1){
      removedroles.push(element.name)
    }
  }
  if (removedroles.length>0){
    updateForm=updateForm + "<br/><b>Removed roles :</b><br> "

    updateForm=updateForm+removedroles.join('<br>');
  }
  return updateForm


}


//
// //define update function
const buttonUserUpdate=()=>{

  console.log(user);
  console.log(userold);
  // check form errors
      let formerrors=checkUserFormError();


  let div=document.createElement('div')
  div.style.textAlign='left'
  div.style.marginLeft='50px'

      if (formerrors==""){
          //form update
          let newUpdate=checkupdate();

          if (newUpdate != "") {
            div.innerHTML=newUpdate
            Swal.fire({
              title: "Are you sure to update the following?",
              html:div,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Confirm"
            }).then((result) => {
              if (result.isConfirmed) {
                let   ajaxUpdateResponse=ajaxRequestBody("/user","PUT",user);
                if (ajaxUpdateResponse=="OK"){
                  Swal.fire({
                    title: " User record updated successfully!",

                    icon: "success"
                  });
                  //need to refresh table and form
                  refreshUserForm();
                  refreshUserTable();
                  // hide the modal
                  $('a[href="#UserTable"]').tab('show');
                }
                else{
                  Swal.fire("Something went wrong", ajaxUpdateResponse, "info");
                }

              }
            });

          }
          else{
            Swal.fire("No updates found", "", "info");
          }


      }
      else{
        div.innerHTML=formerrors
        Swal.fire({
          title: " Form has following errors",
           html:div,
          icon: "warning"
        });
      }

  }
//print suer record
 const printuserform=(rowOb,rowind)=>{


  printUser=rowOb;

   tdUserNumber.innerHTML=printUser.employee_id.empnumber
   tdUsername.innerHTML=printUser.username;
   tdUserFullname.innerHTML=printUser.employee_id.fullname
   tdEmail.innerHTML=printUser.email
   tdStatus.innerHTML=printUser.status
   tdDesignation.innerHTML=printUser.employee_id.designation_id.name

   // printUser.roles.forEach(element=>{
   //   tdRoles.innerHTML +=element.name +" ";
   // })

   printUser.roles.forEach((element, index) => {
     tdRoles.innerHTML += element.name;
     if (index !== printUser.roles.length - 1) {
       tdRoles.innerHTML += ", ";
     }
   });


   if (printUser.note!=null){
     tdNote.innerHTML=printUser.note
   }else {
     tdNote.innerHTML="null"
   }
   let userPrintInfo = `Employee Number : ${printUser.employee_id.empnumber}<br>
                 Fullname :  ${printUser.employee_id.fullname}<br>
              Username : ${ printUser.username} `


        let div=document.createElement('div')
        div.style.textAlign='left'
        div.style.marginLeft='50px'
        div.innerHTML=userPrintInfo

   Swal.fire({
     title: "are you sure Print following user?",
     html:div,
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#3085d6",
     cancelButtonColor: "#d33",
     confirmButtonText: "Confirm"
   }).then((result) => {
     if (result.isConfirmed) {
       printUserDetails();
     }
     else{
       Swal.fire({
         icon: "error",
         title: "Action Aborted"


       });
     }
   })

}

// print user details
const  printUserDetails = () => {
  const newTab=window.open()
  newTab.document.write(
      '<head><title>User Print</title>'+
      '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
      '<style>p{font-size: 15px} </style>'+
      printUserTable.outerHTML


  )
  setTimeout(
      function() {
        newTab.print()
      },1000
  )
}



//employee table print function
const printCompleteTable=()=>{
  Swal.fire({
    title: "Are you sure to print User table?",

    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirm"
  }).then((result) => {
    if (result.isConfirmed) {
      const newTab=window.open()
      newTab.document.write(
          '<head><title>User table Print</title>'+
          ' <script src="../resources/jQuery/jquery.js"></script>'+
          '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
          '<style>.btn-display { display: none; }</style>'+'</head>'+
          '<h2  class="Text-center">User Table Details<h2>'+
          tableuser.outerHTML
          // '<script>$(".btn-display").css("display","none")</script>'+
          // '<script>$(".btn-display").hide("display","none")</script>'
      )
      setTimeout(
          function() {
            newTab.print()
          },1000
      )
    }
    else{
      Swal.fire({
        icon: "error",
        title: "Action Aborted"


      });
    }

  })





}


// define function for get user email by selecting employee
const  getUserEmail=()=>{
    textEmail.value=JSON.parse(selectEmployee.value).email;
    user.email=textEmail.value;
  textEmail.disabled=true
    textEmail.classList.add('is-valid')

  imgUserPreview.src=''

   if (JSON.parse(selectEmployee.value).emp_photo!=null){
  imgUserPreview.src=atob(JSON.parse(selectEmployee.value).emp_photo);
     txtUserPhoto.value=JSON.parse(selectEmployee.value).emp_photo_name
  user.user_photo=btoa(JSON.parse(selectEmployee.value).emp_photo)
     user.user_photo_name=JSON.parse(selectEmployee.value).emp_photo_name;
   }




}





const buttonUserClearForm=()=>{

  selectEmployee.value=''
  selectEmployee.classList.add("is-invalid")
  selectEmployee.classList.remove("is-valid")
  selectEmployee.disabled=false
  textUsername.value=''
  textUsername.classList.add("is-invalid")
  textUsername.classList.remove("is-valid")

  textEmail.value=''
  textEmail.classList.remove("is-valid")


  textNote.value=''
  textNote.classList.remove("is-valid")

  textPassword.value=''
  textPassword.classList.remove("is-valid")


  textPasswordRT.value=''
  textPasswordRT.classList.remove("is-valid")

  textPassword.placeholder = "Enter Password"
  textPasswordRT.placeholder = "Re-enter Password"

  checkUserStatus.checked=false;
  checkUserStatusLabel.innerHTML="User Account is not Active"



  // need to get roles list
  roles=ajaxGetReq("/role/list")
  divRoles.innerHTML="";

  roles.forEach(element => {
    const div=document.createElement('div')
    div.className="form-check form-check-inline"

    const inputCHK=document.createElement('input')
    inputCHK.type="checkbox";
    inputCHK.className="form-check-input "
    inputCHK.id="chk"+element.name

    // Disable the Admin checkbox immediately
    if (element.name === "Admin") {
      inputCHK.disabled = true;

    }

    inputCHK.onchange=function () {
      if (this.checked) {
        user.roles.push(element);
      } else {
        let extIndex=user.roles.map(item=>item.name).indexOf(element.name);
        if (extIndex!=-1) {
          user.roles.splice(extIndex,1);
        }
      }
    }

    const label=document.createElement('label')
    label.className="form-check-label "
    label.htmlFor=inputCHK.id;
    label.innerText=element.name;

    div.appendChild(inputCHK);
    div.appendChild(label);
    divRoles.appendChild(div)
  });

  user.user_photo=null;
  user.user_photo_name=null;
  imgUserPreview.src='/resources/images/user2.jpg'
  txtUserPhoto.value=''
  fileUserPhoto.files=null



}

const btnClearImage=()=>{
  user.user_photo=null;
  user.user_photo_name=null;
  imgUserPreview.src='/resources/images/user2.jpg'
  txtUserPhoto.value=''
  fileUserPhoto.files=null
}

