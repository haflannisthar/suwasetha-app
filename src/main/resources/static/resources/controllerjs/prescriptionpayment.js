window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Prescription Payment");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshPresPayTable()
    refreshPresPayForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshPresPayTable=()=>{
    prescriptionPaymentList=ajaxGetReq("/prescriptionpayment/findall");
    const displayProperty=[
             {property:'billno',datatype:'string'},
             {property:getPrescriptionNo,datatype:'function'},
            {property:getTotalAmount,datatype:'function'},
            {property:getPaidMethod,datatype:'function'},
             {property:getAddedUser,datatype:'function'},
             {property:getAddedDateTime,datatype:'function'},


    ]
    fillDataIntoTable(tablePresPayment,prescriptionPaymentList,displayProperty,refillAppPayForm,deleteAppPay,printPresPay,true,UserPrivilege);

    disableDeleteAndUpdateForm();

    $('#tablePresPayment').dataTable();



}

// get prescription no
const getPrescriptionNo=(rowOb)=>{
    if (rowOb.prescription_id!=null){
        return rowOb.prescription_id.code
    }
    else {
        return '-'
    }

}
// get paid method
const getPaidMethod=(rowOb)=>{
    return rowOb.inpaymentmethod_id.name
}

// get  channelling charge
const getTotalAmount=(rowOb)=>{
  return parseFloat(rowOb.totalamount).toFixed(2)
}
// get added user
const getAddedUser=(rowOb)=>{
    let addedUser=ajaxGetReq("/user/getuserbyid/"+rowOb.addeduser);
    return addedUser.username
}
// get added date and time
const getAddedDateTime=(rowOb)=>{
     return rowOb.addeddatetime.split('T')[0]+' '+rowOb.addeddatetime.split('T')[1]
}



// delete button disable for refill and delete
const  disableDeleteAndUpdateForm=()=>{
    const tablePresPayment = document.getElementById("tablePresPayment");
    const tableRows = tablePresPayment.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {


            const actionCell = row.querySelector("td:nth-child(8)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");


        if (UserPrivilege.delete && UserPrivilege.update){

            const deleteButton = dropdown.querySelector(".btn-danger");
            const refillButton = dropdown.querySelector(".btn-info");

            deleteButton.disabled = true;
            deleteButton.style.display = "none";

            refillButton.disabled = true;
            refillButton.style.display = "none";


        }

    });
}



// refresh form function
const refreshPresPayForm=()=>{

    Title.innerHTML=' New Invoice'

    // set logged user
    userDetail=ajaxGetReq("/profile/loggeduser");
    loggedUser.value=userDetail.username
    loggedUser.style.borderColor='orange'

    const date =new Date();
   let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();

    if (month<10){
        month='0'+month
    }

    if (day<10){
        day='0'+day
    }

    currentDate.value=`${year}-${month}-${day}`
    currentDate.style.borderColor='orange'




    payment={}
    payment.paymentHasBatchList=[]

    refreshBtn.style.visibility = 'visible'

    prescriptionList=ajaxGetReq("/prescription/getprescriptionlistforpayment");
    console.log(prescriptionList)
    fillDataIntoDataList(dataListPresNo,prescriptionList,'code')
    console.log(dataListPresNo)

    ongoingAppointmentList=ajaxGetReq("/appointment/getongoingappointmentlist");
    console.log(ongoingAppointmentList)
    fillDataIntoDataList(dataListAppointmentNo,ongoingAppointmentList,'appno')
    console.log(dataListAppointmentNo)



    invoicePaymentMethod=ajaxGetReq("/invoicepaymentmethod/list");
    fillDataIntoSelect(selectPaymentMethod,'Select Payment Method',invoicePaymentMethod,'name','cash')
    payment.inpaymentmethod_id=JSON.parse(selectPaymentMethod.value)
    selectPaymentMethod.classList.add('is-valid')


    prescriptionCheck.checked=false
    prescriptionLabel.innerText='Non-Prescription'





    // hide payment fields
    transferPayment.style.display='none'
    cardPayment.style.display='none'


    textTotalAmount.disabled=true
    textBalanceAmount.disabled=true
    txtPrescriptionNo.disabled=true
    txtAppointmentNo.disabled=true
    textPaidAmount.disabled=false


    // set default value
    txtPrescriptionNo.value=''
    selectBankName.value=''
    textRefNo.value=''
    textTransferDateTime.value=''
    textCardRefNo.value=''

    textTotalAmount.value=''
    textPaidAmount.value=''
    textBalanceAmount.value=''
    txtAppointmentNo.value=''



    //remove valid color
    txtPrescriptionNo.classList.remove('is-valid')
    selectBankName.classList.remove('is-valid')
    textRefNo.classList.remove('is-valid')
    textTransferDateTime.classList.remove('is-valid')
    textTotalAmount.classList.remove('is-valid')
    textPaidAmount.classList.remove('is-valid')
    textBalanceAmount.classList.remove('is-valid')
    txtAppointmentNo.classList.remove('is-valid')
    textCardRefNo.classList.remove('is-valid')

    // remove invalid color
    txtPrescriptionNo.classList.remove('is-invalid')
    selectPaymentMethod.classList.remove('is-invalid')
    selectBankName.classList.remove('is-invalid')
    textRefNo.classList.remove('is-invalid')
    textTransferDateTime.classList.remove('is-invalid')
    textTotalAmount.classList.remove('is-invalid')
    textPaidAmount.classList.remove('is-invalid')
    textBalanceAmount.classList.remove('is-invalid')
    txtAppointmentNo.classList.remove('is-invalid')
    textCardRefNo.classList.remove('is-invalid')


    // setting transfer date time min,max
    let transferMinDate=new Date()
    let transferMaxDate=new Date()

    let minTransferMonth =transferMinDate.getMonth()+1;

    if (minTransferMonth<10){
        minTransferMonth='0'+minTransferMonth;
    }

    let minTransferDay= transferMinDate.getDate();

    if (minTransferDay < 10){
        minTransferDay='0'+ minTransferDay;
    }

    let now=new Date();

    let hoursTransferMin = new Date()
    hoursTransferMin.setHours(now.getHours()-2)
    let minutesTransferMin = new Date().getMinutes();

    if(hoursTransferMin<10){
        hoursTransferMin='0'+hoursTransferMin;
    }

    if(minutesTransferMin<10){
        minutesTransferMin='0'+minutesTransferMin;
    }

    hoursTransferMin=hoursTransferMin.getHours().toString()


    textTransferDateTime.min=`${transferMinDate.getFullYear()}-${minTransferMonth}-${minTransferDay}T${hoursTransferMin}:${minutesTransferMin}`


    let MaxTransferMonth =transferMaxDate.getMonth()+1;

    if (MaxTransferMonth<10){
        MaxTransferMonth='0'+MaxTransferMonth;
    }

    let maxTransferDay= transferMinDate.getDate();

    if (maxTransferDay < 10){
        maxTransferDay='0'+ maxTransferDay;
    }


    // fifteen mins from current time
    let hoursTransferMax = new Date().getHours();
    let minutesTransferMax = new Date().getMinutes();

    if(hoursTransferMax<10){
        hoursTransferMax='0'+hoursTransferMax;
    }

    if(minutesTransferMax<10){
        minutesTransferMax='0'+minutesTransferMax;
    }

    textTransferDateTime.max=`${transferMaxDate.getFullYear()}-${MaxTransferMonth}-${maxTransferDay}T${hoursTransferMax}:${minutesTransferMax}`

    console.log("min"+textTransferDateTime.min)
    console.log("min"+textTransferDateTime.max)



    //check privilege and if privilege true then allow
    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }


