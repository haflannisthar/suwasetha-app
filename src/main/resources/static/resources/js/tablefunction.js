//create a common function to fill data into table

const fillDataIntoTable=(tableId,datalist,propertylist,editButtonFunction,deleteButtonFunction,
  printButtonFunction,buttonVisibility=true,privOb)=>{


    const tableBody=tableId.children[1];
    // console.log(tableBody);
    tableBody.innerHTML='';
  
  
    datalist.forEach((item,ind) => {
      
    
  const tr=document.createElement('tr')
  
  
  const tdIndex=document.createElement('td')
  tdIndex.innerText=parseInt(ind)+1
  tr.appendChild(tdIndex)
 for (const itemOb of propertylist) {
  // console.log(itemOb);
  
  const td=document.createElement('td');
  // 

  if (itemOb.datatype=='string') {
    if (datalist[ind][itemOb.property] == null) {
      td.innerText = '-';  
    } else {
       td.innerText=datalist[ind][itemOb.property]
    }
   
  }
  if (itemOb.datatype=='function') {
    td.innerHTML=itemOb.property(datalist[ind])
  }

     if (itemOb.datatype=='photoarray') {
         let img=document.createElement('img')
         img.style.width='50px'
         img.style.height='50px'

         if (datalist[ind][itemOb.property]==null){
           img.src='/resources/images/user2.jpg'
         }else {
             img.src=atob(datalist[ind][itemOb.property]);
         }

         td.appendChild(img)


     }
  tr.className='text-left'
  tr.appendChild(td)
  
 }
  
  
  
  const tdButton=document.createElement('td')
  tdButton.className='text-center btn-display'

  const divButton=document.createElement('div')
divButton.className='dropdown'

const iButton=document.createElement('i')
iButton.className='fa-solid fa-ellipsis-vertical'
iButton.setAttribute('data-bs-toggle','dropdown')
iButton.setAttribute('aria-expanded','false')
divButton.appendChild(iButton)


const ulButton=document.createElement('ul')
ulButton.className='dropdown-menu'
const liEditButton=document.createElement('li')
liEditButton.className='dropdown-item'
const liDeleteButton=document.createElement('li')
liDeleteButton.className='dropdown-item'

const liPrintButton=document.createElement('li')
liPrintButton.className='dropdown-item'



divButton.appendChild(ulButton)

const buttonEdit=document.createElement('button')

  buttonEdit.className="btn btn-info mb-1"
  buttonEdit.innerHTML='<i class="fas fa-edit me-2"></i>'+"Edit"
        buttonEdit.style="width:150px"
  
  buttonEdit.onclick=()=>{
  console.log("button edit "+item.id);
  editButtonFunction(item,ind)
  }
  
  liEditButton.appendChild(buttonEdit)
  
  const buttonDelete=document.createElement('button')
  buttonDelete.className="btn btn-danger mb-1"
  buttonDelete.innerHTML='<i class="fa-solid fa-trash me-2"></i>'+"Delete"
        buttonDelete.style="width:150px"
  
  buttonDelete.onclick=()=>{
    deleteButtonFunction(item,ind)

    }
  liDeleteButton.appendChild(buttonDelete)
  
  const buttonPrint=document.createElement('button')
  buttonPrint.className="btn btn-success "
  buttonPrint.innerHTML='<i class="fas fa-print me-2"></i>'+ "Print"
  buttonPrint.style="width:150px"
  buttonPrint.onclick=()=>{
  printButtonFunction(item,ind)
   
    }
  liPrintButton.appendChild(buttonPrint)

    if(buttonVisibility){
        // console.log("button visible")
        // console.log(privOb);
        if (privOb!=null && privOb.update){
            ulButton.appendChild(liEditButton)
            // console.log("editbutton visible")
        }
        if (privOb!=null && privOb.delete){
            ulButton.appendChild(liDeleteButton)
        }
        ulButton.appendChild(liPrintButton)


   tdButton.appendChild(divButton)
   tr.appendChild(tdButton)
  
    }
  
 
  
  
  
  
  // tr.appendChild(tdButton)
  
  tableBody.appendChild(tr)
  
    });
  
}


