import { ConflowUtils } from "src/app/shared/utils/conflow-utils";

export class User {
    /**
     * The email of the user, we need to change the API
     */
    public email: string;

    /**
     * The username of the user
     */
    public username?: string;

    /**
     * The nickname of the user
     */
    public nickname: string;

    /**
     * The password of the user, will only be sent never received!
     */
    public password?: string;

    /**
     * The firstname of the user
     */
    public firstname?: string;

    /**
     * The lastname of the user
     */
    public lastname?: string;

    /**
     * Profile picture URL
     */
    public picture?: string;

    /**
     *  ID of the user
     */
    public id: string;

    /**
     * Tenant ID of the user
     */
    public tenantId?: string;


    /**
     * Username of the user
     */
    public userName?: string;

    /**
     * avatar of the user
     */
    public avatar?: string;

    /**
     * mood of the user
     */
    public mood?: string;

    /**
     * Status of the user
     */
    public status?: string;
    /**
     * Constructor
     */
    constructor(user) {
        {
            this.email = user.email || '';
            this.username = user.username || '';
            this.nickname = user.nickname || '';
            this.firstname = user.name || '';
            this.lastname = user.lastname || '';
            this.picture = user.picture || 'assets/images/avatars/profile.jpg';
            this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
            this.status = user.status || '';
            this.mood = user.mood || '';
            this.id = user.id || ConflowUtils.generateGUID();
            this.userName = user.userName || '';
            this.tenantId = user.tenantId || ConflowUtils.generateGUID();
        }
    }
}