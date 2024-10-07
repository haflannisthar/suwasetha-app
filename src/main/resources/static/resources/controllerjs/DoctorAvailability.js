window.addEventListener('load',()=>{



     UserPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Doctor Availability");
     console.log(UserPrivilege)
    //refresh function for table and form
    refreshDAvailTable()
    refreshDAvailForm();

    $('[data-toggle="tooltip"]').tooltip()


})
//function to refresh table
const refreshDAvailTable=()=>{
    availabilitydata=ajaxGetReq("/doctoravailability/findall");
    console.log(availabilitydata)

    const displayProperty=[
             {property:getdoctorname,datatype:'function'},
          {property:getstrartdate,datatype:'function'},
          {property:getenddate,datatype:'function'},
        {property:getaddeduser,datatype:'function'},


    ]
    fillDataIntoTableWithViewButton(DAtable,availabilitydata,displayProperty,refillDaForm,deleteDaForm,viewDaForm,printDaForm,true,UserPrivilege);

    disabledeletebutton();
    $('#DAtable').dataTable();



}
// function to get doctor name
const getdoctorname=(rowOb)=>{
    return rowOb.employee_id.callingname;
}
// function to get start date
const getstrartdate=(rowOb)=>{

    return rowOb.startdate
}
const getenddate=(rowOb)=>{

    return  rowOb.enddate
}

const getaddeduser=(rowOb)=>{
    let addeduser=ajaxGetReq("/user/getuserbyid/"+rowOb.addeduser);
    return addeduser.username

}


// delete button disable
const  disabledeletebutton=()=>{
    const DAtable = document.getElementById("DAtable");
    const tableRows = DAtable.querySelectorAll("tbody tr");

if (tableRows.length>0){
    tableRows.forEach(function(row) {


        const actionCell = row.querySelector("td:nth-child(6)"); // Adjusted selector for action cell
        const dropdown = actionCell.querySelector(".dropdown");
        const deleteButton = dropdown.querySelector(".btn-danger");

        if (UserPrivilege.delete){

            deleteButton.disabled = true;
            deleteButton.style.display = "none";
        }



    });
}

}





