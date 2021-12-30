function formatDate(time, format = 'YYYY-MM-DD hh:mm:ss') {
  const date = new Date(time)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()

  const add0 = (str) => str < 10 ? '0' + str : str

  return format
    .replace(/Y+Y/g, year)
    .replace(/MM/g, add0(month))
    .replace(/DD/g, add0(day))
    .replace(/hh/g, add0(hour))
    .replace(/mm/g, add0(min))
    .replace(/ss/g, add0(sec))
}

formatDate(new Date('2021/2/4 10:00:00').getTime()) // '2021-02-04 10:00:00'
formatDate('2021/2/4 10:00:00', 'YYYY*MM*DD hh:mm:ss') // '2021*02*04 10:00:00'
formatDate(new Date('2021/2/4 9:00')) // '2021-02-04 09:00:00'
formatDate('2/4 10:00:00', 'MM-DD hh:mm:ss') // '02-04 10:00:00'
formatDate('2/4', 'MM-DD') // '02-04'