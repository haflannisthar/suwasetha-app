
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{

    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Privilege");
  //refresh function for table and form
    refreshPrivTable()
    refreshPrivilegeForm();


    
})

//function to refresh table
const refreshPrivTable=()=>{

  // get the privilege
  privileges=ajaxGetReq("/privilege/findall");

   // display property list
   const displayProperty=[
    {property:getRole,datatype:'function'},
    {property:getModule,datatype:'function'},
    {property:getSelect,datatype:'function'},
    {property:getInsert,datatype:'function'},
    {property:getUpdate,datatype:'function'},
       {property:getDelete,datatype:'function'},

  ]

  //fillDataIntoTable function call
  //     fillDataIntoTable(tableId,dataList,propertyList,refillFunction,deleteFunction,updateFunction,button visibility,user Privilege);
  fillDataIntoTable(tableprivilege,privileges,displayProperty,refilPrivilegeForm,deletePrivilege,printPrivilege,true,userPrivilege);

  //add jQuery table
  $('#tableprivilege').dataTable();


}


// get role name
const getRole=(ob)=>{
return ob.role_id.name;
}
// get module name
const getModule=(ob)=>{
  return ob.module_id.name;
}
// get select privilege value
const getSelect=(ob)=>{

    if(ob.privselect){
        return" Granted";
    }
    else {
        return" Not-Granted";
    }
}
// get insert privilege value
const getInsert=(ob)=>{
    if(ob.privinsert){
        return" Granted";
    }
    else {
        return" Not-Granted";
    }
}
// get update privilege value
const getUpdate=(ob)=>{
    if(ob.privupdate){
        return" Granted";
    }
    else {
        return" Not-Granted";
    }
}
// get delete privilege value
const getDelete=(ob)=>{
    if(ob.privdelete){
        return" Granted";
    }
    else {
        return" Not-Granted";
    }
}



//function to refresh form
const refreshPrivilegeForm=()=>{

    privilegeTitle.innerHTML='New Privilege Enrollment'
    privilegerefreshbtn.style.visibility = 'visible'
  //create empty object
  privilege={};


  //get data for select element

  roles=ajaxGetReq("/role/list")

    selectRole.disabled=false;

    fillDataIntoSelect(selectRole,'Select Role',roles,'name');

    const selectRoles = document.getElementById("selectRole");
    const options = selectRoles.options;

    for (let i = 1; i < options.length; i++) {

            const parsedOption = JSON.parse(options[i].value);
            if (parsedOption.name === "Admin") {
                options[i].disabled = true;
                options[i].hidden = true;

                break;
            }

    }




    modules = ajaxGetReq("/module/list")
    selectModule.disabled=true;

  fillDataIntoSelect(selectModule,'select  module',modules,'name')


    selectRole.classList.remove("is-valid");
  selectModule.classList.remove("is-valid")

    selectRole.classList.remove("is-invalid");
    selectModule.classList.remove("is-invalid")

    checkboxSelLabel.innerText="Not-Granted"
    checkboxInsLabel.innerText="Not-Granted"
    checkboxUpdLabel.innerText="Not-Granted"
    checkboxDelLabel.innerText="Not-Granted"

    privilege.privselect=false
    privilege.privinsert=false
    privilege.privupdate=false
    privilege.privdelete=false


    checkboxSelect.checked=false;
   checkboxInsert.checked=false
    checkboxUpdate.checked=false
    checkboxDelete.checked=false



    privUpdBtn.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#privUpdBtn").css("cursor","not-allowed")


    if (userPrivilege.insert){
    privAddBtn.disabled=""
    privAddBtn.style.cursor="pointer"
    }
    else {
        btnAddEmp.disabled="disabled"
        btnAddEmp.style.cursor="not-allowed"
    }


}

// // funtion to get filterd module list for given role id
const FilteredModuleList=()=>{
    // /module/listbyrole?roleid=3
    moduleByRole = ajaxGetReq("/module/listbyrole?roleid="+JSON.parse(selectRole.value).id)
    selectModule.disabled=false;

    fillDataIntoSelect(selectModule,'select  module',moduleByRole,'name')
}


// get user confirmation befor form refresh
const  refreshPrivilegeFormByuserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form",
        text: "Entered data will be cleared",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPrivilegeForm();
        }
    });
}


//error checking
const checkError = () => {
    let errors = ''

    //for all required fields
    if (privilege.role_id== null) {
        errors = errors + "Please select  a role<br>"
        selectRole.classList.add('is-invalid')
    }


    if (privilege.module_id == null) {
        errors = errors + "Please select a module<br>"
        selectModule.classList.add('is-invalid')

    }
   return errors;

}





