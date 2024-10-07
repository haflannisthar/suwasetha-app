window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Supplier Payment");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshSpayTable()
    refreshSpayForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshSpayTable=()=>{
    paymentDataList=ajaxGetReq("/supplierpayment/findall");

    const displayProperty=[
             {property:'billno',datatype:'string'},
          {property:getSupplierName,datatype:'function'},
          {property:getGrnAmount,datatype:'function'},
        {property:getPaidAmountT,datatype:'function'},
        {property:getBalanceAmount,datatype:'function'},
          {property:getPaymentMethod,datatype:'function'}

    ]
    fillDataIntoTable(tableSPay,paymentDataList,displayProperty,refillSPayForm,deleteSPay,printSPay,true,UserPrivilege);
    disableDeleteAndRefillBtn();
    $('#tableSPay').dataTable();



}
// function to getsupplier name
const getSupplierName=(rowOb)=>{
    return rowOb.supplier_id.name;
}
// function to get grn amount
const getGrnAmount=(rowOb)=>{
   return parseFloat(rowOb.grnamount).toFixed(2);
}
const getBalanceAmount=(rowOb)=>{
    return parseFloat(rowOb.balanceamount).toFixed(2);
}
const getPaidAmountT=(rowOb)=>{
    return parseFloat(rowOb.paidamount).toFixed(2);
}
const getPaymentMethod=(rowOb)=>{
    return rowOb.paymentmethod_id.name;
}

// delete button refill and delete status
const  disableDeleteAndRefillBtn=()=>{
    const tableSPay = document.getElementById("tableSPay");
    const tableRows = tableSPay.querySelectorAll("tbody tr");

if (tableRows.length>0){
    tableRows.forEach(function(row) {


        const actionCell = row.querySelector("td:nth-child(8)"); // Adjusted selector for action cell
        const dropdown = actionCell.querySelector(".dropdown");
        const deleteButton = dropdown.querySelector(".btn-danger");
        const updateButton = dropdown.querySelector(".btn-info");

        updateButton.disabled = true;
        updateButton.style.display = "none";

        if (UserPrivilege.delete){
            deleteButton.disabled = true;

            deleteButton.style.display = "none";
        }


    });
}

}



