window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Sales-Drug");

    //refresh function for table and form
    refreshCategoryTable()
    refreshCategoryForm();




})
//function to refresh table
const refreshCategoryTable=()=>{
    categoryList=ajaxGetReq("/category/list");

    const displayProperty=[

        {property:'name',datatype:'string'},
        {property:getItemType,datatype:'function'},


    ]
    fillDataIntoTable(tableCategory,categoryList,displayProperty,refillCategoryForm,deleteCategory,printCategory,true,userPrivilege);

    $('#tableCategory').dataTable();
    disablebtn();
}

const  getItemType=(rowOb)=>{
    return rowOb.itemtype_id.name;
}

// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tableCategory");
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



const refreshCategoryForm=()=>{

    categoryTitle.innerHTML='New Category Enrollment'

    category={}

    categoryrefreshbtn.style.visibility = 'visible'


    textCategory.value=''
    textCategory.classList.remove('is-valid')
    textCategory.classList.remove('is-invalid')

    ItemType=ajaxGetReq("/itemtype/list");
    fillDataIntoSelect(selectItemType,"Select Item",ItemType,'name')
    selectItemType.value=''
    selectItemType.classList.remove("is-valid");
    selectItemType.classList.remove("is-invalid");


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
const  refreshCategoryFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshCategoryForm();
        }
    });
}

const  checkerror=()=>{
    let error="";

    if (category.name==null || textCategory.value==''){
        error =error + "Please enter Category name<br>"
        textCategory.classList.add('is-invalid')
    }

    if (category.itemtype_id==null || selectItemType.value==''){
        error =error + "Please select item type<br>"
        selectItemType.classList.add('is-invalid')
    }


    return error;
}

const buttonCategoryAdd=()=>{
    console.log(category);
    let error=checkerror();

    if (error==''){
        let Info = `Category: ${category.name}<br>
                         Item Type: ${category.itemtype_id.name}<br>
                            `

        Swal.fire({
            title: "Are you sure to add following Category?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/category","POST",category);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Category record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshCategoryForm()
                    refreshCategoryTable()

                    console.log(category)
                    $('a[href="#CategoryTable"]').tab('show');

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

const refillCategoryForm=(rowOb)=>{

    categoryTitle.innerHTML=' Category Update'

    category=JSON.parse(JSON.stringify(rowOb))
    categoryold=JSON.parse(JSON.stringify(rowOb))

    let Info = `Category : ${category.name}<br>
                  Item Type : ${category.itemtype_id.name}<br>
                            `
    Swal.fire({
        title: "Are you sure to edit the following Category?",
        html:Info ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#CategoryForm"]').tab('show');


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


            selectItemType.classList.remove("is-invalid");
            textCategory.classList.remove('is-invalid')

            category=rowOb


            categoryrefreshbtn.style.visibility = 'visible'


            textCategory.value=category.name
            textCategory.classList.add("is-valid")

            ItemType=ajaxGetReq("/itemtype/list");
            fillDataIntoSelect(selectItemType,"Select Item",ItemType,'name',category.itemtype_id.name)

            selectItemType.classList.add("is-valid")



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

    if (category.name!=categoryold.name) {
        updateForm=updateForm + " Category " +categoryold.name+ " changed into " + category.name +"<br>";
    }
    if (category.itemtype_id.name!=categoryold.itemtype_id.name) {
        updateForm=updateForm + " Item Type " +categoryold.itemtype_id.name+ " changed into " + category.itemtype_id.name+"<br>";
    }

    return updateForm;
}

const buttonCategoryUpdate=()=>{
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/category","PUT",category);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Category  record updated successfully!",

                            icon: "success"
                        });
                       refreshCategoryForm()
                        refreshCategoryTable()
                        // hide the modal
                        $('a[href="#CategoryTable"]').tab('show');
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

const deleteCategory=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Category record?",
        text: "Category :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/category","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshCategoryTable()




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
        title: "Are you sure to print Category table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Category table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Category Table Details<h2>'+
                tableCategory.outerHTML
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
const printCategory=(rowOb,rowind)=>{

    console.log(rowOb)
    const PrintG=rowOb;


    tdNumber.innerHTML=PrintG.id
    tdCatname.innerHTML=PrintG.name

    tditemtype.innerHTML=PrintG.itemtype_id.name



    let PrintInfo = ` Id : ${PrintG.id}<br>
                Category :  ${PrintG.name}<br>
                Item Type :  ${PrintG.itemtype_id.name}<br>
                   `
    Swal.fire({
        title: "are you sure Print following Category details?",
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
        '<head><title>Category Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printCategoryTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonCategoryClear=()=>{
    textCategory.value=''
    textCategory.classList.remove('is-valid')
    textCategory.classList.add('is-invalid')

    selectItemType.value=''
    selectItemType.classList.remove('is-valid')
    selectItemType.classList.add('is-invalid')

delete  category.name;

}

