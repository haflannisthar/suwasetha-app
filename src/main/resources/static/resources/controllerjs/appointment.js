window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Appointment Scheduling");
    PatientPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Patient");

    console.log(UserPrivilege)
    //refresh function for table and form
    refreshTable()
    refreshForm();
    refreshPatientForm()

    $('[data-toggle="tooltip"]').tooltip()
 let params=window.location.search;
    let urlParams=new URLSearchParams(params);
 if (urlParams.has("appdate") && urlParams.has("doctorfullname") && urlParams.has("starttime") ){
          generateAppointment(urlParams.get("appdate"),urlParams.get("doctorfullname"),urlParams.get("starttime"));
 }

})

// generate appointment automatically
const generateAppointment=(appdate,doctorfullname,starttime)=>{

    $('a[href="#AppForm"]').tab('show');


    txtDoctor.value=doctorfullname
    txtDoctor.classList.add('is-valid')



    selectedValue=txtDoctor.value
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    // check entered value  in doctors List
    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedValue)
    // if entered value is not in doctors list extIndex -1
    // extIndex!=-1 means entered value  is available in doctors list
    if (extIndex!=-1){
        appointmentscheduling.employee_id=doctors[extIndex]
        // request to get the available dates for specific doctor (request method is in doctor availability
        let doctorRecord=ajaxGetReq("/doctoravailability/getdetailsbydoctorid/"+doctors[extIndex].id);
        console.log(doctorRecord)
        // textChannellingDate.disabled=false

        // doctor records come in array format so fill that array using fill data into array function
        console.log(appdate)
        fillDataIntoSelectArray(textChannellingDate,'Select Date',doctorRecord,appdate)

        textChannellingDate.classList.add('is-valid');
        appointmentscheduling.channellingdate=appdate


        let  consultationTime=ajaxGetReq("/appointment/getstartendtimebydoctor/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id)
        console.log(consultationTime)
        if (consultationTime.length==0){
            let timerInterval;
            Swal.fire({
                text: "No More Appointment Available For Selected Date "+JSON.parse(textChannellingDate.value),
                timer: 3000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                textChannellingDate.value=''
                textChannellingDate.classList.remove('is-valid');

                selectStartTime.value=''
                selectStartTime.classList.remove('is-valid');

                textStartTime.value=''
                textStartTime.classList.remove('is-valid');

                textEndTime.value=''
                textEndTime.classList.remove('is-valid');

                btnAdd.disabled=true




            });
        }else {
            fillDataIntoSelectArray(selectStartTime,'Select Start time',consultationTime,starttime)
            appointmentscheduling.sessionstarttime=starttime
            selectStartTime.classList.add('is-valid');
            btnAdd.disabled=false
        }
        getStartTime()
        checkForSessionEndTime()
        getChannellingFee()

    }
    else {
        // if extIndex ==-1  then remove border color and remove the values in the input fields
        textChannellingDate.classList.remove('is-valid');
        textChannellingDate.value=''

        textStartTime.value=''
        textStartTime.classList.remove('is-valid');

        textEndTime.value=''
        textEndTime.classList.remove('is-valid');

    }

    // textChannellingDate.value=appdate
    // textStartTime.value=starttime

}
//function to refresh table
const refreshTable=()=>{
    appointmentCompleteList=ajaxGetReq("/appointment/findall");
    const displayProperty=[
             {property:'appno',datatype:'string'},
          {property:getPatientName,datatype:'function'},
          {property:getDoctorName,datatype:'function'},
          {property:'channellingdate',datatype:'string'},
          {property:getTime,datatype:'function'},
          {property:getStatus,datatype:'function'}

    ]
     fillDataIntoTable(tableAppointment,appointmentCompleteList,displayProperty,refillAppForm,deleteApp,printApp,true,UserPrivilege);

    // disable delete button for deleted status
    disableBtnForDeletedStatus();

    $('#tableAppointment').dataTable();



}

// get status
const  getStatus=(rowOb)=>{
    if (rowOb.appstatus_id.name=='Pending') {
        return '<p ><span class="text-info border border-info rounded text-center p-1 ">'+rowOb.appstatus_id.name+'</span></p>'
    }
    if (rowOb.appstatus_id.name=='Ongoing') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.appstatus_id.name+'</span></p>'
    }
    if (rowOb.appstatus_id.name=='Completed') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.appstatus_id.name+'</span></p>'
    }
    if (rowOb.appstatus_id.name=='Deleted') {
        return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.appstatus_id.name+'</span></p>'
    }
}

// get the doctors calling name and fill it in the table
const getDoctorName=(rowOb)=>{
    return rowOb.employee_id.callingname;
}

// get the patient name and fill it in the table
const getPatientName=(rowOb)=>{
   return rowOb.patient_id.firstname
}

