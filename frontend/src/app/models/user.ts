export class User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
  ID?: string;
  permissions?: any;
  password?: string;
  enabled?: boolean;
  expired?: boolean;
  locked?: boolean;
  image_base64?: string;
  image?: string;
  app_commission?: number;
  inviter_commission?: number;

  loadDefaults() {
    this.enabled = true;
    this.expired = false;
    this.locked = false;
    this.app_commission = 0;
    this.inviter_commission = 0;
  }
}