//     call inner form and table function
    refreshInnerFormAndTable();

}








// refresh inner form and inner table
const refreshInnerFormAndTable=()=>{


    drugbatch={}



    // get sales drug available list
    saleDrugAvailableList=ajaxGetReq("/salesdrug/getsalesdrugavailablelist")
    fillDataIntoDataList(dataListDrug,saleDrugAvailableList,'name')


    fillDataIntoSelect(selectBatch,"select item/drug first",'','')


    //     empty all element
    txtDrugName.value=''
    textUnitPrice.value=''
    textTotalQty.value=''
    textLinePrice.value=''
    selectBatch.value=''
    txtavlQty.innerHTML=''

    txtDrugName.disabled=false;
    textUnitPrice.disabled=false;
    textTotalQty.disabled=false;
    textLinePrice.disabled=false;
    selectBatch.disabled=false;

    btnInnerForm.disabled=false;
    btnInnerForm.style.cursor="pointer"
    btnInnerFormUpdate.disabled=true
    btnInnerFormUpdate.style.cursor="not-allowed"


//     default color

    txtDrugName.classList.remove("is-valid")
    textUnitPrice.classList.remove("is-valid")
    textTotalQty.classList.remove("is-valid")
    textLinePrice.classList.remove("is-valid")
    selectBatch.classList.remove("is-valid")

    txtDrugName.classList.remove("is-invalid")
    textUnitPrice.classList.remove("is-invalid")
    textTotalQty.classList.remove("is-invalid")
    textLinePrice.classList.remove("is-invalid")
    selectBatch.classList.remove("is-invalid")


    // refresh inner table
    const displayInnerTableProperty=[
        {property:getDrugName,datatype:'function'},
        {property:getBatchNo,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'quantity',datatype:'string'},
        {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTableWithEditBtn(drugsInnerTable,payment.paymentHasBatchList,displayInnerTableProperty,editInnerTableRow,deleteInnerTableRow)


// calculate total amount and set it to total amount input field
    let totalamount=0.00;

    payment.paymentHasBatchList.forEach(element=>{

        totalamount=parseFloat(totalamount)+ parseFloat(element.lineprice);
        console.log(totalamount)
    })

    if (payment.paymentHasBatchList.length>0){
        textTotalAmount.value= parseFloat(totalamount).toFixed(2)
        textTotalAmount.classList.add("is-valid");


    }

    if (textPaidAmount.value !== '') {
        console.log(textPaidAmount.value);
        const paidAmount = parseFloat(textPaidAmount.value).toFixed(2);
        const currentTotal = parseFloat(textTotalAmount.value).toFixed(2);

        if (parseFloat(paidAmount) < parseFloat(currentTotal)) {
            console.log("inside");
            textPaidAmount.value = '';
            textPaidAmount.classList.remove('is-valid');

            textBalanceAmount.value = '';
            textBalanceAmount.classList.remove('is-valid');
        } else {
            textBalanceAmount.value = (parseFloat(paidAmount) - parseFloat(currentTotal)).toFixed(2);
            textBalanceAmount.classList.add('is-valid');
        }
    }


    if (totalamount==0.00){
        payment.totalamount=null
        textTotalAmount.value=''
        textTotalAmount.classList.remove('is-valid')
    }else {
        payment.totalamount=textTotalAmount.value;

    }
}
// inner form table get drug name field
const getDrugName=(rowOb)=>{
    console.log(rowOb)


    return rowOb.batch_id.purchasedrug_id.salesdrug_id.name
}

// inner form table get batch no
const getBatchNo=(rowOb)=>{
    return rowOb.batch_id.batchno
}

// inner form table get unit price
const getUnitPrice=(rowOb)=>{
     return parseFloat(rowOb.unitprice).toFixed(2)
}
// inner form table get line price
const getLinePrice=(rowOb)=>{
    return parseFloat(rowOb.lineprice).toFixed(2)
}

// filter prescription no by appointment no
const filterPrescriptionNumber=()=>{
    appointmentNo=txtAppointmentNo.value

    prescriptionList=ajaxGetReq("/prescription/getprescriptionlistforpayment");

    ongoingAppointmentList=ajaxGetReq("/appointment/getongoingappointmentlist");
    // check that the appointment field value is available in ongoing appointment List
    let extAppNo=ongoingAppointmentList.map(appointment=>appointment.appno).indexOf(appointmentNo)
    console.log(extAppNo)
    // if not available return -1
    if (extAppNo!=-1){
        txtAppointmentNo.classList.add('is-valid')

        // get the prescription list and check one by one which equal to appointment no
        for (const prescription of prescriptionList) {
            // if equal call the fillPrescriptionDrugsToTable function which will automatically add the drugs to table
            if (prescription.appointment_id.appno===appointmentNo){
                txtPrescriptionNo.disabled=true
                txtPrescriptionNo.value=prescription.code;
                txtPrescriptionNo.classList.add('is-valid')
                txtPrescriptionNo.classList.remove('is-invalid')

                payment.prescription_id=prescription
                console.log(payment.prescription_id)
                console.log(prescription)
                console.log(txtPrescriptionNo.value)
                fillPrescriptionDrugsToTable()
                validatePaidAmount()
                break;
            }
        }
    }else{
        //   when user empty the appointment no remove only the drug for that prescription and leave other drugs/items added
        prescriptionList=ajaxGetReq("/prescription/getprescriptionlistforpayment");

        let extIndex=prescriptionList.map(prescriptionListItem=>prescriptionListItem.code).indexOf(txtPrescriptionNo.value)

        if (extIndex!==-1){
            prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionList[extIndex].code);

            for (const drugItem of prescriptionDrugList) {
                for (const batchItem of payment.paymentHasBatchList) {

                    if (drugItem.salesdrug_id.name===batchItem.batch_id.purchasedrug_id.salesdrug_id.name){
                        let indexToRemove = payment.paymentHasBatchList.findIndex(b => b === batchItem);
                        if (indexToRemove !== -1) {

                            payment.paymentHasBatchList.splice(indexToRemove, 1);
                        }
                        refreshInnerFormAndTable();
                    }

                }
            }

        }
        txtAppointmentNo.classList.remove('is-valid')
        payment.prescription_id=null
        txtPrescriptionNo.value=''
        txtPrescriptionNo.classList.remove('is-valid')
        txtPrescriptionNo.classList.remove('is-invalid')

           if (payment.paymentHasBatchList<=0){
               textPaidAmount.value=''
               textPaidAmount.classList.remove('is-valid')
               textPaidAmount.classList.remove('is-invalid')
               textBalanceAmount.value=''
               textBalanceAmount.classList.remove('is-valid')
               textBalanceAmount.classList.remove('is-valid')
           }



    }
}




// declare
let rowObArray;

//delete inner table row open the modal and put the ind and row ob in a array and return
const deleteInnerTableRow=(rowOb,rowInd)=>{


    $('#verifyPasswordItemDelete').modal('show');

    // initialize the array
    rowObArray=[];
    rowObArray.push(rowOb);
    rowObArray.push(rowInd);
    return rowObArray;

}


// check the username password and if role is manager or admin then allow to delete else no allow
// prescription list drugs cannot be deleted too
const innerFormItemDeleteVerify=()=>{
    let grantStatus=ajaxGetReq("/profile/verifyuser/"+textUserName.value+"/"+textPassword.value)
    console.log(grantStatus)
    if (!grantStatus){
    let timerInterval;
    Swal.fire({
        title: "Error",
        html:"password mismatch",
        timer: 3000,
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {

        textUserName.value=''
        textPassword.value=''
        $('#verifyPasswordItemDelete').modal('hide');
    });
}else{

        let rowOb = rowObArray[0];
        let rowInd = rowObArray[1];

        textUserName.value=''
        textPassword.value=''
        $('#verifyPasswordItemDelete').modal('hide');

        console.log(rowOb)
        let booleanValue=false
        if (prescriptionCheck.checked && txtPrescriptionNo.value!=''){
            // check the value is available on prescription List then get the in-house pharmacy prescription list
            prescriptionNoList = ajaxGetReq("/prescription/getprescriptionlistforpayment");
            let PrescriptionNo = txtPrescriptionNo.value;

            let extIndex = prescriptionNoList.map(presNo => presNo.code).indexOf(PrescriptionNo);


            if (extIndex != -1) {


                prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionNoList[extIndex].code);
                prescriptionDrugList.forEach(itemList=>{
                    if (itemList.salesdrug_id.name===rowOb.batch_id.purchasedrug_id.salesdrug_id.name){
                             booleanValue=true;
                    }
                })




            }
        }

        if (booleanValue){
            let timerInterval;
            Swal.fire({
                html: "Doctor Prescribed Drugs cannot be deleted.",
                timer: 4000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
            });
        }else{
            // user confirmation
            let drugInnerDetails=  `Drug Name : ${rowOb.batch_id.purchasedrug_id.salesdrug_id.name}<br>
                                             Batch : ${rowOb.batch_id.batchno} <br>
                                            Unit Price: ${rowOb.unitprice} <br> 
                                            Qty: ${rowOb.quantity} <br> 
                                            Line Price: ${rowOb.lineprice} <br> `

            let div=document.createElement('div');
            div.style.textAlign='left'
            div.style.marginLeft='50px'
            div.style.fontSize='16px'
            div.innerHTML=drugInnerDetails
            Swal.fire({
                title: "Are you sure to remove following  record?",
                html: div,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {

                    payment.paymentHasBatchList.splice(rowInd,1)


                    textPaidAmount.value=''
                    textPaidAmount.classList.remove('is-valid')
                    textPaidAmount.classList.remove('is-invalid')
                    textBalanceAmount.value=''
                    textBalanceAmount.classList.remove('is-valid')
                    textBalanceAmount.classList.remove('is-valid')


                    Swal.fire({
                        title: "Removed  Successfully!",
                        icon: "success"
                    });
                    refreshInnerFormAndTable()


                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Action Aborted"


                    });
                }

            });
        }



}


}



