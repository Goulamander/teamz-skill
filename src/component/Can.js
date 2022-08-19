import { AccessControl } from 'role-acl'

import rules from '../rbac-roles'

const ac = new AccessControl(rules)

const Can = props => {
  const permission = ac.can(props.role).context(props.context).execute(props.action).sync().on(props.resource)
  return (
    permission.granted
    ? props.yes(permission.attributes)
    : props.no()
  )
}
    

Can.defaultProps = {
  yes: () => null,
  no: () => null
};

export default Can;