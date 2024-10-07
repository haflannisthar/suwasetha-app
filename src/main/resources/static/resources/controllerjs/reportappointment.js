
//console.log("loaded");



let appChart = null;

// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)



    employeeList = ajaxGetReq("/employee/getdoctorlist")
    fillDataIntoSelect(selectDoctor,'Select Doctor',employeeList,'fullname')


  //refresh function for table and form
    appointmentListData=ajaxGetReq("/appointmentlistdata");
    refreshTable()


    appointmentListByDateCount=ajaxGetReq("/appointmentlistdateandecount");
    refreshChart();



    appointmentCOuntByDoctor=ajaxGetReq("/appointmentcountbydoctor");
    console.log(appointmentCOuntByDoctor)


    // set date for check date

    let maxDate= new Date()

    let minMonth =maxDate.getMonth()+1;

    if (minMonth<10){
        minMonth='0'+minMonth;
    }

    let minDay= maxDate.getDate();
    if (minDay < 10){
        minDay='0'+ minDay;
    }
    selectDate.max=maxDate.getFullYear() +"-"+ minMonth+"-"+minDay;
    selectDateForChart.max=maxDate.getFullYear() +"-"+ minMonth+"-"+minDay;

    let labelValue=''

    if (selectDateForChart.value==''){
        labelValue="Appointment Count By Doctor"
    }

    refreshMultiValueBarChart(appointmentCOuntByDoctor,labelValue);


    
})


const getLastDoctorAvailabilityDate=()=>{
    if (selectDoctor.value!==''){
        LastDoctorAvailabilityDate=ajaxGetReq("/lastdoctoravailabilitydate?doctor="+JSON.parse(selectDoctor.value).id);
        console.log(LastDoctorAvailabilityDate)

        let maxDate= new Date(LastDoctorAvailabilityDate)

        let minMonth =maxDate.getMonth()+1;

        if (minMonth<10){
            minMonth='0'+minMonth;
        }

        let minDay= maxDate.getDate();
        if (minDay < 10){
            minDay='0'+ minDay;
        }
        selectDate.max=maxDate.getFullYear() +"-"+ minMonth+"-"+minDay;

    }
}

const generatereports=()=>{


    if(selectDoctor.value!=='' && selectDate.value!==''){
        appointmentListData=ajaxGetReq("/appointmentfilteredlist?doctor="+JSON.parse(selectDoctor.value).id+"&date="+selectDate.value);
        refreshTable()
    }else{
        Swal.fire({
            html: 'Please Select the fields to generate report',
            icon: "warning",
            confirmButtonText: "Ok"
        })
    }


}

const getAppCountreportsByDate=()=>{

    if (selectDateForChart.value==''){
        Swal.fire({
            html: 'Please Select a date to generate report',
            icon: "warning",
            confirmButtonText: "Ok"
        })
    }else{
        appointmentCountByDocAndDate=ajaxGetReq("/appointmentcountbydate?date="+selectDateForChart.value);

        let labelValue=''

        if (selectDateForChart.value==''){
            labelValue="Appointment Count By Doctor"
        }else {
            labelValue="Appointment Count By Doctor for Date : "+selectDateForChart.value

        }


        refreshMultiValueBarChart(appointmentCountByDocAndDate,labelValue)
    }


}

//function to refresh table
const refreshTable=()=>{

  // console.log(employees);
   const displayProperty=[
       {property:'appno',datatype:'string'},
       {property:getPatientName,datatype:'function'},
    {property:getDoctorName,datatype:'function'},
    {property:getChannellingDate,datatype:'function'},
    {property:getAppointmentStatus ,datatype:'function'}
  ]

  //fillDataIntoTable function call
  fillDataIntoTable(reporttableappointment,appointmentListData,displayProperty,refilForm,deleteData,printData,false,userPrivilege);

}

const refreshChart=()=>{
    let dates=appointmentListByDateCount.map(element=>element[0]);
    let appointmentCount=appointmentListByDateCount.map(element=>element[1]);

    let appointmentBarChart=document.getElementById('appointmentsCountChart').getContext('2d')

    totalCountChart=new Chart(appointmentBarChart,{
        type:'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Appointments Count',
                data: appointmentCount,
                borderColor: 'rgba(52,115,200,1)',
                backgroundColor: 'rgba(52,115,200,0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    })
}



const refreshMultiValueBarChart=(array,labelname)=>{


    let doctorname=array.map(element=>element[0]);
    let appointmentCount=array.map(element=>element[1]);

    let appointmentsCountByDateChart=document.getElementById('appointmentsCountByDateChart').getContext('2d')


    if (appChart){
        appChart.destroy();
    }


     appChart=new Chart(appointmentsCountByDateChart,{
        type:'bar',
        data: {
            labels: doctorname,
            datasets: [{
                label: labelname,
                data: appointmentCount,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}



//get emp status
const getAppointmentStatus=(rowOb)=>{

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

const getPatientName=(rowOb)=>{
   return  rowOb.patient_id.firstname+" "+rowOb.patient_id.lastname
}

const getDoctorName=(rowOb)=>{
      return rowOb.employee_id.fullname
}

const getChannellingDate=(rowOb)=>{
     return rowOb.channellingdate
}


const deleteData=(rowOb,rowind)=>{}



    //edit function
const refilForm=(rowOb,rowind)=>{}

const printData=(rowOb,rowind)=>{}

  //employee table print function

  const printCompleteTable=()=>{
      Swal.fire({
          title: "Are you sure to print  table?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              const newTab=window.open()
              newTab.document.write(
                  '<head><title> table Print</title>'+
                  ' <script src="../resources/jQuery/jquery.js"></script>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.btn-display { display: none; }</style>'+'</head>'+
                  '<h2  class="Text-center">Employee Table Details<h2>'+
                  reporttableappointment.outerHTML
                  // '<script>$(".btn-display").css("display","none")</script>'+
                  // '<script>$(".btn-display").hide("display","none")</script>'
              )
              setTimeout(
                  function() {
                      newTab.print()
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

  const printCompleteChart=()=>{

      chartPrintAppTotal.src=totalCountChart.toBase64Image();
      chartPrintByDoctor.src=appChart.toBase64Image();
      let newWindow=window.open();




       newWindow.document.write(
               '<head><title>Appointment Chart Print</title>'+
               '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
           '<style>.row{display: flex}</style>'+
               '</head>'+
           '<h3  class="Text-center" >Appointment Count For Last Week<h3>'+
           '<div class="row"><div class="col-3"></div><div class="col-6">'+
               chartPrintAppTotal.outerHTML+'</div><div class="col-3"></div></div>'+
           '<h3  class="Text-center mt-4" >Appointment Count By Doctor<h3>'+
           '<div class="row"><div class="col-3"></div><div class="col-6">'+
           chartPrintByDoctor.outerHTML+'</div><div class="col-3"></div></div>'
       );

       setTimeout(
          function() {
              newWindow.print()

          },2000
      )



  }