const refreshDAvailForm=()=>{

    DAvailTitle.innerHTML='New Doctor Availability  Enrollment'
    freshbtn.style.visibility = 'visible'




    doctoravailability={}
    doctoravailability.availableDateandTimeList=[]



    doctors=ajaxGetReq("/employee/getdoctorlist");
    fillDataIntoDataList(datalistitems,doctors,'fullname')


// set date for start date
    let currentdate=new Date();


    let minMonth =currentdate.getMonth()+1;

    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= currentdate.getDate()+1;

    if (minDay < 10){
        minDay='0'+ minDay;
    }
    textStartDate.min=currentdate.getFullYear() +"-"+ minMonth+"-"+minDay;


    //
    // // set min date for end date
    // let endmindate=new Date()
    //
    // let minendMonth =endmindate.getMonth()+1;
    //
    // if (minendMonth<10){
    //     minendMonth='0'+minendMonth;
    // }
    //
    // let minendDay= endmindate.getDate()+7;
    //
    // if (minendDay < 10){
    //     minendDay='0'+ minendDay;
    // }
    //
    // // textDepositDate.min=depositmindate.getFullYear() +"-"+ minDepMonth+"-"+minDepDay;
    // textEndDate.min=endmindate.getFullYear() +"-"+ minendMonth+"-"+minendDay;




    txtDoctor.disabled=false
    textStartDate.disabled=true
    textEndDate.disabled=true




    // set default value
    txtDoctor.value=''
    textNote.value=''
    textStartDate.value=''
    textEndDate.value=''

    //set default color
    txtDoctor.classList.remove("is-valid")
    textNote.classList.remove("is-valid")
    textStartDate.classList.remove("is-valid")
    textEndDate.classList.remove("is-valid")

    txtDoctor.classList.remove("is-invalid")
    textNote.classList.remove("is-invalid")
    textStartDate.classList.remove("is-invalid")
    textEndDate.classList.remove("is-invalid")


    // refresh innerform and table
    refreshinnerformandtable();


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
const refreshinnerformandtable=()=>{


    availabledatetime={}

    // set date for  date
    textAvailDate.min=textStartDate.value
    console.log( textAvailDate.min)
    textAvailDate.max=textEndDate.value;
    console.log(textEndDate.value)

    let currentDate=new Date();
    let currentYear=currentDate.getFullYear();
    let currentMonth=currentDate.getMonth()+1;
    let currentDay=currentDate.getDate();

    if (currentMonth<10){
        currentMonth='0'+currentMonth
    }
    if (currentDay<10){
        currentDay='0'+currentDay
    }

    let todayDate=currentYear+'-'+currentMonth+'-'+currentDay
    console.log(todayDate)

    if (todayDate>textAvailDate.min){
        textAvailDate.min=todayDate;
    }





    //     empty all element
    textAvailDate.value=''
    textStartTime.value=''
    textEndTime.value=''
    textPatientCount.value=''

    textAvailDate.disabled=true
    textStartTime.disabled=true
    textEndTime.disabled=true
    textPatientCount.disabled=true

    btnInnerForm.disabled=false;

//     default color
    textAvailDate.classList.remove("is-valid")
    textStartTime.classList.remove("is-valid")
    textEndTime.classList.remove("is-valid")
    textPatientCount.classList.remove("is-valid")

    textAvailDate.classList.remove("is-invalid")
    textStartTime.classList.remove("is-invalid")
    textEndTime.classList.remove("is-invalid")
    textPatientCount.classList.remove("is-invalid")

//     refresh inner table

    const displayInnerTableProperty=[
        {property:getdate,datatype:'function'},
        {property:getstarttime,datatype:'function'},
        {property:getendtime,datatype:'function'},
        {property:getpatientcount,datatype:'function'}

    ]


    fillDataIntoInnerTable(availabledatetimeinnertable,  doctoravailability.availableDateandTimeList,displayInnerTableProperty,deleteInnerTableRow)


    if (textStartDate.value!='' && textEndDate.value!=''){
        textAvailDate.disabled=false

    }


}



// function to get date in inner table
const getdate=(ob)=>{


    return ob.availabledate

}

// function to get start time in inner table
const getstarttime=(ob)=>{

  return ob.startingtime.slice(0,5)
}

// function to get end time in inner table
const getendtime=(ob)=>{
 return  ob.endtime.slice(0,5)
}


// get patient count to inner table
const getpatientcount=(ob)=>{
    return ob.noofpatients;

}


// refresh table by user confirmation
const refreshDAvailFormByuserConfirm=()=>{
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
            refreshDAvailForm();
        }
    });
}



// enable startdate field and get last added record for that doctor and fill the end date in start date field
// check if the last added record date is less than or equal to current date and if so set the current date
const enablestartdatefield=()=>{
    if (doctoravailability.employee_id!=null){
        textStartDate.disabled=false;
        txtDoctor.disabled=true
       let enddatebydoctor=ajaxGetReq("/doctoravailability/getenddatebydoctorid/"+doctoravailability.employee_id.id);

        console.log(enddatebydoctor)

    if (enddatebydoctor!=null){
        let date=new Date(enddatebydoctor.split('T')[0])
        date.setDate(date.getDate()+1);
        let finaldate= date.toISOString().slice(0, 10);

        let currentDate=new Date();
        let currentYear=currentDate.getFullYear();
        let currentMonth=currentDate.getMonth()+1;
        let currentDay=currentDate.getDate();

        if (currentMonth<10){
            currentMonth='0'+currentMonth
        }
        if (currentDay<10){
            currentDay='0'+currentDay
        }

        let todayDate=currentYear+'-'+currentMonth+'-'+currentDay
        // check that the last record end date is equal to current date and if current date >= final date then assign the current date
        if (todayDate>=finaldate){
            textStartDate.value=todayDate
            doctoravailability.startdate= textStartDate.value
            textStartDate.classList.add("is-valid")
        }else{
            textStartDate.value=finaldate
            doctoravailability.startdate= textStartDate.value
            textStartDate.classList.add("is-valid")
        }


        calculateenddate()
        enableenddatefield()
    }

    }
}

