
const fillDataIntoSelect=(field,message,datalist,property,selectedValue)=>{

    field.innerHTML=''

let optionMessage=document.createElement('option')
optionMessage.value=''
optionMessage.selected="selected"
optionMessage.disabled='disabled'
optionMessage.innerText=message

field.appendChild(optionMessage)

for (const object of datalist) {
let option=document.createElement('option')
option.value=JSON.stringify(object);//convert into json string

option.innerText=object[property];
    // console.log(option.value)
if (selectedValue==object[property]){
    option.selected='selected';
}
field.appendChild(option)
  
}
}

// for data come in array style
const fillDataIntoSelectArray=(field,message,datalist,selectedValue)=>{

    field.innerHTML=''

    let optionMessage=document.createElement('option')
    optionMessage.value=''
    optionMessage.selected="selected"
    optionMessage.disabled='disabled'
    optionMessage.innerText=message

    field.appendChild(optionMessage)

    for (const object of datalist) {
        let option=document.createElement('option')
        option.value=JSON.stringify(object);//convert into json string

        option.innerText=object;
        // console.log(option.value)
        if (selectedValue==object){
            option.selected='selected';
        }
        field.appendChild(option)

    }
}

// fill data into multiselect
const fillDataIntoMultiSelect=(field,message,datalist,property1,property2,selectedValue)=>{

    field.innerHTML=''

    if (message!=''){

        let optionMessage=document.createElement('option')
        optionMessage.value=''
        optionMessage.selected="selected"
        optionMessage.disabled='disabled'
        optionMessage.innerText=message

        field.appendChild(optionMessage)
    }
    else {
        for (const object of datalist) {
            let option=document.createElement('option')
            option.value=JSON.stringify(object);//convert into json string

            option.innerText="("+object[property1]+")"+object[property2];
            if (selectedValue=="("+object[property1]+")"+object[property2]){
                option.selected='selected';
            }
            field.appendChild(option)

        }
    }



}
//function  for ajax request

 const  ajaxRequestBody=(url,method,object)=>{

    let  serverResponse;

     $.ajax(url, {
         async : false,
         type : method,
         data : JSON.stringify(object),
         contentType: 'application/json',
         success : function(data, status, ahr){
             console.log("success" + status + " " + ahr);
             //console.log(data);
             serverResponse = data;
         },

         error: function (ahr, status, errormsg){
             console.log("Fail" + errormsg + " " + status + " " + ahr);

             serverResponse = errormsg;
         }

     });

     return serverResponse;
 }


 const ajaxGetReq=(url)=>{

    let serverRespnse;

    $.ajax(url,{
        async: false,
        method:'GET',
        dataType:'json',
            success:function(data){
            // console.log("success" + data);
            // console.log(data);
            serverRespnse=data;
        },
        error : function(xrRes,status){
            console.log("fail "+status);
            serverRespnse=[];
        }
    });

    return serverRespnse;

 }

 //function for dopdown with checkbox

const fillDataIntoSelectwithcheckbox=(field,message,datalist,property,selectedValue)=>{

    field.innerHTML=''

    let optionMessage=document.createElement('option')
    optionMessage.value=''
    optionMessage.selected="selected"
    optionMessage.disabled='disabled'
    optionMessage.innerText=message

    field.appendChild(optionMessage)

    // for (const object of datalist) {
    //     const div=document.createElement('div')
    //     div.className="form-check form-check-inline"
    //     let option=document.createElement('option')
    //     let inputCHK=document.createElement('input')
    //     inputCHK.type="checkbox";
    //     inputCHK.className="form-check-input "
    //     inputCHK.id="chk"+object[property]
    //
    //
    //     let label=document.createElement('label')
    //     label.className="form-check-label "
    //     label.htmlFor=inputCHK.id;
    //     label.innerText=object[property];
    //
    //
    //
    //
    //     option.value=JSON.stringify(object);//convert into json string
    //
    //     // option.innerText=object[property];
    //     if (selectedValue==object[property]){
    //         option.selected='selected';
    //     }
    //
    //     div.appendChild(inputCHK)
    //     div.appendChild(label)
    //     option.appendChild(div)
    //     field.appendChild(option)
    //
    // }

    datalist.forEach(object => {
        const option = document.createElement('option');
        option.value = object[property];

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.id = 'chk' + object[property];
        checkbox.value = object[property];

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = checkbox.id;
        label.innerText = object[property];

        option.appendChild(checkbox);
        option.appendChild(label);

        field.appendChild(option);


    })
}


const fillDataIntoDataList=(field,datalist,property)=>{

    field.innerHTML=''



    for (const object of datalist) {

        let option=document.createElement('option')
        option.value=object[property];
        field.appendChild(option)


    }
}


