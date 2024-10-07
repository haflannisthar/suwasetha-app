window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Purchase Order");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshPorderTable()
    refreshPorderForm();

    $('[data-toggle="tooltip"]').tooltip()



})
// //function to refresh table
const refreshPorderTable=()=>{
    pOrderList=ajaxGetReq("/purchaseorder/findall");

    const displayProperty=[
             {property:'code',datatype:'string'},
          {property:getSupplierNameAndCode,datatype:'function'},
          {property:'requireddate',datatype:'string'},
          {property:getTotalAmountForTable,datatype:'function'},
          {property:getOrderStatus,datatype:'function'}

    ]
    fillDataIntoTable(tablePurchaseOrder,pOrderList,displayProperty,refillPorderForm,deletePorder,printPorder,true,UserPrivilege);



     // disable the refill button for received order and delete button for deleted order
     disableDeleteAndRefillBtn();

    $('#tablePurchaseOrder').dataTable();

}


// function to get order status and fill in table
const  getOrderStatus=(rowOb)=>{
    if (rowOb.porderstatus_id.name==='Requested') {
        return '<p ><span class="text-info border border-info rounded text-center p-1 ">'+rowOb.porderstatus_id.name+'</span></p>'
    }
    if (rowOb.porderstatus_id.name==='Received') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.porderstatus_id.name+'</span></p>'
    }

    if (rowOb.porderstatus_id.name==='Cancelled') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.porderstatus_id.name+'</span></p>'
    }
    if (rowOb.porderstatus_id.name==='Deleted') {
        return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.porderstatus_id.name+'</span></p>'
    }

}

// function to get suppliername
const  getSupplierNameAndCode=(rowOb)=>{
    return rowOb.supplier_id.regno+"-"+ rowOb.supplier_id.name;
}

// function to get total amount
const  getTotalAmountForTable=(rowOb)=>{
    return parseFloat(rowOb.totalamount).toFixed(2);
}


//
// // delete button disable for deleted status and disable refill button for received status
// calculate the hours diff and if it is greater than 3 hours then disable delete button
const  disableDeleteAndRefillBtn=()=>{
    const tablePOrder = document.getElementById("tablePurchaseOrder");
    const tableRows = tablePOrder.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(6) p"); // Adjusted selector for status cell
        const orderCodeCell = row.querySelector("td:nth-child(2)"); // Adjusted selector for status cell

        let orderStatus=ajaxGetReq("/purchaseorder/disablebtn/"+orderCodeCell.textContent.trim());

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(7)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");
            const updateButton = dropdown.querySelector(".btn-info");

            if (UserPrivilege.delete){
                if (statusValue === "Deleted" || statusValue==="Received") {
                    deleteButton.disabled = true;
                    deleteButton.style.display = "none";

                }else if (statusValue === "Requested") {
                    if (orderStatus===true) {

                        deleteButton.disabled = false;
                        deleteButton.style.display = "inline-block";

                        // updateButton.disabled = false;
                        // updateButton.style.display = "inline-block";

                    } else {
                        deleteButton.disabled = true;
                        deleteButton.style.display = "none";

                        // updateButton.disabled = true;
                        // updateButton.style.display = "none";
                    }
                }


            }
            if (statusValue==="Received"){
                updateButton.disabled = true;
                updateButton.style.display = "none";
            }

        }




    });
}



