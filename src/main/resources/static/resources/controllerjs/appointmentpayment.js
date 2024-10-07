window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Appointment Payment");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshAppPayTable()
    refreshAppPayForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshAppPayTable=()=>{
    appointmentPaymentList=ajaxGetReq("/appointmentpayment/findall");
    const displayProperty=[
             {property:'billno',datatype:'string'},
             {property:getAppointmentNo,datatype:'function'},
            {property:getTotalAmount,datatype:'function'},
            {property:getPaidMethod,datatype:'function'},
             {property:getAddedUser,datatype:'function'},
             {property:getAddedDateTime,datatype:'function'},


    ]
    fillDataIntoTable(tableAppPayment,appointmentPaymentList,displayProperty,refillAppPayForm,deleteAppPay,printAppPay,true,UserPrivilege);



    disableDeleteAndUpdateForm();
    $('#tableAppPayment').dataTable();
}

// get appointment no
const getAppointmentNo=(rowOb)=>{
   return rowOb.appointment_id.appno
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
    const tableAppPayment = document.getElementById("tableAppPayment");
    const tableRows = tableAppPayment.querySelectorAll("tbody tr");

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
const refreshAppPayForm=()=>{

    Title.innerHTML=' New Invoice'

       payment={}

    refreshBtn.style.visibility = 'visible'

    appointmentList=ajaxGetReq("/appointment/getpendingappointmentlist");
    console.log(appointmentList)
    fillDataIntoDataList(dataListAppNo,appointmentList,'appno')

    invoicePaymentMethod=ajaxGetReq("/invoicepaymentmethod/list");
    fillDataIntoSelect(selectPaymentMethod,'Select Payment Method',invoicePaymentMethod,'name','cash')
    payment.inpaymentmethod_id=JSON.parse(selectPaymentMethod.value)
    selectPaymentMethod.classList.add('is-valid')
    getPaymentMethod()



    // set logged user
    userDetail=ajaxGetReq("/profile/loggeduser");
    loggedUser.value=userDetail.username
    loggedUser.style.borderColor='orange'



    // hide payment fields
    transferPayment.style.display='none'
    cardPayment.style.display='none'


    textTotalAmount.disabled=true
    textBalanceAmount.disabled=true

    // set default value
    txtAppNo.value=''

    selectBankName.value=''
    textRefNo.value=''
    textTransferDateTime.value=''

    textTotalAmount.value=''
    textPaidAmount.value=''
    textBalanceAmount.value=''
    textCardRefNo.value=''


    //remove valid color
    txtAppNo.classList.remove('is-valid')
    selectBankName.classList.remove('is-valid')
    textRefNo.classList.remove('is-valid')
    textTransferDateTime.classList.remove('is-valid')
    textTotalAmount.classList.remove('is-valid')
    textPaidAmount.classList.remove('is-valid')
    textBalanceAmount.classList.remove('is-valid')
    textCardRefNo.classList.remove('is-valid')
    // remove invalid color
    txtAppNo.classList.remove('is-invalid')
    selectPaymentMethod.classList.remove('is-invalid')
    selectBankName.classList.remove('is-invalid')
    textRefNo.classList.remove('is-invalid')
    textTransferDateTime.classList.remove('is-invalid')
    textTotalAmount.classList.remove('is-invalid')
    textPaidAmount.classList.remove('is-invalid')
    textBalanceAmount.classList.remove('is-invalid')
    textCardRefNo.classList.remove('is-invalid')


    // setting transfer date time min,max
    let transferMinDate = new Date();
    let transferMaxDate = new Date();

//  month
    let minTransferMonth = transferMinDate.getMonth() + 1;
    if (minTransferMonth < 10) {
        minTransferMonth = '0' + minTransferMonth; // Add leading zero if needed
    }

//  day
    let minTransferDay = transferMinDate.getDate();
    if (minTransferDay < 10) {
        minTransferDay = '0' + minTransferDay; // Add leading zero if needed
    }

// Get the current date and time
    let now = new Date();

// Set the hours to three hours earlier
    let hoursTransferMin = new Date();
    hoursTransferMin.setHours(now.getHours() - 3);

// Extract hours and minutes
    let formattedHoursTransferMin = hoursTransferMin.getHours(); // Get hour
    let formattedMinutesTransferMin = now.getMinutes(); // Get current minutes

// Format hours and minutes as strings
    if (formattedHoursTransferMin < 10) {
        formattedHoursTransferMin = '0' + formattedHoursTransferMin;
    }
    if (formattedMinutesTransferMin < 10) {
        formattedMinutesTransferMin = '0' + formattedMinutesTransferMin;
    }

// Set the min attribute for the transfer date input
    textTransferDateTime.min = `${transferMinDate.getFullYear()}-${minTransferMonth}-${minTransferDay}T${formattedHoursTransferMin}:${formattedMinutesTransferMin}`;


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

    console.log(textTransferDateTime.min)
    console.log(textTransferDateTime.max)




    //check privilege and if privilege true then allow
    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

}

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


// get appointment charge and show it on channelling charge field
const getAppChannellingCharge=()=>{

    textTotalAmount.value=''
    textTotalAmount.classList.remove('is-valid')


    //txt appointment field selected value
 let  selectedAppNoValue=txtAppNo.value

    appointmentList=ajaxGetReq("/appointment/getpendingappointmentlist");

   let extIndex=appointmentList.map(appointmentNo=>appointmentNo.appno).indexOf(selectedAppNoValue)

    if (extIndex!=-1){
        textTotalAmount.value=parseFloat(appointmentList[extIndex].channelingcharge).toFixed(2)
        textTotalAmount.classList.add('is-valid')
        payment.totalamount=textTotalAmount.value
        getPaymentMethod()

    }



}

// get payment method
// if cash then enable paid amount field
// else call the calculateBalanceAmount function and set the channelling fee value for paid amount and 0.00 for balance amount
const getPaymentMethod=()=>{





if (selectPaymentMethod.options[selectPaymentMethod.selectedIndex].text === 'cash') {

    // if the payment method is cash then paid amount, balance amount field null and default color on change

    textPaidAmount.disabled=false


    textPaidAmount.value=''
    textPaidAmount.classList.remove('is-valid')
    payment.paidamount=null;

    textBalanceAmount.value=''
    textBalanceAmount.classList.remove('is-valid')
    payment.balanceamount=null;

}
else {
    if (payment.appointment_id==null || txtAppNo.value==''){
        Swal.fire({
            icon: 'warning',
            title: 'No Appointment Selected',
            text: 'Please select an appointment first before proceeding.',
            confirmButtonText: 'OK'
        });
        invoicePaymentMethod=ajaxGetReq("/invoicepaymentmethod/list");
        fillDataIntoSelect(selectPaymentMethod,'Select Payment Method',invoicePaymentMethod,'name','cash')
        payment.inpaymentmethod_id=JSON.parse(selectPaymentMethod.value)
        selectPaymentMethod.classList.add('is-valid')

        transferPayment.style.display='none'
        cardPayment.style.display='none'


    }else {
        //txt appointment field selected value
        let  selectedAppNoValue=txtAppNo.value

        appointmentList=ajaxGetReq("/appointment/getpendingappointmentlist");

        let extIndex=appointmentList.map(appointmentNo=>appointmentNo.appno).indexOf(selectedAppNoValue)
        console.log(appointmentList)

        if (extIndex!=-1) {
            console.log(extIndex)
            console.log(appointmentList[extIndex])
            console.log(appointmentList[extIndex].id)
            appointmentAddedTime = ajaxGetReq("/appointment/getaddeddatetime/" +appointmentList[extIndex].id)
            console.log(appointmentAddedTime)
            // Set the min attribute to the specific value from the backend
            textTransferDateTime.min = appointmentAddedTime.substring(0,16);

            appointmentTime = ajaxGetReq("/appointment/getappointmenttime/" +appointmentList[extIndex].id)
            console.log(appointmentTime)
            let appointmentDate=appointmentTime.channellingdate
            let appointmentEndTime=appointmentTime.endtime;

        }
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
                        html: "Channelling Charge Cannot be greater than Paid Amount. Please Re-check the value",
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
        textPaidAmount.classList.add('is-valid')
        payment.paidamount=textPaidAmount.value

        textBalanceAmount.value='0.00'
        textBalanceAmount.classList.add('is-valid')
        payment.balanceamount=textBalanceAmount.value;


    }else {
        textPaidAmount.disabled=false



        let decimalPaidAmount=parseFloat(textPaidAmount.value).toFixed(2)
        let decimalChannellingCharge=parseFloat(textTotalAmount.value).toFixed(2)

        let regExpCheckAmount=new RegExp('^[1-9][0-9]{1,5}(\\.[0-9]{2})?$');

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
    console.log(textTransferDateTime.value)
    console.log(currentDateAndTime)
    // current time to show in error message (T removed)
    let currentDateAndTimeToShowError=`${transferDate.getFullYear()}-${transferMonth}-${transferDay} ${transferHours}:${transferMinutes}`

    // current time to check if it is ahead of selected time
    if (currentDateAndTime<selectedDateTime){
        let timerInterval;
        Swal.fire({
            html: "Invalid Time",
            text:currentDateAndTimeToShowError,
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
            refreshAppPayForm();
        }
    });
}

// check form error
const  checkError=()=>{

    let errors="";


    if ( txtAppNo.value=='' || payment.appointment_id==null ) {
        errors =errors + "Please select Appointment Number<br>"
        txtAppNo.classList.add('is-invalid')
    }
    if ( textPaidAmount.value=='' || payment.paidamount==null  ) {
        if (payment.appointment_id!=null){
            errors =errors + "Please Enter Paid Amount<br>"
            textPaidAmount.classList.add('is-invalid')
        }else {
            errors =errors + "Please Select Appointment First<br>"
            txtAppNo.classList.add('is-invalid')
        }


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
const buttonAppPayAdd=()=>{

    console.log(payment)
    let error=checkError();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    if (error==''){
        let appInfo = `Appointment No : ${payment.appointment_id.appno}<br>
            Channelling Fee: ${payment.appointment_id.channelingcharge}<br>
            Paid Amount: ${payment.paidamount}<br>
           Balance Amount: ${payment.balanceamount}<br>
              `;

        div.innerHTML=appInfo

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

                let serverResponse=ajaxRequestBody("/appointmentpayment","POST",payment);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Successful",
                        text: "",
                        icon: "success"
                    });


                    console.log(payment.appointment_id.id)
                    // get just added record to print
                   let Print=ajaxGetReq("/appointmentpayment/getlastaddedrecordbyappno/"+payment.appointment_id.id)
                    console.log(Print)
                    // print invoice
                    tdBillNo.innerHTML=Print.billno
                    tdAppNoOb.innerHTML=Print.appointment_id.appno
                    tdChannellingNoOb.innerHTML=Print.appointment_id.channaliingno

                    tdPaidAmount.innerHTML=Print.paidamount
                    tdChannellingCharge.innerHTML=Print.totalamount
                    tdBalanceAmount.innerHTML=Print.balanceamount
                    tdPaymentMethod.innerHTML=Print.inpaymentmethod_id.name

                    tdDateTime.innerHTML=Print.addeddatetime.split('T')[0]+' '+Print.addeddatetime.split('T')[1]


                    let addeduser=ajaxGetReq("/user/getuserbyid/"+Print.addeduser);
                    tdUser.innerHTML=addeduser.username;

                    printAppPaymentDetails()

                    refreshAppPayForm()
                    refreshAppPayTable()
                    $('a[href="#PaymentTable"]').tab('show');

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
            title: "Form has following errors.",
            html: div


        });
    }
}


// print appointment payment details method
const  printAppPay=(rowOb)=>{

    const Print=rowOb;

    console.log(Print)
    console.log(Print.appointment_id.channaliingno)

    tdBillNo.innerHTML=Print.billno
    tdAppNoOb.innerHTML=Print.appointment_id.appno
    tdChannellingNoOb.innerHTML=Print.appointment_id.channaliingno
    tdPaidAmount.innerHTML=parseFloat(Print.paidamount).toFixed(2)
    tdChannellingCharge.innerHTML=parseFloat(Print.totalamount).toFixed(2)
    tdBalanceAmount.innerHTML=parseFloat(Print.balanceamount).toFixed(2)
    tdPaymentMethod.innerHTML=Print.inpaymentmethod_id.name

    tdDateTime.innerHTML=Print.addeddatetime.split('T')[0]+' '+Print.addeddatetime.split('T')[1]


    let addeduser=ajaxGetReq("/user/getuserbyid/"+Print.addeduser);
    tdUser.innerHTML=addeduser.username;


    let PrintInfo =  `Bill No :  ${Print.billno}<br>
              App No  : ${Print.appointment_id.appno} `
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
            printAppPaymentDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}

// function to print appointment payment details
const printAppPaymentDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Appointment Payment Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printAppPayTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
            newTab.close()
        },2000
    )
}



