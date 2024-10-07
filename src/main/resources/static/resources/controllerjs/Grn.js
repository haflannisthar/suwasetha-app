window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Grn");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshGrnTable()
    refreshGrnForm();
    refreshBatchForm()

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshGrnTable=()=>{
    grnDataList=ajaxGetReq("/grn/findall");

    const displayProperty=[
             {property:'grnno',datatype:'string'},
          {property:'receiveddate',datatype:'string'},
          {property:getNetAmount,datatype:'function'},
          {property:getPorderCode,datatype:'function'},
          {property:'supplierbillno',datatype:'string'},
          {property:getGrnStatus,datatype:'function'}

    ]
    fillDataIntoTable(tableGrn,grnDataList,displayProperty,refillGrnForm,deleteGrn,printGrn,true,UserPrivilege);

    // grn delete is not allowed so do not allow update
    disableBtnForGrn();

    $('#tableGrn').dataTable();



}
// function to get net amount
const getNetAmount=(rowOb)=>{
    return parseFloat(rowOb.netamount).toFixed(2);
}
// function to get p order code
const getPorderCode=(rowOb)=>{
   return rowOb.purchaseorder_id.code;
}

// get grn status
const  getGrnStatus=(rowOb)=>{
    if (rowOb.grnstatus_id.name=='Fully Completed') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.grnstatus_id.name+'</span></p>'
    }
    if (rowOb.grnstatus_id.name=='Partially Completed') {
        return '<p ><span class="text-primary border border-primary rounded text-center p-1 ">'+rowOb.grnstatus_id.name+'</span></p>'
    }
    if (rowOb.grnstatus_id.name=='Pending') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.grnstatus_id.name+'</span></p>'
    }

}

// delete button disabled
const  disableBtnForGrn=()=>{
    const tableGrn = document.getElementById("tableGrn");
    const tableRows = tableGrn.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(7) p"); // Adjusted selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(8)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");
            const editButton = dropdown.querySelector(".btn-info");

            if (UserPrivilege.delete){

                deleteButton.disabled = true;
                // editButton.disabled = true;

                deleteButton.style.display = "none";
                // editButton.style.display = "none";


            }
            if (UserPrivilege.update){
                if (statusValue==="Fully Completed" || statusValue==="Partially Completed"){
                    editButton.disabled = true;
                    editButton.style.display = "none";
                }
            }

        }


    });
}



// form refresh function
const refreshGrnForm=()=>{

    grnTitle.innerHTML='New Grn Enrollment'




    grn={}
    grn.grnHasBatchList=[]

    grnStatus=ajaxGetReq("/grnstatus/list");
    fillDataIntoSelect(selectGrnStatus,"Select Status",grnStatus,'name',"Pending")
    grn.grnstatus_id=JSON.parse(selectGrnStatus.value);
    selectGrnStatus.disabled=true
    selectGrnStatus.classList.add('is-valid')
    console.log(grn.grnstatus_id)

     suppliers=ajaxGetReq("/supplier/porderedsupplierlist");
    // suppliers=ajaxGetReq("/supplier/findall");
    fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name')

    pOrderNo=ajaxGetReq("/purchaseorder/pOderNumber");
    fillDataIntoSelect(selectPorder,"Select Order Number",pOrderNo,'code')





// set date
    let currentDate=new Date();
    let maxDate= new Date()

    let minMonth =currentDate.getMonth();

    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= currentDate.getDate();
    console.log(minDay)
    if (minDay < 10){
        minDay='0'+ minDay;
    }
    textReceivedDate.min=currentDate.getFullYear() +"-"+ minMonth+"-"+minDay;


    maxDate.setDate(maxDate.getDate());

    let maxDay=maxDate.getDate();
    if (maxDay <10){
        maxDay='0'+maxDay;
    }

    let maxMonth=maxDate.getMonth()+1;
    if (maxMonth<10){
        maxMonth='0'+maxMonth;

    }
    textReceivedDate.max=maxDate.getFullYear()+"-"+maxMonth+"-"+maxDay
    console.log(textReceivedDate.max)
    //


    // refresh inner form and table
    refreshInnerGrnFormAndTable();



    // set default value
    selectPorder.value=''
    textReceivedDate.value=''
    textSBillNo.value=''
    textTotalAmount.value=''
    textDiscountRate.value=''
    textNetAmount.value=''

    textNote.value=''

    selectSupplier.disabled=false;
    selectPorder.disabled=true;
    textDiscountRate.disabled=true;
    textTotalAmount.disabled=true;
    textReceivedDate.disabled=true
    textSBillNo.disabled=true
    textNetAmount.disabled=true

    //remove valid and invalid color
    selectSupplier.classList.remove("is-valid")
    selectPorder.classList.remove('is-valid')
    textReceivedDate.classList.remove('is-valid')
    textSBillNo.classList.remove('is-valid')
    textTotalAmount.classList.remove('is-valid')
    textDiscountRate.classList.remove('is-valid')
    textNetAmount.classList.remove('is-valid')
    // textPaidAmount.classList.remove('is-valid')

    textNote.classList.remove('is-valid')

    selectSupplier.classList.remove("is-invalid")
    selectPorder.classList.remove('is-invalid')
    textReceivedDate.classList.remove('is-invalid')
    textSBillNo.classList.remove('is-invalid')
    textTotalAmount.classList.remove('is-invalid')
    textDiscountRate.classList.remove('is-invalid')
    textNetAmount.classList.remove('is-invalid')
    // textPaidAmount.classList.remove('is-valid')
    selectGrnStatus.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')


    grnReFreshBtn.style.visibility = 'visible'



    btnUpdate.disabled="disabled"
    btnUpdate.style.cursor="not-allowed"

    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

}


