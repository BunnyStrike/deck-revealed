const wikigameinfo = jest.requireActual('../wikiGameInfo')

wikigameinfo.getWikiGameInfo = jest.fn()

module.exports = wikigameinfo
export {}
