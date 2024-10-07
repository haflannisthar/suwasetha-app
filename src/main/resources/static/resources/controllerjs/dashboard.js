
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{


    // UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Appointment Scheduling");
  //refresh function for table and form
  //   function is in doctor availability
    availabledoctorList=ajaxGetReq("/doctoravailability/todayavailabledoctorlist");
    console.log(availabledoctorList)

    pendingpurchasingorders=ajaxGetReq("/purchaseorder/getpendingorders");


    userdetail=ajaxGetReq("/profile/loggeduser");
    appointmentListForTheDay=ajaxGetReq("/appointment/getallappointentfortheday/"+userdetail.employee_id.id);
    console.log(appointmentListForTheDay)
    console.log(userdetail)
    refreshDashTable()


    refreshDoctorAvailabilityCheck()




    
})



//function to refresh table
const refreshDashTable=()=>{


   const displayProperty=[
       {property:'name',datatype:'string'},
       {property:'date',datatype:'string'},
       {property:'starttime',datatype:'string'},
       {property:'endtime',datatype:'string'},

  ]

  //fillDataIntoTable function call
  //fillDataIntoTable(tableId,datalist,propertylist,refill employee,delete employee,print employee,privilegeob)
    let findTableDoctorList=document.getElementById('tableDoctorListDashboard')

    if (findTableDoctorList){
        fillDataIntoTable(tableDoctorListDashboard,availabledoctorList,displayProperty,refilForm,deleteD,printD,false,null);
        console.log("true")
    }else {
        console.log('false')
    }


    const displayPropertyfororders=[
        {property:getOrderCode,datatype:'function'},
        {property:getSupplierName,datatype:'function'},
        {property:getRequiredDate,datatype:'function'},
        {property:getTotalAmount,datatype:'function'}

    ]

    let findTableOrders=document.getElementById('tablePendingOrders')

    if (findTableOrders) {
        fillDataIntoTable(tablePendingOrders, pendingpurchasingorders, displayPropertyfororders, refilPForm, deleteP, printP, false, null);

    }

    const displayPropertyForAppointment=[
        {property:'appno',datatype:'string'},
        {property:getPatientName,datatype:'function'},
        {property:getDcotorName,datatype:'function'},
        {property:getAppointmentTime,datatype:'function'}

    ]

        let findTableAppointment=document.getElementById('tableAppointment')

        if (findTableAppointment) {
            fillDataIntoTable(tableAppointment, appointmentListForTheDay, displayPropertyForAppointment, refilPForm, deleteP, printP, false, null);
        }
}


const getOrderCode=(rowOb)=>{
    return rowOb.code;
}
const getSupplierName=(rowOb)=>{
    return rowOb.supplier_id.name;
}
const getRequiredDate=(rowOb)=>{
    return rowOb.requireddate;
}

const getTotalAmount=(rowOb)=>{
    return parseFloat(rowOb.totalamount).toFixed(2);
}

const getPatientName=(rowOb)=>{
    return rowOb.patient_id.firstname;
}
const getAppointmentTime=(rowOb)=>{
    return rowOb.starttime.substring(0,5)+'-'+rowOb.endtime.substring(0,5);
}

const getDcotorName=(rowOb)=>{
    return rowOb.employee_id.callingname;
}



const deleteD=(rowOb,rowind)=>{}



    //edit function
const refilForm=(rowOb,rowind)=>{}

const printD=(rowOb,rowind)=>{}

  // table print function

const deleteP=(rowOb,rowind)=>{}



//edit function
const refilPForm=(rowOb,rowind)=>{}

const printP=(rowOb,rowind)=>{}

// table print function

