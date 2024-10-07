window.addEventListener('load',()=>{



    UserNotificationPrivilege=ajaxGetReq("/privilege/byloggedusermodule/Batch");
    console.log(UserNotificationPrivilege)








})


const showNotofications=()=>{
    ExpiringDrugs=ajaxGetReq("/expiringdrugs");

    // console.log(employees);
    const displayProperty=[
        {property:'name',datatype:'string'},
        {property:'batchno',datatype:'string'},
        {property:'expirydate',datatype:'string'},
        {property:'availableqty',datatype:'string'}
    ]

    //fillDataIntoTable function call
   if (UserNotificationPrivilege.select){
       fillDataIntoTable(tableExpiringDrugs,ExpiringDrugs,displayProperty,refillNotForm,deleteNotRecord,printNotRecord,false,UserNotificationPrivilege);
   }

    // $('#modalNotification').modal(show);




}

const refillNotForm=()=>{

}

const deleteNotRecord=()=>{

}

const printNotRecord=()=>{

}