// privilege add button function
const  buttonPrivilegeAdd=()=>{
    //need to check for all required fields
    let fromerror = checkError()


   let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'




    //check for errors
    if (fromerror == '') {

        let PrivilegeInfo = `Role : ${privilege.role_id.name}<br>
                                  module is :${privilege.module_id.name}<br>`
        if (privilege.privselect){
            PrivilegeInfo +="privilege select granted<br>"
        }
        else {
            PrivilegeInfo +="privilege select not granted<br>"
        }
        if (privilege.privinsert){
            PrivilegeInfo +="privilege insert granted<br>"
        }
        else {
            PrivilegeInfo +="privilege insert not granted<br>"
        } if (privilege.privupdate){
            PrivilegeInfo +="privilege update granted<br>"
        }
        else {
            PrivilegeInfo +="privilege update not granted<br>"
        } if (privilege.privdelete){
            PrivilegeInfo +="privilege delete granted<br>"
        }
        else {
            PrivilegeInfo +="privilege delete not granted<br>"
        }


        div.innerHTML=PrivilegeInfo
        Swal.fire({
            title: "Are you sure to add the following privilege?",
            html:div ,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                let serverResponse = ajaxRequestBody("/privilege", "POST", privilege);
                if(serverResponse=="OK"){
                    Swal.fire({
                        title: "Privilege added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    // refresh form and table
                    refreshPrivTable();
                    refreshPrivilegeForm();
                    $('a[href="#PrivilegeTable"]').tab('show');



                }
                else{
                    Swal.fire("Something went wrong", serverResponse, "info");
                }

            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
            }
        });

    } else {
        div.innerHTML=fromerror;
        Swal.fire({
            icon: "error",
            title: "Form has following errors",
            html: div


        });
    }
}







    
    //edit function
    const refilPrivilegeForm=(rowOb,rowind)=> {


        privilegeTitle.innerHTML='Privilege Update'

        privilege = JSON.parse(JSON.stringify(rowOb))
        privilegeold = JSON.parse(JSON.stringify(rowOb))

        privInfo=`Role : ${rowOb.role_id.name}<br>
                  Module : ${rowOb.module_id.name}`

        let div=document.createElement('div')
        div.style.textAlign='left'
        div.style.marginLeft='50px'
        div.innerHTML=privInfo

        Swal.fire({
            title: "Are you sure to edit the following privilege?",
            html:div ,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                $('a[href="#PrivilegeForm"]').tab('show');
                privilege = rowOb;

                selectRole.classList.remove("is-invalid");
                selectModule.classList.remove("is-invalid")

                privilegerefreshbtn.style.visibility = 'visible'


                roles = ajaxGetReq("/role/list")
                fillDataIntoSelect(selectRole, 'Select Role', roles, 'name', privilege.role_id.name);
                selectRole.disabled = true;


                modules = ajaxGetReq("/module/list")
                //console.log(employeeStatus[0]);
                fillDataIntoSelect(selectModule, 'select  module', modules, 'name', privilege.module_id.name)
                selectModule.disabled = true


                if(privilege.privselect){
                    checkboxSelect.checked=true
                    checkboxSelLabel.innerText="Granted"
                }else{
                    checkboxSelect.checked=false
                    checkboxSelLabel.innerText="Not-Granted"
                }

                if(privilege.privinsert){
                    checkboxInsert.checked=true
                    checkboxInsLabel.innerText="Granted"
                }else{
                    checkboxInsert.checked=false
                    checkboxInsLabel.innerText="Not-Granted"
                }

                if(privilege.privupdate){
                    checkboxUpdate.checked=true
                    checkboxUpdLabel.innerText="Granted"
                }else{
                    checkboxUpdate.checked=false
                    checkboxUpdLabel.innerText="Not-Granted"
                }


                if(privilege.privdelete){
                    checkboxDelete.checked=true
                    checkboxDelLabel.innerText="Granted"
                }else{
                    checkboxDelete.checked=false
                    checkboxDelLabel.innerText="Not-Granted"
                }

                privAddBtn.disabled="disabled"
                privAddBtn.style.cursor="not-allowed"

                privUpdBtn.disabled=""

                $("#privUpdBtn").css("cursor","Pointer")


                if (userPrivilege.update){
                   privUpdBtn.disabled=""

                $("#privUpdBtn").css("cursor","Pointer")
                }
                else {
                    privUpdBtn.disabled="disabled"
                    privUpdBtn.style.cursor="not-allowed"
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

        //       define method to check update
        const checkUpdate = () => {
            let updateForm = '';

            if (privilege.privselect != privilegeold.privselect) {
                if (privilege.privselect){
                    updateForm = updateForm + "Select privilege not-granted changed into granted <br>" ;
                }
                else {
                    updateForm = updateForm + "Select privilege granted changed into not-granted <br>" ;
                }

            }

            if (privilege.privinsert != privilegeold.privinsert) {
                if (privilege.privinsert){
                    updateForm = updateForm + "Insert privilege not-granted changed into granted <br>" ;
                }
                else {
                    updateForm = updateForm + "Insert privilege granted changed into not-granted <br>" ;
                }

            }
            if (privilege.privupdate != privilegeold.privupdate) {
                if (privilege.privupdate){
                    updateForm = updateForm + "Update privilege not-granted changed into granted <br>" ;
                }
                else {
                    updateForm = updateForm + "Update privilege granted changed into not-granted <br>" ;
                }
            }
            if (privilege.privdelete != privilegeold.privdelete) {
                if (privilege.privdelete){
                    updateForm = updateForm + "Delete privilege not-granted changed into granted <br>" ;
                }
                else {
                    updateForm = updateForm + "Delete privilege granted changed into not-granted <br>" ;
                }
            }

            return updateForm;
        }

//define update function
        const buttonPrivilegeUpdate = () => {





            // check form errors
            let formerrors = checkError();

            let div=document.createElement('div')
            div.style.textAlign='left'
            div.style.marginLeft='50px'

            if (formerrors == "") {
                //form update
                let newUpdate = checkUpdate();
                if (newUpdate != "") {

                    div.style.fontSize='18px'
                    div.innerHTML=newUpdate

                    Swal.fire({
                        title: "Are you sure to update the following?",
                        html: div,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirm"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let ajaxUpdateResponse = ajaxRequestBody("/privilege", "PUT", privilege);
                            if (ajaxUpdateResponse == "OK") {
                                Swal.fire({
                                    title: " Privilege record updated successfully!",

                                    icon: "success"
                                });
                                //need to refresh table and form
                                refreshPrivilegeForm();
                                refreshPrivTable();
                                // console.log(employee)

                                //need to hide the modal
                                $('a[href="#PrivilegeTable"]').tab('show');
                            } else {
                                Swal.fire("Something went wrong", ajaxUpdateResponse, "info");
                            }

                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Action Aborted"


                            });
                        }
                    });

                }
                else{
                    Swal.fire("No updates found", "", "info");
                }
            }
            else {

                div.innerHTML=formerrors

                Swal.fire({
                    title: " Form has following errors!",
                    html:div,
                    icon: "warning"
                });
            }
        }






    const  printPrivilege=(rowOb)=>{

   const printPriv=rowOb;

        tdRole.innerHTML=printPriv.role_id.name
        tdModule.innerHTML=printPriv.module_id.name

        if (printPriv.privselect){
            tdSelPriv.innerHTML="Granted"
        }
        else{
            tdSelPriv.innerHTML="Not-Granted"
        }

        if (printPriv.privinsert){
            tdInsPriv.innerHTML="Granted"
        }
        else{
            tdInsPriv.innerHTML="Not-Granted"
        }

        if (printPriv.privupdate){
            tdUpdPriv.innerHTML="Granted"
        }
        else{
            tdUpdPriv.innerHTML="Not-Granted"
        }

        if (printPriv.privdelete){
            tdDelPriv.innerHTML="Granted"
        }
        else{
            tdDelPriv.innerHTML="Not-Granted"
        }


        let privilegePrintInfo = `Module  : ${printPriv.module_id.name}<br>
                 Role :  ${printPriv.role_id.name}`


        let div=document.createElement('div')
        div.style.textAlign='left'
        div.style.marginLeft='50px'
        div.innerHTML=privilegePrintInfo
        Swal.fire({
            title: "are you sure Print following privilege?",
            html:div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                printPrivilegeDetails();
            }
            else{
                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
            }
        })


    }


    const printPrivilegeDetails=()=>{
        const newTab=window.open()
        newTab.document.write(
            '<head><title>Privilege Print</title>'+
            '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
            '<style>p{font-size: 15px} </style>'+
            printPrivilegeTable.outerHTML


        )
        setTimeout(
            function() {
                newTab.print()
            },1000
        )
    }



//     print complete privilege table
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print privilege table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Privilege table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+'</head>'+
                '<h2  class="Text-center">Privilege Table Details<h2>'+
                tableprivilege.outerHTML
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


const deletePrivilege=(rowOb)=>{

    const  delPrivInfo=`Role : ${rowOb.role_id.name}<br>
                               Module : ${rowOb.module_id.name}<br>
                                Select Privilege : ${rowOb.privselect}<br>
                                  Insert Privilege : ${rowOb.privinsert}<br>
                                Update Privilege : ${rowOb.privdelete}<br>
                                 Delete Privilege : ${rowOb.privupdate}<br>`

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=delPrivInfo
    Swal.fire({
        title: "Are you sure to delete following privilege?",
        html:div ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverResponse=ajaxRequestBody("/privilege","DELETE",rowOb)
            if (serverResponse=="OK") {

                Swal.fire({
                    title: "Deleted!",
                     icon: "success"
                });

                refreshPrivTable();
                refreshPrivilegeForm()



            } else {
                Swal.fire("Something went wrong", serverResponse, "info");
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


const  buttonPrivilegeClear=()=>{

    selectRole.value=''
    selectRole.classList.add("is-invalid")

    selectModule.value=''
    selectModule.classList.add("is-invalid")
    selectModule.disabled=true

    if (checkboxSelect.checked){
        checkboxSelect.checked=false;
        checkboxSelLabel.innerText="Not-Granted"

    }
    if (checkboxInsert.checked){
        checkboxInsert.checked=false;
        checkboxInsLabel.innerText="Not-Granted"

    }
    if (checkboxUpdate.checked){
        checkboxUpdate.checked=false;
        checkboxUpdLabel.innerText="Not-Granted"

    }
    if (checkboxDelete.checked){
        checkboxDelete.checked=false;
        checkboxDelLabel.innerText="Not-Granted"

    }




}


