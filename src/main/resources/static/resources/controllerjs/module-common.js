window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    ModulePrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");

    //refresh function for table and form
    refreshModTable()
    refreshModForm();




})
//function to refresh table
const refreshModTable=()=>{
    modules=ajaxGetReq("/module/list");
    console.log(modules)
    const displayProperty=[

        {property:'name',datatype:'string'}

    ]
    fillDataIntoTable(tablemodule,modules,displayProperty,refillModuleForm,deleteMoule,printModule,true,ModulePrivilege);


    disablebtn();

    $('#tablemodule').dataTable();

}

// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tablemodule");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

   const actionCell = row.querySelector("td:nth-child(3)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");


            if (ModulePrivilege.delete){
                deleteButton.disabled = true;

                deleteButton.style.display = "none";
            }






    });
}



const refreshModForm=()=>{

    modulesTitle.innerHTML='New Module Enrollment'
    modulesrefreshbtn.style.visibility = 'visible'


module={}


    textModule.value=''
    textModule.classList.remove('is-valid')
    textModule.classList.remove('is-invalid')


    // disable update button when form load
    btnUpdateDes.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateDes").css("cursor","not-allowed")



    if (ModulePrivilege.insert){
        btnAddDes.disabled=""
        btnAddDes.style.cursor="pointer"
    }
    else {
        btnAddDes.disabled="disabled"
        btnAddDes.style.cursor="not-allowed"
    }

}
// get user confirmation befor form refresh
const  refreshModulesFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshModForm();
        }
    });
}

const  checkerror=()=>{
    let error="";

    if (module.name==null && textModule.value==''){
        error =error + "Please enter Module<br>"
        textModule.classList.add('is-invalid')
    }

    return error;
}

const buttonModuleAdd=()=>{
    let error=checkerror();

    if (error==''){
        let moduleInfo = `Module: ${module.name}<br>`

        Swal.fire({
            title: "Are you sure to add following Module?",
            html: moduleInfo,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/module","POST",module);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Module record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshModTable()
                    refreshModForm()
                    $('a[href="#ModuleTable"]').tab('show');

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

const refillModuleForm=(rowOb)=>{

    modulesTitle.innerHTML='Module Update'

    module=JSON.parse(JSON.stringify(rowOb))
    moduleold=JSON.parse(JSON.stringify(rowOb))
    Swal.fire({
        title: "Are you sure to edit the following module?",
        html: rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#ModuleForm"]').tab('show');


            // disable add button and enable update button

            if (ModulePrivilege.update){
                btnUpdateDes.disabled=""
                btnUpdateDes.style.cursor="pointer"
            }
            else {
                btnUpdateDes.disabled="disabled"
                btnUpdateDes.style.cursor="not-allowed"
            }


            btnAddDes.disabled="disabled"
            btnAddDes.style.cursor="not-allowed"


            module=rowOb

            textModule.classList.remove('is-invalid')


            modulesrefreshbtn.style.visibility = 'visible'



            textModule.value=module.name
            textModule.classList.add("is-valid")


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

    if (module.name!=moduleold.name) {
        updateForm=updateForm + "name " +moduleold.name+ " changed into " + module.name +"<br>";
    }

    return updateForm;
}

const buttonModuleUpdate=()=>{
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/module","PUT",module);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Module record updated successfully!",

                            icon: "success"
                        });
                       refreshModTable()
                        refreshModForm()
                        // hide the modal
                        $('a[href="#ModuleTable"]').tab('show');
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

const deleteMoule=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Module record?",
        text: "Module name :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/module","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshModTable()




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
        title: "Are you sure to print Module table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Module table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Module Table Details<h2>'+
                tablemodule.outerHTML
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
const printModule=(rowOb,rowind)=>{


    const Print=rowOb;


    tdNumber.innerHTML=Print.id
    tdDesname.innerHTML=Print.name




    let PrintInfo = ` Number : ${Print.id}<br>
                 Name :  ${Print.name}`
    Swal.fire({
        title: "are you sure Print following Module?",
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
        '<head><title>Module Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printModuleTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonModuleClear=()=>{
    textModule.value=''
    textModule.classList.add('is-invalid')
}