const fillDataIntoTableDashBoard=(tableId,datalist,propertylist,editButtonFunction,buttonText)=>{


    const tableBody=tableId.children[1];
    // console.log(tableBody);
    tableBody.innerHTML='';


    datalist.forEach((item,ind) => {


        const tr=document.createElement('tr')


        const tdIndex=document.createElement('td')
        tdIndex.innerText=parseInt(ind)+1
        tr.appendChild(tdIndex)
        for (const itemOb of propertylist) {
            // console.log(itemOb);

            const td=document.createElement('td');
            //

            if (itemOb.datatype=='string') {
                if (datalist[ind][itemOb.property] == null) {
                    td.innerText = '-';
                } else {
                    td.innerText=datalist[ind][itemOb.property]
                }

            }
            if (itemOb.datatype=='function') {
                td.innerHTML=itemOb.property(datalist[ind])
            }

            if (itemOb.datatype=='photoarray') {
                let img=document.createElement('img')
                img.style.width='50px'
                img.style.height='50px'

                if (datalist[ind][itemOb.property]==null){
                    img.src='/resources/images/user2.jpg'
                }else {
                    img.src=atob(datalist[ind][itemOb.property]);
                }

                td.appendChild(img)


            }
            tr.className='text-left'
            tr.appendChild(td)

        }



        const tdButton=document.createElement('td')
        tdButton.className='text-center btn-display'



        const buttonEdit=document.createElement('button')

        buttonEdit.className="btn btn-info mb-1"
        buttonEdit.innerHTML='<i class="fas fa-edit me-2"></i>'+buttonText
        buttonEdit.style="width:150px"

        buttonEdit.onclick=()=>{
            console.log("button edit "+item.id);
            editButtonFunction(item,ind)
        }

 tdButton.appendChild(buttonEdit)
            tr.appendChild(tdButton)








        // tr.appendChild(tdButton)

        tableBody.appendChild(tr)

    });

}


//fill data into table radio

