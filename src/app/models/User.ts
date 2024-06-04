export class User{
    id: string | undefined;
    email: string;
    password: string;
    username: string;
    firstname: string;
    lastname: string;

    constructor(email: string, password: string, username: string, firstname: string, lastname: string){
        this.email = email;
        this.password = password;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}