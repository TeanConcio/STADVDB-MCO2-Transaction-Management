import { formatEnum } from "./helpers.js";

// Validate Name
export function validateNameField (string, fieldName, errorObject) {

    if (string.length < 2 || string.length > 50) {
        errorObject[fieldName] = "Must be between 2 and 50 characters!";
    } else if (!/^[a-zA-Z\s-']+$/.test(string)) {
        errorObject[fieldName] = "Must only contain letters, spaces, hyphens, and apostrophes!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Long Name
export function validateLongNameField (string, fieldName, errorObject) {

    if (string.length < 2 || string.length > 150) {
        errorObject[fieldName] = "Must be between 2 and 150 characters!";
    } else if (!/^[a-zA-Z\s-']+$/.test(string)) {
        errorObject[fieldName] = "Must only contain letters, spaces, hyphens, and apostrophes!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Email
export function validateEmailField (string, errorObject) {
    
    const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailPattern.test(string) === false) {
        errorObject["email"] = "Must be an email!";
    } else if (string.length > 50) {
        errorObject["email"] = "Email must be less than 50 characters!";
    } else {
        delete errorObject["email"];
    }
}

// Validate Password
export function validatePasswordField (string, errorObject) {

    if (string.length < 8 || string.length > 40) {
        errorObject["password"] = "Password must be between 8 and 40 characters!";
    } else {
        delete errorObject["password"];
    }
}

// Validate Confirm Password
export function validateConfirmPasswordField (string, password, errorObject) {
    
    if (string !== password) {
        errorObject["confirmPassword"] = "Passwords must match!";
    } else {
        delete errorObject["confirmPassword"];
    }
}

// Validate City
export function validateMobileNumberField (number, fieldName, errorObject) {
        
    const mobilePattern = /^09[0-9]{9}$/;

    if (mobilePattern.test(number) === false) {
        errorObject[fieldName] = "Must be a valid Philippine mobile number";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Landline
export function validateLandlineField (string, errorObject) {
        
    const landlinePattern = /^[0-9]{8}$/;

    if (landlinePattern.test(string) === false) {
        errorObject["landline"] = "Must be a valid Philippine landline number";
    } else {
        delete errorObject["landline"];
    }
}

// Validate Birthdate
export function validateBirthdateField (string, errorObject) {
        
    if (Date.parse(string) === NaN) {
        errorObject["birthdate"] = "Must be a valid date";
    }
    // Check if birthdate is in the future
    else if (new Date(string) > new Date()) {
        errorObject["birthdate"] = "Birthdate cannot be in the future";
    }
    else {
        delete errorObject["birthdate"];
    }
}

// Validate 150 String
export function validate150StringField (string, fieldName, errorObject) {

    if (string.length < 2 || string.length > 150) {
        errorObject[fieldName] = "Must be between 2 and 150 characters!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate 30 String
export function validate30StringField (string, fieldName, errorObject) {
    
    if (string.length < 2 || string.length > 30) {
        errorObject[fieldName] = "Must be between 2 and 30 characters!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate 200 String
export function validate200StringField (string, fieldName, errorObject) {
    
    if (string.length < 2 || string.length > 200) {
        errorObject[fieldName] = "Must be between 2 and 200 characters!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Enum
export function validateEnumField (string, fieldName, enumChoices, errorObject) {
    
    if (!enumChoices.includes(string)) {
        enumChoices = enumChoices.map((choice) => formatEnum(choice));
        errorObject[fieldName] = `Must be one of the following: ${enumChoices.join(", ")}`;
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Number
export function validateNumberField (number, fieldName, errorObject) {
        
    if (number < 0 || number > 99) {
        errorObject[fieldName] = "Must be between 0 and 99!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Boolean
export function validateBooleanField (boolean, fieldName, errorObject) {
        
    if (boolean !== true && boolean !== false) {
        errorObject[fieldName] = "Must be true or false!";
    } else {
        delete errorObject[fieldName];
    }
}

// Validate Text Area
export function validateTextAreaField (string, fieldName, errorObject) {
    
    if (string.length < 1) {
        errorObject[fieldName] = "Field is required!";
    } else {
        delete errorObject[fieldName];
    }
}
