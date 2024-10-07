
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{
    // userPrivilege=ajaxGetReq("/privilege/loggedusermodule/Employee")


    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Employee");
    console.log(userPrivilege)
  //refresh function for table and form
    refreshEmpTable()
    refreshEmpForm();



    
})
//function to refresh table
const refreshEmpTable=()=>{


  employees=ajaxGetReq("/employee/findall");


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
  fillDataIntoTable(tableemployee,employees,displayProperty,refilEmployeeForm,deleteEmployee,printEmployee,true,userPrivilege);

    disablebtnfordeletedstatus();
  $('#tableemployee').dataTable();




}



//function to refresh form
const refreshEmpForm=()=>{

    employeeTitle.innerHTML='New Employee Enrollment'
    employeerefreshbtn.style.visibility = 'visible'



    //create empty object
  employee={};





  //get data for select element

  designations=ajaxGetReq("/designation/findall")
   fillDataIntoSelect(selectDesignation,'Select Designation',designations,'name');

     employeeStatus = ajaxGetReq("/employeestatus/findall")
    fillDataIntoSelect(selectEmployeeStatus,'Select Emp-Status',employeeStatus,'name')


    textChannellingCharge.disabled=true

    //empty all elements

    textfullname.value=''
    textNic.value=''
    textCallingName.value=''
    textMobileNumber.value=''
    textDateOfBirth.value=''
    textEmail.value=''
    textGender.value=''
    textChannellingCharge.value=''
    selectCivilStatus.value=''
    selectEmployeeStatus.value=''
    textAddress.value=''
    textLandNumber.value=''
    textNote.value=''
    selectDesignation.value=''




  


  
  // Date object
  const date=new Date();

  let currentDay=String(date.getDate()).padStart(2,'0')
  //let upComingDay=String(date.getDate()+10).padStart(2,'0')

  let currentMonth=String(date.getMonth()+1).padStart(2,'0')
  let minYear=(date.getFullYear()-18)
  let maxYear=(date.getFullYear()-60)
  console.log(minYear);

  
  let maxday=`${maxYear}-${currentMonth}-${currentDay}`;
  // console.log(today);
  let minday=`${minYear}-${currentMonth}-${currentDay}`;
  // console.log(upCome);

  textDateOfBirth.min=maxday
  textDateOfBirth.max=minday


  

  //set to default color by removing valid and invalid color
  textfullname.classList.remove('is-valid')
  textNic.classList.remove('is-valid')
  textCallingName.classList.remove('is-valid')
  textMobileNumber.classList.remove('is-valid')
  textDateOfBirth.classList.remove('is-valid')
  selectCivilStatus.classList.remove('is-valid')
   selectEmployeeStatus.classList.remove('is-valid')
  selectDesignation.classList.remove('is-valid')
  textAddress.classList.remove('is-valid')
  textEmail.classList.remove('is-valid')
    textLandNumber.classList.remove('is-valid')
    textGender.classList.remove('is-valid')
    textNote.classList.remove('is-valid')

    // textChannellingCharge.remove('is-valid')
    // textChannellingCharge.remove('is-invalid')


    textfullname.classList.remove('is-invalid')
    textNic.classList.remove('is-invalid')
    textCallingName.classList.remove('is-invalid')
    textMobileNumber.classList.remove('is-invalid')
    textDateOfBirth.classList.remove('is-invalid')
    selectCivilStatus.classList.remove('is-invalid')
    selectEmployeeStatus.classList.remove('is-invalid')
    selectDesignation.classList.remove('is-invalid')
    textAddress.classList.remove('is-invalid')
    textEmail.classList.remove('is-invalid')
    textLandNumber.classList.remove('is-invalid')
    textGender.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')


    // image refresh

    employee.emp_photo=null;
    imgEmpPreview.src='/resources/images/user2.jpg'
    txtEmpPhoto.value=''
    fileEmpPhoto.files=null

    // disable update button when form load
    btnUpdateEmp.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdateEmp").css("cursor","not-allowed")



    if (userPrivilege.insert){
        btnAddEmp.disabled=""
        btnAddEmp.style.cursor="pointer"
    }
     else {
        btnAddEmp.disabled="disabled"
        btnAddEmp.style.cursor="not-allowed"
     }


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

// delete button disablefor deleted status
const  disablebtnfordeletedstatus=()=>{
    const tableEmployee = document.getElementById("tableemployee");
    const tableRows = tableEmployee.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(7) p"); //  selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(8)"); //  selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");

            if (statusValue === "Deleted" ) {
                if(userPrivilege.delete){
                    deleteButton.disabled = true;

                    deleteButton.style.display = "none";
                }



            }
        }


    });
}