//create a common function to fill data into table with view button
const fillDataIntoTableWithViewButton=(tableId,datalist,propertylist,editButtonFunction,deleteButtonFunction,
                         viewButtonFunction,printButtonFunction,buttonVisibility=true,privOb)=>{
    const tableBody=tableId.children[1];
    // console.log(tableBody);
    tableBody.innerHTML='';


    datalist.forEach((item,ind) => {


        const tr=document.createElement('tr')


        const tdIndex=document.createElement('td')
        tdIndex.innerText=parseInt(ind)+1
        tr.appendChild(tdIndex)
        for (const itemOb of propertylist) {
            // console.log(itemOb);

            const td=document.createElement('td');
            //

            if (itemOb.datatype=='string') {
                if (datalist[ind][itemOb.property] == null) {
                    td.innerText = '-';
                } else {
                    td.innerText=datalist[ind][itemOb.property]
                }

            }
            if (itemOb.datatype=='function') {
                td.innerHTML=itemOb.property(datalist[ind])
            }

            if (itemOb.datatype=='photoarray') {
                let img=document.createElement('img')
                img.style.width='50px'
                img.style.height='50px'

                if (datalist[ind][itemOb.property]==null){
                    img.src='/resources/images/user2.jpg'
                }else {
                    img.src=atob(datalist[ind][itemOb.property]);
                }

                td.appendChild(img)


            }
            tr.className='text-left'
            tr.appendChild(td)

        }



        const tdButton=document.createElement('td')
        tdButton.className='text-center btn-display'

        const divButton=document.createElement('div')
        divButton.className='dropdown'

        const iButton=document.createElement('i')
        iButton.className='fa-solid fa-ellipsis-vertical'
        iButton.setAttribute('data-bs-toggle','dropdown')
        iButton.setAttribute('aria-expanded','false')
        divButton.appendChild(iButton)


        const ulButton=document.createElement('ul')
        ulButton.className='dropdown-menu'
        const liEditButton=document.createElement('li')
        liEditButton.className='dropdown-item'
        const liDeleteButton=document.createElement('li')
        liDeleteButton.className='dropdown-item'

        const liViewButton=document.createElement('li')
        liViewButton.className='dropdown-item'

        const liPrintButton=document.createElement('li')
        liPrintButton.className='dropdown-item'



        divButton.appendChild(ulButton)

        const buttonEdit=document.createElement('button')

        buttonEdit.className="btn btn-info"
        buttonEdit.innerHTML='<i class="fas fa-edit me-2"></i>'+"Edit"
        buttonEdit.style="width:150px"

        buttonEdit.onclick=()=>{
            console.log("button edit "+item.id);
            editButtonFunction(item,ind)
        }

        liEditButton.appendChild(buttonEdit)

        const buttonDelete=document.createElement('button')
        buttonDelete.className="btn btn-danger"
        buttonDelete.innerHTML='<i class="fa-solid fa-trash me-2"></i>'+"Delete"
        buttonDelete.style="width:150px"

        buttonDelete.onclick=()=>{
            deleteButtonFunction(item,ind)

        }
        liDeleteButton.appendChild(buttonDelete)



        const buttonPrint=document.createElement('button')
        buttonPrint.className="btn btn-success"
        buttonPrint.innerHTML='<i class="fas fa-print me-2"></i>'+ "Print"
        buttonPrint.style="width:150px"
        buttonPrint.onclick=()=>{
            printButtonFunction(item,ind)

        }
        liPrintButton.appendChild(buttonPrint)

        const buttonView=document.createElement('button')
        buttonView.className="btn btn-warning"
        buttonView.innerHTML='<i class="far fa-eye me-2"></i>'+ "View"
        buttonView.style="width:150px"
        buttonView.onclick=()=>{
            viewButtonFunction(item,ind)

        }
        liViewButton.appendChild(buttonView)

        if(buttonVisibility){

            if (privOb!=null && privOb.update){
                ulButton.appendChild(liEditButton)
                // console.log("editbutton visible")
            }
            if (privOb!=null && privOb.delete){
                ulButton.appendChild(liDeleteButton)
            }
            ulButton.appendChild(liViewButton)
            ulButton.appendChild(liPrintButton)


            tdButton.appendChild(divButton)
            tr.appendChild(tdButton)

        }


        tableBody.appendChild(tr)

    });

}


//fill data into inner table
const fillDataIntoInnerTable=(tableId,datalist,propertylist,deleteButtonFunction,buttonVisibility=true)=>{
    const tableBody=tableId.children[1];
    console.log(typeof(datalist));
    tableBody.innerHTML='';



        datalist.forEach((item,ind) => {


            const tr=document.createElement('tr')


            const tdIndex=document.createElement('td')
            tdIndex.innerText=parseInt(ind)+1
            tr.appendChild(tdIndex)
            for (const itemOb of propertylist) {
                // console.log(itemOb);

                const td=document.createElement('td');
                //

                if (itemOb.datatype=='string') {
                    if (datalist[ind][itemOb.property] == null) {
                        td.innerText = '-';
                    } else {
                        td.innerText=datalist[ind][itemOb.property]
                    }

                }
                if (itemOb.datatype=='function') {
                    td.innerHTML=itemOb.property(datalist[ind])
                }
                tr.className='text-left'
                tr.appendChild(td)

            }



            const tdButton=document.createElement('td')
            tdButton.className='text-center btn-display'

            const divButton=document.createElement('div')
            divButton.className='dropdown'

            const iButton=document.createElement('i')
            iButton.className='fa-solid fa-ellipsis-vertical'
            iButton.setAttribute('data-bs-toggle','dropdown')
            iButton.setAttribute('aria-expanded','false')
            divButton.appendChild(iButton)


            const ulButton=document.createElement('ul')
            ulButton.className='dropdown-menu'
            const liEditButton=document.createElement('li')
            liEditButton.className='dropdown-item'
            const liDeleteButton=document.createElement('li')
            liDeleteButton.className='dropdown-item'

            const liPrintButton=document.createElement('li')
            liPrintButton.className='dropdown-item'



            divButton.appendChild(ulButton)


            const buttonDelete=document.createElement('button')
            buttonDelete.className="btn btn-danger mb-1"
            buttonDelete.innerHTML='<i class="fa-solid fa-trash me-2"></i>'+"Delete"
            buttonDelete.style="width:150px"

            buttonDelete.onclick=()=>{
                deleteButtonFunction(item,ind)

            }
            liDeleteButton.appendChild(buttonDelete)



            if(buttonVisibility){

                ulButton.appendChild(liEditButton)
                // console.log("editbutton visible")
                ulButton.appendChild(liDeleteButton)



                tdButton.appendChild(divButton)
                tr.appendChild(tdButton)

            }


            tableBody.appendChild(tr)

        });




}






