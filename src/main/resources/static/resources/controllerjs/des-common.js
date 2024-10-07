window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    DesignationPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(DesignationPrivilege)
    //refresh function for table and form
    refreshDesTable()
    refreshDesForm();




})
//function to refresh table
const refreshDesTable=()=>{
    designations=ajaxGetReq("/designation/findall");
    const displayProperty=[

        {property:'name',datatype:'string'}

    ]
    fillDataIntoTable(tabledesignation,designations,displayProperty,refillDesignationForm,deleteDesignation,printDesignation,true,DesignationPrivilege);
    disablebtn()
    $('#tabledesignation').dataTable();

}

// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tabledesignation");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

        const actionCell = row.querySelector("td:nth-child(3)"); // Adjusted selector for action cell
        const dropdown = actionCell.querySelector(".dropdown");
        const deleteButton = dropdown.querySelector(".btn-danger");


        if (DesignationPrivilege.delete){
        deleteButton.disabled = true;

        deleteButton.style.display = "none";
        }






    });
}




const refreshDesForm=()=>{

    designationTitle.innerHTML='New  Designation Enrollment'
designation={}

    designationrefreshbtn.style.visibility = 'visible'

    textDesignation.value=''
    textDesignation.classList.remove('is-valid')
    textDesignation.classList.remove('is-invalid')


    // disable update button when form load
    btnUpdateDes.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateDes").css("cursor","not-allowed")



    if (DesignationPrivilege.insert){
        btnAddDes.disabled=""
        btnAddDes.style.cursor="pointer"
    }
    else {
        btnAddDes.disabled="disabled"
        btnAddDes.style.cursor="not-allowed"
    }

}

const  checkerror=()=>{
    let error="";

    if (designation.name==null){
        error =error + "Please enter Designation<br>"
        textDesignation.classList.add('is-invalid')
    }

    return error;
}

// get user confirmation befor form refresh
const  refreshDesignationFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshDesForm();
        }
    });
}

const buttonDesignationAdd=()=>{
    let error=checkerror();

    if (error==''){
        let designationInfo = `Designation: ${designation.name}<br>`

        Swal.fire({
            title: "Are you sure to add following designation?",
            html: designationInfo,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/designation","POST",designation);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Designation record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshDesTable()
                    refreshDesForm()
                    $('a[href="#DesignationTable"]').tab('show');

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

const refillDesignationForm=(rowOb)=>{
    designationTitle.innerHTML=' Designation Update'
    designation=JSON.parse(JSON.stringify(rowOb))
    designationold=JSON.parse(JSON.stringify(rowOb))
    Swal.fire({
        title: "Are you sure to edit the following designation?",
        html: rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#DesignationForm"]').tab('show');


            // disable add button and enable update button

            if (DesignationPrivilege.update){
                btnUpdateDes.disabled=""
                btnUpdateDes.style.cursor="pointer"
            }
            else {
                btnUpdateDes.disabled="disabled"
                btnUpdateDes.style.cursor="not-allowed"
            }


            btnAddDes.disabled="disabled"
            btnAddDes.style.cursor="not-allowed"

            designationrefreshbtn.style.visibility = 'visible'

            textDesignation.classList.remove('is-invalid')


            designation=rowOb


            textDesignation.value=designation.name
            textDesignation.classList.add("is-valid")


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

    if (designation.name!=designationold.name) {
        updateForm=updateForm + "name " +designationold.name+ " changed into " + designation.name +"<br>";
    }

    return updateForm;
}

const buttonDesignationUpdate=()=>{
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/designation","PUT",designation);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Designation record updated successfully!",

                            icon: "success"
                        });
                       refreshDesTable()
                        refreshDesForm()
                        // hide the modal
                        $('a[href="#DesignationTable"]').tab('show');
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

            icon: "warning"
        });
    }

}

const deleteDesignation=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Designation record?",
        text: "Full name :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/designation","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshDesTable()




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
        title: "Are you sure to print designation table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Designation table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Designation Table Details<h2>'+
                tabledesignation.outerHTML
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
const printDesignation=(rowOb,rowind)=>{


    const desPrint=rowOb;


    tdNumber.innerHTML=desPrint.id
    tdDesname.innerHTML=desPrint.name




    let PrintInfo = ` Number : ${desPrint.id}<br>
                 Name :  ${desPrint.name}`
    Swal.fire({
        title: "are you sure Print following Designation?",
        html:PrintInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printDesignationDetails();
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
const printDesignationDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Designation Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printDesignationTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonDesignationClear=()=>{
    refreshDesForm();
}

const clearForm=()=>{
    textDesignation.classList.remove('is-invalid')
    refreshDesForm();

}