// get user confirmation before form refresh
const  refreshGrnFormByUserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshGrnForm();
        }
    });
}
// refresh inner form and inner table
const refreshInnerGrnFormAndTable=()=>{


    grnbatch={}

    purchaseItem=ajaxGetReq("/purchasedrug/availablelist");
    fillDataIntoSelect(selectDrug,"Select Item",purchaseItem,'name')


    batchList=ajaxGetReq("/batch/findall");
    fillDataIntoSelect(selectBatch,"Batch",batchList,'name')

    selectDrug.disabled=false
    selectBatch.disabled=true;
//     empty all element

    selectBatch.value=''

    textUnitPrice.value=''
    textUnitPrice.disabled=true
    textqty.value=''
    textqty.disabled=true
    textLinePrice.value=''
    textLinePrice.disabled=true
    // selectDrug.disabled=true


    if (selectPorder.value==''){
        selectDrug.disabled=true
    }else {
        drugListByPorder = ajaxGetReq("/purchasedrug/getitemlistbyorderid/" + JSON.parse(selectPorder.value).id);
        fillDataIntoSelect(selectDrug, 'Select Item', drugListByPorder, 'name')
    }



//     default color
    selectBatch.classList.remove("is-valid")
    selectDrug.classList.remove("is-valid")
    textUnitPrice.classList.remove("is-valid")
    textqty.classList.remove("is-valid")
    textLinePrice.classList.remove("is-valid")
//     refresh inner table

    const displayInnerTableProperty=[
        {property:getbatchNo,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'qty',datatype:'string'},
        {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTable(batchInnerTable, grn.grnHasBatchList,displayInnerTableProperty,deleteInnerItemForm)

    console.log(grn.grnHasBatchList)
    // calculate total amount and set it to total amount input field
    let totalAmount=0.00;

    grn.grnHasBatchList.forEach(element=>{
        totalAmount=parseFloat(totalAmount)+ parseFloat(element.lineprice);
    })
    textTotalAmount.value= parseFloat(totalAmount).toFixed(2)

    if (totalAmount==0.00){
        grn.totalamount=null
        textTotalAmount.classList.remove("is-valid")
        textNetAmount.classList.remove("is-valid")
        textNetAmount.value='0.00'
        grn.netamount=null

        textDiscountRate.value=''
        textDiscountRate.classList.remove("is-valid")
        grn.discountrate=null

    }else {
        grn.totalamount=textTotalAmount.value;
        textTotalAmount.classList.add("is-valid")

    }

    if (textTotalAmount.value!=0.00){
        calculateNetPrice();
    }



}

// function to get batch no in inner table
const getbatchNo=(ob)=>{
    return ob.batch_id.batchno
}

// function to get unitprice in inner table
const getUnitPrice=(ob)=>{
  return parseFloat(ob.unitprice).toFixed(2)
}

// function to get line price in inner table
const getLinePrice=(ob)=>{
 return  parseFloat(ob.lineprice).toFixed(2)
}


// get order item details by supplier no
const getPorderList=()=>{

    if (selectSupplier.value!='') {
        selectPorder.disabled = false

        pOrderItemDetails = ajaxGetReq("/purchasorder/getporderitemdetailsbysupplier/" + JSON.parse(selectSupplier.value).id);
        console.log(pOrderItemDetails)
        selectSupplier.disabled=true;
        if (pOrderItemDetails.length > 0){
            console.log("greater than 0")
            fillDataIntoSelect(selectPorder, 'Select Order No', pOrderItemDetails, 'code')
        }else {
            let timerInterval;
            Swal.fire({
                html: "no pending purchase order for selected supplier",
                timer: 3000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                selectPorder.disabled=true
                selectSupplier.value=''
                selectSupplier.disabled=false
                grn.supplier_id=null
            });
        }


    }

}

// enable discount field
const enableDiscountField=()=>{



        if (selectPorder.value==''){
            textDiscountRate.disabled=true;
            textReceivedDate.disabled=true
            selectDrug.disabled=true
            textSBillNo.disabled=true
        }
        else {
            textDiscountRate.disabled=false;
            textReceivedDate.disabled=false
            selectDrug.disabled=false
            textSBillNo.disabled=false

        }



}

// calculate net price
const calculateNetPrice=()=>{

    const newP=new RegExp('^(100|[0-9]|[1-9][0-9]?)(\\.[0-9]{1,2})?$')

    if(newP.test(textDiscountRate.value)){
        let netprice=((100-textDiscountRate.value)*textTotalAmount.value)/100;

        // check that the net price is whole number
        if (netprice%1 !==0){
            textNetAmount.value= netprice.toFixed(2)
            textNetAmount.classList.add("is-valid")
            grn.netamount=  textNetAmount.value
        }
        else {
            textNetAmount.value=netprice+'.00'
            textNetAmount.classList.add("is-valid")
            grn.netamount=  textNetAmount.value
        }
    }



}

// get drug list using p order no
const getDrugList=()=>{

    if (selectPorder.value!=''){
        selectPorder.classList.add("is-valid")
    }
    selectDrug.disabled = false
    selectPorder.disabled=true
        druglistByPorder = ajaxGetReq("/purchasedrug/getitemlistbyorderid/" + JSON.parse(selectPorder.value).id);
    console.log(druglistByPorder)
        if (druglistByPorder.length != 0){
            fillDataIntoSelect(selectDrug, 'Select Item', druglistByPorder, 'name')
        }




}
// enable batch field
const enableBatchField=()=>{
    if (selectDrug.value!=''){
        selectDrug.classList.add("is-valid");
        selectBatch.disabled=false;

        batchListByDrugId = ajaxGetReq("/batch/getbatchnobydrugid/" + JSON.parse(selectDrug.value).id);
        fillDataIntoSelect(selectBatch, 'Select Batch', batchListByDrugId, 'batchno')



    }
    else{

        selectBatch.disabled=true;
    }
}



// get the item unit price by batch no and drug name
// drug unit price is loaded from batch after selecting the batch no
// qty loaded from purchase order by drug id and purchase order id
const getItemUnitPrice=()=>{

    if (selectBatch.value!==''){

        textUnitPrice.value=''
        textUnitPrice.classList.remove('is-valid')
        textUnitPrice.classList.remove('is-invalid')
        textqty.value=''
        textqty.classList.remove('is-valid')
        textqty.classList.remove('is-invalid')


        drugUnitPrice= ajaxGetReq("/batch/getdrugunitprice/" + JSON.parse(selectDrug.value).id +"/"+JSON.parse(selectBatch.value).id);
        console.log(drugUnitPrice)


        textUnitPrice.value=parseFloat(drugUnitPrice).toFixed(2)
        textUnitPrice.classList.add("is-valid");

        textUnitPrice.disabled=true;
        grnbatch.unitprice=textUnitPrice.value


        drugOrderedQty= ajaxGetReq("/php/getdrugqty/" + JSON.parse(selectDrug.value).id +"/"+JSON.parse(selectPorder.value).id);
        console.log(drugOrderedQty)


        textqty.value=drugOrderedQty
        textqty.classList.add("is-valid");
        textqty.disabled=false
        grnbatch.qty=textqty.value

        calculateLinePriceInnerForm()

    }


}




// calculate line total for inner form
const calculateLinePriceInnerForm=()=>{
    let qty= textqty.value
    let unitPrice= textUnitPrice.value

    if ((new RegExp("^[1-9][0-9]{0,3}$").test(qty)) && (new RegExp("^[1-9][0-9]{0,7}[.][0-9]{2}$").test(unitPrice))){
        textLinePrice.value=(parseFloat(textUnitPrice.value) * parseFloat(qty)).toFixed(2);
        grnbatch.lineprice=textLinePrice.value
        textLinePrice.classList.add("is-valid")
        textLinePrice.classList.remove("is-invalid")
    }
    else {
        textLinePrice.value=''
        textLinePrice.classList.add("is-invalid")
        textLinePrice.classList.remove("is-valid")
    }

}

//delete inner table row
const deleteInnerItemForm=(rowOb,rowInd)=>{
// user confirmation
    let itemInfo=rowOb.batch_id.name
    Swal.fire({
        title: "Are you sure to remove following batch?",
        html: itemInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {

            grn.grnHasBatchList.splice(rowInd,1)


            Swal.fire({
                title: "Removed  Successfully!",
                icon: "success"
            });
            refreshInnerGrnFormAndTable()


        }
        else {
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }

    });

}

// inner form error
const checkInnerFormError=()=>{
    let errors=''
    if(grnbatch.batch_id==null || selectBatch.value==''){
        errors+="please select batch<br>"
        selectBatch.classList.add("is-invalid");
    }
    if(grnbatch.unitprice==null || textUnitPrice.value==''){
        errors+="please enter valid a unit price<br>"
        textUnitPrice.classList.add("is-invalid");
    }
    if(grnbatch.qty==null || textqty.value==''){
        errors+="please enter valid quantity<br>"
        textqty.classList.add("is-invalid");
    }

    return errors;
}

// check item by batchno
const checkBatch=()=>{
    let selectedBatch=JSON.parse(selectBatch.value);

    let extIndex= grn.grnHasBatchList.map(batch=>batch.batch_id.id).indexOf(selectedBatch.id)

    if (extIndex !== -1){
        let timerInterval;
        Swal.fire({
            title: "batch already entered to table",
            timer: 1000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
        });
        btnInnerForm.disabled=true
    }
    else {
        btnInnerForm.disabled=false
    }
}

// inner form button add
const btnInnerBatchAdd=()=>{
//     check for error
    let error=checkInnerFormError();

    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'


    if(error==''){

        let batchDetails=  `Batch No: ${grnbatch.batch_id.batchno}<br>
                                               Unit price: ${grnbatch.unitprice} <br>
                                              Quantity: ${grnbatch.qty} <br>
                                               Line price: ${grnbatch.lineprice} `
        div.innerHTML=batchDetails
        div.style.fontSize='15px'
        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following batch?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "batch Added Successfully!",

                    icon: "success"
                });

                //     push into array
                grn.grnHasBatchList.push(grnbatch);
                console.log(grn.grnHasBatchList)

                refreshInnerGrnFormAndTable()

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
            title:'Form has following errors',
            html:div,


        });
    }

}