// edit inner table row
const editInnerTableRow=(rowOb,rowInd)=>{

    drugbatch=rowOb
    innerRowInd=rowInd

    let drugInnerDetails=  `Drug Name : ${rowOb.batch_id.purchasedrug_id.salesdrug_id.name}<br>
                                             Batch : ${rowOb.batch_id.batchno} <br>
                                            Unit Price: ${rowOb.unitprice} <br> 
                                            Qty: ${rowOb.quantity} <br> 
                                            Line Price: ${rowOb.lineprice} <br> `

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=drugInnerDetails
    Swal.fire({
        title: "Are you sure to edit following  record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {

            btnInnerForm.disabled=true;
            btnInnerForm.style.cursor="not-allowed"
            btnInnerFormUpdate.disabled=false
            btnInnerFormUpdate.style.cursor="pointer"



            txtDrugName.value=rowOb.batch_id.purchasedrug_id.salesdrug_id.name
            txtDrugName.classList.add('is-valid')
            txtDrugName.disabled=true

            batchList=ajaxGetReq("/batch/getavailabledrugqtyandunitprice/"+rowOb.batch_id.purchasedrug_id.salesdrug_id.id);
            console.log(batchList)
            fillDataIntoSelect(selectBatch,'Select Batch',batchList,'batchno',rowOb.batch_id.batchno)
            selectBatch.disabled=true
            selectBatch.classList.add('is-valid')


            let extBatchNo=batchList.map(batch=>batch.id).indexOf(rowOb.batch_id.id)

            if (extBatchNo!=-1){
                txtavlQty.innerText='Avl Qty : '+batchList[extBatchNo].salesdrugavailableqty

                textUnitPrice.value=parseFloat(batchList[extBatchNo].saleprice).toFixed(2)
                textUnitPrice.classList.add('is-valid')
                textUnitPrice.classList.remove('is-invalid')
                textUnitPrice.disabled=true
            }




            textTotalQty.value=rowOb.quantity
            textTotalQty.classList.add('is-valid')


            textLinePrice.value=rowOb.lineprice
            textLinePrice.classList.add('is-valid')
            textLinePrice.disabled=true



        }

    })


}




// const checkUpdateQtyValue=()=>{
//     let drugName=txtDrugName.value
//     let drugQty=textTotalQty.value
//
//
//     let extIndex=prescriptionList.map(prescriptionListItem=>prescriptionListItem.code).indexOf(txtPrescriptionNo.value)
//
//     if (extIndex!==-1) {
//         prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionList[extIndex].code);
//
//
//             for (const prescriptionItem of prescriptionDrugList) {
//                 if (prescriptionItem.salesdrug_id.name===drugName){
//                     let totalBatchQty = parseInt(drugQty);
//
//                     for (const paymentBatchItem of payment.paymentHasBatchList) {
//                         if (paymentBatchItem.batch_id.purchasedrug_id.salesdrug_id.name === drugName) {
//                             totalBatchQty += parseInt(paymentBatchItem.quantity);
//                             console.log(totalBatchQty)
//                             console.log(prescriptionItem.totalqty)
//                         }
//                     }
//                     if (totalBatchQty  < prescriptionItem.totalqty) {
//                         return true;
//                     }else{
//                         return false;
//
//                     }
//
//                 }
//             }
//
//     }
//
//     return false;
//
//
// }

