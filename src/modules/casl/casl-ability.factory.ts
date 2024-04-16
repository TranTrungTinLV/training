import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';

export function defineAbility(user: IUserFromRequest) {
  const { can, cannot, rules } = new AbilityBuilder(createMongoAbility);
  const permissions = [];

  user.role.map(
    (e) => e.permissions && e.permissions.map((per) => permissions.push(per)),
  );
  for (let i of permissions) {
    i.can
      ? can(
          i.action,
          i.subject,
          i.fields && i.fields,
          i.conditions && i.conditions,
        )
      : cannot(
          i.action,
          i.subject,
          i.fields && i.fields,
          i.conditions && i.conditions,
        );
  }

  return createMongoAbility(rules);
}
