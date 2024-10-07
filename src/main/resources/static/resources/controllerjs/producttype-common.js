window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Sales-Drug");

    //refresh function for table and form
    refreshProducttypeTable()
    refreshProducttypeForm();




})
//function to refresh table
const refreshProducttypeTable=()=>{
    generic=ajaxGetReq("/producttype/list");

    const displayProperty=[

        {property:'name',datatype:'string'},


    ]
    fillDataIntoTable(tableProductType,generic,displayProperty,refillProducttypeForm,deleteProductType,printProductType,true,userPrivilege);

    $('#tableProductType').dataTable();
    disablebtn();
}



// disable delete button
const  disablebtn=()=>{
    const tableProductType = document.getElementById("tableProductType");
    const tableRows = tableProductType.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

   const actionCell = row.querySelector("td:nth-child(3)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");


            if (userPrivilege.delete){
                deleteButton.disabled = true;

                deleteButton.style.display = "none";
            }







    });
}


// refresh function
const refreshProducttypeForm=()=>{


    productTypeTitle.innerHTML='New Product-type Enrollment'
    refreshBtn.style.visibility = 'visible'

    producttype={}



    textProductType.value=''
    textProductType.classList.remove('is-valid')
    textProductType.classList.remove('is-invalid')


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

// get user confirmation before form refresh
const  refreshProductTypeFormByUserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshProducttypeForm();
        }
    });
}

// check for error
const  checkError=()=>{
    let error="";

    if (producttype.name==null || textProductType.value==''){
        error =error + "Please enter Product type name<br>"
        textProductType.classList.add('is-invalid')
    }


    return error;
}

// new product add
const buttonProductTypeAdd=()=>{

    let error=checkError();

    if (error==''){
        let Info = `Product type : ${producttype.name}<br>
                            `

        Swal.fire({
            title: "Are you sure to add following Product type?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/producttype","POST",producttype);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "product type record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshProducttypeForm()
                    refreshProducttypeTable()
                    $('a[href="#ProductTypeTable"]').tab('show');

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

// refill function
const refillProducttypeForm=(rowOb)=>{

    productTypeTitle.innerHTML='Product-type Update'

    producttype=JSON.parse(JSON.stringify(rowOb))
    producttypeold=JSON.parse(JSON.stringify(rowOb))

    let Info = `Product type: ${producttype.name}<br>
                            `
    Swal.fire({
        title: "Are you sure to edit the following Product type?",
        html:Info ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#ProducttypeForm"]').tab('show');


          refreshBtn.style.visibility = 'visible'

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


            producttype=rowOb

            textProductType.classList.remove('is-invalid')


            textProductType.value=producttype.name
            textProductType.classList.add("is-valid")



        }
        else {

                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
        }
    });



}

// check update
const  checkUpdate=()=>{
    let updateForm='';

    if (producttype.name!=producttypeold.name) {
        updateForm=updateForm + " product type " +producttypeold.name+ " changed into " + producttype.name +"<br>";
    }

    return updateForm;
}

// update function
const buttonProductTypeUpdate=()=>{
    // check form errors
    let formErrors=checkError();

    if (formErrors==""){
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/producttype","PUT",producttype);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Product type  record updated successfully!",

                            icon: "success"
                        });
                       refreshProducttypeForm()
                        refreshProducttypeTable()
                        // hide the modal
                        $('a[href="#ProductTypeTable"]').tab('show');
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
            title: " Form has Following Errors",
            html:formErrors,
            icon: "warning"
        });
    }

}


const deleteProductType=(rowOb)=>{
    // console.log(rowOb.id)
    // Swal.fire({
    //     title: "Are you sure to delete following product type?",
    //     text: "Product Type name :" +rowOb.name,
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Confirm"
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         let  serverRespnse=ajaxRequestBody("/productyype","DELETE",rowOb)
    //         if (serverRespnse=="OK") {
    //
    //
    //             Swal.fire({
    //                 title: "record Deleted Successfully!",
    //
    //                 icon: "success"
    //             });
    //             refreshProducttypeForm()
    //
    //
    //
    //
    //         } else {
    //
    //             Swal.fire("Something went wrong", serverRespnse, "info");
    //         }
    //
    //     }
    //     else {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Action Aborted"
    //
    //
    //         });
    //     }
    //
    // });
    //

}



// table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Product type table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Product type table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Product type Table Details<h2>'+
                tableProductType.outerHTML
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
//print function one product type
const printProductType=(rowOb,rowind)=>{


    const PrintG=rowOb;


    tdNumber.innerHTML=PrintG.id
    tdPrName.innerHTML=PrintG.name




    let PrintInfo = ` Id : ${PrintG.id}<br>
                Product type  :  ${PrintG.name}<br>
                   `
    Swal.fire({
        title: "are you sure Print following Product type details?",
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
        '<head><title>Product type Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<h2  class="Text-center">Product type  Details<h2>'+
        printProductTypeTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}


const buttonProductTypeClear=()=>{
    textProductType.value=''
    textProductType.classList.remove('is-valid')
    textProductType.classList.add('is-invalid')


}