// get the time and fill it in the table
const getTime=(rowOb)=>{
    return rowOb.starttime.substring(0,5)+"-"+rowOb.endtime.substring(0,5);
}



// delete button disablefor deleted status
const  disableBtnForDeletedStatus=()=>{
    const tableAPP = document.getElementById("tableAppointment");
    const tableRows = tableAPP.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(7) p"); // Adjusted selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(8)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");
            const refillButton = dropdown.querySelector(".btn-info");

            if (UserPrivilege.delete){
                if (statusValue === "Deleted" ||statusValue === "Completed" ||statusValue === "Ongoing") {
                    deleteButton.disabled = true;
                     deleteButton.style.display = "none";

                    refillButton.disabled = true;
                    refillButton.style.display = "none";

                }
            }

            if (UserPrivilege.update){
                if (statusValue === "Completed" ||statusValue === "Ongoing") {
                    refillButton.disabled = true;
                    refillButton.style.display = "none";

                }
            }


        }


    });
}



const refreshForm=()=>{

    Title.innerHTML='New Appointment Schedule'
       appointmentscheduling={}

    patientList=ajaxGetReq("/patient/list");
    fillDataIntoDataList(datalistitems,patientList,'firstname')

    patientContactNumberList=ajaxGetReq("/patient/contactlist");
    fillDataIntoDataList(datalistitemsContactNumber,patientContactNumberList,'contactno')

    appStatus=ajaxGetReq("/appstatus/findall");
    fillDataIntoSelect(selectAppStatus,'Select Status',appStatus,'name','Pending');
    selectAppStatus.classList.add('is-valid');
    appointmentscheduling.appstatus_id=JSON.parse(selectAppStatus.value);
    selectAppStatus.disabled=true

    doctors=ajaxGetReq("/employee/getavailabledoctorlist");
    fillDataIntoDataList(datalistitemsdoctor,doctors,'fullname')


    fillDataIntoSelectArray(textChannellingDate,'Select Date','')
    fillDataIntoSelectArray(selectStartTime,'Select Start Time','')

    textPayFee.disabled=true

    // set default value
    txtPatient.value=''
    txtPatName.innerHTML=''
    txtDoctor.value=''
    textChannellingDate.value=''
    textPayFee.value=''
    textStartTime.value=''
    textEndTime.value=''
    selectStartTime.value=''


    //set default color by removing valid and in valid color
    txtPatient.classList.remove('is-valid')
    txtDoctor.classList.remove('is-valid')
    textChannellingDate.classList.remove('is-valid')
    textPayFee.classList.remove('is-valid')
    textStartTime.classList.remove('is-valid')
    textEndTime.classList.remove('is-valid')
    selectStartTime.classList.remove('is-valid')
    //
    txtPatient.classList.remove('is-invalid')
    txtDoctor.classList.remove('is-invalid')
    textChannellingDate.classList.remove('is-invalid')
    textPayFee.classList.remove('is-invalid')
    textStartTime.classList.remove('is-invalid')
    textEndTime.classList.remove('is-invalid')
    selectAppStatus.classList.remove('is-invalid')
    selectStartTime.classList.remove('is-invalid')



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

// filter patient list by contact number
const getPatientListByContactNumber=()=>{
    let fieldValue=txtFilterByContactNumber.value

    let regExp=new RegExp('^(([0][7][01245678][0-9]{7})|([0](11|21|23|24|25|26|27|31|32|33|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81)[0-9]{7}))$')
    if (regExp.test(fieldValue)){

        txtFilterByContactNumber.classList.add('is-valid')


        getPatientListByContact=ajaxGetReq("/patient/getPatientList/"+fieldValue)
        console.log(getPatientListByContact+" line 296")
        if (getPatientListByContact.length===0){
            swal.fire({
                title: "Not Found",
                html: "No Patient Registered found for  the Number : "+fieldValue,
                icon: "info",
                button: "Got it!",
            });
            txtFilterByContactNumber.value=''
            txtFilterByContactNumber.classList.remove('is-valid')
            patientList=ajaxGetReq("/patient/list");
            fillDataIntoDataList(datalistitems,patientList,'firstname')


        }else{
            fillDataIntoDataList(datalistitems,getPatientListByContact,'firstname')

        }


    }else{
        txtFilterByContactNumber.classList.remove('is-valid')

        patientList=ajaxGetReq("/patient/list");
        fillDataIntoDataList(datalistitems,patientList,'firstname')
    }

    if (fieldValue===''){
        txtPatient.value=''
        txtPatient.classList.remove('is-valid')
        txtPatName.innerHTML=''
    }
}


// get doctor availability details for the doctor
const getDoctorAvailabilityDetails=()=>{

    selectedValue=txtDoctor.value
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    // check entered value  in doctors List
    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedValue)
    // if entered value is not in doctors list extIndex -1
    // extIndex!=-1 means entered value  is available in doctors list
    if (extIndex!=-1){

        // request to get the available dates for specific doctor (request method is in doctor availability
        let doctorRecord=ajaxGetReq("/doctoravailability/getdetailsbydoctorid/"+doctors[extIndex].id);
        console.log(doctorRecord)
        // textChannellingDate.disabled=false

        // doctor records come in array format so fill that array using fill data into array function
        fillDataIntoSelectArray(textChannellingDate,'Select Date',doctorRecord)

    }else {
        // if extIndex ==-1  then remove border color and remove the values in the input fields
        textChannellingDate.classList.remove('is-valid');
        textChannellingDate.value=''

        textStartTime.value=''
        textStartTime.classList.remove('is-valid');

        textEndTime.value=''
        textEndTime.classList.remove('is-valid');

    }
}


