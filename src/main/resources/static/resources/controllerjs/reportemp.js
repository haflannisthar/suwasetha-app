
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)



    designations=ajaxGetReq("/designation/findall")
    fillDataIntoSelect(selectDesignation,'Select Designation',designations,'name');

    employeeStatus = ajaxGetReq("/employeestatus/findall")
    fillDataIntoSelect(selectEmployeeStatus,'Select Employee Status',employeeStatus,'name')

  //refresh function for table and form
    employees=ajaxGetReq("/wokingemployeelist");
    refreshEmpTable()




    
})

const generatereports=()=>{

if (selectEmployeeStatus.value!='' && selectDesignation.value!=''){
    employees=ajaxGetReq("/employeelistdata?status="+JSON.parse(selectEmployeeStatus.value).id+"&designation="+JSON.parse(selectDesignation.value).id);
    refreshEmpTable()
}else{
    Swal.fire({
        html: 'Please Select the fields to generate report',
        icon: "warning",
        confirmButtonText: "Ok"
    })
}



}

//function to refresh table
const refreshEmpTable=()=>{

  // console.log(employees);
   const displayProperty=[
    {property:'empnumber',datatype:'string'},
    {property:'fullname',datatype:'string'},
    {property:'emp_photo',datatype:'photoarray'},
    {property:'mobile',datatype:'string'},
    {property:'email',datatype:'string'},
    {property:getEmployeeStatus ,datatype:'function'}
  ]

  //fillDataIntoTable function call
  //fillDataIntoTable(tableId,datalist,propertylist,refill employee,delete employee,print employee,privilegeob)
  fillDataIntoTable(reporttableemployee,employees,displayProperty,refilEmployeeForm,deleteEmployee,printEmployee,false,userPrivilege);

}




//get emp status
const getEmployeeStatus=(rowOb)=>{

  if (rowOb.employeestatus_id.name=='Working') {
    return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.employeestatus_id.name+'</span></p>'
  }
  if (rowOb.employeestatus_id.name=='Resigned') {
    return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.employeestatus_id.name+'</span></p>'
  }

  if (rowOb.employeestatus_id.name=='Deleted') {
    return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.employeestatus_id.name+'</span></p>'
  }


}



const deleteEmployee=(rowOb,rowind)=>{}



    //edit function
const refilEmployeeForm=(rowOb,rowind)=>{}

const printEmployee=(rowOb,rowind)=>{}

  //employee table print function

  const printCompleteEmpTable=()=>{
      Swal.fire({
          title: "Are you sure to print employee table?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              const newTab=window.open()
              newTab.document.write(
                  '<head><title>Employee table Print</title>'+
                  ' <script src="../resources/jQuery/jquery.js"></script>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.btn-display { display: none; }</style>'+'</head>'+
                  '<h2  class="Text-center">Employee Table Details<h2>'+
                  reporttableemployee.outerHTML
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

