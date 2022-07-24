

const checkNullValidation = (value) => {
    let error = {};
     /* aswin on 10/13/2021 start*/
     var format = /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/;
     var matches = value.match(/^[0-9]+/g);
     /* aswin on 10/13/2021 stop*/
    // var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/;
    // var matches = value.match(/\d+/g);

    if(format.test(value))
    {
        error["error"] = " Cannot contain Special character"
    }

    if(matches)
    {
        error["error"] = " Cannot contain Numbers"
    }
    if (!value || (value.length < 2)) {
        error["error"] = " field Can't be Empty."
    }
    return error;
}

const checkAddrValidation = (value) => {
    var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/;
    let error = {};
    // if(format.test(value))
    // {
    //     error["error"] = "Address should not containe Special Characters."
    // }
    if (!value || (value.length < 4)) {
        error["error"] = "Address should contain atleast 4 characters."
    }
    return error;
}

const checkNameValidation = (value) => {
    const validName = new RegExp('^[a-zA-Z0-9_]{2,20}$');
    let error = {};

    if(value)
    {
        if(value.length>0)
    {
        
    
    console.log('matching name',value)
    var matches = /^[A-Za-z]+$/;
    
    // console.log('matchesss' + matches)
  
   

    // if(matches.test(value)==false)
    // {
    //     error["error"] = "Name Should contain Only Upper and Lower Case Alphabets"
    // }
    // else
    // {
    //     error['error']=''
    // }


    // if (value && value.length > 20) {
    //     error["error"] = "Name must contain less than 20 characters."
    // }
    // else if (!value || value.length < 4)
    //     error["error"] = "Name must contain atleast 4 characters.";
     if (!validName.test(value)) {
        error["error"] = "Name must not contain any Special Symbol. (Ex: @,:,;,},{ etc.)"
    }
} 
    }
    
    return error;
}
const checkEmailValidation = (value,arraydata) => {
    console.log('validating on submit')
   
  
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    let error = {};
    if (!value || value.length === 0) {
        error["error"] = "Email can't be an empty field."
        return error;
    }
    if (!validEmail.test(value)) {
        error["error"] = "Email is Invliad."
    }
    
    return error;
}
const checkPasswordValidation = (value) => {
    let error = {};
    const validPass = new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$');
    if (!value || value.length < 4) {
        error["error"] = "Password must contain atleast 4 characters."
        return error;
    }
    if (!validPass.test(value)) {
        error["error"] = "password must contain atleast one number and one special character"
        return error;
    }
    return error;
}
const checkMobNoValidation = (value) => {

    
    let error = {};
    const validNumber = new RegExp('[56789][0-9]{9}$');
    if (value && value[0] in ["0", "1", "2", "3", "4"]) {
        error["error"] = "number must start with 5/6/7/8/9."
    }
    else if (!validNumber.test(value) || value.length > 10) {
        error["error"] = "number should be of 10 digit and not contain special characters."
    }
    
    

    return error;
}
const checkLandNoValidation = (value) => {
    const exp = new RegExp('^[0-9]*$');
    // const check = new RegExp(/^\d{10}$/);
    // const validName = new RegExp('[0-9]/gm');
    let error = {};
    if(value.length>0){
        if(!exp.test(value)){
            error["error"] = "only accepts numbers"
        }
        return error;
    }
    return error;
}

const checkPincodeValidation = (value) => {
    let error = {};
    const validPincode = new RegExp('^[0-9]{6}$');
    if (!value) {
        error["error"] = "Please enter your pincode."
    } else if (!validPincode.test(value)) {
        error["error"] = "Invalid Pincode"
    }
    return error;
}

const checkDateValidation = (value) => {
    let error = {};
    if (!value) {
        error["error"] = "Date must be filled."
        return error;
    }
    var varDate = new Date(value);
    var today = new Date();
    if (varDate >= today) {
        error["error"] = "Date Can't be a future Date."
    }
    return error;
}

const checkRoleValidation = (value) => {
    let error = {};
    if (!value) {
        error["error"] = "Please Select Your Role."
    }
    return error;
}

const isValidURL=(string)=> {
    var res =  /(http|https|www):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
    let error={}
    if(!res .test(string)) {
        error['error']='Please enter a valid Url'
      
      } 


      return error
  };
  
const Validation = {
    isValidURL,
    checkNameValidation,
    checkEmailValidation,
    checkPasswordValidation,
    checkMobNoValidation,
    checkAddrValidation,
    checkNullValidation,
    checkPincodeValidation,
    checkDateValidation,
    checkRoleValidation,
    checkLandNoValidation
}
export default Validation;
