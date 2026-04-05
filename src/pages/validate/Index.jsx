
export default class Validate {

    #erros = [];

    validateEmail (email)
    {   

        if(email == "") {
            this.setError("Email é obrigatório");
            return
        }

        let check = String(email)
        .toLowerCase()
        .match(
        /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/
        );

        if(!check) {
            this.setError("Email não é válido");
            return
        }

    }

    ValidatePassword (password) {
        if(password == "") {
            this.setError("Senha é obrigatória");
            return
        }

    }

    setError(message)
    {
        this.#erros.push(message)
    }

    hasErros()
    {
        return Object.keys(this.#erros).length > 0;
    }

    getErrors()
    {
        return this.#erros;
    }

}