const refreshPorderForm=()=>{


    porderTitle.innerHTML='New Purchase Order Enrollment'
    purchaseorderrefreshbtn.style.visibility = 'visible'


    purchaseorder={}
    purchaseorder.purchaseOrderHasPurchaseDrugList=[]

    pOrderStatus=ajaxGetReq("/porderstatus/findall");

    fillDataIntoSelect(selectPurchaseOrderStatus,"Select Status",pOrderStatus,'name',"Requested")
    selectPurchaseOrderStatus.classList.add("is-valid")
    purchaseorder.porderstatus_id=JSON.parse(selectPurchaseOrderStatus.value)
    selectPurchaseOrderStatus.disabled=true


    supplierList=ajaxGetReq("/supplier/findall");
    fillDataIntoSelect(selectSupplier,"Select Supplier",supplierList,'name')
    selectSupplier.disabled=false;


    // refresh inner form and table
    refreshInnerDrugFormAndTable();


    //
    // // set default value
    selectSupplier.value=''
    textRequiredDate.value=''
    textTotalAmount.value=''

    textNote.value=''
    txtPurchaseDrug.value=''
    textUnitPrice.value=''
    textQuantity.value=''
    textLinePrice.value=''
    //
    //
    // //remove valid and invalid color
    selectSupplier.classList.remove('is-valid')
    textRequiredDate.classList.remove('is-valid')
    textTotalAmount.classList.remove('is-valid')
    textNote.classList.remove('is-valid')
    txtPurchaseDrug.classList.remove('is-valid')
    textUnitPrice.classList.remove('is-valid')
    textQuantity.classList.remove('is-valid')
    textLinePrice.classList.remove('is-valid')

    selectSupplier.classList.remove('is-invalid')
    textRequiredDate.classList.remove('is-invalid')
    textTotalAmount.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')
    txtPurchaseDrug.classList.remove('is-invalid')
    textUnitPrice.classList.remove('is-invalid')
    textQuantity.classList.remove('is-invalid')
    textLinePrice.classList.remove('is-invalid')
    selectPurchaseOrderStatus.classList.remove("is-invalid")


    // set date
    let currentDate=new Date();
    let maxDate= new Date()

    let minMonth =currentDate.getMonth()+1;
    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= currentDate.getDate();
    if (minDay < 10){
        minDay='0'+ minDay;
    }
    textRequiredDate.min=currentDate.getFullYear() +"-"+ minMonth+"-"+minDay;



    maxDate.setDate(maxDate.getDate()+30);

    let maxDay=maxDate.getDate();
    if (maxDay <10){
        maxDay='0'+maxDay;
    }

    let maxMonth=maxDate.getMonth()+1;
    if (maxMonth<10){
        maxMonth='0'+maxMonth;

    }
    textRequiredDate.max=maxDate.getFullYear()+"-"+maxMonth+"-"+maxDay

    //

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

// refresh inner form and inner table
const refreshInnerDrugFormAndTable=()=>{


    purchaseorderdrug={}

    purchaseItemList=ajaxGetReq("/purchasedrug/availablelist");

    // fillDataIntoSelect(selectPurchaseDrug,"Select Item",purchaseItemList,'name')
    fillDataIntoDataList(datalistitems,purchaseItemList,'name')

    // disable fields
    txtPurchaseDrug.disabled=true
    textUnitPrice.disabled=true
    textQuantity.disabled=true

//     empty all element
    txtPurchaseDrug.value=''
    textUnitPrice.value=''
    textUnitPrice.disabled=true

    textQuantity.value=''
    textQuantity.disabled=true
    textLinePrice.value=''
    textLinePrice.disabled=true

//     default color
    txtPurchaseDrug.classList.remove("is-valid")
        textUnitPrice.classList.remove("is-valid")
        textQuantity.classList.remove("is-valid")
        textLinePrice.classList.remove("is-valid")

    txtPurchaseDrug.classList.remove("is-invalid")
    textUnitPrice.classList.remove("is-invalid")
    textQuantity.classList.remove("is-invalid")
    textLinePrice.classList.remove("is-invalid")
//     refresh inner table

    const displayInnerTableProperty=[
        {property:getPurchaseItemName,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'quantity',datatype:'string'},
          {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTable(purchaseiteminnertable, purchaseorder.purchaseOrderHasPurchaseDrugList,displayInnerTableProperty,deleteInnerItemForm)

    // calculate total amount and set it to total amount input field
    let totalAmount=0.00;

    purchaseorder.purchaseOrderHasPurchaseDrugList.forEach(element=>{
        totalAmount=parseFloat(totalAmount)+ parseFloat(element.lineprice);
    })
    textTotalAmount.value= parseFloat(totalAmount).toFixed(2)
    textTotalAmount.classList.add("is-valid");

    if (totalAmount==0.00){
        purchaseorder.totalamount=null
    }else {
        purchaseorder.totalamount=textTotalAmount.value;

    }


    if (selectSupplier.value==''){

        txtPurchaseDrug.disabled=true
    }
    else {
        filterItemBySupplier()
        txtPurchaseDrug.disabled=false
    }


}




// get user confirmation before form refresh
const  refreshPurchaseOrderFormByUserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form",
        text: "Entered Data will be erased",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPorderForm();
        }
    });
}