// enable end date field
const enableenddatefield=()=>{
    if (doctoravailability.startdate!=null){
        textEndDate.disabled=false;
        textStartDate.disabled=true

    }
}

// enable inner form  date field
// set the start and date date for inner table date field
const enableinnerformdatefiled=()=>{
    if (doctoravailability.enddate!=null){
        textAvailDate.disabled=false;
        textEndDate.disabled=true

        // calculateenddate()



        textAvailDate.min=textStartDate.value
        textAvailDate.max=textEndDate.value

    }
}

// enable inner form  start time field
const enablestarttime=()=>{
    if (availabledatetime.availabledate!=null){
        textStartTime.disabled=false;
    }
}

// enable inner form  end time field
const enableendtime=()=>{
    if (availabledatetime.startingtime!=null){
        textEndTime.disabled=false;
    }
}

// calculate end date
//7 days from start date
const calculateenddate=()=>{
    console.log(textStartDate.value)

    // Ensure the textEndDate input is selected correctly
    const textEndDate = document.getElementById('textEndDate');
    // get the field value
    let startdatevalue = textStartDate.value;
    textEndDate.value=''
    textEndDate.classList.remove('is-valid')
    doctoravailability.enddate=null;


// Create a Date object for the start date
    const startDate = new Date(startdatevalue);

// calculate 7 days ahead selected date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

// Format the end date
    const year = endDate.getFullYear();
    let month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    let day = endDate.getDate().toString().padStart(2, '0');
    const formattedEndDate = `${year}-${month}-${day}`;

    // calculate 7 days ahead selected date
    const endDatemax = new Date(startDate);
    endDatemax.setDate(startDate.getDate() + 10);
    let maxday = endDatemax.getDate().toString().padStart(2, '0');

    const formattedEndDatemaxx = `${year}-${month}-${maxday}`;


    textEndDate.min = formattedEndDate;
    textEndDate.max = formattedEndDate;
    console.log(textEndDate.min);
    console.log( textEndDate.max);


    textAvailDate.value=''
    textAvailDate.classList.remove('is-valid')


}