const refreshSpayForm=()=>{

    SpayTitle.innerHTML='New Supplier Payment Enrollment'




    supplierpayment={}
    supplierpayment.supplierPaymentHasGrnList=[]



    suppliers=ajaxGetReq("/supplier/grnsupplierlist");
    fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name')

    paymentMethod=ajaxGetReq("/paymentmethod/list");
    fillDataIntoSelect(selectPaymentMethod,"Select Pay Method",paymentMethod,'name')

    chkpayment.style.display='none'
    // chkpayment.style.visibility='hidden'
    bnkpayment.style.display='none'
    // bnkpayment.style.visibility='hidden'
    transferpayment.style.display='none'
    // transferpayment.style.visibility='hidden'


// set date for check date
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
    textCheckDate.min=currentDate.getFullYear() +"-"+ minMonth+"-"+minDay;


    maxDate.setDate(maxDate.getDate());

    let maxDay=maxDate.getDate();
    if (maxDay <10){
        maxDay='0'+maxDay;
    }

    let maxMonth=maxDate.getMonth()+3;
    if (maxMonth<10){
        maxMonth='0'+maxMonth;

    }
    textCheckDate.max=maxDate.getFullYear()+"-"+maxMonth+"-"+maxDay
    //



    // deposit date time
    let depositMinDate=new Date()
    let depositMaxDate=new Date()

    depositMinDate.setDate(depositMinDate.getDate() - 5);


    let minDepMonth =depositMinDate.getMonth()+1;

    if (minDepMonth<10){
        minDepMonth='0'+minDepMonth;
    }

    let minDepDay= depositMinDate.getDate();

    if (minDepDay < 10){
        minDepDay='0'+ minDepDay;
    }

    let now=new Date()

    // let hoursMin = new Date().getHours();
    let hoursMin=new Date()
    hoursMin.setHours(now.getHours()-2)
    let minutesMin = new Date().getMinutes();

    // Extract the hours and minutes
    let formattedHoursMin = hoursMin.getHours();
    let formattedMinutesMin = now.getMinutes(); // Use 'now' for minutes

    if (formattedHoursMin < 10) {
        formattedHoursMin = '0' + formattedHoursMin;
    }
    if (formattedMinutesMin < 10) {
        formattedMinutesMin = '0' + formattedMinutesMin;
    }


    textDepositDate.min = `${depositMinDate.getFullYear()}-${minDepMonth}-${minDepDay}T${formattedHoursMin}:${formattedMinutesMin}`;


    let MaxDepMonth =depositMaxDate.getMonth()+1;

    if (MaxDepMonth<10){
        MaxDepMonth='0'+MaxDepMonth;
    }

    let maxDepDay= depositMaxDate.getDate();

    if (maxDepDay < 10){
        maxDepDay='0'+ maxDepDay;
    }


    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    if(minutes<10){
        minutes='0'+minutes;
    }

    if(hours<10){
        hours='0'+hours;
    }






    textDepositDate.max=`${depositMaxDate.getFullYear()}-${MaxDepMonth}-${maxDepDay}T${hours}:${minutes}`


    console.log("min dep date " +textDepositDate.min)
    console.log("max dep date time " +textDepositDate.max)

    // refresh innerform and table
    refreshInnerFormAndTable();



    // set default value
    selectSupplier.value=''
    textGrnAmount.value=''
    textPaidAmount.value=''
    textBalanceAmount.value=''
    textNote.value=''
    selectPaymentMethod.value=''
    textCheckDate.value=''
    textCheckNo.value=''
    selectBankName.value=''
    textAccountNo.value=''
    textDepositDate.value=''
    textTransferId.value=''

    //set default color by removing valid and invalid colors
    selectSupplier.classList.remove("is-valid")
    selectSupplier.classList.remove("is-valid")
    textGrnAmount.classList.remove("is-valid")
    textPaidAmount.classList.remove("is-valid")
    textBalanceAmount.classList.remove("is-valid")
    textNote.classList.remove("is-valid")
    selectPaymentMethod.classList.remove("is-valid")
    textCheckDate.classList.remove("is-valid")
    textCheckNo.classList.remove("is-valid")
    selectBankName.classList.remove("is-valid")
    textAccountNo.classList.remove("is-valid")
    textDepositDate.classList.remove("is-valid")
    textTransferId.classList.remove("is-valid")

    selectSupplier.classList.remove("is-invalid")
    selectSupplier.classList.remove("is-invalid")
    textGrnAmount.classList.remove("is-invalid")
    textPaidAmount.classList.remove("is-invalid")
    textBalanceAmount.classList.remove("is-invalid")
    textNote.classList.remove("is-invalid")
    selectPaymentMethod.classList.remove("is-invalid")
    textCheckDate.classList.remove("is-invalid")
    textCheckNo.classList.remove("is-invalid")
    selectBankName.classList.remove("is-invalid")
    textAccountNo.classList.remove("is-invalid")
    textDepositDate.classList.remove("is-invalid")
    textTransferId.classList.remove("is-invalid")


    // DiSABLE BUTTON
    textGrnAmount.disabled=true
    textBalanceAmount.disabled=true
    textPaidAmount.disabled=true
    selectSupplier.disabled=false


    // disable btn for everyone who dont have insert privilege
    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
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


}



