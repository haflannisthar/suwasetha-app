
const textFieldValiation=(fieldId,pattern,object,property)=>{

    const fieldValue=fieldId.value;
    const newP=new RegExp(pattern)

    // check the field value is empty or not
    if (fieldValue !=="") {

        // test against regExp pattern
        if (newP.test(fieldValue)) {

           //  set the border color to green
           fieldId.classList.add('is-valid')
           fieldId.classList.remove('is-invalid')

           //bind to employee object

           //  add the field value to object
           window[object][property]=fieldValue;

        } else {

            // set the border color to red
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

            //need to bind the null
            window[object][property]=null;

        }
    } else {
        //bind null
        window[object][property]=null;
       //  check that the field  is required or not
       if (fieldId.required) {
          // if required set the border color to red
       fieldId.classList.add('is-invalid')
       fieldId.classList.remove('is-valid')

       } else {
       //     else set the border color to default
       fieldId.classList.remove('is-valid')
     

        fieldId.style.border="1px solid #ced4da"
       }

    }

}





const dropDownValidation=(fieldId,pattern,object,property)=>{
    
    const fieldValue=fieldId.value;

    if (fieldValue !=="") {
        
           
           fieldId.classList.add('is-valid')
           fieldId.classList.remove('is-invalid')
           window[object][property]=fieldValue;
        
    } else {
       if (fieldId.required) {
        
        window[object][property]=null;
       fieldId.classList.add('is-invalid')
       fieldId.classList.remove('is-valid')

       }else{
       fieldId.classList.remove('is-valid')
     

        fieldId.style.border="1px solid #ced4da"
       }

    }
// if (fieldId.required) {
    
//         if (fieldId.value!=="") {
//             fieldId.classList.add('is-valid')
//             fieldId.classList.remove('is-invalid')
//         } else {
//             fieldId.classList.remove('is-valid')
//             fieldId.classList.add('is-invalid')
//         }
// } else {
    
//     fieldId.classList.add('is-valid')
//     fieldId.style.border="1px solid #ced4da"

// }
}


const dropDownValidationD=(fieldId,pattern,object,property)=>{
    
    const fieldValue=fieldId.value;

    if (fieldValue !=="") {
        
           
           fieldId.classList.add('is-valid')
           fieldId.classList.remove('is-invalid')
           window[object][property]=JSON.parse(fieldValue);//convert into json object
           console.log( window[object][property]);
        
    } else {
       if (fieldId.required) {
        
        window[object][property]=null;
       fieldId.classList.add('is-invalid')
       fieldId.classList.remove('is-valid')

       }else{
       fieldId.classList.remove('is-valid')
     

        fieldId.style.border="1px solid #ced4da"
       }

    }
// if (fieldId.required) {
    
//         if (fieldId.value!=="") {
//             fieldId.classList.add('is-valid')
//             fieldId.classList.remove('is-invalid')
//         } else {
//             fieldId.classList.remove('is-valid')
//             fieldId.classList.add('is-invalid')
//         }
// } else {
    
//     fieldId.classList.add('is-valid')
//     fieldId.style.border="1px solid #ced4da"

// }
}

