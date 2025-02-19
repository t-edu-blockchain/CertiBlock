const { invokeChaincode } = require("../services/fabric/chaincode");
let enrollment = require("../services/fabric/enrollment");

enrollment.enrollAdmin();

invokeChaincode("InitLedger", [], false, "admin");