// get consulting period by doctor id and date
// if there is no appointment then show error
const getConsultingPeriod=()=>{
    selectedValue=txtDoctor.value
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedValue)
    if (extIndex!=-1){
        let  consultationTime=ajaxGetReq("/appointment/getstartendtimebydoctor/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id)
        console.log(consultationTime)
        if (consultationTime.length==0){
            let timerInterval;
            Swal.fire({
                text: "No More Appointment Available For Selected Date "+JSON.parse(textChannellingDate.value),
                timer: 3000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                textChannellingDate.value=''
                textChannellingDate.classList.remove('is-valid');

                selectStartTime.value=''
                selectStartTime.classList.remove('is-valid');

                textStartTime.value=''
                textStartTime.classList.remove('is-valid');

                textEndTime.value=''
                textEndTime.classList.remove('is-valid');

                btnAdd.disabled=true




            });
        }else {
            selectStartTime.value=''
            selectStartTime.classList.remove('is-valid');

            textStartTime.value=''
            textStartTime.classList.remove('is-valid');

            textEndTime.value=''
            textEndTime.classList.remove('is-valid');


            fillDataIntoSelectArray(selectStartTime,'Select Start time',consultationTime)
            btnAdd.disabled=false
        }

    }
}


// get appointment count and then set the start and end time
const getStartTime=()=>{

    selectedvalue=txtDoctor.value
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedvalue)
    // check the field value is available in doctor list
    if (extIndex!=-1){

        selectStartTime.classList.add('is-valid')
        //  get the appointment count by doctor id and date which are pending status
        let  appointmentCount=ajaxGetReq("/appointment/getstarttimebydoctor/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id+"/"+JSON.parse(selectStartTime.value))

        // check current date is equal to channelling date
        let DateCheck=new Date();

        let currentYear=DateCheck.getFullYear();
        let currentMonth=DateCheck.getMonth()+1;
        if (currentMonth<10){
            currentMonth='0'+currentMonth
        }

        let currentDay=DateCheck.getDate();

        if (currentDay<10){
            currentDay='0'+currentDay
        }

        let currentHour=DateCheck.getHours();
        let currentMinutes=DateCheck.getMinutes();

        if (currentHour<10){
            currentHour='0'+currentHour
        }

        if (currentMinutes<10){
            currentMinutes='0'+currentMinutes
        }
        let currentTime=currentHour+":"+currentMinutes
        let currentDate=currentYear+"-"+currentMonth+"-"+currentDay

        // check appointment is equal to 0 or not
        if (appointmentCount=='0'){
           //appointment count is zero
           // check that the selected date  is today and current time greater than session start  time
           if (JSON.parse(textChannellingDate.value)===currentDate && currentTime>=JSON.parse(selectStartTime.value)){

               // set the current time as start time
               textStartTime.value=currentTime
               textStartTime.classList.add("is-valid");
               textStartTime.classList.remove("is-invalid");
               appointmentscheduling.starttime=textStartTime.value



               // get the start time and add 10 mins and set to end time
               let [hours, minutes] = appointmentscheduling.starttime.split(':').map(Number);

               let date = new Date();
               date.setHours(hours);
               date.setMinutes(minutes);
               date.setSeconds(0);
               date.setMilliseconds(0);
               date.setMinutes(date.getMinutes() + 10);

               let endHours = date.getHours().toString().padStart(2, '0');
               let endMinutes = date.getMinutes().toString().padStart(2, '0');

               //

               let endTime = `${endHours}:${endMinutes}`;
               textEndTime.value=endTime;
               textEndTime.classList.add('is-valid');
               textEndTime.classList.remove('is-invalid');
               appointmentscheduling.endtime=textEndTime.value
           }else{
               // appointment count is 0 but session start time is not greater than or equal to current time

               // set session  start time as start time value for an appointment
               let startTimeForFirstAppointment=JSON.parse(selectStartTime.value)
               textStartTime.value=startTimeForFirstAppointment.substring(0,5)
               textStartTime.classList.add("is-valid");
               textStartTime.classList.remove("is-invalid");
               appointmentscheduling.starttime=textStartTime.value

               // calculate the end time
               let [hours, minutes] = appointmentscheduling.starttime.split(':').map(Number);

               let date = new Date();
               date.setHours(hours);
               date.setMinutes(minutes);
               date.setSeconds(0);
               date.setMilliseconds(0);
               date.setMinutes(date.getMinutes() + 10);

               let endHours = date.getHours().toString().padStart(2, '0');
               let endMinutes = date.getMinutes().toString().padStart(2, '0');

               let endTime = `${endHours}:${endMinutes}`;
               textEndTime.value=endTime;
               textEndTime.classList.add('is-valid');
               textEndTime.classList.remove('is-invalid');
               appointmentscheduling.endtime=textEndTime.value
           }




       }else{
            // get the lastly added appointment end time which is pending status
            lastAppointmentEndTime=ajaxGetReq("/appointment/getlastappointmentendtime/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id+"/"+JSON.parse(selectStartTime.value))

            // check channelling date equal to current date and current time >= session start time and last appointment added end time <= current time
            if (JSON.parse(textChannellingDate.value)===currentDate && currentTime>=JSON.parse(selectStartTime.value) && lastAppointmentEndTime<=currentTime){
               // set current time as appointment start time
               let startTimeForAppointment=currentTime


                // // create a date object set the hours and minutes
                let date = new Date();

                let startTime = startTimeForAppointment
                // set start time
                textStartTime.value=startTime
                textStartTime.classList.add('is-valid');
                textStartTime.classList.remove('is-invalid');
                appointmentscheduling.starttime=textStartTime.value

                // set the end time for appointment that has more than 0 for a given day
                let [hoursEnd, minutesEnd] = startTime.split(':').map(Number);

                let dateEndTime = new Date();
                dateEndTime.setHours(hoursEnd);
                dateEndTime.setMinutes(minutesEnd);
                dateEndTime.setSeconds(0);
                dateEndTime.setMilliseconds(0);


                // set the end time by adding 10 minutes to start time and to set time
                dateEndTime.setMinutes(date.getMinutes() + 10);

                let endHours = dateEndTime.getHours().toString().padStart(2, '0');
                let endMinutes = dateEndTime.getMinutes().toString().padStart(2, '0');

                let endTime = `${endHours}:${endMinutes}`;
                textEndTime.value=endTime;
                textEndTime.classList.add('is-valid');
                textEndTime.classList.remove('is-invalid');

                appointmentscheduling.endtime= textEndTime.value
            }else {

                  // if (){
                  //
                  // }

                let startTime = lastAppointmentEndTime.substring(0,5);


                textStartTime.value=startTime
                textStartTime.classList.add('is-valid');
                textStartTime.classList.remove('is-invalid');
                appointmentscheduling.starttime=textStartTime.value

                // set the end time for appointment that has more than 0 for a given day
                let [hoursEnd, minutesEnd] = startTime.split(':').map(Number);

                // if (minutesEnd<10){
                //     minutesEnd='0'+minutesEnd
                // }

                let dateEnd = new Date();
                dateEnd.setHours(hoursEnd);
                dateEnd.setMinutes(minutesEnd);

                dateEnd.setSeconds(0);
                dateEnd.setMilliseconds(0);

                // set the end time by adding 10 minutes to start time
                // set end time
                dateEnd.setMinutes(dateEnd.getMinutes() + 10);

                let endHours = dateEnd.getHours().toString().padStart(2, '0');
                let endMinutes = dateEnd.getMinutes().toString().padStart(2, '0');
                console.log(endMinutes)
                let endTime = `${endHours}:${endMinutes}`;
                textEndTime.value=endTime;
                textEndTime.classList.add('is-valid');
                textEndTime.classList.remove('is-invalid');
                appointmentscheduling.endtime= textEndTime.value
            }


       }


    }
}



// check for session end time has reached or not by comparing it to last record added end time
const checkForSessionEndTime=()=>{
    // get the lastly added appointment end time
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedvalue)
    // check the field value is available in doctor list
    if (extIndex!=-1){

        sessionEndTime=ajaxGetReq("/appointment/checksessionendtime/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id+"/"+JSON.parse(selectStartTime.value))

      if (sessionEndTime){
          let timerInterval;
          Swal.fire({
              html: "Doctor Session End Time has Reached For Selected Date "+JSON.parse(textChannellingDate.value) +".<br>Cannot Add More Appointment",
              timer: 5000,

              willClose: () => {
                  clearInterval(timerInterval);
              }
          }).then((result) => {
              textChannellingDate.value=''
              textChannellingDate.classList.remove('is-valid');

              selectStartTime.value=''
              selectStartTime.classList.remove('is-valid');

              textStartTime.value=''
              textEndTime.value=''

              textStartTime.classList.remove('is-valid');
              textEndTime.classList.remove('is-valid');


              btnAdd.disabled=true
          });
      }else {
          btnAdd.disabled=false
      }

    }




}

// get doctor channelling fee for selected doctor
const getChannellingFee=()=>{
    let selectedvalue=txtDoctor.value
    // get the lastly added appointment end time
    doctors=ajaxGetReq("/employee/getavailabledoctorlist");

    let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedvalue)
    // check the field value is available in doctor list
    if (extIndex!=-1){
        getDoctorChannellingFee=ajaxGetReq("/employee/getdoctorchannallingfee/"+doctors[extIndex].id)

        textPayFee.value=parseFloat(getDoctorChannellingFee).toFixed(2)
        appointmentscheduling.channelingcharge= textPayFee.value
        textPayFee.classList.add('is-valid')
        textPayFee.classList.remove('is-invalid')

    }
}


