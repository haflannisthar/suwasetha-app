window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Prescription");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshPresTable()
    refreshPresForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshPresTable=()=>{

    userDetail=ajaxGetReq("/profile/loggeduser");
    console.log(userDetail)
    prescriptionalldatabydoctor=ajaxGetReq("/prescription/prescriptionbydoctor/"+userDetail.employee_id.id);

    const displayProperty=[
             {property:'code',datatype:'string'},
          {property:getPatientName,datatype:'function'},
          {property:getAppointmentNo,datatype:'function'},
        {property:getchannellingdate,datatype:'function'},
        {property:getAppointmentTime,datatype:'function'}


    ]
    fillDataIntoTable(tablePrescription,prescriptionalldatabydoctor,displayProperty,refillPForm,deletePForm,printPForm,true,UserPrivilege);
    disableDeleteButton();
    $('#tablePrescription').dataTable();




}

// delete button disable for all the prescription records and edit is allowed for 30 minutes from added date
const  disableDeleteButton=()=>{
    const tablePrescription = document.getElementById("tablePrescription");
    const tableRows = tablePrescription.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

        const prescriptionCodeCell = row.querySelector("td:nth-child(2)"); // Adjusted selector for status cell

        let prescriptionStatus=ajaxGetReq("/prescription/disableeditbtnbycode/"+prescriptionCodeCell.textContent.trim());
        console.log(prescriptionStatus,prescriptionCodeCell.textContent.trim())
            const actionCell = row.querySelector("td:nth-child(7)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
        const deleteButton = dropdown.querySelector(".btn-danger");
        const refillButton = dropdown.querySelector(".btn-info");

            if (UserPrivilege.delete){

                    deleteButton.disabled = true;
                    deleteButton.style.display = "none";


            }

            if (!prescriptionStatus && UserPrivilege.update){
                refillButton.disabled = true;
                refillButton.style.display = "none";
            }else if(UserPrivilege.update){
                refillButton.disabled = false;
                refillButton.style.display = "inline-block";
            }




    });
}


// function to get patient name
const getPatientName=(rowOb)=>{
    return rowOb.appointment_id.patient_id.firstname;
}
// function to get appointment no
const getAppointmentNo=(rowOb)=>{


    return rowOb.appointment_id.appno
}
// get channelling date
const getchannellingdate=(rowOb)=>{

    return  rowOb.appointment_id.channellingdate;
}

// get appointment no
const getAppointmentTime=(rowOb)=>{

    return rowOb.appointment_id.starttime.substring(0,5)+"-"+rowOb.appointment_id.endtime.substring(0,5)

}








const refreshPresForm=()=>{

    Title.innerHTML='New Prescription Enrollment'
    freshBtn.style.visibility = 'visible'




    prescription={}
    prescription.prescriptionHasSalesDrugList=[]


    userDetail=ajaxGetReq("/profile/loggeduser");
    appointmentList=ajaxGetReq("/appointment/getappointmentlist/"+userDetail.employee_id.id);
    fillDataIntoSelect(selectAppointment,'Select Appointment',appointmentList,'appno')





    // set default value
    selectAppointment.value=''
    textAge.value=''
    textNote.value=''


    //set default color
    selectAppointment.classList.remove("is-valid")
    textAge.classList.remove("is-valid")
    textNote.classList.remove("is-valid")

    selectAppointment.classList.remove("is-invalid")
    textAge.classList.remove("is-invalid")
    textNote.classList.remove("is-invalid")



    // refresh innerform and table
    refreshInnerFormAndTable();


    // disable update button when form load
    btnUpdate.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdate").css("cursor","not-allowed")


    console.log(UserPrivilege)
    if (UserPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
    else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
    }

    userDetail.roles.forEach(elemet=>{
        if (elemet.name=='Admin'){
            btnUpdate.disabled="disabled"
            btnAdd.disabled="disabled"
        }
    })


}



