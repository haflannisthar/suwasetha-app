window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Sales-Drug");

    //refresh function for table and form
    refreshGenericTable()
    refreshGenericForm();




})
//function to refresh table
const refreshGenericTable=()=>{
    subcategorylist=ajaxGetReq("/subcategory/list");

    const displayProperty=[

        {property:'name',datatype:'string'},
        {property:getcategory,datatype:'function'},


    ]
    fillDataIntoTable(tableGeneric,subcategorylist,displayProperty,refillGenericForm,deleteGeneric,printGeneric,true,userPrivilege);

    $('#tableGeneric').dataTable();
    disablebtn();
}

const  getcategory=(rowob)=>{
    return rowob.category_id.name;
}

// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tableGeneric");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

   const actionCell = row.querySelector("td:nth-child(4)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");


            if (userPrivilege.delete){
                deleteButton.disabled = true;

                deleteButton.style.display = "none";
            }







    });
}



const refreshGenericForm=()=>{

    subCTitle.innerText='New Sub-Category Enrollment'
    subcategoryrefreshbtn.style.visibility = 'visible'

    subcategory={}



    textSubCategory.value=''
    textSubCategory.classList.remove('is-valid')
    textSubCategory.classList.remove('is-invalid')

    category=ajaxGetReq("/category/list");
    fillDataIntoSelect(selectCategory,"Select Category",category,'name')
    selectCategory.value=''
    selectCategory.classList.remove("is-valid")

    // disable update button when form load
    btnUpdate.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdate").css("cursor","not-allowed")



    if (userPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

}

// get user confirmation befor form refresh
// const  refreshSubcategoryFormByuserConfirm=()=>{
//     Swal.fire({
//
//         text: "Are you sure to refresh the form",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes"
//     }).then((result) => {
//         if (result.isConfirmed) {
//             refreshGenericForm();
//         }
//     });
// }

const  checkerror=()=>{
    let error="";

    if (subcategory.name==null || textSubCategory.value==''){
        error =error + "Please enter sub category<br>"
        textSubCategory.classList.add('is-invalid')
    }
    if (subcategory.category_id==null || selectCategory.value==''){
        error =error + "Please select category<br>"
        selectCategory.classList.add('is-invalid')
    }


    return error;
}

const buttonGenericAdd=()=>{
    console.log(subcategory);
    console.log(typeof(subcategory))
    let error=checkerror();

    if (error==''){
        let Info = `subcategory: ${subcategory.name}<br>
                             category : ${subcategory.category_id.name}<br>
                            `

        Swal.fire({
            title: "Are you sure to add following Sub category?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/subcategory","POST",subcategory);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "sub-category record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshGenericForm()
                    refreshGenericTable()
                    $('a[href="#GenericTable"]').tab('show');

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

const refillGenericForm=(rowOb)=>{


    subCTitle.innerText='new Sub-Category Update'

    subcategory=JSON.parse(JSON.stringify(rowOb))
    subcategoryold=JSON.parse(JSON.stringify(rowOb))

    let Info = `Sub category: ${subcategory.name}<br>
                              category: ${subcategory.category_id.name}<br>
                            `
    Swal.fire({
        title: "Are you sure to edit the following sub-category?",
        html:Info ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#GenericForm"]').tab('show');

            subcategoryrefreshbtn.style.visibility = 'visible'

            // disable add button and enable update button

            if (userPrivilege.update){
                btnUpdate.disabled=""
                btnUpdate.style.cursor="pointer"
            }
            else {
                btnUpdateDes.disabled="disabled"
                btnUpdateDes.style.cursor="not-allowed"
            }


            btnAdd.disabled="disabled"
            btnAdd.style.cursor="not-allowed"


            subcategory=rowOb

            textSubCategory.classList.remove('is-invalid')


            textSubCategory.value=subcategory.name
            textSubCategory.classList.add("is-valid")

            category=ajaxGetReq("/category/list");
            fillDataIntoSelect(selectCategory,"Select Category",category,'name',subcategory.category_id.name)
            selectCategory.classList.add("is-valid")



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

    if (subcategory.name!=subcategoryold.name) {
        updateForm=updateForm + " sub category " +subcategoryold.name+ " changed into " + subcategory.name +"<br>";
    }
    if (subcategory.category_id.name!=subcategoryold.category_id.name) {
        updateForm=updateForm + " category " +subcategoryold.category_id.name+ " changed into " + subcategory.category_id.name +"<br>";
    }

    return updateForm;
}

const buttonGenericUpdate=()=>{
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/subcategory","PUT",subcategory);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: "record updated successfully!",

                            icon: "success"
                        });
                       refreshGenericTable()
                        refreshGenericForm()
                        // hide the modal
                        $('a[href="#GenericTable"]').tab('show');
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
            html:formerrors,
            icon: "warning"
        });
    }

}

const deleteGeneric=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following  record?",
        text: "Generic name :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/subcategory","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshGenericTable()




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



// table print function

const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print subcategory table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>sub-category table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">sub-category Table Details<h2>'+
                tableGeneric.outerHTML
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
const printGeneric=(rowOb,rowind)=>{


    const PrintG=rowOb;


    tdNumber.innerHTML=PrintG.id
    tdGenname.innerHTML=PrintG.name
    tdCatname.innerHTML=PrintG.category_id.name;



    let PrintInfo = ` Id : ${PrintG.id}<br>
                sub-category :  ${PrintG.name}<br>
                category :  ${PrintG.category_id.name}<br>
                   `
    Swal.fire({
        title: "are you sure Print following  details?",
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
        '<head><title>sub-category Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<h2  class="Text-center">sub-category  Details<h2>'+
        printGenericTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonGenericClear=()=>{
    textSubCategory.value=''
    textSubCategory.classList.remove('is-valid')
    textSubCategory.classList.add('is-invalid')

    selectCategory.value=''
    selectCategory.classList.remove('is-valid')
    selectCategory.classList.add('is-invalid')




}




