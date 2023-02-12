const date2time = (date:Date):string => {
  return `${date.getHours()}:${`0${date.getMinutes()}`.slice(-2)}`;
}
export {date2time};