// enable item if supplier is selected
const  enableItemField=()=>{
    if (selectSupplier.value==''){
        txtPurchaseDrug.disabled=true;
    }else {
        txtPurchaseDrug.disabled=false;
        selectSupplier.disabled=true
    }
}

// enable unit price if item is selected
const  enableUnitPrice=()=>{
    if (txtPurchaseDrug.value=='' && purchaseorderdrug.purchasedrug_id==null){
        textUnitPrice.disabled=true;
    }else {
        textUnitPrice.disabled=false;
    }
}

// enable quantity if unit price is entered
const  enableQuantityField=()=>{

        if (new RegExp("^[1-9][0-9]{1,5}(\\.[0-9]{2})?$").test(textUnitPrice.value)){
            textQuantity.disabled=false;
        }


    else {
        textQuantity.disabled=true;
    }
}

// add two decimal places to the unit price
const insertDecimalPoints=()=>{
    textUnitPrice.value=parseFloat(textUnitPrice.value).toFixed(2)
}


// filter drugs by supplier
const  filterItemBySupplier=()=>{
    filteredItemListBySupplier=ajaxGetReq("/purchasedrug/filtereddruglist/"+JSON.parse(selectSupplier.value).id)
    fillDataIntoDataList(datalistitems,filteredItemListBySupplier,'name')
    txtPurchaseDrug.classList.remove("is-valid")
    txtPurchaseDrug.classList.remove("is-invalid")
}


const checkAvailableQty=()=>{
    let selectedItem=txtPurchaseDrug.value;
    console.log(filteredItemListBySupplier)
    let extIndex= filteredItemListBySupplier.map(purchasedrug=>purchasedrug.name).indexOf(selectedItem)

    if (extIndex != -1){
        supplierAvailableQty=ajaxGetReq("/purchasedrug/getavailableqty/"+filteredItemListBySupplier[extIndex].id +"/"+JSON.parse(selectSupplier.value).id)
        console.log(supplierAvailableQty)

    }else{
        txtPurchaseDrug.value=''
        textUnitPrice.value=''
        textQuantity.value=''
        textLinePrice.value=''

        txtPurchaseDrug.classList.remove('is-valid')
        textUnitPrice.classList.remove('is-valid')
        textQuantity.classList.remove('is-valid')
        textLinePrice.classList.remove('is-valid')


    }


}

const clearInputFields=()=>{
    let selectedItem=txtPurchaseDrug.value;
    console.log(filteredItemListBySupplier)
    let extIndex= filteredItemListBySupplier.map(purchasedrug=>purchasedrug.name).indexOf(selectedItem)

    if (extIndex == -1){
        txtPurchaseDrug.value=''
        textUnitPrice.value=''
        textQuantity.value=''
        textLinePrice.value=''

        txtPurchaseDrug.classList.remove('is-valid')
        textUnitPrice.classList.remove('is-valid')
        textQuantity.classList.remove('is-valid')
        textLinePrice.classList.remove('is-valid')
    }
}

const validateQuantity=()=>{
   let quantityValue=textQuantity.value


    if (quantityValue>supplierAvailableQty){
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Quantity',
            text: 'Entered Quantity is greater than available Quantity',
            confirmButtonText: 'OK'
        });


        btnInnerForm.disabled=true
    }else{
        btnInnerForm.disabled=false

    }
}

// get purchase item name to fill into inner table
const getPurchaseItemName=(ob)=>{
    return ob.purchasedrug_id.name;
}
// get unit price
const getUnitPrice=(ob)=>{
    return parseFloat(ob.unitprice).toFixed(2)
}
// get line price
const getLinePrice=(ob)=>{
    return parseFloat(ob.lineprice).toFixed(2)
}

//delete inner table row
const deleteInnerItemForm=(rowOb,rowInd)=>{
// user confirmation
    let itemInfo=rowOb.purchasedrug_id.name
    Swal.fire({
        title: "Are you sure to remove following item record?",
        html: itemInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {

            purchaseorder.purchaseOrderHasPurchaseDrugList.splice(rowInd,1)

            Swal.fire({
                    title: "Removed  Successfully!",
                     icon: "success"
                });
            refreshInnerDrugFormAndTable()


        }
        else {
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }

    });

}

