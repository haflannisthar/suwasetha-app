console.log(window);
textMobileNumber.addEventListener('keyup',()=>{
    textFieldValiation(textMobileNumber,'^[0][7][01245678][0-9]{7}$','employee','mobile')
})

textLandNumber.addEventListener('keyup',()=>{
    textFieldValiation(textLandNumber,'^[0](11|21|23|24|25|26|27|31|32|33|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81)[0-9]{7}$','employee','landno')
})

textNic.addEventListener('keyup',()=>{
    const regPattern=new RegExp('^(([1-9][0-9][0-9]{7}[vVxX])|(((19)|(2)[0-9])[0-9]{10}))$')

    textFieldValiation(textNic,regPattern,'employee','nic')
})

textEmail.addEventListener('keyup',()=>{
    const reg= new RegExp('^[a-zA-Z0-9]{3,20}[@][a-zA-Z]{3,20}[.][a-zA-Z]{2,20}$')
    //const regPat='^[a-zA-Z0-9._]+@([a-zA-Z]{2,10}\.)+[a-zA-Z]{2,4}$'
    textFieldValiation(textEmail,reg,'employee','email')
})
textfullname.addEventListener('keyup',()=>{
    const reg= new RegExp('^(([A-Z][a-z]{3,20}[ ])+([A-Z][a-z]{3,20}){1})$')
   
    textFieldValiation(textfullname,reg,'employee','fullname')
    generateCallingNameValues(textfullname)

    
})
textAddress.addEventListener('keyup',()=>{
    //const regPattern=new RegExp('^([0-9]{2,4}(,|/| ))$')//+[A-Z][a-z]+(,|/)[A-Z][a-z]
    //const regPattern=new RegExp('^([0-9]+ )([A-Z][a-z]+ )+[A-Z][a-z]+$')//+[A-Z][a-z]+(,|/)[A-Z][a-z]
    //const regPattern=new RegExp('^(((No)[ ][0-9,/]{1,5}[ ])+([A-Z][a-z]{3,20}[ ])+([A-Z][a-z]{3,20}){1})$')

    textFieldValiation(textAddress,'^.*$','employee','address') 
    
})

textNote.addEventListener('keyup',()=>{
   
    textFieldValiation(textNote,'^.*$','employee','note')
})


textCallingName.addEventListener('keyup',()=>{
   
    textCallingNameValidator(textCallingName);
  })
  textCallingName.addEventListener('change',()=>{
   
    textCallingNameValidator(textCallingName);
    

  })



textDateOfBirth.addEventListener('change',()=>{
    dateFieldValiation(textDateOfBirth,'','employee','dateofbirth')
})

selectDesignation.addEventListener('change',()=>{
    dropDownValidationD(selectDesignation,'','employee','designation_id')
})


selectCivilStatus.addEventListener('change',()=>{
    dropDownValidation(selectCivilStatus,'','employee','civilstatus')
})

// selectEmplyeeStatus.addEventListener('click',()=>{
//     textFieldValiation(selectEmplyeeStatus)
// })
selectEmployeeStatus.addEventListener('change',()=>{
    dropDownValidationD(selectEmployeeStatus,'','employee','employeestatus_id')
})

radioGenderMale.addEventListener('change',()=>{
    radioValidation(radioGenderMale,'employee','gender')
})
radioGenderFemale.addEventListener('change',()=>{
   radioValidation(radioGenderFemale,'employee','gender')
})

checkboxActive.addEventListener('change',()=>{
    checkboxValidation(checkboxActive,'employee','active',true,false,checkboxValue,'active','in-active')
})