// get user confirmation befor form refresh
const  refreshEmployeeFormByuserConfirm=()=>{
    Swal.fire({

        title: "Are you sure to refresh the form",
        text:'Entered data will be cleared',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshEmpForm();
        }
    });
}

const deleteEmployee=(rowOb,rowind)=>{



    empinfor=`Emp Number ${rowOb.empnumber}<br>
                  Employee Name : ${rowOb.fullname}`

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.innerHTML=empinfor

     Swal.fire({
        title: "Are you sure to delete following employee?",
       html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
         if (result.isConfirmed) {
             let  serverRespnse=ajaxRequestBody("/employee","DELETE",rowOb)
             if (serverRespnse=="OK") {


                 Swal.fire({
                     title: "Employee Deleted Successfully!",

                     icon: "success"
                 });
                 refreshEmpTable()




             } else {

                 Swal.fire("Something went wrong", serverRespnse, "info");
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



    //edit function
    const refilEmployeeForm=(rowOb,rowind)=>{

        employeeTitle.innerHTML='Employee Update'


        employee=JSON.parse(JSON.stringify(rowOb))
        console.log("nw" +employee)
        employeeold=JSON.parse(JSON.stringify(rowOb))


        empinfor=`Emp Number ${rowOb.empnumber}<br>
                  Employee Name : ${rowOb.fullname}`

        let div=document.createElement('div');
        div.style.textAlign='left'
        div.style.marginLeft='50px'
        div.innerHTML=empinfor


        Swal.fire({
            title: "are you sure edit following employee?",
           html:div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                $('a[href="#EmployeeForm"]').tab('show');


                // disable add button and enable update button

                if (userPrivilege.update){
                    btnUpdateEmp.disabled=""
                    btnUpdateEmp.style.cursor="pointer"
                }
                else {
                    btnUpdateEmp.disabled="disabled"
                    btnUpdateEmp.style.cursor="not-allowed"
                }


                btnAddEmp.disabled="disabled"
                btnAddEmp.style.cursor="not-allowed"

                employee=rowOb;
                // console.log(employee);


                textfullname.classList.remove('is-invalid')
                textNic.classList.remove('is-invalid')
                textCallingName.classList.remove('is-invalid')
                textMobileNumber.classList.remove('is-invalid')
                textDateOfBirth.classList.remove('is-invalid')
                selectCivilStatus.classList.remove('is-invalid')
                selectEmployeeStatus.classList.remove('is-invalid')
                selectDesignation.classList.remove('is-invalid')
                textAddress.classList.remove('is-invalid')
                textEmail.classList.remove('is-invalid')
                textLandNumber.classList.remove('is-invalid')
                textGender.classList.remove('is-invalid')
                textNote.classList.remove('is-invalid')


                employeerefreshbtn.style.visibility = 'visible'



                textfullname.value=employee.fullname
                textfullname.classList.add("is-valid")
                textCallingName.value=employee.callingname
                textCallingName.classList.add("is-valid")
                textNic.value=employee.nic
                textNic.classList.add("is-valid")
                textDateOfBirth.value=employee.dateofbirth
                textDateOfBirth.classList.add("is-valid")
                textMobileNumber.value=employee.mobile
                textMobileNumber.classList.add("is-valid")
                textEmail.value=employee.email
                textEmail.classList.add("is-valid")
                textAddress.value=employee.address
                textAddress.classList.add("is-valid")
                selectCivilStatus.value=employee.civilstatus
                selectCivilStatus.classList.add("is-valid")

                textGender.value=employee.gender
                textGender.classList.add("is-valid")



                if (employee.landno != null){
                    textLandNumber.value=employee.landno
                    textLandNumber.classList.add("is-valid")
                }
                else{
                    textLandNumber.value=""
                }

                if (employee.note != null){
                    textNote.value=employee.note
                    textNote.classList.add("is-valid")
                }
                else{
                    textNote.value=""
                }

                // refill image
                if (employee.emp_photo==null){
                    imgEmpPreview.src='/resources/images/user2.jpg'
                    txtEmpPhoto.value='';

                }else {
                    imgEmpPreview.src=atob(employee.emp_photo);
                    txtEmpPhoto.value=employee.emp_photo_name;
                }





                fillDataIntoSelect(selectEmployeeStatus,'select employee status',employeeStatus,'name',employee.employeestatus_id.name)
              selectEmployeeStatus.classList.add("is-valid")
                fillDataIntoSelect(selectDesignation,'select designation',designations,'name',employee.designation_id.name);
             selectDesignation.classList.add("is-valid")
                console.log(employee.designation_id.name=='Doctor')
                if (employee.designation_id.name=='Doctor'){
                    textChannellingCharge.disabled=false
                    if (employee.channellingcharge!=null){
                        textChannellingCharge.classList.add("is-valid")
                        textChannellingCharge.value=employee.channellingcharge
                    }


                }else{
                    textChannellingCharge.disabled=true

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
//       define method to check update
const  checkEmployeeUpdate=()=>{
    let updateForm='';

    if (employee.fullname!=employeeold.fullname) {
      updateForm=updateForm + "Fullname " +employeeold.fullname+ " changed into " + employee.fullname +"<br>";
    }
    if (employee.callingname!=employeeold.callingname) {
      updateForm=updateForm + "calling name " +employeeold.callingname+ " changed into " + employee.callingname +"<br>";
    }
    if (employee.dateofbirth!=employeeold.dateofbirth) {
        updateForm=updateForm + "date of birth " +employeeold.dateofbirth+ " changed into " + employee.dateofbirth+"<br>";
    }
    if (employee.nic!=employeeold.nic) {
      updateForm=updateForm + "nic " +employeeold.nic+ " changed into " + employee.nic+"<br>";
    }
    if (employee.gender!=employeeold.gender) {
      updateForm=updateForm + "gender " +employeeold.gender+ " changed into " + employee.gender+"<br>";
    }


    if (employee.mobile!=employeeold.mobile) {
      updateForm=updateForm + "mobile " +employeeold.mobile+ " changed into " + employee.mobile+"<br>";
    }
    if (employee.emp_photo!=employeeold.emp_photo) {
        updateForm=updateForm + "Employee photo changed <br>";
    }
    if (employee.landno!=employeeold.landno) {
      updateForm=updateForm + "land no " +employeeold.landno+ " changed into " + employee.landno+"<br>";
    }
    if (employee.email!=employeeold.email) {
      updateForm=updateForm + "email " +employeeold.email+ " changed into " + employee.email+"<br>";
    }
    if (employee.address!=employeeold.address) {
      updateForm=updateForm + "address " +employeeold.address+ " changed into " + employee.address+"<br>";
    }
    if (employee.note!=employeeold.note) {
        updateForm=updateForm + "note " +employeeold.note+ " changed into " + employee.note+"<br>";
    }
    if (employee.designation_id.name!=employeeold.designation_id.name) {
      updateForm=updateForm + "designation " +employeeold.designation_id.name+ " changed into " + employee.designation_id.name+"<br>";
    }
    if (employee.civilstatus!=employeeold.civilstatus) {
      updateForm=updateForm + "civil status " +employeeold.civilstatus+ " changed into " + employee.civilstatus+"<br>";
    }
    if (employee.employeestatus_id.name!=employeeold.employeestatus_id.name) {
      updateForm=updateForm + "employee status " +employeeold.employeestatus_id.name+ " changed into " + employee.employeestatus_id.name+"<br>";
    }
    if (employee.designation_id.name=='Doctor') {
        if (employee.channellingcharge!=employeeold.channellingcharge) {
            updateForm=updateForm + "Doctor Channelling Charge " +employeeold.channellingcharge+ " changed into " + employee.channellingcharge+"<br>";
        }
    }



    return updateForm;
}

//define update function
      const buttonEmployeeUpdate=()=>{
      // check form errors
          let formerrors=checkError();

          if (formerrors==""){
              //form update
              let newUpdate=checkEmployeeUpdate();

              let div=document.createElement('div');

              div.style.textAlign='left'
              div.style.marginLeft='50px'
              div.style.fontSize='18px'
              if (newUpdate != ""){
                  div.innerHTML=newUpdate;
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
                          let   ajaxUpdateResponse=ajaxRequestBody("/employee","PUT",employee);
                          if (ajaxUpdateResponse=="OK"){
                              Swal.fire({
                                  title: " Employee record updated successfully!",

                                  icon: "success"
                              });
                              //need to refresh table and form
                              refreshEmpTable();
                              refreshEmpForm();
                              // hide the modal
                              $('a[href="#EmployeeTable"]').tab('show');
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
              let div=document.createElement('div');

              div.style.textAlign='left'
              div.style.marginLeft='50px'
              div.innerHTML=formerrors;
              Swal.fire({
                  title: "Form has following errors",
                  html:div,
                  icon: "warning"
              });
          }

      }


  const generateCallingNameValues=()=>{
    const callingName=document.querySelector('#callingname')
    callingName.innerHTML=''

     callingNamePartList=textfullname.value.split(' ')
    //console.log(callingNamePartList);


    callingNamePartList.forEach(element => {
      const option=document.createElement('option')
      option.value=element
      // console.log(option);
      callingName.appendChild(option)
    });
  }

//create function for validator

const textCallingNameValidator=(field)=>{
        const callingName=field.value;
        let cllName=false;


        for (let element of callingNamePartList) {
          if(element==callingName){
            //console.log('true');
            cllName=true
            break;
          }
        }

        if (cllName) {
          //valid
          field.classList.add('is-valid')
          field.classList.remove('is-invalid')
          employee.callingname=callingName
          console.log('true');
        }
        else{
          field.classList.add('is-invalid')
          field.classList.remove('is-valid')
          employee.callingname=null
          console.log('false');
        }


        // if (callingName=='') {
        //   field.classList.add('is-invalid')
        //   field.classList.remove('is-valid')
        // }
};



  // enable channelling fee field for doctor
const enableChannellingFeeField=()=>{
    if (JSON.parse(selectDesignation.value).name=='Doctor'){



        textChannellingCharge.disabled=false;

        textChannellingCharge.classList.remove('is-valid')
        textChannellingCharge.classList.remove('is-invalid')
    }else{
        textChannellingCharge.disabled=true;
        textChannellingCharge.classList.remove('is-valid')
        textChannellingCharge.classList.remove('is-invalid')

    }
}


  //error checking
  const checkError=()=>{
    let errors=''


      if (employee.fullname == null || textfullname.value=='') {
        errors =errors + "Please enter full name<br>"
        textfullname.classList.add('is-invalid')
    }

      if (employee.callingname == null || textCallingName.value=='') {

        
      errors =errors + "Please select calling name<br>"
        textCallingName.classList.add('is-invalid')
    }

      if (employee.nic == null || textNic.value=='') {
 
        errors =errors + "Please enter nic<br>"
        textNic.classList.add('is-invalid')
    }

      if (employee.dateofbirth == null || textDateOfBirth.value=='') {

        errors =errors + "Please enter date of  birth<br>"
        textDateOfBirth.classList.add('is-invalid')
    }

    if (employee.email == null || textEmail.value=='') {

      errors =errors + "Please enter Email<br>"
      textEmail.classList.add('is-invalid')
  }


      if (employee.mobile == null || textMobileNumber.value=='') {

        errors =errors + "Please enter mobile no<br>"
        textMobileNumber.classList.add('is-invalid')
    }

      if(employee.gender ==null || textGender.value==''){
          errors =errors + "Please select gender <br>"
          textGender.classList.add('is-invalid')
      }
      if(employee.address ==null || textAddress.value==''){
          errors =errors + "Please enter address<br>"
          textAddress.classList.add('is-invalid')
      }
      if(employee.designation_id ==null && selectDesignation.value==''){
          errors =errors + "Please select designation <br>"
          selectDesignation.classList.add('is-invalid')
      }
      if(employee.civilstatus ==null || selectCivilStatus.value==''){
          errors =errors + "Please select civil status <br>"
          selectCivilStatus.classList.add('is-invalid')
      }
      if(employee.employeestatus_id ==null || selectEmployeeStatus.value==''){
          errors =errors + "Please select employee status <br>"
          selectEmployeeStatus.classList.add('is-invalid')
      }
         if ( employee.designation_id !=null &&   employee.designation_id.name=='Doctor'){
             if (employee.channellingcharge==null || textChannellingCharge.value==''){
                 errors =errors + "Please enter Channelling Fee <br>"
                 textChannellingCharge.classList.add('is-invalid')
             }
         }



      return errors;

}



//function for add button
  const buttonEmployeeAdd=()=>{
      console.log(employee)
// need to check for all required fields
  let fromerror=checkError()

  //check for errors
  if (fromerror=='') {



      let employeeInfo = `Fullname: ${employee.fullname}<br>
                 Callingname: ${employee.callingname}<br>
                  Date of birth: ${employee.dateofbirth}<br>
                  Nic: ${employee.nic}<br>
                 Gender: ${employee.gender}<br>
                
                 Mobile number: ${employee.mobile}<br>
                
      Email: ${employee.email}<br>
   Addree: ${employee.address}<br>
Designation: ${employee.designation_id.name}<br>
Civil status: ${employee.civilstatus}<br>
Employee status: ${employee.employeestatus_id.name}`;

      if (employee.landno != null) {
          employeeInfo += `<br>Landline number: ${employee.landno}`;
      }
      if (employee.designation_id.name=='Doctor') {
          employeeInfo += `<br>Channelling Charge: ${employee.channellingcharge}`;
      }


      let div=document.createElement('div');

      div.style.textAlign='left'
      div.style.marginLeft='50px'
      div.innerHTML=employeeInfo;


      //user confirmation
      Swal.fire({
          title: "Are you sure to add the following employee record?",
        // html: employeeInfo,
          html:div ,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              let serverResponse=ajaxRequestBody("/employee","POST",employee);
              if (serverResponse=="OK") {
                  Swal.fire({
                      title: "Employee record Added Successfully!",
                      text: "",
                      icon: "success"
                  });
                  //need to refresh table and form
                  refreshEmpTable();
                  refreshEmpForm();


                  //need to hide the modal
                  $('a[href="#EmployeeTable"]').tab('show');

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

      let diverr=document.createElement('div');
      diverr.innerHTML=fromerror;
      diverr.style.textAlign='left'
      diverr.style.marginLeft='50px'

      Swal.fire({
          icon: "error",
          title: "Form has following errors",
          html:diverr,


      });

  }



  }

//print function
const printEmployee=(rowOb,rowind)=>{


    const empPrint=rowOb;


    tdEmpNumber.innerHTML=empPrint.empnumber
    tdFullname.innerHTML=empPrint.fullname
    tdCallingName.innerHTML=empPrint.callingname
    tdNic.innerHTML=empPrint.nic
    tdEmail.innerHTML=empPrint.email
    tdMobile.innerHTML=empPrint.mobile
    if (empPrint.landno==null){
        tdLandNumber.innerHTML="null"
    }
    else{
        tdLandNumber.innerHTML=empPrint.landno
    }
    tdAddress.innerHTML=empPrint.address
    tdGender.innerHTML=empPrint.gender
    tdCivilStatus.innerHTML=empPrint.civilstatus
    tdDob.innerHTML=empPrint.dateofbirth
    tdEmployeeStatus.innerHTML=empPrint.employeestatus_id.name
    tdDesignation.innerHTML=empPrint.designation_id.name
    if (empPrint.note!=null){
        tdNote.innerHTML=empPrint.note
    }else {
        tdNote.innerHTML="null"
    }

    console.log(empPrint.note)



    let employeePrintInfo = `Employee Number : ${empPrint.empnumber}<br>
                 Fullname :  ${empPrint.fullname}`

    let div=document.createElement('div');
    div.innerHTML=employeePrintInfo;
    div.style.textAlign='left'
    div.style.marginLeft='50px'


    Swal.fire({
        title: "are you sure Print following employee?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printEmployeeDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })





// option 2

// $('#modalPrintEmployee').modal('show');

}

const printEmployeeDetails=()=>{

    const newTab=window.open()  
  newTab.document.write(
    '<head><title>Employee Print</title>'+
    '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
      '<style>p{font-size: 15px} </style>'+
          printEmployeeTable.outerHTML
   
    
  )
  setTimeout(
    function() {
      newTab.print()
    },1000
  )
  }






  
  //employee table print function

  const printCompleteTable=()=>{
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
                  tableemployee.outerHTML
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


  //function to clear button
const buttonEmployeeClear=()=>{
    textfullname.value=''
    textfullname.classList.add('is-invalid')
    textfullname.classList.remove('is-valid')


    textCallingName.value=''
    textCallingName.classList.add('is-invalid')
    textCallingName.classList.remove('is-valid')

    textNic.value=''
    textNic.classList.add('is-invalid')
    textNic.classList.remove('is-valid')




    textMobileNumber.classList.add('is-invalid')
    textMobileNumber.classList.remove('is-valid')
    textMobileNumber.value=''

    textDateOfBirth.classList.add('is-invalid')
    textDateOfBirth.classList.remove('is-valid')
    textDateOfBirth.value=''

    selectCivilStatus.classList.add('is-invalid')
    selectCivilStatus.classList.remove('is-valid')
    selectCivilStatus.value=''

    selectEmployeeStatus.classList.add('is-invalid')
    selectEmployeeStatus.classList.remove('is-valid')
    selectEmployeeStatus.value=''

    selectDesignation.classList.add('is-invalid')
    selectDesignation.classList.remove('is-valid')
    selectDesignation.value=''

    textAddress.classList.add('is-invalid')
    textAddress.classList.remove('is-valid')
    textAddress.value=''

    textEmail.classList.add('is-invalid')
    textEmail.classList.remove('is-valid')
    textEmail.value=''


    textLandNumber.classList.remove('is-valid')
    textLandNumber.value=''

    textGender.classList.add('is-invalid')
    textGender.classList.remove('is-valid')
    textGender.value=''

    textChannellingCharge.classList.add('is-invalid')
    textChannellingCharge.classList.remove('is-valid')
    textChannellingCharge.value=''





    textNote.classList.remove('is-valid')
    textNote.value=''


    // image refresh
    employee.emp_photo=null;
    imgEmpPreview.src='/resources/images/user2.jpg'
    txtEmpPhoto.value=''
    fileEmpPhoto.files=null




}

const btnClearImage=()=>{
      employee.emp_photo=null;
    imgEmpPreview.src='/resources/images/user2.jpg'
    txtEmpPhoto.value=''
    fileEmpPhoto.files=null
}