// get user confirmation before form refresh
const  refreshFormByUserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form?",
        html:'Entered Data will be removed',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshForm();
        }
    });
}

// delete function for appointment delete
const  deleteApp=(rowOb)=>{

    let Info = `Appointment Number: ${rowOb.appno}<br>
                Patient Name: ${rowOb.patient_id.firstname}<br> Doctor Name: ${rowOb.employee_id.fullname}<br>  Date :${rowOb.channellingdate}`

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=Info

    Swal.fire({
        title: "Are you sure to delete following Appointment ?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverResponse=ajaxRequestBody("/appointment","DELETE",rowOb)
            if (serverResponse=="OK") {


                Swal.fire({
                    title: "Appointment Deleted Successfully!",

                    icon: "success"
                });
                refreshTable()




            } else {

                Swal.fire("Something went wrong", serverResponse, "info");
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
// print patient details method
const  printApp=(rowOb)=>{

    const appPrint=rowOb;

    tdAppNo.innerHTML=appPrint.appno
    tdChNumber.innerHTML=appPrint.channaliingno
    tdDoctor.innerHTML=appPrint.employee_id.fullname
    tdPatient.innerHTML=appPrint.patient_id.firstname+" "+appPrint.patient_id.lastname
    tdDate.innerHTML=appPrint.channellingdate

    tdTime.innerHTML=appPrint.starttime.substring(0,5)+" - "+appPrint.endtime.substring(0,5)
    tdStatus.innerHTML=appPrint.appstatus_id.name

    let addeduser=ajaxGetReq("/user/getuserbyid/"+appPrint.addeduser);
    tdUser.innerHTML=addeduser.username;

    let PrintInfo = `Appointment Number : ${appPrint.appno}<br>
                 Patient Name :  ${appPrint.patient_id.firstname} ${appPrint.patient_id.lastname} <br>
                 Date : ${appPrint.channellingdate}<br>
                Time : ${appPrint.starttime.substring(0,5)}<br>`
    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.style.fontSize='16px'
    div.innerHTML=PrintInfo
    Swal.fire({
        title: "are you sure Print following Appointment?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printAppointmentDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}
// function to print appointment details
const printAppointmentDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Appointment Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printAppointment.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
            newTab.close()
        },1000
    )
}




// check form error
const  checkError=()=>{

    let errors="";

    if(appointmentscheduling.patient_id==null || txtPatient.value==''){
        errors+="Please Select Patient<br>"
        txtPatient.classList.add("is-invalid");
    }
    if(appointmentscheduling.employee_id==null || txtDoctor.value==''){
        errors+="Please Select Doctor<br>"
        txtDoctor.classList.add("is-invalid");
    }
    if(appointmentscheduling.channellingdate==null || textChannellingDate.value==''){
        errors+="Please Select Channelling Date<br>"
        textChannellingDate.classList.add("is-invalid");
    }

    if(appointmentscheduling.sessionstarttime==null || selectStartTime.value==''){
        errors+="Please Select Session Start Time<br>"
        selectStartTime.classList.add("is-invalid");
    }
    if(appointmentscheduling.starttime==null || appointmentscheduling.endtime==null){
        errors+="Please Select Channelling Date<br>"
        textChannellingDate.classList.add("is-invalid");
    }
    if(appointmentscheduling.channelingcharge==null ||  textPayFee.value==''){
        errors+="please Enter Channelling Fee<br>"
        textPayFee.classList.add("is-invalid");
    }
    if(appointmentscheduling.appstatus_id==null || selectAppStatus.value==''){
        errors+="Please Select Status<br>"
        selectAppStatus.classList.add("is-invalid");
    }

    return errors;

}


// appointment add function
const buttonAppAdd=()=>{

    let error=checkError();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


    if (error==''){
         let Info = `Patient Name: ${appointmentscheduling.patient_id.firstname}<br>
             Doctor Name: ${appointmentscheduling.employee_id.fullname}<br>
             Date: ${appointmentscheduling.channellingdate}<br>
            Start Time: ${appointmentscheduling.starttime}<br>
             End Time: ${appointmentscheduling.endtime}<br>    
            Channelling Fee: ${appointmentscheduling.channelingcharge}<br>    
            Status: ${appointmentscheduling.appstatus_id.name}<br>    
             `;

         div.innerHTML=Info

        Swal.fire({
            title: "Are you sure to add following appointment record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/appointment","POST",appointmentscheduling);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Appointment record Added Successfully!",
                        text: "",
                        icon: "success"
                    });

                    let params=window.location.search;
                    let urlParams=new URLSearchParams(params);
                    if (urlParams.has("appdate") && urlParams.has("doctorfullname") && urlParams.has("starttime") ){
                        const newUrl = new URL('http://localhost:8080/appointment');

                        window.history.replaceState({}, '', newUrl.toString());
                    }
                    refreshForm()
                    refreshTable()
                    $('a[href="#AppTable"]').tab('show');

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
            title: "form has following errors",
            html: div


        });
    }
}

const refillAppForm=(rowOb)=>{





    Title.innerHTML='Appointment Update'

 appointmentscheduling=JSON.parse(JSON.stringify(rowOb))
    appointmentschedulingold=JSON.parse(JSON.stringify(rowOb))



    let refillInfor=`Appointment Number : ${rowOb.appno}<br>
                 Patient Name :  ${rowOb.patient_id.firstname} ${rowOb.patient_id.lastname} <br>
                 Date : ${rowOb.channellingdate}<br>
                Time : ${rowOb.starttime.substring(0,5)}<br>`
    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.style.fontSize='16px'
    div.innerHTML=refillInfor

    Swal.fire({
        title: "Are you sure to edit the following Appointment?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#AppForm"]').tab('show');





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


            txtPatient.classList.remove('is-invalid')
            txtDoctor.classList.remove('is-invalid')
            textChannellingDate.classList.remove('is-invalid')
            textPayFee.classList.remove('is-invalid')
            textStartTime.classList.remove('is-invalid')
            textEndTime.classList.remove('is-invalid')
            selectAppStatus.classList.remove('is-invalid')
            selectStartTime.classList.remove('is-invalid')


            appointmentscheduling=rowOb
            console.log(appointmentscheduling)

            txtPatient.value=appointmentscheduling.patient_id.firstname
            txtPatName.innerHTML=appointmentscheduling.patient_id.title+" "+appointmentscheduling.patient_id.firstname+" "+appointmentscheduling.patient_id.lastname
            txtPatient.classList.add('is-valid');

            txtDoctor.value=appointmentscheduling.employee_id.fullname
            txtDoctor.classList.add('is-valid');

            selectedvalue=txtDoctor.value
            doctors=ajaxGetReq("/employee/getavailabledoctorlist");
            let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(selectedvalue)
            if (extIndex!=-1) {
                let doctorRecord = ajaxGetReq("/doctoravailability/getdetailsbydoctorid/" + doctors[extIndex].id);
                console.log(doctorRecord)
                let doctorRecordCounter = 1;

                doctorRecord.forEach(element => {
                    if (element === appointmentscheduling.channellingdate) {
                        doctorRecordCounter = 0; // Date found
                    }
                });

                console.log(doctorRecordCounter);

                if (doctorRecordCounter === 1) {
                    doctorRecord.push(appointmentscheduling.channellingdate);
                    console.log(`Date ${appointmentscheduling.channellingdate} added to the array.`);
                } else {
                    console.log(`Date ${appointmentscheduling.channellingdate} is already in the array.`);
                }


                fillDataIntoSelectArray(textChannellingDate, 'Select Date', doctorRecord, appointmentscheduling.channellingdate)
                textChannellingDate.classList.add('is-valid');




                let  consultationTime=ajaxGetReq("/appointment/getstartendtimebydoctor/"+JSON.parse(textChannellingDate.value)+"/"+doctors[extIndex].id)
                console.log(JSON.parse(textChannellingDate.value))
                console.log(consultationTime)
                let consultationTimeCounter = 1;

                consultationTime.forEach(element => {
                    console.log(element);
                    console.log(appointmentscheduling.sessionstarttime);
                    if (element === appointmentscheduling.sessionstarttime) {
                        consultationTimeCounter = 0; // Session start time found
                    }
                });

                if (consultationTimeCounter === 1) {
                    consultationTime.push(appointmentscheduling.sessionstarttime);
                    console.log(`Session start time ${appointmentscheduling.sessionstarttime} added to the array.`);
                } else {
                    console.log(`Session start time ${appointmentscheduling.sessionstarttime} is already in the array.`);
                }
                 fillDataIntoSelectArray(selectStartTime,'Select Start time',consultationTime,appointmentscheduling.sessionstarttime)
                selectStartTime.classList.add('is-valid');


            }

            textStartTime.value=appointmentscheduling.starttime.substring(0,5)
            textStartTime.classList.add("is-valid");

            textEndTime.value=appointmentscheduling.endtime.substring(0,5)
            textEndTime.classList.add("is-valid");

            textPayFee.value=parseFloat(appointmentscheduling.channelingcharge).toFixed(2)
            textPayFee.classList.add("is-valid");

            appStatus=ajaxGetReq("/appstatus/findall");
            fillDataIntoSelect(selectAppStatus,'Select Status',appStatus,'name',appointmentscheduling.appstatus_id.name);
            selectAppStatus.classList.add("is-valid");
            selectAppStatus.disabled=false



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

    if (appointmentscheduling.patient_id.firstname!=appointmentschedulingold.patient_id.firstname) {
        updateForm=updateForm + "Patient Name " +appointmentschedulingold.patient_id.firstname+ " changed into " +appointmentscheduling.patient_id.firstname +"<br>";
    }

    if (appointmentscheduling.employee_id.fullname!=appointmentschedulingold.employee_id.fullname) {
        updateForm=updateForm + "Doctor Name" +appointmentschedulingold.employee_id.fullname+ " changed into " +appointmentscheduling.employee_id.fullname +"<br>";
    }

    if (appointmentscheduling.channellingdate!=appointmentschedulingold.channellingdate) {
        updateForm=updateForm + "Date" +appointmentschedulingold.channellingdate+ " changed into " +appointmentscheduling.channellingdate +"<br>";
    }

    if (appointmentscheduling.sessionstarttime!=appointmentschedulingold.sessionstarttime) {
        updateForm=updateForm + " Dr Session Time" +appointmentschedulingold.sessionstarttime+ " changed into " +appointmentscheduling.sessionstarttime +"<br>";
    }
    if (appointmentscheduling.starttime!=appointmentschedulingold.starttime) {
        updateForm=updateForm + "Start time" +appointmentschedulingold.starttime.substring(0,5)+ " changed into " +appointmentscheduling.starttime.substring(0,5) +"<br>";
    }
    if (appointmentscheduling.endtime!=appointmentschedulingold.endtime) {
        updateForm=updateForm + "End time" +appointmentschedulingold.endtime.substring(0,5)+ " changed into " +appointmentscheduling.endtime.substring(0,5) +"<br>";
    }
    if (appointmentscheduling.channelingcharge!=appointmentschedulingold.channelingcharge) {
        updateForm=updateForm + "Channelling fee" +appointmentschedulingold.channelingcharge+ " changed into " +appointmentscheduling.channelingcharge +"<br>";
    }

    if (appointmentscheduling.appstatus_id.name!=appointmentschedulingold.appstatus_id.name) {
        updateForm=updateForm + "Status" +appointmentschedulingold.appstatus_id.name+ " changed into " +appointmentscheduling.appstatus_id.name +"<br>";
    }


    return updateForm;
}
//button update
const buttonAppUpdate=()=>{

    console.log(appointmentscheduling);
    // check form errors
    let formErrors=checkError();

    let div=document.createElement('div');
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.style.textAlign='left'



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
                    let   ajaxUpdateResponse=ajaxRequestBody("/appointment","PUT",appointmentscheduling);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Appointment record updated successfully!",

                            icon: "success"
                        });
                      refreshForm()
                        refreshTable()
                        // hide the modal
                        $('a[href="#AppTable"]').tab('show');
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
        div.style.fontSize='16px'
        Swal.fire({
            title: " Form has Following Errors",
                  html:div,
            icon: "warning"
        });
    }

}





