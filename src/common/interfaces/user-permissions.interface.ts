interface IConditions {
  name?: string;
  mode?: string;
}

interface IUserPermissions {
  _id: string;
  name: string;
  can: boolean;
  action: string;
  subject: string;
  conditions?: IConditions;
}
