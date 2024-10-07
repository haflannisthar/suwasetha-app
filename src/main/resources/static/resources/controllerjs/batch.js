window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Batch");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshBatchTable()
    refreshBatchForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshBatchTable=()=>{
    batchDataList=ajaxGetReq("/batch/findall");

    const displayProperty=[
             {property:'batchno',datatype:'string'},
        {property:getPurchaseItem,datatype:'function'},
          {property:'manufacturedate',datatype:'string'},
          {property:'expirydate',datatype:'string'},
         {property:'salesdrugavailableqty',datatype:'string'},
          {property:getSalesPrice,datatype:'function'}

    ]
    fillDataIntoTable(tableBatch,batchDataList,displayProperty,refillBatchForm,deleteBatch,printBatch,true,UserPrivilege);

    disableDeleteBtn();
    $('#tableBatch').dataTable();



}


// get sales price of item
const  getSalesPrice=(rowOb)=>{
   return parseFloat(rowOb.saleprice).toFixed(2)
}

// get purchase item
const  getPurchaseItem=(rowOb)=>{
    return rowOb.purchasedrug_id.name;
}

// delete button disable
const  disableDeleteBtn=()=>{
    const tableBatch = document.getElementById("tableBatch");
    const tableRows = tableBatch.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {


            const actionCell = row.querySelector("td:nth-child(8)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");

        if (UserPrivilege.delete){
            deleteButton.disabled = true;

            deleteButton.style.display = "none";
        }

    });
}



const refreshBatchForm=()=>{

    batchTitle.innerHTML=' New Batch Enrollment'

       batch={}

    batchrefreshbtn.style.visibility = 'visible'

    suppliers=ajaxGetReq("/supplier/porderedsupplierlist");
    fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name')



    pdrugdetails=ajaxGetReq("/purchasedrug/list");
    fillDataIntoSelect(selectPdrug,'Select Drug/Item',pdrugdetails,'name')


// set manufacture date
    let currentdate=new Date();
    let maxdate= new Date()

    let minMonth =currentdate.getMonth()-6;

    if (minMonth<10 && minMonth>0){

        minMonth='0'+minMonth;
        console.log(minMonth)
    }
    else {
        minMonth+=12;
        console.log(minMonth)
    }

    let minDay= currentdate.getDate();
    console.log(minDay)
    if (minDay < 10){
        minDay='0'+ minDay;
    }
    textManufactureDate.min=currentdate.getFullYear() +"-"+ minMonth+"-"+minDay;

    console.log(textManufactureDate.min)

    maxdate.setDate(maxdate.getDate());

    let maxDay=maxdate.getDate();
    if (maxDay <10){
        maxDay='0'+maxDay;
    }

    let maxMonth=maxdate.getMonth()+1;
    if (maxMonth<10){
        maxMonth='0'+maxMonth;

    }
    textManufactureDate.max=maxdate.getFullYear()+"-"+maxMonth+"-"+maxDay
    console.log(textManufactureDate.max)
    //
    let currentDate = new Date();
    let minExpiryDate = new Date(currentDate);

// Add 15 days to the current date
    minExpiryDate.setDate(currentDate.getDate() + 15);

    let minMonthExp = minExpiryDate.getMonth() + 1;
    if (minMonthExp < 10) {
        minMonthExp = '0' + minMonthExp;
    }

    let minDayExp = minExpiryDate.getDate();
    if (minDayExp < 10) {
        minDayExp = '0' + minDayExp;
    }

    textExpiryDate.min = minExpiryDate.getFullYear() + "-" + minMonthExp + "-" + minDayExp;
    console.log("expmin"+textExpiryDate.min)

    let maxMonthExp= maxdate.getMonth()+1;
    if (maxMonthExp<10){
        maxMonthExp='0'+maxMonthExp;
    }

    let maxDayExp= currentdate.getDate();

    if (maxDayExp < 10){
        maxDayExp='0'+ maxDayExp;
    }

    textExpiryDate.max=currentdate.getFullYear()+3 +"-"+ maxMonthExp+"-"+maxDayExp;
    console.log("expmax"+textExpiryDate.max)



    // set default value
    selectSupplier.value=''
    textBatchNo.value=''
    selectPdrug.value=''
    textManufactureDate.value=''
    textExpiryDate.value=''
    textTotalQty.value=''
     textAvailQty.value=''
    textSalesAvailQty.value=''
    textPurchasePrice.value=''
    textSalesPrice.value=''

    // disable
    textBatchNo.disabled=true;
    selectSupplier.disabled=false
    selectPdrug.disabled=true
    textSalesPrice.disabled=true
    //set default color
    selectSupplier.classList.remove('is-valid')
    textBatchNo.classList.remove('is-valid')
    selectPdrug.classList.remove('is-valid')
    textManufactureDate.classList.remove('is-valid')
    textExpiryDate.classList.remove('is-valid')
    textTotalQty.classList.remove('is-valid')
    textAvailQty.classList.remove('is-valid')
    textSalesAvailQty.classList.remove('is-valid')
    textPurchasePrice.classList.remove('is-valid')
    textSalesPrice.classList.remove('is-valid')

    selectSupplier.classList.remove('is-invalid')
    textBatchNo.classList.remove('is-invalid')
    selectPdrug.classList.remove('is-invalid')
    textManufactureDate.classList.remove('is-invalid')
    textExpiryDate.classList.remove('is-invalid')
    textTotalQty.classList.remove('is-invalid')
    textAvailQty.classList.remove('is-invalid')
    textSalesAvailQty.classList.remove('is-invalid')
    textPurchasePrice.classList.remove('is-invalid')
    textSalesPrice.classList.remove('is-invalid')




    // disable update button when form load
    btnUpdate.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdate").css("cursor","not-allowed")



    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

}