// refresh inner form and inner table
const refreshInnerFormAndTable=()=>{


    paymentgrn={}


    grnList=ajaxGetReq("/grn/receivedlist");
    fillDataIntoSelect(selectGrn,"Select Grn",grnList,'grnno')

    //     empty all element
    selectGrn.disabled=true
    selectGrn.value=''
    textAvailableBalance.value=''
    textAvailableBalance.disabled=true
    textPaidAmountIF.value=''
    textPaidAmountIF.disabled=true


    if (selectSupplier.value!=''){

        grnListBySupplier = ajaxGetReq("/grn/getgrnbysupplierid/" + JSON.parse(selectSupplier.value).id);
         selectSupplier.disabled=true;
        selectGrn.disabled=false;
        fillDataIntoSelect(selectGrn, 'Select Grn', grnListBySupplier, 'grnno')
    }




//     default color
    selectGrn.classList.remove("is-valid")
    textAvailableBalance.classList.remove("is-valid")
    textPaidAmountIF.classList.remove("is-valid")

//     refresh inner table

    const displayInnerTableProperty=[
        {property:getGrnNo,datatype:'function'},
        {property:getAvailableBalance,datatype:'function'},
        {property:getPaidAmount,datatype:'function'}

    ]


    fillDataIntoInnerTable(Grninnertable, supplierpayment.supplierPaymentHasGrnList,displayInnerTableProperty,deleteInnerItemForm)

    // calculate total amount and set it to total amount input field
    let totalAmount=0.00;

    supplierpayment.supplierPaymentHasGrnList.forEach(element=>{
        totalAmount=parseFloat(totalAmount)+ parseFloat(element.paidamount);
        console.log(totalAmount)
    })
    textPaidAmount.value= parseFloat(totalAmount).toFixed(2)

    if (totalAmount==0.00){
        supplierpayment.paidamount=null
        textPaidAmount.classList.remove("is-valid")
        textBalanceAmount.classList.remove("is-valid")
        textBalanceAmount.value='0.00'
        supplierpayment.balanceamount=null


    }else {
        supplierpayment.paidamount=textPaidAmount.value;
        textPaidAmount.classList.remove("is-invalid")
        textPaidAmount.classList.add("is-valid")
        calculateBalanceAmount()

    }

    // if ( supplierpayment.supplierPaymentHasGrnList.length<0){
    //
    // }



}

// function to get grn no in inner table
const getGrnNo=(ob)=>{
    return ob.grn_id.grnno
}

// function to get balance amount in inner table
const getAvailableBalance=(ob)=>{
  return parseFloat(ob.availablebalance).toFixed(2)
}

// function to get paid amount in inner table
const getPaidAmount=(ob)=>{
 return  parseFloat(ob.paidamount).toFixed(2)
}


// get grn no  details by supplier no
const getGrnList=()=>{

    if (selectSupplier.value!='') {
        selectGrn.disabled = false

        grnListBySupplier = ajaxGetReq("/grn/getgrnbysupplierid/" + JSON.parse(selectSupplier.value).id);
        // selectSupplier.disabled=true;

            fillDataIntoSelect(selectGrn, 'Select Grn', grnListBySupplier, 'grnno')

        selectGrn.classList.remove("is-valid")
        textAvailableBalance.value='Available Balance'
        textAvailableBalance.classList.remove("is-valid")
        paymentgrn.availablebalance=null


    }

}
// refresh table by user confirmation
const refreshSpayFormByUserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSpayForm();
        }
    });
}

// get supplier net  amount by supplier id
const getSupplierTotalAmount=()=>{
    grnTotalBySupplier = ajaxGetReq("/grn/getnetamountbysupplierid/" + JSON.parse(selectSupplier.value).id);
    selectSupplier.disabled=true
    console.log(grnTotalBySupplier +"total")
    textGrnAmount.value=parseFloat(grnTotalBySupplier).toFixed(2)
    supplierpayment.grnamount=textGrnAmount.value
    textGrnAmount.classList.add("is-valid")

}

// fill the available balance of selected grn value
const fillAvailableBalance=()=>{
    if (selectGrn.value!=''){
        grnListByGrnNo = ajaxGetReq("/grn/getgrnbygrnno/" + JSON.parse(selectGrn.value).id);
        console.log(grnListByGrnNo)
        textAvailableBalance.value=parseFloat(grnListByGrnNo).toFixed(2);
        textAvailableBalance.classList.add("is-valid")
        paymentgrn.availablebalance=textAvailableBalance.value

        textPaidAmountIF.disabled=false;
    }
}