// refresh inner form and inner table
const refreshInnerFormAndTable=()=>{


    salesdruglist={}

    salesdrugListData=ajaxGetReq("/salesdrug/getsdlistforprescription")
   fillDataIntoDataList(datalistitems,salesdrugListData,"name");





    //     empty all element
    txtSalesDrug.value=''
    textBreakFastQty.value=''
    textLunchQty.value=''
    textDinnerQty.value=''
    textDaysCount.value=''
    textTotalQty.value=''
    textBFMeals.value=''

    tdavailQty.innerHTML=''

    CheckBoxPharmacy.checked=true
    CheckBoxPharmacy.disabled=false
    salesdruglist.inpharmacyoroutside=true
    checkPharmaVal.innerHTML='In-House Pharmacy'


    textTotalQty.disabled=true

//   remove  valid color
    txtSalesDrug.classList.remove("is-valid")
    textBreakFastQty.classList.remove("is-valid")
    textLunchQty.classList.remove("is-valid")
    textDinnerQty.classList.remove("is-valid")
    textDaysCount.classList.remove("is-valid")
    textTotalQty.classList.remove("is-valid")
    textBFMeals.classList.remove("is-valid")

    // remove invalid color
    txtSalesDrug.classList.remove("is-invalid")
    textBreakFastQty.classList.remove("is-invalid")
    textLunchQty.classList.remove("is-invalid")
    textDinnerQty.classList.remove("is-invalid")
    textDaysCount.classList.remove("is-invalid")
    textTotalQty.classList.remove("is-invalid")
    textBFMeals.classList.remove("is-invalid")



//     refresh inner table

    const displayInnerTableProperty=[
        {property:getDrugName,datatype:'function'},
        {property:getBrQty,datatype:'function'},
        {property:getLnQty,datatype:'function'},
        {property:getDnQty,datatype:'function'},
        {property:getDCount,datatype:'function'},
        {property:getTQty,datatype:'function'},
        {property:getBFMeal,datatype:'function'},
        {property:getPType,datatype:'function'}

    ]

    // fill data into inner table function
    fillDataIntoInnerTable(salesiteminnertable, prescription.prescriptionHasSalesDrugList,displayInnerTableProperty,deleteInnerTableRow)



}



// function to get drug name in inner table
const getDrugName=(ob)=>{
   return ob.salesdrug_id.name
}

// function to get Breakfast Qty in inner table
const getBrQty=(ob)=>{

    if (ob.breakfastqty!=null){
        return ob.breakfastqty
    }else {
        return '-'
    }

}

// function to get Lunch Qty in inner table
const getLnQty=(ob)=>{
    if (ob.lunchqty!=null){
        return ob.lunchqty
    }else {
        return '-'
    }
}

// function to get Dinner Qty in inner table
const getDnQty=(ob)=>{
    if (ob.dinnerqty!=null){
        return ob.dinnerqty
    }else {
        return '-'
    }
}
// function to get Days  Count in inner table
const getDCount=(ob)=>{
    return ob.noofdays
}
// function to get Total Qty in inner table
const getTQty=(ob)=>{
    return ob.totalqty
}
// function to get Consume Time in inner table
const getBFMeal=(ob)=>{
    if (ob.eatbeforeorafter==null){
        return '-'
    }else{
        return ob.eatbeforeorafter

    }

}
// function to get Where To Buy in inner table
const getPType=(ob)=>{
    if (ob.inpharmacyoroutside){
        return 'In-house'
    }else {
        return 'External'
    }


}




// get available qty whn user select a drug
const getAvailableQty=()=>{

    // when user changes the drug name  remove the value form other inner form fields
    tdavailQty.innerHTML=''
    textBreakFastQty.value=''
    textBreakFastQty.classList.remove('is-valid')
    salesdruglist.breakfastqty=null
    textLunchQty.value=''
    textLunchQty.classList.remove('is-valid')
    salesdruglist.lunchqty=null

    textDinnerQty.value=''
    textDinnerQty.classList.remove('is-valid')
    salesdruglist.dinnerqty=null

    textDaysCount.value=''
    textDaysCount.classList.remove('is-valid')
    textDaysCount.classList.remove('is-invalid')
    salesdruglist.noofdays=null

    textTotalQty.value=''
    textTotalQty.classList.remove('is-valid')
    salesdruglist.totalqty=null

    textBFMeals.value=''
    textBFMeals.classList.remove('is-valid')
    textBFMeals.classList.remove('is-invalid')
    salesdruglist.eatbeforeorafter=null

    CheckBoxPharmacy.checked=true
    CheckBoxPharmacy.disabled=false
    salesdruglist.inpharmacyoroutside=true
    checkPharmaVal.innerHTML=' In-House Pharmacy'


    // get the sales drug list  and check that the user selected value in drug field in available in below list
    salesDrugListData=ajaxGetReq("/salesdrug/getsdlistforprescription")

    selectedvalue=txtSalesDrug.value

    let extindex=salesDrugListData.map(salesdrug=>salesdrug.name).indexOf(selectedvalue)
    if (extindex!=-1){

        AvailableDrugQty=ajaxGetReq("/batch/getavailabledrugqty/"+salesDrugListData[extindex].id);
        console.log(AvailableDrugQty)

        //if the  drug avaialble qty is 0 then uncheck  the checkbox so patient  need to buy that drug from external pharmacy
        if (AvailableDrugQty==0){
            tdavailQty.innerHTML='In-Pharmacy Available Qty 0'
            CheckBoxPharmacy.checked=false
            CheckBoxPharmacy.disabled=true
            salesdruglist.inpharmacyoroutside=false
            checkPharmaVal.innerHTML='External Pharmacy'
        }else {
            tdavailQty.innerHTML='In-Pharmacy Available Qty '+AvailableDrugQty
            CheckBoxPharmacy.disabled=false
            CheckBoxPharmacy.checked=true
            salesdruglist.inpharmacyoroutside=true
            checkPharmaVal.innerHTML=' In-House Pharmacy'

        }


        }


    }


    // get the total drug for a day
    // get the days count
    // multiply by days count and set to total count
