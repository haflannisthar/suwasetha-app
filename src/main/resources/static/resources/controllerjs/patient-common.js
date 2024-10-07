window.addEventListener('load',()=>{



     PatientPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Patient");
     console.log(PatientPrivilege)
    //refresh function for table and form
    refreshPatientTable()
    refreshPatientForm();




})
//function to refresh table
const refreshPatientTable=()=>{
    patientStatus=ajaxGetReq("/patient/findall");

    const displayProperty=[
             {property:'regno',datatype:'string'},
          {property:'title',datatype:'string'},
          {property:'firstname',datatype:'string'},
          {property:'lastname',datatype:'string'},
          {property:'contactno',datatype:'string'},

    ]
    fillDataIntoTable(tablePatient,patientStatus,displayProperty,refillPatientForm,deletePatient,printPatient,true,PatientPrivilege);
    disableBtnForPatientRecord();
    $('#tablePatient').dataTable();



}



// delete button disable in-active status
const  disableBtnForPatientRecord=()=>{
    const tablePatient = document.getElementById("tablePatient");
    const tableRows = tablePatient.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {

            const actionCell = row.querySelector("td:nth-child(7)");
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");

            if (PatientPrivilege.delete){

                    deleteButton.disabled = true;

                    deleteButton.style.display = "none";



        }


    });
}