// check the current date equal to selected date and current time is greater than end time
const checkdatevalidity=()=>{
    let selecteddate=textAvailDate.value;

    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();

    if (month<10){
        month='0'+month
    }
    if (day<10){
        day='0'+day
    }

    let currentdate=year+'-'+month+'-'+day;
    console.log(selecteddate)
    console.log(currentdate)

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    let currenttime=`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    // check that the selected date is eual to current date and selected start time equal to or less than end time
    // if so show error
    if (currentdate===selecteddate){

        if (currenttime>=textStartTime.value){
            let timerInterval;
            Swal.fire({
                icon: 'error',
                html:"The selected time cannot be earlier than the current time. Please choose a valid future time.\n",
                timer: 3000,

                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                textAvailDate.value=''
                textAvailDate.classList.remove('is-valid')
                availabledatetime.availabledate=null

                textStartTime.value=''
                textStartTime.classList.remove('is-valid')
                availabledatetime.startingtime=null

                textEndTime.value=''
                textEndTime.classList.remove('is-valid')
                availabledatetime.endtime=null

                textPatientCount.value=''
                textPatientCount.classList.remove('is-valid')
                availabledatetime.noofpatients=null



            })
        }


    }
}

// validate end Time
const validateEndTime=()=>{
    console.log(textStartTime.value)
    console.log(textEndTime.value)

    if (textAvailDate.value!==''){
        if (textStartTime.value!='' && textEndTime.value!=''){
            if (textStartTime.value<=textEndTime.value){
                let starttime=textStartTime.value
                let endtime=textEndTime.value


                // below code will change the string into numbers ["14","20"]=>['14','20']
                // convert the string into numbers
                const [startHours, startMinutes] = starttime.split(':').map(Number);
                const [endHours, endMinutes] = endtime.split(':').map(Number);

                //     calculate the total minutes for start and End
                const starttotalminutes=startHours*60+startMinutes
                const endtotalminutes=endHours*60+endMinutes

                //     calculate the different
                let minuteDifferent=endtotalminutes-starttotalminutes;

                if (minuteDifferent<0){
                    minuteDifferent +=24*60;
                }

                if (minuteDifferent<=60){
                    let timerInterval;
                    Swal.fire({
                        title: "The time difference must be greater than one hour",
                        timer: 3000,

                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        availabledatetime.endtime=null
                        textEndTime.value=''
                        textEndTime.classList.add("is-invalid")
                        textEndTime.classList.remove("is-valid")
                        btnInnerForm.disabled=true
                    });

                }else {
                    btnInnerForm.disabled=false
                    // get the total minutes to calculate patient count
                    textPatientCount.disabled=false;

                    let patientcount=Math.ceil(minuteDifferent/10)
                    console.log(patientcount)
                    textPatientCount.value=patientcount;
                    textPatientCount.classList.add('is-valid');
                    textPatientCount.classList.remove('is-invalid');
                    availabledatetime.noofpatients=patientcount

                }
            }
            else {
                let timerInterval;
                Swal.fire({
                    title: "start time cannot be greater than end time",
                    timer: 3000,

                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {

                    availabledatetime.startingtime=null
                    textStartTime.value=''
                    textStartTime.classList.add("is-invalid")
                    textStartTime.classList.remove("is-valid")

                    availabledatetime.endtime=null
                    textEndTime.value=''
                    textEndTime.classList.add("is-invalid")
                    textEndTime.classList.remove("is-valid")

                    btnInnerForm.disabled=true
                });
            }
        }

    }else{
        let timerInterval;
        Swal.fire({
            title: "",
            html:"please select the date first",
            timer: 3000,

            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            textStartTime.value=''
            textStartTime.classList.remove('is-valid')

            textEndTime.value=''
            textEndTime.classList.remove('is-valid')
        })
    }





}



// check that the selected date and start time fall between the date and start and end time in the object/array
const checkthestarttimeanddate=()=>{
    let selecteddate=textAvailDate.value
    let selectedstarttime=textStartTime.value
    let selectedendtime=textEndTime.value

    doctoravailability.availableDateandTimeList.forEach(element=>{

        if (selecteddate!='' && selectedstarttime!='' && selectedendtime!=''){

            if (element.availabledate.split('T')[0]==selecteddate){
                // if (element.startingtime<=selectedstarttime && selectedstarttime<=element.endtime){
                if (selectedstarttime<element.endtime.slice(0,5) && selectedendtime>element.startingtime.slice(0,5)){
                    let timerInterval;
                    Swal.fire({
                        title: "record already available for selected time range",
                        html:"please check the date and time again",
                        timer: 3000,

                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        textAvailDate.value=''
                        textStartTime.value=''
                        textEndTime.value=''
                        textPatientCount.value=''

                        textAvailDate.classList.remove("is-valid")
                        textStartTime.classList.remove("is-valid")
                        textEndTime.classList.remove("is-valid")
                        textPatientCount.classList.remove("is-valid")

                        availabledatetime.availabledate=null
                        availabledatetime.endtime=null
                        availabledatetime.startingtime=null
                        availabledatetime.noofpatients=null

                        btnInnerForm.disabled=true

                        let currentDate=new Date();
                        let currentYear=currentDate.getFullYear();
                        let currentMonth=currentDate.getMonth()+1;
                        let currentDay=currentDate.getDate();

                        if (currentMonth<10){
                            currentMonth='0'+currentMonth
                        }
                        if (currentDay<10){
                            currentDay='0'+currentDay
                        }

                        let todayDate=currentYear+'-'+currentMonth+'-'+currentDay
                        console.log(todayDate)

                        if (todayDate>textAvailDate.min){
                            textAvailDate.min=todayDate;
                        }
                    });
                }else {
                    btnInnerForm.disabled=false
                }
                // check for duplicate date-time add
                if (element.startingtime.slice(0,5) == selectedstarttime && element.endtime.slice(0,5) == selectedendtime){
                    let timerInterval;
                    Swal.fire({
                        title: "Selected date and starting time already added",
                        html:"please check the date and time again",
                        timer: 3000,

                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        textAvailDate.value=''
                        textStartTime.value=''
                        textEndTime.value=''
                        textPatientCount.value=''

                        textAvailDate.classList.remove("is-valid")
                        textStartTime.classList.remove("is-valid")
                        textEndTime.classList.remove("is-valid")
                        textPatientCount.classList.remove("is-valid")

                        availabledatetime.availabledate=null
                        availabledatetime.endtime=null
                        availabledatetime.startingtime=null
                        availabledatetime.noofpatients=null

                        btnInnerForm.disabled=true

                        let currentDate=new Date();
                        let currentYear=currentDate.getFullYear();
                        let currentMonth=currentDate.getMonth()+1;
                        let currentDay=currentDate.getDate();

                        if (currentMonth<10){
                            currentMonth='0'+currentMonth
                        }
                        if (currentDay<10){
                            currentDay='0'+currentDay
                        }

                        let todayDate=currentYear+'-'+currentMonth+'-'+currentDay
                        console.log(todayDate)

                        if (todayDate>textAvailDate.min){
                            textAvailDate.min=todayDate;
                        }
                    });
                }else {
                    btnInnerForm.disabled=false
                }
            }else {
                btnInnerForm.disabled=false

            }


        }

    })

}

//delete inner table row
const deleteInnerTableRow=(rowOb,rowInd)=>{




// user confirmation
    let iteminfor=`Date ${rowOb.availabledate}<br>
                             Start time ${rowOb.startingtime.substring(0,5)}<br>  
                             End time ${rowOb.endtime.substring(0,5)}<br>  
                            Patient count ${rowOb.noofpatients}<br> `

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=iteminfor
    Swal.fire({
        title: "Are you sure to remove following availability date record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            doctors=ajaxGetReq("/employee/getdoctorlist");

            let extIndex=doctors.map(doctor=>doctor.fullname).indexOf(txtDoctor.value)

            console.log(doctors[extIndex].id)


            appointmentCountByDateTime=ajaxGetReq("/appointment/getappointmentcountfordateandtime/"+doctors[extIndex].id+"/"+rowOb.availabledate+"/"+rowOb.startingtime)
            console.log(appointmentCountByDateTime)
            if (appointmentCountByDateTime){
                Swal.fire({
                    icon: "error",
                    title: "Delete Unsuccessful",
                    html:"Appointments have created for the day.Cannot delete Doctor Availability record"


                });
            }else{
                doctoravailability.availableDateandTimeList.splice(rowInd,1)


                Swal.fire({
                    title: "Removed  Successfully!",
                    icon: "success"
                });
                refreshinnerformandtable()
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

// inner form error
const checkInnerFormError=()=>{
    let errors=''
    if(availabledatetime.availabledate==null || textAvailDate.value==''){
        errors+="please select date<br>"
        textAvailDate.classList.add("is-invalid");
    }
    if(availabledatetime.startingtime==null || textStartTime.value==''){
        errors+="please select consultation start time <br>"
        textStartTime.classList.add("is-invalid");
    }
    if(availabledatetime.endtime==null || textEndTime.value==''){
        errors+="please select consultation end time <br>"
        textEndTime.classList.add("is-invalid");
    }


    if(availabledatetime.noofpatients==null || textPatientCount.value==''){
        errors+="please enter patient count or select start time and end time to calculate patient count<br>"
        textPatientCount.classList.add("is-invalid");
    }



    return errors;
}



// inner form  add
const btnInnerformAdd=()=>{

//     check for error
    let error=checkInnerFormError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'

    if(error==''){



        let datetimeetails=  `Date: ${availabledatetime.availabledate}<br>
                                             Start time: ${availabledatetime.startingtime} <br>
                                             End time: ${availabledatetime.endtime} <br> 
                                            Patient count: ${availabledatetime.noofpatients} <br> `

        div.innerHTML=datetimeetails
        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following availability date record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Availability Date Record Added Successfully!",

                    icon: "success"
                });

                //     push into array
                doctoravailability.availableDateandTimeList.push(availabledatetime);

                refreshinnerformandtable()

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
const  deleteDaForm=(rowOb)=>{

}


// view availability details method
const  viewDaForm=(rowOb)=>{


    const PrintOb=rowOb;

    tdDoctorName.innerHTML=PrintOb.employee_id.fullname


    let addeduser=ajaxGetReq("/user/getuserbyid/"+PrintOb.addeduser);
    tdAddedUser.innerHTML=addeduser.username;




    tdStartDate.innerHTML=PrintOb.startdate


    tdEndDate.innerHTML=PrintOb.enddate




    if (PrintOb.note==null){
        tdNote.innerHTML=""
    }
    else {
        tdNote.innerHTML=PrintOb.note
    }


    let date=PrintOb.addeddatetime
    tdDate.innerHTML=date.split('T')[0]+" "+date.split('T')[1]

    const displayInnerTableProperty=[
        {property:getAvailableDate,datatype:'function'},
        {property:getstarttime,datatype:'function'},
        {property:getendtime,datatype:'function'},
        {property:getpatientcount,datatype:'function'}

    ]


    fillDataIntoInnerTable(printinnertable, PrintOb.availableDateandTimeList,displayInnerTableProperty,deleteInnerTableRow,false)



    let viewInfo = `
               Doctor  : ${PrintOb.employee_id.fullname}<br>
               Start Date  : ${PrintOb.startdate}<br>
               End Date  : ${PrintOb.enddate}<br>
               `

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=viewInfo
    Swal.fire({
        title: "are you sure view following record?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            // printSuppPayDetails();
            $('#viewAvailabilityDetails').modal('show');
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}

// get available date for inner form print
const getAvailableDate=(rowOb)=>{



    return  rowOb.availabledate

}



// set data to fields for print doctor availability details
const printDaForm=(rowOb)=>{


    const PrintOb=rowOb;

    tdDoctorName.innerHTML=PrintOb.employee_id.fullname


    let addeduser=ajaxGetReq("/user/getuserbyid/"+PrintOb.addeduser);
    tdAddedUser.innerHTML=addeduser.username;



    tdStartDate.innerHTML=PrintOb.startdate



    tdEndDate.innerHTML=PrintOb.enddate





    if (PrintOb.note==null){
        tdNote.innerHTML=""
    }
    else {
        tdNote.innerHTML=PrintOb.note
    }


    let date=PrintOb.addeddatetime
    tdDate.innerHTML=date.split('T')[0]+" "+date.split('T')[1]

    const displayInnerTableProperty=[
        {property:getAvailableDate,datatype:'function'},
        {property:getstarttime,datatype:'function'},
        {property:getendtime,datatype:'function'},
        {property:getpatientcount,datatype:'function'}

    ]


    fillDataIntoInnerTable(printinnertable, PrintOb.availableDateandTimeList,displayInnerTableProperty,deleteInnerTableRow,false)



    let printInfo = `
               Doctor  : ${PrintOb.employee_id.fullname}<br>
               Start Date  : ${PrintOb.startdate}<br>
               End Date  : ${PrintOb.enddate}<br>
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
            printDocAvailDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}