const refreshDoctorAvailabilityCheck=()=>{
    doctorList=ajaxGetReq("/employee/getdoctorlist")
    fillDataIntoSelect(selectDoctorName,'select Doctor',doctorList,'callingname')


    // set date for start date
    let currentdate=new Date();


    let minMonth =currentdate.getMonth()+1;

    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= currentdate.getDate();

    if (minDay < 10){
        minDay='0'+ minDay;
    }
    selectDate.min=currentdate.getFullYear() +"-"+ minMonth+"-"+minDay;



    // set min date for end date
    let maxDate=new Date()

    let maxMonth =maxDate.getMonth()+1;

    if (maxMonth<10){
        maxMonth='0'+maxMonth;
    }

    let maxDay= maxDate.getDate()+7;

    if (maxDay < 10){
        maxDay='0'+ maxDay;
    }

    selectDate.max=maxDate.getFullYear() +"-"+ maxMonth+"-"+maxDay;

    console.log(selectDate.min)
    console.log(selectDate.max)




}

const btnDoctorAvailabilityCheck=()=>{
    if (selectDoctorName.value!='' && selectDate.value!=''){
        doctorAvailabilityByDoctorDate=ajaxGetReq("/doctoravailability/getavailabledatetimebydoctoridanddate/"+JSON.parse(selectDoctorName.value).id+"/"+selectDate.value)

        const displayPropertyDocAv=[
            {property:'availabledate',datatype:'string'},
            {property:'startingtime',datatype:'string'},
            {property:'endtime',datatype:'string'},
            {property:pendingAppointmentSlots,datatype:'function'},



        ]
        fillDataIntoTableDashBoard(tableDoctorAvailability,doctorAvailabilityByDoctorDate,displayPropertyDocAv,createAppForm,'Book Appointment');
        disablebtnForPassedStatus()
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Please select the field first!',
            text: 'You need to select a field before proceeding.',
            confirmButtonText: 'OK'
        });

    }
}


const pendingAppointmentSlots=(ob)=>{
    totalAppointmentCount=ajaxGetReq("/appointment/gettotalcreatedappointment/"+JSON.parse(selectDoctorName.value).id+"/"+ob.availabledate+"/"+ob.startingtime)
    console.log(totalAppointmentCount)
    return ob.noofpatients-totalAppointmentCount
}

const createAppForm =(ob)=>{
 window.location.replace("/appointment?appdate="+ob.availabledate+"&doctorfullname="+JSON.parse(selectDoctorName.value).fullname+"&starttime="+ob.startingtime)


}


// disabel the button
const disablebtnForPassedStatus = () => {
    const tableDoctorAvailability = document.getElementById("tableDoctorAvailability");
    const tableRows = tableDoctorAvailability.querySelectorAll("tbody tr");

    let today = new Date();

    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let day = today.getDate().toString().padStart(2, '0');

    let currentDate = `${year}-${month}-${day}`;

    let now = new Date();

    // Extract hours, minutes, and seconds
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    // Format the time as HH:MM:SS
    let currentTime = `${hours}:${minutes}:${seconds}`;

    tableRows.forEach(function(row) {
        const channellingDate = row.querySelector("td:nth-child(2)");
        const sessionEndTime = row.querySelector("td:nth-child(4)");
        const pendingAppointmentCount = row.querySelector("td:nth-child(5)");
        const actionCell = row.querySelector("td:nth-child(6)");

        if (channellingDate && sessionEndTime && actionCell) {
            const channellingDateValue = channellingDate.textContent.trim();
            const sessionEndTimeValue = sessionEndTime.textContent.trim();
            const pendingAppointmentCountValue = pendingAppointmentCount.textContent.trim();

            const button = actionCell.querySelector('.btn-display button');

            if (channellingDateValue === currentDate && sessionEndTimeValue < currentTime) {
                console.log("Button hidden due to date and time.");
                button.style.display = 'none';
            } else {
                button.style.display = 'inline-block';
            }

            if (pendingAppointmentCountValue == 0) {
                actionCell.style.display = 'none';
            } else {
                actionCell.style.display = 'inline-block';
            }
        }
    });
};