// check that the edited quantity is less than prescribed qty for doctor prescribed drugs and if so return true else return false
const checkUpdateQtyValue = () => {
    let drugName = txtDrugName.value;
    let newDrugQty = parseFloat(textTotalQty.value);

    let extIndex = prescriptionList.map(prescriptionListItem => prescriptionListItem.code).indexOf(txtPrescriptionNo.value);

    if (extIndex !== -1) {
        prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionList[extIndex].code);

        for (const prescriptionItem of prescriptionDrugList) {
            if (prescriptionItem.salesdrug_id.name === drugName) {
                let totalBatchQty = 0;

                for (const paymentBatchItem of payment.paymentHasBatchList) {
                    if (paymentBatchItem.batch_id.purchasedrug_id.salesdrug_id.name === drugName) {
                        if (parseFloat(paymentBatchItem.quantity) === newDrugQty) {
                            totalBatchQty += newDrugQty;
                        } else {
                            totalBatchQty += parseFloat(paymentBatchItem.quantity);
                        }
                    }
                }

                if (totalBatchQty < prescriptionItem.totalqty) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    return false; // If the drug is not found in the prescription list
};



// update inner drug table
const btnInnerformUpdate=()=>{

    let formErrors=checkInnerFormError();
    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


          let drugStatusValue=checkUpdateQtyValue();
    console.log(drugStatusValue)



    if (formErrors===''){

        if (drugStatusValue){
            Swal.fire({
                html: 'Drug Quantity cannot be less than Prescribed Quantity',
                icon: "warning",
                confirmButtonText: "Ok"
            })
        }else{
            let drugInnerDetails=  `Drug Name : ${drugbatch.batch_id.purchasedrug_id.salesdrug_id.name}<br>
                                             Batch : ${drugbatch.batch_id.batchno} <br>
                                            Unit Price: ${drugbatch.unitprice} <br>
                                            Qty: ${drugbatch.quantity} <br>
                                            Line Price: ${drugbatch.lineprice} <br> `

            div.innerHTML=drugInnerDetails
            Swal.fire({
                title: "Are you sure to update?",
                html: div,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then((result) => {
                if (result.isConfirmed) {
                    payment.paymentHasBatchList[innerRowInd].quantity=textTotalQty.value
                    console.log( payment.paymentHasBatchList[innerRowInd])
                    refreshInnerFormAndTable()

                }
            })




        }





    }else {
        div.innerHTML=formErrors
        Swal.fire({
            icon: "error",
            html:div,


        });
    }


}




// check whether the payment is based on prescription or not
const checkPrescription=()=>{
    if (prescriptionCheck.checked){
        prescriptionLabel.innerHTML='Prescription'
        txtPrescriptionNo.disabled=false
        txtAppointmentNo.disabled=false

    }else{
        prescriptionLabel.innerHTML='Non-Prescription'
        txtPrescriptionNo.classList.remove('is-valid')
        txtPrescriptionNo.disabled=true
        txtAppointmentNo.disabled=true

        prescriptionList=ajaxGetReq("/prescription/getprescriptionlistforpayment");

        let extIndex=prescriptionList.map(prescriptionListItem=>prescriptionListItem.code).indexOf(txtPrescriptionNo.value)

        if (extIndex!==-1){
            prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionList[extIndex].code);

            for (const drugItem of prescriptionDrugList) {
                console.log("line 758 passed")
                // drugItem.salesdrug_id.name==
                for (const batchItem of payment.paymentHasBatchList) {
                    console.log("line 761 passed")
                    console.log(batchItem)

                    if (drugItem.salesdrug_id.name===batchItem.batch_id.purchasedrug_id.salesdrug_id.name){
                        let indexToRemove = payment.paymentHasBatchList.findIndex(b => b === batchItem);
                        if (indexToRemove !== -1) {
                            console.log("line 767 passed")
                            console.log("line 761 passed"+indexToRemove)

                            payment.paymentHasBatchList.splice(indexToRemove, 1);
                        }
                        refreshInnerFormAndTable();
                    }

                }
            }

        }


        txtPrescriptionNo.value=''
        payment.prescription_id=null
        txtAppointmentNo.value=''
        txtAppointmentNo.classList.remove('is-valid')

    }
}

// arrays for batch not found drug and batch low Qty
batchNotFoundDrugs=[];
batchLowQty=[];

// fill the prescription drugs to table when user select the prescription number
const fillPrescriptionDrugsToTable=()=> {
    let PrescriptionNo = txtPrescriptionNo.value;



    payment.paymentHasBatchList = [];
    refreshInnerFormAndTable();


    // check the value is available on prescription List then get the in-house pharmacy prescription list
    prescriptionNoList = ajaxGetReq("/prescription/getprescriptionlistforpayment");

    let extIndex = prescriptionNoList.map(presNo => presNo.code).indexOf(PrescriptionNo);

    if (extIndex != -1) {
        // get the prescription list by prescription code
        prescriptionDrugList = ajaxGetReq("/prescription/getprescriptionHouseDrugList/" + prescriptionNoList[extIndex].code);


        console.log(prescriptionDrugList)

        // travel through element by element
        for (let element of prescriptionDrugList) {
            // batch = ajaxGetReq("/batch/getbatchbysalesdrugid/" + element.salesdrug_id.id + "/" + element.totalqty);
            batchList = ajaxGetReq("/batch/getbatclisthbysalesdrugid/" + element.salesdrug_id.id);
            console.log(batchList)

            // needed/doctor prescribed qty
            let neededQty = element.totalqty;
            // if a batch is found this will change to true else false
            let batchFound = false;

          // travel through the batchList loop
            for (let i = 0; i < batchList.length; i++) {
                let batchElement = batchList[i];
                // if all the prescribed qty is added then stop the loop
                if (neededQty <= 0){
                    break;
                }
// Check if the batch has enough quantity to fulfill the remaining need
                if (batchElement.salesdrugavailableqty >= neededQty) {
                    // Batch has enough quantity
                     drugbatch = {
                        batch_id: batchElement,
                        unitprice: batchElement.saleprice,
                        quantity: neededQty,
                        lineprice: parseFloat(Number(batchElement.saleprice) * neededQty).toFixed(2)
                    };

                    payment.paymentHasBatchList.push(drugbatch);
                    neededQty = 0; // All quantity fulfilled
                    batchFound = true;
                    refreshInnerFormAndTable();
                } else {
                   if (batchElement.salesdrugavailableqty>0){
                       // Batch does not have enough quantity, take all from this batch
                       drugbatch = {
                           batch_id: batchElement,
                           unitprice: batchElement.saleprice,
                           quantity: batchElement.salesdrugavailableqty,
                           lineprice: parseFloat(Number(batchElement.saleprice) * batchElement.salesdrugavailableqty).toFixed(2)
                       };

                       payment.paymentHasBatchList.push(drugbatch);
                       neededQty -= batchElement.salesdrugavailableqty;
                       batchFound = true;
                       refreshInnerFormAndTable();
                   }
                }
            }
            if (batchFound && neededQty > 0) {
                batchLowQty.push(element.salesdrug_id.name)
                console.log(batchLowQty)
                // if batch  found but prescribed total qty is greater than available qty
                Swal.fire({
                    title: 'Low Quantity',
                    html:  `<div style="text-align: left;margin-left: 50px">
                             Not enough available quantity in batches for drug.<br>
                             <b>${element.salesdrug_id.name}</b><br>
                             Prescribed Qty: ${element.totalqty}<br>
                            Added Qty: ${element.totalqty - neededQty} </div>`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }else if(!batchFound){
                batchNotFoundDrugs.push(element.salesdrug_id.name)
                console.log(batchNotFoundDrugs)
                // if batch not found then show not batch found
                Swal.fire({
                    title: 'No Batch Found',
                    html: 'No suitable batches found for drug.<br>'+element.salesdrug_id.name,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }


    }else{
        txtAppointmentNo.value=''
        txtAppointmentNo.classList.remove('is-valid')
    }
}











// get the available qty and unit price for selected drug name
const getAvailableQtyAndUnitPrice=()=>{
    let DrugName=txtDrugName.value
    txtDrugName.classList.remove('is-valid')
    txtDrugName.classList.remove('is-invalid')

    textUnitPrice.value=''
    textUnitPrice.classList.remove('is-valid')
    drugbatch.unitprice=null

    textTotalQty.value=''
    textTotalQty.classList.remove('is-valid')
    drugbatch.quantity=null

    textLinePrice.value=''
    textLinePrice.classList.remove('is-valid')
    drugbatch.lineprice=null

    selectBatch.classList.remove('is-valid')
    fillDataIntoSelect(selectBatch,"select item/drug first",'','')
    txtavlQty.innerHTML=''
    drugbatch.batch_id=null

    btnInnerForm.disabled=false




    // get the batch name ,available qty, sales price
   let extDrugIndex=saleDrugAvailableList.map(drug=>drug.name).indexOf(DrugName)

    if (extDrugIndex!=-1){
        txtDrugName.classList.add('is-valid')
        AvailableDrugQtyAndUnitPriceAndBatch=ajaxGetReq("/batch/getavailabledrugqtyandunitprice/"+saleDrugAvailableList[extDrugIndex].id);
        fillDataIntoSelect(selectBatch,'Select Batch',AvailableDrugQtyAndUnitPriceAndBatch,'batchno',AvailableDrugQtyAndUnitPriceAndBatch[0].batchno)
        drugbatch.batch_id=JSON.parse(selectBatch.value)
        selectBatch.classList.add('is-valid');
        selectBatch.classList.remove('is-invalid');

        txtavlQty.innerText='Avl Qty : '+AvailableDrugQtyAndUnitPriceAndBatch[0].salesdrugavailableqty


        textUnitPrice.value=parseFloat(AvailableDrugQtyAndUnitPriceAndBatch[0].saleprice).toFixed(2)
        textUnitPrice.classList.add('is-valid')
        textUnitPrice.classList.remove('is-invalid')
        drugbatch.unitprice=textUnitPrice.value
        textUnitPrice.disabled=true

        checkDuplicateDrugName()



    }
}

// load the unit price after user select batch.
// batch which is closer to expiry is auto selected
const loadUnitPrice=()=>{

    let BatchNoId=JSON.parse(selectBatch.value).id

       let extBatchNo=AvailableDrugQtyAndUnitPriceAndBatch.map(batch=>batch.id).indexOf(BatchNoId)

    if (extBatchNo!=-1){
        txtavlQty.innerText='Avl Qty : '+AvailableDrugQtyAndUnitPriceAndBatch[extBatchNo].salesdrugavailableqty

        textUnitPrice.value=parseFloat(AvailableDrugQtyAndUnitPriceAndBatch[extBatchNo].saleprice).toFixed(2)
        textUnitPrice.classList.add('is-valid')
        textUnitPrice.classList.remove('is-invalid')
        drugbatch.unitprice=textUnitPrice.value
        textUnitPrice.disabled=true

        calculateLinePrice()
    }



}


// calculate duplicate drug record by drug name and batch no
// get the drug name by batch no
// check that the drug name is equal to select drug field value
// if equal then check for the batch no in paymentHasBatchList   equal to select field batch
const checkDuplicateDrugName=() =>{
    let selectedDrugName=txtDrugName.value
    let selectedBatchNo=JSON.parse(selectBatch.value).id

    // let extDrugName=payment.paymentHasBatchList.map(drug=>drug.batch_id.purchasedrug_id.salesdrug_id.name).indexOf(selectedDrugName)
    salesDrugName=ajaxGetReq("/salesdrug/getdrugnamebybatchno/"+selectedBatchNo)




    if (selectedDrugName!='' && selectedBatchNo!=''){
        if (salesDrugName.name===selectedDrugName){

            if (payment.paymentHasBatchList.length>0){
                payment.paymentHasBatchList.forEach(listItem=>{


                    if (listItem.batch_id.purchasedrug_id.salesdrug_id.name===selectedDrugName && listItem.batch_id.id===selectedBatchNo){
                        let timerInterval;
                        Swal.fire({
                            html: selectedDrugName+" already Added.",
                         timer:3000,
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                       }).then((result) => {
                        btnInnerForm.disabled=true
                    });
                }else{
                    btnInnerForm.disabled=false

                    }
                })

            }else{
                btnInnerForm.disabled=false
            }


        }
    }


};




// calculate line price and check user entered qty greater than available qty
const calculateLinePrice=()=>{

    if (textUnitPrice.value!='' && textTotalQty.value!=''){

       let testQty=new RegExp('^[1-9][0-9]{0,3}$');

       if (testQty.test(textTotalQty.value)){

           let DrugName=txtDrugName.value

           let extDrugIndex=saleDrugAvailableList.map(drug=>drug.name).indexOf(DrugName)
           getAvailableQtyByDrug=ajaxGetReq("/batch/getavailableqty/"+saleDrugAvailableList[extDrugIndex].id+"/"+JSON.parse(selectBatch.value).id)
           if (textTotalQty.value>getAvailableQtyByDrug){
               let timerInterval;
               Swal.fire({
                   html: "Entered Quantity is Greater than Available Qty.Total Available Quantity Is Selected",
                   timer: 3000,

                   willClose: () => {
                       clearInterval(timerInterval);
                   }
               }).then((result) => {
                   textTotalQty.value=getAvailableQtyByDrug
                   drugbatch.quantity= textTotalQty.value
                   textTotalQty.classList.add('is-valid');

                   textLinePrice.value=parseFloat(Number(textUnitPrice.value) * Number(textTotalQty.value)).toFixed(2)
                   textLinePrice.classList.add('is-valid')
                   textLinePrice.classList.remove('is-invalid')
                   drugbatch.lineprice=textLinePrice.value
               });
           }else{
               textLinePrice.value=parseFloat(Number(textUnitPrice.value) * Number(textTotalQty.value)).toFixed(2)
               textLinePrice.classList.add('is-valid')
               textLinePrice.classList.remove('is-invalid')
               drugbatch.lineprice=textLinePrice.value
           }


       }


    }else{
        textLinePrice.value=''
        textLinePrice.classList.remove('is-valid')
        textLinePrice.classList.remove('is-invalid')
        drugbatch.lineprice=null
    }


}




// inner form error
const checkInnerFormError=()=>{
    let errors=''
    if( txtDrugName.value==''){
        errors+="please Enter Drug Name<br>"
        txtDrugName.classList.add("is-invalid");
    }

    if( drugbatch.batch_id==null ||selectBatch.value==''){
        errors+="please Select Batch<br>"
        selectBatch.classList.add("is-invalid");
    }

    if( drugbatch.unitprice==null ||textUnitPrice.value==''){
        errors+="please Enter Drug Name and Select Batch<br>"
        textUnitPrice.classList.add("is-invalid");
    }

    if( drugbatch.quantity==null ||textTotalQty.value==''){
        errors+="please Enter Quantity<br>"
        textTotalQty.classList.add("is-invalid");
    }
    if( drugbatch.lineprice==null ||textLinePrice.value==''){
        errors+="Line Price is Auto Calculated. please Fill Relevant Fields <br>"
        textLinePrice.classList.add("is-invalid");
    }

    return errors;
}



// inner form  add
const btnInnerformAdd=()=>{

    console.log(drugbatch)

//     check for error
    let error=checkInnerFormError();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    if(error==''){



        let drugInnerDetails=  `Drug Name : ${drugbatch.batch_id.purchasedrug_id.salesdrug_id.name}<br>
                                             Batch : ${drugbatch.batch_id.batchno} <br>
                                            Unit Price: ${drugbatch.unitprice} <br> 
                                            Qty: ${drugbatch.quantity} <br> 
                                            Line Price: ${drugbatch.lineprice} <br> `

        div.innerHTML=drugInnerDetails
        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following drug record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: " Added Successfully!",

                    icon: "success"
                });

                //     push into array
                payment.paymentHasBatchList.push(drugbatch);
                console.log(payment.paymentHasBatchList)
                refreshInnerFormAndTable()

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
            html:div,


        });
    }


}
























// --------------------------------------------------------------------------------------------------------------------------------------------------------
// show payment details field based on selected payment method field
const enablePaymentField=()=>{



    const transferPayment = document.getElementById('transferPayment');



    // hide all the fields
    transferPayment.style.display = 'none';
    cardPayment.style.display = 'none';

    // Show the relevant payment detail field based on selected method
    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'transfer') {
        transferPayment.style.display = 'block';
    }
    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'card') {
        cardPayment.style.display = 'block';
    }


    banknames=[
        {id:1,name:'Bank Of Ceylon'},
        {id:2,name:'People\'s Bank'},
        {id:3,name:'Commercial Bank'},
        {id:4,name:'Hatton National Bank'},
        {id:5,name:'Sampath Bank'},
        {id:6,name:'Nations Trust Bank'},
        {id:7,name:'DFCC Bank'},
        {id:8,name:'Union Bank'},
        {id:9,name:'Pan Asia Bank'},
        {id:10,name:'Seylan Bank'}
    ]
    fillDataIntoSelect(selectBankName,'Select Bank',banknames,'name');
    selectBankName.classList.remove("is-valid")
    selectBankName.classList.remove("is-invalid")

    textRefNo.value=''
    textRefNo.classList.remove("is-valid")
    textRefNo.classList.remove("is-invalid")

    textTransferDateTime.value=''
    textTransferDateTime.classList.remove("is-valid")
    textTransferDateTime.classList.remove("is-invalid")

    textCardRefNo.value=''
    textCardRefNo.classList.remove("is-valid")
    textCardRefNo.classList.remove("is-invalid")


    payment.bankname=null;
    payment.transferdatetime=null;
    payment.refno=null;


}




// get payment method
// if cash then enable paid amount field
// else call the calculateBalanceAmount function and set the channelling fee value for paid amount and 0.00 for balance amount
const getPaymentMethod=()=>{

if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'cash') {

    // if the payment method is cash then paid amount, balance amonut field null and default color on change

    textPaidAmount.disabled=false


    textPaidAmount.value=''
    textPaidAmount.classList.remove('is-valid')
    payment.paidamount=null;

    textBalanceAmount.value=''
    textBalanceAmount.classList.remove('is-valid')
    payment.balanceamount=null;

}
else {

    if (payment.paymentHasBatchList.length===0){
        let timerInterval;
        Swal.fire({
            html: "First Add the Drugs.",
            timer: 4000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {


            invoicePaymentMethod=ajaxGetReq("/invoicepaymentmethod/list");
            fillDataIntoSelect(selectPaymentMethod,'Select Payment Method',invoicePaymentMethod,'name','cash')
            payment.inpaymentmethod_id=JSON.parse(selectPaymentMethod.value)
            selectPaymentMethod.classList.add('is-valid')

            transferPayment.style.display='none'
            cardPayment.style.display='none'
        });
    }else {
        textPaidAmount.disabled=true
        calculateBalanceAmount()
    }


}


}



// validate paid amount.
// if payment method is cash then paid amount cannot be smaller than channelling charge.
// if channelling charge greater than paid amount then empty the paid amount field show error [for payment method cash]
const validatePaidAmount=()=>{

    // for payment method cash


        let channellingCharge=textTotalAmount.value
        let paidAmount=textPaidAmount.value

    textPaidAmount.value=parseFloat(textPaidAmount.value).toFixed(2)


            let regExpPaidAmount=new RegExp('^[1-9][0-9]{1,5}(\\.[0-9]{2})?$');

            if (regExpPaidAmount.test(paidAmount)){

                let decimalPaidAmount=parseFloat(paidAmount).toFixed(2)
                let decimalChannellingCharge=parseFloat(channellingCharge).toFixed(2)

                if (parseFloat(decimalPaidAmount)<parseFloat(decimalChannellingCharge)){
                    let timerInterval;
                    Swal.fire({
                        Title:'Error',
                        html: "Total Amount Cannot be greater than Paid Amount. Please Re-check the value",
                        timer: 2000,
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        textPaidAmount.value=''
                        textPaidAmount.classList.remove('is-valid')
                        payment.paidamount=null


                        textBalanceAmount.value=''
                        textBalanceAmount.classList.remove('is-valid')
                        payment.balanceamount=null



                    });
                }else{
                    calculateBalanceAmount()
                }
            }
            else {
                textBalanceAmount.value=''
                textBalanceAmount.classList.remove('is-valid')
                payment.balanceamount=null
            }



}

// calculate balance amount
// check the payment method
// cash then enable the paid amount field else disable the field and auto set values
const calculateBalanceAmount=()=>{

    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text !== 'cash') {
        textPaidAmount.disabled=true
        textPaidAmount.value=parseFloat(textTotalAmount.value).toFixed(2)
        textPaidAmount.classList.remove('is-invalid')
        textPaidAmount.classList.add('is-valid')
        payment.paidamount=textPaidAmount.value

        textBalanceAmount.value='0.00'
        textBalanceAmount.classList.add('is-valid')
        textBalanceAmount.classList.remove('is-invalid')

        payment.balanceamount=textBalanceAmount.value;


    }else {
        textPaidAmount.disabled=false



        let decimalPaidAmount=parseFloat(textPaidAmount.value).toFixed(2)
        let decimalChannellingCharge=parseFloat(textTotalAmount.value).toFixed(2)

        let regExpCheckAmount=new RegExp('^[1-9][0-9]{0,7}[.][0-9]{2}$');

        if (regExpCheckAmount.test(decimalPaidAmount) && regExpCheckAmount.test(decimalChannellingCharge)){
            textBalanceAmount.value=parseFloat(decimalPaidAmount-decimalChannellingCharge).toFixed(2)
            textBalanceAmount.classList.add('is-valid')
            payment.balanceamount=textBalanceAmount.value;
        }else {
            textBalanceAmount.value=''
            textBalanceAmount.classList.remove('is-valid')
            payment.balanceamount=null
        }
    }


}



// time validation (show error)
const timeValidation =()=>{



    let selectedDateTime= textTransferDateTime.value;

    let  transferDate=new Date();

    let transferMonth =transferDate.getMonth()+1;

    if (transferMonth<10){
        transferMonth='0'+transferMonth;
    }

    let transferDay= transferDate.getDate();

    if (transferDay < 10){
        transferDay='0'+ transferDay;
    }


    let transferHours = new Date().getHours();
    let transferMinutes = new Date().getMinutes();

    if(transferHours<10){
        transferHours='0'+transferHours;
    }

    if(transferMinutes<10){
        transferMinutes='0'+transferMinutes;
    }

    // get the current date and time
    let currentDateAndTime=`${transferDate.getFullYear()}-${transferMonth}-${transferDay}T${transferHours}:${transferMinutes}`

    // current time to show in error message (T removed)
    let currentDateAndTimeToShowError=`${transferDate.getFullYear()}-${transferMonth}-${transferDay} ${transferHours}:${transferMinutes}`

    // current time to check if it is ahead of selected time
    if (currentDateAndTime<selectedDateTime){
        let timerInterval;
        Swal.fire({
            title: "Invalid Time",
            html:currentDateAndTimeToShowError,
            timer: 4000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            textTransferDateTime.value=''

        });
    }



}

// get user confirmation before form refresh
const  refreshFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPresPayForm();
        }
    });
}