// validate inner for paid amount field
const validatePaidAmount=()=>{

    const newP=new RegExp('^[1-9][0-9]{1,5}(\\.[0-9]{2})?$')

    if (newP.test(textPaidAmountIF.value)){
        if (parseFloat(textAvailableBalance.value) < parseFloat(textPaidAmountIF.value)){
            let timerInterval;
            Swal.fire({
                title: "Paid Amount Cannot Exceed Balance Amount",
                timer: 1000,

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

}

// add two decimal places to the paid amount inner form field
const insertDecimalPoints=()=>{

    textPaidAmountIF.value=parseFloat(textPaidAmountIF.value).toFixed(2)
}


// calculate balance amount
const calculateBalanceAmount=()=>{
    textBalanceAmount.value=parseFloat(textGrnAmount.value-textPaidAmount.value).toFixed(2);
    textBalanceAmount.classList.add("is-valid")
    textBalanceAmount.classList.remove("is-invalid")
    supplierpayment.balanceamount= textBalanceAmount.value;
}

//delete inner table row
const deleteInnerItemForm=(rowOb,rowInd)=>{
// user confirmation
    let itemInfo=rowOb.grn_id.name

    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.style.fontSize='16px'
    div.innerHTML=itemInfo

    Swal.fire({
        title: "Are you sure to remove following grn?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {

            supplierpayment.supplierPaymentHasGrnList.splice(rowInd,1)


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

// inner form error
const checkInnerFormError=()=>{
    let errors=''
    if(paymentgrn.grn_id==null || selectGrn.value==''){
        errors+="please select Grn no<br>"
        selectGrn.classList.add("is-invalid");
    }
    // if(paymentgrn.availablebalance==null || textAvailableBalance.value==''){
    //     errors+="please enter valid a unit price<br>"
    //     textAvailableBalance.classList.add("is-invalid");
    // }
    if(paymentgrn.paidamount==null || textPaidAmountIF.value==''){
        errors+="please enter valid Paid Amount<br>"
        textPaidAmountIF.classList.add("is-invalid");
    }

    return errors;
}

// check grn whether aailable in table
const checkGrn=()=>{
    let selectedGrn=JSON.parse(selectGrn.value);

    let extIndex= supplierpayment.supplierPaymentHasGrnList.map(element=>element.grn_id.id).indexOf(selectedGrn.id)

    if (extIndex != -1){
        let timerInterval;
        Swal.fire({
            title: "Grn already entered to table",
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

// inner form grn add
const btnInnerGrnAdd=()=>{
    console.log("drugadd");
//     check for error
    let error=checkInnerFormError();


    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.style.fontSize='16px'

    if(error==''){
        let grnDetails=  `Batch No: ${paymentgrn.grn_id.grnno}<br>
                                              Grn Balance Amount: ${paymentgrn.availablebalance} <br>
                                               Paid Amount: ${paymentgrn.paidamount} 
                                                `

        div.innerHTML=grnDetails

        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following grn?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Grn Added Successfully!",

                    icon: "success"
                });

                //     push into array
                supplierpayment.supplierPaymentHasGrnList.push(paymentgrn);
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
            title:'Form has Following Errors',
            html:div,


        });
    }

}

// show payment detials field based on selected payment method field
const enablePaymentField=()=>{

    // const selectedMethodval = selectPaymentMethod.value;

    const chkPayment = document.getElementById('chkpayment');
    const bnkPayment = document.getElementById('bnkpayment');
    const transferPayment = document.getElementById('transferpayment');



    // hide all the fields
    chkPayment.style.display = 'none';
    bnkPayment.style.display = 'none';
    transferPayment.style.display = 'none';

    // Show the relevant payment detail field based on selected method
    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'bank transfer') {
        transferPayment.style.display = 'block';
    } else if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'bank deposit') {
        bnkPayment.style.display = 'block';
    } else if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'cheque') {
        chkPayment.style.display = 'block';
    }


    textCheckNo.value=''
    textCheckNo.classList.remove("is-valid")
    textCheckDate.value=''
    textCheckDate.classList.remove("is-valid")
    banknames=[
        {id:1,name:'Bank Of Ceylon'},
        {id:2,name:'People\'s Bank'},
        {id:3,name:'Commercial Bank'},
        {id:4,name:'Hatton National Bank'},
        {id:5,name:'Sampath Bank'},
        {id:5,name:'Nations Trust Bank'},
        {id:5,name:'DFCC Bank'},
        {id:5,name:'Union Bank'},
        {id:5,name:'Pan Asia Bank'},
        {id:5,name:'Seylan Bank'}
    ]
    fillDataIntoSelect(selectBankName,'Select Bank',banknames,'name');

    // bankList=ajaxGetReq("/bank/findall")
    // fillDataIntoSelect(selectBankName,'Select Bank',bankList,'name');
    selectBankName.classList.remove("is-valid")
    textAccountNo.value=''
    textAccountNo.classList.remove("is-valid")
   textDepositDate.value=''
    textDepositDate.classList.remove("is-valid")

    textTransferId.value=''
    textTransferId.classList.remove("is-valid")


    supplierpayment.checkno=null;
    supplierpayment.checkdate=null;
    supplierpayment.bankname=null;
    supplierpayment.accountno=null;
    supplierpayment.depositdatetime=null;
    supplierpayment.transferid=null;


}

// get bank details if the selected payment method is bank deposit
const getBankDetails=()=> {
    // console.log("bnk-1")
    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'bank deposit') {
        //

        if (selectSupplier.value!==''){
            let supplierBankDetails = ajaxGetReq("/supplier/getbankdetails/" + JSON.parse(selectSupplier.value).id)
            console.log(supplierBankDetails)
            if (supplierBankDetails.branch_id.bank_id != null && supplierBankDetails.accountnumber != null) {
                console.log("bnk-2")


                let showBankDetails = "bank name : " + supplierBankDetails.branch_id.bank_id.name + "<br>" + "account no : " + supplierBankDetails.accountnumber


                Swal.fire({
                    title: "Are you want to fill the following bank details?",
                    html: showBankDetails,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Confirm"
                }).then((result) => {
                    if (result.isConfirmed) {
                        textAccountNo.value = supplierBankDetails.accountnumber
                        supplierpayment.accountno = textAccountNo.value
                        textAccountNo.classList.add("is-valid")


                        fillDataIntoSelect(selectBankName, 'Select Bank', banknames, 'name', supplierBankDetails.branch_id.bank_id.name);
                        supplierpayment.bankname = JSON.parse(selectBankName.value).name
                        console.log("obj v" + supplierpayment.bankname);
                        selectBankName.classList.add("is-valid")


                    }
                })
            }
        }




    }
}



// time validation (show error if user select time ahead of current time)
const timeValidation =()=>{



   let selectedDateTime= textDepositDate.value;

   let  depositMaxDate=new Date();

    let MaxDepMonth =depositMaxDate.getMonth()+1;

    if (MaxDepMonth<10){
        MaxDepMonth='0'+MaxDepMonth;
    }

    let maxDepDay= depositMaxDate.getDate();

    if (maxDepDay < 10){
        maxDepDay='0'+ maxDepDay;
    }


    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();

    if(minutes<10){
        minutes='0'+minutes;
    }

    // current time to check if it is ahead of selected time
    let currentDateTime=`${depositMaxDate.getFullYear()}-${MaxDepMonth}-${maxDepDay}T${hours}:${minutes}`

    // current time to show error message (T removed)
    let currentDateTimeToShowError=`${depositMaxDate.getFullYear()}-${MaxDepMonth}-${maxDepDay} ${hours}:${minutes}`


    if (currentDateTime<selectedDateTime){
        let timerInterval;
        Swal.fire({
            title: "Cannot Select a Time Ahead of Current Date-Time",
            text:currentDateTimeToShowError,
            timer: 4000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            textDepositDate.value=''

        });
    }



}
// delete function for payment delete
const  deleteSPay=(rowOb)=>{
}


// print payment details method
const  printSPay=(rowOb)=>{

    const PrintOb=rowOb;

    tdBillNo.innerHTML=PrintOb.billno
    tdSupplierName.innerHTML=PrintOb.supplier_id.name
    tdSupplierAddress.innerHTML=PrintOb.supplier_id.address
    tdMobile.innerHTML=PrintOb.supplier_id.contactno

    tdPMethod.innerHTML=PrintOb.paymentmethod_id.name

    tdGrnAmount.innerHTML=parseFloat(PrintOb.grnamount).toFixed(2)
    tdPaidAmount.innerHTML=parseFloat(PrintOb.paidamount).toFixed(2)
    tdBalanceAmount.innerHTML=parseFloat(PrintOb.balanceamount).toFixed(2)

    if (PrintOb.note==null){
        tdNote.innerHTML="-"
    }
    else {
        tdNote.innerHTML=PrintOb.note
    }
    let addedUser=ajaxGetReq("/user/getuserbyid/"+PrintOb.addeduser);
    tdUser.innerHTML=addedUser.username;

    let date=PrintOb.addeddatetime
    tdDate.innerHTML=date.substring(0,10) + date.substring(11,19);

    const displayInnerTableProperty=[
        {property:getGrnNo,datatype:'function'},
        {property:getAvailableBalance,datatype:'function'},
        {property:getPaidAmount,datatype:'function'}

    ]


    fillDataIntoInnerTable(printinnertable, PrintOb.supplierPaymentHasGrnList,displayInnerTableProperty,deleteInnerItemForm,false)



    let PrintInfo = `Payment Billno Number : ${PrintOb.billno}<br>
               `
    Swal.fire({
        title: "are you sure Print following Payment record?",
        html:PrintInfo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printSuppPayDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}
// function to print payment details
const printSuppPayDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Supplier Payment Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printSupplierPaymentTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
            newTab.close()
        },2000
    )
}




// check form error
const  checkError=()=>{

    let errors="";

    console.log(supplierpayment.balanceamount)

    if ( selectSupplier.value=='' || supplierpayment.supplier_id==null ) {
        errors =errors + "Please select Supplier <br>"
        selectSupplier.classList.add('is-invalid')
    }
    if (textGrnAmount.value==''|| supplierpayment.grnamount==null) {
        errors =errors + "Please select Supplier <br>"
        selectSupplier.classList.add('is-invalid')
    }
    if (textPaidAmount.value==''|| supplierpayment.paidamount==null) {
        errors =errors + "Please select Supplier<br>"
        textPaidAmount.classList.add('is-invalid')
    }
    if (textBalanceAmount.value=='' || supplierpayment.balanceamount==null) {
        errors =errors + "Please fill the relevent fields<br>"
        textBalanceAmount.classList.add('is-invalid')
    }

    if (selectPaymentMethod.value=='' || supplierpayment.paymentmethod_id==null) {
        errors =errors + "Please select Payment Method<br>"
        selectPaymentMethod.classList.add('is-invalid')
    }else {
        if ( supplierpayment.paymentmethod_id.name=='bank transfer') {

            if (textTransferId.value=='' || supplierpayment.transferid==null) {
                errors =errors + "Please enter Transfer Id<br>"
                textTransferId.classList.add('is-invalid')
            }
        }
        if ( supplierpayment.paymentmethod_id.name=='bank deposit') {

            if (selectBankName.value=='' || supplierpayment.bankname==null) {
                errors =errors + "Please select bank name<br>"
                selectBankName.classList.add('is-invalid')
            }
            if (textAccountNo.value=='' || supplierpayment.accountno==null) {
                errors =errors + "Please enter Account Number<br>"
                textAccountNo.classList.add('is-invalid')
            }
            if (textDepositDate.value=='' || supplierpayment.depositdatetime==null) {
                errors =errors + "Please select Deposit Date Time<br>"
                textDepositDate.classList.add('is-invalid')
            }
        }
        if ( supplierpayment.paymentmethod_id.name=='cheque') {

            if (textCheckNo.value=='' || supplierpayment.checkno==null) {
                errors =errors + "Please enter Cheque No<br>"
                textCheckNo.classList.add('is-invalid')
            }
            if (textCheckDate.value=='' || supplierpayment.checkdate==null) {
                errors =errors + "Please select cheque date<br>"
                textCheckDate.classList.add('is-invalid')
            }
        }
    }


    if ( supplierpayment.supplierPaymentHasGrnList==0) {
        errors =errors + "Please select Grn data to add to table [grn list cannot be empty]<br>"
    }



    return errors;
}


// supplier payment add function
const buttonSpayAdd=()=>{
    console.log(selectBankName.value)
    console.log(supplierpayment)
    let error=checkError();

    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.style.fontSize='16px'


    if (error==''){
         let Info = `
              Supplier : ${supplierpayment.supplier_id.name}<br>
               Grn Amount: ${supplierpayment.grnamount}<br>
               Paid Amount: ${supplierpayment.paidamount}<br>
                 Balance Amount : ${supplierpayment.balanceamount}<br>
                Payment Method : ${supplierpayment.paymentmethod_id.name}<br> 
                  `;

         if (supplierpayment.note !=null){
             Info += `Note  : ${supplierpayment.note}<br>`
         }

         if(supplierpayment.paymentmethod_id.name=='bank transfer'){
             Info += `Transfer Id  : ${supplierpayment.transferid}<br>`
         }
        if(supplierpayment.paymentmethod_id.name=='bank deposit'){
            Info += `Bank Name  : ${supplierpayment.bankname}<br>`
            Info += `Account No  : ${supplierpayment.accountno}<br>`
            Info += `Deposit Date Time  : ${supplierpayment.depositdatetime}<br>`
        }
        if(supplierpayment.paymentmethod_id.name=='cheque'){
            Info += `Check No  : ${supplierpayment.checkno}<br>`
            Info += `Check Date  : ${supplierpayment.checkdate}<br>`
        }

        div.innerHTML=Info
        Swal.fire({
            title: "Are you sure to add following Payment record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/supplierpayment","POST",supplierpayment);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Supplier record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshSpayTable()
                    refreshSpayForm()
                    $('a[href="#PayTable"]').tab('show');

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
            title: "Form has Following Errors",
            html: div


        });
    }
}

// refill form
const refillSPayForm=(rowOb)=>{
}






//supplier payment table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print supplier payment table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Supplier Payment table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Supplier Payment Table Details<h2>'+
                tableSPay.outerHTML
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






const buttonSPayClear=()=>{

    selectSupplier.value=''
    suppliers=ajaxGetReq("/supplier/grnsupplierlist");
    fillDataIntoSelect(selectSupplier,"Select Supplier",suppliers,'name')
    selectSupplier.classList.remove('is-valid')
    selectSupplier.classList.add('is-invalid')


    textPaidAmount.classList.remove('is-valid')
    textPaidAmount.classList.add('is-invalid')
    textPaidAmount.value=""
    supplierpayment.paidamount=null

    textGrnAmount.classList.remove('is-valid')
    textGrnAmount.classList.add('is-invalid')
    textGrnAmount.value=''





    textBalanceAmount.classList.remove('is-valid')
    textBalanceAmount.classList.add('is-invalid')
    textBalanceAmount.value=''
    supplierpayment.balanceamount=null



    textNote.classList.remove('is-valid')
    textNote.value=''

    // Show the relevant payment detail field based on selected method
    if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'bank transfer') {

        textTransferId.value=''

    } else if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'bank deposit') {

        banknames=[
            {id:1,name:'Bank Of Ceylon'},
            {id:2,name:'People\'s Bank'},
            {id:3,name:'Commercial Bank'},
            {id:4,name:'Hatton National Bank'},
            {id:5,name:'Sampath Bank'},
            {id:5,name:'Nations Trust Bank'},
            {id:5,name:'DFCC Bank'},
            {id:5,name:'Union Bank'},
            {id:5,name:'Pan Asia Bank'},
            {id:5,name:'Seylan Bank'}
        ]

        selectBankName.value=''
        fillDataIntoSelect(selectBankName,'Select Bank',banknames,'name');


        textAccountNo.value=''


        textDepositDate.value=''

    } else if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'cheque') {

        textCheckNo.value=''


        textCheckNo.value=''

    }


    selectPaymentMethod.classList.remove('is-valid')
    selectPaymentMethod.classList.add('is-invalid')
    selectPaymentMethod.value=''
    paymentmethod=ajaxGetReq("/paymentmethod/list");
    fillDataIntoSelect(selectPaymentMethod,"Select Pay Method",paymentmethod,'name')

    selectGrn.value=''
supplierpayment.supplierPaymentHasGrnList=[]
     refreshInnerFormAndTable();
    selectSupplier.disabled=false



}



