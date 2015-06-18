module.exports = {
  adapters: {
    mutationSummary: require('./adapter-mutationSummary')
  }
, Move: require('./ops/move')
, Manipulate: require('./ops/manipulate')
, ManipulateText: require('./ops/manipulate-text')
}
