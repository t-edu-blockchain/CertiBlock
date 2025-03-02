const { invokeChaincode } = require("../services/fabric/chaincode");

const load = async () => {
    let enrollment = require("../services/fabric/enrollment");
    await enrollment.enrollAdmin();
    return await invokeChaincode("InitLedger", [], false, "admin");
};

module.exports = {
    loaderPromise: load(),
}