// duplicate entry checking in table
const checkItem=()=>{
    let selectedItem=txtPurchaseDrug.value;

    let extIndex= purchaseorder.purchaseOrderHasPurchaseDrugList.map(purchaseorderdrug=>purchaseorderdrug.purchasedrug_id.name).indexOf(selectedItem)

    if (extIndex != -1){
        let timerInterval;
        Swal.fire({
            title: "item already entered to table",
            timer: 1000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            btnInnerForm.disabled=true
        });
    }
    else {


        btnInnerForm.disabled=false
    }



}


// check in auto suggestion values
const checkValidItem=()=>{

    let selectedItem=txtPurchaseDrug.value;

    filteredItemListBySupplier=ajaxGetReq("/purchasedrug/filtereddruglist/"+JSON.parse(selectSupplier.value).id)



 let checkStatus=false;
    for (let i=0; i<=filteredItemListBySupplier.length-1; i++){
        console.log(filteredItemListBySupplier[i].name)
        if (filteredItemListBySupplier[i].name===selectedItem){
            checkStatus=true
            break;
        }
    }

    if (!checkStatus){
        let timerInterval;
        Swal.fire({
            html: "Invalid item selected. Please select a proper item.",
            timer: 3000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            btnInnerForm.disabled=true
        });
    }else {
        btnInnerForm.disabled=false
    }


}

const checkInnerFormError=()=>{
    let errors=''
  if(purchaseorderdrug.purchasedrug_id==null || txtPurchaseDrug.value==''){
      errors+="please select a purchase item<br>"
      txtPurchaseDrug.classList.add("is-invalid");
  }
    if(purchaseorderdrug.unitprice==null || textUnitPrice.value==''){
        errors+="please enter valid a unit price<br>"
        textUnitPrice.classList.add("is-invalid");
    }
    if(purchaseorderdrug.quantity==null || textQuantity.value==''){
        errors+="please enter valid quantity<br>"
        textQuantity.classList.add("is-invalid");
    }
    // if(purchaseorderdrug.lineprice==null || textLinePrice.value==''){
    //     errors+="please select a purchase item<br>"
    //     textLinePrice.classList.add("is-invalid");
    // }
    return errors;
}
// calculate the line price
const calculateLinePrice=()=>{

    let qty= textQuantity.value

    if (new RegExp("^[1-9][0-9]{0,3}$").test(qty)){
        textLinePrice.value=(parseFloat(textUnitPrice.value) * parseFloat(qty)).toFixed(2);
        purchaseorderdrug.lineprice=textLinePrice.value
        textLinePrice.classList.add("is-valid")
        textLinePrice.classList.remove("is-invalid")

        validateQuantity()
    }
    else {
        textLinePrice.value=''
        textLinePrice.classList.add("is-invalid")
        textLinePrice.classList.remove("is-valid")
    }


}

// inner form button add
const btnInnerDrugAdd=()=>{
//     check for error
    let error=checkInnerFormError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'



    if(error==''){

        // purchase item data to show and to get user confirmation
        let purchaseItemNames=  `Purchase item: ${purchaseorderdrug.purchasedrug_id.name}<br>
                                               Unit price: ${purchaseorderdrug.unitprice} <br>
                                              Quantity: ${purchaseorderdrug.quantity} <br>
                                               Line price: ${purchaseorderdrug.lineprice}`
    //     get user confirmation

        div.innerHTML=purchaseItemNames
        Swal.fire({
            title: "Are you sure to add the following purchase item?",
             html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Purchase Item Added Successfully!",

                    icon: "success"
                });

                //     push into array
                purchaseorder.purchaseOrderHasPurchaseDrugList.push(purchaseorderdrug);
                refreshInnerDrugFormAndTable()

            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Action Aborted"


                });
            }

        });

    }
    else {
        div.innerHTML=error
        Swal.fire({
            icon: "error",
            title:'Form has Following Errors.',
            html:div,


        });
    }

}