//appointment table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Appointment table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Appointment table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Appointment Table Details<h2>'+
                tableAppointment.outerHTML

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





// button clear
const buttonClear=()=>{

    txtPatient.value=''
    txtPatient.classList.add('is-invalid')
    txtPatient.classList.remove('is-valid')
    txtPatName.innerHTML=''

    txtDoctor.value=''
    txtDoctor.classList.add('is-invalid')
    txtDoctor.classList.remove('is-valid')

    textChannellingDate.value=''
    textChannellingDate.classList.add('is-invalid')
    textChannellingDate.classList.remove('is-valid')

    selectStartTime.value=''
    selectStartTime.classList.add('is-invalid')
    selectStartTime.classList.remove('is-valid')

    textStartTime.value=''
    textStartTime.classList.add('is-invalid')
    textStartTime.classList.remove('is-valid')

    textEndTime.value=''
    textEndTime.classList.add('is-invalid')
    textEndTime.classList.remove('is-valid')

    textPayFee.value=''
    textPayFee.classList.add('is-invalid')
    textPayFee.classList.remove('is-valid')

}




// add new patient

//re fresh patient form
const refreshPatientForm=()=>{

    patient={}




    let currentDate = new Date();

    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    let maxDate = year + '-' + month + '-' + day;
    textDateOfBirth.max=maxDate;






    // set default value
    selectTitle.value=''
    textFirstName.value=''
    textLastName.value=''
    textDateOfBirth.value=''
    selectGender.value=''
    textContactNumber.value=''
    textNote.value=''
    textEmergencyName.value=''
    textEmergencyContactNo.value=''


    //set default color by removing valid color and in valid color
    selectTitle.classList.remove('is-valid')
    textFirstName.classList.remove('is-valid')
    textLastName.classList.remove('is-valid')
    textDateOfBirth.classList.remove('is-valid')
    selectGender.classList.remove('is-valid')
    textContactNumber.classList.remove('is-valid')
    textNote.classList.remove('is-valid')
    textEmergencyName.classList.remove('is-valid')
    textEmergencyContactNo.classList.remove('is-valid')

    selectTitle.classList.remove('is-invalid')
    textFirstName.classList.remove('is-invalid')
    textLastName.classList.remove('is-invalid')
    textDateOfBirth.classList.remove('is-invalid')
    selectGender.classList.remove('is-invalid')
    textContactNumber.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')
    textEmergencyName.classList.remove('is-invalid')
    textEmergencyContactNo.classList.remove('is-invalid')





    // disable button if user doesnt has privilege
    if (PatientPrivilege.insert){
        btnAddPat.disabled=""
        btnAddPat.style.cursor="pointer"
    }
    else {
        btnAddPat.disabled="disabled"
        btnAddPat.style.cursor="not-allowed"
    }

}