const calculatetotalquantity=()=>{

    salesdrugListData=ajaxGetReq("/salesdrug/getsdlistforprescription")

    selectedvalue=txtSalesDrug.value

    let extindex=salesdrugListData.map(salesdrug=>salesdrug.name).indexOf(selectedvalue)
    if (extindex!=-1){

        DrugProductType=ajaxGetReq("/salesdrug/getproducttype/"+salesdrugListData[extindex].id);
        console.log(DrugProductType.name)

        if (DrugProductType.name=='Capsules'  || DrugProductType.name=='Tablet'){

            let bfQty=Number( textBreakFastQty.value)
            let lnQty=Number(textLunchQty.value)
            let dnQty=  Number(textDinnerQty.value)

            let daysCount=  Number(textDaysCount.value)


            let totalDrugQtyForADay=bfQty+lnQty+dnQty;

            let totalDrugQty=totalDrugQtyForADay*daysCount;

            textTotalQty.value=totalDrugQty;
            textTotalQty.classList.add('is-valid')
            salesdruglist.totalqty=textTotalQty.value
        }else {
            textTotalQty.value='1'
            textTotalQty.classList.add('is-valid')
            salesdruglist.totalqty=textTotalQty.value
        }

    }





    }

// check that the entered total qty is greater than available qty
// if so then disable the button
const checktotalQtyandAvilableQty=()=>{

    let testTotalQty=new RegExp('^[1-9][0-9]{0,1}$');


    if (textTotalQty.value!==''){
        if (testTotalQty.test(textTotalQty.value)){
            if (AvailableDrugQty< textTotalQty.value && salesdruglist.inpharmacyoroutside){
                let timerInterval;
                Swal.fire({
                    html: "Entered Total Qty is Greater than In-House Pharmacy Available Qty",
                    timer: 2000,

                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {
                    btnInnerForm.disabled=true
                });
            }else{
                btnInnerForm.disabled=false

            }

        }else{
            let timerInterval;
            Swal.fire({
                html: "Invalid Total Qty",
                timer: 2000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                textTotalQty.value=''
            });
        }
    }




}



// check whether drug is available in inner table
// check for ih-house or external pharmacy too
const checkDrugInTable=()=>{
    selectedDrug=txtSalesDrug.value

    salesdrugListData=ajaxGetReq("/salesdrug/getsdlistforprescription")



    let extindex= prescription.prescriptionHasSalesDrugList.map(element=>element.salesdrug_id.name).indexOf(selectedDrug)
    if (extindex!=-1){

        prescription.prescriptionHasSalesDrugList.forEach(drugList=>{
              if (drugList.inpharmacyoroutside==salesdruglist.inpharmacyoroutside && drugList.salesdrug_id.name==selectedDrug){
                  let timerInterval;
                  Swal.fire({
                      html: "You have selected the same drug and same purchase place .",
                      timer: 2000,

                      willClose: () => {
                          clearInterval(timerInterval);
                      }
                  }).then((result) => {
                      btnInnerForm.disabled=true
                  });
              }else {
                  btnInnerForm.disabled=false

              }
        })

    }else {
        btnInnerForm.disabled=false
    }


}


// refresh table by user confirmation
const refreshFormByuserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form",
        text:"Entered data will be erased",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPresForm();
        }
    });
}