// function to print availability details
const printDocAvailDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Doctor Availability Details Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printDoctorAvailabilityTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}




// check form error
const  checkerror=()=>{

    let errors="";



    if ( txtDoctor.value=='' || doctoravailability.employee_id==null ) {
        errors =errors + "Please select doctor <br>"
        txtDoctor.classList.add('is-invalid')
    }
    if (textStartDate.value==''|| doctoravailability.startdate==null) {
        errors =errors + "Please select start date <br>"
        textStartDate.classList.add('is-invalid')
    }
    if (textEndDate.value==''|| doctoravailability.enddate==null) {
        errors =errors + "Please select end date<br>"
        textEndDate.classList.add('is-invalid')
    }


    if ( doctoravailability.availableDateandTimeList.length==0) {
        errors =errors + "Please select date,start time,end time to fill data to table [available date time list cannot be empty]<br>"
    }



    return errors;
}


// doctor availability  add function
const buttonDAvailAdd=()=>{

    console.log(doctoravailability)
    let error=checkerror();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'


    if (error==''){

        let availabledatetimedetails=''

        let availabledatetimes=[]
        for (let element of doctoravailability.availableDateandTimeList){

            availabledatetimes.push(element);
        }

        if (availabledatetimes.length>0){
            availabledatetimedetails+="Available Date-times : <br>";
            availabledatetimedetails+='<table style="border: 1px solid black"><tr><th style="border: 1px solid black">date</th><th style="border: 1px solid black">start time</th><th style="border: 1px solid black">end time</th><th style="border: 1px solid black">patient count</th></tr>';

            availabledatetimes.forEach(element=>{
                availabledatetimedetails+='<tr style="border: 1px solid black">'+
                    '<td style="border: 1px solid black">'+element.availabledate.split('T')[0]+'</td>'+
                    '<td style="border: 1px solid black">'+element.startingtime.slice(0,5)+'</td>'+
                    '<td style="border: 1px solid black">'+element.endtime.slice(0,5)+'</td>'+
                    '<td style="border: 1px solid black">'+element.noofpatients+'</td>'+
                    '</tr>'


            })
            availabledatetimedetails += '</table><br>';
        }

         let Info = `
              Doctor : ${doctoravailability.employee_id.fullname}<br>
               Start Date : ${doctoravailability.startdate}<br>
              End Date : ${doctoravailability.enddate}<br> 
                 ${availabledatetimedetails}`;

         if (doctoravailability.note !=null){
             Info += `Note  : ${doctoravailability.note}<br>`
         }

         div.innerHTML=Info
        Swal.fire({
            title: "Are you sure to add following availability record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {

                let serverResponse=ajaxRequestBody("/doctoravailability","POST",doctoravailability);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Doctor availability record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    refreshDAvailForm()
                    refreshDAvailTable()
                    $('a[href="#AvailTable"]').tab('show');

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
const refillDaForm=(rowOb)=>{

    DAvailTitle.innerHTML='Doctor Availability Update'


 doctoravailability=JSON.parse(JSON.stringify(rowOb))
    doctoravailabilityold=JSON.parse(JSON.stringify(rowOb))





    let refillInfor=`Doctor : ${rowOb.employee_id.fullname}<br>
                               Start date : ${doctoravailability.startdate}<br>
                               End date : ${doctoravailability.enddate}<br>  `

    let div=document.createElement('div')
    div.style.marginLeft='50px'
    div.style.textAlign='left'
    div.innerHTML=refillInfor

    Swal.fire({
        title: "Are you sure to edit the following doctor availability record?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#AvailForm"]').tab('show');


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

            txtDoctor.classList.remove("is-invalid")
            textNote.classList.remove("is-invalid")
            textStartDate.classList.remove("is-invalid")
            textEndDate.classList.remove("is-invalid")

            doctoravailability=rowOb
            console.log(doctoravailability)

            freshbtn.style.visibility = 'visible'


            txtDoctor.value=doctoravailability.employee_id.fullname;
            txtDoctor.classList.add("is-valid")
            txtDoctor.disabled=true;

            textStartDate.value=doctoravailability.startdate
            textStartDate.classList.add("is-valid")
            textStartDate.disabled=true;

            textEndDate.value=doctoravailability.enddate
            textEndDate.classList.add("is-valid")
            textEndDate.disabled=true;


            if(doctoravailability.note!=null) {
                textNote.value = doctoravailability.note
                textNote.classList.add("is-valid")
            }else{
                textNote.value=""
            }

            textAvailDate.disabled=false;
            textAvailDate.min=textStartDate.value
            textAvailDate.min=textEndDate.value





            refreshinnerformandtable();




           let currentDate=new Date();
           let currentYear=currentDate.getFullYear();
           let currentMonth=currentDate.getMonth()+1;
           let currentDay=currentDate.getDate();

           if (currentMonth<10){
               currentMonth='0'+currentMonth
           }
            if (currentDay<10){
                currentDay='0'+currentDay
            }

            let todayDate=currentYear+'-'+currentMonth+'-'+currentDay
            console.log(todayDate)

            if (todayDate>textAvailDate.min){
                textAvailDate.min=todayDate;
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


    if (doctoravailability.note!=doctoravailabilityold.note) {
        updateForm=updateForm + "Note " +doctoravailabilityold.note+ " changed into " + doctoravailability.note +"<br>";
    }


    let newlyaddedavailabletimes=[]
    for (let element of doctoravailability.availableDateandTimeList){
        let extcount=doctoravailabilityold.availableDateandTimeList.map(item=>item.id).indexOf(element.id)
        if (extcount==-1){
            newlyaddedavailabletimes.push(element);
        }

    }

    if (newlyaddedavailabletimes.length>0){
        updateForm+="Added Date-times : <br>";
        updateForm+='<table style="border: 1px solid black"><tr><th style="border: 1px solid black">date</th><th style="border: 1px solid black">start time</th><th style="border: 1px solid black">end time</th><th style="border: 1px solid black">patient count</th></tr>';

        newlyaddedavailabletimes.forEach(element=>{
            updateForm+='<tr style="border: 1px solid black">'+
                '<td style="border: 1px solid black">'+element.availabledate+'</td>'+
                '<td style="border: 1px solid black">'+element.startingtime.slice(0,5)+'</td>'+
                '<td style="border: 1px solid black">'+element.endtime.slice(0,5)+'</td>'+
                '<td style="border: 1px solid black">'+element.noofpatients+'</td>'+
                '</tr>'


        })
        updateForm += '</table><br>';
    }

    let removeddatetime=[]
    for (let element of doctoravailabilityold.availableDateandTimeList){
        let extcount=doctoravailability.availableDateandTimeList.map(item=>item.id).indexOf(element.id)
        if (extcount==-1){

            removeddatetime.push(element);
        }

    }

    if (removeddatetime.length>0){
        updateForm+='Removed date-time record : '+"<br>";
        updateForm+='<table style="border: 1px solid black"><tr><th style="border: 1px solid black">date</th><th style="border: 1px solid black">start time</th><th style="border: 1px solid black">end time</th><th style="border: 1px solid black">patient count</th></tr>';

        removeddatetime.forEach(element=>{
            updateForm+='<tr style="border: 1px solid black">'+
                '<td style="border: 1px solid black">'+element.availabledate+'</td>'+
            '<td style="border: 1px solid black">'+element.startingtime.slice(0,5)+'</td>'+
            '<td style="border: 1px solid black">'+element.endtime.slice(0,5)+'</td>'+
            '<td style="border: 1px solid black">'+element.noofpatients+'</td>'+
                '</tr>'


        })
        updateForm += '</table><br>';
    }






    return updateForm;

}
//button update
const buttonDAvailUpdate=()=>{

    console.log(doctoravailability);
    // check form errors
    let formerrors=checkerror();

    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'



    if (formerrors==""){
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
                    let   ajaxUpdateResponse=ajaxRequestBody("/doctoravailability","PUT",doctoravailability);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Doctor Availability record updated successfully!",

                            icon: "success"
                        });
                      refreshDAvailTable()
                        refreshDAvailForm()
                        // hide the modal
                        $('a[href="#AvailTable"]').tab('show');
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
        div.innerHTML=formerrors
        Swal.fire({
            title: " Form has some errors!",
                  html:div,
            icon: "warning"
        });
    }

}





//supplier payment table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print Doctor Availability table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Doctor Availability table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Doctor Availability Table Details<h2>'+
                DAtable.outerHTML
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






const buttonDAvailClear=()=>{





    txtDoctor.value=''
    doctors=ajaxGetReq("/employee/getdoctorlist");
    fillDataIntoDataList(datalistitems,doctors,'fullname')
    txtDoctor.disabled=false
    txtDoctor.classList.add('is-invalid')
    txtDoctor.classList.remove('is-valid')

    textStartDate.value=''
    textStartDate.classList.remove('is-valid')

    textEndDate.value=''
    textEndDate.classList.remove('is-valid')

    textNote.value=''
    textNote.classList.remove('is-valid')

    doctoravailability.availableDateandTimeList=[]
    refreshinnerformandtable();


}