// fill data into inner table with edit function
const fillDataIntoInnerTableWithEditBtn=(tableId,datalist,propertylist,editButtonFunction,deleteButtonFunction,buttonVisibility=true)=>{
    const tableBody=tableId.children[1];
    console.log(typeof(datalist));
    tableBody.innerHTML='';



    datalist.forEach((item,ind) => {


        const tr=document.createElement('tr')


        const tdIndex=document.createElement('td')
        tdIndex.innerText=parseInt(ind)+1
        tr.appendChild(tdIndex)
        for (const itemOb of propertylist) {
            // console.log(itemOb);

            const td=document.createElement('td');
            //

            if (itemOb.datatype=='string') {
                if (datalist[ind][itemOb.property] == null) {
                    td.innerText = '-';
                } else {
                    td.innerText=datalist[ind][itemOb.property]
                }

            }
            if (itemOb.datatype=='function') {
                td.innerHTML=itemOb.property(datalist[ind])
            }
            tr.className='text-left'
            tr.appendChild(td)

        }



        const tdButton=document.createElement('td')
        tdButton.className='text-center btn-display'

        const divButton=document.createElement('div')
        divButton.className='dropdown'

        const iButton=document.createElement('i')
        iButton.className='fa-solid fa-ellipsis-vertical'
        iButton.setAttribute('data-bs-toggle','dropdown')
        iButton.setAttribute('aria-expanded','false')
        divButton.appendChild(iButton)


        const ulButton=document.createElement('ul')
        ulButton.className='dropdown-menu'
        const liEditButton=document.createElement('li')
        liEditButton.className='dropdown-item'
        const liDeleteButton=document.createElement('li')
        liDeleteButton.className='dropdown-item'

        const liPrintButton=document.createElement('li')
        liPrintButton.className='dropdown-item'



        divButton.appendChild(ulButton)


        const buttonEdit=document.createElement('button')

        buttonEdit.className="btn btn-info"
        buttonEdit.innerHTML='<i class="fas fa-edit me-2"></i>'+"Edit"
        buttonEdit.style="width:150px"

        buttonEdit.onclick=()=>{
            console.log("button edit "+item.id);
            editButtonFunction(item,ind)
        }

        liEditButton.appendChild(buttonEdit)

        const buttonDelete=document.createElement('button')
        buttonDelete.className="btn btn-danger mb-1"
        buttonDelete.innerHTML='<i class="fa-solid fa-trash me-2"></i>'+"Delete"
        buttonDelete.style="width:150px"

        buttonDelete.onclick=()=>{
            deleteButtonFunction(item,ind)

        }
        liDeleteButton.appendChild(buttonDelete)



        if(buttonVisibility){

            ulButton.appendChild(liEditButton)
            // console.log("editbutton visible")
            ulButton.appendChild(liDeleteButton)



            tdButton.appendChild(divButton)
            tr.appendChild(tdButton)

        }


        tableBody.appendChild(tr)

    });




}

