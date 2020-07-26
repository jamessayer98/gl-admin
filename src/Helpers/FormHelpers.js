export const getFieldError = (fieldName, touched, errors) => {
    let errorMsg = ''
    let wasTouched = false  
    if (fieldName.includes('.')) {
        const props = fieldName.split('.')
        wasTouched = touched[props[0]] ? touched[props[0]][props[1]] : wasTouched
        errorMsg = errors[props[0]] ? errors[props[0]][props[1]] : errorMsg
    }
    else {
        wasTouched = touched[fieldName]
        errorMsg = errors[fieldName]
    }
    return { "wasTouched": wasTouched, "errorMsg": errorMsg }
}