//delete inner table row
const deleteInnerTableRow=(rowOb,rowInd)=>{



// user confirmation
    let infor=`Drug ${rowOb.salesdrug_id.name}<br>
                           `

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=infor
    Swal.fire({
        title: "Are you sure to remove following Drug record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {

            prescription.prescriptionHasSalesDrugList.splice(rowInd,1)


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

//calculate age
const calculateAge=()=>{

    // get the patient date of birth
    let patientDateOfBirth=ajaxGetReq("/patient/getdob/"+JSON.parse(selectAppointment.value).id);

    // get a date object
    const  currentDate=new Date();



    let patientDateOfBirthDate=new Date(patientDateOfBirth);


    let ageDiffInYears=currentDate.getFullYear()-patientDateOfBirthDate.getFullYear();

    let ageDiffInMonth=currentDate.getMonth()-patientDateOfBirthDate.getMonth();

    let ageDiffInDays=currentDate.getDate()-patientDateOfBirthDate.getDate();



  let  patientAgeInYears=ageDiffInYears
   //  if month diff is less than 0 means birthday not came
   //  so reduce one year and set
   if (ageDiffInMonth<0){
       patientAgeInYears--
       }

let patientAgeInMonth=0;
   // year diff 0 means month has not come
   if (patientAgeInYears==0){
        patientAgeInMonth=ageDiffInYears*12+ageDiffInMonth;
   }

   if (patientAgeInYears>0){
       textAge.value=patientAgeInYears+" years"
       textAge.classList.add('is-valid')
       prescription.age=textAge.value
       textAge.disabled=true
       console.log(patientAgeInYears)
   }else {
       textAge.value=patientAgeInMonth+" Month"
       textAge.classList.add('is-valid')
       prescription.age=textAge.value
       textAge.disabled=true
       console.log(patientAgeInMonth)

       // birth day in date
       if (patientAgeInMonth<0 || patientAgeInMonth==0){
           textAge.value=ageDiffInDays+' Days'
           textAge.classList.add('is-valid')
           textAge.disabled=true
           prescription.age=textAge.value
       }

   }


}

// inner form error
const checkInnerFormError=()=>{
    let errors=''
    if(salesdruglist.salesdrug_id==null || txtSalesDrug.value==''){
        errors+="Please Select Sales Drug<br>"
        txtSalesDrug.classList.add("is-invalid");
    }

    if(salesdruglist.noofdays==null || textDaysCount.value==''){
        errors+="Please Enter Days Count <br>"
        textDaysCount.classList.add("is-invalid");
    }
    salesdrugListData=ajaxGetReq("/salesdrug/getsdlistforprescription")

    selectedvalue=txtSalesDrug.value

    let extindex=salesdrugListData.map(salesdrug=>salesdrug.name).indexOf(selectedvalue)
    if (extindex!=-1){
        drugItemType=ajaxGetReq("/salesdrug/getitemtype/"+salesdrugListData[extindex].id)
        console.log(drugItemType)
        console.log(salesdrugListData[extindex].id)
        // if the item type is not medical equipment then drug qty and when to consume must enter
        if (drugItemType!==3){
            if((salesdruglist.breakfastqty==null)&&(salesdruglist.lunchqty==null )&&(salesdruglist.dinnerqty==null)){
                errors+="Drug Qty For a Day Cannot Be Null <br>"
            }

            if(salesdruglist.eatbeforeorafter==null){
                errors+="Please Enter When To Consume<br>"
                textBFMeals.classList.add("is-invalid");
            }
        }


    }






    return errors;
}



// inner form  add
const btnInnerformAdd=()=>{

    console.log(salesdruglist)
//     check for error
    let error=checkInnerFormError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'

    if(error==''){



        let drugDetails=  `Drug : ${salesdruglist.salesdrug_id.name}<br>`

        if (salesdruglist.breakfastqty!=null){
            drugDetails+=`Quantity For Breakfast : ${salesdruglist.breakfastqty}<br>`
        }

        if (salesdruglist.lunchqty!=null){
            drugDetails+=`Quantity For Lunch : ${salesdruglist.lunchqty}<br>`
        }

        if (salesdruglist.dinnerqty!=null){
            drugDetails+=`Quantity For Dinner : ${salesdruglist.dinnerqty}<br>`
        }

        if (salesdruglist.eatbeforeorafter!=null){
            drugDetails+=` Consume Time : ${salesdruglist.eatbeforeorafter}<br>`
        }
        drugDetails+=`Days Count : ${salesdruglist.noofdays}<br>
                        Total Quantity : ${salesdruglist.totalqty}<br>`


        if (salesdruglist.inpharmacyoroutside){
            drugDetails+='Pharmacy : In-House'
        }else{
            drugDetails+='Pharmacy : External'

        }

        div.innerHTML=drugDetails
        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following Drug record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Drug Record Added Successfully!",

                    icon: "success"
                });

                //     push into array
                prescription.prescriptionHasSalesDrugList.push(salesdruglist);

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





// delete function
const  deletePForm=(rowOb)=>{

}




// set data to fields for print doctor availability details
const printPForm=(rowOb)=>{

    console.log(rowOb)

    const PrintOb=rowOb;

    tdPrescriptionNoOb.innerHTML=PrintOb.code
    tdAppNoOb.innerHTML=PrintOb.appointment_id.appno
    tdDoctorNameOb.innerHTML=PrintOb.appointment_id.employee_id.fullname
    tdPatientNameOb.innerHTML=PrintOb.appointment_id.patient_id.firstname
    tdPatientAge.innerHTML=PrintOb.age
    tdChannellingDate.innerHTML=PrintOb.appointment_id.channellingdate
    tdSessionTime.innerHTML=PrintOb.appointment_id.sessionstarttime
    tdAppStatus.innerHTML=PrintOb.appointment_id.appstatus_id.name





    if (PrintOb.docnote==null){
        tdNote.innerHTML=""
    }
    else {
        tdNote.innerHTML=PrintOb.docnote
    }



    tdAddedDateTime.innerHTML=PrintOb.addeddatetime.split('T')[0]+' '+PrintOb.addeddatetime.split('T')[1]



    const displayInnerTableProperty=[
        {property:getDrugName,datatype:'function'},
        {property:getBrQty,datatype:'function'},
        {property:getLnQty,datatype:'function'},
        {property:getDnQty,datatype:'function'},
        {property:getBFMeal,datatype:'function'},
        {property:getDCount,datatype:'function'},
        {property:getPType,datatype:'function'},

    ]


    fillDataIntoInnerTable(printinnertable,PrintOb.prescriptionHasSalesDrugList ,displayInnerTableProperty,deleteInnerTableRow,false)



    let printInfo = `
               Prescription No  : ${PrintOb.code}<br>
               Doctor  : ${PrintOb.appointment_id.employee_id.fullname}<br>
               Patient : ${PrintOb.appointment_id.patient_id.firstname}<br>
               Appointment No : ${PrintOb.appointment_id.appno}<br>
               `


    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=printInfo
    Swal.fire({
        title: "are you sure print following record?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printPrescriptionDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}

// function to print prescription details
const printPrescriptionDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Prescription Details Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printPrescriptionTable.outerHTML


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



    if ( selectAppointment.value=='' || prescription.appointment_id==null ) {
        errors =errors + "Please Select an Appointment <br>"
        selectAppointment.classList.add('is-invalid')
    }
    if (textAge.value==''|| prescription.age==null) {
        errors =errors + "Please Select an Appointment. Age Will Be Auto Filled <br>"
        textAge.classList.add('is-invalid')
    }



    if ( prescription.prescriptionHasSalesDrugList.length==0) {
        errors =errors + "Please Select Drug and other relevant fields. Prescription cannot be empty<br>"
    }



    return errors;
}


//prescription  add function
const buttonPresAdd=()=>{

    console.log(prescription)
    let error=checkError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'


    if (error==''){

        // create two arrays one for inHouseDrugs and one for External Pharmacy Drugs

        let inHouseDrugDetails=''
        let externalDrugDetails=''

        let inHouseDrugList=[]
        let externalDrugList=[]
        for (let element of prescription.prescriptionHasSalesDrugList){
            // push the drugs boolean true -> in-house drugs->inHouseDrugList array
            // push the drugs boolean false -> external drugs->externalDrugList array
            if (element.inpharmacyoroutside){
                console.log("t")
                inHouseDrugList.push(element)
            }else {
                console.log("f")
                externalDrugList.push(element);

            }

        }


        if (inHouseDrugList.length>0){
            inHouseDrugDetails+='<b>In-House Pharmacy Drug List</b><br>'

            inHouseDrugList.forEach(element=>{
                inHouseDrugDetails+=element.salesdrug_id.name+'<br>';
            })

        }




        if (externalDrugList.length>0){
            externalDrugDetails+='<b>External Pharmacy Drug List</b><br>'
            externalDrugList.forEach(element=>{
                externalDrugDetails+=element.salesdrug_id.name+'<br>';
            })
        }




        let Info = `
             Patient Name : ${prescription.appointment_id.patient_id.firstname}<br>
              Appointment No : ${prescription.appointment_id.appno}<br>
               Age : ${prescription.age}<br>
         
                 ${inHouseDrugDetails}
                ${externalDrugDetails}`;

         if (prescription.note !=null){
             Info += `Note  : ${prescription.note}<br>`
         }

         div.innerHTML=Info
        // get user confirmation
        Swal.fire({
            title: "Are you sure to add following Prescription record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/prescription","POST",prescription);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Prescription record Added Successfully!",
                        text: "",
                        icon: "success"
                    });



                    if (externalDrugList.length>0){

                        //     print external pharmacy drug list
                        tdDoctorName.innerHTML=prescription.appointment_id.employee_id.fullname
                        tdPatientName.innerHTML=prescription.appointment_id.patient_id.firstname+' '+prescription.appointment_id.patient_id.lastname

                        if (prescription.docnote!=null){
                            tdDocNoteForExt.innerHTML=prescription.docnote
                        }
                        tdDocNoteForExt.innerHTML=''


                        const displayInnerTableProperty=[
                            {property:getDrugName,datatype:'function'},
                            {property:getBrQty,datatype:'function'},
                            {property:getLnQty,datatype:'function'},
                            {property:getDnQty,datatype:'function'},
                            {property:getBFMeal,datatype:'function'},
                            {property:getDCount,datatype:'function'},

                        ]


                        fillDataIntoInnerTable(printExternalDrugInnerTable,externalDrugList ,displayInnerTableProperty,deleteInnerTableRow,false)

                        // print the external drug list array
                        const newTab=window.open()
                        newTab.document.write(
                            '<head><title>Drug List for External Pharmacy</title>'+
                            '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
                            '<style>p{font-size: 15px} </style>'+
                            printExternalDrugListTable.outerHTML


                        )

                        setTimeout(
                            function() {
                                newTab.print()
                            },1000
                        )

                    }




                    // refresh table and form
                    refreshPresForm()
                    refreshPresTable()
                    // show table tab
                    $('a[href="#PrescriptionTable"]').tab('show');

                }
                else{
                    Swal.fire("Something went wrong", serverResponse, "info");

                }

            }
            else{

                Swal.fire({
                    icon: "error",
                    title: "Action Aborted",


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

// refill form
const refillPForm=(rowOb)=>{

    Title.innerHTML='Prescription Update'


 prescription=JSON.parse(JSON.stringify(rowOb))
    prescriptionold=JSON.parse(JSON.stringify(rowOb))





    let refillInfor=`Patient Nae : ${rowOb.appointment_id.patient_id.firstname+' '+rowOb.appointment_id.patient_id.lastname}<br>
                               Appointment No : ${rowOb.appointment_id.appno}<br>`

    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.innerHTML=refillInfor

    Swal.fire({
        title: "Are you sure to edit the following Prescription Record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#PrescriptionForm"]').tab('show');


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

            // userDetail.roles.forEach(elemet=>{
            //     if (elemet.name=='Admin'){
            //         btnUpdate.disabled="disabled"
            //         btnAdd.disabled="disabled"
            //     }
            // })

            prescription=rowOb
            console.log(prescription)

            selectAppointment.classList.remove("is-invalid")
            textAge.classList.remove("is-invalid")
            textNote.classList.remove("is-invalid")


            freshBtn.style.visibility = 'visible'

            console.log(prescription.appointment_id.appno)
            appointmentList=ajaxGetReq("/appointment/getappointmentlist/"+userDetail.employee_id.id);
            appointmentList.push(prescription.appointment_id)
            fillDataIntoSelect(selectAppointment,'Select Appointment',appointmentList,'appno',prescription.appointment_id.appno)
            selectAppointment.classList.add("is-valid")
            selectAppointment.disabled=true;

            textAge.value=prescription.age
            textAge.classList.add("is-valid")
            textAge.disabled=true

            if(prescription.note!=null) {
                textNote.value = prescription.note
                textNote.classList.add("is-valid")
            }else{
                textNote.value=""
            }


            refreshInnerFormAndTable();






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


    if (prescription.docnote!=prescriptionold.docnote) {
        updateForm=updateForm + "Note " +prescriptionold.docnote+ " changed into " + prescription.docnote +"<br>";
    }


    // add the newly added drug  by comparing with prescription old
    let newlyAddedDrugs=[]
    for (let element of prescription.prescriptionHasSalesDrugList){
        let extCount=prescriptionold.prescriptionHasSalesDrugList.map(item=>item.id).indexOf(element.id)
        if (extCount==-1){
            newlyAddedDrugs.push(element);
        }

    }

    if (newlyAddedDrugs.length>0){
        updateForm+="<b>Added Drugs :<b\> <br>";
        newlyAddedDrugs.forEach(drugname=>{
            updateForm+=drugname.salesdrug_id.name+'<br>'
        })

    }

    let removedDrugs=[]
    for (let element of prescriptionold.prescriptionHasSalesDrugList){
        let extCount=prescription.prescriptionHasSalesDrugList.map(item=>item.id).indexOf(element.id)
        if (extCount==-1){

            removedDrugs.push(element);
        }

    }

    if (removedDrugs.length>0){
        updateForm+='<b>Removed Drugs : <b\>'+"<br>";
        removedDrugs.forEach(drug=>{
            updateForm+=drugname.salesdrug_id.name+'<br>'
        })
    }






    return updateForm;

}
//button update
const buttonPresUpdate=()=>{

    console.log(prescription);
    // check form errors
    let formErrors=checkError();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'



    if (formErrors==""){
        //form update
        let newUpdate=checkUpdate();
        if (newUpdate != ""){

            div.style.fontSize='16px'
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/prescription","PUT",prescription);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Prescription record updated successfully!",

                            icon: "success"
                        });
                        let externalDrugList=[]
                        for (let element of prescription.prescriptionHasSalesDrugList) {
                            // push the drugs boolean false -> external drugs->externalDrugList array
                            if (!element.inpharmacyoroutside) {
                                console.log("t")
                                externalDrugList.push(element)
                            }
                        }
                        //     print external pharmacy drug list
                        tdDoctorName.innerHTML=prescription.appointment_id.employee_id.fullname
                        tdPatientName.innerHTML=prescription.appointment_id.patient_id.firstname+' '+prescription.appointment_id.patient_id.lastname

                        if (prescription.docnote!=null){
                            tdDocNoteForExt.innerHTML=prescription.docnote
                        }
                        tdDocNoteForExt.innerHTML=''


                        const displayInnerTableProperty=[
                            {property:getDrugName,datatype:'function'},
                            {property:getBrQty,datatype:'function'},
                            {property:getLnQty,datatype:'function'},
                            {property:getDnQty,datatype:'function'},
                            {property:getBFMeal,datatype:'function'},
                            {property:getDCount,datatype:'function'},

                        ]


                        fillDataIntoInnerTable(printExternalDrugInnerTable,externalDrugList ,displayInnerTableProperty,deleteInnerTableRow,false)

                        const newTab=window.open()
                        newTab.document.write(
                            '<head><title>Drug List for External Pharmacy</title>'+
                            '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
                            '<style>p{font-size: 15px} </style>'+
                            printExternalDrugListTable.outerHTML


                        )

                        setTimeout(
                            function() {
                                newTab.print()
                            },1000
                        )



                      refreshPresTable()
                        refreshPresForm()
                        // hide the modal
                        $('a[href="#PrescriptionTable"]').tab('show');
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
            title: " Form has some errors!",
                  html:div,
            icon: "warning"
        });
    }

}





//prescription  table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Prescription table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Prescription table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Prescription Table Details<h2>'+
                tablePrescription.outerHTML
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






const buttonClear=()=>{




    selectAppointment.value=''
    textAge.value=''
    textNote.value=''


    //set default color
    selectAppointment.classList.remove("is-valid")
    textAge.classList.remove("is-valid")
    textNote.classList.remove("is-valid")

    selectAppointment.classList.remove("is-invalid")
    textAge.classList.remove("is-invalid")
    textNote.classList.remove("is-invalid")

    prescription.prescriptionHasSalesDrugList=null
    refreshInnerFormAndTable();


}