// check form error
const  checkError=()=>{

    let errors="";

    if (prescriptionCheck.checked){
        if ( txtPrescriptionNo.value=='' || payment.prescription_id==null ) {
            errors =errors + "Please select Prescription Number<br>"
            txtPrescriptionNo.classList.add('is-invalid')
        }
    }
    if (prescriptionCheck.checked){
        if ( txtPrescriptionNo.value!='' || payment.prescription_id!=null ) {
            let counter=0
            // prescriptionDrugList=ajaxGetReq("/prescription/getprescriptionHouseDrugList/"+prescriptionNoList[extIndex].code);
            prescriptionDrugList.forEach(element=>{
                payment.paymentHasBatchList.forEach(drug=>{
                    if (element.salesdrug_id.name==drug.batch_id.purchasedrug_id.salesdrug_id.name){
                        counter=counter+1
                        console.log(drug.batch_id.purchasedrug_id.salesdrug_id.name)
                    }
                })
            })

            let prescriptionArrayLength=prescriptionDrugList.length
            let batchNotFoundArrayLength=batchNotFoundDrugs.length

            console.log("Counter:", counter);
            console.log("Prescription Array Length:", prescriptionArrayLength);
            console.log("Batch Not Found Array Length:", batchNotFoundArrayLength);

            if (prescriptionArrayLength>counter+batchNotFoundArrayLength){
                errors =errors + "All the prescribed Drugs were not added. Please Check Again<br>"

            }
        }
    }


    if (payment.paymentHasBatchList==0){
        errors =errors + "Please Add Purchase Drugs<br>"

    }

    if ( selectPaymentMethod.value=='' || payment.inpaymentmethod_id==null ) {
        errors =errors + "Please select Payment Method<br>"
        selectPaymentMethod.classList.add('is-invalid')
    }

    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'cash' && (textPaidAmount.value=='' || payment.paidamount==null)  ) {
            errors =errors + "Please Enter Paid Amount<br>"
            textPaidAmount.classList.add('is-invalid')
    }

    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'transfer') {
        if (payment.bankname==null || selectBankName.value==''){
            errors =errors + "Please Select Bank Name<br>"
            selectBankName.classList.add('is-invalid')
        }

        if (payment.refno==null || textRefNo.value==''){
            errors =errors + "Please Enter Ref No<br>"
            textRefNo.classList.add('is-invalid')
        }

        if (payment.transferdatetime==null || textTransferDateTime.value==''){
            errors =errors + "Please Select Transfer Date-Time<br>"
            textTransferDateTime.classList.add('is-invalid')
        }
    }

    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'card') {

        if (payment.refno==null || textCardRefNo.value==''){
            errors =errors + "Please Enter Ref No<br>"
            textCardRefNo.classList.add('is-invalid')
        }


    }










    return errors;
}