const dropDownValidationDN=(fieldId,pattern,object,property)=>{

    const fieldValue=fieldId.value;

    if (fieldValue !=="") {


        fieldId.classList.add('is-valid')
        fieldId.classList.remove('is-invalid')
        window[object][property]=JSON.parse(fieldValue).name;//convert into json object
        console.log("bank name" +  window[object][property])
        console.log( window[object][property]);

    } else {
        if (fieldId.required) {

            window[object][property]=null;
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        }else{
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
// if (fieldId.required) {

//         if (fieldId.value!=="") {
//             fieldId.classList.add('is-valid')
//             fieldId.classList.remove('is-invalid')
//         } else {
//             fieldId.classList.remove('is-valid')
//             fieldId.classList.add('is-invalid')
//         }
// } else {

//     fieldId.classList.add('is-valid')
//     fieldId.style.border="1px solid #ced4da"

// }
}


//function for date field validator

const dateFieldValiation=(fieldId,pattern,object,property)=>{


    const fieldValue=fieldId.value;
    const newP=new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$')

    if (fieldValue !=="") {
        if (newP.test(fieldValue)) {
               if (fieldValue>textDateOfBirth.min && fieldValue<=textDateOfBirth.max) {
                  fieldId.classList.add('is-valid')
                  fieldId.classList.remove('is-invalid')


              //bind to employee object
           window[object][property]=fieldValue;
               }
               else {
                 fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')
               }
         

        
           
         
            //console.log(window[object]);
        } else {
            
           

            //need to bind the null
            window[object][property]=null;

        }
    } else {
        //bind null
        window[object][property]=null;
       if (fieldId.required) {
         
       fieldId.classList.add('is-invalid')
       fieldId.classList.remove('is-valid')

       } else {
       fieldId.classList.remove('is-valid')
     

        fieldId.style.border="1px solid #ced4da"
       }

    }
}

const dateFieldValiationD=(fieldId,pattern,object,property)=>{


    const fieldValue=fieldId.value;
    const newP=new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$')

    console.log(fieldValue)
    if (fieldValue !=="") {
        if (fieldValue>=fieldId.min && fieldValue<=fieldId.max) {
            console.log("inside"+fieldValue)
            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')


            //bind to employee object
            window[object][property]=fieldValue;
        }else if (fieldValue>=fieldId.min){
            console.log("inside--"+fieldValue)
            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')


            //bind to employee object
            window[object][property]=fieldValue;
        }
        else {
            console.log("outside"+fieldValue)
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')
        }
    } else {
        //bind null
        window[object][property]=null;
        if (fieldId.required) {

            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        } else {
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
}

const radioValidation=(fieldId,object,property)=>{

    if (fieldId.checked) {
        window[object][property]=fieldId.value
     
    } else {
        window[object][property]=null
    }
}


const checkboxValidation=(fieldId,object,property,truevalue,falsevalue,fieldvalueId,fieldmessage1,fieldmessage2)=>{

    if (fieldId.checked) {
        window[object][property]=truevalue
        fieldvalueId.innerText=fieldmessage1
     
    } else {
        window[object][property]=falsevalue
        fieldvalueId.innerText=fieldmessage2
    }
}


const dateTimeFieldValiationD=(fieldId,pattern,object,property)=>{


    const fieldValue=fieldId.value;
    const newP=new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}T([01][0-9]|2[0-3]):([0-5][0-9])')


    console.log(fieldValue)
    if (fieldValue !=="") {

        if (fieldValue>=fieldId.min && fieldValue<=fieldId.max) {
            console.log("inside"+fieldValue)
            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')


            //bind to employee object
            window[object][property]=fieldValue;
        }
        else {
            console.log("outside"+fieldValue)
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')
        }


    } else {
        //bind null
        window[object][property]=null;
        if (fieldId.required) {

            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        } else {
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
}

// datalist validation
const DataListValidationD=(fieldId,DataListName,object,property,displayproperty)=>{

    const fieldValue=fieldId.value;

    if (fieldValue !=="") {
        let datalist=window[DataListName];
        let extindex=datalist.map(data=>data[displayproperty]).indexOf(fieldValue)

        if (extindex!=-1){

            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')
            window[object][property]=datalist[extindex];
            console.log( window[object][property]);
        }else {
            window[object][property]=null;
            fieldId.classList.add('is-invalid')
        }


    } else {
        if (fieldId.required) {

            window[object][property]=null;
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        }else{
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
// if (fieldId.required) {

//         if (fieldId.value!=="") {
//             fieldId.classList.add('is-valid')
//             fieldId.classList.remove('is-invalid')
//         } else {
//             fieldId.classList.remove('is-valid')
//             fieldId.classList.add('is-invalid')
//         }
// } else {

//     fieldId.classList.add('is-valid')
//     fieldId.style.border="1px solid #ced4da"

// }
}


// data list validation with label (patient)
const DataListValidationDLabel=(fieldId,DataListName,object,property,displayproperty,labelfield)=>{

    const fieldValue=fieldId.value;

    if (fieldValue !=="") {
        let datalist=window[DataListName];

        let extindex=datalist.map(data=>data[displayproperty]).indexOf(fieldValue)

        if (extindex!=-1){

            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')
            window[object][property]=datalist[extindex];
            labelfield.innerHTML=datalist[extindex].title+" "+datalist[extindex].firstname+" "+datalist[extindex].lastname
            console.log( window[object][property]);
        }else {
            window[object][property]=null;
            labelfield.innerHTML=''
            fieldId.classList.add('is-invalid')
        }


    } else {
        if (fieldId.required) {

            window[object][property]=null;
            labelfield.innerHTML=''
            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        }else{
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
// if (fieldId.required) {

//         if (fieldId.value!=="") {
//             fieldId.classList.add('is-valid')
//             fieldId.classList.remove('is-invalid')
//         } else {
//             fieldId.classList.remove('is-valid')
//             fieldId.classList.add('is-invalid')
//         }
// } else {

//     fieldId.classList.add('is-valid')
//     fieldId.style.border="1px solid #ced4da"

// }
}


//validation for image
// const validatefile=(fieldId,object,propertyOne,propertyTwo,previewId,nameFieldId)=>{
//
//     if (fieldId.value!=""){
//
//
//
//         let file=fieldId.files[0];
//         nameFieldId.value=file['name'];
//
//         window[object][propertyTwo]=file['name'];
//
//
//         let fileReader =new FileReader();
//
//         fileReader.onload=function (e){
//
//             previewId.src=e.target.result;
//             window[object][propertyOne]=btoa(e.target.result);
//
//         }
//
//         fileReader.readAsDataURL(file);
//         return;
//     }
//
// }

const validatefile=(fieldId,object,propertyOne,propertyTwo,previewId,nameFieldId)=>{



    if (fieldId.value!=""){


        let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

        if (!allowedExtensions.exec(fieldId.value)) {
            Swal.fire({

                title: "Invalid File Type",
                text:'please upload a image of following type - jpg,jpeg,png ',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "OK"
            }).then((result) => {
                imgEmpPreview.src = '/resources/images/user2.jpg',
                    txtEmpPhoto.value = '',
                    fileEmpPhoto.files = null
            });

        }else {
            let file=fieldId.files[0];
            nameFieldId.value=file['name'];

            window[object][propertyTwo]=file['name'];


            let fileReader =new FileReader();

            fileReader.onload=function (e){

                previewId.src=e.target.result;
                window[object][propertyOne]=btoa(e.target.result);

            }

            fileReader.readAsDataURL(file);
            return;
        }


    }

}



const TimeFieldValiationD=(fieldId,pattern,object,property)=>{


    const fieldValue=fieldId.value;
    const newP=new RegExp(pattern)
    console.log(fieldValue)

    console.log(fieldValue)
    if (fieldValue !=="") {

        if (newP.test(fieldValue)){
            console.log("inside"+fieldValue)
            fieldId.classList.add('is-valid')
            fieldId.classList.remove('is-invalid')


            //bind to employee object
            window[object][property]=fieldValue;
        }else {
            window[object][property]=null;
            console.log("outside"+fieldValue)
                fieldId.classList.add('is-invalid')
                fieldId.classList.remove('is-valid')
        }


    } else {
        //bind null
        window[object][property]=null;
        if (fieldId.required) {

            fieldId.classList.add('is-invalid')
            fieldId.classList.remove('is-valid')

        } else {
            fieldId.classList.remove('is-valid')


            fieldId.style.border="1px solid #ced4da"
        }

    }
}
