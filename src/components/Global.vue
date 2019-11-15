<script>
// ws://fd.nanhuacapital.com/fdwsquote;
// ws://fd.biz.nanhuacapital.com/fdwsquote;
// const optionsQuoteServerMarket = 'ws://fd.nanhuacapital.com/fdwsquote'
// const optionsQuoteServer = 'ws://fd.nanhuacapital.com/fdwsotccfg'

// const optionsQuoteServerMarket = "wss://biz.nanhuacapital.com/fdwsquote"
// const optionsQuoteServer = 'wss://biz.nanhuacapital.com/fdwsotccfg'

// underlyingMarketDataServe

const optionsQuoteServerMarket = "wss://biz.nanhuacapital.com/fdwsquote_t"
const optionsQuoteServer = 'wss://biz.nanhuacapital.com/fdwsotccfg_t'
const underlyingMarketDataServe = "wss://www.nanhuacapital.com/fdwsquote"
const baseURL = 'https://biz.nanhuacapital.com/t_xqk/'
// const baseURL = 'http://localhost:8080/'
const generate_rid = function (){
  let buffer = new ArrayBuffer(16)
  let intView = new Uint32Array(buffer)
  intView[0] = Math.random() * 1000000000000000
  intView[1] = Math.random() * 1000000000000000
  intView[2] = Math.random() * 1000000000000000
  intView[3] = Math.random() * 1000000000000000
  let binStr = String.fromCharCode.apply(null, new Uint8Array(buffer))
  let base64T = btoa(binStr)
  return base64T
}
const changeList = function(list){
  let arr = []
  if(!list.length) {return '{}'}
  list.forEach(item => {
    let {exchange, underlying} = item
    arr.push(`{"market":"${exchange}","code":"${underlying}"}`)
  })
  return arr
}
const changeLists = function(list){
  let arr = []
  if(!list.length) {return '{}'}
  list.forEach(item => {
    let {exchange, instrument} = item
    arr.push(`{"market":"${exchange}","code":"${instrument}"}`)
  })
  return arr
}

export default
{
  optionsQuoteServerMarket,
  optionsQuoteServer,
  underlyingMarketDataServe,
  baseURL,
  generate_rid,
  changeList,
  changeLists,
}
</script>
