pragma solidity 0.4.23;

import "./AllowanceRegistryInterface.sol";
import "./RestrictedTransferToken.sol";
import "./EIP223.sol";


contract RestrictedTransferEIP223Token is RestrictedTransferToken, EIP223 {

    constructor(AllowanceRegistryInterface _registry)
        public
        RestrictedTransferToken(_registry) 
    {}
    
    function transfer(address _to, uint256 _value)
        public 
        isTransferAllowed(msg.sender, _to, _value) 
        returns (bool success) 
    {
        return super.transfer(_to, _value);
    }

    function transfer(address _to, uint _value, bytes _data)
        public
        isTransferAllowed(msg.sender, _to, _value) 
        returns (bool success)
    {
        return super.transfer(_to, _value, _data);
    }

}
