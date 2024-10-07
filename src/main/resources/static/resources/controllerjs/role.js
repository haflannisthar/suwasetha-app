window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    RolePrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");

    //refresh function for table and form
    refreshRoleTable()
    refreshRoleForm();




})
//function to refresh table
const refreshRoleTable=()=>{
    roles=ajaxGetReq("/role/list");

    const displayProperty=[

        {property:'name',datatype:'string'}

    ]
    fillDataIntoTable(tablerole,roles,displayProperty,refillRoleForm,deleteRole,printRole,true,RolePrivilege);
    disablebtn();
    disableeditbtn()

    $('#tablerole').dataTable();

}

// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tablerole");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

        const actionCell = row.querySelector("td:nth-child(3)"); // Adjusted selector for action cell
        const dropdown = actionCell.querySelector(".dropdown");
        const deleteButton = dropdown.querySelector(".btn-danger");


            if (RolePrivilege.delete){
                deleteButton.disabled = true;

                deleteButton.style.display = "none";
            }








    });
}

// disable edit button for admin
const  disableeditbtn=()=>{
    const tableEmployee = document.getElementById("tablerole");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(2)"); //  selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(3)"); //  selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const editButton = dropdown.querySelector(".btn-info");

            if (statusValue === "Admin") {
                editButton.disabled = true;

                editButton.style.display = "none";

            }
        }



    });
}



const refreshRoleForm=()=>{


    roleTitle.innerHTML='new Role Enrollment'
    rolerefreshbtn.style.visibility = 'visible'


    role={}


    textRole.value=''
    textRole.classList.remove('is-valid')
    textRole.classList.remove('is-invalid')


    // disable update button when form load
    btnUpdateDes.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateDes").css("cursor","not-allowed")



    if (RolePrivilege.insert){
        btnAddDes.disabled=""
        btnAddDes.style.cursor="pointer"
    }
    else {
        btnAddDes.disabled="disabled"
        btnAddDes.style.cursor="not-allowed"
    }

}

// get user confirmation befor form refresh
const  refreshRoleFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshRoleForm();
        }
    });
}

const  checkerror=()=>{
    let error="";

    if (role.name==null && textRole.value==''){
        error =error + "Please enter Role<br>"
        textRole.classList.add('is-invalid')
    }

    return error;
}

const buttonRoleAdd=()=>{
    let error=checkerror();

    if (error==''){
        let roleInfo = `Role: ${role.name}<br>`

        Swal.fire({
            title: "Are you sure to add following Role?",
            html: roleInfo,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/role","POST",role);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Role record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshRoleTable()
                    refreshRoleForm()
                    $('a[href="#RoleTable"]').tab('show');

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
    else{
        Swal.fire({
            icon: "error",
            title: "Have following form errors",
            html: error


        });
    }
}

const refillRoleForm=(rowOb)=>{


    roleTitle.innerHTML='Role Update'


    role=JSON.parse(JSON.stringify(rowOb))
    roleold=JSON.parse(JSON.stringify(rowOb))
    Swal.fire({
        title: "Are you sure to edit the following role?",
        html: rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#RoleForm"]').tab('show');

            rolerefreshbtn.style.visibility = 'visible'

            // disable add button and enable update button

            if (RolePrivilege.update){
                btnUpdateDes.disabled=""
                btnUpdateDes.style.cursor="pointer"
            }
            else {
                btnUpdateDes.disabled="disabled"
                btnUpdateDes.style.cursor="not-allowed"
            }


            btnAddDes.disabled="disabled"
            btnAddDes.style.cursor="not-allowed"


            role=rowOb

            textRole.classList.remove('is-invalid')


            textRole.value=role.name
            textRole.classList.add("is-valid")


        }
        else {

                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
        }
    });



}

const  checkUpdate=()=>{
    let updateForm='';

    if (role.name!=roleold.name) {
        updateForm=updateForm + "name " +roleold.name+ " changed into " + role.name +"<br>";
    }

    return updateForm;
}

const buttonRoleUpdate=()=>{
    // check form errors
    let formerrors=checkerror();

    if (formerrors==""){
        //form update
        let newUpdate=checkUpdate();
        if (newUpdate != ""){

            Swal.fire({
                title: "Are you sure to update the following?",
                html:newUpdate,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let   ajaxUpdateResponse=ajaxRequestBody("/role","PUT",role);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Role record updated successfully!",

                            icon: "success"
                        });
                       refreshRoleTable()
                        refreshRoleForm()
                        // hide the modal
                        $('a[href="#RoleTable"]').tab('show');
                    }
                    else{
                        Swal.fire("Something went wrong", ajaxUpdateResponse, "info");
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
        else{
            Swal.fire("No updates found", "", "info");
        }


    }
    else{
        Swal.fire({
            title: " Form has some errors!",

            icon: "warning",
            html:formerrors
        });
    }

}

const deleteRole=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Role record?",
        text: "Module name :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/role","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshRoleTable()




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



//employee table print function

const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Role table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Role table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Role Table Details<h2>'+
                tablerole.outerHTML
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
//print function
const printRole=(rowOb,rowind)=>{


    const Print=rowOb;


    tdNumber.innerHTML=Print.id
    tdDesname.innerHTML=Print.name




    let PrintInfo = ` Number : ${Print.id}<br>
                 Name :  ${Print.name}`
    Swal.fire({
        title: "are you sure Print following Role?",
        html:PrintInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })





// option 2

// $('#modalPrintEmployee').modal('show');

}
const printDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Role Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printRoleTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonRoleClear=()=>{
    textRole.value=''
    textRole.classList.add('is-invalid')
}