// button add function
const buttonPresPayAdd=()=>{

    console.log(payment)

    let error=checkError();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    if (error==''){



        let PresNoInfo=``
        if (payment.prescription_id!=null){
            PresNoInfo+=`Prescription No : ${payment.prescription_id.code}<br>`
        }


      let   presInfo =`${PresNoInfo}
            Total Amount: ${payment.totalamount}<br>
            Paid Amount: ${payment.paidamount}<br>
           Balance Amount: ${payment.balanceamount}<br><br>
              `;

        if (batchNotFoundDrugs.length>0){

            let batchNotFoundDrugInfo=batchNotFoundDrugs.join("<br>")

            presInfo+=`<b>The following drugs could not be processed because no suitable batch was found:</b><br>
                         ${batchNotFoundDrugInfo}`
        }

        if (batchLowQty.length>0){

            let batchLowQtyDrugInfo=batchLowQty.join("<br>")

            presInfo+=`<b>following drugs are low on quantity and only the avaialble quantity is added :</b><br>
                         ${batchLowQtyDrugInfo}`
        }

        div.style.fontSize='16px'
        div.innerHTML=presInfo

        Swal.fire({
            title: "Payment Info",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/prescriptionpayment","POST",payment);
                if (new RegExp('^[0-9]{9}$').test(serverResponse)) {
                    Swal.fire({
                        title: "Successful",
                        text: "",
                        icon: "success"
                    });



                    refreshPresPayForm()
                    refreshPresPayTable()
                    $('a[href="#PaymentTable"]').tab('show');
                    console.log(serverResponse)
                    paymentRecord=ajaxGetReq("/prescriptionpayment/getpaymentbybillno/"+serverResponse);
                    console.log(paymentRecord)

                    printPresPay(paymentRecord)

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
        div.style.fontSize='15px'
        div.innerHTML=error
        Swal.fire({
            icon: "error",
            title: "Form has following errors.",
            html: div


        });
    }
}


// print prescription payment details method
const  printPresPay=(rowOb)=>{
    console.log(rowOb)
    const Print=rowOb;

    tdBillNo.innerHTML=Print.billno




    if (Print.prescription_id!=null){
        tdPresNoOb.innerHTML=Print.prescription_id.code
    }else{
        tdPresNoOb.innerHTML=''

    }
    tdPaidAmount.innerHTML=parseFloat(Print.paidamount).toFixed(2)
    tdTotalAmount.innerHTML=parseFloat(Print.totalamount).toFixed(2)
    tdBalanceAmount.innerHTML=parseFloat(Print.balanceamount).toFixed(2)
    tdPaymentMethod.innerHTML=Print.inpaymentmethod_id.name

    tdDateTime.innerHTML=Print.addeddatetime.split('T')[0]+' '+Print.addeddatetime.split('T')[1]


    let addeduser=ajaxGetReq("/user/getuserbyid/"+Print.addeduser);
    tdUser.innerHTML=addeduser.username;


    // refresh inner table
    const displayInnerTableProperty=[
        {property:getDrugName,datatype:'function'},
        {property:getUnitPrice,datatype:'function'},
        {property:'quantity',datatype:'string'},
        {property:getLinePrice,datatype:'function'}

    ]


    fillDataIntoInnerTable(printInnerTable,Print.paymentHasBatchList,displayInnerTableProperty,deleteInnerTableRow,false)


    printPresPaymentDetails();




}

// function to print prescription payment details
const printPresPaymentDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Payment Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printPresPayTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
            newTab.close()
        },2000
    )
}



