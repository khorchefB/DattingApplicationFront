import { User } from "./User";

export class UserParams {
    gender: string;
    minAge: number = 18;
    maxAge: number = 99;
    pageNumber: number = 1;
    pageSize: number = 5;
    orderBy = 'lastAvtive';
    
    /**
     *
     */
    constructor(user: User) {
        this.gender = user.gender === "female" ? "male" : "female";
    }
}
