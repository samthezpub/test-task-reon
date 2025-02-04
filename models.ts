import {User} from "@prisma/client";

interface Project {
    name: string;
    description: string;
    creator: User,

}