type PrivacyPolicyListProps = {
  item: {
    name: string
    details?: string
    optOut?: string
    optOutHref?: string
    company?: string
    more?: string
  }
}

const PrivacyPolicyList = ({ item }: PrivacyPolicyListProps) => {
  return (
    <li>
      <p>
        <strong>{item.name}</strong>
      </p>
      {item.details && <p>{item.details}</p>}

      {item.optOut && (
        <p v-if="item.optOut">
          {item.optOut} {item.optOutHref && <a href={item.optOutHref}>{item.optOutHref}</a>}
        </p>
      )}
      <p>
        For more information on the privacy practices and data collection of {item.company}, please
        visit the {item.company} Privacy & Terms web page: <a href={item.more}>{item.more}</a>
      </p>
    </li>
  )
}

export default PrivacyPolicyList