//re fresh patient form
const refreshPatientForm=()=>{

    patientTitle.innerHTML='New Patient Enrollment'
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



    // disable update button when form load
    btnUpdatePat.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdatePat").css("cursor","not-allowed")


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

// delete function for patient delete
const  deletePatient=(rowOb)=>{

    let PatientInfo = `Patient Reg Number: ${rowOb.regno}<br>
                 Full Name: ${rowOb.firstname} ${rowOb.lastname}<br>`

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=PatientInfo
    Swal.fire({
        title: "Are you sure to delete following patient?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            let  serverResponse=ajaxRequestBody("/patient","DELETE",rowOb)
            if (serverResponse=="OK") {


                Swal.fire({
                    title: "Patient Deleted Successfully!",

                    icon: "success"
                });
                refreshPatientTable()




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
const  printPatient=(rowOb)=>{

    const patientPrint=rowOb;

    tdPatNumber.innerHTML=patientPrint.regno
    if (patientPrint.note==null){
        tdNote.innerHTML="-"
    }
    else {
        tdNote.innerHTML=patientPrint.note
    }

    if (patientPrint.emergencycontactno==null){
        tdEcNumber.innerHTML="-"
    }
    else {
        tdEcNumber.innerHTML=patientPrint.emergencycontactno
    }

    if (patientPrint.emergencycontactname==null){
        tdEcName.innerHTML="-"
    }
    else {
        tdEcName.innerHTML=patientPrint.emergencycontactname
    }


    tdMobile.innerHTML=patientPrint.contactno
    tdGender.innerHTML=patientPrint.gender



    tdDob.innerHTML=patientPrint.dateofbirth
    tdLastName.innerHTML=patientPrint.lastname
    tdFirstName.innerHTML=patientPrint.firstname
    tdTitle.innerHTML=patientPrint.title

    let patientPrintInfo = `Patient Number : ${patientPrint.regno}<br>
                 Fullname :  ${patientPrint.firstname} ${patientPrint.lastname}`

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=patientPrintInfo
    Swal.fire({
        title: "are you sure Print following patient?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printPatientDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })


}
// function to print patient details
const printPatientDetails=()=>{
    const newTab=window.open()
    newTab.document.write(
        '<head><title>Patient Print</title>'+
        '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
        '<style>p{font-size: 15px} </style>'+
        printPatientTable.outerHTML


    )
    setTimeout(
        function() {
            newTab.print()
        },1000
    )
}




// check form error
const  checkError=()=>{
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
    let error=checkError();

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
                    refreshPatientTable()
                    refreshPatientForm()
                    $('a[href="#PatientTable"]').tab('show');

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

const refillPatientForm=(rowOb)=>{

    patientTitle.innerHTML='Patient Update'

 patient=JSON.parse(JSON.stringify(rowOb))
    patientold=JSON.parse(JSON.stringify(rowOb))



    let refillPatientInfor=`Patient Name : ${rowOb.firstname} ${rowOb.lastname}<br>
                                    Reg Number : ${rowOb.regno} `

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=refillPatientInfor
    Swal.fire({
        title: "Are you sure to edit the following patient?",
        html: div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            $('a[href="#PatientForm"]').tab('show');





            // disable add button and enable update button

            if (PatientPrivilege.update){
                btnUpdatePat.disabled=""
                btnUpdatePat.style.cursor="pointer"
            }
            else {
                btnUpdatePat.disabled="disabled"
                btnUpdatePat.style.cursor="not-allowed"
            }


            btnAddPat.disabled="disabled"
            btnAddPat.style.cursor="not-allowed"


            patient=rowOb
            console.log(patient)


            selectTitle.classList.remove('is-invalid')
            textFirstName.classList.remove('is-invalid')
            textLastName.classList.remove('is-invalid')
            textDateOfBirth.classList.remove('is-invalid')
            selectGender.classList.remove('is-invalid')
            textContactNumber.classList.remove('is-invalid')
            textNote.classList.remove('is-invalid')
            textEmergencyName.classList.remove('is-invalid')
            textEmergencyContactNo.classList.remove('is-invalid')

            // refill inform
            selectTitle.value=patient.title
            selectTitle.classList.add("is-valid")
            textFirstName.value=patient.firstname
            textFirstName.classList.add("is-valid")
            textLastName.value=patient.lastname
            textLastName.classList.add("is-valid")
            textDateOfBirth.value=patient.dateofbirth
            textDateOfBirth.classList.add("is-valid")


            selectGender.value=patient.gender
            selectGender.classList.add("is-valid")

            textContactNumber.value=patient.contactno
            textContactNumber.classList.add("is-valid")


            if(patient.note!=null) {
                textNote.value = patient.note
                textNote.classList.add("is-valid")
            }else{
                textNote.value=""
            }

            if(patient.emergencycontactname!=null) {
                textEmergencyName.value=patient.emergencycontactname
                textEmergencyName.classList.add("is-valid")
            }

            if(patient.emergencycontactno!=null) {

                textEmergencyContactNo.value=patient.emergencycontactno
                textEmergencyContactNo.classList.add("is-valid")
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

    if (patient.title!=patientold.title) {
        updateForm=updateForm + "Title " +patientold.title+ " changed into " + patient.title +"<br>";
    }

    if (patient.firstname!=patientold.firstname) {
        updateForm=updateForm + "Firstname " +patientold.firstname+ " changed into " + patient.firstname +"<br>";
    }
    if (patient.lastname!=patientold.lastname) {
        updateForm=updateForm + "Lastname " +patientold.lastname+ " changed into " + patient.lastname +"<br>";
    }
    if (patient.dateofbirth!=patientold.dateofbirth) {
        updateForm=updateForm + "Date of birth " +patientold.dateofbirth+ " changed into " + patient.dateofbirth+"<br>";
    }

    if (patient.gender!=patientold.gender) {
        updateForm=updateForm + "Gender " +patientold.gender+ " changed into " + patient.gender+"<br>";
    }
    if (patient.contactno!=patientold.contactno) {
        updateForm=updateForm + "Contact number " +patientold.contactno+ " changed into " + patientold.contactno+"<br>";
    }

    if (patient.note!=patientold.note) {
        updateForm=updateForm + "Note " +patientold.note+ " changed into " + patient.note+"<br>";
    }

    if (patient.emergencycontactname!=patientold.emergencycontactname) {
        updateForm=updateForm + " Emergency contact person name " +patientold.emergencycontactname+ " changed into " + patient.emergencycontactname+"<br>";
    }


    if (patient.emergencycontactno!=patientold.emergencycontactno) {
        updateForm=updateForm + "Emergency contact number  " +patientold.emergencycontactno+ " changed into " + patient.emergencycontactno+"<br>";
    }

    return updateForm;
}
//button update
const buttonPatientUpdate=()=>{

    console.log(patient);
    // check form errors
    let formErrors=checkError();

    let div=document.createElement('div');
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'


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
                    let   ajaxUpdateResponse=ajaxRequestBody("/patient","PUT",patient);
                    if (ajaxUpdateResponse=="OK"){
                        Swal.fire({
                            title: " Patient record updated successfully!",

                            icon: "success"
                        });
                      refreshPatientTable()
                        refreshPatientForm()
                        // hide the modal
                        $('a[href="#PatientTable"]').tab('show');
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
            title: " Form has Following Errors!",
                  html:div,
            icon: "warning"
        });
    }

}





//employee table print function
const printCompleteTable=()=>{
    Swal.fire({
        title: "Are you sure to print patient table?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            const newTab=window.open()
            newTab.document.write(
                '<head><title>Patient table Print</title>'+
                ' <script src="../resources/jQuery/jquery.js"></script>'+
                '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                '<style>.btn-display { display: none; }</style>'+
               '</head>'+
                '<h2  class="Text-center">Patient Table Details<h2>'+
                tablePatient.outerHTML

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





// patient form clear button
const buttonPatientClear=()=>{
    selectTitle.value=''
    selectTitle.classList.remove('is-valid')
    selectTitle.classList.add('is-invalid')



    textFirstName.classList.remove('is-valid')
    textFirstName.classList.add('is-invalid')
    textFirstName.value=''


    textLastName.classList.remove('is-valid')
    textLastName.classList.add('is-invalid')
    textLastName.value=''


    textDateOfBirth.classList.remove('is-valid')
    textDateOfBirth.classList.add('is-invalid')
    textDateOfBirth.value=''



    selectGender.classList.remove('is-valid')
    selectGender.classList.add('is-invalid')
    selectGender.value=''



    textContactNumber.classList.remove('is-valid')
    textContactNumber.classList.add('is-invalid')
    textContactNumber.value=''


    textAddress.classList.remove('is-valid')
    textAddress.classList.add('is-invalid')
    textAddress.value=''


    textNote.classList.remove('is-valid')
    textNote.value=''




    textEmergencyName.classList.remove('is-valid')
    textEmergencyName.classList.add('is-invalid')
    textEmergencyName.value=''

    textEmergencyContactNo.classList.remove('is-valid')
    textEmergencyContactNo.classList.add('is-invalid')
    textEmergencyContactNo.value=''

}


