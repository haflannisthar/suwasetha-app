
//console.log("loaded");

// window load event
window.addEventListener('load',()=>{

    //get user privilege
    userPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Supplier");
    console.log(userPrivilege)
  //refresh function for table and form
    refreshSupplierTable()
    refreshSupplierForm();



    
})
//function to refresh table
const refreshSupplierTable=()=>{


  supplierListData=ajaxGetReq("/supplier/list");


   const displayProperty=[
    {property:'regno',datatype:'string'},
    {property:'name',datatype:'string'},

    {property:'email',datatype:'string'},
    {property:'contactno',datatype:'string'},
    {property:getStatus ,datatype:'function'}
  ]
  //
  // //fillDataIntoTable function call
  // //fillDataIntoTable(tableId,datalist,propertylist,refill employee,delete employee,print employee,privilegeob)
  fillDataIntoTable(tableSupplier,supplierListData,displayProperty,refillSupplierForm,deleteSupplier,printSupplier,true,userPrivilege);
  //
  //
    disableBtnForDeletedSupplierStatus();
  $('#tableSupplier').dataTable();




}


// //get  status
const getStatus=(rowOb)=>{

    if (rowOb.supplierstatus_id.name=='Active') {
        return '<p ><span class="text-success border border-success rounded text-center p-1 ">'+rowOb.supplierstatus_id.name+'</span></p>'
    }
    if (rowOb.supplierstatus_id.name=='Not Active') {
        return '<p ><span class="text-warning border border-warning rounded text-center p-1 ">'+rowOb.supplierstatus_id.name+'</span></p>'
    }

    if (rowOb.supplierstatus_id.name=='Deleted') {
        return '<p ><span class="text-danger border border-danger rounded text-center p-1 ">'+rowOb.supplierstatus_id.name+'</span></p>'
    }


}

// delete button disable for deleted status
const  disableBtnForDeletedSupplierStatus=()=>{
    const tableSupplier = document.getElementById("tableSupplier");
    const tableRows = tableSupplier.querySelectorAll("tbody tr");

    tableRows.forEach(function(row) {
        const statusCell = row.querySelector("td:nth-child(6) p"); // Adjusted selector for status cell

        if (statusCell) {
            const statusValue = statusCell.textContent.trim();
            const actionCell = row.querySelector("td:nth-child(7)"); // Adjusted selector for action cell
            const dropdown = actionCell.querySelector(".dropdown");
            const deleteButton = dropdown.querySelector(".btn-danger");

            if (userPrivilege.delete) {
                if (statusValue === "Deleted") {
                    deleteButton.disabled = true;

                    deleteButton.style.display = "none";

                }

            }
        }


    });
}


