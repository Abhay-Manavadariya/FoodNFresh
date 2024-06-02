let addtocart = document.querySelectorAll('.addtocart');
let cartcounter = document.querySelector('#cartcounter');

function updatecart(product)
{
    axios.post("/updatecart",product).then(res => {
       // console.log(res)
        cartcounter.innerText = res.data.totalqty

        new Noty({
            type:'success',
            timeout:1000,
            text: "Item successfully added to cart",
            progressBar:false
          }).show();

    }).catch(err => {
        console.log(err)
        new Noty({
            type:'error',
            timeout:1000,
            text: "Something went wrong!!",
            progressBar:false
          }).show();
    })
}

addtocart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
                
        let product = JSON.parse(btn.dataset.product); //convert string to json object
        
        updatecart(product)
                
    })
})

//remove alert message after X seconds
const alertmsg = document.querySelector('#success-alert');
if(alertmsg){
    setTimeout(() => {
        alertmsg.remove()
    }, 2000);
}

        