// delete function for grn delete
const  deleteGrn=(rowOb)=>{

//     let GrnInfo = `Grn  Number: ${rowOb.grnno}<br>
//                  Supplier Billno : ${rowOb.supplierbillno}<br> Purchase Order No ${rowOb.purchaseorder_id.code}<br>`
//
//     let div=document.createElement('div');
//     div.style.marginLeft='50px'
//     div.style.textAlign='left'
// div.innerHTML=GrnInfo
//     Swal.fire({
//         title: "Are you sure to delete following Grn record?",
//         html: div,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Confirm"
//     }).then((result) => {
//         if (result.isConfirmed) {
//             let  serverResponse=ajaxRequestBody("/grn","DELETE",rowOb)
//             if (serverResponse==="OK") {
//
//
//                 Swal.fire({
//                     title: "Grn record Deleted Successfully!",
//
//                     icon: "success"
//                 });
//                 refreshGrnTable()
//
//
//
//
//             } else {
//
//                 Swal.fire("Something went wrong", serverResponse, "info");
//             }
//
//         }
//         else {
//             Swal.fire({
//                 icon: "error",
//                 title: "Action Aborted"
//
//
//             });
//         }
//
//     });
//

}


// print grn details method
const  printGrn=(rowOb)=>{
    console.log(rowOb)
    const grnPrint=rowOb;

    tdGrnNumber.innerHTML=grnPrint.grnno
    tdSupplierCode.innerHTML=grnPrint.purchaseorder_id.supplier_id.regno
    tdSupplier.innerHTML=grnPrint.purchaseorder_id.supplier_id.name
    tdSbillno.innerHTML=grnPrint.supplierbillno
    tdPOrderNo.innerHTML=grnPrint.purchaseorder_id.code
    tdRdate.innerHTML=grnPrint.receiveddate

    tdTotalAmount.innerHTML=parseFloat(grnPrint.totalamount).toFixed(2)
    tdDrate.innerHTML=parseFloat(grnPrint.discountrate).toFixed(2)
    tdNamount.innerHTML=parseFloat(grnPrint.netamount).toFixed(2)

    let addeduser=ajaxGetReq("/user/getuserbyid/"+grnPrint.addeduser);
    tdUser.innerHTML=addeduser.username;

    tdStatus.innerHTML=grnPrint.grnstatus_id.name


    if (grnPrint.note==null){
        tdNote.innerHTML="-"
    }
    else {
        tdNote.innerHTML=grnPrint.note
    }

    const displayInnerTablePrintProperty=[
        {property:getDrugName,datatype:'function'},
        {property:getbatchNo,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'qty',datatype:'string'},
        {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTable(printinnertable, grnPrint.grnHasBatchList,displayInnerTablePrintProperty,deleteInnerItemForm,false)





    let grnPrintInfo = `Grn Number : ${grnPrint.grnno}<br>
              Purchase Order Code : ${grnPrint.purchaseorder_id.code} `

    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.innerHTML=grnPrintInfo
    Swal.fire({
        title: "are you sure Print following grn record?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printGrnDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}

const getDrugName=(rowOb)=>{
   return  rowOb.batch_id.purchasedrug_id.salesdrug_id.name;
}

// function to print grn details
const printGrnDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Grn Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printGrnTable.outerHTML


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


    if ( selectPorder.value=='' || grn.purchaseorder_id==null ) {
        errors =errors + "Please select purchase order number<br>"
        selectPorder.classList.add('is-invalid')
    }
    if (textReceivedDate.value==''|| grn.receiveddate==null) {
        errors =errors + "Please enter received date<br>"
        textReceivedDate.classList.add('is-invalid')
    }
    if (textSBillNo.value==''|| grn.supplierbillno==null) {
        errors =errors + "Please enter supplier bill number<br>"
        textSBillNo.classList.add('is-invalid')
    }
    if (textDiscountRate.value=='' || grn.discountrate==null) {
        errors =errors + "Please enter discount rate<br>"
        textDiscountRate.classList.add('is-invalid')
    }

    if (selectGrnStatus.value=='' || grn.grnstatus_id==null) {
        errors =errors + "Please select grn status<br>"
        selectGrnStatus.classList.add('is-invalid')
    }

    if (grn.grnHasBatchList.length==0) {
        errors =errors + "Please select item to add [item list cannot be empty]<br>"
    }



    return errors;
}


// grn add function
const buttonGrnAdd=()=>{

    console.log(grn)
    let error=checkError();
    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'

    if (error==''){
         let GrnInfo = `
              Supplier : ${grn.supplier_id.name}<br>
               Purchase Order Number: ${grn.purchaseorder_id.code}<br>
               Received Date: ${grn.receiveddate}<br>
                 Supplier Bill No: ${grn.supplierbillno}<br>
                 Total Amount: ${grn.totalamount}<br> 
                  Discount Rate: ${grn.discountrate}<br> 
                  Net Amount: ${grn.netamount}<br>
                   grn status: ${grn.grnstatus_id.name}<br>
                  
                     `;

         if (grn.note !=null){
             GrnInfo += `Note  : ${grn.note}<br>`
         }

        div.innerHTML=GrnInfo
        Swal.fire({
            title: "Are you sure to add following Grn record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/grn","POST",grn);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Grn record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshGrnForm()
                    refreshGrnTable()
                    $('a[href="#GrnTable"]').tab('show');

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
            title: "Form has following errors",
            html: div


        });
    }
}

// refill form
const refillGrnForm=(rowOb)=>{

    grnTitle.innerHTML='Grn Update'

 grn=JSON.parse(JSON.stringify(rowOb))
    grnold=JSON.parse(JSON.stringify(rowOb))



    let refillGrnInfo=`Grn No : ${rowOb.grnno}<br>
                                 `
    Swal.fire({
        title: "Are you sure to edit the following grn record?",
        html: refillGrnInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#GrnForm"]').tab('show');


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


            selectSupplier.classList.remove("is-invalid")
            selectPorder.classList.remove('is-invalid')
            textReceivedDate.classList.remove('is-invalid')
            textSBillNo.classList.remove('is-invalid')
            textTotalAmount.classList.remove('is-invalid')
            textDiscountRate.classList.remove('is-invalid')
            textNetAmount.classList.remove('is-invalid')
            // textPaidAmount.classList.remove('is-valid')
            selectGrnStatus.classList.remove('is-invalid')
            textNote.classList.remove('is-invalid')

            grn=rowOb
            console.log(grn)


            suppliers.push(grn.purchaseorder_id.supplier_id)
            fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name',grn.purchaseorder_id.supplier_id.name)

            selectSupplier.classList.add("is-valid")
            selectSupplier.disabled=true;


            grnStatus=ajaxGetReq("/grnstatus/list");
            fillDataIntoSelect(selectGrnStatus,"Select Status",grnStatus,'name',grn.grnstatus_id.name)
            selectGrnStatus.classList.add("is-valid")
            selectGrnStatus.disabled=false


            pOrderItemDetails = ajaxGetReq("/purchasorder/getporderitemdetailsbysupplier/" + JSON.parse(selectSupplier.value).id);
             pOrderItemDetails.push(grn.purchaseorder_id)
            console.log(pOrderItemDetails)
            fillDataIntoSelect(selectPorder, 'Select Order No', pOrderItemDetails, 'code',grn.purchaseorder_id.code)
            selectPorder.classList.add("is-valid")
            selectPorder.disabled=true

            druglistByPorder = ajaxGetReq("/purchasedrug/getitemlistbyorderid/" + JSON.parse(selectPorder.value).id);
            fillDataIntoSelect(selectDrug, 'Select Item', druglistByPorder, 'name')
            selectDrug.disabled=false;


            textReceivedDate.value=grn.receiveddate
            textReceivedDate.classList.add("is-valid")
            textReceivedDate.disabled=false

            textSBillNo.value=grn.supplierbillno
            textSBillNo.classList.add("is-valid")
            textSBillNo.disabled=false

            textTotalAmount.value=parseFloat(grn.totalamount).toFixed(2)
            textTotalAmount.classList.add("is-valid")
            textTotalAmount.disabled=true;

            textDiscountRate.value=parseFloat(grn.discountrate).toFixed(2)
            textDiscountRate.classList.add("is-valid")
            textDiscountRate.disabled=false;



            textNetAmount.value=parseFloat(grn.netamount).toFixed(2)
            textNetAmount.classList.add("is-valid")

            refreshInnerGrnFormAndTable();

            const displayInnerTableProperty=[
                {property:getbatchNo,datatype:'function'},
                {property:getUnitPrice,datatype:'function'},
                {property:'qty',datatype:'string'},
                {property:getLinePrice,datatype:'function'}

            ]


            fillDataIntoInnerTable(batchInnerTable, grn.grnHasBatchList,displayInnerTableProperty,deleteInnerItemForm,false)


            btnInnerForm.disabled=true;
            selectDrug.disabled=true

            if(grn.note!=null) {
                textNote.value = grn.note
                textNote.classList.add("is-valid")
            }else{
                textNote.value=""
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


// check update
const  checkUpdate=()=>{
    let updateForm='';

    if (grn.purchaseorder_id.supplier_id.name!=grnold.purchaseorder_id.supplier_id.name) {
        updateForm=updateForm + "Supplier Name " +grnold.purchaseorder_id.supplier_id.name+ " changed into " + grn.purchaseorder_id.supplier_id.name +"<br>";
    }

    if (grn.purchaseorder_id.code!=grnold.purchaseorder_id.code) {
        updateForm=updateForm + "Purchase Order Code " +grnold.purchaseorder_id.code+ " changed into " + grn.purchaseorder_id.code +"<br>";
    }


    if (grn.receiveddate!=grnold.receiveddate) {
        updateForm=updateForm + "Received date " +grnold.receiveddate+ " changed into " +grn.receiveddate +"<br>";
    }
    if (grn.supplierbillno!=grnold.supplierbillno) {
        updateForm=updateForm + "Supplier Bill no " +grnold.supplierbillno+ " changed into " +grn.supplierbillno +"<br>";
    }
    if (grn.totalamount!=grnold.totalamount) {
        updateForm=updateForm + "Total Amount " +grnold.totalamount+ " changed into " +grn.totalamount +"<br>";
    }

    if (grn.discountrate!=grnold.discountrate) {
        updateForm=updateForm + "Discount Rate " +grnold.discountrate+ " changed into " +grn.discountrate +"<br>";
    }

    if (grn.netamount!=grnold.netamount) {
        updateForm=updateForm + "Net Amount " +grnold.netamount+ " changed into " +grn.netamount +"<br>";
    }

    if (grn.note!=grnold.note) {
        updateForm=updateForm + "Note " +grnold.note+ " changed into " +grn.note +"<br>";
    }

    if (grn.grnstatus_id.name!=grnold.grnstatus_id.name) {
        updateForm=updateForm + "Grn Status " +grnold.grnstatus_id.name+ " changed into " + grn.grnstatus_id.name+"<br>";
    }

    return updateForm;
}
//button update
const buttonGrnUpdate=()=>{

    console.log(grn);
    // check form errors
    let formErrors=checkError();
    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'

    if (formErrors==""){
        //form update
        let newUpdate=checkUpdate();
        if (newUpdate != ""){

            div.innerHTML=newUpdate
            div.style.fontSize='16px'
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/grn","PUT",grn);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Grn record updated successfully!",

                            icon: "success"
                        });
                      refreshGrnForm()
                        refreshGrnTable()
                        // hide the modal
                        $('a[href="#GrnTable"]').tab('show');
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





//grn table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print grn table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Grn table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Grn Table Details<h2>'+
                tableGrn.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
            )
            setTimeout(
                function() {
                    newTab.print()
                    newTab.close()
                },2000
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






const buttonGrnClear=()=>{
    selectPorder.value=''
    selectPorder.classList.remove('is-valid')
    selectPorder.classList.add('is-invalid')

    textReceivedDate.classList.remove('is-valid')
    textReceivedDate.classList.add('is-invalid')
    textReceivedDate.value=''


    textSBillNo.classList.remove('is-valid')
    textSBillNo.classList.add('is-invalid')
    textSBillNo.value=''


    textTotalAmount.classList.remove('is-valid')
    textTotalAmount.classList.add('is-invalid')
    textTotalAmount.value=''



    textDiscountRate.classList.remove('is-valid')
    textDiscountRate.classList.add('is-invalid')
    textDiscountRate.value=''



    textNetAmount.classList.remove('is-valid')
    textNetAmount.classList.add('is-invalid')
    textNetAmount.value=''




    selectGrnStatus.classList.remove('is-valid')
    selectGrnStatus.classList.add('is-invalid')
    selectGrnStatus.value=''




}

// ----------------------------------------------------------------------------------------------------------------------------------

// batch modal form area
const refreshBatchForm=()=>{


    batch={}


    suppliers=ajaxGetReq("/supplier/porderedsupplierlist");
    fillDataIntoSelect(selectBatchSupplier,"Select Supplier",suppliers,'name')



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
    console.log("expmin: " + textExpiryDate.min);

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
    selectBatchSupplier.value=''
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
    selectBatchSupplier.disabled=false
    selectPdrug.disabled=true
    textSalesPrice.disabled=true
    //set default color
    selectBatchSupplier.classList.remove('is-valid')
    textBatchNo.classList.remove('is-valid')
    selectPdrug.classList.remove('is-valid')
    textManufactureDate.classList.remove('is-valid')
    textExpiryDate.classList.remove('is-valid')
    textTotalQty.classList.remove('is-valid')
    textAvailQty.classList.remove('is-valid')
    textSalesAvailQty.classList.remove('is-valid')
    textPurchasePrice.classList.remove('is-valid')
    textSalesPrice.classList.remove('is-valid')

    selectBatchSupplier.classList.remove('is-invalid')
    textBatchNo.classList.remove('is-invalid')
    selectPdrug.classList.remove('is-invalid')
    textManufactureDate.classList.remove('is-invalid')
    textExpiryDate.classList.remove('is-invalid')
    textTotalQty.classList.remove('is-invalid')
    textAvailQty.classList.remove('is-invalid')
    textSalesAvailQty.classList.remove('is-invalid')
    textPurchasePrice.classList.remove('is-invalid')
    textSalesPrice.classList.remove('is-invalid')







    if (UserPrivilege.insert){
        btnBatchAdd.disabled=""
        btnBatchAdd.style.cursor="pointer"
    }
    else {
        btnBatchAdd.disabled="disabled"
        btnBatchAdd.style.cursor="not-allowed"
    }

}

// get drug/ item details by supplier no
const pdrugList=()=>{

    if (selectBatchSupplier.value!='') {
        textBatchNo.disabled=false
        selectPdrug.disabled = false
        // pOrderDrugs = ajaxGetReq("/purchasaedrug/getpdrugdetailsbyporder/" + JSON.parse(selectPorder.value).id);
        pOrderDrugs = ajaxGetReq("/purchasedrug/getdrugnamesforbatch/"+ JSON.parse(selectBatchSupplier.value).id);


        fillDataIntoSelect(selectPdrug, 'Select Item ', pOrderDrugs, 'name')



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

// check form error
const  checkerror=()=>{

    let errors="";


    if ( selectBatchSupplier.value=='' || batch.supplier_id==null ) {
        errors =errors + "Please select supplier<br>"
        selectBatchSupplier.classList.add('is-invalid')
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
    let error=checkerror();

    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
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

                    if (selectDrug.value!==''){
                        batchListByDrugId = ajaxGetReq("/batch/getbatchnobydrugid/" + JSON.parse(selectDrug.value).id);
                        fillDataIntoSelect(selectBatch, 'Select Batch', batchListByDrugId, 'batchno',textBatchNo.value)
                        selectBatch.disabled=false
                        selectBatch.classList.add('is-valid');
                        grnbatch.batch_id=JSON.parse(selectBatch.value)
                        getItemUnitPrice()
                        checkBatch()
                    }




                    refreshBatchForm()
                    $('#modalBatchAddForm').modal('hide');
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
            title: "Form has Following errors",
            html: div


        });
    }
}




// calculate sale price when user add the purchase price
// if the conversion factor is not 0 mean that the drug is a  medicine
// calculate by diving the purchase price by conversion factor  for drugs and for others purchase price=sales price
const calculateSalePrice=()=>{



        if (selectPdrug.value!=''){
            if (new RegExp('^[1-9][0-9]{1,5}(\\.[0-9]{2})?').test(textPurchasePrice.value)){
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
                batch.saleprice=textSalesPrice.value
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

// get user confirmation befor form refresh
const  refreshBatchFormByuserConfirm=()=>{
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
