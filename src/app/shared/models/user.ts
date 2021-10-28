export interface User{
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    registeredAt: string,
    isAdmin: boolean
}

export class AppUser implements User {

    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    isAdmin: boolean;
     
    constructor(_userId,_firstname,_lastname,_email,_registeredAt,_isAdmin) {
        this.userId = _userId;
        this.firstName = _firstname;
        this.lastName = _lastname;
        this.email = _email;
        this.registeredAt = _registeredAt;
        this.isAdmin = _isAdmin;
    }
    
}