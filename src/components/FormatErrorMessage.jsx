export const FormatErrorMessage = ( erro ) => {
    var message = erro;
    
    if(typeof erro != 'string') {
        for(const key in erro) {
            message = erro[key];
        }
    }

    return message;

}