//function to refresh form
const refreshSupplierForm=()=>{

    supplierTitle.innerText='New Supplier Enrollment'
    supplierrefreshbtn.style.visibility = 'visible'


    //create empty object
    supplier={};
    supplier.purchasedrugs=[];



  //get data for select element

  supplierstatus=ajaxGetReq("/supplierstatus/list")
    console.log(supplierstatus)
    fillDataIntoSelect(selectSupplierStatus,'Select Supplier Status',supplierstatus,'name',"Active");
    supplier.supplierstatus_id=JSON.parse(selectSupplierStatus.value)
    selectSupplierStatus.disabled=true
    selectSupplierStatus.classList.add('is-valid')




    branchList=ajaxGetReq("/branch/findall")
    fillDataIntoSelect(selectBranchname,'Select Branch',branchList,'name');

    bankList=ajaxGetReq("/bank/findall")
    fillDataIntoSelect(selectBankname,'Select Bank',bankList,'name');


    cityList=ajaxGetReq("/city/findall")
    fillDataIntoSelect(selectCity,'Select City',cityList,'name');




    //empty all elements
    textsuppliername.value=''
    textBrn.value=''
    textMobileNumber.value=''
    textEmail.value=''
    txtDrugName.value=''

    textAddress.value=''
    textNote.value=''
    textContactPersonName.value=''
    textContactPersonNumber.value=''
    textBankHoldersname.value=''
    selectBankname.value=''
    selectCity.value=''
    selectBranchname.value=''
    textAccountNumber.value=''
    textBankHoldersname.value=''
    TextCreditAmount.value=''




    textArrearsAmount.disabled=true
    textArrearsAmount.value='0.00'
    textArrearsAmount.classList.add('is-valid')
    supplier.arrearsamount='0.00'



    //set all elements to default color
   textsuppliername.classList.remove('is-valid')
    textBrn.classList.remove('is-valid')
    textMobileNumber.classList.remove('is-valid')
    textEmail.classList.remove('is-valid')
    textAddress.classList.remove('is-valid')
    textNote.classList.remove('is-valid')
    textContactPersonName.classList.remove('is-valid')
    textContactPersonNumber.classList.remove('is-valid')
    textBankHoldersname.classList.remove('is-valid')
    selectBankname.classList.remove('is-valid')
    selectBranchname.classList.remove('is-valid')
    textAccountNumber.classList.remove('is-valid')
    textBankHoldersname.classList.remove('is-valid')
    TextCreditAmount.classList.remove('is-valid')
    selectCity.classList.remove('is-valid')
    txtDrugName.classList.remove('is-valid')
    txtDrugName.classList.remove('is-invalid')
    textsuppliername.classList.remove('is-invalid')
    textBrn.classList.remove('is-invalid')
    textMobileNumber.classList.remove('is-invalid')
    textEmail.classList.remove('is-invalid')
    textAddress.classList.remove('is-invalid')
    textNote.classList.remove('is-invalid')
    textContactPersonName.classList.remove('is-invalid')
    textContactPersonNumber.classList.remove('is-invalid')
    textBankHoldersname.classList.remove('is-invalid')
    selectBankname.classList.remove('is-invalid')
    selectBranchname.classList.remove('is-invalid')
    textAccountNumber.classList.remove('is-invalid')
    textBankHoldersname.classList.remove('is-invalid')
    TextCreditAmount.classList.remove('is-invalid')
    textArrearsAmount.classList.remove('is-invalid')
    selectCity.classList.remove('is-invalid')

    // disable update button when form load
    btnUpdate.disabled="disabled"
    // btnUpdateEmp.style.cursor="not-allowed"
    $("#btnUpdate").css("cursor","not-allowed")



    if (userPrivilege.insert){
        btnAdd.disabled=""
        btnAdd.style.cursor="pointer"
    }
     else {
        btnAdd.disabled="disabled"
        btnAdd.style.cursor="not-allowed"
     }


    refreshInnerFormAndTable()
}

// refresh inner form and inner table
const refreshInnerFormAndTable=()=>{


    purchasedrug={};



    // get sales drug available list
     druglist=ajaxGetReq("/purchasedrug/availablelist")
    console.log(druglist)
    fillDataIntoDataList(dataListDrug,druglist,'name')


    //     empty all element
    txtDrugName.value=''
    textQuantity.value=''

    txtDrugName.classList.remove("is-valid")
    textQuantity.classList.remove("is-valid")

    txtDrugName.classList.remove("is-invalid")
    textQuantity.classList.remove("is-invalid")



    // refresh inner table
    const displayInnerTableProperty=[
        {property:getDrugName,datatype:'function'},
        {property:'qty',datatype:'string'},


    ]


    fillDataIntoInnerTable(drugsInnerTable,supplier.purchasedrugs,displayInnerTableProperty,deleteInnerTableRow,false)

}


const getDrugName=(ob)=>{
    console.log(ob)
    return ob.purchasedrug_id.name
}

const deleteInnerTableRow=(ob)=>{

}


const innerFormCheckError=()=>{
    let innerFormError=''
    if (txtDrugName.value=='' ||purchasedrug.purchasedrug_id==null){
        innerFormError =innerFormError + "Please enter drug<br>"
        txtDrugName.classList.add('is-invalid')
    }

    if (textQuantity.value=='' ||purchasedrug.qty==null){
        innerFormError =innerFormError + "Please enter quantity<br>"
        textQuantity.classList.add('is-invalid')
    }

    return innerFormError;
}