// get user confirmation before form refresh
const  refreshPatientFormByUserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form?",
        text: "Entered Data will be deleted",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPatientForm();
        }
    });
}


// check form error
const  checkPatientFormError=()=>{
    let errors="";

    // patient.title == null &&
    if ( selectTitle.value=='' && patient.title == null ) {
        errors =errors + "Please select a title<br>"
        selectTitle.classList.add('is-invalid')
    }
    if (textFirstName.value=='' && patient.firstname == null) {
        errors =errors + "Please enter first name<br>"
        textFirstName.classList.add('is-invalid')
    }
    if (textLastName.value=='' && patient.lastname == null) {
        errors =errors + "Please enter last name<br>"
        textLastName.classList.add('is-invalid')
    }
    if (textDateOfBirth.value=='' && patient.dateofbirth == null) {
        errors =errors + "Please select date of birth<br>"
        textDateOfBirth.classList.add('is-invalid')
    }

    if (selectGender.value=='' && patient.gender==null) {
        errors =errors + "Please select gender<br>"
        selectGender.classList.add('is-invalid')
    }
    if (textContactNumber.value=='' && patient.contactno==null) {
        errors =errors + "Please enter mobile number<br>"
        textContactNumber.classList.add('is-invalid')
    }




    return errors;
}


