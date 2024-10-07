window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Purchase-Drug");

    //refresh function for table and form
    refreshProductTypeTable()
    refreshProductTypeForm();




})
//function to refresh table
const refreshProductTypeTable=()=>{
    producttypes=ajaxGetReq("/purchaseproducttype/list");

    const displayProperty=[

        {property:'name',datatype:'string'},


    ]
    fillDataIntoTable(tableProductType,producttypes,displayProperty,refillPrForm,deletePr,printPr,true,userPrivilege);

    $('#tableProductType').dataTable();
    disablebtn();
}



// disable delete button
// delete button disablefor deleted status
const  disablebtn=()=>{
    const tableEmployee = document.getElementById("tableProductType");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

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



const refreshProductTypeForm=()=>{


    pproducttypeTitle.innerHTML='new Product-type Enrollment'

    purchaseproducttyperefreshbtn.style.visibility = 'visible'
    prproducttype=new Object();





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

// get user confirmation befor form refresh
const  refreshPurchaseproducttypeFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshProductTypeForm();
        }
    });
}


const  checkerror=()=>{
    let error="";

    if (prproducttype.name==null || textProductType.value==''){
        error =error + "Please enter product type<br>"
        textProductType.classList.add('is-invalid')
    }




    return error;
}

const buttonProductTypeAdd=()=>{

    let error=checkerror();

    if (error==''){



        let Info = `product type: ${prproducttype.name}<br>
                           `

        Swal.fire({
            title: "Are you sure to add following product type?",
            html: Info,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/purchaseproducttype","POST",prproducttype);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Product Type record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshProductTypeTable()
                    refreshProductTypeForm();
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

const refillPrForm=(rowOb)=>{

    pproducttypeTitle.innerHTML='Product-type Update'

    prproducttype=JSON.parse(JSON.stringify(rowOb))
    prproducttypeold=JSON.parse(JSON.stringify(rowOb))


    let Info = `product type: ${prproducttype.name}<br>
                           `
    Swal.fire({
        title: "Are you sure to edit the following Product Type?",
        html:Info ,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#ProductTypeForm"]').tab('show');


            purchaseproducttyperefreshbtn.style.visibility = 'visible'


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


            textProductType.classList.remove('is-invalid')

            prproducttype=rowOb


            textProductType.value=prproducttype.name
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

const  checkUpdate=()=>{
    let updateForm='';

    if (prproducttype.name!=prproducttypeold.name) {
        updateForm=updateForm + "product type name " +prproducttypeold.name+ " changed into " + prproducttype.name +"<br>";
    }




    return updateForm;
}

const buttonProductTypeUpdate=()=>{
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/purchaseproducttype","PUT",prproducttype);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Product Type record updated successfully!",

                            icon: "success"
                        });
                        refreshProductTypeTable()
                        refreshProductTypeForm();
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
            title: " Form has some errors!",
    html:formerrors,
            icon: "warning"
        });
    }

}

const deletePr=(rowOb)=>{
    console.log(rowOb.id)
    Swal.fire({
        title: "Are you sure to delete following Product Type record?",
        text: "Product Type  :" +rowOb.name,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/purchaseproducttype","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "record Deleted Successfully!",

                    icon: "success"
                });
                refreshProductTypeTable()




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
        title: "Are you sure to print Product Type table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Product Type table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Product Type Table Details<h2>'+
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
//print function
const printPr=(rowOb,rowind)=>{


    const PrintB=rowOb;


    tdNumber.innerHTML=PrintB.id
    tdPrname.innerHTML=PrintB.name



    let PrintInfo = ` Id : ${PrintB.id}<br>
               Product Type :  ${PrintB.name}<br>
              
                   `
    Swal.fire({
        title: "are you sure Print following Product Type details?",
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
        '<head><title>Brand Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
        '<style>p{font-size: 15px} </style>'+
        '</head>'+

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