const btnInnerformAdd=()=>{
    console.log(purchasedrug)
    let error=innerFormCheckError()
    let div=document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'

    if(error==''){



        let drugInnerDetails=  `Drug Name : ${purchasedrug.purchasedrug_id.name}<br>
                                             qty : ${purchasedrug.qty} <br>
                                            `

        div.innerHTML=drugInnerDetails
        //     get user confirmation
        Swal.fire({
            title: "Are you sure to add the following drug record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: " Added Successfully!",

                    icon: "success"
                });

                //     push into array
                supplier.purchasedrugs.push(purchasedrug);
                console.log( supplier.purchasedrugs)
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



// get user confirmation befor form refresh
const  refreshSupplierFormByuserConfirm=()=>{
    Swal.fire({

        text: "Are you sure to refresh the form",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSupplierForm();
        }
    });
}




// filter  city by bank
const filterCityByBank=()=>{

    selectCity.value=''
    selectCity.classList.remove('is-valid')

    selectBranchname.value=''
    selectBranchname.classList.remove('is-valid')
    filteredCityList=ajaxGetReq("/filtercitybybank/"+JSON.parse(selectBankname.value).id);
    fillDataIntoSelect(selectCity,'Select City',filteredCityList,'name');
}

// filter  branch by bank and city
const filterBranchByBankCity=()=>{


    selectBranchname.value=''
    selectBranchname.classList.remove('is-valid')

    filteredBranchList=ajaxGetReq("/filterbranchbybankcity/"+JSON.parse(selectBankname.value).id +"/"+JSON.parse(selectCity.value).id);
    fillDataIntoSelect(selectBranchname,'Select Branch',filteredBranchList,'name');
}




//error checking
const checkError=()=>{
    let errors=''


    if (supplier.name == null || textsuppliername.value=='') {
        errors =errors + "Please enter supplier name<br>"
        textsuppliername.classList.add('is-invalid')
    }

    if (supplier.brn == null || textBrn.value=='') {


        errors =errors + "Please enter brn<br>"
        textBrn.classList.add('is-invalid')
    }

    if (supplier.contactno == null || textMobileNumber.value=='') {

        errors =errors + "Please enter contact number<br>"
        textMobileNumber.classList.add('is-invalid')
    }

    if (supplier.email == null || textEmail.value=='') {

        errors =errors + "Please enter email address<br>"
        textEmail.classList.add('is-invalid')
    }

    if (supplier.supplierstatus_id == null || selectSupplierStatus.value=='') {

        errors =errors + "Please select supplier status<br>"
        selectSupplierStatus.classList.add('is-invalid')
    }
    if (supplier.purchasedrugs.length == 0) {

        errors =errors + "Item List cannot be empty. Please select the items <br>"

    }


    if (supplier.address == null || textAddress.value=='') {

        errors =errors + "Please enter  address<br>"
        textAddress.classList.add('is-invalid')
    }

    if(supplier.contactpersonname ==null || textContactPersonName.value==''){
        errors =errors + "Please enter contact person name <br>"
        textContactPersonName.classList.add('is-invalid')
    }
    if(supplier.contactpersonnumber ==null || textContactPersonNumber.value==''){
        errors =errors + "Please enter contact person number<br>"
        textContactPersonNumber.classList.add('is-invalid')
    }

    if(supplier.bankholdersname ==null || textBankHoldersname.value==''){
        errors =errors + "Please enter Account Holder Name<br>"
        textBankHoldersname.classList.add('is-invalid')
    }

    if(supplier.accountnumber ==null || textAccountNumber.value==''){
        errors =errors + "Please enter Account number<br>"
        textAccountNumber.classList.add('is-invalid')
    }

    if(supplier.bank_id==null ){
        errors =errors + "Please select Bank Name<br>"
        selectBankname.classList.add('is-invalid')
    }

    if(supplier.city_id==null){
        errors =errors + "Please select City<br>"
        selectCity.classList.add('is-invalid')
    }

    if(supplier.branch_id ==null || selectBranchname.value==''){
        errors =errors + "Please select Branch Name<br>"
        selectBranchname.classList.add('is-invalid')
    }


    return errors;

}





//function for add button
const buttonSupplierAdd=()=>{

// need to check for all required fields
    let fromError=checkError()
    console.log(supplier);
//
    // apply css to sweet alert js
    const style = document.createElement('style');
    style.innerHTML = `
    .swal-scrollable-content {
        max-height: 300px;
        overflow-y: auto;
        padding-right: 10px;
        
    }
`;
// Append the style element to the head of the document
    document.head.appendChild(style);


   let div =document.createElement('div')
    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.className='swal-scrollable-content'


    //check for errors
    if (fromError=='') {



        let Info = `supplier name: ${supplier.name}<br>
                 Brn: ${supplier.brn}<br>
                  Contact Number: ${supplier.contactno}<br>
                  Email: ${supplier.email}<br>
                 Supplier Status: ${supplier.supplierstatus_id.name}<br>
                 Addrees: ${supplier.address}<br>
             Contact person name: ${supplier.contactpersonname}<br>
          Contact person mobile number: ${supplier.contactpersonnumber}<br>`;

        if (supplier.note != null) {
            Info += `Note: ${supplier.note}<br>`;
        }
        if (supplier.bankholdersname != null) {
            Info += `Account Holders Name: ${supplier.bankholdersname}<br>`;
        }

            if (supplier.bank_id !=null) {
                Info += `Bank Name: ${supplier.bank_id.name}<br>`;
            }
        if (supplier.city_id !=null) {
            Info += `City Name: ${supplier.city_id.name}<br>`;
        }

            if (supplier.branch_id !=null) {
                Info += `Branch Name: ${supplier.branch_id.name}<br>`;
            }


        if (supplier.accountnumber != null) {
            Info += `Account Number: ${supplier.accountnumber}<br>`;
        }
        if (supplier.arrearsamount != null) {
            Info += `Arrears Amount: ${supplier.arrearsamount}<br>`;
        }
        if (supplier.creditlimit != null) {
            Info += `Credit Limit: ${supplier.creditlimit}<br><br>`;
        }




        

        div.innerHTML=Info
        div.style.fontSize='16px'

        //user confirmation
        Swal.fire({
            title: "Are you sure to add the following Supplier record?",
            html: div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "confirm",
            // didOpen: () => {
            //     // Apply scrollable styles to the SweetAlert2 popup
            //     const swalPopup = document.querySelector('.swal2-popup');
            //     swalPopup.style.maxHeight = '400px';  // Set the max height for the popup
            //     swalPopup.style.overflowY = 'auto';  // Enable vertical scrolling
            // }
        }).then((result) => {
            if (result.isConfirmed) {
                let serverResponse=ajaxRequestBody("/supplier","POST",supplier);
                if (serverResponse=="OK") {
                    Swal.fire({
                        title: "Supplier record Added Successfully!",
                        text: "",
                        icon: "success"
                    });
                    //need to refresh table and form
                    refreshSupplierTable();
                    refreshSupplierForm();


                    //need to hide the modal
                    $('a[href="#SupplierTable"]').tab('show');

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

        div.innerHTML=fromError

        Swal.fire({
            icon: "error",
            title: "Form has following errors",
            html:div,


        });

    }



}




const deleteSupplier=(rowOb,rowind)=>{

    let supplierInfo=`Supplier Name : ${rowOb.name}<br>
                              Supplier Reg Number  : ${rowOb.regno} `

    let div=document.createElement('div');
    div.innerHTML=supplierInfo;
    div.style.textAlign='left'
    div.style.marginLeft='50px'

     Swal.fire({
        title: "Are you sure to delete following supplier?",
       html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
         if (result.isConfirmed) {
             let  serverResponse=ajaxRequestBody("/supplier","DELETE",rowOb)
             if (serverResponse=="OK") {


                 Swal.fire({
                     title: "Supplier Deleted Successfully!",

                     icon: "success"
                 });
                 refreshSupplierTable()




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



    //refill the form function
    const refillSupplierForm=(rowOb,rowind)=>{

        supplierTitle.innerText='Supplier Update'
        console.log(rowOb)

        supplier=JSON.parse(JSON.stringify(rowOb))

        supplierold=JSON.parse(JSON.stringify(rowOb))

        let supplierInfo=`Supplier Name : ${rowOb.name}<br>
                              Supplier Reg Number  : ${rowOb.regno} `

        let div=document.createElement('div');
        div.innerHTML=supplierInfo;
        div.style.textAlign='left'
        div.style.marginLeft='50px'

        Swal.fire({
            title: "are you sure edit following supplier?",
            html:  div,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                $('a[href="#SupplierForm"]').tab('show');

                supplierrefreshbtn.style.visibility = 'visible'

                // disable add button and enable update button

                if (userPrivilege.update){
                    btnUpdate.disabled=""
                    btnUpdate.style.cursor="pointer"
                }
                else {
                    btnUpdate.disabled="disabled"
                    btnUpdate.style.cursor="not-allowed"
                }


                btnAdd.disabled="disabled"
                btnAdd.style.cursor="not-allowed"

                supplier=rowOb;

                textsuppliername.classList.remove('is-invalid')
                textBrn.classList.remove('is-invalid')
                textMobileNumber.classList.remove('is-invalid')
                textEmail.classList.remove('is-invalid')
                selectItem.classList.remove('is-invalid')
                selectedItemList.classList.remove('is-invalid')
                textAddress.classList.remove('is-invalid')
                textNote.classList.remove('is-invalid')
                textContactPersonName.classList.remove('is-invalid')
                textContactPersonNumber.classList.remove('is-invalid')
                textBankHoldersname.classList.remove('is-invalid')
                selectBankname.classList.remove('is-invalid')
                selectBranchname.classList.remove('is-invalid')
                textAccountNumber.classList.remove('is-invalid')
                textBankHoldersname.classList.remove('is-invalid')
                TextCreditAmount.classList.remove('is-invalid')
                textArrearsAmount.classList.remove('is-invalid')
                selectCity.classList.remove('is-invalid')

                textsuppliername.value=supplier.name
                textsuppliername.classList.add("is-valid")

                textBrn.value=supplier.brn
                textBrn.classList.add("is-valid")

                textMobileNumber.value=supplier.contactno
                textMobileNumber.classList.add("is-valid")


                textEmail.value=supplier.email
                textEmail.classList.add("is-valid")

                fillDataIntoSelect(selectSupplierStatus,'select  status',supplierstatus,'name',supplier.supplierstatus_id.name)
                selectSupplierStatus.classList.add("is-valid")
                selectSupplierStatus.disabled=false


                // left side
                availbleitemlistwithoutsupplier=ajaxGetReq("/purchasedrug/listwithoutsupplier/"+supplier.id)
                console.log(availbleitemlistwithoutsupplier)
                druglist = [];
                druglist =availbleitemlistwithoutsupplier;
                fillDataIntoMultiSelect(selectItem,'',availbleitemlistwithoutsupplier,'code','name')

                // right side
                fillDataIntoMultiSelect(selectedItemList, '', supplier.purchasedrugs, 'code', 'name')
                console.log(supplier.purchasedrugs)
                textAddress.value=supplier.address
                textAddress.classList.add("is-valid")


                textContactPersonName.value=supplier.contactpersonname
                textContactPersonName.classList.add("is-valid")


                textContactPersonNumber.value=supplier.contactpersonnumber
                textContactPersonNumber.classList.add("is-valid")

                if (supplier.note!=null){
                    textNote.value=supplier.note
                    textNote.classList.add("is-valid")
                }
                else{
                    textNote.value=''
                }


                if (supplier.bankholdersname != null){
                    textBankHoldersname.value=supplier.bankholdersname
                    textBankHoldersname.classList.add("is-valid")
                }
                else{
                    textBankHoldersname.value=""
                }

                if (supplier.accountnumber != null){
                    textAccountNumber.value=supplier.accountnumber
                    textAccountNumber.classList.add("is-valid")
                }
                else{
                    textAccountNumber.value=""
                }


                    fillDataIntoSelect(selectBankname,'Select Bank',bankList,'name',supplier.branch_id.bank_id.name);
                     supplier.bank_id=supplier.branch_id.bank_id
                    selectBankname.classList.add("is-valid")

                   filteredCityList=ajaxGetReq("/filtercitybybank/"+JSON.parse(selectBankname.value).id);
                    fillDataIntoSelect(selectCity,'Select City',filteredCityList,'name',supplier.branch_id.city_id.name);
                   supplier.city_id=supplier.branch_id.city_id
                    selectCity.classList.add("is-valid")



                    filteredBranchList=ajaxGetReq("/filterbranchbybankcity/"+JSON.parse(selectBankname.value).id +"/"+JSON.parse(selectCity.value).id);
                    fillDataIntoSelect(selectBranchname,'Select Branch',filteredBranchList,'name',supplier.branch_id.name);
                    selectBranchname.classList.add("is-valid")





                if (supplier.arrearsamount != null){
                    textArrearsAmount.value=parseFloat(supplier.arrearsamount).toFixed(2)
                    textArrearsAmount.classList.add("is-valid")
                }
                else{
                    textArrearsAmount.value=""
                }
                if (supplier.creditlimit != null){
                    TextCreditAmount.value=parseFloat(supplier.creditlimit).toFixed(2)
                    TextCreditAmount.classList.add("is-valid")
                }
                else{
                    TextCreditAmount.value=""
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
const  checkUpdate=()=>{
    let updateForm='';

    if (supplier.name!=supplierold.name) {
      updateForm=updateForm + "name " +supplierold.name+ " changed into " + supplier.name +"<br>";
    }

    if (supplier.brn!=supplierold.brn) {
        updateForm=updateForm + "Brn " +supplierold.brn+ " changed into " + supplier.brn +"<br>";
    }
    if (supplier.contactno!=supplierold.contactno) {
        updateForm=updateForm + "Contact Number " +supplierold.contactno+ " changed into " + supplier.contactno +"<br>";
    }
    if (supplier.email!=supplierold.email) {
        updateForm=updateForm + "Email " +supplierold.email+ " changed into " + supplier.email +"<br>";
    }
    if (supplier.address!=supplierold.address) {
        updateForm=updateForm + "Address " +supplierold.address+ " changed into " + supplier.address +"<br>";
    }
    if (supplier.note!=supplierold.note) {
        updateForm=updateForm + "Note " +supplierold.note+ " changed into " + supplier.note +"<br>";
    }
    if (supplier.contactpersonname!=supplierold.contactpersonname) {
        updateForm=updateForm + "Contact Person Name " +supplierold.contactpersonname+ " changed into " + supplier.contactpersonname +"<br>";
    }
    if (supplier.supplierstatus_id.name!=supplierold.supplierstatus_id.name) {
        updateForm=updateForm + " Supplier Status " +supplierold.supplierstatus_id.name+ " changed into " + supplier.supplierstatus_id.name +"<br>";
    }

    if (supplier.contactpersonnumber!=supplierold.contactpersonnumber) {
        updateForm=updateForm + "Contact person number " +supplierold.contactpersonnumber+ " changed into " + supplier.contactpersonnumber +"<br>";
    }
    if (supplier.bankholdersname!=supplierold.bankholdersname) {
        updateForm=updateForm + "Acount Holders Name " +supplierold.bankholdersname+ " changed into " + supplier.bankholdersname +"<br>";
    }
    if (supplier.accountnumber!=supplierold.accountnumber) {
        updateForm=updateForm + "Account Number " +supplierold.accountnumber+ " changed into " + supplier.accountnumber +"<br>";
    }

    if (supplier.bank_id.name!=supplierold.branch_id.bank_id.name) {
        updateForm=updateForm + "Bank " +supplierold.branch_id.bank_id.name+ " changed into " + supplier.bank_id.name +"<br>";
    }

    if (supplier.city_id.name!=supplierold.branch_id.city_id.name) {
        updateForm=updateForm + "City " +supplierold.branch_id.city_id.name+ " changed into " + supplier.city_id.name +"<br>";
    }
    if (supplier.branch_id.name!=supplierold.branch_id.name) {
        updateForm=updateForm + "Branch " +supplierold.branch_id.name+ " changed into " + supplier.branch_id.name +"<br>";
    }
    if (supplier.arrearsamount!=supplierold.arrearsamount) {
        updateForm=updateForm + "Arrears Amount " +supplierold.arrearsamount+ " changed into " + supplier.arrearsamount +"<br>";
    }
    if (supplier.creditlimit!=supplierold.creditlimit) {
        updateForm=updateForm + "Credit Limit " +supplierold.creditlimit+ " changed into " + supplier.creditlimit +"<br>";
    }




    let newlyAddedItems=[]
    for (let element of supplier.purchasedrugs){
        let extCount=supplierold.purchasedrugs.map(item=>item.id).indexOf(element.id)
        if (extCount==-1){
            newlyAddedItems.push(element.name);
        }

    }


    if (newlyAddedItems.length>0){
        updateForm+='<b>New Added Items : </b><br>'
        updateForm+=newlyAddedItems.join('<br>');
    }

    let removedItems=[]
    for (let element of supplierold.purchasedrugs){
        let extCount=supplier.purchasedrugs.map(item=>item.id).indexOf(element.id)
        if (extCount==-1){

            removedItems.push(element.name);
        }

    }

    if (removedItems.length>0){
        updateForm+='<br/><b>Removed Items</b><br>'
        updateForm+=removedItems.join('<br>');
    }




    return updateForm;
}

//define update function
      const buttonSupplierUpdate=()=>{
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
                          let   ajaxUpdateResponse=ajaxRequestBody("/supplier","PUT",supplier);
                          if (ajaxUpdateResponse=="OK"){
                              Swal.fire({
                                  title: " Supplier record updated successfully!",

                                  icon: "success"
                              });
                              //need to refresh table and form
                              refreshSupplierForm();
                              refreshSupplierTable();
                              // hide the modal
                              $('a[href="#SupplierTable"]').tab('show');
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
                  title: " Form has following errors",
                   html:div,
                  icon: "warning"
              });
          }

      }








//print function
const printSupplier=(rowOb,rowind)=>{


    const PrintOb=rowOb;
    console.log(PrintOb)



    tdSupplierName.innerHTML=PrintOb.regno+" - "+PrintOb.name
    tdbrn.innerHTML=PrintOb.brn
    tdCnumber.innerHTML=PrintOb.contactno
    tdEmail.innerHTML=PrintOb.email
    tdAddress.innerHTML=PrintOb.address
    tdStatus.innerHTML=PrintOb.supplierstatus_id.name
    tdCPersonName.innerHTML=PrintOb.contactpersonname
    tdCPersonNumber.innerHTML=PrintOb.contactpersonnumber

    tdUser.innerHTML=PrintOb.user_id.username



    if (PrintOb.note==null){
        tdNote.innerHTML=""
    }
    else{
        tdNote.innerHTML=PrintOb.note
    }

    if (PrintOb.bankholdersname==null){
        tdBankHName.innerHTML=""
    }
    else{
        tdBankHName.innerHTML=PrintOb.bankholdersname
    }

    if (PrintOb.accountnumber==null){
        tdAccountNumber.innerHTML=""
    }
    else{
        tdAccountNumber.innerHTML=PrintOb.accountnumber
    }


        tdBank.innerHTML=PrintOb.branch_id.bank_id.name



        tdBranch.innerHTML=PrintOb.branch_id.name



        tdBranch.innerHTML=PrintOb.branch_id.city_id.name


    if (PrintOb.creditlimit==null){
        tdCreditLimit.innerHTML=""
    }else{
        tdCreditLimit.innerHTML=parseFloat(PrintOb.creditlimit).toFixed(2)
    }
    if (PrintOb.arrearsamount==null){
        tdArrearsAmount.innerHTML=""
    }
    else{
        tdArrearsAmount.innerHTML=parseFloat(PrintOb.arrearsamount).toFixed(2)
    }
    const displayInnerTableProperty=[
        {property:getItemName,datatype:'function'}
    ]
    fillDataIntoInnerTable(printinnertable,PrintOb.purchasedrugs,displayInnerTableProperty,'',false)
    // fillDataIntoInnerTable(printinnertable, PorderPrint.purchaseOrderHasPurchaseDrugList,displayInnerTableProperty,deleteInnerItemForm,false)




    let PrintInfo = `Supplier Id : ${PrintOb.regno}<br>
                 Supplier Name :  ${PrintOb.name}`

    let div=document.createElement('div');

    div.style.textAlign='left'
    div.style.marginLeft='50px'
    div.style.fontSize='16px'
    div.innerHTML=PrintInfo
    Swal.fire({
        title: "are you sure Print following Supplier?",
        html:div,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm"
    }).then((result) => {
        if (result.isConfirmed) {
            printSupplierDetails();
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Action Aborted"


            });
        }
    })





}

// function to get item name
const  getItemName=(rowOb)=>{
    return rowOb.name
}
// print supplier details
const printSupplierDetails=()=>{

    const newTab=window.open()  
     newTab.document.write(
    '<head><title>Supplier Print</title>'+
    '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+'</head>'+
         '<style>p{font-size: 15px} </style>'+
         '</head>'+
         printSupplierTable.outerHTML
   
    
  )
  setTimeout(
    function() {
        newTab.print()
        newTab.close()
    },1000
  )
  }






  
  //supplier table print function

  const printCompleteTable=()=>{
      Swal.fire({
          title: "Are you sure to print supplier table?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "confirm"
      }).then((result) => {
          if (result.isConfirmed) {
              const newTab=window.open()
              newTab.document.write(
                  '<head><title>Supplier table Print</title>'+
                  ' <script src="../resources/jQuery/jquery.js"></script>'+
                  '<link rel="stylesheet" href="../resources/bootstrap-5.3.1-dist/css/bootstrap.min.css">'+
                  '<style>.btn-display { display: none; }</style>'+'</head>'+
                  '<h2  class="Text-center">Supplier Table Details<h2>'+
                  tableSupplier.outerHTML
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


  //function to clear button
const buttonSupplierClear=()=>{
    textsuppliername.value=''
    textsuppliername.classList.add('is-invalid')
    textsuppliername.classList.remove('is-valid')


    textBrn.value=''
    textBrn.classList.add('is-invalid')
    textBrn.classList.remove('is-valid')

    textMobileNumber.value=''
    textMobileNumber.classList.add('is-invalid')
    textMobileNumber.classList.remove('is-valid')




    textEmail.classList.add('is-invalid')
    textEmail.classList.remove('is-valid')
    textEmail.value=''

    selectSupplierStatus.classList.add('is-invalid')
    selectSupplierStatus.classList.remove('is-valid')
    selectSupplierStatus.value=''

    textAddress.classList.add('is-invalid')
    textAddress.classList.remove('is-valid')
    textAddress.value=''

    textContactPersonName.classList.add('is-invalid')
    textContactPersonName.classList.remove('is-valid')
    textContactPersonName.value=''

    textContactPersonNumber.classList.add('is-invalid')
    textContactPersonNumber.classList.remove('is-valid')
    textContactPersonNumber.value=''


    textNote.classList.remove('is-valid')
    textNote.value=''

    textBankHoldersname.classList.remove('is-valid')
    textBankHoldersname.value=''


    selectBankname.classList.remove('is-valid')
    selectBankname.value=''

    selectBranchname.classList.remove('is-valid')
    selectBranchname.value=''


    textAccountNumber.classList.remove('is-valid')
    textAccountNumber.value=''


    textArrearsAmount.classList.remove('is-valid')
    textArrearsAmount.value=''

    TextCreditAmount.classList.remove('is-valid')
    TextCreditAmount.value=''



    supplier.purchasedrugs.forEach(element => {
        druglist.push(element)
    })
    fillDataIntoMultiSelect(selectitem, '', druglist, 'code', 'name')
    supplier.purchasedrugs = []
    console.log( supplier.purchasedrugs)
    fillDataIntoMultiSelect(selecteditemList, '', supplier.purchasedrugs, 'code', 'name')


}