// patient add function
const buttonPatientAdd=()=>{

    console.log(patient)
    let error=checkPatientFormError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


    if (error==''){
        let patientInfo = `Title: ${patient.title}<br>
                 First name: ${patient.firstname}<br>
                  Last Name: ${patient.lastname}<br>
                  Date  of birth: ${patient.dateofbirth}<br> 
                  Gender: ${patient.gender}<br> 
                   Contact number: ${patient.contactno}<br>`;

        if (patient.emergencycontactname !=null){
            patientInfo += ` Emergency contact name: ${patient.emergencycontactname}<br>`
        }
        if (patient.emergencycontactno !=null){
            patientInfo += ` Emergency contact number  : ${patient.emergencycontactno}<br>`;
        }

        div.innerHTML=patientInfo

        Swal.fire({
            title: "Are you sure to add following patient record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/patient","POST",patient);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Patient record Added Successfully!",
                        text: "",
                        icon: "success"
                    });

                    patientList=ajaxGetReq("/patient/list");
                    fillDataIntoDataList(datalistitems,patientList,'firstname')
                    txtPatient.value=textFirstName.value
                    txtPatient.classList.add('is-valid')
                    txtPatient.classList.remove('is-invalid')

                    let extIndex=patientList.map(element=>element.firstname).indexOf(textFirstName.value)
                    console.log(patientList[extIndex].id)
                    console.log(patientList[extIndex])
                    appointmentscheduling.patient_id=patientList[extIndex]
                    txtPatName.innerHTML=selectTitle.value+" "+textFirstName.value+" "+textLastName.value
                    refreshPatientForm()
                    $('#modalPatientAddForm').modal('hide');


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