const fillDataIntoTableWithFiltering=(tableId,datalist,propertylist,editButtonFunction,deleteButtonFunction,
                         printButtonFunction,buttonVisibility=true,privOb)=>{
    const tableBody=tableId.children[2];
    // console.log(tableBody);
    tableBody.innerHTML='';


    datalist.forEach((item,ind) => {


        const tr=document.createElement('tr')

        // Set row border color based on conditions
        const availableQty = parseInt(item.availableQty);
        const rop = parseInt(item.rop);


        if (availableQty === 0 || availableQty <= rop) {
            tr.style.setProperty('border', '2px solid red', 'important');
            tr.style.setProperty('color', 'red', 'important');
        } else if (availableQty > rop) {
            tr.style.setProperty('border', '2px solid green', 'important');
            tr.style.setProperty('color', 'green', 'important');
        }


        const tdIndex=document.createElement('td')
        tdIndex.innerText=parseInt(ind)+1
        tr.appendChild(tdIndex)
        for (const itemOb of propertylist) {
            // console.log(itemOb);

            const td=document.createElement('td');
            //

            if (itemOb.datatype=='string') {
                if (datalist[ind][itemOb.property] == null) {
                    td.innerText = '-';
                } else {
                    td.innerText=datalist[ind][itemOb.property]
                }

            }
            if (itemOb.datatype=='function') {
                td.innerHTML=itemOb.property(datalist[ind])
            }

            if (itemOb.datatype=='photoarray') {
                let img=document.createElement('img')
                img.style.width='50px'
                img.style.height='50px'

                if (datalist[ind][itemOb.property]==null){
                    img.src='/resources/images/user2.jpg'
                }else {
                    img.src=atob(datalist[ind][itemOb.property]);
                }

                td.appendChild(img)


            }
            tr.className='text-left'
            tr.appendChild(td)

        }



        const tdButton=document.createElement('td')
        tdButton.className='text-center btn-display'

        const divButton=document.createElement('div')
        divButton.className='dropdown'

        const iButton=document.createElement('i')
        iButton.className='fa-solid fa-ellipsis-vertical'
        iButton.setAttribute('data-bs-toggle','dropdown')
        iButton.setAttribute('aria-expanded','false')
        divButton.appendChild(iButton)


        const ulButton=document.createElement('ul')
        ulButton.className='dropdown-menu'
        const liEditButton=document.createElement('li')
        liEditButton.className='dropdown-item'
        const liDeleteButton=document.createElement('li')
        liDeleteButton.className='dropdown-item'

        const liPrintButton=document.createElement('li')
        liPrintButton.className='dropdown-item'



        divButton.appendChild(ulButton)

        const buttonEdit=document.createElement('button')

        buttonEdit.className="btn btn-info mb-1"
        buttonEdit.innerHTML='<i class="fas fa-edit me-2"></i>'+"Edit"
        buttonEdit.style="width:150px"

        buttonEdit.onclick=()=>{
            console.log("button edit "+item.id);
            editButtonFunction(item,ind)
        }

        liEditButton.appendChild(buttonEdit)

        const buttonDelete=document.createElement('button')
        buttonDelete.className="btn btn-danger mb-1"
        buttonDelete.innerHTML='<i class="fa-solid fa-trash me-2"></i>'+"Delete"
        buttonDelete.style="width:150px"

        buttonDelete.onclick=()=>{
            deleteButtonFunction(item,ind)

        }
        liDeleteButton.appendChild(buttonDelete)

        const buttonPrint=document.createElement('button')
        buttonPrint.className="btn btn-success "
        buttonPrint.innerHTML='<i class="fas fa-print me-2"></i>'+ "Print"
        buttonPrint.style="width:150px"
        buttonPrint.onclick=()=>{
            printButtonFunction(item,ind)

        }
        liPrintButton.appendChild(buttonPrint)

        if(buttonVisibility){
            // console.log("button visible")
            // console.log(privOb);
            if (privOb!=null && privOb.update){
                ulButton.appendChild(liEditButton)
                // console.log("editbutton visible")
            }
            if (privOb!=null && privOb.delete){
                ulButton.appendChild(liDeleteButton)
            }
            ulButton.appendChild(liPrintButton)


            tdButton.appendChild(divButton)
            tr.appendChild(tdButton)

        }






        // tr.appendChild(tdButton)

        tableBody.appendChild(tr)

    });

}