// get drug item details by supplier no

const purchaseDrugList=()=>{

    if (selectSupplier.value!='') {
        textBatchNo.disabled=false
        selectPdrug.disabled = false
        // pOrderDrugs = ajaxGetReq("/purchasaedrug/getpdrugdetailsbyporder/" + JSON.parse(selectPorder.value).id);
        pOrderDrugs = ajaxGetReq("/purchasedrug/getdrugnamesforbatch/"+ JSON.parse(selectSupplier.value).id);


            fillDataIntoSelect(selectPdrug, 'Select Item ', pOrderDrugs, 'name')


        // empty other inner field value on change of drug name

        textBatchNo.value=''
        textBatchNo.classList.remove("is-valid")
        selectPdrug.classList.remove("is-valid")
        textManufactureDate.value=''
        textManufactureDate.classList.remove("is-valid")
        textExpiryDate.value=''
        textExpiryDate.classList.remove("is-valid")
        textPurchasePrice.value=''
        textPurchasePrice.classList.remove("is-valid")
        textSalesPrice.value=''
        textSalesPrice.classList.remove("is-valid")



    }
    else {
        selectPdrug.disabled=true;
        textBatchNo.disabled=true

    }


}



// delete function for grn delete
const  deleteBatch=(rowOb)=>{

    let GrnInfo = `Grn  Number: ${rowOb.grnno}<br>
                 Supplier Billno : ${rowOb.supplierbillno}<br> Purchase Order Code ${rowOb.purchaseorder_id.code}<br>`
    Swal.fire({
        title: "Are you sure to delete following Grn record?",
        html: GrnInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/grn","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "Grn record Deleted Successfully!",

                    icon: "success"
                });
                refreshGrnTable()




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

// get user confirmation before form refresh
const  refreshBatchFormByUserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshBatchForm();
        }
    });
}


