import * as React from 'react'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

interface FormattedDateProps {
  date: Date | string
  className?: string
}

export function FormattedDate({ date, ...props }: FormattedDateProps) {
  date = typeof date === 'string' ? new Date(date) : date

  return (
    <time dateTime={date.toISOString()} {...props}>
      {dateFormatter.format(date)}
    </time>
  )
}