//prescription payment table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print payment table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Prescription Payment table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
                '</head>'+
                '<h2  class="Text-center">Prescription Payment Table Details<h2>'+
                tablePresPayment.outerHTML
                // '<script>$(".btn-display").css("display","none")</script>'+
                // '<script>$(".btn-display").hide("display","none")</script>'
            )
            setTimeout(
                function() {
                    newTab.print()
                    newTab.close()
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




// button clear
const buttonClear=()=>{
    txtPrescriptionNo.value=''
    txtPrescriptionNo.classList.remove('is-valid')



    selectPaymentMethod.value=''
    selectPaymentMethod.classList.remove('is-valid')
    selectPaymentMethod.classList.add('is-invalid')


    txtDrugName.classList.remove('is-valid')

    txtDrugName.value=''


    selectBatch.classList.remove('is-valid')

    selectBatch.value=''


    textUnitPrice.classList.remove('is-valid')
    textUnitPrice.value=''



    textTotalQty.classList.remove('is-valid')
    textTotalQty.value=''



    textLinePrice.classList.remove('is-valid')
    textLinePrice.value=''




    selectBankName.classList.remove('is-valid')
    selectBankName.value=''

    textTransferDateTime.classList.remove('is-valid')
    textTransferDateTime.value=''

    textRefNo.classList.remove('is-valid')
    textRefNo.value=''

    textCardRefNo.classList.remove('is-valid')
    textCardRefNo.classList.add('is-invalid')
    textCardRefNo.value=''

    textTotalAmount.classList.remove('is-valid')
    textTotalAmount.classList.add('is-invalid')
    textTotalAmount.value=''

    textPaidAmount.classList.remove('is-valid')
    textPaidAmount.classList.add('is-invalid')
    textPaidAmount.value=''

    textBalanceAmount.classList.remove('is-valid')
    textBalanceAmount.classList.add('is-invalid')
    textBalanceAmount.value=''


    payment.paymentHasBatchList=[]
    refreshInnerFormAndTable()




}


// delete function for payment delete
const  deleteAppPay=(rowOb)=>{}

// refill function
const refillAppPayForm=(rowOb)=>{}




// for (let element of prescriptionDrugList) {
//     // batch = ajaxGetReq("/batch/getbatchbysalesdrugid/" + element.salesdrug_id.id + "/" + element.totalqty);
//     batchList = ajaxGetReq("/batch/getbatclisthbysalesdrugid/" + element.salesdrug_id.id);
//     console.log(batchList)
//
// //             let batch;
// //
// //  // find batch element where salesdrugavailableqty >= element.totalqty and assign to batch, stop from looping
// //             for (let batchElement of batchList) {
// //                 if (batchElement.salesdrugavailableqty >= element.totalqty) {
// //                     batch = batchElement;
// //                     break;
// //                 }
// //             }
// //
// // // If  suitable batchElement was  not found then check the first element of batchList
// //             if (!batch && batchList.length > 0) {
// //                 let firstElement = batchList[0];
// //                 // Assign the first element if its quantity is greater than 0
// //                 if (firstElement.salesdrugavailableqty > 0) {
// //                     batch = firstElement;
// //                 } else {
// //                     // If the first elements quantity is not greater than 0 then search for the next element
// //                     for (let batchElement of batchList) {
// //                         if (batchElement.salesdrugavailableqty > 0) {
// //                             // Assign the first element with quantity > 0
// //                             batch = batchElement;
// //                             break;
// //                         }
// //                     }
// //                 }
// //             }
// //             console.log(batch)
// //             if (batch != null) {
// //                 // if there are no batch that value is greater than element.totalqty then assign the available qty
// //                 // let quantity = Math.min(element.totalqty, batch.salesdrugavailableqty);
// //                 let quantity;
// //
// //                 if (element.totalqty <= batch.salesdrugavailableqty) {
// //                     quantity = element.totalqty;
// //                 } else {
// //                     quantity = batch.salesdrugavailableqty;
// //                 }
// //                 drugbatch = {
// //
// //                     batch_id: batch,
// //                     unitprice: batch.saleprice,
// //                     quantity: quantity,
// //                     lineprice: parseFloat(Number(batch.saleprice) * element.totalqty).toFixed(2)
// //                 }
// //                 payment.paymentHasBatchList.push(drugbatch);
// //                 refreshInnerFormAndTable()
// //             }
// //             else{
// //
// //                 batchNotFoundDrugs.push(element.salesdrug_id.name)
// //                 console.log(batchNotFoundDrugs)
// //                 // if batch not found then show not batch found
// //                 Swal.fire({
// //                     title: 'No Batch Found',
// //                     html: 'No suitable batch was found for drug.<br>'+element.salesdrug_id.name,
// //                     icon: 'error',
// //                     confirmButtonText: 'OK'
// //                 });
// //             }



