const domainRegex = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i;

module.exports = {
    VERSION:'1.2.0',
    SHARD_STRATEGY_CRC:'crc',
    SHARD_STRATEGY_CYCLE:'cycle',
    DOMAIN_REGEX: domainRegex,
}