// print batch details method
const  printBatch=(rowOb)=>{

    const Print=rowOb;

    tdBatchNumber.innerHTML=Print.batchno
    tdPitem.innerHTML=Print.purchasedrug_id.name
    tdSName.innerHTML=Print.supplier_id.name
    tdEdate.innerHTML=Print.expirydate
    tdMdate.innerHTML=Print.manufacturedate
    tdPTotalQty.innerHTML=Print.purchasedrugtotalqty
    tdATotalQty.innerHTML=Print.purchasedrugavailableqty
    tdSAQty.innerHTML=Print.salesdrugavailableqty

    tdSprice.innerHTML=parseFloat(Print.saleprice).toFixed(2)
    tdPrrice.innerHTML=parseFloat(Print.purchaseprice).toFixed(2)


    let PrintInfo = `Batch Number : ${Print.batchno}<br>
              Purchase Item  : ${Print.purchasedrug_id.name} `

    let  div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=PrintInfo

    Swal.fire({
        title: "are you sure Print following batch record?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printBatchDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}
// function to print batch details
const printBatchDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Batch Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printBatchTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}




// check form error
const  checkBatchFormError=()=>{

    let errors="";


    if ( selectSupplier.value=='' || batch.supplier_id==null ) {
        errors =errors + "Please select supplier<br>"
        selectSupplier.classList.add('is-invalid')
    }
    if ( textBatchNo.value=='' || batch.batchno==null  ) {
        errors =errors + "Please Enter Batch No<br>"
        textBatchNo.classList.add('is-invalid')

    }

    if (selectPdrug.value==''|| batch.purchasedrug_id==null) {
        errors =errors + "Please select a  purchase drug<br>"
        selectPdrug.classList.add('is-invalid')
    }
    if (textManufactureDate.value==''|| batch.manufacturedate==null) {
        errors =errors + "Please select  manufacture date<br>"
        textManufactureDate.classList.add('is-invalid')
    }
    if (textExpiryDate.value=='' || batch.expirydate==null) {
        errors =errors + "Please select expiry date<br>"
        textExpiryDate.classList.add('is-invalid')
    }

    if (textTotalQty.value=='' || batch.purchasedrugtotalqty==null) {
        errors =errors + "Please select fill the above fields<br>"
        textTotalQty.classList.add('is-invalid')
    }

    if (textSalesAvailQty.value=='' || batch.purchasedrugavailableqty==null) {
        errors =errors + "Please enter purchase drug available quantity <br>"
        textSalesAvailQty.classList.add('is-invalid')
    }

    if (textAvailQty.value=='' || batch.salesdrugavailableqty==null) {
        errors =errors + "Please select fill the above fields <br>"
        textAvailQty.classList.add('is-invalid')
    }

    if (textPurchasePrice.value=='' || batch.purchaseprice==null) {
        errors =errors + "Please enter purchase price <br>"
        textPurchasePrice.classList.add('is-invalid')
    }
    if (textSalesPrice.value=='' || batch.saleprice==null) {
        errors =errors + "Please enter sales price <br>"
        textSalesPrice.classList.add('is-invalid')
    }


    return errors;
}


// button add function
const buttonBatchAdd=()=>{

    console.log(batch)
    let error=checkBatchFormError();

    let  div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


    if (error==''){
         let BatchInfo = `Supplier : ${batch.supplier_id.name}<br>
              Batch No : ${batch.batchno}<br>
               Purchase Drug : ${batch.purchasedrug_id.name}<br>
                Manufacture Date: ${batch.manufacturedate}<br>
                 Expiry Date : ${batch.expirydate}<br> 
                 Purchase Drug Total Quantity : ${batch.purchasedrugtotalqty}<br> 
                  Purchase Drug Available Quantity : ${batch.purchasedrugavailableqty}<br>
                 Sales Drug Available Quantity : ${batch.salesdrugavailableqty}<br>
                 Purchase Price : ${batch.purchaseprice}<br>
                 Sales Price : ${batch.saleprice}<br>
                  
                     `;

        div.innerHTML=BatchInfo

        Swal.fire({
            title: "Are you sure to add following Batch record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/batch","POST",batch);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Batch record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshBatchForm()
                    refreshBatchTable()
                    $('a[href="#BatchTable"]').tab('show');

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
        div.innerHTML=error
        Swal.fire({
            icon: "error",
            title: "For has Following errors",
            html: div


        });
    }
}

// refill batch details
const refillBatchForm=(rowOb)=>{

    batch=JSON.parse(JSON.stringify(rowOb))
    batchold=JSON.parse(JSON.stringify(rowOb))

    console.log(batch)

    let refillInfo=`Grn No : ${rowOb.batchno}<br>
                                  Purchase Item  : ${rowOb.purchasedrug_id.name}`

    let  div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=refillInfo
    Swal.fire({
        title: "Are you sure to edit the following batch record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#BatchForm"]').tab('show');


            // disable add button and enable update button

            if (UserPrivilege.update){
                btnUpdate.disabled=""
                btnUpdate.style.cursor="pointer"
            }
            else {
                btnUpdate.disabled="disabled"
                btnUpdate.style.cursor="not-allowed"
            }


            btnAdd.disabled="disabled"
            btnAdd.style.cursor="not-allowed"


            selectSupplier.classList.remove('is-invalid')
            textBatchNo.classList.remove('is-invalid')
            selectPdrug.classList.remove('is-invalid')
            textManufactureDate.classList.remove('is-invalid')
            textExpiryDate.classList.remove('is-invalid')
            textTotalQty.classList.remove('is-invalid')
            textAvailQty.classList.remove('is-invalid')
            textSalesAvailQty.classList.remove('is-invalid')
            textPurchasePrice.classList.remove('is-invalid')
            textSalesPrice.classList.remove('is-invalid')

            batch=rowOb
            console.log(batch)


            batchrefreshbtn.style.visibility = 'visible'

            suppliers=ajaxGetReq("/supplier/findall");
            console.log(suppliers)
            fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name',batch.supplier_id.name)
            selectSupplier.classList.add("is-valid")
            selectSupplier.disabled=true

            pdrugdetails.push(batch.purchasedrug_id)
            fillDataIntoSelect(selectPdrug,"Select Purchase Item",pdrugdetails,'name',batch.purchasedrug_id.name)
            selectPdrug.classList.add("is-valid")

            textBatchNo.value=batch.batchno
            textBatchNo.classList.add("is-valid")

            textManufactureDate.value=batch.manufacturedate
            textManufactureDate.classList.add("is-valid")



            textExpiryDate.value=batch.expirydate
            textExpiryDate.classList.add("is-valid")


            textTotalQty.value=batch.purchasedrugtotalqty
            textTotalQty.classList.add("is-valid")

            textAvailQty.value=batch.purchasedrugavailableqty
            textAvailQty.classList.add("is-valid")

            textSalesAvailQty.value=batch.salesdrugavailableqty
            textSalesAvailQty.classList.add("is-valid")

            textPurchasePrice.value=parseFloat(batch.purchaseprice).toFixed(2)
            textPurchasePrice.classList.add("is-valid")


            textSalesPrice.value=parseFloat(batch.saleprice).toFixed(2)
            textSalesPrice.classList.add("is-valid")



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

    if (batch.manufacturedate!=batchold.manufacturedate) {
        updateForm=updateForm + "Manufacture Date " +batchold.manufacturedate+ " changed into " +batch.manufacturedate+"<br>";
    }

    if (batch.expirydate!=batchold.expirydate) {
        updateForm=updateForm + "Expiry Date " +batchold.expirydate+ " changed into " +batch.expirydate+"<br>";
    }

    if (batch.purchasedrugtotalqty!=batchold.purchasedrugtotalqty) {
        updateForm=updateForm + "Purchase Drug Total Quantity " +batchold.purchasedrugtotalqty+ " changed into " +batch.purchasedrugtotalqty+"<br>";
    }
    if (batch.purchasedrugavailableqty!=batchold.purchasedrugavailableqty) {
        updateForm=updateForm + "Purchase Drug Available Quantity " +batchold.purchasedrugavailableqty+ " changed into " +batch.purchasedrugavailableqty+"<br>";
    }
    if (batch.salesdrugavailableqty!=batchold.salesdrugavailableqty) {
        updateForm=updateForm + "Sales Drug Available Quantity " +batchold.salesdrugavailableqty+ " changed into " +batch.salesdrugavailableqty+"<br>";
    }
    if (batch.purchaseprice!=batchold.purchaseprice) {
        updateForm=updateForm + "Purchase Price " +batchold.purchaseprice+ " changed into " +batch.purchaseprice+"<br>";
    }  if (batch.saleprice!=batchold.saleprice) {
        updateForm=updateForm + "Sale Price " +batchold.saleprice+ " changed into " +batch.saleprice+"<br>";
    }



    return updateForm;
}

//button update
const buttonBatchUpdate=()=>{

    console.log(batch);
    // check form errors
    let formErrors=checkBatchFormError();
    let  div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    if (formErrors==""){
        //form update
        let newUpdate=checkUpdate();
        if (newUpdate != ""){
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/batch","PUT",batch);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Batch record updated successfully!",

                            icon: "success"
                        });
                      refreshBatchTable()
                        refreshBatchForm()
                        // hide the modal
                        $('a[href="#BatchTable"]').tab('show');
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
        div.innerHTML=formErrors
        Swal.fire({
            title: " Form has Following errors",
                  html:div,
            icon: "warning"
        });
    }

}





//grn table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print batch table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Batch table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Batch Table Details<h2>'+
                tableBatch.outerHTML
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






const buttonBatchClear=()=>{
    selectSupplier.value=''
    selectSupplier.classList.remove('is-valid')
    selectSupplier.classList.add('is-invalid')

    textBatchNo.classList.remove('is-valid')
    textBatchNo.classList.add('is-invalid')
    textBatchNo.value=''


    selectPdrug.classList.remove('is-valid')
    selectPdrug.classList.add('is-invalid')
    selectPdrug.value=''


    textExpiryDate.classList.remove('is-valid')
    textExpiryDate.classList.add('is-invalid')
    textExpiryDate.value=''



    textManufactureDate.classList.remove('is-valid')
    textManufactureDate.classList.add('is-invalid')
    textManufactureDate.value=''



    textTotalQty.classList.remove('is-valid')
    textTotalQty.classList.add('is-invalid')
    textTotalQty.value=''




    textAvailQty.classList.remove('is-valid')
    textAvailQty.classList.add('is-invalid')
    textAvailQty.value=''

    textSalesAvailQty.classList.remove('is-valid')
    textSalesAvailQty.classList.add('is-invalid')
    textSalesAvailQty.value=''

    textPurchasePrice.classList.remove('is-valid')
    textPurchasePrice.classList.add('is-invalid')
    textPurchasePrice.value=''

    textSalesPrice.classList.remove('is-valid')
    textSalesPrice.classList.add('is-invalid')
    textSalesPrice.value=''




}


// calculate sale price when user add the purchase price
// if the conversion factor is not 0 mean that the drug is a  medicine
// calculate by diving the purchase price by conversion factor  for drugs and for others purchase price=sales price
const calculateSalePrice=()=>{


        if (selectPdrug.value!=''){
            if (new RegExp('^[1-9][0-9]{1,5}(\\.[0-9]{2})?$').test(textPurchasePrice.value)){
            drugConversionFactor=ajaxGetReq("/purchasedrug/getconversionfactorbydrugid/"+JSON.parse(selectPdrug.value).id)
            console.log(drugConversionFactor)
            console.log(typeof(drugConversionFactor))
            if (drugConversionFactor=='0'){
                console.log('im inside')
                textSalesPrice.value=parseFloat(textPurchasePrice.value).toFixed(2)
                batch.saleprice=textSalesPrice.value
                textSalesPrice.classList.add('is-valid')
                textSalesPrice.classList.remove('is-invalid')
            }else {
                console.log('im outside')
                textSalesPrice.value=parseFloat(textPurchasePrice.value/drugConversionFactor).toFixed(2)
                batch.saleprice=parseFloat(textSalesPrice.value).toFixed(2)
                textSalesPrice.classList.add('is-valid')
                textSalesPrice.classList.remove('is-invalid')

            }

            }

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select the drug name first.',
                confirmButtonText: 'OK'
            });

            textPurchasePrice.value=''
            textPurchasePrice.classList.remove('is-valid')

        }





}

// add two decimal places to the purchase price
const insertDecimalPoints=()=>{
    textPurchasePrice.value=parseFloat(textPurchasePrice.value).toFixed(2)
}

// when user changes the drug name then empty the price fields

const checkPriceFields=()=>{


    textSalesPrice.value=''
    batch.saleprice=null
    textSalesPrice.classList.remove('is-valid')
    textSalesPrice.classList.remove('is-invalid')

    textPurchasePrice.value=''
    batch.purchaseprice=null
    textPurchasePrice.classList.remove('is-valid')
    textPurchasePrice.classList.remove('is-invalid')



    textTotalQty.value='0'
    textTotalQty.classList.add("is-valid");
    batch.purchasedrugtotalqty= textTotalQty.value

    textAvailQty.value='0'
    textAvailQty.classList.add("is-valid");
    batch.purchasedrugavailableqty= textAvailQty.value

    textSalesAvailQty.value='0'
    textSalesAvailQty.classList.add("is-valid");
    batch.salesdrugavailableqty= textSalesAvailQty.value
}