// delete function for order delete
const  deletePorder=(rowOb)=>{

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    let pOrderInfo = `Purchase Order Code: ${rowOb.code}<br>
                 Supplier Name: ${rowOb.supplier_id.name}<br>`

    div.innerHTML=pOrderInfo
    Swal.fire({
        title: "Are you sure to delete following Purchase Order?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverRespnse=ajaxRequestBody("/purchaseorder","DELETE",rowOb)
            if (serverRespnse=="OK") {


                Swal.fire({
                    title: "Purchase Order Deleted Successfully!",

                    icon: "success"
                });
                refreshPorderTable()




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


// print porder details method
const  printPorder=(rowOb)=>{

    const pOrderPrint=rowOb;

    tdPorderNumber.innerHTML=pOrderPrint.code
    tdRequiredDate.innerHTML=pOrderPrint.requireddate
    tdTotalAmount.innerHTML=parseFloat(pOrderPrint.totalamount).toFixed(2)
    tdPOrderStatus.innerHTML=pOrderPrint.porderstatus_id.name
    tdSupplierName.innerHTML=pOrderPrint.supplier_id.regno+"-"+pOrderPrint.supplier_id.name
    if (pOrderPrint.note==null){
        tdNote.innerHTML=" "
    }
    else {
        tdNote.innerHTML=pOrderPrint.note
    }


    tdMobile.innerHTML=pOrderPrint.supplier_id.contactno

    const displayInnerTableProperty=[
        {property:getPurchaseItemName,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'quantity',datatype:'string'},
        {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTable(printinnertable, pOrderPrint.purchaseOrderHasPurchaseDrugList,displayInnerTableProperty,deleteInnerItemForm,false)


    let addedUser=ajaxGetReq("/user/getuserbyid/"+rowOb.addeduser);
    tdUser.innerHTML=addedUser.username;

    let PrintInfo = `Order Number : ${pOrderPrint.code}<br>
                 Supplier Name :  ${pOrderPrint.supplier_id.name}`

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=PrintInfo
    Swal.fire({
        title: "are you sure Print following Purchase Order Details?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printPorderDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}


// function to print patient details
const printPorderDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Purchase Order Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printPurchaseOrderTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}



// check form error
const  checkError=()=>{

    let errors="";

    if ( purchaseorder.supplier_id==null || selectSupplier.value=='' ) {
        errors =errors + "Please select a supplier<br>"
        selectSupplier.classList.add('is-invalid')
    }
    if ( purchaseorder.requireddate==null || textRequiredDate.value=='' ) {
        errors =errors + "Please select required date<br>"
        textRequiredDate.classList.add('is-invalid')

    }

    if ( purchaseorder.porderstatus_id==null || selectPurchaseOrderStatus.value=='' ) {
        errors =errors + "Please select a order status<br>"
        selectPurchaseOrderStatus.classList.add('is-invalid')
    }

    if ( purchaseorder.purchaseOrderHasPurchaseDrugList.length==0  ) {
         errors =errors + "Please select items to order<br>"
        // selectPurchaseDrug.classList.add('is-invalid')
        // textUnitPrice.classList.add('is-invalid')
        // textQuantity.classList.add('is-invalid')
        //

        errors+=checkInnerFormError();
    }





    return errors;
}


// purchase order add function
const buttonPurchaseOrderAdd=()=>{

    console.log(purchaseorder)
    let error=checkError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


    if (error==''){

        // show purchase order itm to user
        let purchaseOrderItemInfo=''

        let purchaseOrderItemList=[]
        for (let element of purchaseorder.purchaseOrderHasPurchaseDrugList){

            purchaseOrderItemList.push(element);
        }

        if (purchaseOrderItemList.length>0){
            purchaseOrderItemInfo+="Purchase Item List : <br>";
            purchaseOrderItemInfo+='<table style="border: 1px solid black;font-size:14px"><tr><th style="border: 1px solid black">P-item</th><th style="border: 1px solid black">unit price</th><th style="border: 1px solid black">quantity</th><th style="border: 1px solid black">line price</th></tr>';

            purchaseOrderItemList.forEach(element=>{
                purchaseOrderItemInfo+='<tr style="border: 1px solid black">'+
                    '<td style="border: 1px solid black">'+element.purchasedrug_id.name+'</td>'+
                    '<td style="border: 1px solid black">'+element.unitprice+'</td>'+
                    '<td style="border: 1px solid black">'+element.quantity.slice(0,5)+'</td>'+
                    '<td style="border: 1px solid black">'+element.lineprice+'</td>'+
                    '</tr>'


            })
            purchaseOrderItemInfo += '</table><br>';
        }


         let orderInfo = `Supplier Name: ${purchaseorder.supplier_id.name}<br>
                 Required Date: ${purchaseorder.requireddate}<br>
                  Total Amount: ${purchaseorder.totalamount}<br>
                 Status: ${purchaseorder.porderstatus_id.name}<br><br> 
                 ${purchaseOrderItemInfo}
                   `;

        div.innerHTML=orderInfo
        div.style.fontSize='16px'

        Swal.fire({
            title: "Are you sure to place following Purchase Order?",
            html: div,
            icon: "warning",
            width:'650px',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/purchaseorder","POST",purchaseorder);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Purchase Order record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshPorderForm()
                    refreshPorderTable()
                    refreshInnerDrugFormAndTable()

                    $('a[href="#PurchaseOrderTable"]').tab('show');

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
        div.innerHTML=error;
        Swal.fire({
            icon: "error",
            title: "Form has following errors",
            html: div


        });
    }
}

const refillPorderForm=(rowOb)=>{

    porderTitle.innerHTML='Purchase Order Update'


    purchaseorder=JSON.parse(JSON.stringify(rowOb))
    purchaseorderold=JSON.parse(JSON.stringify(rowOb))

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    let refillpOrderInfo=`purchase order number : ${rowOb.code} <br>
                                   supplier name : ${rowOb.supplier_id.name} `

    div.innerHTML=refillpOrderInfo
    Swal.fire({
        title: "Are you sure to edit the following purchase order?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#PurchaseOrderForm"]').tab('show');


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


            purchaseorder=rowOb

            selectSupplier.classList.remove('is-invalid')
            textRequiredDate.classList.remove('is-invalid')
            textTotalAmount.classList.remove('is-invalid')
            textNote.classList.remove('is-invalid')
            txtPurchaseDrug.classList.remove('is-invalid')
            textUnitPrice.classList.remove('is-invalid')
            textQuantity.classList.remove('is-invalid')
            textLinePrice.classList.remove('is-invalid')
            selectPurchaseOrderStatus.classList.remove("is-invalid")




            textRequiredDate.value=purchaseorder.requireddate
            textRequiredDate.classList.add("is-valid")

            textTotalAmount.value=purchaseorder.totalamount
            textTotalAmount.classList.add("is-valid")

            fillDataIntoSelect(selectPurchaseOrderStatus,'Select  Status',pOrderStatus,'name',purchaseorder.porderstatus_id.name)
            selectPurchaseOrderStatus.classList.add("is-valid")

            if(purchaseorder.note!=null) {
                textNote.value = purchaseorder.note
                textNote.classList.add("is-valid")
            }else{
                textNote.value=""
            }

            // fillDataIntoSelect(selectPurchaseDrug,"Select Item",purchaseItemList,'name')






            fillDataIntoSelect(selectSupplier,'Select Supplier',supplierList,'name',purchaseorder.supplier_id.name)
            selectSupplier.classList.add("is-valid")
            selectSupplier.disabled=true;

            refreshInnerDrugFormAndTable()

            filteredItems=ajaxGetReq("/purchasedrug/filtereddruglist/"+JSON.parse(selectSupplier.value).id)
            // console.log(filteredItems)
            fillDataIntoSelect(txtPurchaseDrug,"Select Item",filteredItems,'name')
            txtPurchaseDrug.disabled=false

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

    if (purchaseorder.supplier_id.name!=purchaseorderold.supplier_id.name) {
        updateForm=updateForm + "Supplier " +purchaseorderold.supplier_id.name+ " changed into " + purchaseorder.supplier_id.name +"<br>";
    }

    if (purchaseorder.requireddate!=purchaseorderold.requireddate) {
        updateForm=updateForm + "Required date " +purchaseorderold.requireddate+ " changed into " + purchaseorder.requireddate +"<br>";
    }
    if (purchaseorder.totalamount!=purchaseorderold.totalamount) {
        updateForm=updateForm + "Total amount " +purchaseorderold.totalamount+ " changed into " + purchaseorder.totalamount +"<br>";
    }
    if (purchaseorder.porderstatus_id.name!=purchaseorderold.porderstatus_id.name) {
        updateForm=updateForm + "Status " +purchaseorderold.porderstatus_id.name+ " changed into " + purchaseorder.porderstatus_id.name +"<br>";
    }
    if (purchaseorder.note!=purchaseorderold.note) {
        updateForm=updateForm + "Note " +purchaseorderold.note+ " changed into " + purchaseorder.note +"<br>";
    }

        let newlyAdded=[]
        for (let element of purchaseorder.purchaseOrderHasPurchaseDrugList){
            let extCount=purchaseorderold.purchaseOrderHasPurchaseDrugList.map(item=>item.id).indexOf(element.id)
            if (extCount==-1){
                // updateForm=updateForm + "Categories changed " +"<br>";
                newlyAdded.push(element);
            }

        }
    if (newlyAdded.length>0){
        updateForm+="Updated Order Item List : <br>";
        updateForm+='<table style="border: 1px solid black"><tr><th style="border: 1px solid black">P-item</th><th style="border: 1px solid black">unit price</th><th style="border: 1px solid black">quantity</th><th style="border: 1px solid black">line price</th></tr>';

        newlyAdded.forEach(element=>{
            updateForm+='<tr style="border: 1px solid black">'+
                '<td style="border: 1px solid black">'+element.purchasedrug_id.name+'</td>'+
                '<td style="border: 1px solid black">'+element.unitprice+'</td>'+
                '<td style="border: 1px solid black">'+element.quantity+'</td>'+
                '<td style="border: 1px solid black">'+element.lineprice+'</td>'+
                '</tr>'


        })
        updateForm += '</table><br><br>';
    }

    let removedItemList=[]
    for (let element of purchaseorderold.purchaseOrderHasPurchaseDrugList){
        let extCount=purchaseorder.purchaseOrderHasPurchaseDrugList.map(item=>item.id).indexOf(element.id)
        if (extCount==-1){
            // updateForm=updateForm + "Categories changed " +"<br>";
            removedItemList.push(element);
        }

    }
    if (removedItemList.length>0){
        updateForm+="Removed Order Item List : <br>";
        updateForm+='<table style="border: 1px solid black"><tr><th style="border: 1px solid black">P-item</th><th style="border: 1px solid black">unit price</th><th style="border: 1px solid black">quantity</th><th style="border: 1px solid black">line price</th></tr>';

        removedItemList.forEach(element=>{
            updateForm+='<tr style="border: 1px solid black">'+
                '<td style="border: 1px solid black">'+element.purchasedrug_id.name+'</td>'+
                '<td style="border: 1px solid black">'+element.unitprice+'</td>'+
                '<td style="border: 1px solid black">'+element.quantity+'</td>'+
                '<td style="border: 1px solid black">'+element.lineprice+'</td>'+
                '</tr>'


        })
        updateForm += '</table><br><br>';
    }





    return updateForm;
}
//button update
const buttonPurchaseOrderUpdate=()=>{


    // check form errors
    let formErrors=checkError();

    let div=document.createElement('div');
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
                width:'650px',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    let   ajaxUpdateResponse=ajaxRequestBody("/purchaseorder","PUT",purchaseorder);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Purchase Order record updated successfully!",

                            icon: "success"
                        });
                         refreshPorderForm()
                        refreshPorderTable()
                        // hide the modal
                        $('a[href="#PurchaseOrderTable"]').tab('show');
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
            title: " Form has following errors",
                  html:div,
            icon: "warning"
        });
    }

}





//p-order table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Purchase Order table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Purchasae Order Table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Purchasae Order Table Details<h2>'+
                tablePurchaseOrder.outerHTML

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




// purchase order button clear
const buttonPurchaseOrderClear=()=>{

    selectSupplier.disabled=false
    selectSupplier.value=''
    selectSupplier.classList.remove('is-valid')
    selectSupplier.classList.add('is-invalid')



    textRequiredDate.classList.remove('is-valid')
    textRequiredDate.classList.add('is-invalid')
    textRequiredDate.value=''


    textTotalAmount.classList.remove('is-valid')
    textTotalAmount.value=''


    selectPurchaseOrderStatus.classList.remove('is-valid')
    selectPurchaseOrderStatus.classList.add('is-invalid')
    selectPurchaseOrderStatus.value=''



    textNote.classList.remove('is-valid')
    textNote.value=''





    textNote.classList.remove('is-valid')
    textNote.value=''


    textLinePrice.classList.remove('is-valid')
    textLinePrice.value=''

    purchaseorder.purchaseOrderHasPurchaseDrugList=[]
    refreshInnerDrugFormAndTable();



}