//appointment payment table print function
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
                '<head><title>Appointment Payment table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
                '</head>'+
                '<h2  class="Text-center">Appointment Payment Table Details<h2>'+
                tableAppPayment.outerHTML
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
    txtAppNo.value=''
    txtAppNo.classList.remove('is-valid')
    txtAppNo.classList.add('is-invalid')



    selectPaymentMethod.value=''
    selectPaymentMethod.classList.remove('is-valid')
    selectPaymentMethod.classList.add('is-invalid')



    selectBankName.classList.remove('is-valid')
    selectBankName.value=''

    textTransferDateTime.classList.remove('is-valid')
    textTransferDateTime.value=''

    textRefNo.classList.remove('is-valid')
    textRefNo.value=''


    textTotalAmount.classList.remove('is-valid')
    textTotalAmount.classList.add('is-invalid')
    textTotalAmount.value=''

    textPaidAmount.classList.remove('is-valid')
    textPaidAmount.classList.add('is-invalid')
    textPaidAmount.value=''

    textBalanceAmount.classList.remove('is-valid')
    textBalanceAmount.classList.add('is-invalid')
    textBalanceAmount.value=''


    textCardRefNo.classList.remove('is-valid')
    textCardRefNo.classList.add('is-invalid')
    textCardRefNo.value=''




}


// delete function for payment delete
const  deleteAppPay=(rowOb)=>{}

// refill function
const refillAppPayForm=(rowOb)=>{}







